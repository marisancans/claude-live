# Auto-Fit Clusters Button Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a toggle button to the HUD that automatically adjusts the camera to continuously frame all visible clusters with smooth ~1.5s interpolation and gentle blending during user interaction.

**Architecture:**
- Add autofit toggle state to App.tsx (loaded from localStorage like audio)
- Pass `autofitEnabled` prop to PixiScene
- Refactor PixiScene animation loop to track interaction state and compute camera targets
- Implement bounding box calculation that includes orbital node extents
- Apply exponential smoothing with interaction-based blend factor decay

**Tech Stack:** React, Canvas 2D context, localStorage

---

## File Structure

**Modified files:**
- `client/src/App.tsx` — Add autofit state, button, callback
- `client/src/canvas/PixiScene.tsx` — Add camera fitting logic to animation loop
- `client/src/SpeakerIcon.tsx` — Reference for styling (reuse pattern for autofit icon)

**No new files needed** — all logic fits within existing PixiScene animation loop.

---

## Task List

### Task 1: Add Autofit State to App.tsx

**Files:**
- Modify: `client/src/App.tsx:173-177` (near audioEnabled state)

- [ ] **Step 1: Add autofit state hook (mirror audio pattern)**

After the `audioEnabled` state hook (line 173), add:
```typescript
const [autofitEnabled, setAutofitEnabledState] = useState(() => {
  const saved = localStorage.getItem('claude-live-autofit-enabled')
  return saved === 'true'
})
```

- [ ] **Step 2: Add useEffect to sync state to localStorage**

After the audioEnabled useEffect (around line 183), add:
```typescript
useEffect(() => {
  localStorage.setItem('claude-live-autofit-enabled', autofitEnabled ? 'true' : 'false')
}, [autofitEnabled])
```

- [ ] **Step 3: Create setAutofitEnabled callback**

Near the `toggleAudio` function (line 283), add:
```typescript
const setAutofitEnabled = (enabled: boolean) => {
  setAutofitEnabledState(enabled)
}
```

- [ ] **Step 4: Pass prop to PixiScene**

Modify line 291 from:
```typescript
<PixiScene clusters={clusters} lastEvent={lastEvent} onHover={handleHover} onSelect={handleSelect} />
```
to:
```typescript
<PixiScene clusters={clusters} lastEvent={lastEvent} onHover={handleHover} onSelect={handleSelect} autofitEnabled={autofitEnabled} />
```

- [ ] **Step 5: Commit**

```bash
git add client/src/App.tsx
git commit -m "feat: add autofit state and localStorage persistence"
```

---

### Task 2: Add Autofit Button to HUD

**Files:**
- Modify: `client/src/App.tsx:310-318` (HUD section)
- Reference: `client/src/SpeakerIcon.tsx` (for icon pattern)

- [ ] **Step 1: Create AutofitIcon component**

Add a new file `client/src/AutofitIcon.tsx`:
```typescript
export function AutofitIcon({ enabled }: { enabled: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g opacity={enabled ? 1 : 0.5} stroke="currentColor" strokeWidth="1.5" fill="none">
        {/* Four corners of a frame */}
        <path d="M 3 3 L 3 7 M 3 3 L 7 3" />
        <path d="M 17 3 L 17 7 M 17 3 L 13 3" />
        <path d="M 3 17 L 3 13 M 3 17 L 7 17" />
        <path d="M 17 17 L 17 13 M 17 17 L 13 17" />
      </g>
    </svg>
  )
}
```

- [ ] **Step 2: Import AutofitIcon in App.tsx**

Add to imports at top:
```typescript
import { AutofitIcon } from './AutofitIcon'
```

- [ ] **Step 3: Add autofit button to HUD**

After the audio toggle button (line 310–318), add:
```typescript
<button
  className="autofit-toggle"
  onClick={() => setAutofitEnabled(!autofitEnabled)}
  title={autofitEnabled ? 'Disable auto-fit' : 'Enable auto-fit'}
  aria-label={autofitEnabled ? 'Disable auto-fit' : 'Enable auto-fit'}
>
  <AutofitIcon enabled={autofitEnabled} />
</button>
```

- [ ] **Step 4: Add CSS styling (in index.css or App styles)**

Add to the stylesheet:
```css
.autofit-toggle {
  position: absolute;
  top: 12px;
  right: 56px; /* Right of audio toggle (48px) + spacing */
  width: 32px;
  height: 32px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.3);
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.autofit-toggle:hover {
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(0, 0, 0, 0.5);
  color: rgba(255, 255, 255, 0.95);
}

.autofit-toggle.active {
  color: #38bdf8;
  border-color: rgba(56, 189, 248, 0.4);
}
```

- [ ] **Step 5: Commit**

```bash
git add client/src/App.tsx client/src/AutofitIcon.tsx
git commit -m "feat: add autofit toggle button to HUD"
```

---

### Task 3: Add autofitEnabled Prop to PixiScene

**Files:**
- Modify: `client/src/canvas/PixiScene.tsx:21-26` (Props interface)

- [ ] **Step 1: Update Props interface**

