/**
 * EDIT — Surgical strike + impact flash + return echo.
 * Thin S-curve out, cross-flash at target, dim return.
 */
import * as THREE from 'three'
import type { SpawnParams } from '../types'
import { rand, scatter, perpTo, ZERO } from './helpers'

export function profileEdit(
  filePos?: THREE.Vector3,
  _toolInput?: Record<string, unknown> | null,
  _toolResponse?: Record<string, unknown> | null,
): SpawnParams {
  const target = filePos?.clone() ?? scatter(40, 80)
  const dir = target.clone().normalize()
  const r = target.length()
  const perp = perpTo(dir)
  const c1 = dir.clone().multiplyScalar(r * 1.6).add(perp.clone().multiplyScalar(rand(12, 22)))
  const c2 = target.clone().add(dir.clone().multiplyScalar(-10))

  const returnEcho: SpawnParams = {
    origin: target.clone(),
    target: scatter(2, 7),
    color: new THREE.Color('#a0d0ff'),
    colorEnd: new THREE.Color('#ffffff'),
    travelTime: rand(0.9, 1.4),
    trailLength: 0.32,
    trailBrightness: 0.9,
    trailFadeTime: 10.0,
    headSize: 3,
    pathConfig: { type: 'linear', easing: 'easeInCubic' },
    _tool: 'Edit:return',
  }

  return {
    origin: ZERO.clone(), target,
    color: new THREE.Color('#60a5fa'),
    colorEnd: new THREE.Color('#a0d0ff'),
    travelTime: rand(1.8, 2.5),
    trailLength: 0.28,
    trailBrightness: 1.3,
    trailFadeTime: 8.0,
    headSize: 4,
    pathConfig: { type: 'cubic', easing: 'easeInOut', c1, c2 },
    pendingSpawn: returnEcho,
    _tool: 'Edit',
  }
}
