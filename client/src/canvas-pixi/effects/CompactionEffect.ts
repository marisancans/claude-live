import { Container, Graphics } from 'pixi.js'

/**
 * COMPACTION: a cinematic 3-phase event.
 *
 * Phase 1 — GRAVITY WELL (0–0.35):  spiral arms pull inward, dark vortex grows,
 *           orbiting debris streams, everything accelerates toward the center.
 *
 * Phase 2 — SINGULARITY (0.35–0.55): blinding implosion squeeze, chromatic flash,
 *           rings implode violently, everything goes dark for a beat.
 *
 * Phase 3 — SUPERNOVA (0.55–1.0):  massive white-gold detonation, shockwave rings,
 *           radial particle shower, energy filaments, afterglow bloom.
 */
export class CompactionEffect {
  container: Container
  private gfx: Graphics
  private phase: 'implosion' | 'rebirth'
  private progress: number = 0
  private duration: number
  private coreRadius: number
  private maxRadius: number = 250
  private time: number = 0

  // Cached random seeds for consistent particle paths
  private seeds: number[] = []
  private spiralSeeds: number[] = []

  constructor(phase: 'implosion' | 'rebirth', coreRadius: number) {
    this.phase = phase
    this.coreRadius = coreRadius
    // Implosion: long dramatic build.  Rebirth: explosive release.
    this.duration = phase === 'implosion' ? 3.5 : 2.5

    this.container = new Container()
    this.gfx = new Graphics()
    this.container.addChild(this.gfx)

    // Pre-generate random seeds for 64 particles + 6 spiral arms
    for (let i = 0; i < 64; i++) {
      this.seeds.push(Math.random())
    }
    for (let i = 0; i < 6; i++) {
      this.spiralSeeds.push(Math.random())
    }
  }

  tick(dt: number) {
    this.progress = Math.min(1, this.progress + dt / this.duration)
    this.time += dt
    this.gfx.clear()
    if (this.phase === 'implosion') {
      this.drawImplosion()
    } else {
      this.drawRebirth()
    }
  }

  // ─── IMPLOSION: gravitational collapse ─────────────────────────────

  private drawImplosion() {
    const p = this.progress
    const t = this.time

    // Phase 1: Gravity well & spiral arms (0 – 0.65)
    if (p < 0.65) {
      this.drawGravityWell(p / 0.65, t)
    }

    // Phase 2: Singularity squeeze (0.5 – 0.85)
    if (p > 0.5 && p < 0.85) {
      this.drawSingularity((p - 0.5) / 0.35, t)
    }

    // Phase 3: Final collapse flash (0.8 – 1.0)
    if (p > 0.8) {
      this.drawCollapseFlash((p - 0.8) / 0.2)
    }
  }

