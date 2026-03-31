import { Container, Text, TextStyle } from 'pixi.js'
import type { SplinePath } from '../../utils/spline'
import { evaluateSpline, evaluateTangent } from '../../utils/spline'

// Shared style caches — avoids re-creating TextStyle per letter
const styleCache = new Map<string, TextStyle>()

/**
 * Approximate the arc length of a quadratic Bézier by sampling.
 */
function estimateSplineLength(path: SplinePath, samples = 20): number {
  let len = 0
  let prev = evaluateSpline(path, 0)
  for (let i = 1; i <= samples; i++) {
    const t = i / samples
    const cur = evaluateSpline(path, t)
    const dx = cur.x - prev.x
    const dy = cur.y - prev.y
    len += Math.sqrt(dx * dx + dy * dy)
    prev = cur
  }
  return len
}

/**
 * Snake animation: individual letters flowing along a curved spline path,
 * with proper word spacing preserved.
 */
export class SnakeObject {
  container: Container
  words: string[]
  progress: number = 0
  splinePath: SplinePath
  isResponse: boolean
  onComplete: (() => void) | null = null
  duration: number = 4.0

  // One Text per letter — positioned and rotated each tick
  private letterTexts: Text[] = []
  // Normalized offset for each letter along the snake (in t-space 0..1)
  private letterOffsets: number[] = []
  // How much of the spline the snake text occupies (in t-space)
  private snakeSpan: number = 0

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

    const fontSize = isResponse ? 6 : 7
    // Pixel spacing between letters and words
    const CHAR_PX = 4.0
    const SPACE_PX = 3.0

    // Build flat list of letters with cumulative pixel positions
    const letters: string[] = []
    const pixelPositions: number[] = []
    let cursor = 0

    for (let w = 0; w < words.length; w++) {
      if (w > 0) cursor += SPACE_PX
      for (let c = 0; c < words[w].length; c++) {
        letters.push(words[w][c])
        pixelPositions.push(cursor + CHAR_PX * 0.5)
        cursor += CHAR_PX
      }
    }

    // Convert pixel positions to normalized t-space using actual spline length
    const splineLength = estimateSplineLength(splinePath)
    const totalTextPx = cursor
    // Scale text to fit available spline, capped at 0.85 to leave room for animation
    this.snakeSpan = Math.min(0.85, totalTextPx / splineLength)

    for (let i = 0; i < pixelPositions.length; i++) {
      this.letterOffsets.push((pixelPositions[i] / totalTextPx) * this.snakeSpan)
    }

    // Shared style — one TextStyle per color+size combo, reused across all snakes
    const cacheKey = `${color}-${fontSize}`
    let style = styleCache.get(cacheKey)
    if (!style) {
      style = new TextStyle({
        fontSize,
        fontFamily: 'monospace',
        fontWeight: '700',
        fill: color,
        align: 'center',
      })
      styleCache.set(cacheKey, style)
    }

    // Create one Text per letter
    for (const letter of letters) {
      const text = new Text({ text: letter, style })
      text.anchor.set(0.5, 0.5)
      text.visible = false
      this.letterTexts.push(text)
      this.container.addChild(text)
    }
  }

  tick(dt: number) {
    this.progress = Math.min(1, this.progress + dt / this.duration)

    const headT = this.progress * (1 + this.snakeSpan)

    for (let i = 0; i < this.letterTexts.length; i++) {
      const letterT = headT - (this.snakeSpan - this.letterOffsets[i])

      if (letterT < 0 || letterT > 1) {
        this.letterTexts[i].visible = false
        continue
      }

      const pos = evaluateSpline(this.splinePath, letterT)
      const tangent = evaluateTangent(this.splinePath, letterT)
      const angle = Math.atan2(tangent.y, tangent.x)

      const fadeIn = Math.min(1, letterT * 5)
      const fadeOut = Math.min(1, (1 - letterT) * 5)
      const opacity = fadeIn * fadeOut

      if (opacity <= 0.01) {
        this.letterTexts[i].visible = false
        continue
      }

      const text = this.letterTexts[i]
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
