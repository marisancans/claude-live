/**
 * Canvas2D gradient-based texture generators.
 *
 * Every glow/shape texture is rendered via document.createElement('canvas') +
 * ctx.createRadialGradient() + Texture.from(canvas). This produces smooth
 * gradients that PixiJS Graphics cannot achieve.
 *
 * Textures are created once and cached permanently.
 */
import { Texture } from 'pixi.js'

const cache = new Map<string, Texture>()

function cached(key: string, factory: () => Texture): Texture {
  const existing = cache.get(key)
  if (existing) return existing
  const tex = factory()
  cache.set(key, tex)
  return tex
}

/**
 * Soft radial glow — smooth falloff from center.
 * Foundation of all node/core glow halos.
 */
export function softGlow(r: number, g: number, b: number, size: number, coreAlpha = 0.6, midAlpha = 0.15): Texture {
  return cached(`glow|${r},${g},${b}|${size}|${coreAlpha}|${midAlpha}`, () => {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = size
    const ctx = canvas.getContext('2d')!
    const h = size / 2
    const grad = ctx.createRadialGradient(h, h, 0, h, h, h)
    grad.addColorStop(0, `rgba(${r},${g},${b},${coreAlpha})`)
    grad.addColorStop(0.2, `rgba(${r},${g},${b},${coreAlpha * 0.6})`)
    grad.addColorStop(0.5, `rgba(${r},${g},${b},${midAlpha})`)
    grad.addColorStop(1, `rgba(${r},${g},${b},0)`)
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, size, size)
    return Texture.from(canvas)
  })
}

/**
 * Solid body with soft edge and upper-left highlight for 3D depth.
 * Used for file nodes (planets).
 */
export function softBody(r: number, g: number, b: number, size: number): Texture {
  return cached(`body|${r},${g},${b}|${size}`, () => {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = size
    const ctx = canvas.getContext('2d')!
    const h = size / 2
    // Body
    const bodyGrad = ctx.createRadialGradient(h, h, 0, h, h, h * 0.85)
    bodyGrad.addColorStop(0, `rgba(${r},${g},${b},1)`)
    bodyGrad.addColorStop(0.5, `rgba(${r},${g},${b},0.9)`)
    bodyGrad.addColorStop(0.85, `rgba(${r},${g},${b},0.4)`)
    bodyGrad.addColorStop(1, `rgba(${r},${g},${b},0)`)
    ctx.fillStyle = bodyGrad
    ctx.beginPath(); ctx.arc(h, h, h, 0, Math.PI * 2); ctx.fill()
    // Highlight
    const hlGrad = ctx.createRadialGradient(h * 0.6, h * 0.6, 0, h * 0.6, h * 0.6, h * 0.5)
    hlGrad.addColorStop(0, 'rgba(255,255,255,0.35)')
    hlGrad.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = hlGrad
    ctx.beginPath(); ctx.arc(h, h, h * 0.8, 0, Math.PI * 2); ctx.fill()
    return Texture.from(canvas)
  })
}

/**
 * Diamond shape with gradient fill and glow halo.
 * Used for ephemeral/tool nodes.
 */
