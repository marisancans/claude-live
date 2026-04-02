/**
 * ParticleCloud — orchestrates traveling nodes + settled star cluster.
 *
 * Public API:
 *   spawn(toolName, colorHex?)          — 1 node
 *   spawnBurst(toolName, count, hex?)   — N nodes with per-index profiles
 *   spawnGlobFan()                      — 5 correlated fan-beam nodes
 */
import * as THREE from 'three'
import { TOOL_COLOR_HEX, DEFAULT_HEX } from '../../constants'
import { buildSpawnParams } from '../travel/profiles/index'
import { TravelingNode } from '../travel/TravelingNode'
import type { SpawnParams } from '../travel/types'

const MAX_STARS = 600

export class ParticleCloud {
  group: THREE.Group
  /** Called when a node settles. filePath is set if the spawn was file-targeted. */
  onSettle?: (pos: THREE.Vector3, color: THREE.Color, filePath?: string) => void

  private traveling: { node: TravelingNode; filePath?: string }[] = []
  private pendingDelayed: { params: SpawnParams; delay: number; waited: number; filePath?: string }[] = []

  // Settled star cluster — single Points draw call
  private stars: { pos: THREE.Vector3; col: THREE.Color }[] = []
  private starPosArr: Float32Array
  private starColArr: Float32Array
  private starGeo: THREE.BufferGeometry
  private starMat: THREE.PointsMaterial

  constructor() {
    this.group = new THREE.Group()

    this.starPosArr = new Float32Array(MAX_STARS * 3)
    this.starColArr = new Float32Array(MAX_STARS * 3)
    this.starGeo = new THREE.BufferGeometry()
    this.starGeo.setAttribute('position', new THREE.BufferAttribute(this.starPosArr, 3))
    this.starGeo.setAttribute('color',    new THREE.BufferAttribute(this.starColArr, 3))
    this.starGeo.setDrawRange(0, 0)

    this.starMat = new THREE.PointsMaterial({
      vertexColors: true, blending: THREE.AdditiveBlending,
      depthWrite: false, transparent: true, opacity: 0.75,
      size: 2, sizeAttenuation: false,
    })
    this.group.add(new THREE.Points(this.starGeo, this.starMat))
  }

  spawn(
    toolName: string,
    colorHex?: string,
    filePos?: THREE.Vector3,
    toolInput?: Record<string, unknown> | null,
    toolResponse?: Record<string, unknown> | null,
    filePath?: string,
  ) {
    const hex = TOOL_COLOR_HEX[toolName] || colorHex || DEFAULT_HEX
    const params = buildSpawnParams(toolName, hex, 0, filePos, toolInput, toolResponse)
    this._launch(params, filePath)
  }

  spawnBurst(
    toolName: string,
    count: number,
    colorHex?: string,
    filePos?: THREE.Vector3,
    toolInput?: Record<string, unknown> | null,
    toolResponse?: Record<string, unknown> | null,
    filePath?: string,
  ) {
    const hex = TOOL_COLOR_HEX[toolName] || colorHex || DEFAULT_HEX
    for (let i = 0; i < count; i++) {
      const params = buildSpawnParams(toolName, hex, i, filePos, toolInput, toolResponse)
      this._launch(params, filePath)
    }
  }


  spawnRaw(params: SpawnParams, filePath?: string) {
    this._launch(params, filePath)
  }

  private _launch(params: SpawnParams, filePath?: string) {
    const node = new TravelingNode(params)
    this.group.add(node.group)
    this.traveling.push({ node, filePath })
  }

  tick(dt: number) {
    // Tick delayed spawns
    for (let i = this.pendingDelayed.length - 1; i >= 0; i--) {
      const d = this.pendingDelayed[i]
      d.waited += dt
      if (d.waited >= d.delay) {
        this._launch(d.params, d.filePath)
        this.pendingDelayed.splice(i, 1)
      }
    }

    for (let i = this.traveling.length - 1; i >= 0; i--) {
      const entry = this.traveling[i]
      const node = entry.node
      node.tick(dt)

      // Mid-flight split — spawn fragments immediately
      if (node.midPendingSpawns) {
        for (const sp of node.midPendingSpawns) {
          const delay = sp.spawnDelay ?? 0
          if (delay > 0) {
            this.pendingDelayed.push({ params: sp, delay, waited: 0 })
          } else {
            this._launch(sp)
          }
        }
        node.midPendingSpawns = null
      }

      // Node just landed — harvest settled position + spawn any pending nodes
      if (node.settled) {
        this._addStar(node.settled.position, node.settled.color)
        this.onSettle?.(node.settled.position, node.settled.color, entry.filePath)

        // Single pending spawn
        const pSingle = (node as any).p?.pendingSpawn as SpawnParams | undefined
        if (pSingle) {
          const delay = pSingle.spawnDelay ?? 0
          if (delay > 0) {
            this.pendingDelayed.push({ params: pSingle, delay, waited: 0 })
          } else {
            this._launch(pSingle)
          }
          ;(node as any).p.pendingSpawn = undefined
        }

        // Multiple pending spawns
        const pMulti = (node as any).p?.pendingSpawns as SpawnParams[] | undefined
        if (pMulti?.length) {
          for (const sp of pMulti) {
            const delay = sp.spawnDelay ?? 0
            if (delay > 0) {
              this.pendingDelayed.push({ params: sp, delay, waited: 0 })
            } else {
              this._launch(sp)
            }
          }
          ;(node as any).p.pendingSpawns = undefined
        }

        node.settled = null
      }

      if (node.done) {
        this.group.remove(node.group)
        node.dispose()
        this.traveling.splice(i, 1)
      }
    }
  }

  /** Place a settled dot directly — no travel animation. Used for history replay. */
  addHistoryStar(pos: THREE.Vector3, color: THREE.Color) {
    this._addStar(pos, color)
  }

  private _addStar(pos: THREE.Vector3, color: THREE.Color) {
    if (this.stars.length >= MAX_STARS) this.stars.shift()
    // If the node settled near core (inbound tools), scatter the star outward
    // so settled dots form a wispy cloud rather than a pile at origin
    let starPos = pos.clone()
    if (starPos.length() < 20) {
      const rx = (Math.random() - 0.5) * 2 * (15 + Math.pow(Math.random(), 0.6) * 100) * (0.4 + Math.random() * 2.1)
      const ry = (Math.random() - 0.5) * 2 * (15 + Math.pow(Math.random(), 0.6) * 100) * (0.1 + Math.random() * 0.4)
      const rz = (Math.random() - 0.5) * 2 * (15 + Math.pow(Math.random(), 0.6) * 100) * (0.4 + Math.random() * 2.1)
      starPos = new THREE.Vector3(rx, ry, rz)
    }
    this.stars.push({ pos: starPos, col: color.clone() })
    const n = this.stars.length
    for (let i = 0; i < n; i++) {
      const s = this.stars[i]
      this.starPosArr[i*3]   = s.pos.x
      this.starPosArr[i*3+1] = s.pos.y
      this.starPosArr[i*3+2] = s.pos.z
      this.starColArr[i*3]   = s.col.r
      this.starColArr[i*3+1] = s.col.g
      this.starColArr[i*3+2] = s.col.b
    }
    ;(this.starGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true
    ;(this.starGeo.attributes.color    as THREE.BufferAttribute).needsUpdate = true
    this.starGeo.setDrawRange(0, n)
  }

  dispose() {
    for (const { node: n } of this.traveling) { this.group.remove(n.group); n.dispose() }
    this.starGeo.dispose()
    this.starMat.dispose()
  }
}
