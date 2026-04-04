import * as THREE from 'three'
import { hexStringToRgb, makeParticleGlowTexture } from '../../textures/GradientTextures'

export interface ColonizationVariation {
  name: string
  accent: string
  layout: string
  eventModel: string
  useCase: string
  description: string
  build: (group: THREE.Group, camera: THREE.Camera) => ColonizationVisual
}

export interface ColonizationVisual {
  tick: (dt: number, elapsed: number) => void
  pulse: () => void
  dispose: () => void
}

interface AttractorMeta {
  angle?: number
  sweep?: number
  layer?: number
  lobe?: number
}

type AttractorState = 'dormant' | 'armed' | 'captured'

interface Attractor {
  home: THREE.Vector3
  position: THREE.Vector3
  normal: THREE.Vector3
  state: AttractorState
  energy: number
  carrierNode: number | null
  meta: AttractorMeta
  phase: number
  driftAmplitude: number
  driftFrequency: number
}

interface GrowthNode {
  position: THREE.Vector3
  parent: number | null
  depth: number
  radius: number
}

interface BranchSegment {
  startNode: number
  endNode: number
  radius: number
  glow: number
}

interface SignalPulse {
  path: number[]
  distances: number[]
  totalDistance: number
  distance: number
  speed: number
  sprite: THREE.Sprite
  material: THREE.SpriteMaterial
}

interface VariationBlueprint {
  name: string
  accent: string
  layout: string
  eventModel: string
  useCase: string
  description: string
  influenceDistance: number
  killDistance: number
  stepLength: number
  stepsPerPulse: number
  maxNewPerStep: number
  maxSegments: number
  rootRadius: number
  tipRadius: number
  nodeScale: number
  drift: number
  bias: THREE.Vector3
  seedDirections: THREE.Vector3[]
  createAttractors: () => Attractor[]
  selectTargets: (attractors: Attractor[], pulseIndex: number) => number[]
}

const ROOT = new THREE.Vector3(0, 12, 0)
const UP = new THREE.Vector3(0, 1, 0)
const WHITE = new THREE.Color('#ffffff')
const DORMANT_SHADE = new THREE.Color('#121a2d')
const DUMMY = new THREE.Object3D()
const TMP_A = new THREE.Vector3()
const TMP_B = new THREE.Vector3()
const TMP_C = new THREE.Vector3()
const TMP_COLOR = new THREE.Color()

function fract(value: number) {
  return value - Math.floor(value)
}

function hash01(value: number) {
  return fract(Math.sin(value * 127.1 + 311.7) * 43758.5453123)
}

function hashSigned(value: number) {
  return hash01(value) * 2 - 1
}

function angularDistance(a: number, b: number) {
  const diff = Math.atan2(Math.sin(a - b), Math.cos(a - b))
  return Math.abs(diff)
}

function radialSeeds(count: number, lift: number, yawOffset = 0, arc = Math.PI * 2) {
  const directions: THREE.Vector3[] = []
  const span = count > 1 ? arc / (count - 1) : 0
  const start = yawOffset - arc * 0.5

  for (let index = 0; index < count; index++) {
    const angle = arc >= Math.PI * 2
      ? yawOffset + (index / count) * Math.PI * 2
      : start + span * index
    directions.push(new THREE.Vector3(Math.cos(angle), lift, Math.sin(angle)).normalize())
  }

  return directions
}

function createAttractor(position: THREE.Vector3, meta: AttractorMeta, seed: number, drift = 1) {
  const normal = position.clone().sub(ROOT)
  if (normal.lengthSq() < 0.0001) normal.set(0, 1, 0)
  else normal.normalize()

  return {
    home: position.clone(),
    position: position.clone(),
    normal,
    state: 'dormant' as AttractorState,
    energy: 0,
    carrierNode: null,
    meta,
    phase: hash01(seed * 3 + 1) * Math.PI * 2,
    driftAmplitude: drift * (0.45 + hash01(seed * 3 + 2) * 0.55),
    driftFrequency: 0.6 + hash01(seed * 3 + 3) * 0.8,
  }
}

