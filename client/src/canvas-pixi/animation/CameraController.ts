import type { Application, Container } from 'pixi.js'
import type { Cluster } from '../../types'
import { ORBIT_RADII, NODE_VISUAL_RADIUS } from '../../constants'

/**
 * Camera controller for PixiJS world layer.
 * Reuses bounding box logic from original PixiScene.
 * Applies camera transform via worldLayer.pivot/position/scale with lerping.
 * Supports wheel zoom and mouse drag panning with idle-based autofit resume.
 */
export class CameraController {
  private worldLayer: Container
  private app: Application
  private canvas: HTMLCanvasElement
  private currentScale: number = 0.5
  private targetScale: number = 0.5
  private currentCx: number = 0
  private currentCy: number = 0
  private targetCx: number = 0
  private targetCy: number = 0
  private lerpAlpha: number = 0.15

  // Manual control state
  private autofitEnabled: boolean = true
  private manualPanX: number = 0
  private manualPanY: number = 0
  private manualZoom: number = 1
  private idleTimer: number = 0
  private idleThreshold: number = 2.0 // Resume autofit after 2 seconds idle

  // Drag state
  private dragging: boolean = false
  private dragLastX: number = 0
  private dragLastY: number = 0

  // Screen shake state (for compaction explosions)
  private shakeIntensity: number = 0
  private shakeDecay: number = 0.92

  // Temporary pinned world positions included in bounds (e.g. explosion sites)
  private pinnedPoints: { x: number; y: number; ttl: number }[] = []

  // Stored handler refs for cleanup
  private onWheel: (e: WheelEvent) => void
  private onPointerDown: (e: PointerEvent) => void
  private onPointerMove: (e: PointerEvent) => void
  private onPointerUp: (e: PointerEvent) => void

  constructor(app: Application, worldLayer: Container) {
    this.app = app
    this.worldLayer = worldLayer
    this.canvas = app.canvas as HTMLCanvasElement

    // Bind handlers
    this.onWheel = this.handleWheel.bind(this)
    this.onPointerDown = this.handlePointerDown.bind(this)
    this.onPointerMove = this.handlePointerMove.bind(this)
    this.onPointerUp = this.handlePointerUp.bind(this)

    this.setupControls()
  }

  private setupControls() {
    // Wheel zoom — passive: true to avoid page freeze
    this.canvas.addEventListener('wheel', this.onWheel, { passive: true })
    this.canvas.addEventListener('pointerdown', this.onPointerDown)
    this.canvas.addEventListener('pointermove', this.onPointerMove)
    this.canvas.addEventListener('pointerup', this.onPointerUp)
    this.canvas.addEventListener('pointerleave', this.onPointerUp)
  }

  private handleWheel(e: WheelEvent) {
    const factor = e.deltaY < 0 ? 1.1 : 1 / 1.1
    this.manualZoom *= factor
    this.autofitEnabled = false
    this.idleTimer = 0
  }

  private handlePointerDown(e: PointerEvent) {
    this.dragging = true
    this.dragLastX = e.clientX
    this.dragLastY = e.clientY
  }

  private handlePointerMove(e: PointerEvent) {
    if (!this.dragging) return
    const dx = e.clientX - this.dragLastX
    const dy = e.clientY - this.dragLastY
    this.dragLastX = e.clientX
    this.dragLastY = e.clientY

    // Convert screen-space drag delta to world-space offset
    const scale = this.currentScale || 1
    this.manualPanX -= dx / scale
    this.manualPanY -= dy / scale

    this.autofitEnabled = false
    this.idleTimer = 0
  }

  private handlePointerUp(_e: PointerEvent) {
    this.dragging = false
  }

  /**
   * Pin a world-space point in the camera bounds for a given duration (seconds).
   * Used to keep explosion sites visible after the cluster is removed.
   */
  pinPoint(x: number, y: number, duration: number) {
    this.pinnedPoints.push({ x, y, ttl: duration })
  }

  /**
   * Calculate bounding box of all clusters (plus any pinned points).
   */
  private calculateBounds(clusters: Map<string, Cluster>) {
    let minX = Infinity, maxX = -Infinity
    let minY = Infinity, maxY = -Infinity

    for (const cluster of clusters.values()) {
      let ext = ORBIT_RADII[0] + NODE_VISUAL_RADIUS
      for (let i = Math.min(cluster.ringCounts.length, ORBIT_RADII.length) - 1; i >= 0; i--) {
        if (cluster.ringCounts[i] > 0) { ext = ORBIT_RADII[i] + NODE_VISUAL_RADIUS; break }
      }

      minX = Math.min(minX, cluster.centerX - ext)
      maxX = Math.max(maxX, cluster.centerX + ext)
      minY = Math.min(minY, cluster.centerY - ext)
      maxY = Math.max(maxY, cluster.centerY + ext)
    }

    // Include pinned points (e.g. explosion sites after session removal)
    for (const pt of this.pinnedPoints) {
      minX = Math.min(minX, pt.x)
      maxX = Math.max(maxX, pt.x)
      minY = Math.min(minY, pt.y)
      maxY = Math.max(maxY, pt.y)
    }

    const padding = 60
    return {
      minX: minX - padding,
      maxX: maxX + padding,
      minY: minY - padding,
      maxY: maxY + padding,
    }
  }

