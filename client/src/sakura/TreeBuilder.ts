import * as THREE from 'three'
import type { BlossomAnchor, TreeBranch, TreeLayout, TreeNode, ProjectTreeNode } from './types'

const GROUND_PATH = '__ground__'

function hashString(value: string): number {
  let hash = 2166136261
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function makeRandom(seed: string) {
  let state = hashString(seed) || 1
  return () => {
    state |= 0
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function rand(rng: () => number, min: number, max: number): number {
  return min + (max - min) * rng()
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function makeBasis(direction: THREE.Vector3) {
  const up = Math.abs(direction.y) > 0.92 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0)
  const u = new THREE.Vector3().crossVectors(direction, up).normalize()
  const v = new THREE.Vector3().crossVectors(u, direction).normalize()
  return { u, v }
}

function measureSubtree(node: ProjectTreeNode, weights: Map<string, number>): number {
  if (node.type === 'file') {
    weights.set(node.path, 1)
    return 1
  }

  const children = node.children ?? []
  let total = 1
  for (const child of children) total += measureSubtree(child, weights)
  const weight = Math.max(1.4, total)
  weights.set(node.path, weight)
  return weight
}

function orderedChildren(children: ProjectTreeNode[], seedKey: string) {
  return [...children].sort((a, b) => {
    if (a.type !== b.type) return a.type === 'folder' ? -1 : 1
    return hashString(`${seedKey}:${a.path}`) - hashString(`${seedKey}:${b.path}`)
  })
}

function branchRadius(
  depth: number,
  branchType: 'root' | 'folder' | 'file',
  subtreeWeight: number,
  rootWeight: number,
  syntheticRoot = false,
) {
  if (syntheticRoot || branchType === 'root') {
    return clamp(3.6 + Math.log1p(rootWeight) * 0.42, 3.8, 6.8)
  }

  const weightFactor = Math.pow(subtreeWeight / Math.max(rootWeight, 1), 0.42)
  if (branchType === 'folder') {
    return clamp(0.34 + weightFactor * 3.3 * Math.pow(0.86, depth), 0.24, 3.6)
  }
  return clamp(0.1 + weightFactor * 0.95 * Math.pow(0.78, depth), 0.08, 0.46)
}

function branchLength(
  depth: number,
  branchType: 'root' | 'folder' | 'file',
  subtreeWeight: number,
  rootWeight: number,
  rng: () => number,
  syntheticRoot = false,
) {
  if (syntheticRoot || branchType === 'root') {
    return clamp(28 + Math.log1p(rootWeight) * 2.8 + rand(rng, 0, 3.5), 28, 42)
  }

  const weightFactor = Math.pow(subtreeWeight / Math.max(rootWeight, 1), 0.36)
  if (branchType === 'folder') {
    return clamp(16 * Math.pow(0.9, depth) + weightFactor * 18 + rand(rng, 1, 5), 9, 36)
  }
  return clamp(7 * Math.pow(0.88, depth) + weightFactor * 4.8 + rand(rng, 0.8, 2.2), 4, 12)
}

export function buildTreeLayout(tree: ProjectTreeNode, seedKey: string): TreeLayout {
  const weights = new Map<string, number>()
  const rootWeight = measureSubtree(tree, weights)
  const nodes = new Map<string, TreeNode>()
  const branches: TreeBranch[] = []
  const tipPaths: string[] = []
  const blossomAnchors = new Map<string, BlossomAnchor>()
  let maxDepth = 0

  const leanRng = makeRandom(`${seedKey}:lean`)
  const leanAngle = rand(leanRng, 0, Math.PI * 2)
  const leanStrength = rand(leanRng, 0.07, 0.18)
  const lean = new THREE.Vector3(Math.cos(leanAngle) * leanStrength, 0, Math.sin(leanAngle) * leanStrength)
  const trunkDirection = new THREE.Vector3(lean.x, 1, lean.z).normalize()

  const trunkRng = makeRandom(`${seedKey}:trunk`)
  const trunkLength = branchLength(0, 'root', rootWeight, rootWeight, trunkRng, true)
  const groundPosition = new THREE.Vector3(0, 0, 0)
  const rootPosition = groundPosition.clone().add(trunkDirection.clone().multiplyScalar(trunkLength))
  const rootBranchId = `${GROUND_PATH}->${tree.path}`
  const rootCtrl1 = groundPosition.clone()
    .lerp(rootPosition, 0.32)
    .add(new THREE.Vector3(lean.x * 12, 4.5, lean.z * 12))
  const rootCtrl2 = groundPosition.clone()
    .lerp(rootPosition, 0.74)
    .add(new THREE.Vector3(lean.x * 18, 2.2, lean.z * 18))

  branches.push({
    id: rootBranchId,
    fromPath: GROUND_PATH,
    toPath: tree.path,
    curvePoints: [groundPosition.clone(), rootCtrl1, rootCtrl2, rootPosition.clone()],
    depth: 0,
    radius: branchRadius(0, 'root', rootWeight, rootWeight, true),
    subtreeWeight: rootWeight,
    branchType: 'root',
    isSyntheticRoot: true,
  })

  function walk(
    current: ProjectTreeNode,
    parentPath: string | null,
    position: THREE.Vector3,
    direction: THREE.Vector3,
    depth: number,
    parentBranchId: string | null,
  ) {
    maxDepth = Math.max(maxDepth, depth)
    const subtreeWeight = weights.get(current.path) ?? 1
    const childPaths: string[] = []
    nodes.set(current.path, {
      id: current.id,
      path: current.path,
      type: current.type,
      depth,
      position: position.clone(),
      parentPath,
      children: childPaths,
      branchId: parentBranchId,
      subtreeWeight,
    })

    if (current.type === 'file') {
      tipPaths.push(current.path)
      blossomAnchors.set(current.path, {
        path: current.path,
        position: position.clone(),
        direction: direction.clone().normalize(),
        depth,
        scale: clamp(1.02 - depth * 0.05, 0.42, 1.02),
      })
      return
    }

    const children = orderedChildren(current.children ?? [], `${seedKey}:${current.path}`)
    if (!children.length) return

    const basis = makeBasis(direction)
    const canopy = clamp((depth + 1) / 6, 0, 1)

    children.forEach((child, index) => {
      const rng = makeRandom(`${seedKey}:${child.path}`)
      const childWeight = weights.get(child.path) ?? 1
      const weightFactor = Math.pow(childWeight / Math.max(rootWeight, 1), 0.34)
      // Radial arrangement — children circle around parent branch axis
      const angleBase = (index / Math.max(children.length, 1)) * Math.PI * 2
      const angleJitter = rand(rng, -0.4, 0.4)
      const childAngle = angleBase + angleJitter
      const spread = THREE.MathUtils.lerp(0.4, 1.6, canopy) + weightFactor * 0.3
      const radialU = Math.cos(childAngle) * spread
      const radialV = Math.sin(childAngle) * spread
      const upward = child.type === 'folder'
        ? THREE.MathUtils.lerp(0.85, 0.1, canopy)
        : THREE.MathUtils.lerp(0.4, -0.15, canopy)
      const continuation = depth === 0 ? 0.92 : depth < 2 ? 0.65 : 0.4
      const droop = child.type === 'folder'
        ? clamp((depth - 1) * 0.06, 0, 0.22)
        : clamp(0.1 + depth * 0.07, 0.1, 0.45)

      const childDirection = direction.clone()
        .multiplyScalar(continuation + weightFactor * 0.28)
        .add(new THREE.Vector3(0, 1, 0).multiplyScalar(upward))
        .add(basis.u.clone().multiplyScalar(radialU))
        .add(basis.v.clone().multiplyScalar(radialV))
        .add(lean.clone().multiplyScalar(0.12 + canopy * 0.18))
        .add(new THREE.Vector3(0, -1, 0).multiplyScalar(droop))
        .normalize()

      const branchType = child.type === 'folder' ? 'folder' : 'file'
      const length = branchLength(depth + 1, branchType, childWeight, rootWeight, rng)
      const childPosition = position.clone().add(childDirection.clone().multiplyScalar(length))
      const bend = (branchType === 'folder' ? 5.2 : 2.7) * (0.94 + canopy * 0.55)
      const ctrl1 = position.clone()
        .lerp(childPosition, 0.28)
        .add(new THREE.Vector3(0, upward * bend * 0.68, 0))
        .add(basis.u.clone().multiplyScalar(radialU * bend * 0.3))
        .add(basis.v.clone().multiplyScalar(radialV * bend * 0.3))
        .add(lean.clone().multiplyScalar(bend * 0.3))
      const ctrl2 = position.clone()
        .lerp(childPosition, 0.74)
        .add(basis.u.clone().multiplyScalar(radialU * bend * 0.15))
        .add(basis.v.clone().multiplyScalar(radialV * bend * 0.15))
        .add(new THREE.Vector3(0, branchType === 'folder' ? bend * 0.16 : -bend * 0.08, 0))

      const branchId = `${current.path}->${child.path}`
      childPaths.push(child.path)
      branches.push({
        id: branchId,
        fromPath: current.path,
        toPath: child.path,
        curvePoints: [position.clone(), ctrl1, ctrl2, childPosition.clone()],
        depth: depth + 1,
        radius: branchRadius(depth + 1, branchType, childWeight, rootWeight),
        subtreeWeight: childWeight,
        branchType,
      })

      walk(child, current.path, childPosition, childDirection, depth + 1, branchId)
    })
  }

  walk(tree, null, rootPosition, trunkDirection, 0, rootBranchId)

  return { nodes, branches, tipPaths, maxDepth, blossomAnchors }
}

function normalizeSegments(rawPath: string): string | null {
  const parts: string[] = []
  for (const segment of rawPath.replace(/\\/g, '/').split('/')) {
    if (!segment || segment === '.') continue
    if (segment === '..') {
      if (!parts.length) return null
      parts.pop()
      continue
    }
    parts.push(segment)
  }
  return parts.join('/')
}

export function normalizeProjectPath(rootPath: string, candidate: unknown): string | null {
  if (typeof candidate !== 'string' || !candidate.trim()) return null
  const root = rootPath.replace(/\\/g, '/').replace(/\/+$/, '')
  const value = candidate.replace(/\\/g, '/')

  if (value === root) return '.'
  if (value.startsWith(`${root}/`)) return normalizeSegments(value.slice(root.length + 1)) || '.'
  if (value.startsWith('/')) return null
  return normalizeSegments(value.replace(/^\.\//, '')) || '.'
}

export function branchChainForPath(layout: TreeLayout, targetPath: string): string[] {
  const chain: string[] = []
  let current = layout.nodes.get(targetPath)
  while (current && current.branchId) {
    chain.push(current.branchId)
    current = current.parentPath ? layout.nodes.get(current.parentPath) : undefined
  }
  return chain.reverse()
}

export function collectDescendantTips(layout: TreeLayout, startPath: string, limit = 12): string[] {
  const start = layout.nodes.get(startPath)
  if (!start) return []
  if (start.type === 'file') return [start.path]

  const queue = [...start.children]
  const tips: string[] = []
  while (queue.length > 0 && tips.length < limit) {
    const nextPath = queue.shift()!
    const node = layout.nodes.get(nextPath)
    if (!node) continue
    if (node.type === 'file') {
      tips.push(node.path)
    } else {
      queue.push(...node.children)
    }
  }
  return tips
}

export function pickSampleTips(layout: TreeLayout, seedKey: string, count: number): string[] {
  if (layout.tipPaths.length <= count) return [...layout.tipPaths]
  const rng = makeRandom(seedKey)
  const pool = [...layout.tipPaths]
  const picks: string[] = []
  while (pool.length > 0 && picks.length < count) {
    const index = Math.floor(rng() * pool.length)
    picks.push(pool.splice(index, 1)[0])
  }
  return picks
}

export function layoutRootPath(layout: TreeLayout): string {
  return layout.branches.find(b => b.isSyntheticRoot)?.toPath ?? '.'
}

export function closestKnownPath(layout: TreeLayout, inputPath: string | null): string | null {
  if (inputPath === null) return null
  const root = layoutRootPath(layout)

  // Walk up path segments checking layout.nodes
  const segments = inputPath.replace(/\\/g, '/').split('/')
  for (let len = segments.length; len > 0; len--) {
    const candidate = segments.slice(0, len).join('/')
    if (layout.nodes.has(candidate)) return candidate
  }

  // Fall back to root
  return layout.nodes.has(root) ? root : null
}
