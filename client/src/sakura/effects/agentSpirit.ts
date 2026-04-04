import * as THREE from 'three'
import type { TreeEffect, TreeEffectBuilder } from './types'
import { clamp } from './helpers'

const DURATION = 10

export const buildAgentSpirit: TreeEffectBuilder = (ctx, colonyGroup) => {
  const { color } = ctx

  const material = new THREE.MeshStandardMaterial({
    color: color.clone(),
    emissive: color.clone(),
    emissiveIntensity: 0.6,
    roughness: 0.2,
    transparent: true,
    opacity: 0.8,
  })
  const mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1.5, 2), material)
  colonyGroup.add(mesh)

  const tetherMat = new THREE.LineBasicMaterial({
    color: color.clone(),
    transparent: true,
    opacity: 0.25,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
  const tetherGeom = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()])
  const tether = new THREE.Line(tetherGeom, tetherMat)
  colonyGroup.add(tether)

  let elapsed = 0
  const orbitRadius = 14 + Math.random() * 8
  const orbitSpeed = 0.8 + Math.random() * 0.6
  let angle = Math.random() * Math.PI * 2

  return {
    tick(dt) {
      elapsed += dt
      const t = clamp(elapsed / DURATION, 0, 1)
      const fade = 1 - t

      angle += dt * orbitSpeed
      const x = Math.cos(angle) * orbitRadius
      const y = 10 + Math.sin(angle * 1.6) * 4
      const z = Math.sin(angle) * orbitRadius
      mesh.position.set(x, y, z)
      mesh.scale.setScalar(0.8 + fade * 0.8)
      material.opacity = 0.8 * fade
      material.emissiveIntensity = 0.3 + fade * 0.5

      tetherGeom.setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(x, y, z)])
      tetherMat.opacity = 0.2 * fade

      return t < 1
    },
    dispose() {
      colonyGroup.remove(mesh)
      colonyGroup.remove(tether)
      mesh.geometry.dispose()
      material.dispose()
      tetherGeom.dispose()
      tetherMat.dispose()
    },
  }
}
