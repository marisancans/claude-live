/**
 * IncrementalTree — Dynamic sakura tree that grows one event at a time.
 *
 * Architecture:
 *   - Pre-allocated BufferGeometry with drawRange (no rebuilds ever)
 *   - Each event: extend all growing branches by one section + split one tip
 *   - Walk-forward physics (gnarl, twist, force) for organic curves
 *   - Child branches emerge from parent's tip ring → seamless junctions
 *   - Flowers placed at every split point
 *
 * No pre-computed topology. Truly infinite growth.
 */
import * as THREE from 'three'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MAX_VERTICES = 200_000
const MAX_INDICES  = 600_000
const SEGMENTS     = 8                // radial segments per ring
const VERTS_PER_RING = SEGMENTS + 1   // +1 for UV seam closure

// Sakura-tuned per-level parameters (similar to EZ-Tree Ash Medium)
// Negative forceStrength → droop/spread (key for sakura dome shape)
interface LevelParams {
  maxSections: number
  sectionLength: number
  radius: number          // base radius for this level (multiplied by parent)
  taper: number           // 0-1 taper along branch
  gnarl: number           // orientation randomness per step
  twist: number           // twist per step
  maxChildren: number
  angle: number           // branch angle from parent (degrees)
  forceStrength: number   // gravity/phototropism (-ve = droop)
}

const LEVEL_PARAMS: LevelParams[] = [
  // Trunk — thick, tall, slight droop, up to 8 limbs
  { maxSections: 16, sectionLength: 2.4, radius: 1.4, taper: 0.3, gnarl: 0.10, twist: 0.15, maxChildren: 8, angle: 0, forceStrength: -0.02 },
  // Limbs — medium, spreading outward, up to 6 sub-branches
  { maxSections: 12, sectionLength: 1.8, radius: 0.45, taper: 0.65, gnarl: 0.18, twist: -0.07, maxChildren: 6, angle: 42, forceStrength: -0.06 },
  // Sub-branches — thinner, shorter, wider angle
  { maxSections: 8, sectionLength: 1.2, radius: 0.40, taper: 0.7, gnarl: 0.15, twist: 0, maxChildren: 4, angle: 60, forceStrength: -0.08 },
  // Twigs — very thin, short
  { maxSections: 5, sectionLength: 0.8, radius: 0.35, taper: 0.7, gnarl: 0.10, twist: 0, maxChildren: 2, angle: 55, forceStrength: -0.10 },
  // Terminal — tiny, no more children
  { maxSections: 3, sectionLength: 0.5, radius: 0.25, taper: 0.6, gnarl: 0.08, twist: 0, maxChildren: 0, angle: 50, forceStrength: -0.12 },
]

const MAX_LEVEL = LEVEL_PARAMS.length - 1

// Minimum sections before a branch can split; spacing between splits
const MIN_SECTIONS_FOR_SPLIT = 3
const SPLIT_INTERVAL = 2  // sections between consecutive splits on same branch

// ---------------------------------------------------------------------------
// Seeded RNG (same as EzTreeGenerator)
// ---------------------------------------------------------------------------

class SeededRNG {
  private w: number
  private z: number
  constructor(seed: number) {
    this.w = (seed | 0) || 1
    this.z = (seed * 1664525 + 1013904223) | 0 || 1
  }
  random(max = 1, min = 0): number {
    this.z = (36969 * (this.z & 65535) + (this.z >> 16)) | 0
    this.w = (18000 * (this.w & 65535) + (this.w >> 16)) | 0
    let result = ((this.z << 16) + this.w) | 0
    result = (result >>> 0) / 4294967296
    return min + result * (max - min)
  }
}

// ---------------------------------------------------------------------------
// Branch data
// ---------------------------------------------------------------------------

interface LiveBranch {
  id: number
  parentId: number
  level: number

  // Walk-forward state (accumulated each step — produces organic curves)
  tipPosition: THREE.Vector3
  tipOrientation: THREE.Euler

