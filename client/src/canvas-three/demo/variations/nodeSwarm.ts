import * as THREE from 'three'
import {
  makeGlintTexture,
  makeParticleDotTexture,
  makeParticleGlowTexture,
} from '../../textures/GradientTextures'

export type NodeSwarmSpace = '2D' | '2.5D' | '3D' | '4D-ish'

export interface NodeSwarmVariation {
  name: string
  space: NodeSwarmSpace
  accent: string
  technique: string
  description: string
  build: (group: THREE.Group, camera: THREE.Camera) => SwarmVisual
}

export interface SwarmVisual {
  tick: (dt: number, elapsed: number) => void
  dispose: () => void
  pulse?: () => void
}

interface SwarmSeed {
  radius: number
  phase: number
  speed: number
  radialAmp: number
  radialFreq: number
  bobAmp: number
  bobFreq: number
  driftAmp: number
  driftFreq: number
  eccentricity: number
  scale: number
  shimmerFreq: number
  tilt: THREE.Quaternion
}

interface NodeUpdateContext {
  camera: THREE.Camera
  color: THREE.Color
  elapsed: number
  activity: number
  intensity: number
  index: number
  position: THREE.Vector3
  seed: SwarmSeed
  velocity: THREE.Vector3
}

interface BaseNodeBundle {
  root: THREE.Object3D
  dispose?: () => void
}

interface VariationConfig<T extends BaseNodeBundle> {
  count?: number
  palette: string[]
  web?: {
    color: string
    opacity: number
    distance: number
  }
  createNode: (seed: SwarmSeed, index: number, color: THREE.Color) => T
  updateNode: (bundle: T, ctx: NodeUpdateContext) => void
}

const NODE_COUNT = 72
const MAX_WEB_SEGMENTS = 180
const SWARM_CENTER = new THREE.Vector3(0, 12, 0)
const Y_AXIS = new THREE.Vector3(0, 1, 0)
const Z_AXIS = new THREE.Vector3(0, 0, 1)
const TMP_A = new THREE.Vector3()
const TMP_B = new THREE.Vector3()
const TMP_C = new THREE.Vector3()
const TMP_LOCAL = new THREE.Vector3()

const SPHERE_GEO = new THREE.IcosahedronGeometry(1, 3)
const CORE_GEO = new THREE.IcosahedronGeometry(1, 1)
const OCTA_GEO = new THREE.OctahedronGeometry(1, 0)
const OCTA_EDGES = new THREE.EdgesGeometry(OCTA_GEO)
const TILE_GEO = new THREE.BoxGeometry(1.6, 0.92, 0.18)
const TILE_EDGES = new THREE.EdgesGeometry(TILE_GEO)
const DISC_GEO = new THREE.CircleGeometry(1, 40)
const RING_GEO = new THREE.RingGeometry(0.82, 1, 40)
const TORUS_GEO = new THREE.TorusGeometry(1, 0.06, 12, 48)
const CAPSULE_GEO = new THREE.CapsuleGeometry(0.34, 1.1, 4, 8)
const STEM_GEO = new THREE.BufferGeometry().setFromPoints([
  new THREE.Vector3(0, -1.4, 0),
  new THREE.Vector3(0, 0, 0),
])
const ORBIT_GEO = new THREE.BufferGeometry().setFromPoints(
  new THREE.EllipseCurve(0, 0, 1.1, 0.74, 0, Math.PI * 2, false, 0)
    .getPoints(48)
    .map(point => new THREE.Vector3(point.x, point.y, 0))
)
const TESSERACT_GEO = buildProjectedHypercubeGeometry()

const glowTextureCache = new Map<string, THREE.CanvasTexture>()
let particleDotTexture: THREE.CanvasTexture | null = null
let particleGlintTexture: THREE.CanvasTexture | null = null

function getParticleDotTexture() {
  if (!particleDotTexture) particleDotTexture = makeParticleDotTexture()
  return particleDotTexture
}

function getParticleGlintTexture() {
  if (!particleGlintTexture) particleGlintTexture = makeGlintTexture()
  return particleGlintTexture
}

function getGlowTexture(color: THREE.Color, size = 96) {
  const key = `${color.getHexString()}:${size}`
  const cached = glowTextureCache.get(key)
  if (cached) return cached

  const rgb: [number, number, number] = [
    Math.round(color.r * 255),
    Math.round(color.g * 255),
    Math.round(color.b * 255),
  ]
  const texture = makeParticleGlowTexture(rgb[0], rgb[1], rgb[2], size)
  glowTextureCache.set(key, texture)
  return texture
}

function fract(value: number) {
  return value - Math.floor(value)
}

function hash01(value: number) {
  return fract(Math.sin(value * 127.1 + 311.7) * 43758.5453123)
}

function hashSigned(value: number) {
  return hash01(value) * 2 - 1
}

