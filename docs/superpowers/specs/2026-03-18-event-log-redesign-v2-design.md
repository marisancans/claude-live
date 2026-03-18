# Event Log Redesign v2 — Design Spec

**Date:** 2026-03-18 (revision)

**Goal:** Replace the static event log with a time-decay live feed showing 5 entries max, each visible for 5 seconds then fading out. Move operations and debug panels to the top bar as separate icon buttons.

**Status:** SUPERSEDES 2026-03-18-event-log-redesign.md (the initial plan). This is a **complete architectural redesign** that requires:
- Rewriting EventLog.tsx (from position-based opacity to time-decay with rAF update loop)
- Adding `createdAt` field to LogEntry interface
- Refactoring existing DebugPanel (remove internal toggle, accept external control props)
- Replacing existing help button with new OperationsPanel component in top bar

---

## Architecture

**Event log (bottom-left):**
- Shows up to 5 most recent entries (age < 5 seconds)
- Each entry displayed for 5 seconds, then fades out over 1 second (seconds 4-5)
- History button: Always visible. When live entries exist, shows `history (N)` count. When no live entries, shows just `history`
- History overlay: Shows all past entries (capped at 100), newest first

**Top bar (near sound/autofit icons):**
- Two new icon buttons added
- Operations button: opens panel with node types legend and animation style guide
- Debug button: opens panel with current stats (event count, session count, last event)

**Data flow:**
- `App.tsx` maintains `eventLog[]` as before (100 max entries)
- `EventLog` component receives full array but only renders entries younger than 5 seconds
- Each entry has `createdAt` timestamp for age calculation
- Entries remain in array after visual fade (accessible via history)

---

## EventLog Component

**File:** `client/src/EventLog.tsx` (replaces current)

**Props:**
```typescript
interface Props {
  entries: LogEntry[]  // full array from App.tsx (up to 100)
}
```

**Behavior:**
- Calculate age of each entry: `now - entry.createdAt`
- Show entries where age < 5000ms (5 seconds)
- Opacity calculation (full range):
  - age 0-4000ms: `opacity = 1.0` (fully visible)
  - age 4000-5000ms: `opacity = 1.0 - ((age - 4000) / 1000)` (fade from 1.0 to 0.0)
  - age >= 5000ms: remove from DOM
- Update mechanism: `useEffect` with `requestAnimationFrame` loop (60fps) to recalculate opacity and remove expired entries on every frame

**Architecture:**
- `EventLog` owns the update loop via `useEffect` with `requestAnimationFrame`
- Local state: `now` (current timestamp), `historyOpen` (boolean)
- On every rAF tick: filter entries by age < 5000ms, calculate opacity for each, update DOM
- `HistoryOverlay` is a sub-component (can be inline or separate file)

