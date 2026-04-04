/**
 * Event-driven procedural tree — grows from nothing.
 *
 * No pre-generated trunk. The entire tree emerges from events:
 *   Event 1  → tiny stem sprouts from ground
 *   Events   → stem extends, thickens, forks into limbs
 *   More     → limbs fork into branches, branches fork again
 *   Each event forks a twig with a petal cluster (the event IS the leaf)
 *
 * Retroactive thickening: as more events arrive, the trunk and all
 * branches scale up proportionally (like a real tree adding growth rings).
 *
 * Walk-forward algorithm from EZ-Tree (MIT, @dgreenheck/ez-tree).
 */
import * as THREE from 'three'

// ---------------------------------------------------------------------------
// RNG
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
  radius: number // base radius (before growth scaling)
}

interface EventTwig {
  eventId: string
  sections: Section[]
  leafPositions: THREE.Vector3[]
  leafDirections: THREE.Vector3[]
}

interface GrowthBranch {
  id: number
  parentId: number | null
  depth: number // 0 = trunk, 1 = limbs from trunk, 2+ = sub-branches

  sections: Section[]
  currentOrigin: THREE.Vector3
  currentOrientation: THREE.Euler
  currentRadius: number
  baseRadius: number

  eventCount: number
  forkAfter: number
  active: boolean

  childIds: number[]
  twigs: EventTwig[]
}

// ---------------------------------------------------------------------------
// Tool growth character
// ---------------------------------------------------------------------------
interface GrowthChar {
  gnarl: number
  stepLength: number
  forceStrength: number
  twist: number
}

const TOOL_GROWTH: Record<string, GrowthChar> = {
  Read:     { gnarl: 0.18, stepLength: 5.0, forceStrength: 0.006, twist: 0.05 },
  Grep:     { gnarl: 0.22, stepLength: 4.5, forceStrength: 0.005, twist: 0.03 },
  Glob:     { gnarl: 0.20, stepLength: 4.0, forceStrength: 0.005, twist: 0.03 },
  Edit:     { gnarl: 0.05, stepLength: 5.5, forceStrength: 0.008, twist: 0.01 },
  Write:    { gnarl: 0.04, stepLength: 6.0, forceStrength: 0.010, twist: 0.01 },
  Bash:     { gnarl: 0.12, stepLength: 5.0, forceStrength: 0.004, twist: 0.08 },
  Agent:    { gnarl: 0.15, stepLength: 4.8, forceStrength: 0.007, twist: 0.04 },
  WebFetch: { gnarl: 0.25, stepLength: 4.0, forceStrength: 0.003, twist: 0.10 },
}
const DEFAULT_GROWTH: GrowthChar = {
  gnarl: 0.10, stepLength: 5.0, forceStrength: 0.006, twist: 0.03,
}

// ---------------------------------------------------------------------------
// Params
// ---------------------------------------------------------------------------
export interface EventTreeParams {
  seed: number

  // Trunk (the first branch — grows from ground)
  trunkForkAfter: number         // events before trunk forks into limbs
  trunkBaseRadius: number        // starting radius (will scale with events)
  trunkStepMultiplier: number    // trunk steps are this much longer
  trunkGnarlDampen: number       // trunk gnarl reduced by this factor (0-1)
  trunkSegments: number

  // Branching
  branchSegments: number
  taperPerStep: number
  forkAfterPerDepth: number[]    // events before fork at each depth
  forkChildrenPerDepth: number[]
  forkAnglePerDepth: number[]    // degrees
  forkRadiusScale: number
  stepLengthDecay: number
  maxDepth: number

  // Event twigs
  twigLengthBase: number
  twigRadiusFraction: number
  twigSections: number
  twigSegments: number
  twigBranchAngle: number
  twigGnarl: number

  forceDirection: THREE.Vector3
}

