import type { Application, Container } from 'pixi.js'
import { eventBus } from '../../events/EventBus'
import type { WorldLayer } from '../layers/WorldLayer'
import { SnakeObject } from '../objects/SnakeObject'
import { ReadProjectile } from '../objects/projectiles/ReadProjectile'
import { GrepProjectile } from '../objects/projectiles/GrepProjectile'
import { GlobProjectile } from '../objects/projectiles/GlobProjectile'
import { EditProjectile } from '../objects/projectiles/EditProjectile'
import { WriteProjectile } from '../objects/projectiles/WriteProjectile'
import { BashProjectile } from '../objects/projectiles/BashProjectile'
import { WebFetchProjectile } from '../objects/projectiles/WebFetchProjectile'
import { DefaultProjectile } from '../objects/projectiles/DefaultProjectile'
import type { ProjectileObject } from '../objects/projectiles/ProjectileObject'
import { generateSpline } from '../../utils/spline'

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

    eventBus.on('cluster:created', (e) => {
      // Optional: spawn cluster entrance animation
    })

    eventBus.on('cluster:removed', (e) => {
      // Optional: cleanup
    })
  }

  /**
   * Spawn a projectile from tool use event.
   */
  private spawnProjectile(e: { sessionId: string; nodeKey: string; tool: string; colorHex: string; inbound: boolean }) {
    const cluster = this.worldLayer.clusters?.get(e.sessionId)
    if (!cluster) return

    const node = cluster.nodes.get(e.nodeKey)
    if (!node) return

    // Cluster center is startPos, node position is endPos
    const startPos = { x: cluster.centerX, y: cluster.centerY }
    const endPos = { x: node.x, y: node.y }

    // Determine color: use hex if provided, fallback to node color
    const color = parseInt(e.colorHex.replace('#', ''), 16) ?? 0xffffff

    // Get projectile class, default to DefaultProjectile
    const ProjectileClass = this.projectileMap[e.tool] ?? DefaultProjectile
    const projectile = new ProjectileClass(startPos, endPos, color, e.inbound)

    // Add to world layer and track
    this.worldLayer.container.addChild(projectile.container)
    this.projectiles.push(projectile)
  }

  /**
   * Spawn a snake (text animation) from prompt submission.
   */
  private spawnSnake(e: { sessionId: string; words: string[]; color: string }) {
    const cluster = this.worldLayer.clusters?.get(e.sessionId)
    if (!cluster) return

    // Create spline from cluster edge to cluster center
    // Start at top-right, end at center, with curve control point
    const angle = Math.PI / 4 // 45 degrees for top-right
    const dist = 200
    const startX = cluster.centerX + Math.cos(angle) * dist
    const startY = cluster.centerY + Math.sin(angle) * dist
    const controlX = (startX + cluster.centerX) / 2 + 80
    const controlY = (startY + cluster.centerY) / 2

    const splinePath = generateSpline(
      { x: startX, y: startY },
      { x: controlX, y: controlY },
      { x: cluster.centerX, y: cluster.centerY }
    )

    const snake = new SnakeObject(splinePath, e.words, e.color, false)

    // Add to world layer and track
    this.worldLayer.container.addChild(snake.container)
    this.snakes.push(snake)
  }

  tick(dt: number) {
    // Update all projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const proj = this.projectiles[i]
      proj.tick(dt)
      if (proj.isDone()) {
        this.worldLayer.container.removeChild(proj.container)
        proj.destroy()
        this.projectiles.splice(i, 1)
      }
    }

    // Update all snakes
    for (let i = this.snakes.length - 1; i >= 0; i--) {
      const snake = this.snakes[i]
      snake.tick(dt)
      if (snake.isDone()) {
        this.worldLayer.container.removeChild(snake.container)
        snake.destroy()
        this.snakes.splice(i, 1)
      }
    }
  }

  destroy() {
    eventBus.clear()
    for (const proj of this.projectiles) {
      this.worldLayer.container.removeChild(proj.container)
      proj.destroy()
    }
    for (const snake of this.snakes) {
      this.worldLayer.container.removeChild(snake.container)
      snake.destroy()
    }
    this.projectiles = []
    this.snakes = []
  }
}
