/**
 * Main Three.js application.
 * Single 3D scene — background (stars, aurora) and world (sessions, particles)
 * live together. Camera rotation gives natural parallax.
 * EffectComposer with UnrealBloomPass for glow.
 */
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import type { MutableRefObject } from 'react'
import type { Cluster } from '../types'
import { BackgroundLayer } from './layers/BackgroundLayer'
import { SessionCore } from './objects/SessionCore'
import { ParticleCloud } from './objects/ParticleCloud'
import { eventBus } from '../events/EventBus'
import { TOOL_COLOR_HEX, DEFAULT_HEX } from '../constants'
import { profileGlob } from './travel/profiles/glob'

interface SessionVisual {
  group: THREE.Group
  core: SessionCore
  particles: ParticleCloud
}

export class ThreeApp {
  renderer: THREE.WebGLRenderer
  container: HTMLElement
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private controls: OrbitControls
  private composer: EffectComposer
  private bgLayer: BackgroundLayer
  private sessions: Map<string, SessionVisual> = new Map()
  private clustersRef: MutableRefObject<Map<string, Cluster>>
  private elapsed = 0
  private eventUnsubs: (() => void)[] = []
  private _autofit = true
  private _autoRotate = true

  constructor(container: HTMLElement, clustersRef: MutableRefObject<Map<string, Cluster>>) {
    this.container = container
    this.clustersRef = clustersRef
    const W = window.innerWidth, H = window.innerHeight

    // ── Renderer ──
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    this.renderer.setSize(W, H)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setClearColor(0x000000)
    this.renderer.sortObjects = true
    container.appendChild(this.renderer.domElement)

    // ── Single scene — everything lives here ──
    this.scene = new THREE.Scene()
    // No fog — it dims additive particles as camera rotates, which looks wrong

    // ── Camera ──
    this.camera = new THREE.PerspectiveCamera(60, W / H, 1, 5000)
    this.camera.position.set(0, 80, 250)

    // ── OrbitControls ──
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.05
    this.controls.autoRotate = true
    this.controls.autoRotateSpeed = 0.3
    this.controls.minDistance = 50
    this.controls.maxDistance = 600
    this.controls.target.set(0, 0, 0)

    // ── Background (stars + aurora in 3D) ──
    this.bgLayer = new BackgroundLayer()
    this.scene.add(this.bgLayer.group)

    // ── Post-processing ──
    this.composer = new EffectComposer(this.renderer)

    const renderPass = new RenderPass(this.scene, this.camera)
    this.composer.addPass(renderPass)

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(W / 2, H / 2),
      1.2,  // strength — strong glow, Jarvis style
      0.4,  // radius — tight bloom
      0.15  // threshold — everything glows
    )
    this.composer.addPass(bloomPass)

    // Force initial matrix computation so first render doesn't fail
    this.scene.updateMatrixWorld(true)

    // ── Resize ──
    window.addEventListener('resize', this.onResize)