function buildProjectedHypercubeGeometry() {
  const cubeVerts = [
    new THREE.Vector3(-1, -1, -1),
    new THREE.Vector3(1, -1, -1),
    new THREE.Vector3(-1, 1, -1),
    new THREE.Vector3(1, 1, -1),
    new THREE.Vector3(-1, -1, 1),
    new THREE.Vector3(1, -1, 1),
    new THREE.Vector3(-1, 1, 1),
    new THREE.Vector3(1, 1, 1),
  ]
  const innerVerts = cubeVerts.map(vertex =>
    vertex.clone().multiplyScalar(0.58).addScalar(0.48)
  )
  const edges = [
    [0, 1], [0, 2], [0, 4],
    [1, 3], [1, 5],
    [2, 3], [2, 6],
    [3, 7],
    [4, 5], [4, 6],
    [5, 7],
    [6, 7],
  ]

  const positions: number[] = []
  const pushEdge = (a: THREE.Vector3, b: THREE.Vector3) => {
    positions.push(a.x, a.y, a.z, b.x, b.y, b.z)
  }

  for (const [a, b] of edges) {
    pushEdge(cubeVerts[a], cubeVerts[b])
    pushEdge(innerVerts[a], innerVerts[b])
  }
  for (let i = 0; i < cubeVerts.length; i++) {
    pushEdge(cubeVerts[i], innerVerts[i])
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  return geometry
}

function createSwarmSeeds(count: number) {
  const seeds: SwarmSeed[] = []

  for (let index = 0; index < count; index++) {
    const band = index % 3
    const axis = new THREE.Vector3(
      hashSigned(index * 5 + 1),
      hashSigned(index * 5 + 2),
      hashSigned(index * 5 + 3),
    )
    if (axis.lengthSq() < 0.001) axis.set(0.3, 1, 0.2)
    axis.normalize()

    seeds.push({
      radius: 24 + band * 16 + hash01(index * 11 + 1) * 10,
      phase: hash01(index * 13 + 2) * Math.PI * 2,
      speed: 0.18 + hash01(index * 17 + 3) * 0.42 + band * 0.03,
      radialAmp: 4 + hash01(index * 19 + 4) * 6,
      radialFreq: 0.18 + hash01(index * 23 + 5) * 0.35,
      bobAmp: 5 + band * 3 + hash01(index * 29 + 6) * 8,
      bobFreq: 0.22 + hash01(index * 31 + 7) * 0.45,
      driftAmp: 2 + hash01(index * 37 + 8) * 6,
      driftFreq: 0.12 + hash01(index * 41 + 9) * 0.22,
      eccentricity: 0.72 + hash01(index * 43 + 10) * 0.45,
      scale: 0.7 + hash01(index * 47 + 11) * 0.65,
      shimmerFreq: 0.6 + hash01(index * 53 + 12) * 1.4,
      tilt: new THREE.Quaternion().setFromAxisAngle(axis, hashSigned(index * 59 + 13) * 0.85),
    })
  }

  return seeds
}

function sampleSwarmPosition(seed: SwarmSeed, elapsed: number, out: THREE.Vector3) {
  const orbit = seed.phase + elapsed * seed.speed
  const radius = seed.radius + Math.sin(elapsed * seed.radialFreq + seed.phase) * seed.radialAmp

  TMP_LOCAL.set(
    Math.cos(orbit) * radius,
    Math.sin(elapsed * seed.bobFreq + seed.phase * 1.31) * seed.bobAmp,
    Math.sin(orbit) * radius * seed.eccentricity,
  )

  TMP_LOCAL.applyQuaternion(seed.tilt)
  TMP_LOCAL.x += Math.sin(elapsed * seed.driftFreq + seed.phase * 0.7) * seed.driftAmp
  TMP_LOCAL.z += Math.cos(elapsed * seed.driftFreq * 0.72 + seed.phase * 1.2) * seed.driftAmp

  return out.copy(SWARM_CENTER).add(TMP_LOCAL)
}

function paletteColor(palette: string[], index: number) {
  const color = new THREE.Color(palette[index % palette.length])
  return color.lerp(new THREE.Color('#ffffff'), 0.08 + hash01(index * 71 + 1) * 0.12)
}

class ConnectionWeb {
  private geometry: THREE.BufferGeometry
  private material: THREE.LineBasicMaterial
  private line: THREE.LineSegments
  private positions = new Float32Array(MAX_WEB_SEGMENTS * 6)

  constructor(parent: THREE.Group, color: string, private baseOpacity: number, private maxDistance: number) {
    this.geometry = new THREE.BufferGeometry()
    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3))
    this.geometry.setDrawRange(0, 0)

    this.material = new THREE.LineBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: baseOpacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    this.line = new THREE.LineSegments(this.geometry, this.material)
    parent.add(this.line)
  }

  update(nodes: Array<{ position: THREE.Vector3 }>, activity: number) {
    const maxDistanceSq = this.maxDistance * this.maxDistance
    let segmentCount = 0

    for (let index = 0; index < nodes.length && segmentCount < MAX_WEB_SEGMENTS; index++) {
      const origin = nodes[index].position
      let nearestA = -1
      let nearestB = -1
      let distA = maxDistanceSq
      let distB = maxDistanceSq

      for (let otherIndex = index + 1; otherIndex < nodes.length; otherIndex++) {
        const distSq = origin.distanceToSquared(nodes[otherIndex].position)
        if (distSq < distA) {
          distB = distA
          nearestB = nearestA
          distA = distSq
          nearestA = otherIndex
        } else if (distSq < distB) {
          distB = distSq
          nearestB = otherIndex
        }
      }

      if (nearestA >= 0) segmentCount = this.writeSegment(segmentCount, origin, nodes[nearestA].position)
      if (nearestB >= 0 && index % 3 === 0) {
        segmentCount = this.writeSegment(segmentCount, origin, nodes[nearestB].position)
      }
    }

    this.line.visible = segmentCount > 0
    this.material.opacity = this.baseOpacity + activity * 0.08
    this.geometry.setDrawRange(0, segmentCount * 2)
    ;(this.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true
  }

  private writeSegment(count: number, a: THREE.Vector3, b: THREE.Vector3) {
    if (count >= MAX_WEB_SEGMENTS) return count
    const offset = count * 6
    this.positions[offset] = a.x
    this.positions[offset + 1] = a.y
    this.positions[offset + 2] = a.z
    this.positions[offset + 3] = b.x
    this.positions[offset + 4] = b.y
    this.positions[offset + 5] = b.z
    return count + 1
  }

  dispose() {
    this.geometry.dispose()
    this.material.dispose()
  }
}

