import * as THREE from 'three'
import type { EasingType, PathConfig } from './types'

export function applyEasing(type: EasingType, t: number): number {
  switch (type) {
    case 'easeOutCubic':  return 1 - Math.pow(1 - t, 3)
    case 'easeOutQuart':  return 1 - Math.pow(1 - t, 4)
    case 'easeInQuad':    return t * t
    case 'easeInCubic':   return t * t * t
    case 'easeInPow25':   return Math.pow(t, 2.5)
    case 'easeInOut':     return t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t+2, 2)/2
    case 'easeOutThenIn': return t < 0.45
      ? 1 - Math.pow(1 - t/0.45, 2.5)
      : 1 - Math.pow(1 - t, 3)
    case 'linear':
    default:              return t
  }
}

export function samplePath(
  cfg: PathConfig,
  origin: THREE.Vector3,
  target: THREE.Vector3,
  t: number,
): THREE.Vector3 {
  const mt = 1 - t
  const out = new THREE.Vector3()

  switch (cfg.type) {
    case 'linear':
      out.lerpVectors(origin, target, t)
      break

    case 'quadratic': {
      const c = cfg.c1!
      const mt2 = mt*mt, t2 = t*t
      out.set(
        mt2*origin.x + 2*mt*t*c.x + t2*target.x,
        mt2*origin.y + 2*mt*t*c.y + t2*target.y,
        mt2*origin.z + 2*mt*t*c.z + t2*target.z,
      )
      break
    }

    case 'cubic': {
      const c1 = cfg.c1!, c2 = cfg.c2!
      const mt2 = mt*mt, mt3 = mt2*mt, t2 = t*t, t3 = t2*t
      out.set(
        mt3*origin.x + 3*mt2*t*c1.x + 3*mt*t2*c2.x + t3*target.x,
        mt3*origin.y + 3*mt2*t*c1.y + 3*mt*t2*c2.y + t3*target.y,
        mt3*origin.z + 3*mt2*t*c1.z + 3*mt*t2*c2.z + t3*target.z,
      )
      break
    }

    case 'arc': {
      const angle = cfg.arcStartAngle! + t * cfg.arcSweepAngle!
      const ac = cfg.arcCenter!, ar = cfg.arcRadius!
      out.set(
        ac.x + Math.cos(angle) * ar,
        ac.y + Math.sin(angle) * ar * 0.12,
        ac.z + Math.sin(angle) * ar,
      )
      break
    }

    case 'noise': {
      if (cfg.c1) {
        const c = cfg.c1, mt2 = mt*mt, t2 = t*t
        out.set(
          mt2*origin.x + 2*mt*t*c.x + t2*target.x,
          mt2*origin.y + 2*mt*t*c.y + t2*target.y,
          mt2*origin.z + 2*mt*t*c.z + t2*target.z,
        )
      } else {
        out.lerpVectors(origin, target, t)
      }
      const a = cfg.noiseAmp! * (1 - t * 0.75)
      const f = cfg.noiseFreq!, ph = cfg.noisePhase!
      out.x += Math.sin(t*f + ph)         * Math.sin(t*2.3) * a
      out.y += Math.cos(t*f*1.4 + ph)     * 0.35 * a * (1 - t)
      out.z += Math.sin(t*f*0.8 + ph+2.1) * Math.sin(t*3.1) * a
      break
    }
  }
  return out
}
