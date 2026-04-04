# Animation & Debug UI Coverage Gaps

All possible `hook_event_name` values (from `client/src/types.ts`):
`SessionStart`, `PreToolUse`, `PostToolUse`, `PostToolUseFailure`, `Stop`,
`Notification`, `PermissionRequest`, `SubagentStart`, `SubagentStop`, `SessionEnd`,
`UserPromptSubmit`, `PreCompact`, `PostCompact`, `InstructionsLoaded`,
`WorktreeCreate`, `WorktreeRemove`, `ConfigChange`

---

## Three.js Visualizer (`client/src/canvas-three/`)

### No EventProcessor handler — completely invisible
These events are never emitted to EventBus, so ThreeApp never sees them:

- [ ] `PreToolUse` — fired before every tool call; could show anticipation / charge-up effect
- [ ] `InstructionsLoaded` — no handler, no bus event, no visual
- [ ] `WorktreeCreate` — no handler, no bus event, no visual
- [ ] `WorktreeRemove` — no handler, no bus event, no visual
- [ ] `ConfigChange` — no handler, no bus event, no visual

### EventBus events emitted but ThreeApp has no listener
EventProcessor emits these, but `ThreeApp.setupEventListeners()` never subscribes:

- [ ] `Notification` → bus: `notification` — no particle spawn, no visual response
- [ ] `PermissionRequest` → bus: `permission:request` — no particle spawn, no visual response

### Tool names with only fallback animation (`profileDefault`)
All tools not in the `buildSpawnParams` switch fall through to a plain coloured blob.
Common ones that could use dedicated effects:

- [ ] `Task` / `Agent` (tool name, distinct from SubagentStart event)
- [ ] `TodoWrite` / `TodoRead`
- [ ] `ToolSearch`
- [ ] `AskUserQuestion`
- [ ] `EnterPlanMode` / `ExitPlanMode`
- [ ] `WebSearch`

---

## Sakura Visualizer (`client/src/sakura/`)

### Not in `isAnimatable()` — completely ignored by SignalSystem
`SignalSystem.route()` drops these events before any effect is spawned:

- [ ] `PostToolUse` — sakura only handles `PreToolUse`; tool response has no effect
- [ ] `Stop` — no sakura effect
- [ ] `SessionEnd` — no sakura effect
- [ ] `SubagentStop` — no sakura effect (only `SubagentStart` is handled)
- [ ] `PreCompact` — no sakura effect
- [ ] `PostCompact` — no sakura effect
- [ ] `InstructionsLoaded` — no sakura effect
- [ ] `WorktreeCreate` — no sakura effect
- [ ] `WorktreeRemove` — no sakura effect
- [ ] `ConfigChange` — no sakura effect

### In `isAnimatable()` but no visual effect spawned (boost only)

- [ ] `Notification` — sets `colony.boost` only; no `buildEffect()` call
- [ ] `PermissionRequest` — sets `colony.boost` only; no `buildEffect()` call

### Tools with no dedicated Sakura effect (fall back to `buildReadSap`)
Any unrecognised tool name falls back to `builders.Read` in `effects/index.ts`:

- [ ] `Task` / `Agent` tools
- [ ] `TodoWrite` / `TodoRead`
- [ ] `ToolSearch`, `AskUserQuestion`
- [ ] `WebSearch`

---

## Debug UI

### Main `DebugPanel.tsx` — missing fire-event buttons

- [ ] `SessionStart` — no button; can't inject a session start event
- [ ] `PreToolUse` — all tool buttons fire `PostToolUse`; `PreToolUse` is never tested
- [ ] `InstructionsLoaded` — no button
- [ ] `WorktreeCreate` — no button
- [ ] `WorktreeRemove` — no button
- [ ] `ConfigChange` — no button
