/**
 * Session core — glowing wireframe icosahedron.
 * No decorative rings — the particle cloud around it IS the activity.
 */
import * as THREE from 'three'
import { makeGlowTexture, hexToRgb } from '../textures/GradientTextures'
import { MODEL_COLORS, parseModelFamily } from '../../constants'

export class SessionCore {
  group: THREE.Group
  private icoWire: THREE.LineSegments
  private icoWireInner: THREE.LineSegments
  private glowSprite: THREE.Sprite
  private glowMaterial: THREE.SpriteMaterial
  private coreLight: THREE.PointLight
  private seed: number
  private activity: number = 0
  private color: THREE.Color

  constructor(model: string = 'unknown') {
    this.group = new THREE.Group()
    this.seed = Math.random() * 100

    const family = parseModelFamily(model)
    const colors = MODEL_COLORS[family] || MODEL_COLORS.unknown
    this.color = new THREE.Color(colors.glow)

    // ── Outer wireframe icosahedron ──
    const icoGeo = new THREE.IcosahedronGeometry(8, 1)
    const icoEdges = new THREE.EdgesGeometry(icoGeo)
    const icoMat = new THREE.LineBasicMaterial({
      color: this.color,
      transparent: true,
      opacity: 0.4,
    })
    this.icoWire = new THREE.LineSegments(icoEdges, icoMat)
    this.group.add(this.icoWire)

    // ── Inner wireframe icosahedron ──
    const icoGeoInner = new THREE.IcosahedronGeometry(5, 1)
    const icoEdgesInner = new THREE.EdgesGeometry(icoGeoInner)
    const icoMatInner = new THREE.LineBasicMaterial({
      color: new THREE.Color(1, 1, 1),
      transparent: true,
      opacity: 0.25,
    })
    this.icoWireInner = new THREE.LineSegments(icoEdgesInner, icoMatInner)
    this.group.add(this.icoWireInner)

    // ── Center glow sprite ──
    const [gr, gg, gb] = hexToRgb(colors.glow)
    const glowTex = makeGlowTexture(gr, gg, gb, 128, 0.3)
    this.glowMaterial = new THREE.SpriteMaterial({
      map: glowTex,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
    })
    this.glowSprite = new THREE.Sprite(this.glowMaterial)
    this.glowSprite.scale.set(25, 25, 1)
    this.group.add(this.glowSprite)

    // ── Point light ──
    this.coreLight = new THREE.PointLight(colors.glow, 2, 80, 2)
    this.group.add(this.coreLight)
  }

  triggerActivity() {
    this.activity = Math.min(1.0, this.activity + 0.5)
  }

  setModel(model: string) {
    const family = parseModelFamily(model)
    const colors = MODEL_COLORS[family] || MODEL_COLORS.unknown
    this.color = new THREE.Color(colors.glow)
    ;(this.icoWire.material as THREE.LineBasicMaterial).color.copy(this.color)
    this.coreLight.color.copy(this.color)
  }

  tick(dt: number, elapsed: number) {
    this.activity = Math.max(0, this.activity - dt * 0.6)

    // Rotate icosahedrons
    this.icoWire.rotation.y += dt * 0.12
    this.icoWire.rotation.x += dt * 0.05
    this.icoWireInner.rotation.y -= dt * 0.18
    this.icoWireInner.rotation.z += dt * 0.08

    // Activity boosts rotation
    this.icoWire.rotation.y += dt * 0.3 * this.activity
    this.icoWireInner.rotation.y -= dt * 0.5 * this.activity

    // Glow breathing + activity pulse
    const breath = 1 + 0.08 * Math.sin(elapsed * 0.5 + this.seed)
    const actGlow = 1 + this.activity * 0.4
    this.glowSprite.scale.set(25 * breath * actGlow, 25 * breath * actGlow, 1)
    this.glowMaterial.opacity = 0.3 + this.activity * 0.3

    this.coreLight.intensity = 2 + this.activity * 4 + Math.sin(elapsed * 0.8) * 0.3

    ;(this.icoWire.material as THREE.LineBasicMaterial).opacity = 0.4 + this.activity * 0.3
    ;(this.icoWireInner.material as THREE.LineBasicMaterial).opacity = 0.25 + this.activity * 0.25
  }

  dispose() {
    this.icoWire.geometry.dispose()
    ;(this.icoWire.material as THREE.Material).dispose()
    this.icoWireInner.geometry.dispose()
    ;(this.icoWireInner.material as THREE.Material).dispose()
    this.glowMaterial.map?.dispose()
    this.glowMaterial.dispose()
  }
}
