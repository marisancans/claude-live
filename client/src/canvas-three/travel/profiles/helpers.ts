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

/** Very noisy scatter — broken symmetry, highly irregular jitter. */
export function scatter(rMin: number, rMax: number): THREE.Vector3 {
  const dir = randDir()
  // Skew radius more toward edges for a hollow-ish, wispy effect
  const r = rMin + (rMax - rMin) * Math.pow(Math.random(), 0.3)
  
  // Chaotic jitter: vary each axis independently with wider ranges
  // Reduced the Y flattening to make it less 'disk-like' but still slightly flattened
  return new THREE.Vector3(
    dir.x * r * rand(0.6, 1.8),
    dir.y * r * rand(0.3, 0.7), 
    dir.z * r * rand(0.6, 1.8),
  ).add(new THREE.Vector3(
    (Math.random() - 0.5) * 40,
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 40
  ))
}

export function perpTo(v: THREE.Vector3): THREE.Vector3 {
  const up = Math.abs(v.y) < 0.9
    ? new THREE.Vector3(0, 1, 0)
    : new THREE.Vector3(1, 0, 0)
  return up.clone().cross(v).normalize()
}

export const ZERO = new THREE.Vector3(0, 0, 0)
