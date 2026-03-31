import { Container, Sprite, Texture } from 'pixi.js'
import type { Application } from 'pixi.js'

/**
 * Background layer: aurora curtains, star specks, galaxy smudges, vignette.
 * All content is screen-space (not affected by camera transforms).
 * Canvas2D gradient textures — no PixiJS Graphics objects for visuals.
 */

// ─── Canvas2D Texture Factories ───

/**
 * Aurora curtain texture: 48x800px vertical strip.
 * Vertical: transparent top -> color peak at 40-60% -> transparent bottom.
 * Horizontal: gaussian-like fade from center to edges.
 */
function auroraCurtainTex(
  r: number, g: number, b: number, peakAlpha: number,
  peakStart: number = 0.4, peakEnd: number = 0.6
): Texture {
  const w = 48
  const h = 800
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d')!

  const imgData = ctx.createImageData(w, h)
  const data = imgData.data
  const cx = w / 2

  for (let y = 0; y < h; y++) {
    const ny = y / h
    let vIntensity: number
    if (ny < peakStart) {
      const t = ny / peakStart
      vIntensity = t * t
    } else if (ny > peakEnd) {
      const t = (ny - peakEnd) / (1.0 - peakEnd)
      vIntensity = (1 - t) * (1 - t)
    } else {
      vIntensity = 1.0
    }

    for (let x = 0; x < w; x++) {
      const dx = (x - cx) / (w / 2)
      const hIntensity = Math.exp(-dx * dx * 3.0)

      const alpha = vIntensity * hIntensity * peakAlpha
      const idx = (y * w + x) * 4
      data[idx] = r
      data[idx + 1] = g
      data[idx + 2] = b
      data[idx + 3] = Math.round(alpha * 255)
    }
  }

  ctx.putImageData(imgData, 0, 0)
  return Texture.from(c)
}

/**
 * Tiny star speck: 4px soft dot, cool white.
 */
function starSpeckTex(): Texture {
  const size = 4
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')!
  const half = size / 2
  const grad = ctx.createRadialGradient(half, half, 0, half, half, half)
  grad.addColorStop(0, 'rgba(180,190,220,0.9)')
  grad.addColorStop(0.4, 'rgba(180,190,220,0.3)')
  grad.addColorStop(1, 'rgba(180,190,220,0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)
  return Texture.from(c)
}

/**
 * Distant galaxy smudge: 32x12px elongated soft blur.
 * Peak alpha 0.4 (bumped from prototype's 0.35).
 */
function galaxySmudgeTex(): Texture {
  const w = 32
  const h = 12
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d')!

  const cx = w / 2
  const cy = h / 2
  const imgData = ctx.createImageData(w, h)
  const data = imgData.data

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dx = (x - cx) / (w / 2)
      const dy = (y - cy) / (h / 2)
      const dist = Math.sqrt(dx * dx + dy * dy)
      const intensity = Math.max(0, 1 - dist) * Math.max(0, 1 - dist)

      const alpha = intensity * 0.4 // bumped from 0.35
      const idx = (y * w + x) * 4
      data[idx] = 180
      data[idx + 1] = 170
      data[idx + 2] = 150
      data[idx + 3] = Math.round(alpha * 255)
    }
  }

  ctx.putImageData(imgData, 0, 0)
  return Texture.from(c)
}

/**
 * Vignette: radial gradient, transparent center -> rgba(5,5,16,0.5) at edges.
 */
