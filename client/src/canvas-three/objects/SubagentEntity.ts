/**
 * SubagentEntity — visual representation of a subagent in 3D space.
 *
 * 5 visual styles, selected by `style` parameter:
 *   1. tendril   — glowing vine growing from core, tip is the agent
 *   2. filament  — electric crackling line, energy flows both ways
 *   3. umbilical — smooth cord with flowing particles, agent moves freely
 *   4. whip      — fast lashing line, cracks at nodes then recoils
 *   5. proboscis — organic probing tube that feels around and locks on
 *
 * All styles share: physically connected to core, extending its reach.
 */
import * as THREE from 'three'

export type SubagentStyle = 'tendril' | 'filament' | 'umbilical' | 'whip' | 'proboscis'

const AGENT_COLOR = 0xc084fc
const SEG = 80 // segments for the connecting line

function rand(a: number, b: number) { return Math.random() * (b - a) + a }

export class SubagentEntity {
  group = new THREE.Group()
  style: SubagentStyle
  agentId: string

  // Tip position (the "agent" end)
  private tipPos = new THREE.Vector3(0, 0, 0)
  private tipVel = new THREE.Vector3()
  private tipTarget = new THREE.Vector3()

  // Line connecting core to tip
  private lineArr: Float32Array
  private lineGeo: THREE.BufferGeometry
  private lineMat: THREE.LineBasicMaterial
  private line: THREE.Line

  // Tip glow
  private tipMesh: THREE.Mesh
  private tipGlowMesh: THREE.Mesh

  // State
  private elapsed = 0
  fadeState: 'in' | 'alive' | 'out' | 'done' = 'in'
  private opacity = 0
  private growProgress = 0 // 0→1 how far the tendril has grown
  private _activityPulse = 0

  // Style-specific state
  private whipState: 'coiled' | 'striking' | 'recoiling' = 'coiled'
  private whipTimer = 0
  private whipStrikeTarget = new THREE.Vector3()
  private probeLockTimer = 0
  private probeLockedOn = false
  private wanderAngle = rand(0, Math.PI * 2)
  private wanderRadius = rand(40, 80)
  private filamentPhase = rand(0, Math.PI * 2)

