# Sakura Visual Improvements — Design Spec

**Date:** 2026-04-03
**Status:** Approved
**Scope:** Visual quality overhaul — layout spread, bark richness, petal overhaul, atmosphere, wind, single root anchor.

---

## 1. Single Stable Root

One permanent root trunk segment at origin (height ~15 units, radius ~7). Always present. Each project/session tree spawns as a major limb from the top of this root. Multiple trees spread radially: first tree goes up-center, second offsets 120 degrees, third 240 degrees. Root uses bark shader with thicker texture (higher FBM amplitude). This replaces the current per-colony positioning.

## 2. Wide Spreading Canopy

Tune TreeBuilder.ts layout parameters:

- **Spread:** `0.18-1.72` becomes `0.6-2.4`
- **Upward bias:** folders `lerp(0.96, 0.2, canopy)` becomes `lerp(0.5, -0.1, canopy)`
- **Continuation:** `0.96/0.78/0.54` becomes `0.6/0.4/0.25`
- **Droop:** files `0.08 + depth * 0.05` becomes `0.15 + depth * 0.09`
- **Branch length:** depth 1-2 branches increase ~40%
- **Result:** Crown 2-3x wider than tall, classic spreading cherry tree silhouette

## 3. Bark Richness

- **Depth-based color:** trunk gray-brown `#3a2a1e`, limbs warm `#5c3a22`, twigs reddish `#7a4a30`. Add `uDepth` uniform to bark shader.
- **Texture scaling:** trunk = coarse deep grain, twigs = smooth. Vary `uSurfaceScale`/`uSurfaceNoise` based on branch radius.
- **Junction collars:** darker color, higher displacement for natural branch collar look.

## 4. Petal Overhaul

- **Size:** scale up 2-3x (0.5 units to ~1.5 units)
- **Orientation:** random rotation per petal around anchor point so petals face outward
- **Cluster density:** 5-9 becomes 8-14 petals per file endpoint
- **Ambient drift:** 1-3 random petals detach every few seconds without events. New `ambientDrift(elapsed)` method on PetalSystem.

## 5. Atmosphere

- **Sky:** add FBM cloud layer drifting slowly, warm pink-purple horizon
- **Ground:** radial gradient (warm center, dark edges), subtle noise texture
- **Fog:** increase density 0.0025 to 0.004
- **Particles:** 800 to 1200 count, opacity 0.08 to 0.12, warm pink color variation
- **Lighting:** increase hemisphere contrast, add warm directional from upper-left

## 6. Wind & Ambient Life

- **Branch sway:** increase displacement 3-4x. Depth-based multiplier: `depth * 0.3` capped at 2.0
- **Petal flutter:** increase sway amplitude from 0.3/0.2/0.08 to 0.8/0.5/0.2
- **Bark breathing:** increase breathing amplitude ~2x