function buildSwarmVariation<T extends BaseNodeBundle>(
  parent: THREE.Group,
  camera: THREE.Camera,
  config: VariationConfig<T>
): SwarmVisual {
  const group = new THREE.Group()
  parent.add(group)

  const nodes = createSwarmSeeds(config.count ?? NODE_COUNT).map((seed, index) => {
    const color = paletteColor(config.palette, index)
    const bundle = config.createNode(seed, index, color)
    group.add(bundle.root)
    return {
      bundle,
      color,
      position: new THREE.Vector3(),
      nextPosition: new THREE.Vector3(),
      seed,
    }
  })

  const web = config.web
    ? new ConnectionWeb(group, config.web.color, config.web.opacity, config.web.distance)
    : null

  let activity = 0

  return {
    tick(dt, elapsed) {
      activity = Math.max(0, activity - dt * 0.55)

      for (let index = 0; index < nodes.length; index++) {
        const node = nodes[index]
        sampleSwarmPosition(node.seed, elapsed, node.position)
        sampleSwarmPosition(node.seed, elapsed + 0.018, node.nextPosition)
        node.bundle.root.position.copy(node.position)

        TMP_C.copy(node.nextPosition).sub(node.position)
        const shimmer = Math.sin(elapsed * node.seed.shimmerFreq + node.seed.phase * 1.4) * 0.08
        const intensity = 0.85 + activity * 0.75 + shimmer

        config.updateNode(node.bundle, {
          activity,
          camera,
          color: node.color,
          elapsed,
          index,
          intensity,
          position: node.position,
          seed: node.seed,
          velocity: TMP_C,
        })
      }

      web?.update(nodes, activity)
    },
    pulse() {
      activity = 1
    },
    dispose() {
      web?.dispose()
      for (const node of nodes) {
        node.bundle.dispose?.()
        group.remove(node.bundle.root)
      }
      parent.remove(group)
    },
  }
}

interface HaloBundle extends BaseNodeBundle {
  halo: THREE.Sprite
  haloMat: THREE.SpriteMaterial
  core: THREE.Sprite
  coreMat: THREE.SpriteMaterial
  ring: THREE.Mesh
  ringMat: THREE.MeshBasicMaterial
  glint: THREE.Sprite
  glintMat: THREE.SpriteMaterial
}

