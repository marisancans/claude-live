/**
 * 5 Background Prototypes — Side-by-Side Showcase
 *
 * Run: open http://localhost:7979/prototypes/backgrounds-showcase.html
 *
 * Each background runs in its own PixiJS Application inside a grid cell.
 * Click any cell to expand it fullscreen; click again to return to grid.
 */
import { Application, Container, Sprite, Texture } from 'pixi.js'

// ─── Types ───

interface BackgroundDef {
  name: string
  init: (app: Application, container: Container, W: number, H: number) => (dt: number, time: number) => void
}

// ─── Shared Texture Factories ───

function makeStarTex(size: number, r = 220, g = 225, b = 255): Texture {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')!
  const h = size / 2
  const gr = ctx.createRadialGradient(h, h, 0, h, h, h)
  gr.addColorStop(0, `rgba(${r},${g},${b},0.95)`)
  gr.addColorStop(0.25, `rgba(${r},${g},${b},0.5)`)
  gr.addColorStop(0.6, `rgba(${r},${g},${b},0.12)`)
  gr.addColorStop(1, `rgba(${r},${g},${b},0)`)
  ctx.fillStyle = gr
  ctx.fillRect(0, 0, size, size)
  return Texture.from(c)
}

function makeGlowTex(size: number, r: number, g: number, b: number, peakAlpha = 0.6): Texture {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')!
  const h = size / 2
  const gr = ctx.createRadialGradient(h, h, 0, h, h, h)
  gr.addColorStop(0, `rgba(${r},${g},${b},${peakAlpha})`)
  gr.addColorStop(0.3, `rgba(${r},${g},${b},${peakAlpha * 0.4})`)
  gr.addColorStop(0.65, `rgba(${r},${g},${b},${peakAlpha * 0.1})`)
  gr.addColorStop(1, `rgba(${r},${g},${b},0)`)
  ctx.fillStyle = gr
  ctx.fillRect(0, 0, size, size)
  return Texture.from(c)
}

function makeNebulaTex(r: number, g: number, b: number, size = 512, offX = 0, offY = 0): Texture {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')!
  const h = size / 2
  const cx = h + offX
  const cy = h + offY
  const gr = ctx.createRadialGradient(cx, cy, 0, h, h, h * 0.95)
  gr.addColorStop(0, `rgba(${r},${g},${b},0.7)`)
  gr.addColorStop(0.2, `rgba(${r},${g},${b},0.45)`)
  gr.addColorStop(0.5, `rgba(${r},${g},${b},0.15)`)
  gr.addColorStop(0.8, `rgba(${r},${g},${b},0.04)`)
  gr.addColorStop(1, `rgba(${r},${g},${b},0)`)
  ctx.fillStyle = gr
  ctx.fillRect(0, 0, size, size)
  return Texture.from(c)
}

function makeLineTex(length: number, thickness: number): Texture {
  const c = document.createElement('canvas')
  c.width = length
  c.height = thickness
  const ctx = c.getContext('2d')!
  const gr = ctx.createLinearGradient(0, 0, length, 0)
  gr.addColorStop(0, 'rgba(140,180,255,0)')
  gr.addColorStop(0.15, 'rgba(140,180,255,0.8)')
  gr.addColorStop(0.5, 'rgba(180,200,255,1)')
  gr.addColorStop(0.85, 'rgba(140,180,255,0.8)')
  gr.addColorStop(1, 'rgba(140,180,255,0)')
  ctx.fillStyle = gr
  ctx.fillRect(0, 0, length, thickness)
  return Texture.from(c)
}

