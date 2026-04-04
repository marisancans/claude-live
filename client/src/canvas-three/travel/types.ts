import * as THREE from 'three'

export type EasingType =
  | 'easeOutCubic'
  | 'easeOutQuart'
  | 'easeInQuad'
  | 'easeInCubic'
  | 'easeInPow25'
  | 'easeInOut'
  | 'easeOutThenIn'
  | 'linear'

export type PathType = 'linear' | 'quadratic' | 'cubic' | 'arc' | 'noise'

export interface PathConfig {
  type: PathType
  easing: EasingType
  c1?: THREE.Vector3
  c2?: THREE.Vector3
  arcCenter?: THREE.Vector3
  arcStartAngle?: number
  arcSweepAngle?: number
  arcRadius?: number
  noiseAmp?: number
  noiseFreq?: number
  noisePhase?: number
}

export interface SpawnParams {
  origin: THREE.Vector3
  target: THREE.Vector3
  color: THREE.Color
  colorEnd: THREE.Color
  travelTime: number
  /** 0–1: how much of the path the trail tail covers at any moment */
  trailLength: number
  /** brightness multiplier for the trail line */
  trailBrightness: number
  trailFadeTime: number
  /** size of the sprite head in screen pixels. 0 = suppress head entirely */
  headSize: number
  pathConfig: PathConfig
  /** spawned when this node lands */
  pendingSpawn?: SpawnParams
  /** multiple spawned when this node lands (e.g. Read data streams, Write scatter) */
  pendingSpawns?: SpawnParams[]
  /** progress fraction [0,1] where travel STOPS — node stalls then fades (Error) */
  stallAt?: number
  /** seconds to vibrate at stall point before fading */
  stallDuration?: number
  /** seconds to wait before this node starts moving (for staggered bursts) */
  spawnDelay?: number
  /**
   * progress fraction [0,1] at which pendingSpawns fire (mid-flight split).
   * If absent, pendingSpawns fire at landing (progress=1) as before.
   */
  midSpawnFrac?: number
  /** internal: tool name stamped by ParticleCloud for secondary selection */
  _tool?: string
}
