import { Container } from 'pixi.js'
import type { Application } from 'pixi.js'
import type { MutableRefObject } from 'react'
import type { Cluster } from '../../types'
import { ClusterObject } from '../objects/ClusterObject'
import { NodeObject } from '../objects/NodeObject'
import { CameraController } from '../animation/CameraController'
import { EdgeLayer } from './EdgeLayer'

/**
 * World layer: camera-transformed container holding all game objects.
 * Includes clusters, nodes, projectiles, and edges.
 */
export class WorldLayer {
  container: Container
  app: Application
  clustersRef: MutableRefObject<Map<string, Cluster>>
  clusterObjects: Map<string, ClusterObject> = new Map()
  cameraController: CameraController
  edgeLayer: EdgeLayer
  previousRingCounts: Map<string, number> = new Map() // Track ring changes

  constructor(app: Application, clustersRef: MutableRefObject<Map<string, Cluster>>) {
    this.app = app
    this.clustersRef = clustersRef
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

    // Create node objects
    for (const node of cluster.nodes.values()) {
      const nodeObj = new NodeObject(node)
      clusterObj.container.addChild(nodeObj.container)
      clusterObj.nodeObjects.set(node.key, nodeObj)
    }
  }

  tick(dt: number) {
    // Always read fresh clusters from ref
    const clusters = this.clustersRef.current

    // Update camera
    this.cameraController.tick(dt, clusters, true)

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

      // Update nodes
      for (const node of cluster.nodes.values()) {
        let nodeObj = clusterObj.nodeObjects.get(node.key)

        if (!nodeObj) {
          // New node
          nodeObj = new NodeObject(node)
          clusterObj.container.addChild(nodeObj.container)
          clusterObj.nodeObjects.set(node.key, nodeObj)
        }

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

    // Redraw edges
    this.edgeLayer.redraw(this.clusterObjects)
  }
}
