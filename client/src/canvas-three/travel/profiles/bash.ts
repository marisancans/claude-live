/**
 * BASH — Firework burst with optional return echo on first spark.
 * Each node is a chaotic spark in a random direction.
 * Node index 0 gets the origin ring secondary + return echo.
 */
import * as THREE from 'three'
import type { SpawnParams } from '../types'
import { rand, scatter, perpTo } from './helpers'

export function profileBash(
  index: number,
  _toolInput?: Record<string, unknown> | null,
  _toolResponse?: Record<string, unknown> | null,
): SpawnParams {
  const target = scatter(20, 90)
  const dir = target.clone().normalize()
  const r = target.length()

  const base: SpawnParams = {
    origin: new THREE.Vector3(rand(-2, 2), rand(-2, 2), rand(-2, 2)),
    target,
    color: new THREE.Color('#f59e0b'),
    colorEnd: new THREE.Color('#f97316'),
    travelTime: rand(2.2, 3.2),
    trailLength: 0.45,
    trailBrightness: 2.0,
    trailFadeTime: rand(20.0, 28.0),
    headSize: 0,
    pathConfig: {
      type: 'noise', easing: 'easeOutCubic',
      c1: dir.clone().multiplyScalar(r * 0.5)
        .add(perpTo(dir).multiplyScalar(rand(-20, 20))),
      noiseAmp: rand(8, 20),
      noiseFreq: rand(3, 8),
      noisePhase: rand(0, Math.PI * 2),
    },
    _tool: index === 0 ? 'Bash:first' : 'Bash',
  }

  return base
}
