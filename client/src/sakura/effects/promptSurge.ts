import type { TreeEffect, TreeEffectBuilder } from './types'
import { activateChain, clamp } from './helpers'

const DURATION = 2.0

export const buildPromptSurge: TreeEffectBuilder = (ctx) => {
  const { branchChain, color } = ctx

  // Activate all branches
  activateChain(branchChain, color)

  let elapsed = 0

  return {
    tick(dt) {
      elapsed += dt
      const t = clamp(elapsed / DURATION, 0, 1)

      // Full-tree pulse that fades
      for (const branch of branchChain) {
        branch.pulse = Math.max(branch.pulse, (1 - t) * 0.9)
      }

      return t < 1
    },
    dispose() {},
  }
}
