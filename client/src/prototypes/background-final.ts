/**
 * Background Final Prototype — "Aurora + Distant Universe"
 *
 * Run: open http://localhost:7979/prototypes/background-final.html
 *
 * Deep space with faint aurora curtains, sparse star specks,
 * tiny distant galaxy smudges, and a soft vignette.
 * Everything is extremely subtle — the darkness IS the design.
 */
import { Application, Container, Sprite, Texture } from 'pixi.js'

// ─── Constants ───

const BG_COLOR = 0x050510

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

  // Build pixel-by-pixel for precise gaussian horizontal + vertical gradient
  const imgData = ctx.createImageData(w, h)
  const data = imgData.data
  const cx = w / 2

  for (let y = 0; y < h; y++) {
    // Vertical intensity: 0 at top, peaks between peakStart-peakEnd, 0 at bottom
    const ny = y / h
    let vIntensity: number
    if (ny < peakStart) {
      // Ease in from top
      const t = ny / peakStart
      vIntensity = t * t // quadratic ease-in
    } else if (ny > peakEnd) {
      // Ease out to bottom
      const t = (ny - peakEnd) / (1.0 - peakEnd)
      vIntensity = (1 - t) * (1 - t) // quadratic ease-out
    } else {
      vIntensity = 1.0
    }

    for (let x = 0; x < w; x++) {
      // Horizontal: gaussian bell centered at cx
      const dx = (x - cx) / (w / 2)
      const hIntensity = Math.exp(-dx * dx * 3.0) // sigma ~0.58

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
  const h = size / 2
  const g = ctx.createRadialGradient(h, h, 0, h, h, h)
  g.addColorStop(0, 'rgba(180,190,220,0.9)')
  g.addColorStop(0.4, 'rgba(180,190,220,0.3)')
  g.addColorStop(1, 'rgba(180,190,220,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  return Texture.from(c)
}

/**
 * Distant galaxy smudge: 32x12px elongated soft blur.
 */
function galaxySmudgeTex(): Texture {
  const w = 32
  const h = 12
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d')!

  // Elliptical gradient via scaling
  const cx = w / 2
  const cy = h / 2
  const imgData = ctx.createImageData(w, h)
  const data = imgData.data

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      // Elliptical distance: normalized so 1.0 = edge
      const dx = (x - cx) / (w / 2)
      const dy = (y - cy) / (h / 2)
      const dist = Math.sqrt(dx * dx + dy * dy)
      // Smooth falloff
      const intensity = Math.max(0, 1 - dist) * Math.max(0, 1 - dist)

      const alpha = intensity * 0.35 // peak alpha visible
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
 * Vignette: radial gradient, transparent center -> dark edges.
 */
function vignetteTex(w: number, h: number): Texture {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d')!
  const cx = w / 2
  const cy = h / 2
  const radius = Math.max(w, h) * 0.7
  const g = ctx.createRadialGradient(cx, cy, radius * 0.25, cx, cy, radius)
  g.addColorStop(0, 'rgba(3,3,8,0)')
  g.addColorStop(0.5, 'rgba(3,3,8,0.15)')
  g.addColorStop(0.8, 'rgba(3,3,8,0.4)')
  g.addColorStop(1, 'rgba(3,3,8,0.6)')
  ctx.fillStyle = g
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
  freq: number      // sway frequency (0.15-0.4)
  amplitude: number  // sway amplitude (20-60px)
  phase: number      // random phase offset
  baseX: number      // center x position
}

interface StarData {
  sprite: Sprite
  baseAlpha: number
  twinkle: boolean
  twinkleSpeed: number
  twinklePhase: number
}

// ─── Aurora Curtain Configs ───

const AURORA_CONFIGS = [
  { r: 0,   g: 180, b: 160, peakAlpha: 0.18, peakStart: 0.35, peakEnd: 0.55 },  // teal
  { r: 40,  g: 80,  b: 200, peakAlpha: 0.14, peakStart: 0.40, peakEnd: 0.60 },  // blue
  { r: 100, g: 40,  b: 180, peakAlpha: 0.12, peakStart: 0.45, peakEnd: 0.65 },  // violet
  { r: 0,   g: 200, b: 100, peakAlpha: 0.10, peakStart: 0.38, peakEnd: 0.58 },  // green
  { r: 180, g: 40,  b: 80,  peakAlpha: 0.08, peakStart: 0.42, peakEnd: 0.62 },  // rose
  { r: 30,  g: 120, b: 190, peakAlpha: 0.11, peakStart: 0.36, peakEnd: 0.56 },  // sky
]

// ─── Main ───

async function main() {
  const app = new Application()

  const W = window.innerWidth
  const H = window.innerHeight

  await app.init({
    background: BG_COLOR,
    width: W,
    height: H,
    antialias: false, // not needed — everything is soft textures
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  })

  const container = document.getElementById('canvas-container')!
  container.appendChild(app.canvas as HTMLCanvasElement)

  // ─── Layer Containers ───

  const auroraLayer = new Container()
  const starLayer = new Container()
  const galaxyLayer = new Container()
  const vignetteLayer = new Container()

  app.stage.addChild(auroraLayer)
  app.stage.addChild(starLayer)
  app.stage.addChild(galaxyLayer)
  app.stage.addChild(vignetteLayer)

  // ─── Layer 2: Aurora Curtains ───

  const auroras: AuroraData[] = []

  // Spread curtains across the screen width
  const curtainSpacing = W / (AURORA_CONFIGS.length + 1)

  for (let i = 0; i < AURORA_CONFIGS.length; i++) {
    const cfg = AURORA_CONFIGS[i]
    const tex = auroraCurtainTex(cfg.r, cfg.g, cfg.b, cfg.peakAlpha, cfg.peakStart, cfg.peakEnd)
    const s = new Sprite(tex)
    s.anchor.set(0.5)

    const baseX = curtainSpacing * (i + 1) + rand(-80, 80) // jittered spread
    s.x = baseX
    s.y = H / 2

    // Scale: wide horizontally, full height vertically
    const scaleX = rand(1.5, 3.0)
    const scaleY = H / 800 // stretch to fill viewport height
    s.scale.set(scaleX, scaleY)

    // Sprite alpha — texture already has the gradient, this controls overall intensity
    s.alpha = rand(0.3, 0.6)
    s.blendMode = 'add'

    auroraLayer.addChild(s)

    auroras.push({
      sprite: s,
      freq: rand(0.15, 0.4),
      amplitude: rand(20, 60),
      phase: rand(0, Math.PI * 2),
      baseX: baseX,
    })
  }

  // ─── Layer 3: Star Specks ───

  const starTex = starSpeckTex()
  const stars: StarData[] = []

  // 60-80 total stars
  const totalStars = Math.round(rand(60, 80))
  // 5-8 slightly larger ones
  const largerCount = Math.round(rand(5, 8))
  const smallCount = totalStars - largerCount

  // Small specks
  for (let i = 0; i < smallCount; i++) {
    const s = new Sprite(starTex)
    s.anchor.set(0.5)
    s.x = rand(0, W)
    s.y = rand(0, H)
    s.scale.set(rand(0.08, 0.2)) // small specks
    const ba = rand(0.3, 0.7)
    s.alpha = ba

    starLayer.addChild(s)

    // 20% twinkle
    const doTwinkle = Math.random() < 0.2
    stars.push({
      sprite: s,
      baseAlpha: ba,
      twinkle: doTwinkle,
      twinkleSpeed: rand(0.2, 0.8),
      twinklePhase: rand(0, Math.PI * 2),
    })
  }

  // Slightly larger specks
  for (let i = 0; i < largerCount; i++) {
    const s = new Sprite(starTex)
    s.anchor.set(0.5)
    s.x = rand(0, W)
    s.y = rand(0, H)
    s.scale.set(rand(0.2, 0.35)) // slightly larger
    const ba = rand(0.4, 0.7)
    s.alpha = ba

    starLayer.addChild(s)

    // These also have a 20% twinkle chance
    const doTwinkle = Math.random() < 0.2
    stars.push({
      sprite: s,
      baseAlpha: ba,
      twinkle: doTwinkle,
      twinkleSpeed: rand(0.2, 0.8),
      twinklePhase: rand(0, Math.PI * 2),
    })
  }

  // ─── Layer 4: Distant Galaxies ───

  const galaxyTex = galaxySmudgeTex()
  const galaxyCount = Math.round(rand(3, 5))

  for (let i = 0; i < galaxyCount; i++) {
    const s = new Sprite(galaxyTex)
    s.anchor.set(0.5)
    s.x = rand(W * 0.1, W * 0.9)
    s.y = rand(H * 0.1, H * 0.9)
    s.rotation = rand(0, Math.PI * 2) // random tilt
    s.scale.set(rand(0.5, 1.0))
    s.alpha = rand(0.3, 0.5)
    // No animation — static deep space objects

    galaxyLayer.addChild(s)
  }

  // ─── Layer 5: Vignette ───

  const vigTex = vignetteTex(W, H)
  const vig = new Sprite(vigTex)
  vig.x = 0
  vig.y = 0
  vig.width = W
  vig.height = H
  vignetteLayer.addChild(vig)

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

    // ── Aurora curtain sway ──
    for (const aurora of auroras) {
      aurora.sprite.x = aurora.baseX + Math.sin(t * aurora.freq + aurora.phase) * aurora.amplitude
    }

    // ── Star twinkle ──
    for (const star of stars) {
      if (star.twinkle) {
        const osc = Math.sin(t * star.twinkleSpeed * Math.PI * 2 + star.twinklePhase)
        // Oscillate between 60% and 100% of base alpha — gentle, not blinking
        star.sprite.alpha = star.baseAlpha * (0.6 + 0.4 * (0.5 + 0.5 * osc))
      }
    }

    // Galaxies and vignette: no per-frame updates needed.
  })

  // ─── Resize Handler ───

  window.addEventListener('resize', () => {
    const nw = window.innerWidth
    const nh = window.innerHeight
    app.renderer.resize(nw, nh)

    // Rebuild vignette for new size
    const newVigTex = vignetteTex(nw, nh)
    vig.texture = newVigTex
    vig.width = nw
    vig.height = nh

    // Re-scale aurora curtains to fill new height
    for (const aurora of auroras) {
      const currentScaleX = aurora.sprite.scale.x
      aurora.sprite.scale.set(currentScaleX, nh / 800)
      aurora.sprite.y = nh / 2
    }
  })
}

main()
