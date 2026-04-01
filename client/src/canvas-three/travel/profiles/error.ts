/**
 * ERROR — Stall and die.
 * Shoots out fast, stops at 55–65% of path, vibrates briefly, fades in place.
 */
import * as THREE from 'three'
import type { SpawnParams } from '../types'
import { rand, scatter, perpTo, ZERO } from './helpers'

export function profileError(): SpawnParams {
  const target = scatter(25, 50)
  const dir = target.clone().normalize()
  const r = target.length()
  const c1 = dir.clone().multiplyScalar(r * 0.5)
    .add(perpTo(dir).multiplyScalar(rand(-12, 12)))
  return {
    origin: ZERO.clone(), target,
    color: new THREE.Color('#f87171'),
    colorEnd: new THREE.Color('#991111'),
    travelTime: rand(1.2, 2.0),
    trailLength: 0.42,
    trailBrightness: 2.5,
    trailFadeTime: 8.0,
    headSize: 6,
    stallAt: rand(0.55, 0.65),
    stallDuration: rand(0.3, 0.6),
    pathConfig: {
      type: 'noise', easing: 'linear', c1,
      noiseAmp: rand(4, 8), noiseFreq: rand(12, 20),
      noisePhase: rand(0, Math.PI * 2),
    },
    _tool: 'error',
  }
}
