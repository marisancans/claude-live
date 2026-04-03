import type { TreeEffect, TreeEffectBuilder } from './types'
import { activateChain, clamp } from './helpers'

const SIGNAL_DURATION = 3.0

export const buildFetchBlight: TreeEffectBuilder = (ctx, _colonyGroup, petalSystem) => {
  const { branchChain, color, targetPetalIds } = ctx

  activateChain(branchChain, color, true) // contaminate = true

  // Wilt petals
  if (targetPetalIds.length > 0) {
    petalSystem.setWilt(targetPetalIds, 0.5)
  }

  let elapsed = 0

  return {
    tick(dt) {
      elapsed += dt
      const t = clamp(elapsed / SIGNAL_DURATION, 0, 1)

      // Contamination stays high during effect
      for (const branch of branchChain) {
        branch.contamination = Math.max(branch.contamination, (1 - t) * 0.6)
      }

      return t < 1
    },
    dispose() {
      // Contamination will naturally decay via BranchRenderer
      // Wilt will need to be gradually reduced — for now it stays until recycle
    },
  }
}
