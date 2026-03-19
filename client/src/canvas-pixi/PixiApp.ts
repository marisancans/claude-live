import { Application, Container } from 'pixi.js'
import type { Cluster } from '../types'
import type { MutableRefObject } from 'react'
import { BackgroundLayer } from './layers/BackgroundLayer'
import { WorldLayer } from './layers/WorldLayer'
import { AnimationManager } from './animation/AnimationManager'

/**
 * Main PixiJS application for the visualizer.
 * Manages the scene graph: background layer, world layer with camera, and UI layer.
 */
export class PixiApp {
  app!: Application
  canvas: HTMLCanvasElement
  clustersRef: MutableRefObject<Map<string, Cluster>>
  backgroundLayer!: BackgroundLayer
  worldLayer!: WorldLayer
  animationManager!: AnimationManager
  uiLayer!: Container
  private rafId: number = 0

  constructor(canvas: HTMLCanvasElement, clustersRef: MutableRefObject<Map<string, Cluster>>) {
    this.canvas = canvas
    this.clustersRef = clustersRef
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
      resolution: Math.min(window.devicePixelRatio || 1, 2),
      backgroundColor: 0x080808,
      autoStart: false,
    })

    // Create scene hierarchy
    // Background layer: starfield, nebula (screen-space, no camera)
    this.backgroundLayer = new BackgroundLayer(this.app)
    this.app.stage.addChild(this.backgroundLayer.container)

    // World layer: camera container with clusters, nodes, edges, projectiles
    // Pass clustersRef so WorldLayer always reads fresh cluster data
    this.worldLayer = new WorldLayer(this.app, this.clustersRef)
    this.app.stage.addChild(this.worldLayer.container)

    // Animation manager: subscribes to events and creates projectiles/snakes
    this.animationManager = new AnimationManager(this.app, this.worldLayer)

    // UI layer: always on top (screen-space)
    this.uiLayer = new Container()
    this.app.stage.addChild(this.uiLayer)

    // Resize handler
    window.addEventListener('resize', () => this.onResize())
  }

  /**
   * Main render loop tick.
   */
  tick(dt: number) {
    if (!this.app) return

    // Update all layers
    this.backgroundLayer.tick(dt)
    this.worldLayer.tick(dt)
    this.animationManager.tick(dt)

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
    window.removeEventListener('resize', () => this.onResize())
    this.animationManager.destroy()
    this.app.destroy()
  }
}
