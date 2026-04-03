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

  // Petal silhouette — teardrop/oval
  ctx.beginPath()
  ctx.moveTo(cx, cy * 0.15)
  ctx.bezierCurveTo(cx + 42, cy * 0.3, cx + 48, cy * 1.1, cx, cy * 1.75)
  ctx.bezierCurveTo(cx - 48, cy * 1.1, cx - 42, cy * 0.3, cx, cy * 0.15)
  ctx.closePath()

  // Radial gradient fill: soft pink center → deeper pink edges
  const grad = ctx.createRadialGradient(cx, cy * 0.8, 0, cx, cy * 0.8, size * 0.45)
  grad.addColorStop(0, 'rgba(255, 230, 240, 1)')
  grad.addColorStop(0.3, 'rgba(255, 200, 220, 1)')
  grad.addColorStop(0.6, 'rgba(245, 170, 200, 1)')
  grad.addColorStop(1, 'rgba(230, 140, 175, 1)')
  ctx.fillStyle = grad
  ctx.fill()

  // Subtle vein line down the center
  ctx.strokeStyle = 'rgba(255, 200, 215, 0.3)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(cx, cy * 0.3)
  ctx.lineTo(cx, cy * 1.5)
  ctx.stroke()

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

  // Same petal silhouette as color texture
  ctx.beginPath()
  ctx.moveTo(cx, cy * 0.15)
  ctx.bezierCurveTo(cx + 42, cy * 0.3, cx + 48, cy * 1.1, cx, cy * 1.75)
  ctx.bezierCurveTo(cx - 48, cy * 1.1, cx - 42, cy * 0.3, cx, cy * 0.15)
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
  private material: THREE.MeshStandardMaterial
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

    this.material = new THREE.MeshStandardMaterial({
      map: petalMap,
      alphaMap: petalAlpha,
      alphaTest: 0.5,
      transparent: false,
      side: THREE.DoubleSide,
      roughness: 0.6,
      metalness: 0.0,
      emissive: new THREE.Color('#ffd0e8'),
      emissiveIntensity: 0.03,
      depthWrite: true,
    })

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

      // Per-instance color — white to pink variation
      const pinkness = 0.2 + hashUnit(`${anchor.path}:pink:${i}`) * 0.6
      const color = new THREE.Color(1.0, 0.82 + (1 - pinkness) * 0.18, 0.86 + (1 - pinkness) * 0.14)
      this.mesh.setColorAt(idx, color)
    }

    this.mesh.instanceMatrix.needsUpdate = true
    if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true

    // Small subtle center — much dimmer than before so petals show
    const glowMat = new THREE.SpriteMaterial({
      color: '#ffeecc',
      transparent: true,
      opacity: 0.06,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const glow = new THREE.Sprite(glowMat)
    glow.position.copy(anchor.position)
    glow.scale.setScalar(anchor.scale * 2.5)
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
  private driftInterval = 3

  /** Randomly detach 1-3 petals for ambient life */
  ambientDrift(dt: number) {
    this.driftTimer += dt
    if (this.driftTimer < this.driftInterval || this.count === 0) return
    this.driftTimer = 0
    this.driftInterval = 2 + Math.random() * 4
    const driftCount = 1 + Math.floor(Math.random() * 3)
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
    this.material.map?.dispose()
    this.material.alphaMap?.dispose()
    this.material.dispose()
    this.reset()
  }
}
