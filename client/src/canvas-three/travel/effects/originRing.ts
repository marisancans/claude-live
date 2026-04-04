import * as THREE from 'three'
import type { SecondaryEffect, EffectEntry } from './types'
import { makeRingLoop, easeOutCubic } from './helpers'

export function buildOriginRing(
  group: THREE.Group,
  maxRadius: number,
  color: string,
  duration: number,
): SecondaryEffect {
  const geo = makeRingLoop(1)
  const mat = new THREE.LineBasicMaterial({
    color: new THREE.Color(color),
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
  const ring = new THREE.Line(geo, mat)
  ring.rotation.x = Math.PI / 2
  group.add(ring)

  const entry: EffectEntry = { obj: ring, mat, meta: { startElapsed: 0 } }

  return {
    entries: [entry],
    tick(_prog: number, _dt: number, elapsed: number, _state: string, _head: THREE.Object3D) {
      if (!entry.meta.startElapsed) entry.meta.startElapsed = elapsed
      const lt = (elapsed - entry.meta.startElapsed) / duration
      const scale = easeOutCubic(Math.min(1, lt)) * maxRadius
      ring.scale.set(scale, scale, scale)
      mat.opacity = Math.max(0, (1 - lt) * 0.9)
      if (lt >= 1.2) ring.visible = false
    },
    applyFade(f: number) {
      mat.opacity = Math.min(mat.opacity, f)
    },
  }
}
