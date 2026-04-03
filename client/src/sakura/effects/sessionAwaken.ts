import type { TreeEffect, TreeEffectBuilder } from './types'
import { activateChain, clamp } from './helpers'

const DURATION = 2.0

export const buildSessionAwaken: TreeEffectBuilder = (ctx) => {
  const { branchChain, color } = ctx

  activateChain(branchChain, color)

  let elapsed = 0

  return {
    tick(dt) {
      elapsed += dt
      const t = clamp(elapsed / DURATION, 0, 1)

      // Warm pulse that fades
      for (const branch of branchChain) {
        branch.pulse = Math.max(branch.pulse, (1 - t) * 0.7)
      }

      return t < 1
    },
    dispose() {},
  }
}