    // ── EventBus subscriptions ──
    this.setupEventListeners()
  }

  private setupEventListeners() {
    const onToolUsed = (e: { sessionId: string; tool: string; colorHex: string; nodeKey?: string; toolInput?: Record<string, unknown> | null; toolResponse?: Record<string, unknown> | null }) => {
      const sv = this.sessions.get(e.sessionId)
      if (!sv) return
      sv.core.triggerActivity()

      if (e.tool === 'Glob') {
        const responseText = typeof e.toolResponse?.content === 'string'
          ? (e.toolResponse.content as string) : ''
        const resultCount = responseText
          .split('\n')
          .filter((l: string) => {
            const t = l.trim()
            return t.length > 0 && !t.startsWith('Found') && !t.startsWith('No files') && !t.startsWith('Error')
          }).length
        const params = profileGlob(resultCount)
        sv.particles.spawnRaw(params)
      } else {
        sv.particles.spawn(e.tool, e.colorHex, undefined, e.toolInput, e.toolResponse)
      }
    }

    const onPrompt = (e: { sessionId: string; words: string[] }) => {
      const sv = this.sessions.get(e.sessionId)
      if (!sv) return
      sv.core.triggerActivity()
      sv.particles.spawn('prompt', '#b0c8f0')
    }

    const onResponse = (e: { sessionId: string; words: string[] }) => {
      const sv = this.sessions.get(e.sessionId)
      if (!sv) return
      sv.core.triggerActivity()
      sv.particles.spawn('response', '#aad4ff')
    }

    const onCompactPre = (e: { sessionId: string }) => {
      const sv = this.sessions.get(e.sessionId)
      if (!sv) return
      sv.core.triggerActivity()
      sv.particles.spawn('compact:pre', '#FFD060')
    }

    const onCompactPost = (e: { sessionId: string }) => {
      const sv = this.sessions.get(e.sessionId)
      if (!sv) return
      sv.core.triggerActivity()
      sv.particles.spawn('compact:post', '#FFE080')
    }

    const onSessionEnd = (e: { sessionId: string }) => {
      const sv = this.sessions.get(e.sessionId)
      if (!sv) return
      sv.particles.spawn('Stop')
    }

    eventBus.on('tool:used', onToolUsed)
    eventBus.on('prompt:submitted', onPrompt)
    eventBus.on('response:received', onResponse)
    eventBus.on('compact:pre', onCompactPre)
    eventBus.on('compact:post', onCompactPost)
    eventBus.on('session:end', onSessionEnd)

    this.eventUnsubs.push(
      () => eventBus.off('tool:used', onToolUsed),
      () => eventBus.off('prompt:submitted', onPrompt),
      () => eventBus.off('response:received', onResponse),
      () => eventBus.off('compact:pre', onCompactPre),
      () => eventBus.off('compact:post', onCompactPost),
      () => eventBus.off('session:end', onSessionEnd),
    )
  }

  private syncSessions(clusters: Map<string, Cluster>) {
    for (const [id, cluster] of clusters) {
      if (!this.sessions.has(id)) {
        const model = (cluster as any).model || 'unknown'
        const group = new THREE.Group()
        const core = new SessionCore(model)
        const particles = new ParticleCloud()

        group.add(core.group)
        group.add(particles.group)

        // Position multiple sessions apart in 3D space
        const idx = this.sessions.size
        const angle = (idx / Math.max(1, clusters.size)) * Math.PI * 2
        const spread = clusters.size > 1 ? 150 : 0
        group.position.set(
          Math.cos(angle) * spread,
          rand(-20, 20), // slight vertical offset
          Math.sin(angle) * spread
        )

        this.scene.add(group)
        this.sessions.set(id, { group, core, particles })

        // Load history for this session
        this.loadSessionHistory(id, particles)
      } else {
        const sv = this.sessions.get(id)!
        if ((cluster as any).model) sv.core.setModel((cluster as any).model)
      }
    }

    for (const [id, sv] of this.sessions) {
      if (!clusters.has(id)) {
        this.scene.remove(sv.group)
        sv.core.dispose()
        sv.particles.dispose()
        this.sessions.delete(id)
      }
    }
  }

  /**
   * Fetch history for a specific session and spawn particles.
   * Called when a new session appears in syncSessions.
   */
  private loadSessionHistory(sessionId: string, particles: ParticleCloud) {
    fetch(`/api/history?session=${encodeURIComponent(sessionId)}`)
      .then(r => r.json())
      .then((events: any[]) => {
        if (events.length === 0) return
        // Cap at 120, sample evenly if too many
        const toSpawn = Math.min(events.length, 120)
        const step = events.length / toSpawn

        // Stagger spawn over multiple frames to avoid frame drops
        let spawnedSoFar = 0
        const batchSize = 15 // spawn 15 per frame
        const spawnBatch = () => {
          const endIdx = Math.min(spawnedSoFar + batchSize, toSpawn)
          for (let i = spawnedSoFar; i < endIdx; i++) {
            const evt = events[Math.floor(i * step)]
            const tool = evt.tool_name || evt.hook_event_name || 'Read'
            const colorHex = TOOL_COLOR_HEX[tool] || DEFAULT_HEX
            const color = new THREE.Color(colorHex)
            // Place a settled star directly — no travel animation for history
            // Independent axes with power-law bias so density clumps near center, not a shell
            const rx = (Math.random() - 0.5) * 2 * (20 + Math.pow(Math.random(), 1.8) * 120) * (0.4 + Math.random() * 2.1)
            const ry = (Math.random() - 0.5) * 2 * (20 + Math.pow(Math.random(), 1.8) * 120) * (0.1 + Math.random() * 0.4)
            const rz = (Math.random() - 0.5) * 2 * (20 + Math.pow(Math.random(), 1.8) * 120) * (0.4 + Math.random() * 2.1)
            const pos = new THREE.Vector3(rx, ry, rz)
            particles.addHistoryStar(pos, color)
          }
          spawnedSoFar = endIdx
          if (spawnedSoFar < toSpawn) {
            requestAnimationFrame(spawnBatch)
          } else {
            console.log(`[Three] Session ${sessionId.slice(0, 8)}: ${toSpawn} history stars from ${events.length} events (staggered)`)
          }
        }
        spawnBatch()
      })
      .catch(() => {})
  }

  setAutofit(enabled: boolean) {
    this._autofit = enabled
  }

  setAutoRotate(enabled: boolean) {
    this._autoRotate = enabled
    this.controls.autoRotate = enabled
  }

  private _fitCamera() {
    if (this.sessions.size === 0) return

    // Compute bounding sphere across all session group positions + particle scatter radius
    let minX = Infinity, maxX = -Infinity
    let minY = Infinity, maxY = -Infinity
    let minZ = Infinity, maxZ = -Infinity

    for (const [sessionId, sv] of this.sessions) {
      const cluster = this.clustersRef.current.get(sessionId)
      if (cluster?.stopping) continue // Skip clusters that are dissolving
      const p = sv.group.position
      const r = 140 // approximate scatter radius
      minX = Math.min(minX, p.x - r); maxX = Math.max(maxX, p.x + r)
      minY = Math.min(minY, p.y - r); maxY = Math.max(maxY, p.y + r)
      minZ = Math.min(minZ, p.z - r); maxZ = Math.max(maxZ, p.z + r)
    }

    const cx = (minX + maxX) / 2
    const cy = (minY + maxY) / 2
    const cz = (minZ + maxZ) / 2
    const size = Math.max(maxX - minX, maxY - minY, maxZ - minZ)
    const fov = this.camera.fov * (Math.PI / 180)
    const dist = Math.max(Math.min((size / 2) / Math.tan(fov / 2) * 1.1, 400), 100)

    // Smoothly lerp target and camera distance
    this.controls.target.lerp(new THREE.Vector3(cx, cy, cz), 0.02)
    const camDir = this.camera.position.clone().sub(this.controls.target).normalize()
    const desiredPos = this.controls.target.clone().addScaledVector(camDir, dist)
    this.camera.position.lerp(desiredPos, 0.02)
  }

  tick(dt: number) {
    const clampedDt = Math.min(dt, 0.05)
    this.elapsed += clampedDt

    this.syncSessions(this.clustersRef.current)
    this.bgLayer.tick(clampedDt)

    if (this._autofit) this._fitCamera()

    this.controls.update()

    for (const sv of this.sessions.values()) {
      sv.core.tick(clampedDt, this.elapsed)
      sv.particles.tick(clampedDt)
    }

    try {
      this.composer.render()
    } catch {
      // Three.js 0.183 EffectComposer can fail on the very first frame
      // before scene matrices are computed. This self-resolves on frame 2.
    }
  }

  private onResize = () => {
    const w = window.innerWidth, h = window.innerHeight
    this.renderer.setSize(w, h)
    this.composer.setSize(w, h)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
  }

  destroy() {
    window.removeEventListener('resize', this.onResize)
    for (const unsub of this.eventUnsubs) unsub()
    this.eventUnsubs = []
    for (const sv of this.sessions.values()) {
      sv.core.dispose()
      sv.particles.dispose()
    }
    this.sessions.clear()
    this.bgLayer.dispose()
    this.controls.dispose()
    this.renderer.dispose()
    this.container.removeChild(this.renderer.domElement)
  }
}

function rand(min: number, max: number) { return Math.random() * (max - min) + min }
