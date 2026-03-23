import { Container, Text, Graphics, Sprite } from 'pixi.js'
import type { Cluster } from '../../types'
import { ORBIT_RADII, parseModelFamily, MODEL_COLORS } from '../../constants'
import { PlasmaCore } from '../shaders/PlasmaCore'

/**
 * Visual representation of a cluster (session).
 * Contains: core glow, core body, animated ring, core label, orbit rings, and child nodes.
 */
export class ClusterObject {
  container: Container
  data: Cluster
  coreLabel: Text | null = null
  modelLabel: Text | null = null
  orbitRingGraphics: Graphics[] = []
  nodeObjects: Map<string, any> = new Map() // Will hold NodeObjects

  // Permission ring state
  permissionActive: boolean = false
  private permGfx: Graphics

  // Animation state
  private time: number = 0
  private coreAct: number = 0 // 1.0 when event arrives, decays toward 0
  private coreGfx: Graphics   // redrawn each tick
  private ringGfx: Graphics   // animated thin ring
  private seed: number = 0

  // Plasma core renderer
  private plasmaCore: PlasmaCore | null = null
  private plasmaSprite: Sprite | null = null
  private modelFamily: string = 'unknown'

  // Keep reference to cluster data for EdgeLayer
  get cluster(): Cluster {
    return this.data
  }

  constructor(cluster: Cluster) {
    this.data = cluster
    this.container = new Container()
    this.container.position.set(cluster.centerX, cluster.centerY)

    // Deterministic seed from session ID
    let h = 0
    for (let i = 0; i < cluster.sessionId.length; i++) {
      h = Math.imul(h ^ cluster.sessionId.charCodeAt(i), 0x01000193)
    }
    this.seed = ((h >>> 0) % 10000) / 10000

    // Determine model family for color
    this.modelFamily = parseModelFamily((cluster as any).model || '')

    // Graphics objects that redraw every frame
    this.coreGfx = new Graphics()
    this.ringGfx = new Graphics()
    this.permGfx = new Graphics()

    // Plasma core: CPU-rendered into offscreen canvas, displayed as sprite
    try {
      this.plasmaCore = new PlasmaCore(48)
      this.plasmaSprite = new Sprite(this.plasmaCore.texture)
      this.plasmaSprite.anchor.set(0.5)
      const visualSize = cluster.isChild ? 22 : 32
      this.plasmaSprite.width = visualSize
      this.plasmaSprite.height = visualSize
      this.container.addChild(this.plasmaSprite)
    } catch (e) {
      console.warn('PlasmaCore failed, falling back to Graphics core:', e)
      this.plasmaCore = null
      this.plasmaSprite = null
    }

    this.container.addChild(this.coreGfx)
    this.container.addChild(this.ringGfx)
    this.container.addChild(this.permGfx)

    this.createCoreLabel()
    this.createModelLabel()
  }

  /**
   * Create label below core.
   * PixiJS v8 Text constructor: new Text({ text, style: { ... } })
   */
  private createCoreLabel() {
    const isChild = this.data.isChild
    const prefix = isChild ? 'agent' : 'session'
    const colors = MODEL_COLORS[this.modelFamily] || MODEL_COLORS.unknown
    this.coreLabel = new Text({
      text: `${prefix}:${this.data.label}`,
      style: {
        fontSize: 11,
        fontFamily: 'monospace',
        fill: colors.brightHex,
        align: 'center',
      },
    })
    // Position below the core
    const coreR = isChild ? 4.5 : 7
    this.coreLabel.anchor.set(0.5, 0)
    this.coreLabel.position.set(0, coreR + 6)
    this.coreLabel.alpha = isChild ? 0.65 : 0.7
    this.container.addChild(this.coreLabel)
  }

