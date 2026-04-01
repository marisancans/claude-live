/**
 * READ custom trail — fixed-size dashes along the path, no stretching.
 *
 * Each dash is a short fixed-length stub (world-space size) placed at a
 * sampled point along the path. Dashes do NOT stretch — their length is
 * constant. Only their positions move as the node travels.
 *
 * Visual properties:
 *   - 10 dots/dashes, brightest near head, dim at tail
 *   - Scan pulse wave ripples backward along the chain
 *   - Head cross-stroke perpendicular to travel direction
 *   - Green (#4ade80) fading to dim cyan at tail
 */
import * as THREE from 'three'
import type { SpawnParams } from '../types'
import type { SecondaryEffect, EffectEntry } from './types'
import { samplePath, applyEasing } from '../easing'

const DASH_COUNT  = 10     // number of dots
const TRAIL_COVER = 0.50   // fraction of total path that the trail spans behind head
const DOT_LEN     = 4.0    // fixed world-space half-length of each dash along travel dir

export function buildReadTrail(group: THREE.Group, p: SpawnParams): SecondaryEffect {
  const dashMats: THREE.LineBasicMaterial[] = []
  const dashLines: THREE.Line[] = []
  const dashPosArrs: Float32Array[] = []

  for (let i = 0; i < DASH_COUNT; i++) {
    const posArr = new Float32Array(6) // pt A + pt B
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(posArr, 3))
    const mat = new THREE.LineBasicMaterial({
      color: new THREE.Color('#4ade80'),
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const line = new THREE.Line(geo, mat)
    group.add(line)
    dashLines.push(line)
    dashMats.push(mat)
    dashPosArrs.push(posArr)
  }

  // Leading cross-stroke perpendicular to travel dir
  const crossPosArr = new Float32Array(6)
  const crossGeo = new THREE.BufferGeometry()
  crossGeo.setAttribute('position', new THREE.BufferAttribute(crossPosArr, 3))
  const crossMat = new THREE.LineBasicMaterial({
    color: new THREE.Color('#88ffcc'),
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
  const crossLine = new THREE.Line(crossGeo, crossMat)
  group.add(crossLine)

  const entries: EffectEntry[] = [
    ...dashLines.map((obj, i) => ({ obj, mat: dashMats[i], meta: {} })),
    { obj: crossLine, mat: crossMat, meta: {} },
  ]

  // Reusable vectors
  const _dir = new THREE.Vector3()
  const _perp = new THREE.Vector3()
  const _up = new THREE.Vector3(0, 1, 0)
  const _right = new THREE.Vector3(1, 0, 0)

  let fadeVal = 1.0

  return {
    entries,
    suppressDefaultTrail: true,

    trailTick(prog: number, _dt: number, elapsed: number, head: THREE.Object3D) {
      const trailStart = Math.max(0, prog - TRAIL_COVER)
      const span = prog - trailStart

      // Compute travel direction at head for cross-stroke orientation
      const headEase = applyEasing(p.pathConfig.easing, prog)
      const backEase = applyEasing(p.pathConfig.easing, Math.max(0, prog - 0.02))
      const headPt = samplePath(p.pathConfig, p.origin, p.target, headEase)
      const backPt = samplePath(p.pathConfig, p.origin, p.target, backEase)
      _dir.copy(headPt).sub(backPt)
      if (_dir.lengthSq() < 0.0001) _dir.set(0, 0, 1)
      _dir.normalize()

      // Perpendicular to travel in the XZ plane (stable, no flip)
      _perp.crossVectors(_dir, _up)
      if (_perp.lengthSq() < 0.01) _perp.crossVectors(_dir, _right)
      _perp.normalize()

      for (let i = 0; i < DASH_COUNT; i++) {
        // i=0 is the head dash, i=DASH_COUNT-1 is the tail
        const t = trailStart + span * (1 - i / (DASH_COUNT - 1))  // head=prog, tail=trailStart
        if (t < 0) { dashMats[i].opacity = 0; continue }

        const te = applyEasing(p.pathConfig.easing, t)
        const pt = samplePath(p.pathConfig, p.origin, p.target, te)

        // Get local travel direction at this point for dash orientation
        const te2 = applyEasing(p.pathConfig.easing, Math.max(0, t - 0.015))
        const pt2 = samplePath(p.pathConfig, p.origin, p.target, te2)
        _dir.copy(pt).sub(pt2)
        if (_dir.lengthSq() < 0.0001) _dir.set(0, 0, 1)
        _dir.normalize()

        // Fixed-size dash along travel direction
        const arr = dashPosArrs[i]
        arr[0] = pt.x - _dir.x * DOT_LEN; arr[1] = pt.y - _dir.y * DOT_LEN; arr[2] = pt.z - _dir.z * DOT_LEN
        arr[3] = pt.x + _dir.x * DOT_LEN; arr[4] = pt.y + _dir.y * DOT_LEN; arr[5] = pt.z + _dir.z * DOT_LEN
        ;(dashLines[i].geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true

        // Brightness: head=bright, tail=dim + scan pulse
        const posAlongTrail = i / (DASH_COUNT - 1)   // 0=head, 1=tail
        const baseBright = Math.pow(1 - posAlongTrail, 1.6) * 0.85
        const pulsePhase = (elapsed * 2.2) % 1.0
        const pulseDist = Math.abs(posAlongTrail - pulsePhase)
        const pulseBright = Math.max(0, 1 - pulseDist * 7) * 0.45

        dashMats[i].opacity = (baseBright + pulseBright) * fadeVal

        // Color: head=cyan-white, tail=green
        const headness = 1 - posAlongTrail
        dashMats[i].color.setRGB(
          0.29 + 0.24 * headness,   // r: 0.29 → 0.53
          0.87,                      // g: stays bright
          0.50 + 0.30 * headness,   // b: 0.50 → 0.80
        )
      }

      // Cross-stroke at head — perpendicular, fixed width
      const halfW = 4.5
      const hp = head.position
      crossPosArr[0] = hp.x - _perp.x * halfW; crossPosArr[1] = hp.y - _perp.y * halfW; crossPosArr[2] = hp.z - _perp.z * halfW
      crossPosArr[3] = hp.x + _perp.x * halfW; crossPosArr[4] = hp.y + _perp.y * halfW; crossPosArr[5] = hp.z + _perp.z * halfW
      ;(crossLine.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true
      crossMat.opacity = Math.min(1, prog * 5) * 0.9 * fadeVal
    },

    tick(_prog: number, _dt: number, _elapsed: number, _state: string, _head: THREE.Object3D) {
      // nothing — trailTick handles travel, applyFade handles fading
    },

    applyFade(f: number) {
      fadeVal = f
      for (const mat of dashMats) {
        mat.opacity = Math.min(mat.opacity, f)
      }
      crossMat.opacity = Math.min(crossMat.opacity, f)
    },
  }
}
