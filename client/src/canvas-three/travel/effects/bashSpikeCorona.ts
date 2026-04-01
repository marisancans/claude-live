/**
 * BASH — Spike Corona with ShaderMaterial glow.
 * Traveling pulse-train of shader bullets, spike corona erupts on landing.
 * Spikes stay alive for the full trailFadeTime — only cleared on dispose.
 */
import * as THREE from 'three'
import type { SpawnParams } from '../types'
import type { SecondaryEffect, EffectEntry } from './types'
import { samplePath } from '../easing'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sphereDir(i: number, n: number): THREE.Vector3 {
  const phi   = Math.acos(1 - 2 * (i + 0.5) / n)
  const theta = Math.PI * (1 + Math.sqrt(5)) * i
  return new THREE.Vector3(
    Math.sin(phi) * Math.cos(theta),
    Math.cos(phi),
    Math.sin(phi) * Math.sin(theta),
  ).normalize()
}

// ─── Spike ShaderMaterial ─────────────────────────────────────────────────────

const SPIKE_VERT = /* glsl */`
  attribute float aT;
  varying float vT;
  void main() {
    vT = aT;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const SPIKE_FRAG = /* glsl */`
  uniform float uOpacity;
  uniform float uPulse;
  varying float vT;
  void main() {
    vec3 core = vec3(0.6, 0.9, 0.5);
    vec3 tip  = vec3(0.0, 0.10, 0.02);
    vec3 col  = mix(core, tip, vT);
    float bright = pow(1.0 - vT, 0.8) * 0.5;
    float pulse  = uPulse * 0.3;
    float alpha  = (bright + pulse) * uOpacity;
    gl_FragColor = vec4(col * (bright + pulse + 0.05), alpha);
  }
`

function makeSpikeGeo(seg: number): THREE.BufferGeometry {
  const pos  = new Float32Array(seg * 3)
  const tArr = new Float32Array(seg)
  for (let i = 0; i < seg; i++) tArr[i] = i / (seg - 1)
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  geo.setAttribute('aT',       new THREE.BufferAttribute(tArr, 1))
  return geo
}

function makeSpikeShader(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader:   SPIKE_VERT,
    fragmentShader: SPIKE_FRAG,
    uniforms: { uOpacity: { value: 0 }, uPulse: { value: 0 } },
    blending:    THREE.AdditiveBlending,
    transparent: true,
    depthWrite:  false,
  })
}

// ─── Bullet ShaderMaterial ────────────────────────────────────────────────────

const BULLET_VERT = /* glsl */`
  attribute float aT;
  attribute float aFade;
  varying float vT;
  varying float vFade;
  void main() {
    vT    = aT;
    vFade = aFade;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const BULLET_FRAG = /* glsl */`
  uniform float uTime;
  uniform float uOpacity;
  varying float vT;
  varying float vFade;
  void main() {
    vec3 white     = vec3(1.0,  1.0,  0.95);
    vec3 acidGreen = vec3(0.3,  1.0,  0.25);
    vec3 midGreen  = vec3(0.0,  0.55, 0.12);
    vec3 darkGreen = vec3(0.0,  0.10, 0.02);
    vec3 col = vT < 0.15
      ? mix(white, acidGreen, vT / 0.15)
      : mix(midGreen, darkGreen, (vT - 0.15) / 0.85);
    float headFlare = pow(max(0.0, 1.0 - vT * 5.0), 2.0);
    float trail     = pow(max(0.0, 1.0 - vT), 1.1) * 0.9;
    float b         = headFlare + trail;
    float ripple       = sin(vT * 60.0 - uTime * 28.0) * 0.5 + 0.5;
    float rippleWeight = smoothstep(0.05, 0.20, vT) * pow(1.0 - vT, 1.2);
    b += ripple * rippleWeight * 0.25;
    b *= 0.88 + 0.12 * sin(uTime * 5.0 + vT * 4.0);
    b *= vFade;
    gl_FragColor = vec4(col * b, b * uOpacity);
  }
`

function makeBulletGeo(seg: number): THREE.BufferGeometry {
  const pos      = new Float32Array(seg * 3)
  const tArr     = new Float32Array(seg)
  const fadeArr  = new Float32Array(seg).fill(1)
  for (let i = 0; i < seg; i++) tArr[i] = i / (seg - 1)
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  geo.setAttribute('aT',       new THREE.BufferAttribute(tArr, 1))
  geo.setAttribute('aFade',    new THREE.BufferAttribute(fadeArr, 1))
  return geo
}

function makeBulletShader(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader:   BULLET_VERT,
    fragmentShader: BULLET_FRAG,
    uniforms: { uTime: { value: 0 }, uOpacity: { value: 1 } },
    blending:    THREE.AdditiveBlending,
    transparent: true,
    depthWrite:  false,
  })
}

