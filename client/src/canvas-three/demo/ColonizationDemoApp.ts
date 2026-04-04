import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { BackgroundLayer } from '../layers/BackgroundLayer'
import type { ColonizationVariation, ColonizationVisual } from './variations/colonization'

export class ColonizationDemoApp {
  private renderer: THREE.WebGLRenderer
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private controls: OrbitControls
  private composer: EffectComposer
  private background: BackgroundLayer
  private clock = new THREE.Clock()
  private elapsed = 0
  private resizeObserver: ResizeObserver

  private visualGroup = new THREE.Group()
  private currentVisual: ColonizationVisual | null = null
  private pulseTimer = 0
  private pulseInterval = 2.6
  private coreActivity = 0
  private accent = new THREE.Color('#7ec8ff')

  private coreGroup = new THREE.Group()
  private coreShell: THREE.Mesh
  private coreRing: THREE.Mesh
  private coreOuterRing: THREE.Mesh
  private coreLight: THREE.PointLight

  constructor(container: HTMLElement) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(container.clientWidth, container.clientHeight)
    this.renderer.setClearColor(0x04050b)
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.08
    container.appendChild(this.renderer.domElement)

    this.scene = new THREE.Scene()

    const width = Math.max(1, container.clientWidth)
    const height = Math.max(1, container.clientHeight)
    this.camera = new THREE.PerspectiveCamera(44, width / height, 1, 3000)
    this.camera.position.set(0, 60, 164)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.06
    this.controls.autoRotate = true
    this.controls.autoRotateSpeed = 0.18
    this.controls.target.set(0, 18, 0)
    this.controls.minDistance = 58
    this.controls.maxDistance = 320

    this.background = new BackgroundLayer()
    this.scene.add(this.background.group)
    this.scene.add(new THREE.AmbientLight(0xccd7ff, 1.2))

    const keyLight = new THREE.DirectionalLight(0xffffff, 0.75)
    keyLight.position.set(90, 120, 100)
    this.scene.add(keyLight)

    const fillLight = new THREE.DirectionalLight(0x88b7ff, 0.42)
    fillLight.position.set(-100, 40, -80)
    this.scene.add(fillLight)

    this.coreShell = new THREE.Mesh(
      new THREE.IcosahedronGeometry(6.4, 1),
      new THREE.MeshPhongMaterial({
        color: new THREE.Color('#0b1120'),
        emissive: this.accent.clone().multiplyScalar(0.28),
        emissiveIntensity: 1,
        specular: new THREE.Color('#ffffff'),
        shininess: 90,
        transparent: true,
        opacity: 0.94,
      })
    )

    this.coreRing = new THREE.Mesh(
      new THREE.TorusGeometry(11.5, 0.18, 12, 80),
      new THREE.MeshBasicMaterial({
        color: this.accent,
        transparent: true,
        opacity: 0.24,
      })
    )
    this.coreRing.rotation.x = Math.PI * 0.5

    this.coreOuterRing = new THREE.Mesh(
      new THREE.TorusGeometry(16.5, 0.12, 12, 96),
      new THREE.MeshBasicMaterial({
        color: this.accent.clone().lerp(new THREE.Color('#ffffff'), 0.2),
        transparent: true,
        opacity: 0.12,
      })
    )
    this.coreOuterRing.rotation.set(Math.PI * 0.5, 0.24, 0)

    this.coreLight = new THREE.PointLight(this.accent.getHex(), 18, 260, 2)

    this.coreGroup.add(this.coreShell, this.coreRing, this.coreOuterRing, this.coreLight)
    this.coreGroup.position.set(0, 12, 0)
    this.scene.add(this.coreGroup)
    this.scene.add(this.visualGroup)

    this.composer = new EffectComposer(this.renderer)
    this.composer.addPass(new RenderPass(this.scene, this.camera))
    this.composer.addPass(new UnrealBloomPass(new THREE.Vector2(width, height), 0.48, 0.24, 0.4))

    this.resizeObserver = new ResizeObserver(this.onResize)
    this.resizeObserver.observe(container)
    window.addEventListener('resize', this.onResize)
    this.onResize()
  }

  setVariation(variation: ColonizationVariation) {
    this.clearVisual()
    this.applyAccent(variation.accent)
    this.currentVisual = variation.build(this.visualGroup, this.camera)
    this.triggerPulse()
  }

  triggerPulse() {
    this.coreActivity = 1
    this.currentVisual?.pulse()
  }

  tick() {
    const dt = Math.min(this.clock.getDelta(), 0.05)
    this.elapsed += dt
    this.pulseTimer += dt
    this.coreActivity = Math.max(0, this.coreActivity - dt * 0.62)

    if (this.pulseTimer >= this.pulseInterval) {
      this.pulseTimer = 0
      this.pulseInterval = 2.3 + Math.random() * 1.5
      this.triggerPulse()
    }

    this.controls.update()
    this.background.tick(dt)
    this.currentVisual?.tick(dt, this.elapsed)
    this.tickCore()

    try {
      this.composer.render()
    } catch {
      // EffectComposer can be flaky on the first render.
    }
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
    this.coreOuterRing.geometry.dispose()
    ;(this.coreOuterRing.material as THREE.Material).dispose()
  }

  private applyAccent(accent: string) {
    this.accent.set(accent)
    const shellMaterial = this.coreShell.material as THREE.MeshPhongMaterial
    const ringMaterial = this.coreRing.material as THREE.MeshBasicMaterial
    const outerMaterial = this.coreOuterRing.material as THREE.MeshBasicMaterial

    shellMaterial.emissive.copy(this.accent).multiplyScalar(0.28)
    ringMaterial.color.copy(this.accent)
    outerMaterial.color.copy(this.accent).lerp(new THREE.Color('#ffffff'), 0.2)
    this.coreLight.color.copy(this.accent)
  }

  private tickCore() {
    const breath = 1 + Math.sin(this.elapsed * 0.7) * 0.03
    const pulse = 1 + this.coreActivity * 0.18
    const shellMaterial = this.coreShell.material as THREE.MeshPhongMaterial
    const ringMaterial = this.coreRing.material as THREE.MeshBasicMaterial
    const outerMaterial = this.coreOuterRing.material as THREE.MeshBasicMaterial

    this.coreShell.rotation.y += 0.0024
    this.coreShell.rotation.x = Math.sin(this.elapsed * 0.18) * 0.08
    this.coreShell.scale.setScalar(breath * pulse)

    this.coreRing.rotation.z += 0.003 + this.coreActivity * 0.01
    this.coreRing.scale.setScalar(1 + this.coreActivity * 0.1)

    this.coreOuterRing.rotation.y -= 0.0022
    this.coreOuterRing.rotation.z = Math.sin(this.elapsed * 0.42) * 0.18
    this.coreOuterRing.scale.setScalar(1 + this.coreActivity * 0.16)

    shellMaterial.emissiveIntensity = 0.96 + this.coreActivity * 0.36
    ringMaterial.opacity = 0.18 + this.coreActivity * 0.14
    outerMaterial.opacity = 0.08 + this.coreActivity * 0.1
    this.coreLight.intensity = 14 + this.coreActivity * 12 + Math.sin(this.elapsed * 0.55) * 2
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
}