  /**
   * Create model label below core label, showing the model name.
   */
  private createModelLabel() {
    const model = (this.data as any).model as string | undefined
    if (!model) return

    // Show just the family name: "opus 4", "sonnet 4.5", etc.
    const family = parseModelFamily(model)
    // Extract version: "claude-sonnet-4-5-20250514" → "4.5"
    const vMatch = model.match(/(\d+)[-.](\d+)/)
    const ver = vMatch ? `${vMatch[1]}.${vMatch[2]}` : ''
    const displayModel = ver ? `${family} ${ver}` : family
    const colors = MODEL_COLORS[family] || MODEL_COLORS.unknown
    this.modelLabel = new Text({
      text: displayModel,
      style: {
        fontSize: 7,
        fontFamily: 'monospace',
        fill: colors.brightHex,
        align: 'center',
      },
    })
    const isChild = this.data.isChild
    const coreR = isChild ? 4.5 : 7
    this.modelLabel.anchor.set(0.5, 0)
    // Position below the core label (core label is at coreR + 6, text height ~12px)
    this.modelLabel.position.set(0, coreR + 20)
    this.modelLabel.alpha = 0.5
    this.container.addChild(this.modelLabel)
  }

  /**
   * Set permission ring active state.
   */
  setPermission(active: boolean) {
    this.permissionActive = active
    if (!active) {
      this.permGfx.clear()
    }
  }

  /**
   * Create orbit ring graphics (redrawn only when ring membership changes).
   */
  updateOrbitRings() {
    // Remove old rings
    for (const ring of this.orbitRingGraphics) {
      this.container.removeChild(ring)
    }
    this.orbitRingGraphics = []

    // Draw new rings based on ringCounts
    for (let i = 0; i < this.data.ringCounts.length; i++) {
      if (this.data.ringCounts[i] > 0) {
        const g = new Graphics()
        const radius = ORBIT_RADII[i] || ORBIT_RADII[ORBIT_RADII.length - 1]
        g.circle(0, 0, radius).stroke({ width: 0.6, color: 0xffffff, alpha: 0.045 })

        this.container.addChildAt(g, 0) // Add behind nodes
        this.orbitRingGraphics.push(g)
      }
    }
  }

  /**
   * Called when an event arrives to trigger activity pulse.
   */
  triggerActivity() {
    this.coreAct = 1
  }

  tick(dt: number) {
    // Update cluster position
    this.container.position.set(this.data.centerX, this.data.centerY)

    // Advance animation time
    this.time += dt

    // Decay activity
    if (this.coreAct > 0) {
      this.coreAct = Math.max(0, this.coreAct - 0.02)
    }

    // Redraw core each frame
    this.redrawCore()

    // Draw permission ring when active
    this.redrawPermissionRing()

    // Distort orbit rings during compaction (scale inward during implosion, outward during rebirth)
    const compacting = this.data.compacting ?? 0
    const compacted = this.data.compacted ?? 0
    for (const ring of this.orbitRingGraphics) {
      if (compacting > 0.1) {
        // Squeeze rings toward center
        const squeeze = 1 - compacting * 0.3
        ring.scale.set(squeeze)
        ring.alpha = (1 - compacting * 0.6) * 0.045 / 0.045 // dim as they collapse
      } else if (compacted > 0.1) {
        // Rings expand slightly then return to normal
        const expand = 1 + compacted * 0.15
        ring.scale.set(expand)
        ring.alpha = 1
      } else {
        ring.scale.set(1)
        ring.alpha = 1
      }
    }

    // Update model label if it appeared or changed
    const currentModel = (this.data as any).model as string | undefined
    if (currentModel) {
      const currentFamily = parseModelFamily(currentModel)
      if (!this.modelLabel) {
        this.createModelLabel()
      } else if (currentFamily !== this.modelFamily) {
        // Model changed — recreate label
        this.container.removeChild(this.modelLabel)
        this.modelLabel.destroy()
        this.modelLabel = null
        this.createModelLabel()
      }
    }
  }