export const SAKURA_EVENT_PARAMS: EventTreeParams = {
  seed: 23399,

  trunkForkAfter: 3,
  trunkBaseRadius: 0.45,
  trunkStepMultiplier: 1.5,
  trunkGnarlDampen: 0.2,
  trunkSegments: 8,

  branchSegments: 4,
  taperPerStep: 0.97,
  forkAfterPerDepth: [5, 4, 3, 2, 1, 1, 1],
  forkChildrenPerDepth: [5, 3, 3, 2, 2, 2],
  forkAnglePerDepth: [65, 55, 45, 38, 32, 28],
  forkRadiusScale: 0.68,
  stepLengthDecay: 0.92,
  maxDepth: 8,

  twigLengthBase: 3.5,
  twigRadiusFraction: 0.3,
  twigSections: 2,
  twigSegments: 3,
  twigBranchAngle: 50,
  twigGnarl: 0.15,

  forceDirection: new THREE.Vector3(0, 1, 0),
}

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------
export interface TreeEvent {
  eventId: string
  sessionId: string
  hookEventName: string
  toolName: string | null
}

export interface GrowthResult {
  grew: boolean
  newLeafPositions: THREE.Vector3[]
  newLeafDirections: THREE.Vector3[]
  branchPosition: THREE.Vector3 | null
  branchDirection: THREE.Vector3 | null
  // Positions along the branch spine for dense flower coverage
  spineFlowerPoints: { pos: THREE.Vector3; dir: THREE.Vector3 }[]
}

// ---------------------------------------------------------------------------
// EventTreeGenerator
// ---------------------------------------------------------------------------
export class EventTreeGenerator {
  private branches = new Map<number, GrowthBranch>()
  private activeTips: number[] = []
  private nextId = 1
  private tipCursor = 0
  private totalEventCount = 0
  private trunkId: number | null = null
  private params: EventTreeParams

  constructor(params: EventTreeParams) {
    this.params = { ...params }
  }

  // -----------------------------------------------------------------------
  // Core API
  // -----------------------------------------------------------------------

  onEvent(event: TreeEvent): GrowthResult {
    this.totalEventCount++
    const growth = TOOL_GROWTH[event.toolName || ''] || DEFAULT_GROWTH
    const empty: GrowthResult = { grew: false, newLeafPositions: [], newLeafDirections: [], branchPosition: null, branchDirection: null, spineFlowerPoints: [] }

    // First event ever → create trunk
    if (this.trunkId === null) {
      this.createTrunk()
    }

    const trunk = this.branches.get(this.trunkId!)!

    // Phase 0: trunk is still growing (not yet forked)
    if (trunk.active) {
      this.extendBranch(trunk, growth, event.eventId, true)
      const twig = this.createTwig(trunk, event.eventId)
      trunk.twigs.push(twig)

      // Check if trunk should fork into limbs
      if (trunk.eventCount >= trunk.forkAfter) {
        this.forkTrunk(trunk)
      }

      return {
        grew: true,
        newLeafPositions: twig.leafPositions, newLeafDirections: twig.leafDirections,
        branchPosition: trunk.currentOrigin.clone(),
        branchDirection: new THREE.Vector3(0, 1, 0).applyEuler(trunk.currentOrientation),
        spineFlowerPoints: this.sampleSpinePoints(trunk),
      }
    }

    // Phase 1+: distribute across active tips
    if (this.activeTips.length === 0) return empty

    this.tipCursor = this.tipCursor % this.activeTips.length
    const tipId = this.activeTips[this.tipCursor]
    this.tipCursor++
    const branch = this.branches.get(tipId)!

    this.extendBranch(branch, growth, event.eventId, false)
    const twig = this.createTwig(branch, event.eventId)
    branch.twigs.push(twig)
    this.checkFork(branch)

    return {
      grew: true,
      newLeafPositions: twig.leafPositions, newLeafDirections: twig.leafDirections,
      branchPosition: branch.currentOrigin.clone(),
      branchDirection: new THREE.Vector3(0, 1, 0).applyEuler(branch.currentOrientation),
      spineFlowerPoints: this.sampleSpinePoints(branch),
    }
  }

