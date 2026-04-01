/**
 * GLOB — Seeker trail + scatter missiles.
 *
 * During travel: a sharp seeker trail follows the node head (accumulated points).
 * On landing: missiles launch from target, seek outward. Hits glow green and
 * arc back, misses turn red and dissolve.
 */
import * as THREE from 'three'
import type { SpawnParams } from '../types'
import type { SecondaryEffect } from './types'

function rand(a: number, b: number) { return Math.random() * (b - a) + a }

// ── Shared shader ───────────────────────────────────────────────────────────

const VERT = /* glsl */`
  attribute float aT;
  varying float vT;
  void main() {
    vT = aT;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const FRAG = /* glsl */`
  uniform float uTime;
  uniform float uOpacity;
  uniform vec3  uBaseColor;
  uniform vec3  uTipColor;
  uniform float uPhase;
  varying float vT;

  void main() {
    vec3 col = mix(uBaseColor, uTipColor, vT);

    float flow = sin((vT * 8.0 - uTime * 2.0 + uPhase) * 3.14159);
    flow = pow(max(0.0, flow), 3.0) * 0.3;
    col += uTipColor * flow;

    float head = smoothstep(0.9, 1.0, vT);
    col = mix(col, uTipColor * 1.5, head * 0.7);

    float bright = 0.4 + vT * 0.3 + flow * 0.3 + head * 0.8;
    float alpha  = uOpacity * (0.3 + vT * 0.3 + flow * 0.15 + head * 0.4);

    gl_FragColor = vec4(min(col * bright, 1.0), min(alpha, 1.0));
  }