function selectDormantByScore(attractors: Attractor[], count: number, scoreFor: (attractor: Attractor) => number) {
  const ranked: Array<{ index: number; score: number }> = []

  for (let index = 0; index < attractors.length; index++) {
    const attractor = attractors[index]
    if (attractor.state !== 'dormant') continue
    ranked.push({ index, score: scoreFor(attractor) })
  }

  ranked.sort((a, b) => a.score - b.score)
  return ranked.slice(0, count).map(item => item.index)
}

function fallbackDormant(attractors: Attractor[], count: number) {
  return selectDormantByScore(attractors, count, attractor => attractor.home.distanceToSquared(ROOT))
}

function buildPocketCanopyAttractors() {
  const attractors: Attractor[] = []

  for (let index = 0; index < 84; index++) {
    const angle = hash01(index * 13 + 1) * Math.PI * 2
    const radius = 16 + hash01(index * 13 + 2) * 18
    const squash = 0.7 + hash01(index * 13 + 3) * 0.35
    const x = Math.cos(angle) * radius * squash
    const y = 6 + Math.pow(hash01(index * 13 + 4), 0.72) * 22
    const z = Math.sin(angle) * radius * squash
    attractors.push(createAttractor(new THREE.Vector3(ROOT.x + x, ROOT.y + y, ROOT.z + z), { angle }, index, 1.0))
  }

  return attractors
}

function buildRibbonFanAttractors() {
  const attractors: Attractor[] = []

  for (let index = 0; index < 76; index++) {
    const sweep = -1 + (index / 75) * 2 + hashSigned(index * 17 + 1) * 0.04
    const reach = 14 + hash01(index * 17 + 2) * 26
    const x = sweep * 38
    const y = 6 + (1 - Math.abs(sweep) * 0.7) * 14 + hashSigned(index * 17 + 3) * 5
    const z = hashSigned(index * 17 + 4) * (4 + reach * 0.12)
    attractors.push(createAttractor(new THREE.Vector3(ROOT.x + x, ROOT.y + y, ROOT.z + z), { sweep }, index + 100, 0.85))
  }

  return attractors
}

function buildSplitRelayAttractors() {
  const attractors: Attractor[] = []

  for (let index = 0; index < 82; index++) {
    const lobe = index % 2
    const centerX = lobe === 0 ? -26 : 26
    const centerZ = lobe === 0 ? -7 : 7
    const x = centerX + hashSigned(index * 19 + 1) * 14
    const y = 7 + hash01(index * 19 + 2) * 20
    const z = centerZ + hashSigned(index * 19 + 3) * 12
    attractors.push(createAttractor(new THREE.Vector3(ROOT.x + x, ROOT.y + y, ROOT.z + z), { lobe }, index + 200, 0.95))
  }

  return attractors
}

function buildHaloWreathAttractors() {
  const attractors: Attractor[] = []

  for (let index = 0; index < 88; index++) {
    const angle = (index / 88) * Math.PI * 2 + hashSigned(index * 23 + 1) * 0.08
    const radius = 28 + hashSigned(index * 23 + 2) * 4.8
    const x = Math.cos(angle) * radius
    const y = 10 + Math.sin(angle * 2.2) * 4 + hashSigned(index * 23 + 3) * 2.4
    const z = Math.sin(angle) * radius
    attractors.push(createAttractor(new THREE.Vector3(ROOT.x + x, ROOT.y + y, ROOT.z + z), { angle }, index + 300, 0.9))
  }

  return attractors
}

function buildSignalStackAttractors() {
  const attractors: Attractor[] = []
  const layers = 4

  for (let index = 0; index < 80; index++) {
    const layer = index % layers
    const angle = hash01(index * 29 + 1) * Math.PI * 2
    const radius = 8 + layer * 3.8 + hash01(index * 29 + 2) * 6
    const x = Math.cos(angle) * radius
    const y = 6 + layer * 8.5 + hashSigned(index * 29 + 3) * 2.4
    const z = Math.sin(angle) * radius * 0.82
    attractors.push(createAttractor(new THREE.Vector3(ROOT.x + x, ROOT.y + y, ROOT.z + z), { angle, layer }, index + 400, 1.05))
  }

  return attractors
}

