/**
 * COMPACT PRE — Implosion.
 * 6 gold streaks converge fast on core.
 */
import * as THREE from 'three'
import type { SpawnParams } from '../types'
import type { SecondaryEffect } from './types'

function rand(a: number, b: number) { return Math.random() * (b - a) + a }

const MAX_STREAKS = 6

interface Streak {
  pos: THREE.Vector3
  vel: THREE.Vector3
  life: number
  maxLife: number
}

export function buildCompactImplosion(group: THREE.Group, _p: SpawnParams): SecondaryEffect {
  const streaks: Streak[] = []

  // 6 streaks from outer points converging to core
  for (let i = 0; i < MAX_STREAKS; i++) {
    const theta = (i / MAX_STREAKS) * Math.PI * 2
    const phi = rand(-0.4, 0.4)
    const dir = new THREE.Vector3(
      Math.cos(theta) * Math.cos(phi),
      Math.sin(phi),
      Math.sin(theta) * Math.cos(phi)
    ).normalize()

    const startDist = rand(80, 120)
    const pos = dir.clone().multiplyScalar(startDist)
    const vel = pos.clone().negate().normalize().multiplyScalar(rand(140, 200))

    streaks.push({
      pos,
      vel,
      life: 1.0,
      maxLife: rand(0.8, 1.4),
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
        gl_PointSize = 4.0 * vLife;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying float vLife;
      void main() {
        float d = length(gl_PointCoord - 0.5) * 2.0;
        float a = (1.0 - d * d) * vLife;
        gl_FragColor = vec4(1.0, 0.8, 0.37, a);
      }
    `,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
  })

  const points = new THREE.Points(geo, mat)
  group.add(points)

  const effect: SecondaryEffect = {
    entries: [{ obj: points, mat, meta: {} }],
    suppressDefaultTrail: true,

    trailTick(_prog, dt) {
      let allDone = true

      for (let i = 0; i < streaks.length; i++) {
        const s = streaks[i]
        s.life -= dt / s.maxLife
        if (s.life > 0) {
          allDone = false
          s.pos.addScaledVector(s.vel, dt)

          posArr[i * 3] = s.pos.x
          posArr[i * 3 + 1] = s.pos.y
          posArr[i * 3 + 2] = s.pos.z
          lifeArr[i] = s.life
        }
      }

      ;(geo.attributes.position as THREE.BufferAttribute).needsUpdate = true
      ;(geo.attributes.aLife as THREE.BufferAttribute).needsUpdate = true

      if (allDone) effect.shouldMarkDone = true
    },

    tick() {},
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
