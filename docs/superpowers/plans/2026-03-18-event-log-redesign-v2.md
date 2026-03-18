# Event Log Redesign v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static event log with a time-decay live feed (5 sec visible + 1 sec fade), move operations and debug to top-bar buttons as modals.

**Architecture:** Complete rewrite of EventLog.tsx from position-based opacity to time-decay with requestAnimationFrame updates. Add `createdAt` timestamp to LogEntry. Refactor DebugPanel to accept external control. Create new OperationsPanel component. Update App.tsx to manage panel state and wire everything together.

**Tech Stack:** React 18, TypeScript, Vite, requestAnimationFrame API

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `client/src/App.tsx` | Modify | Add LogEntry.createdAt field, manage panel state, create/wire top-bar buttons, remove old help button code |
| `client/src/EventLog.tsx` | Rewrite | Time-decay live feed with rAF update loop (60fps), always-visible history button |
| `client/src/OperationsPanel.tsx` | Create | New modal panel showing node types + animation style legend |
| `client/src/DebugPanel.tsx` | Refactor | Accept `isOpen`/`onClose` props instead of internal toggle |
| `client/src/index.css` | Modify | Add `.hud-button` styles for top-bar buttons |

---

### Task 1: Add `createdAt` to LogEntry interface and update LogEntry creation in App.tsx

**Files:**
- Modify: `client/src/App.tsx` lines 48-55 (interface) and lines 243-251 (creation)

- [ ] **Step 1: Add `createdAt` field to LogEntry interface**

Find the `LogEntry` interface (around line 48) and add the new field:

```typescript
export interface LogEntry {
  id: string
  tool: string
  file: string
  sessionLabel: string
  project: string
  colorHex: string
  createdAt: number  // NEW: timestamp in ms from Date.now()
}
```

- [ ] **Step 2: Update entry creation to include `createdAt`**

Find where entries are added to `eventLog` (around lines 243-251 in the event stream handler). The current code looks like:

```typescript
setEventLog(prev => {
  const entry: LogEntry = {
    id: event.id,
    tool,
    file: event.hook_event_name === 'PostToolUse' ? enrichedFileLabel(event) : fileLabel(event),
    sessionLabel: cluster?.label ?? event.session_id.slice(0, 8),
    project: projectName(event.cwd),
    colorHex: TOOL_COLORS[tool] ?? '#888',
  }
  return [...prev, entry].slice(-MAX_LOG)
})
```

Add `createdAt: Date.now(),` to the entry object:

```typescript
setEventLog(prev => {
  const entry: LogEntry = {
    id: event.id,
    tool,
    file: event.hook_event_name === 'PostToolUse' ? enrichedFileLabel(event) : fileLabel(event),
    sessionLabel: cluster?.label ?? event.session_id.slice(0, 8),
    project: projectName(event.cwd),
    colorHex: TOOL_COLORS[tool] ?? '#888',
    createdAt: Date.now(),  // NEW
  }
  return [...prev, entry].slice(-MAX_LOG)
})
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd client && npx tsc --noEmit
```

Expected: No new errors (pre-existing errors in other files are OK)

- [ ] **Step 4: Commit**

```bash
git add client/src/App.tsx
git commit -m "feat: add createdAt timestamp to LogEntry interface and creation"
```

---

### Task 2: Rewrite EventLog.tsx with time-decay logic

**Files:**
- Rewrite: `client/src/EventLog.tsx`

- [ ] **Step 1: Replace entire EventLog.tsx file with new implementation**

```typescript
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd client && npx tsc --noEmit
```

Expected: No new errors

- [ ] **Step 3: Commit**

```bash
git add client/src/EventLog.tsx
git commit -m "feat: rewrite EventLog with time-decay and requestAnimationFrame loop"
```

---

### Task 3: Create OperationsPanel.tsx

**Files:**
- Create: `client/src/OperationsPanel.tsx`

- [ ] **Step 1: Create new OperationsPanel.tsx file**

