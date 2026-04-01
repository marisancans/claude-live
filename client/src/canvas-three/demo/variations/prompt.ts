import * as THREE from 'three'
import type { SpawnParams } from '../../travel/types'
import type { SecondaryEffect } from '../../travel/effects/types'
import { samplePath, applyEasing } from '../../travel/easing'

export interface EffectVariation {
  name: string
  description: string
  spawnParams: (cameraPos?: THREE.Vector3) => SpawnParams
  buildCustomEffect?: ((group: THREE.Group, p: SpawnParams) => SecondaryEffect) | null
}

const CORE = new THREE.Vector3(0, 0, 0)

function rand(a: number, b: number) { return Math.random() * (b - a) + a }

function base(): SpawnParams {
  return {
    origin: new THREE.Vector3(-120, 15, -60),
    target: CORE.clone().add(new THREE.Vector3(rand(-2,2), rand(-2,2), rand(-2,2))),
    color:    new THREE.Color('#b0c8f0'),
    colorEnd: new THREE.Color('#ffffff'),
    travelTime: 3.0,
    trailLength: 0, trailBrightness: 0, trailFadeTime: 4.0, headSize: 0,
    pathConfig: { type: 'linear', easing: 'easeInCubic' },
    _tool: 'prompt:custom',
  }
}

function randomOrigin(): THREE.Vector3 {
  const theta = Math.random() * Math.PI * 2
  const phi   = Math.acos(rand(-1, 1))
  const r     = rand(250, 400)
  return new THREE.Vector3(
    Math.sin(phi) * Math.cos(theta) * r,
    Math.sin(phi) * Math.sin(theta) * r,
    Math.cos(phi) * r,
  )
}

function makeParams(tool: string): SpawnParams {
  const p = base(); p._tool = tool
  p.origin = randomOrigin()
  p.travelTime = rand(4.0, 5.5); p.trailFadeTime = 1.8
  const mid = p.origin.clone().add(CORE).multiplyScalar(0.5)
  p.pathConfig = { type: 'quadratic', easing: 'easeInOut',
    c1: new THREE.Vector3(mid.x + rand(-40,40), mid.y + rand(20,60), mid.z + rand(-30,30)) }
  return p
}

// ── Shared strand definition ──────────────────────────────────────────────────

interface StrandDef {
  f1: number; f2: number; ph1: number; ph2: number
  amp: number; perp: THREE.Vector3; scatter: THREE.Vector3
  windowStart: number; rollSpeed: number
}

function makeStrandDef(i: number, n: number): StrandDef {
  return {
    f1: 1.2 + Math.random() * 1.5, f2: 3.5 + Math.random() * 3.0,
    ph1: Math.random() * Math.PI * 2, ph2: Math.random() * Math.PI * 2,
    amp: 4 + Math.random() * 6,
    perp: new THREE.Vector3(Math.random()-.5, Math.random()-.5, Math.random()-.5).normalize(),
    scatter: new THREE.Vector3((Math.random()-.5)*400, (Math.random()-.5)*400, (Math.random()-.5)*400),
    windowStart: -(i / n) * 3.5 - Math.random() * 0.2,
    rollSpeed: 0.8 + Math.random() * 0.6,
  }
}

function strandPoint(d: StrandDef, p: SpawnParams, t: number, elapsed: number, speed: number): THREE.Vector3 {
  const ease = applyEasing(p.pathConfig.easing, t)
  const pt   = samplePath(p.pathConfig, p.origin, p.target, ease)
  const scatterEnv = Math.max(0, 1 - t / 0.5)
  const weaveEnv   = Math.min(1, t / 0.5)
  const headPin    = 1 - Math.pow(t, 8)
  const wv = (Math.sin(t * d.f1 * Math.PI * 2 + d.ph1 + elapsed * speed) * d.amp
            + Math.sin(t * d.f2 * Math.PI * 2 + d.ph2 + elapsed * speed * 1.4) * d.amp * 0.3)
            * weaveEnv * headPin
  return new THREE.Vector3(
    pt.x + d.scatter.x * scatterEnv + d.perp.x * wv,
    pt.y + d.scatter.y * scatterEnv + d.perp.y * wv,
    pt.z + d.scatter.z * scatterEnv + d.perp.z * wv,
  )
}

// ── Shared tick loop — same for every variation ───────────────────────────────
// mat can be LineBasicMaterial or ShaderMaterial — caller provides setOpacity/setTime

type StrandInstance = StrandDef & {
  posArr: Float32Array
  geo: THREE.BufferGeometry
  mat: THREE.Material
  window: number
  setOpacity(v: number): void
  setTime?(t: number): void
}

