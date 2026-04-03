import * as THREE from 'three'
import barkVertSource from './shaders/bark.vert.glsl?raw'
import barkFragSource from './shaders/bark.frag.glsl?raw'
import type { TreeBranch, TreeLayout, TreeNode, BranchVisual, JunctionVisual } from './types'

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
    const segments = Math.max(10, Math.min(28, 24 - spec.depth * 2))
    const geometry = new THREE.TubeGeometry(curve, segments, spec.radius, 8, false)
    const material = makeBarkMaterial(hashUnit(spec.id))
    material.uniforms.uDepth.value = spec.depth
    const mesh = new THREE.Mesh(geometry, material)
    mesh.renderOrder = 2
    group.add(mesh)

    branches.set(spec.id, {
      spec,
      mesh,
      material,
      curve,
      pulse: 0,
      contamination: 0,
      pulseColor: new THREE.Color('#e8a88a'),
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
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(collarRadius, 12, 12), material)
    mesh.position.copy(node.position)
    mesh.renderOrder = 3
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
