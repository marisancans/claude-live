import { Container, Graphics, Text, Sprite } from 'pixi.js'
import type { GraphNode } from '../../types'
import { ORBIT_RADII, parseModelFamily, MODEL_COLORS } from '../../constants'
import { PlasmaCore } from '../shaders/PlasmaCore'

/**
 * Visual representation of a node (file, tool, etc.) in the solar system.
 * Contains: glow, colored sprite, label, and impact effect graphics.
 * Handles orbital positioning, entry animation, and lifecycle decay.
 */
export class NodeObject {
  container: Container
  data: GraphNode
  nodeLabel: Text | null = null
  impactGraphics: Graphics | null = null
  actionLabel: Text | null = null
  private actionFade: number = 0

  // Main graphics object redrawn each tick
  private gfx: Graphics
  private gfxDirty: boolean = true  // only redraw when state changes
  private _redrawAccum: number = 0
  private static REDRAW_INTERVAL = 1 / 20 // 20fps max for agent node spin

  // Orbital/animation state
  private entryProgress: number = 1 // instant display, no fade-in
  private orbitRadii = ORBIT_RADII
  private time: number = 0

  // Interaction state
  isHovered: boolean = false
  isSelected: boolean = false
  private baseRadius: number

  // Lifecycle state
  private life: number = 1.0 // 1.0 -> 0.0 for removal animation
  isRemoved: boolean = false

  // Impact glow boost
  private impactTime: number = 0

  // Compaction distortion (set externally by WorldLayer from cluster state)
  compacting: number = 0
  compacted: number = 0

  // Mini plasma for agent nodes
  private agentPlasma: PlasmaCore | null = null
  private agentPlasmaSprite: Sprite | null = null

