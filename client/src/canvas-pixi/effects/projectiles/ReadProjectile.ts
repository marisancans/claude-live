import { Graphics } from 'pixi.js'
import type { Point } from '../../../utils/spline'
import { ProjectileObject } from './ProjectileObject'

function eio(t: number) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t }

/**
 * Read tool projectile: two-phase scanner + data-packet return.
 *
 * Phase 1 (progress 0-0.45): scanner box at node position with sweep line,
 *   corner tick marks, scanned-region fill, text lines, and flash ring.
 * Phase 2 (progress 0.45-1.0): data packets stream from node back to core
 *   with gradient trail, staggered dots, lead dot, and arrival flash.
 */
export class ReadProjectile extends ProjectileObject {
  color: number
  inbound: boolean
  graphics: Graphics

  constructor(startPos: Point, endPos: Point, color: number, inbound: boolean = false, duration: number = 1.0) {
    super(startPos, endPos, duration)
    this.color = color
    this.inbound = inbound

    this.graphics = new Graphics()
    // For Read (inbound): startPos = node, endPos = core
    // Phase 1 scans at the node (startPos)
    this.container.position.set(startPos.x, startPos.y)
    this.container.addChild(this.graphics)
  }

  tick(dt: number) {
    this.progress = Math.min(1, this.progress + dt / this.duration)
    const g = this.graphics
    g.clear()

    const c = this.color
    // For Read (inbound): startPos = node, endPos = core
    const node = this.startPos
    const core = this.endPos

    if (this.progress < 0.45) {
      // ── Phase 1: Scanner at node ──
      const p1 = this.progress / 0.45
      const fadeIn = Math.min(1, p1 * 4)

      // Container stays at node
      this.container.position.set(node.x, node.y)

      const bw = 14  // box half-width
      const bh = 18  // box half-height

      // Scan line sweeps bottom to top
      const scanY = bh - p1 * bh * 2  // local coords: +bh (bottom) to -bh (top)

      // Corner tick marks (4 corners of box)
      const cornerLen = 5
      const corners: [number, number][] = [[-1, -1], [1, -1], [-1, 1], [1, 1]]
      for (const [sx, sy] of corners) {
        // Vertical tick
        g.moveTo(sx * bw, sy * bh)
        g.lineTo(sx * bw, sy * bh - sy * cornerLen)
        g.stroke({ width: 0.5, color: c, alpha: fadeIn * 0.18 })
        // Horizontal tick
        g.moveTo(sx * bw, sy * bh)
        g.lineTo(sx * bw - sx * cornerLen, sy * bh)
        g.stroke({ width: 0.5, color: c, alpha: fadeIn * 0.18 })
      }

      // Main scan line
      g.moveTo(-bw, scanY)
      g.lineTo(bw, scanY)
      g.stroke({ width: 1.2, color: c, alpha: fadeIn * 0.85 })

      // Soft glow behind scan line
      g.moveTo(-bw, scanY)
      g.lineTo(bw, scanY)
      g.stroke({ width: 8, color: c, alpha: fadeIn * 0.12 })

      // Scanned region fill (below scan line)
      const fillTop = scanY
      const fillH = bh - scanY
      if (fillH > 0) {
        g.rect(-bw, fillTop, bw * 2, fillH)
        g.fill({ color: c, alpha: fadeIn * 0.035 })
      }

      // Text-like detail lines revealed behind scan line
      const lineSpacing = 3.5
      const numLines = Math.floor(bh * 2 / lineSpacing)
      for (let i = 0; i < numLines; i++) {
        const ly = -bh + i * lineSpacing + 2
        if (ly < scanY) continue  // only show already-scanned lines
        const dist = ly - scanY
        if (dist > 14) continue
        const lineAlpha = fadeIn * 0.22 * (1 - dist / 14)
        const lineW = 4 + ((i * 7) % 5) * 2.5
        const lineX = -8 + ((i * 3) % 5) * 1.5
        g.moveTo(lineX - lineW * 0.5, ly)
        g.lineTo(lineX + lineW * 0.5, ly)
        g.stroke({ width: 0.5, color: c, alpha: lineAlpha })
      }

      // Flash ring at 88%+ of phase 1
      if (p1 > 0.88) {
        const flash = (p1 - 0.88) / 0.12
        g.circle(0, 0, flash * 16)
        g.stroke({ width: 0.7, color: c, alpha: (1 - flash) * 0.4 })
      }

    } else {
      // ── Phase 2: Data packets from node toward core ──
      const p2 = (this.progress - 0.45) / 0.55
      const e2 = eio(p2)

      // Head position along node->core path
      const headX = node.x + (core.x - node.x) * e2
      const headY = node.y + (core.y - node.y) * e2

      // Move container to head position
      this.container.position.set(headX, headY)

      // All drawing relative to (0,0) = current head position
      // Trail start and end in local coords
      const trailS = Math.max(0, e2 - 0.35)
      const tsxW = node.x + (core.x - node.x) * trailS
      const tsyW = node.y + (core.y - node.y) * trailS
      const tsxL = tsxW - headX
      const tsyL = tsyW - headY

      // Faint gradient trail line (from trail start to head=0,0)
      // Draw as two strokes: dim tail to bright head
      g.moveTo(tsxL, tsyL)
      g.lineTo(0, 0)
      g.stroke({ width: 1.2, color: c, alpha: 0.5 })

      // Dimmer overlay for the tail end
      g.moveTo(tsxL, tsyL)
      g.lineTo(tsxL * 0.3, tsyL * 0.3)
      g.stroke({ width: 1.2, color: c, alpha: 0.1 })

      // 5 data packets streaming with staggered offsets
      const PACKETS = 5
      for (let i = 0; i < PACKETS; i++) {
        const offset = (i / PACKETS) * 0.3
        const pp = Math.min(1, Math.max(0, e2 - offset))
        if (pp <= 0) continue
        const pxW = node.x + (core.x - node.x) * pp
        const pyW = node.y + (core.y - node.y) * pp
        const pxL = pxW - headX
        const pyL = pyW - headY
        const a = pp < 0.1 ? pp / 0.1 : (pp > 0.85 ? (1 - pp) / 0.15 : 1)
        g.circle(pxL, pyL, 2.5 - i * 0.3)
        g.fill({ color: c, alpha: a * 0.8 })
      }

      // Lead white dot at head (0,0)
      g.circle(0, 0, 2)
      g.fill({ color: 0xffffff, alpha: 0.9 })

      // Arrival flash ring at core at 85%+ of phase 2
      if (p2 > 0.85) {
        const flash = (p2 - 0.85) / 0.15
        const coreLocalX = core.x - headX
        const coreLocalY = core.y - headY
        g.circle(coreLocalX, coreLocalY, flash * 16)
        g.stroke({ width: 0.8, color: c, alpha: (1 - flash) * 0.6 })
      }
    }
  }
}
