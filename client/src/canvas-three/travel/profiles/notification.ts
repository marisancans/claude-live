/**
 * NOTIFICATION — Expanding ring pulse. No head, no trail.
 * 3 concentric rings expand outward.
 */
import * as THREE from 'three'
import type { SpawnParams } from '../types'
import { ZERO } from './helpers'

export function profileNotification(): SpawnParams {
  return {
    origin: ZERO.clone(),
    target: ZERO.clone(),
    color: new THREE.Color('#34d399'),
    colorEnd: new THREE.Color('#34d399'),
    travelTime: 999,
    trailLength: 0,
    trailBrightness: 0,
    trailFadeTime: 8.0,
    headSize: 0,
    pathConfig: { type: 'linear', easing: 'linear' },
    _tool: 'Notification',
  }
}
