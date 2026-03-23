import { Container, Graphics } from 'pixi.js'

/**
 * Nova collapse: session dies in a 3-phase cinematic.
 *
 * Phase 1 — IMPLOSION (0–0.35):  core rapidly contracts, bright ring squeezes inward,
 *            energy arcs spiral inward, everything crushes to a blinding point.
 *
 * Phase 2 — FLASH (0.35–0.5):   blinding white-hot detonation flash, 16 radial beams
 *            burst outward, then the light cuts off sharply.
 *
 * Phase 3 — STARBURST (0.5–1.0): shockwave ring expands outward, 32 particles scatter
 *            in a radial spray with trailing streaks, blue-white afterglow bloom fades.
 */
export class SessionEndEffect {
  container: Container
  private gfx: Graphics
  private progress: number = 0
  private time: number = 0
  private duration: number = 2.2

  // Random seeds for consistent particle paths across frames
  private seeds: number[] = []

  constructor() {
    this.container = new Container()
    this.gfx = new Graphics()
    this.container.addChild(this.gfx)

    for (let i = 0; i < 48; i++) {
      this.seeds.push(Math.random())
    }
  }

  tick(dt: number) {
    this.progress = Math.min(1, this.progress + dt / this.duration)
    this.time += dt
    this.gfx.clear()

    const p = this.progress

    // Phase 1: Implosion (0 – 0.35)
    if (p < 0.35) {
      this.drawImplosion(p / 0.35)
    }

    // Phase 2: Flash + beams (0.3 – 0.55) — overlaps slightly with implosion end
    if (p > 0.3 && p < 0.55) {
      this.drawFlash((p - 0.3) / 0.25)
    }

    // Phase 3: Starburst (0.5 – 1.0)
    if (p > 0.5) {
      this.drawStarburst((p - 0.5) / 0.5)
    }
  }

  // ── Phase 1: Implosion ─────────────────────────────────────────────

  private drawImplosion(p: number) {
    const eased = easeInCubic(p)
    const t = this.time

    // Bright contracting ring: starts wide, crushes inward
    const ringR = 80 * (1 - eased)
    const ringAlpha = (1 - eased * 0.6) * 0.85
    if (ringR > 1) {
      this.gfx.circle(0, 0, ringR)
        .stroke({ width: 2.5 * (1 - eased * 0.4), color: 0xA8C4F0, alpha: ringAlpha })
      // Inner rim, slightly smaller and brighter
      this.gfx.circle(0, 0, ringR * 0.85)
        .stroke({ width: 1, color: 0xD0E4FF, alpha: ringAlpha * 0.5 })
    }

    // 8 energy arcs spiraling inward
    const arcCount = 8
    for (let i = 0; i < arcCount; i++) {
      const seed = this.seeds[i]
      const baseAngle = (i / arcCount) * Math.PI * 2 + seed * 0.6
      const angle = baseAngle + t * (1.5 + eased * 4)
      const arcR = ringR * (0.5 + seed * 0.5)
      const arcLen = 0.4 + seed * 0.3
      const arcAlpha = (1 - eased) * (0.3 + seed * 0.2)

      if (arcAlpha > 0.01 && arcR > 2) {
        this.gfx.arc(0, 0, arcR, angle, angle + arcLen)
          .stroke({ width: 1.2, color: 0x7090D0, alpha: arcAlpha })
      }
    }

    // Core glow brightening as it implodes
    const coreR = 12 * (1 - eased * 0.8) + eased * 3
    const coreAlpha = eased * 0.9
    if (coreAlpha > 0.01) {
      this.gfx.circle(0, 0, coreR * 3).fill({ color: 0x6080C0, alpha: coreAlpha * 0.12 })
      this.gfx.circle(0, 0, coreR).fill({ color: 0xD0E0FF, alpha: coreAlpha * 0.5 })
      this.gfx.circle(0, 0, coreR * 0.4).fill({ color: 0xFFFFFF, alpha: coreAlpha })
    }

    // 12 small particles converging inward
    for (let i = 0; i < 12; i++) {
      const seed = this.seeds[i + 8]
      const angle = (i / 12) * Math.PI * 2 + seed * 0.4
      const r = ringR * (0.3 + seed * 0.7) * (1 - eased * 0.9)
      if (r < 2) continue
      const x = Math.cos(angle) * r
      const y = Math.sin(angle) * r
      const alpha = (1 - eased) * (0.3 + seed * 0.3)
      this.gfx.circle(x, y, 1.5).fill({ color: 0xA0C0E8, alpha })
    }
  }

  // ── Phase 2: Flash + radial beams ─────────────────────────────────

