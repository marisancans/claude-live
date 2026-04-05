import { useEffect, useRef, useState } from 'react'
import { backendFetch, fetchJson } from './backend'

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
  await backendFetch('/hook', {
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
  const fileIdx = useRef(0)
  const cmdIdx = useRef(0)
  const eventIdx = useRef(0)
  const startedAgents = useRef<string[]>([])

  const nextAgentId = () => {
    const id = 'agent-' + Math.random().toString(36).slice(2, 7)
    startedAgents.current.push(id)
    return id
  }
  const lastAgentId = () => startedAgents.current.pop() || 'none'
  const nextFile = () => FILE_PATHS[fileIdx.current++ % FILE_PATHS.length]
  const nextCmd = () => BASH_CMDS[cmdIdx.current++ % BASH_CMDS.length]
  const nextEventId = () => {
    eventIdx.current += 1
    return `${Date.now().toString(36)}${eventIdx.current.toString(36)}`
  }
  const withId = (value: string, id: string) => `${value}@${id}`

  useEffect(() => {
    if (!isOpen) return
    pullHistorySessions()
  }, [isOpen])

  const pullHistorySessions = async () => {
    setHistoryLoading(true)
    try {
      const events = await fetchJson<any[]>('/api/history')
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
    } finally {
      setHistoryLoading(false)
    }
  }

  const loadHistorySession = async (id: string) => {
    setHistoryLoadId(id)
    try {
      const events = await fetchJson<any[]>(`/api/history?session=${encodeURIComponent(id)}`)
      if (Array.isArray(events)) {
        onLoadHistory?.(id, events)
        setSessionId(id)
      }
    } finally {
      setHistoryLoadId(null)
    }
  }

  const postToolUse = (tool_name: string, tool_input: object, tool_response: object = {}) =>
    postHook({ session_id: sessionId, hook_event_name: 'PostToolUse', tool_name, tool_input, tool_response })

  const TOOL_BTNS: { label: string; color: string; fn: () => void }[] = [
    { label: 'Read',    color: '#4ade80', fn: () => {
      const id = nextEventId()
      const file = withId(nextFile(), id)
      postToolUse('Read', { file_path: file }, { type: 'text', file: { filePath: file, content: 'Response data from file read operation with individual letters streaming outward' } })
    } },
    { label: 'Edit',    color: '#60a5fa', fn: () => {
      const id = nextEventId()
      postToolUse('Edit', { file_path: withId(nextFile(), id) })
    } },
    { label: 'Write',   color: '#60a5fa', fn: () => {
      const id = nextEventId()
      postToolUse('Write', { file_path: withId(nextFile(), id), content: 'Writing content to file' }, {})
    } },
    { label: 'Bash',    color: '#f59e0b', fn: () => {
      const id = nextEventId()
      postToolUse('Bash', { command: `${nextCmd()} #${id}` }, { stdout: 'output', stderr: '', exitCode: 0 })
    } },
    { label: 'Glob',    color: '#a78bfa', fn: () => {
      const id = nextEventId()
      postToolUse('Glob', { pattern: '**/*.tsx', path: `/tmp/${id}` }, { files: ['a.tsx', 'b.tsx'] })
    } },
    { label: 'Grep',    color: '#a78bfa', fn: () => {
      const id = nextEventId()
      postToolUse('Grep', { pattern: 'useState', path: `/tmp/${id}` }, { count: 12 })
    } },
    { label: 'Fetch',   color: '#f472b6', fn: () => {
      const id = nextEventId()
      postToolUse('WebFetch', { url: `https://debug-${id}.local` }, { status: 200 })
    } },
    { label: 'Notify',  color: '#34d399', fn: () => {
      const id = nextEventId()
      postHook({ session_id: sessionId, hook_event_name: 'Notification', tool_input: { message: `Task complete #${id}` } })
    } },
    { label: 'Perm',    color: '#fbbf24', fn: () => {
      const id = nextEventId()
      postHook({ session_id: sessionId, hook_event_name: 'PermissionRequest', tool_input: { message: `Allow? #${id}` } })
    } },
    { label: 'Stop',    color: '#888888', fn: () => postHook({ session_id: sessionId, hook_event_name: 'Stop' }) },
    { label: 'SubStart',color: '#c084fc', fn: () => postHook({ session_id: sessionId, hook_event_name: 'SubagentStart', agent_id: nextAgentId(), agent_type: 'general-purpose' }) },
    { label: 'SubStop', color: '#7c3aed', fn: () => postHook({ session_id: sessionId, hook_event_name: 'SubagentStop', agent_id: lastAgentId() }) },
    { label: 'SessEnd', color: '#ef4444', fn: () => postHook({ session_id: sessionId, hook_event_name: 'SessionEnd' }) },
    { label: 'Fail',    color: '#f87171', fn: () => postHook({ session_id: sessionId, hook_event_name: 'PostToolUseFailure', tool_name: 'Read', tool_input: { file_path: nextFile() }, error: 'not found' }) },
    { label: 'C↓',      color: '#94a3b8', fn: () => postHook({ session_id: sessionId, hook_event_name: 'PreCompact', trigger: 'manual' }) },
    { label: 'C↑',      color: '#38bdf8', fn: () => postHook({ session_id: sessionId, hook_event_name: 'PostCompact' }) },
    { label: 'Prompt',  color: '#b0c8f0', fn: () => postHook({ session_id: sessionId, hook_event_name: 'UserPromptSubmit', prompt: `Fix bug #${nextEventId()}` }) },
    { label: 'Resp',    color: '#7eb8f0', fn: () => postHook({ session_id: sessionId, hook_event_name: 'Stop', last_assistant_message: 'Fixed.' }) },
    { label: 'SStart',  color: '#e8c4a0', fn: () => postHook({ session_id: sessionId, hook_event_name: 'SessionStart', model: 'claude-sonnet-4.6' }) },
    { label: 'PreRead', color: '#6dbf8a', fn: () => postHook({ session_id: sessionId, hook_event_name: 'PreToolUse', tool_name: 'Read', tool_input: { file_path: nextFile() } }) },
    { label: 'InstrL',  color: '#d8b4fe', fn: () => postHook({ session_id: sessionId, hook_event_name: 'InstructionsLoaded' }) },
    { label: 'WtCr',    color: '#f0ad4e', fn: () => postHook({ session_id: sessionId, hook_event_name: 'WorktreeCreate', tool_input: { path: '/tmp/wt-test' } }) },
    { label: 'WtRm',    color: '#f0ad4e', fn: () => postHook({ session_id: sessionId, hook_event_name: 'WorktreeRemove', tool_input: { path: '/tmp/wt-test' } }) },
    { label: 'Cfg',     color: '#b8a8d8', fn: () => postHook({ session_id: sessionId, hook_event_name: 'ConfigChange' }) },
  ]

  if (!isOpen) return null

  return (
    <div className="panel-overlay">
      <div className="debug-panel-header">
        <span className="debug-panel-title">debug</span>
        <button className="debug-close" onClick={onClose}>×</button>
      </div>

      <div className="debug-tool-grid">
        {TOOL_BTNS.map(({ label, color, fn }) => (
          <button
            key={label}
            className="debug-tool-btn"
            style={{ '--tool-color': color } as React.CSSProperties}
            onClick={fn}
            title={label}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="debug-history-section">
        <button className="debug-reload-btn" onClick={pullHistorySessions} disabled={historyLoading}>
          {historyLoading ? '…' : 'reload'}
        </button>
        {historySessions.length > 0 && (
          <div className="debug-history-list">
            {historySessions.map(s => (
              <div key={s.id} className="debug-history-row">
                <span className="debug-history-id" title={s.id}>{s.id.slice(0, 16)}</span>
                <button
                  className="debug-load-btn"
                  onClick={() => loadHistorySession(s.id)}
                  disabled={historyLoadId === s.id}
                >
                  {historyLoadId === s.id ? '…' : 'load'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