function selectPocketBurst(attractors: Attractor[], pulseIndex: number) {
  const angle = hash01(pulseIndex * 31 + 1) * Math.PI * 2
  const radius = 18 + hash01(pulseIndex * 31 + 2) * 10
  const height = 10 + hash01(pulseIndex * 31 + 3) * 18
  TMP_C.set(ROOT.x + Math.cos(angle) * radius, ROOT.y + height, ROOT.z + Math.sin(angle) * radius)
  const picked = selectDormantByScore(attractors, 12, attractor => attractor.home.distanceToSquared(TMP_C))
  return picked.length ? picked : fallbackDormant(attractors, 12)
}

function selectRibbonSweep(attractors: Attractor[], pulseIndex: number) {
  const sweep = -1 + ((pulseIndex % 7) / 6) * 2
  const picked = selectDormantByScore(attractors, 11, attractor => {
    const delta = Math.abs((attractor.meta.sweep ?? 0) - sweep)
    return delta * 100 + Math.abs(attractor.home.y - (ROOT.y + 16))
  })
  return picked.length ? picked : fallbackDormant(attractors, 11)
}

function selectSplitRelay(attractors: Attractor[], pulseIndex: number) {
  const lobe = pulseIndex % 2
  TMP_C.set(
    ROOT.x + (lobe === 0 ? -28 : 28) + hashSigned(pulseIndex * 37 + 1) * 6,
    ROOT.y + 10 + hash01(pulseIndex * 37 + 2) * 18,
    ROOT.z + (lobe === 0 ? -7 : 7) + hashSigned(pulseIndex * 37 + 3) * 4,
  )

  const picked = selectDormantByScore(attractors, 12, attractor => {
    const lobePenalty = (attractor.meta.lobe ?? -1) === lobe ? 0 : 10_000
    return lobePenalty + attractor.home.distanceToSquared(TMP_C)
  })

  return picked.length ? picked : fallbackDormant(attractors, 12)
}

function selectHaloArc(attractors: Attractor[], pulseIndex: number) {
  const angle = pulseIndex * 0.72
  const picked = selectDormantByScore(attractors, 14, attractor => angularDistance(attractor.meta.angle ?? 0, angle) * 180)
  return picked.length ? picked : fallbackDormant(attractors, 14)
}

function selectSignalLayer(attractors: Attractor[], pulseIndex: number) {
  const layer = pulseIndex % 4
  const angle = hash01(pulseIndex * 41 + 1) * Math.PI * 2
  const picked = selectDormantByScore(attractors, 10, attractor => {
    const layerPenalty = (attractor.meta.layer ?? -1) === layer ? 0 : 10_000
    const anglePenalty = angularDistance(attractor.meta.angle ?? 0, angle) * 90
    return layerPenalty + anglePenalty
  })
  return picked.length ? picked : fallbackDormant(attractors, 10)
}

class ColonizationField implements ColonizationVisual {
  private readonly group = new THREE.Group()
  private readonly branchGeometry = new THREE.CylinderGeometry(1, 1, 1, 6, 1, true)
  private readonly branchMaterial = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0.88,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  private readonly branchMesh: THREE.InstancedMesh

  private readonly nodeGeometry = new THREE.IcosahedronGeometry(1, 1)
  private readonly nodeMaterial = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0.96,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  private readonly nodeMesh: THREE.InstancedMesh

  private readonly glowTexture: THREE.CanvasTexture
  private readonly accentColor: THREE.Color
  private readonly branchBaseColor: THREE.Color
  private readonly dormantColor: THREE.Color

  private attractors: Attractor[]
  private nodes: GrowthNode[] = []
  private segments: BranchSegment[] = []
  private segmentIndexByNode: number[] = []
  private pulses: SignalPulse[] = []

  private pulseIndex = 0
  private activity = 0
  private pendingSteps = 0
  private stepAccumulator = 0
  private completionDelay = 0

