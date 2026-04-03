import * as THREE from 'three'
import type { BranchVisual } from '../types'

export function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v))
}

export function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

export function easeInOutQuad(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

/** Build a single CatmullRomCurve3 from an ordered chain of branches */
export function curveFromChain(
  chain: BranchVisual[],
  direction: 'inward' | 'outward',
): THREE.CatmullRomCurve3 | null {
  if (chain.length === 0) return null

  const points: THREE.Vector3[] = []
  const ordered = direction === 'outward' ? chain : [...chain].reverse()

  for (const branch of ordered) {
    const branchPoints = direction === 'outward'
      ? branch.spec.curvePoints
      : [...branch.spec.curvePoints].reverse()
    for (const p of branchPoints) {
      const last = points[points.length - 1]
      if (!last || last.distanceToSquared(p) > 0.01) {
        points.push(p.clone())
      }
    }
  }

  if (points.length < 2) return null
  return new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.45)
}

/** Create a small particle trail Points geometry */
export function createTrailPoints(
  color: THREE.Color,
  count = 20,
): { points: THREE.Points; material: THREE.PointsMaterial; positions: Float32Array } {
  const positions = new Float32Array(count * 3)
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const material = new THREE.PointsMaterial({
    color,
    size: 1.2,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  })
  const points = new THREE.Points(geometry, material)
  points.renderOrder = 8
  return { points, material, positions }
}

/** Activate pulse + color on a chain of branches */
export function activateChain(chain: BranchVisual[], color: THREE.Color, contaminate = false) {
  for (const branch of chain) {
    branch.pulse = Math.max(branch.pulse, 1)
    branch.pulseColor.copy(color)
    if (contaminate) branch.contamination = Math.min(1, branch.contamination + 0.6)
  }
}

/** Progress a signal position along a branch chain.
 *  Returns { branchIndex, localT } indicating which branch the signal is on. */
export function signalProgress(
  chain: BranchVisual[],
  globalT: number,
): { branchIndex: number; localT: number } {
  const branchCount = chain.length
  if (branchCount === 0) return { branchIndex: 0, localT: 0 }
  const scaled = globalT * branchCount
  const branchIndex = Math.min(Math.floor(scaled), branchCount - 1)
  const localT = clamp(scaled - branchIndex, 0, 1)
  return { branchIndex, localT }
}
