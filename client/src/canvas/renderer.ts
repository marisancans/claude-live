import * as PIXI from 'pixi.js'
import type { Cluster, Ripple } from '../types'

const NODE_TEXT_STYLE = new PIXI.TextStyle({ fontSize: 11, fill: 0xffffff, fontFamily: 'SF Mono, monospace' })
const CLUSTER_TEXT_STYLE = new PIXI.TextStyle({ fontSize: 9, fill: 0x444444, fontFamily: 'SF Mono, monospace' })

export function drawScene(
  app: PIXI.Application,
  gfx: PIXI.Graphics,
  textContainer: PIXI.Container,
  clusters: Map<string, Cluster>,
  ripples: Ripple[],
  now: number
) {
  gfx.clear()

  // Reuse text objects — track index into textContainer children
  let textIdx = 0

  function getOrCreateText(style: PIXI.TextStyle): PIXI.Text {
    if (textIdx < textContainer.children.length) {
      const t = textContainer.children[textIdx] as PIXI.Text
      textIdx++
      return t
    }
    const t = new PIXI.Text('', style)
    textContainer.addChild(t)
    textIdx++
    return t
  }

  // Draw ripples
  for (let i = ripples.length - 1; i >= 0; i--) {
    const rp = ripples[i]
    const elapsed = now - rp.startTime
    const progress = Math.min(elapsed / rp.duration, 1)
    rp.radius = progress * rp.maxRadius
    rp.alpha = (1 - progress) * 0.8
    if (progress >= 1) { ripples.splice(i, 1); continue }
    gfx.lineStyle(1.5, rp.color, rp.alpha)
    gfx.drawCircle(rp.x, rp.y, rp.radius)
  }

  for (const cluster of clusters.values()) {
    // Draw edges
    for (const edge of cluster.edges) {
      const a = cluster.nodes.get(edge.fromKey)
      const b = cluster.nodes.get(edge.toKey)
      if (!a || !b) continue
      const alpha = (1 - edge.age / 100) * 0.7
      if (alpha <= 0) continue
      gfx.lineStyle(1, edge.color, alpha)
      gfx.moveTo(a.x, a.y)
      gfx.lineTo(b.x, b.y)
    }

    // Draw nodes
    for (const node of cluster.nodes.values()) {
      const ageFraction = node.age / 100
      const opacity = 1 - ageFraction
      const radius = node.baseRadius * (1 - ageFraction * 0.6)
      if (opacity <= 0) continue

      // glow
      gfx.beginFill(node.color, opacity * 0.25)
      gfx.drawCircle(node.x, node.y, radius * 2.5)
      gfx.endFill()

      // core
      gfx.beginFill(node.color, opacity)
      gfx.drawCircle(node.x, node.y, radius)
      gfx.endFill()

      // label
      if (opacity > 0.2) {
        const label = getOrCreateText(NODE_TEXT_STYLE)
        label.text = node.label
        label.alpha = opacity
        label.x = node.x - label.width / 2
        label.y = node.y + radius + 3
        label.visible = true
      }
    }

    // cluster label
    const clusterLabel = getOrCreateText(CLUSTER_TEXT_STYLE)
    clusterLabel.text = cluster.label
    clusterLabel.alpha = 1
    clusterLabel.x = cluster.centerX - clusterLabel.width / 2
    clusterLabel.y = cluster.centerY - 8
    clusterLabel.visible = true
  }

  // Hide unused text objects from previous frame (don't destroy, reuse next frame)
  for (let i = textIdx; i < textContainer.children.length; i++) {
    (textContainer.children[i] as PIXI.Text).visible = false
  }
}