  private drawFlash(p: number) {
    const eased = easeOutCubic(p)
    const flashPeak = p < 0.3 ? p / 0.3 : 1 - (p - 0.3) / 0.7 // rise then fall

    // Blinding white-blue flash core
    const flashAlpha = flashPeak * flashPeak
    if (flashAlpha > 0.01) {
      this.gfx.circle(0, 0, 5 + eased * 20).fill({ color: 0xFFFFFF, alpha: flashAlpha })
      this.gfx.circle(0, 0, 15 + eased * 40).fill({ color: 0xD0E8FF, alpha: flashAlpha * 0.4 })
      this.gfx.circle(0, 0, 30 + eased * 70).fill({ color: 0x8AAAD8, alpha: flashAlpha * 0.12 })
    }

    // 16 radial beams erupting outward, fading as flash dims
    const beamCount = 16
    const beamAlphaBase = flashPeak * 0.7
    if (beamAlphaBase > 0.01) {
      for (let i = 0; i < beamCount; i++) {
        const seed = this.seeds[i + 20]
        const angle = (i / beamCount) * Math.PI * 2 + seed * 0.25
        const beamLen = eased * (60 + seed * 80)
        const width = (2 + seed * 2) * (1 - p * 0.6)
        const alpha = beamAlphaBase * (0.6 + seed * 0.4)

        if (beamLen > 2 && alpha > 0.01) {
          const ex = Math.cos(angle) * beamLen
          const ey = Math.sin(angle) * beamLen
          this.gfx.moveTo(0, 0).lineTo(ex, ey)
            .stroke({ width: width * 0.3, color: 0xFFFFFF, alpha: alpha * 0.8 })
          this.gfx.moveTo(0, 0).lineTo(ex, ey)
            .stroke({ width, color: 0x90B8FF, alpha: alpha * 0.35 })
        }
      }
    }
  }

  // ── Phase 3: Starburst ─────────────────────────────────────────────

  private drawStarburst(p: number) {
    const eased = easeOutQuad(p)

    // Primary shockwave ring
    const shockR = eased * 160
    const shockAlpha = (1 - p) * 0.6
    if (shockAlpha > 0.01 && shockR > 1) {
      this.gfx.circle(0, 0, shockR)
        .stroke({ width: 3 * (1 - p * 0.7), color: 0xA0C0FF, alpha: shockAlpha })
      this.gfx.circle(0, 0, shockR * 0.97)
        .stroke({ width: 1, color: 0xFFFFFF, alpha: shockAlpha * 0.3 })
    }

    // Secondary delayed ring
    if (p > 0.2) {
      const p2 = (p - 0.2) / 0.8
      const r2 = easeOutQuad(p2) * 130
      const a2 = (1 - p2) * 0.25
      if (a2 > 0.01 && r2 > 1) {
        this.gfx.circle(0, 0, r2)
          .stroke({ width: 1.5 * (1 - p2 * 0.5), color: 0x7090C8, alpha: a2 })
      }
    }

    // 32 particles scattering outward
    const particleCount = 32
    for (let i = 0; i < particleCount; i++) {
      const seed = this.seeds[i % this.seeds.length]
      const seed2 = this.seeds[(i + 16) % this.seeds.length]
      const angle = (i / particleCount) * Math.PI * 2 + seed * 0.5
      const speed = 0.5 + seed * 0.9
      const r = easeOutCubic(Math.min(1, p * speed)) * (90 + seed2 * 80)
      const alpha = (1 - p) * (0.5 + seed * 0.3)
      const size = 0.8 + seed * 1.8

      if (alpha > 0.02 && r > 2) {
        const x = Math.cos(angle) * r
        const y = Math.sin(angle) * r

        // Vary color through blue-white spectrum
        const colors = [0xC0D8FF, 0x90B4F0, 0xD8E8FF, 0xFFFFFF, 0x7090D8]
        const color = colors[i % colors.length]

        this.gfx.circle(x, y, size * 2.5).fill({ color, alpha: alpha * 0.12 })
        this.gfx.circle(x, y, size).fill({ color: 0xFFFFFF, alpha: alpha * 0.7 })

        // Radial streak trailing behind
        if (alpha > 0.1) {
          const trailLen = size * 10 * (1 - p * 0.4)
          const tx = x - Math.cos(angle) * trailLen
          const ty = y - Math.sin(angle) * trailLen
          this.gfx.moveTo(x, y).lineTo(tx, ty)
            .stroke({ width: 0.6, color, alpha: alpha * 0.4 })
        }
      }
    }

    // Afterglow bloom fading at center
    const glowAlpha = (1 - p) * (1 - p) * 0.4
    if (glowAlpha > 0.01) {
      this.gfx.circle(0, 0, 50).fill({ color: 0x6080C0, alpha: glowAlpha * 0.2 })
      this.gfx.circle(0, 0, 20).fill({ color: 0xA0C0FF, alpha: glowAlpha * 0.5 })
      this.gfx.circle(0, 0, 6).fill({ color: 0xFFFFFF, alpha: glowAlpha })
    }
  }

  isDone(): boolean {
    return this.progress >= 1
  }

  destroy() {
    this.gfx.destroy()
    this.container.destroy()
  }
}

// ─── Easing functions ──────────────────────────────────────────────────────

function easeInCubic(t: number): number { return t * t * t }
function easeOutQuad(t: number): number { return 1 - (1 - t) * (1 - t) }
function easeOutCubic(t: number): number { return 1 - (1 - t) ** 3 }
