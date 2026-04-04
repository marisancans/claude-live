/**
 * Filesystem-driven procedural tree generator.
 *
 * Uses the EZ-Tree walk-forward algorithm (MIT, @dgreenheck/ez-tree) but
 * driven by filesystem paths instead of random child spawning.
 *
 * Each "/" in a file path = a branch fork.
 * Directories = wood branches. Files = thin twigs with blossom clusters.
 * Tree starts as bare trunk; branches grow incrementally via addPath().
 */
import * as THREE from 'three'

// ---------------------------------------------------------------------------
// RNG — identical to EzTreeGenerator
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

function hashString(value: string): number {
  let hash = 2166136261
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Section {
  origin: THREE.Vector3
  orientation: THREE.Euler
  radius: number
}

export interface PathBranch {
  path: string
  name: string
  parentPath: string | null
  childPaths: string[]
  isFile: boolean
  depth: number // filesystem depth (1 = top-level dir)

  // Walk-forward result
  sections: Section[]
  origin: THREE.Vector3
  tipPosition: THREE.Vector3
  tipOrientation: THREE.Euler
  baseRadius: number

  // Leaf data (files + deep directories)
  leafPositions: THREE.Vector3[]
  leafDirections: THREE.Vector3[]

  // Growth animation
  birthTime: number
}

export interface TreeParams {
  seed: number
  levels: number
  lengthPerLevel: number[]
  radiusPerLevel: number[]
  taperPerLevel: number[]
  gnarlPerLevel: number[]
  twistPerLevel: number[]
  anglePerLevel: number[] // degrees
  sectionsPerLevel: number[]
  segmentsPerLevel: number[]
  startPerLevel: number[] // min t along parent where children start (0-1)
  forceDirection: THREE.Vector3
  forceStrength: number
}

/** Sakura preset — based on EZ-Tree Oak Large with extra depth levels. */
export const SAKURA_PATH_PARAMS: TreeParams = {
  seed: 23399,
  levels: 3,
  // Level: 0=trunk, 1=major dirs, 2=sub-dirs, 3=deep dirs/files
  // Extra entries for depth > 3 (progressively thinner)
  lengthPerLevel: [47.7, 29.39, 17.62, 7.16, 5.0, 3.5],
  radiusPerLevel: [3.0, 0.69, 0.69, 1.19, 0.8, 0.5],
  taperPerLevel: [0.73, 0.42, 0.69, 0.75, 0.8, 0.85],
  gnarlPerLevel: [0.04, 0.16, 0.06, 0.09, 0.09, 0.09],
  twistPerLevel: [0.23, 0.42, 0, 0, 0, 0],
  anglePerLevel: [0, 54, 43, 32, 30, 28],
  sectionsPerLevel: [16, 9, 8, 3, 3, 2],
  segmentsPerLevel: [12, 5, 3, 3, 3, 3],
  startPerLevel: [0, 0.35, 0.1, 0, 0, 0],
  forceDirection: new THREE.Vector3(0, 1, 0),
  forceStrength: 0.025,
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function paramAt(arr: number[], level: number): number {
  return arr[Math.min(level, arr.length - 1)]
}

// ---------------------------------------------------------------------------
// PathTreeGenerator
// ---------------------------------------------------------------------------
export class PathTreeGenerator {
  private branches = new Map<string, PathBranch>()
  private trunkSections: Section[] = []
  private params: TreeParams
  private dirty = true
  private now = 0

  // Cached geometry
  private geometry: THREE.BufferGeometry | null = null
  private allLeafPositions: THREE.Vector3[] = []
  private allLeafDirections: THREE.Vector3[] = []

  constructor(params: TreeParams, now = 0) {
    this.params = { ...params }
    this.now = now
    this.generateTrunk()
  }

  setTime(t: number) {
    this.now = t
  }

  // -------------------------------------------------------------------------
  // Public API
  // -------------------------------------------------------------------------

  /**
   * Add a file path to the tree. Creates branches for all missing segments.
   * Returns newly created paths + their leaf data.
   */
  addPath(filePath: string): {
    newPaths: string[]
    newLeafPositions: THREE.Vector3[]
    newLeafDirections: THREE.Vector3[]
  } {
    const parts = filePath.replace(/\\/g, '/').split('/').filter(Boolean)
    if (parts.length === 0) return { newPaths: [], newLeafPositions: [], newLeafDirections: [] }

    const newPaths: string[] = []
    const newLeafPositions: THREE.Vector3[] = []
    const newLeafDirections: THREE.Vector3[] = []

    for (let i = 0; i < parts.length; i++) {
      const path = parts.slice(0, i + 1).join('/')
      if (this.branches.has(path)) continue

      const isFile = i === parts.length - 1
      const parentPath = i === 0 ? null : parts.slice(0, i).join('/')
      const depth = i + 1

      const branch = this.createBranch(path, parts[i], parentPath, depth, isFile)
      this.branches.set(path, branch)

      // Link to parent
      if (parentPath) {
        const parent = this.branches.get(parentPath)
        if (parent) parent.childPaths.push(path)
      }

      newPaths.push(path)
      newLeafPositions.push(...branch.leafPositions)
      newLeafDirections.push(...branch.leafDirections)
    }

    if (newPaths.length > 0) this.dirty = true
    return { newPaths, newLeafPositions, newLeafDirections }
  }

  /**
   * Batch-add many paths at once (e.g., from project tree scan).
   * More efficient than calling addPath() repeatedly because geometry
   * is only rebuilt once at the end.
   */
  addPaths(filePaths: string[]): {
    newPaths: string[]
    newLeafPositions: THREE.Vector3[]
    newLeafDirections: THREE.Vector3[]
  } {
    const allNew: string[] = []
    const allLeafPos: THREE.Vector3[] = []
    const allLeafDir: THREE.Vector3[] = []

    for (const fp of filePaths) {
      const { newPaths, newLeafPositions, newLeafDirections } = this.addPath(fp)
      allNew.push(...newPaths)
      allLeafPos.push(...newLeafPositions)
      allLeafDir.push(...newLeafDirections)
    }

    return { newPaths: allNew, newLeafPositions: allLeafPos, newLeafDirections: allLeafDir }
  }

  /**
   * Build combined BufferGeometry for trunk + all branches.
   * Only rebuilds if dirty. Caller must dispose the old geometry if replacing a mesh.
   */
  buildGeometry(): {
    geometry: THREE.BufferGeometry
    leafPositions: THREE.Vector3[]
    leafDirections: THREE.Vector3[]
  } {
    if (!this.dirty && this.geometry) {
      return {
        geometry: this.geometry,
        leafPositions: this.allLeafPositions,
        leafDirections: this.allLeafDirections,
      }
    }

    const verts: number[] = []
    const normals: number[] = []
    const uvs: number[] = []
    const indices: number[] = []
    this.allLeafPositions = []
    this.allLeafDirections = []

    // Trunk
    this.emitBranchGeometry(
      this.trunkSections,
      paramAt(this.params.segmentsPerLevel, 0),
      verts, normals, uvs, indices,
    )

    // All path branches
    for (const branch of this.branches.values()) {
      const level = this.levelForBranch(branch)
      this.emitBranchGeometry(
        branch.sections,
        paramAt(this.params.segmentsPerLevel, level),
        verts, normals, uvs, indices,
      )
      this.allLeafPositions.push(...branch.leafPositions)
      this.allLeafDirections.push(...branch.leafDirections)
    }

    if (this.geometry) this.geometry.dispose()
    this.geometry = new THREE.BufferGeometry()
    this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
    this.geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
    this.geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
    this.geometry.setIndex(indices)
    this.geometry.computeBoundingSphere()

    this.dirty = false

    return {
      geometry: this.geometry,
      leafPositions: this.allLeafPositions,
      leafDirections: this.allLeafDirections,
    }
  }

  // -------------------------------------------------------------------------
  // Query methods (for SignalSystem, effects, etc.)
  // -------------------------------------------------------------------------

  hasBranch(path: string): boolean {
    return this.branches.has(path)
  }

  getBranch(path: string): PathBranch | undefined {
    return this.branches.get(path)
  }

  getLeafPaths(): string[] {
    const result: string[] = []
    for (const b of this.branches.values()) {
      if (b.isFile) result.push(b.path)
    }
    return result
  }

  /** Walk from path to root, returning branch paths in root→leaf order. */
  getBranchChain(path: string): string[] {
    const chain: string[] = []
    let current: string | null = path
    while (current && this.branches.has(current)) {
      chain.unshift(current)
      current = this.branches.get(current)!.parentPath
    }
    return chain
  }

  /** Find the longest known ancestor path for a given input path. */
  closestKnownPath(inputPath: string): string | null {
    const segments = inputPath.replace(/\\/g, '/').split('/').filter(Boolean)
    for (let len = segments.length; len > 0; len--) {
      const candidate = segments.slice(0, len).join('/')
      if (this.branches.has(candidate)) return candidate
    }
    return null
  }

  /** Collect up to `limit` leaf (file) paths under a given path. */
  collectDescendantLeaves(startPath: string, limit = 12): string[] {
    const branch = this.branches.get(startPath)
    if (!branch) return []
    if (branch.isFile) return [branch.path]

    const queue = [...branch.childPaths]
    const leaves: string[] = []
    while (queue.length > 0 && leaves.length < limit) {
      const p = queue.shift()!
      const b = this.branches.get(p)
      if (!b) continue
      if (b.isFile) {
        leaves.push(b.path)
      } else {
        queue.push(...b.childPaths)
      }
    }
    return leaves
  }

  /** Pick random sample of leaf paths. */
  pickSampleLeaves(seedKey: string, count: number): string[] {
    const leaves = this.getLeafPaths()
    if (leaves.length <= count) return [...leaves]
    const rng = new SeededRNG(hashString(seedKey))
    const pool = [...leaves]
    const picks: string[] = []
    while (pool.length > 0 && picks.length < count) {
      const idx = Math.floor(rng.random() * pool.length)
      picks.push(pool.splice(idx, 1)[0])
    }
    return picks
  }

  get branchCount(): number {
    return this.branches.size
  }

  get leafCount(): number {
    return this.allLeafPositions.length
  }

  dispose() {
    if (this.geometry) {
      this.geometry.dispose()
      this.geometry = null
    }
  }

  // -------------------------------------------------------------------------
  // Trunk generation
  // -------------------------------------------------------------------------
  private generateTrunk() {
    const rng = new SeededRNG(this.params.seed)
    this.trunkSections = this.walkForward(
      new THREE.Vector3(0, 0, 0),
      new THREE.Euler(0, 0, 0),
      paramAt(this.params.radiusPerLevel, 0),
      paramAt(this.params.lengthPerLevel, 0),
      paramAt(this.params.sectionsPerLevel, 0),
      0,
      rng,
    )
  }

  // -------------------------------------------------------------------------
  // Branch creation (filesystem-driven child spawning)
  // -------------------------------------------------------------------------
  private levelForBranch(branch: PathBranch): number {
    // Files get the deepest level treatment
    if (branch.isFile) return Math.min(branch.depth, this.params.lengthPerLevel.length - 1)
    return Math.min(branch.depth, this.params.lengthPerLevel.length - 1)
  }

  private createBranch(
    path: string,
    name: string,
    parentPath: string | null,
    depth: number,
    isFile: boolean,
  ): PathBranch {
    // Parent's sections to spawn from
    const parentSections = parentPath
      ? this.branches.get(parentPath)!.sections
      : this.trunkSections
    const parentLevel = parentPath
      ? this.levelForBranch(this.branches.get(parentPath)!)
      : 0

    const level = Math.min(depth, this.params.lengthPerLevel.length - 1)
    const rng = new SeededRNG(hashString(`${this.params.seed}:${path}`))

    // --- Spawn position along parent ---
    const startT = paramAt(this.params.startPerLevel, level)
    const t = rng.random(0.92, Math.max(startT, 0.05))
    const sectionIndex = Math.floor(t * (parentSections.length - 1))

    const sectionA = parentSections[sectionIndex]
    const sectionB = sectionIndex < parentSections.length - 1
      ? parentSections[sectionIndex + 1]
      : sectionA

    const localAlpha = parentSections.length > 1
      ? (t * (parentSections.length - 1) - sectionIndex)
      : 0

    // --- Interpolate parent state at spawn point ---
    const childOrigin = new THREE.Vector3().lerpVectors(
      sectionA.origin, sectionB.origin, localAlpha,
    )

    const interpolatedParentRadius =
      (1 - localAlpha) * sectionA.radius + localAlpha * sectionB.radius

    // Child radius — proportional to parent's tapered radius (EZ-Tree formula)
    let childRadius: number
    if (isFile) {
      // Files are thin twigs
      childRadius = Math.min(
        interpolatedParentRadius * 0.35,
        paramAt(this.params.radiusPerLevel, level) * 0.5,
      )
    } else {
      const parentBaseRadius = paramAt(this.params.radiusPerLevel, parentLevel)
      childRadius = paramAt(this.params.radiusPerLevel, level)
        * (interpolatedParentRadius / Math.max(parentBaseRadius, 0.01))
    }
    childRadius = Math.max(childRadius, 0.04)

    // --- Child orientation ---
    // Slerp parent orientations at spawn point
    const qA = new THREE.Quaternion().setFromEuler(sectionA.orientation)
    const qB = new THREE.Quaternion().setFromEuler(sectionB.orientation)
    qB.slerp(qA, localAlpha)
    const parentOrientation = new THREE.Euler().setFromQuaternion(qB)

    // Radial angle — deterministic from path hash (evenly distributed)
    const radialAngle = (hashString(path) / 4294967296) * Math.PI * 2

    // Branch angle from parent axis
    const branchAngleDeg = paramAt(this.params.anglePerLevel, level)
    const branchAngleRad = branchAngleDeg * (Math.PI / 180)

    // Compose: parent orientation × radial rotation × branch tilt
    const angleQ = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(1, 0, 0), branchAngleRad,
    )
    const radialQ = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 1, 0), radialAngle,
    )
    const parentQ = new THREE.Quaternion().setFromEuler(parentOrientation)
    const childQ = parentQ.clone().multiply(radialQ.multiply(angleQ))
    const childOrientation = new THREE.Euler().setFromQuaternion(childQ)

    // --- Walk forward ---
    let length = paramAt(this.params.lengthPerLevel, level)
    if (isFile) length *= 0.4 // files are short twigs

    // Progressive shrink for very deep paths
    const extraDepth = Math.max(0, depth - this.params.levels)
    if (extraDepth > 0) {
      length *= Math.pow(0.75, extraDepth)
      childRadius *= Math.pow(0.8, extraDepth)
      childRadius = Math.max(childRadius, 0.03)
    }

    const sectionCount = isFile ? 3 : paramAt(this.params.sectionsPerLevel, level)
    const sections = this.walkForward(
      childOrigin,
      childOrientation,
      childRadius,
      length,
      sectionCount,
      level,
      rng,
    )

    const tip = sections[sections.length - 1]

    // --- Leaf positions (for files and deep directory tips) ---
    const leafPositions: THREE.Vector3[] = []
    const leafDirections: THREE.Vector3[] = []

    if (isFile) {
      // Files get blossom clusters along their branch
      for (const section of sections) {
        if (rng.random() > 0.25) {
          leafPositions.push(section.origin.clone())
          leafDirections.push(
            new THREE.Vector3(0, 1, 0).applyEuler(section.orientation),
          )
        }
      }
      // Always one at tip
      leafPositions.push(tip.origin.clone())
      leafDirections.push(new THREE.Vector3(0, 1, 0).applyEuler(tip.orientation))
    }

    return {
      path,
      name,
      parentPath,
      childPaths: [],
      isFile,
      depth,
      sections,
      origin: childOrigin.clone(),
      tipPosition: tip.origin.clone(),
      tipOrientation: tip.orientation.clone(),
      baseRadius: childRadius,
      leafPositions,
      leafDirections,
      birthTime: this.now,
    }
  }

  // -------------------------------------------------------------------------
  // Walk-forward algorithm — identical to EZ-Tree
  // -------------------------------------------------------------------------
  private walkForward(
    startOrigin: THREE.Vector3,
    startOrientation: THREE.Euler,
    radius: number,
    length: number,
    sectionCount: number,
    level: number,
    rng: SeededRNG,
  ): Section[] {
    const sections: Section[] = []
    const origin = startOrigin.clone()
    const orientation = startOrientation.clone()
    const stepLength = length / Math.max(sectionCount, 1)
    const taper = paramAt(this.params.taperPerLevel, level)
    const gnarl = paramAt(this.params.gnarlPerLevel, level)
    const twist = paramAt(this.params.twistPerLevel, level)

    for (let i = 0; i <= sectionCount; i++) {
      // Compute radius with taper
      let sectionRadius: number
      if (i === sectionCount) {
        // Near-zero tip for terminal branches
        sectionRadius = radius * Math.max(1 - taper, 0.001)
      } else {
        sectionRadius = radius * (1 - taper * (i / sectionCount))
      }
      sectionRadius = Math.max(sectionRadius, 0.001)

      sections.push({
        origin: origin.clone(),
        orientation: orientation.clone(),
        radius: sectionRadius,
      })

      // Don't step past the last section
      if (i === sectionCount) break

      // Step forward
      origin.add(
        new THREE.Vector3(0, stepLength, 0).applyEuler(orientation),
      )

      // Accumulate gnarliness
      const gnarlFactor =
        Math.max(1, 1 / Math.sqrt(Math.max(sectionRadius, 0.1))) * gnarl
      orientation.x += rng.random(gnarlFactor, -gnarlFactor)
      orientation.z += rng.random(gnarlFactor, -gnarlFactor)

      // Twist
      const q = new THREE.Quaternion().setFromEuler(orientation)
      const twistQ = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        twist,
      )
      q.multiply(twistQ)

      // Growth force (phototropism)
      const forceQ = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        this.params.forceDirection.clone().normalize(),
      )
      q.rotateTowards(
        forceQ,
        this.params.forceStrength / Math.max(sectionRadius, 0.1),
      )

      orientation.setFromQuaternion(q)
    }

    return sections
  }

  // -------------------------------------------------------------------------
  // Geometry emission — builds vertex rings from stored sections
  // -------------------------------------------------------------------------
  private emitBranchGeometry(
    sections: Section[],
    segmentCount: number,
    verts: number[],
    normals: number[],
    uvs: number[],
    indices: number[],
  ) {
    if (sections.length < 2) return

    const indexOffset = verts.length / 3
    const sectionCount = sections.length - 1

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i]
      let firstVertex: { x: number; y: number; z: number } | null = null
      let firstNormal: { x: number; y: number; z: number } | null = null

      for (let j = 0; j < segmentCount; j++) {
        const angle = (2 * Math.PI * j) / segmentCount

        const vertex = new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle))
          .multiplyScalar(section.radius)
          .applyEuler(section.orientation)
          .add(section.origin)

        const normal = new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle))
          .applyEuler(section.orientation)
          .normalize()

        verts.push(vertex.x, vertex.y, vertex.z)
        normals.push(normal.x, normal.y, normal.z)
        uvs.push(j / segmentCount, i % 2 === 0 ? 0 : 1)

        if (j === 0) {
          firstVertex = { x: vertex.x, y: vertex.y, z: vertex.z }
          firstNormal = { x: normal.x, y: normal.y, z: normal.z }
        }
      }

      // Close the ring (UV seam vertex)
      if (firstVertex && firstNormal) {
        verts.push(firstVertex.x, firstVertex.y, firstVertex.z)
        normals.push(firstNormal.x, firstNormal.y, firstNormal.z)
        uvs.push(1, i % 2 === 0 ? 0 : 1)
      }
    }

    // Connect adjacent rings with triangles
    const vertsPerRing = segmentCount + 1
    for (let i = 0; i < sectionCount; i++) {
      for (let j = 0; j < segmentCount; j++) {
        const a = indexOffset + i * vertsPerRing + j
        const b = indexOffset + i * vertsPerRing + j + 1
        const c = indexOffset + (i + 1) * vertsPerRing + j + 1
        const d = indexOffset + (i + 1) * vertsPerRing + j
        indices.push(a, b, c)
        indices.push(a, c, d)
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Utility: flatten a ProjectTreeNode into relative file paths
// ---------------------------------------------------------------------------
export interface SimpleTreeNode {
  path: string
  type: 'folder' | 'file'
  children?: SimpleTreeNode[]
}

export function flattenTreePaths(node: SimpleTreeNode): string[] {
  const paths: string[] = []
  function walk(n: SimpleTreeNode) {
    // Skip the root '.' node itself
    if (n.path && n.path !== '.') {
      paths.push(n.path)
    }
    if (n.children) {
      for (const child of n.children) walk(child)
    }
  }
  if (node.children) {
    for (const child of node.children) walk(child)
  }
  return paths
}
