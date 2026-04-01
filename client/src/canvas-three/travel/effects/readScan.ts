/**
 * READ scan effect — file bracket + data lines
 *
 * A [ ] bracket shape frames the file origin. Then 4 short horizontal lines
 * appear sequentially inside the bracket and shoot off as thin fast streaks.
 */
import * as THREE from 'three'
import type { SpawnParams } from '../types'
import type { SecondaryEffect, EffectEntry } from './types'
import { easeOutCubic } from './helpers'
import { buildReadTrail } from './readTrail'

function makeBracket(side: 'left' | 'right', width: number, height: number): THREE.BufferGeometry {
  const x = side === 'left' ? -width : width
  const pts = side === 'left'
    ? [
        new THREE.Vector3(x + width * 0.4, height * 0.5, 0),
        new THREE.Vector3(x, height * 0.5, 0),
        new THREE.Vector3(x, -height * 0.5, 0),
        new THREE.Vector3(x + width * 0.4, -height * 0.5, 0),
      ]
    : [
        new THREE.Vector3(x - width * 0.4, height * 0.5, 0),
        new THREE.Vector3(x, height * 0.5, 0),
        new THREE.Vector3(x, -height * 0.5, 0),
        new THREE.Vector3(x - width * 0.4, -height * 0.5, 0),
      ]
  return new THREE.BufferGeometry().setFromPoints(pts)
}

export function buildReadScan(group: THREE.Group, p: SpawnParams): SecondaryEffect {
  const filePos = p.origin.clone()
  const entries: EffectEntry[] = []

  // Leading diamond — sharp arrowhead riding the head position
  // 4 points: top, right, bottom, left, close = diamond shape
  const diamondSize = 3.5
  const diamondArr = new Float32Array([
    0,  diamondSize, 0,   // top
    diamondSize, 0, 0,    // right
    0, -diamondSize, 0,   // bottom
   -diamondSize, 0, 0,    // left
    0,  diamondSize, 0,   // close
  ])
  const diamondGeo = new THREE.BufferGeometry()
  diamondGeo.setAttribute('position', new THREE.BufferAttribute(diamondArr, 3))
  const diamondMat = new THREE.LineBasicMaterial({
    color: new THREE.Color('#88ffcc'),
    transparent: true, opacity: 0,
    blending: THREE.AdditiveBlending, depthWrite: false,
  })
  const diamond = new THREE.Line(diamondGeo, diamondMat)
  group.add(diamond)
  entries.push({ obj: diamond, mat: diamondMat, meta: { isDiamond: true } })

  const bW = 7
  const bH = 14
  const bracketColor = new THREE.Color('#4ade80')

  for (const side of ['left', 'right'] as const) {
    const geo = makeBracket(side, bW, bH)
    const mat = new THREE.LineBasicMaterial({
      color: bracketColor,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const line = new THREE.Line(geo, mat)
    line.position.copy(filePos)
    group.add(line)
    entries.push({
      obj: line,
      mat,
      meta: { isBracket: true, startElapsed: -1 },
    })
  }

  // 4 horizontal text-line streaks inside the bracket
  const lineYOffsets = [-4.5, -1.5, 1.5, 4.5]
  for (let i = 0; i < 4; i++) {
    const yOff = lineYOffsets[i]
    const lineLen = 8
    const posArr = new Float32Array([
      -lineLen * 0.5, yOff, 0,
       lineLen * 0.5, yOff, 0,
    ])
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
    line.position.copy(filePos)
    line.visible = false
    group.add(line)
    entries.push({
      obj: line,
      mat,
      meta: {
        isTextLine: true,
        delay: 0.2 + i * 0.1,
        startElapsed: -1,
        lineLen,
        yOff,
        initialPosArr: posArr,
      },
    })
  }

  // Custom trail — replaces the default boring vertex-color gradient line
  const trail = buildReadTrail(group, p)

  return {
    entries: [...entries, ...trail.entries],
    suppressDefaultTrail: true,
    trailTick(prog: number, dt: number, elapsed: number, head: THREE.Object3D) {
      trail.trailTick?.(prog, dt, elapsed, head)
    },
    tick(prog: number, _dt: number, elapsed: number, state: string, head: THREE.Object3D) {
      // Diamond head — tracks the traveling node's head position
      if (state === 'traveling') {
        diamond.position.copy(head.position)
        diamondMat.opacity = Math.min(1, prog * 8) * 0.95
        diamond.rotation.z = elapsed * 2.5
      } else {
        diamondMat.opacity = 0
      }

      // Brackets: entries[1] and [2], scale from 0.1 to 1 over 0.3s, fade slowly over 2s
      for (let i = 1; i < 3; i++) {
        const e = entries[i]
        if (e.meta.startElapsed < 0) e.meta.startElapsed = elapsed
        const lt = elapsed - e.meta.startElapsed
        const expandT = Math.min(1, lt / 0.3)
        const sc = 0.1 + easeOutCubic(expandT) * 0.9
        e.obj.scale.set(sc, sc, sc)
        const fadeT = Math.max(0, lt - 0.3) / 2.0
        ;(e.mat as THREE.LineBasicMaterial).opacity = Math.max(0, (1 - fadeT) * 0.5)
      }

      // Text lines: entries[3..], staggered, brighten quickly, shoot and fade
      for (let i = 3; i < entries.length; i++) {
        const e = entries[i]
        if (e.meta.startElapsed < 0) e.meta.startElapsed = elapsed
        const t = elapsed - e.meta.startElapsed - e.meta.delay
        if (t > 0) {
          e.obj.visible = true
          // Fade in fast, then fade over 0.4s
          const fadeIn = Math.min(1, t / 0.06)
          const fadeOut = Math.max(0, 1 - Math.max(0, t - 0.08) / 0.4)
          ;(e.mat as THREE.LineBasicMaterial).opacity = fadeIn * fadeOut * 0.9
          // Stretch the line outward as it shoots
          const shootT = Math.min(1, t / 0.3)
          const stretch = 1 + shootT * 2.5
          e.obj.scale.set(stretch, 1, 1)
          // Move toward core (target direction)
          const moveDir = p.target.clone().sub(filePos).normalize()
          e.obj.position.copy(filePos).addScaledVector(moveDir, shootT * 15)
        }
      }
    },
    applyFade(f: number) {
      for (const e of entries) {
        const m = e.mat as THREE.LineBasicMaterial
        m.opacity = Math.min(m.opacity, f)
      }
      trail.applyFade(f)
    },
  }
}
