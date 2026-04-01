import { useEffect, useRef, useState } from 'react'

const FILE_PATHS = [
  '/src/App.tsx', '/src/store.ts', '/src/types.ts',
  '/src/canvas/renderer.ts', '/src/canvas/graph.ts',
  '/server/index.js', '/package.json', '/client/vite.config.ts',
  '/src/main.tsx', '/src/index.css', '/src/DebugPanel.tsx',
  '/tests/store.test.ts', '/bin/claude-live.js',
]

const BASH_CMDS = [
  'npm run build',
  'git status',
  'ls -la src/',
  'npx tsc --noEmit',
  'npm test',
  'git diff --stat',
]

function genId() {
  return 'debug-' + Math.random().toString(36).slice(2, 8)
}

async function postHook(event: object) {
  await fetch('/hook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  })
}

interface Props {
  sessionIds: string[]
  isOpen: boolean
  onClose: () => void
  onLoadHistory?: (sessionId: string, events: any[]) => void
}

export function DebugPanel({ sessionIds, isOpen, onClose, onLoadHistory }: Props) {
  const [sessionId, setSessionId] = useState(genId)
  const [historySessions, setHistorySessions] = useState<Array<{ id: string; ts: number }>>([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [historyLoadId, setHistoryLoadId] = useState<string | null>(null)
  const [historyError, setHistoryError] = useState<string | null>(null)
  const fileIdx = useRef(0)
  const cmdIdx = useRef(0)
  const eventIdx = useRef(0)
  const agentId = useRef('agent-' + Math.random().toString(36).slice(2, 7))

  function nextFile() {
    return FILE_PATHS[fileIdx.current++ % FILE_PATHS.length]
  }
  function nextCmd() {
    return BASH_CMDS[cmdIdx.current++ % BASH_CMDS.length]
  }

  function nextEventId() {
    eventIdx.current += 1
    return `${Date.now().toString(36)}${eventIdx.current.toString(36)}`
  }

  function withId(value: string, id: string) {
    return `${value}@${id}`
  }

  useEffect(() => {
    if (!isOpen) return
    pullHistorySessions()
  }, [isOpen])

  async function pullHistorySessions() {
    setHistoryLoading(true)
    setHistoryError(null)
    try {
      const res = await fetch('/api/history')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const events = await res.json()
      const latest = new Map<string, number>()
      if (Array.isArray(events)) {
        for (const ev of events) {
          const sid = ev?.session_id
          if (!sid) continue
          const ts = typeof ev.timestamp === 'number' ? ev.timestamp : Date.now()
          const prev = latest.get(sid)
          if (!prev || ts > prev) latest.set(sid, ts)
        }
      }
      const sessions = [...latest.entries()]
        .map(([id, ts]) => ({ id, ts }))
        .sort((a, b) => b.ts - a.ts)
        .slice(0, 10)
      setHistorySessions(sessions)
    } catch (err: any) {
      setHistoryError(err?.message || 'Failed to fetch history')
    } finally {
      setHistoryLoading(false)
    }
  }

  async function loadHistorySession(id: string) {
    setHistoryLoadId(id)
    setHistoryError(null)
    try {
      const res = await fetch(`/api/history?session=${encodeURIComponent(id)}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const events = await res.json()
      if (Array.isArray(events)) {
        onLoadHistory?.(id, events)
        setSessionId(id)
      }
    } catch (err: any) {
      setHistoryError(err?.message || 'Failed to load session history')
    } finally {
      setHistoryLoadId(null)
    }
  }

  function postToolUse(tool_name: string, tool_input: object, tool_response: object = {}) {
    return postHook({ session_id: sessionId, hook_event_name: 'PostToolUse', tool_name, tool_input, tool_response })
  }

  const TOOL_BTNS: { label: string; color: string; fn: () => void }[] = [
    { label: 'Read',        color: '#4ade80', fn: () => {
      const id = nextEventId()
      const file = withId(nextFile(), id)
      postToolUse('Read', { file_path: file }, { type: 'text', file: { filePath: file, content: 'Response data from file read operation with individual letters streaming outward' } })
    } },
    { label: 'Edit',        color: '#60a5fa', fn: () => {
      const id = nextEventId()
      postToolUse('Edit', { file_path: withId(nextFile(), id) })
    } },
    { label: 'Write',       color: '#60a5fa', fn: () => {
      const id = nextEventId()
      postToolUse('Write', { file_path: withId(nextFile(), id), content: 'Writing content to file with response snake animation showing letters outward' }, {})
    } },
    { label: 'Grep',        color: '#a78bfa', fn: () => {
      const id = nextEventId()
      postToolUse('Grep', { pattern: 'useState', path: `/tmp/${id}` }, { count: 12 })
    } },
    { label: 'Glob',        color: '#a78bfa', fn: () => {
      const id = nextEventId()
      postToolUse('Glob', { pattern: '**/*.tsx', path: `/tmp/${id}` }, { files: ['a.tsx', 'b.tsx'] })
    } },
    { label: 'Bash',        color: '#f59e0b', fn: () => {
      const id = nextEventId()
      postToolUse('Bash', { command: `${nextCmd()} #${id}` }, { stdout: 'bash command output with response letters flowing outward in straight animation paths', stderr: '', interrupted: false, exitCode: 0 })
    } },
    { label: 'WebFetch',    color: '#f472b6', fn: () => {
      const id = nextEventId()
      postToolUse('WebFetch', { url: `https://debug-${id}.local` }, { status: 200 })
    } },
    { label: 'Notification',color: '#34d399', fn: () => {
      const id = nextEventId()
      postHook({ session_id: sessionId, hook_event_name: 'Notification', tool_input: { message: `Task complete! All files updated. #${id}` } })
    } },
    { label: 'Permission',  color: '#fbbf24', fn: () => {
      const id = nextEventId()
      postHook({ session_id: sessionId, hook_event_name: 'PermissionRequest', tool_input: { message: `Allow bash command execution? #${id}` } })
    } },
    { label: 'Stop',        color: '#888888', fn: () => postHook({ session_id: sessionId, hook_event_name: 'Stop' }) },
    { label: 'SubStart',    color: '#c084fc', fn: () => postHook({ session_id: sessionId, hook_event_name: 'SubagentStart', agent_id: agentId.current, agent_type: 'general-purpose' }) },
    { label: 'SubStop',     color: '#7c3aed', fn: () => postHook({ session_id: sessionId, hook_event_name: 'SubagentStop',  agent_id: agentId.current }) },
    { label: 'SessEnd',     color: '#ef4444', fn: () => postHook({ session_id: sessionId, hook_event_name: 'SessionEnd' }) },
    { label: 'Fail',        color: '#f87171', fn: () => postHook({ session_id: sessionId, hook_event_name: 'PostToolUseFailure', tool_name: 'Read', tool_input: { file_path: nextFile() }, error: 'File not found' }) },
    { label: 'Compact↓',   color: '#94a3b8', fn: () => postHook({ session_id: sessionId, hook_event_name: 'PreCompact', trigger: 'manual' }) },
    { label: 'Compact↑',   color: '#38bdf8', fn: () => postHook({ session_id: sessionId, hook_event_name: 'PostCompact' }) },
    { label: 'Prompt',      color: '#b0c8f0', fn: () => postHook({ session_id: sessionId, hook_event_name: 'UserPromptSubmit', prompt: 'Fix the login bug on the dashboard page' }) },
    { label: 'Response',    color: '#7eb8f0', fn: () => postHook({ session_id: sessionId, hook_event_name: 'Stop', last_assistant_message: 'Here is the fix for the login bug. Updated auth middleware to handle token refresh correctly.' }) },
  ]

  if (!isOpen) return null

  const knownIds = sessionIds.includes(sessionId) ? sessionIds : [...sessionIds, sessionId]

  return (
    <div className="panel-overlay">
      <div className="debug-panel-header">
        <span className="debug-panel-title">debug</span>
        <button className="debug-close" onClick={onClose}>×</button>
      </div>

      <div className="debug-section">
        <div className="debug-section-label">session</div>
        <div className="debug-session-row">
          <select
            className="debug-select"
            value={sessionId}
            onChange={e => setSessionId(e.target.value)}
          >
            {knownIds.map(sid => (
              <option key={sid} value={sid}>{sid.slice(0, 18)}</option>
            ))}
          </select>
          <button className="debug-new-btn" onClick={() => setSessionId(genId())}>+ new</button>
        </div>
        <div className="debug-history-row" style={{ marginTop: 10 }}>
          <button className="debug-new-btn" onClick={pullHistorySessions} disabled={historyLoading}>
            {historyLoading ? 'loading…' : 'pull history'}
          </button>
          {historyError && (
            <span className="debug-hint" style={{ marginLeft: 8 }}>{historyError}</span>
          )}
        </div>
        {historySessions.length > 0 && (
          <div className="debug-history-list" style={{ marginTop: 8 }}>
            {historySessions.map(s => (
              <button
                key={s.id}
                className="debug-history-btn"
                onClick={() => loadHistorySession(s.id)}
                title={s.id}
              >
                {historyLoadId === s.id ? 'loading…' : s.id.slice(0, 18)}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="debug-section">
        <div className="debug-section-label">fire event</div>
        <div className="debug-tool-grid">
          {TOOL_BTNS.map(({ label, color, fn }) => (
            <button
              key={label}
              className="debug-tool-btn"
              style={{ '--tool-color': color } as React.CSSProperties}
              onClick={fn}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
