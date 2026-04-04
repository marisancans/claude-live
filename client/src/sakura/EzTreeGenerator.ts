/**
 * Walk-forward procedural tree generator.
 * Ported from EZ-Tree's algorithm (MIT license, @dgreenheck/ez-tree).
 *
 * Key difference from our old approach: NO CatmullRom curves.
 * Geometry is built by walking forward section by section, accumulating
 * orientation. Children spawn from interpolated parent sections.
 * Result: seamless junctions by construction.
 */
import * as THREE from 'three'

// --- RNG ---
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

// --- Types ---
export interface TreeParams {
  seed: number
  levels: number            // branch recursion depth (3 = trunk + 2 levels of branches)
  trunkLength: number       // length of trunk
  lengthPerLevel: number[]  // branch length at each level [trunk, L1, L2, L3]
  radiusPerLevel: number[]  // base radius at each level
  taperPerLevel: number[]   // 0-1 taper factor per level
  gnarlPerLevel: number[]   // gnarliness per level
  twistPerLevel: number[]   // twist per level
  childrenPerLevel: number[] // children spawned per branch at each level
  anglePerLevel: number[]   // branch angle from parent (degrees)
  sectionsPerLevel: number[] // geometry sections per level
  segmentsPerLevel: number[] // radial segments per level
  startPerLevel: number[]   // min t along parent where children start (0-1)
  forceDirection: THREE.Vector3 // growth force direction (gravity/phototropism)
  forceStrength: number
}

interface Section {
  origin: THREE.Vector3
  orientation: THREE.Euler
  radius: number
}

interface Branch {
  origin: THREE.Vector3
  orientation: THREE.Euler
  length: number
  radius: number
  level: number
  sectionCount: number
  segmentCount: number
}

// --- Oak Large preset from EZ-Tree (proven good-looking tree) ---
export const OAK_LARGE_PARAMS: TreeParams = {
  seed: 23399,
  levels: 3,
  trunkLength: 47.7,
  lengthPerLevel: [47.7, 29.39, 17.62, 7.16],
  radiusPerLevel: [3, 0.69, 0.69, 1.19],
  taperPerLevel: [0.73, 0.42, 0.69, 0.75],
  gnarlPerLevel: [0.04, 0.16, 0.06, 0.09],
  twistPerLevel: [0.23, 0.42, 0, 0],
  childrenPerLevel: [9, 5, 3, 0],
  anglePerLevel: [0, 54, 43, 32],
  sectionsPerLevel: [16, 9, 8, 3],
  segmentsPerLevel: [12, 5, 3, 3],
  startPerLevel: [0, 0.35, 0.1, 0],
  forceDirection: new THREE.Vector3(0, 1, 0),
  forceStrength: 0.025,
}

// --- Sakura — based on EZ-Tree Ash Medium preset for wide spreading canopy ---
// Key: NEGATIVE forceStrength makes branches droop/spread outward (not grow straight up)
// Wide angles at level 2 (65°) create the dome silhouette
export const SAKURA_PARAMS: TreeParams = {
  seed: 23399,
  levels: 3,
  trunkLength: 35,
  lengthPerLevel: [35, 25, 12, 5],
  radiusPerLevel: [2, 0.63, 0.76, 0.7],
  taperPerLevel: [0.7, 0.7, 0.7, 0.7],
  gnarlPerLevel: [0.03, 0.2, 0.15, 0.09],
  twistPerLevel: [0.09, -0.07, 0, 0],
  childrenPerLevel: [8, 5, 4, 0],
  anglePerLevel: [0, 50, 65, 55],
  sectionsPerLevel: [12, 8, 6, 4],
  segmentsPerLevel: [12, 6, 4, 3],
  startPerLevel: [0, 0.25, 0.3, 0],
  forceDirection: new THREE.Vector3(0, 1, 0),
  forceStrength: -0.03,
}

