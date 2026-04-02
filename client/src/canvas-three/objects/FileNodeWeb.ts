/**
 * FileNodeWeb — clusters settled event nodes by file path.
 *
 * For each file path:
 *   - An anchor dot (permanent, bright, screen-space) at the stable 3D position
 *   - Every settled star for that file is connected to the anchor with a green line
 *   - Stars of the same file are connected to each other (full mesh within cluster)
 *
 * All geometry lives in the session group's local space.
 */
import * as THREE from 'three'

const LINE_DIM   = 0.55
const LINE_FLASH = 1.0
const DECAY      = 1.5

// Shared anchor dot Points
const MAX_ANCHORS = 256

// Shared cluster-line geometry pool
const MAX_LINES = 4096

let _anchorTex: THREE.CanvasTexture | null = null
function anchorTex(): THREE.CanvasTexture {
  if (_anchorTex) return _anchorTex
  const sz = 64, c = document.createElement('canvas')
  c.width = c.height = sz
  const ctx = c.getContext('2d')!
  const h = sz / 2
  const g = ctx.createRadialGradient(h, h, 0, h, h, h)
  g.addColorStop(0,    'rgba(255,255,255,1)')
  g.addColorStop(0.3,  'rgba(255,255,255,0.6)')
  g.addColorStop(0.7,  'rgba(255,255,255,0.1)')
  g.addColorStop(1,    'rgba(255,255,255,0)')
  ctx.fillStyle = g; ctx.fillRect(0, 0, sz, sz)
  return (_anchorTex = new THREE.CanvasTexture(c))
}

interface FileCluster {
  filePath: string
  anchor: THREE.Vector3       // stable position from getFilePos
  anchorIdx: number           // index into anchor Points geometry
  stars: THREE.Vector3[]      // settled node positions that belong here
  lineObjs: THREE.Line[]      // all line objects for this cluster
  flash: number
}

export class FileNodeWeb {
  private group: THREE.Group
  private clusters = new Map<string, FileCluster>()

  // Shared Points for anchor dots
  private anchorPosArr: Float32Array
  private anchorColArr: Float32Array
  private anchorGeo: THREE.BufferGeometry
  private anchorMat: THREE.PointsMaterial
  private anchorCount = 0

  constructor(group: THREE.Group) {
    this.group = group

    this.anchorPosArr = new Float32Array(MAX_ANCHORS * 3)
    this.anchorColArr = new Float32Array(MAX_ANCHORS * 3)
    this.anchorGeo = new THREE.BufferGeometry()
    this.anchorGeo.setAttribute('position', new THREE.BufferAttribute(this.anchorPosArr, 3))
    this.anchorGeo.setAttribute('color',    new THREE.BufferAttribute(this.anchorColArr, 3))
    this.anchorGeo.setDrawRange(0, 0)

    this.anchorMat = new THREE.PointsMaterial({
      vertexColors: true,
      map: anchorTex(),
      size: 6,
      sizeAttenuation: false,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.85,
      alphaTest: 0.01,
    })
    group.add(new THREE.Points(this.anchorGeo, this.anchorMat))
  }

  /** Called by ThreeApp.getFilePos — establishes the stable anchor for this file. */
  register(filePath: string, pos: THREE.Vector3) {
    if (this.clusters.has(filePath)) return
    if (this.anchorCount >= MAX_ANCHORS) return
    console.log('[FileNodeWeb] register', filePath.split('/').pop(), pos.toArray().map(v => v.toFixed(1)))

    const idx = this.anchorCount++
    this.anchorPosArr[idx*3]   = pos.x
    this.anchorPosArr[idx*3+1] = pos.y
    this.anchorPosArr[idx*3+2] = pos.z
    this.anchorColArr[idx*3]   = 0.2
    this.anchorColArr[idx*3+1] = 1.0
    this.anchorColArr[idx*3+2] = 0.4
    ;(this.anchorGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true
    ;(this.anchorGeo.attributes.color    as THREE.BufferAttribute).needsUpdate = true
    this.anchorGeo.setDrawRange(0, this.anchorCount)

    this.clusters.set(filePath, {
      filePath,
      anchor: pos.clone(),
      anchorIdx: idx,
      stars: [],
      lineObjs: [],
      flash: 0,
    })
  }

  /** Called when a traveling node settles at a file position. Draws cluster lines. */
  addStar(filePath: string) {
    const cluster = this.clusters.get(filePath)
    if (!cluster) return

    // Place the new star at a small jitter around the anchor
    const jitter = 4
    const newPos = cluster.anchor.clone().add(new THREE.Vector3(
      (Math.random() - 0.5) * jitter,
      (Math.random() - 0.5) * jitter,
      (Math.random() - 0.5) * jitter,
    ))

    // Line from new star → anchor
    this._addLine(cluster, newPos, cluster.anchor)

    // Lines from new star → all existing stars in this cluster
    for (const existing of cluster.stars) {
      this._addLine(cluster, newPos, existing)
    }

    cluster.stars.push(newPos)
    cluster.flash = 1
  }

  private _addLine(cluster: FileCluster, a: THREE.Vector3, b: THREE.Vector3) {
    const posArr = new Float32Array([a.x, a.y, a.z, b.x, b.y, b.z])
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(posArr, 3))
    const mat = new THREE.LineBasicMaterial({
      color: new THREE.Color('#39d353'),
      transparent: true,
      opacity: LINE_DIM,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const line = new THREE.Line(geo, mat)
    this.group.add(line)
    cluster.lineObjs.push(line)
  }

  /** Flash the cluster on tool use (separate from addStar). */
  hit(filePath: string) {
    const cluster = this.clusters.get(filePath)
    if (cluster) cluster.flash = 1
  }

  tick(dt: number) {
    for (const cluster of this.clusters.values()) {
      if (cluster.flash > 0) cluster.flash = Math.max(0, cluster.flash - dt * DECAY)
      const opacity = LINE_DIM + (LINE_FLASH - LINE_DIM) * cluster.flash
      for (const line of cluster.lineObjs) {
        (line.material as THREE.LineBasicMaterial).opacity = opacity
      }
      // Brighten anchor dot on flash
      const i = cluster.anchorIdx
      const f = cluster.flash
      this.anchorColArr[i*3]   = 0.2 + 0.8 * f
      this.anchorColArr[i*3+1] = 1.0
      this.anchorColArr[i*3+2] = 0.4 + 0.6 * f
    }
    if (this.anchorCount > 0) {
      ;(this.anchorGeo.attributes.color as THREE.BufferAttribute).needsUpdate = true
    }
  }

  dispose() {
    this.anchorGeo.dispose()
    this.anchorMat.dispose()
    for (const cluster of this.clusters.values()) {
      for (const line of cluster.lineObjs) {
        line.geometry.dispose()
        ;(line.material as THREE.LineBasicMaterial).dispose()
      }
    }
    this.clusters.clear()
  }
}