function buildHaloDiscs(parent: THREE.Group, camera: THREE.Camera) {
  return buildSwarmVariation(parent, camera, {
    palette: ['#63d9ff', '#7c8cff', '#b98cff'],
    web: { color: '#7bb6ff', opacity: 0.08, distance: 34 },
    createNode(_seed, _index, color) {
      const root = new THREE.Group()

      const haloMat = new THREE.SpriteMaterial({
        map: getGlowTexture(color, 96),
        color,
        transparent: true,
        opacity: 0.3,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
      const halo = new THREE.Sprite(haloMat)

      const coreMat = new THREE.SpriteMaterial({
        map: getParticleDotTexture(),
        color: new THREE.Color('#ffffff'),
        transparent: true,
        opacity: 0.92,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
      const core = new THREE.Sprite(coreMat)

      const ringMat = new THREE.MeshBasicMaterial({
        color: color.clone().lerp(new THREE.Color('#ffffff'), 0.25),
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
      })
      const ring = new THREE.Mesh(RING_GEO, ringMat)

      const glintMat = new THREE.SpriteMaterial({
        map: getParticleGlintTexture(),
        color: new THREE.Color('#ffffff'),
        transparent: true,
        opacity: 0.2,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
      const glint = new THREE.Sprite(glintMat)
      glint.position.y = 0.1

      root.add(halo, ring, core, glint)

      return {
        root,
        halo,
        haloMat,
        core,
        coreMat,
        ring,
        ringMat,
        glint,
        glintMat,
        dispose() {
          haloMat.dispose()
          coreMat.dispose()
          ringMat.dispose()
          glintMat.dispose()
        },
      }
    },
    updateNode(bundle, ctx) {
      const scale = ctx.seed.scale
      bundle.ring.quaternion.copy(ctx.camera.quaternion)
      bundle.glint.material.rotation = ctx.elapsed * 0.16 + ctx.index * 0.11

      bundle.halo.scale.setScalar(scale * (4.8 + ctx.intensity * 1.2))
      bundle.core.scale.setScalar(scale * (1.05 + ctx.activity * 0.38))
      bundle.ring.scale.setScalar(scale * (1.45 + Math.sin(ctx.elapsed * 0.8 + ctx.index) * 0.08 + ctx.activity * 0.18))
      bundle.glint.scale.set(scale * (2.5 + ctx.activity * 1.4), scale * 0.36, 1)

      bundle.haloMat.opacity = 0.22 + ctx.activity * 0.16
      bundle.ringMat.opacity = 0.24 + ctx.activity * 0.1
      bundle.glintMat.opacity = 0.12 + ctx.activity * 0.2
    },
  })
}

interface FrostGlassBundle extends BaseNodeBundle {
  shell: THREE.Mesh
  shellMat: THREE.MeshPhongMaterial
  core: THREE.Mesh
  coreMat: THREE.MeshBasicMaterial
  halo: THREE.Sprite
  haloMat: THREE.SpriteMaterial
}

function buildFrostGlass(parent: THREE.Group, camera: THREE.Camera) {
  return buildSwarmVariation(parent, camera, {
    palette: ['#cbe7ff', '#9fd3ff', '#d2f3ff'],
    web: { color: '#7bb8ff', opacity: 0.04, distance: 30 },
    createNode(_seed, _index, color) {
      const root = new THREE.Group()

      const shellMat = new THREE.MeshPhongMaterial({
        color: color.clone().lerp(new THREE.Color('#ffffff'), 0.3),
        emissive: color.clone().multiplyScalar(0.18),
        transparent: true,
        opacity: 0.82,
        shininess: 110,
        specular: new THREE.Color('#ffffff'),
      })
      const shell = new THREE.Mesh(SPHERE_GEO, shellMat)

      const coreMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.48,
        blending: THREE.AdditiveBlending,
      })
      const core = new THREE.Mesh(CORE_GEO, coreMat)

      const haloMat = new THREE.SpriteMaterial({
        map: getGlowTexture(color, 80),
        color,
        transparent: true,
        opacity: 0.12,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
      const halo = new THREE.Sprite(haloMat)

      root.add(halo, shell, core)

      return {
        root,
        shell,
        shellMat,
        core,
        coreMat,
        halo,
        haloMat,
        dispose() {
          shellMat.dispose()
          coreMat.dispose()
          haloMat.dispose()
        },
      }
    },
    updateNode(bundle, ctx) {
      const scale = ctx.seed.scale
      bundle.root.rotation.set(
        ctx.elapsed * 0.18 + ctx.index * 0.07,
        ctx.elapsed * 0.24 + ctx.index * 0.05,
        ctx.elapsed * 0.1,
      )

      bundle.shell.scale.setScalar(scale * (1.1 + ctx.activity * 0.18))
      bundle.core.scale.setScalar(scale * (0.34 + ctx.activity * 0.12))
      bundle.halo.scale.setScalar(scale * (2.4 + ctx.activity * 1.2))

      bundle.shellMat.emissiveIntensity = 0.22 + ctx.activity * 0.35
      bundle.haloMat.opacity = 0.08 + ctx.activity * 0.12
      bundle.coreMat.opacity = 0.36 + ctx.activity * 0.18
    },
  })
}

interface WireDiamondBundle extends BaseNodeBundle {
  solid: THREE.Mesh
  solidMat: THREE.MeshBasicMaterial
  edges: THREE.LineSegments
  edgeMat: THREE.LineBasicMaterial
  core: THREE.Mesh
  coreMat: THREE.MeshBasicMaterial
}

function buildWireDiamonds(parent: THREE.Group, camera: THREE.Camera) {
  return buildSwarmVariation(parent, camera, {
    palette: ['#88f5ff', '#7fbcff', '#d1a4ff'],
    createNode(_seed, _index, color) {
      const root = new THREE.Group()

      const solidMat = new THREE.MeshBasicMaterial({
        color: color.clone().multiplyScalar(0.6),
        transparent: true,
        opacity: 0.16,
        blending: THREE.AdditiveBlending,
      })
      const solid = new THREE.Mesh(OCTA_GEO, solidMat)

      const edgeMat = new THREE.LineBasicMaterial({
        color: color.clone().lerp(new THREE.Color('#ffffff'), 0.18),
        transparent: true,
        opacity: 0.46,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
      const edges = new THREE.LineSegments(OCTA_EDGES, edgeMat)

      const coreMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color('#ffffff'),
        transparent: true,
        opacity: 0.28,
        blending: THREE.AdditiveBlending,
      })
      const core = new THREE.Mesh(CORE_GEO, coreMat)

      root.add(solid, edges, core)

      return {
        root,
        solid,
        solidMat,
        edges,
        edgeMat,
        core,
        coreMat,
        dispose() {
          solidMat.dispose()
          edgeMat.dispose()
          coreMat.dispose()
        },
      }
    },
    updateNode(bundle, ctx) {
      const scale = ctx.seed.scale
      bundle.root.rotation.set(
        ctx.elapsed * 0.4 + ctx.index * 0.1,
        ctx.elapsed * 0.55 + ctx.index * 0.13,
        ctx.elapsed * 0.26,
      )

      bundle.solid.scale.setScalar(scale * (0.95 + ctx.activity * 0.2))
      bundle.edges.scale.setScalar(scale * (1.1 + ctx.activity * 0.28))
      bundle.core.scale.setScalar(scale * (0.22 + ctx.activity * 0.16))

      bundle.solidMat.opacity = 0.12 + ctx.activity * 0.08
      bundle.edgeMat.opacity = 0.4 + ctx.activity * 0.18
      bundle.coreMat.opacity = 0.18 + ctx.activity * 0.26
    },
  })
}

interface SignalRingBundle extends BaseNodeBundle {
  ring: THREE.Mesh
  ringMat: THREE.MeshBasicMaterial
  dot: THREE.Mesh
  dotMat: THREE.MeshBasicMaterial
  satellite: THREE.Mesh
  satelliteMat: THREE.MeshBasicMaterial
}

function buildSignalRings(parent: THREE.Group, camera: THREE.Camera) {
  return buildSwarmVariation(parent, camera, {
    palette: ['#62d5ff', '#3cf0c9', '#92a8ff'],
    web: { color: '#56d4ff', opacity: 0.06, distance: 36 },
    createNode(_seed, _index, color) {
      const root = new THREE.Group()

      const ringMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
      })
      const ring = new THREE.Mesh(RING_GEO, ringMat)

      const dotMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color('#f8fdff'),
        transparent: true,
        opacity: 0.92,
      })
      const dot = new THREE.Mesh(DISC_GEO, dotMat)
      dot.scale.setScalar(0.22)

      const satelliteMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.85,
      })
      const satellite = new THREE.Mesh(DISC_GEO, satelliteMat)
      satellite.scale.setScalar(0.12)

      root.add(ring, dot, satellite)

      return {
        root,
        ring,
        ringMat,
        dot,
        dotMat,
        satellite,
        satelliteMat,
        dispose() {
          ringMat.dispose()
          dotMat.dispose()
          satelliteMat.dispose()
        },
      }
    },
    updateNode(bundle, ctx) {
      const scale = ctx.seed.scale
      const orbit = ctx.elapsed * (1 + ctx.seed.shimmerFreq * 0.4) + ctx.index * 0.6

      bundle.root.quaternion.copy(ctx.camera.quaternion)
      bundle.ring.scale.setScalar(scale * (1.15 + ctx.activity * 0.25))
      bundle.dot.scale.setScalar(scale * (0.22 + ctx.activity * 0.05))
      bundle.satellite.position.set(
        Math.cos(orbit) * scale * 1.4,
        Math.sin(orbit) * scale * 1.4,
        0,
      )
      bundle.satellite.scale.setScalar(scale * (0.12 + ctx.activity * 0.03))

      bundle.ringMat.opacity = 0.22 + ctx.activity * 0.12
      bundle.satelliteMat.opacity = 0.72 + ctx.activity * 0.18
    },
  })
}

