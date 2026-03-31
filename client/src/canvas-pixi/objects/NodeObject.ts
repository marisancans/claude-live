import { Container, Graphics, Text, Sprite } from 'pixi.js'
import type { GraphNode } from '../../types'
import { ORBIT_RADII, parseModelFamily, MODEL_COLORS } from '../../constants'
import { PlasmaCore } from '../shaders/PlasmaCore'
import {
  getCircleGlowTexture,
  getCircleSolidTexture,
  getDiamondTexture,
  getAgentRingTexture,
  spriteFromTexture,
} from '../textures/NodeTextures'

/**
 * Visual representation of a node (file, tool, etc.) in the solar system.
 *
 * Architecture: NO per-frame Graphics.clear(). All visuals are Sprites from
 * pre-rendered textures. Animation is transform-only (position, scale, alpha,
 * rotation) which is free — no GPU geometry churn.
 *
 * Only exception: impactGraphics is a short-lived Graphics (~400ms) created
 * on-demand during impacts, which is acceptable.
 */
export class NodeObject {
  container: Container
  data: GraphNode
  nodeLabel: Text | null = null
  impactGraphics: Graphics | null = null
  actionLabel: Text | null = null
  private actionFade: number = 0

  // Sprite-based visuals (no per-frame redraws)
  private glowSprite: Sprite | null = null
  private bodySprite: Sprite | null = null
  private agentRingSprite: Sprite | null = null

  // Orbital/animation state
  private orbitRadii = ORBIT_RADII
  private time: number = 0

  // Interaction state
  isHovered: boolean = false
  isSelected: boolean = false
  private baseRadius: number

  // Lifecycle state
  private life: number = 1.0
  isRemoved: boolean = false

  // Impact glow boost
  private impactTime: number = 0

  // Compaction distortion
  compacting: number = 0
  compacted: number = 0

  // Mini plasma for agent nodes
  private agentPlasma: PlasmaCore | null = null
  private agentPlasmaSprite: Sprite | null = null

  constructor(node: GraphNode) {
    this.data = node
    this.container = new Container()
    this.baseRadius = Math.max(2, node.baseRadius)
    this.life = node.life ?? 1.0
    this.impactTime = node.impactTime ?? 0

    if (node.nodeType === 'agent') {
      this.initAgentVisuals(node)
    } else if (node.nodeType === 'file') {
      this.initFileVisuals(node)
    } else {
      this.initEphemeralVisuals(node)
    }

    this.createNodeLabel()
    this.updatePosition()

    this.container.eventMode = 'static' as any
    this.container.cursor = 'pointer'
  }

  private initFileVisuals(node: GraphNode) {
    // Glow sprite (soft radial, behind body) — additive blend for light bleed
    const glowTex = getCircleGlowTexture(node.color)
    this.glowSprite = spriteFromTexture(glowTex)
    const glowScale = (this.baseRadius * 2.5) / 16
    this.glowSprite.scale.set(glowScale)
    this.glowSprite.blendMode = 'add'
    this.container.addChild(this.glowSprite)

    // Body sprite (solid circle)
    const bodyTex = getCircleSolidTexture(node.color)
    this.bodySprite = spriteFromTexture(bodyTex)
    const bodyScale = this.baseRadius / 8  // texture is 16px diameter, radius=8
    this.bodySprite.scale.set(bodyScale)
    this.container.addChild(this.bodySprite)
  }

  private initEphemeralVisuals(node: GraphNode) {
    // Diamond sprite
    const diamondTex = getDiamondTexture(node.color)
    this.bodySprite = spriteFromTexture(diamondTex)
    const sz = this.baseRadius / 8
    this.bodySprite.scale.set(sz)
    this.container.addChild(this.bodySprite)
  }

  private initAgentVisuals(node: GraphNode) {
    // Agent plasma core
    try {
      this.agentPlasma = new PlasmaCore(32)
      this.agentPlasmaSprite = new Sprite(this.agentPlasma.texture)
      this.agentPlasmaSprite.anchor.set(0.5)
      this.agentPlasmaSprite.width = 12
      this.agentPlasmaSprite.height = 12
      this.container.addChild(this.agentPlasmaSprite)
    } catch (_) { /* fallback below */ }

    // Spinning dashed ring — pre-rendered texture, rotation animated via transform
    const ringTex = getAgentRingTexture(node.color)
    this.agentRingSprite = spriteFromTexture(ringTex)
    const ringScale = 18 / 24  // target visual size / texture half-size
    this.agentRingSprite.scale.set(ringScale)
    this.container.addChild(this.agentRingSprite)

    // Glow behind agent — additive blend
    const glowTex = getCircleGlowTexture(node.color)
    this.glowSprite = spriteFromTexture(glowTex)
    this.glowSprite.scale.set(0.6)
    this.glowSprite.blendMode = 'add'
    this.container.addChildAt(this.glowSprite, 0)
  }

