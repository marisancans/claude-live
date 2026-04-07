/**
 * HistoryWarpIn — animates history stars warping in from deep space.
 *
 * Each star:
 *   - Starts far out along the direction of its final position
 *   - Flies in with easeOutExpo easing
 *   - Has a multi-segment trail (position history) with head-to-tail color fade
 *   - Flashes on landing then settles
 *
 * Stars are split into staggered waves so they don't all arrive at once.
 * Exposes a `warpIntensity` (1→0) that external systems (e.g. chromatic aberration)
 * can read to drive shader effects only during the warp-in phase.
 */
import * as THREE from 'three'

const TRAIL_SEGS = 50
const WAVE_COUNT = 5
const DURATION = 6.0
const START_DISTANCE_MIN = 800
const START_DISTANCE_RANGE = 600

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

interface WarpStar {
  mesh: THREE.Mesh
  mat: THREE.MeshBasicMaterial
  trail: THREE.Line
  trailGeo: THREE.BufferGeometry
  startPos: THREE.Vector3
  finalPos: THREE.Vector3
  color: THREE.Color
  delay: number
  speed: number
  history: THREE.Vector3[]
  settled: boolean
  landFlash: number
}

export class HistoryWarpIn {
  readonly group: THREE.Group
  /** 1.0 at start of warp, decays to 0 when all stars settled. Read by ThreeApp for shader control. */
  warpIntensity = 1.0
  /** True when all stars have settled and trails faded — safe to dispose. */
  done = false

  private stars: WarpStar[] = []
  private elapsed = 0
  private onSettle: (pos: THREE.Vector3, color: THREE.Color) => void

  constructor(
    events: Array<{ finalPos: THREE.Vector3; color: THREE.Color }>,
    onSettle: (pos: THREE.Vector3, color: THREE.Color) => void,
  ) {
    this.group = new THREE.Group()
    this.onSettle = onSettle

    for (let i = 0; i < events.length; i++) {
      const { finalPos, color } = events[i]
      const wave = Math.floor(Math.random() * WAVE_COUNT)
      const delay = wave * 0.8 + Math.random() * 0.5

      const dir = finalPos.clone().normalize()
      const startPos = dir.clone().multiplyScalar(START_DISTANCE_MIN + Math.random() * START_DISTANCE_RANGE)

      // Star mesh
      const geo = new THREE.SphereGeometry(0.6, 8, 6)
      const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0 })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.copy(startPos)
      this.group.add(mesh)

      // Multi-segment trail with vertex colors
      const positions = new Float32Array(TRAIL_SEGS * 3)
      const colors = new Float32Array(TRAIL_SEGS * 3)
      const trailGeo = new THREE.BufferGeometry()
      trailGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      trailGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
      trailGeo.setDrawRange(0, 0)
      const trailMat = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
      })
      const trail = new THREE.Line(trailGeo, trailMat)
      this.group.add(trail)

      this.stars.push({
        mesh, mat, trail, trailGeo,
        startPos: startPos.clone(),
        finalPos,
        color: color.clone(),
        delay,
        speed: 0.7 + Math.random() * 0.6,
        history: [],
        settled: false,
        landFlash: 0,
      })
    }
  }

  tick(dt: number) {
    this.elapsed += dt

    // Global warp intensity — quadratic decay over the warp window
    const totalWarpTime = DURATION * 1.2
    const raw = Math.max(0, 1 - this.elapsed / totalWarpTime)
    this.warpIntensity = raw * raw

    let allDone = true

    for (const s of this.stars) {
      const t = Math.max(0, this.elapsed - s.delay) / (DURATION * s.speed)

      if (t <= 0) {
        s.mat.opacity = 0
        s.trailGeo.setDrawRange(0, 0)
        allDone = false
        continue
      }

      const p = Math.min(t, 1)
      const e = easeOutExpo(p)

      // Move star
      s.mesh.position.lerpVectors(s.startPos, s.finalPos, e)
      s.mat.opacity = Math.min(0.9, t * 4)

      // Record trail history
      s.history.push(s.mesh.position.clone())
      if (s.history.length > TRAIL_SEGS) s.history.shift()

      // Update trail geometry
      const n = s.history.length
      const tPos = s.trailGeo.attributes.position as THREE.BufferAttribute
      const tCol = s.trailGeo.attributes.color as THREE.BufferAttribute
      for (let j = 0; j < n; j++) {
        const hp = s.history[j]
        tPos.array[j * 3] = hp.x
        tPos.array[j * 3 + 1] = hp.y
        tPos.array[j * 3 + 2] = hp.z
        // Head-to-tail fade, dims as star approaches destination
        const headFade = j / n
        const trailAlpha = headFade * (1 - p * 0.7)
        tCol.array[j * 3] = s.color.r * trailAlpha
        tCol.array[j * 3 + 1] = s.color.g * trailAlpha
        tCol.array[j * 3 + 2] = s.color.b * trailAlpha
      }
      tPos.needsUpdate = true
      tCol.needsUpdate = true
      s.trailGeo.setDrawRange(0, n)

      // Landing
      if (p >= 1 && !s.settled) {
        s.settled = true
        s.landFlash = 1.0
        this.onSettle(s.finalPos, s.color)
      }

      if (s.landFlash > 0) {
        s.landFlash = Math.max(0, s.landFlash - dt * 1.5)
        s.mesh.scale.setScalar(1 + s.landFlash * 2.5)
        s.mat.opacity = 0.8 + s.landFlash * 0.2
      }

      // Not done until trail has faded out after settling
      if (!s.settled || s.landFlash > 0) {
        allDone = false
      }
    }

    this.done = allDone && this.warpIntensity <= 0
  }

  dispose() {
    for (const s of this.stars) {
      s.mesh.geometry.dispose()
      s.mat.dispose()
      s.trailGeo.dispose()
      ;(s.trail.material as THREE.Material).dispose()
    }
  }
}
