/**
 * SpaceColonizationTree — Dynamic sakura tree via the Space Colonization Algorithm.
 *
 * Based on Runions et al. 2007 ("Modeling Trees with a Space Colonization Algorithm").
 *
 * Algorithm (per iteration):
 *   1. For each active attractor, find the NEAREST tree node within influence distance
 *   2. For each node with ≥1 associated attractor, compute averaged growth direction
 *   3. Create new child node in that direction (any node can branch, not just tips)
 *   4. Kill attractors within kill distance of new nodes
 *   5. Recalculate radii via pipe model (da Vinci's rule)
 *   6. Write tube geometry for new segments
 *
 * Starts from nothing — each live event drives growth.
 * First events grow the trunk, then SCA branching kicks in.
 */
import * as THREE from 'three'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TreePersonality {
  leanAngle: number        // radians 0–0.44 (0–25°) — how much the whole tree tilts
  leanDirection: number    // radians 0–2π — direction of lean
  gnarliness: number       // 0.8–2.5 — multiplier on gnarl strength at all depths
  windDriftX: number       // -0.06 to 0.06 — horizontal tropism component X
  windDriftZ: number       // -0.06 to 0.06 — horizontal tropism component Z
  hotspots: THREE.Vector3[] // 2–4 attractor cluster centers in base-dome world space (s=1)
}

export interface TreeNode {
  id: number
  position: THREE.Vector3
  parentId: number | null
  childIds: number[]
  radius: number
  depth: number
  distFromRoot: number
  direction: THREE.Vector3
  segmentVertexStart: number
  createdAtEvent: number
  lastPerturbation: THREE.Vector3  // accumulated drift vector (set after node creation)
}

// ---------------------------------------------------------------------------
// Constants — tuned for sakura canopy
// ---------------------------------------------------------------------------

const MAX_VERTICES   = 600_000
const MAX_INDICES    = 1_800_000
const SEGMENTS       = 8
const VERTS_PER_RING = SEGMENTS + 1  // +1 for UV seam closure

// SCA parameters
const INFLUENCE_DISTANCE = 22       // tighter = more distinct branching
const KILL_DISTANCE      = 5.0
const SEGMENT_LENGTH     = 2.0
const DOME_EXPAND_INTERVAL = 50     // expand dome every N events
const DOME_EXPAND_RATE     = 0.04   // how much to grow envelopeScale each interval

// Crown envelope — dome positioned for clear trunk then canopy
const DOME_CENTER_Y      = 38
const DOME_RADIUS_XZ     = 48       // wide horizontal spread
const DOME_RADIUS_Y      = 28       // flatter top
const INITIAL_ATTRACTORS = 2000
const REFILL_THRESHOLD   = 200
const REFILL_BATCH       = 800

// Pipe model
const PIPE_EXPONENT = 2.0    // da Vinci's rule (area-preserving)
const TIP_RADIUS    = 0.05
const MAX_RADIUS    = 3.5

// Tropism — sakura branches droop outward
const TROPISM_START_DEPTH = 2       // start drooping after this depth (sooner = whole-tree bend)
const TROPISM_STRENGTH    = 0.06    // how much gravity pull

// Flowers — depth 2+ gets blossoms (trunk base stays bare)
const FLOWER_MIN_DEPTH = 2

// Trunk
const TRUNK_BASE_RADIUS = 1.2

// Growth — one segment per event for visible incremental growth
const STEPS_PER_EVENT    = 1

// UV scale: bark texture repeats every this many world units along the branch
const UV_Y_SCALE = 30.0

// ---------------------------------------------------------------------------
// Seeded RNG (reproducible)
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
// Spatial grid for fast neighbor lookups
// ---------------------------------------------------------------------------

class SpatialGrid {
  private cells = new Map<string, number[]>()
  private cellSize: number

  constructor(cellSize: number) {
    this.cellSize = cellSize
  }

