// Galactic ambient background — stars, shooting stars, nebula glow

interface Star {
  x: number; y: number
  size: number
  brightness: number
  twinkleSpeed: number
  twinklePhase: number
}

interface ShootingStar {
  x: number; y: number
  vx: number; vy: number
  life: number
  maxLife: number
  length: number
  brightness: number
}

interface Asteroid {
  x: number; y: number
  vx: number; vy: number
  size: number
  rotation: number
  rotSpeed: number
  brightness: number
}

let stars: Star[] = []
let shootingStars: ShootingStar[] = []
let asteroids: Asteroid[] = []
let initialized = false
let lastW = 0, lastH = 0

function init(W: number, H: number) {
  stars = []
  const count = Math.floor((W * H) / 2800)
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * W,
      y: Math.random() * H,
      size: Math.random() * 1.3 + 0.3,
      brightness: Math.random() * 0.6 + 0.1,
      twinkleSpeed: 0.1 + Math.random() * 0.5,
      twinklePhase: Math.random() * Math.PI * 2,
    })
  }

  asteroids = []
  for (let i = 0; i < 2; i++) {
    asteroids.push({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.02,
      vy: (Math.random() - 0.5) * 0.015,
      size: 1.2 + Math.random() * 1.8,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.008,
      brightness: 0.12 + Math.random() * 0.12,
    })
  }

  shootingStars = []
  lastW = W; lastH = H
  initialized = true
}

export function drawBackground(ctx: CanvasRenderingContext2D, W: number, H: number, t: number) {
  if (!initialized || W !== lastW || H !== lastH) init(W, H)

  // ── Subtle nebula glow (very slow color shift) ──
  const nebR = Math.sin(t * 0.04) * 20 + 15
  const nebG = Math.sin(t * 0.025 + 1.5) * 15 + 10
  const nebB = Math.sin(t * 0.035 + 3.0) * 25 + 30
  const ng1 = ctx.createRadialGradient(W * 0.3, H * 0.4, 0, W * 0.3, H * 0.4, W * 0.5)
  ng1.addColorStop(0, `rgba(${Math.floor(nebR)},${Math.floor(nebG)},${Math.floor(nebB)},0.025)`)
  ng1.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = ng1; ctx.fillRect(0, 0, W, H)

  const ng2 = ctx.createRadialGradient(W * 0.75, H * 0.65, 0, W * 0.75, H * 0.65, W * 0.4)
  const nebR2 = Math.sin(t * 0.03 + 2) * 18 + 12
  const nebG2 = Math.sin(t * 0.02 + 0.7) * 12 + 18
  const nebB2 = Math.sin(t * 0.045 + 4.2) * 15 + 20
  ng2.addColorStop(0, `rgba(${Math.floor(nebR2)},${Math.floor(nebG2)},${Math.floor(nebB2)},0.02)`)
  ng2.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = ng2; ctx.fillRect(0, 0, W, H)

  // ── Starfield with subtle lens-flare crosses ──
  for (const s of stars) {
    const twinkle = 0.7 + 0.3 * Math.sin(t * s.twinkleSpeed * 0.3 + s.twinklePhase)
    const al = s.brightness * twinkle
    if (al < 0.03) continue
    // Core dot
    ctx.beginPath()
    ctx.arc(s.x, s.y, s.size * 0.7, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(220,225,240,${al})`
    ctx.fill()
    // Lens-flare cross (subtle spikes for brighter stars)
    if (s.size > 0.8) {
      const spike = s.size * 2.2
      const sa = al * 0.35
      ctx.strokeStyle = `rgba(220,230,255,${sa})`
      ctx.lineWidth = 0.4
      ctx.beginPath(); ctx.moveTo(s.x - spike, s.y); ctx.lineTo(s.x + spike, s.y); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(s.x, s.y - spike); ctx.lineTo(s.x, s.y + spike); ctx.stroke()
    }
  }

  // ── Asteroids (small drifting rocks) ──
  for (const a of asteroids) {
    a.x += a.vx; a.y += a.vy; a.rotation += a.rotSpeed
    if (a.x < -20) a.x = W + 20
    if (a.x > W + 20) a.x = -20
    if (a.y < -20) a.y = H + 20
    if (a.y > H + 20) a.y = -20
    ctx.save()
    ctx.translate(a.x, a.y)
    ctx.rotate(a.rotation)
    ctx.beginPath()
    // Irregular shape (pentagon-ish)
    for (let v = 0; v < 5; v++) {
      const ang = (v / 5) * Math.PI * 2
      const r = a.size * (0.7 + Math.sin(v * 2.3 + a.rotation * 0.3) * 0.3)
      v === 0 ? ctx.moveTo(Math.cos(ang) * r, Math.sin(ang) * r)
              : ctx.lineTo(Math.cos(ang) * r, Math.sin(ang) * r)
    }
    ctx.closePath()
    ctx.fillStyle = `rgba(140,135,150,${a.brightness})`
    ctx.fill()
    ctx.restore()
  }

  // ── Shooting stars (spawn randomly) ──
  if (Math.random() < 0.003) {
    const edge = Math.random()
    let sx: number, sy: number
    if (edge < 0.5) { sx = Math.random() * W; sy = -10 }
    else { sx = W + 10; sy = Math.random() * H * 0.6 }
    const angle = Math.PI * 0.6 + Math.random() * 0.5
    const speed = 2 + Math.random() * 3
    shootingStars.push({
      x: sx, y: sy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1.0,
      maxLife: 0.8 + Math.random() * 0.6,
      length: 30 + Math.random() * 50,
      brightness: 0.3 + Math.random() * 0.4,
    })
  }

  for (let i = shootingStars.length - 1; i >= 0; i--) {
    const ss = shootingStars[i]
    ss.x += ss.vx; ss.y += ss.vy
    ss.life -= 0.016 / ss.maxLife
    if (ss.life <= 0 || ss.x < -100 || ss.x > W + 100 || ss.y > H + 100) {
      shootingStars.splice(i, 1); continue
    }
    const al = ss.brightness * Math.min(1, ss.life * 3) * Math.min(1, (1 - ss.life) * 4)
    const tailX = ss.x - (ss.vx / Math.hypot(ss.vx, ss.vy)) * ss.length
    const tailY = ss.y - (ss.vy / Math.hypot(ss.vx, ss.vy)) * ss.length
    const grad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y)
    grad.addColorStop(0, `rgba(200,210,240,0)`)
    grad.addColorStop(1, `rgba(200,210,240,${al})`)
    ctx.beginPath(); ctx.moveTo(tailX, tailY); ctx.lineTo(ss.x, ss.y)
    ctx.strokeStyle = grad; ctx.lineWidth = 1.0; ctx.stroke()
    ctx.beginPath(); ctx.arc(ss.x, ss.y, 1.2, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(240,245,255,${al})`; ctx.fill()
  }
}
