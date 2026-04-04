/**
 * WEBFETCH radiating lines — three phases
 *
 * 1. Launch burst (elapsed 0–0.5s): 4 lines from origin at 0/90/180/270° in XZ
 * 2. Mid-relay flash (prog 0.45–0.55): 3 lines at midpoint of path
 * 3. Landing burst (onLand): 6 lines from target, random XZ angles
 */
import * as THREE from 'three'
import type { SpawnParams } from '../types'
import type { SecondaryEffect, EffectEntry } from './types'
import { samplePath } from '../easing'
import { rand } from './helpers'

export function buildWebFetchBranches(group: THREE.Group, p: SpawnParams): SecondaryEffect {
  const entries: EffectEntry[] = []
  let landed = false

  // 1. Launch burst: 4 lines from origin at 0°/90°/180°/270°
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2
    const end = new THREE.Vector3(Math.cos(angle) * 6, 0, Math.sin(angle) * 6).add(p.origin)
    const geo = new THREE.BufferGeometry().setFromPoints([p.origin.clone(), end])
    const mat = new THREE.LineBasicMaterial({
      color: new THREE.Color('#fb7185'),
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const line = new THREE.Line(geo, mat)
    group.add(line)
    entries.push({ obj: line, mat, meta: { type: 'launch' } })
  }

  // Midpoint for relay lines (pre-computed)
  const midPt = samplePath(p.pathConfig, p.origin, p.target, 0.5)

  // 2. Relay lines: 3 lines at midpoint
  for (let i = 0; i < 3; i++) {
    const angle = (i / 3) * Math.PI * 2
    const end = new THREE.Vector3(Math.cos(angle) * 4, (i - 1) * 1.5, Math.sin(angle) * 4)
      .add(midPt)
    const geo = new THREE.BufferGeometry().setFromPoints([midPt.clone(), end])
    const mat = new THREE.LineBasicMaterial({
      color: new THREE.Color('#fda4af'),
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const line = new THREE.Line(geo, mat)
    group.add(line)
    entries.push({ obj: line, mat, meta: { type: 'relay' } })
  }

  // Landing lines are created dynamically in onLand
  const landingLines: { mat: THREE.LineBasicMaterial; fadeTime: number }[] = []

  return {
    entries,
    tick(prog: number, dt: number, elapsed: number, _state: string, _head: THREE.Object3D) {
      // Launch burst fade
      for (const e of entries) {
        if (e.meta.type === 'launch') {
          ;(e.mat as THREE.LineBasicMaterial).opacity = Math.max(0, 0.7 - elapsed * 1.4)
        }
        if (e.meta.type === 'relay') {
          const inWindow = prog > 0.43 && prog < 0.57
          const rp = inWindow ? (prog - 0.43) / 0.07 : 0
          ;(e.mat as THREE.LineBasicMaterial).opacity = inWindow ? Math.sin(rp * Math.PI) * 0.6 : 0
        }
      }
      // Landing lines fade
      if (landed) {
        for (const ll of landingLines) {
          ll.mat.opacity = Math.max(0, ll.mat.opacity - dt / ll.fadeTime)
        }
      }
    },
    onLand() {
      landed = true
      // Create 6 landing burst lines from target
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + rand(0, 0.3)
        const len = rand(8, 14)
        const end = p.target.clone().add(
          new THREE.Vector3(Math.cos(angle) * len, rand(-1, 1), Math.sin(angle) * len)
        )
        const geo = new THREE.BufferGeometry().setFromPoints([p.target.clone(), end])
        const mat = new THREE.LineBasicMaterial({
          color: new THREE.Color('#fb7185'),
          transparent: true,
          opacity: 0.8,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
        const line = new THREE.Line(geo, mat)
        group.add(line)
        const fadeTime = rand(0.5, 0.9)
        landingLines.push({ mat, fadeTime })
        entries.push({ obj: line, mat, meta: { type: 'landing' } })
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
