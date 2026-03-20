import { Container, Graphics } from 'pixi.js'

/**
 * Warp-in effect when a new cluster (session) appears.
 * Expanding ring burst + bright flash at cluster center.
 */
export class ClusterEntranceEffect {
  container: Container
  private gfx: Graphics
  private progress: number = 0
  private duration: number = 1.2
  private isChild: boolean

  constructor(isChild: boolean) {
    this.container = new Container()
    this.isChild = isChild
    this.gfx = new Graphics()
    this.container.addChild(this.gfx)
  }

  tick(dt: number) {
    this.progress += dt / this.duration
    this.gfx.clear()

    const p = Math.min(1, this.progress)
    const color = this.isChild ? 0xDCBE78 : 0xC8D5F0
    const bright = this.isChild ? 0xFFF0C8 : 0xFFFFFF

    // Phase 1 (0-0.4): bright flash
    if (p < 0.4) {
      const flashP = p / 0.4
      const flashAlpha = (1 - flashP) * 0.7
      this.gfx.circle(0, 0, 10 + flashP * 15).fill({ color: bright, alpha: flashAlpha })
      this.gfx.circle(0, 0, 5 + flashP * 8).fill({ color: 0xffffff, alpha: flashAlpha * 0.8 })
    }

    // Phase 2 (0.1-0.8): expanding ring
    if (p > 0.1 && p < 0.8) {
      const ringP = (p - 0.1) / 0.7
      const ringR = 10 + ringP * 60
      const ringAlpha = (1 - ringP) * 0.5
      this.gfx.circle(0, 0, ringR).stroke({ width: 2 * (1 - ringP), color, alpha: ringAlpha })
    }

    // Phase 3 (0.2-1.0): second slower ring
    if (p > 0.2) {
      const ringP = (p - 0.2) / 0.8
      const ringR = 5 + ringP * 80
      const ringAlpha = (1 - ringP) * 0.25
      if (ringAlpha > 0.01) {
        this.gfx.circle(0, 0, ringR).stroke({ width: 1 * (1 - ringP), color, alpha: ringAlpha })
      }
    }

    // 6 radial streaks
    if (p < 0.6) {
      const streakP = p / 0.6
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2
        const innerR = streakP * 15
        const outerR = streakP * 40
        const alpha = (1 - streakP) * 0.4
        if (alpha > 0.01) {
          const ix = Math.cos(angle) * innerR
          const iy = Math.sin(angle) * innerR
          const ox = Math.cos(angle) * outerR
          const oy = Math.sin(angle) * outerR
          this.gfx.moveTo(ix, iy).lineTo(ox, oy).stroke({ width: 1, color: bright, alpha })
        }
      }
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
