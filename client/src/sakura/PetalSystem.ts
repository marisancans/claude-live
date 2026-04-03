import * as THREE from 'three'
import petalVertSource from './shaders/petal.vert.glsl?raw'
import petalFragSource from './shaders/petal.frag.glsl?raw'
import type { BlossomAnchor } from './types'
import type { WindField } from './WindField'

const INITIAL_CAPACITY = 2500
const GRAVITY = -9.8
const GROUND_Y = -2

// Petal states
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

function makePetalShape(): THREE.ShapeGeometry {
  const shape = new THREE.Shape()
  // Rounded triangle — reads as petal
  shape.moveTo(0, 0.5)
  shape.quadraticCurveTo(0.35, 0.35, 0.3, 0)
  shape.quadraticCurveTo(0.15, -0.15, 0, -0.2)
  shape.quadraticCurveTo(-0.15, -0.15, -0.3, 0)
  shape.quadraticCurveTo(-0.35, 0.35, 0, 0.5)
  return new THREE.ShapeGeometry(shape, 4)
}

export class PetalSystem {
  readonly mesh: THREE.InstancedMesh
  private material: THREE.ShaderMaterial
  private capacity: number
  private count = 0

  // Per-instance CPU-side arrays
  private anchorPos: Float32Array
  private anchorDir: Float32Array
  private phases: Float32Array
  private states: Float32Array
  private velocities: Float32Array
  private wilts: Float32Array
  private colors: Float32Array
  private positions: Float32Array // current world pos for falling petals
  private groundTimers: Float32Array

  // InstancedBufferAttributes (GPU)
  private attrAnchorPos: THREE.InstancedBufferAttribute
  private attrAnchorDir: THREE.InstancedBufferAttribute
  private attrPhase: THREE.InstancedBufferAttribute
  private attrState: THREE.InstancedBufferAttribute
  private attrWilt: THREE.InstancedBufferAttribute
  private attrColor: THREE.InstancedBufferAttribute

  // Blossom center glow sprites
  readonly glowGroup: THREE.Group

