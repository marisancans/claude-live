import { Container, Graphics } from 'pixi.js'
import type { Application } from 'pixi.js'
import type { MutableRefObject } from 'react'
import type { Cluster, GraphNode } from '../../types'
import { ClusterObject } from '../objects/ClusterObject'
import { NodeObject } from '../objects/NodeObject'
import { CameraController } from '../animation/CameraController'
import { EdgeLayer } from './EdgeLayer'
import { tickSimulation } from '../../simulation/graph'
import { initNodeTextures } from '../textures/NodeTextures'
import { ORBIT_RADII } from '../../constants'

const TRAIL_DASH_PX = 3

/**
 * World layer: camera-transformed container holding all game objects.
 *
 * Uses a SINGLE batch Graphics for all per-frame animated drawing
 * (cluster rings, energy arcs, trail marks). This replaces the old
 * pattern of one Graphics per cluster/trail that each called .clear()
 * every frame — the root cause of the 16GB GPU memory leak.
 */
export class WorldLayer {
  container: Container
  app: Application
  clustersRef: MutableRefObject<Map<string, Cluster>>
  autofitRef: MutableRefObject<boolean>
  clusterObjects: Map<string, ClusterObject> = new Map()
  cameraController: CameraController
  edgeLayer: EdgeLayer
  previousRingCounts: Map<string, number> = new Map()

  // Single batch Graphics for ALL animated drawing per frame
  private batchGfx: Graphics

  constructor(app: Application, clustersRef: MutableRefObject<Map<string, Cluster>>, autofitRef: MutableRefObject<boolean>) {
    this.app = app
    this.clustersRef = clustersRef
    this.autofitRef = autofitRef
    this.container = new Container()

    // Init texture atlas for node/cluster sprites
    initNodeTextures(app.renderer)

    this.container.position.set(
      app.renderer.width / 2,
      app.renderer.height / 2
    )

    this.cameraController = new CameraController(app, this.container)

    this.edgeLayer = new EdgeLayer()
    this.container.addChild(this.edgeLayer.graphics)

    // Single batch Graphics for rings + trails (drawn behind everything else)
    this.batchGfx = new Graphics()
    this.container.addChild(this.batchGfx)

    for (const cluster of clustersRef.current.values()) {
      this.createCluster(cluster)
    }
  }

  get clusters(): Map<string, Cluster> {
    return this.clustersRef.current
  }

  private createCluster(cluster: Cluster) {
    const clusterObj = new ClusterObject(cluster)
    clusterObj.updateOrbitRings()
    this.container.addChild(clusterObj.container)
    this.clusterObjects.set(cluster.sessionId, clusterObj)

    // Create node objects
    for (const node of cluster.nodes.values()) {
      const nodeObj = new NodeObject(node)
      clusterObj.container.addChild(nodeObj.container)
      clusterObj.nodeObjects.set(node.key, nodeObj)
    }
  }

  getNodeObject(sessionId: string, nodeKey: string): NodeObject | null {
    const clusterObj = this.clusterObjects.get(sessionId)
    if (!clusterObj) return null
    return clusterObj.nodeObjects.get(nodeKey) ?? null
  }

  private tickClusterPhysics(clusters: Map<string, Cluster>) {
    const clusterArray = Array.from(clusters.values())
    const n = clusterArray.length
    if (n === 0) return

    const footprint = (c: Cluster): number => {
      const radii = [55, 90, 125, 160, 195]
      for (let i = c.ringCounts.length - 1; i >= 0; i--) {
        if (c.ringCounts[i] > 0) return radii[i] ?? 195
      }
      return radii[0]
    }

    if (n === 1) {
      const c = clusterArray[0]
      c.centerX += (0 - c.centerX) * 0.1
      c.centerY += (0 - c.centerY) * 0.1
    } else {
      for (let i = 0; i < n; i++) {
        const c1 = clusterArray[i]
        const fp1 = footprint(c1)
        for (let j = i + 1; j < n; j++) {
          const c2 = clusterArray[j]
          const fp2 = footprint(c2)
          const minDist = fp1 + fp2 + 120
          const dx = c2.centerX - c1.centerX
          const dy = c2.centerY - c1.centerY
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.01
          if (dist < minDist) {
            const half = (minDist - dist) / dist * 0.5
            c1.centerX -= dx * half
            c1.centerY -= dy * half
            c2.centerX += dx * half
            c2.centerY += dy * half
          }
        }
      }
      for (const cluster of clusterArray) {
        cluster.centerX += (0 - cluster.centerX) * 0.003
        cluster.centerY += (0 - cluster.centerY) * 0.003
      }
    }
  }

