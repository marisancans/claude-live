/**
 * READ — Scan at file node, then data streams flow to core.
 *
 * Origin = file position (where the file lives in space).
 * Target = near core (data arriving home).
 *
 * The main node IS one data stream: a bright line traveling file → core
 * with a long-lasting trail so the connection lingers visibly.
 *
 * At the origin (file pos), a scan ring + sweep lines fire immediately
 * at the start of travel — visualizing the read happening at the file.
 *
 * Additional data stream clones (pendingSpawns) are staggered slightly
 * behind the main stream. Count scales with file content length.
 */
import * as THREE from 'three'
import type { SpawnParams } from '../types'
import { rand, scatter } from './helpers'

export function profileRead(
  filePos?: THREE.Vector3,
  _toolInput?: Record<string, unknown> | null,
  toolResponse?: Record<string, unknown> | null,
): SpawnParams {
  const fileOrigin = filePos?.clone() ?? scatter(40, 100)
  const coreTarget = scatter(1, 6)

  // Data stream: file → core
  // headSize=0 — no round blob. The trail is the data, the diamond effect is the head.
  // Long trailFadeTime so the connection wire lingers after arrival.
  // Quadratic arc — gives the magnetic pull a slight curve as bits converge
  // Midpoint between origin and target, pushed far off-axis for strong curvature
  const mid = new THREE.Vector3().addVectors(fileOrigin, coreTarget).multiplyScalar(0.5)
  const bend = new THREE.Vector3(
    mid.x + (Math.random() - 0.5) * 80,
    mid.y + (Math.random() - 0.5) * 80,
    mid.z + (Math.random() - 0.5) * 80,
  )

  return {
    origin: fileOrigin,
    target: coreTarget,
    color: new THREE.Color('#fcd34d'),
    colorEnd: new THREE.Color('#fef9c3'),
    travelTime: rand(2.8, 4.0),
    trailLength: rand(0.20, 0.30),
    trailBrightness: rand(2.0, 2.6),
    trailFadeTime: rand(22.0, 28.0),
    headSize: 0,
    pathConfig: { type: 'quadratic', easing: 'easeInCubic', c1: bend },
    _tool: 'Read',
  }
}
