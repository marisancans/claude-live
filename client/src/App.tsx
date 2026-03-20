import { useEffect, useRef, useState } from 'react'
import type { RawEvent, GraphNode, Cluster } from './types'
import { createStore } from './store'
import { PixiScene } from './canvas-pixi/PixiScene'
import { DebugPanel } from './DebugPanel'
import { OperationsPanel } from './OperationsPanel'
import { initAudio, playChordForEvent, setAudioEnabled, isAudioEnabled } from './audio'
import { SpeakerIcon } from './SpeakerIcon'
import { AutofitIcon } from './AutofitIcon'
import { EventLog } from './EventLog'

const store = createStore()

// Tool color mapping for visualization and UI elements
const TOOL_COLORS: Record<string, string> = {
  Read:         '#4ade80',
  Edit:         '#60a5fa',
  Write:        '#60a5fa',
  Bash:         '#f59e0b',
  Grep:         '#a78bfa',
  Glob:         '#a78bfa',
  WebFetch:     '#f472b6',
  Stop:         '#888888',
  Notification: '#34d399',
  SubagentStart:'#c084fc',
  SubagentStop: '#7c3aed',
  PostToolUseFailure: '#f87171',
  SessionEnd:   '#ef4444',
  UserPromptSubmit: '#38bdf8',
  PreCompact:   '#94a3b8',
  PostCompact:  '#94a3b8',
  SessionStart: '#22d3ee',
  InstructionsLoaded: '#a3a3a3',
  WorktreeCreate: '#86efac',
  WorktreeRemove: '#fca5a5',
}

const LEGEND_ITEMS = [
  { color: '#4ade80', badge: 'R', name: 'Read' },
  { color: '#60a5fa', badge: 'E', name: 'Edit / Write' },
  { color: '#f59e0b', badge: 'B', name: 'Bash' },
  { color: '#a78bfa', badge: 'G', name: 'Grep / Glob' },
  { color: '#f472b6', badge: '↗', name: 'WebFetch' },
  { color: '#34d399', badge: '!', name: 'Notification' },
  { color: '#888888', badge: '✓', name: 'Stop' },
  { color: '#c084fc', badge: '⬡', name: 'Subagent' },
]

export interface LogEntry {
  id: string
  tool: string
  file: string
  sessionLabel: string
  project: string
  colorHex: string
  createdAt: number
}

function fileLabel(event: RawEvent): string {
  const input = event.tool_input as Record<string, any> | null
  const t = event.tool_name
  if (t === 'Edit') {
    const fp = (input?.file_path || '') as string
    const ns = ((input?.new_string || '') as string).split('\n').length
    const os = ((input?.old_string || '') as string).split('\n').length
    const name = fp.split('/').pop() || ''
    return ns !== os ? `${name} +${ns}−${os}` : `${name} ${ns}L`
  }
  if (t === 'Write') {
    const fp = (input?.file_path || '') as string
    const lines = ((input?.content || '') as string).split('\n').length
    return `${fp.split('/').pop() || ''} ${lines}L`
  }
  if (t === 'Read') {
    const fp = (input?.file_path || '') as string
    const limit = input?.limit
    const offset = input?.offset
    const name = fp.split('/').pop() || ''
    if (offset) return `${name} @${offset}`
    if (limit) return `${name} ${limit}L`
    return name
  }
  if (['Grep', 'Glob'].includes(t || '')) {
    return input?.pattern || input?.file_path?.split('/').pop() || ''
  }
  if (t === 'Bash') return (input?.command || '').slice(0, 22)
  if (t === 'WebFetch') { try { return new URL(input?.url || '').hostname } catch { return '' } }
  if (event.hook_event_name === 'UserPromptSubmit') return (event.prompt || '').slice(0, 30)
  if (event.hook_event_name === 'PreCompact') return event.trigger || 'compacting...'
  if (event.hook_event_name === 'PostCompact') return 'context compacted'
  if (event.hook_event_name === 'SessionStart') return event.model || event.source || 'started'
  if (event.hook_event_name === 'InstructionsLoaded') return event.memory_type || 'instructions'
  return ''
}