  // Parameters
  levelParams: LevelParams
  baseRadius: number       // actual base radius (parent-scaled)

  // Growth state
  sectionsGenerated: number
  childrenSpawned: number
  lastSplitSection: number // section index of last split (for spacing)
  age: number              // events since birth
  growing: boolean         // still extending?

  // Geometry tracking — ring vertex indices
  firstRingVertex: number
  lastRingVertex: number   // start of most recent ring
}

// ---------------------------------------------------------------------------
// IncrementalTree
// ---------------------------------------------------------------------------

export class IncrementalTree {
  readonly geometry: THREE.BufferGeometry

  private branches: LiveBranch[] = []
  private nextId = 0
  private rng: SeededRNG
  private seed: number

  // Pre-allocated typed arrays
  private positions: Float32Array
  private normalsArr: Float32Array
  private uvsArr: Float32Array
  private indicesArr: Uint32Array

  private vertexCount = 0
  private indexCount = 0

  // Flower positions generated during the latest onEvent()
  private _pendingFlowers: { pos: THREE.Vector3; dir: THREE.Vector3 }[] = []

  constructor(seed = 23399) {
    this.seed = seed
    this.rng = new SeededRNG(seed)

    // Pre-allocate buffers with DynamicDrawUsage for efficient partial updates
    this.positions  = new Float32Array(MAX_VERTICES * 3)
    this.normalsArr = new Float32Array(MAX_VERTICES * 3)
    this.uvsArr     = new Float32Array(MAX_VERTICES * 2)
    this.indicesArr = new Uint32Array(MAX_INDICES)

    this.geometry = new THREE.BufferGeometry()

    const posAttr  = new THREE.BufferAttribute(this.positions, 3);  posAttr.setUsage(THREE.DynamicDrawUsage)
    const normAttr = new THREE.BufferAttribute(this.normalsArr, 3); normAttr.setUsage(THREE.DynamicDrawUsage)
    const uvAttr   = new THREE.BufferAttribute(this.uvsArr, 2);     uvAttr.setUsage(THREE.DynamicDrawUsage)
    const idxAttr  = new THREE.BufferAttribute(this.indicesArr, 1);  idxAttr.setUsage(THREE.DynamicDrawUsage)

    this.geometry.setAttribute('position', posAttr)
    this.geometry.setAttribute('normal', normAttr)
    this.geometry.setAttribute('uv', uvAttr)
    this.geometry.setIndex(idxAttr)
    this.geometry.setDrawRange(0, 0)

    this.seedTree()
  }

  // -----------------------------------------------------------------------
  // Public API
  // -----------------------------------------------------------------------

  /**
   * Called once per event. Extends growing branches, splits one tip,
   * and returns flower positions for newly-split points.
   */
  onEvent(): { pos: THREE.Vector3; dir: THREE.Vector3 }[] {
    if (this.vertexCount + VERTS_PER_RING * (this.growingCount + 2) >= MAX_VERTICES) {
      return [] // buffer full — silently stop
    }

    this._pendingFlowers = []

    // 1. Extend ALL growing branches by one section
    for (const b of this.branches) {
      if (b.growing) this.extendBranch(b)
      b.age++
    }

    // 2. Split one eligible branch (flower at split point)
    this.trySplit()

    // 3. Update geometry draw range + mark buffers dirty
    this.commitGeometry()

    return this._pendingFlowers
  }

  /** Reset to initial sapling state (called on replay). */
  reset() {
    this.branches = []
    this.nextId = 0
    this.vertexCount = 0
    this.indexCount = 0
    this.rng = new SeededRNG(this.seed)
    this.seedTree()
    this.commitGeometry()
  }

  get branchCount(): number { return this.branches.length }

  get growingCount(): number {
    let n = 0
    for (const b of this.branches) if (b.growing) n++
    return n
  }

  // -----------------------------------------------------------------------
  // Initialization
  // -----------------------------------------------------------------------

