import type { Application } from 'pixi.js'
import type { WorldLayer } from './layers/WorldLayer'
import type { AnimationManager } from './animation/AnimationManager'

interface Sample {
  t: number
  heapMB: number
  textures: number
  clusters: number
  nodes: number
  projectiles: number
  snakes: number
  miscEffects: number
}

/**
 * Samples memory and object-count metrics every N seconds and POSTs them
 * to /hook as a special diagnostic event so they appear in server logs.
 *
 * Activate by calling start(), deactivate with stop().
 * Access latest snapshot via .latest.
 */
export class MemoryMonitor {
  private app: Application
  private worldLayer: WorldLayer
  private animationManager: AnimationManager | null
  private intervalId: ReturnType<typeof setInterval> | null = null
  private samples: Sample[] = []
  private maxSamples = 60  // keep last 60 samples (~5 min at 5s interval)
  latest: Sample | null = null

  constructor(app: Application, worldLayer: WorldLayer, animationManager: AnimationManager | null) {
    this.app = app
    this.worldLayer = worldLayer
    this.animationManager = animationManager
  }

  start(intervalSecs = 5) {
    if (this.intervalId) return
    this.intervalId = setInterval(() => this.sample(), intervalSecs * 1000)
    this.sample() // immediate first sample
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  private sample() {
    const heapMB = (performance as any).memory
      ? Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024)
      : -1

    // Count textures in PixiJS cache
    const textures = Object.keys((globalThis as any).PIXI?.utils?.TextureCache ?? {}).length

    // Count clusters and nodes from WorldLayer
    const clusters = this.worldLayer.clusterObjects.size
    let nodes = 0
    for (const co of this.worldLayer.clusterObjects.values()) {
      nodes += co.nodeObjects.size
    }

    // Count live animation objects (access private arrays via cast)
    const am = this.animationManager as any
    const projectiles = am?.projectiles?.length ?? 0
    const snakes = am?.snakes?.length ?? 0
    const miscEffects = am?.miscEffects?.length ?? 0

    const s: Sample = {
      t: Date.now(),
      heapMB,
      textures,
      clusters,
      nodes,
      projectiles,
      snakes,
      miscEffects,
    }

    this.latest = s
    this.samples.push(s)
    if (this.samples.length > this.maxSamples) this.samples.shift()

    // Detect growth: compare to sample from 30s ago if available
    const prev = this.samples.length >= 6 ? this.samples[this.samples.length - 6] : null
    const heapGrowthMB = prev ? s.heapMB - prev.heapMB : 0

    const line = [
      `heap=${s.heapMB}MB`,
      heapGrowthMB !== 0 ? `(${heapGrowthMB > 0 ? '+' : ''}${heapGrowthMB}MB/30s)` : '',
      `tex=${s.textures}`,
      `clusters=${s.clusters}`,
      `nodes=${s.nodes}`,
      `proj=${s.projectiles}`,
      `snakes=${s.snakes}`,
      `misc=${s.miscEffects}`,
    ].filter(Boolean).join(' ')

    // Log locally only in dev — no server round-trip
    if ((import.meta as any).env?.DEV) {
      console.debug('[mem]', line)
    }
  }

  /** Return last N samples as a formatted table string */
  report(n = 10): string {
    const recent = this.samples.slice(-n)
    return recent.map(s => {
      const age = Math.round((Date.now() - s.t) / 1000)
      return `${age}s ago  heap=${s.heapMB}MB  tex=${s.textures}  clusters=${s.clusters}  nodes=${s.nodes}  proj=${s.projectiles}  snakes=${s.snakes}`
    }).join('\n')
  }
}
