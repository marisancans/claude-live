export class WindField {
  directionX = 1
  directionZ = 0
  strength = 0.2
  gustStrength = 0
  gustTimer = 8
  turbulence = 0
  phase = 0

  private baseAngle = 0
  private gustRamp = 0
  private gustHold = 0
  private gustDecay = 0
  private gustActive = false

  update(dt: number) {
    // Base direction slowly rotates
    this.baseAngle += dt * (Math.PI * 2 / 30) // full rotation in ~30s
    this.directionX = Math.cos(this.baseAngle)
    this.directionZ = Math.sin(this.baseAngle)

    // Base strength oscillates
    this.strength = 0.2 + 0.25 * (0.5 + 0.5 * Math.sin(this.phase * (Math.PI * 2 / 8)))
    this.phase += dt

    // Turbulence — high-frequency jitter
    this.turbulence = 0.5 + 0.5 * Math.sin(this.phase * 7.3 + Math.cos(this.phase * 3.1) * 2)
    this.turbulence *= 0.15

    // Gust system
    if (!this.gustActive) {
      this.gustTimer -= dt
      if (this.gustTimer <= 0) {
        this.gustActive = true
        this.gustRamp = 0.5
        this.gustHold = 1 + Math.random()
        this.gustDecay = 1.5
        this.gustStrength = 0
      }
    }

    if (this.gustActive) {
      if (this.gustRamp > 0) {
        this.gustRamp -= dt
        this.gustStrength = Math.min(1, this.gustStrength + dt * 2)
      } else if (this.gustHold > 0) {
        this.gustHold -= dt
        this.gustStrength = 0.7 + 0.3 * Math.sin(this.phase * 4)
      } else if (this.gustDecay > 0) {
        this.gustDecay -= dt
        this.gustStrength = Math.max(0, this.gustStrength - dt * 0.67)
      } else {
        this.gustActive = false
        this.gustStrength = 0
        this.gustTimer = 5 + Math.random() * 10
      }
    }
  }

  /** Total effective wind strength (base + gust + turbulence) */
  get effectiveStrength(): number {
    return Math.min(1, this.strength + this.gustStrength * 0.6 + this.turbulence * 0.1)
  }

  /** Force override for effects like bashShudder */
  spike(strength: number, turbulence: number) {
    this.gustStrength = Math.max(this.gustStrength, strength)
    this.turbulence = Math.max(this.turbulence, turbulence)
    this.gustActive = true
    this.gustRamp = 0
    this.gustHold = 0
    this.gustDecay = 2.0
  }
}
