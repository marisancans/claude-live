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
import { FileNodeWeb } from './objects/FileNodeWeb'
import { eventBus } from '../events/EventBus'
import { TOOL_COLOR_HEX, DEFAULT_HEX } from '../constants'
import { profileGlob } from './travel/profiles/glob'

interface SessionVisual {
  group: THREE.Group
  core: SessionCore
  particles: ParticleCloud
  web: FileNodeWeb
  /** Stable 3D positions for file paths — same file → same point in space */
  filePositions: Map<string, THREE.Vector3>
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
    this.camera.position.set(0, 80, 300)

    // ── OrbitControls ──
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.05
    this.controls.autoRotate = true
    this.controls.autoRotateSpeed = 0.3
    this.controls.minDistance = 50
    this.controls.maxDistance = 800
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

  /**
   * Returns a stable position for a file path within a session.
   * First access creates and caches a random-but-consistent position.
   * All operations on the same file will use the same 3D anchor point.
   */
  private getFilePos(sv: SessionVisual, filePath: string): THREE.Vector3 {
    if (sv.filePositions.has(filePath)) return sv.filePositions.get(filePath)!
    // Stable scatter: bias toward mid-range distances, flattened Y
    const angle = Math.random() * Math.PI * 2
    const elevation = (Math.random() - 0.5) * 0.3
    const r = 40 + Math.pow(Math.random(), 0.6) * 120
    const pos = new THREE.Vector3(
      Math.cos(angle) * r,
      elevation * r * 0.25,
      Math.sin(angle) * r,
    )
    sv.filePositions.set(filePath, pos)
    sv.web.register(filePath, pos)
    return pos
  }

  private setupEventListeners() {
    const onToolUsed = (e: { sessionId: string; tool: string; colorHex: string; nodeKey?: string; toolInput?: Record<string, unknown> | null; toolResponse?: Record<string, unknown> | null }) => {
      const sv = this.sessions.get(e.sessionId)
      if (!sv) return
      sv.core.triggerActivity()

      // Resolve file anchor for file-targeting tools
      const filePath = e.toolInput?.file_path as string | undefined
      const filePos = filePath ? this.getFilePos(sv, filePath) : undefined
      if (filePath) sv.web.hit(filePath)
      if (['Read','Edit','Write','Grep'].includes(e.tool)) {
        console.log('[ThreeApp] file-tool', e.tool, '| file_path=', filePath, '| toolInput keys=', e.toolInput ? Object.keys(e.toolInput) : 'null')
      }

      if (e.tool === 'Bash') {
        sv.particles.spawn('Bash', e.colorHex, undefined, e.toolInput, e.toolResponse)
      } else if (e.tool === 'Glob') {
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
        sv.particles.spawn(e.tool, e.colorHex, filePos, e.toolInput, e.toolResponse, filePath)
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
      sv.particles.spawnBurst('response', 8)
    }

    const onCompactPre = (e: { sessionId: string }) => {
      const sv = this.sessions.get(e.sessionId)
      if (!sv) return
      sv.core.triggerActivity()
      sv.particles.spawnBurst('compact:pre', 6)
    }

    const onCompactPost = (e: { sessionId: string }) => {
      const sv = this.sessions.get(e.sessionId)
      if (!sv) return
      sv.core.triggerActivity()
      sv.particles.spawnBurst('compact:post', 10)
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

        const web = new FileNodeWeb(group)
        particles.onSettle = (_pos, _color, filePath) => {
          if (filePath) web.addStar(filePath)
        }
        this.scene.add(group)
        this.sessions.set(id, { group, core, particles, web, filePositions: new Map() })

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
        sv.web.dispose()
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
        // Cap at 250, sample evenly if too many
        const toSpawn = Math.min(events.length, 250)
        const step = events.length / toSpawn
        for (let i = 0; i < toSpawn; i++) {
          const evt = events[Math.floor(i * step)]
          const tool = evt.tool_name || evt.hook_event_name || 'Read'
          const colorHex = TOOL_COLOR_HEX[tool] || DEFAULT_HEX
          const color = new THREE.Color(colorHex)
          // Place a settled star directly — no travel animation for history
          const angle = Math.random() * Math.PI * 2
          const r = 20 + Math.random() * 120
          const pos = new THREE.Vector3(Math.cos(angle) * r, (Math.random() - 0.5) * 20, Math.sin(angle) * r)
          particles.addHistoryStar(pos, color)
        }
        console.log(`[Three] Session ${sessionId.slice(0, 8)}: ${toSpawn} history stars from ${events.length} events`)
      })
      .catch(() => {})
  }

  tick(dt: number) {
    const clampedDt = Math.min(dt, 0.05)
    this.elapsed += clampedDt

    this.syncSessions(this.clustersRef.current)
    this.bgLayer.tick(clampedDt)
    this.controls.update()

    for (const sv of this.sessions.values()) {
      sv.core.tick(clampedDt, this.elapsed)
      sv.particles.tick(clampedDt)
      sv.web.tick(clampedDt)
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
