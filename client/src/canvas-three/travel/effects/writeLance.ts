/**
 * WRITE lance effect — ink splat at landing
 *
 * During travel: faint full-length lance line.
 * On landing: 8 short lines radiate at random angles (ink splat) + partial arc.
 */
import * as THREE from 'three'
import type { SpawnParams } from '../types'
import type { SecondaryEffect, EffectEntry } from './types'
import { rand } from './helpers'

export function buildWriteLance(group: THREE.Group, p: SpawnParams): SecondaryEffect {
  const entries: EffectEntry[] = []

  // Lance line — full path, fades during travel
  const lanceGeo = new THREE.BufferGeometry().setFromPoints([
    p.origin.clone(),
    p.target.clone(),
  ])
  const lanceMat = new THREE.LineBasicMaterial({
    color: new THREE.Color('#ffffff'),
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
  const lance = new THREE.Line(lanceGeo, lanceMat)
  group.add(lance)
  entries.push({ obj: lance, mat: lanceMat, meta: { isLance: true } })

  // Pre-create 8 splat lines (invisible until land)
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2 + rand(-0.4, 0.4)
    const length = rand(3, 12)
    const peakOpacity = rand(0.6, 1.0)
    const geo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(Math.cos(angle) * length, 0, Math.sin(angle) * length),
    ])
    const mat = new THREE.LineBasicMaterial({
      color: new THREE.Color('#88bbff'),
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const splat = new THREE.Line(geo, mat)
    splat.position.copy(p.target)
    splat.visible = false
    group.add(splat)
    entries.push({
      obj: splat,
      mat,
      meta: { isSplat: true, peakOpacity, splatElapsed: 0, active: false },
    })
  }

  // Pre-create arc (120-degree partial arc around target, radius 10)
  const arcPts: THREE.Vector3[] = []
  const arcSegments = 16
  const arcSpan = (2 * Math.PI) / 3  // 120 degrees
  const arcOffset = rand(0, Math.PI * 2)
  for (let i = 0; i <= arcSegments; i++) {
    const a = arcOffset + (i / arcSegments) * arcSpan
    arcPts.push(new THREE.Vector3(Math.cos(a) * 10, 0, Math.sin(a) * 10))
  }
  const arcGeo = new THREE.BufferGeometry().setFromPoints(arcPts)
  const arcMat = new THREE.LineBasicMaterial({
    color: new THREE.Color('#ccddff'),
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
  const arc = new THREE.Line(arcGeo, arcMat)
  arc.position.copy(p.target)
  arc.visible = false
  group.add(arc)
  entries.push({
    obj: arc,
    mat: arcMat,
    meta: { isArc: true, arcElapsed: 0, active: false },
  })

  return {
    entries,
    tick(prog: number, dt: number, _elapsed: number, _state: string, _head: THREE.Object3D) {
      // Lance fades during travel
      lanceMat.opacity = Math.max(0, 0.65 - prog * 1.8)

      // Splat lines fade over 1.2s after activation
      for (let i = 1; i <= 8; i++) {
        const e = entries[i]
        if (!e.meta.active) continue
        e.meta.splatElapsed += dt
        const t = e.meta.splatElapsed
        const opacity = Math.max(0, e.meta.peakOpacity - t * 0.8)
        ;(e.mat as THREE.LineBasicMaterial).opacity = opacity
      }

      // Arc fades over 0.8s after activation
      const arcEntry = entries[entries.length - 1]
      if (arcEntry.meta.active) {
        arcEntry.meta.arcElapsed += dt
        ;(arcEntry.mat as THREE.LineBasicMaterial).opacity = Math.max(0, 0.6 - arcEntry.meta.arcElapsed / 0.8)
      }
    },
    onLand() {
      // Activate all splat lines
      for (let i = 1; i <= 8; i++) {
        const e = entries[i]
        e.obj.visible = true
        e.meta.active = true
        e.meta.splatElapsed = 0
        ;(e.mat as THREE.LineBasicMaterial).opacity = e.meta.peakOpacity
      }
      // Activate arc
      const arcEntry = entries[entries.length - 1]
      arcEntry.obj.visible = true
      arcEntry.meta.active = true
      arcEntry.meta.arcElapsed = 0
      ;(arcEntry.mat as THREE.LineBasicMaterial).opacity = 0.6
    },
    applyFade(f: number) {
      for (const e of entries) {
        const m = e.mat as THREE.LineBasicMaterial
        m.opacity = Math.min(m.opacity, f)
      }
    },
  }
}
