import { Container, Graphics } from 'pixi.js'

/**
 * Flash + expanding ring effect when a subagent satellite spawns.
 * Plays at the agent node position (added as child of NodeObject container).
 */
export class SubagentSpawnEffect {
  container: Container
  private gfx: Graphics
  private progress: number = 0
  private duration: number = 0.8

  constructor() {
    this.container = new Container()
    this.gfx = new Graphics()
    this.container.addChild(this.gfx)
  }

  tick(dt: number) {
    this.progress += dt / this.duration
    this.gfx.clear()

    const p = Math.min(1, this.progress)
    const color = 0xc084fc // purple for agents

    // Expanding flash ring
    const ringR = 5 + p * 25
    const ringAlpha = (1 - p) * 0.6
    if (ringAlpha > 0.01) {
      this.gfx.circle(0, 0, ringR).stroke({ width: 1.5 * (1 - p), color, alpha: ringAlpha })
    }

    // Inner bright flash that fades
    const flashAlpha = (1 - p) * 0.8
    if (flashAlpha > 0.01) {
      this.gfx.circle(0, 0, 4 * (1 - p * 0.5)).fill({ color: 0xffffff, alpha: flashAlpha })
      this.gfx.circle(0, 0, 8 * (1 - p * 0.3)).fill({ color, alpha: flashAlpha * 0.3 })
    }

    // 4 spark particles radiating outward
    const sparkCount = 4
    for (let i = 0; i < sparkCount; i++) {
      const angle = (i / sparkCount) * Math.PI * 2 + 0.3
      const dist = p * 20
      const sx = Math.cos(angle) * dist
      const sy = Math.sin(angle) * dist
      const sparkAlpha = (1 - p) * 0.7
      if (sparkAlpha > 0.01) {
        this.gfx.circle(sx, sy, 1.2 * (1 - p)).fill({ color, alpha: sparkAlpha })
      }
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