**Structure:**
```tsx
export function EventLog({ entries }: Props) {
  const [now, setNow] = useState(Date.now())
  const [historyOpen, setHistoryOpen] = useState(false)

  // Update loop: run on every frame to recalculate ages and opacities
  useEffect(() => {
    let rafId: number
    const update = () => {
      setNow(Date.now())
      rafId = requestAnimationFrame(update)
    }
    rafId = requestAnimationFrame(update)
    return () => cancelAnimationFrame(rafId)
  }, [])

  // Filter to live entries (age < 5000ms)
  const liveEntries = entries.filter(e => (now - e.createdAt) < 5000)

  return (
    <div className="event-log-container">
      {liveEntries.length > 0 && (
        <div className="event-log">
          {liveEntries.map(entry => {
            const age = now - entry.createdAt
            const opacity = age < 4000 ? 1.0 : 1.0 - ((age - 4000) / 1000)
            return (
              <div key={entry.id} className="event-log-entry" style={{ opacity, '--entry-color': entry.colorHex } as React.CSSProperties}>
                {/* entry rendering: dot + tool + file + session */}
              </div>
            )
          })}
        </div>
      )}

      {/* History button always visible */}
      <button className="event-log-history-btn" onClick={() => setHistoryOpen(true)}>
        {liveEntries.length > 0 ? `history (${entries.length})` : 'history'}
      </button>

      {/* History overlay (shows all 100 entries, newest first) */}
      {historyOpen && (
        <div className="event-log-history">
          <button className="event-log-history-back" onClick={() => setHistoryOpen(false)}>← live</button>
          {[...entries].reverse().map(entry => (
            <div key={entry.id} className="event-log-entry event-log-entry--static" style={{ opacity: 0.7, '--entry-color': entry.colorHex } as React.CSSProperties}>
              {/* entry rendering: same as live view */}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

---

## Existing Code Replacement

**Help button conflict:**
The existing `? operations` button in bottom-left (App.tsx line 382) opens a help overlay with node type legend. This is being **replaced** by the new Operations button in the top bar. Remove the old help button code.

**DebugPanel conflict:**
The existing DebugPanel in bottom-left (App.tsx line 396) has an internal toggle button. This is being **moved** to the top bar. Refactor DebugPanel to remove internal toggle logic and accept `isOpen` and `onClose` props instead.

---

## Top Bar Buttons

**File:** `client/src/App.tsx` (add to HUD section, replace existing help button)

**Operations Button:**
- Icon: `?` or similar help icon
- Placement: top-right, near sound/autofit buttons
- Styling: same as sound/autofit (square, dark, minimal, ~32px)
- Click: opens `OperationsPanel`
- Content shown: node types legend + animation styles guide

**Debug Button:**
- Icon: `⚙` or similar settings icon
- Placement: top-right, near sound/autofit buttons
- Styling: same as sound/autofit
- Click: opens `DebugPanel`
- Content shown: event count, session count, last event (existing debug content)

---

## OperationsPanel Component

**File:** `client/src/OperationsPanel.tsx` (new)

**Trigger:** Click operations button in top bar

**Content:**

**Section 1: Node Types**
List all node types with their colors and visual representations:
- File (green dot) - file on disk
- Agent (cyan dot) - running subagent
- Session (blue dot) - Claude Code session
- Tool (various colors) - execution tools (Read, Edit, Bash, etc.)
- (Any other types used in visualization)

**Section 2: Animation Styles**
Explain what each animation represents:
- **Slide-in bounce** (entry appears) - new event arrived
- **Dot pop** - emphasized arrival
- **Scan shimmer** (left-to-right) - execution/processing
- **Fade with age** - passage of time

**Layout:**
- Modal overlay or slide-in panel from top-right
- Max-width ~400px, scrollable if needed
- Close button (×) or click outside to dismiss
- Dark theme matching existing UI

---

## DebugPanel Component

**File:** `client/src/DebugPanel.tsx` (relocated from bottom-left)

**Trigger:** Click debug button in top bar

**Content (unchanged from current):**
- Event count
- Session count
- Last event info

**Layout:**
- Same modal/slide-in style as OperationsPanel
- Max-width ~300px
- Close button or click outside to dismiss

---

## CSS Changes

**Event log entry fade animation:**
```css
/* Time-decay fade happens in JS, not CSS */
/* opacity is calculated dynamically and applied inline */
```

**Top bar buttons:**
```css
.hud-button {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 4px;
  color: #666;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}
.hud-button:hover {
  color: #aaa;
}
```

**Panel overlays:**
```css
.panel-overlay {
  position: fixed;
  top: 0;
  right: 0;
  max-width: 400px;
  max-height: 100vh;
  background: rgba(2, 2, 9, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 16px;
  overflow-y: auto;
  z-index: 100;
}
```

---

## Data Model

**LogEntry** (add createdAt field):
```typescript
export interface LogEntry {
  id: string
  tool: string
  file: string
  sessionLabel: string
  project: string
  colorHex: string
  createdAt: number  // REQUIRED: timestamp when entry was added (ms since epoch, from Date.now())
}
```

**Changes to App.tsx:**
- When adding entries to `eventLog` (lines 242-252), add `createdAt: Date.now()` to every entry
- This is required for time-decay calculation in EventLog

---

## Integration Points

| Component | Location | Change |
|-----------|----------|--------|
| `EventLog.tsx` | `client/src/` | Replace current (add time-decay, remove history toggle state if moving to separate component) |
| `OperationsPanel.tsx` | `client/src/` | New presentational component |
| `DebugPanel.tsx` | `client/src/` | Relocate from bottom-left to top-right, open via button |
| `App.tsx` | Modify | Add operations/debug buttons to HUD, add `createdAt` to LogEntry creation, pass eventLog to EventLog |
| `index.css` | Modify | Add `.hud-button` and `.panel-overlay` styles |

---

## Behavior Summary

1. **Live view:** Shows newest 5 entries, each visible exactly 5 seconds then fades out over 1 second
2. **Empty state:** Shows only history button when no entries younger than 5 seconds
3. **History:** All entries (up to 100) persisted and retrievable via history button
4. **Top bar:** Operations button shows node types + animation guide; Debug button shows stats
5. **Panels:** Both open as overlays from top-right, close via button or click-outside

---

## Non-Goals

- No changes to visualization canvas
- No changes to event stream or cluster positioning
- No persistence across page reload
- No filters or search in history