  /**
   * Redraw core glow, body, and ring each frame for animation.
   */
  private redrawCore() {
    const isChild = this.data.isChild
    const baseR = isChild ? 4.5 : 7
    const t = this.time
    const act = this.coreAct
    const s = this.seed
    const compacting = this.data.compacting ?? 0
    const compacted = this.data.compacted ?? 0

    // Update model family if it changed (e.g. model info arrived late)
    if ((this.data as any).model) {
      const fam = parseModelFamily((this.data as any).model)
      if (fam !== this.modelFamily) this.modelFamily = fam
    }

    const colors = MODEL_COLORS[this.modelFamily] || MODEL_COLORS.unknown
    let glowColor = colors.glow
    let coreColor = colors.core
    let brightColor = colors.brightHex
    let baseCol = colors.base
    let brightCol = colors.bright

    // Update label color when model family changes
    if (this.coreLabel) {
      (this.coreLabel.style as any).fill = colors.brightHex
    }

    // Gentle breathing pulse — disrupted during compaction
    let breathe = 1 + Math.sin(t * 0.8 + s * 6) * 0.03 + act * 0.12
    if (compacting > 0.1) {
      breathe *= (1 - compacting * 0.4)
      breathe += Math.sin(t * 20) * compacting * 0.08
      glowColor = 0x304080
      coreColor = 0x506090
      brightColor = 0x8090C0
      baseCol = [0.19, 0.25, 0.5]
      brightCol = [0.31, 0.38, 0.75]
    } else if (compacted > 0.1) {
      breathe *= (1 + compacted * 0.5)
      glowColor = 0xFFD060
      coreColor = 0xFFF0C0
      brightColor = 0xFFFFFF
      baseCol = [1.0, 0.82, 0.38]
      brightCol = [1.0, 0.94, 0.75]
    }
    const coreR = baseR * breathe

    // ===== PLASMA CORE =====
    if (this.plasmaCore && this.plasmaSprite) {
      // Update plasma texture every 3rd frame for performance
      if (Math.floor(t * 60) % 3 === 0) {
        this.plasmaCore.update(t, act, s, baseCol as [number, number, number], brightCol as [number, number, number])
      }
      const visualSize = (isChild ? 22 : 32) * breathe
      this.plasmaSprite.width = visualSize
      this.plasmaSprite.height = visualSize
    }

    // ===== CORE GFX: ambient glow layers behind plasma =====
    this.coreGfx.clear()
    this.coreGfx.circle(0, 0, coreR * 4).fill({ color: glowColor, alpha: 0.03 + act * 0.03 })
    this.coreGfx.circle(0, 0, coreR * 2.5).fill({ color: glowColor, alpha: 0.05 + act * 0.04 })
    this.coreGfx.circle(0, 0, coreR * 1.5).fill({ color: glowColor, alpha: 0.08 + act * 0.05 })

    // Activity flare: expanding bright ring
    if (act > 0.05) {
      const flareR = coreR * (1.5 + (1 - act) * 2)
      this.coreGfx.circle(0, 0, flareR).stroke({ width: 1.5 * act, color: brightColor, alpha: act * 0.5 })
    }

    // Fallback: if plasma failed, draw simple core body
    if (!this.plasmaCore) {
      this.coreGfx.circle(0, 0, coreR * 1.2).fill({ color: coreColor, alpha: 0.5 })
      this.coreGfx.circle(0, 0, coreR).fill({ color: coreColor, alpha: 0.85 })
      this.coreGfx.circle(0, 0, coreR * 0.55).fill({ color: brightColor, alpha: 0.6 })
      this.coreGfx.circle(0, 0, coreR * 0.25).fill({ color: 0xFFFFFF, alpha: 0.7 })
    }

    // ===== RING GFX: containment rings + energy arcs + orbiting particles =====
    this.ringGfx.clear()

    const ring1R = coreR * (2.0 + Math.sin(t * 0.5 + s) * 0.08)
    const ring2R = coreR * (2.8 + Math.sin(t * 0.35 + s + 2) * 0.06)
    const ringBaseAlpha = 0.06 + act * 0.08
    this.ringGfx.circle(0, 0, ring1R).stroke({ width: 0.5, color: glowColor, alpha: ringBaseAlpha })
    this.ringGfx.circle(0, 0, ring2R).stroke({ width: 0.4, color: glowColor, alpha: ringBaseAlpha * 0.7 })

    const arcConfigs = [
      { r: 1.5, speed: 0.6, len: 0.5, width: 1.0 },
      { r: 1.9, speed: -0.4, len: 0.35, width: 0.8 },
      { r: 2.3, speed: 0.3, len: 0.6, width: 0.7 },
      { r: 1.3, speed: -0.8, len: 0.25, width: 0.6 },
      { r: 2.6, speed: 0.2, len: 0.4, width: 0.5 },
    ]

    for (let i = 0; i < arcConfigs.length; i++) {
      const cfg = arcConfigs[i]
      const arcR = coreR * cfg.r
      const arcAngle = t * cfg.speed + s * (i + 1) * 1.3 + i * 1.25
      const pulsLen = cfg.len + Math.sin(t * 1.2 + i * 0.9) * 0.1
      const arcAlpha = (0.15 + act * 0.2) * (1 - i * 0.12)

      this.ringGfx.arc(0, 0, arcR, arcAngle, arcAngle + pulsLen)
        .stroke({ width: cfg.width, color: glowColor, alpha: arcAlpha })
      const nextCfg = arcConfigs[i + 1]
      if (nextCfg) {
        const nextAngle = t * nextCfg.speed + s * (i + 2) * 1.3 + (i + 1) * 1.25
        const nextR = coreR * nextCfg.r
        this.ringGfx.moveTo(Math.cos(nextAngle) * nextR, Math.sin(nextAngle) * nextR)
      }
    }

    const particleCount = 3
    for (let i = 0; i < particleCount; i++) {
      const orbitR = coreR * (1.6 + i * 0.5)
      const orbitSpeed = 0.7 + i * 0.3 + s * 0.2
      const pAngle = t * orbitSpeed + i * 2.09 + s * 4
      const px = Math.cos(pAngle) * orbitR
      const py = Math.sin(pAngle) * orbitR
      const pAlpha = 0.4 + act * 0.4 + Math.sin(t * 2 + i) * 0.15

      this.ringGfx.circle(px, py, 2.5).fill({ color: glowColor, alpha: pAlpha * 0.3 })
      this.ringGfx.circle(px, py, 1).fill({ color: brightColor, alpha: pAlpha })
    }

    if (act > 0.1) {
      const sparkCount = 5
      for (let i = 0; i < sparkCount; i++) {
        const sparkR = coreR * (1.2 + act * 1.5 + i * 0.2)
        const sparkAngle = t * (1.5 + i * 0.4) + i * 1.26 + s * 3
        const sx = Math.cos(sparkAngle) * sparkR
        const sy = Math.sin(sparkAngle) * sparkR
        const sparkAlpha = act * 0.5 * (1 - i / sparkCount)
        this.ringGfx.circle(sx, sy, 0.8).fill({ color: brightColor, alpha: sparkAlpha })
      }
    }
  }

  /**
   * Draw the permission request ring: 10 spinning arc segments in amber.
   */
  private redrawPermissionRing() {
    this.permGfx.clear()
    if (!this.permissionActive) return

    const isChild = this.data.isChild
    const baseR = isChild ? 4.5 : 7
    const radius = baseR * 2.5
    const color = 0xFBBF24
    const alpha = 0.7 + Math.sin(this.time * 3) * 0.2
    const SEGS = 10
    const spin = this.time * 1.2

    for (let s = 0; s < SEGS; s++) {
      const a1 = (s / SEGS) * Math.PI * 2 + spin
      const a2 = ((s + 0.4) / SEGS) * Math.PI * 2 + spin
      this.permGfx.arc(0, 0, radius, a1, a2).stroke({ width: 1.5, color, alpha })
      // Move to next segment start to break the path
      if (s < SEGS - 1) {
        const nextA1 = ((s + 1) / SEGS) * Math.PI * 2 + spin
        this.permGfx.moveTo(Math.cos(nextA1) * radius, Math.sin(nextA1) * radius)
      }
    }
  }

  destroy() {
    for (const ring of this.orbitRingGraphics) {
      this.container.removeChild(ring)
    }
    this.container.destroy()
  }
}