export function softDiamond(r: number, g: number, b: number, size: number): Texture {
  return cached(`diamond|${r},${g},${b}|${size}`, () => {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = size
    const ctx = canvas.getContext('2d')!
    const h = size / 2
    // Glow halo
    const glowGrad = ctx.createRadialGradient(h, h, 0, h, h, h)
    glowGrad.addColorStop(0, `rgba(${r},${g},${b},0.3)`)
    glowGrad.addColorStop(0.5, `rgba(${r},${g},${b},0.06)`)
    glowGrad.addColorStop(1, `rgba(${r},${g},${b},0)`)
    ctx.fillStyle = glowGrad
    ctx.fillRect(0, 0, size, size)
    // Diamond
    ctx.beginPath()
    ctx.moveTo(h, h * 0.25); ctx.lineTo(h * 1.55, h)
    ctx.lineTo(h, h * 1.75); ctx.lineTo(h * 0.45, h); ctx.closePath()
    const dg = ctx.createLinearGradient(h, h * 0.25, h, h * 1.75)
    dg.addColorStop(0, `rgba(${Math.min(255, r + 50)},${Math.min(255, g + 50)},${Math.min(255, b + 50)},0.95)`)
    dg.addColorStop(0.5, `rgba(${r},${g},${b},0.85)`)
    dg.addColorStop(1, `rgba(${r >> 1},${g >> 1},${b >> 1},0.6)`)
    ctx.fillStyle = dg; ctx.fill()
    // Edge highlight
    ctx.strokeStyle = `rgba(${Math.min(255, r + 80)},${Math.min(255, g + 80)},${Math.min(255, b + 80)},0.5)`
    ctx.lineWidth = 0.5; ctx.stroke()
    return Texture.from(canvas)
  })
}

/**
 * Core glow for session centers — multi-layered radial gradient.
 */
export function coreGlow(baseR: number, baseG: number, baseB: number, brightR: number, brightG: number, brightB: number, size: number): Texture {
  return cached(`core|${baseR},${baseG},${baseB}|${brightR},${brightG},${brightB}|${size}`, () => {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = size
    const ctx = canvas.getContext('2d')!
    const h = size / 2
    // Outer haze
    const outer = ctx.createRadialGradient(h, h, 0, h, h, h)
    outer.addColorStop(0, `rgba(${brightR},${brightG},${brightB},0.15)`)
    outer.addColorStop(0.4, `rgba(${baseR},${baseG},${baseB},0.06)`)
    outer.addColorStop(1, `rgba(${baseR},${baseG},${baseB},0)`)
    ctx.fillStyle = outer
    ctx.fillRect(0, 0, size, size)
    // Inner bright
    const inner = ctx.createRadialGradient(h, h, 0, h, h, h * 0.4)
    inner.addColorStop(0, `rgba(${brightR},${brightG},${brightB},0.4)`)
    inner.addColorStop(0.5, `rgba(${brightR},${brightG},${brightB},0.15)`)
    inner.addColorStop(1, `rgba(${brightR},${brightG},${brightB},0)`)
    ctx.fillStyle = inner
    ctx.fillRect(0, 0, size, size)
    return Texture.from(canvas)
  })
}

/**
 * Dashed ring with glow — for agents and permissions.
 */
export function dashedRing(r: number, g: number, b: number, size: number, segments = 8, ringRadius = 0.7): Texture {
  return cached(`ring|${r},${g},${b}|${size}|${segments}`, () => {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = size
    const ctx = canvas.getContext('2d')!
    const h = size / 2
    const rad = h * ringRadius
    // Glow behind
    const glow = ctx.createRadialGradient(h, h, rad * 0.8, h, h, rad * 1.3)
    glow.addColorStop(0, `rgba(${r},${g},${b},0.08)`)
    glow.addColorStop(1, `rgba(${r},${g},${b},0)`)
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, size, size)
    // Dashes
    ctx.strokeStyle = `rgba(${r},${g},${b},0.7)`
    ctx.lineWidth = 1.5
    ctx.lineCap = 'round'
    const gapRatio = 0.35
    for (let i = 0; i < segments; i++) {
      const a1 = (i / segments) * Math.PI * 2
      const a2 = ((i + 1 - gapRatio) / segments) * Math.PI * 2
      ctx.beginPath(); ctx.arc(h, h, rad, a1, a2); ctx.stroke()
    }
    return Texture.from(canvas)
  })
}

/** Parse hex int color to [r, g, b] */
export function hexToRgb(hex: number): [number, number, number] {
  return [(hex >> 16) & 0xff, (hex >> 8) & 0xff, hex & 0xff]
}
