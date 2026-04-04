/**
 * RESPONSE — Nova burst outward from core.
 * 8 particles scatter outward radially, fading as they go.
 */
import * as THREE from 'three'
import type { SpawnParams } from '../types'
import type { SecondaryEffect } from './types'

function rand(a: number, b: number) { return Math.random() * (b - a) + a }

const MAX_PARTICLES = 8

interface Particle {
  pos: THREE.Vector3
  vel: THREE.Vector3
  life: number
  maxLife: number
}

export function buildResponseBurst(group: THREE.Group, _p: SpawnParams): SecondaryEffect {
  const particles: Particle[] = []

  // Create 8 particles radiating outward from core
  for (let i = 0; i < MAX_PARTICLES; i++) {
    const theta = (i / MAX_PARTICLES) * Math.PI * 2
    const phi = rand(-0.3, 0.3)
    const dir = new THREE.Vector3(
      Math.cos(theta) * Math.cos(phi),
      Math.sin(phi),
      Math.sin(theta) * Math.cos(phi)
    ).normalize()

    particles.push({
      pos: new THREE.Vector3(0, 0, 0),
      vel: dir.multiplyScalar(rand(80, 140)),
      life: 1.0,
      maxLife: rand(1.5, 2.5),
    })
  }

  // GPU particles: position, life, maxLife
  const posArr = new Float32Array(MAX_PARTICLES * 3)
  const lifeArr = new Float32Array(MAX_PARTICLES)
  const maxLifeArr = new Float32Array(MAX_PARTICLES)

  for (let i = 0; i < MAX_PARTICLES; i++) {
    posArr[i * 3] = particles[i].pos.x
    posArr[i * 3 + 1] = particles[i].pos.y
    posArr[i * 3 + 2] = particles[i].pos.z
    lifeArr[i] = particles[i].life
    maxLifeArr[i] = particles[i].maxLife
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
        gl_PointSize = 3.0 * vLife * vLife;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying float vLife;
      void main() {
        float d = length(gl_PointCoord - 0.5) * 2.0;
        float a = (1.0 - d * d) * vLife;
        gl_FragColor = vec4(0.7, 0.8, 1.0, a);
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
    suppressDefaultTrail: false,

    trailTick(_prog, dt) {
      let allDone = true

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.life -= dt / p.maxLife
        if (p.life > 0) {
          allDone = false
          p.vel.multiplyScalar(0.98) // light drag
          p.pos.addScaledVector(p.vel, dt)

          posArr[i * 3] = p.pos.x
          posArr[i * 3 + 1] = p.pos.y
          posArr[i * 3 + 2] = p.pos.z
          lifeArr[i] = p.life
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
