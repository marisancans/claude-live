import * as THREE from 'three'
import type { SpawnParams } from '../../travel/types'
import type { SecondaryEffect } from '../../travel/effects/types'
import type { EffectVariation } from './prompt'

function rand(a: number, b: number) { return Math.random() * (b - a) + a }
const CORE = new THREE.Vector3(0, 0, 0)

function baseGlob(): SpawnParams {
  const theta  = Math.random() * Math.PI * 2
  const r      = rand(60, 110)
  const target = new THREE.Vector3(Math.cos(theta) * r, rand(-8, 15), Math.sin(theta) * r * 0.5)
  const mid    = target.clone().multiplyScalar(0.5)
  return {
    origin: CORE.clone(), target,
    color: new THREE.Color('#a78bfa'), colorEnd: new THREE.Color('#e9d5ff'),
    travelTime: rand(2.5, 3.5), trailLength: 0, trailBrightness: 0,
    trailFadeTime: 30.0, headSize: 0,
    pathConfig: { type: 'quadratic', easing: 'easeInOut',
      c1: new THREE.Vector3(mid.x + rand(-25,25), mid.y + rand(10,35), mid.z + rand(-20,20)) },
    _tool: 'Glob:demo',
  }
}

// ════════════════════════════════════════════════════════════════════════════════
// SEEKER MISSILES
//
// Missiles launch from the node one by one at staggered intervals.
// Each one flies outward leaving an accumulating trail (like a thread).
// After reaching its search distance, it either:
//   HIT  → changes color (bright green-cyan glow, trail turns bright),
//          then curves back to the node along a new arc, trail still growing.
//          On arrival the trail eats itself from the tail (window slider).
//   MISS → dims to red, trail eats itself from the head (tip dissolves outward).
//
// Each missile is a Line with accumulated points + a ShaderMaterial.
// ════════════════════════════════════════════════════════════════════════════════

const MAX_PTS   = 80
const N_MISSILES = 10
const HIT_RATIO  = 0.35

// ── Shader ──────────────────────────────────────────────────────────────────

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

    // energy flow racing toward tip
    float flow = sin((vT * 8.0 - uTime * 2.0 + uPhase) * 3.14159);
    flow = pow(max(0.0, flow), 3.0) * 0.3;
    col += uTipColor * flow;

    // hot head: last 10% glows bright
    float head = smoothstep(0.9, 1.0, vT);
    col = mix(col, uTipColor * 1.5, head * 0.7);

    float bright = 0.4 + vT * 0.3 + flow * 0.3 + head * 0.8;
    float alpha  = uOpacity * (0.3 + vT * 0.3 + flow * 0.15 + head * 0.4);

    gl_FragColor = vec4(min(col * bright, 1.0), min(alpha, 1.0));
  }