  private key(x: number, y: number, z: number): string {
    const cx = Math.floor(x / this.cellSize)
    const cy = Math.floor(y / this.cellSize)
    const cz = Math.floor(z / this.cellSize)
    return `${cx},${cy},${cz}`
  }

  clear() { this.cells.clear() }

  insert(index: number, p: THREE.Vector3) {
    const k = this.key(p.x, p.y, p.z)
    const arr = this.cells.get(k)
    if (arr) arr.push(index); else this.cells.set(k, [index])
  }

  queryRadius(p: THREE.Vector3, radius: number): number[] {
    const result: number[] = []
    const r = radius
    const cs = this.cellSize
    const minCx = Math.floor((p.x - r) / cs)
    const maxCx = Math.floor((p.x + r) / cs)
    const minCy = Math.floor((p.y - r) / cs)
    const maxCy = Math.floor((p.y + r) / cs)
    const minCz = Math.floor((p.z - r) / cs)
    const maxCz = Math.floor((p.z + r) / cs)
    for (let cx = minCx; cx <= maxCx; cx++) {
      for (let cy = minCy; cy <= maxCy; cy++) {
        for (let cz = minCz; cz <= maxCz; cz++) {
          const arr = this.cells.get(`${cx},${cy},${cz}`)
          if (arr) {
            for (const idx of arr) result.push(idx)
          }
        }
      }
    }
    return result
  }
}

// ---------------------------------------------------------------------------
// SpaceColonizationTree
// ---------------------------------------------------------------------------

export class SpaceColonizationTree {
  readonly geometry: THREE.BufferGeometry

  // Skeleton
  private nodes: TreeNode[] = []
  private nodeMap = new Map<number, TreeNode>()
  private nextNodeId = 0

  // Attractors
  private attractors: { position: THREE.Vector3; active: boolean }[] = []

  // Spatial grids
  private nodeGrid: SpatialGrid

  // Envelope growth
  private envelopeScale = 1.0

  private personality!: TreePersonality
  private rng: SeededRNG
  private seed: number
  private eventCounter = 0
  private activeAttractors = 0

  // Pre-allocated geometry buffers
  private positions:  Float32Array
  private normalsArr: Float32Array
  private uvsArr:     Float32Array
  private indicesArr:  Uint32Array
  private vertexCount = 0
  private indexCount   = 0

  constructor(seed = 23399) {
    this.seed = seed
    this.rng = new SeededRNG(seed)
    this.nodeGrid = new SpatialGrid(INFLUENCE_DISTANCE)

    this.positions  = new Float32Array(MAX_VERTICES * 3)
    this.normalsArr = new Float32Array(MAX_VERTICES * 3)
    this.uvsArr     = new Float32Array(MAX_VERTICES * 2)
    this.indicesArr = new Uint32Array(MAX_INDICES)

    this.geometry = new THREE.BufferGeometry()
    const pa = new THREE.BufferAttribute(this.positions, 3);  pa.setUsage(THREE.DynamicDrawUsage)
    const na = new THREE.BufferAttribute(this.normalsArr, 3);  na.setUsage(THREE.DynamicDrawUsage)
    const ua = new THREE.BufferAttribute(this.uvsArr, 2);      ua.setUsage(THREE.DynamicDrawUsage)
    const ia = new THREE.BufferAttribute(this.indicesArr, 1);   ia.setUsage(THREE.DynamicDrawUsage)
    this.geometry.setAttribute('position', pa)
    this.geometry.setAttribute('normal', na)
    this.geometry.setAttribute('uv', ua)
    this.geometry.setIndex(ia)
    this.geometry.setDrawRange(0, 0)

    this.init()
  }

  // -----------------------------------------------------------------------
  // Public API
  // -----------------------------------------------------------------------

