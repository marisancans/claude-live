/**
 * ERROR lightning bolt zigzags
 *
 * 3 zigzag lightning bolt geometries from stall position toward random directions.
 * They flicker/strobe then fade.
 */
import * as THREE from 'three'
import type { SpawnParams } from '../types'
import type { SecondaryEffect, EffectEntry } from './types'
import { rand } from './helpers'

function makeLightningBolt(from: THREE.Vector3, to: THREE.Vector3, jitterAmp: number): THREE.BufferGeometry {
  const pts: THREE.Vector3[] = [from.clone()]
  const segments = 6
  for (let i = 1; i < segments; i++) {
    const t = i / segments
    const base = from.clone().lerp(to, t)
    const perp = new THREE.Vector3(
      Math.random() - 0.5,
      (Math.random() - 0.5) * 0.3,
      Math.random() - 0.5,
    ).normalize()
    base.addScaledVector(perp, (Math.random() - 0.5) * jitterAmp)
    pts.push(base)
  }
  pts.push(to.clone())
  return new THREE.BufferGeometry().setFromPoints(pts)
}

export function buildErrorForks(group: THREE.Group, _p: SpawnParams): SecondaryEffect {
  const entries: EffectEntry[] = []

  for (let i = 0; i < 3; i++) {
    // Placeholder geometry — rebuilt in onStall
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 0),
    ])
    const mat = new THREE.LineBasicMaterial({
      color: new THREE.Color('#f87171'),
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const bolt = new THREE.Line(geo, mat)
    bolt.visible = false
    group.add(bolt)
    entries.push({
      obj: bolt,
      mat,
      meta: {
        visible: false,
        stallElapsed: 0,
        // Pre-compute random direction for this bolt
        dir: new THREE.Vector3(
          Math.random() - 0.5,
          (Math.random() - 0.5) * 0.4,
          Math.random() - 0.5,
        ).normalize().multiplyScalar(rand(8, 18)),
      },
    })
  }

  return {
    entries,
    tick(_prog: number, dt: number, _elapsed: number, _state: string, _head: THREE.Object3D) {
      for (const e of entries) {
        if (!e.meta.visible) continue
        e.meta.stallElapsed += dt

        const le = e.meta.stallElapsed
        const mat = e.mat as THREE.LineBasicMaterial

        if (le < 0.4) {
          // Flicker: oscillate opacity
          mat.opacity = Math.sin(le * 40) * 0.3 + 0.7
        } else if (le < 0.7) {
          // Fade out
          const fadeT = (le - 0.4) / 0.3
          mat.opacity = Math.max(0, 1 - fadeT)
        } else {
          mat.opacity = 0
          e.obj.visible = false
        }
      }
    },
    onStall(stallPos: THREE.Vector3) {
      for (const e of entries) {
        // Rebuild geometry as zigzag from stall position
        const to = stallPos.clone().add(e.meta.dir)
        const newGeo = makeLightningBolt(stallPos, to, 3.5)
        ;(e.obj as THREE.Line).geometry.dispose()
        ;(e.obj as THREE.Line).geometry = newGeo

        e.obj.visible = true
        e.meta.visible = true
        e.meta.stallElapsed = 0
        ;(e.mat as THREE.LineBasicMaterial).opacity = 1.0
      }
    },
    applyFade(f: number) {
      for (const e of entries) {
        const m = e.mat as THREE.LineBasicMaterial
        m.opacity = Math.min(m.opacity, f)
      }
    },
  }
}
