import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { BackgroundLayer } from '../layers/BackgroundLayer'
import type { NodeSwarmVariation, SwarmVisual } from './variations/nodeSwarm'

export class NodeSwarmDemoApp {
  private renderer: THREE.WebGLRenderer
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private controls: OrbitControls
  private composer: EffectComposer
  private background: BackgroundLayer
  private clock = new THREE.Clock()
  private elapsed = 0
  private resizeObserver: ResizeObserver

  private swarmGroup = new THREE.Group()
  private currentVisual: SwarmVisual | null = null
  private pulseTimer = 0
  private pulseInterval = 2.8
  private coreActivity = 0

  private coreGroup = new THREE.Group()
  private coreShell: THREE.Mesh
  private coreRing: THREE.Mesh
  private coreRingOuter: THREE.Mesh
  private coreLight: THREE.PointLight

  constructor(container: HTMLElement) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(container.clientWidth, container.clientHeight)
    this.renderer.setClearColor(0x04050b)
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.05
    container.appendChild(this.renderer.domElement)

    this.scene = new THREE.Scene()

    const width = Math.max(1, container.clientWidth)
    const height = Math.max(1, container.clientHeight)
    this.camera = new THREE.PerspectiveCamera(46, width / height, 1, 3000)
    this.camera.position.set(0, 58, 170)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.06
    this.controls.autoRotate = true
    this.controls.autoRotateSpeed = 0.22
    this.controls.target.set(0, 12, 0)
    this.controls.minDistance = 60
    this.controls.maxDistance = 340

    this.background = new BackgroundLayer()
    this.scene.add(this.background.group)

    this.scene.add(new THREE.AmbientLight(0xcad8ff, 1.25))

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.15)
    keyLight.position.set(80, 120, 120)
    this.scene.add(keyLight)

    const fillLight = new THREE.DirectionalLight(0x90c8ff, 0.65)
    fillLight.position.set(-120, 45, -80)
    this.scene.add(fillLight)

    this.coreShell = new THREE.Mesh(
      new THREE.IcosahedronGeometry(7, 1),
      new THREE.MeshPhongMaterial({
        color: new THREE.Color('#0c1224'),
        emissive: new THREE.Color('#5aa7ff').multiplyScalar(0.18),
        shininess: 90,
        specular: new THREE.Color('#ffffff'),
        transparent: true,
        opacity: 0.92,
      })
    )
    this.coreRing = new THREE.Mesh(
      new THREE.TorusGeometry(12, 0.2, 12, 80),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color('#8fd3ff'),
        transparent: true,
        opacity: 0.22,
      })
    )
    this.coreRing.rotation.x = Math.PI * 0.5

    this.coreRingOuter = new THREE.Mesh(
      new THREE.TorusGeometry(17, 0.12, 12, 80),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color('#6c88ff'),
        transparent: true,
        opacity: 0.12,
      })
    )
    this.coreRingOuter.rotation.set(Math.PI * 0.5, 0.25, 0)

    this.coreLight = new THREE.PointLight(0x84c8ff, 18, 260, 2)

    this.coreGroup.add(this.coreShell, this.coreRing, this.coreRingOuter, this.coreLight)
    this.coreGroup.position.set(0, 12, 0)
    this.scene.add(this.coreGroup)
    this.scene.add(this.swarmGroup)

    this.composer = new EffectComposer(this.renderer)
    this.composer.addPass(new RenderPass(this.scene, this.camera))
    this.composer.addPass(
      new UnrealBloomPass(
        new THREE.Vector2(width, height),
        0.42,
        0.22,
        0.42,
      )
    )

    this.scene.updateMatrixWorld(true)

    this.resizeObserver = new ResizeObserver(this.onResize)
    this.resizeObserver.observe(container)
    window.addEventListener('resize', this.onResize)
    this.onResize()
  }

  setVariation(variation: NodeSwarmVariation) {
    this.clearVisual()
    this.currentVisual = variation.build(this.swarmGroup, this.camera)
    this.triggerPulse()
  }

  triggerPulse() {
    this.coreActivity = 1
    this.currentVisual?.pulse?.()
  }

  tick() {
    const dt = Math.min(this.clock.getDelta(), 0.05)
    this.elapsed += dt
    this.pulseTimer += dt
    this.coreActivity = Math.max(0, this.coreActivity - dt * 0.6)

    if (this.pulseTimer >= this.pulseInterval) {
      this.pulseTimer = 0
      this.pulseInterval = 2.4 + Math.random() * 1.6
      this.triggerPulse()
    }

    this.controls.update()
    this.background.tick(dt)
    this.currentVisual?.tick(dt, this.elapsed)
    this.tickCore()

    try {
      this.composer.render()
    } catch {
      // Ignore first-frame composer hiccups.
    }
  }

  private tickCore() {
    const breath = 1 + Math.sin(this.elapsed * 0.7) * 0.03
    const pulse = 1 + this.coreActivity * 0.18

    this.coreShell.rotation.y += 0.0025
    this.coreShell.rotation.x = Math.sin(this.elapsed * 0.18) * 0.08
    this.coreShell.scale.setScalar(breath * pulse)

    this.coreRing.rotation.z += 0.003 + this.coreActivity * 0.008
    this.coreRing.scale.setScalar(1 + this.coreActivity * 0.1)

    this.coreRingOuter.rotation.y -= 0.002
    this.coreRingOuter.rotation.z = Math.sin(this.elapsed * 0.4) * 0.18
    this.coreRingOuter.scale.setScalar(1 + this.coreActivity * 0.18)

    ;(this.coreShell.material as THREE.MeshPhongMaterial).emissiveIntensity = 0.18 + this.coreActivity * 0.3
    ;(this.coreRing.material as THREE.MeshBasicMaterial).opacity = 0.18 + this.coreActivity * 0.14
    ;(this.coreRingOuter.material as THREE.MeshBasicMaterial).opacity = 0.1 + this.coreActivity * 0.1
    this.coreLight.intensity = 16 + this.coreActivity * 12 + Math.sin(this.elapsed * 0.6) * 2
  }

  private clearVisual() {
    if (!this.currentVisual) return
    this.currentVisual.dispose()
    this.currentVisual = null
  }

  private onResize = () => {
    const container = this.renderer.domElement.parentElement
    if (!container) return

    const width = Math.max(1, container.clientWidth)
    const height = Math.max(1, container.clientHeight)
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height)
    this.composer.setSize(width, height)
  }

  destroy() {
    this.resizeObserver.disconnect()
    window.removeEventListener('resize', this.onResize)
    this.clearVisual()
    this.background.dispose()
    this.controls.dispose()
    this.renderer.dispose()
    this.renderer.domElement.remove()

    this.coreShell.geometry.dispose()
    ;(this.coreShell.material as THREE.Material).dispose()
    this.coreRing.geometry.dispose()
    ;(this.coreRing.material as THREE.Material).dispose()
    this.coreRingOuter.geometry.dispose()
    ;(this.coreRingOuter.material as THREE.Material).dispose()
  }
}