  /**
   * Run growth iterations triggered by a live event.
   * Returns flower positions for new branch tips and IDs of newly created nodes.
   */
  onEvent(): { flowers: { pos: THREE.Vector3; dir: THREE.Vector3 }[]; newNodeIds: number[] } {
    const allFlowers: { pos: THREE.Vector3; dir: THREE.Vector3 }[] = []
    const allNodeIds: number[] = []
    for (let i = 0; i < STEPS_PER_EVENT; i++) {
      const { flowers, newNodeIds } = this.growOneStep(true)
      allFlowers.push(...flowers)
      allNodeIds.push(...newNodeIds)
    }
    return { flowers: allFlowers, newNodeIds: allNodeIds }
  }

  reset() {
    this.nodes = []
    this.nodeMap.clear()
    this.nextNodeId = 0
    this.attractors = []
    this.activeAttractors = 0
    this.vertexCount = 0
    this.indexCount = 0
    this.eventCounter = 0
    this.envelopeScale = 1.0
    this.rng = new SeededRNG(this.seed)
    this.init()
    this.commitGeometry()
  }

  traceToRoot(nodeId: number): number[] {
    const path: number[] = []
    let current = this.nodeMap.get(nodeId)
    while (current) {
      path.unshift(current.id)
      current = current.parentId !== null ? this.nodeMap.get(current.parentId) : undefined
    }
    return path
  }

  getNode(id: number): TreeNode | undefined {
    return this.nodeMap.get(id)
  }

  get nodeCount(): number { return this.nodes.length }

  get totalEvents(): number { return this.eventCounter }

  get isCapped(): boolean {
    return this.vertexCount + VERTS_PER_RING * 60 >= MAX_VERTICES
  }

  /** Returns positions root→tip for a random leaf node, for fallback sap pulses. */
  getRandomLeafPath(): THREE.Vector3[] | null {
    const tips = this.nodes.filter(n => n.childIds.length === 0)
    if (tips.length === 0) return null
    const tip = tips[Math.floor(Math.random() * tips.length)]
    return this.traceToRoot(tip.id)
      .map(id => this.nodeMap.get(id))
      .filter((n): n is TreeNode => n !== undefined)
      .map(n => n.position.clone())
  }

  get activeAttractorCount(): number {
    return this.activeAttractors
  }

  /** Return flower positions for the pre-grown tree — tips and outer branch nodes. */
  getTipFlowerPositions(): { pos: THREE.Vector3; dir: THREE.Vector3; isTip: boolean }[] {
    const result: { pos: THREE.Vector3; dir: THREE.Vector3; isTip: boolean }[] = []
    for (const node of this.nodes) {
      if (node.depth < FLOWER_MIN_DEPTH) continue
      const isTip = node.childIds.length === 0
      // Tips always get flowers; interior nodes get them probabilistically (denser canopy)
      if (isTip || node.depth >= 5) {
        result.push({ pos: node.position.clone(), dir: node.direction.clone(), isTip })
      }
    }
    return result
  }

  // -----------------------------------------------------------------------
  // Initialization
  // -----------------------------------------------------------------------

  private init() {
    this.personality = this.derivePersonality()
    this.scatterAttractors(INITIAL_ATTRACTORS)

    // Root: slight seed-derived tilt so trunk doesn't start perfectly vertical
    const tiltMag = 0.052 + this.personality.leanAngle * 0.15  // ~3° base
    const rootDir = new THREE.Vector3(
      Math.sin(tiltMag) * Math.cos(this.personality.leanDirection),
      Math.cos(tiltMag),
      Math.sin(tiltMag) * Math.sin(this.personality.leanDirection),
    ).normalize()
    const root: TreeNode = {
      id: this.nextNodeId++,
      position: new THREE.Vector3(0, 0, 0),
      parentId: null,
      childIds: [],
      radius: TRUNK_BASE_RADIUS,
      depth: 0,
      distFromRoot: 0,
      direction: rootDir,
      segmentVertexStart: -1,
      createdAtEvent: 0,
      lastPerturbation: new THREE.Vector3(),
    }
    this.nodes.push(root)
    this.nodeMap.set(root.id, root)
  }