function makeStrandEffect(
  group: THREE.Group,
  p: SpawnParams,
  SEG: number,
  STRANDS: number,
  makeMat: (i: number, geo: THREE.BufferGeometry) => { mat: THREE.Material; setOpacity(v: number): void; setTime?(t: number): void },
): SecondaryEffect {
  const strands: StrandInstance[] = Array.from({ length: STRANDS }, (_, i) => {
    const d = makeStrandDef(i, STRANDS)
    const posArr = new Float32Array(SEG * 3)
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(posArr, 3))
    // aT attribute — normalized position along strand, used by shader variants
    const tArr = new Float32Array(SEG)
    for (let k = 0; k < SEG; k++) tArr[k] = k / (SEG - 1)
    geo.setAttribute('aT', new THREE.BufferAttribute(tArr, 1))
    const { mat, setOpacity, setTime } = makeMat(i, geo)
    group.add(new THREE.Line(geo, mat))
    return { ...d, posArr, geo, mat, window: d.windowStart, setOpacity, setTime }
  })

  const effect: SecondaryEffect = {
    entries: strands.map(s => ({ obj: new THREE.Line(s.geo, s.mat), mat: s.mat, meta: {} })),
    suppressDefaultTrail: true,
    trailTick(_prog, dt, elapsed) {
      const speed = 2.5 + elapsed * 0.1
      let allDone = true
      for (const s of strands) {
        const rate = s.window >= 1
          ? (1.0 / (1.5 * s.rollSpeed))
          : ((1 - s.windowStart) / p.travelTime)
        s.window = Math.min(2, s.window + dt * rate)
        const w = s.window
        if (w <= 0) { s.geo.setDrawRange(0, 0); allDone = false; continue }
        if (w >= 2) { s.setOpacity(0); s.geo.setDrawRange(0, 0); continue }
        allDone = false
        const headIdx = Math.round(Math.min(1, w) * (SEG - 1))
        const tailIdx = Math.round(Math.max(0, w - 1) * (SEG - 1))
        const count = headIdx - tailIdx
        if (count < 1) { s.geo.setDrawRange(0, 0); continue }
        for (let i = tailIdx; i <= headIdx; i++) {
          const pt = strandPoint(s, p, i / (SEG - 1), elapsed, speed)
          s.posArr[i*3] = pt.x; s.posArr[i*3+1] = pt.y; s.posArr[i*3+2] = pt.z
        }
        ;(s.geo.attributes.position as THREE.BufferAttribute).needsUpdate = true
        s.geo.setDrawRange(tailIdx, count)
        s.setOpacity(0.7)
        s.setTime?.(elapsed)
      }
      if (allDone) effect.shouldMarkDone = true
    },
    tick() {}, onLand() {}, applyFade(_f) {}, shouldMarkDone: false,
  }
  return effect
}

// ════════════════════════════════════════════════════════════════════════════════
// v1. WRITHING — baseline LineBasicMaterial, per-strand hue
// ════════════════════════════════════════════════════════════════════════════════

function buildWrithing(group: THREE.Group, p: SpawnParams): SecondaryEffect {
  return makeStrandEffect(group, p, 120, 8, (i) => {
    const mat = new THREE.LineBasicMaterial({
      color: new THREE.Color().setHSL(0.55 + (i / 8) * 0.15, 0.9, 0.6 + (i % 2) * 0.2),
      transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false,
    })
    return { mat, setOpacity: (v) => { mat.opacity = v } }
  })
}

// ════════════════════════════════════════════════════════════════════════════════
// v2. NEON IRIDESCENT — hue shifts along the strand length AND over time.
//     Bright white core, rainbow bloom bleeds outward.
// ════════════════════════════════════════════════════════════════════════════════

const NEON_VERT = /* glsl */`
  attribute float aT;
  varying float vT;
  void main() { vT = aT; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
`
const NEON_FRAG = /* glsl */`
  uniform float uTime;
  uniform float uOpacity;
  uniform float uHueBase;
  varying float vT;
  vec3 hsl2rgb(float h, float s, float l) {
    h = mod(h, 1.0);
    vec3 rgb = clamp(abs(mod(h*6.0+vec3(0,4,2),6.0)-3.0)-1.0, 0.0, 1.0);
    return l + s*(rgb-0.5)*(1.0-abs(2.0*l-1.0));
  }
  void main() {
    // Hue drifts along length + time
    float hue   = mod(uHueBase + vT * 0.3 + uTime * 0.12, 1.0);
    float core  = pow(1.0 - vT, 0.3);          // bright at head (t=1 is target)
    float bloom = pow(vT, 0.5) * 0.6;
    vec3  col   = hsl2rgb(hue, 1.0, 0.55 + bloom * 0.3);
    // White-hot center
    col = mix(col, vec3(1.0), core * 0.4);
    float alpha = (bloom + core * 0.5) * uOpacity;
    gl_FragColor = vec4(col * (bloom + core * 0.5 + 0.05), alpha);
  }
`