Change line 21–26 from:
```typescript
interface Props {
  clusters: Map<string, Cluster>
  lastEvent: RawEvent | null
  onHover: (node: GraphNode | null, cluster: Cluster | null) => void
  onSelect: (node: GraphNode | null, cluster: Cluster | null) => void
}
```
to:
```typescript
interface Props {
  clusters: Map<string, Cluster>
  lastEvent: RawEvent | null
  onHover: (node: GraphNode | null, cluster: Cluster | null) => void
  onSelect: (node: GraphNode | null, cluster: Cluster | null) => void
  autofitEnabled: boolean
}
```

- [ ] **Step 2: Destructure prop in component**

Change line 28 from:
```typescript
export function PixiScene({ clusters, lastEvent, onHover, onSelect }: Props) {
```
to:
```typescript
export function PixiScene({ clusters, lastEvent, onHover, onSelect, autofitEnabled }: Props) {
```

- [ ] **Step 3: Commit**

```bash
git add client/src/canvas/PixiScene.tsx
git commit -m "feat: accept autofitEnabled prop in PixiScene"
```

---

### Task 4: Refactor Animation Loop for Interaction State Tracking

**Files:**
- Modify: `client/src/canvas/PixiScene.tsx:53-120` (useEffect with animation loop)

- [ ] **Step 1: Add interaction state variables**

Inside the useEffect, after line 56 (`let scale = 1`), add:
```typescript
let lastInteractionTime = 0
let blendFactor = 1.0
let lastBboxUpdateTime = 0
```

- [ ] **Step 2: Update onWheel handler to track interaction**

Modify the `onWheel` handler (line 58–62) to:
```typescript
const onWheel = (e: WheelEvent) => {
  e.preventDefault()
  const factor = e.deltaY < 0 ? 1.1 : 0.9
  scale = Math.max(0.2, Math.min(4, scale * factor))
  lastInteractionTime = Date.now()
}
```

- [ ] **Step 3: Update onMouseDown to track interaction**

Modify the `onMouseDown` handler (line 63–68) to:
```typescript
const onMouseDown = (e: MouseEvent) => {
  if (e.button !== 0) return
  dragging = true; dragMoved = false
  dragStart = { x: e.clientX, y: e.clientY }
  viewStart = { x: viewOffset.x, y: viewOffset.y }
  lastInteractionTime = Date.now()
}
```

- [ ] **Step 4: Commit**

```bash
git add client/src/canvas/PixiScene.tsx
git commit -m "refactor: add interaction state tracking to animation loop"
```

---

### Task 5: Implement Bounding Box Calculation Helper

**Files:**
- Modify: `client/src/canvas/PixiScene.tsx` (add helper function before useEffect)

- [ ] **Step 1: Add constant for orbital extent**

Add before the useEffect (around line 38):
```typescript
const ORBITAL_EXTENT = 175 // Max radius of orbiting nodes (ORBIT_RADII[2])
```

- [ ] **Step 2: Add bounding box calculation function**

Add before the useEffect:
```typescript
function calculateClusterBounds(clusters: Map<string, Cluster>) {
  let minX = Infinity, maxX = -Infinity
  let minY = Infinity, maxY = -Infinity

  for (const cluster of clusters.values()) {
    const ext = ORBITAL_EXTENT
    minX = Math.min(minX, cluster.centerX - ext)
    maxX = Math.max(maxX, cluster.centerX + ext)
    minY = Math.min(minY, cluster.centerY - ext)
    maxY = Math.max(maxY, cluster.centerY + ext)
  }

  // Add padding in world coordinates
  const padding = 120
  return {
    minX: minX - padding,
    maxX: maxX + padding,
    minY: minY - padding,
    maxY: maxY + padding,
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add client/src/canvas/PixiScene.tsx
git commit -m "feat: add bounding box calculation helper"
```

---

### Task 6: Implement Camera Target Calculation

**Files:**
- Modify: `client/src/canvas/PixiScene.tsx` (add helper function before useEffect)

- [ ] **Step 1: Add target calculation helper**

Add before the useEffect:
```typescript
function calculateCameraTarget(
  bounds: ReturnType<typeof calculateClusterBounds>,
  canvasWidth: number,
  canvasHeight: number
) {
  const boundsWidth = bounds.maxX - bounds.minX
  const boundsHeight = bounds.maxY - bounds.minY
  const boundsAspect = boundsWidth / boundsHeight
  const canvasAspect = canvasWidth / canvasHeight

  // Calculate scale to fit bounds in canvas
  let targetScale: number
  if (boundsAspect > canvasAspect) {
    targetScale = canvasWidth / boundsWidth
  } else {
    targetScale = canvasHeight / boundsHeight
  }

  // Clamp to valid scale range
  targetScale = Math.max(0.2, Math.min(4.0, targetScale))

  // Center the bounds on canvas
  const centerX = (bounds.minX + bounds.maxX) / 2
  const centerY = (bounds.minY + bounds.maxY) / 2
  const targetOffsetX = canvasWidth / 2 - centerX * targetScale
  const targetOffsetY = canvasHeight / 2 - centerY * targetScale

  return { targetScale, targetOffsetX, targetOffsetY }
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/canvas/PixiScene.tsx
git commit -m "feat: add camera target calculation helper"
```

