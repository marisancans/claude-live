import * as THREE from 'three'
import barkVertSource from './shaders/bark.vert.glsl?raw'
import barkFragSource from './shaders/bark.frag.glsl?raw'
import type { TreeBranch, TreeLayout, TreeNode, BranchVisual, JunctionVisual } from './types'

function createBarkNormalMap(): THREE.CanvasTexture {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  // Base flat normal (128, 128, 255)
  ctx.fillStyle = 'rgb(128,128,255)'
  ctx.fillRect(0, 0, size, size)

  // Vertical grain grooves via sin waves
  const imageData = ctx.getImageData(0, 0, size, size)
  const data = imageData.data
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4
      // sin-wave grain along vertical axis
      const grain = Math.sin((x / size) * Math.PI * 24) * 0.5
        + Math.sin((x / size) * Math.PI * 7 + 0.8) * 0.25
      // Perturb X normal channel
      data[idx] = Math.round(128 + grain * 30)     // R → normal X
      data[idx + 1] = 128                            // G → normal Y (flat)
      data[idx + 2] = 255                            // B → normal Z (up)
      data[idx + 3] = 255
    }
  }

  // Horizontal lenticel bumps — 12 random
  const rng = (seed: number) => {
    let s = seed
    return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 0xffffffff }
  }
  const rand = rng(42)
  for (let i = 0; i < 12; i++) {
    const cx = Math.floor(rand() * size)
    const cy = Math.floor(rand() * size)
    const hw = Math.floor(20 + rand() * 30) // half-width
    const hh = Math.floor(3 + rand() * 5)   // half-height
    for (let dy = -hh; dy <= hh; dy++) {
      for (let dx = -hw; dx <= hw; dx++) {
        const px = (cx + dx + size) % size
        const py = (cy + dy + size) % size
        const t = 1 - Math.sqrt((dx / hw) ** 2 + (dy / hh) ** 2)
        if (t <= 0) continue
        const idx = (py * size + px) * 4
        // Bump normal: push Y outward
        const bump = Math.sin(t * Math.PI) * 40
        data[idx + 1] = Math.min(255, Math.round(data[idx + 1] + bump))
      }
    }
  }

  ctx.putImageData(imageData, 0, 0)

  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(2, 4)
  tex.needsUpdate = true
  return tex
}

let _barkNormalMap: THREE.CanvasTexture | null = null
function getBarkNormalMap(): THREE.CanvasTexture {
  if (!_barkNormalMap) _barkNormalMap = createBarkNormalMap()
  return _barkNormalMap
}

function hashUnit(value: string): number {
  let hash = 2166136261
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return (hash >>> 0) / 4294967296
}

function clamp(v: number, lo: number, hi: number) { return Math.min(hi, Math.max(lo, v)) }

export function makeBarkMaterial(flowOffset: number): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uHeat: { value: 0 },
      uPulse: { value: 0 },
      uContam: { value: 0 },
      uPulseColor: { value: new THREE.Color('#e8a88a') },
      uFlowOffset: { value: flowOffset },
      uWindStrength: { value: 0 },
      uWindPhase: { value: 0 },
      uSignalPos: { value: -1 },
      uSignalIntensity: { value: 0 },
      uSignalColor: { value: new THREE.Color('#ffffff') },
      uDepth: { value: 0 },
      uNormalMap: { value: getBarkNormalMap() },
      uNormalScale: { value: 0.3 },
    },
    vertexShader: barkVertSource,
    fragmentShader: barkFragSource,
    transparent: false,
    depthWrite: true,
    side: THREE.DoubleSide,
    blending: THREE.NormalBlending,
  })
}

function curveFromPoints(points: THREE.Vector3[]): THREE.CatmullRomCurve3 {
  return new THREE.CatmullRomCurve3(points.map(p => p.clone()), false, 'catmullrom', 0.45)
}