function buildNeonIridescent(group: THREE.Group, p: SpawnParams): SecondaryEffect {
  return makeStrandEffect(group, p, 120, 8, (i) => {
    const mat = new THREE.ShaderMaterial({
      vertexShader: NEON_VERT, fragmentShader: NEON_FRAG,
      uniforms: { uTime: { value: 0 }, uOpacity: { value: 0 }, uHueBase: { value: i / 8 } },
      blending: THREE.AdditiveBlending, transparent: true, depthWrite: false,
    })
    return {
      mat,
      setOpacity: (v) => { mat.uniforms.uOpacity.value = v },
      setTime:    (t) => { mat.uniforms.uTime.value    = t },
    }
  })
}

// ════════════════════════════════════════════════════════════════════════════════
// v3. PLASMA — electric blue-white with high-freq noise brightness and
//     a traveling bright pulse that accelerates toward the core.
// ════════════════════════════════════════════════════════════════════════════════

const PLASMA_VERT = /* glsl */`
  attribute float aT;
  varying float vT;
  void main() { vT = aT; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
`
const PLASMA_FRAG = /* glsl */`
  uniform float uTime;
  uniform float uOpacity;
  uniform float uPhase;
  varying float vT;
  float hash(float n) { return fract(sin(n)*43758.5453); }
  void main() {
    // High-freq flicker noise
    float noise  = hash(floor(vT * 80.0 + uTime * 30.0));
    float flicker = 0.7 + 0.3 * noise;
    // Traveling pulse toward core (vT=1)
    float pulsePos = mod(uPhase + uTime * 0.6, 1.0);
    float pulse    = exp(-pow((vT - pulsePos) / 0.05, 2.0)) * 2.5;
    // Base glow — brighter near core
    float base = pow(vT, 0.4) * 0.5;
    float b    = (base + pulse) * flicker;
    // Color: deep blue → cyan → white at pulse peak
    vec3 blue  = vec3(0.05, 0.2, 1.0);
    vec3 cyan  = vec3(0.2,  0.9, 1.0);
    vec3 white = vec3(1.0,  1.0, 1.0);
    vec3 col   = mix(blue, cyan, vT);
    col = mix(col, white, clamp(pulse / 2.5, 0.0, 1.0));
    gl_FragColor = vec4(col * b, b * uOpacity);
  }
`

function buildPlasma(group: THREE.Group, p: SpawnParams): SecondaryEffect {
  return makeStrandEffect(group, p, 120, 8, (i) => {
    const mat = new THREE.ShaderMaterial({
      vertexShader: PLASMA_VERT, fragmentShader: PLASMA_FRAG,
      uniforms: { uTime: { value: 0 }, uOpacity: { value: 0 }, uPhase: { value: i / 8 } },
      blending: THREE.AdditiveBlending, transparent: true, depthWrite: false,
    })
    return {
      mat,
      setOpacity: (v) => { mat.uniforms.uOpacity.value = v },
      setTime:    (t) => { mat.uniforms.uTime.value    = t },
    }
  })
}

// ════════════════════════════════════════════════════════════════════════════════
// v4. AURORA — soft translucent ribbons with slow pastel color bands.
//     Wide, dreamy, low frequency shimmer. Colors bleed and mix.
// ════════════════════════════════════════════════════════════════════════════════

const AURORA_VERT = /* glsl */`
  attribute float aT;
  varying float vT;
  void main() { vT = aT; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
`
const AURORA_FRAG = /* glsl */`
  uniform float uTime;
  uniform float uOpacity;
  uniform float uOffset;
  varying float vT;
  vec3 hsl2rgb(float h, float s, float l) {
    h = mod(h, 1.0);
    vec3 rgb = clamp(abs(mod(h*6.0+vec3(0,4,2),6.0)-3.0)-1.0, 0.0, 1.0);
    return l + s*(rgb-0.5)*(1.0-abs(2.0*l-1.0));
  }
  void main() {
    // Slow drifting color bands along the strand
    float hue    = mod(uOffset + vT * 0.5 + uTime * 0.04, 1.0);
    float bright = 0.5 + 0.5 * sin(vT * 3.0 + uTime * 0.8 + uOffset * 6.28);
    // Soft curtain falloff — bright in the middle of length
    float curtain = sin(vT * 3.14159) * 0.8 + 0.2;
    // Very soft, high luminance pastels
    vec3 col   = hsl2rgb(hue, 0.6, 0.6 + bright * 0.25);
    float alpha = curtain * bright * 0.5 * uOpacity;
    gl_FragColor = vec4(col * curtain * bright, alpha);
  }
`