function makeCurtainTex(w: number, h: number, r: number, g: number, b: number): Texture {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d')!
  // Horizontal center glow
  const gH = ctx.createLinearGradient(0, 0, w, 0)
  gH.addColorStop(0, `rgba(${r},${g},${b},0)`)
  gH.addColorStop(0.3, `rgba(${r},${g},${b},0.5)`)
  gH.addColorStop(0.5, `rgba(${r},${g},${b},0.8)`)
  gH.addColorStop(0.7, `rgba(${r},${g},${b},0.5)`)
  gH.addColorStop(1, `rgba(${r},${g},${b},0)`)
  ctx.fillStyle = gH
  ctx.fillRect(0, 0, w, h)
  // Vertical fade
  const gV = ctx.createLinearGradient(0, 0, 0, h)
  gV.addColorStop(0, 'rgba(0,0,0,1)')
  gV.addColorStop(0.2, 'rgba(0,0,0,0)')
  gV.addColorStop(0.5, 'rgba(0,0,0,0)')
  gV.addColorStop(0.8, 'rgba(0,0,0,0)')
  gV.addColorStop(1, 'rgba(0,0,0,1)')
  ctx.globalCompositeOperation = 'destination-in'
  // Invert: we want bright in center, transparent at edges
  const gVKeep = ctx.createLinearGradient(0, 0, 0, h)
  gVKeep.addColorStop(0, 'rgba(255,255,255,0)')
  gVKeep.addColorStop(0.25, 'rgba(255,255,255,0.8)')
  gVKeep.addColorStop(0.5, 'rgba(255,255,255,1)')
  gVKeep.addColorStop(0.75, 'rgba(255,255,255,0.8)')
  gVKeep.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = gVKeep
  ctx.fillRect(0, 0, w, h)
  return Texture.from(c)
}

function makeDustLaneTex(w: number, h: number): Texture {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d')!
  // Diagonal band — draw a wide rotated gradient strip
  ctx.save()
  ctx.translate(w / 2, h / 2)
  ctx.rotate(-0.5) // slight diagonal
  const bandH = h * 0.35
  const gr = ctx.createLinearGradient(0, -bandH, 0, bandH)
  gr.addColorStop(0, 'rgba(80,70,100,0)')
  gr.addColorStop(0.3, 'rgba(80,70,100,0.03)')
  gr.addColorStop(0.5, 'rgba(90,80,110,0.05)')
  gr.addColorStop(0.7, 'rgba(80,70,100,0.03)')
  gr.addColorStop(1, 'rgba(80,70,100,0)')
  ctx.fillStyle = gr
  ctx.fillRect(-w, -bandH, w * 2, bandH * 2)
  ctx.restore()
  return Texture.from(c)
}

function makePulseDotTex(size: number): Texture {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')!
  const h = size / 2
  const gr = ctx.createRadialGradient(h, h, 0, h, h, h)
  gr.addColorStop(0, 'rgba(200,220,255,1)')
  gr.addColorStop(0.2, 'rgba(160,200,255,0.7)')
  gr.addColorStop(0.5, 'rgba(120,160,255,0.2)')
  gr.addColorStop(1, 'rgba(100,140,255,0)')
  ctx.fillStyle = gr
  ctx.fillRect(0, 0, size, size)
  return Texture.from(c)
}

// ─── Helpers ───

function rand(min: number, max: number) { return Math.random() * (max - min) + min }
function randInt(min: number, max: number) { return Math.floor(rand(min, max + 1)) }

function starColor(): number {
  const roll = Math.random()
  if (roll < 0.5) return 0xffe8e0       // warm white
  if (roll < 0.85) return 0xccd8ff      // cool blue
  if (roll < 0.95) return 0xaabbff      // deeper blue
  return 0xffaa77                         // orange/red giant
}

// ─── 1. Deep Field ───