```typescript
import type React from 'react'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function OperationsPanel({ isOpen, onClose }: Props) {
  if (!isOpen) return null

  return (
    <div className="panel-overlay">
      <button className="panel-close" onClick={onClose}>×</button>

      <h3>Operations</h3>

      <h4>Node Types</h4>
      <div className="operations-legend">
        <div className="legend-item">
          <div className="legend-badge" style={{ background: '#4ade80' }}>R</div>
          <span className="legend-name">Read — file operations</span>
        </div>
        <div className="legend-item">
          <div className="legend-badge" style={{ background: '#60a5fa' }}>E</div>
          <span className="legend-name">Edit / Write — editing tools</span>
        </div>
        <div className="legend-item">
          <div className="legend-badge" style={{ background: '#f59e0b' }}>B</div>
          <span className="legend-name">Bash — shell commands</span>
        </div>
        <div className="legend-item">
          <div className="legend-badge" style={{ background: '#a78bfa' }}>G</div>
          <span className="legend-name">Grep / Glob — search tools</span>
        </div>
        <div className="legend-item">
          <div className="legend-badge" style={{ background: '#f472b6' }}>↗</div>
          <span className="legend-name">WebFetch — HTTP requests</span>
        </div>
        <div className="legend-item">
          <div className="legend-badge" style={{ background: '#34d399' }}>!</div>
          <span className="legend-name">Notification — notifications</span>
        </div>
        <div className="legend-item">
          <div className="legend-badge" style={{ background: '#888888' }}>✓</div>
          <span className="legend-name">Stop — tool completion</span>
        </div>
        <div className="legend-item">
          <div className="legend-badge" style={{ background: '#c084fc' }}>⬡</div>
          <span className="legend-name">Subagent — subagent execution</span>
        </div>
      </div>

      <h4 style={{ marginTop: '16px' }}>Animation Styles</h4>
      <div className="animations-guide">
        <div className="animation-item">
          <strong>Slide-in bounce</strong> — New event arrives at top of log
        </div>
        <div className="animation-item">
          <strong>Dot pop</strong> — Emphasis animation on new entry (scale/rotate)
        </div>
        <div className="animation-item">
          <strong>Scan shimmer</strong> — Left-to-right scan effect (processing effect)
        </div>
        <div className="animation-item">
          <strong>Fade with time</strong> — Entry visibility decreases after 5 seconds
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd client && npx tsc --noEmit
```

Expected: No new errors

- [ ] **Step 3: Commit**

```bash
git add client/src/OperationsPanel.tsx
git commit -m "feat: create OperationsPanel with node types and animation legend"
```

---

### Task 4: Refactor DebugPanel.tsx to accept external control

**Files:**
- Modify: `client/src/DebugPanel.tsx` lines 32-37 (Props interface) and render logic

- [ ] **Step 1: Update Props interface in DebugPanel.tsx**

Find the Props interface (around line 32-34) and update it:

```typescript
interface Props {
  sessionIds: string[]
  isOpen: boolean       // NEW: controlled by parent
  onClose: () => void   // NEW: called to close panel
}
```

- [ ] **Step 2: Update function signature and remove internal toggle**

Update the function signature (line 36):

```typescript
export function DebugPanel({ sessionIds, isOpen, onClose }: Props) {
  const [sessionId, setSessionId] = useState(genId)
  const fileIdx = useRef(0)
  const cmdIdx = useRef(0)
  const agentId = useRef('agent-' + Math.random().toString(36).slice(2, 7))

  // REMOVE these lines:
  // const [open, setOpen] = useState(false)

  // ... rest of the component
```

- [ ] **Step 3: Wrap the entire render in a conditional check for `isOpen`**

Find the return statement (around line 120+) and wrap the JSX:

```typescript
if (!isOpen) return null

return (
  <div className="panel-overlay">
    {/* existing debug panel content */}
    {/* Change close button to call onClose() instead of setOpen(false) */}
    <button onClick={onClose}>Close</button>
    {/* ... rest of content ... */}
  </div>
)
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
cd client && npx tsc --noEmit
```

Expected: No new errors

- [ ] **Step 5: Commit**

```bash
git add client/src/DebugPanel.tsx
git commit -m "refactor: DebugPanel to accept isOpen/onClose props instead of internal state"
```

---

### Task 5: Update App.tsx to add panel state, buttons, and wire everything

**Files:**
- Modify: `client/src/App.tsx` (multiple sections)

- [ ] **Step 1: Add imports for new components**

Add these imports near the top of App.tsx (after existing imports, around line 10):

```typescript
import { OperationsPanel } from './OperationsPanel'
import { EventLog } from './EventLog'  // already exists, but verify it's imported
```

- [ ] **Step 2: Add state for panel toggles**

Find the existing state declarations (around line 164-184) and add:

```typescript
const [operationsOpen, setOperationsOpen] = useState(false)
const [debugOpen, setDebugOpen] = useState(false)
```

- [ ] **Step 3: Remove old help state and handler**

Find and remove:
- `const [showHelp, setShowHelp] = useState(false)` (around line 173)

- [ ] **Step 4: Add top-bar buttons in HUD section**

Find the HUD section (around lines 310-345, after the autofit button). After the `</button>` that closes the autofit button, add:

```tsx
      <button
        className="hud-button"
        onClick={() => setOperationsOpen(true)}
        title="Show operations legend"
        aria-label="Operations"
      >
        ?
      </button>
      <button
        className="hud-button"
        onClick={() => setDebugOpen(true)}
        title="Show debug panel"
        aria-label="Debug"
      >
        ⚙
      </button>
```

- [ ] **Step 5: Remove old help button**

Find and delete the help button around line 382:
```tsx
<button className="help-btn" onClick={() => setShowHelp(true)}>? operations</button>
```

- [ ] **Step 6: Update DebugPanel call with new props**

Find where DebugPanel is rendered (around line 396):
```tsx
<DebugPanel sessionIds={[...clusters.keys()]} />
```

