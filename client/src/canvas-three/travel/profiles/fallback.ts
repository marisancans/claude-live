/**
 * FALLBACK — Generic outbound particle for unknown tool names.
 */
import * as THREE from 'three'
import type { SpawnParams } from '../types'
import { rand, scatter, ZERO } from './helpers'

export function profileDefault(colorHex: string): SpawnParams {
  return {
    origin: ZERO.clone(),
    target: scatter(30, 90),
    color: new THREE.Color(colorHex),
    colorEnd: new THREE.Color(colorHex),
    travelTime: rand(3, 5),
    trailLength: 0.45,
    trailBrightness: 1.0,
    trailFadeTime: 10.0,
    headSize: 5,
    pathConfig: { type: 'linear', easing: 'easeOutCubic' },
    _tool: 'default',
  }
}