function deepField(app: Application, root: Container, W: number, H: number): (dt: number, time: number) => void {
  const texTiny = makeStarTex(6)
  const texSmall = makeStarTex(10)
  const texMed = makeStarTex(16)
  const texBright = makeStarTex(24)

  // Dust lane overlay
  const dustTex = makeDustLaneTex(W, H)
  const dust = new Sprite(dustTex)
  dust.anchor.set(0.5)
  dust.x = W / 2
  dust.y = H / 2
  dust.width = W * 1.4
  dust.height = H * 1.4
  root.addChild(dust)

  interface Star { s: Sprite; baseAlpha: number; twinkle: boolean; speed: number; phase: number }
  const stars: Star[] = []

  const layers: { count: number; tex: Texture; scaleMin: number; scaleMax: number; alphaMin: number; alphaMax: number }[] = [
    { count: 280, tex: texTiny, scaleMin: 0.04, scaleMax: 0.1, alphaMin: 0.08, alphaMax: 0.25 },
    { count: 140, tex: texSmall, scaleMin: 0.06, scaleMax: 0.15, alphaMin: 0.15, alphaMax: 0.45 },
    { count: 60, tex: texMed, scaleMin: 0.08, scaleMax: 0.2, alphaMin: 0.3, alphaMax: 0.65 },
    { count: 25, tex: texBright, scaleMin: 0.12, scaleMax: 0.28, alphaMin: 0.5, alphaMax: 0.85 },
  ]

  for (const layer of layers) {
    for (let i = 0; i < layer.count; i++) {
      const s = new Sprite(layer.tex)
      s.anchor.set(0.5)
      s.x = rand(0, W)
      s.y = rand(0, H)
      s.scale.set(rand(layer.scaleMin, layer.scaleMax))
      const ba = rand(layer.alphaMin, layer.alphaMax)
      s.alpha = ba
      s.tint = starColor()
      root.addChild(s)
      stars.push({ s, baseAlpha: ba, twinkle: Math.random() < 0.3, speed: rand(0.5, 2.5), phase: rand(0, Math.PI * 2) })
    }
  }

  return (_dt: number, time: number) => {
    for (const star of stars) {
      if (star.twinkle) {
        star.s.alpha = star.baseAlpha * (0.4 + 0.6 * (0.5 + 0.5 * Math.sin(time * star.speed + star.phase)))
      }
    }
  }
}

// ─── 2. Nebula Reef ───

function nebulaReef(app: Application, root: Container, W: number, H: number): (dt: number, time: number) => void {
  const starTex = makeStarTex(10)

  // Stars — sparse
  for (let i = 0; i < 100; i++) {
    const s = new Sprite(starTex)
    s.anchor.set(0.5)
    s.x = rand(0, W)
    s.y = rand(0, H)
    s.scale.set(rand(0.05, 0.15))
    s.alpha = rand(0.15, 0.5)
    s.tint = 0xdde4ff
    root.addChild(s)
  }

  // Nebula blobs
  const blobColors: [number, number, number][] = [
    [139, 26, 74],   // deep magenta #8b1a4a
    [10, 110, 110],  // electric teal #0a6e6e
    [110, 74, 10],   // warm amber #6e4a0a
    [58, 26, 110],   // violet #3a1a6e
    [100, 20, 60],   // rose variant
    [20, 90, 100],   // teal variant
    [80, 50, 20],    // amber variant
    [70, 30, 120],   // purple variant
    [50, 15, 80],    // dark violet
    [15, 80, 75],    // sea teal
  ]

  interface Blob { s: Sprite; rotSpeed: number; driftX: number; driftY: number }
  const blobs: Blob[] = []

  for (let i = 0; i < 10; i++) {
    const [r, g, b] = blobColors[i]
    const offX = rand(-80, 80)
    const offY = rand(-80, 80)
    const tex = makeNebulaTex(r, g, b, 512, offX, offY)
    const s = new Sprite(tex)
    s.anchor.set(0.5)
    s.x = rand(W * 0.05, W * 0.95)
    s.y = rand(H * 0.05, H * 0.95)
    s.scale.set(rand(1.2, 2.8))
    s.alpha = rand(0.12, 0.3)
    s.blendMode = 'screen'
    s.rotation = rand(0, Math.PI * 2)
    root.addChild(s)
    blobs.push({ s, rotSpeed: rand(0.0005, 0.002) * (Math.random() < 0.5 ? 1 : -1), driftX: rand(-0.08, 0.08), driftY: rand(-0.06, 0.06) })
  }

  return (_dt: number, _time: number) => {
    for (const blob of blobs) {
      blob.s.rotation += blob.rotSpeed
      blob.s.x += blob.driftX
      blob.s.y += blob.driftY
      // Soft wrap
      if (blob.s.x < -200) blob.s.x = W + 200
      if (blob.s.x > W + 200) blob.s.x = -200
      if (blob.s.y < -200) blob.s.y = H + 200
      if (blob.s.y > H + 200) blob.s.y = -200
    }
  }
}

// ─── 3. Void ───