function buildAurora(group: THREE.Group, p: SpawnParams): SecondaryEffect {
  return makeStrandEffect(group, p, 120, 10, (i) => {
    const mat = new THREE.ShaderMaterial({
      vertexShader: AURORA_VERT, fragmentShader: AURORA_FRAG,
      uniforms: { uTime: { value: 0 }, uOpacity: { value: 0 }, uOffset: { value: i / 10 } },
      blending: THREE.AdditiveBlending, transparent: true, depthWrite: false,
    })
    return {
      mat,
      setOpacity: (v) => { mat.uniforms.uOpacity.value = v },
      setTime:    (t) => { mat.uniforms.uTime.value    = t },
    }
  })
}

// ════════════════════════════════════════════════════════════════════════════════
// v5. FIBER LIGHT — pure white hot core, colored light bleeds outward.
//     Thin bright spine, soft colored halo that pulses with energy.
// ════════════════════════════════════════════════════════════════════════════════

const FIBER_VERT = /* glsl */`
  attribute float aT;
  varying float vT;
  void main() { vT = aT; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
`
const FIBER_FRAG = /* glsl */`
  uniform float uTime;
  uniform float uOpacity;
  uniform float uHue;
  varying float vT;
  vec3 hsl2rgb(float h, float s, float l) {
    h = mod(h, 1.0);
    vec3 rgb = clamp(abs(mod(h*6.0+vec3(0,4,2),6.0)-3.0)-1.0, 0.0, 1.0);
    return l + s*(rgb-0.5)*(1.0-abs(2.0*l-1.0));
  }
  void main() {
    // Traveling energy packets
    float packet1 = exp(-pow(mod(vT - uTime * 0.5, 1.0) / 0.08, 2.0));
    float packet2 = exp(-pow(mod(vT - uTime * 0.5 + 0.4, 1.0) / 0.08, 2.0));
    float energy  = packet1 + packet2 * 0.6;
    // White-hot spine at high energy, colored bleed otherwise
    vec3 fiberCol = hsl2rgb(uHue, 1.0, 0.5);
    vec3 col      = mix(fiberCol, vec3(1.0), clamp(energy, 0.0, 1.0));
    // Base thread glow — constant soft light
    float base  = 0.2 + 0.1 * sin(vT * 20.0 - uTime * 3.0);
    float alpha = (base + energy * 0.8) * uOpacity;
    gl_FragColor = vec4(col * (base + energy * 0.8), alpha);
  }
`

function buildFiberLight(group: THREE.Group, p: SpawnParams): SecondaryEffect {
  return makeStrandEffect(group, p, 120, 8, (i) => {
    const mat = new THREE.ShaderMaterial({
      vertexShader: FIBER_VERT, fragmentShader: FIBER_FRAG,
      uniforms: { uTime: { value: 0 }, uOpacity: { value: 0 }, uHue: { value: 0.55 + (i / 8) * 0.35 } },
      blending: THREE.AdditiveBlending, transparent: true, depthWrite: false,
    })
    return {
      mat,
      setOpacity: (v) => { mat.uniforms.uOpacity.value = v },
      setTime:    (t) => { mat.uniforms.uTime.value    = t },
    }
  })
}

// ════════════════════════════════════════════════════════════════════════════════

export const PROMPT_VARIATIONS: EffectVariation[] = [
  { name: 'Writhing',          description: 'Baseline — colored strands scatter, converge, weave into core', spawnParams: () => makeParams('prompt:writhing'),  buildCustomEffect: buildWrithing       },
  { name: 'Neon Iridescent',   description: 'Hue shifts along length and over time — white-hot core bloom',  spawnParams: () => makeParams('prompt:neon'),      buildCustomEffect: buildNeonIridescent  },
  { name: 'Plasma',            description: 'Electric blue-white with noisy flicker and traveling pulses',   spawnParams: () => makeParams('prompt:plasma'),    buildCustomEffect: buildPlasma          },
  { name: 'Aurora',            description: 'Soft pastel curtains drifting with slow color bands',           spawnParams: () => makeParams('prompt:aurora'),    buildCustomEffect: buildAurora          },
  { name: 'Fiber Light',       description: 'White-hot spine with colored energy packets traveling to core', spawnParams: () => makeParams('prompt:fiber'),     buildCustomEffect: buildFiberLight      },
]
