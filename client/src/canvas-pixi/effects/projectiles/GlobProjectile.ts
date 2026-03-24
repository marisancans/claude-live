import { Graphics } from 'pixi.js'
import type { Point } from '../../../utils/spline'
import { ProjectileObject } from './ProjectileObject'

function eio(t: number) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t }
function rng(s: number) { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x) }

/**
 * Glob tool projectile: net cast with 12 particles arcing outward then
 * reconverging at the target.
 *
 * Each particle follows a sinusoidal arc perpendicular to the straight line
 * from start to end, with a faint tether line back to the "spine".
 * Lead bead at the head, arrival flash ring at 82%+ progress.
 */
export class GlobProjectile extends ProjectileObject {
  color: number
  graphics: Graphics
  // Direction vectors (pre-computed)
  private dx: number
  private dy: number
  private nx: number  // perpendicular unit normal x
  private ny: number  // perpendicular unit normal y

  constructor(startPos: Point, endPos: Point, color: number, inbound: boolean = false, duration: number = 0.8) {
    super(startPos, endPos, duration)
    this.color = color

    this.graphics = new Graphics()
    // Container at (0,0) — draw everything in world coordinates as offsets from origin
    this.container.position.set(0, 0)
    this.container.addChild(this.graphics)

    // Pre-compute direction and perpendicular
    this.dx = endPos.x - startPos.x
    this.dy = endPos.y - startPos.y
    const len = Math.hypot(this.dx, this.dy) || 1
    this.nx = -this.dy / len
    this.ny = this.dx / len
  }

  tick(dt: number) {
    this.progress = Math.min(1, this.progress + dt / this.duration)
    const g = this.graphics
    g.clear()

    // Recompute direction from live positions (may be updated by syncTarget)
    this.dx = this.endPos.x - this.startPos.x
    this.dy = this.endPos.y - this.startPos.y
    const len = Math.hypot(this.dx, this.dy) || 1
    this.nx = -this.dy / len
    this.ny = this.dx / len

    const c = this.color
    const e = eio(Math.min(this.progress, 1))
    const sx = this.startPos.x
    const sy = this.startPos.y
    const N = 12

    // ── 12 arcing particles ──
    for (let i = 0; i < N; i++) {
      const scatter = (rng(i * 2.1 + 0.3) - 0.5) * 2 * 70
      const delay = rng(i * 1.7 + 0.9) * 0.07
      const pe = Math.min(1, Math.max(0, (e - delay) / (1 - delay)))
      if (pe <= 0) continue

      // Sinusoidal arc perpendicular to the main line
      const arc = scatter * Math.sin(pe * Math.PI)
      const px = sx + this.dx * pe + this.nx * arc
      const py = sy + this.dy * pe + this.ny * arc

      // Alpha: fade in fast, fade out gently
      const al = Math.min(1, pe * 4) * (1 - pe * 0.75)
      const sz = 1.2 + rng(i * 3.3 + 1) * 1.8

      // Faint line from particle back to spine (straight line position)
      const spineX = sx + this.dx * pe
      const spineY = sy + this.dy * pe
      g.moveTo(spineX, spineY)
      g.lineTo(px, py)
      g.stroke({ width: 0.5, color: c, alpha: al * 0.2 })

      // Particle dot
      g.circle(px, py, sz)
      g.fill({ color: c, alpha: al * 0.9 })
    }

    // ── Lead bead at the eased head position ──
    const hx = sx + (this.endPos.x - sx) * e
    const hy = sy + (this.endPos.y - sy) * e
    g.circle(hx, hy, 2.5)
    g.fill({ color: c, alpha: 0.95 })

    // ── Arrival flash ring at target at 82%+ progress ──
    if (this.progress > 0.82) {
      const fl = (this.progress - 0.82) / 0.18
      g.circle(this.endPos.x, this.endPos.y, fl * 22)
      g.stroke({ width: 0.8, color: c, alpha: (1 - fl) * 0.5 })
    }
  }
}
