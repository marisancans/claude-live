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
 * Pre-grows ~150 iterations on init so the tree is visible immediately.
 * Each live event grows 2 additional iterations.
 */
import * as THREE from 'three'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TreeNode {
  id: number
  position: THREE.Vector3
  parentId: number | null
  childIds: number[]
  radius: number
  depth: number                 // edges from root (0 = root)
  distFromRoot: number          // cumulative arc length from root
  direction: THREE.Vector3
  segmentVertexStart: number    // first vertex of the tube segment (parent→this)
  createdAtEvent: number
}

// ---------------------------------------------------------------------------
// Constants — tuned for sakura canopy
// ---------------------------------------------------------------------------

const MAX_VERTICES   = 300_000
const MAX_INDICES    = 900_000
const SEGMENTS       = 8
const VERTS_PER_RING = SEGMENTS + 1  // +1 for UV seam closure

// SCA parameters
const INFLUENCE_DISTANCE = 22       // tighter = more distinct branching
const KILL_DISTANCE      = 5.0
const SEGMENT_LENGTH     = 2.0
const GNARL_STRENGTH     = 0.14     // random perturbation for organic curves

// Crown envelope — wide dome for sakura canopy shape
const DOME_CENTER_Y      = 42
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
const TROPISM_START_DEPTH = 4       // start drooping after this depth
const TROPISM_STRENGTH    = 0.06    // how much gravity pull

// Flowers
const FLOWER_MIN_DEPTH = 3

// Trunk
const TRUNK_BASE_RADIUS = 1.2
const TRUNK_PRE_SECTIONS = 6        // initial trunk height before SCA

// Growth
const PREGROW_ITERATIONS = 150
const STEPS_PER_EVENT    = 2

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

  private rng: SeededRNG
  private seed: number
  private eventCounter = 0

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
   * Returns flower positions for new branch tips.
   */
  onEvent(): { pos: THREE.Vector3; dir: THREE.Vector3 }[] {
    const allFlowers: { pos: THREE.Vector3; dir: THREE.Vector3 }[] = []
    for (let i = 0; i < STEPS_PER_EVENT; i++) {
      const flowers = this.growOneStep(true)
      allFlowers.push(...flowers)
    }
    return allFlowers
  }

  reset() {
    this.nodes = []
    this.nodeMap.clear()
    this.nextNodeId = 0
    this.attractors = []
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

  get activeAttractorCount(): number {
    let n = 0
    for (const a of this.attractors) if (a.active) n++
    return n
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
    this.scatterAttractors(INITIAL_ATTRACTORS)

    // Root at ground level
    const rootDir = new THREE.Vector3(0, 1, 0)
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
    }
    this.nodes.push(root)
    this.nodeMap.set(root.id, root)

    // Pre-grow trunk so it reaches attractor zone
    for (let i = 0; i < TRUNK_PRE_SECTIONS; i++) {
      this.growTrunkUpward()
    }

    // Pre-grow tree with SCA — makes a full tree visible on load
    for (let i = 0; i < PREGROW_ITERATIONS; i++) {
      this.growOneStep(false) // no flowers during pre-growth
    }

    this.commitGeometry()
  }

  private scatterAttractors(count: number) {
    const s = this.envelopeScale
    const rxz = DOME_RADIUS_XZ * s
    const ry  = DOME_RADIUS_Y * s
    const cy  = DOME_CENTER_Y * s
    let added = 0

    while (added < count) {
      const x = (this.rng.random() * 2 - 1) * rxz
      const y = (this.rng.random() * 2 - 1) * ry + cy
      const z = (this.rng.random() * 2 - 1) * rxz

      // Reject if outside ellipsoid
      const nx = x / rxz, ny = (y - cy) / ry, nz = z / rxz
      if (nx * nx + ny * ny + nz * nz > 1) continue

      // Keep canopy above ground
      if (y < 6) continue

      this.attractors.push({ position: new THREE.Vector3(x, y, z), active: true })
      added++
    }
  }

  // -----------------------------------------------------------------------
  // Core SCA growth step — one iteration
  // -----------------------------------------------------------------------

  private growOneStep(emitFlowers: boolean): { pos: THREE.Vector3; dir: THREE.Vector3 }[] {
    this.eventCounter++
    const pendingFlowers: { pos: THREE.Vector3; dir: THREE.Vector3 }[] = []

    if (this.vertexCount + VERTS_PER_RING * 60 >= MAX_VERTICES) return pendingFlowers

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
      this.growTrunkUpward()
      this.commitGeometry()
      return pendingFlowers
    }

    // Step 3: Grow — for each associated node, create a new child
    const newNodes: TreeNode[] = []
    for (const [nodeId, attPositions] of associations) {
      const node = this.nodeMap.get(nodeId)!

      // Average normalized direction toward all associated attractors
      const avgDir = new THREE.Vector3()
      for (const ap of attPositions) {
        avgDir.add(new THREE.Vector3().subVectors(ap, node.position).normalize())
      }
      avgDir.divideScalar(attPositions.length).normalize()

      // Organic gnarl (random perturbation)
      avgDir.x += (this.rng.random() - 0.5) * GNARL_STRENGTH
      avgDir.y += (this.rng.random() - 0.5) * GNARL_STRENGTH * 0.5
      avgDir.z += (this.rng.random() - 0.5) * GNARL_STRENGTH

      // Tropism — sakura branches droop on outer/deeper branches
      if (node.depth > TROPISM_START_DEPTH) {
        const tropismFactor = Math.min(1, (node.depth - TROPISM_START_DEPTH) / 10)
        avgDir.y -= TROPISM_STRENGTH * tropismFactor
      }

      avgDir.normalize()

      const newPos = node.position.clone().addScaledVector(avgDir, SEGMENT_LENGTH)
      const newNode = this.createNode(newPos, avgDir, node)
      newNodes.push(newNode)
    }

    // Step 4: Kill attractors within kill distance of any NEW node
    const killDist2 = KILL_DISTANCE * KILL_DISTANCE
    for (const att of this.attractors) {
      if (!att.active) continue
      for (const nn of newNodes) {
        if (nn.position.distanceToSquared(att.position) < killDist2) {
          att.active = false
          break
        }
      }
    }

    // Step 5: Update radii (pipe model — walk from new nodes to root)
    for (const nn of newNodes) {
      this.updateRadiiToRoot(nn)
    }

    // Step 6: Write tube geometry for new segments
    for (const nn of newNodes) {
      this.writeSegment(nn)
    }

    // Step 7: Update ancestor ring geometry (radii changed from pipe model)
    for (const nn of newNodes) {
      this.updateAncestorGeometry(nn)
    }

    // Step 8: Flower positions (deeper branches only, only if requested)
    if (emitFlowers) {
      for (const nn of newNodes) {
        if (nn.depth >= FLOWER_MIN_DEPTH) {
          pendingFlowers.push({ pos: nn.position.clone(), dir: nn.direction.clone() })
        }
      }
    }

    // Step 9: Refill attractors if running low
    const activeCount = this.attractors.filter(a => a.active).length
    if (activeCount < REFILL_THRESHOLD) {
      this.envelopeScale += 0.12
      this.scatterAttractors(REFILL_BATCH)
    }

    this.commitGeometry()
    return pendingFlowers
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
    }
    parent.childIds.push(node.id)
    this.nodes.push(node)
    this.nodeMap.set(node.id, node)
    return node
  }

  private growTrunkUpward() {
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
    this.updateRadiiToRoot(node)
    this.writeSegment(node)
    this.updateAncestorGeometry(node)
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