  /**
   * Swirling spiral arms pulling debris inward, growing dark vortex.
   */
  private drawGravityWell(p: number, t: number) {
    const eased = easeInCubic(p)

    // ── Dark gravity vortex at center ──
    const wellR = this.coreRadius * (1 + eased * 8)
    const wellAlpha = eased * 0.55
    // Multiple concentric dark layers for depth
    this.gfx.circle(0, 0, wellR * 1.3).fill({ color: 0x020408, alpha: wellAlpha * 0.3 })
    this.gfx.circle(0, 0, wellR).fill({ color: 0x040810, alpha: wellAlpha * 0.6 })
    this.gfx.circle(0, 0, wellR * 0.5).fill({ color: 0x000204, alpha: wellAlpha * 0.9 })

    // ── 6 spiral arms (logarithmic spirals collapsing inward) ──
    const armCount = 6
    const armColor = 0x7090D0
    for (let a = 0; a < armCount; a++) {
      const baseAngle = (a / armCount) * Math.PI * 2 + this.spiralSeeds[a] * 0.5
      const spin = t * (1.2 + eased * 3) // accelerating spin
      const armAlpha = (0.15 + eased * 0.35) * (1 - a * 0.04)

      // Draw spiral as connected line segments
      const segments = 40
      let prevX = 0, prevY = 0
      let started = false
      for (let s = 0; s < segments; s++) {
        const frac = s / segments
        // Spiral radius: starts at maxRadius, collapses inward with progress
        const spiralR = this.maxRadius * (1 - eased * 0.7) * (1 - frac * 0.85)
        if (spiralR < 3) break
        // Angle wraps more as we go inward (logarithmic feel)
        const angle = baseAngle + spin + frac * (3 + eased * 5)
        const x = Math.cos(angle) * spiralR
        const y = Math.sin(angle) * spiralR
        const segAlpha = armAlpha * (1 - frac * 0.6)

        if (started && segAlpha > 0.01) {
          this.gfx.moveTo(prevX, prevY).lineTo(x, y)
            .stroke({ width: 1.5 * (1 - frac * 0.5), color: armColor, alpha: segAlpha })
        }
        prevX = x
        prevY = y
        started = true
      }
    }

    // ── Debris particles spiraling inward ──
    const debrisCount = 32
    for (let i = 0; i < debrisCount; i++) {
      const seed = this.seeds[i]
      const angle = seed * Math.PI * 2 + t * (0.8 + seed * 2 + eased * 4)
      const baseR = this.maxRadius * (0.3 + seed * 0.7)
      const r = baseR * (1 - eased * (0.6 + seed * 0.35))
      if (r < 2) continue

      const x = Math.cos(angle) * r
      const y = Math.sin(angle) * r
      const alpha = (0.2 + eased * 0.5) * (1 - i / debrisCount * 0.4)
      const size = 1 + seed * 1.5

      // Particle glow
      this.gfx.circle(x, y, size * 2).fill({ color: armColor, alpha: alpha * 0.2 })
      // Particle core
      this.gfx.circle(x, y, size).fill({ color: 0xD0DDFF, alpha: alpha })

      // Short inward streak behind each particle
      if (alpha > 0.08) {
        const streakAngle = angle + Math.PI // opposite direction = trailing
        const sx = x + Math.cos(streakAngle) * size * 6
        const sy = y + Math.sin(streakAngle) * size * 6
        this.gfx.moveTo(x, y).lineTo(sx, sy)
          .stroke({ width: 0.6, color: 0x8AAAD0, alpha: alpha * 0.5 })
      }
    }

    // ── Concentric collapsing rings (7 of them, staggered) ──
    for (let i = 0; i < 7; i++) {
      const stagger = i * 0.08
      const ringP = Math.max(0, Math.min(1, (p - stagger) / (1 - stagger)))
      const startR = this.maxRadius * (0.3 + i * 0.1)
      const currentR = startR * (1 - easeInQuad(ringP))
      const alpha = (1 - ringP) * (0.25 + eased * 0.15)

      if (alpha > 0.01 && currentR > 2) {
        this.gfx.circle(0, 0, currentR)
          .stroke({ width: 0.8 + eased * 0.5, color: 0xA0B8E0, alpha })
      }
    }

    // ── Event horizon rim glow (appears mid-way) ──
    if (eased > 0.3) {
      const rimP = (eased - 0.3) / 0.7
      const rimR = this.coreRadius * (2 + rimP * 3)
      const rimAlpha = rimP * 0.4
      // Hot blue-white rim
      this.gfx.circle(0, 0, rimR).stroke({ width: 2 + rimP * 2, color: 0x80B0FF, alpha: rimAlpha })
      // Inner bright edge
      this.gfx.circle(0, 0, rimR * 0.85).stroke({ width: 1, color: 0xC0D8FF, alpha: rimAlpha * 0.6 })
    }
  }

