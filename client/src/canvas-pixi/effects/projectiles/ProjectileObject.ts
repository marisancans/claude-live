import { Container } from 'pixi.js'
import type { Point } from '../../../utils/spline'

/**
 * Base class for all projectile animations.
 * Each subclass owns its PixiJS objects and handles animation internally.
 */
export abstract class ProjectileObject {
  container: Container
  progress: number = 0
  duration: number = 1 // seconds
  startPos: Point
  endPos: Point

  constructor(startPos: Point, endPos: Point, duration: number = 1) {
    this.container = new Container()
    this.startPos = startPos
    this.endPos = endPos
    this.duration = duration
  }

  /**
   * Update animation state each frame.
   */
  abstract tick(dt: number): void

  /**
   * Check if animation is complete.
   */
  isDone(): boolean {
    return this.progress >= 1.0
  }

  /**
   * Clean up PixiJS objects.
   */
  destroy(): void {
    this.container.destroy()
  }
}
