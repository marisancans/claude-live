import * as THREE from 'three'

export function rand(min: number, max: number) { return Math.random() * (max - min) + min }

export function randDir(): THREE.Vector3 {
  const theta = Math.random() * Math.PI * 2
  const phi = Math.acos(2 * Math.random() - 1)
  return new THREE.Vector3(
    Math.sin(phi) * Math.cos(theta),
    Math.sin(phi) * Math.sin(theta),
    Math.cos(phi),
  )
}

/**
 * Sparse, non-uniform scatter — looks like a messy galaxy arm, not a sphere.
 * Each axis is independently scaled with large random multipliers so the
 * cloud is stretched, clumped, and irregular. With 10k points it still
 * looks like a wispy nebula, not a shell.
 */
export function scatter(rMin: number, rMax: number): THREE.Vector3 {
  // Raw random components — NOT normalized direction — breaks spherical symmetry entirely
  const x = (Math.random() - 0.5) * 2
  const y = (Math.random() - 0.5) * 2
  const z = (Math.random() - 0.5) * 2

  // Each axis gets its own independent radius sample — creates ellipsoidal clumping
  const rx = rMin + (rMax - rMin) * Math.pow(Math.random(), 1.8)
  const ry = rMin + (rMax - rMin) * Math.pow(Math.random(), 1.8)
  const rz = rMin + (rMax - rMin) * Math.pow(Math.random(), 1.8)

  // Strong Y compression — flat disk-ish but not uniform
  return new THREE.Vector3(
    x * rx * rand(0.4, 2.5),
    y * ry * rand(0.1, 0.5),
    z * rz * rand(0.4, 2.5),
  )
}

export function perpTo(v: THREE.Vector3): THREE.Vector3 {
  const up = Math.abs(v.y) < 0.9
    ? new THREE.Vector3(0, 1, 0)
    : new THREE.Vector3(1, 0, 0)
  return up.clone().cross(v).normalize()
}

export const ZERO = new THREE.Vector3(0, 0, 0)

/** Small jitter near the session core (0,0,0). Use for targets that should land at core. */
export function nearCore(jitter = 4): THREE.Vector3 {
  return new THREE.Vector3(
    (Math.random() - 0.5) * jitter,
    (Math.random() - 0.5) * jitter,
    (Math.random() - 0.5) * jitter,
  )
}
