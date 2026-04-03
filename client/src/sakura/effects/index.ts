import type { TreeEffectBuilder } from './types'
import { buildReadSap } from './readSap'
import { buildWriteBloom } from './writeBloom'
import { buildBashShudder } from './bashShudder'
import { buildGrepShimmer } from './grepShimmer'
import { buildFetchBlight } from './fetchBlight'
import { buildPromptSurge } from './promptSurge'
import { buildErrorScatter } from './errorScatter'
import { buildAgentSpirit } from './agentSpirit'
import { buildSessionAwaken } from './sessionAwaken'

const builders: Record<string, TreeEffectBuilder> = {
  Read: buildReadSap,
  Edit: buildWriteBloom,
  Write: buildWriteBloom,
  Bash: buildBashShudder,
  Grep: buildGrepShimmer,
  Glob: buildGrepShimmer,
  WebFetch: buildFetchBlight,
  UserPromptSubmit: buildPromptSurge,
  PostToolUseFailure: buildErrorScatter,
  SubagentStart: buildAgentSpirit,
  SessionStart: buildSessionAwaken,
}

export function registerEffect(name: string, builder: TreeEffectBuilder) {
  builders[name] = builder
}

export function buildEffect(toolName: string, ...args: Parameters<TreeEffectBuilder>): ReturnType<TreeEffectBuilder> {
  const builder = builders[toolName] ?? builders.Read
  if (!builder) {
    // Minimal fallback — no-op effect
    return { tick: () => false, dispose: () => {} }
  }
  return builder(...args)
}

export { builders }
