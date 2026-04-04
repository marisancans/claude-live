import * as THREE from 'three'
import type { TreeEffect, TreeEffectBuilder } from './types'
import { activateChain, clamp } from './helpers'

const DURATION = 0.8

export const buildGrepShimmer: TreeEffectBuilder = (ctx, colonyGroup) => {
  const { branchChain, color, targetBlossom } = ctx

  activateChain(branchChain, color)

  // Sparkle sprite at target blossom
  let sparkle: THREE.Sprite | null = null
  let sparkleMat: THREE.SpriteMaterial | null = null
  if (targetBlossom) {
    sparkleMat = new THREE.SpriteMaterial({
      color: color.clone(),
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    sparkle = new THREE.Sprite(sparkleMat)
    sparkle.position.copy(targetBlossom.position)
    sparkle.scale.setScalar(3)
    colonyGroup.add(sparkle)
  }

  let elapsed = 0

  return {
    tick(dt) {
      elapsed += dt
      const t = clamp(elapsed / DURATION, 0, 1)

      if (sparkle && sparkleMat) {
        sparkle.scale.setScalar(3 + Math.sin(elapsed * 20) * 1.5 * (1 - t))
        sparkleMat.opacity = 0.8 * (1 - t)
      }

      return t < 1
    },
    dispose() {
      if (sparkle) {
        colonyGroup.remove(sparkle)
        sparkleMat?.dispose()
      }
    },
  }
}
