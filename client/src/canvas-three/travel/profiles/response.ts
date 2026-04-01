/**
 * RESPONSE — Nova burst. Used 8× via spawnBurst.
 * Node 0 gets the ring secondary.
 */
import * as THREE from 'three'
import type { SpawnParams } from '../types'
import { rand, scatter } from './helpers'

export function profileResponse(index: number): SpawnParams {
  return {
    origin: new THREE.Vector3(rand(-1, 1), rand(-1, 1), rand(-1, 1)),
    target: scatter(70, 160),
    color: new THREE.Color('#7eb8f0'),
    colorEnd: new THREE.Color('#aad4ff'),
    travelTime: rand(1.5, 3.0),
    trailLength: 0.75,
    trailBrightness: 2.0,
    trailFadeTime: 16.0,
    headSize: 6,
    pathConfig: { type: 'linear', easing: 'easeOutQuart' },
    _tool: index === 0 ? 'response:first' : 'response',
  }
}
