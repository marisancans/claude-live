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
      ['PostToolUse', 'PostToolUseFailure'].includes(event.hook_event_name) &&
      event.tool_name
    ) {
      const inbound = false // typically outbound from core to node
      eventBus.emit('tool:used', {
        sessionId: event.session_id,
        nodeKey: affectedNode.key,
        tool: event.tool_name,
        colorHex: affectedNode.colorHex,
        inbound,
        agentId: null,
        toolInput: event.tool_input,
        toolResponse: event.tool_response,
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
  }
}
