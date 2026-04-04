/**
 * COMPACT POST — Space Colonization Branch.
 * Mini SCA tree grows as glowing gold particles from the session core,
 * then fades. SCA drives node positions; THREE.Points makes them visible.
 * Replaces the supernova for compact:post.
 */
import * as THREE from 'three'
import type { SpawnParams } from '../types'
import type { SecondaryEffect } from './types'

// ---------------------------------------------------------------------------
// SCA constants (tuned for compact effect scale)
// ---------------------------------------------------------------------------
const ATTRACTOR_COUNT    = 80
const ATTRACTOR_RADIUS   = 60
const INFLUENCE_RADIUS   = 18
const KILL_RADIUS        = 6
const SEGMENT_LENGTH     = 5
const MAX_SEGMENTS       = 35
const STEP_INTERVAL      = 0.04   // seconds between growth steps
const FADE_DURATION      = 1.5   // seconds to fade out after growth

// ---------------------------------------------------------------------------
// Minimal SCA types
// ---------------------------------------------------------------------------
interface ScaNode {
  pos: THREE.Vector3
  parentIdx: number | null
}

// ---------------------------------------------------------------------------
// Module-level scratch vector — avoids per-call allocation inside growStep
// ---------------------------------------------------------------------------
const _scratch = new THREE.Vector3()

