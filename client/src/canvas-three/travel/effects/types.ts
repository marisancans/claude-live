import * as THREE from 'three'

export interface EffectEntry {
  obj: THREE.Object3D
  mat: THREE.Material
  meta: Record<string, any>
}

export interface SecondaryEffect {
  /** All Three.js objects this effect adds to the group */
  entries: EffectEntry[]
  /** Called every frame while node is traveling or fading */
  tick(prog: number, dt: number, elapsed: number, state: string, head: THREE.Object3D): void
  /** Called when node transitions to fading — apply final fade multiplier 0→1 */
  applyFade(f: number): void
  /** Called when node lands (transitions to fading) */
  onLand?(): void
  /** Called when node stalls — errorForks use this to flash at stall position */
  onStall?(stallPos: THREE.Vector3): void
  /** When true, TravelingNode should set done=true immediately */
  shouldMarkDone?: boolean
  /** Called by TravelingNode.dispose() — clean up geometry/materials not in entries[] */
  dispose?(): void
  /**
   * When true, TravelingNode hides its default trail entirely.
   * The effect is responsible for drawing the trail via its own geometry.
   */
  suppressDefaultTrail?: boolean
  /**
   * Called every travel frame so the effect can update its custom trail.
   * Only called when suppressDefaultTrail=true.
   */
  trailTick?(prog: number, dt: number, elapsed: number, head: THREE.Object3D): void
}
