import { useRef, useState } from 'react'

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
}

export function DebugPanel({ sessionIds, isOpen, onClose }: Props) {
  const [sessionId, setSessionId] = useState(genId)
  const fileIdx = useRef(0)
  const cmdIdx = useRef(0)
  const agentId = useRef('agent-' + Math.random().toString(36).slice(2, 7))

  function nextFile() {
    return FILE_PATHS[fileIdx.current++ % FILE_PATHS.length]
  }
  function nextCmd() {
    return BASH_CMDS[cmdIdx.current++ % BASH_CMDS.length]
  }

  function pre(tool_name: string, tool_input: object) {
    return postHook({ session_id: sessionId, hook_event_name: 'PreToolUse', tool_name, tool_input })
  }

  const TOOL_BTNS: { label: string; color: string; fn: () => void }[] = [
    { label: 'Read',        color: '#4ade80', fn: () => pre('Read',     { file_path: nextFile() }) },
    { label: 'Edit',        color: '#60a5fa', fn: () => pre('Edit',     { file_path: nextFile() }) },
    { label: 'Write',       color: '#60a5fa', fn: () => pre('Write',    { file_path: nextFile() }) },
    { label: 'Grep',        color: '#a78bfa', fn: () => pre('Grep',     { pattern: 'useState', path: '.' }) },
    { label: 'Glob',        color: '#a78bfa', fn: () => pre('Glob',     { pattern: '**/*.tsx', path: nextFile() }) },
    { label: 'Bash',        color: '#f59e0b', fn: () => pre('Bash',     { command: nextCmd() }) },
    { label: 'WebFetch',    color: '#f472b6', fn: () => pre('WebFetch', { url: 'https://api.github.com/repos' }) },
    { label: 'Notification',color: '#34d399', fn: () => postHook({ session_id: sessionId, hook_event_name: 'Notification', tool_input: { message: 'Task complete! All files updated.' } }) },
    { label: 'Permission',  color: '#fbbf24', fn: () => postHook({ session_id: sessionId, hook_event_name: 'PermissionRequest', tool_input: { message: 'Allow bash command execution?' } }) },
    { label: 'Stop',        color: '#888888', fn: () => postHook({ session_id: sessionId, hook_event_name: 'Stop' }) },
    { label: 'SubStart',    color: '#c084fc', fn: () => postHook({ session_id: sessionId, hook_event_name: 'SubagentStart', agent_id: agentId.current, agent_type: 'general-purpose' }) },
    { label: 'SubStop',     color: '#7c3aed', fn: () => postHook({ session_id: sessionId, hook_event_name: 'SubagentStop',  agent_id: agentId.current }) },
    { label: 'SessEnd',     color: '#ef4444', fn: () => postHook({ session_id: sessionId, hook_event_name: 'SessionEnd' }) },
    { label: 'Fail',        color: '#f87171', fn: () => postHook({ session_id: sessionId, hook_event_name: 'PostToolUseFailure', tool_name: 'Read', tool_input: { file_path: nextFile() }, error: 'File not found' }) },
    { label: 'Compact↓',   color: '#94a3b8', fn: () => postHook({ session_id: sessionId, hook_event_name: 'PreCompact', trigger: 'manual' }) },
    { label: 'Compact↑',   color: '#38bdf8', fn: () => postHook({ session_id: sessionId, hook_event_name: 'PostCompact' }) },
    { label: 'Prompt',      color: '#38bdf8', fn: () => postHook({ session_id: sessionId, hook_event_name: 'UserPromptSubmit', prompt: 'Fix the login bug on the dashboard page' }) },
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
