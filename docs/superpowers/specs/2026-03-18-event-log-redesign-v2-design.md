# Event Log Redesign v2 — Design Spec

**Date:** 2026-03-18 (revision)

**Goal:** Replace the static event log with a time-decay live feed showing 5 entries max, each visible for 5 seconds then fading out. Move operations and debug panels to the top bar as separate icon buttons.

---

## Architecture

**Event log (bottom-left):**
- Shows up to 5 most recent entries
- Each entry displayed for 5 seconds, then fades out over 1 second (seconds 4-5)
- When empty: displays only the history button
- History button: always present, opens overlay showing all past entries (capped at 100)

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
- For entries age 4000-5000ms, apply fade: `opacity = 1 - ((age - 4000) / 1000)`
- Remove from DOM once age >= 5000ms
- Use `setInterval` or `requestAnimationFrame` to update `now` frequently (e.g., 60fps or every 100ms)

**Structure:**
```tsx
<div className="event-log-container">
  {/* Live entries (age < 5s) */}
  {liveEntries.length > 0 ? (
    <div className="event-log">
      {liveEntries.map(entry => (
        <div key={entry.id} className="event-log-entry" style={{ opacity: calculateOpacity(entry) }}>
          {/* existing entry rendering */}
        </div>
      ))}
    </div>
  ) : null}

  {/* History button always visible */}
  <button className="event-log-history-btn" onClick={() => setHistoryOpen(true)}>
    {liveEntries.length > 0 ? `history (${entries.length})` : 'history'}
  </button>

  {/* History overlay */}
  {historyOpen && <HistoryOverlay entries={entries} onClose={() => setHistoryOpen(false)} />}
</div>
```

---

## Top Bar Buttons

**File:** `client/src/App.tsx` (add to HUD section)

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

**LogEntry** (unchanged):
```typescript
export interface LogEntry {
  id: string
  tool: string
  file: string
  sessionLabel: string
  project: string
  colorHex: string
  createdAt?: number  // NEW: timestamp for age calculation (ms since epoch)
}
```

**Changes to App.tsx:**
- When adding entries to `eventLog`, include `createdAt: Date.now()`

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
