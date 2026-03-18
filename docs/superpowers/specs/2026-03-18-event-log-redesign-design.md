# Event Log Redesign — Design Spec

**Date:** 2026-03-18

## Goal

Replace the current static debug log with an animated live event log: entries appear and fade with age, max 5 visible at once, with a toggleable history overlay showing the last 100 events.

---

## Architecture

The `EventLog` component is purely presentational. `App.tsx` continues to own all event processing (deduplication, label resolution, color assignment) — the component receives a pre-processed `LogEntry[]` prop.

**Changes to `App.tsx`:**
- Increase `MAX_LOG` from 10 → 100
- Export the `LogEntry` interface
- Add `import { EventLog } from './EventLog'`
- Pass `eventLog` as prop to `<EventLog entries={eventLog} />`
- Remove the inline `<div className="event-log">...</div>` rendering block

**New file: `client/src/EventLog.tsx`**
- Receives `entries: LogEntry[]` (the full capped array from App.tsx)
- Manages only `historyOpen: boolean` in local state

No `constants.ts` extraction — `App.tsx` already has the authoritative `TOOL_COLORS` map (21 entries) and the color logic stays there.

---

## LogEntry Interface

Use the existing `LogEntry` interface from `App.tsx` — add `export` to it:

```typescript
export interface LogEntry {
  id: string           // string (from RawEvent.id)
  tool: string
  file: string
  sessionLabel: string
  project: string      // populated but not rendered in the log UI
  colorHex: string
}
```

`EventLog` imports `LogEntry` from `./App`.

---

## Deduplication & Entry Content

`App.tsx` already handles deduplication via the `skipDuplicate` guard and populates `entry.file` using `fileLabel`/`enrichedFileLabel`. `EventLog` renders `entry.file` directly.

---

## DOM Structure

```tsx
<div className="event-log-container">   {/* position: relative */}

  {!historyOpen && (
    <div className="event-log">         {/* existing CSS — flex-col, gap:5px, max-width:250px */}
      {entries.slice(-5).reverse().map((entry, i) => (
        <div key={entry.id} className="event-log-entry" style={{ opacity: AGE_OPACITY[i], '--entry-color': entry.colorHex }}>
          <div className="event-log-dot" style={{ background: entry.colorHex }} />
          <span className="event-log-tool" style={{ color: entry.colorHex }}>{entry.tool}</span>
          {entry.file && <span className="event-log-file">{entry.file}</span>}
          <span className="event-log-session">{entry.sessionLabel}</span>
        </div>
      ))}
      <button className="event-log-history-btn" onClick={() => setHistoryOpen(true)}>
        history ({entries.length})
      </button>
    </div>
  )}

  {historyOpen && (
    <div className="event-log-history">  {/* see CSS below */}
      <button className="event-log-history-back" onClick={() => setHistoryOpen(false)}>← live</button>
      {[...entries].reverse().map(entry => (
        <div key={entry.id} className="event-log-entry event-log-entry--static" style={{ opacity: 0.7, '--entry-color': entry.colorHex }}>
          <div className="event-log-dot" style={{ background: entry.colorHex }} />
          <span className="event-log-tool" style={{ color: entry.colorHex }}>{entry.tool}</span>
          {entry.file && <span className="event-log-file">{entry.file}</span>}
          <span className="event-log-session">{entry.sessionLabel}</span>
        </div>
      ))}
    </div>
  )}

</div>
```

---

## Age → Opacity

```typescript
const AGE_OPACITY = [1.00, 0.80, 0.55, 0.35, 0.18]
```

Index 0 = newest (highest opacity). This reverses current oldest-first ordering intentionally.

---

## Animation

**Live entries:** The existing `log-entry-in` keyframe in `index.css` already fires correctly on element mount. With `key={entry.id}`, React only mounts genuinely new entries — entries that age from position 0→1→2 keep their DOM node and do not replay the animation. No changes to the existing animation CSS needed.

**History entries:** Add `event-log-entry--static` modifier class that suppresses all animations:
```css
.event-log-entry--static,
.event-log-entry--static .event-log-dot,
.event-log-entry--static .event-log-tool {
  animation: none;
}
.event-log-entry--static::after { display: none; }  /* suppress scan shimmer */
```

---

## CSS to Add

Add to `index.css` (the existing `.event-log*` rules are preserved unchanged):

```css
/* History overlay */
.event-log-history {
  max-width: 250px;
  max-height: 220px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 5px;
  background: rgba(2, 2, 9, 0.92);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 4px;
  padding: 6px;
}
.event-log-history-back {
  font-family: 'Space Mono', monospace;
  font-size: 8px;
  color: #555;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  padding: 0 0 4px 0;
}
.event-log-history-back:hover { color: #aaa; }

/* History toggle button */
.event-log-history-btn {
  font-family: 'Space Mono', monospace;
  font-size: 7px;
  color: #333;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  padding: 2px 0 0 10px;
}
.event-log-history-btn:hover { color: #777; }
```

---

## Pointer Events

`EventLog` renders a single root `div.event-log-container` as the direct child of `.bottom-left-panel`. The existing rule `.bottom-left-panel > * { pointer-events: all }` applies to this container, making all its descendants interactive.

---

## Integration Points Summary

| File | Change |
|------|--------|
| `App.tsx` | `MAX_LOG: 10 → 100`, export `LogEntry`, add `<EventLog entries={eventLog} />`, remove old `<div className="event-log">` block |
| `client/src/EventLog.tsx` | New file — presentational component |
| `client/src/index.css` | Add history overlay CSS + `event-log-entry--static` modifier |

---

## Non-Goals

- No per-entry click-to-expand detail
- No filtering by tool type or session
- No persistence across page refresh
- No `constants.ts` extraction