  private seedTree() {
    // Create trunk with slight random lean
    const leanAngle = 0.06 + this.rng.random(0.06)
    const leanDir = this.rng.random(Math.PI * 2)
    const trunk = this.createBranch(
      new THREE.Vector3(0, 0, 0),
      new THREE.Euler(
        Math.sin(leanDir) * leanAngle,
        0,
        Math.cos(leanDir) * leanAngle,
      ),
      LEVEL_PARAMS[0].radius,
      0,
      -1,
    )

    // Extend trunk a few sections so the sapling is visible immediately
    for (let i = 0; i < MIN_SECTIONS_FOR_SPLIT; i++) {
      this.extendBranch(trunk)
    }

    // First split — a tiny branch so it's a sapling, not a stick
    this.splitBranch(trunk)
  }

  // -----------------------------------------------------------------------
  // Branch creation
  // -----------------------------------------------------------------------

  private createBranch(
    position: THREE.Vector3,
    orientation: THREE.Euler,
    radius: number,
    level: number,
    parentId: number,
  ): LiveBranch {
    const levelIdx = Math.min(level, MAX_LEVEL)
    const params = LEVEL_PARAMS[levelIdx]

    const branch: LiveBranch = {
      id: this.nextId++,
      parentId,
      level,
      tipPosition: position.clone(),
      tipOrientation: orientation.clone(),
      levelParams: params,
      baseRadius: radius,
      sectionsGenerated: 0,
      childrenSpawned: 0,
      lastSplitSection: 0,
      age: 0,
      growing: true,
      firstRingVertex: this.vertexCount,
      lastRingVertex: this.vertexCount,
    }

    // Generate base ring (section 0 — no triangles yet, just the ring)
    this.writeRing(branch, branch.tipPosition, branch.tipOrientation, radius)

    this.branches.push(branch)
    return branch
  }

  // -----------------------------------------------------------------------
  // Extending a branch (walk forward one step)
  // -----------------------------------------------------------------------

