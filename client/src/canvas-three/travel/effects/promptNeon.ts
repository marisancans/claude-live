/**
 * PROMPT — Neon Iridescent writhing threads.
 * 8 strands span origin→target at all times. They scatter from random directions,
 * converge to the path, then weave continuously into the core.
 * Shader: hue shifts along length + over time, white-hot near head.
 */
import * as THREE from 'three'
import type { SpawnParams } from '../types'
import type { SecondaryEffect } from './types'
import { samplePath, applyEasing } from '../easing'

const SEG     = 120
const STRANDS = 8

const VERT = /* glsl */`
  attribute float aT;
  varying float vT;
  void main() { vT = aT; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
`
const FRAG = /* glsl */`
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
    float hue   = mod(uHueBase + vT * 0.3 + uTime * 0.12, 1.0);
    float core  = pow(1.0 - vT, 0.3);
    float bloom = pow(vT, 0.5) * 0.6;
    vec3  col   = hsl2rgb(hue, 1.0, 0.55 + bloom * 0.3);
    col = mix(col, vec3(1.0), core * 0.4);
    float alpha = (bloom + core * 0.5) * uOpacity;
    gl_FragColor = vec4(col * (bloom + core * 0.5 + 0.05), alpha);
  }
`

function rand(a: number, b: number) { return Math.random() * (b - a) + a }

export function buildPromptNeon(group: THREE.Group, p: SpawnParams): SecondaryEffect {
  const strands = Array.from({ length: STRANDS }, (_, i) => {
    const posArr = new Float32Array(SEG * 3)
    const tArr   = new Float32Array(SEG)
    for (let k = 0; k < SEG; k++) tArr[k] = k / (SEG - 1)
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(posArr, 3))
    geo.setAttribute('aT',       new THREE.BufferAttribute(tArr, 1))
    const mat = new THREE.ShaderMaterial({
      vertexShader: VERT, fragmentShader: FRAG,
      uniforms: { uTime: { value: 0 }, uOpacity: { value: 0 }, uHueBase: { value: i / STRANDS } },
      blending: THREE.AdditiveBlending, transparent: true, depthWrite: false,
    })
    group.add(new THREE.Line(geo, mat))

    const f1  = 1.2 + Math.random() * 1.5
    const f2  = 3.5 + Math.random() * 3.0
    const ph1 = Math.random() * Math.PI * 2
    const ph2 = Math.random() * Math.PI * 2
    const amp = 4 + Math.random() * 6
    const perp = new THREE.Vector3(Math.random()-.5, Math.random()-.5, Math.random()-.5).normalize()
    const scatter = new THREE.Vector3((Math.random()-.5)*400, (Math.random()-.5)*400, (Math.random()-.5)*400)
    const windowStart = -(i / STRANDS) * 3.5 - Math.random() * 0.2
    const rollSpeed   = 0.8 + Math.random() * 0.6

    return { posArr, geo, mat, f1, f2, ph1, ph2, amp, perp, scatter, windowStart, rollSpeed, window: windowStart }
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
        if (w >= 2) { s.mat.uniforms.uOpacity.value = 0; s.geo.setDrawRange(0, 0); continue }
        allDone = false

        const headIdx = Math.round(Math.min(1, w) * (SEG - 1))
        const tailIdx = Math.round(Math.max(0, w - 1) * (SEG - 1))
        const count   = headIdx - tailIdx
        if (count < 1) { s.geo.setDrawRange(0, 0); continue }

        for (let i = tailIdx; i <= headIdx; i++) {
          const t        = i / (SEG - 1)
          const ease     = applyEasing(p.pathConfig.easing, t)
          const pt       = samplePath(p.pathConfig, p.origin, p.target, ease)
          const scEnv    = Math.max(0, 1 - t / 0.5)
          const wvEnv    = Math.min(1, t / 0.5)
          const headPin  = 1 - Math.pow(t, 8)
          const wv = (Math.sin(t * s.f1 * Math.PI * 2 + s.ph1 + elapsed * speed) * s.amp
                    + Math.sin(t * s.f2 * Math.PI * 2 + s.ph2 + elapsed * speed * 1.4) * s.amp * 0.3)
                    * wvEnv * headPin
          s.posArr[i*3]   = pt.x + s.scatter.x * scEnv + s.perp.x * wv
          s.posArr[i*3+1] = pt.y + s.scatter.y * scEnv + s.perp.y * wv
          s.posArr[i*3+2] = pt.z + s.scatter.z * scEnv + s.perp.z * wv
        }
        ;(s.geo.attributes.position as THREE.BufferAttribute).needsUpdate = true
        s.geo.setDrawRange(tailIdx, count)
        s.mat.uniforms.uOpacity.value = 0.7
        s.mat.uniforms.uTime.value    = elapsed
      }

      if (allDone) effect.shouldMarkDone = true
    },
    tick() {}, onLand() {}, applyFade(_f) {}, shouldMarkDone: false,
  }
  return effect
}
