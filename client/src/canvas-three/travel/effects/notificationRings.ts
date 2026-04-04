/**
 * NOTIFICATION dashed sonar blip rings
 *
 * Dashed/dotted circle rings expand outward — a sonar ping feel.
 * Uses THREE.LineSegments with pairs of points per dash.
 * Same timing as original solid rings, but dashed for sonar feel.
 */
import * as THREE from 'three'
import type { SecondaryEffect, EffectEntry } from './types'
import { easeOutCubic } from './helpers'

function makeDashedRing(dashCount: number): THREE.BufferGeometry {
  const pts: THREE.Vector3[] = []
  for (let i = 0; i < dashCount; i++) {
    const a0 = (i / dashCount) * Math.PI * 2
    const a1 = ((i + 0.55) / dashCount) * Math.PI * 2  // 55% dash, 45% gap
    pts.push(new THREE.Vector3(Math.cos(a0), 0, Math.sin(a0)))
    pts.push(new THREE.Vector3(Math.cos(a1), 0, Math.sin(a1)))
  }
  return new THREE.BufferGeometry().setFromPoints(pts)
}

export function buildNotificationRings(group: THREE.Group): SecondaryEffect {
  const maxRadii  = [20, 35, 52]
  const delays    = [0, 0.12, 0.24]
  const opacities = [0.9, 0.6, 0.32]
  const colors    = ['#34d399', '#6ee7b7', '#a7f3d0']
  const entries: EffectEntry[] = []

  for (let i = 0; i < 3; i++) {
    const geo = makeDashedRing(12)
    const mat = new THREE.LineBasicMaterial({
      color: new THREE.Color(colors[i]),
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const ring = new THREE.LineSegments(geo, mat)
    ring.rotation.x = Math.PI / 2
    group.add(ring)
    entries.push({
      obj: ring,
      mat,
      meta: {
        maxRadius:   maxRadii[i],
        delay:       delays[i],
        baseOpacity: opacities[i],
        expandTime:  0.9 + i * 0.15,
      },
    })
  }

  const effect: SecondaryEffect = {
    entries,
    tick(_prog: number, _dt: number, elapsed: number, _state: string, _head: THREE.Object3D) {
      let allDone = true
      for (const e of entries) {
        const { maxRadius, delay, baseOpacity, expandTime } = e.meta
        const t = Math.max(0, elapsed - delay)
        const expandT = Math.min(1, t / expandTime)
        const scale = easeOutCubic(expandT) * maxRadius
        e.obj.scale.set(scale, scale, scale)
        const fadeT = Math.max(0, t - expandTime) / 0.5
        ;(e.mat as THREE.LineBasicMaterial).opacity = baseOpacity * Math.max(0, 1 - fadeT)
        if (fadeT < 1) allDone = false
        if (fadeT >= 1) e.obj.visible = false
      }
      // Signal node completion when all rings have faded
      if (allDone && elapsed > 0.5) {
        effect.shouldMarkDone = true
      }
    },
    // Notification rings have their own lifetimes — skip external fade
    applyFade(_f: number) {},
    shouldMarkDone: false,
  }

  return effect
}
