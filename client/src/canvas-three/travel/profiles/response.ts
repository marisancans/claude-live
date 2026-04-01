/**
 * RESPONSE — Single nova node with 8 internal burst particles.
 * Radiates outward with fading streaks.
 */
import * as THREE from 'three'
import type { SpawnParams } from '../types'
import { rand, scatter } from './helpers'

export function profileResponse(_index: number): SpawnParams {
  return {
    origin: scatter(1, 4),
    target: scatter(80, 180),
    color: new THREE.Color('#7eb8f0'),
    colorEnd: new THREE.Color('#aad4ff'),
    travelTime: rand(2.0, 3.5),
    trailLength: 0,
    trailBrightness: 0,
    trailFadeTime: 12.0,
    headSize: 0,
    pathConfig: { type: 'linear', easing: 'easeOutQuart' },
    _tool: 'response',
  }
}
