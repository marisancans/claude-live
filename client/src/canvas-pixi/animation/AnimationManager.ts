import type { Application, Container } from 'pixi.js'
import { eventBus } from '../../events/EventBus'
import type { WorldLayer } from '../layers/WorldLayer'
import { SnakeObject } from '../effects/SnakeObject'
import { CompactionEffect } from '../effects/CompactionEffect'
import { SubagentSpawnEffect } from '../effects/SubagentSpawnEffect'
import { ClusterEntranceEffect } from '../effects/ClusterEntranceEffect'
import { SessionEndEffect } from '../effects/SessionEndEffect'
import { ReadProjectile } from '../effects/projectiles/ReadProjectile'
import { GrepProjectile } from '../effects/projectiles/GrepProjectile'
import { GlobProjectile } from '../effects/projectiles/GlobProjectile'
import { EditProjectile } from '../effects/projectiles/EditProjectile'
import { WriteProjectile } from '../effects/projectiles/WriteProjectile'
import { BashProjectile } from '../effects/projectiles/BashProjectile'
import { WebFetchProjectile } from '../effects/projectiles/WebFetchProjectile'
import { DefaultProjectile } from '../effects/projectiles/DefaultProjectile'
import type { ProjectileObject } from '../effects/projectiles/ProjectileObject'
import { generateSpline } from '../../utils/spline'

/** Map tool names to impact types for NodeObject.playImpact() */
const TOOL_IMPACT_MAP: Record<string, 'scan' | 'morph' | 'spark' | 'ping' | 'fade' | 'fail'> = {
  Read: 'scan',
  Grep: 'scan',
  Glob: 'scan',
  Edit: 'morph',
  Write: 'morph',
  Bash: 'spark',
  Notification: 'ping',
  Stop: 'fade',
}

/**
 * AnimationManager subscribes to EventBus domain events and creates/destroys animation objects.
 * Single point of responsibility: owns lifecycle of all PixiJS animation objects.
 * Decoupled from store state mutations — only reacts to events.
 */
export class AnimationManager {
  private app: Application
  private worldLayer: WorldLayer
  private projectiles: ProjectileObject[] = []
  private snakes: SnakeObject[] = []
  private compactions: CompactionEffect[] = []
  private miscEffects: { container: any; tick: (dt: number) => void; isDone: () => boolean; destroy: () => void }[] = []
  private impactTimers: ReturnType<typeof setTimeout>[] = []
  private permissionTimers: Map<string, ReturnType<typeof setTimeout>> = new Map()
  private lastResponseSnakeTime: Map<string, number> = new Map()
  private static MAX_SNAKES = 6 // prevent GPU overload

  // Map tool names to projectile constructors
  private projectileMap: Record<string, new (...args: any[]) => ProjectileObject> = {
    Read: ReadProjectile,
    Grep: GrepProjectile,
    Glob: GlobProjectile,
    Edit: EditProjectile,
    Write: WriteProjectile,
    Bash: BashProjectile,
    WebFetch: WebFetchProjectile,
  }

  constructor(app: Application, worldLayer: WorldLayer) {
    this.app = app
    this.worldLayer = worldLayer
    this.setupListeners()
  }

