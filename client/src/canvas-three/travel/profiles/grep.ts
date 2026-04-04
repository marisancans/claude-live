/**
 * GREP — Radar sweep arc + return ping.
 * Long phosphor trail, ghost arc, then "found" ping returns.
 */
import * as THREE from 'three'
import type { SpawnParams } from '../types'
import { rand, scatter, randDir, perpTo, ZERO, nearCore } from './helpers'

export function profileGrep(
  filePos?: THREE.Vector3,
  _toolInput?: Record<string, unknown> | null,
  toolResponse?: Record<string, unknown> | null,
): SpawnParams {
  // If we know the file position, sweep toward it; otherwise random arc
  const target = filePos?.clone() ?? undefined
  const r = target ? target.length() * rand(0.85, 1.1) : rand(55, 115)
  const sweepAngle = rand(Math.PI / 3, Math.PI * 0.75)
  const launchDir = target
    ? target.clone().normalize().applyAxisAngle(new THREE.Vector3(0, 1, 0), rand(-0.4, 0.4))
    : (() => { const d = randDir(); d.y *= 0.1; return d.normalize() })()
  const perp = perpTo(launchDir)
  const arcCenter = perp.clone().multiplyScalar(r)
  const startAngle = Math.atan2(-arcCenter.z, -arcCenter.x)
  const arcTarget = target ?? new THREE.Vector3(
    arcCenter.x + Math.cos(startAngle + sweepAngle) * r,
    arcCenter.y * rand(0.08, 0.25),
    arcCenter.z + Math.sin(startAngle + sweepAngle) * r,
  )

  const returnPing: SpawnParams = {
    origin: arcTarget.clone(),
    target: nearCore(),
    color: new THREE.Color('#e879f9'),
    colorEnd: new THREE.Color('#ffffff'),
    travelTime: rand(0.7, 1.1),
    trailLength: 0.25,
    trailBrightness: 1.5,
    trailFadeTime: 8.0,
    headSize: 5,
    pathConfig: { type: 'linear', easing: 'easeInCubic' },
    _tool: 'Grep:return',
  }

  return {
    origin: ZERO.clone(), target: arcTarget,
    color: new THREE.Color('#e879f9'),
    colorEnd: new THREE.Color('#e879f9'),
    travelTime: rand(6, 9),
    trailLength: 0.9,
    trailBrightness: 1.0,
    trailFadeTime: 16.0,
    headSize: 0,
    pathConfig: {
      type: 'arc', easing: 'linear',
      arcCenter, arcStartAngle: startAngle,
      arcSweepAngle: sweepAngle, arcRadius: r,
    },
    pendingSpawn: returnPing,
    _tool: 'Grep',
  }
}
