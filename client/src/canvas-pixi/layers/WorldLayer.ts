import { Container } from 'pixi.js'
import type { Application } from 'pixi.js'
import type { MutableRefObject } from 'react'
import type { Cluster, GraphNode } from '../../types'
import { ClusterObject } from '../objects/ClusterObject'
import { NodeObject } from '../objects/NodeObject'
import { TrailObject } from '../effects/TrailObject'
import { CameraController } from '../animation/CameraController'
import { EdgeLayer } from './EdgeLayer'
import { tickSimulation } from '../../simulation/graph'

/**
 * World layer: camera-transformed container holding all game objects.
 * Includes clusters, nodes, trails, projectiles, and edges.
 */
export class WorldLayer {
  container: Container
  app: Application
  clustersRef: MutableRefObject<Map<string, Cluster>>
  autofitRef: MutableRefObject<boolean>
  clusterObjects: Map<string, ClusterObject> = new Map()
  trailObjects: Map<string, TrailObject> = new Map()
  cameraController: CameraController
  edgeLayer: EdgeLayer
  previousRingCounts: Map<string, number> = new Map() // Track ring changes

  constructor(app: Application, clustersRef: MutableRefObject<Map<string, Cluster>>, autofitRef: MutableRefObject<boolean>) {
    this.app = app
    this.clustersRef = clustersRef
    this.autofitRef = autofitRef
    this.container = new Container()

    // Position at screen center
    this.container.position.set(
      app.renderer.width / 2,
      app.renderer.height / 2
    )

    // Create camera controller
    this.cameraController = new CameraController(app, this.container)

    // Create edge layer
    this.edgeLayer = new EdgeLayer()
    this.container.addChild(this.edgeLayer.graphics)

    // Create cluster objects from initial state
    for (const cluster of clustersRef.current.values()) {
      this.createCluster(cluster)
    }
  }

  /**
   * Get live clusters reference.
   */
  get clusters(): Map<string, Cluster> {
    return this.clustersRef.current
  }

  /**
   * Create a new cluster object and add to scene.
   */
  private createCluster(cluster: Cluster) {
    const clusterObj = new ClusterObject(cluster)
    clusterObj.updateOrbitRings()
    this.container.addChild(clusterObj.container)
    this.clusterObjects.set(cluster.sessionId, clusterObj)

    // Create trail object for this cluster
    const trailObj = new TrailObject(cluster)
    clusterObj.container.addChild(trailObj.container)
    this.trailObjects.set(cluster.sessionId, trailObj)

    // Create node objects
    for (const node of cluster.nodes.values()) {
      const nodeObj = new NodeObject(node)
      clusterObj.container.addChild(nodeObj.container)
      clusterObj.nodeObjects.set(node.key, nodeObj)
    }
  }

  /**
   * Get a NodeObject by sessionId and nodeKey.
   * Returns null if the cluster or node is not found.
   */
  getNodeObject(sessionId: string, nodeKey: string): NodeObject | null {
    const clusterObj = this.clusterObjects.get(sessionId)
    if (!clusterObj) return null
    return clusterObj.nodeObjects.get(nodeKey) ?? null
  }