  /**
   * Calculate camera target from bounds.
   */
  private calculateTarget(bounds: ReturnType<CameraController['calculateBounds']>) {
    const boundsWidth = bounds.maxX - bounds.minX
    const boundsHeight = bounds.maxY - bounds.minY
    const boundsAspect = boundsWidth / boundsHeight
    const canvasAspect = this.app.renderer.width / this.app.renderer.height

    let targetScale: number
    if (boundsAspect > canvasAspect) {
      targetScale = this.app.renderer.width / boundsWidth
    } else {
      targetScale = this.app.renderer.height / boundsHeight
    }

    targetScale = Math.max(0.3, Math.min(3.0, targetScale * 0.92))

    const centerX = (bounds.minX + bounds.maxX) / 2
    const centerY = (bounds.minY + bounds.maxY) / 2

    return { targetScale, centerX, centerY }
  }

  tick(dt: number, clusters: Map<string, Cluster>, autofitEnabledFromProps: boolean = true) {
    // Tick down pinned points regardless of autofit state
    for (let i = this.pinnedPoints.length - 1; i >= 0; i--) {
      this.pinnedPoints[i].ttl -= dt
      if (this.pinnedPoints[i].ttl <= 0) this.pinnedPoints.splice(i, 1)
    }

    if (!autofitEnabledFromProps || clusters.size === 0) return

    // Increment idle timer when not actively interacting
    this.idleTimer += dt

    // Resume autofit after idle threshold
    if (this.idleTimer > this.idleThreshold && !this.autofitEnabled) {
      this.autofitEnabled = true
    }

    // Calculate bounds and autofit target
    const bounds = this.calculateBounds(clusters)
    const autofit = this.calculateTarget(bounds)

    if (this.autofitEnabled) {
      // Smoothly blend manual overrides back toward neutral
      this.manualZoom += (1 - this.manualZoom) * this.lerpAlpha
      this.manualPanX += (0 - this.manualPanX) * this.lerpAlpha
      this.manualPanY += (0 - this.manualPanY) * this.lerpAlpha

      // Autofit with manual adjustments layered on
      this.targetScale = autofit.targetScale * this.manualZoom
      this.targetCx = autofit.centerX + this.manualPanX
      this.targetCy = autofit.centerY + this.manualPanY
    } else {
      // Full manual control: use autofit as base, apply manual overrides
      this.targetScale = autofit.targetScale * this.manualZoom
      this.targetCx = autofit.centerX + this.manualPanX
      this.targetCy = autofit.centerY + this.manualPanY
    }

    // Lerp to target
    this.currentScale += (this.targetScale - this.currentScale) * this.lerpAlpha
    this.currentCx += (this.targetCx - this.currentCx) * this.lerpAlpha
    this.currentCy += (this.targetCy - this.currentCy) * this.lerpAlpha

    // Screen shake (from compaction explosions)
    let shakeX = 0, shakeY = 0
    if (this.shakeIntensity > 0.5) {
      shakeX = (Math.random() - 0.5) * this.shakeIntensity
      shakeY = (Math.random() - 0.5) * this.shakeIntensity
      this.shakeIntensity *= this.shakeDecay
      if (this.shakeIntensity < 0.5) this.shakeIntensity = 0
    }

    // Apply transform to worldLayer
    this.worldLayer.pivot.set(this.currentCx, this.currentCy)
    this.worldLayer.position.set(
      this.app.renderer.width / 2 + shakeX,
      this.app.renderer.height / 2 + shakeY
    )
    this.worldLayer.scale.set(this.currentScale)
  }

  /**
   * Trigger screen shake (used by compaction rebirth).
   * @param intensity - initial shake amplitude in pixels
   */
  shake(intensity: number) {
    this.shakeIntensity = Math.max(this.shakeIntensity, intensity)
  }

  /**
   * Remove all event listeners. Call when disposing the controller.
   */
  destroy() {
    this.canvas.removeEventListener('wheel', this.onWheel)
    this.canvas.removeEventListener('pointerdown', this.onPointerDown)
    this.canvas.removeEventListener('pointermove', this.onPointerMove)
    this.canvas.removeEventListener('pointerup', this.onPointerUp)
    this.canvas.removeEventListener('pointerleave', this.onPointerUp)
  }
}