// ─── Spike pool ───────────────────────────────────────────────────────────────

const MAX_SLOTS = 28
const SEG_SPIKE = 10

interface SpikeSlot {
  geo: THREE.BufferGeometry; mat: THREE.ShaderMaterial
  line: THREE.Line; spawnTime: number; dir: THREE.Vector3
  active: boolean; grown: boolean; len: number
}

function buildSpikePool(pivot: THREE.Group) {
  const PEAK_L  = 11
  const GROW_T  = 0.25
  const PULSE_T = 0.4

  const slots: SpikeSlot[] = Array.from({ length: MAX_SLOTS }, () => {
    const geo  = makeSpikeGeo(SEG_SPIKE)
    const mat  = makeSpikeShader()
    const line = new THREE.Line(geo, mat)
    pivot.add(line)
    return { geo, mat, line, spawnTime: -999, dir: new THREE.Vector3(1,0,0), active: false, grown: false, len: 0 }
  })
  let cursor = 0

  function spawn(elapsed: number) {
    const sl       = slots[cursor % MAX_SLOTS]
    sl.dir         = sphereDir(Math.floor(Math.random() * MAX_SLOTS * 8), MAX_SLOTS * 8)
    sl.spawnTime   = elapsed
    sl.active      = true
    sl.grown       = false
    sl.len         = 0
    sl.mat.uniforms.uOpacity.value = 1
    sl.mat.uniforms.uPulse.value   = 1
    cursor++
  }

  function tick(elapsed: number) {
    for (const sl of slots) {
      if (!sl.active) { sl.mat.uniforms.uOpacity.value = 0; continue }
      const age = elapsed - sl.spawnTime
      if (!sl.grown) {
        sl.len = Math.min(PEAK_L, (age / GROW_T) * PEAK_L)
        if (sl.len >= PEAK_L) sl.grown = true
      }
      sl.mat.uniforms.uPulse.value   = Math.max(0, 1 - age / PULSE_T)
      sl.mat.uniforms.uOpacity.value = 1
      const posArr = sl.geo.attributes.position as THREE.BufferAttribute
      for (let s = 0; s < SEG_SPIKE; s++) {
        const t    = s / (SEG_SPIKE - 1)
        const dist = 1.5 + t * sl.len
        posArr.setXYZ(s, sl.dir.x * dist, sl.dir.y * dist, sl.dir.z * dist)
      }
      posArr.needsUpdate = true
    }
  }

  function killAll() {
    for (const sl of slots) { sl.active = false; sl.mat.uniforms.uOpacity.value = 0 }
  }

  return { spawn, tick, killAll, allMats: slots.map(s => s.mat) }
}

// ─── Pulse-train ──────────────────────────────────────────────────────────────

