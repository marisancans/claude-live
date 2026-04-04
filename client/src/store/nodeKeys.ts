import type { RawEvent, GraphNode } from '../types'

// Shorten MCP tool names: mcp__plugin_foo__bar__action → action
function shortToolName(name: string): string {
  if (name.startsWith('mcp_')) {
    const parts = name.split('__')
    return parts[parts.length - 1].replace(/_/g, ' ')
  }
  return name
}

export function nodeKeyFor(event: RawEvent): string | null {
  const id = String(event.id || `${event.session_id}-${event.timestamp}`)
  const t = event.tool_name
  if (!t) {
    if (event.hook_event_name === 'Stop') return `session:stop:${id}`
    if (event.hook_event_name === 'Notification') {
      const msg = (event.tool_input as Record<string, string> | null)?.message || ''
      return `notification:${msg.slice(0, 20)}:${id}`
    }
    if (event.hook_event_name === 'PermissionRequest') return `permission:${id}`
    return `hook:${event.hook_event_name}:${id}`
  }
  const input = event.tool_input as Record<string, string> | null
  if (['Read', 'Edit', 'Write', 'Glob', 'Grep'].includes(t)) {
    const fp = input?.file_path || input?.path || null
    return fp ? `file:${fp}:${id}` : `file:unknown:${id}`
  }
  if (t === 'Bash') {
    const cmd = input?.command || ''
    return `bash:${cmd}:${id}`
  }
  if (t === 'WebFetch') {
    try { return `web:${new URL(input?.url || '').hostname}:${id}` } catch { return `web:unknown:${id}` }
  }
  return `tool:${t}:${id}`
}

export function labelFor(event: RawEvent): string {
  const t = event.tool_name
  const input = event.tool_input as Record<string, string> | null
  if (['Read', 'Edit', 'Write', 'Glob', 'Grep'].includes(t || '')) {
    const fp = input?.file_path || input?.path || ''
    return fp.split('/').pop() || fp
  }
  if (t === 'Bash') return `$ ${(input?.command || '').slice(0, 22)}`
  if (t === 'WebFetch') { try { return `↗ ${new URL(input?.url || '').hostname}` } catch { return '↗ web' } }
  if (event.hook_event_name === 'Stop') return '✓ done'
  if (event.hook_event_name === 'Notification') {
    const msg = (event.tool_input as Record<string, string> | null)?.message || 'notification'
    return msg.slice(0, 24)
  }
  if (t && t.startsWith('mcp_')) return shortToolName(t).slice(0, 20)
  return t || event.hook_event_name || '?'
}

// Generate enriched action label with stats from tool_input/tool_response
export function enrichedLabel(event: RawEvent, latency?: string): string {
  const t = event.tool_name || event.hook_event_name || '?'
  const input = event.tool_input as Record<string, any> | null
  const resp = event.tool_response as Record<string, any> | null
  const short = t.startsWith('mcp_') ? shortToolName(t).slice(0, 14) : t
  const suffix = latency ? ` ${latency}` : ''

  // Handle is_interrupt for PostToolUseFailure
  if (event.hook_event_name === 'PostToolUseFailure' && event.is_interrupt) {
    return `⏹ interrupted${suffix}`
  }

  if (event.hook_event_name === 'PostToolUse' && resp) {
    // Enrich with response data
    if (t === 'Bash') {
      const code = resp.exitCode ?? resp.exit_code ?? resp.code
      if (code !== undefined && code !== null) return code === 0 ? `${short} ✓${suffix}` : `${short} ✗ ${code}${suffix}`
    }
    if (t === 'Grep') {
      const count = resp.count ?? resp.numMatches ?? resp.total
      if (count !== undefined) return `${short} ${count} hits${suffix}`
    }
    if (t === 'Glob') {
      const files = Array.isArray(resp) ? resp.length : (resp.files?.length ?? resp.count)
      if (files !== undefined) return `${short} ${files} files${suffix}`
    }
    if (t === 'Read') {
      // Try to count lines from response content
      const content = resp.content ?? resp.text ?? resp.output
      if (typeof content === 'string') {
        const lines = content.split('\n').length
        return `${short} ${lines}L${suffix}`
      }
    }
    if (t === 'WebFetch') {
      const status = resp.status ?? resp.statusCode
      if (status !== undefined) return `${short} ${status}${suffix}`
    }
  }

  if (input) {
    if (t === 'Edit') {
      const ns = (input.new_string || '') as string
      const os = (input.old_string || '') as string
      const added = ns.split('\n').length
      const removed = os.split('\n').length
      if (added !== removed) return `${short} +${added} -${removed}${suffix}`
      return `${short} ${added}L${suffix}`
    }
    if (t === 'Write') {
      const content = (input.content || '') as string
      const lines = content.split('\n').length
      return `${short} ${lines}L${suffix}`
    }
    if (t === 'Read') {
      const limit = input.limit
      const offset = input.offset
      if (offset) return `${short} @${offset}${suffix}`
      if (limit) return `${short} ${limit}L${suffix}`
    }
    if (t === 'Bash') {
      const cmd = (input.command || '') as string
      const first = cmd.split(/\s+/)[0]?.split('/').pop() || ''
      return `$ ${first}${suffix}`
    }
    if (t === 'Grep') {
      return `${short} /${(input.pattern || '').toString().slice(0, 10)}/${suffix}`
    }
    if (t === 'Glob') {
      return `${short} ${(input.pattern || '').toString().slice(0, 14)}${suffix}`
    }
    if (t === 'WebFetch') {
      try { return `${short} ${new URL(input.url || '').hostname}${suffix}` } catch { /* fall through */ }
    }
  }

  return short + suffix
}

export function nodeTypeFor(event: RawEvent): GraphNode['nodeType'] {
  const t = event.tool_name
  if (['Read', 'Edit', 'Write', 'Glob', 'Grep'].includes(t || '')) return 'file'
  if (t === 'Bash') return 'bash'
  if (t === 'WebFetch') return 'web'
  if (event.hook_event_name === 'Stop') return 'stop'
  if (event.hook_event_name === 'Notification') return 'notification'
  return 'tool'
}
