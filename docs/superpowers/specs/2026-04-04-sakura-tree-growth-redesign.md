# Sakura Tree Growth Redesign

**Date:** 2026-04-04  
**Branch:** mycelium  
**Status:** Approved

---

## Problem

The Space Colonization Algorithm (SCA) grows ALL associated nodes simultaneously each step. After entering the canopy phase this produces O(n) new nodes per event — the tree saturates after ~20 events, hits the 600k vertex cap at ~155 events, and all subsequent events produce zero visible feedback.

---

## Goals

- **1 node per event, always** — predictable, incremental, never overwhelming
- **Never "full"** — dome expands + attractors refill indefinitely
- **Whole tree looks odd** — weird silhouette AND weird branching character throughout
- **Session-unique personality** — each seed produces a visually distinct tree
- **Events fire independently** — each event creates its own sap pulse that runs to completion; new events never cancel existing animations

---

## Architecture

All changes are contained in `SpaceColonizationTree.ts`. No other files need structural changes — `SakuraApp.applyEvent` already handles variable `newNodeIds` counts.

---

## Section 1 — Growth Rate (1 node per event)

**Change:** In `growOneStep`, after building `associations`, select the **single node with the most attractor associations** instead of iterating all of them. Ties broken by preferring deeper nodes (pushes growth toward the canopy frontier).

```
// Before: grow all
for (const [nodeId, attPositions] of associations.entries()) { ... }

// After: grow best one
let bestId = -1, bestCount = 0, bestDepth = -1
for (const [nodeId, attPositions] of associations.entries()) {
  const node = nodeMap.get(nodeId)!
  if (attPositions.length > bestCount ||
      (attPositions.length === bestCount && node.depth > bestDepth)) {
    bestId = nodeId; bestCount = attPositions.length; bestDepth = node.depth
  }
}
// grow only bestId
```

**Infinite growth — two triggers for dome expansion:**
1. Every 50 events unconditionally: `envelopeScale += 0.04` (slow steady expansion)
2. When active attractors fall below `REFILL_THRESHOLD` (existing fallback, kept)

Attractor refill also runs in trunk phase (currently it only runs after SCA branching — fix the early return to also check and refill).

---

## Section 2 — Weird Silhouette (attractor cloud shape)

The shape of the attractor cloud IS the shape of the tree. Making the cloud asymmetric makes the whole tree asymmetric.

**Seed-derived personality** (computed once in `init`, stored on the instance):

```ts
interface TreePersonality {
  leanAngle: number        // 0–25° — how much the whole tree tilts
  leanDirection: number    // 0–360° — which direction it leans
  gnarliness: number       // 0.8–2.5 — multiplier on gnarl strength throughout
  windDriftX: number       // horizontal tropism component X
  windDriftZ: number       // horizontal tropism component Z  
  hotspots: THREE.Vector3[] // 2–4 attractor cluster centers (dome-relative)
}
```

Derived deterministically from `seed` using the seeded RNG.

**Tilted dome:** When scattering attractors, rotate each candidate position by `leanAngle` around the horizontal axis aligned with `leanDirection`. The entire crown grows toward the lean direction.

**Hotspot clusters:** 60% of attractors are placed near 2–4 hotspot positions (gaussian falloff, sigma = `DOME_RADIUS_XZ * 0.3`). 40% fill uniformly. Creates dense-on-one-side, sparse-on-the-other asymmetric crowns.

**Offset trunk start:** Root direction gets a seed-derived tilt of 3–8° so the trunk starts angled rather than perfectly vertical.

---

## Section 3 — Weird Branching Character

**Depth-weighted gnarl** (`GNARL_STRENGTH` becomes a depth function):

| Depth     | Gnarl multiplier       |
|-----------|------------------------|
| 0–5       | `0.35–0.45 × gnarliness` — heavy kicks, sharp bends in trunk + primaries |
| 6–12      | `0.18 × gnarliness`    |
| 12+       | `0.10 × gnarliness`    |

**Accumulated drift (S-curves):** Each node stores its last random perturbation vector (`lastPerturbation`). When computing the growth direction, inherit 20% of the parent's perturbation before adding a new random kick. This creates flowing S-curves — branches change direction gradually then snap back — instead of independent per-segment jitter.

**Wind tropism (horizontal component):** Tropism starts at depth 2 (currently depth 4). Add a horizontal wind component `(windDriftX, 0, windDriftZ)` from personality, scaled by `tropismFactor`. The whole tree leans and droops toward the wind side consistently.

---

## Section 4 — Independent Event Animations

Each `applyEvent` call creates exactly 1 new node → exactly 1 sap pulse (`traceToRoot(newNodeId)`). The pulse is added to `SapPulseSystem` which runs it to completion. MAX_PULSES=40 already handles eviction of fully-completed pulses; no change needed here.

**Constraint:** `applyEvent` must never cancel, reset, or shorten existing pulses. The current implementation already satisfies this — pulses are appended, not replaced.

---

## Constants Summary (changes from current)

| Constant | Current | New |
|---|---|---|
| `STEPS_PER_EVENT` | 1 | 1 (unchanged, but now only 1 node grows per step) |
| `GNARL_STRENGTH` | 0.14 (flat) | depth-weighted, 0.10–0.45 × personality.gnarliness |
| `TROPISM_START_DEPTH` | 4 | 2 |
| `TROPISM_STRENGTH` | 0.06 | 0.06 base + horizontal wind component |
| Dome expansion | only on low attractors | also every 50 events |
| Attractor placement | uniform random ellipsoid | 60% hotspot-clustered + 40% uniform |

---

## Out of Scope

- Changing `MAX_VERTICES` or geometry buffer sizes
- Changing the bark/flower/petal rendering
- Any changes outside `SpaceColonizationTree.ts` and its constants
