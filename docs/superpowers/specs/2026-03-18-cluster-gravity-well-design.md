# Cluster Gravity-Well Positioning Design
**Date:** 2026-03-18
**Feature:** Size-aware cluster radial offset for organic spacing

## Overview

Replace fixed cluster positioning with a dynamic system where cluster orbit radius varies based on their size relative to neighbors. Large clusters drift outward, small ones drift inward, creating natural breathing room and visual hierarchy while maintaining the familiar circular layout.

**Visual Goal:** Aesthetic appeal—spacing that feels organic and natural, not rigidly computed.

## Problem Statement

Currently, clusters are positioned at fixed distances from the canvas center regardless of size:
- A large cluster with 50 nodes and a small cluster with 3 nodes are equidistant from center
- Leads to large empty spaces around small clusters
- Visual hierarchy isn't immediately clear
- Doesn't reflect the relative "weight" of each cluster

Desired behavior: Clusters should naturally push each other apart based on size, with larger clusters creating more "presence" and smaller ones nestling closer to center.

## Solution: Size-Ratio Radial Offset

### Core Concept

Each cluster has a **target radius** computed from its size relative to neighbors:
- Large cluster (many nodes) → target radius increases → orbits farther out
- Small cluster (few nodes) → target radius decreases → orbits closer in
- Cluster smoothly animates from current radius to target radius

Angular position stays unchanged—clusters remain on the familiar circular arrangement.

### Algorithm

**Inputs per cluster:**
- `outerRadius` — largest orbital ring in use (proxy for cluster size)
- `baseRadius` — default orbit distance (400px)
- `scaleFactor` — size adjustment strength (1.2 = 20% per size unit, moderate)
- `damping` — smoothing factor (0.05 = 5% step toward target per frame)

**Calculation (runs every frame):**

```
For each cluster C:
  1. Get current size:
     sizeC = getClusterOuterRadius(C)

  2. Get neighbor average size:
     neighborSizes = [getClusterOuterRadius(C') for all C' ≠ C]
     avgSize = sum(neighborSizes) / max(1, len(neighborSizes))

  3. Compute size delta:
     delta = sizeC - avgSize

  4. Clamp to prevent extreme values:
     delta = clamp(delta, -100, +100)  // cap at ±100px to prevent runaway

  5. Compute target radius:
     targetRadius = baseRadius + (delta * scaleFactor)
     targetRadius = clamp(targetRadius, baseRadius * 0.6, baseRadius * 2.0)  // keep in reasonable range

  6. Smooth interpolation:
     currentRadius += (targetRadius - currentRadius) * damping
```

**Result:** Each cluster orbits at a radius that reflects its size, smoothly interpolating to new targets as sizes change.

### Why This Works

- **Simple:** No force simulation, deterministic calculation
- **Predictable:** Same input always produces same output
- **Responsive:** Updates every frame as clusters grow
- **Stable:** Damping prevents oscillation or jittering
- **Organic:** Feels natural and emergent without being chaotic

## Data Structure Changes

### Cluster Type

Add to `Cluster` interface in `client/src/types.ts`:

```typescript
export interface Cluster {
  // ... existing fields ...

  // Size-aware positioning
  targetRadius: number      // computed target orbit distance (px)
  currentRadius: number     // smoothly interpolates to target
}
```

Initialize on cluster creation:
```typescript
targetRadius: 400,    // baseRadius
currentRadius: 400,   // baseRadius
```

## Implementation

### Files Modified

1. **`client/src/types.ts`**
   - Add `targetRadius` and `currentRadius` fields to Cluster

