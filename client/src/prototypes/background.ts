/**
 * Background Visual Prototype
 *
 * Run: open http://localhost:7979/prototypes/background.html
 *
 * Demonstrates: 3-layer parallax starfield with twinkle, nebula clouds
 * with drift + wrap, mouse-driven parallax, vignette overlay, FPS counter.
 */
import { Application, Container, Sprite, Texture } from 'pixi.js'

// ─── Constants ───

const BG_COLOR = 0x050510

// Star layer configs
const FAR_COUNT = 200
const MID_COUNT = 80
const NEAR_COUNT = 15

// Parallax multipliers (fraction of mouse delta)
const PARALLAX_FAR = 0.1
const PARALLAX_MID = 0.3
const PARALLAX_NEAR = 0.5
const PARALLAX_NEBULA = 0.2

// ─── Canvas2D Texture Factories ───

function starTex(size: number = 8): Texture {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')!
  const h = size / 2
  const g = ctx.createRadialGradient(h, h, 0, h, h, h)
  g.addColorStop(0, 'rgba(220,225,255,0.9)')
  g.addColorStop(0.3, 'rgba(200,210,255,0.4)')
  g.addColorStop(1, 'rgba(200,210,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  return Texture.from(c)
}

function glowHaloTex(size: number = 64): Texture {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')!
  const h = size / 2
  const g = ctx.createRadialGradient(h, h, 0, h, h, h)
  g.addColorStop(0, 'rgba(180,200,255,0.5)')
  g.addColorStop(0.15, 'rgba(160,190,255,0.25)')
  g.addColorStop(0.4, 'rgba(140,170,255,0.08)')
  g.addColorStop(1, 'rgba(140,170,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  return Texture.from(c)
}

function nebulaTex(r: number, g: number, b: number, size: number = 512): Texture {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')!
  const h = size / 2
  const gr = ctx.createRadialGradient(h, h, 0, h, h, h)
  gr.addColorStop(0, `rgba(${r},${g},${b},0.6)`)
  gr.addColorStop(0.25, `rgba(${r},${g},${b},0.35)`)
  gr.addColorStop(0.55, `rgba(${r},${g},${b},0.12)`)
  gr.addColorStop(1, `rgba(${r},${g},${b},0)`)
  ctx.fillStyle = gr
  ctx.fillRect(0, 0, size, size)
  return Texture.from(c)
}

function vignetteTex(w: number, h: number): Texture {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d')!
  const cx = w / 2
  const cy = h / 2
  const radius = Math.max(w, h) * 0.7
  const g = ctx.createRadialGradient(cx, cy, radius * 0.3, cx, cy, radius)
  g.addColorStop(0, 'rgba(5,5,16,0)')
  g.addColorStop(0.6, 'rgba(5,5,16,0.15)')
  g.addColorStop(1, 'rgba(5,5,16,0.5)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
  return Texture.from(c)
}

// ─── Helpers ───

function rand(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

function lerpColor(t: number): number {
  // Warm white (255,248,235) to cool blue (200,210,255)
  const r = Math.round(255 - t * 55)
  const g = Math.round(248 - t * 38)
  const b = Math.round(235 + t * 20)
  return (r << 16) | (g << 8) | b
}

// ─── Star Data ───

interface StarData {
  sprite: Sprite
  baseAlpha: number
  twinkle: boolean
  twinkleSpeed: number
  twinklePhase: number
  baseX: number
  baseY: number
}

interface NebulaData {
  sprite: Sprite
  driftX: number
  driftY: number
  baseX: number
  baseY: number
}

// ─── Main ───

async function main() {
  const app = new Application()

  const W = window.innerWidth
  const H = window.innerHeight

  await app.init({
    background: BG_COLOR,
    width: W,
    height: H,
    antialias: true,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  })

  const container = document.getElementById('canvas-container')!
  container.appendChild(app.canvas as HTMLCanvasElement)

  // ─── Textures ───

  const starTexSmall = starTex(8)
  const starTexMed = starTex(16)
  const starTexLarge = starTex(32)
  const haloTex = glowHaloTex(64)

  const nebulaTextures = [
    nebulaTex(42, 16, 40, 512),   // warm purple
    nebulaTex(8, 26, 48, 512),    // cool teal
    nebulaTex(16, 8, 48, 512),    // deep indigo
    nebulaTex(30, 12, 25, 512),   // rose
  ]

  // ─── Layer Containers ───

  const nebulaLayer = new Container()
  const farLayer = new Container()
  const midLayer = new Container()
  const nearLayer = new Container()
  const vignetteLayer = new Container()

  app.stage.addChild(nebulaLayer)
  app.stage.addChild(farLayer)
  app.stage.addChild(midLayer)
  app.stage.addChild(nearLayer)
  app.stage.addChild(vignetteLayer)

  // ─── Create Stars ───

  const farStars: StarData[] = []
  const midStars: StarData[] = []
  const nearStars: StarData[] = []

  // Far layer: 200 tiny dim stars, all twinkle
  for (let i = 0; i < FAR_COUNT; i++) {
    const s = new Sprite(starTexSmall)
    s.anchor.set(0.5)
    const bx = rand(0, W)
    const by = rand(0, H)
    s.x = bx
    s.y = by
    s.scale.set(rand(0.05, 0.15))
    const ba = rand(0.1, 0.4)
    s.alpha = ba
    s.tint = lerpColor(rand(0, 1))
    farLayer.addChild(s)
    farStars.push({
      sprite: s,
      baseAlpha: ba,
      twinkle: true,
      twinkleSpeed: rand(0.3, 1.5),
      twinklePhase: rand(0, Math.PI * 2),
      baseX: bx,
      baseY: by,
    })
  }

  // Mid layer: 80 medium stars, 40% twinkle
  for (let i = 0; i < MID_COUNT; i++) {
    const s = new Sprite(starTexMed)
    s.anchor.set(0.5)
    const bx = rand(0, W)
    const by = rand(0, H)
    s.x = bx
    s.y = by
    s.scale.set(rand(0.1, 0.25))
    const ba = rand(0.2, 0.6)
    s.alpha = ba
    s.tint = lerpColor(rand(0, 1))
    midLayer.addChild(s)
    midStars.push({
      sprite: s,
      baseAlpha: ba,
      twinkle: Math.random() < 0.4,
      twinkleSpeed: rand(0.3, 1.5),
      twinklePhase: rand(0, Math.PI * 2),
      baseX: bx,
      baseY: by,
    })
  }

  // Near layer: 15 bright stars with glow halos
  for (let i = 0; i < NEAR_COUNT; i++) {
    const bx = rand(0, W)
    const by = rand(0, H)

    // Glow halo (behind the star)
    const halo = new Sprite(haloTex)
    halo.anchor.set(0.5)
    halo.x = bx
    halo.y = by
    halo.scale.set(rand(0.8, 1.5))
    halo.alpha = rand(0.2, 0.4)
    halo.blendMode = 'add'
    nearLayer.addChild(halo)

    // Star body
    const s = new Sprite(starTexLarge)
    s.anchor.set(0.5)
    s.x = bx
    s.y = by
    s.scale.set(rand(0.15, 0.4))
    const ba = rand(0.4, 0.8)
    s.alpha = ba
    s.tint = lerpColor(rand(0, 0.5)) // bias warm-white for bright stars
    nearLayer.addChild(s)

    nearStars.push({
      sprite: s,
      baseAlpha: ba,
      twinkle: true,
      twinkleSpeed: rand(0.2, 0.8),
      twinklePhase: rand(0, Math.PI * 2),
      baseX: bx,
      baseY: by,
    })
  }

  // ─── Create Nebula Clouds ───

  const nebulae: NebulaData[] = []

  // Angles spread evenly, then jittered
  const baseAngles = [0.3, 1.8, 3.5, 5.2]

  for (let i = 0; i < 4; i++) {
    const tex = nebulaTextures[i]
    const s = new Sprite(tex)
    s.anchor.set(0.5)
    const bx = rand(W * 0.1, W * 0.9)
    const by = rand(H * 0.1, H * 0.9)
    s.x = bx
    s.y = by
    s.scale.set(rand(2, 4))
    s.alpha = rand(0.06, 0.12)
    s.blendMode = 'add'
    nebulaLayer.addChild(s)

    const speed = rand(0.03, 0.08)
    const angle = baseAngles[i] + rand(-0.3, 0.3)
    nebulae.push({
      sprite: s,
      driftX: Math.cos(angle) * speed,
      driftY: Math.sin(angle) * speed,
      baseX: bx,
      baseY: by,
    })
  }

  // ─── Vignette ───

  const vigTex = vignetteTex(W, H)
  const vig = new Sprite(vigTex)
  vig.x = 0
  vig.y = 0
  vig.width = W
  vig.height = H
  vignetteLayer.addChild(vig)

  // ─── Mouse Tracking ───

  let mouseX = W / 2
  let mouseY = H / 2
  const centerX = W / 2
  const centerY = H / 2

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX
    mouseY = e.clientY
  })

  // ─── FPS Counter ───

  const fpsEl = document.getElementById('fps')!
  let fpsFrames = 0
  let fpsTime = performance.now()

  // ─── Render Loop ───

  let elapsed = 0

  app.ticker.add((ticker) => {
    elapsed += ticker.deltaTime / 60 // seconds-ish at 60fps
    const t = elapsed

    // FPS
    fpsFrames++
    const now = performance.now()
    if (now - fpsTime >= 500) {
      const fps = Math.round((fpsFrames / (now - fpsTime)) * 1000)
      fpsEl.textContent = `${fps} fps`
      fpsFrames = 0
      fpsTime = now
    }

    // Mouse delta from center (normalized -1..1)
    const dx = (mouseX - centerX) / centerX
    const dy = (mouseY - centerY) / centerY

    // ── Parallax offsets ──

    const farOffX = dx * PARALLAX_FAR * 40
    const farOffY = dy * PARALLAX_FAR * 40
    const midOffX = dx * PARALLAX_MID * 40
    const midOffY = dy * PARALLAX_MID * 40
    const nearOffX = dx * PARALLAX_NEAR * 40
    const nearOffY = dy * PARALLAX_NEAR * 40
    const nebOffX = dx * PARALLAX_NEBULA * 40
    const nebOffY = dy * PARALLAX_NEBULA * 40

    // ── Far stars ──

    for (const star of farStars) {
      if (star.twinkle) {
        const osc = Math.sin(t * star.twinkleSpeed * Math.PI * 2 + star.twinklePhase)
        star.sprite.alpha = star.baseAlpha * (0.5 + 0.5 * osc)
      }
      star.sprite.x = star.baseX + farOffX
      star.sprite.y = star.baseY + farOffY
    }

    // ── Mid stars ──

    for (const star of midStars) {
      if (star.twinkle) {
        const osc = Math.sin(t * star.twinkleSpeed * Math.PI * 2 + star.twinklePhase)
        star.sprite.alpha = star.baseAlpha * (0.5 + 0.5 * osc)
      }
      star.sprite.x = star.baseX + midOffX
      star.sprite.y = star.baseY + midOffY
    }

    // ── Near stars (subtle pulse on halo children too) ──

    for (let i = 0; i < nearStars.length; i++) {
      const star = nearStars[i]
      const osc = Math.sin(t * star.twinkleSpeed * Math.PI * 2 + star.twinklePhase)
      star.sprite.alpha = star.baseAlpha * (0.7 + 0.3 * osc)
      star.sprite.x = star.baseX + nearOffX
      star.sprite.y = star.baseY + nearOffY

      // Halo is at index i*2, star body at i*2+1
      const halo = nearLayer.children[i * 2] as Sprite
      if (halo) {
        halo.x = star.baseX + nearOffX
        halo.y = star.baseY + nearOffY
        halo.alpha = (0.2 + 0.15 * osc)
      }
    }

    // ── Nebula drift + wrap ──

    const margin = 300 // how far off-screen before wrapping

    for (const neb of nebulae) {
      neb.baseX += neb.driftX
      neb.baseY += neb.driftY

      // Wrap around screen edges (width/height already include scale in PixiJS v8)
      const halfW = neb.sprite.width / 2
      const halfH = neb.sprite.height / 2

      if (neb.baseX > W + margin + halfW) neb.baseX = -margin - halfW
      if (neb.baseX < -margin - halfW) neb.baseX = W + margin + halfW
      if (neb.baseY > H + margin + halfH) neb.baseY = -margin - halfH
      if (neb.baseY < -margin - halfH) neb.baseY = H + margin + halfH

      neb.sprite.x = neb.baseX + nebOffX
      neb.sprite.y = neb.baseY + nebOffY
    }
  })

  // ─── Resize Handler ───

  window.addEventListener('resize', () => {
    app.renderer.resize(window.innerWidth, window.innerHeight)

    // Rebuild vignette
    const nw = window.innerWidth
    const nh = window.innerHeight
    const newVigTex = vignetteTex(nw, nh)
    vig.texture = newVigTex
    vig.width = nw
    vig.height = nh
  })
}

main()
