/**
 * Instanced sakura flower blossoms.
 *
 * Each flower is a single quad with a canvas-generated 5-petal cherry
 * blossom texture. Thousands of tiny flowers placed along branches
 * create the dense, lush canopy of a real sakura tree.
 *
 * Separate from PetalSystem, which handles falling/drifting petals.
 */
import * as THREE from 'three'

// ---------------------------------------------------------------------------
// Sakura flower texture (canvas-generated)
// ---------------------------------------------------------------------------
function createFlowerTexture(): THREE.CanvasTexture {
  const size = 64
  const c = document.createElement('canvas')
  c.width = size
  c.height = size
  const ctx = c.getContext('2d')!
  ctx.clearRect(0, 0, size, size)

  const cx = size / 2
  const cy = size / 2
  const petalLen = 19
  const petalW = 11

  // 5 petals
  for (let i = 0; i < 5; i++) {
    const angle = ((i * 72) - 90) * Math.PI / 180
    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(angle)

    // Petal outline: oval with notched tip
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.bezierCurveTo(-petalW * 0.5, -petalLen * 0.3, -petalW, -petalLen * 0.7, -2.5, -petalLen)
    ctx.quadraticCurveTo(0, -petalLen + 3.5, 2.5, -petalLen)
    ctx.bezierCurveTo(petalW, -petalLen * 0.7, petalW * 0.5, -petalLen * 0.3, 0, 0)
    ctx.closePath()

    // Gradient: deeper pink at base, almost white at tip
    const grad = ctx.createLinearGradient(0, 0, 0, -petalLen)
    grad.addColorStop(0, 'rgba(252, 175, 195, 1)')
    grad.addColorStop(0.4, 'rgba(255, 205, 215, 1)')
    grad.addColorStop(1, 'rgba(255, 238, 242, 1)')
    ctx.fillStyle = grad
    ctx.fill()

    // Subtle vein line
    ctx.beginPath()
    ctx.moveTo(0, -3)
    ctx.lineTo(0, -petalLen + 5)
    ctx.strokeStyle = 'rgba(240, 150, 175, 0.25)'
    ctx.lineWidth = 0.6
    ctx.stroke()

    ctx.restore()
  }

  // Center pistil — yellow-green
  ctx.beginPath()
  ctx.arc(cx, cy, 4.5, 0, Math.PI * 2)
  const centerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 4.5)
  centerGrad.addColorStop(0, 'rgba(255, 240, 160, 1)')
  centerGrad.addColorStop(1, 'rgba(230, 210, 120, 1)')
  ctx.fillStyle = centerGrad
  ctx.fill()

  // Stamen dots around center
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2
    const r = 6
    ctx.beginPath()
    ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 0.9, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(210, 180, 80, 0.7)'
    ctx.fill()
  }

  const tex = new THREE.CanvasTexture(c)
  tex.needsUpdate = true
  return tex
}

// ---------------------------------------------------------------------------
// FlowerSystem
// ---------------------------------------------------------------------------
const MAX_FLOWERS = 25000

export class FlowerSystem {
  readonly mesh: THREE.InstancedMesh
  private count = 0
  private dummy = new THREE.Object3D()
  private _tempDir = new THREE.Vector3()

  constructor() {
    const geometry = new THREE.PlaneGeometry(1, 1)
    const texture = createFlowerTexture()

    const material = new THREE.MeshStandardMaterial({
      map: texture,
      alphaTest: 0.35,
      transparent: false,
      side: THREE.DoubleSide,
      roughness: 0.55,
      metalness: 0.0,
      depthWrite: true,
    })

    this.mesh = new THREE.InstancedMesh(geometry, material, MAX_FLOWERS)
    this.mesh.count = 0
    this.mesh.castShadow = true
    this.mesh.receiveShadow = true

    // Initialize instanceColor
    const colors = new Float32Array(MAX_FLOWERS * 3)
    for (let i = 0; i < MAX_FLOWERS; i++) {
      colors[i * 3] = 1
      colors[i * 3 + 1] = 1
      colors[i * 3 + 2] = 1
    }
    this.mesh.instanceColor = new THREE.InstancedBufferAttribute(colors, 3)
  }

  /**
   * Place a cluster of tiny sakura flowers around a point.
   * @param center  World position
   * @param outward General outward direction from branch
   * @param count   Flowers in this cluster (5-12 typical)
   * @returns Number of flowers actually added
   */
  addCluster(center: THREE.Vector3, outward: THREE.Vector3, count: number): number {
    let added = 0

    for (let i = 0; i < count; i++) {
      if (this.count >= MAX_FLOWERS) break

      // Tight clustering — dense fluffy puffs like real sakura
      const spread = 0.5 + Math.random() * 1.8
      const jAngle = Math.random() * Math.PI * 2
      const jx = Math.cos(jAngle) * spread
      const jz = Math.sin(jAngle) * spread
      const jy = (Math.random() - 0.5) * spread * 0.9

      this.dummy.position.set(center.x + jx, center.y + jy, center.z + jz)

      // Face roughly outward with randomness
      this._tempDir.copy(outward)
        .x += (Math.random() - 0.5) * 0.7
      this._tempDir.y += (Math.random() - 0.5) * 0.5
      this._tempDir.z += (Math.random() - 0.5) * 0.7
      this._tempDir.normalize()

      this.dummy.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        this._tempDir,
      )
      // Random twist so flowers don't all align
      const twistQ = new THREE.Quaternion().setFromAxisAngle(
        this._tempDir, Math.random() * Math.PI * 2,
      )
      this.dummy.quaternion.premultiply(twistQ)

      // Dense sakura blossoms
      const s = 0.9 + Math.random() * 1.2
      this.dummy.scale.setScalar(s)

      this.dummy.updateMatrix()
      this.mesh.setMatrixAt(this.count, this.dummy.matrix)

      // Subtle color variation: pale pink to slightly deeper
      const base = 0.88 + Math.random() * 0.12
      this.mesh.setColorAt!(
        this.count,
        new THREE.Color(base, base * 0.87, base * 0.90),
      )

      this.count++
      added++
    }

    this.mesh.count = this.count
    this.mesh.instanceMatrix.needsUpdate = true
    if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true

    return added
  }

  get flowerCount(): number {
    return this.count
  }

  dispose() {
    this.mesh.geometry.dispose()
    const mat = this.mesh.material as THREE.MeshStandardMaterial
    if (mat.map) mat.map.dispose()
    mat.dispose()
  }
}
