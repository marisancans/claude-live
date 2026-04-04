/**
 * WRITE — Lance + landing scatter.
 * Bright thick comet to far destination, then 5 dots scatter from landing point.
 */
import * as THREE from 'three'
import type { SpawnParams } from '../types'
import { rand, scatter, randDir, perpTo, ZERO } from './helpers'

export function profileWrite(
  filePos?: THREE.Vector3,
  _toolInput?: Record<string, unknown> | null,
  _toolResponse?: Record<string, unknown> | null,
): SpawnParams {
  const target = filePos?.clone() ?? scatter(90, 190)
  const dir = target.clone().normalize()
  const r = target.length()
  const c1 = dir.clone().multiplyScalar(r * 0.45)
    .add(perpTo(dir).multiplyScalar(rand(0, 6)))

  const pendingSpawns: SpawnParams[] = Array.from({ length: 5 }, (_, i) => {
    const scatterDir = randDir()
    scatterDir.y *= 0.3
    scatterDir.normalize()
    return {
      origin: target.clone().add(new THREE.Vector3(rand(-1, 1), rand(-1, 1), rand(-1, 1))),
      target: target.clone().add(scatterDir.multiplyScalar(rand(8, 22))),
      color: new THREE.Color('#b0d4ff'),
      colorEnd: new THREE.Color('#b0d4ff'),
      travelTime: rand(0.5, 1.0),
      trailLength: 0.5,
      trailBrightness: 1.1,
      trailFadeTime: 14.0,
      headSize: 3,
      spawnDelay: i * 0.04,
      pathConfig: { type: 'linear', easing: 'easeOutCubic' },
      _tool: 'Write:scatter',
    }
  })

  return {
    origin: ZERO.clone(), target,
    color: new THREE.Color('#60a5fa'),
    colorEnd: new THREE.Color('#bfdbfe'),
    travelTime: rand(2.8, 4.0),
    trailLength: 0.55,
    trailBrightness: 2.2,
    trailFadeTime: rand(22.0, 28.0),
    headSize: 0,
    pathConfig: { type: 'quadratic', easing: 'easeInCubic', c1 },
    _tool: 'Write',
  }
}