  /** Box-Muller transform using the seeded RNG. Produces std-normal variate. */
  private gaussRng(): number {
    const u = Math.max(1e-10, this.rng.random())
    const v = this.rng.random()
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
  }

  /** Returns gnarl strength for a given node depth — heavier on trunk, lighter on tips. */
  private gnarlForDepth(depth: number): number {
    const g = this.personality.gnarliness
    if (depth <= 5)  return (0.35 + Math.min(depth, 5) * 0.02) * g  // 0.35–0.45 × gnarliness
    if (depth <= 12) return 0.18 * g
    return 0.10 * g
  }

  private derivePersonality(): TreePersonality {
    const leanAngle     = this.rng.random(0.44, 0.05)       // 3–25° in radians
    const leanDirection = this.rng.random(Math.PI * 2, 0)
    const gnarliness    = this.rng.random(2.5, 0.8)
    const windDriftX    = (this.rng.random() - 0.5) * 0.12
    const windDriftZ    = (this.rng.random() - 0.5) * 0.12

    // 2–4 hotspot cluster centers in base-dome world space (envelopeScale=1)
    const hotspotCount = 2 + Math.floor(this.rng.random() * 3)
    const hotspots: THREE.Vector3[] = []
    const rxz = DOME_RADIUS_XZ, ry = DOME_RADIUS_Y, cy = DOME_CENTER_Y
    for (let i = 0; i < hotspotCount; i++) {
      let x = 0, y = 0, z = 0, tries = 0
      do {
        x = (this.rng.random() * 2 - 1) * rxz
        y = (this.rng.random() * 2 - 1) * ry + cy
        z = (this.rng.random() * 2 - 1) * rxz
        tries++
      } while ((x * x / (rxz * rxz) + (y - cy) * (y - cy) / (ry * ry) + z * z / (rxz * rxz) > 1 || y < 15) && tries < 50)
      hotspots.push(new THREE.Vector3(x, y, z))
    }

    return { leanAngle, leanDirection, gnarliness, windDriftX, windDriftZ, hotspots }
  }

  private scatterAttractors(count: number) {
    const s   = this.envelopeScale
    const rxz = DOME_RADIUS_XZ * s
    const ry  = DOME_RADIUS_Y  * s
    const cy  = DOME_CENTER_Y  * s

    // Lean shear factors (applied to every attractor position)
    const leanX = Math.sin(this.personality.leanAngle) * Math.cos(this.personality.leanDirection)
    const leanZ = Math.sin(this.personality.leanAngle) * Math.sin(this.personality.leanDirection)

    const hotspotCount = Math.floor(count * 0.6)
    const uniformCount = count - hotspotCount

    // --- 60% hotspot-clustered ---
    let added = 0, attempts = 0
    const sigma = rxz * 0.3
    while (added < hotspotCount && attempts < hotspotCount * 30) {
      attempts++
      const hs = this.personality.hotspots[Math.floor(this.rng.random() * this.personality.hotspots.length)]
      const hx = hs.x * s, hy = hs.y * s, hz = hs.z * s

      const x = hx + this.gaussRng() * sigma
      const y = hy + this.gaussRng() * sigma * 0.5
      const z = hz + this.gaussRng() * sigma

      const nx = x / rxz, ny = (y - cy) / ry, nz = z / rxz
      if (nx * nx + ny * ny + nz * nz > 1) continue
      if (y < 12) continue

      // Apply lean shear
      const fx = x + (y - cy) * leanX
      const fz = z + (y - cy) * leanZ
      this.attractors.push({ position: new THREE.Vector3(fx, y, fz), active: true })
      added++
    }

    // --- 40% uniform fill ---
    let uAdded = 0
    while (uAdded < uniformCount) {
      const x = (this.rng.random() * 2 - 1) * rxz
      const y = (this.rng.random() * 2 - 1) * ry + cy
      const z = (this.rng.random() * 2 - 1) * rxz
      const nx = x / rxz, ny = (y - cy) / ry, nz = z / rxz
      if (nx * nx + ny * ny + nz * nz > 1) continue
      if (y < 12) continue

      const fx = x + (y - cy) * leanX
      const fz = z + (y - cy) * leanZ
      this.attractors.push({ position: new THREE.Vector3(fx, y, fz), active: true })
      uAdded++
    }

    // Track active count (added = hotspot successes + uniformCount)
    this.activeAttractors += added + uAdded
  }

