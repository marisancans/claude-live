/**
 * GREP phosphor persistence arc with blip + landing effects
 *
 * Ghost arc with vertex colors: bright at head position, dim trail behind,
 * nearly invisible ahead. On land: blip sprite pulses at target + match
 * highlight lines + expanding diamond.
 */
import * as THREE from 'three'
import type { SpawnParams } from '../types'
import type { SecondaryEffect, EffectEntry } from './types'

let _blipTex: THREE.CanvasTexture | null = null
function getBlipTex(): THREE.CanvasTexture {
  if (_blipTex) return _blipTex
  const c = document.createElement('canvas')
  c.width = c.height = 32
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
  g.addColorStop(0, 'rgba(232,121,249,1)')
  g.addColorStop(0.3, 'rgba(232,121,249,0.6)')
  g.addColorStop(1, 'rgba(232,121,249,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 32, 32)
  _blipTex = new THREE.CanvasTexture(c)
  return _blipTex
}

function makeDiamond(): THREE.BufferGeometry {
  return new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(0, -1, 0),
    new THREE.Vector3(-1, 0, 0),
    new THREE.Vector3(0, 1, 0), // close
  ])
}

export function buildGrepGhost(group: THREE.Group, p: SpawnParams): SecondaryEffect | null {
  const cfg = p.pathConfig
  if (cfg.type !== 'arc') return null

  const VERTS = 61

  // Build arc positions
  const pts: THREE.Vector3[] = []
  for (let i = 0; i <= 60; i++) {
    const t = i / 60
    const a = cfg.arcStartAngle! + t * cfg.arcSweepAngle!
    pts.push(new THREE.Vector3(
      cfg.arcCenter!.x + Math.cos(a) * cfg.arcRadius!,
      cfg.arcCenter!.y + Math.sin(a) * cfg.arcRadius! * 0.12,
      cfg.arcCenter!.z + Math.sin(a) * cfg.arcRadius!,
    ))
  }

  const colArr = new Float32Array(VERTS * 3)
  const colAttr = new THREE.BufferAttribute(colArr, 3)

  const geo = new THREE.BufferGeometry().setFromPoints(pts)
  geo.setAttribute('color', colAttr)

  const mat = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })

  const ghost = new THREE.Line(geo, mat)
  group.add(ghost)

  const arcEntry: EffectEntry = { obj: ghost, mat, meta: {} }

  // Blip sprite at target (invisible until land)
  const blipMat = new THREE.SpriteMaterial({
    map: getBlipTex(),
    color: new THREE.Color('#e879f9'),
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
    opacity: 0,
  })
  const blip = new THREE.Sprite(blipMat)
  blip.position.copy(p.target)
  blip.scale.set(8, 8, 1)
  blip.visible = false
  group.add(blip)

  const blipEntry: EffectEntry = {
    obj: blip,
    mat: blipMat,
    meta: { blipElapsed: 0, blipActive: false },
  }

  const baseColor = new THREE.Color('#e879f9')

  // Landing effects (created in onLand)
  const matchLines: { mat: THREE.LineBasicMaterial; spawnDelay: number; elapsed: number; active: boolean }[] = []
  let diamondMat: THREE.LineBasicMaterial | null = null
  let diamondObj: THREE.Line | null = null
  let landElapsed = 0
  let landed = false

  const entries: EffectEntry[] = [arcEntry, blipEntry]

  return {
    entries,
    suppressDefaultTrail: true,
    tick(prog: number, dt: number, _elapsed: number, _state: string, _head: THREE.Object3D) {
      // Update vertex colors: bright at head, dim trail, invisible ahead
      for (let i = 0; i < VERTS; i++) {
        const vProg = i / 60
        const dist = Math.abs(vProg - prog)
        let brightness: number
        if (vProg > prog) {
          // Ahead of head — nearly invisible
          brightness = Math.max(0.03, 0.08 - (vProg - prog) * 0.5)
        } else {
          // Behind head — trail that dims with distance
          brightness = Math.max(0.05, 1 - dist * 8)
        }
        const c = baseColor.clone().multiplyScalar(brightness)
        colArr[i * 3]     = c.r
        colArr[i * 3 + 1] = c.g
        colArr[i * 3 + 2] = c.b
      }
      colAttr.needsUpdate = true

      // Blip pulse
      if (blipEntry.meta.blipActive) {
        blipEntry.meta.blipElapsed += dt
        const age = blipEntry.meta.blipElapsed
        blipMat.opacity = Math.max(0, 1 - age / 0.5)
        const sc = 8 * (1 + age * 4)
        blip.scale.set(sc, sc, 1)
      }

      // Landing effects
      if (landed) {
        landElapsed += dt

        // Match lines: staggered appearance, fade over 0.5s
        for (const ml of matchLines) {
          ml.elapsed += dt
          if (ml.elapsed >= ml.spawnDelay) {
            ml.active = true
            const age = ml.elapsed - ml.spawnDelay
            ml.mat.opacity = Math.max(0, 0.8 - age / 0.5)
          }
        }

        // Diamond: expand 0→r=15 over 0.35s, fade over 0.2s
        if (diamondObj && diamondMat) {
          const t = landElapsed
          if (t < 0.35) {
            const r = (t / 0.35) * 15
            diamondObj.scale.set(r, r, r)
            diamondMat.opacity = Math.max(0, 0.9 - (t - 0.15) / 0.2)
          } else {
            diamondMat.opacity = Math.max(0, 1 - (t - 0.35) / 0.2)
          }
        }
      }
    },
    onLand() {
      blip.visible = true
      blipMat.opacity = 1.0
      blipEntry.meta.blipActive = true
      blipEntry.meta.blipElapsed = 0
      landed = true
      landElapsed = 0

      // Four match highlight lines: y offsets -3, -1, +1, +3
      const yOffsets = [-3, -1, 1, 3]
      for (let i = 0; i < 4; i++) {
        const y = yOffsets[i]
        const start = new THREE.Vector3(p.target.x - 4, p.target.y + y, p.target.z)
        const end   = new THREE.Vector3(p.target.x + 4, p.target.y + y, p.target.z)
        const lGeo = new THREE.BufferGeometry().setFromPoints([start, end])
        const lMat = new THREE.LineBasicMaterial({
          color: new THREE.Color('#e879f9'),
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
        const line = new THREE.Line(lGeo, lMat)
        group.add(line)
        entries.push({ obj: line, mat: lMat, meta: { type: 'matchLine' } })
        matchLines.push({ mat: lMat, spawnDelay: i * 0.06, elapsed: 0, active: false })
      }

      // Diamond at target
      const dGeo = makeDiamond()
      const dMat = new THREE.LineBasicMaterial({
        color: new THREE.Color('#e879f9'),
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
      const diamond = new THREE.Line(dGeo, dMat)
      diamond.position.copy(p.target)
      diamond.scale.set(0.1, 0.1, 0.1)
      group.add(diamond)
      entries.push({ obj: diamond, mat: dMat, meta: { type: 'diamond' } })
      diamondObj = diamond
      diamondMat = dMat
    },
    applyFade(f: number) {
      mat.opacity = Math.min(mat.opacity, f)
      blipMat.opacity = Math.min(blipMat.opacity, f)
      for (const ml of matchLines) {
        ml.mat.opacity = Math.min(ml.mat.opacity, f)
      }
      if (diamondMat) diamondMat.opacity = Math.min(diamondMat.opacity, f)
    },
  }
}
