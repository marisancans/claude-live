import * as THREE from 'three'
import type { RawEvent } from '../types'
import type { ColonyVisual, BlossomAnchor, BranchVisual } from './types'
import type { TreeEffect } from './effects/types'
import { buildEffect } from './effects/index'
import { branchChainForPath, closestKnownPath, collectDescendantTips, layoutRootPath, normalizeProjectPath, pickSampleTips } from './TreeBuilder'
import type { PetalSystem } from './PetalSystem'
import type { WindField } from './WindField'

const TOOL_COLORS: Record<string, string> = {
  Read: '#d4a574',
  Edit: '#7ec8e3',
  Write: '#7dd3fc',
  Bash: '#f59e0b',
  Grep: '#c084fc',
  Glob: '#a78bfa',
  WebFetch: '#fb7185',
  Notification: '#34d399',
  PermissionRequest: '#fbbf24',
  UserPromptSubmit: '#ffd4a8',
  SessionStart: '#e8c4a0',
  SubagentStart: '#d8b4fe',
  PostToolUseFailure: '#f87171',
}

const INWARD_TOOLS = new Set(['Read', 'Grep', 'Glob'])

function toolColor(event: RawEvent): string {
  return TOOL_COLORS[event.tool_name || event.hook_event_name || ''] || '#e8c4a0'
}

function isAnimatable(event: RawEvent): boolean {
  return (
    event.hook_event_name === 'PreToolUse'
    || event.hook_event_name === 'PostToolUseFailure'
    || event.hook_event_name === 'UserPromptSubmit'
    || event.hook_event_name === 'SessionStart'
    || event.hook_event_name === 'SubagentStart'
    || event.hook_event_name === 'Notification'
    || event.hook_event_name === 'PermissionRequest'
  )
}

export class SignalSystem {
  private activeEffects: TreeEffect[] = []

  constructor(
    private petalSystem: PetalSystem,
    private windField: WindField,
  ) {}

  route(event: RawEvent, colony: ColonyVisual) {
    if (!isAnimatable(event)) return

    const tool = event.tool_name || ''
    const color = new THREE.Color(toolColor(event))

    // Non-tool events: boost colony
    if (event.hook_event_name === 'UserPromptSubmit' || event.hook_event_name === 'SessionStart') {
      colony.boost = Math.min(1.8, colony.boost + 0.45)
      this.routeFullTree(colony, color, tool || event.hook_event_name || 'SessionStart')
      return
    }
    if (event.hook_event_name === 'SubagentStart') {
      colony.boost = Math.min(1.4, colony.boost + 0.25)
      this.routeFullTree(colony, color, 'SubagentStart')
      return
    }
    if (event.hook_event_name === 'Notification' || event.hook_event_name === 'PermissionRequest') {
      colony.boost = Math.min(1.2, colony.boost + 0.15)
      return
    }

    colony.boost = Math.min(1.4, colony.boost + 0.25)

    // Tool events — route to file
    const input = (event.tool_input ?? {}) as Record<string, unknown>
    const directPath = normalizeProjectPath(colony.rootPath, input.file_path)
      || normalizeProjectPath(colony.rootPath, input.path)

    let targetPath = closestKnownPath(colony.layout, directPath)
    if (!targetPath) {
      targetPath = pickSampleTips(colony.layout, `${event.id}:fallback`, 1)[0] || null
    }
    if (!targetPath) return

    const node = colony.layout.nodes.get(targetPath)
    const targets = node?.type === 'folder'
      ? collectDescendantTips(colony.layout, targetPath, 3)
      : [targetPath]

    const direction: 'inward' | 'outward' = INWARD_TOOLS.has(tool) ? 'inward' : 'outward'

    for (const filePath of targets) {
      const branchIds = branchChainForPath(colony.layout, filePath)
      const branchChain = branchIds
        .map(id => colony.branches.get(id))
        .filter((b): b is BranchVisual => b !== undefined)

      if (branchChain.length === 0) continue

      const blossom = colony.layout.blossomAnchors.get(filePath) ?? null
      const petalIds = colony.petalInstanceIds // TODO: map per-file petal ids

      const ctx = {
        branchChain,
        targetBlossom: blossom,
        targetPetalIds: petalIds,
        direction,
        color,
        intensity: 1.0,
      }

      const effectName = event.hook_event_name === 'PostToolUseFailure'
        ? 'PostToolUseFailure'
        : tool

      const effect = buildEffect(effectName, ctx, colony.group, this.petalSystem, this.windField)
      this.activeEffects.push(effect)
    }
  }

  private routeFullTree(colony: ColonyVisual, color: THREE.Color, effectName: string) {
    const tips = pickSampleTips(colony.layout, `${colony.id}:${Date.now()}`, 4)
    for (const filePath of tips) {
      const branchIds = branchChainForPath(colony.layout, filePath)
      const branchChain = branchIds
        .map(id => colony.branches.get(id))
        .filter((b): b is BranchVisual => b !== undefined)
      if (branchChain.length === 0) continue

      const blossom = colony.layout.blossomAnchors.get(filePath) ?? null
      const ctx = {
        branchChain,
        targetBlossom: blossom,
        targetPetalIds: [],
        direction: 'outward' as const,
        color,
        intensity: 0.8,
      }
      const effect = buildEffect(effectName, ctx, colony.group, this.petalSystem, this.windField)
      this.activeEffects.push(effect)
    }
  }

  update(dt: number, elapsed: number) {
    this.activeEffects = this.activeEffects.filter(effect => {
      const alive = effect.tick(dt, elapsed)
      if (!alive) {
        effect.dispose()
      }
      return alive
    })
  }

  dispose() {
    for (const effect of this.activeEffects) effect.dispose()
    this.activeEffects = []
  }
}
