# Prompt Snake Animation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Animate user prompts as word snakes that flow along random curved splines from outer space to the cluster core, with words twisting perpendicular to the path and multiple snakes streaming in simultaneously.

**Architecture:**
- Add SplinePath type to types.ts for curve representation
- Create spline utility module for generation and evaluation (quadratic Bézier curves)
- Extend Cluster to store array of in-flight snakes instead of single prompt
- Update UserPromptSubmit hook handler to generate snakes with random splines
- Modify animation loop to decay snake progress
- Rewrite prompt rendering to iterate snakes and position/rotate words along splines

**Tech Stack:** TypeScript, Canvas 2D, Quadratic Bézier curves, existing animation framework

---

## File Structure

**Modified:**
- `client/src/types.ts` - Add SplinePath type, extend Cluster interface
- `client/src/store.ts` - Update UserPromptSubmit handler, add snake creation
- `client/src/canvas/graph.ts` - Update animation loop for snake decay
- `client/src/canvas/renderer.ts` - Rewrite prompt rendering for snakes

**Created:**
- `client/src/utils/spline.ts` - Spline generation and evaluation utilities

---

## Task 1: Spline Utilities

**Files:**
- Create: `client/src/utils/spline.ts`

Implement quadratic Bézier spline generation and evaluation functions that will power the random curves.

- [ ] **Step 1: Write spline utility tests**

Create `client/src/utils/spline.test.ts`:

```typescript
import { generateSpline, evaluateSpline, evaluateTangent } from './spline'

describe('spline utilities', () => {
  it('generates spline with start, control, end points', () => {
    const spline = generateSpline(
      { x: 0, y: 0 },      // start
      { x: 50, y: -50 },   // control
      { x: 100, y: 0 }     // end
    )
    expect(spline.controlPoints).toHaveLength(3)
    expect(spline.controlPoints[0]).toEqual({ x: 0, y: 0 })
  })

  it('evaluates position at t=0 returns start point', () => {
    const spline = generateSpline({ x: 0, y: 0 }, { x: 50, y: -50 }, { x: 100, y: 0 })
    const pos = evaluateSpline(spline, 0)
    expect(pos.x).toBeCloseTo(0, 2)
    expect(pos.y).toBeCloseTo(0, 2)
  })

  it('evaluates position at t=1 returns end point', () => {
    const spline = generateSpline({ x: 0, y: 0 }, { x: 50, y: -50 }, { x: 100, y: 0 })
    const pos = evaluateSpline(spline, 1)
    expect(pos.x).toBeCloseTo(100, 2)
    expect(pos.y).toBeCloseTo(0, 2)
  })

  it('evaluates position at t=0.5 returns midpoint', () => {
    const spline = generateSpline({ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 200, y: 0 })
    const pos = evaluateSpline(spline, 0.5)
    expect(pos.x).toBeCloseTo(100, 2)
  })

  it('evaluates tangent (derivative) at points along curve', () => {
    const spline = generateSpline({ x: 0, y: 0 }, { x: 50, y: 50 }, { x: 100, y: 0 })
    const tangent = evaluateTangent(spline, 0.5)
    expect(Math.abs(tangent.x) + Math.abs(tangent.y)).toBeGreaterThan(0)
  })

  it('tangent is normalized (magnitude ~1)', () => {
    const spline = generateSpline({ x: 0, y: 0 }, { x: 50, y: 50 }, { x: 100, y: 0 })
    const tangent = evaluateTangent(spline, 0.5)
    const mag = Math.sqrt(tangent.x ** 2 + tangent.y ** 2)
    expect(mag).toBeCloseTo(1, 2)  // ±0.01 tolerance
  })
})
```

Run: `npm test -- spline.test.ts`
Expected: All tests fail (functions not implemented)

- [ ] **Step 2: Implement spline utilities**

Create `client/src/utils/spline.ts`:

