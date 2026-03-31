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
  /** Optional live-tracking container — position updates each tick */
  trackTarget: Container | null = null
  /** If true, trackTarget updates startPos; if false, updates endPos */
  trackIsStart: boolean = false
  /** Deferred lookup info — set when NodeObject doesn't exist at spawn time */
  trackLookup: { sessionId: string; nodeKey: string; resolve: () => Container | null } | null = null

  constructor(startPos: Point, endPos: Point, duration: number = 1) {
    this.container = new Container()
    this.startPos = startPos
    this.endPos = endPos
    this.duration = duration
  }

  /** Update startPos or endPos from tracked target container position */
  syncTarget() {
    // Deferred lookup: NodeObject may not exist at spawn time (new nodes)
    if (!this.trackTarget && this.trackLookup) {
      const container = this.trackLookup.resolve()
      if (container) {
        this.trackTarget = container
        this.trackLookup = null
      }
    }
    if (this.trackTarget) {
      // Guard against destroyed containers whose position is null
      if (!this.trackTarget.position) {
        this.trackTarget = null
        return
      }
      const pos = { x: this.trackTarget.position.x, y: this.trackTarget.position.y }
      if (this.trackIsStart) this.startPos = pos
      else this.endPos = pos
    }
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
    this.container.destroy({ children: true })
  }
}
