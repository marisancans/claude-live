import { Container, Text, Graphics, Sprite } from 'pixi.js'
import type { Cluster } from '../../types'
import { orbitRadiusFor, parseModelFamily, MODEL_COLORS } from '../../constants'
import { PlasmaCore } from '../shaders/PlasmaCore'
import { getCoreGlowTexture, getPermissionRingTexture, spriteFromTexture } from '../textures/NodeTextures'

/**
 * Visual representation of a cluster (session).
 *
 * Architecture: NO per-frame Graphics.clear(). Core glow and permission ring
 * use Sprites from pre-rendered textures. Animated containment rings + energy
 * arcs are drawn by WorldLayer's single batch Graphics (not here).
 */
export class ClusterObject {
  container: Container
  data: Cluster
  coreLabel: Text | null = null
  modelLabel: Text | null = null
  orbitRingGraphics: Graphics[] = []
  nodeObjects: Map<string, any> = new Map()

  // Permission ring: Sprite with rotation animation
  permissionActive: boolean = false
  private permSprite: Sprite | null = null

  // Animation state
  private time: number = 0
  coreAct: number = 0  // public so WorldLayer batch can read it
  seed: number = 0     // public so WorldLayer batch can read it

  // Core glow: Sprite, animated via scale/alpha transforms only
  private coreGlowSprite: Sprite | null = null

  // Plasma core renderer
  private plasmaCore: PlasmaCore | null = null
  private plasmaSprite: Sprite | null = null
  modelFamily: string = 'unknown'  // public so WorldLayer batch can read it

  get cluster(): Cluster { return this.data }

  constructor(cluster: Cluster) {
    this.data = cluster
    this.container = new Container()
    this.container.position.set(cluster.centerX, cluster.centerY)

    // Deterministic seed
    let h = 0
    for (let i = 0; i < cluster.sessionId.length; i++) {
      h = Math.imul(h ^ cluster.sessionId.charCodeAt(i), 0x01000193)
    }
    this.seed = ((h >>> 0) % 10000) / 10000

    this.modelFamily = parseModelFamily((cluster as any).model || '')

    // Plasma core: CPU-rendered, displayed as sprite
    try {
      this.plasmaCore = new PlasmaCore(48)
      this.plasmaSprite = new Sprite(this.plasmaCore.texture)
      this.plasmaSprite.anchor.set(0.5)
      const visualSize = cluster.isChild ? 22 : 32
      this.plasmaSprite.width = visualSize
      this.plasmaSprite.height = visualSize
      this.container.addChild(this.plasmaSprite)
    } catch (e) {
      this.plasmaCore = null
      this.plasmaSprite = null
    }

    // Core glow: pre-rendered sprite, animated via scale/alpha
    this.initCoreGlow()

    // Permission ring: pre-rendered sprite, animated via rotation + visibility
    const permTex = getPermissionRingTexture()
    this.permSprite = spriteFromTexture(permTex)
    const isChild = cluster.isChild
    const baseR = isChild ? 4.5 : 7
    this.permSprite.scale.set((baseR * 2.5 * 2) / 64)  // scale to match radius
    this.permSprite.visible = false
    this.container.addChild(this.permSprite)

    this.createCoreLabel()
    this.createModelLabel()
  }

  private initCoreGlow() {
    const colors = MODEL_COLORS[this.modelFamily] || MODEL_COLORS.unknown
    const glowTex = getCoreGlowTexture(colors.glow, colors.brightHex)
    this.coreGlowSprite = spriteFromTexture(glowTex)
    this.coreGlowSprite.blendMode = 'add'
    const isChild = this.data.isChild
    const baseR = isChild ? 4.5 : 7
    // Scale so the outer glow matches ~4x baseR
    this.coreGlowSprite.scale.set((baseR * 4 * 2) / 64)
    this.container.addChildAt(this.coreGlowSprite, 0)
  }

  private createCoreLabel() {
    const isChild = this.data.isChild
    const prefix = isChild ? 'agent' : 'session'
    const colors = MODEL_COLORS[this.modelFamily] || MODEL_COLORS.unknown
    this.coreLabel = new Text({
      text: `${prefix}:${this.data.label}`,
      style: { fontSize: 11, fontFamily: 'monospace', fill: colors.brightHex, align: 'center' },
    })
    const coreR = isChild ? 4.5 : 7
    this.coreLabel.anchor.set(0.5, 0)
    this.coreLabel.position.set(0, coreR + 6)
    this.coreLabel.alpha = isChild ? 0.65 : 0.7
    this.container.addChild(this.coreLabel)
  }

