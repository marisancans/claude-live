/**
 * EDIT spike slam effect
 *
 * On land:
 * Phase 1 (0–0.15s): vertical spike slams down from above target to target
 * Phase 2 (0.12–0.45s): write line draws itself in travel direction
 * Phase 3 (0.4–0.8s): spike retracts upward, write line fades
 */
import * as THREE from 'three'
import type { SpawnParams } from '../types'
import type { SecondaryEffect, EffectEntry } from './types'

function easeInCubic(t: number) { return t * t * t }
function easeOutCubic(t: number) { return 1 - Math.pow(1 - t, 3) }

export function buildEditCross(group: THREE.Group, p: SpawnParams): SecondaryEffect {
  const target = p.target.clone()
  const travelDir = p.target.clone().sub(p.origin).normalize()

  // Spike: vertical line slamming down — starts above, tip slams to target.y
  const spikeArr = new Float32Array([
    target.x, target.y + 20, target.z,  // top (stays)
    target.x, target.y + 20, target.z,  // bottom (animated down)
  ])
  const spikeGeo = new THREE.BufferGeometry()
  spikeGeo.setAttribute('position', new THREE.BufferAttribute(spikeArr, 3))
  const spikeMat = new THREE.LineBasicMaterial({
    color: new THREE.Color('#ffffff'),
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
  const spike = new THREE.Line(spikeGeo, spikeMat)
  spike.visible = false
  group.add(spike)

  // Write line: grows from center outward in travel direction
  const writeArr = new Float32Array([
    target.x, target.y, target.z,  // left end (starts at center)
    target.x, target.y, target.z,  // right end (starts at center)
  ])
  const writeGeo = new THREE.BufferGeometry()
  writeGeo.setAttribute('position', new THREE.BufferAttribute(writeArr, 3))
  const writeMat = new THREE.LineBasicMaterial({
    color: new THREE.Color('#60a5fa'),
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
  const writeLine = new THREE.Line(writeGeo, writeMat)
  writeLine.visible = false
  group.add(writeLine)

  const entries: EffectEntry[] = [
    { obj: spike, mat: spikeMat, meta: {} },
    { obj: writeLine, mat: writeMat, meta: {} },
  ]

  let landed = false
  let landElapsed = 0

  return {
    entries,
    tick(_prog: number, dt: number, _elapsed: number, _state: string, _head: THREE.Object3D) {
      if (!landed) return
      landElapsed += dt
      const t = landElapsed

      // Phase 1 (0–0.35s): spike slams down
      if (t < 0.35) {
        spike.visible = true
        spikeMat.opacity = 1.0
        const slamT = Math.min(1, t / 0.15)
        const bottomY = target.y + 20 * (1 - easeInCubic(slamT))
        spikeArr[3] = bottomY
        ;(spikeGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true
      }

      // Phase 2 (0.12–0.6s): write line draws itself
      if (t > 0.12 && t < 0.6) {
        writeLine.visible = true
        const writeT = Math.min(1, (t - 0.12) / 0.33)
        const spread = easeOutCubic(writeT) * 6
        writeArr[0] = target.x - travelDir.x * spread
        writeArr[1] = target.y - travelDir.y * spread
        writeArr[2] = target.z - travelDir.z * spread
        writeArr[3] = target.x + travelDir.x * spread
        writeArr[4] = target.y + travelDir.y * spread
        writeArr[5] = target.z + travelDir.z * spread
        ;(writeGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true
        writeMat.opacity = Math.min(1, (t - 0.12) / 0.1)
      }

      // Phase 3 (0.4–0.8s): spike retracts, write line fades
      if (t > 0.4) {
        const retractT = Math.min(1, (t - 0.4) / 0.25)
        const bottomY = target.y + 20 * easeOutCubic(retractT)
        spikeArr[3] = bottomY
        ;(spikeGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true
        spikeMat.opacity = Math.max(0, 1 - retractT)
        writeMat.opacity = Math.max(0, 1 - (t - 0.4) / 0.3)
      }

      if (t > 0.8) {
        spike.visible = false
        writeLine.visible = false
      }
    },
    onLand() {
      landed = true
    },
    applyFade(f: number) {
      spikeMat.opacity = Math.min(spikeMat.opacity, f)
      writeMat.opacity = Math.min(writeMat.opacity, f)
    },
  }
}
