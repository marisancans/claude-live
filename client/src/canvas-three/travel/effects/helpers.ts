import * as THREE from 'three'

/** Build a circle LineLoop geometry of given radius */
export function makeRingLoop(radius: number, segments = 48): THREE.BufferGeometry {
  const pts: THREE.Vector3[] = []
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2
    pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius))
  }
  return new THREE.BufferGeometry().setFromPoints(pts)
}

export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

export function rand(min: number, max: number): number {
  return Math.random() * (max - min) + min
}
