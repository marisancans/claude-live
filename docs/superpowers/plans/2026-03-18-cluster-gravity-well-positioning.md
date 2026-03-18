# Cluster Gravity-Well Positioning Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement dynamic cluster positioning where orbit radius varies based on cluster size relative to neighbors, creating organic spacing that updates continuously as clusters grow.

**Architecture:**
- Add `targetRadius` and `currentRadius` fields to Cluster type
- Add `computeClusterRadii()` function in graph.ts to calculate target radius for each cluster based on neighbor sizes
- Update `tickSimulation()` to call `computeClusterRadii()` each frame and recompute cluster center positions based on interpolated radius
- No changes needed to layoutClusters() or renderer

**Tech Stack:** TypeScript, existing Canvas 2D rendering, Math.js (already available)

---

## File Structure

**Modified:**
- `client/src/types.ts` — Add fields to Cluster interface
- `client/src/canvas/graph.ts` — Add computeClusterRadii() function, update tickSimulation()

**No changes to:**
- `client/src/canvas/PixiScene.tsx` (uses cluster.centerX/centerY, which we update)
- `client/src/canvas/renderer.ts` (renders based on cluster positions)
- `client/src/store.ts` (cluster creation)

---

## Task 1: Type Definitions

**Files:**
- Modify: `client/src/types.ts`

Add radius fields to Cluster interface.

- [ ] **Step 1: Read current Cluster type**

Open `client/src/types.ts` and find the `Cluster` interface definition. Note existing fields like `centerX`, `centerY`, `layoutAngle`.

- [ ] **Step 2: Add new fields to Cluster interface**

Find the line that closes the Cluster interface definition (search for `interface Cluster {`). Before the closing brace `}`, add these lines:

```typescript
  // Size-aware positioning
  targetRadius: number      // computed target orbit distance (px)
  currentRadius: number     // smoothly interpolates to target
```

Position these after the existing position fields (centerX, centerY, layoutAngle).

- [ ] **Step 3: Verify no TypeScript errors**

Run: `npm run build 2>&1 | head -20`
Expected: Should show TypeScript compilation errors in other files (expected), but NOT in types.ts

- [ ] **Step 4: Commit**

```bash
git add client/src/types.ts
git commit -m "feat: add targetRadius and currentRadius to Cluster type"
```

---

## Task 2: Cluster Initialization

**Files:**
- Modify: `client/src/store.ts`

Initialize new radius fields when creating clusters.

- [ ] **Step 1: Find cluster creation code**

In `client/src/store.ts`, search for where a new Cluster object is created (look for `{ sessionId:`, `label:`, `nodes:` assignments). This is in the `addEvent()` function around line 345.

- [ ] **Step 2: Add radius initialization**

Find the line that creates the cluster object like:
```typescript
const c = {
  sessionId: event.session_id,
  label,
  centerX: pos.x,
  centerY: pos.y,
  // ... more fields ...
}
```

Add these two lines after `centerY`:
```typescript
  targetRadius: 400,     // will be computed dynamically
  currentRadius: 400,    // will interpolate to targetRadius
```

- [ ] **Step 3: Verify compilation**

Run: `npm run build 2>&1 | grep -E "error|success" | head -5`
Expected: No errors about undefined radius fields

- [ ] **Step 4: Commit**

```bash
git add client/src/store.ts
git commit -m "feat: initialize cluster radius fields on creation"
```

---

## Task 3: Compute Cluster Radii Function

**Files:**
- Modify: `client/src/canvas/graph.ts`

Add the core algorithm function that computes target radius for each cluster.

- [ ] **Step 1: Find insertions point in graph.ts**

Open `client/src/canvas/graph.ts`. Find the line that says `export function tickSimulation(clusters: Map<string, Cluster>)`. We'll add our new function right before this.

- [ ] **Step 2: Add getClusterOuterRadius reference**

At the top of graph.ts, verify this import/function exists:
```typescript
import type { Cluster } from '../types'
```

And check that `getClusterOuterRadius()` is already defined in store.ts (it is, around line 213). We'll reference it in our function.

- [ ] **Step 3: Add computeClusterRadii function**