// ---------------------------------------------------------------------------
// Builder
// ---------------------------------------------------------------------------
export function buildCompactBranch(group: THREE.Group, _p: SpawnParams): SecondaryEffect {
  // --- Attractors ---
  const attractors: { pos: THREE.Vector3; active: boolean }[] = []
  for (let i = 0; i < ATTRACTOR_COUNT; i++) {
    let x = 0, y = 0, z = 0
    do {
      x = (Math.random() * 2 - 1) * ATTRACTOR_RADIUS
      y = (Math.random() * 2 - 1) * ATTRACTOR_RADIUS
      z = (Math.random() * 2 - 1) * ATTRACTOR_RADIUS
    } while (x * x + y * y + z * z > ATTRACTOR_RADIUS * ATTRACTOR_RADIUS)
    attractors.push({ pos: new THREE.Vector3(x, y, z), active: true })
  }

  // --- SCA skeleton ---
  const nodes: ScaNode[] = [{ pos: new THREE.Vector3(0, 0, 0), parentIdx: null }]

  // --- Points geometry — one point per SCA node (root + up to MAX_SEGMENTS children) ---
  const MAX_NODES = MAX_SEGMENTS + 1
  const posArr  = new Float32Array(MAX_NODES * 3)
  const sizeArr = new Float32Array(MAX_NODES)

  // Root node at origin
  posArr[0] = 0; posArr[1] = 0; posArr[2] = 0
  sizeArr[0] = 12.0

  const geo = new THREE.BufferGeometry()
  const posAttr  = new THREE.BufferAttribute(posArr,  3); posAttr.setUsage(THREE.DynamicDrawUsage)
  const sizeAttr = new THREE.BufferAttribute(sizeArr, 1); sizeAttr.setUsage(THREE.DynamicDrawUsage)
  geo.setAttribute('position', posAttr)
  geo.setAttribute('aSize',    sizeAttr)
  geo.setDrawRange(0, 1)   // root visible immediately

  const mat = new THREE.ShaderMaterial({
    uniforms: { uOpacity: { value: 1.0 } },
    vertexShader: `
      attribute float aSize;
      uniform float uOpacity;
      varying float vOpacity;
      void main() {
        vOpacity = uOpacity;
        gl_PointSize = aSize;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying float vOpacity;
      void main() {
        float d = length(gl_PointCoord - 0.5) * 2.0;
        float a = (1.0 - smoothstep(0.4, 1.0, d)) * vOpacity;
        gl_FragColor = vec4(1.0, 0.82, 0.38, a);
      }
    `,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
  })

  const points = new THREE.Points(geo, mat)
  group.add(points)

  // --- State ---
  let nodeCount = 1   // root already placed
  let stepTimer = 0
  let growing = true
  let fadeTimer = 0
  let activeAttractors = ATTRACTOR_COUNT

  function growStep(): boolean {
    if (activeAttractors === 0) return false

    const associations = new Map<number, THREE.Vector3[]>()
    const infR2 = INFLUENCE_RADIUS * INFLUENCE_RADIUS

    for (const att of attractors) {
      if (!att.active) continue
      let bestIdx = -1
      let bestD2 = infR2
      for (let ni = 0; ni < nodes.length; ni++) {
        const d2 = nodes[ni].pos.distanceToSquared(att.pos)
        if (d2 < bestD2) { bestD2 = d2; bestIdx = ni }
      }
      if (bestIdx >= 0) {
        const arr = associations.get(bestIdx) ?? []
        arr.push(att.pos)
        associations.set(bestIdx, arr)
      }
    }

    if (associations.size === 0) return false

    // Intentional: grow one child per step (single-best-node variant, matching
    // SpaceColonizationTree.ts behavior in this codebase). Standard SCA would
    // grow one child per associated node — we want controlled, slow growth here.
    let bestNodeIdx = -1, bestCount = 0
    for (const [idx, attPosArr] of associations) {
      if (attPosArr.length > bestCount || (attPosArr.length === bestCount && idx > bestNodeIdx)) {
        bestNodeIdx = idx
        bestCount = attPosArr.length
      }
    }
    if (bestNodeIdx < 0) return false

    const node = nodes[bestNodeIdx]
    const attPosArr = associations.get(bestNodeIdx)!

    const avgDir = new THREE.Vector3()
    for (const ap of attPosArr) {
      avgDir.add(_scratch.subVectors(ap, node.pos).normalize())
    }
    avgDir.divideScalar(attPosArr.length).normalize()

    avgDir.x += (Math.random() - 0.5) * 0.3
    avgDir.y += (Math.random() - 0.5) * 0.3
    avgDir.z += (Math.random() - 0.5) * 0.3
    avgDir.normalize()

    const newPos = node.pos.clone().addScaledVector(avgDir, SEGMENT_LENGTH)
    nodes.push({ pos: newPos, parentIdx: bestNodeIdx })

    const killR2 = KILL_RADIUS * KILL_RADIUS
    for (const att of attractors) {
      if (!att.active) continue
      if (newPos.distanceToSquared(att.pos) < killR2) {
        att.active = false
        activeAttractors--
      }
    }

    // Write new node as a point — size tapers slightly for deeper nodes
    const base = nodeCount * 3
    posArr[base]  = newPos.x; posArr[base + 1] = newPos.y; posArr[base + 2] = newPos.z
    sizeArr[nodeCount] = Math.max(5.0, 14.0 - nodes.length * 0.25)
    nodeCount++
    posAttr.needsUpdate  = true
    sizeAttr.needsUpdate = true
    geo.setDrawRange(0, nodeCount)

    return true
  }

  const effect: SecondaryEffect = {
    entries: [{ obj: points, mat, meta: {} }],
    suppressDefaultTrail: true,

    trailTick(_prog, dt, _elapsed, _head) {
      if (growing) {
        stepTimer += dt
        while (stepTimer >= STEP_INTERVAL) {
          stepTimer -= STEP_INTERVAL
          const grew = growStep()
          if (!grew || nodeCount > MAX_SEGMENTS || activeAttractors === 0) {
            growing = false
            break
          }
        }
      } else {
        fadeTimer += dt
        mat.uniforms.uOpacity.value = Math.max(0, 1.0 - fadeTimer / FADE_DURATION)
        if (fadeTimer >= FADE_DURATION) {
          effect.shouldMarkDone = true
        }
      }
    },

    tick(_prog: number, _dt: number, _elapsed: number, _state: string, _head: THREE.Object3D) {},
    onLand() {},
    applyFade(_f) {},
    shouldMarkDone: false,

    dispose() {
      geo.dispose()
      mat.dispose()
    },
  }

  return effect
}
