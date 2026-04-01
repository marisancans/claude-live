/**
 * BASH — Sparse Matrix Rain (matches demo B1 + B5).
 * 6 tall columns of falling line segments around the bash node.
 * Appears only after the bolt lands. Each column fades in smoothly
 * with a per-column stagger so rain materialises gradually.
 */
import * as THREE from 'three'
import type { SpawnParams } from '../types'
import type { SecondaryEffect, EffectEntry } from './types'
import { samplePath, applyEasing } from '../easing'

const G_BRIGHT = new THREE.Color('#00ff41')
const G_CYAN   = new THREE.Color('#00ffcc')
const G_MID    = new THREE.Color('#39d353')
const G_DIM    = new THREE.Color('#1a6b2a')

function dynLine(parent: THREE.Group, color: THREE.Color) {
  const posArr = new Float32Array(6)
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(posArr, 3))
  const mat = new THREE.LineBasicMaterial({
    color, blending: THREE.AdditiveBlending, transparent: true,
    depthWrite: false, opacity: 0,
  })
  parent.add(new THREE.Line(geo, mat))
  return { posArr, geo, mat }
}

function ringSegs(
  parent: THREE.Group, r: number, total: number,
  gaps: number[], gapW: number, color: THREE.Color,
): THREE.LineBasicMaterial[] {
  const mats: THREE.LineBasicMaterial[] = []
  const gapSet = new Set<number>()
  for (const g of gaps) for (let k = 0; k < gapW; k++) gapSet.add((g+k)%total)
  let i = 0
  while (i < total) {
    if (gapSet.has(i)) { i++; continue }
    const pts: THREE.Vector3[] = []
    while (i < total && !gapSet.has(i)) {
      const a = (i/total)*Math.PI*2
      pts.push(new THREE.Vector3(Math.cos(a)*r, 0, Math.sin(a)*r)); i++
    }
    const a = (i/total)*Math.PI*2
    pts.push(new THREE.Vector3(Math.cos(a)*r, 0, Math.sin(a)*r))
    if (pts.length < 2) continue
    const posArr = new Float32Array(pts.length*3)
    pts.forEach((p,k) => { posArr[k*3]=p.x; posArr[k*3+1]=p.y; posArr[k*3+2]=p.z })
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(posArr, 3))
    const mat = new THREE.LineBasicMaterial({
      color, blending: THREE.AdditiveBlending, transparent: true,
      depthWrite: false, opacity: 0,
    })
    parent.add(new THREE.Line(geo, mat))
    mats.push(mat)
  }
  return mats
}

