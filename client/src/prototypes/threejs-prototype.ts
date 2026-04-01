/**
 * Three.js Renderer Prototype — claude-live
 *
 * Demonstrates all key visual elements ported from PixiJS:
 * - Aurora background (additive blend sprites)
 * - Star field (tiny sprites with twinkle)
 * - Cluster core with glow (additive blend + bloom)
 * - Orbiting file nodes (sprites on circular paths)
 * - Projectile animations (core → node)
 * - Particle burst effects
 * - CSS2D text labels (no flickering!)
 * - Orthographic camera with zoom/pan
 * - UnrealBloomPass post-processing
 * - Vignette overlay
 *
 * Open: http://localhost:7979/prototypes/threejs.html
 */
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'

// ─── Config ──────────────────────────────────────────────────

const BG_COLOR = 0x050510
const ORBIT_RADII = [70, 120, 175, 225]
const NODE_COLORS = [0x4ade80, 0x60a5fa, 0xf59e0b, 0xa78bfa, 0xf472b6, 0x34d399, 0x38bdf8]

// ─── Canvas2D Texture Generators ─────────────────────────────

function makeGlowTexture(r: number, g: number, b: number, size: number, coreAlpha = 0.6): THREE.Texture {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const h = size / 2
  const grad = ctx.createRadialGradient(h, h, 0, h, h, h)
  grad.addColorStop(0, `rgba(${r},${g},${b},${coreAlpha})`)
  grad.addColorStop(0.2, `rgba(${r},${g},${b},${coreAlpha * 0.6})`)
  grad.addColorStop(0.5, `rgba(${r},${g},${b},${coreAlpha * 0.2})`)
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  return tex
}

function makeBodyTexture(r: number, g: number, b: number, size: number): THREE.Texture {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const h = size / 2
  // Body gradient
  const bodyGrad = ctx.createRadialGradient(h, h, 0, h, h, h * 0.85)
  bodyGrad.addColorStop(0, `rgba(${r},${g},${b},1)`)
  bodyGrad.addColorStop(0.5, `rgba(${r},${g},${b},0.9)`)
  bodyGrad.addColorStop(0.85, `rgba(${r},${g},${b},0.4)`)
  bodyGrad.addColorStop(1, `rgba(${r},${g},${b},0)`)
  ctx.fillStyle = bodyGrad
  ctx.beginPath(); ctx.arc(h, h, h, 0, Math.PI * 2); ctx.fill()
  // Highlight
  const hlGrad = ctx.createRadialGradient(h * 0.6, h * 0.6, 0, h * 0.6, h * 0.6, h * 0.5)
  hlGrad.addColorStop(0, 'rgba(255,255,255,0.35)')
  hlGrad.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = hlGrad
  ctx.beginPath(); ctx.arc(h, h, h * 0.8, 0, Math.PI * 2); ctx.fill()
  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  return tex
}

function makeAuroraCurtainTexture(
  r: number, g: number, b: number, peakAlpha: number,
  peakStart = 0.4, peakEnd = 0.6
): THREE.Texture {
  const w = 48, h = 800
  const canvas = document.createElement('canvas')
  canvas.width = w; canvas.height = h
  const ctx = canvas.getContext('2d')!
  const imgData = ctx.createImageData(w, h)
  const data = imgData.data
  const cx = w / 2
  for (let y = 0; y < h; y++) {
    const ny = y / h
    let vI: number
    if (ny < peakStart) { const t = ny / peakStart; vI = t * t }
    else if (ny > peakEnd) { const t = (ny - peakEnd) / (1 - peakEnd); vI = (1 - t) * (1 - t) }
    else { vI = 1.0 }
    for (let x = 0; x < w; x++) {
      const dx = (x - cx) / (w / 2)
      const hI = Math.exp(-dx * dx * 3.0)
      const alpha = vI * hI * peakAlpha
      const idx = (y * w + x) * 4
      data[idx] = r; data[idx + 1] = g; data[idx + 2] = b
      data[idx + 3] = Math.round(alpha * 255)
    }
  }
  ctx.putImageData(imgData, 0, 0)
  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  return tex
}