  constructor(node: GraphNode) {
    this.data = node
    this.container = new Container()
    this.entryProgress = 1
    this.baseRadius = Math.max(2, node.baseRadius)
    this.life = node.life ?? 1.0
    this.impactTime = node.impactTime ?? 0

    // Main graphics redrawn each tick
    this.gfx = new Graphics()
    this.container.addChild(this.gfx)

    // Agent nodes get a mini plasma core
    if (node.nodeType === 'agent') {
      try {
        this.agentPlasma = new PlasmaCore(32)
        this.agentPlasmaSprite = new Sprite(this.agentPlasma.texture)
        this.agentPlasmaSprite.anchor.set(0.5)
        this.agentPlasmaSprite.width = 12
        this.agentPlasmaSprite.height = 12
        this.container.addChildAt(this.agentPlasmaSprite, 0)
      } catch (_) { /* fallback to gfx */ }
    }

    this.createNodeLabel()
    this.updatePosition()

    // Make container interactive
    this.container.eventMode = 'static' as any
    this.container.cursor = 'pointer'
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
   * Redraw the node graphics when state has changed.
   * Agent nodes always redraw (spinning ring). File/ephemeral only redraw when dirty.
   */
  private redrawNode() {
    if (!this.gfxDirty) return
    this.gfxDirty = false
    this.gfx.clear()

    const entry = Math.min(1, this.entryProgress)
    if (entry <= 0.01) return

    const r = this.baseRadius
    const color = this.data.color

    if (this.data.nodeType === 'agent') {
      this.drawAgentNode(r, color, entry)
    } else if (this.data.nodeType === 'file') {
      this.drawFileNode(r, color, entry)
    } else {
      this.drawEphemeralNode(r, color, entry)
    }
  }

  /**
   * Draw a file node: circle with glow and impact boost.
   */
  private drawFileNode(r: number, color: number, entry: number) {
    const life = this.life

    // Glow behind node
    const glowAlpha = 0.12 * life * entry + (this.impactTime > 0 ? this.impactTime * 0.3 : 0)
    if (glowAlpha > 0.01) {
      this.gfx.circle(0, 0, r * 2.5).fill({ color, alpha: glowAlpha })
    }

    // Morph bump
    const bump = this.data.impactType === 'morph' ? this.data.impactTime * 1.8 : 0
    const dr = r + bump

    // Core circle
    this.gfx.circle(0, 0, dr).fill({ color, alpha: 0.9 * entry })
  }

  /**
   * Draw an ephemeral (non-file, non-agent) node: diamond with glow.
   */
  private drawEphemeralNode(r: number, color: number, entry: number) {
    const sz = r * Math.min(1, entry)

    // Glow on impact
    if (this.impactTime > 0.1) {
      const glowAlpha = entry * this.impactTime * 0.15
      this.gfx.circle(0, 0, sz * 3).fill({ color, alpha: glowAlpha })
    }

    // Diamond shape (rotated square) drawn as a polygon
    this.gfx.poly([0, -sz, sz, 0, 0, sz, -sz, 0]).fill({ color, alpha: entry * 0.9 })
  }

  /**
   * Draw an agent node: spinning dashed ring + plasma core (or diamond fallback).
   */
  private drawAgentNode(r: number, color: number, entry: number) {
    const ringR = 9
    const spinAngle = this.time * 2.5

    // Soft glow behind
    this.gfx.circle(0, 0, ringR * 2).fill({ color, alpha: 0.2 * entry })

    // Spinning dashed ring: 6 arc segments
    const SEGS = 6
    for (let s = 0; s < SEGS; s++) {
      const a1 = (s / SEGS) * Math.PI * 2 + spinAngle
      const a2 = ((s + 0.38) / SEGS) * Math.PI * 2 + spinAngle
      this.gfx.arc(0, 0, ringR, a1, a2).stroke({ width: 1, color, alpha: entry * 0.8 })
      if (s < SEGS - 1) {
        const nextA1 = ((s + 1) / SEGS) * Math.PI * 2 + spinAngle
        this.gfx.moveTo(Math.cos(nextA1) * ringR, Math.sin(nextA1) * ringR)
      }
    }

    // If no plasma sprite, draw diamond fallback
    if (!this.agentPlasma) {
      const sz = 1.8
      const diamondAngle = Math.PI / 4 + this.time * 1.5
      const cos = Math.cos(diamondAngle), sin = Math.sin(diamondAngle)
      const verts = [
        -sz * cos - (-sz) * sin, -sz * sin + (-sz) * cos,
         sz * cos - (-sz) * sin,  sz * sin + (-sz) * cos,
         sz * cos -   sz  * sin,  sz * sin +   sz  * cos,
        -sz * cos -   sz  * sin, -sz * sin +   sz  * cos,
      ]
      this.gfx.poly(verts).fill({ color, alpha: entry })
    }
  }

  /**
   * Play an impact animation (scan, morph, spark, ping, fade, fail).
   * Driven by tick() to avoid dangling requestAnimationFrame loops.
   */
  playImpact(type: 'scan' | 'morph' | 'spark' | 'ping' | 'fade' | 'fail') {
    this.impactTime = 1.0
    this.gfxDirty = true

    // Reuse existing impact graphics or create new
    if (!this.impactGraphics) {
      this.impactGraphics = new Graphics()
      this.container.addChild(this.impactGraphics)
    }
    this.impactType = type
    this.impactProgress = 1.0
  }

  private impactType: 'scan' | 'morph' | 'spark' | 'ping' | 'fade' | 'fail' | null = null
  private impactProgress: number = 0
  private readonly IMPACT_SPEED = 1 / 0.4 // 400ms

  private tickImpact(dt: number) {
    if (!this.impactGraphics || this.impactType === null) return

    this.impactProgress -= dt * this.IMPACT_SPEED
    if (this.impactProgress <= 0) {
      this.container.removeChild(this.impactGraphics)
      this.impactGraphics.destroy()
      this.impactGraphics = null
      this.impactType = null
      return
    }

    const progress = this.impactProgress
    const r = this.data.baseRadius
    this.impactGraphics.clear()

    switch (this.impactType) {
      case 'scan': {
        this.impactGraphics.circle(0, 0, r + progress * 15).stroke({ width: 1.5, color: 0x4ade80, alpha: progress * 0.8 })
        break
      }
      case 'spark': {
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2
          const dist = (1 - progress) * 20
          this.impactGraphics.circle(Math.cos(angle) * dist, Math.sin(angle) * dist, 2).fill({ color: 0xff6b35, alpha: progress * 0.8 })
        }
        break
      }
      case 'ping': {
        this.impactGraphics.circle(0, 0, r + (1 - progress) * 12).stroke({ width: 1, color: 0x4ade80, alpha: progress * 0.6 })
        this.impactGraphics.circle(0, 0, r + (1 - progress) * 22).stroke({ width: 1, color: 0x4ade80, alpha: progress * 0.3 })
        break
      }
      case 'fade': {
        this.impactGraphics.circle(0, 0, r + (1 - progress) * 8).fill({ color: 0xffffff, alpha: progress * 0.5 })
        break
      }
      case 'fail': {
        const scale = 8 + progress * 4
        this.impactGraphics.moveTo(-scale, -scale).lineTo(scale, scale).stroke({ width: 2, color: 0xff0000, alpha: progress * 0.8 })
        this.impactGraphics.moveTo(scale, -scale).lineTo(-scale, scale).stroke({ width: 2, color: 0xff0000, alpha: progress * 0.8 })
        break
      }
      case 'morph': {
        this.impactGraphics.circle(0, 0, r + (1 - progress) * 8).stroke({ width: 1, color: 0x9d4edd, alpha: progress * 0.7 })
        this.impactGraphics.circle(0, 0, r + (1 - progress) * 16).stroke({ width: 1, color: 0x9d4edd, alpha: progress * 0.4 })
        break
      }
    }
  }