`

type MissileState = 'waiting' | 'seeking' | 'hit_returning' | 'miss_dying' | 'done'

interface Missile {
  origin:    THREE.Vector3
  isHit:     boolean
  fireDelay: number

  // flight
  pos:       THREE.Vector3
  vel:       THREE.Vector3
  searchDist: number
  gravity:   THREE.Vector3
  drift:     THREE.Vector3

  // return (hits only)
  returnStart:  THREE.Vector3
  returnArc:    THREE.Vector3
  returnT:      number
  returnDur:    number

  // trail geometry
  points:    THREE.Vector3[]
  posArr:    Float32Array
  tArr:      Float32Array
  geo:       THREE.BufferGeometry
  mat:       THREE.ShaderMaterial
  line:      THREE.Line
  ptCount:   number

  // state
  state:     MissileState
  elapsed:   number
  stateTime: number

  // reel (eating the trail)
  tailIdx:   number
}

function buildSeekerMissiles(group: THREE.Group, p: SpawnParams): SecondaryEffect {
  const allMissiles: Missile[] = []

  function makeMissile(fireDelay: number, isHit: boolean): Missile {
    const theta = rand(0, Math.PI * 2)
    const phi   = rand(-0.6, 0.6)
    const dir   = new THREE.Vector3(
      Math.cos(theta) * Math.cos(phi),
      Math.sin(phi),
      Math.sin(theta) * Math.cos(phi),
    ).normalize()

    const speed = rand(14, 22)
    const vel   = dir.clone().multiplyScalar(speed)

    const posArr = new Float32Array(MAX_PTS * 3)
    const tArr   = new Float32Array(MAX_PTS)
    const geo    = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(posArr, 3))
    geo.setAttribute('aT',       new THREE.BufferAttribute(tArr, 1))
    geo.setDrawRange(0, 0)

    // seeking color: dim violet
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

    const line = new THREE.Line(geo, mat)
    line.visible = false
    group.add(line)

    posArr[0] = p.target.x; posArr[1] = p.target.y; posArr[2] = p.target.z
    tArr[0] = 0

    const m: Missile = {
      origin: p.target.clone(), isHit, fireDelay,
      pos: p.target.clone(), vel,
      searchDist: rand(20, 45),
      gravity: new THREE.Vector3(rand(-1.5, 1.5), rand(-3, -1), rand(-1.5, 1.5)),
      drift: new THREE.Vector3(rand(-2, 2), rand(-0.5, 0.5), rand(-2, 2)),
      returnStart: new THREE.Vector3(), returnArc: new THREE.Vector3(),
      returnT: 0, returnDur: rand(1.2, 2.0),
      points: [p.target.clone()],
      posArr, tArr, geo, mat, line, ptCount: 1,
      state: 'waiting', elapsed: 0, stateTime: 0,
      tailIdx: 0,
    }
    allMissiles.push(m)
    return m
  }

  // create missiles — stagger fire over ~3s
  const missiles: Missile[] = []
  const indices = Array.from({ length: N_MISSILES }, (_, i) => i)
  // shuffle so hits and misses are interleaved
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[indices[i], indices[j]] = [indices[j], indices[i]]
  }
  for (let i = 0; i < N_MISSILES; i++) {
    const isHit = indices[i] < N_MISSILES * HIT_RATIO
    missiles.push(makeMissile(rand(0.1, 3.0), isHit))
  }

  // ── Sync buffer ───────────────────────────────────────────────────────────

  function syncBuffer(m: Missile) {
    const n = Math.min(m.points.length, MAX_PTS)
    const off = m.points.length - n
    for (let i = 0; i < n; i++) {
      const pt = m.points[off + i]
      m.posArr[i*3] = pt.x; m.posArr[i*3+1] = pt.y; m.posArr[i*3+2] = pt.z
      m.tArr[i] = i / (n - 1 || 1)
    }
    m.ptCount = n
    ;(m.geo.attributes.position as THREE.BufferAttribute).needsUpdate = true
    ;(m.geo.attributes.aT       as THREE.BufferAttribute).needsUpdate = true
  }

  // ── Bezier ────────────────────────────────────────────────────────────────

  function bezier(a: THREE.Vector3, c: THREE.Vector3, b: THREE.Vector3, t: number): THREE.Vector3 {
    const u = 1 - t
    return new THREE.Vector3(
      u*u*a.x + 2*u*t*c.x + t*t*b.x,
      u*u*a.y + 2*u*t*c.y + t*t*b.y,
      u*u*a.z + 2*u*t*c.z + t*t*b.z,
    )
  }

  // ── Per-missile tick ──────────────────────────────────────────────────────

  function tickMissile(m: Missile, dt: number) {
    m.elapsed += dt
    m.mat.uniforms.uTime.value = m.elapsed

    // ── WAITING ──
    if (m.state === 'waiting') {
      if (m.elapsed >= m.fireDelay) {
        m.state = 'seeking'
        m.stateTime = 0
        m.line.visible = true
      }
      return
    }

    m.stateTime += dt

    // ── SEEKING: fly outward with physics, accumulate trail ──
    if (m.state === 'seeking') {
      m.vel.addScaledVector(m.gravity, dt)
      m.vel.addScaledVector(m.drift, dt)
      m.vel.multiplyScalar(1 - dt * 0.3)

      m.pos.addScaledVector(m.vel, dt)
      m.points.push(m.pos.clone())
      syncBuffer(m)
      m.geo.setDrawRange(0, m.ptCount)

      if (m.pos.distanceTo(m.origin) >= m.searchDist) {
        if (m.isHit) {
          // ── TRANSITION TO HIT ──
          m.state = 'hit_returning'
          m.stateTime = 0
          m.returnStart.copy(m.pos)
          // arc control: perpendicular offset for a nice curve back
          const mid = m.pos.clone().add(m.origin).multiplyScalar(0.5)
          m.returnArc.set(
            mid.x + rand(-18, 18),
            mid.y + rand(8, 25),
            mid.z + rand(-18, 18),
          )
          m.returnT = 0
          // change colors — bright green glow = "found something!"
          m.mat.uniforms.uBaseColor.value.set(0.05, 0.35, 0.15)
          m.mat.uniforms.uTipColor.value.set(0.3, 1.0, 0.5)
        } else {
          // ── TRANSITION TO MISS ──
          m.state = 'miss_dying'
          m.stateTime = 0
          m.tailIdx = 0
          // change colors — dim red = "nothing here"
          m.mat.uniforms.uBaseColor.value.set(0.3, 0.05, 0.05)
          m.mat.uniforms.uTipColor.value.set(0.5, 0.1, 0.08)
        }
      }
    }

    // ── HIT RETURNING: curve back to node, trail keeps growing ──
    else if (m.state === 'hit_returning') {
      m.returnT = Math.min(1, m.returnT + dt / m.returnDur)
      // ease-in-out for smooth arc
      const eased = m.returnT < 0.5
        ? 2 * m.returnT * m.returnT
        : 1 - Math.pow(-2 * m.returnT + 2, 2) / 2
      m.pos.copy(bezier(m.returnStart, m.returnArc, m.origin, eased))
      m.points.push(m.pos.clone())
      syncBuffer(m)
      m.geo.setDrawRange(0, m.ptCount)

      // arrived — now eat the trail from tail (root side)
      if (m.returnT >= 1) {
        m.state = 'miss_dying'  // reuse the eating logic
        m.stateTime = 0
        m.tailIdx = 0
      }
    }

    // ── DYING (both hit and miss): trail eats from tail ──
    else if (m.state === 'miss_dying') {
      const eatSpeed = m.isHit ? 25 : 15  // hits eat faster (snappy), misses slower (fizzle)
      m.tailIdx = Math.min(m.ptCount - 1, m.tailIdx + dt * eatSpeed)
      const tail  = Math.round(m.tailIdx)
      const count = m.ptCount - tail

      if (count <= 1) {
        m.state = 'done'
        m.geo.setDrawRange(0, 0)
        m.line.visible = false
        return
      }

      m.geo.setDrawRange(tail, count)
      // renormalize aT for visible portion
      for (let i = tail; i < m.ptCount; i++) {
        m.tArr[i] = (i - tail) / (count - 1)
      }
      ;(m.geo.attributes.aT as THREE.BufferAttribute).needsUpdate = true

      // misses also fade opacity
      if (!m.isHit) {
        m.mat.uniforms.uOpacity.value = Math.max(0, 0.85 - m.stateTime * 0.4)
      }
    }
  }

  // ── Effect ────────────────────────────────────────────────────────────────

  const effect: SecondaryEffect = {
    entries: [],
    suppressDefaultTrail: true,

    trailTick(_prog, dt) {
      for (const m of missiles) tickMissile(m, dt)
      if (allMissiles.every(m => m.state === 'done')) {
        effect.shouldMarkDone = true
      }
    },

    tick() {},
    onLand() {},
    applyFade(_f) {},
    shouldMarkDone: false,

    dispose() {
      for (const m of allMissiles) {
        m.geo.dispose()
        m.mat.dispose()
      }
    },
  }
  return effect
}

// ════════════════════════════════════════════════════════════════════════════════

export const GLOB_VARIATIONS: EffectVariation[] = [
  {
    name: 'Seeker Missiles',
    description: 'Missiles launch staggered, seek outward; hits glow green and arc back, misses turn red and dissolve',
    spawnParams: baseGlob,
    buildCustomEffect: buildSeekerMissiles,
  },
]