  // -----------------------------------------------------------------------
  // Core SCA growth step — one iteration
  // -----------------------------------------------------------------------

  private growOneStep(emitFlowers: boolean): { flowers: { pos: THREE.Vector3; dir: THREE.Vector3 }[]; newNodeIds: number[] } {
    this.eventCounter++
    // Periodic dome expansion so the tree always has new frontier
    if (this.eventCounter % DOME_EXPAND_INTERVAL === 0) {
      this.envelopeScale += DOME_EXPAND_RATE
    }
    const pendingFlowers: { pos: THREE.Vector3; dir: THREE.Vector3 }[] = []
    const newNodeIds: number[] = []
    const result = { flowers: pendingFlowers, newNodeIds }

    if (this.vertexCount + VERTS_PER_RING * 60 >= MAX_VERTICES) {
      console.warn(`[SCA] vertex cap reached: ${this.vertexCount}/${MAX_VERTICES} (${this.nodes.length} nodes, event ${this.eventCounter})`)
      return result
    }

    // Rebuild node spatial grid (all nodes, not just tips)
    this.nodeGrid.clear()
    for (const node of this.nodes) {
      this.nodeGrid.insert(node.id, node.position)
    }

    // Step 1: Associate each active attractor with its NEAREST tree node
    // (Paper: open venation — each attractor → single closest node)
    const associations = new Map<number, THREE.Vector3[]>()

    const influenceDist2 = INFLUENCE_DISTANCE * INFLUENCE_DISTANCE
    for (const att of this.attractors) {
      if (!att.active) continue

      // Use spatial grid to find candidate nodes near this attractor
      const candidateIds = this.nodeGrid.queryRadius(att.position, INFLUENCE_DISTANCE)

      let bestNodeId = -1
      let bestDist2 = influenceDist2
      for (const nid of candidateIds) {
        const node = this.nodeMap.get(nid)!
        const d2 = node.position.distanceToSquared(att.position)
        if (d2 < bestDist2) {
          bestDist2 = d2
          bestNodeId = nid
        }
      }

      if (bestNodeId >= 0) {
        const arr = associations.get(bestNodeId) ?? []
        arr.push(att.position)
        associations.set(bestNodeId, arr)
      }
    }

    // Step 2: No associations → grow trunk upward (pre-canopy phase)
    if (associations.size === 0) {
      const trunkNode = this.growTrunkUpward()
      newNodeIds.push(trunkNode.id)
      if (emitFlowers && trunkNode.depth >= FLOWER_MIN_DEPTH) {
        pendingFlowers.push({ pos: trunkNode.position.clone(), dir: trunkNode.direction.clone() })
      }
      // Refill attractors in trunk phase too (was only in SCA phase before)
      if (this.activeAttractors < REFILL_THRESHOLD) {
        this.envelopeScale += 0.12
        this.scatterAttractors(REFILL_BATCH)
      }
      this.commitGeometry()
      return result
    }

    // Step 3: Grow — SINGLE best node (most attractor associations, tie-break by depth)
    let bestNodeId = -1, bestCount = 0, bestDepth = -1
    for (const [nodeId, attPositions] of associations.entries()) {
      const n = this.nodeMap.get(nodeId)!
      if (attPositions.length > bestCount ||
          (attPositions.length === bestCount && n.depth > bestDepth)) {
        bestNodeId = nodeId
        bestCount = attPositions.length
        bestDepth = n.depth
      }
    }
    if (bestNodeId < 0) {
      this.commitGeometry()
      return result
    }

    const node = this.nodeMap.get(bestNodeId)!
    const attPositions = associations.get(bestNodeId)!

    // Average normalized direction toward associated attractors
    const avgDir = new THREE.Vector3()
    for (const ap of attPositions) {
      avgDir.add(new THREE.Vector3().subVectors(ap, node.position).normalize())
    }
    avgDir.divideScalar(attPositions.length).normalize()

    // Depth-weighted gnarl + accumulated drift (S-curves from parent perturbation)
    const gnarl = this.gnarlForDepth(node.depth)
    const rx = (this.rng.random() - 0.5) * gnarl
    const ry_p = (this.rng.random() - 0.5) * gnarl * 0.5
    const rz = (this.rng.random() - 0.5) * gnarl

    // Inherit 20% of parent's last perturbation for flowing S-curves
    const drift = node.lastPerturbation
    avgDir.x += rx + drift.x * 0.2
    avgDir.y += ry_p + drift.y * 0.2
    avgDir.z += rz + drift.z * 0.2

    // Tropism — gravity droop + horizontal wind drift (starts earlier = whole-tree bend)
    if (node.depth > TROPISM_START_DEPTH) {
      const tropismFactor = Math.min(1, (node.depth - TROPISM_START_DEPTH) / 10)
      avgDir.y -= TROPISM_STRENGTH * tropismFactor
      avgDir.x += this.personality.windDriftX * tropismFactor
      avgDir.z += this.personality.windDriftZ * tropismFactor
    }

    avgDir.normalize()

    const newPos = node.position.clone().addScaledVector(avgDir, SEGMENT_LENGTH)
    const newNode = this.createNode(newPos, avgDir, node)
    newNode.lastPerturbation = new THREE.Vector3(
      rx + drift.x * 0.2,
      ry_p + drift.y * 0.2,
      rz + drift.z * 0.2,
    )

    // Collect new node ID for sap pulse
    newNodeIds.push(newNode.id)

    // Step 4: Kill attractors within kill distance of the new node
    const killDist2 = KILL_DISTANCE * KILL_DISTANCE
    for (const att of this.attractors) {
      if (!att.active) continue
      if (newNode.position.distanceToSquared(att.position) < killDist2) {
        att.active = false
        this.activeAttractors--
      }
    }

    // Step 5: Update radii (pipe model — walk from new node to root)
    this.updateRadiiToRoot(newNode)

    // Step 6: Write tube geometry for new segment
    this.writeSegment(newNode)

    // Step 7: Update ancestor ring geometry (radii changed from pipe model)
    this.updateAncestorGeometry(newNode)

    // Step 8: Flower position (deeper branches only, if requested)
    if (emitFlowers && newNode.depth >= FLOWER_MIN_DEPTH) {
      pendingFlowers.push({ pos: newNode.position.clone(), dir: newNode.direction.clone() })
    }

    // Step 9: Refill attractors if running low
    if (this.activeAttractors < REFILL_THRESHOLD) {
      this.envelopeScale += 0.12
      this.scatterAttractors(REFILL_BATCH)
    }

    this.commitGeometry()
    return result
  }