  tick(dt: number) {
    // Advance animation time
    this.time += dt

    // Tick impact animation (driven here, not via rAF)
    this.tickImpact(dt)

    // Decay impact time (~750ms total at 60fps: 1.0 / 0.022 ~= 45 frames)
    if (this.impactTime > 0) {
      this.impactTime -= 0.022
      if (this.impactTime < 0) this.impactTime = 0
      this.gfxDirty = true
    }

    // Update lifecycle (fade out when life depletes)
    if (this.data.life < 1.0) {
      const newLife = Math.max(0, this.data.life)
      if (newLife !== this.life) { this.life = newLife; this.gfxDirty = true }
      if (this.life <= 0) {
        this.isRemoved = true
      }
    }

    // Update orbital position
    this.updatePosition()

    // Update agent plasma
    if (this.agentPlasma && this.agentPlasmaSprite) {
      if (Math.floor(this.time * 60) % 4 === 0) {
        const colors = MODEL_COLORS.unknown // agents use parent color, default for now
        this.agentPlasma.update(this.time, this.impactTime, 0.5, colors.base, colors.bright)
      }
      this.agentPlasmaSprite.alpha = this.life
    }

    // Agent nodes spin — throttle to 20fps to limit GPU geometry churn
    if (this.data.nodeType === 'agent') {
      this._redrawAccum += dt
      if (this._redrawAccum >= NodeObject.REDRAW_INTERVAL) {
        this._redrawAccum = 0
        this.gfxDirty = true
      }
    }

    // Redraw node graphics (glow, body, agent effects)
    this.redrawNode()

    // Animate action label: float upward and fade out
    if (this.actionLabel && this.actionFade > 0) {
      this.actionFade -= dt * 0.25 // ~4s visible
      this.actionLabel.alpha = Math.max(0, this.actionFade * 0.9)
      this.actionLabel.position.y -= dt * 3 // slow float up
      if (this.actionFade <= 0) {
        this.container.removeChild(this.actionLabel)
        this.actionLabel.destroy()
        this.actionLabel = null
        this.actionFade = 0
      }
    }

    let alpha = this.life
    // Compaction: dim during implosion, brighten during rebirth
    if (this.compacting > 0.1) {
      alpha *= (1 - this.compacting * 0.6)
    } else if (this.compacted > 0.1) {
      alpha = Math.min(1, alpha * (1 + this.compacted * 0.3))
    }
    this.container.alpha = alpha

    let scale = this.life
    // Compaction: shrink during implosion, pulse bigger during rebirth
    if (this.compacting > 0.1) {
      scale *= (1 - this.compacting * 0.3)
    } else if (this.compacted > 0.2) {
      scale *= (1 + this.compacted * 0.15)
    }

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
    // No label to scale — tooltip handles hover info
  }

  /**
   * Set selected state and apply visual feedback.
   */
  setSelected(selected: boolean) {
    this.isSelected = selected
    // No label to scale — sidebar handles selection info
  }

  /**
   * Show a floating action label above the node.
   * The label floats upward and fades out over time.
   */
  showAction(label: string, color: number) {
    // Remove any existing action label
    if (this.actionLabel) {
      this.container.removeChild(this.actionLabel)
      this.actionLabel.destroy()
    }

    this.actionLabel = new Text({
      text: label,
      style: {
        fontSize: 7,
        fontFamily: 'monospace',
        fill: color,
        align: 'center',
      },
    })
    this.actionLabel.anchor.set(0.5, 1)
    this.actionLabel.position.set(0, -(this.baseRadius + 8))
    this.actionLabel.alpha = 0.9
    this.actionFade = 1.0
    this.container.addChild(this.actionLabel)
  }

  /**
   * Calculate position based on orbital parameters.
   * Supports both circular orbits (file nodes) and ephemeral placement.
   */
  private updatePosition() {
    // Ephemeral nodes (non-file) use fixed orbitRadius
    if (this.data.nodeType !== 'file') {
      const angle = this.data.orbitAngle
      let radius = this.data.orbitRadius
      // Compaction distortion: pull inward during implosion, push outward during rebirth
      if (this.compacting > 0.1) {
        radius *= (1 - this.compacting * 0.4)
      } else if (this.compacted > 0.1) {
        radius *= (1 + this.compacted * 0.2)
      }
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      this.container.position.set(x, y)
      return
    }

    // File nodes orbit in rings based on orbitRing index
    const ring = Math.max(0, Math.min(this.data.orbitRing, this.orbitRadii.length - 1))
    let radius = this.orbitRadii[ring]

    // Compaction distortion: pull inward during implosion, push outward during rebirth
    if (this.compacting > 0.1) {
      radius *= (1 - this.compacting * 0.4)
    } else if (this.compacted > 0.1) {
      radius *= (1 + this.compacted * 0.2)
    }

    // Apply orbital angle for rotation
    const angle = this.data.orbitAngle
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius

    this.container.position.set(x, y)
  }

  destroy() {
    if (this.actionLabel) {
      this.actionLabel.destroy()
      this.actionLabel = null
    }
    if (this.impactGraphics) {
      this.impactGraphics.destroy()
      this.impactGraphics = null
    }
    this.agentPlasma?.destroy()
    this.agentPlasma = null
    this.container.destroy({ children: true })
  }
}
