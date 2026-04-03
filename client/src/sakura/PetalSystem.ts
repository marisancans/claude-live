import * as THREE from 'three'
import type { BlossomAnchor } from './types'
import type { WindField } from './WindField'

const INITIAL_CAPACITY = 5000
const GRAVITY = -9.8
const GROUND_Y = -2
const STATE_ANCHORED = 0
const STATE_FALLING = 1

function hashUnit(value: string): number {
  let hash = 2166136261
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return (hash >>> 0) / 4294967296
}

/** Generate a soft petal texture on a Canvas — eliminates square artifacts */
function createPetalTexture(): THREE.CanvasTexture {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  // Draw petal shape with soft gradient
  const cx = size / 2
  const cy = size / 2

  // Petal silhouette — teardrop/oval (slightly asymmetric for natural look)
  ctx.beginPath()
  ctx.moveTo(cx, cy * 0.15)
  ctx.bezierCurveTo(cx + 44, cy * 0.28, cx + 50, cy * 1.05, cx + 2, cy * 1.75)
  ctx.bezierCurveTo(cx - 46, cy * 1.12, cx - 40, cy * 0.32, cx, cy * 0.15)
  ctx.closePath()

  // Radial gradient fill: soft pink center → deeper pink edges
  const grad = ctx.createRadialGradient(cx, cy * 0.8, 0, cx, cy * 0.8, size * 0.45)
  grad.addColorStop(0, 'rgba(255, 230, 240, 1)')
  grad.addColorStop(0.3, 'rgba(255, 200, 220, 1)')
  grad.addColorStop(0.6, 'rgba(245, 170, 200, 1)')
  grad.addColorStop(1, 'rgba(230, 140, 175, 1)')
  ctx.fillStyle = grad
  ctx.fill()

  // Central vein — slightly curved quadratic bezier
  ctx.strokeStyle = 'rgba(220, 170, 190, 0.35)'
  ctx.lineWidth = 1.2
  ctx.beginPath()
  ctx.moveTo(cx, cy * 0.25)
  ctx.quadraticCurveTo(cx + 1, cy, cx, cy * 1.55)
  ctx.stroke()

  // Side veins radiating from center
  ctx.strokeStyle = 'rgba(220, 170, 190, 0.2)'
  ctx.lineWidth = 0.7
  for (let i = 0; i < 4; i++) {
    const t = 0.3 + i * 0.15
    const y = cy * (0.4 + t * 1.1)
    const spread = 18 + i * 6
    // Left vein
    ctx.beginPath()
    ctx.moveTo(cx, y)
    ctx.quadraticCurveTo(cx - spread * 0.6, y - 4, cx - spread, y + 3)
    ctx.stroke()
    // Right vein
    ctx.beginPath()
    ctx.moveTo(cx, y)
    ctx.quadraticCurveTo(cx + spread * 0.6, y - 4, cx + spread, y + 3)
    ctx.stroke()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

/** Generate alpha map for the petal shape — soft feathered edges */
function createPetalAlpha(): THREE.CanvasTexture {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  const cx = size / 2
  const cy = size / 2

  // Same petal silhouette as color texture (slightly asymmetric)
  ctx.beginPath()
  ctx.moveTo(cx, cy * 0.15)
  ctx.bezierCurveTo(cx + 44, cy * 0.28, cx + 50, cy * 1.05, cx + 2, cy * 1.75)
  ctx.bezierCurveTo(cx - 46, cy * 1.12, cx - 40, cy * 0.32, cx, cy * 0.15)
  ctx.closePath()

  // Solid white inside, sharp cutoff at petal edge
  const grad = ctx.createRadialGradient(cx, cy * 0.8, 0, cx, cy * 0.8, size * 0.46)
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)')
  grad.addColorStop(0.85, 'rgba(255, 255, 255, 1)')
  grad.addColorStop(0.95, 'rgba(255, 255, 255, 0.5)')
  grad.addColorStop(1, 'rgba(255, 255, 255, 0)')
  ctx.fillStyle = grad
  ctx.fill()

  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

export class PetalSystem {
  readonly mesh: THREE.InstancedMesh
  private material: THREE.ShaderMaterial
  private capacity: number
  private count = 0

  // Per-instance CPU arrays
  private states: Float32Array
  private velocities: Float32Array
  private positions: Float32Array
  private anchorPositions: Float32Array
  private phases: Float32Array
  private groundTimers: Float32Array

  // Blossom center glow sprites
  readonly glowGroup: THREE.Group

  constructor() {
    this.capacity = INITIAL_CAPACITY

    // Larger plane + alpha-tested canvas texture = soft petal silhouette
    const geometry = new THREE.PlaneGeometry(3.0, 3.6)
    const petalMap = createPetalTexture()
    const petalAlpha = createPetalAlpha()

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uMap: { value: petalMap },
        uAlphaMap: { value: petalAlpha },
        uLightDir: { value: new THREE.Vector3(-0.3, 0.8, 0.4).normalize() },
        uSSS: { value: 0.45 },
        uSSSColor: { value: new THREE.Color('#ff8aaa') },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vWorldNormal;
        varying vec3 vWorldPos;
        void main() {
          vUv = uv;
          vec4 world = modelMatrix * instanceMatrix * vec4(position, 1.0);
          vWorldPos = world.xyz;
          vWorldNormal = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * normal);
          gl_Position = projectionMatrix * viewMatrix * world;
        }
      `,
      fragmentShader: `
        uniform sampler2D uMap;
        uniform sampler2D uAlphaMap;
        uniform vec3 uLightDir;
        uniform float uSSS;
        uniform vec3 uSSSColor;
        varying vec2 vUv;
        varying vec3 vWorldNormal;
        varying vec3 vWorldPos;

        void main() {
          vec4 texColor = texture2D(uMap, vUv);
          float alpha = texture2D(uAlphaMap, vUv).r;
          if (alpha < 0.5) discard;

          vec3 norm = normalize(vWorldNormal);
          vec3 viewDir = normalize(cameraPosition - vWorldPos);

          // Diffuse — half-lambert for soft wrap
          float diffuse = max(dot(norm, uLightDir), 0.0) * 0.5 + 0.5;

          // Subsurface scattering — light passing through the petal
          float sss = max(dot(-norm, uLightDir), 0.0);
          sss = pow(sss, 1.5) * uSSS;

          // Fresnel rim
          float fresnel = pow(1.0 - max(dot(viewDir, norm), 0.0), 2.5) * 0.15;

          vec3 color = texColor.rgb * diffuse;
          color += uSSSColor * sss;
          color += vec3(1.0, 0.95, 0.98) * fresnel;

          gl_FragColor = vec4(color, 1.0);
        }
      `,
      side: THREE.DoubleSide,
      depthWrite: true,
      transparent: false,
    }) as any // InstancedMesh accepts Material

    this.mesh = new THREE.InstancedMesh(geometry, this.material, this.capacity)
    this.mesh.count = 0
    this.mesh.renderOrder = 6
    this.mesh.frustumCulled = false

    // CPU arrays
    this.states = new Float32Array(this.capacity)
    this.velocities = new Float32Array(this.capacity * 3)
    this.positions = new Float32Array(this.capacity * 3)
    this.anchorPositions = new Float32Array(this.capacity * 3)
    this.phases = new Float32Array(this.capacity)
    this.groundTimers = new Float32Array(this.capacity)

    this.glowGroup = new THREE.Group()
    this.glowGroup.renderOrder = 7
  }

  /** Allocate petals for a blossom cluster. Returns instance indices. */
  allocateCluster(anchor: BlossomAnchor): number[] {
    const petalCount = 12 + Math.floor(hashUnit(`count:${anchor.path}`) * 10)
    const indices: number[] = []

    const dir = anchor.direction.clone().normalize()
    const up = Math.abs(dir.y) > 0.9 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0)
    const tangent = new THREE.Vector3().crossVectors(dir, up).normalize()
    const binormal = new THREE.Vector3().crossVectors(tangent, dir).normalize()

    for (let i = 0; i < petalCount; i++) {
      if (this.count >= this.capacity) break
      const idx = this.count++
      indices.push(idx)

      const angle = (i / petalCount) * Math.PI * 2 + hashUnit(`${anchor.path}:a:${i}`) * 0.7
      const radius = anchor.scale * (0.5 + hashUnit(`${anchor.path}:r:${i}`) * 0.8)
      const offsetX = Math.cos(angle) * radius
      const offsetZ = Math.sin(angle) * radius
      const offsetY = (hashUnit(`${anchor.path}:y:${i}`) - 0.5) * anchor.scale * 0.6

      const pos = anchor.position.clone()
        .add(tangent.clone().multiplyScalar(offsetX))
        .add(binormal.clone().multiplyScalar(offsetZ))
        .add(dir.clone().multiplyScalar(offsetY))

      this.anchorPositions[idx * 3] = pos.x
      this.anchorPositions[idx * 3 + 1] = pos.y
      this.anchorPositions[idx * 3 + 2] = pos.z
      this.positions[idx * 3] = pos.x
      this.positions[idx * 3 + 1] = pos.y
      this.positions[idx * 3 + 2] = pos.z
      this.phases[idx] = hashUnit(`${anchor.path}:phase:${i}`)
      this.states[idx] = STATE_ANCHORED
      this.groundTimers[idx] = 0

      // Instance matrix: random rotation + scale
      const scale = anchor.scale * (0.8 + hashUnit(`${anchor.path}:s:${i}`) * 0.7)
      const mat = new THREE.Matrix4()
      const rotX = (hashUnit(`${anchor.path}:rx:${i}`) - 0.5) * Math.PI * 0.9
      const rotY = hashUnit(`${anchor.path}:ry:${i}`) * Math.PI * 2
      const rotZ = (hashUnit(`${anchor.path}:rz:${i}`) - 0.5) * Math.PI * 0.7
      const quat = new THREE.Quaternion().setFromEuler(new THREE.Euler(rotX, rotY, rotZ))
      mat.makeRotationFromQuaternion(quat)
      mat.scale(new THREE.Vector3(scale, scale, scale))
      mat.setPosition(pos)
      this.mesh.setMatrixAt(idx, mat)

    }

    this.mesh.instanceMatrix.needsUpdate = true

    // Soft blossom cloud sprite — gives canopy volume at distance
    const cloudMat = new THREE.SpriteMaterial({
      color: '#ffd4e2',
      transparent: true,
      opacity: 0.08,
      blending: THREE.NormalBlending,
      depthWrite: false,
    })
    const cloud = new THREE.Sprite(cloudMat)
    cloud.position.copy(anchor.position)
    cloud.scale.setScalar(anchor.scale * 8)
    this.glowGroup.add(cloud)

    // Tiny warm center glow
    const glowMat = new THREE.SpriteMaterial({
      color: '#ffeecc',
      transparent: true,
      opacity: 0.04,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const glow = new THREE.Sprite(glowMat)
    glow.position.copy(anchor.position)
    glow.scale.setScalar(anchor.scale * 1.5)
    this.glowGroup.add(glow)

    return indices
  }

  /** Detach petals — start falling */
  detach(indices: number[], velocity: THREE.Vector3) {
    for (const idx of indices) {
      if (idx >= this.count) continue
      this.states[idx] = STATE_FALLING
      this.velocities[idx * 3] = velocity.x + (Math.random() - 0.5) * 2
      this.velocities[idx * 3 + 1] = velocity.y + Math.random() * 3
      this.velocities[idx * 3 + 2] = velocity.z + (Math.random() - 0.5) * 2
      this.groundTimers[idx] = 0
    }
  }

  /** Set wilt on petals (unused in new system but kept for effect API) */
  setWilt(_indices: number[], _wilt: number) {
    // Wilt could tint instance color darker — implement when needed
  }

  update(dt: number, elapsed: number, wind: WindField) {
    const mat = new THREE.Matrix4()
    const quat = new THREE.Quaternion()
    const euler = new THREE.Euler()
    let needsUpdate = false

    for (let idx = 0; idx < this.count; idx++) {
      if (this.states[idx] === STATE_ANCHORED) {
        // Gentle sway around anchor
        const phase = this.phases[idx]
        const swayX = Math.sin(elapsed * 1.4 + phase * 6.28) * wind.effectiveStrength * 0.6
        const swayY = Math.sin(elapsed * 2.1 + phase * 3.14) * wind.effectiveStrength * 0.15
        const swayZ = Math.cos(elapsed * 0.9 + phase * 4.71) * wind.effectiveStrength * 0.4

        const ax = this.anchorPositions[idx * 3]
        const ay = this.anchorPositions[idx * 3 + 1]
        const az = this.anchorPositions[idx * 3 + 2]

        // Only update matrix if wind is noticeable (optimization)
        if (wind.effectiveStrength > 0.05) {
          this.mesh.getMatrixAt(idx, mat)
          mat.setPosition(ax + swayX, ay + swayY, az + swayZ)
          this.mesh.setMatrixAt(idx, mat)
          needsUpdate = true
        }
        continue
      }

      // Falling petal physics
      this.velocities[idx * 3] = this.velocities[idx * 3] * 0.98 + wind.directionX * wind.effectiveStrength * dt * 3
      this.velocities[idx * 3 + 1] = Math.max(this.velocities[idx * 3 + 1] + GRAVITY * dt * 0.3, -4)
      this.velocities[idx * 3 + 2] = this.velocities[idx * 3 + 2] * 0.98 + wind.directionZ * wind.effectiveStrength * dt * 3

      this.positions[idx * 3] += this.velocities[idx * 3] * dt
      this.positions[idx * 3 + 1] += this.velocities[idx * 3 + 1] * dt
      this.positions[idx * 3 + 2] += this.velocities[idx * 3 + 2] * dt

      if (this.positions[idx * 3 + 1] < GROUND_Y) {
        this.positions[idx * 3 + 1] = GROUND_Y
        this.velocities[idx * 3] = 0
        this.velocities[idx * 3 + 1] = 0
        this.velocities[idx * 3 + 2] = 0
        this.groundTimers[idx] += dt
        if (this.groundTimers[idx] > 5) {
          this.states[idx] = STATE_ANCHORED
          this.positions[idx * 3] = this.anchorPositions[idx * 3]
          this.positions[idx * 3 + 1] = this.anchorPositions[idx * 3 + 1]
          this.positions[idx * 3 + 2] = this.anchorPositions[idx * 3 + 2]
          this.groundTimers[idx] = 0
        }
      }

      // Tumble
      const tumble = elapsed * 2 + this.phases[idx] * 10
      euler.set(tumble * 0.7, tumble, tumble * 0.3)
      quat.setFromEuler(euler)
      mat.makeRotationFromQuaternion(quat)
      mat.scale(new THREE.Vector3(0.5, 0.5, 0.5))
      mat.setPosition(this.positions[idx * 3], this.positions[idx * 3 + 1], this.positions[idx * 3 + 2])
      this.mesh.setMatrixAt(idx, mat)
      needsUpdate = true
    }

    if (needsUpdate) {
      this.mesh.instanceMatrix.needsUpdate = true
    }
    this.mesh.count = this.count
  }

  private driftTimer = 0
  private driftInterval = 1.5

  /** Constant gentle petal rain */
  ambientDrift(dt: number) {
    this.driftTimer += dt
    if (this.driftTimer < this.driftInterval || this.count === 0) return
    this.driftTimer = 0
    this.driftInterval = 0.8 + Math.random() * 2.0
    const driftCount = 1 + Math.floor(Math.random() * 4)
    const candidates: number[] = []
    for (let i = 0; i < this.count && candidates.length < driftCount * 5; i++) {
      if (this.states[i] === STATE_ANCHORED) candidates.push(i)
    }
    if (candidates.length === 0) return
    const toDetach: number[] = []
    for (let i = 0; i < driftCount && candidates.length > 0; i++) {
      const pick = Math.floor(Math.random() * candidates.length)
      toDetach.push(candidates.splice(pick, 1)[0])
    }
    this.detach(toDetach, new THREE.Vector3(0, 0.5, 0))
  }

  reset() {
    this.count = 0
    this.mesh.count = 0
    while (this.glowGroup.children.length) {
      const child = this.glowGroup.children[0]
      this.glowGroup.remove(child)
      if (child instanceof THREE.Sprite) child.material.dispose()
    }
  }

  dispose() {
    this.mesh.geometry.dispose()
    ;(this.material.uniforms.uMap?.value as THREE.Texture | undefined)?.dispose()
    ;(this.material.uniforms.uAlphaMap?.value as THREE.Texture | undefined)?.dispose()
    this.material.dispose()
    this.reset()
  }
}