  // -----------------------------------------------------------------------
  // Node creation
  // -----------------------------------------------------------------------

  private createNode(position: THREE.Vector3, direction: THREE.Vector3, parent: TreeNode): TreeNode {
    const node: TreeNode = {
      id: this.nextNodeId++,
      position: position.clone(),
      parentId: parent.id,
      childIds: [],
      radius: TIP_RADIUS,
      depth: parent.depth + 1,
      distFromRoot: parent.distFromRoot + SEGMENT_LENGTH,
      direction: direction.clone(),
      segmentVertexStart: -1,
      createdAtEvent: this.eventCounter,
      lastPerturbation: new THREE.Vector3(),  // caller sets this after creation
    }
    parent.childIds.push(node.id)
    this.nodes.push(node)
    this.nodeMap.set(node.id, node)
    return node
  }

  private growTrunkUpward(): TreeNode {
    let tip = this.nodes[this.nodes.length - 1]
    for (const n of this.nodes) {
      if (n.childIds.length === 0 && n.position.y > tip.position.y) tip = n
    }

    const dir = new THREE.Vector3(
      (this.rng.random() - 0.5) * 0.06,
      1,
      (this.rng.random() - 0.5) * 0.06,
    ).normalize()

    const newPos = tip.position.clone().addScaledVector(dir, SEGMENT_LENGTH)
    const node = this.createNode(newPos, dir, tip)
    node.lastPerturbation = new THREE.Vector3()  // trunk drift stays zero — already has direction noise
    this.updateRadiiToRoot(node)
    this.writeSegment(node)
    this.updateAncestorGeometry(node)
    return node
  }