  constructor(agentId: string, style: SubagentStyle) {
    this.agentId = agentId
    this.style = style

    // Line geometry
    this.lineArr = new Float32Array(SEG * 3)
    this.lineGeo = new THREE.BufferGeometry()
    this.lineGeo.setAttribute('position', new THREE.BufferAttribute(this.lineArr, 3))

    const lineColor = style === 'filament' ? 0x60a0ff
      : style === 'whip' ? 0xff6060
      : style === 'proboscis' ? 0x80e0a0
      : AGENT_COLOR

    this.lineMat = new THREE.LineBasicMaterial({
      color: lineColor,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    this.line = new THREE.Line(this.lineGeo, this.lineMat)
    this.group.add(this.line)

    // Tip sphere
    const tipColor = lineColor
    const tipGeo = new THREE.SphereGeometry(
      style === 'tendril' ? 2.0 :
      style === 'filament' ? 1.5 :
      style === 'umbilical' ? 2.5 :
      style === 'whip' ? 1.8 :
      2.0, // proboscis
      12, 12
    )
    const tipMat = new THREE.MeshBasicMaterial({ color: tipColor })
    this.tipMesh = new THREE.Mesh(tipGeo, tipMat)
    this.group.add(this.tipMesh)

    // Glow around tip
    const glowGeo = new THREE.SphereGeometry(
      style === 'umbilical' ? 6 : 4, 12, 12
    )
    const glowMat = new THREE.MeshBasicMaterial({
      color: tipColor,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    this.tipGlowMesh = new THREE.Mesh(glowGeo, glowMat)
    this.group.add(this.tipGlowMesh)

    // Initial tip target
    this.pickNewTarget()
  }

  private pickNewTarget() {
    const theta = rand(0, Math.PI * 2)
    const phi = Math.acos(rand(-0.6, 0.6))
    const r = rand(40, 90)
    this.tipTarget.set(
      Math.sin(phi) * Math.cos(theta) * r,
      Math.sin(phi) * Math.sin(theta) * r * 0.4,
      Math.sin(phi) * Math.sin(theta + Math.PI / 2) * r,
    )
  }

  tick(dt: number) {
    if (this.fadeState === 'done') return
    this.elapsed += dt

    // Fade in/out
    if (this.fadeState === 'in') {
      this.opacity = Math.min(1, this.opacity + dt * 1.5)
      this.growProgress = Math.min(1, this.growProgress + dt * 0.8)
      if (this.opacity >= 1 && this.growProgress >= 1) this.fadeState = 'alive'
    } else if (this.fadeState === 'out') {
      this.opacity = Math.max(0, this.opacity - dt * 2.0)
      this.growProgress = Math.max(0, this.growProgress - dt * 1.2)
      if (this.opacity <= 0) this.fadeState = 'done'
    }

    // Move tip based on style
    switch (this.style) {
      case 'tendril': this.tickTendril(dt); break
      case 'filament': this.tickFilament(dt); break
      case 'umbilical': this.tickUmbilical(dt); break
      case 'whip': this.tickWhip(dt); break
      case 'proboscis': this.tickProboscis(dt); break
    }

    // Update tip mesh position
    this.tipMesh.position.copy(this.tipPos)
    this.tipGlowMesh.position.copy(this.tipPos)

    // Update connecting line — curved from origin (0,0,0) to tip
    this.updateLine()

    // Apply opacity
    this._activityPulse = Math.max(0, this._activityPulse - dt * 3.0)
    this.lineMat.opacity = this.opacity * 0.6
    ;(this.tipMesh.material as THREE.MeshBasicMaterial).opacity = this.opacity
    ;(this.tipMesh.material as THREE.MeshBasicMaterial).transparent = true
    ;(this.tipGlowMesh.material as THREE.MeshBasicMaterial).opacity =
      Math.min(0.6, this.opacity * 0.25 + this._activityPulse * 0.4)
  }

  triggerActivity() {
    this._activityPulse = 1.0
  }

  // ── TENDRIL: slow snaking growth toward targets ───────────────────────────

  private tickTendril(dt: number) {
    // Slowly move toward target, with sinusoidal wandering
    const toTarget = this.tipTarget.clone().sub(this.tipPos)
    const dist = toTarget.length()

    if (dist < 5) this.pickNewTarget()

    // Gentle seeking with organic wobble
    const seekForce = toTarget.normalize().multiplyScalar(15 * dt)
    const wobble = new THREE.Vector3(
      Math.sin(this.elapsed * 1.3) * 8 * dt,
      Math.cos(this.elapsed * 0.9) * 4 * dt,
      Math.sin(this.elapsed * 1.7 + 1) * 8 * dt,
    )
    this.tipVel.add(seekForce).add(wobble)
    this.tipVel.multiplyScalar(1 - dt * 2.0) // damping
    this.tipPos.addScaledVector(this.tipVel, dt * this.growProgress)
  }

  // ── FILAMENT: electric crackling, jittery rapid movement ──────────────────

  private tickFilament(dt: number) {
    const toTarget = this.tipTarget.clone().sub(this.tipPos)
    const dist = toTarget.length()

    if (dist < 8) this.pickNewTarget()

    // Fast darting movement with electric jitter
    const seekForce = toTarget.normalize().multiplyScalar(40 * dt)
    const jitter = new THREE.Vector3(
      (Math.random() - 0.5) * 60 * dt,
      (Math.random() - 0.5) * 30 * dt,
      (Math.random() - 0.5) * 60 * dt,
    )
    this.tipVel.add(seekForce).add(jitter)
    this.tipVel.multiplyScalar(1 - dt * 3.0)
    this.tipPos.addScaledVector(this.tipVel, dt * this.growProgress)
  }

  // ── UMBILICAL: smooth free movement, always connected ─────────────────────

  private tickUmbilical(dt: number) {
    // Smooth orbit-like movement but not circular — more figure-8 / lissajous
    this.wanderAngle += dt * 0.5
    const targetX = Math.sin(this.wanderAngle) * this.wanderRadius
    const targetZ = Math.sin(this.wanderAngle * 0.7 + 1.0) * this.wanderRadius
    const targetY = Math.cos(this.wanderAngle * 0.4) * this.wanderRadius * 0.3

    const target = new THREE.Vector3(targetX, targetY, targetZ)
    const toTarget = target.sub(this.tipPos)
    this.tipVel.addScaledVector(toTarget, dt * 2.0)
    this.tipVel.multiplyScalar(1 - dt * 1.5)
    this.tipPos.addScaledVector(this.tipVel, dt * this.growProgress)
  }

  // ── WHIP: coil near core, lash out, recoil ────────────────────────────────

  private tickWhip(dt: number) {
    this.whipTimer += dt

    if (this.whipState === 'coiled') {
      // Twitch near core
      const coilR = 12
      this.tipPos.set(
        Math.sin(this.elapsed * 3) * coilR * this.growProgress,
        Math.cos(this.elapsed * 2.3) * coilR * 0.3 * this.growProgress,
        Math.cos(this.elapsed * 3.7) * coilR * this.growProgress,
      )
      if (this.whipTimer > rand(1.0, 2.5) && this.fadeState === 'alive') {
        this.whipState = 'striking'
        this.whipTimer = 0
        this.pickNewTarget()
        this.whipStrikeTarget.copy(this.tipTarget)
      }
    } else if (this.whipState === 'striking') {
      // Fast lash toward target
      const t = Math.min(1, this.whipTimer / 0.25) // 0.25s strike
      const eased = t * t * (3 - 2 * t) // smoothstep
      this.tipPos.lerpVectors(new THREE.Vector3(0, 0, 0), this.whipStrikeTarget, eased)
      if (t >= 1) {
        this.whipState = 'recoiling'
        this.whipTimer = 0
      }
    } else if (this.whipState === 'recoiling') {
      // Slower recoil back
      const t = Math.min(1, this.whipTimer / 0.6)
      const eased = t * t
      this.tipPos.lerpVectors(this.whipStrikeTarget, new THREE.Vector3(0, 0, 0), eased)
      if (t >= 1) {
        this.whipState = 'coiled'
        this.whipTimer = 0
      }
    }
  }

  // ── PROBOSCIS: slow probing, locks on, then moves to next ─────────────────

  private tickProboscis(dt: number) {
    if (this.probeLockedOn) {
      // Locked on to target — stay there and pulse
      this.probeLockTimer += dt
      // Slight vibration while locked
      this.tipPos.copy(this.tipTarget).add(new THREE.Vector3(
        Math.sin(this.elapsed * 8) * 0.5,
        Math.cos(this.elapsed * 6) * 0.3,
        Math.sin(this.elapsed * 10) * 0.5,
      ))
      if (this.probeLockTimer > rand(2.0, 4.0)) {
        this.probeLockedOn = false
        this.probeLockTimer = 0
        this.pickNewTarget()
      }
    } else {
      // Slowly probe toward target
      const toTarget = this.tipTarget.clone().sub(this.tipPos)
      const dist = toTarget.length()

      // Slow, searching movement with gentle swaying
      const seekSpeed = 10
      const sway = new THREE.Vector3(
        Math.sin(this.elapsed * 0.8) * 3 * dt,
        Math.cos(this.elapsed * 0.6) * 2 * dt,
        Math.sin(this.elapsed * 1.1 + 2) * 3 * dt,
      )
      this.tipVel.addScaledVector(toTarget.normalize(), seekSpeed * dt).add(sway)
      this.tipVel.multiplyScalar(1 - dt * 2.5)
      this.tipPos.addScaledVector(this.tipVel, dt * this.growProgress)

      if (dist < 5) {
        this.probeLockedOn = true
        this.probeLockTimer = 0
      }
    }
  }

  // ── Line update: curved connection from core (0,0,0) to tip ───────────────

  private updateLine() {
    const origin = new THREE.Vector3(0, 0, 0)
    const tip = this.tipPos.clone().multiplyScalar(this.growProgress)

    // Control point for curve — perpendicular offset for organic feel
    const mid = origin.clone().add(tip).multiplyScalar(0.5)
    let cpOffset: THREE.Vector3

    if (this.style === 'whip') {
      // Whip: tighter curve
      cpOffset = new THREE.Vector3(
        Math.sin(this.elapsed * 2) * 8,
        5 + Math.cos(this.elapsed * 1.5) * 3,
        Math.cos(this.elapsed * 2.5) * 8,
      )
    } else if (this.style === 'filament') {
      // Filament: jittery control point
      cpOffset = new THREE.Vector3(
        (Math.random() - 0.5) * 10 + Math.sin(this.elapsed * 3) * 5,
        5 + (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 10 + Math.cos(this.elapsed * 3.5) * 5,
      )
    } else {
      // Organic curve
      cpOffset = new THREE.Vector3(
        Math.sin(this.elapsed * 0.7 + this.filamentPhase) * 12,
        8 + Math.cos(this.elapsed * 0.5) * 5,
        Math.cos(this.elapsed * 0.9 + this.filamentPhase) * 12,
      )
    }

    const cp = mid.clone().add(cpOffset)

    // Write quadratic bezier points
    const visibleSegs = Math.max(2, Math.round(this.growProgress * SEG))
    for (let i = 0; i < visibleSegs; i++) {
      const t = i / (visibleSegs - 1)
      const u = 1 - t
      this.lineArr[i * 3]     = u * u * origin.x + 2 * u * t * cp.x + t * t * tip.x
      this.lineArr[i * 3 + 1] = u * u * origin.y + 2 * u * t * cp.y + t * t * tip.y
      this.lineArr[i * 3 + 2] = u * u * origin.z + 2 * u * t * cp.z + t * t * tip.z
    }

    ;(this.lineGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true
    this.lineGeo.setDrawRange(0, visibleSegs)
  }

  dispose() {
    this.lineGeo.dispose()
    this.lineMat.dispose()
    this.tipMesh.geometry.dispose()
    ;(this.tipMesh.material as THREE.Material).dispose()
    this.tipGlowMesh.geometry.dispose()
    ;(this.tipGlowMesh.material as THREE.Material).dispose()
  }
}
