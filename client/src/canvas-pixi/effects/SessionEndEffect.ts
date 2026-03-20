import { Container, Graphics } from 'pixi.js'

/**
 * Dissolution effect when a session ends.
 * Imploding ring + fading core + scattered particles.
 */
export class SessionEndEffect {
  container: Container
  private gfx: Graphics
  private progress: number = 0
  private duration: number = 1.5

  constructor() {
    this.container = new Container()
    this.gfx = new Graphics()
    this.container.addChild(this.gfx)
  }

  tick(dt: number) {
    this.progress += dt / this.duration
    this.gfx.clear()

    const p = Math.min(1, this.progress)
    const color = 0xA0B4DC

    // Contracting ring (closing down)
    const ringR = 80 * (1 - p)
    const ringAlpha = (1 - p) * 0.4
    if (ringAlpha > 0.01 && ringR > 1) {
      this.gfx.circle(0, 0, ringR).stroke({ width: 1.5, color, alpha: ringAlpha })
    }

    // Fading central glow
    const glowAlpha = (1 - p) * 0.3
    if (glowAlpha > 0.01) {
      this.gfx.circle(0, 0, 15 * (1 - p)).fill({ color: 0xffffff, alpha: glowAlpha })
      this.gfx.circle(0, 0, 25 * (1 - p)).fill({ color, alpha: glowAlpha * 0.4 })
    }

    // Scattered particles drifting outward and fading
    const particleCount = 8
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2 + 0.5
      const drift = p * (30 + i * 8)
      const px = Math.cos(angle) * drift
      const py = Math.sin(angle) * drift
      const pAlpha = (1 - p) * 0.5 * (1 - i / particleCount * 0.3)
      if (pAlpha > 0.01) {
        this.gfx.circle(px, py, 1.5 * (1 - p * 0.5)).fill({ color, alpha: pAlpha })
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
