/**
 * 3D deep space background — all objects live in the world scene.
 * Stars are a sphere of points surrounding the scene at great distance.
 * Aurora curtains are large transparent planes at deep Z with additive blend.
 * Everything moves naturally with the camera = real parallax.
 */
import * as THREE from 'three'
import {
  makeAuroraCurtainTexture, makeStarTexture,
  AURORA_CONFIGS,
} from '../textures/GradientTextures'

function rand(min: number, max: number) { return Math.random() * (max - min) + min }

interface AuroraData {
  mesh: THREE.Mesh
  material: THREE.MeshBasicMaterial
  baseAlpha: number
  phase: number
  alphaPhase: number
  swayAxis: THREE.Vector3 // direction of gentle sway
}

export class BackgroundLayer {
  group: THREE.Group
  private auroras: AuroraData[] = []
  private starsMat!: THREE.PointsMaterial
  private elapsed = 0

  constructor() {
    this.group = new THREE.Group()

    this.buildStarSphere()
    this.buildAuroraCurtains()
  }

  /**
   * Star field: ~800 points distributed on a large sphere (radius 1500).
   * They surround the scene — camera rotation reveals different stars.
   */
  private buildStarSphere() {
    const starCount = 800
    const radius = 1500
    const positions = new Float32Array(starCount * 3)
    const sizes = new Float32Array(starCount)

    for (let i = 0; i < starCount; i++) {
      // Uniform distribution on sphere surface
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)
      sizes[i] = i < 30 ? rand(2.5, 4.5) : rand(1, 2.5)
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    const starTex = makeStarTexture()
    this.starsMat = new THREE.PointsMaterial({
      map: starTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      size: 3,
      sizeAttenuation: false,
      opacity: 0.7,
    })

    const stars = new THREE.Points(geo, this.starsMat)
    this.group.add(stars)
  }

  /**
   * Aurora curtains: large transparent planes at deep Z (-600 to -900).
   * They're big enough to fill peripheral vision and far enough for parallax.
   * Slight Y-axis rotation so they face slightly toward center.
   */
  private buildAuroraCurtains() {
    for (let i = 0; i < AURORA_CONFIGS.length; i++) {
      const cfg = AURORA_CONFIGS[i]
      const tex = makeAuroraCurtainTexture(cfg.r, cfg.g, cfg.b, cfg.peakAlpha, cfg.peakStart, cfg.peakEnd)

      const curtainW = rand(120, 250)
      const curtainH = rand(500, 800)
      const geo = new THREE.PlaneGeometry(curtainW, curtainH)
      const mat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      })

      const mesh = new THREE.Mesh(geo, mat)
      const baseAlpha = rand(0.08, 0.18) // very subtle — just hints of color in the void
      mat.opacity = baseAlpha

      // Distribute curtains in a wide arc behind and around the scene
      const angle = ((i / AURORA_CONFIGS.length) - 0.5) * Math.PI * 1.2 // spread ~216 degrees
      const dist = rand(500, 800)
      mesh.position.set(
        Math.sin(angle) * dist,
        rand(-100, 150), // some vertical variation
        -Math.cos(angle) * dist  // behind the scene
      )
      // Face toward center-ish
      mesh.lookAt(0, mesh.position.y * 0.5, 0)
      // Random tilt
      mesh.rotation.z += rand(-0.15, 0.15)

      this.group.add(mesh)

      this.auroras.push({
        mesh, material: mat, baseAlpha,
        phase: rand(0, Math.PI * 2),
        alphaPhase: rand(0, Math.PI * 2),
        swayAxis: new THREE.Vector3(rand(-1, 1), 1, rand(-0.5, 0.5)).normalize(),
      })
    }
  }

  tick(dt: number) {
    this.elapsed += Math.min(dt, 0.05)
    const t = this.elapsed

    // Aurora gentle sway + alpha pulse
    for (const a of this.auroras) {
      // Very gentle positional drift (±5 units along sway axis)
      const sway = Math.sin(t * 0.06 + a.phase) * 5
      a.mesh.position.addScaledVector(a.swayAxis, sway * dt)
      // Alpha pulse
      a.material.opacity = a.baseAlpha * (0.92 + 0.08 * Math.sin(t * 0.1 + a.alphaPhase))
    }

    // Subtle star twinkle (global)
    this.starsMat.opacity = 0.6 + 0.15 * Math.sin(t * 0.25)
  }

  dispose() {
    this.group.traverse((obj) => {
      if (obj instanceof THREE.Mesh || obj instanceof THREE.Points) {
        obj.geometry.dispose()
        if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose())
        else obj.material.dispose()
      }
    })
  }
}
