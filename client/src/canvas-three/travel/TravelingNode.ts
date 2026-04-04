/**
 * TravelingNode — owns all Three.js objects for one traveling event.
 *
 * Each instance has:
 *   - A sprite HEAD (suppressed for Prompt / Notification)
 *   - A LINE TRAIL (comet tail)
 *   - Event-specific SECONDARIES: rings, sparks, arcs, branches, forks
 *
 * States: traveling → stalled (Error only) → fading → done
 */
import * as THREE from 'three'
import { samplePath, applyEasing } from './easing'
import type { SpawnParams } from './types'
import { buildEffect, type SecondaryEffect } from './effects/index'

const TRAIL_SEGMENTS = 40

// Shared head sprite texture (radial glow dot)
let _headTex: THREE.CanvasTexture | null = null
function getHeadTex(): THREE.CanvasTexture {
  if (_headTex) return _headTex
  const sz = 64, c = document.createElement('canvas')
  c.width = c.height = sz
  const ctx = c.getContext('2d')!
  const h = sz / 2
  const g = ctx.createRadialGradient(h, h, 0, h, h, h)
  g.addColorStop(0,    'rgba(255,255,255,1)')
  g.addColorStop(0.18, 'rgba(255,255,255,0.8)')
  g.addColorStop(0.45, 'rgba(255,255,255,0.25)')
  g.addColorStop(1,    'rgba(255,255,255,0)')
  ctx.fillStyle = g; ctx.fillRect(0, 0, sz, sz)
  _headTex = new THREE.CanvasTexture(c)
  return _headTex
}

export interface SettledNode {
  position: THREE.Vector3
  color: THREE.Color
}

// States
type State = 'waiting' | 'traveling' | 'stalled' | 'fading' | 'done'

export class TravelingNode {
  readonly group: THREE.Group
  done = false
  settled: SettledNode | null = null
  /** Populated when midSpawnFrac is crossed; harvested by ParticleCloud */
  midPendingSpawns: SpawnParams[] | null = null

  private p: SpawnParams
  private state: State
  private progress = 0
  private elapsed = 0      // total time since construction
  private stallTimer = 0   // time spent stalling
  private trailFade = 1.0
  private stallPos = new THREE.Vector3() // where node stalled
  private midSpawnFired = false

  private head: THREE.Sprite
  private headMat: THREE.SpriteMaterial
  private trail: THREE.Line
  private trailMat: THREE.LineBasicMaterial
  private trailPosArr: Float32Array

  // Secondary visual effects
  private effects: SecondaryEffect[] = []

  constructor(params: SpawnParams, buildEffectOverride?: typeof buildEffect) {
    this.p = params
    this.group = new THREE.Group()
    this.state = (params.spawnDelay && params.spawnDelay > 0) ? 'waiting' : 'traveling'

    // ── Head sprite ──
    const suppressHead = params.headSize === 0
    this.headMat = new THREE.SpriteMaterial({
      map: getHeadTex(),
      color: params.color.clone(),
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
      opacity: suppressHead ? 0 : 1,
    })
    this.head = new THREE.Sprite(this.headMat)
    const hs = Math.max(0.01, params.headSize)
    this.head.scale.set(hs, hs, 1)
    this.head.position.copy(params.origin)
    this.group.add(this.head)

    // ── Trail ──
    this.trailPosArr = new Float32Array(TRAIL_SEGMENTS * 3)
    const trailCol = new Float32Array(TRAIL_SEGMENTS * 3)
    for (let i = 0; i < TRAIL_SEGMENTS; i++) {
      this.trailPosArr[i*3]   = params.origin.x
      this.trailPosArr[i*3+1] = params.origin.y
      this.trailPosArr[i*3+2] = params.origin.z
      const t = i / (TRAIL_SEGMENTS - 1)
      const b = Math.pow(1 - t, 2.2) * params.trailBrightness
      trailCol[i*3]   = params.color.r * b
      trailCol[i*3+1] = params.color.g * b
      trailCol[i*3+2] = params.color.b * b
    }
    const trailGeo = new THREE.BufferGeometry()
    trailGeo.setAttribute('position', new THREE.BufferAttribute(this.trailPosArr, 3))
    trailGeo.setAttribute('color',    new THREE.BufferAttribute(trailCol, 3))
    this.trailMat = new THREE.LineBasicMaterial({
      vertexColors: true, transparent: true, opacity: 1,
      blending: THREE.AdditiveBlending, depthWrite: false,
    })
    this.trail = new THREE.Line(trailGeo, this.trailMat)
    this.group.add(this.trail)

    // ── Secondary effects ──
    const _buildEffect = buildEffectOverride ?? buildEffect
    const effect = _buildEffect(params._tool ?? '', this.group, params)
    if (effect) {
      this.effects.push(effect)
      // If the effect owns the trail, hide the default one
      if (effect.suppressDefaultTrail) {
        this.trailMat.opacity = 0
        this.trailMat.visible = false
      }
    }
  }

  // ── Tick ─────────────────────────────────────────────────────────────────

  tick(dt: number) {
    if (this.state === 'done') return
    this.elapsed += dt

    if (this.state === 'waiting') {
      if (this.elapsed >= (this.p.spawnDelay ?? 0)) this.state = 'traveling'
      else return
    }

    if (this.state === 'traveling') this._tickTravel(dt)
    else if (this.state === 'stalled') this._tickStall(dt)
    else if (this.state === 'fading')  this._tickFade(dt)
  }

