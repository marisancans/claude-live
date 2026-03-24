import { Graphics, Texture, Sprite } from 'pixi.js'
import type { Renderer } from 'pixi.js'

/**
 * Pre-rendered texture atlas for node and cluster shapes.
 * All shapes are rendered once into Textures at startup.
 * Nodes use Sprites from this atlas — zero per-frame Graphics.clear() calls.
 */

let renderer: Renderer | null = null

// Caches keyed by hex color string
const circleGlowCache = new Map<number, Texture>()
const circleSolidCache = new Map<number, Texture>()
const diamondCache = new Map<number, Texture>()
const agentRingCache = new Map<number, Texture>()
const coreGlowCache = new Map<string, Texture>()
let permissionRingTex: Texture | null = null

const CIRCLE_SIZE = 32  // px, actual node radius is set via sprite scale
const DIAMOND_SIZE = 32
const AGENT_RING_SIZE = 48
const CORE_GLOW_SIZE = 64
const PERM_RING_SIZE = 64

export function initNodeTextures(r: Renderer) {
  renderer = r
}

function ensureRenderer(): Renderer {
  if (!renderer) throw new Error('NodeTextures not initialized — call initNodeTextures(renderer) first')
  return renderer
}

/**
 * Soft radial glow circle (for node glow behind body).
 * White circle with alpha falloff — tint with sprite.tint at usage site.
 */
export function getCircleGlowTexture(color: number): Texture {
  if (circleGlowCache.has(color)) return circleGlowCache.get(color)!
  const r = ensureRenderer()
  const s = CIRCLE_SIZE
  const g = new Graphics()
  // Three concentric circles for soft glow
  g.circle(s, s, s).fill({ color, alpha: 0.12 })
  g.circle(s, s, s * 0.7).fill({ color, alpha: 0.08 })
  g.circle(s, s, s * 0.4).fill({ color, alpha: 0.05 })
  const tex = r.generateTexture(g)
  g.destroy()
  circleGlowCache.set(color, tex)
  return tex
}

/**
 * Solid circle for file node body.
 */
export function getCircleSolidTexture(color: number): Texture {
  if (circleSolidCache.has(color)) return circleSolidCache.get(color)!
  const r = ensureRenderer()
  const s = CIRCLE_SIZE / 2
  const g = new Graphics()
  g.circle(s, s, s).fill({ color, alpha: 0.9 })
  const tex = r.generateTexture(g)
  g.destroy()
  circleSolidCache.set(color, tex)
  return tex
}

/**
 * Diamond (rotated square) for ephemeral nodes.
 */
export function getDiamondTexture(color: number): Texture {
  if (diamondCache.has(color)) return diamondCache.get(color)!
  const r = ensureRenderer()
  const s = DIAMOND_SIZE / 2
  const g = new Graphics()
  g.poly([s, 0, s * 2, s, s, s * 2, 0, s]).fill({ color, alpha: 0.9 })
  const tex = r.generateTexture(g)
  g.destroy()
  diamondCache.set(color, tex)
  return tex
}

/**
 * Agent dashed ring. 6 arc segments in a ring.
 * Rotation is animated via sprite.rotation (transform-only).
 */
export function getAgentRingTexture(color: number): Texture {
  if (agentRingCache.has(color)) return agentRingCache.get(color)!
  const r = ensureRenderer()
  const s = AGENT_RING_SIZE / 2
  const ringR = s * 0.75
  const g = new Graphics()
  const SEGS = 6
  for (let i = 0; i < SEGS; i++) {
    const a1 = (i / SEGS) * Math.PI * 2
    const a2 = ((i + 0.38) / SEGS) * Math.PI * 2
    g.arc(s, s, ringR, a1, a2).stroke({ width: 1, color, alpha: 0.8 })
    if (i < SEGS - 1) {
      const nextA1 = ((i + 1) / SEGS) * Math.PI * 2
      g.moveTo(s + Math.cos(nextA1) * ringR, s + Math.sin(nextA1) * ringR)
    }
  }
  // Soft glow behind
  g.circle(s, s, ringR * 1.1).fill({ color, alpha: 0.2 })
  const tex = r.generateTexture(g)
  g.destroy()
  agentRingCache.set(color, tex)
  return tex
}

/**
 * Concentric glow layers for cluster core background.
 * Key is "glowColor-brightColor" string.
 */
export function getCoreGlowTexture(glowColor: number, brightColor: number): Texture {
  const key = `${glowColor}-${brightColor}`
  if (coreGlowCache.has(key)) return coreGlowCache.get(key)!
  const r = ensureRenderer()
  const s = CORE_GLOW_SIZE / 2
  const g = new Graphics()
  g.circle(s, s, s).fill({ color: glowColor, alpha: 0.03 })
  g.circle(s, s, s * 0.7).fill({ color: glowColor, alpha: 0.05 })
  g.circle(s, s, s * 0.45).fill({ color: glowColor, alpha: 0.08 })
  const tex = r.generateTexture(g)
  g.destroy()
  coreGlowCache.set(key, tex)
  return tex
}

/**
 * Permission ring: 10-segment dashed amber ring.
 * Animated via sprite.rotation.
 */
export function getPermissionRingTexture(): Texture {
  if (permissionRingTex) return permissionRingTex
  const r = ensureRenderer()
  const s = PERM_RING_SIZE / 2
  const radius = s * 0.8
  const color = 0xFBBF24
  const g = new Graphics()
  const SEGS = 10
  for (let i = 0; i < SEGS; i++) {
    const a1 = (i / SEGS) * Math.PI * 2
    const a2 = ((i + 0.4) / SEGS) * Math.PI * 2
    g.arc(s, s, radius, a1, a2).stroke({ width: 1.5, color, alpha: 0.8 })
    if (i < SEGS - 1) {
      const nextA1 = ((i + 1) / SEGS) * Math.PI * 2
      g.moveTo(s + Math.cos(nextA1) * radius, s + Math.sin(nextA1) * radius)
    }
  }
  const tex = r.generateTexture(g)
  g.destroy()
  permissionRingTex = tex
  return tex
}

/**
 * Helper: create a Sprite from a texture, centered.
 */
export function spriteFromTexture(tex: Texture): Sprite {
  const spr = new Sprite(tex)
  spr.anchor.set(0.5)
  return spr
}