  // -----------------------------------------------------------------------
  // Pipe model — radii (da Vinci's rule)
  // -----------------------------------------------------------------------

  private updateRadiiToRoot(startNode: TreeNode) {
    startNode.radius = TIP_RADIUS

    let current: TreeNode | undefined = startNode.parentId !== null
      ? this.nodeMap.get(startNode.parentId)
      : undefined

    while (current) {
      let sumPow = 0
      for (const childId of current.childIds) {
        const child = this.nodeMap.get(childId)!
        sumPow += Math.pow(child.radius, PIPE_EXPONENT)
      }
      const newRadius = Math.min(MAX_RADIUS, Math.pow(sumPow, 1 / PIPE_EXPONENT))
      if (Math.abs(newRadius - current.radius) < 0.001) break
      current.radius = newRadius

      current = current.parentId !== null ? this.nodeMap.get(current.parentId) : undefined
    }
  }

  // -----------------------------------------------------------------------
  // Geometry writing
  // -----------------------------------------------------------------------

  private writeSegment(node: TreeNode) {
    if (node.parentId === null) return
    const parent = this.nodeMap.get(node.parentId)!

    if (this.vertexCount + VERTS_PER_RING * 2 >= MAX_VERTICES) return
    if (this.indexCount + SEGMENTS * 6 >= MAX_INDICES) return

    node.segmentVertexStart = this.vertexCount

    const dir = node.direction
    const parentRadius = parent.radius
    const nodeRadius = node.radius

    // UV.y based on cumulative distance from root (continuous along branch)
    const parentUvY = parent.distFromRoot / UV_Y_SCALE
    const nodeUvY   = node.distFromRoot / UV_Y_SCALE

    // Start ring (parent position, parent radius)
    const startRing = this.vertexCount
    this.writeRing(parent.position, dir, parentRadius, parentUvY)

    // End ring (node position, node radius)
    const endRing = this.vertexCount
    this.writeRing(node.position, dir, nodeRadius, nodeUvY)

    // Triangle strip connecting rings
    for (let j = 0; j < SEGMENTS; j++) {
      const a = startRing + j
      const b = startRing + j + 1
      const c = endRing + j + 1
      const d = endRing + j
      this.indicesArr[this.indexCount++] = a
      this.indicesArr[this.indexCount++] = d
      this.indicesArr[this.indexCount++] = b
      this.indicesArr[this.indexCount++] = b
      this.indicesArr[this.indexCount++] = d
      this.indicesArr[this.indexCount++] = c
    }
  }

