/**
 * Node and cluster texture atlas.
 *
 * All shapes are Canvas2D radial gradient textures — smooth, soft, premium.
 * Created once on first use and cached permanently.
 * No PixiJS renderer dependency (unlike the old Graphics-based approach).
 */
import { Texture, Sprite } from 'pixi.js'
import type { Renderer } from 'pixi.js'
import { softGlow, softBody, softDiamond, coreGlow, dashedRing, hexToRgb, prewarmTextures } from './GradientTextures'

const CIRCLE_SIZE = 32
const DIAMOND_SIZE = 32
const AGENT_RING_SIZE = 48
const CORE_GLOW_SIZE = 64
const PERM_RING_SIZE = 64

// Pre-warm all tool colors at startup to avoid mid-frame texture creation flashes
const PREWARM_COLORS = [
  0x4ade80, 0x60a5fa, 0xf59e0b, 0xa78bfa, 0xf472b6, 0x888888,
  0x34d399, 0xc084fc, 0x7c3aed, 0xf87171, 0xef4444, 0x38bdf8,
  0x94a3b8, 0x22d3ee, 0xa3a3a3, 0x86efac, 0xfca5a5, 0x555555,
  // Model core colors
  0xF07020, 0xFFBB66, 0x4080FF, 0x80B0FF, 0x30D870, 0x70FFB0, 0xC8D5F0, 0xF0F5FF,
]

let _renderer: Renderer | null = null
export function initNodeTextures(r: Renderer) {
  _renderer = r
  // Pre-warm on init so all textures are ready before first render
  prewarmTextures(PREWARM_COLORS)
  // Also prewarm core glow textures
  const modelPairs: [number, number][] = [
    [0xF07020, 0xFFCC88], [0x4080FF, 0xAAD0FF], [0x30D870, 0xA0FFC8], [0xC8D5F0, 0xFFFFFF],
  ]
  for (const [glow, bright] of modelPairs) {
    getCoreGlowTexture(glow, bright)
  }
  getPermissionRingTexture()
}

/**
 * Soft radial glow circle (for node glow behind body).
 * Canvas2D gradient — smooth falloff, much better than concentric Graphics circles.
 */
export function getCircleGlowTexture(color: number): Texture {
  const [r, g, b] = hexToRgb(color)
  return softGlow(r, g, b, CIRCLE_SIZE * 2, 0.5, 0.08)
}

/**
 * Solid circle with soft edge + highlight for file node body.
 */
export function getCircleSolidTexture(color: number): Texture {
  const [r, g, b] = hexToRgb(color)
  return softBody(r, g, b, CIRCLE_SIZE)
}

/**
 * Diamond with gradient fill + glow halo for ephemeral nodes.
 */
export function getDiamondTexture(color: number): Texture {
  const [r, g, b] = hexToRgb(color)
  return softDiamond(r, g, b, DIAMOND_SIZE)
}

/**
 * Agent dashed ring with glow.
 */
export function getAgentRingTexture(color: number): Texture {
  const [r, g, b] = hexToRgb(color)
  return dashedRing(r, g, b, AGENT_RING_SIZE, 6, 0.75)
}

/**
 * Core glow for session centers — multi-layered radial gradient.
 */
export function getCoreGlowTexture(glowColor: number, brightColor: number): Texture {
  const [gr, gg, gb] = hexToRgb(glowColor)
  const [br, bg, bb] = hexToRgb(brightColor)
  return coreGlow(gr, gg, gb, br, bg, bb, CORE_GLOW_SIZE * 2)
}

/**
 * Permission ring — amber dashed, with subtle glow.
 */
export function getPermissionRingTexture(): Texture {
  return dashedRing(251, 191, 36, PERM_RING_SIZE, 10, 0.8)
}

/**
 * Helper: create a Sprite from a texture, centered.
 */
export function spriteFromTexture(tex: Texture): Sprite {
  const spr = new Sprite(tex)
  spr.anchor.set(0.5)
  return spr
}
