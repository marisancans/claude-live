import type { Application, Container } from 'pixi.js'
import type { Cluster } from '../../types'

const ORBITAL_EXTENT = 225 // Max radius of orbiting nodes (ORBIT_RADII[3])

/**
 * Camera controller for PixiJS world layer.
 * Reuses bounding box logic from original PixiScene.
 * Applies camera transform via worldLayer.pivot/position/scale with lerping.
 */
export class CameraController {
  private worldLayer: Container
  private app: Application
  private currentScale: number = 1
  private targetScale: number = 1
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

  constructor(app: Application, worldLayer: Container) {
    this.app = app
    this.worldLayer = worldLayer
    this.setupControls()
  }

  /**
   * Set up keyboard and mouse controls.
   */
  private setupControls() {
    // Keyboard: Arrow keys and WASD for pan
    window.addEventListener('keydown', (e) => {
      const panSpeed = 10 / this.manualZoom
      switch (e.key.toLowerCase()) {
        case 'arrowup':
        case 'w':
          this.manualPanY -= panSpeed
          this.autofitEnabled = false
          this.idleTimer = 0
          break
        case 'arrowdown':
        case 's':
          this.manualPanY += panSpeed
          this.autofitEnabled = false
          this.idleTimer = 0
          break
        case 'arrowleft':
        case 'a':
          this.manualPanX -= panSpeed
          this.autofitEnabled = false
          this.idleTimer = 0
          break
        case 'arrowright':
        case 'd':
          this.manualPanX += panSpeed
          this.autofitEnabled = false
          this.idleTimer = 0
          break
        case '+':
        case '=':
          this.manualZoom *= 1.1
          this.autofitEnabled = false
          this.idleTimer = 0
          break
        case '-':
          this.manualZoom /= 1.1
          this.autofitEnabled = false
          this.idleTimer = 0
          break
      }
    })

    // Mouse wheel for zoom
    this.app.canvas.addEventListener('wheel', (e) => {
      e.preventDefault()
      const zoomDelta = e.deltaY > 0 ? 0.9 : 1.1
      this.manualZoom *= zoomDelta
      this.autofitEnabled = false
      this.idleTimer = 0
    })
  }

  /**
   * Calculate bounding box of all clusters.
   */
  private calculateBounds(clusters: Map<string, Cluster>) {
    let minX = Infinity, maxX = -Infinity
    let minY = Infinity, maxY = -Infinity

    for (const cluster of clusters.values()) {
      const ext = ORBITAL_EXTENT
      minX = Math.min(minX, cluster.centerX - ext)
      maxX = Math.max(maxX, cluster.centerX + ext)
      minY = Math.min(minY, cluster.centerY - ext)
      maxY = Math.max(maxY, cluster.centerY + ext)
    }

    const padding = 80
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

    targetScale = Math.max(0.3, Math.min(4.0, targetScale * 1.4))

    const centerX = (bounds.minX + bounds.maxX) / 2
    const centerY = (bounds.minY + bounds.maxY) / 2

    return { targetScale, centerX, centerY }
  }

  tick(dt: number, clusters: Map<string, Cluster>, autofitEnabledFromProps: boolean = true) {
    // Check if we should re-enable autofit after idle
    if (!this.autofitEnabled) {
      this.idleTimer += dt
      if (this.idleTimer > this.idleThreshold) {
        this.autofitEnabled = true
      }
    }

    // If manual controls are active, use them; otherwise use autofit
    if (!this.autofitEnabled || clusters.size === 0) {
      // Manual control mode
      this.currentScale = this.manualZoom
      this.currentCx = this.manualPanX
      this.currentCy = this.manualPanY
    } else if (autofitEnabledFromProps) {
      // Autofit mode
      const bounds = this.calculateBounds(clusters)
      const { targetScale, centerX, centerY } = this.calculateTarget(bounds)

      // Update targets
      this.targetScale = targetScale
      this.targetCx = centerX
      this.targetCy = centerY

      // Lerp to target
      this.currentScale += (this.targetScale - this.currentScale) * this.lerpAlpha
      this.currentCx += (this.targetCx - this.currentCx) * this.lerpAlpha
      this.currentCy += (this.targetCy - this.currentCy) * this.lerpAlpha
    }

    // Apply transform to worldLayer
    this.worldLayer.pivot.set(this.currentCx, this.currentCy)
    this.worldLayer.position.set(
      this.app.renderer.width / 2,
      this.app.renderer.height / 2
    )
    this.worldLayer.scale.set(this.currentScale)
  }
}