interface DataTileBundle extends BaseNodeBundle {
  tile: THREE.Mesh
  tileMat: THREE.MeshStandardMaterial
  outline: THREE.LineSegments
  outlineMat: THREE.LineBasicMaterial
  glint: THREE.Sprite
  glintMat: THREE.SpriteMaterial
}

function buildDataTiles(parent: THREE.Group, camera: THREE.Camera) {
  return buildSwarmVariation(parent, camera, {
    palette: ['#90c7ff', '#83b5ff', '#72e3ff'],
    createNode(_seed, _index, color) {
      const root = new THREE.Group()

      const tileMat = new THREE.MeshStandardMaterial({
        color: color.clone().lerp(new THREE.Color('#071321'), 0.68),
        roughness: 0.28,
        metalness: 0.48,
        emissive: color.clone().multiplyScalar(0.15),
      })
      const tile = new THREE.Mesh(TILE_GEO, tileMat)

      const outlineMat = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.34,
        depthWrite: false,
      })
      const outline = new THREE.LineSegments(TILE_EDGES, outlineMat)

      const glintMat = new THREE.SpriteMaterial({
        map: getParticleGlintTexture(),
        color: new THREE.Color('#ffffff'),
        transparent: true,
        opacity: 0.16,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
      const glint = new THREE.Sprite(glintMat)
      glint.position.z = 0.12

      root.add(tile, outline, glint)

      return {
        root,
        tile,
        tileMat,
        outline,
        outlineMat,
        glint,
        glintMat,
        dispose() {
          tileMat.dispose()
          outlineMat.dispose()
          glintMat.dispose()
        },
      }
    },
    updateNode(bundle, ctx) {
      const scale = ctx.seed.scale
      if (ctx.velocity.lengthSq() > 0.0001) {
        TMP_A.copy(ctx.velocity).normalize()
        bundle.root.quaternion.setFromUnitVectors(Z_AXIS, TMP_A)
      }

      bundle.tile.scale.set(scale * 1.05, scale * 0.68, scale * (0.18 + ctx.activity * 0.04))
      bundle.outline.scale.copy(bundle.tile.scale)
      bundle.glint.scale.set(scale * (2 + ctx.activity * 1.1), scale * 0.22, 1)
      bundle.glint.material.rotation = ctx.index * 0.2 + Math.sin(ctx.elapsed * 0.8 + ctx.index)

      bundle.tileMat.emissiveIntensity = 0.22 + ctx.activity * 0.28
      bundle.outlineMat.opacity = 0.26 + ctx.activity * 0.16
      bundle.glintMat.opacity = 0.1 + ctx.activity * 0.18
    },
  })
}

