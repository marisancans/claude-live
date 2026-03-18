# Prompt Snake Animation Design
**Date:** 2026-03-18
**Feature:** Animated word snakes flowing from outer space to cluster core

## Overview

Replace the simple text animation with an elaborate "snake" effect where each user prompt is broken into individual words that animate along a random curved spline from the outer edge toward the cluster core. Words twist and rotate perpendicular to the spline path, creating an organic, flowing visual.

Multiple prompts stream in **simultaneously** — each gets its own random spline, and all active snakes remain visible and animating at the same time.

## Visual Behavior

### Word Grouping
- Prompt text split into individual words
- Words maintain tight vertical spacing (no horizontal spread along path)
- All words in a snake group together as a unit

### Path Generation
- **Random spline curve** from random direction (0-360° around cluster center)
- Each prompt gets a unique spline path (via random control points)
- Path travels from outer edge inward toward cluster core center

### Word Rotation
- **Words stay vertical at all times** (no rotation/distortion)
- Always rendered upright, regardless of spline curvature
- Keeps text readable and clean

### Animation Properties
- **Duration:** ~3 seconds (slower than current 1.5s promptFlying)
- **Fade In:** Words grow from ~30% opacity → 100%
- **Scale:** Words grow from ~0.6x size → 1.0x size
- **Decay:** Similar to current `promptFlying` state but slower (0 → 1 over ~180 frames)

### Multiple Snakes
- Prompts trigger independently — no queueing
- Multiple snakes can be in flight simultaneously
- All snakes remain visible during animation (no culling)
- Staggered arrivals create a streaming visual effect

## Data Structure Changes

### Cluster type
Current prompt animation data in `Cluster`:
```typescript
promptFlying: number        // 0-1 animation progress
promptText: string          // full prompt text
promptColor: string         // animation color
```

New snake animation data:
```typescript
// Array of in-flight snakes, each independent
promptSnakes: Array<{
  words: string[]           // split prompt text
  color: string             // animation color
  progress: number          // 0-1 animation progress (same as promptFlying)
  splinePath: SplinePath    // pre-computed spline curve
  startAngle: number        // 0-360° spawn direction
}>

// Helper type
type SplinePath = {
  controlPoints: Array<{x: number, y: number}>  // for spline interpolation
  // Can precompute segment info for efficient rotation lookup
}
```

### Alternative (simpler): Keep single promptFlying, add snakeMode
```typescript
promptFlying: number        // existing field, now means "snake animation progress"
promptText: string          // existing field
promptColor: string         // existing field
snakeWords?: string[]       // NEW: split words (lazy-computed)
splinePath?: SplinePath     // NEW: pre-computed path
snakeStartAngle?: number    // NEW: spawn direction
```

**Recommendation:** Use the second approach (extend existing struct) to minimize refactoring. Migration path is simpler.

## Implementation Phases

### Phase 1: Spline Generation & State Management
- Generate random cubic/quadratic spline from spawn point to core
- Split prompt text into words on UserPromptSubmit hook
- Store spline path with animation state

### Phase 2: Animation Loop Integration
- Decay `promptFlying` as before (0 → 1 over ~1.5s)
- Compute word positions along spline based on progress
- Calculate tangent rotation at each word position

### Phase 3: Rendering
- Iterate through words in snake
- Position each word along spline at interpolated progress
- Rotate word perpendicular to tangent
- Apply fade/scale based on position (tail fades faster)

### Phase 4: Cleanup & Polish
- Remove snakes when animation completes (promptFlying → 1)
- Glow effects, shadows (reuse existing code)
- Performance testing with 5+ simultaneous snakes

## Spline Curve Details

**Type:** Quadratic Bézier spline
**Control Points:** Generate with larger offset perpendicular to radial line for more dramatic curves

Example:
```
Start: (cluster.cx + cos(angle) * maxDist, cluster.cy + sin(angle) * maxDist)
Control: Offset perpendicular by ±80-150px (larger offset = more curvature)
End: (cluster.cx, cluster.cy)
```

**Evaluation:** Parameterize by progress (0 → 1), compute position and tangent at each word index.

## Word Positioning Along Snake

Given `progress` (0 → 1):
1. Map progress to spline parameter `t` (0 → 1)
2. For each word index `i`:
   - Offset `t` slightly per word (e.g., `t - i * 0.05`) to stagger along spline
   - Compute spline position at offset t
   - Clamp to valid range [0, 1]
3. Compute tangent (derivative) of spline at that t
4. Rotate word 90° perpendicular to tangent

## Tail Fading

As snakes progress toward core, tail words fade/shrink faster than head:
- Head word (last index) stays at full opacity/scale longer
- Tail word (first index) fades quickly
- Polynomial fade: `opacity = Math.pow(wordIndex / wordCount, 0.7)` applied on top of progress fade

## Success Criteria

- [ ] Multiple prompts animate simultaneously without interference
- [ ] Each snake follows unique random spline path
- [ ] Words twist smoothly along path (no jittering)
- [ ] Tail fading creates depth/perspective
- [ ] Animation loops cleanly (~1.5s) without visual pops
- [ ] Performance stable with 5+ concurrent snakes

## Notes

- Reuse existing `promptColor` + glow/shadow rendering code
- Do NOT persist snakes to localStorage or sessionStorage — snakes should only exist in-memory during current session
- Page reload clears all active snakes (ephemeral animation, not state)
- Consider pre-computing spline segments to avoid recalculation each frame
- CSS animations not suitable (need per-frame position computation)