  constructor(parent: THREE.Group, private readonly blueprint: VariationBlueprint) {
    this.accentColor = new THREE.Color(blueprint.accent)
    this.branchBaseColor = this.accentColor.clone().lerp(WHITE, 0.14)
    this.dormantColor = this.accentColor.clone().lerp(DORMANT_SHADE, 0.78)

    const [r, g, b] = hexStringToRgb(blueprint.accent)
    this.glowTexture = makeParticleGlowTexture(r, g, b, 96)

    this.branchMesh = new THREE.InstancedMesh(this.branchGeometry, this.branchMaterial, blueprint.maxSegments)
    this.branchMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    this.branchMesh.frustumCulled = false
    this.branchMesh.count = 0

    this.attractors = blueprint.createAttractors()
    this.nodeMesh = new THREE.InstancedMesh(this.nodeGeometry, this.nodeMaterial, this.attractors.length)
    this.nodeMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    this.nodeMesh.frustumCulled = false

    this.group.add(this.branchMesh, this.nodeMesh)
    parent.add(this.group)

    this.reset()
  }

  pulse = () => {
    if ((!this.hasDormantAttractors() && !this.hasArmedAttractors()) || this.segments.length >= this.blueprint.maxSegments - this.blueprint.maxNewPerStep) {
      this.reset()
    }

    const selected = this.blueprint.selectTargets(this.attractors, this.pulseIndex)
      .filter(index => this.attractors[index]?.state === 'dormant')

    const armed = selected.length ? selected : fallbackDormant(this.attractors, 8)
    for (const index of armed) {
      const attractor = this.attractors[index]
      if (attractor.state !== 'dormant') continue
      attractor.state = 'armed'
      attractor.energy = 1.2
    }

    this.pendingSteps = Math.min(this.pendingSteps + this.blueprint.stepsPerPulse, this.blueprint.stepsPerPulse * 4)
    this.activity = 1
    this.completionDelay = 0
    this.pulseIndex += 1

    this.spawnPulseBursts(Math.min(3, 1 + Math.floor(armed.length / 4)))
  }

  tick = (dt: number, elapsed: number) => {
    this.activity = Math.max(0, this.activity - dt * 0.46)
    this.updateAttractors(elapsed, dt)
    this.advanceGrowth(dt)
    this.updatePulses(dt, elapsed)
    this.updateBranchInstances()
    this.updateNodeInstances(elapsed)

    if (!this.hasDormantAttractors() && !this.hasArmedAttractors()) {
      this.completionDelay += dt
      if (this.completionDelay > 2.6) {
        this.reset()
        this.pulse()
      }
    } else {
      this.completionDelay = 0
    }
  }

  dispose = () => {
    this.clearPulses()
    this.group.removeFromParent()
    this.branchGeometry.dispose()
    this.branchMaterial.dispose()
    this.nodeGeometry.dispose()
    this.nodeMaterial.dispose()
    this.glowTexture.dispose()
  }

  private reset() {
    this.clearPulses()
    this.nodes = []
    this.segments = []
    this.segmentIndexByNode = []
    this.activity = 0
    this.pendingSteps = 0
    this.stepAccumulator = 0
    this.completionDelay = 0
    this.pulseIndex = 0

    for (const attractor of this.attractors) {
      attractor.position.copy(attractor.home)
      attractor.state = 'dormant'
      attractor.energy = 0
      attractor.carrierNode = null
    }

    this.nodes.push({
      position: ROOT.clone(),
      parent: null,
      depth: 0,
      radius: this.blueprint.rootRadius,
    })
    this.segmentIndexByNode[0] = -1

    for (const direction of this.blueprint.seedDirections) {
      TMP_A.copy(direction).normalize()
      const length = this.blueprint.stepLength * 1.05
      const position = ROOT.clone().addScaledVector(TMP_A, length)
      this.addNode(0, position, 1)
    }

    this.updateBranchInstances()
    this.updateNodeInstances(0)
  }

  private updateAttractors(elapsed: number, dt: number) {
    for (const attractor of this.attractors) {
      attractor.energy = Math.max(0, attractor.energy - dt * 0.72)

      const stateBoost = attractor.state === 'captured' ? 0.18 : attractor.state === 'armed' ? 0.42 : 0.1
      const drift = Math.sin(elapsed * attractor.driftFrequency + attractor.phase) * attractor.driftAmplitude * this.blueprint.drift * (stateBoost + attractor.energy * 0.3)

      attractor.position.copy(attractor.home).addScaledVector(attractor.normal, drift)
    }
  }