function makeStarTexture(): THREE.Texture {
  const size = 8
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const h = size / 2
  const grad = ctx.createRadialGradient(h, h, 0, h, h, h)
  grad.addColorStop(0, 'rgba(180,190,220,0.9)')
  grad.addColorStop(0.4, 'rgba(180,190,220,0.3)')
  grad.addColorStop(1, 'rgba(180,190,220,0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  return tex
}

function makeVignetteTexture(w: number, h: number): THREE.Texture {
  const canvas = document.createElement('canvas')
  canvas.width = w; canvas.height = h
  const ctx = canvas.getContext('2d')!
  const cx = w / 2, cy = h / 2
  const radius = Math.max(w, h) * 0.7
  const grad = ctx.createRadialGradient(cx, cy, radius * 0.25, cx, cy, radius)
  grad.addColorStop(0, 'rgba(5,5,16,0)')
  grad.addColorStop(0.5, 'rgba(5,5,16,0.18)')
  grad.addColorStop(0.8, 'rgba(5,5,16,0.38)')
  grad.addColorStop(1, 'rgba(5,5,16,0.5)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h)
  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  return tex
}

function makeParticleTexture(r: number, g: number, b: number): THREE.Texture {
  const size = 32
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const h = size / 2
  const grad = ctx.createRadialGradient(h, h, 0, h, h, h)
  grad.addColorStop(0, `rgba(${r},${g},${b},1)`)
  grad.addColorStop(0.3, `rgba(${r},${g},${b},0.5)`)
  grad.addColorStop(0.7, `rgba(${r},${g},${b},0.1)`)
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(canvas)
  tex.needsUpdate = true
  return tex
}

// ─── Helpers ─────────────────────────────────────────────────

function rand(min: number, max: number) { return Math.random() * (max - min) + min }
function hexToRgb(hex: number): [number, number, number] {
  return [(hex >> 16) & 0xff, (hex >> 8) & 0xff, hex & 0xff]
}

// ─── Aurora Configs ──────────────────────────────────────────

const AURORA_CONFIGS = [
  { r: 0,   g: 180, b: 160, peakAlpha: 0.25, peakStart: 0.35, peakEnd: 0.55 },
  { r: 40,  g: 80,  b: 200, peakAlpha: 0.20, peakStart: 0.40, peakEnd: 0.60 },
  { r: 100, g: 40,  b: 180, peakAlpha: 0.18, peakStart: 0.45, peakEnd: 0.65 },
  { r: 0,   g: 200, b: 100, peakAlpha: 0.15, peakStart: 0.38, peakEnd: 0.58 },
  { r: 180, g: 40,  b: 80,  peakAlpha: 0.12, peakStart: 0.42, peakEnd: 0.62 },
  { r: 30,  g: 120, b: 190, peakAlpha: 0.16, peakStart: 0.36, peakEnd: 0.56 },
]

// ─── Types ───────────────────────────────────────────────────

interface AuroraData {
  mesh: THREE.Mesh
  baseX: number
  baseAlpha: number
  phase: number
  alphaPhase: number
  material: THREE.MeshBasicMaterial
}

interface StarData {
  index: number // index in Points geometry
  baseAlpha: number
  twinkle: boolean
  twinkleSpeed: number
  twinklePhase: number
}

interface NodeData {
  group: THREE.Group
  glowMesh: THREE.Mesh
  bodyMesh: THREE.Mesh
  label: CSS2DObject
  orbitRadius: number
  orbitAngle: number
  orbitSpeed: number
  color: number
  breathSeed: number
}

interface Projectile {
  mesh: THREE.Mesh
  startX: number; startY: number
  endX: number; endY: number
  progress: number
  duration: number
  glowMesh: THREE.Mesh
}

interface Particle {
  x: number; y: number
  vx: number; vy: number
  life: number
  maxLife: number
  size: number
}

// ─── Main ────────────────────────────────────────────────────

async function main() {
  const W = window.innerWidth
  const H = window.innerHeight
  const container = document.getElementById('canvas-container')!
  const infoEl = document.getElementById('info')!

  // ── Renderer ──
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
  renderer.setSize(W, H)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(BG_COLOR)
  renderer.sortObjects = true
  container.appendChild(renderer.domElement)

  // ── CSS2D Renderer (for text labels) ──
  const cssRenderer = new CSS2DRenderer()
  cssRenderer.setSize(W, H)
  cssRenderer.domElement.style.position = 'absolute'
  cssRenderer.domElement.style.top = '0'
  cssRenderer.domElement.style.pointerEvents = 'none'
  container.appendChild(cssRenderer.domElement)

  // ── Scenes ──
  // Background scene (screen-space, separate camera — never affected by world camera)
  const bgScene = new THREE.Scene()
  const bgCamera = new THREE.OrthographicCamera(-W / 2, W / 2, H / 2, -H / 2, -100, 100)

  // World scene (clusters, nodes, effects — affected by camera zoom/pan)
  const worldScene = new THREE.Scene()
  const worldCamera = new THREE.OrthographicCamera(-W / 2, W / 2, H / 2, -H / 2, -1000, 1000)
  worldCamera.position.z = 500

  // ── Post-processing (bloom on world scene only) ──
  const composer = new EffectComposer(renderer)
  const bgPass = new RenderPass(bgScene, bgCamera)
  bgPass.clear = true
  composer.addPass(bgPass)

  const worldPass = new RenderPass(worldScene, worldCamera)
  worldPass.clear = false // don't clear — render on top of background
  worldPass.clearDepth = true
  composer.addPass(worldPass)

  // Bloom at half resolution for performance (full res is expensive)
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(W / 2, H / 2),
    0.4,   // strength
    0.3,   // radius
    0.85   // threshold
  )
  composer.addPass(bloomPass)

  let bloomEnabled = true

  // ── Background: Aurora Curtains ──
  const auroras: AuroraData[] = []
  const curtainSpacing = W / (AURORA_CONFIGS.length + 1)

  for (let i = 0; i < AURORA_CONFIGS.length; i++) {
    const cfg = AURORA_CONFIGS[i]
    const tex = makeAuroraCurtainTexture(cfg.r, cfg.g, cfg.b, cfg.peakAlpha, cfg.peakStart, cfg.peakEnd)
    const mat = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const geo = new THREE.PlaneGeometry(48 * rand(1.5, 3.0), H)
    const mesh = new THREE.Mesh(geo, mat)
    const baseX = curtainSpacing * (i + 1) - W / 2 + rand(-80, 80)
    mesh.position.set(baseX, 0, -10)
    const baseAlpha = rand(0.4, 0.7)
    mat.opacity = baseAlpha
    bgScene.add(mesh)

    auroras.push({
      mesh, baseX, baseAlpha,
      phase: rand(0, Math.PI * 2),
      alphaPhase: rand(0, Math.PI * 2),
      material: mat,
    })
  }

  // ── Background: Stars ──
  const starTex = makeStarTexture()
  const starCount = 70
  const starPositions = new Float32Array(starCount * 3)
  const starSizes = new Float32Array(starCount)
  const starAlphas = new Float32Array(starCount)
  const starsData: StarData[] = []

  for (let i = 0; i < starCount; i++) {
    starPositions[i * 3] = rand(-W / 2, W / 2)
    starPositions[i * 3 + 1] = rand(-H / 2, H / 2)
    starPositions[i * 3 + 2] = -5
    const isLarge = i < 8
    starSizes[i] = isLarge ? rand(3, 5) : rand(1.5, 3)
    const ba = isLarge ? rand(0.5, 0.8) : rand(0.35, 0.75)
    starAlphas[i] = ba
    starsData.push({
      index: i,
      baseAlpha: ba,
      twinkle: Math.random() < 0.25,
      twinkleSpeed: rand(0.3, 1.0),
      twinklePhase: rand(0, Math.PI * 2),
    })
  }

  const starGeo = new THREE.BufferGeometry()
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
  starGeo.setAttribute('size', new THREE.BufferAttribute(starSizes, 1))
  const starMat = new THREE.PointsMaterial({
    map: starTex,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    size: 3,
    sizeAttenuation: false,
  })
  const starPoints = new THREE.Points(starGeo, starMat)
  starPoints.position.z = -5
  bgScene.add(starPoints)

  // ── Background: Vignette ──
  const vigTex = makeVignetteTexture(W, H)
  const vigMat = new THREE.MeshBasicMaterial({ map: vigTex, transparent: true, depthWrite: false })
  const vigMesh = new THREE.Mesh(new THREE.PlaneGeometry(W, H), vigMat)
  vigMesh.position.z = 5 // in front of aurora/stars
  bgScene.add(vigMesh)

  // ── World: Cluster Core ──
  const clusterGroup = new THREE.Group()
  worldScene.add(clusterGroup)

  // Core glow (additive)
  const coreGlowTex = makeGlowTexture(64, 128, 255, 128, 0.15)
  const coreGlowMat = new THREE.SpriteMaterial({
    map: coreGlowTex,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
  })
  const coreGlow = new THREE.Sprite(coreGlowMat)
  coreGlow.scale.set(80, 80, 1)
  clusterGroup.add(coreGlow)

  // Core body (bright center)
  const coreBrightTex = makeGlowTexture(100, 180, 255, 64, 0.8)
  const coreBrightMat = new THREE.SpriteMaterial({
    map: coreBrightTex,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
  })
  const coreBright = new THREE.Sprite(coreBrightMat)
  coreBright.scale.set(20, 20, 1)
  clusterGroup.add(coreBright)

  // Core label (CSS2D — HTML text, no flicker!)
  const coreLabelDiv = document.createElement('div')
  coreLabelDiv.className = 'cluster-label'
  coreLabelDiv.textContent = 'session:prototype'
  const coreLabel = new CSS2DObject(coreLabelDiv)
  coreLabel.position.set(0, -18, 0)
  clusterGroup.add(coreLabel)

  // Model label
  const modelLabelDiv = document.createElement('div')
  modelLabelDiv.className = 'node-label'
  modelLabelDiv.textContent = 'sonnet 4.5'
  const modelLabel = new CSS2DObject(modelLabelDiv)
  modelLabel.position.set(0, -28, 0)
  clusterGroup.add(modelLabel)

  // ── Orbit ring lines ──
  for (const radius of ORBIT_RADII) {
    const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, Math.PI * 2, false, 0)
    const pts = curve.getPoints(128)
    const ringGeo = new THREE.BufferGeometry().setFromPoints(pts.map(p => new THREE.Vector3(p.x, p.y, 0)))
    const ringMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.05 })
    const ring = new THREE.LineLoop(ringGeo, ringMat)
    clusterGroup.add(ring)
  }

  // ── Nodes ──
  const nodes: NodeData[] = []

  function addNode(ringIdx: number, label: string) {
    const radius = ORBIT_RADII[ringIdx]
    const color = NODE_COLORS[nodes.length % NODE_COLORS.length]
    const [r, g, b] = hexToRgb(color)
    const angle = rand(0, Math.PI * 2)
    const speed = [0.0015, 0.001, 0.0006, 0.0004][ringIdx]

    const group = new THREE.Group()

    // Glow sprite (additive)
    const glowTex = makeGlowTexture(r, g, b, 64, 0.15)
    const glowMat = new THREE.SpriteMaterial({
      map: glowTex,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
    })
    const glowMesh = new THREE.Sprite(glowMat)
    glowMesh.scale.set(24, 24, 1)
    group.add(glowMesh)

    // Body sprite
    const bodyTex = makeBodyTexture(r, g, b, 32)
    const bodyMat = new THREE.SpriteMaterial({
      map: bodyTex,
      transparent: true,
      depthWrite: false,
    })
    const bodyMesh = new THREE.Sprite(bodyMat)
    bodyMesh.scale.set(10, 10, 1)
    group.add(bodyMesh)

    // CSS2D label
    const div = document.createElement('div')
    div.className = 'node-label'
    div.textContent = label
    const labelObj = new CSS2DObject(div)
    labelObj.position.set(0, -9, 0)
    group.add(labelObj)

    // Position on orbit
    group.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0)
    clusterGroup.add(group)

    const nodeData: NodeData = {
      group, glowMesh, bodyMesh, label: labelObj,
      orbitRadius: radius, orbitAngle: angle, orbitSpeed: speed,
      color, breathSeed: rand(0, 10),
    }
    nodes.push(nodeData)
    return nodeData
  }

  // Seed some initial nodes
  const FILE_NAMES = ['App.tsx', 'store.ts', 'index.js', 'types.ts', 'utils.ts', 'main.tsx',
    'config.ts', 'hooks.ts', 'api.ts', 'router.ts', 'styles.css', 'schema.ts']
  for (let i = 0; i < 8; i++) {
    addNode(i < 2 ? 0 : i < 5 ? 1 : 2, FILE_NAMES[i])
  }

  // ── Projectiles ──
  const projectiles: Projectile[] = []

  function fireProjectile(targetNode: NodeData) {
    const [r, g, b] = hexToRgb(targetNode.color)
    const tex = makeGlowTexture(r, g, b, 32, 0.9)
    const mat = new THREE.SpriteMaterial({
      map: tex,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
    })
    const mesh = new THREE.Sprite(mat)
    mesh.scale.set(8, 8, 1)
    clusterGroup.add(mesh)

    const glowTex = makeGlowTexture(r, g, b, 64, 0.3)
    const glowMat = new THREE.SpriteMaterial({
      map: glowTex,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
    })
    const glowMesh = new THREE.Sprite(glowMat)
    glowMesh.scale.set(20, 20, 1)
    clusterGroup.add(glowMesh)

    projectiles.push({
      mesh, glowMesh,
      startX: 0, startY: 0,
      endX: targetNode.group.position.x,
      endY: targetNode.group.position.y,
      progress: 0,
      duration: 0.6,
    })
  }

  // ── Particle System ──
  const particles: Particle[] = []
  const particleTex = makeParticleTexture(100, 180, 255)
  const MAX_PARTICLES = 500
  const particlePositions = new Float32Array(MAX_PARTICLES * 3)
  const particleAlphas = new Float32Array(MAX_PARTICLES)
  const particleSizesArr = new Float32Array(MAX_PARTICLES)

  const particleGeo = new THREE.BufferGeometry()
  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))

  const particleMat = new THREE.PointsMaterial({
    map: particleTex,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    size: 6,
    sizeAttenuation: true,
  })
  const particlePoints = new THREE.Points(particleGeo, particleMat)
  worldScene.add(particlePoints)

  function burstParticles(x: number, y: number, count: number, color?: number) {
    for (let i = 0; i < count; i++) {
      const angle = rand(0, Math.PI * 2)
      const speed = rand(40, 150)
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        maxLife: rand(0.5, 1.5),
        size: rand(2, 6),
      })
    }
  }

  // ── Camera Controls ──
  let cameraTargetX = 0, cameraTargetY = 0, cameraZoom = 1
  let dragging = false, dragLastX = 0, dragLastY = 0
  let manualPanX = 0, manualPanY = 0, manualZoom = 1
  let idleTimer = 0

  renderer.domElement.addEventListener('wheel', (e) => {
    manualZoom *= e.deltaY < 0 ? 1.1 : 1 / 1.1
    manualZoom = Math.max(0.3, Math.min(5, manualZoom))
    idleTimer = 0
  }, { passive: true })

  renderer.domElement.addEventListener('pointerdown', (e) => {
    dragging = true; dragLastX = e.clientX; dragLastY = e.clientY
  })
  renderer.domElement.addEventListener('pointermove', (e) => {
    if (!dragging) return
    const z = worldCamera.zoom || 1
    manualPanX -= (e.clientX - dragLastX) / z
    manualPanY += (e.clientY - dragLastY) / z // Y is flipped in Three.js
    dragLastX = e.clientX; dragLastY = e.clientY
    idleTimer = 0
  })
  renderer.domElement.addEventListener('pointerup', () => { dragging = false })
  renderer.domElement.addEventListener('pointerleave', () => { dragging = false })

  // ── Button Controls ──
  document.getElementById('btn-add-node')!.addEventListener('click', () => {
    const ringIdx = Math.min(3, Math.floor(nodes.length / 4))
    addNode(ringIdx, FILE_NAMES[nodes.length % FILE_NAMES.length])
  })

  document.getElementById('btn-projectile')!.addEventListener('click', () => {
    if (nodes.length === 0) return
    const target = nodes[Math.floor(Math.random() * nodes.length)]
    fireProjectile(target)
  })

  document.getElementById('btn-burst')!.addEventListener('click', () => {
    burstParticles(0, 0, 60)
  })

  document.getElementById('btn-toggle-bloom')!.addEventListener('click', () => {
    bloomEnabled = !bloomEnabled
    bloomPass.strength = bloomEnabled ? 0.4 : 0
    infoEl.textContent = `bloom: ${bloomEnabled ? 'ON' : 'OFF'}`
  })

  // ── Resize ──
  window.addEventListener('resize', () => {
    const w = window.innerWidth, h = window.innerHeight
    renderer.setSize(w, h)
    cssRenderer.setSize(w, h)
    composer.setSize(w, h)

    // Update cameras
    bgCamera.left = -w / 2; bgCamera.right = w / 2
    bgCamera.top = h / 2; bgCamera.bottom = -h / 2
    bgCamera.updateProjectionMatrix()

    worldCamera.left = -w / 2; worldCamera.right = w / 2
    worldCamera.top = h / 2; worldCamera.bottom = -h / 2
    worldCamera.updateProjectionMatrix()

    // Reposition auroras
    const newSpacing = w / (AURORA_CONFIGS.length + 1)
    for (let i = 0; i < auroras.length; i++) {
      const a = auroras[i]
      a.baseX = newSpacing * (i + 1) - w / 2 + (a.baseX - (curtainSpacing * (i + 1) - W / 2))
    }

    // Rebuild vignette
    vigMat.map?.dispose()
    vigMat.map = makeVignetteTexture(w, h)
    vigMesh.geometry.dispose()
    vigMesh.geometry = new THREE.PlaneGeometry(w, h)
  })

  // ── FPS Counter ──
  let fpsFrames = 0, fpsTime = performance.now()

  // ── Animation Loop ──
  let elapsed = 0
  const clock = new THREE.Clock()

  function animate() {
    requestAnimationFrame(animate)
    const dt = Math.min(clock.getDelta(), 0.05) // cap at 50ms
    elapsed += dt

    // FPS
    fpsFrames++
    const now = performance.now()
    if (now - fpsTime >= 500) {
      const fps = Math.round(fpsFrames / (now - fpsTime) * 1000)
      if (bloomEnabled) infoEl.textContent = `${fps} fps | bloom ON`
      else infoEl.textContent = `${fps} fps | bloom OFF`
      fpsFrames = 0; fpsTime = now
    }

    const t = elapsed

    // ── Aurora sway ──
    for (const a of auroras) {
      a.mesh.position.x = a.baseX + Math.sin(t * 0.08 + a.phase) * 8
      a.material.opacity = a.baseAlpha * (0.92 + 0.08 * Math.sin(t * 0.1 + a.alphaPhase))
    }

    // ── Star twinkle ──
    for (const star of starsData) {
      if (star.twinkle) {
        const osc = Math.sin(t * star.twinkleSpeed * Math.PI * 2 + star.twinklePhase)
        starAlphas[star.index] = star.baseAlpha * (0.6 + 0.4 * (0.5 + 0.5 * osc))
      }
    }
    // Update star point opacity (global for now — individual alpha needs custom shader)
    starMat.opacity = 0.7 + 0.1 * Math.sin(t * 0.3)

    // ── Core breathing ──
    const breath = 1 + 0.06 * Math.sin(t * 0.8)
    coreGlow.scale.set(80 * breath, 80 * breath, 1)
    coreBright.scale.set(20 * (1 + 0.03 * Math.sin(t * 1.2)), 20 * (1 + 0.03 * Math.sin(t * 1.2)), 1)

    // ── Node orbital motion + breathing ──
    for (const node of nodes) {
      node.orbitAngle += node.orbitSpeed
      const x = Math.cos(node.orbitAngle) * node.orbitRadius
      const y = Math.sin(node.orbitAngle) * node.orbitRadius
      node.group.position.set(x, y, 0)

      // Breathing
      const nb = 1 + 0.04 * Math.sin(t * 0.8 + node.breathSeed)
      node.bodyMesh.scale.set(10 * nb, 10 * nb, 1)
      const gb = 1 + 0.06 * Math.sin(t * 0.5 + node.breathSeed)
      node.glowMesh.scale.set(24 * gb, 24 * gb, 1)
    }

    // ── Projectiles ──
    for (let i = projectiles.length - 1; i >= 0; i--) {
      const p = projectiles[i]
      p.progress += dt / p.duration
      if (p.progress >= 1) {
        clusterGroup.remove(p.mesh)
        clusterGroup.remove(p.glowMesh)
        p.mesh.material.dispose()
        p.glowMesh.material.dispose()
        projectiles.splice(i, 1)
        // Burst on impact
        burstParticles(p.endX, p.endY, 15)
        continue
      }
      // Ease in-out
      const t2 = p.progress
      const eased = t2 < 0.5 ? 2 * t2 * t2 : 1 - (-2 * t2 + 2) ** 2 / 2
      const px = p.startX + (p.endX - p.startX) * eased
      const py = p.startY + (p.endY - p.startY) * eased
      p.mesh.position.set(px, py, 1)
      p.glowMesh.position.set(px, py, 0.5)
    }

    // ── Particles ──
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]
      p.life -= dt / p.maxLife
      if (p.life <= 0) { particles.splice(i, 1); continue }
      p.x += p.vx * dt
      p.y += p.vy * dt
      p.vx *= 0.97 // drag
      p.vy *= 0.97
    }
    // Upload to GPU
    const visibleCount = Math.min(particles.length, MAX_PARTICLES)
    for (let i = 0; i < visibleCount; i++) {
      particlePositions[i * 3] = particles[i].x
      particlePositions[i * 3 + 1] = particles[i].y
      particlePositions[i * 3 + 2] = 2
    }
    // Zero out unused
    for (let i = visibleCount; i < MAX_PARTICLES; i++) {
      particlePositions[i * 3 + 2] = -9999 // push off-screen
    }
    particleGeo.attributes.position.needsUpdate = true
    particleMat.opacity = particles.length > 0 ? 0.8 : 0

    // ── Camera autofit ──
    idleTimer += dt
    if (idleTimer > 2 && !dragging) {
      manualPanX += (0 - manualPanX) * 0.05
      manualPanY += (0 - manualPanY) * 0.05
      manualZoom += (1 - manualZoom) * 0.05
    }
    worldCamera.position.x += (manualPanX - worldCamera.position.x) * 0.15
    worldCamera.position.y += (manualPanY - worldCamera.position.y) * 0.15
    worldCamera.zoom += (manualZoom - worldCamera.zoom) * 0.15
    worldCamera.updateProjectionMatrix()

    // ── Render ──
    composer.render()
    cssRenderer.render(worldScene, worldCamera)
  }

  animate()
}

main()
