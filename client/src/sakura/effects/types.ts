import type * as THREE from 'three'
import type { BranchVisual, BlossomAnchor } from '../types'
import type { PetalSystem } from '../PetalSystem'
import type { WindField } from '../WindField'

export interface TreeEffectContext {
  branchChain: BranchVisual[]
  targetBlossom: BlossomAnchor | null
  targetPetalIds: number[]
  direction: 'inward' | 'outward'
  color: THREE.Color
  intensity: number
}

export interface TreeEffect {
  /** Called every frame. Return false when done. */
  tick(dt: number, elapsed: number): boolean
  /** Called when signal reaches destination */
  onReachTarget?(): void
  /** Called when effect finishes completely */
  onComplete?(): void
  /** Cleanup all resources */
  dispose(): void
}

export type TreeEffectBuilder = (
  ctx: TreeEffectContext,
  colonyGroup: THREE.Group,
  petalSystem: PetalSystem,
  windField: WindField,
) => TreeEffect