  buildGeometry(): THREE.BufferGeometry {
    const verts: number[] = []
    const normals: number[] = []
    const uvs: number[] = []
    const indices: number[] = []

    // Retroactive growth scaling — sakura are thin and graceful
    const growthScale = 0.35 + Math.min(1.2, Math.log1p(this.totalEventCount) * 0.25)

    for (const branch of this.branches.values()) {
      if (branch.sections.length < 2) continue
      const segs = branch.depth === 0
        ? this.params.trunkSegments
        : Math.max(3, this.params.branchSegments - Math.floor(branch.depth / 2))
      this.emitSections(branch.sections, segs, verts, normals, uvs, indices, growthScale)

      for (const twig of branch.twigs) {
        if (twig.sections.length >= 2) {
          this.emitSections(twig.sections, this.params.twigSegments, verts, normals, uvs, indices, growthScale)
        }
      }
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
    geometry.setIndex(indices)
    geometry.computeBoundingSphere()
    return geometry
  }

  // -----------------------------------------------------------------------
  // Query
  // -----------------------------------------------------------------------
  get totalEvents(): number { return this.totalEventCount }
  get branchCount(): number { return this.branches.size }
  get activeTipCount(): number { return this.activeTips.length }

  // -----------------------------------------------------------------------
  // Trunk creation (from nothing)
  // -----------------------------------------------------------------------
  private createTrunk() {
    const id = this.nextId++
    this.trunkId = id
    const rng = new SeededRNG(this.params.seed)

    const r = this.params.trunkBaseRadius
    const forkAfter = this.params.trunkForkAfter

    // Single section at ground level — the seed
    const sections: Section[] = [
      { origin: new THREE.Vector3(0, 0, 0), orientation: new THREE.Euler(0, 0, 0), radius: r },
    ]

    // One initial step upward so we have ≥2 sections (renderable)
    const stepLen = 4.0
    const o = new THREE.Vector3(0, stepLen, 0)
    const ori = new THREE.Euler(0, 0, 0)
    ori.x += rng.random(0.02, -0.02)
    const r2 = r * this.params.taperPerStep
    sections.push({ origin: o.clone(), orientation: ori.clone(), radius: r2 })

    const branch: GrowthBranch = {
      id, parentId: null, depth: 0,
      sections,
      currentOrigin: o.clone(),
      currentOrientation: ori.clone(),
      currentRadius: r2,
      baseRadius: r,
      eventCount: 0, forkAfter,
      active: true, childIds: [], twigs: [],
    }

    this.branches.set(id, branch)
    this.activeTips.push(id)
  }

  // -----------------------------------------------------------------------
  // Trunk forks into limbs (distributed along trunk height)
  // -----------------------------------------------------------------------
  private forkTrunk(trunk: GrowthBranch) {
    trunk.active = false
    this.activeTips = this.activeTips.filter(id => id !== trunk.id)

    const rng = new SeededRNG(hashString(`trunkfork:${trunk.id}`))
    const depthArr = this.params.forkChildrenPerDepth
    const nChildren = depthArr[0] || 3
    const goldenAngle = 2.399963

    for (let c = 0; c < nChildren; c++) {
      // Distribute limbs along trunk (t = 0.3 to 0.95)
      const t = 0.3 + (c / Math.max(nChildren - 1, 1)) * 0.65
      const si = Math.floor(t * (trunk.sections.length - 1))
      const sA = trunk.sections[si]
      const sB = si < trunk.sections.length - 1 ? trunk.sections[si + 1] : sA
      const alpha = trunk.sections.length > 1 ? (t * (trunk.sections.length - 1) - si) : 0

      const childOrigin = new THREE.Vector3().lerpVectors(sA.origin, sB.origin, alpha)
      const parentRadius = (1 - alpha) * sA.radius + alpha * sB.radius

      // Golden angle spacing
      const radialAngle = c * goldenAngle + rng.random(0.3, -0.3)

      // Orientation
      const qA = new THREE.Quaternion().setFromEuler(sA.orientation)
      const qB = new THREE.Quaternion().setFromEuler(sB.orientation)
      qB.slerp(qA, alpha)
      const parentOri = new THREE.Euler().setFromQuaternion(qB)

      const angleArr = this.params.forkAnglePerDepth
      const forkAngleDeg = angleArr[0] || 54
      const forkAngleRad = forkAngleDeg * (Math.PI / 180)

      const aQ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), forkAngleRad)
      const rQ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), radialAngle)
      const pQ = new THREE.Quaternion().setFromEuler(parentOri)
      const cQ = pQ.clone().multiply(rQ.multiply(aQ))
      const childOri = new THREE.Euler().setFromQuaternion(cQ)

      const childRadius = parentRadius * this.params.forkRadiusScale
      const forkAfterArr = this.params.forkAfterPerDepth
      const forkAfter = (forkAfterArr[Math.min(1, forkAfterArr.length - 1)] || 4)
        + Math.round(rng.random(1, -1))

      // 3-section stub
      const stub: Section[] = []
      const o = childOrigin.clone()
      const ori = childOri.clone()
      let r = Math.max(childRadius, 0.03)
      const stepLen = 4.0

      for (let s = 0; s < 3; s++) {
        stub.push({ origin: o.clone(), orientation: ori.clone(), radius: r })
        o.add(new THREE.Vector3(0, stepLen, 0).applyEuler(ori))
        ori.x += rng.random(0.03, -0.03)
        ori.z += rng.random(0.03, -0.03)
        r *= this.params.taperPerStep
      }

      const id = this.nextId++
      const child: GrowthBranch = {
        id, parentId: trunk.id, depth: 1,
        sections: stub,
        currentOrigin: o.clone(),
        currentOrientation: ori.clone(),
        currentRadius: r,
        baseRadius: childRadius,
        eventCount: 0, forkAfter,
        active: true, childIds: [], twigs: [],
      }

      this.branches.set(id, child)
      this.activeTips.push(id)
      trunk.childIds.push(id)
    }
  }

  // -----------------------------------------------------------------------
  // Normal branch fork (non-trunk)
  // -----------------------------------------------------------------------
  private checkFork(branch: GrowthBranch) {
    if (branch.eventCount < branch.forkAfter) return
    if (branch.depth >= this.params.maxDepth) return
    if (!branch.active) return

    branch.active = false
    this.activeTips = this.activeTips.filter(id => id !== branch.id)

    const rng = new SeededRNG(hashString(`fork:${branch.id}:${branch.eventCount}`))
    const depthArr = this.params.forkChildrenPerDepth
    const nChildren = depthArr[Math.min(branch.depth, depthArr.length - 1)]

    for (let c = 0; c < nChildren; c++) {
      const child = this.createChildBranch(branch, c, nChildren, rng)
      this.branches.set(child.id, child)
      this.activeTips.push(child.id)
      branch.childIds.push(child.id)
    }
  }

  private createChildBranch(parent: GrowthBranch, childIndex: number, totalChildren: number, rng: SeededRNG): GrowthBranch {
    const id = this.nextId++
    const depth = parent.depth + 1

    const baseAngle = (childIndex / totalChildren) * Math.PI * 2
    const radialAngle = baseAngle + rng.random(0.4, -0.4)

    const angleArr = this.params.forkAnglePerDepth
    const forkAngleDeg = angleArr[Math.min(depth, angleArr.length - 1)]
    const forkAngleRad = forkAngleDeg * (Math.PI / 180)

    const aQ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), forkAngleRad)
    const rQ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), radialAngle)
    const pQ = new THREE.Quaternion().setFromEuler(parent.currentOrientation)
    const cQ = pQ.clone().multiply(rQ.multiply(aQ))
    const childOri = new THREE.Euler().setFromQuaternion(cQ)

    const childRadius = parent.currentRadius * this.params.forkRadiusScale
    const forkAfterArr = this.params.forkAfterPerDepth
    const forkAfter = (forkAfterArr[Math.min(depth, forkAfterArr.length - 1)] || 1)
      + Math.round(rng.random(1, -1))

    // 2-section stub (shorter at deeper levels)
    const stub: Section[] = []
    const o = parent.currentOrigin.clone()
    const ori = childOri.clone()
    let r = Math.max(childRadius, 0.02)
    const stubStepLen = 3.0 * Math.pow(this.params.stepLengthDecay, depth)

    for (let s = 0; s < 2; s++) {
      stub.push({ origin: o.clone(), orientation: ori.clone(), radius: r })
      o.add(new THREE.Vector3(0, stubStepLen, 0).applyEuler(ori))
      ori.x += rng.random(0.04, -0.04)
      ori.z += rng.random(0.04, -0.04)
      r *= this.params.taperPerStep
    }

    return {
      id, parentId: parent.id, depth,
      sections: stub,
      currentOrigin: o.clone(),
      currentOrientation: ori.clone(),
      currentRadius: r,
      baseRadius: childRadius,
      eventCount: 0, forkAfter,
      active: true, childIds: [], twigs: [],
    }
  }

  // -----------------------------------------------------------------------
  // Extend branch by one walk-forward step
  // -----------------------------------------------------------------------
  private extendBranch(branch: GrowthBranch, growth: GrowthChar, eventId: string, isTrunk: boolean) {
    const rng = new SeededRNG(hashString(`step:${eventId}`))
    const depthFactor = Math.pow(this.params.stepLengthDecay, branch.depth)

    // Trunk gets special growth: taller steps, less gnarly
    const trunkMul = isTrunk ? this.params.trunkStepMultiplier : 1.0
    const gnarlDampen = isTrunk ? this.params.trunkGnarlDampen : 1.0

    branch.sections.push({
      origin: branch.currentOrigin.clone(),
      orientation: branch.currentOrientation.clone(),
      radius: branch.currentRadius,
    })

    const stepLen = (growth.stepLength + rng.random(0.5, -0.3)) * depthFactor * trunkMul
    branch.currentOrigin.add(
      new THREE.Vector3(0, stepLen, 0).applyEuler(branch.currentOrientation),
    )

    // Gnarliness (dampened for trunk, amplified for deep branches)
    const gnarlScale = gnarlDampen * (1 + branch.depth * 0.15)
    const gf = Math.max(1, 1 / Math.sqrt(Math.max(branch.currentRadius, 0.1)))
      * growth.gnarl * gnarlScale
    branch.currentOrientation.x += rng.random(gf, -gf)
    branch.currentOrientation.z += rng.random(gf, -gf)

    const q = new THREE.Quaternion().setFromEuler(branch.currentOrientation)
    q.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), growth.twist))

    // Phototropism — weakens at deeper levels so branches droop gracefully
    const forceScale = Math.max(0.15, 1 - branch.depth * 0.12)
    const fq = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0), this.params.forceDirection.clone().normalize(),
    )
    q.rotateTowards(fq, growth.forceStrength * forceScale / Math.max(branch.currentRadius, 0.3))
    branch.currentOrientation.setFromQuaternion(q)

    branch.currentRadius *= this.params.taperPerStep
    branch.currentRadius = Math.max(branch.currentRadius, 0.02)
    branch.eventCount++
  }

  // -----------------------------------------------------------------------
  // Sample points along branch spine for flower scatter
  // -----------------------------------------------------------------------
  private sampleSpinePoints(branch: GrowthBranch): { pos: THREE.Vector3; dir: THREE.Vector3 }[] {
    const points: { pos: THREE.Vector3; dir: THREE.Vector3 }[] = []
    const sections = branch.sections
    if (sections.length < 2) return points

    // Sample up to 5 evenly spaced points along the branch
    const count = Math.min(5, sections.length - 1)
    const step = Math.max(1, Math.floor((sections.length - 1) / count))

    for (let i = step; i < sections.length; i += step) {
      const s = sections[i]
      points.push({
        pos: s.origin.clone(),
        dir: new THREE.Vector3(0, 1, 0).applyEuler(s.orientation),
      })
      if (points.length >= count) break
    }
    return points
  }

  // -----------------------------------------------------------------------
  // Event twig (petal-bearing)
  // -----------------------------------------------------------------------
  private createTwig(branch: GrowthBranch, eventId: string): EventTwig {
    const rng = new SeededRNG(hashString(`twig:${eventId}`))

    const radAngle = (hashString(eventId) / 4294967296) * Math.PI * 2
    const bRad = this.params.twigBranchAngle * (Math.PI / 180)
    const aQ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), bRad)
    const rQ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), radAngle)
    const pQ = new THREE.Quaternion().setFromEuler(branch.currentOrientation)
    const tQ = pQ.clone().multiply(rQ.multiply(aQ))
    const twigOri = new THREE.Euler().setFromQuaternion(tQ)

    const twigR = Math.max(branch.currentRadius * this.params.twigRadiusFraction, 0.012)
    const depthScale = Math.pow(this.params.stepLengthDecay, branch.depth)
    const twigLen = (this.params.twigLengthBase + rng.random(1.5, -0.5)) * depthScale

    const sections = this.walkForwardShort(
      branch.currentOrigin, twigOri, twigR, twigLen,
      this.params.twigSections, this.params.twigGnarl, rng,
    )

    const leafPositions: THREE.Vector3[] = []
    const leafDirections: THREE.Vector3[] = []
    const tip = sections[sections.length - 1]
    leafPositions.push(tip.origin.clone())
    leafDirections.push(new THREE.Vector3(0, 1, 0).applyEuler(tip.orientation))

    if (rng.random() > 0.4 && sections.length > 2) {
      const mid = sections[Math.floor(sections.length / 2)]
      leafPositions.push(mid.origin.clone())
      leafDirections.push(new THREE.Vector3(0, 1, 0).applyEuler(mid.orientation))
    }

    return { eventId, sections, leafPositions, leafDirections }
  }

  private walkForwardShort(
    startOrigin: THREE.Vector3, startOri: THREE.Euler,
    radius: number, length: number, count: number,
    gnarl: number, rng: SeededRNG,
  ): Section[] {
    const sections: Section[] = []
    const o = startOrigin.clone()
    const ori = startOri.clone()
    const step = length / Math.max(count, 1)

    for (let i = 0; i <= count; i++) {
      const r = Math.max(radius * (1 - 0.7 * (i / count)), 0.001)
      sections.push({ origin: o.clone(), orientation: ori.clone(), radius: r })
      if (i === count) break
      o.add(new THREE.Vector3(0, step, 0).applyEuler(ori))
      const gf = gnarl * Math.max(1, 1 / Math.sqrt(Math.max(r, 0.1)))
      ori.x += rng.random(gf, -gf)
      ori.z += rng.random(gf, -gf)
    }
    return sections
  }

  // -----------------------------------------------------------------------
  // Geometry: vertex rings with growth scaling
  // -----------------------------------------------------------------------
  private emitSections(
    sections: Section[], segments: number,
    verts: number[], normals: number[], uvs: number[], indices: number[],
    radiusScale: number,
  ) {
    if (sections.length < 2) return
    const offset = verts.length / 3
    const sCount = sections.length - 1

    for (let i = 0; i < sections.length; i++) {
      const s = sections[i]
      const effectiveRadius = s.radius * radiusScale
      let fv: { x: number; y: number; z: number } | null = null
      let fn: { x: number; y: number; z: number } | null = null

      for (let j = 0; j < segments; j++) {
        const a = (2 * Math.PI * j) / segments
        const v = new THREE.Vector3(Math.cos(a), 0, Math.sin(a))
          .multiplyScalar(effectiveRadius).applyEuler(s.orientation).add(s.origin)
        const n = new THREE.Vector3(Math.cos(a), 0, Math.sin(a))
          .applyEuler(s.orientation).normalize()

        verts.push(v.x, v.y, v.z)
        normals.push(n.x, n.y, n.z)
        uvs.push(j / segments, i % 2 === 0 ? 0 : 1)
        if (j === 0) { fv = { x: v.x, y: v.y, z: v.z }; fn = { x: n.x, y: n.y, z: n.z } }
      }
      if (fv && fn) {
        verts.push(fv.x, fv.y, fv.z)
        normals.push(fn.x, fn.y, fn.z)
        uvs.push(1, i % 2 === 0 ? 0 : 1)
      }
    }

    const vpr = segments + 1
    for (let i = 0; i < sCount; i++) {
      for (let j = 0; j < segments; j++) {
        const a = offset + i * vpr + j
        const b = offset + i * vpr + j + 1
        const c = offset + (i + 1) * vpr + j + 1
        const d = offset + (i + 1) * vpr + j
        indices.push(a, b, c, a, c, d)
      }
    }
  }
}
