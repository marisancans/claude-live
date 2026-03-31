/**
 * Post-Processing Visual Prototype
 *
 * Run: open http://localhost:7979/prototypes/post-processing.html
 * Press SPACE to toggle glow on/off
 *
 * Demonstrates: Canvas2D gradient textures, additive blend glow,
 * twinkling stars, drifting nebula, breathing nodes, orbits, meteors.
 */
import { Application, Container, Sprite, Graphics, Texture, Color } from 'pixi.js'

// ─── Canvas2D Texture Factories ───

function glowTex(r: number, g: number, b: number, size: number, coreA = 0.6, midA = 0.15): Texture {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')!
  const h = size / 2
  const gr = ctx.createRadialGradient(h, h, 0, h, h, h)
  gr.addColorStop(0, `rgba(${r},${g},${b},${coreA})`)
  gr.addColorStop(0.2, `rgba(${r},${g},${b},${coreA * 0.6})`)
  gr.addColorStop(0.5, `rgba(${r},${g},${b},${midA})`)
  gr.addColorStop(1, `rgba(${r},${g},${b},0)`)
  ctx.fillStyle = gr
  ctx.fillRect(0, 0, size, size)
  return Texture.from(c)
}

function bodyTex(r: number, g: number, b: number, size: number): Texture {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')!
  const h = size / 2
  const gr = ctx.createRadialGradient(h, h, 0, h, h, h * 0.85)
  gr.addColorStop(0, `rgba(${r},${g},${b},1)`)
  gr.addColorStop(0.5, `rgba(${r},${g},${b},0.9)`)
  gr.addColorStop(0.85, `rgba(${r},${g},${b},0.4)`)
  gr.addColorStop(1, `rgba(${r},${g},${b},0)`)
  ctx.fillStyle = gr
  ctx.beginPath(); ctx.arc(h, h, h, 0, Math.PI * 2); ctx.fill()
  // Upper-left highlight for 3D depth
  const hl = ctx.createRadialGradient(h * 0.6, h * 0.6, 0, h * 0.6, h * 0.6, h * 0.5)
  hl.addColorStop(0, 'rgba(255,255,255,0.35)')
  hl.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = hl
  ctx.beginPath(); ctx.arc(h, h, h * 0.8, 0, Math.PI * 2); ctx.fill()
  return Texture.from(c)
}

function diamondTex(r: number, g: number, b: number, size: number): Texture {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')!
  const h = size / 2
  // Glow halo
  const gr = ctx.createRadialGradient(h, h, 0, h, h, h)
  gr.addColorStop(0, `rgba(${r},${g},${b},0.3)`)
  gr.addColorStop(0.5, `rgba(${r},${g},${b},0.06)`)
  gr.addColorStop(1, `rgba(${r},${g},${b},0)`)
  ctx.fillStyle = gr
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
  ctx.strokeStyle = `rgba(${Math.min(255, r + 80)},${Math.min(255, g + 80)},${Math.min(255, b + 80)},0.5)`
  ctx.lineWidth = 0.5; ctx.stroke()
  return Texture.from(c)
}

// ─── Main ───