Update it to:
```tsx
<DebugPanel sessionIds={[...clusters.keys()]} isOpen={debugOpen} onClose={() => setDebugOpen(false)} />
```

- [ ] **Step 7: Add OperationsPanel render**

After the DebugPanel, add:
```tsx
<OperationsPanel isOpen={operationsOpen} onClose={() => setOperationsOpen(false)} />
```

- [ ] **Step 8: Remove old help-overlay JSX**

Find and delete the entire help-overlay block (lines ~383-404) that starts with:
```tsx
{showHelp && (
  <div className="help-overlay" onClick={() => setShowHelp(false)}>
```
and ends with:
```tsx
)}
```

- [ ] **Step 9: Verify TypeScript compiles**

```bash
cd client && npx tsc --noEmit
```

Expected: No new errors

- [ ] **Step 10: Commit**

```bash
git add client/src/App.tsx
git commit -m "feat: add panel state, top-bar buttons, wire OperationsPanel and refactored DebugPanel"
```

---

### Task 6: Update CSS for top-bar buttons and panel overlays

**Files:**
- Modify: `client/src/index.css`

- [ ] **Step 1: Add CSS for top-bar buttons**

Find the section with `.audio-toggle` and `.autofit-toggle` (around lines 93-120) and add after the `autofit-toggle` rules:

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

- [ ] **Step 2: Add CSS for panel overlays**

Find the end of the CSS file (before `</style>` if embedded, or at EOF) and add:

```css
/* ── Panel overlays (Operations, Debug) ───────────────── */
.panel-overlay {
  position: fixed;
  top: 24px;
  right: 24px;
  max-width: 400px;
  max-height: calc(100vh - 48px);
  background: rgba(2, 2, 9, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 16px;
  overflow-y: auto;
  z-index: 100;
  font-size: 12px;
  line-height: 1.6;
  color: #ccc;
}
.panel-close {
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 16px;
  padding: 0;
  width: 24px;
  height: 24px;
}
.panel-close:hover {
  color: #aaa;
}
.panel-overlay h3 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
}
.panel-overlay h4 {
  margin: 8px 0 6px 0;
  font-size: 12px;
  font-weight: 600;
  color: #aaa;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.operations-legend {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}
.legend-badge {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
  color: #000;
  flex-shrink: 0;
}
.legend-name {
  font-size: 11px;
}
.animations-guide {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.animation-item {
  font-size: 11px;
  padding: 4px;
  border-left: 2px solid rgba(255, 255, 255, 0.1);
  padding-left: 8px;
}
```

- [ ] **Step 3: Verify CSS does not break existing styles**

```bash
npm run dev
```

Open http://localhost:5174 and verify:
- Top-bar buttons appear next to autofit button
- Buttons are clickable and open panels
- No visual regressions to existing elements

- [ ] **Step 4: Commit**

```bash
git add client/src/index.css
git commit -m "feat: add CSS for top-bar buttons and panel overlays"
```

---

### Task 7: Manual verification

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

Open http://localhost:5174

- [ ] **Step 2: Verify event log time-decay behavior**

Events should:
- Appear at top of log with full opacity
- Be visible for 5 seconds at full opacity
- Fade out over 1 second (seconds 4-5)
- Disappear from live view at 5+ seconds

Check by watching events appear and fade as they arrive.

- [ ] **Step 3: Verify history button**

- [ ] Always visible (even when no live entries)
- [ ] Shows `history (N)` count when live entries exist
- [ ] Shows just `history` when no live entries
- [ ] Clicking opens overlay with all entries (newest first)
- [ ] Overlay is scrollable if there are many entries
- [ ] "← live" button closes overlay and returns to live view

- [ ] **Step 4: Verify top-bar buttons**

- [ ] Operations button (`?`) is visible in top bar
- [ ] Debug button (`⚙`) is visible in top bar
- [ ] Both buttons are clickable
- [ ] Operations button opens panel with node types + animation legend
- [ ] Debug button opens panel with current debug info
- [ ] Panels close when clicking close button or outside panel

- [ ] **Step 5: Verify no regressions**

- [ ] Canvas visualization still works
- [ ] Events are still being received and displayed
- [ ] No console errors
- [ ] Existing UI elements (sound button, autofit, HUD stats) still work

- [ ] **Step 6: Run tests**

```bash
npm test
```

Expected: All tests pass (16 passing)

- [ ] **Step 7: Stop dev server and commit final state**

```bash
git status
```

Expected: No uncommitted changes

---

## Integration Notes

- The time-decay loop uses `requestAnimationFrame` which runs at ~60fps. Each frame recalculates `now` via `setNow(Date.now())`, triggering a re-render. Opacity is calculated inline based on age.
- History entries are NOT removed from the array; they're just hidden from the live view (age >= 5000ms filters them out).
- Panels (`OperationsPanel`, `DebugPanel`) are modals that render conditionally when their `isOpen` prop is true.
- No new dependencies added; uses only existing React APIs.
