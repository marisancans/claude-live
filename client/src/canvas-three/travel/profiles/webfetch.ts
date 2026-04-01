/**
 * WEBFETCH — Wide arc scouting the web.
 * Long outbound probe with wild sweeping arcs, then return echo on different arc.
 */
import * as THREE from 'three'
import type { SpawnParams } from '../types'
import { rand, scatter, perpTo, ZERO } from './helpers'

export function profileWebFetch(
  _toolInput?: Record<string, unknown> | null,
  _toolResponse?: Record<string, unknown> | null,
): SpawnParams {
  const target = scatter(200, 350)
  const dir = target.clone().normalize()
  const r = target.length()
  const perp = perpTo(dir)
  const perp2 = dir.clone().cross(perp).normalize()

  // Wild sweeping arc — scouts all around
  const c1 = dir.clone().multiplyScalar(r * 0.2)
    .addScaledVector(perp, rand(60, 120))
    .addScaledVector(perp2, rand(-40, 40))
  const c2 = dir.clone().multiplyScalar(r * 0.7)
    .addScaledVector(perp, rand(-30, 60))
    .addScaledVector(perp2, rand(-20, 20))

  // Echo returns on equally wild different arc
  const echoPerp = perpTo(dir.clone().negate())
  const echo: SpawnParams = {
    origin: target.clone(),
    target: scatter(3, 12),
    color: new THREE.Color('#f43f5e'),
    colorEnd: new THREE.Color('#fb7185'),
    travelTime: rand(4, 7),
    trailLength: 0.7,
    trailBrightness: 1.2,
    trailFadeTime: 20.0,
    headSize: 3,
    pathConfig: {
      type: 'cubic', easing: 'easeOutCubic',
      c1: target.clone().add(dir.clone().negate().multiplyScalar(r * 0.3))
        .addScaledVector(echoPerp, rand(-80, 80)),
      c2: target.clone().add(dir.clone().negate().multiplyScalar(r * 0.7))
        .addScaledVector(echoPerp, rand(-40, 40)),
    },
    _tool: 'WebFetch:echo',
  }

  return {
    origin: ZERO.clone(),
    target,
    color: new THREE.Color('#fb7185'),
    colorEnd: new THREE.Color('#fda4af'),
    travelTime: rand(6, 10),
    trailLength: 0.92,
    trailBrightness: 0.8,
    trailFadeTime: 25.0,
    headSize: 4,
    pathConfig: { type: 'cubic', easing: 'easeOutCubic', c1, c2 },
    pendingSpawn: echo,
    _tool: 'WebFetch',
  }
}
