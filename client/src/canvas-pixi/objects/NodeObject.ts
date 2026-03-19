import { Container, Sprite, Graphics, Text } from 'pixi.js'
import type { GraphNode } from '../../types'

/**
 * Visual representation of a node (file, tool, etc.) in the solar system.
 * Contains: colored sprite, label, and impact effect graphics.
 */
export class NodeObject {
  container: Container
  data: GraphNode
  nodeSprite: Sprite | null = null
  nodeLabel: Text | null = null
  impactGraphics: Graphics | null = null

  constructor(node: GraphNode) {
    this.data = node
    this.container = new Container()
    this.container.position.set(node.x, node.y)

    this.createNodeSprite()
    this.createNodeLabel()
  }

  /**
   * Create the colored node sprite.
   * In PixiJS v8, add Graphics directly without Sprite.from() wrapper.
   */
  private createNodeSprite() {
    const g = new Graphics()
    const r = Math.max(2, this.data.baseRadius)

    // File nodes: circle; others: slightly different shape
    if (this.data.nodeType === 'file') {
      g.circle(0, 0, r).fill({ color: this.data.color, alpha: 0.9 })
    } else {
      g.circle(0, 0, r).fill({ color: this.data.color, alpha: 0.8 })
    }

    g.position.set(0, 0)
    this.container.addChild(g)
    this.nodeSprite = null // Track as Graphics, not Sprite
  }

  /**
   * Create label below/near node.
   * PixiJS v8 Text constructor: new Text({ text, style: { ... } })
   */
  private createNodeLabel() {
    this.nodeLabel = new Text({
      text: this.data.label,
      style: {
        fontSize: 7,
        fontFamily: 'monospace',
        fill: 0xcccccc,
        align: 'center',
      },
    })
    this.nodeLabel.position.set(0, this.data.baseRadius + 6)
    this.container.addChild(this.nodeLabel)
  }

  /**
   * Play an impact animation (scan, morph, spark, ping, fade, fail).
   * Creates animated Graphics that ticks down and removes itself.
   */
  playImpact(type: 'scan' | 'morph' | 'spark' | 'ping' | 'fade' | 'fail') {
    const impactGraphics = new Graphics()
    this.container.addChild(impactGraphics)

    let progress = 1 // Count down from 1 to 0
    const duration = 0.4 // 400ms animation
    const speed = 1 / (duration * 60) // Assuming 60 FPS

    const animate = () => {
      progress -= speed
      if (progress <= 0) {
        this.container.removeChild(impactGraphics)
        impactGraphics.destroy()
        return
      }

      impactGraphics.clear()
      const r = this.data.baseRadius

      switch (type) {
        case 'scan': {
          // Expanding ring scan
          const radius = r + progress * 15
          const alpha = progress * 0.8
          impactGraphics.circle(0, 0, radius).stroke({ width: 1.5, color: 0x4ade80, alpha })
          break
        }
        case 'spark': {
          // Spark burst: 6 rays radiating
          const alpha = progress * 0.8
          for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2
            const dist = (1 - progress) * 20
            const x = Math.cos(angle) * dist
            const y = Math.sin(angle) * dist
            impactGraphics.circle(x, y, 2).fill({ color: 0xff6b35, alpha })
          }
          break
        }
        case 'ping': {
          // Concentric ping circles
          const ring1 = r + (1 - progress) * 12
          const ring2 = r + (1 - progress) * 22
          impactGraphics.circle(0, 0, ring1).stroke({ width: 1, color: 0x4ade80, alpha: progress * 0.6 })
          impactGraphics.circle(0, 0, ring2).stroke({ width: 1, color: 0x4ade80, alpha: progress * 0.3 })
          break
        }
        case 'fade': {
          // Fade pulse: shrinking filled circle
          const radius = r + (1 - progress) * 8
          const alpha = progress * 0.5
          impactGraphics.circle(0, 0, radius).fill({ color: 0xffffff, alpha })
          break
        }
        case 'fail': {
          // X-mark flash
          const scale = 8 + progress * 4
          const alpha = progress * 0.8
          impactGraphics.moveTo(-scale, -scale).lineTo(scale, scale).stroke({ width: 2, color: 0xff0000, alpha })
          impactGraphics.moveTo(scale, -scale).lineTo(-scale, scale).stroke({ width: 2, color: 0xff0000, alpha })
          break
        }
        case 'morph': {
          // Double ring morphing
          const ring1 = r + (1 - progress) * 8
          const ring2 = r + (1 - progress) * 16
          impactGraphics.circle(0, 0, ring1).stroke({ width: 1, color: 0x9d4edd, alpha: progress * 0.7 })
          impactGraphics.circle(0, 0, ring2).stroke({ width: 1, color: 0x9d4edd, alpha: progress * 0.4 })
          break
        }
      }

      requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
  }

  tick(dt: number) {
    // Update position from data
    this.container.position.set(this.data.x, this.data.y)

    // TODO: update entry animation, life decay
  }

  destroy() {
    this.container.destroy()
  }
}
