import * as THREE from 'three'

function hashString(value: string): number {
  let hash = 2166136261
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function makeRandom(seed: string) {
  let state = hashString(seed) || 1
  return () => {
    state |= 0
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export interface BranchGeometryOptions {
  /** CatmullRomCurve3 defining the branch path */
  curve: THREE.CatmullRomCurve3
  /** Radius at the base of the branch */
  baseRadius: number
  /** How much radius tapers from base to tip (0-1) */
  taper: number
  /** How much the branch twists/bends randomly */
  gnarliness: number
  /** Rotational twist along the branch axis (radians) */
  twist: number
  /** Number of sections (rings) along the branch */
  sections: number
  /** Vertices per ring (higher = smoother cross-section) */
  segments: number
  /** Seed for deterministic randomness */
  seedKey: string
  /** Radius of the parent branch at the fork point (for junction blending) */
  parentRadius?: number
}

/**
 * Generate custom BufferGeometry for a branch using vertex rings.
 * Produces natural-looking bark with taper, gnarliness, and smooth junctions.
 */
export function buildBranchGeometry(options: BranchGeometryOptions): THREE.BufferGeometry {
  const {
    curve, baseRadius, taper, gnarliness, twist,
    sections, segments, seedKey, parentRadius,
  } = options

  const rng = makeRandom(`branch:${seedKey}`)
  const rngRange = (min: number, max: number) => min + (max - min) * rng()

  const vertexCount = (sections + 1) * (segments + 1) + 2 // +2 for cap centers
  const positions = new Float32Array(vertexCount * 3)
  const normals = new Float32Array(vertexCount * 3)
  const uvs = new Float32Array(vertexCount * 2)
  const indices: number[] = []

  // Accumulated orientation for gnarliness
  const orientation = new THREE.Euler(0, 0, 0)
  const orientationQ = new THREE.Quaternion()

  let vi = 0 // vertex index

  for (let i = 0; i <= sections; i++) {
    const t = i / sections

    // Sample curve at this section
    const point = curve.getPointAt(t)
    const tangent = curve.getTangentAt(t).normalize()

    // Compute radius with taper
    let sectionRadius: number
    if (i === sections) {
      sectionRadius = baseRadius * 0.02 // near-zero at tip
    } else {
      sectionRadius = baseRadius * (1 - taper * t)
      // Junction blend: if parentRadius given, first ring matches parent surface
      if (parentRadius && i === 0) {
        sectionRadius = Math.min(sectionRadius, parentRadius * 0.85)
      }
    }

    // Add gnarliness — skip first 2 sections to keep junction smooth
    if (i > 2) {
      const gnarl = gnarliness * Math.max(0.5, 1 / Math.sqrt(Math.max(sectionRadius, 0.2)))
      orientation.x += rngRange(-gnarl, gnarl)
      orientation.z += rngRange(-gnarl, gnarl)
    }
    orientationQ.setFromEuler(orientation)

    // Build frame: tangent → normal/binormal
    const up = Math.abs(tangent.y) > 0.99
      ? new THREE.Vector3(1, 0, 0)
      : new THREE.Vector3(0, 1, 0)
    const normal = new THREE.Vector3().crossVectors(tangent, up).normalize()
    const binormal = new THREE.Vector3().crossVectors(normal, tangent).normalize()

    // Apply twist
    const twistAngle = twist * t
    const cosT = Math.cos(twistAngle)
    const sinT = Math.sin(twistAngle)
    const twistedNormal = normal.clone().multiplyScalar(cosT).add(binormal.clone().multiplyScalar(sinT))
    const twistedBinormal = normal.clone().multiplyScalar(-sinT).add(binormal.clone().multiplyScalar(cosT))

    // Generate ring vertices
    for (let j = 0; j <= segments; j++) {
      const angle = (j / segments) * Math.PI * 2

      // Vertex position on the ring
      const ringOffset = twistedNormal.clone().multiplyScalar(Math.cos(angle) * sectionRadius)
        .add(twistedBinormal.clone().multiplyScalar(Math.sin(angle) * sectionRadius))

      // Apply gnarliness rotation
      ringOffset.applyQuaternion(orientationQ)

      const vertex = point.clone().add(ringOffset)
      const vertexNormal = ringOffset.clone().normalize()

      positions[vi * 3] = vertex.x
      positions[vi * 3 + 1] = vertex.y
      positions[vi * 3 + 2] = vertex.z
      normals[vi * 3] = vertexNormal.x
      normals[vi * 3 + 1] = vertexNormal.y
      normals[vi * 3 + 2] = vertexNormal.z
      uvs[vi * 2] = t              // v = along length
      uvs[vi * 2 + 1] = j / segments  // u = around ring

      vi++
    }

    // Generate indices connecting this ring to the next
    if (i < sections) {
      const ringStart = i * (segments + 1)
      const nextRingStart = (i + 1) * (segments + 1)
      for (let j = 0; j < segments; j++) {
        const a = ringStart + j
        const b = ringStart + j + 1
        const c = nextRingStart + j + 1
        const d = nextRingStart + j
        indices.push(a, b, c)
        indices.push(a, c, d)
      }
    }
  }

  // Base cap (close the bottom)
  const baseCenterIdx = vi
  const basePoint = curve.getPointAt(0)
  positions[vi * 3] = basePoint.x
  positions[vi * 3 + 1] = basePoint.y
  positions[vi * 3 + 2] = basePoint.z
  const baseTangent = curve.getTangentAt(0).normalize()
  normals[vi * 3] = -baseTangent.x
  normals[vi * 3 + 1] = -baseTangent.y
  normals[vi * 3 + 2] = -baseTangent.z
  uvs[vi * 2] = 0
  uvs[vi * 2 + 1] = 0.5
  vi++

  for (let j = 0; j < segments; j++) {
    indices.push(baseCenterIdx, j + 1, j)
  }

  // Tip cap
  const tipCenterIdx = vi
  const tipPoint = curve.getPointAt(1)
  positions[vi * 3] = tipPoint.x
  positions[vi * 3 + 1] = tipPoint.y
  positions[vi * 3 + 2] = tipPoint.z
  const tipTangent = curve.getTangentAt(1).normalize()
  normals[vi * 3] = tipTangent.x
  normals[vi * 3 + 1] = tipTangent.y
  normals[vi * 3 + 2] = tipTangent.z
  uvs[vi * 2] = 1
  uvs[vi * 2 + 1] = 0.5
  vi++

  const tipRingStart = sections * (segments + 1)
  for (let j = 0; j < segments; j++) {
    indices.push(tipCenterIdx, tipRingStart + j, tipRingStart + j + 1)
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3))
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
  geometry.setIndex(indices)
  geometry.computeBoundingSphere()

  return geometry
}

/**
 * Incrementally update branch geometry for growth animation.
 * Collapses unborn sections to the growth tip; as growthProgress increases they unfurl.
 */
export function updateBranchGrowth(
  geometry: THREE.BufferGeometry,
  curve: THREE.CatmullRomCurve3,
  growthProgress: number, // 0-1
  sections: number,
  segments: number,
  _baseRadius: number,
  _taper: number,
): void {
  const positions = geometry.attributes.position as THREE.BufferAttribute
  const arr = positions.array as Float32Array

  const tipT = growthProgress
  const tipPoint = curve.getPointAt(Math.min(tipT, 1))

  for (let i = 0; i <= sections; i++) {
    const t = i / sections
    for (let j = 0; j <= segments; j++) {
      const vi = i * (segments + 1) + j
      if (t > growthProgress) {
        // Collapse to tip point
        arr[vi * 3] = tipPoint.x
        arr[vi * 3 + 1] = tipPoint.y
        arr[vi * 3 + 2] = tipPoint.z
      }
      // else: keep original position (already set during initial build)
    }
  }
  positions.needsUpdate = true
}
