/**
 * STOP — Slow inward droop. Exhausted particle sagging toward core.
 */
import * as THREE from 'three'
import type { SpawnParams } from '../types'
import { rand, scatter, nearCore } from './helpers'

export function profileStop(): SpawnParams {
  const origin = scatter(15, 45)
  const target = nearCore()
  const c1 = origin.clone().lerp(target, 0.5)
  c1.y -= rand(12, 25) // gravity sag
  return {
    origin, target,
    color: new THREE.Color('#777777'),
    colorEnd: new THREE.Color('#222222'),
    travelTime: rand(7, 11),
    trailLength: 0.2,
    trailBrightness: 0.35,
    trailFadeTime: 12.0,
    headSize: 3,
    pathConfig: { type: 'quadratic', easing: 'easeOutThenIn', c1 },
    _tool: 'Stop',
  }
}