  private _tickTravel(dt: number) {
    const p = this.p
    this.progress = Math.min(1, this.progress + dt / p.travelTime)
    const prog = this.progress

    // Mid-flight spawn (e.g. prompt asteroid split)
    if (!this.midSpawnFired && p.midSpawnFrac != null && prog >= p.midSpawnFrac) {
      this.midSpawnFired = true
      if (p.pendingSpawns?.length) {
        this.midPendingSpawns = p.pendingSpawns
        // Clear so _onLand doesn't fire them again
        ;(p as any).pendingSpawns = undefined
      }
    }

    // Check stall
    if (p.stallAt != null && prog >= p.stallAt && this.state === 'traveling') {
      this._triggerStall()
      return
    }

    const ease = applyEasing(p.pathConfig.easing, prog)
    const headPos = samplePath(p.pathConfig, p.origin, p.target, ease)
    this.head.position.copy(headPos)

    // Trail — either custom (owned by effect) or default vertex-color line
    const customTrailEffect = this.effects.find(fx => fx.suppressDefaultTrail)
    if (customTrailEffect) {
      customTrailEffect.trailTick?.(prog, dt, this.elapsed, this.head)
    } else {
      for (let s = 0; s < TRAIL_SEGMENTS; s++) {
        const lag = (s / (TRAIL_SEGMENTS - 1)) * 0.45 * p.trailLength
        const segP = Math.max(0, prog - lag)
        const segEase = applyEasing(p.pathConfig.easing, segP)
        const sp = samplePath(p.pathConfig, p.origin, p.target, segEase)
        this.trailPosArr[s*3]   = sp.x
        this.trailPosArr[s*3+1] = sp.y
        this.trailPosArr[s*3+2] = sp.z
      }
      ;(this.trail.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true
    }

    // Head color shift in final 30%
    if (prog > 0.7 && p.headSize > 0) {
      const lt = (prog - 0.7) / 0.3
      this.headMat.color.lerpColors(p.color, p.colorEnd, lt)
    }

    // Launch flare on head
    if (p.headSize > 0) {
      const flare = Math.max(0, 1 - prog * 5)
      const hs = p.headSize * (1 + flare * 2.2)
      this.head.scale.set(hs, hs, 1)
    }

    this._tickSecondaries(prog, dt)

    if (prog >= 1) this._onLand()
  }

  private _tickStall(dt: number) {
    this.stallTimer += dt
    const vibAmp = 2.5 * (1 - this.stallTimer / (this.p.stallDuration ?? 0.5))
    const vx = Math.sin(this.elapsed * 28) * vibAmp
    const vz = Math.cos(this.elapsed * 21) * vibAmp
    this.head.position.set(this.stallPos.x + vx, this.stallPos.y, this.stallPos.z + vz)

    // trail stays at stall position, frozen
    if (this.stallTimer >= (this.p.stallDuration ?? 0.5)) {
      this._onLand()
    }
  }

  private _triggerStall() {
    this.state = 'stalled'
    const prog = this.p.stallAt!
    const ease = applyEasing(this.p.pathConfig.easing, prog)
    this.stallPos.copy(samplePath(this.p.pathConfig, this.p.origin, this.p.target, ease))
    this.head.position.copy(this.stallPos)

    for (const fx of this.effects) {
      fx.onStall?.(this.stallPos)
    }
  }

  private _onLand() {
    const wasStalled = this.state === 'stalled'
    this.state = 'fading'
    this.settled = {
      position: (wasStalled ? this.stallPos : this.p.target).clone(),
      color: this.p.colorEnd.clone(),
    }

    for (const fx of this.effects) {
      fx.onLand?.()
    }
  }

  private _tickFade(dt: number) {
    this.trailFade = Math.max(0, this.trailFade - dt / Math.max(0.05, this.p.trailFadeTime))
    const f = this.trailFade * this.trailFade
    this.trailMat.opacity = f
    this.headMat.opacity  = f

    // Keep custom trail animating during fade so it doesn't freeze
    const customTrailEffect = this.effects.find(fx => fx.suppressDefaultTrail)
    if (customTrailEffect) {
      customTrailEffect.trailTick?.(1.0, dt, this.elapsed, this.head)
    }

    for (const fx of this.effects) {
      fx.applyFade(f)
    }

    // Also allow custom effects to signal they are fully done
    for (const fx of this.effects) {
      if (fx.shouldMarkDone) { this.state = 'done'; break }
    }

    if (this.trailFade <= 0) this.state = 'done'
    this.done = this.state === 'done'
  }

  private _tickSecondaries(prog: number, dt: number) {
    for (const fx of this.effects) {
      fx.tick(prog, dt, this.elapsed, this.state, this.head)
      // suppressDefaultTrail effects own their own lifecycle — only checked in _tickFade
      if (fx.shouldMarkDone && !fx.suppressDefaultTrail) {
        this.state = 'done'
        this.done = true
      }
    }
  }

  dispose() {
    this.trail.geometry.dispose()
    this.trailMat.dispose()
    this.headMat.dispose() // don't dispose shared map
    for (const fx of this.effects) {
      for (const e of fx.entries) {
        if ((e.obj as any).geometry) (e.obj as any).geometry.dispose()
        e.mat.dispose()
      }
      fx.dispose?.()
    }
  }
}