function enrichedFileLabel(event: RawEvent): string {
  const t = event.tool_name
  const input = event.tool_input as Record<string, any> | null
  const resp = event.tool_response as Record<string, any> | null

  if (t === 'Read' && resp) {
    const fp = (input?.file_path || '') as string
    const name = fp.split('/').pop() || ''
    const content = resp.content ?? resp.text ?? resp.output
    if (typeof content === 'string') {
      const lines = content.split('\n').length
      return `${name} ${lines}L`
    }
    return name
  }
  if (t === 'Grep' && resp) {
    const count = resp.count ?? resp.numMatches ?? resp.total
    if (count !== undefined) return `${input?.pattern || ''} ${count} hits`
    return input?.pattern || ''
  }
  if (t === 'Glob' && resp) {
    const files = Array.isArray(resp) ? resp.length : (resp.files?.length ?? resp.count)
    if (files !== undefined) return `${input?.pattern || ''} ${files} files`
    return input?.pattern || ''
  }
  if (t === 'Bash' && resp) {
    const code = resp.exitCode ?? resp.exit_code ?? resp.code
    if (code !== undefined) return `$ ${(input?.command || '').split(/\s+/)[0]?.split('/').pop() || ''} ${code === 0 ? '✓' : `✗ ${code}`}`
    return (input?.command || '').slice(0, 22)
  }

  return fileLabel(event)
}

const MAX_LOG = 100

function toolColor(event: RawEvent | null | undefined): string {
  if (!event) return '#888'
  const key = event.tool_name || event.hook_event_name || ''
  return TOOL_COLORS[key] ?? '#888'
}

function toolColorFromNode(node: GraphNode | null): string {
  if (!node || !node.lastTool) return '#888'
  return TOOL_COLORS[node.lastTool] ?? '#888'
}

function relativeTime(ts: number | null | undefined): string {
  if (!ts) return '—'
  const diff = Math.floor((Date.now() - ts) / 1000)
  if (diff < 3) return 'just now'
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  return `${Math.floor(diff / 3600)}h ago`
}

function projectName(cwd: string | null | undefined): string {
  if (!cwd) return ''
  const parts = cwd.split('/').filter(Boolean)
  return parts[parts.length - 1] ?? ''
}

interface PermNotification {
  sessionId: string
  sessionLabel: string
  message: string
  timestamp: number
}