export function buildBranches(
  layout: TreeLayout,
  group: THREE.Group,
): { branches: Map<string, BranchVisual>; junctions: JunctionVisual[] } {
  const branches = new Map<string, BranchVisual>()

  for (const spec of layout.branches) {
    const curve = curveFromPoints(spec.curvePoints)
    const segments = Math.max(14, Math.min(36, 30 - spec.depth * 2))
    const radialSegments = spec.depth <= 1 ? 14 : spec.depth <= 3 ? 12 : 8
    const geometry = new THREE.TubeGeometry(curve, segments, spec.radius, radialSegments, false)
    const material = makeBarkMaterial(hashUnit(spec.id))
    material.uniforms.uDepth.value = spec.depth
    const mesh = new THREE.Mesh(geometry, material)
    mesh.renderOrder = 2
    mesh.castShadow = true
    group.add(mesh)

    branches.set(spec.id, {
      spec,
      mesh,
      material,
      curve,
      pulse: 0,
      contamination: 0,
      pulseColor: new THREE.Color('#e8a88a'),
      growthProgress: 1,
      growthTarget: 1,
      growthStartTime: 0,
      growthDuration: 0,
    })
  }

  // Junction collars — spheres at folder fork points
  const rootPath = layout.branches.find(b => b.isSyntheticRoot)?.toPath ?? '.'
  const rootWeight = layout.nodes.get(rootPath)?.subtreeWeight ?? 1
  const junctions: JunctionVisual[] = []

  for (const node of layout.nodes.values()) {
    if (node.type !== 'folder') continue
    const connectedBranchIds = new Set<string>()
    if (node.branchId) connectedBranchIds.add(node.branchId)
    for (const childPath of node.children) {
      const child = layout.nodes.get(childPath)
      if (child?.branchId) connectedBranchIds.add(child.branchId)
    }
    if (connectedBranchIds.size === 0) continue

    // Collar radius = max connecting branch radius * 1.15
    let maxRadius = 0
    for (const branchId of connectedBranchIds) {
      const branch = branches.get(branchId)
      if (branch) maxRadius = Math.max(maxRadius, branch.spec.radius)
    }
    const collarRadius = maxRadius * 1.15

    const material = makeBarkMaterial(hashUnit(`junction:${node.path}`))
    material.uniforms.uDepth.value = node.depth
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(collarRadius, 16, 16), material)
    mesh.position.copy(node.position)
    mesh.renderOrder = 3
    mesh.castShadow = true
    group.add(mesh)

    junctions.push({
      path: node.path,
      branchIds: [...connectedBranchIds],
      mesh,
      material,
    })
  }

  return { branches, junctions }
}

export function updateBranchUniforms(
  branches: Map<string, BranchVisual>,
  junctions: JunctionVisual[],
  elapsed: number,
  heat: number,
  colonyContam: number,
  windStrength: number,
  windPhase: number,
  dt: number,
) {
  for (const branch of branches.values()) {
    branch.pulse = Math.max(0, branch.pulse - dt * 1.65)
    branch.contamination = Math.max(0, branch.contamination - dt * 0.08)
    const branchHeat = clamp(
      heat * (branch.spec.branchType === 'root' ? 1.1 : 1.04 - branch.spec.depth * 0.06),
      0.05, 1,
    )
    const u = branch.material.uniforms
    u.uTime.value = elapsed
    u.uHeat.value = branchHeat
    u.uPulse.value = branch.pulse
    u.uContam.value = clamp(colonyContam * 0.45 + branch.contamination, 0, 1)
    u.uPulseColor.value.copy(branch.pulseColor)
    u.uWindStrength.value = windStrength * Math.min(2.0, branch.spec.depth * 0.3)
    u.uWindPhase.value = windPhase
  }

  for (const junction of junctions) {
    let pulse = 0
    let contamination = 0
    const pulseColor = new THREE.Color('#e8a88a')
    for (const branchId of junction.branchIds) {
      const connected = branches.get(branchId)
      if (!connected) continue
      if (connected.pulse >= pulse) {
        pulse = connected.pulse
        pulseColor.copy(connected.pulseColor)
      }
      contamination = Math.max(contamination, connected.contamination)
    }
    const u = junction.material.uniforms
    u.uTime.value = elapsed + hashUnit(junction.path)
    u.uHeat.value = clamp(heat * 1.04 + pulse * 0.16, 0.08, 1)
    u.uPulse.value = pulse * 0.88
    u.uContam.value = clamp(colonyContam * 0.4 + contamination * 0.85, 0, 1)
    u.uPulseColor.value.copy(pulseColor)
    u.uWindStrength.value = windStrength * 0.2
    u.uWindPhase.value = windPhase
  }
}

export function disposeBranches(branches: Map<string, BranchVisual>, junctions: JunctionVisual[]) {
  for (const branch of branches.values()) {
    branch.mesh.geometry.dispose()
    branch.material.dispose()
  }
  for (const junction of junctions) {
    junction.mesh.geometry.dispose()
    junction.material.dispose()
  }
}
