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
    this.scene.fog = new THREE.FogExp2('#0e0a08', 0.003)

    this.camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 1600)
    this.camera.position.set(40, 80, 200)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.06
    this.controls.autoRotate = true
    this.controls.autoRotateSpeed = 0.15
    this.controls.minDistance = 60
    this.controls.maxDistance = 500
    this.controls.target.set(0, 40, 0)

    // Post-processing — bloom for soft glow on petals
    this.composer = new EffectComposer(this.renderer)
    this.composer.addPass(new RenderPass(this.scene, this.camera))
    this.composer.addPass(new UnrealBloomPass(new THREE.Vector2(w, h), 0.4, 0.3, 0.75))

    // Lighting — warm, soft, multi-source
    this.scene.add(new THREE.AmbientLight('#fff5f0', 1.0))
    const hemi = new THREE.HemisphereLight('#ffeef5', '#0a0606', 1.8)
    hemi.position.set(0, 200, 0)
    this.scene.add(hemi)
    // Key light — warm from upper-left
    const key = new THREE.DirectionalLight('#fff0e0', 0.8)
    key.position.set(-80, 160, 100)
    this.scene.add(key)
    // Rim light — behind and above
    const rim = new THREE.PointLight('#ffd0e0', 0.9, 500, 1.5)
    rim.position.set(0, 180, -80)
    this.scene.add(rim)
    // Fill from below — subtle uplight
    const fill = new THREE.PointLight('#ffb78e', 0.35, 300, 2)
    fill.position.set(-100, 20, 60)
    this.scene.add(fill)
    // Pink accent from the side
    const accent = new THREE.PointLight('#ff8ab0', 0.3, 250, 2)
    accent.position.set(90, 60, -40)
    this.scene.add(accent)

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
        float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
        float noise(vec2 p) {
          vec2 i = floor(p); vec2 f = fract(p);
          float a = hash(i), b = hash(i+vec2(1,0)), c = hash(i+vec2(0,1)), d = hash(i+vec2(1,1));
          vec2 u = f*f*(3.0-2.0*f);
          return mix(a,b,u.x)+(c-a)*u.y*(1.0-u.x)+(d-b)*u.x*u.y;
        }
        float fbm(vec2 p) {
          float v=0.0, a=0.5; mat2 m=mat2(1.6,1.2,-1.2,1.6);
          for(int i=0;i<4;i++){v+=a*noise(p);p=m*p;a*=0.5;} return v;
        }
        void main() {
          vec3 dir = normalize(vWorldPos);
          float y = dir.y * 0.5 + 0.5;
          vec2 skyUv = vec2(atan(dir.z, dir.x)/6.2831+0.5, y);
          float clouds = fbm(skyUv * vec2(4.0, 2.5) + vec2(uTime*0.015, -uTime*0.02));
          float streaks = fbm(vec2(skyUv.x*10.0 - uTime*0.05, skyUv.y*2.0));
          vec3 top = vec3(0.04, 0.02, 0.07);
          vec3 mid = vec3(0.10, 0.06, 0.13);
          vec3 low = vec3(0.35, 0.18, 0.25);
          vec3 glow = vec3(0.45, 0.22, 0.30);
          vec3 color = mix(low, mid, smoothstep(0.0, 0.45, y));
          color = mix(color, top, smoothstep(0.45, 0.9, y));
          color += glow * clouds * 0.15 * smoothstep(0.5, 0.0, y);
          color += vec3(0.3, 0.15, 0.2) * streaks * 0.08;
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      side: THREE.BackSide,
      depthWrite: false,
    })
    this.sky = new THREE.Mesh(new THREE.SphereGeometry(900, 32, 24), this.skyMaterial)
    this.sky.scale.set(1, 0.72, 1)
    this.scene.add(this.sky)

    // Ground with warm center gradient via shader
    this.ground = new THREE.Mesh(
      new THREE.CircleGeometry(800, 72),
      new THREE.ShaderMaterial({
        uniforms: {},
        vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: `
          varying vec2 vUv;
          void main() {
            float d = length(vUv - 0.5) * 2.0;
            vec3 warm = vec3(0.12, 0.08, 0.06);
            vec3 dark = vec3(0.06, 0.04, 0.03);
            vec3 color = mix(warm, dark, smoothstep(0.0, 0.8, d));
            float alpha = smoothstep(1.0, 0.3, d) * 0.95;
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    )
    this.ground.rotation.x = -Math.PI / 2
    this.ground.position.y = -4
    this.scene.add(this.ground)

    // Fallen petal scatter on ground — static decoration
    this.createGroundPetals()

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
    // Generate soft circular particle texture
    const particleCanvas = document.createElement('canvas')
    particleCanvas.width = 32
    particleCanvas.height = 32
    const pCtx = particleCanvas.getContext('2d')!
    const grad = pCtx.createRadialGradient(16, 16, 0, 16, 16, 16)
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)')
    grad.addColorStop(0.4, 'rgba(255, 255, 255, 0.6)')
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)')
    pCtx.fillStyle = grad
    pCtx.fillRect(0, 0, 32, 32)
    const particleTexture = new THREE.CanvasTexture(particleCanvas)

    return new THREE.Points(geometry, new THREE.PointsMaterial({
      map: particleTexture,
      color: '#ffd8e2',
      transparent: true,
      opacity: 0.15,
      size: 2.4,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }))
  }

  private createGroundPetals() {
    // Scatter small pink petal sprites on the ground near the tree base
    const count = 60
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 5 + Math.random() * 45
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      const pinkness = 0.3 + Math.random() * 0.5
      const mat = new THREE.SpriteMaterial({
        color: new THREE.Color(1.0, 0.75 + (1 - pinkness) * 0.25, 0.82 + (1 - pinkness) * 0.18),
        transparent: true,
        opacity: 0.15 + Math.random() * 0.15,
        depthWrite: false,
      })
      const sprite = new THREE.Sprite(mat)
      sprite.position.set(x, -3.5 + Math.random() * 0.5, z)
      sprite.scale.setScalar(0.6 + Math.random() * 1.0)
      this.scene.add(sprite)
    }
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