  private createNodeLabel() {
    this.nodeLabel = new Text({
      text: this.data.label,
      style: {
        fontSize: 7,
        fontFamily: 'monospace',
        fill: this.data.color,
        align: 'center',
      },
    })
    this.nodeLabel.anchor.set(0.5, 0)
    this.nodeLabel.position.set(0, this.baseRadius + 3)
    this.nodeLabel.alpha = 1.0
    this.container.addChild(this.nodeLabel)
  }

  /**
   * Play an impact animation (scan, morph, spark, ping, fade, fail).
   * Uses a short-lived Graphics — only exists for ~400ms during impacts.
   */
  playImpact(type: 'scan' | 'morph' | 'spark' | 'ping' | 'fade' | 'fail') {
    this.impactTime = 1.0

    if (!this.impactGraphics) {
      this.impactGraphics = new Graphics()
      this.container.addChild(this.impactGraphics)
    }
    this.impactType = type
    this.impactProgress = 1.0
  }

  private impactType: 'scan' | 'morph' | 'spark' | 'ping' | 'fade' | 'fail' | null = null
  private impactProgress: number = 0
  private readonly IMPACT_SPEED = 1 / 0.4

  private tickImpact(dt: number) {
    if (!this.impactGraphics || this.impactType === null) return

    this.impactProgress -= dt * this.IMPACT_SPEED
    if (this.impactProgress <= 0) {
      this.container.removeChild(this.impactGraphics)
      this.impactGraphics.destroy({ children: true })
      this.impactGraphics = null
      this.impactType = null
      return
    }

    const progress = this.impactProgress
    const r = this.data.baseRadius
    this.impactGraphics.clear()

    switch (this.impactType) {
      case 'scan':
        this.impactGraphics.circle(0, 0, r + progress * 15).stroke({ width: 1.5, color: 0x4ade80, alpha: progress * 0.8 })
        break
      case 'spark':
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2
          const dist = (1 - progress) * 20
          this.impactGraphics.circle(Math.cos(angle) * dist, Math.sin(angle) * dist, 2).fill({ color: 0xff6b35, alpha: progress * 0.8 })
        }
        break
      case 'ping':
        this.impactGraphics.circle(0, 0, r + (1 - progress) * 12).stroke({ width: 1, color: 0x4ade80, alpha: progress * 0.6 })
        this.impactGraphics.circle(0, 0, r + (1 - progress) * 22).stroke({ width: 1, color: 0x4ade80, alpha: progress * 0.3 })
        break
      case 'fade':
        this.impactGraphics.circle(0, 0, r + (1 - progress) * 8).fill({ color: 0xffffff, alpha: progress * 0.5 })
        break
      case 'fail': {
        const scale = 8 + progress * 4
        this.impactGraphics.moveTo(-scale, -scale).lineTo(scale, scale).stroke({ width: 2, color: 0xff0000, alpha: progress * 0.8 })
        this.impactGraphics.moveTo(scale, -scale).lineTo(-scale, scale).stroke({ width: 2, color: 0xff0000, alpha: progress * 0.8 })
        break
      }
      case 'morph':
        this.impactGraphics.circle(0, 0, r + (1 - progress) * 8).stroke({ width: 1, color: 0x9d4edd, alpha: progress * 0.7 })
        this.impactGraphics.circle(0, 0, r + (1 - progress) * 16).stroke({ width: 1, color: 0x9d4edd, alpha: progress * 0.4 })
        break
    }
  }

  tick(dt: number) {
    this.time += dt

    this.tickImpact(dt)

    if (this.impactTime > 0) {
      this.impactTime -= 0.022
      if (this.impactTime < 0) this.impactTime = 0
    }

    if (this.data.life < 1.0) {
      this.life = Math.max(0, this.data.life)
      if (this.life <= 0) {
        this.isRemoved = true
      }
    }

    this.updatePosition()

    // Agent plasma update (already throttled internally)
    if (this.agentPlasma && this.agentPlasmaSprite) {
      if (Math.floor(this.time * 60) % 4 === 0) {
        const colors = MODEL_COLORS.unknown
        this.agentPlasma.update(this.time, this.impactTime, 0.5, colors.base, colors.bright)
      }
      this.agentPlasmaSprite.alpha = this.life
    }

    // Agent ring spin — transform-only, no GPU churn
    if (this.agentRingSprite) {
      this.agentRingSprite.rotation = this.time * 2.5
    }

    // Breathing + glow: subtle ambient pulsing + boost during impact
    const breathe = 1 + 0.04 * Math.sin(this.time * 0.8 + this.data.key.length * 2.3)
    if (this.glowSprite) {
      const glowAlpha = 0.12 * this.life + (this.impactTime > 0 ? this.impactTime * 0.3 : 0)
      this.glowSprite.alpha = glowAlpha
      // Glow breathes slightly more than body
      const glowBreathe = 1 + 0.06 * Math.sin(this.time * 0.5 + this.data.key.length * 2.3)
      if (this.data.nodeType === 'file') {
        const glowScale = (this.baseRadius * 2.5) / 16
        this.glowSprite.scale.set(glowScale * glowBreathe)
      }
    }

    // Morph bump on body + breathing
    if (this.bodySprite && this.data.nodeType === 'file') {
      const bump = this.data.impactType === 'morph' ? this.data.impactTime * 1.8 : 0
      const bodyScale = (this.baseRadius + bump) / 8
      this.bodySprite.scale.set(bodyScale * breathe)
    }

    // Action label float/fade
    if (this.actionLabel && this.actionFade > 0) {
      this.actionFade -= dt * 0.25
      this.actionLabel.alpha = Math.max(0, this.actionFade * 0.9)
      this.actionLabel.position.y -= dt * 3
      if (this.actionFade <= 0) {
        this.container.removeChild(this.actionLabel)
        this.actionLabel.destroy()
        this.actionLabel = null
        this.actionFade = 0
      }
    }

    let alpha = this.life
    if (this.compacting > 0.1) {
      alpha *= (1 - this.compacting * 0.6)
    } else if (this.compacted > 0.1) {
      alpha = Math.min(1, alpha * (1 + this.compacted * 0.3))
    }
    this.container.alpha = alpha

    let scale = this.life
    if (this.compacting > 0.1) {
      scale *= (1 - this.compacting * 0.3)
    } else if (this.compacted > 0.2) {
      scale *= (1 + this.compacted * 0.15)
    }
    if (this.isSelected) scale *= 1.3
    else if (this.isHovered) scale *= 1.15

    this.container.scale.set(scale)
  }

  setHovered(hovered: boolean) { this.isHovered = hovered }
  setSelected(selected: boolean) { this.isSelected = selected }

  showAction(label: string, color: number) {
    if (this.actionLabel) {
      this.container.removeChild(this.actionLabel)
      this.actionLabel.destroy()
    }
    this.actionLabel = new Text({
      text: label,
      style: { fontSize: 7, fontFamily: 'monospace', fill: color, align: 'center' },
    })
    this.actionLabel.anchor.set(0.5, 1)
    this.actionLabel.position.set(0, -(this.baseRadius + 8))
    this.actionLabel.alpha = 0.9
    this.actionFade = 1.0
    this.container.addChild(this.actionLabel)
  }

  private updatePosition() {
    if (this.data.nodeType !== 'file') {
      const angle = this.data.orbitAngle
      let radius = this.data.orbitRadius
      if (this.compacting > 0.1) radius *= (1 - this.compacting * 0.4)
      else if (this.compacted > 0.1) radius *= (1 + this.compacted * 0.2)
      this.container.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius)
      return
    }
    const ring = Math.max(0, Math.min(this.data.orbitRing, this.orbitRadii.length - 1))
    let radius = this.orbitRadii[ring]
    if (this.compacting > 0.1) radius *= (1 - this.compacting * 0.4)
    else if (this.compacted > 0.1) radius *= (1 + this.compacted * 0.2)
    const angle = this.data.orbitAngle
    this.container.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius)
  }

  destroy() {
    if (this.actionLabel) { this.actionLabel.destroy(); this.actionLabel = null }
    if (this.impactGraphics) { this.impactGraphics.destroy({ children: true }); this.impactGraphics = null }
    this.agentPlasma?.destroy()
    this.agentPlasma = null
    // Don't destroy shared textures — they're cached in the atlas
    this.container.destroy({ children: true })
  }
}
