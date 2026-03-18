# Auto-Fit Clusters Button Design

**Date:** 2026-03-18
**Feature:** Automatic camera fitting to keep all clusters visible in view

---

## Overview

Add a toggle button beside the audio control that, when enabled, continuously adjusts the camera (scale & pan) to keep all clusters visible in the canvas. The feature frames clusters smoothly over ~1.5 seconds with gentle blending when the user interacts (pans/zooms).

---

## Functional Requirements

### Button Behavior
- **Default state:** OFF
- **Persistence:** Remember state in localStorage (`'claude-live-autofit-enabled'`) like the audio toggle
- **Placement:** Top-right HUD, immediately right of the audio toggle button
- **Visual:** Icon or text label indicating "auto-fit" or framing intent

### Camera Behavior (When Enabled)
1. **Continuous fitting:** Every frame, calculate the bounding box of all clusters, including their orbital node extents (±175px from center)
2. **Target computation:** Derive target `scale` and `viewOffset` to frame all clusters with ~120px padding (in world coordinates, invariant to scale)
3. **Smooth interpolation:** Lerp current camera toward target with a time constant of ~1.5 seconds (slow, glacial movement)
4. **Blend during interaction:** When user drags or scrolls:
   - Apply target with reduced influence (~15% blend)
   - After drag ends, fade blend strength back to 100% over ~800ms
   - This allows the camera to gently pull back toward the fit frame without fighting the user
5. **Debouncing:** If clusters are being laid out or positions change rapidly, wait for a brief settle period (~100ms) before recalculating to avoid jitter

### When Disabled
- Normal pan/zoom behavior (no auto-fit influence)
- User retains full manual control

---

## Architecture

### State Management

**App.tsx:**
- Add state for autofit toggle (mirrors audio pattern)
- Load from localStorage on mount
- Pass `autofitEnabled` prop to `<PixiScene>`
- Define `setAutofitEnabled()` callback for button click

**localStorage key:** `'claude-live-autofit-enabled'`

### Camera Calculation (PixiScene.tsx)

**State tracking (new variables at animation loop scope):**
- `lastInteractionTime`: timestamp of last drag/wheel event (updated on mousedown/wheel)
- `blendFactor`: value from 0 to 1, decays back to 1 after interaction stops
- `lastBboxUpdate`: timestamp of last bounding box calc (debounce rapid layout changes)

**Frame loop additions:**
1. **Update interaction state:**
   - If user is currently dragging or a wheel event just fired, set `lastInteractionTime = now`
   - Compute `timeSinceInteraction = now - lastInteractionTime`
   - Decay blend factor: `blendFactor = Math.min(1, timeSinceInteraction / 800)` (fades to 1.0 over 800ms)
   - While dragging: `blendFactor = 0.15`

2. **Calculate bounding box (with debouncing):**
   - If `now - lastBboxUpdate > 100ms`, recalculate:
     - Iterate all clusters, include orbital extent (±175px from center)
     - Find min/max X and Y: `{ minX, maxX, minY, maxY }`
     - Add padding: `minX -= 120, maxX += 120, minY -= 120, maxY += 120` (world coords)
     - Clamp target scale to existing bounds (0.2–4.0)
     - Set `lastBboxUpdate = now`

3. **Compute target camera frame:**
   - Calculate `targetScale` to fit bounding box in viewport with padding
   - Calculate `targetViewOffset` to center the bounding box
   - Account for current scale and viewport dimensions

4. **Interpolate with blending:**
   - Effective target = `current + (targetValue - current) * blendFactor`
   - Apply exponential smoothing (time constant ~1.5s):
     - `scale += (effectiveTargetScale - scale) * (dt / 1500)`
     - `viewOffset.x += (effectiveTargetOffsetX - viewOffset.x) * (dt / 1500)`
     - `viewOffset.y += (effectiveTargetOffsetY - viewOffset.y) * (dt / 1500)`

### Data Flow

```
App.tsx (autofitEnabled state)
  ↓ (prop)
PixiScene.tsx (receive autofitEnabled)
  ↓ (in animation loop)
Camera target calc (bounding box, scale, offset)
  ↓
Blend & interpolation (smooth lerp + interaction damping)
  ↓
Updated scale / viewOffset (consumed by render pass)
```

---

## Edge Cases & Constraints

1. **Orbital extent:** Clusters have nodes orbiting up to ~175px from center. Bounding box calculation **must** include this extent to avoid clipping nodes at viewport edges. Use `ORBIT_RADII[2]` (175px) as max extent.
2. **No clusters:** If `clusters.size === 0`, skip fitting entirely (hold current view)
3. **Single cluster:** Fit with same padding logic as multiple
4. **New clusters appearing:** Bounding box updates on next frame; smooth interpolation to new frame prevents jitter
5. **Scale limits:** Clamp `targetScale` to existing bounds (0.2x – 4.0x) to prevent over/under-zoom
6. **Padding:** Use ~120px fixed padding in **world coordinates** (scale-invariant) for consistent visual spacing
7. **Rapid layout changes:** Debounce bounding box recalculation to ~100ms to prevent jitter during cluster spawn/layout phases
8. **Interaction during fit:** Drag/wheel reduces blend factor to 0.15 so user input dominates; blend fades back over 800ms allowing gentle auto-fit pull

---

## Implementation Checklist

- [ ] Add autofit state to App.tsx (useState + localStorage)
- [ ] Add autofit button to HUD (beside audio toggle)
- [ ] Add `setAutofitEnabled` callback and onClick handler
- [ ] Refactor PixiScene.tsx: move interaction state tracking to animation loop scope
- [ ] Implement camera target calculation with bounding box (including orbit extent)
- [ ] Implement debounced bbox update (~100ms settle)
- [ ] Implement smooth lerp with interaction-based blend factor
- [ ] Test with 0, 1, and multiple clusters
- [ ] Test interaction blending (drag/wheel while enabled, verify gentle pull-back)
- [ ] Test with scale at min/max bounds (0.2x–4.0x) to ensure target respects limits
- [ ] Test rapid interaction (drag → wheel → drag) to verify blend decay is smooth
- [ ] Test state persistence (reload page, check localStorage)
- [ ] Test during layout phase (many clusters appearing rapidly)
- [ ] Verify no performance regression (tight animation loop)

---

## Success Criteria

✓ Button toggles on/off and persists across page reload
✓ When enabled, camera smoothly frames all clusters
✓ Clusters appear/disappear, camera re-frames smoothly
✓ User can pan/zoom; camera gently pulls back after interaction stops
✓ No interaction fighting—blending makes it feel natural
✓ ~1.5s animation time is perceptible but not annoying

---

## Notes

- Reuse the existing `scale` and `viewOffset` variables in PixiScene—no new camera abstraction needed
- The blending logic can be simple: check if `dragging` or recent wheel event, decay the blend factor over time
- This is a "nice to have" UX enhancement—keep implementation lean and avoid over-engineering
