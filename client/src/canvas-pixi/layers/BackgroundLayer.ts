import { Container, Graphics, Sprite } from 'pixi.js'
import type { Application } from 'pixi.js'

/**
 * Background layer: starfield, nebula, vignette.
 * All content is screen-space (not affected by camera transforms).
 * Rendered once on init — no per-frame Graphics redraws.
 */
export class BackgroundLayer {
  container: Container
  app: Application
  starfield: Sprite | null = null
  private starfieldGraphics: Graphics | null = null // kept alive so texture stays valid
  nebula: Graphics | null = null
  vignette: Graphics | null = null

  constructor(app: Application) {
    this.app = app
    this.container = new Container()
    this.renderNebula()
    this.renderStarfield()
    this.renderVignette()
  }

  /**
   * Render starfield once. No regeneration — twinkling is not worth the
   * GPU texture churn that was leaking ~600 textures over 15 minutes.
   */
  private renderStarfield() {
    const W = this.app.renderer.width
    const H = this.app.renderer.height
    const starCount = 400

    let seed = 0
    const seededRandom = () => {
      seed = (seed * 9301 + 49297) % 233280
      return seed / 233280
    }

    const g = new Graphics()
    for (let i = 0; i < starCount; i++) {
      const x = seededRandom() * W
      const y = seededRandom() * H
      const radius = seededRandom() * 1.5
      const brightness = 0.3 + seededRandom() * 0.7
      g.circle(x, y, radius).fill({ color: 0xffffff, alpha: brightness * 0.6 })
    }

    const texture = this.app.renderer.generateTexture(g)
    g.destroy()  // temp Graphics no longer needed
    this.starfield = new Sprite(texture)
    this.container.addChild(this.starfield)
  }

  /**
   * Render nebula: soft colored circles. Static — rendered once.
   */
  private renderNebula() {
    const g = new Graphics()
    const W = this.app.renderer.width
    const H = this.app.renderer.height

    g.rect(0, 0, W, H).fill({ color: 0x0a0a1a, alpha: 0.4 })

    const patches = [
      { x: W * 0.25, y: H * 0.3, radius: 350, color: 0x1a0a2e, alpha: 0.04 },
      { x: W * 0.7, y: H * 0.6, radius: 280, color: 0x0a1a2e, alpha: 0.03 },
      { x: W * 0.5, y: H * 0.8, radius: 320, color: 0x1a0a2e, alpha: 0.05 },
      { x: W * 0.15, y: H * 0.7, radius: 220, color: 0x0a1a2e, alpha: 0.02 },
    ]
    for (const p of patches) {
      g.circle(p.x, p.y, p.radius).fill({ color: p.color, alpha: p.alpha })
    }

    this.nebula = g
    this.container.addChild(this.nebula)
  }

  /**
   * Render vignette overlay. Static — rendered once.
   */
  private renderVignette() {
    const g = new Graphics()
    const W = this.app.renderer.width
    const H = this.app.renderer.height
    const color = 0x060312
    const maxAlpha = 0.45
    const bands = 12

    for (let i = 0; i < bands; i++) {
      const t = i / bands
      const alpha = maxAlpha * (1 - t) * (1 - t)
      const inset = t * Math.min(W, H) * 0.4
      g.rect(0, inset - (inset / bands), W, inset / bands + 2).fill({ color, alpha })
      g.rect(0, H - inset, W, inset / bands + 2).fill({ color, alpha })
      g.rect(inset - (inset / bands), inset, inset / bands + 2, H - 2 * inset).fill({ color, alpha })
      g.rect(W - inset, inset, inset / bands + 2, H - 2 * inset).fill({ color, alpha })
    }

    this.vignette = g
    this.container.addChild(this.vignette)
  }

  tick(_dt: number) {
    // Nothing to do — all background elements are static
  }
}