export function buildBashSparseRain(group: THREE.Group, p: SpawnParams): SecondaryEffect {
  const pivot = new THREE.Group()
  pivot.position.copy(p.target)
  group.add(pivot)

  const COLS = 6, SEGS = 12, SEG_H = 4, SPREAD = 40, HEIGHT = 70
  const colX      = Array.from({length: COLS}, (_, i) => -SPREAD/2 + (i/(COLS-1))*SPREAD)
  const colSpeed  = Array.from({length: COLS}, () => 3 + Math.random()*4)
  const colPhase  = Array.from({length: COLS}, () => Math.random()*HEIGHT)
  const colBright = [0.9, 0.35, 0.5, 0.2, 0.6, 0.15]
  // Staggered fade-in delay per column (seconds after landing)
  const colDelay  = Array.from({length: COLS}, (_, i) => i * 0.12)

  type Seg = { dl: ReturnType<typeof dynLine>, col: number, seg: number }
  const segs: Seg[] = []
  for (let c = 0; c < COLS; c++)
    for (let s = 0; s < SEGS; s++) {
      const color = s === 0 ? G_BRIGHT : s < 2 ? G_CYAN : s < 5 ? G_MID : G_DIM
      segs.push({ dl: dynLine(pivot, color), col: c, seg: s })
    }

  // Halo + inner rings
  const haloMats  = ringSegs(pivot, 18, 60, [0,15,30,45], 4, G_DIM)
  const innerPivot = new THREE.Group(); pivot.add(innerPivot)
  const innerMats = ringSegs(innerPivot, 6, 36, [0,9,18,27], 2, G_MID)
  const allRingMats = [...haloMats, ...innerMats]

  // Traveling bolt (world-space)
  const N = 50
  const boltPos = new Float32Array(N * 3)
  const boltCol = new Float32Array(N * 3)
  const boltGeo = new THREE.BufferGeometry()
  boltGeo.setAttribute('position', new THREE.BufferAttribute(boltPos, 3))
  boltGeo.setAttribute('color',    new THREE.BufferAttribute(boltCol, 3))
  const boltMat = new THREE.LineBasicMaterial({
    vertexColors: true, blending: THREE.AdditiveBlending,
    transparent: true, depthWrite: false, opacity: 1,
  })
  const boltLine = new THREE.Line(boltGeo, boltMat)
  group.add(boltLine)

  const entries: EffectEntry[] = [
    { obj: boltLine, mat: boltMat, meta: {} },
    { obj: pivot,    mat: new THREE.MeshBasicMaterial(), meta: {} },
  ]

  let fv = 1, landed = false, landElapsed = 0, globalElapsed = 0

  return {
    entries,
    suppressDefaultTrail: true,

    trailTick(prog, dt, elapsed, _h) {
      globalElapsed = elapsed
      if (prog >= 1.0 && !landed) { landed = true; landElapsed = elapsed }

      const fadeIn = Math.min(1, prog * 3)
      const tFade  = landed ? Math.max(0, 1 - (elapsed - landElapsed) * 2.5) : 1

      // ── Traveling bolt ──
      for (let s = 0; s < N; s++) {
        const t  = s / (N-1)
        const sp = Math.max(0, prog - t * p.trailLength)
        const pt = samplePath(p.pathConfig, p.origin, p.target, applyEasing(p.pathConfig.easing, sp))
        boltPos[s*3]=pt.x; boltPos[s*3+1]=pt.y; boltPos[s*3+2]=pt.z
        const b = Math.pow(1-t, 1.2) * fadeIn * fv * tFade
        boltCol[s*3]=0; boltCol[s*3+1]=b; boltCol[s*3+2]=b*0.25
      }
      ;(boltGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true
      ;(boltGeo.attributes.color    as THREE.BufferAttribute).needsUpdate = true

      // ── Rain columns — only after landing ──
      const age = landed ? elapsed - landElapsed : 0

      for (const { dl, col, seg } of segs) {
        // Per-column smooth fade-in
        const colAge    = Math.max(0, age - colDelay[col])
        const colReveal = Math.min(1, colAge * 2.5)   // ~0.4s to full opacity per column

        if (colReveal <= 0) { dl.mat.opacity = 0; continue }

        const scroll = (elapsed * colSpeed[col] + colPhase[col]) % HEIGHT
        const headZ  = HEIGHT/2 - scroll
        const segZ   = headZ - seg * SEG_H
        dl.posArr[0] = colX[col]; dl.posArr[1] = 0; dl.posArr[2] = segZ
        dl.posArr[3] = colX[col]; dl.posArr[4] = 0; dl.posArr[5] = segZ - SEG_H * 0.8
        ;(dl.geo.attributes.position as THREE.BufferAttribute).needsUpdate = true

        const h = Math.pow(1 - seg/SEGS, 1.5)
        dl.mat.opacity = colReveal * h * colBright[col] * fv
      }

      // Rings fade in with rain
      const ringReveal = Math.min(1, Math.max(0, age - 0.3) * 2)
      pivot.rotation.y     = globalElapsed * 0.2
      innerPivot.rotation.y = -globalElapsed * 1.1
      for (const m of haloMats)  m.opacity = ringReveal * 0.35 * fv
      for (const m of innerMats) m.opacity = ringReveal * (0.4 + 0.3*Math.sin(globalElapsed*5)) * fv
    },

    tick() {},
    applyFade(f) {
      fv = f
      for (const { dl } of segs)   dl.mat.opacity = Math.min(dl.mat.opacity, f)
      for (const m of allRingMats)  m.opacity      = Math.min(m.opacity, f)
    },
  }
}