  /**
   * Wire up EventBus listeners.
   */
  private setupListeners() {
    eventBus.on('tool:used', (e) => {
      this.spawnProjectile(e)
    })

    eventBus.on('prompt:submitted', (e) => {
      this.spawnSnake(e)
    })

    eventBus.on('response:received', (e) => {
      // Rate-limit: max 1 response snake per 2s per session
      const now = Date.now()
      const last = this.lastResponseSnakeTime.get(e.sessionId) ?? 0
      if (now - last < 2000) return
      this.lastResponseSnakeTime.set(e.sessionId, now)
      this.spawnSnake({ ...e, isResponse: true })
    })

    eventBus.on('compact:pre', (e) => {
      this.spawnCompaction(e.sessionId, 'implosion')
    })

    eventBus.on('compact:post', (e) => {
      this.spawnCompaction(e.sessionId, 'rebirth')
    })

    eventBus.on('permission:request', (e) => {
      const clusterObj = this.worldLayer.clusterObjects.get(e.sessionId)
      if (clusterObj) {
        clusterObj.setPermission(true)
        // Clear any existing timer for this session
        const existing = this.permissionTimers.get(e.sessionId)
        if (existing) clearTimeout(existing)
        // Auto-clear after 5 seconds
        const timer = setTimeout(() => {
          clusterObj.setPermission(false)
          this.permissionTimers.delete(e.sessionId)
        }, 5000)
        this.permissionTimers.set(e.sessionId, timer)
      }
    })

    eventBus.on('cluster:created', (e) => {
      this.spawnClusterEntrance(e.cluster.sessionId)
    })

    eventBus.on('cluster:removed', (_e) => {
      // Cleanup handled by WorldLayer
    })

    eventBus.on('subagent:start', (e) => {
      this.spawnSubagentEffect(e.sessionId, e.agentId)
    })

    eventBus.on('subagent:stop', (e) => {
      // Agent fade-out is handled by store setting life=0.08
      // Trigger activity pulse on the cluster core
      const clusterObj = this.worldLayer.clusterObjects.get(e.sessionId)
      if (clusterObj) clusterObj.triggerActivity()
    })

    eventBus.on('session:end', (e) => {
      this.spawnSessionEnd(e.sessionId)
    })

    eventBus.on('notification', (e) => {
      // Trigger ping impact on the notification node
      const nodeObj = this.worldLayer.getNodeObject(e.sessionId, e.nodeKey)
      if (nodeObj) {
        nodeObj.playImpact('ping')
        nodeObj.showAction(e.title || 'notification', 0x34d399)
      }
      // Pulse the cluster core
      const clusterObj = this.worldLayer.clusterObjects.get(e.sessionId)
      if (clusterObj) clusterObj.triggerActivity()
    })
  }

  /**
   * Spawn a projectile from tool use event, and schedule an impact on the target node.
   */
  private spawnProjectile(e: { sessionId: string; nodeKey: string; tool: string; colorHex: string; inbound: boolean }) {
    const cluster = this.worldLayer.clusters?.get(e.sessionId)
    if (!cluster) return

    const node = cluster.nodes.get(e.nodeKey)
    if (!node) return

    const clusterObj = this.worldLayer.clusterObjects.get(e.sessionId)
    if (!clusterObj) return

    // Compute node position relative to cluster center (0,0)
    // Use the NodeObject's actual container position (already cluster-local)
    const nodeObj = clusterObj.nodeObjects.get(e.nodeKey) as any
    const nodeLocalX = nodeObj ? nodeObj.container.position.x : Math.cos(node.orbitAngle) * node.orbitRadius
    const nodeLocalY = nodeObj ? nodeObj.container.position.y : Math.sin(node.orbitAngle) * node.orbitRadius
    const corePos = { x: 0, y: 0 }
    const nodePos = { x: nodeLocalX, y: nodeLocalY }

    // Direction depends on tool type:
    // Read/Grep/Glob = inbound (data flows node→core)
    // Edit/Write/Bash = outbound (changes flow core→node)
    const INBOUND_TOOLS = ['Read', 'Grep', 'Glob']
    const inbound = INBOUND_TOOLS.includes(e.tool)
    const startPos = inbound ? nodePos : corePos
    const endPos = inbound ? corePos : nodePos

    const color = parseInt(e.colorHex.replace('#', ''), 16) ?? 0xffffff

    const ProjectileClass = this.projectileMap[e.tool] ?? DefaultProjectile
    const projectile = new ProjectileClass(startPos, endPos, color, inbound)

    // Track live node position so projectile follows orbiting node
    projectile.trackIsStart = inbound // inbound: node is startPos; outbound: node is endPos
    if (nodeObj) {
      projectile.trackTarget = nodeObj.container
    } else {
      // NodeObject doesn't exist yet (created this frame) — set up deferred lookup
      const sessionId = e.sessionId
      const nodeKey = e.nodeKey
      const wl = this.worldLayer
      projectile.trackLookup = {
        sessionId,
        nodeKey,
        resolve: () => {
          const co = wl.clusterObjects.get(sessionId)
          const no = co?.nodeObjects.get(nodeKey)
          return no ? no.container : null
        },
      }
    }

    // Add to CLUSTER container so it moves with the cluster
    clusterObj.container.addChild(projectile.container)
    this.projectiles.push(projectile)

    // Schedule impact on the target node after the projectile completes
    const duration = projectile.duration
    const impactType = TOOL_IMPACT_MAP[e.tool] ?? 'ping'
    const timer = setTimeout(() => {
      const nodeObj = this.worldLayer.getNodeObject(e.sessionId, e.nodeKey)
      if (nodeObj) {
        nodeObj.playImpact(impactType)
        // Use enriched label from store data if available (e.g. "Read 234L", "$ cargo ✓ 1.2s")
        const enriched = nodeObj.data.actionLabel
        nodeObj.showAction(enriched || e.tool, color)
      }
    }, duration * 1000)
    this.impactTimers.push(timer)
  }

