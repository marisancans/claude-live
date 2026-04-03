import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import type { RawEvent } from '../types'
import type { ColonyVisual, ProjectActivity, ProjectVisualState } from './types'
import { buildTreeLayout, layoutRootPath } from './TreeBuilder'
import { buildBranches, disposeBranches, updateBranchUniforms } from './BranchRenderer'
import { PetalSystem } from './PetalSystem'
import { SignalSystem } from './SignalSystem'
import { WindField } from './WindField'

function hashUnit(value: string): number {
  let hash = 2166136261
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return (hash >>> 0) / 4294967296
}

function clamp(v: number, lo: number, hi: number) { return Math.min(hi, Math.max(lo, v)) }

function projectHeat(activity: ProjectActivity, now = Date.now()) {
  const age = Math.max(0, now - activity.lastEventTime)
  const freshness = clamp(1 - age / 90000, 0, 1)
  const density = clamp(Math.log1p(activity.eventCount) / Math.log(24), 0, 1)
  return clamp(0.12 + freshness * 0.56 + density * 0.3, 0.08, 1)
}

function buildSignature(tree: { projectId: string; stats: { totalNodes: number; maxDepthReached: number; truncated: boolean } }) {
  return `${tree.projectId}:${tree.stats.totalNodes}:${tree.stats.maxDepthReached}:${tree.stats.truncated ? 't' : 'f'}`
}

export class SakuraApp {
  private renderer: THREE.WebGLRenderer
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private controls: OrbitControls
  private composer: EffectComposer

  private colonies = new Map<string, ColonyVisual>()
  private windField = new WindField()
  private petalSystem = new PetalSystem()
  private signalSystem: SignalSystem

  private atmosphere: THREE.Points
  private sky: THREE.Mesh
  private skyMaterial: THREE.ShaderMaterial
  private ground: THREE.Mesh
  private elapsed = 0
  private resizeHandler: () => void

  constructor(private container: HTMLDivElement) {
    const w = container.clientWidth
    const h = container.clientHeight

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(w, h)
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.setClearColor('#0e0a08')
    container.appendChild(this.renderer.domElement)

    this.scene = new THREE.Scene()
    this.scene.fog = new THREE.FogExp2('#0e0a08', 0.004)

    this.camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 1600)
    this.camera.position.set(0, 135, 255)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.05
    this.controls.autoRotate = false
    this.controls.autoRotateSpeed = 0.08
    this.controls.minDistance = 80
    this.controls.maxDistance = 620
    this.controls.target.set(0, 34, 0)

    // Post-processing — bloom threshold 0.6 to avoid flicker
    this.composer = new EffectComposer(this.renderer)
    this.composer.addPass(new RenderPass(this.scene, this.camera))
    this.composer.addPass(new UnrealBloomPass(new THREE.Vector2(w, h), 0.5, 0.4, 0.6))

    // Lighting
    this.scene.add(new THREE.AmbientLight('#fff0f0', 0.8))
    const hemi = new THREE.HemisphereLight('#ffe8f0', '#0e0808', 1.6)
    hemi.position.set(0, 180, 0)
    this.scene.add(hemi)
    const rim = new THREE.PointLight('#ffd0e0', 0.7, 400, 2)
    rim.position.set(0, 150, 90)
    this.scene.add(rim)
    const fill = new THREE.PointLight('#ffb78e', 0.25, 300, 2)
    fill.position.set(-120, 70, -60)
    this.scene.add(fill)

