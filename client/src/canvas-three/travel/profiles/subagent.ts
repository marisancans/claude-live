/**
 * SUBAGENT STOP — Gentle inbound arc. Agent returning home.
 */
import * as THREE from 'three'
import type { SpawnParams } from '../types'
import { rand, scatter, perpTo, ZERO } from './helpers'

export function profileSubagentStop(): SpawnParams {
  const origin = scatter(80, 165)
  const target = scatter(6, 18)
  const c1 = origin.clone().lerp(ZERO, 0.4)
    .add(perpTo(origin.clone().normalize()).multiplyScalar(rand(14, 32)))
  return {
    origin, target,
    color: new THREE.Color('#c084fc'),
    colorEnd: new THREE.Color('#c084fc'),
    travelTime: rand(5, 7.5),
    trailLength: 0.48,
    trailBrightness: 1.0,
    trailFadeTime: 14.0,
    headSize: 5,
    pathConfig: { type: 'quadratic', easing: 'easeOutThenIn', c1 },
    _tool: 'SubagentStop',
  }
}
