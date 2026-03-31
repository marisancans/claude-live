import { Container, Sprite, Texture, Text, TextStyle, RenderTexture } from 'pixi.js'
import type { Application } from 'pixi.js'
import type { SplinePath } from '../../utils/spline'
import { evaluateSpline, evaluateTangent } from '../../utils/spline'

/**
 * Glyph atlas: renders each character once to a shared texture,
 * then every letter in every snake is a cheap Sprite lookup.
 */
const glyphCache = new Map<string, Texture>()
let atlasApp: Application | null = null

/** Must be called once with the PixiJS Application so we can render glyphs */
export function initSnakeAtlas(app: Application) {
  atlasApp = app
}

function getGlyph(char: string, color: string, fontSize: number): Texture {
  const key = `${char}|${color}|${fontSize}`
  const cached = glyphCache.get(key)
  if (cached) return cached

  if (!atlasApp) {
    // Fallback: return empty texture (shouldn't happen if initSnakeAtlas was called)
    return Texture.EMPTY
  }

  // Render character to a small RenderTexture once
  const style = new TextStyle({
    fontSize,
    fontFamily: 'monospace',
    fontWeight: '700',
    fill: color,
    align: 'center',
  })
  const text = new Text({ text: char, style })

  const bounds = text.getBounds()
  const w = Math.ceil(bounds.width) || 8
  const h = Math.ceil(bounds.height) || 10

  const rt = RenderTexture.create({ width: w, height: h })
  text.position.set(0, 0)
  atlasApp.renderer.render({ container: text, target: rt })

  glyphCache.set(key, rt)
  text.destroy()
  return rt
}

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
 * Snake animation: individual letter sprites flowing along a curved spline path.
 * Each letter is a Sprite from a pre-rendered glyph atlas — no per-frame font rasterization.
 */
export class SnakeObject {
  container: Container
  words: string[]
  progress: number = 0
  splinePath: SplinePath
  isResponse: boolean
  onComplete: (() => void) | null = null
  duration: number = 4.0

  private letterSprites: Sprite[] = []
  private letterOffsets: number[] = []
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

    // Convert pixel positions to normalized t-space
    const splineLength = estimateSplineLength(splinePath)
    const totalTextPx = cursor
    this.snakeSpan = Math.min(0.85, totalTextPx / splineLength)

    for (let i = 0; i < pixelPositions.length; i++) {
      this.letterOffsets.push((pixelPositions[i] / totalTextPx) * this.snakeSpan)
    }

    // Create one Sprite per letter from the glyph atlas
    for (const letter of letters) {
      const tex = getGlyph(letter, color, fontSize)
      const sprite = new Sprite(tex)
      sprite.anchor.set(0.5, 0.5)
      sprite.visible = false
      this.letterSprites.push(sprite)
      this.container.addChild(sprite)
    }
  }

  tick(dt: number) {
    this.progress = Math.min(1, this.progress + dt / this.duration)
    const headT = this.progress * (1 + this.snakeSpan)

    for (let i = 0; i < this.letterSprites.length; i++) {
      const letterT = headT - (this.snakeSpan - this.letterOffsets[i])

      if (letterT < 0 || letterT > 1) {
        this.letterSprites[i].visible = false
        continue
      }

      const pos = evaluateSpline(this.splinePath, letterT)
      const tangent = evaluateTangent(this.splinePath, letterT)
      const angle = Math.atan2(tangent.y, tangent.x)

      const fadeIn = Math.min(1, letterT * 5)
      const fadeOut = Math.min(1, (1 - letterT) * 5)
      const opacity = fadeIn * fadeOut

      if (opacity <= 0.01) {
        this.letterSprites[i].visible = false
        continue
      }

      const sprite = this.letterSprites[i]
      sprite.visible = true
      sprite.position.set(pos.x, pos.y)
      sprite.rotation = angle
      sprite.alpha = opacity
    }

    if (this.progress >= 1 && this.onComplete) {
      this.onComplete()
    }
  }

  isDone(): boolean {
    return this.progress >= 1.0
  }

  destroy() {
    // Just remove sprites from container — textures are shared in the atlas
    for (const sprite of this.letterSprites) {
      sprite.destroy({ texture: false })
    }
    this.letterSprites.length = 0
    this.container.destroy({ children: false })
  }
}