interface NeedleCapsuleBundle extends BaseNodeBundle {
  body: THREE.Mesh
  bodyMat: THREE.MeshStandardMaterial
  core: THREE.Mesh
  coreMat: THREE.MeshBasicMaterial
  wake: THREE.Line
  wakeMat: THREE.LineBasicMaterial
}

function buildNeedleCapsules(parent: THREE.Group, camera: THREE.Camera) {
  return buildSwarmVariation(parent, camera, {
    palette: ['#e2f0ff', '#82cfff', '#90f0ff'],
    createNode(_seed, _index, color) {
      const root = new THREE.Group()

      const bodyMat = new THREE.MeshStandardMaterial({
        color: color.clone().lerp(new THREE.Color('#ffffff'), 0.28),
        roughness: 0.16,
        metalness: 0.45,
        emissive: color.clone().multiplyScalar(0.12),
      })
      const body = new THREE.Mesh(CAPSULE_GEO, bodyMat)

      const coreMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.36,
        blending: THREE.AdditiveBlending,
      })
      const core = new THREE.Mesh(CORE_GEO, coreMat)
      core.scale.set(0.14, 0.42, 0.14)

      const wakeMat = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.2,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
      const wake = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, -1.25, 0),
          new THREE.Vector3(0, 0.15, 0),
        ]),
        wakeMat,
      )

      root.add(wake, body, core)

      return {
        root,
        body,
        bodyMat,
        core,
        coreMat,
        wake,
        wakeMat,
        dispose() {
          bodyMat.dispose()
          coreMat.dispose()
          wake.geometry.dispose()
          wakeMat.dispose()
        },
      }
    },
    updateNode(bundle, ctx) {
      const scale = ctx.seed.scale
      if (ctx.velocity.lengthSq() > 0.0001) {
        TMP_A.copy(ctx.velocity).normalize()
        bundle.root.quaternion.setFromUnitVectors(Y_AXIS, TMP_A)
      }

      bundle.body.scale.set(scale * 0.78, scale * (1 + ctx.activity * 0.32), scale * 0.78)
      bundle.core.scale.set(scale * 0.12, scale * (0.42 + ctx.activity * 0.12), scale * 0.12)
      bundle.wake.scale.setScalar(scale * (1 + ctx.activity * 0.15))

      bundle.bodyMat.emissiveIntensity = 0.14 + ctx.activity * 0.22
      bundle.wakeMat.opacity = 0.14 + ctx.activity * 0.16
      bundle.coreMat.opacity = 0.26 + ctx.activity * 0.18
    },
  })
}

interface PearlShellBundle extends BaseNodeBundle {
  shell: THREE.Mesh
  shellMat: THREE.MeshPhongMaterial
  core: THREE.Mesh
  coreMat: THREE.MeshBasicMaterial
  orbit: THREE.LineLoop
  orbitMat: THREE.LineBasicMaterial
}

function buildPearlShells(parent: THREE.Group, camera: THREE.Camera) {
  return buildSwarmVariation(parent, camera, {
    palette: ['#c9deff', '#e7d5ff', '#a8eeff'],
    web: { color: '#a8c8ff', opacity: 0.04, distance: 32 },
    createNode(_seed, _index, color) {
      const root = new THREE.Group()

      const shellMat = new THREE.MeshPhongMaterial({
        color: new THREE.Color('#0b1020'),
        emissive: color.clone().multiplyScalar(0.14),
        shininess: 130,
        specular: new THREE.Color('#f8fbff'),
      })
      const shell = new THREE.Mesh(SPHERE_GEO, shellMat)

      const coreMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
      })
      const core = new THREE.Mesh(CORE_GEO, coreMat)
      core.scale.setScalar(0.26)

      const orbitMat = new THREE.LineBasicMaterial({
        color: color.clone().lerp(new THREE.Color('#ffffff'), 0.2),
        transparent: true,
        opacity: 0.22,
      })
      const orbit = new THREE.LineLoop(ORBIT_GEO, orbitMat)
      orbit.rotation.x = Math.PI * 0.5

      root.add(orbit, shell, core)

      return {
        root,
        shell,
        shellMat,
        core,
        coreMat,
        orbit,
        orbitMat,
        dispose() {
          shellMat.dispose()
          coreMat.dispose()
          orbitMat.dispose()
        },
      }
    },
    updateNode(bundle, ctx) {
      const scale = ctx.seed.scale
      bundle.root.rotation.set(
        ctx.elapsed * 0.22 + ctx.index * 0.03,
        ctx.elapsed * 0.28 + ctx.index * 0.07,
        0,
      )
      bundle.orbit.rotation.z = ctx.elapsed * 0.35 + ctx.index * 0.2

      bundle.shell.scale.setScalar(scale * (1 + ctx.activity * 0.14))
      bundle.core.scale.setScalar(scale * (0.24 + ctx.activity * 0.11))
      bundle.orbit.scale.setScalar(scale * (1.1 + ctx.activity * 0.16))

      bundle.shellMat.emissiveIntensity = 0.16 + ctx.activity * 0.24
      bundle.coreMat.opacity = 0.46 + ctx.activity * 0.18
      bundle.orbitMat.opacity = 0.16 + ctx.activity * 0.12
    },
  })
}

interface TesseractBundle extends BaseNodeBundle {
  outer: THREE.LineSegments
  outerMat: THREE.LineBasicMaterial
  inner: THREE.LineSegments
  innerMat: THREE.LineBasicMaterial
  core: THREE.Mesh
  coreMat: THREE.MeshBasicMaterial
}

