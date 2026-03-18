import { useState } from 'react'
import type { LogEntry } from './App'

const AGE_OPACITY = [1.00, 0.80, 0.55, 0.35, 0.18]

interface Props {
  entries: LogEntry[]
}

export function EventLog({ entries }: Props) {
  const [historyOpen, setHistoryOpen] = useState(false)

  const liveEntries = entries.slice(-5).reverse()

  return (
    <div className="event-log-container">
      {!historyOpen && (
        <div className="event-log">
          {liveEntries.map((entry, i) => (
            <div
              key={entry.id}
              className="event-log-entry"
              style={{ opacity: AGE_OPACITY[i], '--entry-color': entry.colorHex } as React.CSSProperties}
            >
              <div className="event-log-dot" style={{ background: entry.colorHex }} />
              <span className="event-log-tool" style={{ color: entry.colorHex }}>{entry.tool}</span>
              {entry.file && <span className="event-log-file">{entry.file}</span>}
              <span className="event-log-session">{entry.sessionLabel}</span>
            </div>
          ))}
          {entries.length > 0 && (
            <button className="event-log-history-btn" onClick={() => setHistoryOpen(true)}>
              history ({entries.length})
            </button>
          )}
        </div>
      )}

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