export function App() {
  const [clusters, setClusters] = useState(store.getSessions())
  const [lastEvent, setLastEvent] = useState<RawEvent | null>(null)
  const [eventCount, setEventCount] = useState(0)
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null)
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null)
  const [selectedCluster, setSelectedCluster] = useState<Cluster | null>(null)
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)
  const [permNotifications, setPermNotifications] = useState<Map<string, PermNotification>>(new Map())
  const [eventLog, setEventLog] = useState<LogEntry[]>([])
  const [operationsOpen, setOperationsOpen] = useState(false)
  const [debugOpen, setDebugOpen] = useState(false)
  const [audioEnabled, setAudioEnabledState] = useState(() => {
    // Load from localStorage
    const saved = localStorage.getItem('claude-live-audio-enabled')
    return saved === 'true'
  })
  const [autofitEnabled, setAutofitEnabledState] = useState(() => {
    // Load from localStorage
    const saved = localStorage.getItem('claude-live-autofit-enabled')
    return saved === 'true'
  })
  const [replayDone, setReplayDone] = useState(false)
  const replayDoneRef = useRef(false)
  const esRef = useRef<EventSource | null>(null)

  // Initialize audio on mount
  useEffect(() => {
    initAudio()
    setAudioEnabledState(isAudioEnabled())
  }, [])

  // Sync autofit state to localStorage
  useEffect(() => {
    localStorage.setItem('claude-live-autofit-enabled', autofitEnabled ? 'true' : 'false')
  }, [autofitEnabled])

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => { setMouseX(e.clientX); setMouseY(e.clientY) }
    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  useEffect(() => {
    const es = new EventSource('/events')
    esRef.current = es
    es.onmessage = (e) => {
      try {
        const parsed = JSON.parse(e.data)
        if (parsed.type === 'state_snapshot') {
          store.initFromSnapshot(parsed.sessions)
          setClusters(new Map(store.getSessions()))
          replayDoneRef.current = true
          setReplayDone(true)
          return
        }
        // Legacy: old server sends replay_done after individual event replay
        if (parsed.type === 'replay_done') {
          store.markReplayDone()
          setClusters(new Map(store.getSessions()))
          replayDoneRef.current = true
          setReplayDone(true)
          return
        }
        const event: RawEvent = parsed
        console.log('[claude-live]', event.hook_event_name, event.tool_name ?? '', event.session_id, event.tool_input)
        const prevSize = store.getSessions().size
        store.addEvent(event, !replayDoneRef.current)
        const sessions = store.getSessions()
        setClusters(new Map(sessions))
        setLastEvent(event)
        setEventCount(c => c + 1)
        if (replayDoneRef.current) playChordForEvent(event.tool_name ?? undefined, event.hook_event_name ?? undefined) // Play audio on event (only after replay completes)

        // Live event log: show PostToolUse for tools with enriched data, skip others to avoid duplication
        const isEnrichedTool = ['Read', 'Edit', 'Write', 'Grep', 'Glob', 'Bash'].includes(event.tool_name || '')
        const skipDuplicate = event.hook_event_name === 'PostToolUse' && !isEnrichedTool

        if (!skipDuplicate && replayDoneRef.current) {
          const cluster = sessions.get(event.session_id)
          let tool = event.tool_name || event.hook_event_name || '?'
          // Shorten MCP names: mcp__plugin_X__Y__action → action
          if (tool.startsWith('mcp_')) {
            const parts = tool.split('__')
            tool = parts[parts.length - 1].replace(/_/g, ' ')
          }
          setEventLog(prev => {
            const entry: LogEntry = {
              id: event.id,
              tool,
              file: event.hook_event_name === 'PostToolUse' ? enrichedFileLabel(event) : fileLabel(event),
              sessionLabel: cluster?.label ?? event.session_id.slice(0, 8),
              project: projectName(event.cwd),
              colorHex: TOOL_COLORS[tool] ?? '#888',
              createdAt: Date.now(),
            }
            return [...prev, entry].slice(-MAX_LOG)
          })
        }

        // Track permission requests via Notification events
        if (event.hook_event_name === 'Notification' || event.hook_event_name === 'PermissionRequest') {
          const cluster = sessions.get(event.session_id)
          const msg = (event.tool_input as Record<string, string> | null)?.message ?? 'awaiting input'
          console.log('[perm] showing notification:', { session: event.session_id, msg })
          setPermNotifications(prev => {
            const next = new Map(prev)
            next.set(event.session_id, {
              sessionId: event.session_id,
              sessionLabel: cluster?.label ?? event.session_id.slice(0, 8),
              message: msg,
              timestamp: event.timestamp,
            })
            return next
          })
        }
        // Clear when user provides input or a tool starts executing
        if (event.tool_name || event.hook_event_name === 'UserPromptSubmit') {
          setPermNotifications(prev => {
            if (!prev.has(event.session_id)) return prev
            console.log('[perm] clearing notification:', { session: event.session_id, trigger: event.tool_name || 'UserPromptSubmit' })
            const next = new Map(prev)
            next.delete(event.session_id)
            return next
          })
        }

        // Compacting animation handled by store.ts (with replayDone guard)
      } catch { /* ignore malformed */ }
    }
    es.onerror = (err) => console.warn('[claude-live] SSE error', err)
    return () => es.close()
  }, [])

  const handleHover = (node: GraphNode | null, _cluster: Cluster | null) => setHoveredNode(node)
  const handleSelect = (node: GraphNode | null, cluster: Cluster | null) => {
    setSelectedNode(node)
    setSelectedCluster(cluster)
  }
  const toggleAudio = () => {
    const newState = !audioEnabled
    setAudioEnabledState(newState)
    setAudioEnabled(newState)
  }
  const toggleAutofit = () => {
    const newState = !autofitEnabled
    setAutofitEnabledState(newState)
    localStorage.setItem('claude-live-autofit-enabled', newState ? 'true' : 'false')
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <PixiScene clusters={clusters} lastEvent={lastEvent} onHover={handleHover} onSelect={handleSelect} autofitEnabled={autofitEnabled} />

      {/* HUD */}
      <div className="hud">
        <div className="hud-title">claude<span>live</span></div>
        <div className="hud-stat">
          <span className="hud-label">events</span>
          <span className="hud-value">{eventCount}</span>
        </div>
        <div className="hud-stat">
          <span className="hud-label">sessions</span>
          <span className="hud-value">{clusters.size}</span>
        </div>
        <div className="hud-stat">
          <span className="hud-label">last</span>
          <span className="hud-value hud-tool" style={{ color: toolColor(lastEvent) }}>
            {lastEvent?.tool_name ?? '—'}
          </span>
        </div>
      </div>

      {/* Top-right buttons */}
      <div className="top-right-buttons">
        <button
          className="audio-toggle"
          onClick={toggleAudio}
          title={audioEnabled ? 'Mute audio' : 'Unmute audio'}
          aria-label={audioEnabled ? 'Mute audio' : 'Unmute audio'}
        >
          <SpeakerIcon enabled={audioEnabled} />
        </button>
        <button
          className="autofit-toggle"
          onClick={toggleAutofit}
          title={autofitEnabled ? 'Disable autofit' : 'Enable autofit'}
          aria-label={autofitEnabled ? 'Disable autofit' : 'Enable autofit'}
        >
          <AutofitIcon enabled={autofitEnabled} />
        </button>
        <button
          className="hud-button"
          onClick={() => setOperationsOpen(true)}
          title="Show operations legend"
          aria-label="Operations"
        >
          ?
        </button>
        <button
          className="hud-button"
          onClick={() => setDebugOpen(true)}
          title="Show debug panel"
          aria-label="Debug"
        >
          ⚙
        </button>
      </div>

      {/* Permission notifications */}
      {permNotifications.size > 0 && (
        <div className="perm-notifications">
          <div className="perm-notifications-title">awaiting input</div>
          {[...permNotifications.values()].map(n => (
            <div className="perm-notification-item" key={n.sessionId}>
              <div className="perm-notification-dot" />
              <div className="perm-notification-body">
                <div className="perm-notification-session">session:{n.sessionLabel}</div>
                <div className="perm-notification-msg">{n.message.slice(0, 60)}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom-left: event log */}
      <div className="bottom-left-panel">
        <EventLog entries={eventLog} />
      </div>

      {/* Tooltip */}
      <div className="tooltip" style={{ left: mouseX + 14, top: mouseY - 10, opacity: hoveredNode ? 1 : 0 }}>
        <div className="tooltip-label">{hoveredNode?.label ?? ''}</div>
        <div className="tooltip-type">{hoveredNode?.nodeType ?? ''}</div>
        <div className="tooltip-meta">{hoveredNode?.lastTool ?? '—'} · {relativeTime(hoveredNode?.lastTimestamp)}</div>
        <div className="tooltip-count">{hoveredNode?.eventCount ?? 0} events</div>
        {hoveredNode?.awaitingPermission && (
          <div className="perm-badge"><div className="perm-dot" />waiting for permission</div>
        )}
      </div>

      <DebugPanel sessionIds={[...clusters.keys()]} isOpen={debugOpen} onClose={() => setDebugOpen(false)} />
      <OperationsPanel isOpen={operationsOpen} onClose={() => setOperationsOpen(false)} />

      {/* Sidebar */}
      <div className={`sidebar ${selectedNode ? 'sidebar--open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-close" onClick={() => { setSelectedNode(null); setSelectedCluster(null) }}>×</div>
          <div className="sidebar-title">{selectedNode?.label ?? ''}</div>
          <div className="sidebar-type">{selectedNode?.nodeType ?? ''}</div>
          {selectedNode?.awaitingPermission && (
            <div className="perm-badge" style={{ marginTop: 8 }}><div className="perm-dot" />awaiting permission</div>
          )}
        </div>
        <div className="sidebar-section">
          <div className="sidebar-section-label">Last action</div>
          <div className="sidebar-action" style={{ color: toolColorFromNode(selectedNode) }}>{selectedNode?.lastTool ?? '—'}</div>
          <div className="sidebar-time">{relativeTime(selectedNode?.lastTimestamp)}</div>
        </div>
        <div className="sidebar-section">
          <div className="sidebar-section-label">Total interactions</div>
          <div className="sidebar-count">{selectedNode?.eventCount ?? 0}</div>
        </div>
        <div className="sidebar-section">
          <div className="sidebar-section-label">Session</div>
          <div className="sidebar-session">{selectedCluster?.label ?? '—'}</div>
        </div>
      </div>
    </div>
  )
}