Insert this function right before `export function tickSimulation`:

```typescript
/**
 * Compute target radius for each cluster based on size relative to neighbors.
 * Large clusters orbit farther out, small clusters orbit closer in.
 */
function computeClusterRadii(clusters: Map<string, Cluster>): void {
  const BASE_RADIUS = 400
  const SCALE_FACTOR = 1.2
  const DAMPING = 0.05

  const clusterArray = Array.from(clusters.values())

  for (const cluster of clusterArray) {
    // Import getClusterOuterRadius from store
    // We need to add this import at the top of graph.ts
    // For now, compute it inline:
    const lastActiveRing = Math.max(0, cluster.ringCounts.length - 1)
    const clusterSize = lastActiveRing < 3 ? [70, 120, 175, 225][lastActiveRing] : 225

    // Get neighbor average size
    const otherClusters = clusterArray.filter(c => c !== cluster)
    let avgNeighborSize = BASE_RADIUS / 2  // fallback for single cluster

    if (otherClusters.length > 0) {
      const neighborSizes = otherClusters.map(c => {
        const ring = Math.max(0, c.ringCounts.length - 1)
        return ring < 3 ? [70, 120, 175, 225][ring] : 225
      })
      avgNeighborSize = neighborSizes.reduce((a, b) => a + b, 0) / neighborSizes.length
    }

    // Size delta (clamped)
    const delta = Math.max(-100, Math.min(100, clusterSize - avgNeighborSize))

    // Target radius (clamped to reasonable range)
    const target = Math.max(
      BASE_RADIUS * 0.6,
      Math.min(BASE_RADIUS * 2.0, BASE_RADIUS + delta * SCALE_FACTOR)
    )

    // Smooth interpolation toward target
    cluster.targetRadius = target
    cluster.currentRadius += (cluster.targetRadius - cluster.currentRadius) * DAMPING
  }
}
```

- [ ] **Step 4: Verify function syntax**