  /**
   * Spawn a compaction effect (implosion or rebirth) on a cluster.
   */
  private spawnCompaction(sessionId: string, phase: 'implosion' | 'rebirth') {
    const clusterObj = this.worldLayer.clusterObjects.get(sessionId)
    if (!clusterObj) return

    const isChild = clusterObj.data.isChild
    const coreRadius = isChild ? 4.5 : 7

    const effect = new CompactionEffect(phase, coreRadius)
    clusterObj.container.addChild(effect.container)
    this.compactions.push(effect)

    // Trigger cluster activity pulse
    clusterObj.triggerActivity()

    // Screen shake: subtle rumble for implosion, big detonation for rebirth
    if (phase === 'implosion') {
      this.worldLayer.cameraController.shake(isChild ? 3 : 6)
    } else {
      this.worldLayer.cameraController.shake(isChild ? 8 : 15)
    }
  }

  /**
   * Spawn a snake (text animation) from prompt submission or response.
   */
  private spawnSnake(e: { sessionId: string; words: string[]; color: string; isResponse?: boolean }, retries = 3) {
    const cluster = this.worldLayer.clusters?.get(e.sessionId)
    if (!cluster) {
      if (retries > 0) { requestAnimationFrame(() => this.spawnSnake(e, retries - 1)) }
      return
    }

    // Cap active snakes to prevent GPU overload
    if (this.snakes.length >= AnimationManager.MAX_SNAKES) return

    const words = e.words.slice(0, 8)
    if (words.length === 0) return

    const clusterObj = this.worldLayer.clusterObjects.get(e.sessionId)
    if (!clusterObj) {
      if (retries > 0) { requestAnimationFrame(() => this.spawnSnake(e, retries - 1)) }
      return
    }

    // All coordinates relative to cluster center (0,0) since snake lives inside cluster container
    // Use viewport-relative distance so snakes fly in from / out to off-screen
    const screenW = this.app.renderer.width
    const screenH = this.app.renderer.height
    const scale = this.worldLayer.container.scale.x || 1
    // Distance in world-space that guarantees off-screen (diagonal / 2 / scale + margin)
    const viewDiag = Math.sqrt(screenW * screenW + screenH * screenH) / 2 / scale + 100

    let splinePath
    const angle = Math.random() * Math.PI * 2
    const edgeX = Math.cos(angle) * viewDiag
    const edgeY = Math.sin(angle) * viewDiag

    // Perpendicular offset for dramatic curvature
    const perpAngle = angle + Math.PI / 2
    const curveSign = Math.random() > 0.5 ? 1 : -1
    const curvature = curveSign * (120 + Math.random() * 100)
    const midX = edgeX / 2 + Math.cos(perpAngle) * curvature
    const midY = edgeY / 2 + Math.sin(perpAngle) * curvature

    if (e.isResponse) {
      // Response snake: outbound from center (0,0) to far off-screen
      splinePath = generateSpline(
        { x: 0, y: 0 },
        { x: midX, y: midY },
        { x: edgeX, y: edgeY }
      )
    } else {
      // Prompt snake: inbound from far off-screen to center (0,0)
      splinePath = generateSpline(
        { x: edgeX, y: edgeY },
        { x: midX, y: midY },
        { x: 0, y: 0 }
      )
    }

    const snake = new SnakeObject(splinePath, words, e.color, e.isResponse ?? false)

    // Add to CLUSTER container so it moves with the cluster
    clusterObj.container.addChild(snake.container)
    this.snakes.push(snake)
  }

