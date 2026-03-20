import { Container, Graphics, Text } from 'pixi.js'
import type { SplinePath } from '../../utils/spline'
import { evaluateSpline, evaluateTangent } from '../../utils/spline'

/**
 * Snake animation: words flowing along a curved spline path.
 *
 * Performance-optimized:
 * - Text objects created once, never re-styled (no per-frame rasterization)
 * - Single shared glow Graphics drawn once, faded via container alpha
 * - No per-frame clear/redraw of Graphics
 */
export class SnakeObject {
  container: Container
  words: string[]
  progress: number = 0
  splinePath: SplinePath
  isResponse: boolean
  onComplete: (() => void) | null = null
  duration: number = 4.0

  // One Text per word — positioned and rotated each tick, nothing else
  private wordTexts: Text[] = []

  constructor(
    splinePath: SplinePath,
    words: string[],
    color: string,
    isResponse: boolean = false,
    onComplete?: () => void
  ) {
    this.container = new Container()
    this.splinePath = splinePath
    this.words = words
    this.isResponse = isResponse
    this.onComplete = onComplete || null

    // Create one Text per word — styled once, never re-styled
    const fontSize = isResponse ? 6 : 7
    for (const word of words) {
      const text = new Text({
        text: word,
        style: {
          fontSize,
          fontFamily: 'monospace',
          fontWeight: '700',
          fill: color,
          align: 'center',
          // Use dropShadow for the shadow — rendered by PixiJS natively, no extra objects
          dropShadow: {
            alpha: 0.3,
            angle: Math.PI / 4,
            blur: 0,
            distance: 1,
            color: 0x000000,
          },
        },
      })
      text.anchor.set(0.5, 0.5)
      text.visible = false
      this.wordTexts.push(text)
      this.container.addChild(text)
    }
  }

  tick(dt: number) {
    this.progress = Math.min(1, this.progress + dt / this.duration)

    const SNAKE_LENGTH = 0.65
    const wordSpacing = this.words.length > 1 ? SNAKE_LENGTH / (this.words.length - 1) : 0
    const headT = this.progress * (1 + SNAKE_LENGTH)

    for (let i = 0; i < this.words.length; i++) {
      const distFromHead = this.words.length - 1 - i
      const wordT = headT - wordSpacing * distFromHead

      if (wordT < 0 || wordT > 1) {
        this.wordTexts[i].visible = false
        continue
      }

      // Position along spline
      const pos = evaluateSpline(this.splinePath, wordT)
      const tangent = evaluateTangent(this.splinePath, wordT)
      const angle = Math.atan2(tangent.y, tangent.x)

      // Fade in/out
      const fadeIn = Math.min(1, wordT * 5)
      const fadeOut = Math.min(1, (1 - wordT) * 5)
      const opacity = fadeIn * fadeOut

      if (opacity <= 0.01) {
        this.wordTexts[i].visible = false
        continue
      }

      const text = this.wordTexts[i]
      text.visible = true
      text.position.set(pos.x, pos.y)
      text.rotation = angle
      text.alpha = opacity
    }

    if (this.progress >= 1 && this.onComplete) {
      this.onComplete()
    }
  }

  isDone(): boolean {
    return this.progress >= 1.0
  }

  destroy() {
    this.container.destroy({ children: true })
  }
}