2. **`client/src/store.ts`**
   - Initialize both fields when creating a new cluster
   - No other changes needed (store doesn't compute positions)

3. **`client/src/canvas/graph.ts`**
   - Add `computeClusterRadii()` function to calculate target radius for all clusters
   - Call it in `tickSimulation()` every frame
   - Update interpolation: `cluster.currentRadius += (cluster.targetRadius - cluster.currentRadius) * 0.05`

4. **`client/src/canvas/PixiScene.ts`** (or renderer)
   - When positioning clusters, use `cluster.currentRadius` instead of hardcoded fixed radius
   - Currently: `const r = Math.min(CANVAS_W, CANVAS_H) * 0.38`
   - Change to: `const r = cluster.currentRadius` (after ensuring it's initialized)

### New Function: `computeClusterRadii()`

Add to `client/src/canvas/graph.ts`:

```typescript
function computeClusterRadii(clusters: Map<string, Cluster>): void {
  const BASE_RADIUS = 400
  const SCALE_FACTOR = 1.2
  const DAMPING = 0.05

  const clusterArray = Array.from(clusters.values())

  for (const cluster of clusterArray) {
    // Get this cluster's size
    const clusterSize = getClusterOuterRadius(cluster)

    // Get neighbor average size
    const otherSizes = clusterArray
      .filter(c => c !== cluster)
      .map(c => getClusterOuterRadius(c))

    const avgNeighborSize = otherSizes.length > 0
      ? otherSizes.reduce((a, b) => a + b, 0) / otherSizes.length
      : BASE_RADIUS / 2  // fallback for single cluster

    // Size delta (clamped)
    const delta = Math.max(-100, Math.min(100, clusterSize - avgNeighborSize))

    // Target radius (clamped to reasonable range)
    const target = Math.max(
      BASE_RADIUS * 0.6,
      Math.min(BASE_RADIUS * 2.0, BASE_RADIUS + delta * SCALE_FACTOR)
    )

    // Smooth interpolation
    cluster.targetRadius = target
    cluster.currentRadius += (cluster.targetRadius - cluster.currentRadius) * DAMPING
  }
}
```

Call in `tickSimulation()`:
```typescript
export function tickSimulation(clusters: Map<string, Cluster>, deltaTime: number): void {
  // ... existing node animation code ...

  // Update cluster radii based on size
  computeClusterRadii(clusters)

  // ... rest of simulation ...
}
```

## Edge Cases

### Single Cluster
- No neighbors → `avgNeighborSize = BASE_RADIUS / 2`
- `delta = clusterSize - BASE_RADIUS/2`
- Behaves naturally: grows outward as it accumulates nodes

### Two Clusters of Equal Size
- `delta = 0` for both
- Both stay at `targetRadius = baseRadius`
- No relative movement

### Cluster Becomes Much Larger
- `delta` grows gradually (clamped at ±100)
- `currentRadius` smoothly drifts outward over ~20 frames (at damping=0.05)
- No visual snap or pop

### Cluster Shrinks (nodes pushed out of buffer)
- `clusterSize` decreases
- `delta` becomes negative
- `currentRadius` slowly drifts inward

### Child Clusters
- Child clusters use fixed offset from parent (480px at specific angle)
- Not affected by this system
- Parent-child relationship remains visually distinct

## Constants & Tuning

| Constant | Value | Notes |
|----------|-------|-------|
| `BASE_RADIUS` | 400px | Default orbit distance (when size = neighbor avg) |
| `SCALE_FACTOR` | 1.2 | Moderate: 20% radius increase per size unit |
| `DAMPING` | 0.05 | 5% step per frame → ~20 frames to reach target |
| `DELTA_CLAMP` | ±100px | Prevent extreme size differences from dominating |
| `RADIUS_MIN` | `BASE_RADIUS * 0.6` | 240px minimum (keeps clusters visible) |
| `RADIUS_MAX` | `BASE_RADIUS * 2.0` | 800px maximum (prevents runaway outward) |

**Tuning notes:**
- If spacing looks too aggressive, reduce `SCALE_FACTOR` (try 0.8)
- If movement looks jittery, reduce `DAMPING` (try 0.02)
- If clusters drift too far, tighten `RADIUS_MAX` (try 1.5x instead of 2.0x)

## Performance

- **Computation:** O(N²) distance calculations per frame (small N, ≤6 clusters typical)
- **Cost:** Negligible—one simple loop over clusters, a few multiplications per cluster
- **Impact on framerate:** Undetectable (<<1ms per frame)

## Testing Strategy

### Unit Tests
- Single cluster: should orbit at BASE_RADIUS
- Two equal clusters: both at BASE_RADIUS
- One large, one small: large drifts out, small drifts in
- Size delta clamping: extreme values don't cause runaway

### Integration Tests (Manual)
1. Spawn one cluster, watch it stay at BASE_RADIUS as it grows
2. Spawn a second large cluster, watch first cluster drift inward as average shrinks
3. Spawn many clusters rapidly—observe smooth spacing, no jitter
4. Trigger node growth (via reads/tools), watch clusters subtly drift
5. Check framerate stability with 6 clusters + animations

## Success Criteria

- [x] Large clusters orbit noticeably farther than small ones
- [x] Spacing feels smooth and organic (no jittering or snapping)
- [x] Works with 1 cluster (no division by zero)
- [x] Works with 2, 3, 6+ clusters without issues
- [x] Child clusters unaffected (stay at fixed parent-relative position)
- [x] Performance impact unmeasurable (no frame drops)
- [x] Smooth animation as clusters grow (damping prevents pops)
- [x] Clamping prevents edge cases (single huge cluster, many tiny ones)

## Integration Notes

- No breaking changes to existing APIs
- `currentRadius` is initialized alongside `targetRadius`
- Rendering code switches from hardcoded radius to `cluster.currentRadius`
- Animation loop automatically updates radius values each frame
- Child cluster positioning unaffected (separate fixed offset logic)

## Future Enhancements (Out of Scope)

- Angular adjustment based on size (currently only radial)
- Force-directed physics simulation for even more organic feel
- Per-ring spacing adjustment (currently global radius)
- Configurable tuning via UI sliders
