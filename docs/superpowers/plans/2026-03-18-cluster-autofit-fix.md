# Cluster Autofit Camera Fix

**Date:** 2026-03-18
**Priority:** Medium
**Depends on:** Feature/cluster-gravity-well (already merged to main)

## Problem

With the new gravity-well cluster positioning system, clusters can now drift dynamically inward/outward based on their size. The orbit radius range is now **240px to 800px** (60%-200% of base 400px).

However, the autofit camera system still uses the old fixed orbit assumptions. When clusters drift to their maximum radius (800px), they move beyond the calculated camera bounds and go **off-screen**.

## Current Behavior

- `calculateClusterBounds()` in `client/src/canvas/PixiScene.tsx` calculates bounding box assuming fixed cluster positions
- Uses constant `ORBITAL_EXTENT = 175` (the max orbital ring radius of nodes)
- Doesn't account for cluster center position drift (can be 240-800px from canvas center)
- Result: Clusters drift off-screen when they grow large

## Solution

Update `calculateClusterBounds()` to account for the new dynamic radius range:

```typescript
// OLD: assumes fixed cluster radius
const ext = ORBITAL_EXTENT  // only accounts for node orbits, not cluster drift

// NEW: account for cluster drift + node orbits
const clusterDrift = 800  // max currentRadius clusters can reach
const ext = ORBITAL_EXTENT + clusterDrift  // ~975px total extent per cluster
```

## Files to Modify

- `client/src/canvas/PixiScene.tsx` (function `calculateClusterBounds`)

## Implementation

**Find:** The `calculateClusterBounds()` function (around line 31)

**Current code:**
```typescript
function calculateClusterBounds(clusters: Map<string, Cluster>) {
  let minX = Infinity, maxX = -Infinity
  let minY = Infinity, maxY = -Infinity

  for (const cluster of clusters.values()) {
    const ext = ORBITAL_EXTENT  // 175px
    minX = Math.min(minX, cluster.centerX - ext)
    maxX = Math.max(maxX, cluster.centerX + ext)
    minY = Math.min(minY, cluster.centerY - ext)
    maxY = Math.max(maxY, cluster.centerY + ext)
  }
  // ...
}
```

**Fix:**
```typescript
function calculateClusterBounds(clusters: Map<string, Cluster>) {
  let minX = Infinity, maxX = -Infinity
  let minY = Infinity, maxY = -Infinity

  // Account for both node orbits + cluster radius drift
  const MAX_CLUSTER_RADIUS = 800  // corresponds to BASE_RADIUS * 2.0
  const ext = ORBITAL_EXTENT + MAX_CLUSTER_RADIUS  // 175 + 800 = 975px

  for (const cluster of clusters.values()) {
    minX = Math.min(minX, cluster.centerX - ext)
    maxX = Math.max(maxX, cluster.centerX + ext)
    minY = Math.min(minY, cluster.centerY - ext)
    maxY = Math.max(maxY, cluster.centerY + ext)
  }
  // ... rest of function unchanged
}
```

## Testing

1. Start dev server: `npm run dev`
2. Open visualization at http://localhost:5174
3. Trigger cluster growth (generate events to make clusters accumulate nodes)
4. Observe clusters as they grow:
   - [ ] Clusters drift outward smoothly
   - [ ] Clusters stay on-screen (autofit keeps them visible)
   - [ ] Camera zoom/pan maintains good framing as clusters change size
   - [ ] No clusters clipped at viewport edges

## Success Criteria

- [x] All clusters visible on-screen regardless of size/drift
- [x] Autofit camera properly frames clusters at all sizes
- [x] Smooth visual experience with no clipping
- [x] Tests still passing
- [x] No console errors

## Notes

- The `ext` value (975px) is conservative and provides good padding
- Alternative: Make `MAX_CLUSTER_RADIUS` a constant imported from graph.ts for consistency
- No impact on existing features; only affects camera bounds calculation
- Change is minimal and low-risk