  /**
   * Draw trail marks for a cluster into the batch Graphics.
   * All coordinates are world-space (offset by cluster center).
   */
  private drawTrailsIntoBatch(g: Graphics, cluster: Cluster) {
    const cx = cluster.centerX
    const cy = cluster.centerY
    const compacting = cluster.compacting ?? 0
    if (compacting > 0.8) return  // trails hidden during compaction

    for (const node of cluster.nodes.values()) {
      if (node.orbitRing < 0 || node.marks.length === 0) continue

      const baseAl = node.nodeType === 'file'
        ? 0.5
        : (node.life ?? 1) * 0.4 * Math.min(1, node.entry ?? 1)
      if (baseAl <= 0.01) continue
      // Dim during compaction
      const al = compacting > 0.5 ? baseAl * (1 - compacting) : baseAl

      const ring = Math.max(0, Math.min(node.orbitRing, ORBIT_RADII.length - 1))
      const radius = ORBIT_RADII[ring]
      const dashArc = TRAIL_DASH_PX / radius

      const n = node.marks.length
      for (let i = 0; i < n; i++) {
        const fade = (i + 1) / n
        const markAl = al * fade
        if (markAl <= 0.01) continue

        const a = node.marks[i]
        g.arc(cx, cy, radius, a - dashArc / 2, a + dashArc / 2)
          .stroke({ width: 1.2, color: 0xffffff, alpha: markAl })
        if (i < n - 1) {
          const nextA = node.marks[i + 1]
          g.moveTo(
            cx + Math.cos(nextA - dashArc / 2) * radius,
            cy + Math.sin(nextA - dashArc / 2) * radius
          )
        }
      }
    }
  }

  tick(dt: number) {
    const clusters = this.clustersRef.current

    this.tickClusterPhysics(clusters)
    tickSimulation(clusters)
    this.cameraController.tick(dt, clusters, this.autofitRef.current)

    // === Single batch Graphics: clear once, draw everything ===
    this.batchGfx.clear()

    for (const [sessionId, cluster] of clusters) {
      let clusterObj = this.clusterObjects.get(sessionId)

      if (!clusterObj) {
        this.createCluster(cluster)
        clusterObj = this.clusterObjects.get(sessionId)!
        // Start invisible — fade in over first few frames to prevent flash
        clusterObj.container.alpha = 0
      }

      // Fade in new clusters smoothly
      if (clusterObj.container.alpha < 1) {
        clusterObj.container.alpha = Math.min(1, clusterObj.container.alpha + dt * 2)
      }

      const prevLen = this.previousRingCounts.get(sessionId) ?? -1
      if (prevLen !== cluster.ringCounts.length) {
        clusterObj.updateOrbitRings()
        this.previousRingCounts.set(sessionId, cluster.ringCounts.length)
      }

      clusterObj.tick(dt)

      // Draw animated rings + energy arcs into the single batch Graphics
      clusterObj.drawRingsIntoBatch(this.batchGfx, cluster.centerX, cluster.centerY)

      // Draw trail marks into the same batch Graphics
      this.drawTrailsIntoBatch(this.batchGfx, cluster)

      // Update nodes
      for (const node of cluster.nodes.values()) {
        let nodeObj = clusterObj.nodeObjects.get(node.key)
        if (!nodeObj) {
          nodeObj = new NodeObject(node)
          clusterObj.container.addChild(nodeObj.container)
          clusterObj.nodeObjects.set(node.key, nodeObj)
        }
        nodeObj.compacting = cluster.compacting
        nodeObj.compacted = cluster.compacted
        nodeObj.tick(dt)
      }

      // Remove deleted nodes
      for (const [key, nodeObj] of clusterObj.nodeObjects) {
        if (!cluster.nodes.has(key)) {
          clusterObj.container.removeChild(nodeObj.container)
          clusterObj.nodeObjects.delete(key)
          nodeObj.destroy()
        }
      }
    }

    // Remove deleted clusters
    for (const [sessionId, clusterObj] of this.clusterObjects) {
      if (!clusters.has(sessionId)) {
        this.container.removeChild(clusterObj.container)
        this.clusterObjects.delete(sessionId)
        this.previousRingCounts.delete(sessionId)
        clusterObj.destroy()
      }
    }

    // Redraw edges (already uses single Graphics)
    this.edgeLayer.redraw(this.clusterObjects, dt)
  }

  hitTest(screenX: number, screenY: number): { node: GraphNode; cluster: Cluster } | null {
    const worldX = (screenX - this.container.position.x) / this.container.scale.x + this.container.pivot.x
    const worldY = (screenY - this.container.position.y) / this.container.scale.y + this.container.pivot.y
    const hitRadius = 15 / this.container.scale.x

    let closest: { node: GraphNode; cluster: Cluster; dist: number } | null = null
    for (const [_sessionId, clusterObj] of this.clusterObjects) {
      const cluster = clusterObj.data
      for (const [nodeKey, nodeObj] of clusterObj.nodeObjects) {
        const nodeWorldX = cluster.centerX + nodeObj.container.position.x
        const nodeWorldY = cluster.centerY + nodeObj.container.position.y
        const dx = worldX - nodeWorldX
        const dy = worldY - nodeWorldY
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist <= hitRadius && (closest === null || dist < closest.dist)) {
          const node = cluster.nodes.get(nodeKey)
          if (node) closest = { node, cluster, dist }
        }
      }
    }
    return closest ? { node: closest.node, cluster: closest.cluster } : null
  }

  setNodeHovered(sessionId: string, nodeKey: string | null) {
    const clusterObj = this.clusterObjects.get(sessionId)
    if (!clusterObj) return
    for (const [key, nodeObj] of clusterObj.nodeObjects) nodeObj.setHovered(key === nodeKey)
  }

  setNodeSelected(sessionId: string, nodeKey: string | null) {
    const clusterObj = this.clusterObjects.get(sessionId)
    if (!clusterObj) return
    for (const [key, nodeObj] of clusterObj.nodeObjects) nodeObj.setSelected(key === nodeKey)
  }
}
