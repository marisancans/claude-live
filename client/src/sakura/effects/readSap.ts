import * as THREE from 'three'
import type { TreeEffect, TreeEffectBuilder } from './types'
import { activateChain, clamp, createTrailPoints, curveFromChain, easeOutCubic, signalProgress } from './helpers'

const DURATION = 1.2

export const buildReadSap: TreeEffectBuilder = (ctx, colonyGroup) => {
  const { branchChain, color } = ctx
  const curve = curveFromChain(branchChain, 'inward') // reads always flow inward
  if (!curve) return { tick: () => false, dispose: () => {} }

  activateChain(branchChain, color)

  // Particle trail
  const trail = createTrailPoints(color, 20)
  colonyGroup.add(trail.points)

  let elapsed = 0
  let reached = false

  const effect: TreeEffect = {
    tick(dt) {
      elapsed += dt
      const t = clamp(elapsed / DURATION, 0, 1)
      const eased = easeOutCubic(t)

      // Move signal along branch chain via shader uniforms
      const { branchIndex, localT } = signalProgress(branchChain, eased)
      for (let i = 0; i < branchChain.length; i++) {
        const branch = branchChain[i]
        if (i === branchIndex) {
          // For inward flow, signal goes from 1→0 on each branch
          branch.material.uniforms.uSignalPos.value = 1 - localT
          branch.material.uniforms.uSignalIntensity.value = (1 - t) * ctx.intensity
          branch.material.uniforms.uSignalColor.value.copy(color)
        } else if (i < branchIndex) {
          // Already passed — fade out
          branch.material.uniforms.uSignalIntensity.value *= 0.9
        } else {
          // Not yet reached
          branch.material.uniforms.uSignalIntensity.value = 0
        }
      }

      // Update trail positions along curve
      for (let i = 0; i < 20; i++) {
        const trailT = Math.max(0, eased - i * 0.015)
        const pos = curve.getPointAt(trailT)
        trail.positions[i * 3] = pos.x
        trail.positions[i * 3 + 1] = pos.y
        trail.positions[i * 3 + 2] = pos.z
      }
      trail.points.geometry.attributes.position.needsUpdate = true
      trail.material.opacity = 0.7 * (1 - t * 0.7)

      // Trigger onReachTarget near end
      if (t > 0.85 && !reached) {
        reached = true
        effect.onReachTarget?.()
      }

      if (t >= 1) {
        effect.onComplete?.()
        return false
      }
      return true
    },

    onReachTarget() {
      // Pulse the target blossom if exists
      // (handled by SignalSystem which reads this callback)
    },

    dispose() {
      colonyGroup.remove(trail.points)
      trail.points.geometry.dispose()
      trail.material.dispose()
      // Clear signal uniforms
      for (const branch of branchChain) {
        branch.material.uniforms.uSignalPos.value = -1
        branch.material.uniforms.uSignalIntensity.value = 0
      }
    },
  }

  return effect
}
