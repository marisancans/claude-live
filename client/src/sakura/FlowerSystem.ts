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
// Helpers
// ---------------------------------------------------------------------------

/** Box-Muller transform: returns a standard normal variate (mean=0, sd=1). */
function gaussRandom(): number {
  let u = 0, v = 0
  while (u === 0) u = Math.random()
  while (v === 0) v = Math.random()
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
}

/** Gaussian random clamped to [lo, hi] with given mean & standard deviation. */
function gaussClamped(mean: number, sd: number, lo: number, hi: number): number {
  const v = mean + gaussRandom() * sd
  return Math.max(lo, Math.min(hi, v))
}

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
// Color palettes — weighted color families for sakura variety
// ---------------------------------------------------------------------------

interface FlowerColorDef {
  /** base hue shift: [r, g, b] multiplied onto the instance color (1 = unchanged). */
  r: number
  g: number
  b: number
  /** probability weight (higher = more common). */
  weight: number
}

/**
 * Palette loosely modelled after real cultivars:
 *  - Somei Yoshino (pale pink, almost white) — most common
 *  - Kanzan (deep double-pink)
 *  - Ukon (warm cream/peach tint)
 *  - Shirotae (pure white)
 */
const COLOR_PALETTE: FlowerColorDef[] = [
  // Pale pink / almost-white (Somei Yoshino style) — most common
  { r: 1.00, g: 0.90, b: 0.92, weight: 35 },
  // Slightly warmer pale pink
  { r: 1.00, g: 0.88, b: 0.89, weight: 20 },
  // Medium pink
  { r: 0.96, g: 0.78, b: 0.83, weight: 15 },
  // Deep pink (Kanzan-esque)
  { r: 0.92, g: 0.65, b: 0.72, weight: 8 },
  // Very deep / saturated pink
  { r: 0.88, g: 0.55, b: 0.65, weight: 3 },
  // Warm pink with peach/coral tint
  { r: 1.00, g: 0.82, b: 0.78, weight: 8 },
  // Coral-peach
  { r: 1.00, g: 0.78, b: 0.72, weight: 4 },
  // Pure white (Shirotae)
  { r: 1.00, g: 0.98, b: 0.98, weight: 5 },
  // Cream-white
  { r: 1.00, g: 0.96, b: 0.93, weight: 2 },
]

// Pre-compute cumulative weights for O(log n) weighted pick.
const _totalWeight = COLOR_PALETTE.reduce((s, c) => s + c.weight, 0)
const _cumulativeWeights: number[] = []
{
  let acc = 0
  for (const c of COLOR_PALETTE) {
    acc += c.weight
    _cumulativeWeights.push(acc)
  }
}

function pickColor(): FlowerColorDef {
  const r = Math.random() * _totalWeight
  for (let i = 0; i < _cumulativeWeights.length; i++) {
    if (r < _cumulativeWeights[i]) return COLOR_PALETTE[i]
  }
  return COLOR_PALETTE[COLOR_PALETTE.length - 1]
}

// ---------------------------------------------------------------------------
// Weighted size distribution
// ---------------------------------------------------------------------------

interface SizeBucket {
  lo: number
  hi: number
  weight: number
}

const SIZE_BUCKETS: SizeBucket[] = [
  // Tiny buds — quite common
  { lo: 0.3, hi: 0.5, weight: 15 },
  // Small flowers — most common
  { lo: 0.6, hi: 1.0, weight: 35 },
  // Medium flowers
  { lo: 1.0, hi: 1.5, weight: 30 },
  // Large blooms — occasional
  { lo: 1.5, hi: 2.0, weight: 14 },
  // Extra-large statement blooms — rare
  { lo: 2.0, hi: 2.5, weight: 6 },
]

const _totalSizeWeight = SIZE_BUCKETS.reduce((s, b) => s + b.weight, 0)
const _cumSizeWeights: number[] = []
{
  let acc = 0
  for (const b of SIZE_BUCKETS) {
    acc += b.weight
    _cumSizeWeights.push(acc)
  }
}

function pickSize(): number {
  const r = Math.random() * _totalSizeWeight
  for (let i = 0; i < _cumSizeWeights.length; i++) {
    if (r < _cumSizeWeights[i]) {
      const b = SIZE_BUCKETS[i]
      return b.lo + Math.random() * (b.hi - b.lo)
    }
  }
  const last = SIZE_BUCKETS[SIZE_BUCKETS.length - 1]
  return last.lo + Math.random() * (last.hi - last.lo)
}