function voidBg(app: Application, root: Container, W: number, H: number): (dt: number, time: number) => void {
  const glowTex = makeGlowTex(64, 180, 200, 255, 0.7)
  const starCoreTex = makeStarTex(16)

  // One distant nebula wisp — very faint, very large
  const wispTex = makeNebulaTex(30, 25, 60, 512, 40, -30)
  const wisp = new Sprite(wispTex)
  wisp.anchor.set(0.5)
  wisp.x = W * 0.65
  wisp.y = H * 0.45
  wisp.scale.set(3.5)
  wisp.alpha = 0.04
  wisp.blendMode = 'screen'
  root.addChild(wisp)

  interface VoidStar { core: Sprite; glow: Sprite; baseAlpha: number; pulseSpeed: number; phase: number }
  const stars: VoidStar[] = []

  for (let i = 0; i < 35; i++) {
    const x = rand(W * 0.05, W * 0.95)
    const y = rand(H * 0.05, H * 0.95)

    // Glow tail
    const glow = new Sprite(glowTex)
    glow.anchor.set(0.5)
    glow.x = x
    glow.y = y
    glow.scale.set(rand(0.8, 1.8))
    glow.alpha = rand(0.15, 0.35)
    glow.blendMode = 'add'
    root.addChild(glow)

    // Core
    const core = new Sprite(starCoreTex)
    core.anchor.set(0.5)
    core.x = x
    core.y = y
    core.scale.set(rand(0.2, 0.45))
    const ba = rand(0.4, 0.8)
    core.alpha = ba
    core.tint = starColor()
    root.addChild(core)

    stars.push({ core, glow, baseAlpha: ba, pulseSpeed: rand(0.15, 0.4), phase: rand(0, Math.PI * 2) })
  }

  return (_dt: number, time: number) => {
    for (const star of stars) {
      // Slow breathing pulse
      const pulse = 0.5 + 0.5 * Math.sin(time * star.pulseSpeed + star.phase)
      star.core.alpha = star.baseAlpha * (0.5 + 0.5 * pulse)
      star.glow.alpha = 0.1 + 0.25 * pulse
      star.glow.scale.set(1.0 + 0.4 * pulse)
    }
    // Wisp drifts very slowly
    wisp.rotation += 0.0002
  }
}

// ─── 4. Aurora ───

function aurora(app: Application, root: Container, W: number, H: number): (dt: number, time: number) => void {
  const starTex = makeStarTex(8)

  // Background stars
  for (let i = 0; i < 150; i++) {
    const s = new Sprite(starTex)
    s.anchor.set(0.5)
    s.x = rand(0, W)
    s.y = rand(0, H)
    s.scale.set(rand(0.04, 0.12))
    s.alpha = rand(0.1, 0.35)
    s.tint = 0xccd8ff
    root.addChild(s)
  }

  // Aurora curtains
  const curtainColors: [number, number, number][] = [
    [0, 255, 136],   // green #00ff88
    [0, 136, 255],   // blue #0088ff
    [136, 0, 255],   // purple #8800ff
    [255, 0, 136],   // pink #ff0088
    [0, 200, 180],   // teal
    [60, 0, 220],    // deep purple
    [0, 180, 255],   // sky blue
    [200, 0, 180],   // magenta
  ]

  interface Curtain { s: Sprite; baseX: number; freq: number; amp: number; phase: number }
  const curtains: Curtain[] = []

  for (let i = 0; i < 8; i++) {
    const [r, g, b] = curtainColors[i]
    const tex = makeCurtainTex(64, 512, r, g, b)
    const s = new Sprite(tex)
    s.anchor.set(0.5)
    const baseX = W * (0.1 + (i / 8) * 0.8) + rand(-30, 30)
    s.x = baseX
    s.y = H / 2
    s.width = rand(80, 180)
    s.height = H * rand(0.85, 1.1)
    s.alpha = rand(0.03, 0.06)
    s.blendMode = 'add'
    root.addChild(s)
    curtains.push({ s, baseX, freq: rand(0.2, 0.7), amp: rand(20, 60), phase: rand(0, Math.PI * 2) })
  }

  return (_dt: number, time: number) => {
    for (const c of curtains) {
      c.s.x = c.baseX + Math.sin(time * c.freq + c.phase) * c.amp
      // Subtle alpha oscillation
      c.s.alpha = 0.03 + 0.03 * (0.5 + 0.5 * Math.sin(time * c.freq * 0.5 + c.phase + 1))
    }
  }
}