  private advanceGrowth(dt: number) {
    const activeRate = 18
    const passiveRate = this.hasArmedAttractors() ? 3.2 : 0
    const growthRate = this.pendingSteps > 0 ? activeRate : passiveRate
    if (growthRate <= 0) return

    this.stepAccumulator += dt * growthRate
    while (this.stepAccumulator >= 1) {
      this.stepAccumulator -= 1
      const grew = this.growOneStep()
      if (this.pendingSteps > 0) this.pendingSteps -= 1
      if (!grew) {
        this.pendingSteps = 0
        this.stepAccumulator = 0
        break
      }
    }
  }

  private growOneStep() {
    const influenceDistanceSq = this.blueprint.influenceDistance * this.blueprint.influenceDistance
    const killDistanceSq = this.blueprint.killDistance * this.blueprint.killDistance
    const directions = new Map<number, THREE.Vector3>()
    const counts = new Map<number, number>()

    for (const attractor of this.attractors) {
      if (attractor.state !== 'armed') continue

      let nearestNode = -1
      let bestDistanceSq = influenceDistanceSq

      for (let nodeIndex = 0; nodeIndex < this.nodes.length; nodeIndex++) {
        const node = this.nodes[nodeIndex]
        const distanceSq = node.position.distanceToSquared(attractor.position)
        if (distanceSq < bestDistanceSq) {
          bestDistanceSq = distanceSq
          nearestNode = nodeIndex
        }
      }

      if (nearestNode < 0) continue

      const node = this.nodes[nearestNode]
      TMP_A.copy(attractor.position).sub(node.position)
      if (TMP_A.lengthSq() < 0.0001) continue
      TMP_A.normalize()

      let accumulator = directions.get(nearestNode)
      if (!accumulator) {
        accumulator = new THREE.Vector3()
        directions.set(nearestNode, accumulator)
      }
      accumulator.add(TMP_A)
      counts.set(nearestNode, (counts.get(nearestNode) ?? 0) + 1)
    }

    if (!directions.size) return false

    const orderedNodes = [...directions.keys()].sort((a, b) => (counts.get(b) ?? 0) - (counts.get(a) ?? 0))
    const newNodeIndices: number[] = []

    for (const nodeIndex of orderedNodes.slice(0, this.blueprint.maxNewPerStep)) {
      if (this.segments.length >= this.blueprint.maxSegments) break

      const node = this.nodes[nodeIndex]
      const direction = directions.get(nodeIndex)
      if (!direction) continue

      TMP_A.copy(direction).add(this.blueprint.bias)
      if (TMP_A.lengthSq() < 0.0001) continue
      TMP_A.normalize()
      TMP_B.copy(node.position).addScaledVector(TMP_A, this.blueprint.stepLength)

      if (!this.isPositionAvailable(TMP_B)) continue

      const childIndex = this.addNode(nodeIndex, TMP_B, node.depth + 1)
      newNodeIndices.push(childIndex)
    }

    if (!newNodeIndices.length) return false

    const capturedNodes: number[] = []

    for (const attractor of this.attractors) {
      if (attractor.state !== 'armed') continue

      for (const nodeIndex of newNodeIndices) {
        const node = this.nodes[nodeIndex]
        if (node.position.distanceToSquared(attractor.position) > killDistanceSq) continue
        attractor.state = 'captured'
        attractor.energy = 1.35
        attractor.carrierNode = nodeIndex
        capturedNodes.push(nodeIndex)
        break
      }
    }

    if (capturedNodes.length) {
      this.spawnPulseTo(capturedNodes[capturedNodes.length - 1])
    }

    return true
  }

  private isPositionAvailable(position: THREE.Vector3) {
    const minDistanceSq = (this.blueprint.stepLength * 0.58) * (this.blueprint.stepLength * 0.58)

    for (const node of this.nodes) {
      if (node.position.distanceToSquared(position) < minDistanceSq) return false
    }

    return true
  }

