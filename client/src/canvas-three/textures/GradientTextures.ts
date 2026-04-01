/**
 * Canvas2D → THREE.CanvasTexture factories.
 * Same gradient techniques as PixiJS version, but returns Three.js textures.
 */
import * as THREE from 'three'

function rand(min: number, max: number) { return Math.random() * (max - min) + min }

export function makeGlowTexture(r: number, g: number, b: number, size: number, coreAlpha = 0.6): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const h = size / 2
  const grad = ctx.createRadialGradient(h, h, 0, h, h, h)
  grad.addColorStop(0, `rgba(${r},${g},${b},${coreAlpha})`)
  grad.addColorStop(0.2, `rgba(${r},${g},${b},${coreAlpha * 0.6})`)
  grad.addColorStop(0.5, `rgba(${r},${g},${b},${coreAlpha * 0.2})`)
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)
  return new THREE.CanvasTexture(canvas)
}

export function makeAuroraCurtainTexture(
  r: number, g: number, b: number, peakAlpha: number,
  peakStart = 0.4, peakEnd = 0.6
): THREE.CanvasTexture {
  const w = 48, h = 800
  const canvas = document.createElement('canvas')
  canvas.width = w; canvas.height = h
  const ctx = canvas.getContext('2d')!
  const imgData = ctx.createImageData(w, h)
  const data = imgData.data
  const cx = w / 2
  for (let y = 0; y < h; y++) {
    const ny = y / h
    let vI: number
    if (ny < peakStart) { const t = ny / peakStart; vI = t * t }
    else if (ny > peakEnd) { const t = (ny - peakEnd) / (1 - peakEnd); vI = (1 - t) * (1 - t) }
    else { vI = 1.0 }
    for (let x = 0; x < w; x++) {
      const dx = (x - cx) / (w / 2)
      const hI = Math.exp(-dx * dx * 3.0)
      const alpha = vI * hI * peakAlpha
      const idx = (y * w + x) * 4
      data[idx] = r; data[idx + 1] = g; data[idx + 2] = b
      data[idx + 3] = Math.round(alpha * 255)
    }
  }
  ctx.putImageData(imgData, 0, 0)
  return new THREE.CanvasTexture(canvas)
}