  constructor() {
    this.capacity = INITIAL_CAPACITY

    const geometry = makePetalShape()
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uWindStrength: { value: 0 },
        uWindDirX: { value: 1 },
        uWindDirZ: { value: 0 },
        uPulseGlobal: { value: 0 },
      },
      vertexShader: petalVertSource,
      fragmentShader: petalFragSource,
      transparent: false,
      depthWrite: true,
      side: THREE.DoubleSide,
    })

    this.mesh = new THREE.InstancedMesh(geometry, this.material, this.capacity)
    this.mesh.count = 0
    this.mesh.renderOrder = 6
    this.mesh.frustumCulled = false

    // Allocate CPU arrays
    this.anchorPos = new Float32Array(this.capacity * 3)
    this.anchorDir = new Float32Array(this.capacity * 3)
    this.phases = new Float32Array(this.capacity)
    this.states = new Float32Array(this.capacity)
    this.velocities = new Float32Array(this.capacity * 3)
    this.wilts = new Float32Array(this.capacity)
    this.colors = new Float32Array(this.capacity * 3)
    this.positions = new Float32Array(this.capacity * 3)
    this.groundTimers = new Float32Array(this.capacity)

    // Create instanced attributes
    this.attrAnchorPos = new THREE.InstancedBufferAttribute(this.anchorPos, 3)
    this.attrAnchorDir = new THREE.InstancedBufferAttribute(this.anchorDir, 3)
    this.attrPhase = new THREE.InstancedBufferAttribute(this.phases, 1)
    this.attrState = new THREE.InstancedBufferAttribute(this.states, 1)
    this.attrWilt = new THREE.InstancedBufferAttribute(this.wilts, 1)
    this.attrColor = new THREE.InstancedBufferAttribute(this.colors, 3)

    geometry.setAttribute('aAnchorPos', this.attrAnchorPos)
    geometry.setAttribute('aAnchorDir', this.attrAnchorDir)
    geometry.setAttribute('aPhase', this.attrPhase)
    geometry.setAttribute('aState', this.attrState)
    geometry.setAttribute('aWilt', this.attrWilt)
    geometry.setAttribute('aColor', this.attrColor)

    this.glowGroup = new THREE.Group()
    this.glowGroup.renderOrder = 7
  }

  /** Allocate petals for a blossom cluster. Returns array of instance indices. */
  allocateCluster(anchor: BlossomAnchor): number[] {
    const petalCount = 5 + Math.floor(hashUnit(`count:${anchor.path}`) * 5)
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
      const radius = anchor.scale * (0.22 + hashUnit(`${anchor.path}:r:${i}`) * 0.26)
      const offsetX = Math.cos(angle) * radius
      const offsetZ = Math.sin(angle) * radius
      const offsetY = (hashUnit(`${anchor.path}:y:${i}`) - 0.5) * anchor.scale * 0.24

      const pos = anchor.position.clone()
        .add(tangent.clone().multiplyScalar(offsetX))
        .add(binormal.clone().multiplyScalar(offsetZ))
        .add(dir.clone().multiplyScalar(offsetY))

      this.anchorPos[idx * 3] = pos.x
      this.anchorPos[idx * 3 + 1] = pos.y
      this.anchorPos[idx * 3 + 2] = pos.z
      this.anchorDir[idx * 3] = dir.x
      this.anchorDir[idx * 3 + 1] = dir.y
      this.anchorDir[idx * 3 + 2] = dir.z
      this.phases[idx] = hashUnit(`${anchor.path}:phase:${i}`)
      this.states[idx] = STATE_ANCHORED
      this.wilts[idx] = 0
      this.groundTimers[idx] = 0

      // Color variation: white to deep pink
      const pinkness = 0.3 + hashUnit(`${anchor.path}:pink:${i}`) * 0.7
      this.colors[idx * 3] = 1.0
      this.colors[idx * 3 + 1] = 0.75 + (1 - pinkness) * 0.25
      this.colors[idx * 3 + 2] = 0.8 + (1 - pinkness) * 0.2

      this.positions[idx * 3] = pos.x
      this.positions[idx * 3 + 1] = pos.y
      this.positions[idx * 3 + 2] = pos.z

      // Set instance matrix (scale by petal size)
      const scale = anchor.scale * (0.44 + hashUnit(`${anchor.path}:s:${i}`) * 0.18)
      const mat = new THREE.Matrix4()
      mat.makeScale(scale, scale, scale)
      mat.setPosition(pos)
      this.mesh.setMatrixAt(idx, mat)
    }

    // Add center glow sprite
    const glowMat = new THREE.SpriteMaterial({
      color: '#ffe8d0',
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const glow = new THREE.Sprite(glowMat)
    glow.position.copy(anchor.position)
    glow.scale.setScalar(anchor.scale * 4)
    this.glowGroup.add(glow)

    return indices
  }

  /** Detach specific petals — start falling */
  detach(indices: number[], velocity: THREE.Vector3) {
    for (const idx of indices) {
      if (idx >= this.count) continue
      this.states[idx] = STATE_FALLING
      this.velocities[idx * 3] = velocity.x + (Math.random() - 0.5) * 2
      this.velocities[idx * 3 + 1] = velocity.y + Math.random() * 3
      this.velocities[idx * 3 + 2] = velocity.z + (Math.random() - 0.5) * 2
      this.groundTimers[idx] = 0
    }
    this.attrState.needsUpdate = true
  }

  /** Set wilt level on specific petals */
  setWilt(indices: number[], wilt: number) {
    for (const idx of indices) {
      if (idx >= this.count) continue
      this.wilts[idx] = Math.min(1, Math.max(0, wilt))
    }
    this.attrWilt.needsUpdate = true
  }

  update(dt: number, elapsed: number, wind: WindField) {
    this.material.uniforms.uTime.value = elapsed
    this.material.uniforms.uWindStrength.value = wind.effectiveStrength
    this.material.uniforms.uWindDirX.value = wind.directionX
    this.material.uniforms.uWindDirZ.value = wind.directionZ

    const mat = new THREE.Matrix4()
    let needsMatrixUpdate = false

    for (let idx = 0; idx < this.count; idx++) {
      if (this.states[idx] < 0.5) continue // anchored — shader handles sway

      // Falling petal — CPU physics
      const vx = this.velocities[idx * 3]
      const vy = this.velocities[idx * 3 + 1]
      const vz = this.velocities[idx * 3 + 2]

      // Apply gravity + wind drift
      this.velocities[idx * 3] = vx * 0.98 + wind.directionX * wind.effectiveStrength * dt * 3
      this.velocities[idx * 3 + 1] = vy + GRAVITY * dt * 0.3 // slow gravity for floaty feel
      this.velocities[idx * 3 + 2] = vz * 0.98 + wind.directionZ * wind.effectiveStrength * dt * 3

      // Clamp fall speed
      this.velocities[idx * 3 + 1] = Math.max(this.velocities[idx * 3 + 1], -4)

      // Update position
      this.positions[idx * 3] += this.velocities[idx * 3] * dt
      this.positions[idx * 3 + 1] += this.velocities[idx * 3 + 1] * dt
      this.positions[idx * 3 + 2] += this.velocities[idx * 3 + 2] * dt

      // Ground collision
      if (this.positions[idx * 3 + 1] < GROUND_Y) {
        this.positions[idx * 3 + 1] = GROUND_Y
        this.velocities[idx * 3] = 0
        this.velocities[idx * 3 + 1] = 0
        this.velocities[idx * 3 + 2] = 0
        this.groundTimers[idx] += dt

        // Recycle after 5s on ground
        if (this.groundTimers[idx] > 5) {
          this.states[idx] = STATE_ANCHORED
          this.positions[idx * 3] = this.anchorPos[idx * 3]
          this.positions[idx * 3 + 1] = this.anchorPos[idx * 3 + 1]
          this.positions[idx * 3 + 2] = this.anchorPos[idx * 3 + 2]
          this.wilts[idx] = 0
          this.groundTimers[idx] = 0
        }
      }

      // Tumble rotation
      const tumbleAngle = elapsed * 2 + this.phases[idx] * 10
      const scale = 0.5
      mat.makeRotationY(tumbleAngle)
      mat.scale(new THREE.Vector3(scale, scale, scale))
      mat.setPosition(this.positions[idx * 3], this.positions[idx * 3 + 1], this.positions[idx * 3 + 2])
      this.mesh.setMatrixAt(idx, mat)
      needsMatrixUpdate = true
    }

    if (needsMatrixUpdate) {
      this.mesh.instanceMatrix.needsUpdate = true
    }

    this.mesh.count = this.count
    this.attrAnchorPos.needsUpdate = true
    this.attrState.needsUpdate = true
    this.attrWilt.needsUpdate = true
  }

  /** Reset — clear all petals for rebuild */
  reset() {
    this.count = 0
    this.mesh.count = 0
    // Clear glow sprites
    while (this.glowGroup.children.length) {
      const child = this.glowGroup.children[0]
      this.glowGroup.remove(child)
      if (child instanceof THREE.Sprite) {
        child.material.dispose()
      }
    }
  }

  dispose() {
    this.mesh.geometry.dispose()
    this.material.dispose()
    this.reset()
  }
}
