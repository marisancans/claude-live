/**
 * AgentDemoApp — standalone Three.js app for previewing agent node visualizations.
 * No event system, no sessions. Each variation is a self-contained 3D agent entity.
 */
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { BackgroundLayer } from '../layers/BackgroundLayer'
import type { AgentVariation, AgentVisual } from './variations/agent'

export class AgentDemoApp {
  private renderer: THREE.WebGLRenderer
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private controls: OrbitControls
  private composer: EffectComposer
  private background: BackgroundLayer
  private clock = new THREE.Clock()
  private elapsed = 0

  private agentGroup = new THREE.Group()
  private currentVisual: AgentVisual | null = null
  private currentVariation: AgentVariation | null = null

  // Wandering & Tether Mechanics
  private agentTetherLine: THREE.Line | null = null
  private wanderOffsets = new THREE.Vector3(Math.random() * 100, Math.random() * 100, Math.random() * 100)

  // Auto-pulse timer
  private pulseTimer = 0
  private pulseInterval = 2.0
  private resizeObserver: ResizeObserver

  constructor(container: HTMLElement) {
    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(container.clientWidth, container.clientHeight)
    this.renderer.setClearColor(0x030308)
    container.appendChild(this.renderer.domElement)

    // Scene & camera
    this.scene = new THREE.Scene()
    const w = Math.max(1, container.clientWidth)
    const h = Math.max(1, container.clientHeight)
    this.camera = new THREE.PerspectiveCamera(55, w / h, 1, 2000)
    // We position the camera higher and further to see the tether extending from 0,0,0
    this.camera.position.set(0, 30, 110)

    // Orbit controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.06
    this.controls.autoRotate = true
    this.controls.autoRotateSpeed = 0.5
    this.controls.target.set(0, 15, 0)
    this.controls.minDistance = 20
    this.controls.maxDistance = 300

    // Background
    this.background = new BackgroundLayer()
    this.scene.add(this.background.group)

    // Create a mock Session Core sphere to show what it is tethered to
    const coreGeo = new THREE.SphereGeometry(3, 16, 16)
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x4488ff, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending })
    const coreMesh = new THREE.Mesh(coreGeo, coreMat)
    this.scene.add(coreMesh) // at 0,0,0

    // Agent group
    this.scene.add(this.agentGroup)

    // Composer + bloom
    this.composer = new EffectComposer(this.renderer)
    this.composer.addPass(new RenderPass(this.scene, this.camera))
    const bloom = new UnrealBloomPass(
      new THREE.Vector2(container.clientWidth, container.clientHeight),
      1.2, 0.4, 0.15, // strong glow to ensure additive elements are bright
    )
    this.composer.addPass(bloom)

    // Force initial matrix computation
    this.scene.updateMatrixWorld(true)

    // Resize
    this.resizeObserver = new ResizeObserver(this._onResize)
    this.resizeObserver.observe(container)
    window.addEventListener('resize', this._onResize)
    this._onResize()
  }

  setVariation(variation: AgentVariation) {
    this.currentVariation = variation
    this._clearVisual()
    this.currentVisual = variation.build(this.agentGroup)
    // Create simple tether if missing
    if (!this.agentTetherLine) {
      const geo = new THREE.BufferGeometry().setFromPoints(new Array(21).fill(new THREE.Vector3()))
      const mat = new THREE.LineBasicMaterial({
        color: 0x44aaff, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending
      })
      this.agentTetherLine = new THREE.Line(geo, mat)
      this.scene.add(this.agentTetherLine)
    }

    this.pulseTimer = 0
  }

  triggerPulse() {
    this.currentVisual?.pulse?.()
  }

  private _clearVisual() {
    if (this.currentVisual) {
      this.currentVisual.dispose()
      this.currentVisual = null
    }
  }

  tick() {
    const dt = Math.min(this.clock.getDelta(), 0.05)
    this.elapsed += dt
    this.controls.update()
    this.background.tick(dt)

    if (this.currentVisual) {
      this.currentVisual.tick(dt, this.elapsed)

      // Wandering orbit around the session core
      const speed = 0.25
      this.wanderOffsets.x += dt * speed * 0.8
      this.wanderOffsets.y += dt * speed * 1.1
      this.wanderOffsets.z += dt * speed * 0.9

      const radius = 50
      this.agentGroup.position.set(
        Math.sin(this.wanderOffsets.x) * radius,
        25 + Math.sin(this.wanderOffsets.y) * 15, // Hover above core
        Math.cos(this.wanderOffsets.z) * radius * Math.cos(this.wanderOffsets.x * 0.5)
      )

      // Update simple tether curve
      if (this.agentTetherLine) {
        const start = new THREE.Vector3(0, 0, 0)
        const end = this.agentGroup.position.clone()

        // Control point creates a drooping arc / organic tension cable
        const mid = start.clone().lerp(end, 0.5)
        mid.y -= 10 + Math.sin(this.elapsed * 2) * 4

        const curve = new THREE.QuadraticBezierCurve3(start, mid, end)
        this.agentTetherLine.geometry.setFromPoints(curve.getPoints(20))
      }

      // Auto-pulse removed to disable intense visual flashes per user request.
      this.pulseTimer += dt
      if (this.pulseTimer >= this.pulseInterval) {
        this.pulseTimer = 0
        this.pulseInterval = 1.5 + Math.random() * 3.0
        // this.currentVisual.pulse?.()
      }
    }

    try {
      this.composer.render() // BUG FIX: use composer to ensure bloom pass paints properly!
    } catch {
      // ignore
    }
  }

  private _onResize = () => {
    const container = this.renderer.domElement.parentElement
    if (!container) return
    const w = Math.max(1, container.clientWidth)
    const h = Math.max(1, container.clientHeight)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(w, h)
    this.composer.setSize(w, h)
  }

  destroy() {
    this.resizeObserver.disconnect()
    window.removeEventListener('resize', this._onResize)
    this.renderer.dispose()
    this.renderer.domElement.remove() // FIX: Remove canvas from DOM
    this._clearVisual()
    if (this.agentTetherLine) {
      this.scene.remove(this.agentTetherLine)
      this.agentTetherLine.geometry.dispose()
      ;(this.agentTetherLine.material as THREE.Material).dispose()
    }
  }
}