`

// ── Trail: follows node head during travel ──────────────────────────────────

const TRAIL_PTS = 50

function buildTrail(group: THREE.Group) {
  const posArr = new Float32Array(TRAIL_PTS * 3)
  const tArr   = new Float32Array(TRAIL_PTS)
  const geo    = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(posArr, 3))
  geo.setAttribute('aT',       new THREE.BufferAttribute(tArr, 1))
  geo.setDrawRange(0, 0)

  const mat = new THREE.ShaderMaterial({
    vertexShader: VERT, fragmentShader: FRAG,
    uniforms: {
      uTime:      { value: 0 },
      uOpacity:   { value: 0.9 },
      uBaseColor: { value: new THREE.Vector3(0.2, 0.12, 0.4) },
      uTipColor:  { value: new THREE.Vector3(0.6, 0.4, 1.0) },
      uPhase:     { value: rand(0, 6.28) },
    },
    blending: THREE.AdditiveBlending, transparent: true, depthWrite: false,
  })

  const line = new THREE.Line(geo, mat)
  group.add(line)

  const history: THREE.Vector3[] = []
  let tailIdx = 0
  let eating  = false
  let ptCount = 0

  function pushPoint(pos: THREE.Vector3) {
    history.push(pos.clone())
    const n = Math.min(history.length, TRAIL_PTS)
    const off = history.length - n
    for (let i = 0; i < n; i++) {
      const pt = history[off + i]
      posArr[i*3] = pt.x; posArr[i*3+1] = pt.y; posArr[i*3+2] = pt.z
      tArr[i] = i / (n - 1 || 1)
    }
    ptCount = n
    ;(geo.attributes.position as THREE.BufferAttribute).needsUpdate = true
    ;(geo.attributes.aT       as THREE.BufferAttribute).needsUpdate = true
    geo.setDrawRange(0, ptCount)
  }

  function startEating() { eating = true; tailIdx = 0 }

  function tickEat(dt: number): boolean {
    if (!eating) return false
    tailIdx = Math.min(ptCount - 1, tailIdx + dt * 30)
    const tail  = Math.round(tailIdx)
    const count = ptCount - tail
    if (count <= 1) { geo.setDrawRange(0, 0); return true }
    geo.setDrawRange(tail, count)
    for (let i = tail; i < ptCount; i++) tArr[i] = (i - tail) / (count - 1)
    ;(geo.attributes.aT as THREE.BufferAttribute).needsUpdate = true
    return false
  }

  function tickTime(dt: number) { mat.uniforms.uTime.value += dt }

  return { line, geo, mat, pushPoint, startEating, tickEat, tickTime }
}

// ── Missiles: scatter on landing ────────────────────────────────────────────

const MAX_PTS    = 80
const N_MISSILES = 10
const HIT_RATIO  = 0.35

type MissileState = 'waiting' | 'seeking' | 'hit_returning' | 'miss_dying' | 'done'

interface Missile {
  origin: THREE.Vector3; isHit: boolean; fireDelay: number
  pos: THREE.Vector3; vel: THREE.Vector3; searchDist: number
  gravity: THREE.Vector3; drift: THREE.Vector3
  returnStart: THREE.Vector3; returnArc: THREE.Vector3; returnT: number; returnDur: number
  points: THREE.Vector3[]; posArr: Float32Array; tArr: Float32Array
  geo: THREE.BufferGeometry; mat: THREE.ShaderMaterial; line: THREE.Line; ptCount: number
  state: MissileState; elapsed: number; stateTime: number; tailIdx: number
}

function bezier(a: THREE.Vector3, c: THREE.Vector3, b: THREE.Vector3, t: number): THREE.Vector3 {
  const u = 1 - t
  return new THREE.Vector3(
    u*u*a.x + 2*u*t*c.x + t*t*b.x,
    u*u*a.y + 2*u*t*c.y + t*t*b.y,
    u*u*a.z + 2*u*t*c.z + t*t*b.z,
  )
}

function makeMissile(group: THREE.Group, origin: THREE.Vector3, fireDelay: number, isHit: boolean, allMissiles: Missile[]): Missile {
  const theta = rand(0, Math.PI * 2), phi = rand(-0.6, 0.6)
  const dir = new THREE.Vector3(Math.cos(theta)*Math.cos(phi), Math.sin(phi), Math.sin(theta)*Math.cos(phi)).normalize()
  const vel = dir.clone().multiplyScalar(rand(14, 22))

  const posArr = new Float32Array(MAX_PTS * 3)
  const tArr   = new Float32Array(MAX_PTS)
  const geo    = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(posArr, 3))
  geo.setAttribute('aT',       new THREE.BufferAttribute(tArr, 1))
  geo.setDrawRange(0, 0)

  const mat = new THREE.ShaderMaterial({
    vertexShader: VERT, fragmentShader: FRAG,
    uniforms: {
      uTime:      { value: 0 },
      uOpacity:   { value: 0.85 },
      uBaseColor: { value: new THREE.Vector3(0.2, 0.12, 0.4) },
      uTipColor:  { value: new THREE.Vector3(0.5, 0.35, 0.9) },
      uPhase:     { value: rand(0, 6.28) },
    },
    blending: THREE.AdditiveBlending, transparent: true, depthWrite: false,
  })

  const line = new THREE.Line(geo, mat); line.visible = false; group.add(line)
  posArr[0] = origin.x; posArr[1] = origin.y; posArr[2] = origin.z; tArr[0] = 0

  const m: Missile = {
    origin: origin.clone(), isHit, fireDelay,
    pos: origin.clone(), vel, searchDist: rand(20, 45),
    gravity: new THREE.Vector3(rand(-1.5,1.5), rand(-3,-1), rand(-1.5,1.5)),
    drift: new THREE.Vector3(rand(-2,2), rand(-.5,.5), rand(-2,2)),
    returnStart: new THREE.Vector3(), returnArc: new THREE.Vector3(), returnT: 0, returnDur: rand(1.2, 2.0),
    points: [origin.clone()], posArr, tArr, geo, mat, line, ptCount: 1,
    state: 'waiting', elapsed: 0, stateTime: 0, tailIdx: 0,
  }
  allMissiles.push(m)
  return m
}

function syncBuffer(m: Missile) {
  const n = Math.min(m.points.length, MAX_PTS), off = m.points.length - n
  for (let i = 0; i < n; i++) {
    const pt = m.points[off + i]
    m.posArr[i*3] = pt.x; m.posArr[i*3+1] = pt.y; m.posArr[i*3+2] = pt.z
    m.tArr[i] = i / (n - 1 || 1)
  }
  m.ptCount = n
  ;(m.geo.attributes.position as THREE.BufferAttribute).needsUpdate = true
  ;(m.geo.attributes.aT       as THREE.BufferAttribute).needsUpdate = true
}

function tickMissile(m: Missile, dt: number) {
  m.elapsed += dt; m.mat.uniforms.uTime.value = m.elapsed
  if (m.state === 'waiting') {
    if (m.elapsed >= m.fireDelay) { m.state = 'seeking'; m.stateTime = 0; m.line.visible = true }
    return
  }
  m.stateTime += dt

  if (m.state === 'seeking') {
    m.vel.addScaledVector(m.gravity, dt); m.vel.addScaledVector(m.drift, dt); m.vel.multiplyScalar(1 - dt * 0.3)
    m.pos.addScaledVector(m.vel, dt); m.points.push(m.pos.clone()); syncBuffer(m); m.geo.setDrawRange(0, m.ptCount)
    if (m.pos.distanceTo(m.origin) >= m.searchDist) {
      if (m.isHit) {
        m.state = 'hit_returning'; m.stateTime = 0; m.returnStart.copy(m.pos)
        const mid = m.pos.clone().add(m.origin).multiplyScalar(0.5)
        m.returnArc.set(mid.x + rand(-18,18), mid.y + rand(8,25), mid.z + rand(-18,18)); m.returnT = 0
        m.mat.uniforms.uBaseColor.value.set(0.05, 0.35, 0.15); m.mat.uniforms.uTipColor.value.set(0.3, 1.0, 0.5)
      } else {
        m.state = 'miss_dying'; m.stateTime = 0; m.tailIdx = 0
        m.mat.uniforms.uBaseColor.value.set(0.3, 0.05, 0.05); m.mat.uniforms.uTipColor.value.set(0.5, 0.1, 0.08)
      }
    }
  } else if (m.state === 'hit_returning') {
    m.returnT = Math.min(1, m.returnT + dt / m.returnDur)
    const e = m.returnT < 0.5 ? 2*m.returnT*m.returnT : 1 - Math.pow(-2*m.returnT+2, 2)/2
    m.pos.copy(bezier(m.returnStart, m.returnArc, m.origin, e))
    m.points.push(m.pos.clone()); syncBuffer(m); m.geo.setDrawRange(0, m.ptCount)
    if (m.returnT >= 1) { m.state = 'miss_dying'; m.stateTime = 0; m.tailIdx = 0 }
  } else if (m.state === 'miss_dying') {
    const eatSpeed = m.isHit ? 25 : 15
    m.tailIdx = Math.min(m.ptCount - 1, m.tailIdx + dt * eatSpeed)
    const tail = Math.round(m.tailIdx), count = m.ptCount - tail
    if (count <= 1) { m.state = 'done'; m.geo.setDrawRange(0, 0); m.line.visible = false; return }
    m.geo.setDrawRange(tail, count)
    for (let i = tail; i < m.ptCount; i++) m.tArr[i] = (i - tail) / (count - 1)
    ;(m.geo.attributes.aT as THREE.BufferAttribute).needsUpdate = true
    if (!m.isHit) m.mat.uniforms.uOpacity.value = Math.max(0, 0.85 - m.stateTime * 0.4)
  }
}

// ── Main export ─────────────────────────────────────────────────────────────

export function buildGlobSeekers(group: THREE.Group, p: SpawnParams): SecondaryEffect {
  const allMissiles: Missile[] = []
  const trail = buildTrail(group)

  // Create missiles — stagger fire, but they only start after landing
  const missiles: Missile[] = []
  const indices = Array.from({ length: N_MISSILES }, (_, i) => i)
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); [indices[i], indices[j]] = [indices[j], indices[i]]
  }
  for (let i = 0; i < N_MISSILES; i++) {
    missiles.push(makeMissile(group, p.target, rand(0.1, 3.0), indices[i] < N_MISSILES * HIT_RATIO, allMissiles))
  }

  let landed    = false
  let landTime  = 0
  let trailDone = false

  const effect: SecondaryEffect = {
    entries: [],
    suppressDefaultTrail: true,

    trailTick(prog, dt, _elapsed, head) {
      trail.tickTime(dt)

      // ── During travel: accumulate seeker trail behind the node head ──
      if (prog < 1) {
        trail.pushPoint(head.position)
      }

      // ── On landing: start eating the travel trail + launch missiles ──
      if (prog >= 1 && !landed) {
        landed = true
        landTime = 0
        trail.pushPoint(head.position) // final point
        trail.startEating()
      }

      if (landed) {
        landTime += dt
        if (!trailDone) trailDone = trail.tickEat(dt)
        for (const m of missiles) tickMissile(m, dt)
      }

      // Done when trail is eaten and all missiles are done
      if (landed && trailDone && allMissiles.every(m => m.state === 'done')) {
        effect.shouldMarkDone = true
      }
    },

    tick() {},
    onLand() {},
    applyFade(_f) {},
    shouldMarkDone: false,

    dispose() {
      trail.geo.dispose(); trail.mat.dispose()
      for (const m of allMissiles) { m.geo.dispose(); m.mat.dispose() }
    },
  }
  return effect
}