function buildTesseractGhosts(parent: THREE.Group, camera: THREE.Camera) {
  return buildSwarmVariation(parent, camera, {
    count: 56,
    palette: ['#7ad7ff', '#9c8cff', '#8bf3d9'],
    createNode(_seed, _index, color) {
      const root = new THREE.Group()

      const outerMat = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.32,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
      const outer = new THREE.LineSegments(TESSERACT_GEO, outerMat)

      const innerMat = new THREE.LineBasicMaterial({
        color: new THREE.Color('#ffffff'),
        transparent: true,
        opacity: 0.14,
        depthWrite: false,
      })
      const inner = new THREE.LineSegments(TESSERACT_GEO, innerMat)
      inner.scale.setScalar(0.62)

      const coreMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending,
      })
      const core = new THREE.Mesh(CORE_GEO, coreMat)
      core.scale.setScalar(0.18)

      root.add(outer, inner, core)

      return {
        root,
        outer,
        outerMat,
        inner,
        innerMat,
        core,
        coreMat,
        dispose() {
          outerMat.dispose()
          innerMat.dispose()
          coreMat.dispose()
        },
      }
    },
    updateNode(bundle, ctx) {
      const scale = ctx.seed.scale
      bundle.root.rotation.set(
        ctx.elapsed * 0.65 + ctx.index * 0.07,
        ctx.elapsed * 0.47 + ctx.index * 0.11,
        ctx.elapsed * 0.39 + ctx.index * 0.05,
      )

      bundle.outer.scale.setScalar(scale * (0.64 + ctx.activity * 0.16))
      bundle.inner.scale.setScalar(scale * (0.42 + ctx.activity * 0.12))
      bundle.core.scale.setScalar(scale * (0.14 + ctx.activity * 0.08))

      bundle.outerMat.opacity = 0.26 + ctx.activity * 0.16
      bundle.innerMat.opacity = 0.12 + ctx.activity * 0.08
      bundle.coreMat.opacity = 0.18 + ctx.activity * 0.16
    },
  })
}

interface InkMoonBundle extends BaseNodeBundle {
  disc: THREE.Mesh
  discMat: THREE.MeshBasicMaterial
  rim: THREE.Mesh
  rimMat: THREE.MeshBasicMaterial
  sheen: THREE.Mesh
  sheenMat: THREE.MeshBasicMaterial
  spark: THREE.Sprite
  sparkMat: THREE.SpriteMaterial
}

function buildInkMoons(parent: THREE.Group, camera: THREE.Camera) {
  return buildSwarmVariation(parent, camera, {
    palette: ['#64c9ff', '#8fe2ff', '#beb4ff'],
    createNode(_seed, _index, color) {
      const root = new THREE.Group()

      const discMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color('#05070d'),
        transparent: true,
        opacity: 0.94,
        side: THREE.DoubleSide,
      })
      const disc = new THREE.Mesh(DISC_GEO, discMat)

      const rimMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.22,
        side: THREE.DoubleSide,
      })
      const rim = new THREE.Mesh(RING_GEO, rimMat)

      const sheenMat = new THREE.MeshBasicMaterial({
        color: color.clone().lerp(new THREE.Color('#ffffff'), 0.18),
        transparent: true,
        opacity: 0.12,
        side: THREE.DoubleSide,
      })
      const sheen = new THREE.Mesh(DISC_GEO, sheenMat)
      sheen.position.x = 0.18
      sheen.scale.set(0.72, 0.92, 1)

      const sparkMat = new THREE.SpriteMaterial({
        map: getGlowTexture(color, 64),
        color,
        transparent: true,
        opacity: 0.12,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
      const spark = new THREE.Sprite(sparkMat)
      spark.position.set(0.45, 0.18, 0)

      root.add(disc, rim, sheen, spark)

      return {
        root,
        disc,
        discMat,
        rim,
        rimMat,
        sheen,
        sheenMat,
        spark,
        sparkMat,
        dispose() {
          discMat.dispose()
          rimMat.dispose()
          sheenMat.dispose()
          sparkMat.dispose()
        },
      }
    },
    updateNode(bundle, ctx) {
      const scale = ctx.seed.scale
      bundle.root.quaternion.copy(ctx.camera.quaternion)

      bundle.disc.scale.setScalar(scale * (1 + ctx.activity * 0.08))
      bundle.rim.scale.setScalar(scale * (1.08 + ctx.activity * 0.1))
      bundle.sheen.position.x = scale * (0.16 + Math.sin(ctx.elapsed * 0.4 + ctx.index) * 0.04)
      bundle.sheen.scale.set(scale * 0.74, scale * 0.92, 1)
      bundle.spark.scale.setScalar(scale * (1.4 + ctx.activity * 0.8))

      bundle.rimMat.opacity = 0.18 + ctx.activity * 0.12
      bundle.sheenMat.opacity = 0.08 + ctx.activity * 0.08
      bundle.sparkMat.opacity = 0.08 + ctx.activity * 0.12
    },
  })
}

interface RelayPinBundle extends BaseNodeBundle {
  stem: THREE.Line
  stemMat: THREE.LineBasicMaterial
  head: THREE.Mesh
  headMat: THREE.MeshBasicMaterial
  halo: THREE.Mesh
  haloMat: THREE.MeshBasicMaterial
}

