import type { TreeEffectBuilder } from './types'

// Effects will be added in subsequent tasks.
// Import and register each effect builder here.

const builders: Record<string, TreeEffectBuilder> = {}

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
