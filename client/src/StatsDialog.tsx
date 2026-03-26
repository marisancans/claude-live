import { useEffect, useState } from 'react'

interface Stats {
  total_events: number
  total_sessions: number
  db_size_bytes: number
  oldest_event_ms: number
  newest_event_ms: number
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1073741824) return `${(bytes / 1048576).toFixed(1)} MB`
  return `${(bytes / 1073741824).toFixed(1)} GB`
}

function formatTimeSpan(oldest: number, newest: number): string {
  if (oldest === 0 || newest === 0) return 'n/a'
  const diff = newest - oldest
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(hours / 24)
  if (days > 0) return `${days}d ${hours % 24}h`
  if (hours > 0) return `${hours}h`
  const mins = Math.floor(diff / 60000)
  return `${mins}m`
}

export function StatsDialog({ onClose }: { onClose: () => void }) {
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.json())
      .then(setStats)
      .catch(() => setError('Failed to load stats'))
  }, [])

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.5)', zIndex: 9999,
    }} onClick={onClose}>
      <div style={{
        background: '#1a1a2e', border: '1px solid #333',
        borderRadius: 8, padding: '20px 28px', minWidth: 280,
        color: '#e0e0e0', fontFamily: 'monospace', fontSize: 13,
      }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 14, color: '#fff' }}>
          Database Stats
        </div>
        {error && <div style={{ color: '#f87171' }}>{error}</div>}
        {!stats && !error && <div style={{ color: '#888' }}>Loading...</div>}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '6px 16px' }}>
            <span style={{ color: '#888' }}>Events</span>
            <span>{stats.total_events.toLocaleString()}</span>
            <span style={{ color: '#888' }}>Sessions</span>
            <span>{stats.total_sessions.toLocaleString()}</span>
            <span style={{ color: '#888' }}>DB Size</span>
            <span>{formatBytes(stats.db_size_bytes)}</span>
            <span style={{ color: '#888' }}>Time Span</span>
            <span>{formatTimeSpan(stats.oldest_event_ms, stats.newest_event_ms)}</span>
          </div>
        )}
        <div style={{ marginTop: 16, textAlign: 'right' }}>
          <button onClick={onClose} style={{
            background: '#333', border: 'none', color: '#ccc',
            padding: '4px 14px', borderRadius: 4, cursor: 'pointer', fontSize: 12,
          }}>Close</button>
        </div>
      </div>
    </div>
  )
}
