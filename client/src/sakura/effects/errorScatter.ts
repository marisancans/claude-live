import * as THREE from 'three'
import type { TreeEffect, TreeEffectBuilder } from './types'
import { activateChain, clamp } from './helpers'

const DURATION = 2.5

export const buildErrorScatter: TreeEffectBuilder = (ctx, _colonyGroup, petalSystem) => {
  const { branchChain, color, targetPetalIds } = ctx

  activateChain(branchChain, color)

  // Violent petal scatter
  if (targetPetalIds.length > 0) {
    const velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 6,
      8 + Math.random() * 4,
      (Math.random() - 0.5) * 6,
    )
    petalSystem.detach(targetPetalIds, velocity)
  }

  let elapsed = 0

  return {
    tick(dt) {
      elapsed += dt
      const t = clamp(elapsed / DURATION, 0, 1)

      // Red flash on branch
      for (const branch of branchChain) {
        branch.pulse = Math.max(branch.pulse, (1 - t) * 0.7)
        branch.contamination = Math.max(branch.contamination, (1 - t) * 0.4)
      }

      return t < 1
    },
    dispose() {},
  }
}
