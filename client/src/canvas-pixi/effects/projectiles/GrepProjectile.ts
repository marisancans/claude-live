import { Graphics } from 'pixi.js'
import type { Point } from '../../../utils/spline'
import { ProjectileObject } from './ProjectileObject'

function eio(t: number) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t }
function rng(s: number) { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x) }

/**
 * Grep tool projectile: shotgun blast with 16 pellets in a forward cone.
 *
 * Muzzle flash at origin, pellets fan out toward the target with varying
 * speeds, delays, sizes, and short motion trails.  Deterministic pseudo-random
 * via rng() so the pattern is stable across frames.
 */
export class GrepProjectile extends ProjectileObject {
  color: number
  graphics: Graphics
  private mainAngle: number
  private fullDist: number

  constructor(startPos: Point, endPos: Point, color: number, inbound: boolean = false, duration: number = 0.8) {
    super(startPos, endPos, duration)
    this.color = color

    this.graphics = new Graphics()
    // Container fixed at startPos (core); all pellets drawn as offsets
    this.container.position.set(startPos.x, startPos.y)
    this.container.addChild(this.graphics)

    // Pre-compute direction toward target
    this.mainAngle = Math.atan2(endPos.y - startPos.y, endPos.x - startPos.x)
    this.fullDist = Math.hypot(endPos.x - startPos.x, endPos.y - startPos.y)
  }

  tick(dt: number) {
    this.progress = Math.min(1, this.progress + dt / this.duration)
    const g = this.graphics
    g.clear()

    const c = this.color
    const e = eio(Math.min(this.progress, 1))
    const PELLETS = 16
    const SPREAD = 0.65

    // ── Muzzle flash at origin (progress < 0.18) ──
    if (e < 0.18) {
      const flash = 1 - e / 0.18
      // Large fading circle
      g.circle(0, 0, 36)
      g.fill({ color: c, alpha: flash * 0.45 })
      // Brighter core
      g.circle(0, 0, 12)
      g.fill({ color: c, alpha: flash * 0.7 })
    }

    // ── 16 pellets with cone spread ──
    for (let i = 0; i < PELLETS; i++) {
      const spreadFrac = (i / (PELLETS - 1)) * 2 - 1
      const ang = this.mainAngle + spreadFrac * SPREAD + (rng(i * 2.3 + 1) - 0.5) * 0.2
      const speedMult = 0.65 + rng(i * 3.7 + 2) * 0.45
      const delay = rng(i * 1.3 + 0.5) * 0.06
      const pe = Math.min(1, Math.max(0, (e - delay) / (1 - delay)) * speedMult)
      if (pe <= 0) continue

      const dist = pe * this.fullDist
      // Pellet position as offset from container origin (startPos)
      const pelletX = Math.cos(ang) * dist
      const pelletY = Math.sin(ang) * dist

      // Alpha fading with distance and spread
      const alpha = (1 - pe * 0.8) * (0.9 - Math.abs(spreadFrac) * 0.25)
      // Variable size
      const sz = (1 - pe * 0.55) * (1.6 + rng(i * 5.1 + 3) * 1.4)

      // Short motion trail behind pellet
      const trailDist = Math.max(0, dist - this.fullDist * 0.09)
      const trailX = Math.cos(ang) * trailDist
      const trailY = Math.sin(ang) * trailDist
      g.moveTo(trailX, trailY)
      g.lineTo(pelletX, pelletY)
      g.stroke({ width: sz * 0.5, color: c, alpha: alpha * 0.5 })

      // Pellet dot
      g.circle(pelletX, pelletY, sz)
      g.fill({ color: c, alpha })
    }
  }
}
