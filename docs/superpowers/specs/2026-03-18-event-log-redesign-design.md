# Event Log Redesign — Design Spec

**Date:** 2026-03-18

## Goal

Replace the current static debug log with an animated live event log: entries appear and fade with age, max 5 visible at once, with a toggleable history overlay showing the last 100 events.

---

## Component

**New file:** `client/src/EventLog.tsx`

The `EventLog` component is self-contained. It receives a stream of `RawEvent` props and manages its own internal event history.

`App.tsx` renders `EventLog` in the side panel area, passing `lastEvent` (already tracked in app state).

---

## Data Model

```typescript
interface LogEntry {
  id: number           // monotonic counter for React keys
  event: RawEvent      // raw event data
  timestamp: number    // Date.now() when added
}
```

Internal state:
- `entries: LogEntry[]` — capped at 100, newest first
- `historyOpen: boolean` — toggles history overlay

When a new `lastEvent` arrives, prepend to `entries` and trim to 100.

---

## Live View (history closed)

Show the first 5 entries (`entries.slice(0, 5)`). Each entry's opacity is determined by its index (age):

| Index | Opacity |
|-------|---------|
| 0     | 1.00    |
| 1     | 0.80    |
| 2     | 0.55    |
| 3     | 0.35    |
| 4     | 0.18    |

**Entry layout:** `[colored dot] [tool name] [file/args] [session label right-aligned]`

- Dot and tool name use existing tool color (`TOOL_COLOR_HEX`)
- File/args at 60% opacity
- Session label at 40% opacity, pushed right with `margin-left: auto`
- Monospace font, 11px

**Entry animation:** New entry (index 0) slides in with a 150ms ease-out translateY(-4px) + fade-in from opacity 0. Applied via a CSS class added on mount.

---

## History Overlay

Triggered by a small "history" button (bottom-right of the log container). When open:

- Same container, same dimensions — no modal, no separate panel
- Shows all `entries` (up to 100), newest first
- Uniform opacity ~0.70 (no age-based fade)
- Scrollable (`overflow-y: auto`)
- "← back" button at top returns to live view
- Entry format identical to live view

---

## Tool Colors

Reuse the existing color map from `PixiScene.tsx`:

```typescript
const TOOL_COLOR: Record<string, string> = {
  Read: '#4ade80', Edit: '#60a5fa', Write: '#60a5fa',
  Bash: '#f59e0b', Grep: '#a78bfa', Glob: '#a78bfa',
  WebFetch: '#f472b6', Stop: '#888888', Notification: '#34d399',
  PermissionRequest: '#fbbf24', UserPromptSubmit: '#38bdf8',
}
```

Move this map to `client/src/constants.ts` (new file) so both `PixiScene.tsx` and `EventLog.tsx` import from one place.

---

## Entry Content

Derive display text from `RawEvent`:

| Tool | File/args display |
|------|-------------------|
| Read, Edit, Write, Grep, Glob | `event.tool_input?.file_path` (basename only) |
| Bash | `$ ` + first 40 chars of `event.tool_input?.command` |
| WebFetch | hostname of `event.tool_input?.url` |
| UserPromptSubmit | first 40 chars of prompt text |
| Notification, PermissionRequest, Stop | _(no args shown)_ |

Session label: `event.session_id` (last 8 chars, or a short alias if available).

---

## Integration

**`App.tsx`** — add `<EventLog lastEvent={lastEvent} />` in the side panel.

**`client/src/constants.ts`** — extract `TOOL_COLOR_HEX` map here.

**`PixiScene.tsx`** — import `TOOL_COLOR_HEX` from `constants.ts` instead of defining inline.

---

## Non-Goals

- No sound or haptics
- No per-entry click-to-expand detail
- No filtering by tool type or session
- No persistence across page refresh