// --- Generator ---
export function generateTree(params: TreeParams): {
  branchGeometry: THREE.BufferGeometry
  leafPositions: THREE.Vector3[]
  leafDirections: THREE.Vector3[]
} {
  const rng = new SeededRNG(params.seed)

  // Shared arrays for ALL branches
  const verts: number[] = []
  const normals: number[] = []
  const uvs: number[] = []
  const indices: number[] = []

  // Leaf spawn points
  const leafPositions: THREE.Vector3[] = []
  const leafDirections: THREE.Vector3[] = []

  // Branch queue (breadth-first generation)
  const queue: Branch[] = []

  // Start with trunk
  queue.push({
    origin: new THREE.Vector3(0, 0, 0),
    orientation: new THREE.Euler(0, 0, 0),
    length: params.lengthPerLevel[0],
    radius: params.radiusPerLevel[0],
    level: 0,
    sectionCount: params.sectionsPerLevel[0],
    segmentCount: params.segmentsPerLevel[0],
  })

  while (queue.length > 0) {
    const branch = queue.shift()!
    generateBranch(branch, params, rng, verts, normals, uvs, indices, queue, leafPositions, leafDirections)
  }

  // Build BufferGeometry
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
  geometry.setIndex(indices)
  geometry.computeBoundingSphere()

  return { branchGeometry: geometry, leafPositions, leafDirections }
}

function generateBranch(
  branch: Branch,
  params: TreeParams,
  rng: SeededRNG,
  verts: number[],
  normals: number[],
  uvs: number[],
  indices: number[],
  queue: Branch[],
  leafPositions: THREE.Vector3[],
  leafDirections: THREE.Vector3[],
) {
  const indexOffset = verts.length / 3
  const orientation = branch.orientation.clone()
  const origin = branch.origin.clone()
  const stepLength = branch.length / branch.sectionCount
  const sections: Section[] = []

  for (let i = 0; i <= branch.sectionCount; i++) {
    // Compute radius with taper
    let sectionRadius = branch.radius
    if (i === branch.sectionCount && branch.level === params.levels) {
      sectionRadius = 0.001 // near-zero tip
    } else {
      sectionRadius *= 1 - params.taperPerLevel[branch.level] * (i / branch.sectionCount)
    }

    // Generate vertex ring
    let firstVertex: { x: number; y: number; z: number } | null = null
    let firstNormal: { x: number; y: number; z: number } | null = null

    for (let j = 0; j < branch.segmentCount; j++) {
      const angle = (2 * Math.PI * j) / branch.segmentCount

      // Vertex position: circle in XZ plane, rotated by orientation, offset by origin
      const vertex = new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle))
        .multiplyScalar(sectionRadius)
        .applyEuler(orientation)
        .add(origin)

      const normal = new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle))
        .applyEuler(orientation)
        .normalize()

      verts.push(vertex.x, vertex.y, vertex.z)
      normals.push(normal.x, normal.y, normal.z)
      uvs.push(j / branch.segmentCount, i % 2 === 0 ? 0 : 1)

      if (j === 0) {
        firstVertex = { x: vertex.x, y: vertex.y, z: vertex.z }
        firstNormal = { x: normal.x, y: normal.y, z: normal.z }
      }
    }

    // Close the ring (duplicate first vertex for UV seam)
    if (firstVertex && firstNormal) {
      verts.push(firstVertex.x, firstVertex.y, firstVertex.z)
      normals.push(firstNormal.x, firstNormal.y, firstNormal.z)
      uvs.push(1, i % 2 === 0 ? 0 : 1)
    }

    // Store section data for child branch spawning
    sections.push({
      origin: origin.clone(),
      orientation: orientation.clone(),
      radius: sectionRadius,
    })

    // Step forward
    origin.add(new THREE.Vector3(0, stepLength, 0).applyEuler(orientation))

    // Accumulate gnarliness (random orientation perturbation)
    const gnarl = Math.max(1, 1 / Math.sqrt(Math.max(sectionRadius, 0.1)))
      * params.gnarlPerLevel[branch.level]
    orientation.x += rng.random(gnarl, -gnarl)
    orientation.z += rng.random(gnarl, -gnarl)

    // Apply twist
    const q = new THREE.Quaternion().setFromEuler(orientation)
    const twistQ = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 1, 0),
      params.twistPerLevel[branch.level],
    )
    q.multiply(twistQ)

    // Apply growth force (phototropism / gravity)
    const forceQ = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      params.forceDirection.clone().normalize(),
    )
    q.rotateTowards(forceQ, params.forceStrength / Math.max(sectionRadius, 0.1))

    orientation.setFromQuaternion(q)
  }

  // Generate indices (connect adjacent rings)
  const vertsPerRing = branch.segmentCount + 1 // +1 for UV seam closure
  for (let i = 0; i < branch.sectionCount; i++) {
    for (let j = 0; j < branch.segmentCount; j++) {
      const a = indexOffset + i * vertsPerRing + j
      const b = indexOffset + i * vertsPerRing + j + 1
      const c = indexOffset + (i + 1) * vertsPerRing + j + 1
      const d = indexOffset + (i + 1) * vertsPerRing + j
      indices.push(a, b, c)
      indices.push(a, c, d)
    }
  }

  // Spawn child branches from parent sections
  if (branch.level < params.levels && params.childrenPerLevel[branch.level] > 0) {
    spawnChildren(branch.level, sections, params, rng, queue)
  }

  // Spawn leaves at terminal branches
  if (branch.level === params.levels || branch.level >= params.levels - 1) {
    for (const section of sections) {
      if (rng.random() > 0.4) { // not every section gets a leaf
        leafPositions.push(section.origin.clone())
        const dir = new THREE.Vector3(0, 1, 0).applyEuler(section.orientation)
        leafDirections.push(dir)
      }
    }
  }
}

