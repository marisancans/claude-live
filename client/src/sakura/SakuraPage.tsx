import { useEffect, useRef, useState } from 'react'
import type { RawEvent } from '../types'
import { SakuraScene } from './SakuraScene'
import { SakuraDebugPanel } from './SakuraDebugPanel'
import type { HookDraft, ProjectActivity, ProjectSummary, ProjectTreePayload, ProjectVisualState, SignalEnvelope } from './types'

const EMPTY_ACTIVITY: ProjectActivity = {
  eventCount: 0,
  sessionCount: 0,
  lastEventTime: 0,
  lastTool: null,
}

function labelForPath(root: string) {
  const parts = root.split('/').filter(Boolean)
  return parts[parts.length - 1] || root
}

function mergeProjects(existing: ProjectSummary[], incoming: ProjectSummary[]) {
  const map = new Map(existing.map(p => [p.id, p]))
  for (const p of incoming) {
    const c = map.get(p.id)
    map.set(p.id, c ? { ...c, ...p } : p)
  }
  return [...map.values()].sort((a, b) => b.lastEventTime - a.lastEventTime || a.label.localeCompare(b.label))
}

function dedupKey(event: RawEvent) {
  if (event.tool_use_id) return `${event.session_id}:${event.hook_event_name}:${event.tool_use_id}`
  if (event.hook_event_name === 'UserPromptSubmit' && event.prompt) return `${event.session_id}:prompt:${event.prompt.slice(0, 80)}`
  if (event.hook_event_name === 'SessionStart') return `${event.session_id}:start`
  return event.id
}

function shouldAnimate(event: RawEvent) {
  return (
    event.hook_event_name === 'PreToolUse'
    || event.hook_event_name === 'PostToolUseFailure'
    || event.hook_event_name === 'UserPromptSubmit'
    || event.hook_event_name === 'SessionStart'
    || event.hook_event_name === 'SubagentStart'
    || event.hook_event_name === 'Notification'
    || event.hook_event_name === 'PermissionRequest'
  )
}

function updateActivity(prev: Record<string, ProjectActivity>, event: RawEvent) {
  if (!event.cwd) return prev
  const cur = prev[event.cwd] ?? EMPTY_ACTIVITY
  return {
    ...prev,
    [event.cwd]: {
      eventCount: cur.eventCount + 1,
      sessionCount: event.session_id ? Math.max(cur.sessionCount, 1) : cur.sessionCount,
      lastEventTime: Math.max(cur.lastEventTime, event.timestamp || Date.now()),
      lastTool: event.tool_name || event.hook_event_name || cur.lastTool,
    },
  }
}

