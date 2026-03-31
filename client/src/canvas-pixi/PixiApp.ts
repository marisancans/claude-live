import { Application, Container } from 'pixi.js'
import type { Cluster } from '../types'
import type { MutableRefObject } from 'react'
import { BackgroundLayer } from './layers/BackgroundLayer'
import { WorldLayer } from './layers/WorldLayer'
import { AnimationManager } from './animation/AnimationManager'
import { MemoryMonitor } from './MemoryMonitor'
import { initSnakeAtlas } from './effects/SnakeObject'
import { RENDER_SCALE } from '../constants'

/**
 * Main PixiJS application for the visualizer.
 * Manages the scene graph: background layer, world layer with camera, and UI layer.
 */
export class PixiApp {
  app!: Application
  canvas: HTMLCanvasElement
  clustersRef: MutableRefObject<Map<string, Cluster>>
  autofitRef: MutableRefObject<boolean>
  backgroundLayer!: BackgroundLayer
  worldLayer!: WorldLayer
  animationManager: AnimationManager | null = null
  uiLayer!: Container
  memoryMonitor: MemoryMonitor | null = null
  private rafId: number = 0
  private _resizeHandler = () => this.onResize()

  constructor(canvas: HTMLCanvasElement, clustersRef: MutableRefObject<Map<string, Cluster>>, autofitRef: MutableRefObject<boolean>) {
    this.canvas = canvas
    this.clustersRef = clustersRef
    this.autofitRef = autofitRef
  }

  /**
   * Initialize the PixiJS application asynchronously.
   * In PixiJS v8, Application.init() is async.
   */
  async init() {
    // Create the main application
    this.app = new Application()

    // Initialize with canvas and resolution settings
    // autoStart: false to prevent auto-ticker, we use manual RAF loop
    await this.app.init({
      canvas: this.canvas,
      width: window.innerWidth,
      height: window.innerHeight,
      antialias: true,
      resolution: (window.devicePixelRatio || 1) * RENDER_SCALE,
      autoDensity: true,
      backgroundColor: 0x080808,
      autoStart: false,
    })

    // Create scene hierarchy
    // Background layer: starfield, nebula (screen-space, no camera)
    this.backgroundLayer = new BackgroundLayer(this.app)
    this.app.stage.addChild(this.backgroundLayer.container)

    // World layer: camera container with clusters, nodes, edges, projectiles
    // Pass clustersRef so WorldLayer always reads fresh cluster data
    this.worldLayer = new WorldLayer(this.app, this.clustersRef, this.autofitRef)
    this.app.stage.addChild(this.worldLayer.container)

    // Initialize glyph atlas for snake text rendering (must be after app.init)
    initSnakeAtlas(this.app)

    // Animation manager: subscribes to events and creates projectiles/snakes
    try {
      this.animationManager = new AnimationManager(this.app, this.worldLayer)
    } catch (err) {
      console.error('Failed to create AnimationManager:', err)
    }

    // UI layer: always on top (screen-space)
    this.uiLayer = new Container()
    this.app.stage.addChild(this.uiLayer)

    // Memory monitor: samples heap + object counts every 5s, posts to /hook
    this.memoryMonitor = new MemoryMonitor(this.app, this.worldLayer, this.animationManager)
    this.memoryMonitor.start(5)

    // Resize handler
    window.addEventListener('resize', this._resizeHandler)
  }

  /**
   * Main render loop tick.
   */
  tick(dt: number) {
    if (!this.app) return

    // Update all layers
    this.backgroundLayer.tick(dt)
    this.worldLayer.tick(dt)
    this.animationManager?.tick(dt)

    // Render
    this.app.render()
  }

  /**
   * Handle window resize.
   */
  private onResize() {
    if (!this.app) return
    const w = window.innerWidth
    const h = window.innerHeight
    this.app.renderer.resize(w, h)
  }

  /**
   * Cleanup when unmounting.
   */
  destroy() {
    window.removeEventListener('resize', this._resizeHandler)
    this.memoryMonitor?.stop()
    this.animationManager?.destroy()

    try {
      this.app.destroy()
    } catch (e) {
      // Expected during HMR teardown
    }

    // Force-release the WebGL context
    try {
      const gl = this.canvas.getContext('webgl2') || this.canvas.getContext('webgl')
      if (gl) {
        const ext = gl.getExtension('WEBGL_lose_context')
        if (ext) ext.loseContext()
      }
    } catch (e) {
      // Best-effort cleanup
    }
  }
}