  /**
   * Cluster positioning physics: repulsion + center gravity.
   * Mirrors the Canvas2D renderer's per-frame physics.
   */
  private tickClusterPhysics(clusters: Map<string, Cluster>) {
    const clusterArray = Array.from(clusters.values())
    const n = clusterArray.length

    if (n === 0) return

    // clusterFootprint: returns the outermost active ring radius
    const footprint = (c: Cluster): number => {
      const radii = [55, 90, 125, 160, 195]
      for (let i = c.ringCounts.length - 1; i >= 0; i--) {
        if (c.ringCounts[i] > 0) return radii[i] ?? 195
      }
      return radii[0]
    }

    if (n === 1) {
      // Single cluster: drift toward (0, 0) in world space
      // (camera centers on content, so (0,0) is fine)
      const c = clusterArray[0]
      c.centerX += (0 - c.centerX) * 0.1
      c.centerY += (0 - c.centerY) * 0.1
    } else {
      // Repulsion: separate overlapping clusters
      for (let i = 0; i < n; i++) {
        const c1 = clusterArray[i]
        const fp1 = footprint(c1)
        for (let j = i + 1; j < n; j++) {
          const c2 = clusterArray[j]
          const fp2 = footprint(c2)
          const minDist = fp1 + fp2 + 120  // 120px gap between clusters

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

      // Center gravity: slow drift toward (0, 0)
      for (const cluster of clusterArray) {
        cluster.centerX += (0 - cluster.centerX) * 0.003
        cluster.centerY += (0 - cluster.centerY) * 0.003
      }
    }
  }

  tick(dt: number) {
    // Always read fresh clusters from ref
    const clusters = this.clustersRef.current

    // Run cluster positioning physics BEFORE camera and object updates
    this.tickClusterPhysics(clusters)

    // Run the shared simulation: orbital advancement, targetOrbitAngle interpolation,
    // trail mark stamping, impact/action decay, snake progress, ephemeral lifecycle
    tickSimulation(clusters)

    // Update camera
    this.cameraController.tick(dt, clusters, this.autofitRef.current)

    // Update all cluster and node objects
    for (const [sessionId, cluster] of clusters) {
      let clusterObj = this.clusterObjects.get(sessionId)

      if (!clusterObj) {
        // New cluster
        this.createCluster(cluster)
        clusterObj = this.clusterObjects.get(sessionId)!
      }

      // Check if ring configuration changed
      const prevLen = this.previousRingCounts.get(sessionId) ?? -1
      if (prevLen !== cluster.ringCounts.length) {
        clusterObj.updateOrbitRings()
        this.previousRingCounts.set(sessionId, cluster.ringCounts.length)
      }

      // Update cluster
      clusterObj.tick(dt)

      // Update trail object
      const trailObj = this.trailObjects.get(sessionId)
      if (trailObj) {
        trailObj.tick(dt)
      }

      // Update nodes — positions are already computed by tickSimulation,
      // NodeObject reads from node.orbitAngle/orbitRadius
      for (const node of cluster.nodes.values()) {
        let nodeObj = clusterObj.nodeObjects.get(node.key)

        if (!nodeObj) {
          // New node
          nodeObj = new NodeObject(node)
          clusterObj.container.addChild(nodeObj.container)
          clusterObj.nodeObjects.set(node.key, nodeObj)
        }

        // Pass compaction state to node for visual distortion
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

        // Remove trail object
        const trailObj = this.trailObjects.get(sessionId)
        if (trailObj) {
          trailObj.destroy()
          this.trailObjects.delete(sessionId)
        }
      }
    }

    // Redraw edges
    this.edgeLayer.redraw(this.clusterObjects, dt)
  }

  /**
   * Hit test: convert screen coordinates to world space and find the closest node.
   * Returns the node and its cluster if within hit radius, otherwise null.
   */
  hitTest(screenX: number, screenY: number): { node: GraphNode; cluster: Cluster } | null {
    // Convert screen coords to world coords using the worldLayer's transform
    const worldX = (screenX - this.container.position.x) / this.container.scale.x + this.container.pivot.x
    const worldY = (screenY - this.container.position.y) / this.container.scale.y + this.container.pivot.y

    // Hit radius in world space (accounting for zoom)
    const hitRadius = 15 / this.container.scale.x

    let closest: { node: GraphNode; cluster: Cluster; dist: number } | null = null

    for (const [sessionId, clusterObj] of this.clusterObjects) {
      const cluster = clusterObj.data

      for (const [nodeKey, nodeObj] of clusterObj.nodeObjects) {
        const nodeWorldX = cluster.centerX + nodeObj.container.position.x
        const nodeWorldY = cluster.centerY + nodeObj.container.position.y

        const dx = worldX - nodeWorldX
        const dy = worldY - nodeWorldY
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist <= hitRadius && (closest === null || dist < closest.dist)) {
          const node = cluster.nodes.get(nodeKey)
          if (node) {
            closest = { node, cluster, dist }
          }
        }
      }
    }

    return closest ? { node: closest.node, cluster: closest.cluster } : null
  }

  /**
   * Set hover state on a node identified by sessionId and nodeKey.
   * Pass nodeKey = null to clear hover on all nodes in that session.
   */
  setNodeHovered(sessionId: string, nodeKey: string | null) {
    const clusterObj = this.clusterObjects.get(sessionId)
    if (!clusterObj) return

    for (const [key, nodeObj] of clusterObj.nodeObjects) {
      nodeObj.setHovered(key === nodeKey)
    }
  }

  /**
   * Set selected state on a node identified by sessionId and nodeKey.
   * Pass nodeKey = null to clear selection on all nodes in that session.
   */
  setNodeSelected(sessionId: string, nodeKey: string | null) {
    const clusterObj = this.clusterObjects.get(sessionId)
    if (!clusterObj) return

    for (const [key, nodeObj] of clusterObj.nodeObjects) {
      nodeObj.setSelected(key === nodeKey)
    }
  }
}