// ---------------------------------------------------------------------------
// FlowerSystem
// ---------------------------------------------------------------------------
const MAX_FLOWERS = 50000

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
      alphaTest: 0.15,
      transparent: true,
      side: THREE.DoubleSide,
      roughness: 0.55,
      metalness: 0.0,
      depthWrite: true,
    })

    this.mesh = new THREE.InstancedMesh(geometry, material, MAX_FLOWERS)
    this.mesh.count = 0
    this.mesh.castShadow = true
    this.mesh.receiveShadow = true
    // InstancedMesh bounding sphere is computed from base geometry (tiny 1x1 plane),
    // not from instance transforms. Disable frustum culling so flowers don't vanish.
    this.mesh.frustumCulled = false

    // Initialize instanceColor — RGBA packed as vec4 via a custom attribute
    // Three.js instanceColor is RGB only, so we encode opacity into the
    // luminance and apply it via a slight color darkening trick. For true
    // per-instance alpha we set transparent on the material and modulate
    // the color brightness to simulate fade.
    const colors = new Float32Array(MAX_FLOWERS * 3)
    for (let i = 0; i < MAX_FLOWERS; i++) {
      colors[i * 3] = 1
      colors[i * 3 + 1] = 1
      colors[i * 3 + 2] = 1
    }
    this.mesh.instanceColor = new THREE.InstancedBufferAttribute(colors, 3)
  }

  /**
   * Place a cluster of sakura flowers around a point.
   *
   * Flowers are distributed with a gaussian-like spread: dense core with
   * sparse outliers, varied sizes, colors, rotations and slight opacity
   * differences for a natural, layered look.
   *
   * @param center  World position
   * @param outward General outward direction from branch
   * @param count   Flowers in this cluster (5-12 typical)
   * @returns Number of flowers actually added
   */
  addCluster(center: THREE.Vector3, outward: THREE.Vector3, count: number): number {
    let added = 0

    for (let i = 0; i < count; i++) {
      if (this.count >= MAX_FLOWERS) break

      // ---- Gaussian spread: tight core, occasional outliers ----------
      // SD ~0.5 produces a dense centre; the clamp at 3.5 stops extreme
      // outliers from flying off into space.
      const spread = Math.abs(gaussClamped(0, 0.55, -3.5, 3.5))
      const jAngle = Math.random() * Math.PI * 2
      const jx = Math.cos(jAngle) * spread
      const jz = Math.sin(jAngle) * spread
      const jy = gaussClamped(0, 0.35, -2.0, 2.0)

      this.dummy.position.set(center.x + jx, center.y + jy, center.z + jz)

      // ---- Rotation: much more varied facing directions ---------------
      // Instead of mostly outward, randomise heavily so flowers point in
      // all directions like real sakura clusters.
      this._tempDir.copy(outward)
      this._tempDir.x += (Math.random() - 0.5) * 1.6
      this._tempDir.y += (Math.random() - 0.5) * 1.4
      this._tempDir.z += (Math.random() - 0.5) * 1.6
      this._tempDir.normalize()

      this.dummy.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        this._tempDir,
      )

      // Extra random twist around the facing axis
      const twistQ = new THREE.Quaternion().setFromAxisAngle(
        this._tempDir, Math.random() * Math.PI * 2,
      )
      this.dummy.quaternion.premultiply(twistQ)

      // Additional random tilt (pitch/roll wobble)
      const tiltAxis = new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5,
      ).normalize()
      const tiltAngle = (Math.random() - 0.5) * Math.PI * 0.5  // up to ~45 deg
      const tiltQ = new THREE.Quaternion().setFromAxisAngle(tiltAxis, tiltAngle)
      this.dummy.quaternion.premultiply(tiltQ)

      // ---- Size: weighted bucket pick ---------------------------------
      const s = pickSize()
      this.dummy.scale.setScalar(s)

      this.dummy.updateMatrix()
      this.mesh.setMatrixAt(this.count, this.dummy.matrix)

      // ---- Color & opacity -------------------------------------------
      const colorDef = pickColor()

      // Per-flower jitter within the palette entry so flowers from the
      // same palette family still differ slightly.
      const jitter = 0.04
      let cr = colorDef.r + (Math.random() - 0.5) * jitter
      let cg = colorDef.g + (Math.random() - 0.5) * jitter
      let cb = colorDef.b + (Math.random() - 0.5) * jitter

      // Simulate per-instance opacity by darkening/lightening the color.
      // Most flowers are fully opaque; some are faded for depth layering.
      // Opacity range: 0.6-1.0, weighted towards opaque.
      const opacity = Math.random() < 0.25
        ? 0.6 + Math.random() * 0.2   // 25% chance: faded (0.6-0.8)
        : 0.85 + Math.random() * 0.15  // 75% chance: near-opaque (0.85-1.0)

      cr *= opacity
      cg *= opacity
      cb *= opacity

      // Clamp to [0, 1]
      cr = Math.max(0, Math.min(1, cr))
      cg = Math.max(0, Math.min(1, cg))
      cb = Math.max(0, Math.min(1, cb))

      this.mesh.setColorAt!(
        this.count,
        new THREE.Color(cr, cg, cb),
      )

      this.count++
      added++
    }

    this.mesh.count = this.count
    this.mesh.instanceMatrix.needsUpdate = true
    if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true

    return added
  }

  /** Clear all flowers (called when tree regenerates and leaf positions move). */
  reset() {
    this.count = 0
    this.mesh.count = 0
    this.mesh.instanceMatrix.needsUpdate = true
    if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true
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