  private extendBranch(branch: LiveBranch) {
    if (this.vertexCount + VERTS_PER_RING >= MAX_VERTICES) {
      branch.growing = false
      return
    }

    const p = branch.levelParams
    const t = branch.sectionsGenerated / p.maxSections  // 0→1 progress
    const taper = Math.max(1 - p.taper * t, 0.05)
    const radius = branch.baseRadius * taper
    const stepLength = p.sectionLength

    // Base flare for trunk — wider at ground level
    let flareMultiplier = 1
    if (branch.level === 0 && branch.sectionsGenerated < 3) {
      const flareT = 1 - branch.sectionsGenerated / 3
      flareMultiplier = 1 + 0.6 * flareT * flareT
    }

    // --- Walk-forward physics (same as EZ-Tree) ---

    // Gnarliness: random orientation perturbation (dampened at trunk base)
    const baseDampen = (branch.level === 0 && branch.sectionsGenerated < 3) ? 0.3 : 1.0
    const gnarlScale = p.gnarl * baseDampen / Math.sqrt(Math.max(radius, 0.1))
    branch.tipOrientation.x += this.rng.random(gnarlScale, -gnarlScale)
    branch.tipOrientation.z += this.rng.random(gnarlScale, -gnarlScale)

    // Twist around forward axis
    const q = new THREE.Quaternion().setFromEuler(branch.tipOrientation)
    if (p.twist !== 0) {
      const twistQ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), p.twist)
      q.multiply(twistQ)
    }

    // Force direction (phototropism / gravity)
    // Negative forceStrength → branches droop/spread (key for sakura dome shape)
    const forceQ = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, 1, 0), // force toward sky — combined with negative strength → droop
    )
    q.rotateTowards(forceQ, p.forceStrength / Math.max(radius, 0.1))

    branch.tipOrientation.setFromQuaternion(q)

    // Step forward
    branch.tipPosition.add(
      new THREE.Vector3(0, stepLength, 0).applyEuler(branch.tipOrientation),
    )

    branch.sectionsGenerated++

    // Generate ring at new tip + connect to previous ring
    this.writeRing(branch, branch.tipPosition, branch.tipOrientation, radius * flareMultiplier)

    // Check if branch reached max sections → stop growing
    if (branch.sectionsGenerated >= p.maxSections) {
      branch.growing = false

      // Terminal branches (leaf level) get flowers at their tip
      if (branch.level >= MAX_LEVEL - 1 || branch.childrenSpawned === 0) {
        const dir = new THREE.Vector3(0, 1, 0).applyEuler(branch.tipOrientation)
        this._pendingFlowers.push({ pos: branch.tipPosition.clone(), dir })
      }
    }
  }

  // -----------------------------------------------------------------------
  // Splitting (child branch creation)
  // -----------------------------------------------------------------------

  private trySplit() {
    // Find branches eligible to split
    const candidates: LiveBranch[] = []
    for (const b of this.branches) {
      if (b.level >= MAX_LEVEL) continue
      if (b.childrenSpawned >= b.levelParams.maxChildren) continue
      if (b.sectionsGenerated < MIN_SECTIONS_FOR_SPLIT) continue
      if (b.sectionsGenerated - b.lastSplitSection < SPLIT_INTERVAL && b.childrenSpawned > 0) continue
      candidates.push(b)
    }

    if (candidates.length === 0) return

    // Weighted random: prefer branches that haven't split much yet,
    // and are more mature (more sections)
    let best: LiveBranch | null = null
    let bestScore = -Infinity
    for (const c of candidates) {
      const maturity = c.sectionsGenerated / c.levelParams.maxSections
      const freshness = 1 - c.childrenSpawned / c.levelParams.maxChildren
      const score = maturity * freshness + this.rng.random(0.3) // randomness
      if (score > bestScore) {
        bestScore = score
        best = c
      }
    }

    if (best) this.splitBranch(best)
  }

  private splitBranch(parent: LiveBranch): LiveBranch | null {
    if (this.vertexCount + VERTS_PER_RING * 2 >= MAX_VERTICES) return null

    const childLevel = parent.level + 1
    const childIdx = Math.min(childLevel, MAX_LEVEL)
    const cp = LEVEL_PARAMS[childIdx]

    // Child radius: level radius × parent's current radius at tip
    const parentTaper = Math.max(1 - parent.levelParams.taper * (parent.sectionsGenerated / parent.levelParams.maxSections), 0.05)
    const parentRadius = parent.baseRadius * parentTaper
    const childRadius = Math.max(cp.radius * parentRadius, 0.05)

    // Radial angle around parent — evenly distributed + random phase
    const phase = this.rng.random(Math.PI * 2)
    const radialAngle = (2 * Math.PI * parent.childrenSpawned / Math.max(parent.levelParams.maxChildren, 1)) + phase

    // Branch angle with some randomness
    const branchAngle = cp.angle * (Math.PI / 180) * (0.7 + this.rng.random(0.6))

    // Build child orientation: parent orientation + radial rotation + angular divergence
    const angleQ  = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), branchAngle)
    const radialQ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), radialAngle)
    const parentQ = new THREE.Quaternion().setFromEuler(parent.tipOrientation)
    const childQ  = parentQ.clone().multiply(radialQ.multiply(angleQ))
    const childOrientation = new THREE.Euler().setFromQuaternion(childQ)

    // Create child branch at parent's current tip (seamless junction)
    const child = this.createBranch(
      parent.tipPosition.clone(),
      childOrientation,
      childRadius,
      childLevel,
      parent.id,
    )

    parent.childrenSpawned++
    parent.lastSplitSection = parent.sectionsGenerated

    // Flower at split point
    const dir = new THREE.Vector3(0, 1, 0).applyEuler(parent.tipOrientation)
    this._pendingFlowers.push({ pos: parent.tipPosition.clone(), dir })

    return child
  }

  // -----------------------------------------------------------------------
  // Geometry writing
  // -----------------------------------------------------------------------

  /**
   * Write a ring of vertices at the given position/orientation/radius.
   * If this isn't the branch's first ring, also write triangle indices
   * connecting this ring to the previous one.
   */
  private writeRing(
    branch: LiveBranch,
    center: THREE.Vector3,
    orientation: THREE.Euler,
    radius: number,
  ) {
    const ringStart = this.vertexCount

    let firstVx = 0, firstVy = 0, firstVz = 0
    let firstNx = 0, firstNy = 0, firstNz = 0

    for (let j = 0; j < SEGMENTS; j++) {
      const angle = (2 * Math.PI * j) / SEGMENTS
      const cx = Math.cos(angle)
      const cz = Math.sin(angle)

      // Vertex position: ring point in local space → rotated → translated
      const vx = cx * radius, vy = 0, vz = cz * radius
      const v = new THREE.Vector3(vx, vy, vz).applyEuler(orientation).add(center)
      const n = new THREE.Vector3(cx, 0, cz).applyEuler(orientation).normalize()

      const vi = this.vertexCount
      this.positions[vi * 3]     = v.x
      this.positions[vi * 3 + 1] = v.y
      this.positions[vi * 3 + 2] = v.z
      this.normalsArr[vi * 3]     = n.x
      this.normalsArr[vi * 3 + 1] = n.y
      this.normalsArr[vi * 3 + 2] = n.z
      this.uvsArr[vi * 2]     = j / SEGMENTS
      this.uvsArr[vi * 2 + 1] = branch.sectionsGenerated % 2 === 0 ? 0 : 1
      this.vertexCount++

      if (j === 0) {
        firstVx = v.x; firstVy = v.y; firstVz = v.z
        firstNx = n.x; firstNy = n.y; firstNz = n.z
      }
    }

    // UV seam closure vertex (duplicate of j=0 with u=1)
    {
      const vi = this.vertexCount
      this.positions[vi * 3]     = firstVx
      this.positions[vi * 3 + 1] = firstVy
      this.positions[vi * 3 + 2] = firstVz
      this.normalsArr[vi * 3]     = firstNx
      this.normalsArr[vi * 3 + 1] = firstNy
      this.normalsArr[vi * 3 + 2] = firstNz
      this.uvsArr[vi * 2]     = 1
      this.uvsArr[vi * 2 + 1] = branch.sectionsGenerated % 2 === 0 ? 0 : 1
      this.vertexCount++
    }

    // Connect to previous ring with triangle strip (if there IS a previous ring)
    const hasPrev = ringStart !== branch.firstRingVertex
    if (hasPrev) {
      const prev = branch.lastRingVertex
      for (let j = 0; j < SEGMENTS; j++) {
        const a = prev + j
        const b = prev + j + 1
        const c = ringStart + j + 1
        const d = ringStart + j
        // Winding order matching EZ-Tree (correct face orientation)
        this.indicesArr[this.indexCount++] = a
        this.indicesArr[this.indexCount++] = d
        this.indicesArr[this.indexCount++] = b
        this.indicesArr[this.indexCount++] = b
        this.indicesArr[this.indexCount++] = d
        this.indicesArr[this.indexCount++] = c
      }
    }

    branch.lastRingVertex = ringStart
  }

  /** Push updated draw range + mark all attributes as dirty. */
  private commitGeometry() {
    this.geometry.setDrawRange(0, this.indexCount)

    ;(this.geometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true
    ;(this.geometry.getAttribute('normal')   as THREE.BufferAttribute).needsUpdate = true
    ;(this.geometry.getAttribute('uv')       as THREE.BufferAttribute).needsUpdate = true

    const idx = this.geometry.getIndex()
    if (idx) idx.needsUpdate = true

    this.geometry.computeBoundingSphere()
  }
}