  private writeRing(center: THREE.Vector3, direction: THREE.Vector3, radius: number, uvY: number) {
    const up = new THREE.Vector3(0, 1, 0)
    const q = new THREE.Quaternion()
    if (Math.abs(direction.dot(up)) > 0.999) {
      q.setFromUnitVectors(up, direction.y > 0 ? up : new THREE.Vector3(0, -1, 0))
    } else {
      q.setFromUnitVectors(up, direction)
    }
    const orientation = new THREE.Euler().setFromQuaternion(q)

    let firstVx = 0, firstVy = 0, firstVz = 0
    let firstNx = 0, firstNy = 0, firstNz = 0

    for (let j = 0; j < SEGMENTS; j++) {
      const angle = (2 * Math.PI * j) / SEGMENTS
      const cx = Math.cos(angle)
      const cz = Math.sin(angle)
      const v = new THREE.Vector3(cx * radius, 0, cz * radius).applyEuler(orientation).add(center)
      const n = new THREE.Vector3(cx, 0, cz).applyEuler(orientation).normalize()

      const vi = this.vertexCount
      this.positions[vi * 3]     = v.x
      this.positions[vi * 3 + 1] = v.y
      this.positions[vi * 3 + 2] = v.z
      this.normalsArr[vi * 3]     = n.x
      this.normalsArr[vi * 3 + 1] = n.y
      this.normalsArr[vi * 3 + 2] = n.z
      this.uvsArr[vi * 2]     = j / SEGMENTS
      this.uvsArr[vi * 2 + 1] = uvY
      this.vertexCount++

      if (j === 0) { firstVx = v.x; firstVy = v.y; firstVz = v.z; firstNx = n.x; firstNy = n.y; firstNz = n.z }
    }

    // UV seam closure vertex
    const vi = this.vertexCount
    this.positions[vi * 3]     = firstVx
    this.positions[vi * 3 + 1] = firstVy
    this.positions[vi * 3 + 2] = firstVz
    this.normalsArr[vi * 3]     = firstNx
    this.normalsArr[vi * 3 + 1] = firstNy
    this.normalsArr[vi * 3 + 2] = firstNz
    this.uvsArr[vi * 2]     = 1
    this.uvsArr[vi * 2 + 1] = uvY
    this.vertexCount++
  }

  private updateAncestorGeometry(startNode: TreeNode) {
    let current: TreeNode | undefined = startNode.parentId !== null
      ? this.nodeMap.get(startNode.parentId)
      : undefined

    while (current) {
      for (const childId of current.childIds) {
        const child = this.nodeMap.get(childId)!
        if (child.segmentVertexStart < 0) continue

        // Start ring uses parent radius
        const ringStart = child.segmentVertexStart
        this.updateRingRadius(ringStart, current.position, child.direction, current.radius)

        // End ring uses child radius
        const endRingStart = ringStart + VERTS_PER_RING
        if (endRingStart + VERTS_PER_RING <= this.vertexCount) {
          this.updateRingRadius(endRingStart, child.position, child.direction, child.radius)
        }
      }

      current = current.parentId !== null ? this.nodeMap.get(current.parentId) : undefined
    }
  }

  private updateRingRadius(ringStart: number, center: THREE.Vector3, direction: THREE.Vector3, radius: number) {
    const up = new THREE.Vector3(0, 1, 0)
    const q = new THREE.Quaternion()
    if (Math.abs(direction.dot(up)) > 0.999) {
      q.setFromUnitVectors(up, direction.y > 0 ? up : new THREE.Vector3(0, -1, 0))
    } else {
      q.setFromUnitVectors(up, direction)
    }
    const orientation = new THREE.Euler().setFromQuaternion(q)

    for (let j = 0; j <= SEGMENTS; j++) {
      const angle = (2 * Math.PI * (j % SEGMENTS)) / SEGMENTS
      const cx = Math.cos(angle)
      const cz = Math.sin(angle)
      const v = new THREE.Vector3(cx * radius, 0, cz * radius).applyEuler(orientation).add(center)

      const vi = ringStart + j
      if (vi >= this.vertexCount) break
      this.positions[vi * 3]     = v.x
      this.positions[vi * 3 + 1] = v.y
      this.positions[vi * 3 + 2] = v.z
    }
  }

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
