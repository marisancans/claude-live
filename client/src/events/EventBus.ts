import type { Cluster, GraphNode } from '../types'

/**
 * Typed domain events for the PixiJS renderer animation system.
 * These events decouple state mutations (store.ts) from visual animations (AnimationManager).
 */
export interface BusEvents {
  'node:created': { sessionId: string; node: GraphNode }
  'node:removed': { sessionId: string; nodeKey: string }
  'tool:used': { sessionId: string; nodeKey: string; tool: string; colorHex: string; inbound: boolean; agentId?: string | null }
  'prompt:submitted': { sessionId: string; words: string[]; color: string }
  'response:received': { sessionId: string; words: string[]; color: string }
  'cluster:created': { cluster: Cluster }
  'cluster:removed': { sessionId: string }
  'compact:pre': { sessionId: string }
  'compact:post': { sessionId: string }
  'permission:request': { sessionId: string }
  'subagent:start': { sessionId: string; agentId: string; agentType: string }
  'subagent:stop': { sessionId: string; agentId: string }
  'session:end': { sessionId: string }
  'notification': { sessionId: string; nodeKey: string; title: string }
}

/**
 * Minimal typed event emitter for domain events.
 * Similar to 'mitt' but tailored for BusEvents type safety.
 */
export class EventBus {
  private listeners = new Map<keyof BusEvents, Set<Function>>()

  on<K extends keyof BusEvents>(event: K, handler: (data: BusEvents[K]) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(handler)
  }

  off<K extends keyof BusEvents>(event: K, handler: (data: BusEvents[K]) => void): void {
    this.listeners.get(event)?.delete(handler)
  }

  emit<K extends keyof BusEvents>(event: K, data: BusEvents[K]): void {
    this.listeners.get(event)?.forEach(handler => handler(data))
  }

  clear(): void {
    this.listeners.clear()
  }
}

// Singleton instance used across the app
export const eventBus = new EventBus()
