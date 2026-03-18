# Event Log Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static 10-entry event log with an animated 5-visible/100-history log that shows entries fading with age and supports a toggleable history overlay.

**Architecture:** `App.tsx` already owns all event ingestion logic — we just increase its cap to 100 and pass the array to a new `EventLog` component. `EventLog` is purely presentational: it slices/reverses for the live view, handles the history toggle, and uses existing CSS animation classes for entry slide-in.

**Tech Stack:** React 18, TypeScript, Vitest (tests in `tests/` directory), Vite dev server (`npm run dev` from repo root)

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `client/src/App.tsx` | Modify | Export `LogEntry`, bump `MAX_LOG` 10→100, add `<EventLog>`, remove old render block |
| `client/src/EventLog.tsx` | Create | Presentational component — live view + history overlay |
| `client/src/index.css` | Modify | Add history overlay CSS + `event-log-entry--static` suppressor |

---

### Task 1: Export `LogEntry` and bump `MAX_LOG` in App.tsx

**Files:**
- Modify: `client/src/App.tsx` lines 47–54 (LogEntry interface) and line 127 (MAX_LOG)

- [ ] **Step 1: Open `client/src/App.tsx` and make two changes**

Change 1 — add `export` to the `LogEntry` interface (line ~47):
```typescript
// BEFORE:
interface LogEntry {

// AFTER:
export interface LogEntry {
```

Change 2 — bump `MAX_LOG` (line ~127):
```typescript
// BEFORE:
const MAX_LOG = 10

// AFTER:
const MAX_LOG = 100
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd client && npx tsc --noEmit
```
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add client/src/App.tsx
git commit -m "feat: export LogEntry, bump MAX_LOG to 100"
```

---

### Task 2: Create EventLog component — live view

**Files:**
- Create: `client/src/EventLog.tsx`

- [ ] **Step 1: Create `client/src/EventLog.tsx` with this exact content**

```typescript
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd client && npx tsc --noEmit
```
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add client/src/EventLog.tsx
git commit -m "feat: add EventLog component with live view and history overlay"
```

---

### Task 3: Wire EventLog into App.tsx

**Files:**
- Modify: `client/src/App.tsx`

The current render block for the event log lives inside the `bottom-left-panel` div (around line 363–382):

```tsx
{/* Bottom-left: event log + help button */}
<div className="bottom-left-panel">
  <div className="event-log">
    {eventLog.map((entry, i) => {
      const age = eventLog.length - 1 - i
      const opacity = Math.max(0.12, 1 - age * 0.09)
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
  <button className="help-btn" onClick={() => setShowHelp(true)}>? operations</button>
</div>
```

- [ ] **Step 1: Add the import at the top of `client/src/App.tsx`**

After the existing imports, add:
```typescript
import { EventLog } from './EventLog'
```

- [ ] **Step 2: Replace the `<div className="event-log">` block**

Replace the entire `<div className="event-log">...</div>` block (the one with `eventLog.map`) with `<EventLog entries={eventLog} />`, keeping the wrapping `bottom-left-panel` div and help button intact:

```tsx
{/* Bottom-left: event log + help button */}
<div className="bottom-left-panel">
  <EventLog entries={eventLog} />
  <button className="help-btn" onClick={() => setShowHelp(true)}>? operations</button>
</div>
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd client && npx tsc --noEmit
```
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add client/src/App.tsx
git commit -m "feat: wire EventLog component into App.tsx"
```

---

### Task 4: Add CSS for history overlay and static entry modifier

**Files:**
- Modify: `client/src/index.css`

Find the `/* ── Event log ──` comment block (around line 233). After the last existing `.event-log-*` rule (before the `/* ── Help button` comment), append these new rules:

- [ ] **Step 1: Add CSS after the existing event log rules**

```css
/* ── Event log: static modifier (suppresses animations in history) ── */
.event-log-entry--static,
.event-log-entry--static .event-log-dot,
.event-log-entry--static .event-log-tool {
  animation: none;
}
.event-log-entry--static::after { display: none; }

/* ── Event log: history overlay ────────────────────────────────── */
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

/* ── Event log: history toggle button ──────────────────────────── */
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

- [ ] **Step 2: Run tests to ensure nothing is broken**

```bash
npm test
```
Expected: all tests pass (CSS changes cannot break unit tests)

- [ ] **Step 3: Commit**

```bash
git add client/src/index.css
git commit -m "feat: add event log history overlay and static entry CSS"
```

---

### Task 5: Manual verification

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

Open `http://localhost:5174` in a browser.

- [ ] **Step 2: Verify live view behavior**

With the server running and events flowing:
- [ ] At most 5 entries visible at once
- [ ] Newest entry (top) is full opacity, older entries fade progressively
- [ ] New entries slide in from the left (existing `log-entry-in` animation)
- [ ] The dot pops with the existing `log-dot-pop` animation
- [ ] A "history (N)" button appears below the entries when there are any events

- [ ] **Step 3: Verify history overlay**

- [ ] Click "history (N)" button → history overlay appears with all entries, newest first, uniform opacity
- [ ] Entries in history do NOT animate (no slide-in, no dot pop)
- [ ] Overlay is scrollable when there are many entries
- [ ] "← live" button at top returns to live view
- [ ] Live view resumes correctly after returning from history

- [ ] **Step 4: Verify entry count cap**

After 100+ events, the history count should stop growing at 100.

- [ ] **Step 5: Stop server and run full test suite**

```bash
npm test
```
Expected: all tests pass