// ─── 5. Cosmic Web ───

function cosmicWeb(app: Application, root: Container, W: number, H: number): (dt: number, time: number) => void {
  // Cluster centers
  const clusterCenters = Array.from({ length: 6 }, () => ({ x: rand(W * 0.1, W * 0.9), y: rand(H * 0.1, H * 0.9) }))

  function gaussianRand() {
    // Box-Muller
    const u1 = Math.random()
    const u2 = Math.random()
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
  }

  // Star positions — clustered
  interface WebStar { x: number; y: number; sprite: Sprite }
  const stars: WebStar[] = []
  const starTex = makeStarTex(12)

  for (let i = 0; i < 200; i++) {
    const cluster = clusterCenters[randInt(0, clusterCenters.length - 1)]
    const spread = rand(40, 150)
    const x = Math.max(5, Math.min(W - 5, cluster.x + gaussianRand() * spread))
    const y = Math.max(5, Math.min(H - 5, cluster.y + gaussianRand() * spread))
    const s = new Sprite(starTex)
    s.anchor.set(0.5)
    s.x = x
    s.y = y
    s.scale.set(rand(0.08, 0.2))
    s.alpha = rand(0.3, 0.7)
    s.tint = starColor()
    root.addChild(s)
    stars.push({ x, y, sprite: s })
  }

  // Find connections — nearby pairs
  interface WebEdge { sprite: Sprite; baseAlpha: number; phase: number; speed: number; from: number; to: number }
  const edges: WebEdge[] = []
  const lineBaseTex = makeLineTex(128, 2)
  const MAX_DIST = 200

  for (let i = 0; i < stars.length; i++) {
    for (let j = i + 1; j < stars.length; j++) {
      const dx = stars[j].x - stars[i].x
      const dy = stars[j].y - stars[i].y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < MAX_DIST && dist > 15) {
        const s = new Sprite(lineBaseTex)
        s.anchor.set(0, 0.5)
        s.x = stars[i].x
        s.y = stars[i].y
        s.width = dist
        s.height = 1.5
        s.rotation = Math.atan2(dy, dx)
        const ba = 0.02 + (1 - dist / MAX_DIST) * 0.04
        s.alpha = ba
        s.blendMode = 'add'
        root.addChild(s)
        edges.push({ sprite: s, baseAlpha: ba, phase: rand(0, Math.PI * 2), speed: rand(0.3, 1.2), from: i, to: j })
      }
    }
  }

  // Move star sprites above edges
  for (const star of stars) {
    root.removeChild(star.sprite)
    root.addChild(star.sprite)
  }

  // Traveling pulses
  interface Pulse { sprite: Sprite; from: number; to: number; progress: number; speed: number; alive: boolean }
  const pulseTex = makePulseDotTex(16)
  const pulses: Pulse[] = []
  let nextPulseTime = 0

  return (_dt: number, time: number) => {
    // Edge alpha oscillation
    for (const edge of edges) {
      edge.sprite.alpha = edge.baseAlpha + 0.02 * Math.sin(time * edge.speed + edge.phase)
    }

    // Spawn pulses
    if (time > nextPulseTime && edges.length > 0) {
      const edge = edges[randInt(0, edges.length - 1)]
      const ps = new Sprite(pulseTex)
      ps.anchor.set(0.5)
      ps.scale.set(0.4)
      ps.alpha = 0.8
      ps.blendMode = 'add'
      root.addChild(ps)
      const dir = Math.random() < 0.5
      pulses.push({ sprite: ps, from: dir ? edge.from : edge.to, to: dir ? edge.to : edge.from, progress: 0, speed: rand(0.4, 1.2), alive: true })
      nextPulseTime = time + rand(0.3, 1.5)
    }

    // Update pulses
    for (const p of pulses) {
      if (!p.alive) continue
      p.progress += _dt * p.speed * 0.016
      if (p.progress >= 1) {
        p.alive = false
        p.sprite.visible = false
        root.removeChild(p.sprite)
        p.sprite.destroy()
        continue
      }
      const a = stars[p.from]
      const b = stars[p.to]
      p.sprite.x = a.x + (b.x - a.x) * p.progress
      p.sprite.y = a.y + (b.y - a.y) * p.progress
      // Fade at edges
      const fade = p.progress < 0.1 ? p.progress / 0.1 : p.progress > 0.9 ? (1 - p.progress) / 0.1 : 1
      p.sprite.alpha = 0.8 * fade
    }
    // Clean dead pulses
    for (let i = pulses.length - 1; i >= 0; i--) {
      if (!pulses[i].alive) pulses.splice(i, 1)
    }
  }
}