function vignetteTex(w: number, h: number): Texture {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d')!
  const cx = w / 2
  const cy = h / 2
  const radius = Math.max(w, h) * 0.7
  const grad = ctx.createRadialGradient(cx, cy, radius * 0.25, cx, cy, radius)
  grad.addColorStop(0, 'rgba(5,5,16,0)')
  grad.addColorStop(0.5, 'rgba(5,5,16,0.18)')
  grad.addColorStop(0.8, 'rgba(5,5,16,0.38)')
  grad.addColorStop(1, 'rgba(5,5,16,0.5)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h)
  return Texture.from(c)
}

// ─── Helpers ───

function rand(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

// ─── Data Interfaces ───

interface AuroraData {
  sprite: Sprite
  freq: number       // sway frequency (0.1-0.3) — slower than prototype
  amplitude: number  // sway amplitude (30-80px) — wider than prototype
  phase: number      // random phase offset for x-sway
  alphaPhase: number // random phase offset for secondary alpha oscillation
  baseX: number
  baseAlpha: number  // sprite base alpha before secondary pulse
}

interface StarData {
  sprite: Sprite
  baseAlpha: number
  twinkle: boolean
  twinkleSpeed: number
  twinklePhase: number
}

// ─── Aurora Curtain Configs (peakAlpha bumped ~50% from prototype) ───

const AURORA_CONFIGS = [
  { r: 0,   g: 180, b: 160, peakAlpha: 0.25, peakStart: 0.35, peakEnd: 0.55 }, // teal
  { r: 40,  g: 80,  b: 200, peakAlpha: 0.20, peakStart: 0.40, peakEnd: 0.60 }, // blue
  { r: 100, g: 40,  b: 180, peakAlpha: 0.18, peakStart: 0.45, peakEnd: 0.65 }, // violet
  { r: 0,   g: 200, b: 100, peakAlpha: 0.15, peakStart: 0.38, peakEnd: 0.58 }, // green
  { r: 180, g: 40,  b: 80,  peakAlpha: 0.12, peakStart: 0.42, peakEnd: 0.62 }, // rose
  { r: 30,  g: 120, b: 190, peakAlpha: 0.16, peakStart: 0.36, peakEnd: 0.56 }, // sky
]

// ─── BackgroundLayer ───

export class BackgroundLayer {
  container: Container
  app: Application

  private auroras: AuroraData[] = []
  private stars: StarData[] = []
  private vigSprite: Sprite | null = null
  private elapsed = 0

  constructor(app: Application) {
    this.app = app
    this.container = new Container()

    const auroraLayer = new Container()
    const starLayer = new Container()
    const vignetteLayer = new Container()

    this.container.addChild(auroraLayer)
    this.container.addChild(starLayer)
    this.container.addChild(vignetteLayer)

    this.buildAuroras(auroraLayer)
    this.buildStars(starLayer)
    this.buildVignette(vignetteLayer)
  }

  private buildAuroras(layer: Container) {
    const W = this.app.renderer.width
    const H = this.app.renderer.height
    const curtainSpacing = W / (AURORA_CONFIGS.length + 1)

    for (let i = 0; i < AURORA_CONFIGS.length; i++) {
      const cfg = AURORA_CONFIGS[i]
      const tex = auroraCurtainTex(cfg.r, cfg.g, cfg.b, cfg.peakAlpha, cfg.peakStart, cfg.peakEnd)
      const s = new Sprite(tex)
      s.anchor.set(0.5)

      const baseX = curtainSpacing * (i + 1) + rand(-80, 80)
      s.x = baseX
      s.y = H / 2

      const scaleX = rand(1.5, 3.0)
      const scaleY = H / 800
      s.scale.set(scaleX, scaleY)

      // Sprite alpha bumped to 0.4-0.7 (was 0.3-0.6 in prototype)
      const baseAlpha = rand(0.4, 0.7)
      s.alpha = baseAlpha
      s.blendMode = 'add'

      layer.addChild(s)

      this.auroras.push({
        sprite: s,
        freq: rand(0.1, 0.3),      // slower than prototype (was 0.15-0.4)
        amplitude: rand(30, 80),    // wider than prototype (was 20-60)
        phase: rand(0, Math.PI * 2),
        alphaPhase: rand(0, Math.PI * 2),
        baseX,
        baseAlpha,
      })
    }
  }

  private buildStars(layer: Container) {
    const W = this.app.renderer.width
    const H = this.app.renderer.height
    const starTex = starSpeckTex()

    const totalStars = 70
    const largerCount = 8
    const smallCount = totalStars - largerCount

    // Small specks (62): scale 0.1-0.25, alpha 0.35-0.75
    for (let i = 0; i < smallCount; i++) {
      const s = new Sprite(starTex)
      s.anchor.set(0.5)
      s.x = rand(0, W)
      s.y = rand(0, H)
      s.scale.set(rand(0.1, 0.25))
      const ba = rand(0.35, 0.75)
      s.alpha = ba
      layer.addChild(s)

      const doTwinkle = Math.random() < 0.25 // 25%
      this.stars.push({
        sprite: s,
        baseAlpha: ba,
        twinkle: doTwinkle,
        twinkleSpeed: rand(0.3, 1.0),
        twinklePhase: rand(0, Math.PI * 2),
      })
    }

    // Larger specks (8): scale 0.25-0.4, alpha 0.5-0.8
    for (let i = 0; i < largerCount; i++) {
      const s = new Sprite(starTex)
      s.anchor.set(0.5)
      s.x = rand(0, W)
      s.y = rand(0, H)
      s.scale.set(rand(0.25, 0.4))
      const ba = rand(0.5, 0.8)
      s.alpha = ba
      layer.addChild(s)

      const doTwinkle = Math.random() < 0.25 // 25%
      this.stars.push({
        sprite: s,
        baseAlpha: ba,
        twinkle: doTwinkle,
        twinkleSpeed: rand(0.3, 1.0),
        twinklePhase: rand(0, Math.PI * 2),
      })
    }
  }

  private buildGalaxies(layer: Container) {
    const W = this.app.renderer.width
    const H = this.app.renderer.height
    const tex = galaxySmudgeTex()
    const galaxyCount = 4

    for (let i = 0; i < galaxyCount; i++) {
      const s = new Sprite(tex)
      s.anchor.set(0.5)
      s.x = rand(W * 0.1, W * 0.9)
      s.y = rand(H * 0.1, H * 0.9)
      s.rotation = rand(0, Math.PI * 2)
      s.scale.set(rand(0.5, 1.0))
      s.alpha = rand(0.3, 0.5)
      layer.addChild(s)
    }
  }

  private buildVignette(layer: Container) {
    const W = this.app.renderer.width
    const H = this.app.renderer.height
    const tex = vignetteTex(W, H)
    const vig = new Sprite(tex)
    vig.x = 0
    vig.y = 0
    vig.width = W
    vig.height = H
    layer.addChild(vig)
    this.vigSprite = vig
  }

  tick(dt: number) {
    // Clamp dt to prevent jumps when main thread is busy with event bursts
    const clampedDt = Math.min(dt, 2)
    this.elapsed += clampedDt / 60
    const t = this.elapsed

    // ── Aurora curtain sway + secondary alpha pulse ──
    for (const aurora of this.auroras) {
      aurora.sprite.x = aurora.baseX + Math.sin(t * aurora.freq + aurora.phase) * aurora.amplitude
      // Secondary slow alpha oscillation: gentle pulse, period ~42s
      aurora.sprite.alpha = aurora.baseAlpha * (0.85 + 0.15 * Math.sin(t * 0.15 + aurora.alphaPhase))
    }

    // ── Star twinkle ──
    for (const star of this.stars) {
      if (star.twinkle) {
        const osc = Math.sin(t * star.twinkleSpeed * Math.PI * 2 + star.twinklePhase)
        star.sprite.alpha = star.baseAlpha * (0.6 + 0.4 * (0.5 + 0.5 * osc))
      }
    }
  }
}
