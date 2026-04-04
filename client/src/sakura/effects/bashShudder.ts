import type { TreeEffect, TreeEffectBuilder } from './types'
import { activateChain, clamp } from './helpers'

const DURATION = 1.5

export const buildBashShudder: TreeEffectBuilder = (ctx, _colonyGroup, petalSystem, windField) => {
  const { branchChain, color, targetPetalIds } = ctx

  // Activate all branches with pulse
  activateChain(branchChain, color)

  // Spike wind
  windField.spike(1.0, 0.8)

  // Detach a few petals
  if (targetPetalIds.length > 0) {
    const detachCount = Math.min(3, targetPetalIds.length)
    const toDetach = targetPetalIds.slice(0, detachCount)
    petalSystem.detach(toDetach, { x: 0, y: 5, z: 0 } as any)
  }

  let elapsed = 0

  const effect: TreeEffect = {
    tick(dt) {
      elapsed += dt
      const t = clamp(elapsed / DURATION, 0, 1)

      // Shudder: rapidly oscillate branch pulse
      const shudder = Math.sin(elapsed * 30) * (1 - t) * 0.3
      for (const branch of branchChain) {
        branch.pulse = Math.max(branch.pulse, (1 - t) * 0.8 + shudder)
      }

      return t < 1
    },
    dispose() {
      // Branches will naturally decay their pulse
    },
  }

  return effect
}
