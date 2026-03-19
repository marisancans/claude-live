import { Container, Text } from 'pixi.js'
import type { SplinePath } from '../../utils/spline'
import { evaluateSpline, evaluateTangent } from '../../utils/spline'

/**
 * Snake animation: words flowing along a spline path toward cluster center.
 * Reuses SplinePath Bezier math from utils/spline.ts unchanged.
 */
export class SnakeObject {
  container: Container
  words: string[]
  color: string
  progress: number = 0
  splinePath: SplinePath
  isResponse: boolean
  onComplete: (() => void) | null = null
  wordTexts: Text[] = []
  duration: number = 3.0 // seconds

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
    this.color = color
    this.isResponse = isResponse
    this.onComplete = onComplete || null

    // Create text objects for each word
    // PixiJS v8 Text constructor: new Text({ text, style: { ... } })
    for (const word of words) {
      const text = new Text({
        text: word,
        style: {
          fontSize: 10,
          fontFamily: 'monospace',
          fill: color,
          align: 'center',
        },
      })
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

      // Skip out-of-range words
      if (wordT < 0 || wordT > 1) {
        this.wordTexts[i].visible = false
        continue
      }

      // Position along spline
      const pos = evaluateSpline(this.splinePath, wordT)
      const tangent = evaluateTangent(this.splinePath, wordT)
      const angle = Math.atan2(tangent.y, tangent.x)

      this.wordTexts[i].position.set(pos.x, pos.y)
      this.wordTexts[i].rotation = angle
      this.wordTexts[i].visible = true

      // Fade in/out
      const fadeIn = Math.min(1, wordT * 5)
      const fadeOut = Math.min(1, (1 - wordT) * 5)
      this.wordTexts[i].alpha = fadeIn * fadeOut
    }

    // Call completion callback
    if (this.progress >= 1 && this.onComplete) {
      this.onComplete()
    }
  }

  isDone(): boolean {
    return this.progress >= 1.0
  }

  destroy() {
    this.container.destroy()
  }
}