export function makeStarTexture(): THREE.CanvasTexture {
  const size = 8
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const h = size / 2
  const grad = ctx.createRadialGradient(h, h, 0, h, h, h)
  grad.addColorStop(0, 'rgba(180,190,220,0.9)')
  grad.addColorStop(0.4, 'rgba(180,190,220,0.3)')
  grad.addColorStop(1, 'rgba(180,190,220,0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)
  return new THREE.CanvasTexture(canvas)
}

export function makeVignetteTexture(w: number, h: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = w; canvas.height = h
  const ctx = canvas.getContext('2d')!
  const cx = w / 2, cy = h / 2
  const radius = Math.max(w, h) * 0.7
  const grad = ctx.createRadialGradient(cx, cy, radius * 0.25, cx, cy, radius)
  grad.addColorStop(0, 'rgba(5,5,16,0)')
  grad.addColorStop(0.5, 'rgba(5,5,16,0.18)')
  grad.addColorStop(0.8, 'rgba(5,5,16,0.38)')
  grad.addColorStop(1, 'rgba(5,5,16,0.5)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h)
  return new THREE.CanvasTexture(canvas)
}

/**
 * Holographic particle: sharp bright core with tight color halo.
 * Looks like a data point in a sci-fi HUD, not a soft blob.
 */
export function makeParticleGlowTexture(r: number, g: number, b: number, size = 64): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const h = size / 2

  // Tight color halo
  const haloGrad = ctx.createRadialGradient(h, h, 0, h, h, h)
  haloGrad.addColorStop(0, `rgba(${r},${g},${b},0.8)`)
  haloGrad.addColorStop(0.1, `rgba(${r},${g},${b},0.5)`)
  haloGrad.addColorStop(0.25, `rgba(${r},${g},${b},0.15)`)
  haloGrad.addColorStop(0.5, `rgba(${r},${g},${b},0.03)`)
  haloGrad.addColorStop(1, `rgba(${r},${g},${b},0)`)
  ctx.fillStyle = haloGrad
  ctx.fillRect(0, 0, size, size)

  // Sharp white-hot core (very small, very bright)
  const coreGrad = ctx.createRadialGradient(h, h, 0, h, h, h * 0.12)
  coreGrad.addColorStop(0, 'rgba(255,255,255,1)')
  coreGrad.addColorStop(0.5, 'rgba(255,255,255,0.7)')
  coreGrad.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = coreGrad
  ctx.fillRect(0, 0, size, size)

  return new THREE.CanvasTexture(canvas)
}

export function makeParticleDotTexture(): THREE.CanvasTexture {
  const size = 32
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const h = size / 2
  const grad = ctx.createRadialGradient(h, h, 0, h, h, h)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.15, 'rgba(255,255,255,0.7)')
  grad.addColorStop(0.4, 'rgba(255,255,255,0.2)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)
  return new THREE.CanvasTexture(canvas)
}

export function makeShardTexture(): THREE.CanvasTexture {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const h = size / 2

  ctx.translate(h, h)
  ctx.rotate(Math.PI / 4)

  const grad = ctx.createLinearGradient(-h, 0, h, 0)
  grad.addColorStop(0, 'rgba(255,255,255,0)')
  grad.addColorStop(0.35, 'rgba(255,255,255,0.6)')
  grad.addColorStop(0.5, 'rgba(255,255,255,1)')
  grad.addColorStop(0.65, 'rgba(255,255,255,0.6)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')

  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.moveTo(0, -h * 0.85)
  ctx.lineTo(h * 0.22, 0)
  ctx.lineTo(0, h * 0.85)
  ctx.lineTo(-h * 0.22, 0)
  ctx.closePath()
  ctx.fill()

  ctx.globalAlpha = 0.65
  ctx.fillStyle = 'rgba(255,255,255,1)'
  ctx.beginPath()
  ctx.moveTo(0, -h * 0.55)
  ctx.lineTo(h * 0.08, 0)
  ctx.lineTo(0, h * 0.55)
  ctx.lineTo(-h * 0.08, 0)
  ctx.closePath()
  ctx.fill()

  return new THREE.CanvasTexture(canvas)
}

export function makeGlintTexture(): THREE.CanvasTexture {
  const w = 64, h = 8
  const canvas = document.createElement('canvas')
  canvas.width = w; canvas.height = h
  const ctx = canvas.getContext('2d')!
  const grad = ctx.createLinearGradient(0, 0, w, 0)
  grad.addColorStop(0, 'rgba(255,255,255,0)')
  grad.addColorStop(0.3, 'rgba(255,255,255,0.6)')
  grad.addColorStop(0.5, 'rgba(255,255,255,1)')
  grad.addColorStop(0.7, 'rgba(255,255,255,0.6)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h)
  return new THREE.CanvasTexture(canvas)
}

export const AURORA_CONFIGS = [
  { r: 0,   g: 180, b: 160, peakAlpha: 0.25, peakStart: 0.35, peakEnd: 0.55 },
  { r: 40,  g: 80,  b: 200, peakAlpha: 0.20, peakStart: 0.40, peakEnd: 0.60 },
  { r: 100, g: 40,  b: 180, peakAlpha: 0.18, peakStart: 0.45, peakEnd: 0.65 },
  { r: 0,   g: 200, b: 100, peakAlpha: 0.15, peakStart: 0.38, peakEnd: 0.58 },
  { r: 180, g: 40,  b: 80,  peakAlpha: 0.12, peakStart: 0.42, peakEnd: 0.62 },
  { r: 30,  g: 120, b: 190, peakAlpha: 0.16, peakStart: 0.36, peakEnd: 0.56 },
]

export function hexToRgb(hex: number): [number, number, number] {
  return [(hex >> 16) & 0xff, (hex >> 8) & 0xff, hex & 0xff]
}

export function hexStringToRgb(hex: string): [number, number, number] {
  const v = parseInt(hex.replace('#', ''), 16)
  return hexToRgb(v)
}