  /**
   * Violent squeeze — everything crushes to a point.
   */
  private drawSingularity(p: number, t: number) {
    const eased = easeInOutQuad(p)

    // Intense bright ring contracting rapidly
    const squeezeR = this.coreRadius * (6 - eased * 5.5)
    const squeezeAlpha = 0.5 + eased * 0.4
    this.gfx.circle(0, 0, squeezeR)
      .stroke({ width: 3 - eased * 2, color: 0xE0EEFF, alpha: squeezeAlpha })

    // Chromatic aberration rings (red, green, blue offset)
    const chromaticColors = [0xFF6060, 0x60FF60, 0x6060FF]
    for (let c = 0; c < 3; c++) {
      const offset = (c - 1) * (2 + eased * 4)
      const cr = squeezeR + offset
      if (cr > 1) {
        this.gfx.circle(0, 0, cr)
          .stroke({ width: 1, color: chromaticColors[c], alpha: squeezeAlpha * 0.15 })
      }
    }

    // 16 fast inward streaks converging on center
    const streakCount = 16
    for (let i = 0; i < streakCount; i++) {
      const angle = (i / streakCount) * Math.PI * 2 + t * 5
      const outerR = squeezeR * 1.5
      const innerR = squeezeR * 0.2 * (1 - eased)
      const alpha = squeezeAlpha * 0.4
      if (alpha > 0.01 && outerR > innerR) {
        const ox = Math.cos(angle) * outerR
        const oy = Math.sin(angle) * outerR
        const ix = Math.cos(angle) * innerR
        const iy = Math.sin(angle) * innerR
        this.gfx.moveTo(ox, oy).lineTo(ix, iy)
          .stroke({ width: 1.5 * (1 - eased * 0.5), color: 0xD0E0FF, alpha })
      }
    }

    // Central bright point getting brighter
    const pointAlpha = eased * 0.9
    this.gfx.circle(0, 0, this.coreRadius * 0.5)
      .fill({ color: 0xFFFFFF, alpha: pointAlpha })
    this.gfx.circle(0, 0, this.coreRadius * 1.5)
      .fill({ color: 0xE0F0FF, alpha: pointAlpha * 0.3 })
  }

  /**
   * Final dark collapse — everything goes to black, tiny white point remains.
   */
  private drawCollapseFlash(p: number) {
    const eased = easeOutQuad(p)

    // Dark sphere expands and swallows everything
    const darkR = this.maxRadius * (0.3 + eased * 0.8)
    const darkAlpha = (1 - eased) * 0.6
    this.gfx.circle(0, 0, darkR).fill({ color: 0x000000, alpha: darkAlpha })

    // Tiny brilliant white point that dims
    const pointBright = (1 - eased) * 1.0
    if (pointBright > 0.05) {
      this.gfx.circle(0, 0, 2).fill({ color: 0xFFFFFF, alpha: pointBright })
      this.gfx.circle(0, 0, 8).fill({ color: 0xC0D8FF, alpha: pointBright * 0.2 })
    }
  }

  // ─── REBIRTH: supernova detonation ─────────────────────────────────

  private drawRebirth() {
    const p = this.progress
    const t = this.time

    // Phase 1: Core ignition (0 – 0.2)
    if (p < 0.2) {
      this.drawIgnition(p / 0.2)
    }

    // Phase 2: Detonation blast (0.1 – 0.6)
    if (p > 0.1 && p < 0.6) {
      this.drawDetonation((p - 0.1) / 0.5, t)
    }

    // Phase 3: Shockwave + particle shower (0.2 – 1.0)
    if (p > 0.2) {
      this.drawShockwave((p - 0.2) / 0.8, t)
    }

    // Phase 4: Afterglow bloom (0.5 – 1.0)
    if (p > 0.5) {
      this.drawAfterglow((p - 0.5) / 0.5)
    }
  }

  /**
   * Core ignition: blinding white flash erupting from the singularity point.
   */
  private drawIgnition(p: number) {
    const eased = easeOutQuart(p)

    // Multiple concentric flash layers (inside out)
    const flashLayers = [
      { r: 3, color: 0xFFFFFF, alpha: 0.7 },
      { r: 12, color: 0xFFFFF0, alpha: 0.6 },
      { r: 25, color: 0xFFF8E0, alpha: 0.4 },
      { r: 50, color: 0xFFE8B0, alpha: 0.2 },
      { r: 80, color: 0xFFD080, alpha: 0.08 },
    ]

    for (const layer of flashLayers) {
      const r = layer.r * eased
      const alpha = layer.alpha * (1 - p * 0.3) // Sustain brightness
      if (alpha > 0.01 && r > 0.5) {
        this.gfx.circle(0, 0, r).fill({ color: layer.color, alpha })
      }
    }
  }

