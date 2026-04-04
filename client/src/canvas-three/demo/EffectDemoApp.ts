/**
 * EffectDemoApp — standalone Three.js app for previewing trail/effect variations.
 * No event system, no sessions. Just a loop: spawn → travel → fade → respawn.
 *
 * Custom effects (buildCustomEffect) are patched into TravelingNode via the
 * effects/index.ts dispatch under their _tool key at runtime.
 */
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { TravelingNode } from '../travel/TravelingNode'
import { BackgroundLayer } from '../layers/BackgroundLayer'
import type { SpawnParams } from '../travel/types'
import type { SecondaryEffect } from '../travel/effects/types'
import type { EffectVariation } from './variations/prompt'

// Patch registry — tool name → effect builder override
// This lets demo variations inject custom trails without modifying effects/index.ts
const _patchedBuilders = new Map<string, (group: THREE.Group, p: SpawnParams) => SecondaryEffect | null>()

// We monkey-patch effects/index buildEffect BEFORE TravelingNode is constructed
// by importing and wrapping at runtime.
import { buildEffect as _origBuildEffect } from '../travel/effects/index'

let _patchedBuildEffect: typeof _origBuildEffect = _origBuildEffect

export function patchEffectBuilder(tool: string, builder: (group: THREE.Group, p: SpawnParams) => SecondaryEffect | null) {
  _patchedBuilders.set(tool, builder)
  _patchedBuildEffect = (t: string, g: THREE.Group, p: SpawnParams) => {
    const override = _patchedBuilders.get(t)
    if (override) return override(g, p)
    return _origBuildEffect(t, g, p)
  }
}

// TravelingNode uses buildEffect from effects/index. We need to override it.
// We do this by re-exporting a patched version. But since TravelingNode imports
// buildEffect statically, we use a different approach: wrap TravelingNode construction.

export class EffectDemoApp {
  private renderer: THREE.WebGLRenderer
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private controls: OrbitControls
  private composer: EffectComposer
  private background: BackgroundLayer
  private clock = new THREE.Clock()

  private nodeGroup = new THREE.Group()
  private currentNode: TravelingNode | null = null
  private respawnTimer = 0
  private currentVariation: EffectVariation | null = null

  // Axis lines for orientation
  private axisGroup = new THREE.Group()

  constructor(container: HTMLElement) {
    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(container.clientWidth, container.clientHeight)
    this.renderer.setClearColor(0x030308)
    container.appendChild(this.renderer.domElement)

    // Scene & camera
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 1, 2000)
    this.camera.position.set(0, 60, 200)

    // Orbit controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.06
    this.controls.autoRotate = false
    this.controls.target.set(-40, 5, -15)  // look roughly at midpoint of travel path
    this.controls.minDistance = 50
    this.controls.maxDistance = 600

    // Background
    this.background = new BackgroundLayer()
    this.scene.add(this.background.group)

    // Scene objects
    this.scene.add(this.nodeGroup)
    this.scene.add(this.axisGroup)
    this._buildAxis()

    // Core glow at target (origin of session)
    this._buildCoreGlow()

    // Composer + bloom
    this.composer = new EffectComposer(this.renderer)
    this.composer.addPass(new RenderPass(this.scene, this.camera))
    const bloom = new UnrealBloomPass(
      new THREE.Vector2(container.clientWidth, container.clientHeight),
      0.7, 0.4, 0.75,
    )
    this.composer.addPass(bloom)

    // Resize
    window.addEventListener('resize', this._onResize)
    this._onResize()
  }

  private _buildAxis() {
    // Small reference cross at origin
    const mat = new THREE.LineBasicMaterial({ color: 0x222244, transparent: true, opacity: 0.4 })
    const mkLine = (a: THREE.Vector3, b: THREE.Vector3) => {
      const g = new THREE.BufferGeometry().setFromPoints([a, b])
      return new THREE.Line(g, mat)
    }
    this.axisGroup.add(mkLine(new THREE.Vector3(-120,0,0), new THREE.Vector3(20,0,0)))
    this.axisGroup.add(mkLine(new THREE.Vector3(0,-20,0),  new THREE.Vector3(0,30,0)))
    this.axisGroup.add(mkLine(new THREE.Vector3(0,0,-60),  new THREE.Vector3(0,0,20)))
  }

  private _buildCoreGlow() {
    // Subtle glowing sphere at target (0,0,0)
    const geo = new THREE.SphereGeometry(3, 16, 16)
    const mat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#22ff88'),
      transparent: true, opacity: 0.15,
      blending: THREE.AdditiveBlending,
    })
    this.scene.add(new THREE.Mesh(geo, mat))

    // Ring around it
    const ringGeo = new THREE.RingGeometry(5, 6, 32)
    const ringMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#4ade80'),
      transparent: true, opacity: 0.2,
      blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    })
    this.scene.add(new THREE.Mesh(ringGeo, ringMat))

    // Origin marker at file node
    const origin = new THREE.Vector3(-80, 10, -30)
    const fileGeo = new THREE.SphereGeometry(2, 12, 12)
    const fileMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#4ade80'),
      transparent: true, opacity: 0.3,
      blending: THREE.AdditiveBlending,
    })
    const fileMesh = new THREE.Mesh(fileGeo, fileMat)
    fileMesh.position.copy(origin)
    this.scene.add(fileMesh)
  }

  setVariation(variation: EffectVariation) {
    this.currentVariation = variation

    // Register custom effect builder for this variation's _tool key
    if (variation.buildCustomEffect) {
      const toolKey = variation.spawnParams()._tool ?? ''
      patchEffectBuilder(toolKey, variation.buildCustomEffect)
    }

    // Kill current node and spawn immediately
    this._clearNode()
    this._spawnNode()
  }

  private _clearNode() {
    if (this.currentNode) {
this.nodeGroup.remove(this.currentNode.group)
      this.currentNode.dispose()
      this.currentNode = null
    }
  }

  private _spawnNode() {
    if (!this.currentVariation) return
    const params = this.currentVariation.spawnParams(this.camera.position)
    const node = new TravelingNode(params, _patchedBuildEffect)
    this.nodeGroup.add(node.group)
    this.currentNode = node
    this.respawnTimer = 0
  }

  tick() {
    const dt = Math.min(this.clock.getDelta(), 0.05)
    this.controls.update()
    this.background.tick(dt)

    if (this.currentNode) {
      this.currentNode.tick(dt)
      if (this.currentNode.done) {
        this._clearNode()
        // Brief pause then respawn
        this.respawnTimer = 0
      }
    } else {
      this.respawnTimer += dt
      if (this.respawnTimer > 1.0 && this.currentVariation) {
        this._spawnNode()
      }
    }

    this.composer.render()
  }

  private _onResize = () => {
    const container = this.renderer.domElement.parentElement
    if (!container) return
    const w = container.clientWidth
    const h = container.clientHeight
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(w, h)
    this.composer.setSize(w, h)
  }

  destroy() {
    window.removeEventListener('resize', this._onResize)
    this.renderer.dispose()
    this._clearNode()
    _patchedBuilders.clear()
  }
}