function buildPulseTrail(group: THREE.Group, p: SpawnParams) {
  const PULSES   = 4
  const SEG      = 160
  const TAIL_LEN = 0.85

  const mid = new THREE.Vector3().addVectors(p.origin, p.target).multiplyScalar(0.5)
  // Each bullet has its own arc (different c1) but same origin+target — all land same spot
  const pulsePaths = Array.from({ length: PULSES }, () => {
    const spread = 30 + Math.random() * 80
    return {
      type: 'quadratic' as const, easing: 'linear' as const,
      c1: new THREE.Vector3(
        mid.x + (Math.random() - 0.5) * spread,
        mid.y + (Math.random() - 0.5) * spread,
        mid.z + (Math.random() - 0.5) * spread,
      ),
    }
  })
  // Stagger: bullet i fires after i * 0.35 of total travel progress
  const phaseOffsets = Array.from({ length: PULSES }, (_, pi) => pi * 0.35)

  const bullets = Array.from({ length: PULSES }, () => {
    const geo  = makeBulletGeo(SEG)
    const mat  = makeBulletShader()
    const line = new THREE.Line(geo, mat)
    group.add(line)
    return { geo, mat, line }
  })

  const TRAIL_FADE_SECS = 3.5
  // prog is 0→1 over travelTime. Bullets stagger by phaseOffsets[pi] of that range.
  // Last bullet finishes when prog reaches 1 + maxOffset, but prog is clamped to 1
  // by TravelingNode. So we extend by tracking elapsed time after landing ourselves.
  let allLandedAt = -1  // elapsed time when last bullet reached target
  // Use elapsed + travelTime to compute unclamped prog — bullets keep moving past prog=1
  const travelTime = p.travelTime

  function tick(
    prog: number, elapsed: number, landed: boolean, _age: number,
    onImpact: (t: number) => void,
  ) {
    // Unclamped progress from elapsed time — allows late bullets to finish after main node lands
    const unclampedProg = elapsed / travelTime

    for (let pi = 0; pi < PULSES; pi++) {
      const { geo, mat } = bullets[pi]
      const pcfg = pulsePaths[pi]

      const bulletProg = Math.max(0, Math.min(1, unclampedProg - phaseOffsets[pi]))
      const visible    = bulletProg > 0

      mat.uniforms.uTime.value    = elapsed
      mat.uniforms.uOpacity.value = visible ? 1 : 0

      if (!visible) continue

      // Track when all bullets have landed
      if (pi === PULSES - 1 && bulletProg >= 1 && allLandedAt < 0) {
        allLandedAt = elapsed
      }

      const age = allLandedAt >= 0 ? elapsed - allLandedAt : 0
      const trailOpacity = allLandedAt >= 0 ? Math.max(0, 1 - age / TRAIL_FADE_SECS) : 1
      mat.uniforms.uOpacity.value = trailOpacity

      const posArr  = geo.attributes.position as THREE.BufferAttribute
      const fadeArr = geo.attributes.aFade    as THREE.BufferAttribute

      for (let s = 0; s < SEG; s++) {
        const t     = s / (SEG - 1)
        const rawSp = bulletProg - t * TAIL_LEN
        const sp    = Math.max(0, rawSp)
        const fade  = rawSp < 0 ? 0 : 1
        const pt    = samplePath(pcfg, p.origin, p.target, sp)
        posArr.setXYZ(s, pt.x, pt.y, pt.z)
        fadeArr.setX(s, fade)
      }
      posArr.needsUpdate  = true
      fadeArr.needsUpdate = true
    }
  }

  return { lines: bullets.map(b => b.line), allMats: bullets.map(b => b.mat), tick }
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function buildBashSpikeCorona(group: THREE.Group, p: SpawnParams): SecondaryEffect {
  const pulses = buildPulseTrail(group, p)
  const pivot  = new THREE.Group(); pivot.position.copy(p.target); group.add(pivot)
  const spikes = buildSpikePool(pivot)

  const entries: EffectEntry[] = [
    ...pulses.lines.map(l => ({ obj: l, mat: new THREE.MeshBasicMaterial(), meta: {} })),
    { obj: pivot, mat: new THREE.MeshBasicMaterial(), meta: {} },
  ]
  let landed = false, landElapsed = 0

  return {
    entries,
    suppressDefaultTrail: true,
    trailTick(prog, _dt, elapsed, _h) {
      if (prog >= 1 && !landed) { landed = true; landElapsed = elapsed }
      const age = landed ? elapsed - landElapsed : 0
      pulses.tick(prog, elapsed, landed, age, () => {})
      pivot.rotation.y = elapsed * 0.05
    },
    tick() {},
    applyFade(f) {
      if (f <= 0) {
        spikes.killAll()
        for (const m of pulses.allMats) m.uniforms.uOpacity.value = 0
      }
    },
  }
}
