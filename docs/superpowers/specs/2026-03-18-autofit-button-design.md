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
1. **Continuous fitting:** Every frame, calculate the bounding box of all cluster centers
2. **Target computation:** Derive target `scale` and `viewOffset` to frame all clusters with ~120px padding
3. **Smooth interpolation:** Lerp current camera toward target with a time constant of ~1.5 seconds (slow, glacial movement)
4. **Blend during interaction:** When user drags or scrolls:
   - Apply target with reduced influence (~10–20% blend)
   - After drag ends, fade blend strength back to 100% over ~800ms
   - This allows the camera to gently pull back toward the fit frame without fighting the user

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

**Frame loop additions:**
1. If `autofitEnabled`, calculate bounding box of all clusters:
   - Iterate clusters: find min/max X and Y of `cluster.centerX` and `cluster.centerY`
2. Compute target frame:
   - Add padding (~120px on all sides)
   - Calculate `targetScale` and `targetViewOffset` to fit that box
3. Apply blending:
   - Track user interaction state (dragging/wheel scroll)
   - If interacting: `blendFactor = 0.15` (15% influence from target)
   - If not: smoothly increase `blendFactor` toward 1.0 over ~800ms
4. Interpolate:
   - Use exponential smoothing with time constant ~1.5s:
     - `scale += (targetScale - scale) * dt / 1.5`
     - `viewOffset.x += (targetViewOffset.x - viewOffset.x) * dt / 1.5`
     - `viewOffset.y += (targetViewOffset.y - viewOffset.y) * dt / 1.5`
   - Apply `blendFactor` to the deltas before adding them

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

1. **No clusters:** If `clusters.size === 0`, skip fitting (or fit to canvas center)
2. **Single cluster:** Fit with same padding logic
3. **New clusters appearing:** Bounding box updates automatically each frame; smooth transition to new frame
4. **Scale limits:** Respect existing min/max scale bounds (0.2x – 4x) during target computation
5. **Padding:** Use ~120px fixed padding for visual breathing room

---

## Implementation Checklist

- [ ] Add autofit state to App.tsx (useState + localStorage)
- [ ] Add autofit button to HUD (beside audio toggle)
- [ ] Add `setAutofitEnabled` callback and onClick handler
- [ ] Modify PixiScene.tsx animation loop to calculate camera target
- [ ] Implement bounding box calculation for clusters
- [ ] Implement smooth lerp with blending logic
- [ ] Test with 0, 1, and multiple clusters
- [ ] Test interaction blending (drag while enabled)
- [ ] Test state persistence (reload page, check localStorage)
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
