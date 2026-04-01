/**
 * PROMPT comet streak + contrail
 *
 * Elongated sprite head (comet), plus a contrail line with vertex colors:
 * tail=dim blue, head=bright white. Contrail fades as progress increases.
 */
import * as THREE from 'three'
import type { SpawnParams } from '../types'
import type { SecondaryEffect, EffectEntry } from './types'
import { samplePath, applyEasing } from '../easing'

// Sharp line texture for prompt asteroids
let _streakTex: THREE.CanvasTexture | null = null
function getStreakTex(): THREE.CanvasTexture {
  if (_streakTex) return _streakTex
  const w = 4, h = 64
  const c = document.createElement('canvas')
  c.width = w; c.height = h
  const ctx = c.getContext('2d')!
  const g = ctx.createLinearGradient(0, 0, 0, h)
  g.addColorStop(0,    'rgba(255,255,255,0)')
  g.addColorStop(0.35, 'rgba(255,255,255,0.9)')
  g.addColorStop(0.5,  'rgba(255,255,255,1)')
  g.addColorStop(0.65, 'rgba(255,255,255,0.9)')
  g.addColorStop(1,    'rgba(255,255,255,0)')
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h)
  _streakTex = new THREE.CanvasTexture(c)
  return _streakTex
}

export function buildPromptStreak(group: THREE.Group, p: SpawnParams): SecondaryEffect {
  // Comet sprite
  const spriteMat = new THREE.SpriteMaterial({
    map: getStreakTex(),
    color: new THREE.Color('#e0eeff'),
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
    opacity: 0.85,
  })
  const sprite = new THREE.Sprite(spriteMat)
  sprite.position.copy(p.origin)
  group.add(sprite)

  // Contrail line: origin → head, vertex colors
  const contrailPosArr = new Float32Array([
    p.origin.x, p.origin.y, p.origin.z,
    p.origin.x, p.origin.y, p.origin.z,
  ])
  const contrailColArr = new Float32Array([
    0.784, 0.878, 1.0, // #c8e0ff dim blue tail
    1.0,   1.0,   1.0, // #ffffff bright white head
  ])
  const contrailGeo = new THREE.BufferGeometry()
  contrailGeo.setAttribute('position', new THREE.BufferAttribute(contrailPosArr, 3))
  contrailGeo.setAttribute('color',    new THREE.BufferAttribute(contrailColArr, 3))

  const contrailMat = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
  const contrail = new THREE.Line(contrailGeo, contrailMat)
  group.add(contrail)

  const spriteEntry: EffectEntry = { obj: sprite, mat: spriteMat, meta: {} }
  const contrailEntry: EffectEntry = {
    obj: contrail,
    mat: contrailMat,
    meta: { contrailPosArr },
  }

  return {
    entries: [spriteEntry, contrailEntry],
    suppressDefaultTrail: true,
    tick(prog: number, _dt: number, _elapsed: number, _state: string, _head: THREE.Object3D) {
      // Comet sprite aligned to travel direction
      const ease = applyEasing(p.pathConfig.easing, prog)
      const headPos = samplePath(p.pathConfig, p.origin, p.target, ease)
      const tailEase = applyEasing(p.pathConfig.easing, Math.max(0, prog - 0.18))
      const tailPos = samplePath(p.pathConfig, p.origin, p.target, tailEase)
      const dir = headPos.clone().sub(tailPos)
      const streakLen = dir.length() * 2.5
      const mid = headPos.clone().add(tailPos).multiplyScalar(0.5)

      sprite.position.copy(mid)
      const angle = Math.atan2(dir.x, dir.z)
      sprite.rotation.z = angle
      sprite.scale.set(3, Math.max(4, streakLen), 1)
      spriteMat.opacity = Math.min(0.9, prog * 3) * (1 - prog * 0.5)

      // Contrail: origin → head position, fades as prog increases (burned up)
      const contrailBurn = Math.max(0, 1 - prog * 1.5)
      contrailMat.opacity = contrailBurn * 0.5

      const posArr = contrailEntry.meta.contrailPosArr as Float32Array
      // Tail stays at origin
      posArr[0] = p.origin.x
      posArr[1] = p.origin.y
      posArr[2] = p.origin.z
      // Head follows current head position
      posArr[3] = headPos.x
      posArr[4] = headPos.y
      posArr[5] = headPos.z
      ;(contrailGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true
    },
    applyFade(f: number) {
      spriteMat.opacity = Math.min(spriteMat.opacity, f)
      contrailMat.opacity = Math.min(contrailMat.opacity, f)
    },
  }
}
