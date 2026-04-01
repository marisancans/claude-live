/**
 * READ — Wave Fill effect.
 *
 * Fixed bits evenly spaced along the path (arc-length parameterised).
 * A random binary pattern scrolls through them tail→head like electricity.
 * Bits reveal progressively as the head passes — path fills in as it travels.
 * Slow decay after landing (trailFadeTime driven).
 */
import * as THREE from 'three'
import type { SpawnParams } from '../types'
import type { SecondaryEffect, EffectEntry } from './types'
import { samplePath, applyEasing } from '../easing'

let _dot: THREE.CanvasTexture | null = null
function dot(): THREE.CanvasTexture {
  if (_dot) return _dot
  const c = document.createElement('canvas'); c.width = c.height = 64
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  g.addColorStop(0,    'rgba(255,255,255,1.0)')
  g.addColorStop(0.25, 'rgba(255,255,255,0.8)')
  g.addColorStop(0.6,  'rgba(255,255,255,0.2)')
  g.addColorStop(1,    'rgba(255,255,255,0)')
  ctx.fillStyle = g; ctx.fillRect(0, 0, 64, 64)
  return (_dot = new THREE.CanvasTexture(c))
}

export function buildReadMagnetar(group: THREE.Group, p: SpawnParams): SecondaryEffect {
  const N = 100

  // Random bit stream pattern
  const PLEN = 256
  const bitStream = new Uint8Array(PLEN)
  for (let i = 0; i < PLEN; i++) bitStream[i] = Math.random() > 0.45 ? 1 : 0

  // Arc-length evenly spaced positions along path
  const SAMPLES = 800
  const curve: THREE.Vector3[] = []
  const cumLen: number[] = [0]
  for (let i = 0; i < SAMPLES; i++) {
    curve.push(samplePath(p.pathConfig, p.origin, p.target, i / (SAMPLES - 1)))
    if (i > 0) cumLen.push(cumLen[i-1] + curve[i].distanceTo(curve[i-1]))
  }
  const totalLen = cumLen[SAMPLES - 1]
  const bitPos = new Array<THREE.Vector3>(N)
  const bitT   = new Float32Array(N)
  let si = 0
  for (let i = 0; i < N; i++) {
    const tgt = (i / (N - 1)) * totalLen
    while (si < SAMPLES - 1 && cumLen[si] < tgt) si++
    bitPos[i] = curve[si].clone()
    bitT[i]   = si / (SAMPLES - 1)
  }

  const posArr = new Float32Array(N * 3), colArr = new Float32Array(N * 3)
  // Pre-fill positions — they never change
  for (let i = 0; i < N; i++) {
    posArr[i*3]   = bitPos[i].x
    posArr[i*3+1] = bitPos[i].y
    posArr[i*3+2] = bitPos[i].z
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(posArr, 3))
  geo.setAttribute('color',    new THREE.BufferAttribute(colArr, 3))
  const mat = new THREE.PointsMaterial({
    size: 2.8, vertexColors: true, map: dot(),
    blending: THREE.AdditiveBlending, transparent: true,
    depthWrite: false, sizeAttenuation: true, opacity: 0.9,
  })
  const pts = new THREE.Points(geo, mat)
  group.add(pts)
  const entries: EffectEntry[] = [{ obj: pts, mat, meta: {} }]
  let fv = 1

  return {
    entries,
    suppressDefaultTrail: true,
    onLand() {},
    trailTick(masterProg, _dt, elapsed, _h) {
      const speed  = 12
      const scroll = elapsed * speed

      for (let i = 0; i < N; i++) {
        if (bitT[i] > masterProg) {
          colArr[i*3] = colArr[i*3+1] = colArr[i*3+2] = 0
          continue
        }
        const t   = i / (N - 1)
        const idx = ((Math.floor(i - scroll) % PLEN) + PLEN) % PLEN
        const on  = bitStream[idx] ? 1.0 : 0.06
        const b   = (0.2 + 0.8 * t) * on * fv
        colArr[i*3]   = b
        colArr[i*3+1] = (0.83 + 0.12 * t) * b
        colArr[i*3+2] = (0.3 + 0.1 * t) * b
      }
      ;(geo.attributes.color as THREE.BufferAttribute).needsUpdate = true
      mat.opacity = 0.93 * fv
    },
    tick() {},
    applyFade(f) { fv = f },
  }
}
