import { Graphics, Text, TextStyle } from 'pixi.js'
import type { Point } from '../../../utils/spline'
import { ProjectileObject } from './ProjectileObject'

const TERMINAL_LINES = [
  '> npm run build',
  'compiled 0 errs',
  '> git status',
  'M  src/app.ts',
  '> grep -r TODO',
  'src/utils:42',
  '> cat config.json',
  '{"port": 3000}',
  '> ls -la',
  'drwxr-xr-x 4',
  '> echo $PATH',
  '/usr/local/bin',
  '> node -v',
  'v20.11.0',
  '> pwd',
  '/home/user/app',
]

const VISIBLE_LINES = 6
const TERM_W = 60
const TERM_H = 50
const TITLE_BAR_H = 8
const LINE_H = 6

/**
 * Bash tool projectile: mini scrolling terminal window (shell command execution).
 */
export class BashProjectile extends ProjectileObject {
  color: number
  graphics: Graphics
  lineTexts: Text[]
  monoStyle: TextStyle
  outputStyle: TextStyle

  constructor(startPos: Point, endPos: Point, color: number, _inbound: boolean = false, duration: number = 0.6) {
    super(startPos, endPos, duration)
    this.color = color

    this.graphics = new Graphics()
    this.container.addChild(this.graphics)

    // Pre-create text objects for visible lines
    this.monoStyle = new TextStyle({
      fontFamily: 'monospace',
      fontSize: 5,
      fill: color,
    })
    this.outputStyle = new TextStyle({
      fontFamily: 'monospace',
      fontSize: 5,
      fill: 0x888888,
    })

    this.lineTexts = []
    for (let i = 0; i < VISIBLE_LINES; i++) {
      const t = new Text({ text: '', style: this.monoStyle })
      t.position.set(0, 0)
      this.lineTexts.push(t)
      this.container.addChild(t)
    }
  }

  tick(dt: number) {
    this.progress = Math.min(1, this.progress + dt / this.duration)

    // Terminal stays at the END position (the node), not moving
    this.container.position.set(this.endPos.x, this.endPos.y)

    // Alpha: fade in first 10%, stay, fade out last 15%
    const fadeIn = Math.min(1, this.progress * 10)
    const fadeOut = this.progress > 0.85 ? (1 - this.progress) / 0.15 : 1.0
    const alpha = fadeIn * fadeOut

    // Redraw terminal background
    this.graphics.clear()

    // Terminal background
    const bgX = -TERM_W / 2
    const bgY = -TERM_H / 2
    this.graphics
      .roundRect(bgX, bgY, TERM_W, TERM_H, 3)
      .fill({ color: 0x1a1a2e, alpha: alpha * 0.92 })

    // Title bar background
    this.graphics
      .rect(bgX, bgY, TERM_W, TITLE_BAR_H)
      .fill({ color: 0x2a2a3e, alpha: alpha * 0.95 })

    // Title bar dots
    const dotY = bgY + TITLE_BAR_H / 2
    const dotR = 1.5
    const dotStartX = bgX + 5
    this.graphics.circle(dotStartX, dotY, dotR).fill({ color: 0xff5f56, alpha })
    this.graphics.circle(dotStartX + 5, dotY, dotR).fill({ color: 0xffbd2e, alpha })
    this.graphics.circle(dotStartX + 10, dotY, dotR).fill({ color: 0x27c93f, alpha })

    // Scanline overlay
    for (let sy = bgY + TITLE_BAR_H; sy < bgY + TERM_H; sy += 2) {
      this.graphics.rect(bgX, sy, TERM_W, 1).fill({ color: 0xffffff, alpha: 0.03 * alpha })
    }

    // Scrolling text
    const scrollOffset = this.progress * TERMINAL_LINES.length * 0.8
    const startLine = Math.floor(scrollOffset)
    const fracOffset = scrollOffset - startLine

    const textAreaX = bgX + 3
    const textAreaTop = bgY + TITLE_BAR_H + 2

    for (let i = 0; i < VISIBLE_LINES; i++) {
      const lineIdx = (startLine + i) % TERMINAL_LINES.length
      const line = TERMINAL_LINES[lineIdx]
      const t = this.lineTexts[i]

      t.text = line
      const isPrompt = line.startsWith('>')
      t.style = isPrompt ? this.monoStyle : this.outputStyle
      t.position.set(textAreaX, textAreaTop + i * LINE_H - fracOffset * LINE_H)
      t.alpha = alpha

      // Clip: hide if outside terminal bounds
      const tY = t.position.y
      if (tY < textAreaTop - 1 || tY > bgY + TERM_H - LINE_H) {
        t.alpha = 0
      }
    }
  }

  destroy(): void {
    for (const t of this.lineTexts) {
      t.destroy()
    }
    this.graphics.destroy()
    super.destroy()
  }
}
