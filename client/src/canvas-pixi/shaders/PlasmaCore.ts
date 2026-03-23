import { Texture } from 'pixi.js'

/**
 * CPU-rendered plasma core effect drawn into an offscreen canvas,
 * then uploaded as a PixiJS texture each frame.
 * Reliable across all backends (WebGL, WebGPU, Canvas).
 */
export class PlasmaCore {
  private canvas: OffscreenCanvas
  private ctx: OffscreenCanvasRenderingContext2D
  private imgData: ImageData
  readonly size: number
  texture: Texture

  constructor(size = 64) {
    this.size = size
    this.canvas = new OffscreenCanvas(size, size)
    this.ctx = this.canvas.getContext('2d')!
    this.imgData = this.ctx.createImageData(size, size)
    this.texture = Texture.from(this.canvas as any)
  }

  private hash(x: number, y: number): number {
    return Math.abs(Math.sin(x * 127.1 + y * 311.7) * 43758.5453) % 1
  }

  private noise(px: number, py: number): number {
    const ix = Math.floor(px), iy = Math.floor(py)
    const fx = px - ix, fy = py - iy
    const sfx = fx * fx * (3 - 2 * fx), sfy = fy * fy * (3 - 2 * fy)
    const a = this.hash(ix, iy), b = this.hash(ix + 1, iy)
    const c = this.hash(ix, iy + 1), d = this.hash(ix + 1, iy + 1)
    return a + (b - a) * sfx + (c - a) * sfy + (a - b - c + d) * sfx * sfy
  }

  private fbm(x: number, y: number, oct = 5): number {
    let v = 0, a = 0.5
    for (let i = 0; i < oct; i++) {
      v += a * this.noise(x, y)
      x = x * 2.07 + 0.1; y = y * 2.07 - 0.2
      a *= 0.47
    }
    return v
  }

  update(
    time: number,
    activity: number,
    seed: number,
    baseColor: [number, number, number],
    brightColor: [number, number, number],
  ) {
    const S = this.size
    const half = S / 2
    const d = this.imgData.data
    const t = time
    const s = seed * 17.3
    const act = activity

    for (let y = 0; y < S; y++) {
      for (let x = 0; x < S; x++) {
        const ux = (x - half) / half
        const uy = (y - half) / half
        const dist = Math.sqrt(ux * ux + uy * uy)
        const i4 = (y * S + x) * 4

        if (dist > 1.0) {
          d[i4] = d[i4 + 1] = d[i4 + 2] = d[i4 + 3] = 0
          continue
        }

        const angle = Math.atan2(uy, ux)

        // Plasma noise in polar coordinates
        const pu = angle / (Math.PI * 2) + 0.5
        const pv = dist
        const p1 = this.fbm(pu * 3 + t * 0.12 + s, pv * 4 + t * 0.08, 4)
        const p2 = this.fbm(pu * 5 - t * 0.15 + s * 0.7, pv * 3 + t * 0.1, 4)
        const plasma = p1 * 0.6 + p2 * 0.4

        // Turbulence
        const turbSpeed = 0.1 + act * 0.3
        const turb = this.fbm(ux * 3 + t * turbSpeed + s, uy * 3 + t * turbSpeed * 0.8, 3)

        // Core intensity
        const coreFall = Math.exp(-dist * dist * 5)
        const midE = Math.exp(-dist * dist * 2)
        let intensity = coreFall * 0.8 + midE * plasma * 0.4 + turb * 0.15

        // Activity flare
        const flare = act * (Math.sin(dist * 12 - t * 6) * 0.5 + 0.5) * Math.exp(-dist * 2) * 0.5
        intensity += flare

        // Containment rings
        const ring1 = Math.max(0, 1 - Math.abs(dist - 0.55 - Math.sin(t * 0.5) * 0.03) / 0.025)
        const ring2 = Math.max(0, 1 - Math.abs(dist - 0.75 + Math.cos(t * 0.7) * 0.02) / 0.02)
        const ring3 = Math.max(0, 1 - Math.abs(dist - 0.9) / 0.015)
        const rings = (ring1 * 0.25 + ring2 * 0.18 + ring3 * 0.12) * (1 + act * 2)

        // Energy tendrils
        let tendrils = 0
        for (let i = 0; i < 4; i++) {
          const a2 = angle + t * 0.3 + s + i * Math.PI / 2
          const streak = Math.pow(Math.max(0, Math.cos(a2 * 3 + turb * 4)), 12)
          const radFade = Math.min(1, Math.max(0, (dist - 0.2) / 0.3)) * Math.min(1, Math.max(0, (1 - dist) / 0.4))
          tendrils += streak * radFade * 0.15
        }
        tendrils *= 1 + act * 3

        // Color composition: hot center fading to colored body
        const whR = 1, whG = 0.98, whB = 0.93
        const centerMix = coreFall * 0.6
        let r = baseColor[0] * 0.7 + (whR - baseColor[0] * 0.7) * centerMix
        let g = baseColor[1] * 0.7 + (whG - baseColor[1] * 0.7) * centerMix
        let b = baseColor[2] * 0.7 + (whB - baseColor[2] * 0.7) * centerMix

        // Rings and tendrils
        r += brightColor[0] * (rings * 0.8 + tendrils * 0.7 + flare * 0.4)
        g += brightColor[1] * (rings * 0.8 + tendrils * 0.7 + flare * 0.4)
        b += brightColor[2] * (rings * 0.8 + tendrils * 0.7 + flare * 0.4)

        // Plasma swirls visible in mid-range
        const plasmaBlend = plasma * midE * 0.5
        r = r * (1 - plasmaBlend) + brightColor[0] * plasmaBlend
        g = g * (1 - plasmaBlend) + brightColor[1] * plasmaBlend
        b = b * (1 - plasmaBlend) + brightColor[2] * plasmaBlend

        // Turbulence darkening for depth
        const darkening = (1 - turb * 0.2)
        r *= darkening; g *= darkening; b *= darkening

        // Activity brightness boost
        r += act * brightColor[0] * 0.15
        g += act * brightColor[1] * 0.15
        b += act * brightColor[2] * 0.15

        // Fresnel rim glow
        const rim = Math.pow(Math.min(1, Math.max(0, (dist - 0.35) / 0.6)), 2)
        r += brightColor[0] * rim * (0.12 + act * 0.15)
        g += brightColor[1] * rim * (0.12 + act * 0.15)
        b += brightColor[2] * rim * (0.12 + act * 0.15)

        // Soft edge alpha
        const alpha = Math.min(1, Math.max(0, (1 - dist) / 0.15))

        d[i4]     = Math.min(255, r * alpha * 255) | 0
        d[i4 + 1] = Math.min(255, g * alpha * 255) | 0
        d[i4 + 2] = Math.min(255, b * alpha * 255) | 0
        d[i4 + 3] = (alpha * 255) | 0
      }
    }

    this.ctx.putImageData(this.imgData, 0, 0)
    this.texture.source.update()
  }

  destroy() {
    this.texture.destroy()
  }
}
