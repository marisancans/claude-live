/**
 * GLOB — Seeker beam flies to search space, missiles scatter on landing.
 */
import * as THREE from 'three'
import type { SpawnParams } from '../types'
import { rand, randDir, perpTo, ZERO } from './helpers'

/** Build the main Glob beam. */
export function profileGlob(resultCount = 0): SpawnParams {
  // Search direction — flat in XZ, biased toward mid distances
  const dir = randDir()
  dir.y *= 0.1
  dir.normalize()
  const r = rand(55, 130)
  const target = dir.clone().multiplyScalar(r)
  target.y *= 0.15

  // Slight quadratic bend so the beam curves rather than arrowing straight
  const perp = perpTo(dir)
  const c1 = dir.clone().multiplyScalar(r * 0.5)
    .add(perp.clone().multiplyScalar(rand(-15, 15)))

  return {
    origin: ZERO.clone(),
    target,
    color: new THREE.Color('#c4b5fd'),
    colorEnd: new THREE.Color('#e9d5ff'),
    travelTime: rand(0.9, 1.4),
    trailLength: 0,
    trailBrightness: 0,
    trailFadeTime: rand(14.0, 20.0),
    headSize: 0,
    pathConfig: { type: 'quadratic', easing: 'easeInOut', c1 },
    _tool: 'Glob',
  }
}
