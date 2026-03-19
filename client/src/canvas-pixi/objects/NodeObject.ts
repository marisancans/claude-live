import { Container, Sprite, Graphics, Text } from 'pixi.js'
import type { GraphNode } from '../../types'

/**
 * Visual representation of a node (file, tool, etc.) in the solar system.
 * Contains: colored sprite, label, and impact effect graphics.
 * Handles orbital positioning, entry animation, and lifecycle decay.
 */
export class NodeObject {
  container: Container
  data: GraphNode
  nodeSprite: Sprite | null = null
  nodeLabel: Text | null = null
  impactGraphics: Graphics | null = null

  // Orbital/animation state
  private entryProgress: number = 0 // 0 → 1 for entry fade/scale
  private orbitRadii = [70, 120, 175, 225] // Match ClusterObject ORBIT_RADII

  // Interaction state
  isHovered: boolean = false
  isSelected: boolean = false
  private baseRadius: number

  // Lifecycle state
  private life: number = 1.0 // 1.0 → 0.0 for removal animation
  isRemoved: boolean = false

  constructor(node: GraphNode) {
    this.data = node
    this.container = new Container()
    this.entryProgress = node.entry ?? 0
    this.baseRadius = Math.max(2, node.baseRadius)
    this.life = node.life ?? 1.0

    this.createNodeSprite()
    this.createNodeLabel()
    this.updatePosition()

    // Make container interactive
    this.container.eventMode = 'static' as any
    this.container.cursor = 'pointer'
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
    // Update entry animation
    if (this.entryProgress < 1.0) {
      this.entryProgress = Math.min(1.0, this.entryProgress + dt / 0.4) // 0.4s entry animation
      this.data.entry = this.entryProgress
    }

    // Update lifecycle (fade out when life depletes)
    if (this.data.life < 1.0) {
      this.life = Math.max(0, this.data.life)
      if (this.life <= 0) {
        this.isRemoved = true
      }
    }

    // Update orbital position
    this.updatePosition()

    // Apply entry animation (fade in + scale)
    let alpha = this.entryProgress * this.life // Fade in, then fade out with life decay
    this.container.alpha = alpha

    let scale = 0.5 + this.entryProgress * 0.5 // 0.5 → 1.0 scale
    scale *= this.life // Scale down as life depletes

    // Apply hover/select feedback
    if (this.isSelected) {
      scale *= 1.3 // Scale up when selected
    } else if (this.isHovered) {
      scale *= 1.15 // Scale up when hovered
    }

    this.container.scale.set(scale)
  }

  /**
   * Set hover state and apply visual feedback.
   */
  setHovered(hovered: boolean) {
    this.isHovered = hovered
    if (hovered) {
      // Increase glow or outline when hovered
      this.nodeLabel?.scale.set(1.1)
    } else {
      this.nodeLabel?.scale.set(1.0)
    }
  }

  /**
   * Set selected state and apply visual feedback.
   */
  setSelected(selected: boolean) {
    this.isSelected = selected
    if (selected) {
      // Pulse or outline when selected
      this.nodeLabel?.scale.set(1.2)
    } else {
      this.nodeLabel?.scale.set(1.0)
    }
  }

  /**
   * Calculate position based on orbital parameters.
   * Supports both circular orbits (file nodes) and ephemeral placement.
   */
  private updatePosition() {
    // Ephemeral nodes (non-file) use fixed orbitRadius
    if (this.data.nodeType !== 'file') {
      const angle = this.data.orbitAngle
      const radius = this.data.orbitRadius
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      this.container.position.set(x, y)
      return
    }

    // File nodes orbit in rings based on orbitRing index
    const ring = Math.max(0, Math.min(this.data.orbitRing, this.orbitRadii.length - 1))
    const radius = this.orbitRadii[ring]

    // Apply orbital angle for rotation
    const angle = this.data.orbitAngle
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius

    this.container.position.set(x, y)
  }

  destroy() {
    this.container.destroy()
  }
}