async function main() {
  const app = new Application()
  await app.init({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x050510,
    antialias: true,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    autoStart: false,
  })
  document.getElementById('canvas-container')!.appendChild(app.canvas)

  const W = window.innerWidth
  const H = window.innerHeight
  const scene = new Container()
  app.stage.addChild(scene)

  // ─── Stars ───
  const starTex = glowTex(200, 215, 255, 8, 0.9, 0.1)
  interface Star extends Sprite { _ba: number; _ts: number; _tp: number }
  const stars: Star[] = []
  for (let i = 0; i < 250; i++) {
    const s = new Sprite(starTex) as Star
    s.anchor.set(0.5)
    s.x = Math.random() * W; s.y = Math.random() * H
    s.scale.set(0.08 + Math.random() * 0.3)
    s._ba = 0.15 + Math.random() * 0.6
    s.alpha = s._ba
    s._ts = 0.3 + Math.random() * 1.5
    s._tp = Math.random() * Math.PI * 2
    scene.addChild(s)
    stars.push(s)
  }

  // ─── Nebula ───
  const nebColors: [number, number, number][] = [[42, 16, 40], [8, 26, 48], [16, 8, 48], [25, 10, 30]]
  interface Neb extends Sprite { _vx: number; _vy: number }
  const nebulae: Neb[] = []
  for (const [r, g, b] of nebColors) {
    const t = glowTex(r, g, b, 256, 0.18, 0.04)
    const s = new Sprite(t) as Neb
    s.anchor.set(0.5)
    s.x = Math.random() * W; s.y = Math.random() * H
    s.scale.set(2 + Math.random() * 3)
    s.blendMode = 'add'
    s._vx = (Math.random() - 0.5) * 0.06
    s._vy = (Math.random() - 0.5) * 0.05
    scene.addChild(s)
    nebulae.push(s)
  }

  // ─── Session Cores ───
  const models = [
    { base: [240, 112, 32] as const, bright: [255, 187, 102] as const, x: W * 0.3, y: H * 0.42 },
    { base: [64, 128, 255] as const, bright: [128, 176, 255] as const, x: W * 0.63, y: H * 0.38 },
    { base: [48, 216, 112] as const, bright: [112, 255, 176] as const, x: W * 0.48, y: H * 0.68 },
  ]

  const cores: { ct: Container; g1: Sprite; g2: Sprite; wh: Sprite; m: typeof models[0]; t: number }[] = []
  for (const m of models) {
    const ct = new Container()
    ct.x = m.x; ct.y = m.y

    const g1 = new Sprite(glowTex(...m.base, 160, 0.25, 0.04))
    g1.anchor.set(0.5); g1.scale.set(0.9); g1.blendMode = 'add'
    ct.addChild(g1)

    const g2 = new Sprite(glowTex(...m.bright, 80, 0.5, 0.1))
    g2.anchor.set(0.5); g2.scale.set(0.5); g2.blendMode = 'add'
    ct.addChild(g2)

    const bd = new Sprite(bodyTex(...m.bright, 40))
    bd.anchor.set(0.5); bd.scale.set(0.5)
    ct.addChild(bd)

    const wh = new Sprite(glowTex(255, 250, 240, 20, 1, 0.3))
    wh.anchor.set(0.5); wh.scale.set(0.5); wh.blendMode = 'add'
    ct.addChild(wh)

    scene.addChild(ct)
    cores.push({ ct, g1, g2, wh, m, t: Math.random() * 100 })
  }

  // ─── Orbit rings ───
  const orbitGfx = new Graphics()
  scene.addChild(orbitGfx)

  // ─── Nodes ───
  const toolColors: [number, number, number][] = [
    [126, 200, 227], [244, 132, 95], [232, 164, 74],
    [78, 205, 196], [167, 139, 250], [244, 114, 182],
  ]

  interface ONode { ct: Container; glow: Sprite; isDiamond: boolean; cx: number; cy: number; radius: number; angle: number; speed: number; seed: number }
  const allNodes: ONode[] = []
  for (const core of cores) {
    const radii = [58, 95, 138]
    for (let ni = 0; ni < 6; ni++) {
      const nc = toolColors[ni]
      const ring = ni < 2 ? 0 : ni < 4 ? 1 : 2
      const isDiamond = ni % 2 === 1

      const ncont = new Container()
      const gt = new Sprite(glowTex(...nc, 48, 0.45, 0.08))
      gt.anchor.set(0.5); gt.scale.set(0.3); gt.blendMode = 'add'
      ncont.addChild(gt)

      const bt = new Sprite(isDiamond ? diamondTex(...nc, 28) : bodyTex(...nc, 24))
      bt.anchor.set(0.5); bt.scale.set(isDiamond ? 0.5 : 0.35)
      ncont.addChild(bt)

      scene.addChild(ncont)
      allNodes.push({
        ct: ncont, glow: gt, isDiamond,
        cx: core.m.x, cy: core.m.y,
        radius: radii[ring],
        angle: (ni / 6) * Math.PI * 2 + Math.random() * 0.5,
        speed: (0.12 + Math.random() * 0.08) / (ring + 1),
        seed: Math.random() * 100,
      })
    }
  }

  // ─── Meteors ───
  const shardTex = glowTex(200, 220, 255, 16, 0.8, 0.1)
  interface Meteor extends Sprite { _vx: number; _vy: number; _life: number; _drift: number }
  const meteors: Meteor[] = []
  let mTimer = 0

  function spawnMeteor() {
    const core = cores[Math.floor(Math.random() * cores.length)]
    const a = Math.random() * Math.PI * 2
    const d = 250 + Math.random() * 200
    const sx = core.m.x + Math.cos(a) * d
    const sy = core.m.y + Math.sin(a) * d
    const tc = toolColors[Math.floor(Math.random() * toolColors.length)]

    for (let i = 0; i < 12; i++) {
      const s = new Sprite(shardTex) as Meteor
      s.anchor.set(0.5)
      s.tint = (tc[0] << 16) | (tc[1] << 8) | tc[2]
      s.blendMode = 'add'
      s.x = sx + (Math.random() - 0.5) * 6
      s.y = sy + (Math.random() - 0.5) * 6
      s.scale.set(0.12 + Math.random() * 0.2)
      const ta = Math.atan2(core.m.y - sy, core.m.x - sx) + (Math.random() - 0.5) * 0.25
      s._vx = Math.cos(ta) * (1.2 + Math.random() * 1)
      s._vy = Math.sin(ta) * (1.2 + Math.random() * 1)
      s._life = 0.5 + Math.random() * 0.5
      s._drift = (Math.random() - 0.5) * 0.4
      scene.addChild(s)
      meteors.push(s)
    }
  }

  // ─── Glow toggle ───
  let glowOn = true
  const glowSprites: Sprite[] = []
  function collectGlows(ct: Container) {
    for (const child of ct.children) {
      if ((child as Sprite).blendMode === 'add') glowSprites.push(child as Sprite)
      if ('children' in child) collectGlows(child as Container)
    }
  }
  setTimeout(() => collectGlows(scene), 200)

  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.preventDefault()
      glowOn = !glowOn
      for (const s of glowSprites) s.visible = glowOn
      document.getElementById('info')!.querySelector('span')!.textContent = glowOn ? 'GLOW ON' : 'GLOW OFF'
    }
  })

  // ─── Render loop ───
  let time = 0
  let frames = 0
  let lastFps = Date.now()

  function tick() {
    requestAnimationFrame(tick)
    const dt = 1 / 60
    time += dt
    frames++

    if (Date.now() - lastFps > 1000) {
      document.getElementById('fps')!.textContent = `${frames}`
      frames = 0; lastFps = Date.now()
    }

    // Stars
    for (const s of stars) s.alpha = s._ba * (0.3 + 0.7 * Math.sin(time * s._ts + s._tp))

    // Nebula
    for (const n of nebulae) {
      n.x += n._vx; n.y += n._vy
      if (n.x < -300) n.x = W + 300; if (n.x > W + 300) n.x = -300
      if (n.y < -300) n.y = H + 300; if (n.y > H + 300) n.y = -300
    }

    // Cores breathe
    for (const c of cores) {
      c.t += dt
      c.g1.scale.set(0.9 * (1 + 0.06 * Math.sin(c.t * 0.4)))
      c.g2.scale.set(0.5 * (1 + 0.08 * Math.sin(c.t * 0.6 + 1)))
      c.wh.scale.set(0.5 * (1 + 0.12 * Math.sin(c.t * 1.1)))
      c.wh.alpha = 0.7 + 0.3 * Math.sin(c.t * 0.8)
    }

    // Orbits
    orbitGfx.clear()
    for (const c of cores) {
      for (let ri = 0; ri < 3; ri++) {
        const rad = [58, 95, 138][ri]
        const alpha = 0.055 - ri * 0.012
        const segs = 20; const dashR = 0.55
        // Glow pass
        for (let s = 0; s < segs; s++) {
          const a1 = (s / segs) * Math.PI * 2 + time * 0.04 * (ri + 1)
          const a2 = a1 + (dashR / segs) * Math.PI * 2
          orbitGfx.arc(c.m.x, c.m.y, rad, a1, a2)
          orbitGfx.stroke({ width: 2.5, color: 0xffffff, alpha: alpha * 0.3 })
          orbitGfx.beginPath()
        }
        // Crisp pass
        for (let s = 0; s < segs; s++) {
          const a1 = (s / segs) * Math.PI * 2 + time * 0.04 * (ri + 1)
          const a2 = a1 + (dashR / segs) * Math.PI * 2
          orbitGfx.arc(c.m.x, c.m.y, rad, a1, a2)
          orbitGfx.stroke({ width: 0.5, color: 0xffffff, alpha })
          orbitGfx.beginPath()
        }
      }
    }

    // Nodes
    for (const n of allNodes) {
      n.angle += n.speed * dt
      const br = 1 + 0.04 * Math.sin(time * 0.8 + n.seed)
      n.ct.x = n.cx + Math.cos(n.angle) * n.radius
      n.ct.y = n.cy + Math.sin(n.angle) * n.radius * 0.88
      n.glow.scale.set(0.3 * br * 1.2)
    }

    // Meteors
    mTimer += dt
    if (mTimer > 2) { mTimer = 0; spawnMeteor() }
    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i]
      m._life -= dt * 0.7
      if (m._life <= 0) { scene.removeChild(m); m.destroy({ texture: false }); meteors.splice(i, 1); continue }
      m.x += m._vx; m.y += m._vy; m._vy += m._drift * dt
      m.alpha = m._life * 0.7
    }

    app.render()
  }
  tick()

  window.addEventListener('resize', () => app.renderer.resize(window.innerWidth, window.innerHeight))
}

main()
