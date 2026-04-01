/**
 * COMPACT PRE — Implosion. Used 6× via spawnBurst.
 * Gold streaks converging fast on core.
 *
 * COMPACT POST — Supernova. Used 10× via spawnBurst.
 * Node 0 gets the explosion ring.
 */
import * as THREE from 'three'
import type { SpawnParams } from '../types'
import { rand, scatter } from './helpers'

export function profileCompactPre(): SpawnParams {
  return {
    origin: scatter(55, 140),
    target: scatter(1, 5),
    color: new THREE.Color('#FFD060'),
    colorEnd: new THREE.Color('#ffffff'),
    travelTime: rand(1.0, 2.0),
    trailLength: 0.65,
    trailBrightness: 1.5,
    trailFadeTime: 6.0,
    headSize: 6,
    pathConfig: { type: 'linear', easing: 'easeInPow25' },
    _tool: 'compact:pre',
  }
}

export function profileCompactPost(index: number): SpawnParams {
  return {
    origin: new THREE.Vector3(rand(-2, 2), rand(-2, 2), rand(-2, 2)),
    target: scatter(50, 120),
    color: new THREE.Color('#FFE080'),
    colorEnd: new THREE.Color('#FFE080'),
    travelTime: rand(2.0, 4.5),
    trailLength: 0.68,
    trailBrightness: 1.8,
    trailFadeTime: 18.0,
    headSize: rand(5, 9),
    pathConfig: { type: 'linear', easing: 'easeOutQuart' },
    _tool: index === 0 ? 'compact:post:first' : 'compact:post',
  }
}