function spawnChildren(
  parentLevel: number,
  parentSections: Section[],
  params: TreeParams,
  rng: SeededRNG,
  queue: Branch[],
) {
  const childLevel = parentLevel + 1
  const childCount = params.childrenPerLevel[parentLevel]
  const randomPhase = rng.random() // random radial offset so children don't align

  for (let i = 0; i < childCount; i++) {
    // Pick a position along the parent (between start and 1.0)
    const t = rng.random(1, params.startPerLevel[childLevel])
    const sectionIndex = Math.floor(t * (parentSections.length - 1))

    // Interpolate between two parent sections
    const sectionA = parentSections[sectionIndex]
    const sectionB = sectionIndex < parentSections.length - 1
      ? parentSections[sectionIndex + 1]
      : sectionA

    const alpha = (t - sectionIndex / (parentSections.length - 1))
      / (1 / (parentSections.length - 1))

    // Child origin: interpolated along parent
    const childOrigin = new THREE.Vector3().lerpVectors(sectionA.origin, sectionB.origin, alpha)

    // Child radius: parent's interpolated radius scaled by child level radius
    const interpolatedParentRadius = (1 - alpha) * sectionA.radius + alpha * sectionB.radius
    const childRadius = params.radiusPerLevel[childLevel] * (interpolatedParentRadius / params.radiusPerLevel[parentLevel])

    // Child orientation: slerp parent orientations + angle offset + radial rotation
    const qA = new THREE.Quaternion().setFromEuler(sectionA.orientation)
    const qB = new THREE.Quaternion().setFromEuler(sectionB.orientation)
    qB.slerp(qA, alpha)
    const parentOrientation = new THREE.Euler().setFromQuaternion(qB)

    // Radial angle around parent axis (evenly distributed + random phase)
    const radialAngle = 2 * Math.PI * (randomPhase + i / childCount)

    // Apply branch angle from parent
    const branchAngleRad = params.anglePerLevel[childLevel] * (Math.PI / 180)
    const angleQ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), branchAngleRad)
    const radialQ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), radialAngle)
    const parentQ = new THREE.Quaternion().setFromEuler(parentOrientation)
    const childQ = parentQ.multiply(radialQ.multiply(angleQ))
    const childOrientation = new THREE.Euler().setFromQuaternion(childQ)

    queue.push({
      origin: childOrigin,
      orientation: childOrientation,
      length: params.lengthPerLevel[childLevel],
      radius: Math.max(childRadius, 0.05),
      level: childLevel,
      sectionCount: params.sectionsPerLevel[childLevel],
      segmentCount: params.segmentsPerLevel[childLevel],
    })
  }
}