export function SakuraPage() {
  const [projects, setProjects] = useState<ProjectSummary[]>([])
  const [trees, setTrees] = useState<Record<string, ProjectTreePayload>>({})
  const [activity, setActivity] = useState<Record<string, ProjectActivity>>({})
  const [latestSignal, setLatestSignal] = useState<SignalEnvelope | null>(null)
  const [connection, setConnection] = useState<'connecting' | 'connected' | 'disconnected'>('connecting')
  const [loading, setLoading] = useState(true)
  const [historyCount, setHistoryCount] = useState(0)
  const [lastEventLabel, setLastEventLabel] = useState('waiting')
  const pendingTreesRef = useRef(new Set<string>())
  const signalSeqRef = useRef(0)
  const recentKeysRef = useRef(new Map<string, number>())
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [debugOpen, setDebugOpen] = useState(false)
  const [hudOpen, setHudOpen] = useState(false)
  const [replayStatus, setReplayStatus] = useState('idle')
  const [resetSignal, setResetSignal] = useState(0)
  const replayTimerRef = useRef<number | null>(null)

  async function fetchProjectTree(projectId: string, force = false) {
    if (!force && (trees[projectId] || pendingTreesRef.current.has(projectId))) return
    pendingTreesRef.current.add(projectId)
    try {
      const res = await fetch(`/api/project-tree?project=${encodeURIComponent(projectId)}`)
      if (!res.ok) return
      const tree = await res.json() as ProjectTreePayload
      setTrees(prev => ({ ...prev, [tree.projectId]: tree }))
    } finally {
      pendingTreesRef.current.delete(projectId)
    }
  }

  // Initial load
  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [pRes, hRes] = await Promise.all([fetch('/api/projects'), fetch('/api/history')])
        const pJson = await pRes.json() as { projects?: ProjectSummary[] }
        const history = await hRes.json() as RawEvent[]
        if (cancelled) return
        setProjects(mergeProjects([], pJson.projects ?? []))
        setHistoryCount(history.length)
        setActivity(history.reduce((acc, e) => updateActivity(acc, e), {} as Record<string, ProjectActivity>))
      } catch { /* keep empty */ }
      finally { if (!cancelled) setLoading(false) }
    }
    load()
    const refresh = setInterval(async () => {
      try {
        const res = await fetch('/api/projects')
        const json = await res.json() as { projects?: ProjectSummary[] }
        if (!cancelled) setProjects(prev => mergeProjects(prev, json.projects ?? []))
      } catch { /* keep existing */ }
    }, 15000)
    return () => { cancelled = true; clearInterval(refresh) }
  }, [])

  // Fetch trees for new projects
  useEffect(() => {
    for (const p of projects) {
      if (trees[p.id] || pendingTreesRef.current.has(p.id)) continue
      void fetchProjectTree(p.id)
    }
  }, [projects, trees])

  // SSE connection
  useEffect(() => {
    const recent = recentKeysRef.current
    const es = new EventSource('/events')
    es.onopen = () => setConnection('connected')
    es.onerror = () => setConnection('disconnected')
    es.onmessage = (msg) => {
      try {
        const parsed = JSON.parse(msg.data)
        if (parsed.type !== 'event') return
        const event = parsed.data as RawEvent
        if ((event.hook_event_name as string) === 'Diagnostic') return

        const key = dedupKey(event)
        const now = Date.now()
        if (recent.has(key) && now - recent.get(key)! < 5000) return
        recent.set(key, now)
        if (recent.size > 500) {
          for (const [k, ts] of recent) { if (now - ts > 5000) recent.delete(k) }
        }

        if (event.cwd) {
          const cwd = event.cwd
          setProjects(prev => {
            const cur = prev.find(p => p.id === cwd)
            return mergeProjects(prev, [{
              id: cwd, root: cwd, label: labelForPath(cwd),
              eventCount: (cur?.eventCount ?? 0) + 1,
              sessionCount: Math.max(cur?.sessionCount ?? 0, 1),
              lastEventTime: event.timestamp || Date.now(),
            }])
          })
          setActivity(prev => updateActivity(prev, event))
        }

        setLastEventLabel(event.tool_name || event.hook_event_name || 'event')
        if (shouldAnimate(event)) {
          signalSeqRef.current += 1
          setLatestSignal({ sequence: signalSeqRef.current, event })
        }
      } catch { /* ignore */ }
    }
    return () => es.close()
  }, [])

  function stopReplay() {
    if (replayTimerRef.current !== null) { clearTimeout(replayTimerRef.current); replayTimerRef.current = null }
    setReplayStatus('idle')
  }

  async function replayProjectHistory(projectId: string, persisted: boolean) {
    stopReplay()
    setResetSignal(s => s + 1)
    setReplayStatus('loading...')
    const res = await fetch(`/api/history?project=${encodeURIComponent(projectId)}${persisted ? '&persisted=1' : ''}`)
    const events = await res.json() as RawEvent[]
    const replayable = events.filter(shouldAnimate).slice(-220)
    if (!replayable.length) { setReplayStatus('no events'); return 0 }
    let i = 0
    const step = () => {
      const event = replayable[i]
      signalSeqRef.current += 1
      setLatestSignal({ sequence: signalSeqRef.current, event })
      i++
      setReplayStatus(`${i}/${replayable.length}`)
      if (i < replayable.length) {
        replayTimerRef.current = window.setTimeout(step, event.tool_name === 'Bash' ? 160 : 90)
      } else {
        replayTimerRef.current = null
        setReplayStatus(`done (${replayable.length})`)
      }
    }
    step()
    return replayable.length
  }

  async function injectEvent(partial: HookDraft) {
    const event = {
      id: `hook-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      session_id: 'sakura-debug', timestamp: Date.now(),
      hook_event_name: 'Notification', tool_name: null, tool_input: null, tool_response: null,
      agent_id: null, agent_type: null, cwd: null, error: null, tool_use_id: null,
      prompt: null, model: null, source: 'hook', reason: null, permission_mode: null,
      is_interrupt: null, trigger: null, compact_summary: null, last_assistant_message: null,
      notification_type: null, title: null, agent_transcript_path: null, memory_type: null,
      ...partial,
    }
    await fetch('/hook', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(event) })
  }

  useEffect(() => {
    if (!selectedProjectId && projects[0]?.id) setSelectedProjectId(projects[0].id)
  }, [projects, selectedProjectId])

  useEffect(() => () => stopReplay(), [])

  const visualProjects: ProjectVisualState[] = mergeProjects(
    projects,
    Object.entries(activity)
      .filter(([id]) => !projects.some(p => p.id === id))
      .map(([id, a]) => ({
        id, root: id, label: labelForPath(id),
        eventCount: a.eventCount, sessionCount: a.sessionCount, lastEventTime: a.lastEventTime,
      })),
  ).map(p => ({
    project: p,
    tree: trees[p.id] ?? null,
    activity: activity[p.id] ?? EMPTY_ACTIVITY,
  }))

  const readyTrees = visualProjects.filter(p => p.tree).length

  // Suppress unused variable warning for loading state used implicitly
  void loading

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: '#0e0a08' }}>
      <SakuraScene projects={visualProjects} latestSignal={latestSignal} resetSignal={resetSignal} />

      <a href="#/three" style={{
        position: 'absolute', top: 18, left: 18, zIndex: 20,
        padding: '10px 14px', border: '1px solid rgba(232,196,160,0.18)',
        background: 'rgba(14,10,8,0.52)', color: '#e8c4a0', textDecoration: 'none',
        fontFamily: 'IBM Plex Mono, monospace', fontSize: 11,
        letterSpacing: '0.08em', textTransform: 'uppercase', backdropFilter: 'blur(16px)',
      }}>back to three</a>

      <button onClick={() => setHudOpen(o => !o)} style={{
        position: 'absolute', top: 18, right: 18, zIndex: 21,
        padding: '8px 12px', border: '1px solid rgba(196,149,106,0.28)',
        background: 'rgba(14,10,8,0.7)', color: '#c4956a',
        fontFamily: 'IBM Plex Mono, monospace', fontSize: 10,
        letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
        backdropFilter: 'blur(16px)',
      }}>{hudOpen ? 'hide' : 'info'}</button>

      {hudOpen && <div style={{
        position: 'absolute', top: 52, right: 18, zIndex: 20, width: 300,
        padding: '14px 16px', border: '1px solid rgba(255,255,255,0.08)',
        background: 'linear-gradient(180deg, rgba(14,10,8,0.76), rgba(10,7,5,0.9))',
        backdropFilter: 'blur(18px)', boxShadow: '0 18px 60px rgba(0,0,0,0.35)',
        color: '#e8d4c0', fontFamily: 'IBM Plex Mono, monospace',
      }}>
        <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#c4956a', marginBottom: 6 }}>sakura</div>
        <div style={{ fontFamily: 'Oxanium, sans-serif', fontSize: 24, lineHeight: 1, marginBottom: 10 }}>live project tree</div>
        <div style={{ color: '#9a8070', fontSize: 11, lineHeight: 1.6, marginBottom: 12 }}>
          Filesystem branches grow as a living sakura tree. Tool events flow as sap through branch ancestry.
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 12 }}>
          <div><div style={{ fontSize: 10, color: '#786050', marginBottom: 3 }}>link</div><div style={{ fontSize: 12 }}>{connection}</div></div>
          <div><div style={{ fontSize: 10, color: '#786050', marginBottom: 3 }}>trees</div><div style={{ fontSize: 12 }}>{readyTrees}/{visualProjects.length}</div></div>
          <div><div style={{ fontSize: 10, color: '#786050', marginBottom: 3 }}>history</div><div style={{ fontSize: 12 }}>{historyCount}</div></div>
        </div>
        <div style={{ fontSize: 10, color: '#786050', marginBottom: 4 }}>last pulse</div>
        <div style={{ fontSize: 12, marginBottom: 12 }}>{lastEventLabel}</div>
        <div style={{ fontSize: 10, color: '#786050', marginBottom: 6 }}>active roots</div>
        <div style={{ display: 'grid', gap: 6, maxHeight: 200, overflowY: 'auto' }}>
          {visualProjects.slice(0, 6).map(({ project, tree, activity: a }) => (
            <div key={project.id} style={{ padding: '8px 10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 3 }}>
                <span style={{ fontSize: 11 }}>{project.label}</span>
                <span style={{ color: '#c4956a', fontSize: 10 }}>{tree ? `${tree.stats.totalNodes} nodes` : 'loading'}</span>
              </div>
              <div style={{ color: '#6a5a4a', fontSize: 10, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{project.root}</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 4, fontSize: 10, color: '#8a7a6a' }}>
                <span>{a.eventCount} ev</span><span>{project.sessionCount} ses</span><span>{a.lastTool || 'idle'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>}

      <SakuraDebugPanel
        isOpen={debugOpen}
        onToggle={() => setDebugOpen(o => !o)}
        projects={visualProjects}
        selectedProjectId={selectedProjectId}
        replayStatus={replayStatus}
        onSelectProject={setSelectedProjectId}
        onReplayProject={replayProjectHistory}
        onStopReplay={stopReplay}
        onInjectEvent={injectEvent}
      />
    </div>
  )
}