// ─── Registry ───

const BACKGROUNDS: BackgroundDef[] = [
  { name: 'Deep Field', init: deepField },
  { name: 'Nebula Reef', init: nebulaReef },
  { name: 'Void', init: voidBg },
  { name: 'Aurora', init: aurora },
  { name: 'Cosmic Web', init: cosmicWeb },
]

// ─── Bootstrap ───

const BG_COLORS: Record<string, number> = {
  'Deep Field': 0x030308,
  'Nebula Reef': 0x050510,
  'Void': 0x020208,
  'Aurora': 0x040412,
  'Cosmic Web': 0x040410,
}

async function main() {
  const grid = document.getElementById('grid')!
  const cells: { cell: HTMLElement; app: Application; def: BackgroundDef }[] = []

  let expandedIndex = -1

  for (let i = 0; i < BACKGROUNDS.length; i++) {
    const def = BACKGROUNDS[i]
    const cell = document.createElement('div')
    cell.className = 'cell'
    cell.dataset.index = String(i)

    const canvasWrap = document.createElement('div')
    canvasWrap.className = 'canvas-wrap'

    const label = document.createElement('div')
    label.className = 'label'
    label.textContent = def.name

    cell.appendChild(canvasWrap)
    cell.appendChild(label)
    grid.appendChild(cell)

    const W = 500
    const H = 350
    const app = new Application()
    await app.init({
      background: BG_COLORS[def.name] ?? 0x050510,
      width: W,
      height: H,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    })

    canvasWrap.appendChild(app.canvas as HTMLCanvasElement)

    const root = new Container()
    app.stage.addChild(root)

    const tick = def.init(app, root, W, H)

    let elapsed = 0
    app.ticker.add((ticker) => {
      elapsed += ticker.deltaTime / 60
      tick(ticker.deltaTime, elapsed)
    })

    cells.push({ cell, app, def })

    // Click to expand/collapse
    cell.addEventListener('click', () => {
      if (expandedIndex === i) {
        // Collapse back to grid
        expandedIndex = -1
        grid.classList.remove('fullscreen-mode')
        cell.classList.remove('expanded')
        for (const c of cells) c.cell.classList.remove('hidden')
        // Resize back
        app.renderer.resize(500, 350)
      } else {
        // Expand
        if (expandedIndex >= 0) {
          cells[expandedIndex].cell.classList.remove('expanded')
        }
        expandedIndex = i
        grid.classList.add('fullscreen-mode')
        for (const c of cells) {
          if (c.cell !== cell) c.cell.classList.add('hidden')
          else c.cell.classList.add('expanded')
        }
        // Resize to fill viewport
        const vw = window.innerWidth
        const vh = window.innerHeight
        app.renderer.resize(vw, vh)
      }
    })
  }

  // FPS counter
  const fpsEl = document.getElementById('fps')!
  let fpsFrames = 0
  let fpsStart = performance.now()
  function fpsLoop() {
    fpsFrames++
    const now = performance.now()
    if (now - fpsStart >= 500) {
      fpsEl.textContent = `${Math.round((fpsFrames / (now - fpsStart)) * 1000)} fps`
      fpsFrames = 0
      fpsStart = now
    }
    requestAnimationFrame(fpsLoop)
  }
  requestAnimationFrame(fpsLoop)

  // Handle window resize when in fullscreen
  window.addEventListener('resize', () => {
    if (expandedIndex >= 0) {
      const c = cells[expandedIndex]
      c.app.renderer.resize(window.innerWidth, window.innerHeight)
    }
  })
}

main()
