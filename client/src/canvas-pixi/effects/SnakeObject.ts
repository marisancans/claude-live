import { Container, Sprite, Texture, Color } from 'pixi.js'
import type { Application } from 'pixi.js'
import type { SplinePath } from '../../utils/spline'
import { evaluateSpline } from '../../utils/spline'

// ─── Shared textures ───

let particleApp: Application | null = null
const textureCache = new Map<string, Texture>()

export function initSnakeAtlas(app: Application) {
  particleApp = app
}

/** Small glowing shard — elongated, not round */
function getShardTexture(hexColor: string): Texture {
  const key = `shard|${hexColor}`
  const cached = textureCache.get(key)
  if (cached) return cached

  const w = 12, h = 6
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!

  const c = new Color(hexColor)
  const r = Math.round(c.red * 255)
  const g = Math.round(c.green * 255)
  const b = Math.round(c.blue * 255)

  // Elongated gradient — bright center, fades to edges
  const grad = ctx.createRadialGradient(w * 0.4, h / 2, 0, w / 2, h / 2, w / 2)
  grad.addColorStop(0, `rgba(${Math.min(255, r + 60)},${Math.min(255, g + 60)},${Math.min(255, b + 60)},1)`)
  grad.addColorStop(0.3, `rgba(${r},${g},${b},0.7)`)
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h)

  const tex = Texture.from(canvas)
  textureCache.set(key, tex)
  return tex
}

/** Soft glow halo for each shard */
function getGlowTexture(hexColor: string): Texture {
  const key = `glow|${hexColor}`
  const cached = textureCache.get(key)
  if (cached) return cached

  const dim = 24
  const canvas = document.createElement('canvas')
  canvas.width = dim
  canvas.height = dim
  const ctx = canvas.getContext('2d')!

  const c = new Color(hexColor)
  const r = Math.round(c.red * 255)
  const g = Math.round(c.green * 255)
  const b = Math.round(c.blue * 255)

  const grad = ctx.createRadialGradient(dim / 2, dim / 2, 0, dim / 2, dim / 2, dim / 2)
  grad.addColorStop(0, `rgba(${r},${g},${b},0.4)`)
  grad.addColorStop(0.5, `rgba(${r},${g},${b},0.1)`)
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, dim, dim)

  const tex = Texture.from(canvas)
  textureCache.set(key, tex)
  return tex
}

// ─── Shard particle ───

interface Shard {
  sprite: Sprite
  glow: Sprite
  life: number
  baseScale: number
  // Slight drift velocity after spawning (gives that "shower" spread)
  vx: number
  vy: number
  x: number
  y: number
}

/**
 * Meteor shower: a stream of small glowing shards flowing along a spline.
 * No single head — just a dense cloud of particles, each with its own glow.
 * Shards drift slightly off the path as they age, creating a shower spread.
 */
export class SnakeObject {
  container: Container
  words: string[]
  progress: number = 0
  splinePath: SplinePath
  isResponse: boolean
  onComplete: (() => void) | null = null
  duration: number = 4.0

  private shards: Shard[] = []
  private shardTex: Texture
  private glowTex: Texture
  private spawnAccum: number = 0

  constructor(
    splinePath: SplinePath,
    words: string[],
    color: string,
    isResponse: boolean = false,
    onComplete?: () => void
  ) {
    this.container = new Container()
    this.splinePath = splinePath
    this.words = words
    this.isResponse = isResponse
    this.onComplete = onComplete || null
    this.duration = isResponse ? 4.0 : 3.0

    this.shardTex = getShardTexture(color)
    this.glowTex = getGlowTexture(color)
  }

  tick(dt: number) {
    this.progress = Math.min(1, this.progress + dt / this.duration)
    const headT = this.progress

    // Spawn shards at the leading edge — dense stream
    if (headT > 0 && headT < 1) {
      // More words = denser shower
      const rate = 30 + this.words.length * 3
      this.spawnAccum += dt * rate
      while (this.spawnAccum >= 1) {
        this.spawnAccum -= 1
        this.spawnShard(headT)
      }
    }

    // Update existing shards
    for (let i = this.shards.length - 1; i >= 0; i--) {
      const s = this.shards[i]
      s.life -= dt * 1.2

      if (s.life <= 0) {
        this.container.removeChild(s.sprite)
        this.container.removeChild(s.glow)
        s.sprite.destroy({ texture: false })
        s.glow.destroy({ texture: false })
        this.shards.splice(i, 1)
        continue
      }

      // Drift away from path (shower spread)
      s.x += s.vx * dt
      s.y += s.vy * dt

      // Shrink and fade
      const scale = s.baseScale * s.life
      s.sprite.position.set(s.x, s.y)
      s.sprite.scale.set(scale, scale * 0.5) // elongated
      s.sprite.alpha = s.life * 0.9

      s.glow.position.set(s.x, s.y)
      s.glow.scale.set(scale * 1.5)
      s.glow.alpha = s.life * 0.5
    }

    if (this.progress >= 1 && this.onComplete) {
      this.onComplete()
    }
  }

  private spawnShard(headT: number) {
    const pos = evaluateSpline(this.splinePath, headT)

    // Tangent for rotation
    const dt2 = 0.01
    const ahead = evaluateSpline(this.splinePath, Math.min(1, headT + dt2))
    const dx = ahead.x - pos.x
    const dy = ahead.y - pos.y
    const angle = Math.atan2(dy, dx)

    // Perpendicular scatter
    const spread = 4 + Math.random() * 4
    const perpAngle = angle + Math.PI / 2
    const offset = (Math.random() - 0.5) * spread
    const x = pos.x + Math.cos(perpAngle) * offset
    const y = pos.y + Math.sin(perpAngle) * offset

    // Drift velocity — mostly perpendicular with slight backward drag
    const driftSpeed = 5 + Math.random() * 15
    const driftAngle = perpAngle + (Math.random() - 0.5) * 1.5
    const vx = Math.cos(driftAngle) * driftSpeed * (Math.random() > 0.5 ? 1 : -1)
    const vy = Math.sin(driftAngle) * driftSpeed * (Math.random() > 0.5 ? 1 : -1)

    // Glow (behind)
    const glow = new Sprite(this.glowTex)
    glow.anchor.set(0.5, 0.5)
    glow.position.set(x, y)
    this.container.addChildAt(glow, 0)

    // Shard (front)
    const sprite = new Sprite(this.shardTex)
    sprite.anchor.set(0.5, 0.5)
    sprite.position.set(x, y)
    sprite.rotation = angle + (Math.random() - 0.5) * 0.4
    this.container.addChild(sprite)

    const baseScale = 0.4 + Math.random() * 0.6

    this.shards.push({ sprite, glow, life: 1.0, baseScale, vx, vy, x, y })
  }

  isDone(): boolean {
    return this.progress >= 1.0 && this.shards.length === 0
  }

  destroy() {
    for (const s of this.shards) {
      s.sprite.destroy({ texture: false })
      s.glow.destroy({ texture: false })
    }
    this.shards.length = 0
    this.container.destroy({ children: true })
  }
}