  private addNode(parentIndex: number, position: THREE.Vector3, depth: number) {
    const parent = this.nodes[parentIndex]
    const nodeIndex = this.nodes.length
    const radius = Math.max(this.blueprint.tipRadius, parent.radius * 0.9)

    this.nodes.push({
      position: position.clone(),
      parent: parentIndex,
      depth,
      radius,
    })

    this.segments.push({
      startNode: parentIndex,
      endNode: nodeIndex,
      radius: Math.max(this.blueprint.tipRadius, radius * 0.92),
      glow: 1.18,
    })
    this.segmentIndexByNode[nodeIndex] = this.segments.length - 1

    return nodeIndex
  }

  private updatePulses(dt: number, elapsed: number) {
    for (const segment of this.segments) {
      segment.glow = Math.max(0, segment.glow - dt * 0.82)
    }

    for (let index = this.pulses.length - 1; index >= 0; index--) {
      const pulse = this.pulses[index]
      pulse.distance += dt * pulse.speed

      if (pulse.distance >= pulse.totalDistance) {
        this.removePulse(index)
        continue
      }

      let segmentIndex = 0
      while (segmentIndex < pulse.distances.length - 1 && pulse.distances[segmentIndex + 1] < pulse.distance) {
        segmentIndex += 1
      }

      const startDistance = pulse.distances[segmentIndex]
      const endDistance = pulse.distances[segmentIndex + 1]
      const localT = THREE.MathUtils.clamp((pulse.distance - startDistance) / Math.max(0.0001, endDistance - startDistance), 0, 1)
      const startNode = this.nodes[pulse.path[segmentIndex]]
      const endNode = this.nodes[pulse.path[segmentIndex + 1]]

      pulse.sprite.position.lerpVectors(startNode.position, endNode.position, localT)
      pulse.sprite.scale.setScalar(2.2 + Math.sin(elapsed * 8 + segmentIndex) * 0.25 + this.activity * 0.4)
      pulse.material.opacity = 0.8 + this.activity * 0.18

      const branchIndex = this.segmentIndexByNode[pulse.path[segmentIndex + 1]]
      if (branchIndex >= 0) {
        this.segments[branchIndex].glow = Math.max(this.segments[branchIndex].glow, 1.25)
      }
    }
  }

  private updateBranchInstances() {
    this.branchMesh.count = this.segments.length

    for (let index = 0; index < this.segments.length; index++) {
      const segment = this.segments[index]
      const start = this.nodes[segment.startNode].position
      const end = this.nodes[segment.endNode].position

      TMP_A.copy(end).sub(start)
      const length = TMP_A.length()
      if (length < 0.0001) continue

      TMP_A.normalize()
      DUMMY.position.copy(start).lerp(end, 0.5)
      DUMMY.quaternion.setFromUnitVectors(UP, TMP_A)

      const thickness = segment.radius * (1 + segment.glow * 0.3)
      DUMMY.scale.set(thickness, length, thickness)
      DUMMY.updateMatrix()
      this.branchMesh.setMatrixAt(index, DUMMY.matrix)

      TMP_COLOR.copy(this.branchBaseColor).lerp(WHITE, 0.08 + Math.min(segment.glow, 1.4) * 0.34)
      this.branchMesh.setColorAt(index, TMP_COLOR)
    }

    this.branchMesh.instanceMatrix.needsUpdate = true
    if (this.branchMesh.instanceColor) this.branchMesh.instanceColor.needsUpdate = true
  }