  /**
   * Spawn a warp-in effect when a new cluster appears.
   */
  private spawnClusterEntrance(sessionId: string) {
    const clusterObj = this.worldLayer.clusterObjects.get(sessionId)
    if (!clusterObj) return
    const isChild = clusterObj.data.isChild
    const effect = new ClusterEntranceEffect(isChild)
    clusterObj.container.addChild(effect.container)
    this.miscEffects.push(effect)
  }

  /**
   * Spawn a flash effect when an agent satellite appears.
   */
  private spawnSubagentEffect(sessionId: string, agentId: string) {
    const clusterObj = this.worldLayer.clusterObjects.get(sessionId)
    if (!clusterObj) return

    const agentKey = `agent:${agentId}`
    const nodeObj = clusterObj.nodeObjects.get(agentKey) as any
    if (!nodeObj) return

    const effect = new SubagentSpawnEffect()
    nodeObj.container.addChild(effect.container)
    this.miscEffects.push(effect)

    // Pulse the cluster core
    clusterObj.triggerActivity()
  }

  /**
   * Spawn a nova collapse effect when a session ends.
   * Attached to the world container at the cluster's world position so it
   * survives the cluster being destroyed from the scene.
   */
  private spawnSessionEnd(sessionId: string) {
    const clusterObj = this.worldLayer.clusterObjects.get(sessionId)
    if (!clusterObj) return

    // Capture world position before the cluster is removed
    const worldX = clusterObj.container.position.x
    const worldY = clusterObj.container.position.y

    const effect = new SessionEndEffect()
    effect.container.position.set(worldX, worldY)
    this.worldLayer.container.addChild(effect.container)
    this.miscEffects.push(effect)

    // Keep camera looking at the explosion site for the effect duration
    this.worldLayer.cameraController.pinPoint(worldX, worldY, 2.5)
  }

  tick(dt: number) {
    // Update all projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const proj = this.projectiles[i]
      proj.syncTarget()
      proj.tick(dt)
      if (proj.isDone()) {
        proj.container.parent?.removeChild(proj.container)
        proj.destroy()
        this.projectiles.splice(i, 1)
      }
    }

    // Update all snakes
    for (let i = this.snakes.length - 1; i >= 0; i--) {
      const snake = this.snakes[i]
      snake.tick(dt)
      if (snake.isDone()) {
        snake.container.parent?.removeChild(snake.container)
        snake.destroy()
        this.snakes.splice(i, 1)
      }
    }

    // Update all compaction effects
    for (let i = this.compactions.length - 1; i >= 0; i--) {
      const fx = this.compactions[i]
      fx.tick(dt)
      if (fx.isDone()) {
        fx.container.parent?.removeChild(fx.container)
        fx.destroy()
        this.compactions.splice(i, 1)
      }
    }

    // Update misc effects (entrance, spawn, dissolution)
    for (let i = this.miscEffects.length - 1; i >= 0; i--) {
      const fx = this.miscEffects[i]
      fx.tick(dt)
      if (fx.isDone()) {
        fx.container.parent?.removeChild(fx.container)
        fx.destroy()
        this.miscEffects.splice(i, 1)
      }
    }
  }

  destroy() {
    eventBus.clear()
    // Clear pending impact timers
    for (const timer of this.impactTimers) {
      clearTimeout(timer)
    }
    this.impactTimers = []
    // Clear permission timers
    for (const timer of this.permissionTimers.values()) {
      clearTimeout(timer)
    }
    this.permissionTimers.clear()
    for (const proj of this.projectiles) {
      proj.container.parent?.removeChild(proj.container)
      proj.destroy()
    }
    for (const snake of this.snakes) {
      snake.container.parent?.removeChild(snake.container)
      snake.destroy()
    }
    for (const fx of this.compactions) {
      fx.container.parent?.removeChild(fx.container)
      fx.destroy()
    }
    for (const fx of this.miscEffects) {
      fx.container.parent?.removeChild(fx.container)
      fx.destroy()
    }
    this.projectiles = []
    this.snakes = []
    this.compactions = []
    this.miscEffects = []
  }
}
