/**
 * BASH shock diamonds + strobe afterimages + tether cord
 *
 * Concentric tilted squares (shock diamonds) expand from origin.
 * Strobe afterimage sprites left behind as head moves.
 * Gold tether line stretches from center to the spark head.
 */
import * as THREE from 'three'
import type { SpawnParams } from '../types'
import type { SecondaryEffect, EffectEntry } from './types'
import { samplePath, applyEasing } from '../easing'

let _ghostTex: THREE.CanvasTexture | null = null
function getGhostTex(): THREE.CanvasTexture {
  if (_ghostTex) return _ghostTex
  const c = document.createElement('canvas')
  c.width = c.height = 16
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(8, 8, 0, 8, 8, 8)
  g.addColorStop(0, 'rgba(255,220,68,1)')
  g.addColorStop(0.4, 'rgba(255,180,30,0.6)')
  g.addColorStop(1, 'rgba(255,150,0,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 16, 16)
  _ghostTex = new THREE.CanvasTexture(c)
  return _ghostTex
}

function makeSquareGeo(r: number): THREE.BufferGeometry {
  const pts = [
    new THREE.Vector3(-r, 0, -r),
    new THREE.Vector3( r, 0, -r),
    new THREE.Vector3( r, 0,  r),
    new THREE.Vector3(-r, 0,  r),
    new THREE.Vector3(-r, 0, -r), // close
  ]
  return new THREE.BufferGeometry().setFromPoints(pts)
}

export function buildBashEffect(group: THREE.Group, p: SpawnParams): SecondaryEffect {
  const entries: EffectEntry[] = []

  const squareColors = ['#ffcc44', '#ffaa00', '#ff8800']
  const maxRadii = [8, 16, 24]
  const durations = [0.15, 0.23, 0.31]

  // 3 shock diamond squares — square 1 rotated 45° around Y
  for (let i = 0; i < 3; i++) {
    const geo = makeSquareGeo(1)
    const mat = new THREE.LineBasicMaterial({
      color: new THREE.Color(squareColors[i]),
      transparent: true,
      opacity: 0.9 - i * 0.15,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const sq = new THREE.Line(geo, mat)
    sq.position.copy(p.origin)
    if (i === 1) sq.rotation.y = Math.PI / 4
    group.add(sq)
    entries.push({
      obj: sq,
      mat,
      meta: {
        isSquare: true,
        maxRadius: maxRadii[i],
        duration: durations[i],
        baseOpacity: 0.9 - i * 0.15,
      },
    })
  }

  // Tether line: from center (0,0,0) to current head position
  const tetherPosArr = new Float32Array([0, 0, 0, 0, 0, 0])
  const tetherGeo = new THREE.BufferGeometry()
  tetherGeo.setAttribute('position', new THREE.BufferAttribute(tetherPosArr, 3))
  const tetherMat = new THREE.LineBasicMaterial({
    color: new THREE.Color('#f59e0b'),
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
  const tetherLine = new THREE.Line(tetherGeo, tetherMat)
  group.add(tetherLine)
  entries.push({
    obj: tetherLine,
    mat: tetherMat,
    meta: { isTether: true },
  })

  // Ghost afterimage sprites
  const ghosts: EffectEntry[] = []

  return {
    entries,
    tick(prog: number, dt: number, elapsed: number, _state: string, head: THREE.Object3D) {
      void dt
      // Expand shock diamonds
      for (const e of entries) {
        if (!e.meta.isSquare) continue
        const { maxRadius, duration, baseOpacity } = e.meta
        const t = Math.min(1, elapsed / duration)
        const scale = t * maxRadius
        e.obj.scale.set(scale, scale, scale)
        const fadeT = elapsed / (duration * 2.5)
        ;(e.mat as THREE.LineBasicMaterial).opacity = Math.max(0, baseOpacity * (1 - fadeT))
      }

      // Tether line: stretch from center to head
      tetherPosArr[3] = head.position.x
      tetherPosArr[4] = head.position.y
      tetherPosArr[5] = head.position.z
      ;(tetherGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true
      tetherMat.opacity = Math.max(0, (1 - prog) * 0.35)

      // Strobe: create ghost every 0.06s
      const lastGhost = entries[0].meta.lastGhostTime ?? -1
      if (elapsed - lastGhost > 0.06 && prog < 0.95) {
        entries[0].meta.lastGhostTime = elapsed
        const ease = applyEasing(p.pathConfig.easing, prog)
        const headPos = samplePath(p.pathConfig, p.origin, p.target, ease)
        const ghostMat = new THREE.SpriteMaterial({
          map: getGhostTex(),
          color: new THREE.Color('#ffcc44'),
          blending: THREE.AdditiveBlending,
          transparent: true,
          depthWrite: false,
          opacity: 0.7,
        })
        const ghost = new THREE.Sprite(ghostMat)
        ghost.position.copy(headPos)
        ghost.scale.set(2, 2, 1)
        group.add(ghost)
        const ghostEntry: EffectEntry = {
          obj: ghost,
          mat: ghostMat,
          meta: { spawnElapsed: elapsed },
        }
        ghosts.push(ghostEntry)
        entries.push(ghostEntry)
      }

      // Fade ghosts over 0.3s
      for (const g of ghosts) {
        const age = elapsed - g.meta.spawnElapsed
        ;(g.mat as THREE.SpriteMaterial).opacity = Math.max(0, 0.7 - age / 0.3)
      }
    },
    applyFade(f: number) {
      for (const e of entries) {
        const m = e.mat as THREE.Material
        if ('opacity' in m) {
          (m as THREE.LineBasicMaterial).opacity = Math.min(
            (m as THREE.LineBasicMaterial).opacity,
            f
          )
        }
      }
    },
  }
}