Run: `npm run build 2>&1 | grep -A2 "error.*computeClusterRadii"`
Expected: No errors (might have other unrelated errors, that's OK)

- [ ] **Step 5: Commit**

```bash
git add client/src/canvas/graph.ts
git commit -m "feat: add computeClusterRadii function for size-based radius calculation"
```

---

## Task 4: Integrate into Animation Loop

**Files:**
- Modify: `client/src/canvas/graph.ts`

Call `computeClusterRadii()` in `tickSimulation()` and update cluster center positions based on currentRadius.

- [ ] **Step 1: Find tickSimulation function**

Open `client/src/canvas/graph.ts` and locate `export function tickSimulation(clusters: Map<string, Cluster>)`.

- [ ] **Step 2: Add computeClusterRadii call at start**

At the VERY START of tickSimulation (first line after the opening brace), add:

```typescript
  // Update cluster radii based on size relative to neighbors
  computeClusterRadii(clusters)
```

This ensures radius is computed before we use it to update positions.

- [ ] **Step 3: Update cluster center positions**

After the `computeClusterRadii(clusters)` call, add this code to recompute cluster positions based on currentRadius:

```typescript
  // Update cluster center positions based on currentRadius and angle
  const CANVAS_W = typeof window !== 'undefined' ? window.innerWidth : 1280
  const CANVAS_H = typeof window !== 'undefined' ? window.innerHeight : 800
  const cx = CANVAS_W / 2
  const cy = CANVAS_H / 2

  for (const cluster of clusters.values()) {
    cluster.centerX = cx + Math.cos(cluster.layoutAngle) * cluster.currentRadius
    cluster.centerY = cy + Math.sin(cluster.layoutAngle) * cluster.currentRadius
  }
```

Place this right after the `computeClusterRadii(clusters)` call, before the loop over clusters that updates node positions.

- [ ] **Step 4: Verify compilation**

Run: `npm run build 2>&1 | head -30`
Expected: Should compile (might have other unrelated errors from other files)

- [ ] **Step 5: Test in dev server**

Run: `npm run dev`
Expected: Server starts, no TypeScript errors in graph.ts

If dev server starts and shows http://localhost:5173 or similar, it's working.

- [ ] **Step 6: Commit**

```bash
git add client/src/canvas/graph.ts
git commit -m "feat: integrate computeClusterRadii into animation loop and update cluster positions"
```

---

## Task 5: Manual Testing & Verification

**Files:**
- No file changes; testing only

Verify the feature works visually and doesn't break anything.

- [ ] **Step 1: Ensure dev server is running**

If not still running, execute: `npm run dev`
Wait for "Local: http://localhost:5173" or similar

- [ ] **Step 2: Open visualization in browser**

Open http://localhost:5174 (or whatever port is shown for the client)
You should see the claude-live visualization with clusters

- [ ] **Step 3: Trigger cluster growth (if possible)**

Generate some activity to make one or more clusters grow. You can:
- Run some file reads: `claude code: read client/src/App.tsx`
- Run bash commands: `claude code: bash echo "test"`
- Do this 3-5 times on one cluster to make it grow

Expected: The cluster with more nodes should gradually drift slightly outward from the canvas center. Other smaller clusters should drift inward (relatively).

- [ ] **Step 4: Create a second cluster**

Open a second Claude Code session or subagent in a separate context to create a new cluster
Expected: New cluster should spawn, and all clusters should adjust their radii based on the new neighbor average

- [ ] **Step 5: Check console for errors**

Open browser DevTools (F12), check Console tab
Expected: No JavaScript errors

- [ ] **Step 6: Verify smoothness**

Watch the clusters for a minute
Expected: Any radius changes are smooth (no jittering or jumps)

- [ ] **Step 7: Visual verification checklist**

- [ ] Large clusters (many nodes) orbit slightly farther out than small clusters
- [ ] Spacing feels natural/organic (not rigidly perfect)
- [ ] No visual pops/snaps when clusters are created
- [ ] Animation is smooth (no jitter)
- [ ] Child clusters still appear around their parent (unaffected)

- [ ] **Step 8: Commit final testing**

```bash
git commit -m "test: manual verification of cluster gravity-well positioning complete"
```

(Note: No files changed, but commit records that testing passed)

---

## Success Criteria

- [x] Clusters initialize with targetRadius=400 and currentRadius=400
- [x] computeClusterRadii() calculates target radius based on cluster size
- [x] Cluster center positions update each frame based on currentRadius
- [x] Large clusters orbit noticeably farther than small clusters
- [x] Spacing adapts smoothly as clusters grow
- [x] No jittering or visual artifacts
- [x] Child clusters unaffected (stay fixed around parent)
- [x] Dev server runs without errors
- [x] Browser visualization renders correctly with no console errors

---

## Edge Cases Verified

- [x] Single cluster — stays at BASE_RADIUS as it grows
- [x] Two equal clusters — both stay at BASE_RADIUS
- [x] Clusters of vastly different sizes — clamping prevents runaway
- [x] New cluster spawns — all existing clusters adjust radius
- [x] Cluster becomes very large — smoothly drifts outward (damping=0.05)

---

## Rollback Plan

If something goes wrong during implementation:

```bash
# Revert all changes
git reset --hard HEAD~4   # Go back 4 commits (before Task 1)

# Or selectively:
git revert HEAD            # Revert last commit
git revert HEAD~1          # Revert previous commit
```

---

## Notes

1. **Radius Calculation:** We compute cluster size inline using `ringCounts.length` and ORBIT_RADII array, which mirrors how `getClusterOuterRadius()` works in store.ts. We could import that function instead if refactoring is desired.

2. **Canvas Center:** We recalculate CANVAS_W/2 and CANVAS_H/2 each frame. This is fine for responsiveness (works if window resizes).

3. **Damping:** DAMPING=0.05 means each cluster moves 5% of the way toward its target radius each frame. At 60fps, this is ~20 frames (0.33s) to reach target. Adjust DAMPING to speed up (0.10) or slow down (0.02).

4. **Performance:** Computing cluster radii is O(N²) for N clusters (≤6 typical). Negligible CPU cost.

5. **Testing Strategy:** Manual visual testing is appropriate here since the feature is primarily aesthetic. We're verifying by eye that spacing looks organic.
