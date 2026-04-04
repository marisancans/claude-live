import * as THREE from 'three'
import type { GraphNode } from '../../types'
import { makeParticleDotTexture, hexStringToRgb } from '../textures/GradientTextures'

const RING_RADII = [14, 18, 22, 28]
const BASE_SIZE = 12
const SPEED_SCALE = 1.0
const MIN_LIFE = 0.05

export class NodeOrbitCloud {
  group: THREE.Group
  private points: THREE.Points | null = null
  private geometry: THREE.BufferGeometry | null = null
  private material: THREE.PointsMaterial
  private keys: string[] = []
  private angles: number[] = []
  private rings: number[] = []
  private positions: Float32Array = new Float32Array()
  private colors: Float32Array = new Float32Array()

  constructor() {
    this.group = new THREE.Group()
    const tex = makeParticleDotTexture()
    this.material = new THREE.PointsMaterial({
      map: tex,
      transparent: true,
      opacity: 1.0,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      depthWrite: false,
      sizeAttenuation: false,
      size: BASE_SIZE,
    })
  }

  update(nodes: Map<string, GraphNode>, dt: number) {
    const list: GraphNode[] = []
    for (const node of nodes.values()) {
      if (node.orbitRing < 0) continue
      if ((node.life ?? 1) <= MIN_LIFE) continue
      list.push(node)
    }

    const needsRebuild = !this.points || list.length !== this.keys.length || list.some((n, i) => n.key !== this.keys[i])
    if (needsRebuild) this.rebuild(list)

    if (list.length === 0) {
      this.group.visible = false
      return
    }

    this.group.visible = true

    for (let i = 0; i < list.length; i++) {
      const node = list[i]
      const ring = Math.max(0, node.orbitRing)
      if (this.rings[i] !== ring) {
        this.rings[i] = ring
        this.angles[i] = node.targetOrbitAngle ?? node.orbitAngle
      }

      this.angles[i] += (node.orbitSpeed ?? 0) * dt * SPEED_SCALE

      const radius = ringRadiusFor(ring)
      const angle = this.angles[i]
      const idx = i * 3
      this.positions[idx] = Math.cos(angle) * radius
      this.positions[idx + 1] = 0
      this.positions[idx + 2] = Math.sin(angle) * radius

      const life = node.life ?? 1
      const dim = Math.max(0.35, Math.min(1, life))
      const [r, g, b] = hexStringToRgb(node.colorHex || '#ffffff')
      const boost = 0.35
      const rr = (r / 255) * (1 - boost) + boost
      const gg = (g / 255) * (1 - boost) + boost
      const bb = (b / 255) * (1 - boost) + boost
      this.colors[idx] = rr * dim
      this.colors[idx + 1] = gg * dim
      this.colors[idx + 2] = bb * dim
    }

    if (this.geometry) {
      const posAttr = this.geometry.attributes.position as THREE.BufferAttribute
      posAttr.needsUpdate = true
      const colAttr = this.geometry.attributes.color as THREE.BufferAttribute
      colAttr.needsUpdate = true
    }
  }

  private rebuild(list: GraphNode[]) {
    this.keys = list.map(n => n.key)
    this.angles = list.map(n => n.targetOrbitAngle ?? n.orbitAngle)
    this.rings = list.map(n => Math.max(0, n.orbitRing))

    this.positions = new Float32Array(list.length * 3)
    this.colors = new Float32Array(list.length * 3)

    if (this.geometry) this.geometry.dispose()
    this.geometry = new THREE.BufferGeometry()
    this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(this.positions, 3))
    this.geometry.setAttribute('color', new THREE.Float32BufferAttribute(this.colors, 3))

    if (this.points) this.group.remove(this.points)
    this.points = new THREE.Points(this.geometry, this.material)
    this.points.frustumCulled = false
    this.points.renderOrder = 10
    this.group.add(this.points)
  }

  dispose() {
    this.geometry?.dispose()
    this.material.map?.dispose()
    this.material.dispose()
  }
}

function ringRadiusFor(ring: number): number {
  if (ring < RING_RADII.length) return RING_RADII[ring]
  const last = RING_RADII[RING_RADII.length - 1] ?? 28
  const prev = RING_RADII[RING_RADII.length - 2] ?? last - 4
  const gap = Math.max(3, last - prev)
  return last + gap * (ring - (RING_RADII.length - 1))
}