    // Sky sphere
    this.skyMaterial = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uHeat: { value: 0 } },
      vertexShader: `
        varying vec3 vWorldPos;
        void main() {
          vec4 world = modelMatrix * vec4(position, 1.0);
          vWorldPos = world.xyz;
          gl_Position = projectionMatrix * viewMatrix * world;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec3 vWorldPos;
        void main() {
          vec3 dir = normalize(vWorldPos);
          float y = dir.y * 0.5 + 0.5;
          vec3 top = vec3(0.05, 0.03, 0.08);
          vec3 mid = vec3(0.12, 0.08, 0.14);
          vec3 low = vec3(0.32, 0.18, 0.22);
          vec3 color = mix(low, mid, smoothstep(0.0, 0.5, y));
          color = mix(color, top, smoothstep(0.5, 1.0, y));
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      side: THREE.BackSide,
      depthWrite: false,
    })
    this.sky = new THREE.Mesh(new THREE.SphereGeometry(900, 32, 24), this.skyMaterial)
    this.sky.scale.set(1, 0.72, 1)
    this.scene.add(this.sky)

    // Ground
    this.ground = new THREE.Mesh(
      new THREE.CircleGeometry(700, 64),
      new THREE.MeshStandardMaterial({
        color: '#1a120e',
        emissive: '#1f1510',
        emissiveIntensity: 0.15,
        transparent: true,
        opacity: 0.95,
      }),
    )
    this.ground.rotation.x = -Math.PI / 2
    this.ground.position.y = -4
    this.scene.add(this.ground)

    // Atmosphere particles
    this.atmosphere = this.createAtmosphere()
    this.scene.add(this.atmosphere)

    // Add petal system to scene
    this.scene.add(this.petalSystem.mesh)
    this.scene.add(this.petalSystem.glowGroup)

    this.signalSystem = new SignalSystem(this.petalSystem, this.windField)

    this.resizeHandler = () => this.onResize()
    window.addEventListener('resize', this.resizeHandler)
  }

  private createAtmosphere() {
    const count = 1200
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const radius = 100 + Math.random() * 400
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(1 - Math.random() * 1.2)
      positions[i * 3] = Math.cos(theta) * Math.sin(phi) * radius
      positions[i * 3 + 1] = -10 + Math.random() * 180
      positions[i * 3 + 2] = Math.sin(theta) * Math.sin(phi) * radius
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return new THREE.Points(geometry, new THREE.PointsMaterial({
      color: '#ffd8e2',
      transparent: true,
      opacity: 0.12,
      size: 1.6,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }))
  }

  syncProjects(projects: ProjectVisualState[]) {
    const withTrees = projects.filter(p => p.tree?.tree)
    const seen = new Set<string>()

    withTrees.forEach((projectState, index) => {
      const tree = projectState.tree!
      const signature = buildSignature(tree)
      let colony = this.colonies.get(projectState.project.id)

      if (!colony || colony.signature !== signature) {
        if (colony) this.disposeColony(colony)
        colony = this.createColony(projectState, signature)
        this.colonies.set(projectState.project.id, colony)
        this.scene.add(colony.group)
      }

      // All colonies share one root position
      colony.group.position.set(0, 0, 0)

      colony.activity = projectState.activity
      colony.rootPath = tree.rootPath
      seen.add(projectState.project.id)
    })

    for (const [id, colony] of this.colonies) {
      if (seen.has(id)) continue
      this.disposeColony(colony)
      this.colonies.delete(id)
    }
  }

  private createColony(projectState: ProjectVisualState, signature: string): ColonyVisual {
    const tree = projectState.tree!
    const layout = buildTreeLayout(tree.tree!, projectState.project.id)
    const group = new THREE.Group()

    const { branches, junctions } = buildBranches(layout, group)

    // Allocate petals for each blossom anchor
    const petalInstanceIds: number[] = []
    for (const [, anchor] of layout.blossomAnchors) {
      const ids = this.petalSystem.allocateCluster(anchor)
      petalInstanceIds.push(...ids)
    }

    return {
      id: projectState.project.id,
      rootPath: tree.rootPath,
      signature,
      group,
      activity: projectState.activity,
      layout,
      branches,
      junctions,
      petalInstanceIds,
      heat: 0.12,
      contamination: 0,
      boost: 0,
      idleOffset: hashUnit(projectState.project.id) * Math.PI * 2,
    }
  }

  applyEvent(event: RawEvent) {
    if (!event.cwd) return
    const colony = this.colonies.get(event.cwd)
    if (!colony) return
    this.signalSystem.route(event, colony)
  }

  tick(dt: number) {
    this.elapsed += dt
    this.controls.update()

    // Wind
    this.windField.update(dt)

    // Atmosphere drift
    this.atmosphere.rotation.y += dt * 0.001
    this.skyMaterial.uniforms.uTime.value = this.elapsed
    const now = Date.now()
    for (const colony of this.colonies.values()) {
      const heat = projectHeat(colony.activity, now)
      colony.heat = heat
      colony.boost = Math.max(0, colony.boost - dt * 0.35)
      colony.contamination = Math.max(0, colony.contamination - dt * 0.03)

      updateBranchUniforms(
        colony.branches,
        colony.junctions,
        this.elapsed + colony.idleOffset,
        heat,
        colony.contamination,
        this.windField.effectiveStrength,
        this.windField.phase,
        dt,
      )
    }

    // Petals
    this.petalSystem.update(dt, this.elapsed, this.windField)
    this.petalSystem.ambientDrift(dt)

    // Effects
    this.signalSystem.update(dt, this.elapsed)

    // Render
    this.composer.render()
  }

  private onResize() {
    const { clientWidth, clientHeight } = this.container
    this.camera.aspect = clientWidth / clientHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(clientWidth, clientHeight)
    this.composer.setSize(clientWidth, clientHeight)
  }

  private disposeColony(colony: ColonyVisual) {
    this.scene.remove(colony.group)
    disposeBranches(colony.branches, colony.junctions)
  }

  destroy() {
    window.removeEventListener('resize', this.resizeHandler)
    for (const colony of this.colonies.values()) this.disposeColony(colony)
    this.colonies.clear()
    this.signalSystem.dispose()
    this.petalSystem.dispose()
    this.scene.remove(this.petalSystem.mesh)
    this.scene.remove(this.petalSystem.glowGroup)
    ;(this.atmosphere.geometry as THREE.BufferGeometry).dispose()
    ;(this.atmosphere.material as THREE.PointsMaterial).dispose()
    this.sky.geometry.dispose()
    this.skyMaterial.dispose()
    this.ground.geometry.dispose()
    ;(this.ground.material as THREE.MeshStandardMaterial).dispose()
    this.controls.dispose()
    this.composer.dispose()
    this.renderer.dispose()
    this.container.removeChild(this.renderer.domElement)
  }
}

// Re-export layoutRootPath for consumers of this module who need it
export { layoutRootPath }