  private updateNodeInstances(elapsed: number) {
    for (let index = 0; index < this.attractors.length; index++) {
      const attractor = this.attractors[index]

      const stateScale = attractor.state === 'captured'
        ? 1.12
        : attractor.state === 'armed'
          ? 0.96
          : 0.72
      const pulseScale = 1 + attractor.energy * 0.4 + Math.sin(elapsed * attractor.driftFrequency + attractor.phase) * 0.04
      const scale = this.blueprint.nodeScale * stateScale * pulseScale

      DUMMY.position.copy(attractor.position)
      DUMMY.quaternion.identity()
      DUMMY.scale.setScalar(scale)
      DUMMY.updateMatrix()
      this.nodeMesh.setMatrixAt(index, DUMMY.matrix)

      if (attractor.state === 'captured') {
        TMP_COLOR.copy(this.accentColor).lerp(WHITE, 0.32 + attractor.energy * 0.14)
      } else if (attractor.state === 'armed') {
        TMP_COLOR.copy(this.accentColor).lerp(WHITE, 0.16 + attractor.energy * 0.1)
      } else {
        TMP_COLOR.copy(this.dormantColor).lerp(this.accentColor, 0.08)
      }

      this.nodeMesh.setColorAt(index, TMP_COLOR)
    }

    this.nodeMesh.instanceMatrix.needsUpdate = true
    if (this.nodeMesh.instanceColor) this.nodeMesh.instanceColor.needsUpdate = true
  }

  private spawnPulseBursts(count: number) {
    const candidates = this.attractors.filter(attractor => attractor.state === 'captured' && attractor.carrierNode !== null)
    if (!candidates.length) return

    for (let index = 0; index < count; index++) {
      const attractor = candidates[Math.floor(Math.random() * candidates.length)]
      if (attractor.carrierNode === null) continue
      this.spawnPulseTo(attractor.carrierNode)
    }
  }