  private createModelLabel() {
    const model = (this.data as any).model as string | undefined
    if (!model) return
    const family = parseModelFamily(model)
    const vMatch = model.match(/(\d+)[-.](\d+)/)
    const ver = vMatch ? `${vMatch[1]}.${vMatch[2]}` : ''
    const displayModel = ver ? `${family} ${ver}` : family
    const colors = MODEL_COLORS[family] || MODEL_COLORS.unknown
    this.modelLabel = new Text({
      text: displayModel,
      style: { fontSize: 7, fontFamily: 'monospace', fill: colors.brightHex, align: 'center' },
    })
    const isChild = this.data.isChild
    const coreR = isChild ? 4.5 : 7
    this.modelLabel.anchor.set(0.5, 0)
    this.modelLabel.position.set(0, coreR + 20)
    this.modelLabel.alpha = 0.5
    this.container.addChild(this.modelLabel)
  }

  setPermission(active: boolean) {
    this.permissionActive = active
    if (this.permSprite) this.permSprite.visible = active
  }

  /**
   * Create orbit ring graphics (static — only redrawn when ring membership changes).
   */
  updateOrbitRings() {
    for (const ring of this.orbitRingGraphics) {
      this.container.removeChild(ring)
      ring.destroy()
    }
    this.orbitRingGraphics = []

    for (let i = 0; i < this.data.ringCounts.length; i++) {
      if (this.data.ringCounts[i] > 0) {
        const g = new Graphics()
        const radius = orbitRadiusFor(i)
        g.circle(0, 0, radius).stroke({ width: 0.6, color: 0xffffff, alpha: 0.045 })
        this.container.addChildAt(g, 0)
        this.orbitRingGraphics.push(g)
      }
    }
  }

  triggerActivity() { this.coreAct = 1 }

  tick(dt: number) {
    this.container.position.set(this.data.centerX, this.data.centerY)
    this.time += dt

    // Decay activity
    if (this.coreAct > 0) {
      this.coreAct = Math.max(0, this.coreAct - 0.02)
    }

    // Update model family
    if ((this.data as any).model) {
      const fam = parseModelFamily((this.data as any).model)
      if (fam !== this.modelFamily) {
        this.modelFamily = fam
        if (this.coreLabel) {
          const colors = MODEL_COLORS[fam] || MODEL_COLORS.unknown
          ;(this.coreLabel.style as any).fill = colors.brightHex
        }
      }
    }

    const isChild = this.data.isChild
    const baseR = isChild ? 4.5 : 7
    const compacting = this.data.compacting ?? 0
    const compacted = this.data.compacted ?? 0

    // Breathing pulse — transform-only on sprites
    let breathe = 1 + Math.sin(this.time * 0.8 + this.seed * 6) * 0.03 + this.coreAct * 0.12
    if (compacting > 0.1) {
      breathe *= (1 - compacting * 0.4)
    } else if (compacted > 0.1) {
      breathe *= (1 + compacted * 0.5)
    }

    // Core glow: animate scale for breathing, alpha for activity
    if (this.coreGlowSprite) {
      const baseScale = (baseR * 4 * 2) / 64
      this.coreGlowSprite.scale.set(baseScale * breathe)
      this.coreGlowSprite.alpha = 0.8 + this.coreAct * 0.2
    }

    // Plasma core update
    if (this.plasmaCore && this.plasmaSprite) {
      const colors = MODEL_COLORS[this.modelFamily] || MODEL_COLORS.unknown
      let baseCol = colors.base
      let brightCol = colors.bright
      if (compacting > 0.1) {
        baseCol = [0.19, 0.25, 0.5]
        brightCol = [0.31, 0.38, 0.75]
      } else if (compacted > 0.1) {
        baseCol = [1.0, 0.82, 0.38]
        brightCol = [1.0, 0.94, 0.75]
      }
      if (Math.floor(this.time * 60) % 3 === 0) {
        this.plasmaCore.update(this.time, this.coreAct, this.seed, baseCol as [number, number, number], brightCol as [number, number, number])
      }
      const visualSize = (isChild ? 22 : 32) * breathe
      this.plasmaSprite.width = visualSize
      this.plasmaSprite.height = visualSize
    }

    // Permission ring: animate rotation (transform-only)
    if (this.permSprite && this.permissionActive) {
      this.permSprite.rotation = this.time * 1.2
      this.permSprite.alpha = 0.7 + Math.sin(this.time * 3) * 0.2
    }

    // Distort orbit rings during compaction
    for (const ring of this.orbitRingGraphics) {
      if (compacting > 0.1) {
        ring.scale.set(1 - compacting * 0.3)
        ring.alpha = 1 - compacting * 0.6
      } else if (compacted > 0.1) {
        ring.scale.set(1 + compacted * 0.15)
        ring.alpha = 1
      } else {
        ring.scale.set(1)
        ring.alpha = 1
      }
    }

    // Update model label
    const currentModel = (this.data as any).model as string | undefined
    if (currentModel) {
      const currentFamily = parseModelFamily(currentModel)
      if (!this.modelLabel) {
        this.createModelLabel()
      } else if (currentFamily !== this.modelFamily) {
        this.container.removeChild(this.modelLabel)
        this.modelLabel.destroy()
        this.modelLabel = null
        this.createModelLabel()
      }
    }
  }

