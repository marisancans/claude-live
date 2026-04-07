import * as THREE from 'three'

/**
 * Generate a random position for a settled star / history node.
 * Power-law bias so density clumps less near center.
 * Flat Y distribution gives a disc-like nebula shape.
 *
 * @param radius — base scatter radius (default 120)
 */
export function randomStarPosition(radius = 120): THREE.Vector3 {
  const rx = (Math.random() - 0.5) * 2 * (20 + Math.pow(Math.random(), 0.6) * radius) * (0.4 + Math.random() * 2.1)
  const ry = (Math.random() - 0.5) * 2 * (20 + Math.pow(Math.random(), 0.6) * radius) * (0.1 + Math.random() * 0.4)
  const rz = (Math.random() - 0.5) * 2 * (20 + Math.pow(Math.random(), 0.6) * radius) * (0.4 + Math.random() * 2.1)
  return new THREE.Vector3(rx, ry, rz)
}
