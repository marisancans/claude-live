import { useState, useEffect } from 'react'
import type { LogEntry } from './App'

interface Props {
  entries: LogEntry[]
}

export function EventLog({ entries }: Props) {
  const [now, setNow] = useState(Date.now())
  const [historyOpen, setHistoryOpen] = useState(false)

  // Update loop: runs on every frame to recalculate entry ages
  useEffect(() => {
    let rafId: number
    const update = () => {
      setNow(Date.now())
      rafId = requestAnimationFrame(update)
    }
    rafId = requestAnimationFrame(update)
    return () => cancelAnimationFrame(rafId)
  }, [])

  // Calculate opacity for a single entry based on its age
  const calculateOpacity = (entry: LogEntry): number => {
    const age = now - entry.createdAt
    if (age >= 5000) return 0       // off-screen
    if (age < 4000) return 1.0      // fully visible
    return 1.0 - ((age - 4000) / 1000)  // fade from 4-5s
  }

  // Filter to live entries (age < 5000ms)
  const liveEntries = entries.filter(e => (now - e.createdAt) < 5000)

  return (
    <div className="event-log-container">
      {/* Live view: show entries < 5 seconds old */}
      {liveEntries.length > 0 && (
        <div className="event-log">
          {liveEntries.map(entry => {
            const opacity = calculateOpacity(entry)
            return (
              <div
                key={entry.id}
                className="event-log-entry"
                style={{ opacity, '--entry-color': entry.colorHex } as React.CSSProperties}
              >
                <div className="event-log-dot" style={{ background: entry.colorHex }} />
                <span className="event-log-tool" style={{ color: entry.colorHex }}>{entry.tool}</span>
                {entry.file && <span className="event-log-file">{entry.file}</span>}
                <span className="event-log-session">{entry.sessionLabel}</span>
              </div>
            )
          })}
        </div>
      )}

      {/* History button: always visible */}
      <button className="event-log-history-btn" onClick={() => setHistoryOpen(true)}>
        {liveEntries.length > 0 ? `history (${entries.length})` : 'history'}
      </button>

      {/* History overlay: shows all entries, newest first */}
      {historyOpen && (
        <div className="event-log-history">
          <button className="event-log-history-back" onClick={() => setHistoryOpen(false)}>← live</button>
          {[...entries].reverse().map(entry => (
            <div
              key={entry.id}
              className="event-log-entry event-log-entry--static"
              style={{ opacity: 0.7, '--entry-color': entry.colorHex } as React.CSSProperties}
            >
              <div className="event-log-dot" style={{ background: entry.colorHex }} />
              <span className="event-log-tool" style={{ color: entry.colorHex }}>{entry.tool}</span>
              {entry.file && <span className="event-log-file">{entry.file}</span>}
              <span className="event-log-session">{entry.sessionLabel}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
