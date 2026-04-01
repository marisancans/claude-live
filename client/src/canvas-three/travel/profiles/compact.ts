/**
 * COMPACT PRE — Single implosion node with 6 internal converging streaks.
 * COMPACT POST — Single supernova node with 10 internal expanding streaks + ring.
 */
import * as THREE from 'three'
import type { SpawnParams } from '../types'
import { rand, scatter } from './helpers'

export function profileCompactPre(): SpawnParams {
  return {
    origin: scatter(80, 150),
    target: scatter(2, 8),
    color: new THREE.Color('#FFD060'),
    colorEnd: new THREE.Color('#ffffff'),
    travelTime: rand(0.8, 1.5),
    trailLength: 0,
    trailBrightness: 0,
    trailFadeTime: 5.0,
    headSize: 0,
    pathConfig: { type: 'linear', easing: 'easeInPow25' },
    _tool: 'compact:pre',
  }
}

export function profileCompactPost(_index: number): SpawnParams {
  return {
    origin: scatter(1, 5),
    target: scatter(70, 160),
    color: new THREE.Color('#FFE080'),
    colorEnd: new THREE.Color('#FFE080'),
    travelTime: rand(2.5, 4.0),
    trailLength: 0,
    trailBrightness: 0,
    trailFadeTime: 15.0,
    headSize: 0,
    pathConfig: { type: 'linear', easing: 'easeOutQuart' },
    _tool: 'compact:post',
  }
}