  /**
   * Detonation blast: radial energy beams + expanding fire rings.
   */
  private drawDetonation(p: number, t: number) {
    const eased = easeOutCubic(p)

    // ── 16 radial energy beams (wide, bright, tapering) ──
    const beamCount = 16
    for (let i = 0; i < beamCount; i++) {
      const seed = this.seeds[i + 32]
      const angle = (i / beamCount) * Math.PI * 2 + seed * 0.3
      const beamLen = eased * this.maxRadius * (1.2 + seed * 0.5)
      const beamAlpha = (1 - p) * (0.5 + seed * 0.2)
      const width = (3 + seed * 2) * (1 - p * 0.6)

      if (beamAlpha > 0.01 && beamLen > 2) {
        const ex = Math.cos(angle) * beamLen
        const ey = Math.sin(angle) * beamLen
        // Hot core of beam (white)
        this.gfx.moveTo(0, 0).lineTo(ex, ey)
          .stroke({ width: width * 0.3, color: 0xFFFFFF, alpha: beamAlpha * 0.6 })
        // Warm outer glow of beam
        this.gfx.moveTo(0, 0).lineTo(ex, ey)
          .stroke({ width, color: 0xFFD060, alpha: beamAlpha * 0.4 })
      }
    }

    // ── 3 expanding fire rings (staggered) ──
    for (let i = 0; i < 3; i++) {
      const stagger = i * 0.15
      const ringP = Math.max(0, Math.min(1, (p - stagger) / (1 - stagger)))
      const ringR = easeOutQuad(ringP) * this.maxRadius * (1 + i * 0.15)
      const ringAlpha = (1 - ringP) * (0.6 - i * 0.12)
      const width = (4 - i) * (1 - ringP * 0.5)
      const color = i === 0 ? 0xFFE080 : i === 1 ? 0xFFB040 : 0xFF8020

      if (ringAlpha > 0.01 && ringR > 1) {
        this.gfx.circle(0, 0, ringR).stroke({ width, color, alpha: ringAlpha })
      }
    }

    // ── Central sustained glow ──
    const glowR = this.coreRadius * (2 + eased * 5)
    const glowAlpha = (1 - p) * 0.5
    if (glowAlpha > 0.01) {
      this.gfx.circle(0, 0, glowR).fill({ color: 0xFFF8E0, alpha: glowAlpha * 0.3 })
      this.gfx.circle(0, 0, glowR * 0.4).fill({ color: 0xFFFFFF, alpha: glowAlpha * 0.6 })
    }
  }

