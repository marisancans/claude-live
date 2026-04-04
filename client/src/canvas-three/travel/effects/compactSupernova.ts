/**
 * COMPACT POST — Supernova.
 * 10 gold streaks explode outward from core.
 * First particle gets a ring secondary effect.
 */
import * as THREE from 'three'
import type { SpawnParams } from '../types'
import type { SecondaryEffect } from './types'

function rand(a: number, b: number) { return Math.random() * (b - a) + a }

const MAX_STREAKS = 10

interface Streak {
  pos: THREE.Vector3
  vel: THREE.Vector3
  life: number
  maxLife: number
}

export function buildCompactSupernova(group: THREE.Group, _p: SpawnParams): SecondaryEffect {
  const streaks: Streak[] = []

  // 10 streaks exploding outward from core
  for (let i = 0; i < MAX_STREAKS; i++) {
    const theta = (i / MAX_STREAKS) * Math.PI * 2
    const phi = rand(-0.5, 0.5)
    const dir = new THREE.Vector3(
      Math.cos(theta) * Math.cos(phi),
      Math.sin(phi),
      Math.sin(theta) * Math.cos(phi)
    ).normalize()

    streaks.push({
      pos: new THREE.Vector3(rand(-1, 1), rand(-1, 1), rand(-1, 1)),
      vel: dir.multiplyScalar(rand(100, 180)),
      life: 1.0,
      maxLife: rand(1.8, 3.0),
    })
  }

  // GPU particles
  const posArr = new Float32Array(MAX_STREAKS * 3)
  const lifeArr = new Float32Array(MAX_STREAKS)
  const maxLifeArr = new Float32Array(MAX_STREAKS)

  for (let i = 0; i < MAX_STREAKS; i++) {
    posArr[i * 3] = streaks[i].pos.x
    posArr[i * 3 + 1] = streaks[i].pos.y
    posArr[i * 3 + 2] = streaks[i].pos.z
    lifeArr[i] = streaks[i].life
    maxLifeArr[i] = streaks[i].maxLife
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(posArr, 3))
  geo.setAttribute('aLife', new THREE.BufferAttribute(lifeArr, 1))
  geo.setAttribute('aMaxLife', new THREE.BufferAttribute(maxLifeArr, 1))

  const mat = new THREE.ShaderMaterial({
    vertexShader: `
      attribute float aLife;
      attribute float aMaxLife;
      varying float vLife;
      void main() {
        vLife = aLife / aMaxLife;
        gl_PointSize = 5.0 * vLife;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying float vLife;
      void main() {
        float d = length(gl_PointCoord - 0.5) * 2.0;
        float a = (1.0 - d * d) * vLife;
        gl_FragColor = vec4(1.0, 0.88, 0.5, a);
      }
    `,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
  })

  const points = new THREE.Points(geo, mat)
  group.add(points)

  // Ring secondary for first particle (index 0)
  const ringGeo = new THREE.BufferGeometry()
  const ringVerts = new Float32Array(64 * 3)
  for (let i = 0; i < 64; i++) {
    const t = i / 64
    const a = t * Math.PI * 2
    const r = 20
    ringVerts[i * 3] = Math.cos(a) * r
    ringVerts[i * 3 + 1] = Math.sin(a) * r
    ringVerts[i * 3 + 2] = 0
  }
  ringGeo.setAttribute('position', new THREE.BufferAttribute(ringVerts, 3))

  const ringMat = new THREE.LineBasicMaterial({
    color: 0xFFE080,
    blending: THREE.AdditiveBlending,
    transparent: true,
    linewidth: 2,
  })

  const ringLine = new THREE.LineLoop(ringGeo, ringMat)
  let ringProgress = 0
  const ringMaxLife = 1.2

  const effect: SecondaryEffect = {
    entries: [
      { obj: points, mat, meta: {} },
      { obj: ringLine, mat: ringMat, meta: {} },
    ],
    suppressDefaultTrail: true,

    trailTick(_prog, dt) {
      let allDone = true

      // Update streaks
      for (let i = 0; i < streaks.length; i++) {
        const s = streaks[i]
        s.life -= dt / s.maxLife
        if (s.life > 0) {
          allDone = false
          s.vel.multiplyScalar(0.96) // drag
          s.pos.addScaledVector(s.vel, dt)

          posArr[i * 3] = s.pos.x
          posArr[i * 3 + 1] = s.pos.y
          posArr[i * 3 + 2] = s.pos.z
          lifeArr[i] = s.life
        }
      }

      ;(geo.attributes.position as THREE.BufferAttribute).needsUpdate = true
      ;(geo.attributes.aLife as THREE.BufferAttribute).needsUpdate = true

      // Update ring
      ringProgress += dt / ringMaxLife
      if (ringProgress <= 1.0) {
        allDone = false
        ringMat.opacity = 1.0 - ringProgress * 0.5
        ringLine.scale.set(
          1.0 + ringProgress * 1.5,
          1.0 + ringProgress * 1.5,
          1.0
        )
      } else {
        ringMat.opacity = 0
      }

      if (allDone) effect.shouldMarkDone = true
    },

    tick() {},
    onLand() {},
    applyFade(_f) {},
    shouldMarkDone: false,

    dispose() {
      geo.dispose()
      mat.dispose()
      ringGeo.dispose()
      ringMat.dispose()
    },
  }

  return effect
}