```typescript
export interface Point {
  x: number
  y: number
}

export interface SplinePath {
  controlPoints: [Point, Point, Point]  // [start, control, end] for quadratic Bézier
}

/**
 * Generate a quadratic Bézier spline from start to end with a control point.
 * Control point is typically offset perpendicular to the straight line.
 */
export function generateSpline(start: Point, control: Point, end: Point): SplinePath {
  return {
    controlPoints: [start, control, end]
  }
}

/**
 * Evaluate position on quadratic Bézier curve at parameter t ∈ [0, 1]
 * Formula: B(t) = (1-t)²P₀ + 2(1-t)tP₁ + t²P₂
 */
export function evaluateSpline(spline: SplinePath, t: number): Point {
  const [p0, p1, p2] = spline.controlPoints
  const mt = 1 - t
  const mt2 = mt * mt
  const t2 = t * t
  const a = mt2
  const b = 2 * mt * t
  const c = t2

  return {
    x: a * p0.x + b * p1.x + c * p2.x,
    y: a * p0.y + b * p1.y + c * p2.y
  }
}

/**
 * Evaluate tangent (normalized) on quadratic Bézier curve at parameter t ∈ [0, 1]
 * Derivative: B'(t) = 2(1-t)(P₁-P₀) + 2t(P₂-P₁)
 */
export function evaluateTangent(spline: SplinePath, t: number): Point {
  const [p0, p1, p2] = spline.controlPoints
  const mt = 1 - t

  const dx = 2 * mt * (p1.x - p0.x) + 2 * t * (p2.x - p1.x)
  const dy = 2 * mt * (p1.y - p0.y) + 2 * t * (p2.y - p1.y)

  // Normalize
  const mag = Math.sqrt(dx * dx + dy * dy)
  if (mag < 0.0001) return { x: 0, y: 0 }

  return {
    x: dx / mag,
    y: dy / mag
  }
}

/**
 * Generate random spline from spawn point toward cluster center.
 * @param clusterCx - cluster center X
 * @param clusterCy - cluster center Y
 * @param spawnAngle - direction in radians (0-2π) from cluster center
 * @param maxDist - distance from cluster center to spawn point
 */
export function generateRandomSpline(
  clusterCx: number,
  clusterCy: number,
  spawnAngle: number,
  maxDist: number
): SplinePath {
  // Start point: on the edge, far from cluster
  const startX = clusterCx + Math.cos(spawnAngle) * maxDist
  const startY = clusterCy + Math.sin(spawnAngle) * maxDist

  // End point: cluster center
  const endX = clusterCx
  const endY = clusterCy

  // Control point: offset perpendicular to radial line by random amount (for dramatic curves)
  const perpAngle = spawnAngle + Math.PI / 2
  const controlOffset = 80 + Math.random() * 70  // 80-150px offset for more curvature
  const sign = Math.random() > 0.5 ? 1 : -1
  const controlX = (startX + endX) / 2 + Math.cos(perpAngle) * controlOffset * sign
  const controlY = (startY + endY) / 2 + Math.sin(perpAngle) * controlOffset * sign

  return generateSpline(
    { x: startX, y: startY },
    { x: controlX, y: controlY },
    { x: endX, y: endY }
  )
}
```

- [ ] **Step 3: Run tests to verify implementation**

Run: `npm test -- spline.test.ts`
Expected: All tests pass

- [ ] **Step 4: Commit**

```bash
git add client/src/utils/spline.ts client/src/utils/spline.test.ts
git commit -m "feat: add spline curve utilities for snake animation"
```

---

## Task 2: Type Definitions

**Files:**
- Modify: `client/src/types.ts`

Add SplinePath type and extend Cluster to use snakes array instead of single prompt.

- [ ] **Step 1: Read current types**

Check `client/src/types.ts` to understand current Cluster structure, especially promptFlying, promptText, promptColor fields.

- [ ] **Step 2: Import spline types and add snake interface**

Add after imports at top of types.ts:

```typescript
import type { Point, SplinePath } from '../utils/spline'

export interface PromptSnake {
  words: string[]           // split prompt text
  color: string             // animation color (hex)
  progress: number          // 0-1 animation progress
  splinePath: SplinePath    // pre-computed spline curve
  startAngle: number        // 0-360° spawn direction in radians
}
```

Update Cluster interface to replace old prompt fields:

```typescript
export interface Cluster {
  // ... existing fields ...

  // OLD (remove these):
  // promptFlying: number
  // promptText: string
  // promptColor: string

  // NEW (add these):
  promptSnakes: PromptSnake[]  // array of in-flight snakes
}
```

- [ ] **Step 3: Verify no compilation errors**

