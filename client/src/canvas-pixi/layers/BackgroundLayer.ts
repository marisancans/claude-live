import { Container, Graphics, Sprite } from 'pixi.js'
import type { Application } from 'pixi.js'

/**
 * Background layer: starfield, nebula, shooting stars.
 * All content is screen-space (not affected by camera transforms).
 * Keeps all state in class instance (not module globals) for React StrictMode compatibility.
 */
export class BackgroundLayer {
  container: Container
  app: Application
  starfield: Sprite | null = null
  nebula: Graphics | null = null
  stars: Array<{ x: number; y: number; radius: number; brightness: number }> = []
  lastRefreshFrame: number = 0

  constructor(app: Application) {
    this.app = app
    this.container = new Container()
    this.initStars()
  }

  /**
   * Generate deterministic starfield.
   */
  private initStars() {
    const W = this.app.renderer.width
    const H = this.app.renderer.height
    const starCount = 200

    // Seed random with 0 for deterministic generation
    let seed = 0
    const seededRandom = () => {
      seed = (seed * 9301 + 49297) % 233280
      return seed / 233280
    }

    for (let i = 0; i < starCount; i++) {
      this.stars.push({
        x: seededRandom() * W,
        y: seededRandom() * H,
        radius: seededRandom() * 1.5,
        brightness: 0.3 + seededRandom() * 0.7,
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
   * Render nebula (gradient background).
   */
  private renderNebula() {
    if (this.nebula) this.container.removeChild(this.nebula)

    const g = new Graphics()
    const W = this.app.renderer.width
    const H = this.app.renderer.height

    // Simple radial gradient nebula
    g.rect(0, 0, W, H).fill({ color: 0x0a0a1a, alpha: 0.4 })

    this.nebula = g
    this.container.addChild(this.nebula)
  }

  tick(dt: number) {
    this.lastRefreshFrame++
    // Refresh starfield every ~90 frames for twinkling effect
    if (this.lastRefreshFrame > 90) {
      this.renderStarfield()
      this.lastRefreshFrame = 0
    }
  }
}
