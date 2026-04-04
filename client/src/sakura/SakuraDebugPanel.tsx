import { useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import type { ProjectVisualState, HookDraft } from './types'

interface Props {
  isOpen: boolean
  onToggle: () => void
  projects: ProjectVisualState[]
  selectedProjectId: string | null
  replayStatus: string
  onSelectProject: (id: string) => void
  onReplayProject: (id: string, persisted: boolean) => Promise<number>
  onStopReplay: () => void
  onInjectEvent: (event: HookDraft) => Promise<void>
}

const fieldStyle: CSSProperties = {
  width: '100%', background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)', color: '#e8d4c0',
  padding: '6px 8px', fontFamily: 'IBM Plex Mono, monospace', fontSize: 10,
}
const btnStyle: CSSProperties = {
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
  color: '#e8d4c0', padding: '5px 8px', cursor: 'pointer',
  fontFamily: 'IBM Plex Mono, monospace', fontSize: 10,
}

export function SakuraDebugPanel({
  isOpen, onToggle, projects, selectedProjectId, replayStatus,
  onSelectProject, onReplayProject, onStopReplay, onInjectEvent,
}: Props) {
  const [relativePath, setRelativePath] = useState('client/src/sakura/SakuraApp.ts')
  const [busy, setBusy] = useState<string | null>(null)

  const selected = useMemo(
    () => projects.find(p => p.project.id === selectedProjectId) ?? projects[0] ?? null,
    [projects, selectedProjectId],
  )

  const absolutePath = useMemo(() => {
    if (!selected) return relativePath
    const clean = relativePath.replace(/^\/+/, '')
    return clean ? `${selected.project.root}/${clean}` : selected.project.root
  }, [relativePath, selected])

  async function fire(label: string, draft: HookDraft) {
    setBusy(label)
    try { await onInjectEvent(draft) } finally { setBusy(null) }
  }

  function buildDraft(kind: string): HookDraft | null {
    if (!selected) return null
    const base = { session_id: 'sakura-debug', cwd: selected.project.root }
    if (kind === 'Read') return { ...base, hook_event_name: 'PreToolUse', tool_name: 'Read', tool_input: { file_path: absolutePath } }
    if (kind === 'Edit') return { ...base, hook_event_name: 'PreToolUse', tool_name: 'Edit', tool_input: { file_path: absolutePath } }
    if (kind === 'Bash') return { ...base, hook_event_name: 'PreToolUse', tool_name: 'Bash', tool_input: { command: 'npm run build' } }
    if (kind === 'Grep') return { ...base, hook_event_name: 'PreToolUse', tool_name: 'Grep', tool_input: { pattern: '*.tsx', path: selected.project.root } }
    if (kind === 'Fetch') return { ...base, hook_event_name: 'PreToolUse', tool_name: 'WebFetch', tool_input: { url: 'https://example.com' } }
    if (kind === 'Prompt') return { ...base, hook_event_name: 'UserPromptSubmit', prompt: 'test prompt' }
    if (kind === 'Error') return { ...base, hook_event_name: 'PostToolUseFailure', tool_name: 'Read', tool_input: { file_path: absolutePath }, error: 'test error' }
    if (kind === 'Agent') return { ...base, hook_event_name: 'SubagentStart', agent_id: `agent-${Date.now().toString(36)}`, agent_type: 'general' }
    if (kind === 'Session') return { ...base, hook_event_name: 'SessionStart' }
    return null
  }

  const toolButtons = [
    { label: 'Read', color: '#d4a574' }, { label: 'Edit', color: '#7ec8e3' },
    { label: 'Bash', color: '#f59e0b' }, { label: 'Grep', color: '#c084fc' },
    { label: 'Fetch', color: '#fb7185' },
  ]
  const eventButtons = [
    { label: 'Prompt', color: '#ffd4a8' }, { label: 'Error', color: '#f87171' },
    { label: 'Agent', color: '#d8b4fe' }, { label: 'Session', color: '#e8c4a0' },
  ]

  return (
    <>
      <button onClick={onToggle} style={{
        position: 'absolute', left: 18, bottom: 18, zIndex: 24,
        padding: '7px 10px', border: '1px solid rgba(196,149,106,0.28)',
        background: 'rgba(14,10,8,0.7)', color: '#c4956a',
        fontFamily: 'IBM Plex Mono, monospace', fontSize: 10,
        letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
        backdropFilter: 'blur(16px)',
      }}>
        {isOpen ? 'close' : 'sakura'}
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute', left: 18, bottom: 52, zIndex: 25,
          width: 320, maxHeight: 'calc(100vh - 80px)', overflowY: 'auto',
          padding: 12, border: '1px solid rgba(255,255,255,0.08)',
          background: 'linear-gradient(180deg, rgba(14,10,8,0.94), rgba(10,7,5,0.98))',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)', backdropFilter: 'blur(22px)',
          color: '#e8d4c0', fontFamily: 'IBM Plex Mono, monospace',
        }}>
          {/* Session selector */}
          <div style={{ marginBottom: 10 }}>
            <select value={selected?.project.id ?? ''} onChange={e => onSelectProject(e.target.value)} style={{ ...fieldStyle, marginBottom: 6 }}>
              {projects.map(p => <option key={p.project.id} value={p.project.id}>{p.project.label}</option>)}
            </select>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4 }}>
              <button onClick={async () => { if (!selected) return; setBusy('buf'); try { await onReplayProject(selected.project.id, false) } finally { setBusy(null) } }} style={btnStyle} disabled={busy !== null}>replay buf</button>
              <button onClick={async () => { if (!selected) return; setBusy('saved'); try { await onReplayProject(selected.project.id, true) } finally { setBusy(null) } }} style={btnStyle} disabled={busy !== null}>replay saved</button>
              <button onClick={onStopReplay} style={btnStyle}>stop</button>
            </div>
            {replayStatus !== 'idle' && <div style={{ fontSize: 9, color: '#8a7a6a', marginTop: 4 }}>{replayStatus}</div>}
          </div>

          {/* Event buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
            {toolButtons.map(b => (
              <button key={b.label} onClick={() => { const d = buildDraft(b.label); if (d) fire(b.label, d) }}
                style={{ ...btnStyle, color: b.color, borderColor: `${b.color}33`, flex: '1 0 auto' }}>{b.label}</button>
            ))}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
            {eventButtons.map(b => (
              <button key={b.label} onClick={() => { const d = buildDraft(b.label); if (d) fire(b.label, d) }}
                style={{ ...btnStyle, color: b.color, borderColor: `${b.color}33`, flex: '1 0 auto' }}>{b.label}</button>
            ))}
          </div>

          {/* Path input */}
          <input value={relativePath} onChange={e => setRelativePath(e.target.value)} placeholder="relative path" style={{ ...fieldStyle, marginBottom: 4 }} />
          <div style={{ fontSize: 9, color: '#6a5a4a', wordBreak: 'break-all' }}>{absolutePath}</div>
        </div>
      )}
    </>
  )
}