function buildRelayPins(parent: THREE.Group, camera: THREE.Camera) {
  return buildSwarmVariation(parent, camera, {
    count: 64,
    palette: ['#79d9ff', '#9cd0ff', '#86f0d1'],
    web: { color: '#7fd3ff', opacity: 0.11, distance: 42 },
    createNode(_seed, _index, color) {
      const root = new THREE.Group()

      const stemMat = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.2,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
      const stem = new THREE.Line(STEM_GEO, stemMat)

      const headMat = new THREE.MeshBasicMaterial({
        color: color.clone().lerp(new THREE.Color('#ffffff'), 0.2),
        transparent: true,
        opacity: 0.92,
      })
      const head = new THREE.Mesh(CORE_GEO, headMat)
      head.scale.setScalar(0.22)

      const haloMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.22,
      })
      const halo = new THREE.Mesh(TORUS_GEO, haloMat)
      halo.rotation.x = Math.PI * 0.5

      root.add(stem, halo, head)

      return {
        root,
        stem,
        stemMat,
        head,
        headMat,
        halo,
        haloMat,
        dispose() {
          stemMat.dispose()
          headMat.dispose()
          haloMat.dispose()
        },
      }
    },
    updateNode(bundle, ctx) {
      const scale = ctx.seed.scale
      TMP_A.copy(ctx.position).sub(SWARM_CENTER)
      if (TMP_A.lengthSq() > 0.0001) {
        TMP_A.normalize()
        bundle.root.quaternion.setFromUnitVectors(Y_AXIS, TMP_A)
      }

      bundle.stem.scale.setScalar(scale * (1 + ctx.activity * 0.08))
      bundle.head.scale.setScalar(scale * (0.2 + ctx.activity * 0.08))
      bundle.halo.scale.setScalar(scale * (0.52 + ctx.activity * 0.16))
      bundle.halo.rotation.y = ctx.elapsed * 0.8 + ctx.index * 0.12

      bundle.stemMat.opacity = 0.16 + ctx.activity * 0.18
      bundle.haloMat.opacity = 0.14 + ctx.activity * 0.12
    },
  })
}

export const NODE_SWARM_VARIATIONS: NodeSwarmVariation[] = [
  {
    name: 'Halo Discs',
    space: '2D',
    accent: '#7bb6ff',
    technique: 'Camera-facing hard cores with restrained halo rings',
    description: 'The cleanest upgrade path from bloom squares: still lightweight, but sharper, more intentional, and easier to read at a distance.',
    build: buildHaloDiscs,
  },
  {
    name: 'Frost Glass',
    space: '3D',
    accent: '#b5ddff',
    technique: 'Glossy translucent beads with a lit internal nucleus',
    description: 'Feels premium and physical. Good if nodes should read like objects in a real volume instead of UI particles.',
    build: buildFrostGlass,
  },
  {
    name: 'Wire Diamonds',
    space: '3D',
    accent: '#8feeff',
    technique: 'Faceted octahedra with bright edge emphasis',
    description: 'A more technical, crystalline read. Strong silhouettes without relying on heavy glow.',
    build: buildWireDiamonds,
  },
  {
    name: 'Signal Rings',
    space: '2D',
    accent: '#56d4ff',
    technique: 'HUD rings with orbiting micro-satellites',
    description: 'Leans editorial and interface-driven. Useful if the swarm should feel like instrumentation, not matter.',
    build: buildSignalRings,
  },
  {
    name: 'Data Tiles',
    space: '2.5D',
    accent: '#88beff',
    technique: 'Thin luminous chips aligned to movement vectors',
    description: 'Gives each node a directional identity and a professional systems-visualization feel.',
    build: buildDataTiles,
  },
  {
    name: 'Needle Capsules',
    space: '3D',
    accent: '#9be6ff',
    technique: 'Aerodynamic capsules that point through the flow field',
    description: 'Makes the swarm feel fast and deliberate. Strong option if motion direction matters as much as location.',
    build: buildNeedleCapsules,
  },
  {
    name: 'Pearl Shells',
    space: '3D',
    accent: '#d8dcff',
    technique: 'Dark shells with luminous centers and orbit traces',
    description: 'Softer and more art-directed. This reads less like telemetry and more like a curated installation.',
    build: buildPearlShells,
  },
  {
    name: 'Tesseract Ghosts',
    space: '4D-ish',
    accent: '#9a93ff',
    technique: 'Projected hypercube frames with inner phase-shifted echoes',
    description: 'Not literal 4D, but it hints at higher-dimensional structure in a way that feels intentional instead of gimmicky.',
    build: buildTesseractGhosts,
  },
  {
    name: 'Ink Moons',
    space: '2D',
    accent: '#8fdfff',
    technique: 'Matte dark discs with rim light and offset crescent sheen',
    description: 'The most editorial/artsy direction here. Low glow, high contrast, and very clean in dense swarms.',
    build: buildInkMoons,
  },
  {
    name: 'Relay Pins',
    space: '2.5D',
    accent: '#7fd3ff',
    technique: 'Pinned signal heads with a more visible connective web',
    description: 'Turns the swarm into a networked field instead of a cloud. Good if relationships matter more than individual sparkle.',
    build: buildRelayPins,
  },
]