---

### Task 7: Integrate Camera Fitting into Animation Loop

**Files:**
- Modify: `client/src/canvas/PixiScene.tsx` (main animation loop, around line 100–130)

- [ ] **Step 1: Add camera fitting logic to animation loop**

Inside the animation loop (inside the `frame` function or RAF callback), after current camera update logic and before the drawing calls, add:

```typescript
// Auto-fit camera if enabled
if (autofitEnabled && clustersRef.current.size > 0) {
  const now = Date.now()

  // Update blend factor based on interaction
  const timeSinceInteraction = now - lastInteractionTime
  if (dragging) {
    blendFactor = 0.15 // Reduced influence while dragging
  } else {
    // Fade blend factor back to 1.0 over 800ms after interaction stops
    blendFactor = Math.min(1.0, timeSinceInteraction / 800)
  }

  // Debounce bounding box calculation (~100ms)
  if (now - lastBboxUpdateTime > 100) {
    const bounds = calculateClusterBounds(clustersRef.current)
    const target = calculateCameraTarget(bounds, W, H)

    // Store target for interpolation
    const targetScale = target.targetScale
    const targetOffsetX = target.targetOffsetX
    const targetOffsetY = target.targetOffsetY

    // Exponential smoothing with blend factor
    // Time constant: 1500ms
    const alpha = 1 - Math.exp(-0.016 / 1.5) // ~1.06% per 16ms frame
    scale += (targetScale - scale) * alpha * blendFactor
    viewOffset.x += (targetOffsetX - viewOffset.x) * alpha * blendFactor
    viewOffset.y += (targetOffsetY - viewOffset.y) * alpha * blendFactor

    lastBboxUpdateTime = now
  }
}
```

- [ ] **Step 2: Verify animation loop context**

Ensure the above code is placed inside the RAF callback where `W`, `H`, `dragging`, and `scale`/`viewOffset` are accessible.

- [ ] **Step 3: Commit**

```bash
git add client/src/canvas/PixiScene.tsx
git commit -m "feat: integrate auto-fit camera logic into animation loop"
```

---

### Task 8: Manual Testing of Auto-Fit Feature

**Files:**
- No files modified; manual testing only

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

Expected: Server starts, app loads on http://localhost:5173

- [ ] **Step 2: Verify button appears and toggles**

- Click the new auto-fit button (should be right of audio toggle)
- Icon should highlight/dim based on state
- Refresh page — state should persist

- [ ] **Step 3: Test auto-fit with single cluster**

- Open a Claude Code session in a terminal
- Verify one cluster appears on canvas
- Toggle auto-fit ON
- Cluster should smoothly center and scale to fill view
- Toggle auto-fit OFF — no change should happen

- [ ] **Step 4: Test auto-fit with multiple clusters**

- Open 2–3 simultaneous Claude Code sessions
- Toggle auto-fit ON
- All clusters should be framed in view with padding
- They should remain visible as you pan/zoom

- [ ] **Step 5: Test interaction blending**

- With auto-fit ON, drag the canvas
- Camera should feel responsive to drag (not fighting)
- Release mouse — camera should smoothly pull back to fit frame over ~800ms
- Wheel scroll while auto-fit ON — same behavior

- [ ] **Step 6: Test during layout (new cluster appears)**

- With auto-fit ON, start a new Claude Code session
- New cluster appears
- Camera should smoothly re-fit to include it (no jitter)

- [ ] **Step 7: Verify no performance regression**

- Open DevTools Performance tab
- Run a few seconds of recording
- Frame rate should remain stable (~60fps)
- No long tasks or jank visible

- [ ] **Step 8: Manual test summary**

If all above tests pass, feature is working. Document any issues and fix before proceeding.

- [ ] **Step 9: Commit (if manual tests pass)**

```bash
git add -A
git commit -m "test: verify auto-fit feature works end-to-end"
```

---

### Task 9: Code Review & Cleanup

**Files:**
- Review: `client/src/App.tsx`, `client/src/canvas/PixiScene.tsx`, `client/src/AutofitIcon.tsx`

- [ ] **Step 1: Review code for clarity and consistency**

- Check variable naming matches project conventions
- Ensure comments are clear where logic is complex
- Verify no unused variables or imports

- [ ] **Step 2: Verify localStorage behavior**

- Open DevTools → Application → localStorage
- Key `'claude-live-autofit-enabled'` should exist and toggle between 'true'/'false'

- [ ] **Step 3: Check CSS alignment**

- Verify autofit button visually aligns with audio toggle
- Hover states are consistent with other HUD buttons

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: final review and polish of auto-fit feature"
```

---

## Success Criteria

✅ Autofit button appears in HUD beside audio toggle
✅ State persists in localStorage
✅ When enabled, camera smoothly frames all clusters (~1.5s)
✅ Clusters appear/disappear, camera re-frames smoothly
✅ User interaction (drag/wheel) blends smoothly (not fighting)
✅ After interaction stops, camera gently pulls back to fit frame
✅ Blend factor decays naturally over ~800ms
✅ No performance regression; 60fps maintained