Run: `npm run build`
Expected: TypeScript compilation succeeds (or shows only errors in files we haven't updated yet)

- [ ] **Step 4: Commit**

```bash
git add client/src/types.ts
git commit -m "feat: add spline and snake types to Cluster"
```

---

## Task 3: Store Updates - Snake Creation

**Files:**
- Modify: `client/src/store.ts`

Update UserPromptSubmit handler to create snakes with random splines.

- [ ] **Step 1: Read current UserPromptSubmit handler**

Find the UserPromptSubmit hook handler in store.ts to understand current prompt animation setup. Check if `UserPromptSubmitEvent` type has a `color` field (if not, use a default color like `#b0c8f0`).

- [ ] **Step 2: Import spline utilities**

Add at top of store.ts:

```typescript
import { generateRandomSpline } from './utils/spline'
```

- [ ] **Step 3: Update UserPromptSubmit handler to create snakes**

Find and replace the existing prompt animation code with:

```typescript
// In UserPromptSubmit hook handler:
case 'UserPromptSubmit': {
  const event = msg as UserPromptSubmitEvent
  const sessionId = event.sessionId
  const cluster = getOrCreateCluster(sessionId)

  if (event.promptText) {
    // Split prompt into words
    const words = event.promptText.trim().split(/\s+/).filter(w => w.length > 0)

    if (words.length > 0) {
      // Generate random spawn angle (0-2π)
      const spawnAngle = Math.random() * Math.PI * 2

      // Generate random spline from edge to cluster center
      const maxDist = 400  // distance from cluster to spawn point
      const splinePath = generateRandomSpline(
        cluster.centerX,
        cluster.centerY,
        spawnAngle,
        maxDist
      )

      // Get color from event or use default
      const color = event.color || '#b0c8f0'

      // Create snake object
      const snake: PromptSnake = {
        words,
        color,
        progress: 0,      // start at 0, will animate to 1
        splinePath,
        startAngle: spawnAngle
      }

      // Add to snakes array (initialize if needed)
      if (!cluster.promptSnakes) {
        cluster.promptSnakes = []
      }
      cluster.promptSnakes.push(snake)

      // Play audio chord
      playChordForEvent('UserPromptSubmit')
    }
  }
  break
}
```

- [ ] **Step 4: Run dev server to check for errors**

Run: `npm run dev`
Expected: No TypeScript errors in store.ts, server starts successfully

- [ ] **Step 5: Commit**

```bash
git add client/src/store.ts
git commit -m "feat: create prompt snakes on UserPromptSubmit with random splines"
```

---

## Task 4: Animation Loop - Snake Decay

**Files:**
- Modify: `client/src/canvas/graph.ts`

Update animation loop to decay snake progress over time.

- [ ] **Step 1: Read tickSimulation function**

Find tickSimulation in graph.ts to understand current animation loop structure.

- [ ] **Step 2: Add snake progress decay**

Add in tickSimulation loop (after node animations):

```typescript
// Update snake animations
for (const cluster of clusters.values()) {
  if (!cluster.promptSnakes) cluster.promptSnakes = []

  // Decay progress for each snake
  for (const snake of cluster.promptSnakes) {
    snake.progress = Math.min(1, snake.progress + 0.005)  // ~3s duration (0.005/frame * ~180 frames at 60fps)
  }

  // Remove completed snakes (progress >= 1)
  cluster.promptSnakes = cluster.promptSnakes.filter(s => s.progress < 1)
}
```

- [ ] **Step 3: Initialize promptSnakes on cluster creation**

Find where clusters are initialized (getOrCreateCluster or similar) and ensure:

```typescript
cluster.promptSnakes = cluster.promptSnakes || []
```

- [ ] **Step 4: Test with dev server**

Run: `npm run dev`
Expected: Server starts, no console errors

- [ ] **Step 5: Commit**

```bash
git add client/src/canvas/graph.ts
git commit -m "feat: decay snake progress in animation loop"
```

---

## Task 5: Rendering - Snakes

**Files:**
- Modify: `client/src/canvas/renderer.ts`

Replace prompt animation rendering with snake rendering.

- [ ] **Step 1: Add imports and constants**

Add at top of renderer.ts:

```typescript
import { evaluateSpline, evaluateTangent } from '../utils/spline'
import type { PromptSnake } from '../types'
```

Note: `hexToRgb()` function already exists in renderer.ts, so no additional import needed.

- [ ] **Step 2: Find and remove old prompt rendering code**

Locate the section that renders `cluster.promptFlying` (the old single prompt animation) and remove it entirely. This is around line 378-417 in the current code.

- [ ] **Step 3: Add snake rendering function**

Add new function before drawScene:

```typescript
function drawSnake(
  ctx: CanvasRenderingContext2D,
  snake: PromptSnake,
  clusterCx: number,
  clusterCy: number
) {
  const [r, g, b] = hexToRgb(snake.color)
  const progress = snake.progress

  // Easing: quadratic ease-out
  const eased = 1 - (1 - progress) * (1 - progress)

  // Map progress to spline parameter (0 → 1)
  const t = eased

  // Draw each word vertically aligned but positioned along spline
  for (let i = 0; i < snake.words.length; i++) {
    const word = snake.words[i]

    // Stagger words along spline: head is ahead, tail lags behind
    const wordT = Math.max(0, t - i * 0.08)
    const wordPos = evaluateSpline(snake.splinePath, wordT)

    // Tail fading: words fade faster if they're at tail (lower index)
    const tailFade = Math.pow(i / snake.words.length, 0.7)
    const opacity = tailFade * Math.min(1, progress * 3)  // fade in quickly

    // Scale grows during animation
    const scale = 0.6 + progress * 0.4
    const fontSize = 11 * scale

    // Draw glow around word
    const glowR = 20 * scale
    const gg = ctx.createRadialGradient(wordPos.x, wordPos.y, 0, wordPos.x, wordPos.y, glowR)
    gg.addColorStop(0, `rgba(${r},${g},${b},${opacity * 0.25})`)
    gg.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.beginPath()
    ctx.arc(wordPos.x, wordPos.y, glowR, 0, Math.PI * 2)
    ctx.fillStyle = gg
    ctx.fill()

    // Draw word (vertical, no rotation)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `700 ${fontSize}px monospace`

    // Shadow
    ctx.fillStyle = `rgba(0,0,0,${opacity * 0.3})`
    ctx.fillText(word, wordPos.x + 1, wordPos.y + 1)

    // Main text
    ctx.fillStyle = `rgba(${r},${g},${b},${opacity})`
    ctx.fillText(word, wordPos.x, wordPos.y)
  }
}
```

- [ ] **Step 4: Call drawSnake for each snake in drawScene**

In drawScene function, in the cluster loop, add:

```typescript
// Render snakes
for (const snake of cluster.promptSnakes) {
  drawSnake(ctx, snake, cx, cy)
}
```

Place this after node rendering but before core rendering.

- [ ] **Step 5: Test with dev server**

Run: `npm run dev`
Expected: Server starts, no TypeScript errors

- [ ] **Step 6: Commit**

```bash
git add client/src/canvas/renderer.ts
git commit -m "feat: render prompt snakes with word rotation along splines"
```

---

## Task 6: Manual Testing & Polish

**Files:**
- No file changes; testing and validation

- [ ] **Step 1: Start dev server**

Run: `npm run dev`
Wait for both server and Vite to start. Open http://localhost:5173 in browser.

- [ ] **Step 2: Trigger multiple prompts quickly**

Use Claude Code to issue commands or prompts repeatedly (e.g., `Read` tool, `Bash` commands, multiple requests). Watch the visualizer.

Expected: Multiple word snakes animate simultaneously from random directions, twisting along curves toward the core.

- [ ] **Step 3: Verify visual behavior**

Checklist:
- [ ] Snakes spawn from random angles around cluster (not always same direction)
- [ ] Words twist perpendicular to curve (not staying vertical)
- [ ] Head word stays bright longer than tail
- [ ] Multiple snakes visible at same time without overlap issues
- [ ] Snakes complete in ~1.5 seconds
- [ ] No visual glitches/jittering

- [ ] **Step 4: Check console for errors**

Open browser DevTools (F12), check Console tab for any JavaScript errors.

Expected: No errors

- [ ] **Step 5: Performance check**

Trigger 5+ prompts rapidly. Watch for stuttering or frame drops.

Expected: Smooth animation even with multiple snakes

- [ ] **Step 6: Commit final polish**

If any bugs found, fix them and commit:

```bash
git commit -m "fix: [description of fix]"
```

If no bugs:

```bash
git commit -m "test: manual testing complete for prompt snake animation"
```

---

## Success Criteria

- [x] Multiple prompts animate simultaneously
- [x] Each snake follows unique random spline path with dramatic curves
- [x] Words stay vertical (no distortion/rotation)
- [x] Tail fading creates depth/perspective
- [x] Animation duration ~3s (slower)
- [x] Snakes do not persist across page reload (ephemeral, in-memory only)
- [x] Smooth performance with 5+ concurrent snakes
- [x] No console errors

---

## Notes for Implementation

1. **Word Positioning:** Words stay vertical (no rotation). Positioned along spline curve but text always upright for readability.

2. **Word Stagger:** Offset each word's spline parameter by `-i * 0.08` so the tail lags behind the head. Clamp to [0, 1].

3. **Tail Fade:** Use `Math.pow(index / count, 0.7)` to make exponential fade toward tail. Apply on top of progress fade.

4. **Reset on Completion:** Filter out snakes where `progress >= 1` to prevent memory leaks. Snakes are ephemeral (not persisted).

5. **Color Preservation:** Keep promptColor from event hook for snake rendering.

6. **Animation Duration:** 0.005 progress per frame = ~3s total (slower than original 1.5s).

7. **Curvature:** Control point offset is 80-150px (larger than original 30-60px) for more dramatic curves.

8. **Performance:** Spline evaluation happens per-frame per-word. With 5 words × 5 snakes = 25 evaluations/frame. Negligible CPU cost for Bézier evaluation.

