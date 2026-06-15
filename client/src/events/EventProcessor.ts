import type { RawEvent, Cluster, GraphNode } from '../types'
import { eventBus, type BusEvents } from './EventBus'
import { nodeKeyFor } from '../store'

/**
 * Bridges SSE raw events from the store into typed domain events on the EventBus.
 * Called after store.addEvent() completes so state is up-to-date.
 *
 * Does NOT mutate store state — only emits events that AnimationManager listens to.
 */
export class EventProcessor {
  /**
   * Process a raw SSE event and emit corresponding domain events.
   * Must be called AFTER store.addEvent() so the state is already updated.
   */
  static process(event: RawEvent, cluster: Cluster, affectedNode: GraphNode | null) {
    // Node creation events (when affectedNode is newly created)
    if (affectedNode && event.hook_event_name === 'SessionStart') {
      eventBus.emit('node:created', {
        sessionId: event.session_id,
        node: affectedNode,
      })
    }

    // Tool use events (animations from cluster core to node)
    if (
      affectedNode &&
      event.hook_event_name === 'PostToolUse' &&
      event.tool_name
    ) {
      eventBus.emit('tool:used', {
        sessionId: event.session_id,
        nodeKey: affectedNode.key,
        tool: event.tool_name,
        colorHex: affectedNode.colorHex,
        inbound: false,
        agentId: null,
        toolInput: event.tool_input,
        toolResponse: event.tool_response,
      })
    }

    // Tool failure event
    if (event.hook_event_name === 'PostToolUseFailure' && event.tool_name) {
      eventBus.emit('tool:error', {
        sessionId: event.session_id,
        tool: event.tool_name,
        agentId: event.agent_id ?? null,
        error: typeof (event as any).error === 'string' ? (event as any).error : null,
      })
    }

    // Prompt/response snake events
    if (event.hook_event_name === 'UserPromptSubmit' && event.prompt) {
      const words = event.prompt.trim().split(/\s+/).filter(w => w.length > 0)
      const color = '#b0c8f0'
      if (words.length > 0) {
        eventBus.emit('prompt:submitted', {
          sessionId: event.session_id,
          words,
          color,
        })
      }
    }

    // Response snake on Stop (final assistant message flowing outward)
    if (event.hook_event_name === 'Stop' && event.last_assistant_message) {
      const words = event.last_assistant_message.trim().split(/\s+/).filter((w: string) => w.length > 0).slice(0, 8)
      if (words.length > 0) {
        eventBus.emit('response:received', {
          sessionId: event.session_id,
          words,
          color: '#aab8f0',
        })
      }
    }

    // Cluster lifecycle events
    if (event.hook_event_name === 'SessionStart') {
      eventBus.emit('cluster:created', { cluster })
    }

    if (event.hook_event_name === 'SessionEnd') {
      eventBus.emit('cluster:removed', { sessionId: event.session_id })
    }

    // Compaction animations
    if (event.hook_event_name === 'PreCompact') {
      eventBus.emit('compact:pre', { sessionId: event.session_id })
    }

    if (event.hook_event_name === 'PostCompact') {
      eventBus.emit('compact:post', { sessionId: event.session_id })
    }

    // Permission request
    if (event.hook_event_name === 'PermissionRequest') {
      eventBus.emit('permission:request', { sessionId: event.session_id })
    }

    // Subagent spawn
    if (event.hook_event_name === 'SubagentStart' && event.agent_id) {
      eventBus.emit('subagent:start', {
        sessionId: event.session_id,
        agentId: event.agent_id,
        agentType: event.agent_type || 'agent',
      })
    }

    // Subagent despawn
    if (event.hook_event_name === 'SubagentStop' && event.agent_id) {
      eventBus.emit('subagent:stop', {
        sessionId: event.session_id,
        agentId: event.agent_id,
      })
    }

    // Session end dissolution
    if (event.hook_event_name === 'SessionEnd') {
      eventBus.emit('session:end', { sessionId: event.session_id })
    }

    // Notification
    if (event.hook_event_name === 'Notification' && affectedNode) {
      eventBus.emit('notification', {
        sessionId: event.session_id,
        nodeKey: affectedNode.key,
        title: event.title || 'notification',
      })
    }

    // Stop from JSONL (end_turn) — distinct from hook Stop
    if (event.hook_event_name === 'Stop' && (event as any).reason === 'end_turn') {
      eventBus.emit('session:stop', {
        sessionId: event.session_id,
        lastMessage: event.last_assistant_message ?? null,
      })
    }

    // Compaction boundary (from compact_boundary system subtype)
    if (event.hook_event_name === 'CompactBoundary') {
      eventBus.emit('compact:boundary', { sessionId: event.session_id })
    }

    // AI-generated title
    if (event.hook_event_name === 'AiTitle' && event.title) {
      eventBus.emit('ai-title', { sessionId: event.session_id, title: event.title })
    }

    // PR link created
    if (event.hook_event_name === 'PrLink') {
      eventBus.emit('pr-link', { sessionId: event.session_id, url: event.title ?? null })
    }

    // Turn duration (end of turn telemetry)
    if (event.hook_event_name === 'TurnDuration') {
      const durationMs = (event as any).tool_response?.durationMs ?? null
      eventBus.emit('turn:duration', { sessionId: event.session_id, durationMs })
    }

    // API error
    if (event.hook_event_name === 'ApiError') {
      eventBus.emit('api:error', { sessionId: event.session_id, error: (event as any).error ?? null })
    }

    // Queued prompt — a prompt enqueued/removed while a turn is in flight.
    if (event.hook_event_name === 'QueueOperation' && (event as any).trigger === 'enqueue' && event.prompt) {
      const words = event.prompt.trim().split(/\s+/).filter(w => w.length > 0)
      if (words.length > 0) {
        eventBus.emit('prompt:submitted', { sessionId: event.session_id, words, color: '#8aa0d8' })
      }
    }

    // Lower-frequency session-level activity that was previously dropped.
    // One generic activity pulse keeps the visualizer coherent without a
    // bespoke effect per type; color encodes the kind.
    const ACTIVITY_COLORS: Record<string, string> = {
      LocalCommand: '#7dd3fc',
      ScheduledTask: '#c4b5fd',
      PermissionMode: '#fbbf24',
      ModeChange: '#94a3b8',
      AwaySummary: '#86efac',
      Informational: '#cbd5e1',
    }
    if (event.hook_event_name && ACTIVITY_COLORS[event.hook_event_name]) {
      eventBus.emit('session:activity', {
        sessionId: event.session_id,
        kind: event.hook_event_name,
        color: ACTIVITY_COLORS[event.hook_event_name],
        label: event.title ?? (event as any).permission_mode ?? (event as any).trigger ?? null,
      })
    }
  }
}
