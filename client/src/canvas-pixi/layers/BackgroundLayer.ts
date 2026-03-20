import { Container, Graphics, Sprite } from 'pixi.js'
import type { Application } from 'pixi.js'

/**
 * Background layer: starfield, nebula, vignette, shooting stars.
 * All content is screen-space (not affected by camera transforms).
 * Keeps all state in class instance (not module globals) for React StrictMode compatibility.
 */
export class BackgroundLayer {
  container: Container
  app: Application
  starfield: Sprite | null = null
  nebula: Graphics | null = null
  vignette: Graphics | null = null
  stars: Array<{ x: number; y: number; radius: number; brightness: number; baseBrightness: number }> = []
  lastRefreshFrame: number = 0

  constructor(app: Application) {
    this.app = app
    this.container = new Container()
    this.renderNebula()
    this.initStars()
    this.renderVignette()
  }

  /**
   * Generate deterministic starfield.
   */
  private initStars() {
    const W = this.app.renderer.width
    const H = this.app.renderer.height
    const starCount = 400

    // Seed random with 0 for deterministic generation
    let seed = 0
    const seededRandom = () => {
      seed = (seed * 9301 + 49297) % 233280
      return seed / 233280
    }

    for (let i = 0; i < starCount; i++) {
      const brightness = 0.3 + seededRandom() * 0.7
      this.stars.push({
        x: seededRandom() * W,
        y: seededRandom() * H,
        radius: seededRandom() * 1.5,
        brightness,
        baseBrightness: brightness,
      })
    }

    this.renderStarfield()
  }

  /**
   * Render starfield to a texture sprite (only regenerate every 90 frames).
   * Uses generateTexture() to convert Graphics to a real Texture for stamping.
   */
  private renderStarfield() {
    if (this.starfield) this.container.removeChild(this.starfield)

    const g = new Graphics()
    for (const star of this.stars) {
      const alpha = star.brightness * 0.6
      g.circle(star.x, star.y, star.radius).fill({ color: 0xffffff, alpha })
    }

    // Convert Graphics to Texture, then create Sprite from texture
    const texture = this.app.renderer.generateTexture(g)
    this.starfield = new Sprite(texture)
    this.container.addChild(this.starfield)
  }

  /**
   * Render nebula: soft colored circles at random positions as nebula patches.
   * Uses very low alpha with purple/blue tones for a subtle cosmic background.
   */
  private renderNebula() {
    if (this.nebula) this.container.removeChild(this.nebula)

    const g = new Graphics()
    const W = this.app.renderer.width
    const H = this.app.renderer.height

    // Base dark fill
    g.rect(0, 0, W, H).fill({ color: 0x0a0a1a, alpha: 0.4 })

    // Nebula patches: soft colored circles at deterministic positions
    const patches: Array<{ x: number; y: number; radius: number; color: number; alpha: number }> = [
      { x: W * 0.25, y: H * 0.3, radius: 350, color: 0x1a0a2e, alpha: 0.04 },
      { x: W * 0.7, y: H * 0.6, radius: 280, color: 0x0a1a2e, alpha: 0.03 },
      { x: W * 0.5, y: H * 0.8, radius: 320, color: 0x1a0a2e, alpha: 0.05 },
      { x: W * 0.15, y: H * 0.7, radius: 220, color: 0x0a1a2e, alpha: 0.02 },
    ]

    for (const patch of patches) {
      g.circle(patch.x, patch.y, patch.radius).fill({ color: patch.color, alpha: patch.alpha })
    }

    this.nebula = g
    this.container.addChild(this.nebula)
  }

  /**
   * Render vignette overlay: darkens edges for a focused center look.
   * Approximated with concentric rectangles with increasing alpha toward edges.
   * Color: 0x060312 (dark purple-black).
   */
  private renderVignette() {
    if (this.vignette) this.container.removeChild(this.vignette)

    const g = new Graphics()
    const W = this.app.renderer.width
    const H = this.app.renderer.height
    const color = 0x060312
    const maxAlpha = 0.45
    const bands = 12

    for (let i = 0; i < bands; i++) {
      // Each band is an inset frame (hollow rectangle)
      const t = i / bands // 0 = outermost, 1 = innermost
      const alpha = maxAlpha * (1 - t) * (1 - t) // Quadratic falloff toward center
      const inset = t * Math.min(W, H) * 0.4 // How far inward this band is

      // Draw a hollow frame by drawing outer rect and cutting inner rect
      // Top edge
      g.rect(0, inset - (inset / bands), W, inset / bands + 2).fill({ color, alpha })
      // Bottom edge
      g.rect(0, H - inset, W, inset / bands + 2).fill({ color, alpha })
      // Left edge
      g.rect(inset - (inset / bands), inset, inset / bands + 2, H - 2 * inset).fill({ color, alpha })
      // Right edge
      g.rect(W - inset, inset, inset / bands + 2, H - 2 * inset).fill({ color, alpha })
    }

    this.vignette = g
    this.container.addChild(this.vignette)
  }

  tick(dt: number) {
    this.lastRefreshFrame++
    // Refresh starfield every ~90 frames with twinkling
    if (this.lastRefreshFrame > 90) {
      // Randomly adjust each star's brightness by +/-10% for subtle twinkling
      for (const star of this.stars) {
        const jitter = (Math.random() - 0.5) * 0.2 * star.baseBrightness // +/-10%
        star.brightness = Math.max(0.1, Math.min(1.0, star.baseBrightness + jitter))
      }
      this.renderStarfield()
      this.lastRefreshFrame = 0
    }
  }
}
