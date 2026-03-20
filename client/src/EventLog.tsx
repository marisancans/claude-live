import { useState, useEffect, useMemo } from 'react'
import type { LogEntry } from './App'

interface Props {
  entries: LogEntry[]
}

// Constants for time-decay behavior
const MAX_LIVE_AGE = 5000       // milliseconds
const FADE_START_TIME = 4000    // when fade begins
const FADE_DURATION = 1000      // fade-out duration
const RAF_THROTTLE = 100        // update now every 100ms, not every frame

export function EventLog({ entries }: Props) {
  const [now, setNow] = useState(Date.now())
  const [historyOpen, setHistoryOpen] = useState(false)

  // Update loop: throttle to ~100ms intervals to reduce re-renders
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

  // Calculate opacity for a single entry based on its age
  const calculateOpacity = (entry: LogEntry): number => {
    const age = now - entry.createdAt
    if (age >= MAX_LIVE_AGE) return 0
    if (age < FADE_START_TIME) return 1.0
    return 1.0 - ((age - FADE_START_TIME) / FADE_DURATION)
  }

  // Memoize live entries filtering
  const liveEntries = useMemo(
    () => entries.filter(e => (now - e.createdAt) < MAX_LIVE_AGE).slice(-5),
    [entries, now]
  )

  // Memoize reversed entries for history
  const reversedEntries = useMemo(
    () => [...entries].reverse(),
    [entries]
  )

  return (
    <div className="event-log-container">
      {/* Live view: show entries < 5 seconds old */}
      {liveEntries.length > 0 && (
        <div className="event-log">
          {liveEntries.map(entry => {
            const opacity = calculateOpacity(entry)
            return (
              <div
                key={`live-${entry.id}`}
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
        <div className="event-log-history" aria-modal="true">
          <button className="event-log-history-back" onClick={() => setHistoryOpen(false)}>← live</button>
          {reversedEntries.map(entry => (
            <div
              key={`history-${entry.id}`}
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
