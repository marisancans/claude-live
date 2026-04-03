import * as THREE from 'three'
import type { RawEvent } from '../types'

// --- Project data (from server API) ---

export interface ProjectSummary {
  id: string
  root: string
  label: string
  eventCount: number
  sessionCount: number
  lastEventTime: number
}

export interface ProjectTreeNode {
  id: string
  name: string
  path: string
  type: 'folder' | 'file'
  depth: number
  children?: ProjectTreeNode[]
}

export interface ProjectTreePayload {
  projectId: string
  rootPath: string
  label: string
  tree: ProjectTreeNode | null
  stats: {
    directories: number
    files: number
    totalNodes: number
    maxDepthReached: number
    truncated: boolean
  }
}

export interface ProjectActivity {
  eventCount: number
  sessionCount: number
  lastEventTime: number
  lastTool: string | null
}

export interface ProjectVisualState {
  project: ProjectSummary
  tree: ProjectTreePayload | null
  activity: ProjectActivity
}

export interface SignalEnvelope {
  sequence: number
  event: RawEvent
}

// --- Tree layout ---

export interface TreeNode {
  id: string
  path: string
  type: 'folder' | 'file'
  depth: number
  position: THREE.Vector3
  parentPath: string | null
  children: string[]
  branchId: string | null
  subtreeWeight: number
}

export interface BlossomAnchor {
  path: string
  position: THREE.Vector3
  direction: THREE.Vector3
  depth: number
  scale: number
}

export interface TreeBranch {
  id: string
  fromPath: string
  toPath: string
  curvePoints: THREE.Vector3[]
  depth: number
  radius: number
  subtreeWeight: number
  branchType: 'root' | 'folder' | 'file'
  isSyntheticRoot?: boolean
}

export interface TreeLayout {
  nodes: Map<string, TreeNode>
  branches: TreeBranch[]
  blossomAnchors: Map<string, BlossomAnchor>
  tipPaths: string[]
  maxDepth: number
}

// --- Visuals ---

export interface BranchVisual {
  spec: TreeBranch
  mesh: THREE.Mesh
  material: THREE.ShaderMaterial
  curve: THREE.CatmullRomCurve3
  pulse: number
  contamination: number
  pulseColor: THREE.Color
}

export interface JunctionVisual {
  path: string
  branchIds: string[]
  mesh: THREE.Mesh
  material: THREE.ShaderMaterial
}

export interface ColonyVisual {
  id: string
  rootPath: string
  signature: string
  group: THREE.Group
  activity: ProjectActivity
  layout: TreeLayout
  branches: Map<string, BranchVisual>
  junctions: JunctionVisual[]
  petalInstanceIds: number[]
  heat: number
  contamination: number
  boost: number
  idleOffset: number
}

// --- Debug panel ---

export interface HookDraft {
  session_id?: string
  hook_event_name?: string
  tool_name?: string | null
  tool_input?: Record<string, unknown> | null
  tool_response?: Record<string, unknown> | null
  agent_id?: string | null
  agent_type?: string | null
  cwd?: string | null
  error?: string | null
  prompt?: string | null
}