  private spawnPulseTo(nodeIndex: number) {
    if (nodeIndex <= 0 || this.pulses.length >= 8) return

    const path: number[] = []
    let current: number | null = nodeIndex
    while (current !== null) {
      path.unshift(current)
      current = this.nodes[current].parent
    }

    if (path.length < 2) return

    const distances = [0]
    let totalDistance = 0
    for (let index = 1; index < path.length; index++) {
      const start = this.nodes[path[index - 1]].position
      const end = this.nodes[path[index]].position
      totalDistance += start.distanceTo(end)
      distances.push(totalDistance)
    }

    const material = new THREE.SpriteMaterial({
      map: this.glowTexture,
      color: WHITE,
      transparent: true,
      opacity: 0.92,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    const sprite = new THREE.Sprite(material)
    sprite.frustumCulled = false
    sprite.position.copy(this.nodes[path[0]].position)
    sprite.scale.setScalar(2.4)
    this.group.add(sprite)

    this.pulses.push({
      path,
      distances,
      totalDistance,
      distance: 0,
      speed: 24 + Math.random() * 10,
      sprite,
      material,
    })
  }

  private removePulse(index: number) {
    const pulse = this.pulses[index]
    if (!pulse) return
    pulse.sprite.removeFromParent()
    pulse.material.dispose()
    this.pulses.splice(index, 1)
  }

  private clearPulses() {
    for (let index = this.pulses.length - 1; index >= 0; index--) {
      this.removePulse(index)
    }
  }

  private hasDormantAttractors() {
    return this.attractors.some(attractor => attractor.state === 'dormant')
  }

  private hasArmedAttractors() {
    return this.attractors.some(attractor => attractor.state === 'armed')
  }
}

function makeVariation(blueprint: VariationBlueprint): ColonizationVariation {
  return {
    name: blueprint.name,
    accent: blueprint.accent,
    layout: blueprint.layout,
    eventModel: blueprint.eventModel,
    useCase: blueprint.useCase,
    description: blueprint.description,
    build(group) {
      return new ColonizationField(group, blueprint)
    },
  }
}

export const COLONIZATION_VARIATIONS: ColonizationVariation[] = [
  makeVariation({
    name: 'Pocket Canopy',
    accent: '#7ec8ff',
    layout: 'dome cluster',
    eventModel: 'arm a local neighborhood per event',
    useCase: 'compact session burst around a selected cluster',
    description: 'Closest to the live-node use case: each event wakes a nearby pocket of nodes, and the scaffold grows the smallest readable canopy that still feels organic.',
    influenceDistance: 24,
    killDistance: 4.8,
    stepLength: 3.3,
    stepsPerPulse: 12,
    maxNewPerStep: 5,
    maxSegments: 320,
    rootRadius: 1.18,
    tipRadius: 0.22,
    nodeScale: 0.92,
    drift: 1.05,
    bias: new THREE.Vector3(0, 0.18, 0),
    seedDirections: radialSeeds(5, 0.9, 0.15),
    createAttractors: buildPocketCanopyAttractors,
    selectTargets: selectPocketBurst,
  }),
  makeVariation({
    name: 'Ribbon Fan',
    accent: '#67ddff',
    layout: 'flattened 2.5D fan',
    eventModel: 'events paint narrow sweep bands',
    useCase: 'sidebar card, minimap, or inspector-scale activity view',
    description: 'Same SCA core, but flattened into a shallow fan so you get branching legibility without spending much screen depth.',
    influenceDistance: 22,
    killDistance: 4.4,
    stepLength: 3.2,
    stepsPerPulse: 11,
    maxNewPerStep: 4,
    maxSegments: 280,
    rootRadius: 1.08,
    tipRadius: 0.2,
    nodeScale: 0.84,
    drift: 0.82,
    bias: new THREE.Vector3(0, 0.1, 0),
    seedDirections: radialSeeds(5, 0.55, 0, Math.PI * 1.05),
    createAttractors: buildRibbonFanAttractors,
    selectTargets: selectRibbonSweep,
  }),
  makeVariation({
    name: 'Split Relay',
    accent: '#a9a0ff',
    layout: 'dual semantic lobes',
    eventModel: 'alternate between left and right node groups',
    useCase: 'tool-vs-agent, request-vs-response, or two-channel routing',
    description: 'Useful when your node field already has two semantic camps. Each event pulls the scaffold into one side, so the branching itself explains the grouping.',
    influenceDistance: 25,
    killDistance: 4.7,
    stepLength: 3.4,
    stepsPerPulse: 12,
    maxNewPerStep: 5,
    maxSegments: 320,
    rootRadius: 1.14,
    tipRadius: 0.22,
    nodeScale: 0.88,
    drift: 0.95,
    bias: new THREE.Vector3(0, 0.14, 0),
    seedDirections: radialSeeds(6, 0.5, Math.PI * 0.2),
    createAttractors: buildSplitRelayAttractors,
    selectTargets: selectSplitRelay,
  }),
  makeVariation({
    name: 'Halo Wreath',
    accent: '#7cf3e2',
    layout: 'orbital ring',
    eventModel: 'wake a moving arc around a focus target',
    useCase: 'selection halo, focus ring, or surround-state animation',
    description: 'A good fit when the animation should stay compact around one node or cluster. Events wake only one arc, so the ring reads like intent instead of noise.',
    influenceDistance: 27,
    killDistance: 4.5,
    stepLength: 3.25,
    stepsPerPulse: 13,
    maxNewPerStep: 5,
    maxSegments: 340,
    rootRadius: 1.12,
    tipRadius: 0.2,
    nodeScale: 0.86,
    drift: 0.9,
    bias: new THREE.Vector3(0, 0.04, 0),
    seedDirections: radialSeeds(7, 0.22),
    createAttractors: buildHaloWreathAttractors,
    selectTargets: selectHaloArc,
  }),
  makeVariation({
    name: 'Signal Stack',
    accent: '#ffb48e',
    layout: 'layered vertical tiers',
    eventModel: 'events climb through stacked bands',
    useCase: 'compact timeline or event ladder with branching memory',
    description: 'This keeps the same attractor logic but turns it into a vertical meter. The result reads more like a time stack than a cloud, while still branching naturally.',
    influenceDistance: 21,
    killDistance: 4.2,
    stepLength: 3.15,
    stepsPerPulse: 10,
    maxNewPerStep: 4,
    maxSegments: 280,
    rootRadius: 1.12,
    tipRadius: 0.2,
    nodeScale: 0.82,
    drift: 1.08,
    bias: new THREE.Vector3(0, 0.26, 0),
    seedDirections: [
      new THREE.Vector3(0, 1, 0).normalize(),
      new THREE.Vector3(0.28, 0.96, 0.08).normalize(),
      new THREE.Vector3(-0.28, 0.96, -0.08).normalize(),
      new THREE.Vector3(0.18, 0.92, -0.22).normalize(),
    ],
    createAttractors: buildSignalStackAttractors,
    selectTargets: selectSignalLayer,
  }),
]
