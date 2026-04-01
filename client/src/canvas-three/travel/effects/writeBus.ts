/**
 * WRITE — Wide Bus effect.
 * Single lane of fixed bits carrying a random binary stream scrolling core→file.
 * Progressive reveal as head travels.
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
  const g = ctx.createRadialGradient(32,32,0,32,32,32)
  g.addColorStop(0,   'rgba(255,255,255,1.0)')
  g.addColorStop(0.25,'rgba(255,255,255,0.8)')
  g.addColorStop(0.6, 'rgba(255,255,255,0.2)')
  g.addColorStop(1,   'rgba(255,255,255,0)')
  ctx.fillStyle = g; ctx.fillRect(0,0,64,64)
  return (_dot = new THREE.CanvasTexture(c))
}

export function buildWriteBus(group: THREE.Group, p: SpawnParams): SecondaryEffect {
  const N = 100, PLEN = 256, LANES = 1
  const OFFSETS = [0]
  const SPEEDS  = [12]

  // Random bit streams per lane
  const bss = Array.from({ length: LANES }, () => {
    const b = new Uint8Array(PLEN)
    for (let i = 0; i < PLEN; i++) b[i] = Math.random() > 0.45 ? 1 : 0
    return b
  })

  // Arc-length evenly spaced positions along path
  const SAMPLES = 800
  const curve: THREE.Vector3[] = []
  const cum: number[] = [0]
  for (let i = 0; i < SAMPLES; i++) {
    curve.push(samplePath(p.pathConfig, p.origin, p.target, i / (SAMPLES - 1)))
    if (i > 0) cum.push(cum[i-1] + curve[i].distanceTo(curve[i-1]))
  }
  const total = cum[SAMPLES - 1]
  const bitPos: THREE.Vector3[] = [], bitT = new Float32Array(N)
  let si = 0
  for (let i = 0; i < N; i++) {
    const tgt = (i / (N - 1)) * total
    while (si < SAMPLES - 1 && cum[si] < tgt) si++
    bitPos.push(curve[si].clone()); bitT[i] = si / (SAMPLES - 1)
  }

  // Right vector (perpendicular to path) for lane offsets
  const midA = samplePath(p.pathConfig, p.origin, p.target, 0.49)
  const midB = samplePath(p.pathConfig, p.origin, p.target, 0.51)
  const fwd   = new THREE.Vector3().copy(midB).sub(midA).normalize()
  const right = new THREE.Vector3().crossVectors(fwd, new THREE.Vector3(0,1,0))
  if (right.lengthSq() < 0.01) right.set(1,0,0); right.normalize()

  // Build one Points object per lane
  type Lane = { posArr: Float32Array, colArr: Float32Array, geo: THREE.BufferGeometry, mat: THREE.PointsMaterial, pts: THREE.Points, bs: Uint8Array, spd: number, center: number }
  const lanes: Lane[] = OFFSETS.map((off, li) => {
    const posArr = new Float32Array(N * 3), colArr = new Float32Array(N * 3)
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(posArr, 3))
    geo.setAttribute('color',    new THREE.BufferAttribute(colArr, 3))
    for (let i = 0; i < N; i++) {
      posArr[i*3]   = bitPos[i].x + right.x * off
      posArr[i*3+1] = bitPos[i].y + right.y * off
      posArr[i*3+2] = bitPos[i].z + right.z * off
    }
    const mat = new THREE.PointsMaterial({
      size: 2.4, vertexColors: true, map: dot(),
      blending: THREE.AdditiveBlending, transparent: true,
      depthWrite: false, sizeAttenuation: true, opacity: 0.9,
    })
    const pts = new THREE.Points(geo, mat); group.add(pts)
    return { posArr, colArr, geo, mat, pts, bs: bss[li], spd: SPEEDS[li], center: off === 0 ? 1.0 : 0.7 }
  })

  const entries: EffectEntry[] = lanes.map(l => ({ obj: l.pts, mat: l.mat, meta: {} }))
  let fv = 1

  return {
    entries,
    suppressDefaultTrail: true,
    onLand() {},
    trailTick(mp, _dt, el) {
      for (const lane of lanes) {
        const scroll = el * lane.spd
        for (let i = 0; i < N; i++) {
          if (bitT[i] > mp) {
            lane.colArr[i*3] = lane.colArr[i*3+1] = lane.colArr[i*3+2] = 0; continue
          }
          const t   = i / (N - 1)
          const idx = ((Math.floor(i - scroll) % PLEN) + PLEN) % PLEN
          const on  = lane.bs[idx] ? 1.0 : 0.06
          const b   = (0.2 + 0.8 * t) * on * lane.center * fv
          lane.colArr[i*3]   = (0.376 + 0.4 * t) * b
          lane.colArr[i*3+1] = (0.647 + 0.25 * t) * b
          lane.colArr[i*3+2] = b
        }
        ;(lane.geo.attributes.color as THREE.BufferAttribute).needsUpdate = true
        lane.mat.opacity = 0.9 * fv
      }
    },
    tick() {},
    applyFade(f) { fv = f },
  }
}
