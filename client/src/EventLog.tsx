import { useState, useEffect, useMemo } from 'react'
import type { LogEntry } from './App'

interface Props {
  entries: LogEntry[]
}

// Constants for time-decay behavior
const MAX_LIVE_AGE = 5000       // milliseconds
const FADE_START_TIME = 4000    // when fade begins
const FADE_DURATION = 1000      // fade-out duration
const RAF_THROTTLE = 100        // update every 100ms
/** Extract just the filename from a path */
function basename(path: string): string {
  return path.split('/').pop() ?? path
}


export function EventLog({ entries }: Props) {
  const [now, setNow] = useState(Date.now())
  const [historyOpen, setHistoryOpen] = useState(false)

  useEffect(() => {
    let rafId: number
    let lastUpdateTime = Date.now()

    const update = () => {
      const currentTime = Date.now()
      if (currentTime - lastUpdateTime >= RAF_THROTTLE) {
        setNow(currentTime)
        lastUpdateTime = currentTime
      }
      rafId = requestAnimationFrame(update)
    }

    rafId = requestAnimationFrame(update)
    return () => cancelAnimationFrame(rafId)
  }, [])

  const calculateOpacity = (entry: LogEntry): number => {
    const age = now - entry.createdAt
    if (age >= MAX_LIVE_AGE) return 0
    if (age < FADE_START_TIME) return 1.0
    return 1.0 - ((age - FADE_START_TIME) / FADE_DURATION)
  }

  const liveEntries = useMemo(
    () => entries.filter(e => (now - e.createdAt) < MAX_LIVE_AGE).slice(-6),
    [entries, now]
  )

  const reversedEntries = useMemo(
    () => [...entries].reverse(),
    [entries]
  )

  // Render a single entry row
  const renderEntry = (entry: LogEntry, isLive: boolean) => {
    const opacity = isLive ? calculateOpacity(entry) : 0.7
    const file = entry.file ? basename(entry.file) : null
    return (
      <div
        key={`${isLive ? 'live' : 'hist'}-${entry.id}`}
        className={`elog-row ${isLive ? '' : 'elog-row--static'}`}
        style={{ opacity, '--entry-color': entry.colorHex } as React.CSSProperties}
      >
        <span className="elog-dot" style={{ background: entry.colorHex, boxShadow: `0 0 6px ${entry.colorHex}55` }} />
        <span className="elog-tool" style={{ color: entry.colorHex }}>{entry.tool}</span>
        {file && <span className="elog-file">{file}</span>}
        <span className="elog-id">{entry.id.slice(-6)}</span>
      </div>
    )
  }

  return (
    <div className="elog">
      {/* Live entries — hidden when history is open */}
      {!historyOpen && liveEntries.length > 0 && (
        <div className="elog-live">
          {liveEntries.map(e => renderEntry(e, true))}
        </div>
      )}

      {/* History toggle */}
      <button className="elog-hist-btn" onClick={() => setHistoryOpen(!historyOpen)}>
        {historyOpen ? '× close' : `▸ history ${entries.length > 0 ? `(${entries.length})` : ''}`}
      </button>

      {/* History panel */}
      {historyOpen && (
        <div className="elog-hist">
          <div className="elog-hist-header">
            <span className="elog-hist-title">event history</span>
            <span className="elog-hist-count">{entries.length}</span>
            <button className="elog-hist-close" onClick={() => setHistoryOpen(false)}>×</button>
          </div>
          <div className="elog-hist-scroll">
            {reversedEntries.map(e => renderEntry(e, false))}
          </div>
        </div>
      )}
    </div>
  )
}