  /**
   * Draw animated containment rings + energy arcs into a shared batch Graphics.
   * Called by WorldLayer instead of per-cluster Graphics.
   * All coordinates are cluster-local (0,0 = cluster center).
   */
  drawRingsIntoBatch(g: Graphics, offsetX: number, offsetY: number) {
    const isChild = this.data.isChild
    const baseR = isChild ? 4.5 : 7
    const t = this.time
    const act = this.coreAct
    const s = this.seed
    const compacting = this.data.compacting ?? 0
    const compacted = this.data.compacted ?? 0

    const colors = MODEL_COLORS[this.modelFamily] || MODEL_COLORS.unknown
    let glowColor = colors.glow
    let brightColor = colors.brightHex
    if (compacting > 0.1) {
      glowColor = 0x304080; brightColor = 0x8090C0
    } else if (compacted > 0.1) {
      glowColor = 0xFFD060; brightColor = 0xFFFFFF
    }

    let breathe = 1 + Math.sin(t * 0.8 + s * 6) * 0.03 + act * 0.12
    if (compacting > 0.1) breathe *= (1 - compacting * 0.4)
    else if (compacted > 0.1) breathe *= (1 + compacted * 0.5)
    const coreR = baseR * breathe

    const cx = offsetX
    const cy = offsetY

    // Containment rings
    const ring1R = coreR * (2.0 + Math.sin(t * 0.5 + s) * 0.08)
    const ring2R = coreR * (2.8 + Math.sin(t * 0.35 + s + 2) * 0.06)
    const ringBaseAlpha = 0.06 + act * 0.08
    g.circle(cx, cy, ring1R).stroke({ width: 0.5, color: glowColor, alpha: ringBaseAlpha })
    g.circle(cx, cy, ring2R).stroke({ width: 0.4, color: glowColor, alpha: ringBaseAlpha * 0.7 })

    // Energy arcs
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
      g.arc(cx, cy, arcR, arcAngle, arcAngle + pulsLen)
        .stroke({ width: cfg.width, color: glowColor, alpha: arcAlpha })
      const nextCfg = arcConfigs[i + 1]
      if (nextCfg) {
        const nextAngle = t * nextCfg.speed + s * (i + 2) * 1.3 + (i + 1) * 1.25
        const nextR = coreR * nextCfg.r
        g.moveTo(cx + Math.cos(nextAngle) * nextR, cy + Math.sin(nextAngle) * nextR)
      }
    }

    // Orbiting particles
    for (let i = 0; i < 3; i++) {
      const orbitR = coreR * (1.6 + i * 0.5)
      const orbitSpeed = 0.7 + i * 0.3 + s * 0.2
      const pAngle = t * orbitSpeed + i * 2.09 + s * 4
      const px = cx + Math.cos(pAngle) * orbitR
      const py = cy + Math.sin(pAngle) * orbitR
      const pAlpha = 0.4 + act * 0.4 + Math.sin(t * 2 + i) * 0.15
      g.circle(px, py, 2.5).fill({ color: glowColor, alpha: pAlpha * 0.3 })
      g.circle(px, py, 1).fill({ color: brightColor, alpha: pAlpha })
    }

    // Activity sparks
    if (act > 0.1) {
      for (let i = 0; i < 5; i++) {
        const sparkR = coreR * (1.2 + act * 1.5 + i * 0.2)
        const sparkAngle = t * (1.5 + i * 0.4) + i * 1.26 + s * 3
        const sx = cx + Math.cos(sparkAngle) * sparkR
        const sy = cy + Math.sin(sparkAngle) * sparkR
        const sparkAlpha = act * 0.5 * (1 - i / 5)
        g.circle(sx, sy, 0.8).fill({ color: brightColor, alpha: sparkAlpha })
      }
    }
  }

  destroy() {
    for (const ring of this.orbitRingGraphics) ring.destroy()
    this.orbitRingGraphics = []
    this.plasmaCore?.destroy()
    this.plasmaCore = null
    this.container.destroy({ children: true })
  }
}
