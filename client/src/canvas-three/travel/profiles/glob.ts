/**
 * GLOB — Single search beam: fires out, mid-flight sweep arms, results burst at landing.
 *
 * One node travels core → search space with a sharp violet head.
 * At midpoint (midSpawnFrac=0.5): 3 thin sweep arms fan out briefly then fade.
 * On landing: N result sparks scatter outward (one per found file, capped at 8).
 */
import * as THREE from 'three'
import type { SpawnParams } from '../types'
import { rand, scatter, randDir, perpTo, ZERO } from './helpers'

/** Build the main Glob beam. resultCount drives how many sparks pop at landing. */
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

  // Sweep arms fired at midpoint — 3 thin rays fanning out from current position
  const sweepArms = buildSweepArms(target)

  // Result sparks at landing — tiny violet bursts, one per found file (max 8)
  const resultSparks = buildResultSparks(target, resultCount)

  return {
    origin: ZERO.clone(),
    target,
    color: new THREE.Color('#c4b5fd'),
    colorEnd: new THREE.Color('#e9d5ff'),
    travelTime: rand(0.9, 1.4),
    trailLength: rand(0.25, 0.38),
    trailBrightness: rand(1.8, 2.4),
    trailFadeTime: rand(14.0, 20.0),
    headSize: rand(4, 6),
    pathConfig: { type: 'quadratic', easing: 'easeInOut', c1 },
    midSpawnFrac: 0.5,
    pendingSpawns: [...sweepArms, ...resultSparks],
    _tool: 'Glob',
  }
}

/** 3 thin sweep arms fan outward from near the landing zone at mid-flight. */
function buildSweepArms(nearTarget: THREE.Vector3): SpawnParams[] {
  const baseDir = nearTarget.clone().normalize()
  const perp = perpTo(baseDir)
  const perp2 = baseDir.clone().cross(perp).normalize()

  return [-1, 0, 1].map((offset, i) => {
    const spread = offset * rand(0.35, 0.55)
    const armDir = baseDir.clone()
      .addScaledVector(perp, Math.sin(spread))
      .addScaledVector(perp2, (Math.random() - 0.5) * 0.1)
      .normalize()
    const armLen = rand(18, 40)
    const armTarget = nearTarget.clone().add(armDir.multiplyScalar(armLen))
    armTarget.y *= 0.2

    return {
      origin: nearTarget.clone(),
      target: armTarget,
      color: new THREE.Color('#a78bfa'),
      colorEnd: new THREE.Color('#a78bfa'),
      travelTime: rand(0.5, 0.9),
      trailLength: 0.85,
      trailBrightness: rand(0.6, 1.0),
      trailFadeTime: rand(1.5, 3.0),
      headSize: 0,
      spawnDelay: i * 0.04,
      pathConfig: { type: 'linear', easing: 'linear' },
      _tool: 'Glob:sweep',
    } as SpawnParams
  })
}

/** Tiny result sparks scatter from landing point — one per found file, max 8. */
function buildResultSparks(origin: THREE.Vector3, count: number): SpawnParams[] {
  const n = Math.min(count, 8)
  return Array.from({ length: n }, (_, i) => {
    const dir = randDir()
    dir.y *= 0.3
    dir.normalize()
    const sparkTarget = origin.clone().add(dir.multiplyScalar(rand(6, 18)))

    return {
      origin: origin.clone(),
      target: sparkTarget,
      color: new THREE.Color('#ddd6fe'),
      colorEnd: new THREE.Color('#ddd6fe'),
      travelTime: rand(0.3, 0.7),
      trailLength: 0.6,
      trailBrightness: 1.2,
      trailFadeTime: rand(4.0, 8.0),
      headSize: rand(2, 3),
      spawnDelay: i * 0.03,
      pathConfig: { type: 'linear', easing: 'easeOutCubic' },
      _tool: 'Glob:result',
    } as SpawnParams
  })
}