  /**
   * Expanding shockwave with particle shower and energy filaments.
   */
  private drawShockwave(p: number, t: number) {
    const eased = easeOutQuad(p)

    // ── Primary shockwave ring (thick, bright) ──
    const shockR = eased * this.maxRadius * 1.8
    const shockAlpha = (1 - p) * 0.65
    if (shockAlpha > 0.01 && shockR > 1) {
      const width = 5 * (1 - p * 0.7)
      this.gfx.circle(0, 0, shockR)
        .stroke({ width, color: 0xFFE0A0, alpha: shockAlpha })
      // Thin inner edge (white-hot)
      this.gfx.circle(0, 0, shockR * 0.98)
        .stroke({ width: 1, color: 0xFFFFFF, alpha: shockAlpha * 0.4 })
    }

    // ── Secondary shockwave (delayed, dimmer) ──
    if (p > 0.15) {
      const p2 = (p - 0.15) / 0.85
      const r2 = easeOutQuad(p2) * this.maxRadius * 1.5
      const a2 = (1 - p2) * 0.3
      if (a2 > 0.01 && r2 > 1) {
        this.gfx.circle(0, 0, r2)
          .stroke({ width: 2 * (1 - p2 * 0.5), color: 0xD0A060, alpha: a2 })
      }
    }

    // ── 48 particle shower (radial spray with varied speeds) ──
    const particleCount = 48
    for (let i = 0; i < particleCount; i++) {
      const seed = this.seeds[i]
      const angle = (i / particleCount) * Math.PI * 2 + seed * 0.5
      const speed = 0.6 + seed * 0.8
      const particleR = easeOutCubic(Math.min(1, p * speed)) * this.maxRadius * (1.2 + seed * 0.6)
      const particleAlpha = (1 - p) * (0.4 + seed * 0.3)
      const size = 0.8 + seed * 1.5

      if (particleAlpha > 0.02 && particleR > 2) {
        const x = Math.cos(angle) * particleR
        const y = Math.sin(angle) * particleR

        // Color varies: warm spectrum
        const colors = [0xFFE0A0, 0xFFD070, 0xFFC040, 0xFFFFD0, 0xFFFFFF]
        const color = colors[i % colors.length]

        // Glow
        this.gfx.circle(x, y, size * 3).fill({ color, alpha: particleAlpha * 0.15 })
        // Core
        this.gfx.circle(x, y, size).fill({ color: 0xFFFFFF, alpha: particleAlpha * 0.7 })

        // Short radial streak trailing behind
        if (particleAlpha > 0.08) {
          const trailLen = size * 8 * (1 - p * 0.5)
          const tx = x - Math.cos(angle) * trailLen
          const ty = y - Math.sin(angle) * trailLen
          this.gfx.moveTo(x, y).lineTo(tx, ty)
            .stroke({ width: 0.5, color, alpha: particleAlpha * 0.4 })
        }
      }
    }

    // ── Energy filaments (curved tendrils expanding outward) ──
    if (p < 0.7) {
      const filCount = 8
      for (let i = 0; i < filCount; i++) {
        const seed = this.spiralSeeds[i % 6]
        const baseAngle = (i / filCount) * Math.PI * 2
        const filAlpha = (1 - p / 0.7) * 0.3

        if (filAlpha > 0.01) {
          const segs = 20
          let px = 0, py = 0
          for (let s = 1; s <= segs; s++) {
            const frac = s / segs
            const filR = easeOutQuad(p) * this.maxRadius * frac * 1.1
            // Sinusoidal wobble
            const wobble = Math.sin(frac * 6 + t * 3 + seed * 10) * 15 * frac
            const angle = baseAngle + wobble / filR
            const nx = Math.cos(angle) * filR
            const ny = Math.sin(angle) * filR

            if (s > 1 && filR > 2) {
              this.gfx.moveTo(px, py).lineTo(nx, ny)
                .stroke({ width: 1 * (1 - frac * 0.5), color: 0xFFD080, alpha: filAlpha * (1 - frac * 0.5) })
            }
            px = nx
            py = ny
          }
        }
      }
    }
  }

  /**
   * Afterglow: soft warm bloom that slowly fades, leaving the cluster reborn.
   */
  private drawAfterglow(p: number) {
    const fadeAlpha = (1 - p) * (1 - p) // Quadratic fade

    // Warm ambient glow
    const glowR = this.maxRadius * 0.4
    if (fadeAlpha > 0.01) {
      this.gfx.circle(0, 0, glowR * 1.5).fill({ color: 0xFFD060, alpha: fadeAlpha * 0.06 })
      this.gfx.circle(0, 0, glowR).fill({ color: 0xFFE890, alpha: fadeAlpha * 0.1 })
      this.gfx.circle(0, 0, glowR * 0.4).fill({ color: 0xFFF8D0, alpha: fadeAlpha * 0.15 })
      this.gfx.circle(0, 0, this.coreRadius * 2).fill({ color: 0xFFFFFF, alpha: fadeAlpha * 0.2 })
    }

    // Pulsing remnant ring
    if (fadeAlpha > 0.03) {
      const pulseR = this.coreRadius * (4 + Math.sin(this.time * 4) * 0.5)
      this.gfx.circle(0, 0, pulseR)
        .stroke({ width: 1, color: 0xFFE0A0, alpha: fadeAlpha * 0.25 })
    }
  }

  isDone(): boolean {
    return this.progress >= 1
  }

  destroy() {
    this.gfx.destroy()
    this.container.destroy({ children: true })
  }
}

// ─── Easing functions ────────────────────────────────────────────────

function easeInQuad(t: number): number { return t * t }
function easeOutQuad(t: number): number { return 1 - (1 - t) * (1 - t) }
function easeInCubic(t: number): number { return t * t * t }
function easeOutCubic(t: number): number { return 1 - (1 - t) ** 3 }
function easeInOutQuad(t: number): number { return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2 }
function easeOutQuart(t: number): number { return 1 - (1 - t) ** 4 }
