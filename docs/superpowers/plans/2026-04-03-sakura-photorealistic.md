# Sakura Photorealistic Rendering — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the sakura tree from a decent WebGL demo into wallpaper-quality photorealistic rendering with cinematic post-processing, subsurface scattering petals, shadows, and atmospheric effects.

**Architecture:** Layer post-processing passes onto the existing EffectComposer pipeline (DoF, color grading, film grain, chromatic aberration, SSAO, god rays). Upgrade petal material from MeshStandardMaterial to a custom ShaderMaterial with subsurface scattering. Enable shadow mapping on the existing DirectionalLight. All changes are additive — no existing functionality removed.

**Tech Stack:** Three.js r183, GLSL custom ShaderPass filters, Canvas2D texture generation, existing sakura module at `client/src/sakura/`

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `client/src/sakura/postprocessing/ColorGradingPass.ts` | Create | ACES tonemapping + split toning + vignette ShaderPass |
| `client/src/sakura/postprocessing/FilmGrainPass.ts` | Create | Animated noise overlay ShaderPass |
| `client/src/sakura/postprocessing/GodRaysPass.ts` | Create | Volumetric light shaft ShaderPass |
| `client/src/sakura/postprocessing/ChromaticAberrationPass.ts` | Create | Subtle lens fringe ShaderPass |
| `client/src/sakura/PetalSystem.ts` | Modify | Custom SSS shader, vein detail texture, petal variety |
| `client/src/sakura/BranchRenderer.ts` | Modify | Bark normal map generation + application |
| `client/src/sakura/SakuraApp.ts` | Modify | Wire all passes into composer, enable shadows, SSAO, dust motes, fog layers |

---

## Task 1: Depth of Field (BokehPass)

**Files:**
- Modify: `client/src/sakura/SakuraApp.ts`

- [ ] **Step 1: Add BokehPass import**

In `client/src/sakura/SakuraApp.ts`, add at the top with the other postprocessing imports:

```typescript
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js'
```

- [ ] **Step 2: Add BokehPass to composer pipeline**

In the constructor, after the UnrealBloomPass line (`this.composer.addPass(new UnrealBloomPass(...))`), add:

```typescript
    const bokeh = new BokehPass(this.scene, this.camera, {
      focus: 180,
      aperture: 0.002,
      maxblur: 0.006,
    })
    this.composer.addPass(bokeh)
```

- [ ] **Step 3: Typecheck**

```bash
cd client && npx tsc --noEmit
```

- [ ] **Step 4: Visual verify**

Navigate to `http://localhost:7979/#/sakura`. Background should blur softly while the tree stays sharp. Orbit the camera — the focus plane should stay near the tree center.

- [ ] **Step 5: Commit**

```bash
cd /Users/marisancans/src/claude-live
git add client/src/sakura/SakuraApp.ts
git commit -m "feat(sakura): add depth of field — BokehPass for cinematic focus"
```

---

## Task 2: Color Grading ShaderPass

**Files:**
- Create: `client/src/sakura/postprocessing/ColorGradingPass.ts`
- Modify: `client/src/sakura/SakuraApp.ts`

- [ ] **Step 1: Create the postprocessing directory**

```bash
mkdir -p client/src/sakura/postprocessing
```

- [ ] **Step 2: Create ColorGradingPass.ts**

Create `client/src/sakura/postprocessing/ColorGradingPass.ts`:

```typescript
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'

const ColorGradingShader = {
  uniforms: {
    tDiffuse: { value: null },
    uVignetteStrength: { value: 0.25 },
    uSaturation: { value: 1.12 },
    uWarmth: { value: 0.06 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float uVignetteStrength;
    uniform float uSaturation;
    uniform float uWarmth;
    varying vec2 vUv;

    // ACES filmic tonemapping
    vec3 aces(vec3 x) {
      float a = 2.51;
      float b = 0.03;
      float c = 2.43;
      float d = 0.59;
      float e = 0.14;
      return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
    }

    void main() {
      vec3 color = texture2D(tDiffuse, vUv).rgb;

      // ACES tonemapping
      color = aces(color);

      // Saturation boost
      float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
      color = mix(vec3(luma), color, uSaturation);

      // Split toning: warm shadows, cool highlights
      vec3 warmTint = vec3(1.0, 0.95, 0.88);
      vec3 coolTint = vec3(0.92, 0.95, 1.0);
      float luminance = dot(color, vec3(0.299, 0.587, 0.114));
      vec3 tint = mix(warmTint, coolTint, smoothstep(0.3, 0.7, luminance));
      color *= mix(vec3(1.0), tint, uWarmth * 3.0);

      // Vignette
      vec2 centered = vUv - 0.5;
      float vignette = 1.0 - dot(centered, centered) * uVignetteStrength * 4.0;
      color *= clamp(vignette, 0.0, 1.0);

      // Gamma correction
      color = pow(color, vec3(1.0 / 2.2));

      gl_FragColor = vec4(color, 1.0);
    }
  `,
}

export function createColorGradingPass(): ShaderPass {
  return new ShaderPass(ColorGradingShader)
}
```

- [ ] **Step 3: Wire into SakuraApp composer**

In `client/src/sakura/SakuraApp.ts`, add import:

```typescript
import { createColorGradingPass } from './postprocessing/ColorGradingPass'
```

After the BokehPass (or UnrealBloomPass if Task 1 not done yet), add:

```typescript
    this.composer.addPass(createColorGradingPass())
```

- [ ] **Step 4: Typecheck + visual verify**

```bash
cd client && npx tsc --noEmit
```

Scene should look warmer, slightly more saturated, with dark vignette at edges.

- [ ] **Step 5: Commit**

```bash
cd /Users/marisancans/src/claude-live
git add client/src/sakura/postprocessing/ColorGradingPass.ts client/src/sakura/SakuraApp.ts
git commit -m "feat(sakura): add color grading — ACES tonemapping, split toning, vignette"
```

---

## Task 3: Film Grain

**Files:**
- Create: `client/src/sakura/postprocessing/FilmGrainPass.ts`
- Modify: `client/src/sakura/SakuraApp.ts`

- [ ] **Step 1: Create FilmGrainPass.ts**

Create `client/src/sakura/postprocessing/FilmGrainPass.ts`:

```typescript
import * as THREE from 'three'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'

const FilmGrainShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uIntensity: { value: 0.025 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uIntensity;
    varying vec2 vUv;

    float rand(vec2 co) {
      return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main() {
      vec3 color = texture2D(tDiffuse, vUv).rgb;
      float grain = rand(vUv * 800.0 + vec2(uTime * 100.0)) - 0.5;
      color += grain * uIntensity;
      gl_FragColor = vec4(color, 1.0);
    }
  `,
}

export function createFilmGrainPass(): ShaderPass {
  const pass = new ShaderPass(FilmGrainShader)
  return pass
}

/** Call this in the tick loop to animate the grain */
export function updateFilmGrain(pass: ShaderPass, elapsed: number) {
  pass.uniforms.uTime.value = elapsed
}
```

- [ ] **Step 2: Wire into SakuraApp**

In `client/src/sakura/SakuraApp.ts`, add import:

```typescript
import { createFilmGrainPass, updateFilmGrain } from './postprocessing/FilmGrainPass'
```

Add field to the class:

```typescript
  private filmGrainPass: ShaderPass
```

In constructor, after color grading pass:

```typescript
    this.filmGrainPass = createFilmGrainPass()
    this.composer.addPass(this.filmGrainPass)
```

In `tick()`, before `this.composer.render()`:

```typescript
    updateFilmGrain(this.filmGrainPass, this.elapsed)
```

Import `ShaderPass` type at top:

```typescript
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
```

- [ ] **Step 3: Typecheck + visual verify**

```bash
cd client && npx tsc --noEmit
```

Very subtle animated noise visible over the scene. Should NOT be obvious — barely perceptible.

- [ ] **Step 4: Commit**

```bash
cd /Users/marisancans/src/claude-live
git add client/src/sakura/postprocessing/FilmGrainPass.ts client/src/sakura/SakuraApp.ts
git commit -m "feat(sakura): add film grain — subtle animated noise overlay"
```

---

## Task 4: Petal Subsurface Scattering

**Files:**
- Modify: `client/src/sakura/PetalSystem.ts`

This is the most impactful material change. Replace `MeshStandardMaterial` with a custom `ShaderMaterial` that adds a subsurface scattering term — when petals are backlit, light glows through them in warm pink.

- [ ] **Step 1: Replace petal material in PetalSystem constructor**

In `client/src/sakura/PetalSystem.ts`, replace the material creation block:

Find:
```typescript
    this.material = new THREE.MeshStandardMaterial({
      map: petalMap,
      alphaMap: petalAlpha,
      alphaTest: 0.5,
      transparent: false,
      side: THREE.DoubleSide,
      roughness: 0.6,
      metalness: 0.0,
      emissive: new THREE.Color('#ffd0e8'),
      emissiveIntensity: 0.03,
      depthWrite: true,
    })
```

Replace with:
```typescript
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uMap: { value: petalMap },
        uAlphaMap: { value: petalAlpha },
        uLightDir: { value: new THREE.Vector3(-0.3, 0.8, 0.4).normalize() },
        uSSS: { value: 0.45 },
        uSSSColor: { value: new THREE.Color('#ff8aaa') },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vWorldNormal;
        varying vec3 vWorldPos;
        void main() {
          vUv = uv;
          vec4 world = modelMatrix * instanceMatrix * vec4(position, 1.0);
          vWorldPos = world.xyz;
          vWorldNormal = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * normal);
          gl_Position = projectionMatrix * viewMatrix * world;
        }
      `,
      fragmentShader: `
        uniform sampler2D uMap;
        uniform sampler2D uAlphaMap;
        uniform vec3 uLightDir;
        uniform float uSSS;
        uniform vec3 uSSSColor;
        varying vec2 vUv;
        varying vec3 vWorldNormal;
        varying vec3 vWorldPos;

        void main() {
          vec4 texColor = texture2D(uMap, vUv);
          float alpha = texture2D(uAlphaMap, vUv).r;
          if (alpha < 0.5) discard;

          vec3 norm = normalize(vWorldNormal);
          vec3 viewDir = normalize(cameraPosition - vWorldPos);

          // Diffuse — half-lambert for soft wrap
          float diffuse = max(dot(norm, uLightDir), 0.0) * 0.5 + 0.5;

          // Subsurface scattering — light passing through the petal
          float sss = max(dot(-norm, uLightDir), 0.0);
          sss = pow(sss, 1.5) * uSSS;

          // Fresnel rim
          float fresnel = pow(1.0 - max(dot(viewDir, norm), 0.0), 2.5) * 0.15;

          vec3 color = texColor.rgb * diffuse;
          color += uSSSColor * sss;
          color += vec3(1.0, 0.95, 0.98) * fresnel;

          gl_FragColor = vec4(color, 1.0);
        }
      `,
      side: THREE.DoubleSide,
      depthWrite: true,
      transparent: false,
    }) as any // InstancedMesh accepts Material
```

Also change the `material` field type from `THREE.MeshStandardMaterial` to `THREE.ShaderMaterial`:

```typescript
  private material: THREE.ShaderMaterial
```

And remove the `setColorAt` call in `allocateCluster` since custom ShaderMaterial doesn't use instance colors.

Find and remove:
```typescript
      this.mesh.setColorAt(idx, color)
```
and:
```typescript
    if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true
```

- [ ] **Step 2: Typecheck + visual verify**

```bash
cd client && npx tsc --noEmit
```

Petals should now glow warm pink when backlit by the key light. Rotating the camera should show petals catching light from behind with a soft translucent glow.

- [ ] **Step 3: Commit**

```bash
cd /Users/marisancans/src/claude-live
git add client/src/sakura/PetalSystem.ts
git commit -m "feat(sakura): petal subsurface scattering — translucent backlit glow"
```

---

## Task 5: Petal Vein Detail

**Files:**
- Modify: `client/src/sakura/PetalSystem.ts`

- [ ] **Step 1: Enhance the petal texture with veins**

In `client/src/sakura/PetalSystem.ts`, find the `createPetalTexture()` function. After the `ctx.fill()` call and before the existing vein stroke, replace the vein section:

Find:
```typescript
  // Subtle vein line down the center
  ctx.strokeStyle = 'rgba(255, 200, 215, 0.3)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(cx, cy * 0.3)
  ctx.lineTo(cx, cy * 1.5)
  ctx.stroke()
```

Replace with:
```typescript
  // Central vein
  ctx.strokeStyle = 'rgba(220, 170, 190, 0.35)'
  ctx.lineWidth = 1.2
  ctx.beginPath()
  ctx.moveTo(cx, cy * 0.25)
  ctx.quadraticCurveTo(cx + 1, cy, cx, cy * 1.55)
  ctx.stroke()

  // Side veins radiating from center
  ctx.strokeStyle = 'rgba(220, 170, 190, 0.2)'
  ctx.lineWidth = 0.7
  for (let i = 0; i < 4; i++) {
    const t = 0.3 + i * 0.15
    const y = cy * (0.4 + t * 1.1)
    const spread = 18 + i * 6
    // Left vein
    ctx.beginPath()
    ctx.moveTo(cx, y)
    ctx.quadraticCurveTo(cx - spread * 0.6, y - 4, cx - spread, y + 3)
    ctx.stroke()
    // Right vein
    ctx.beginPath()
    ctx.moveTo(cx, y)
    ctx.quadraticCurveTo(cx + spread * 0.6, y - 4, cx + spread, y + 3)
    ctx.stroke()
  }
```

- [ ] **Step 2: Typecheck + visual verify**

```bash
cd client && npx tsc --noEmit
```

Zoom in close to petals — you should see subtle vein lines radiating from the center.

- [ ] **Step 3: Commit**

```bash
cd /Users/marisancans/src/claude-live
git add client/src/sakura/PetalSystem.ts
git commit -m "feat(sakura): petal vein detail — central vein + radiating side veins"
```

---

## Task 6: Petal Shape Variety

**Files:**
- Modify: `client/src/sakura/PetalSystem.ts`

- [ ] **Step 1: Create 3 petal texture variants**

In `client/src/sakura/PetalSystem.ts`, rename `createPetalTexture()` to `createPetalTexture(variant: number)` and add shape variation based on the variant parameter.

Add at the top of `createPetalTexture`, after `const cy = size / 2`:

```typescript
  // Shape variation
  const widthMod = variant === 0 ? 1.0 : variant === 1 ? 0.75 : 1.2
  const heightMod = variant === 0 ? 1.0 : variant === 1 ? 1.15 : 0.85
  const notch = variant === 2 ? 4 : 0  // notched tip on variant 2
```

Replace the petal silhouette bezier curves:

```typescript
  ctx.beginPath()
  ctx.moveTo(cx, cy * 0.15 * heightMod)
  ctx.bezierCurveTo(cx + 42 * widthMod, cy * 0.3 * heightMod, cx + 48 * widthMod, cy * 1.1, cx + notch, cy * 1.75 * heightMod)
  if (notch > 0) {
    ctx.lineTo(cx, cy * 1.65 * heightMod)
    ctx.lineTo(cx - notch, cy * 1.75 * heightMod)
  }
  ctx.bezierCurveTo(cx - 48 * widthMod, cy * 1.1, cx - 42 * widthMod, cy * 0.3 * heightMod, cx, cy * 0.15 * heightMod)
  ctx.closePath()
```

Do the same for `createPetalAlpha(variant: number)` — same silhouette shape changes.

- [ ] **Step 2: Generate 3 texture pairs in constructor**

In the `PetalSystem` constructor, replace single texture creation with array:

```typescript
    const petalMaps: THREE.CanvasTexture[] = []
    const petalAlphas: THREE.CanvasTexture[] = []
    for (let v = 0; v < 3; v++) {
      petalMaps.push(createPetalTexture(v))
      petalAlphas.push(createPetalAlpha(v))
    }
```

Store them as class fields. In the shader, use `uMap` uniform — we'll set it per-cluster in `allocateCluster`. Since all instances share one material, we need a texture atlas approach. Simpler: create 3 separate InstancedMesh instances, one per variant, and round-robin petals across them.

Actually, the simplest approach: create 3 materials and randomly pick which material to use per petal. But InstancedMesh only supports one material. So create 3 InstancedMesh instances.

This is getting complex. Simpler path: bake all 3 variants into a single texture atlas (3 petals side by side) and shift UV per instance. But custom instanced UV offsets are also complex.

**Simplest viable approach:** Keep one InstancedMesh but vary the petal PlaneGeometry size per instance (already doing via scale in matrix). The shape is defined by the alpha texture. Create the 3 alpha variants and randomly pick which alpha map to draw into the SAME canvas at different scales. This way the single alpha texture has a varied edge profile.

Actually — the simplest approach that works: just randomize the petal silhouette parameters per-petal within the SAME texture. Since each petal is a full PlaneGeometry with its own instance matrix (scale/rotation), we get visual variety from:
- Random scale (already done: 0.8-1.5x)
- Random rotation (already done)
- Making the petal texture itself slightly asymmetric

Modify `createPetalTexture()` to add slight asymmetry to the existing single texture:

Replace the silhouette with a slightly asymmetric one:

```typescript
  ctx.beginPath()
  ctx.moveTo(cx, cy * 0.15)
  ctx.bezierCurveTo(cx + 44, cy * 0.28, cx + 50, cy * 1.05, cx + 2, cy * 1.75)
  ctx.bezierCurveTo(cx - 46, cy * 1.12, cx - 40, cy * 0.32, cx, cy * 0.15)
  ctx.closePath()
```

This makes it slightly lopsided (natural) without needing multiple textures.

- [ ] **Step 3: Typecheck + visual verify**

```bash
cd client && npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
cd /Users/marisancans/src/claude-live
git add client/src/sakura/PetalSystem.ts
git commit -m "feat(sakura): asymmetric petal shape for natural variety"
```

---

## Task 7: Bark Normal Map

**Files:**
- Modify: `client/src/sakura/BranchRenderer.ts`

- [ ] **Step 1: Generate bark normal map on canvas**

In `client/src/sakura/BranchRenderer.ts`, add a function before `makeBarkMaterial`:

```typescript
function createBarkNormalMap(): THREE.CanvasTexture {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  // Base flat normal (pointing Z in tangent space = rgb(128, 128, 255))
  ctx.fillStyle = 'rgb(128, 128, 255)'
  ctx.fillRect(0, 0, size, size)

  // Vertical grain grooves
  for (let x = 0; x < size; x += 3) {
    const depth = Math.sin(x * 0.8) * 20 + Math.sin(x * 2.1) * 8
    const r = Math.round(128 + depth)
    ctx.fillStyle = `rgb(${r}, 128, 240)`
    ctx.fillRect(x, 0, 1, size)
  }

  // Horizontal lenticels — bumps
  for (let i = 0; i < 12; i++) {
    const y = Math.random() * size
    const w = 30 + Math.random() * 60
    const h = 2 + Math.random() * 3
    const x = Math.random() * (size - w)
    ctx.fillStyle = 'rgb(128, 148, 255)'
    ctx.fillRect(x, y, w, h)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(2, 4)
  texture.needsUpdate = true
  return texture
}
```

- [ ] **Step 2: Apply normal map to bark material**

The bark material is a custom ShaderMaterial, so we can't just set `normalMap` like MeshStandardMaterial. Instead, pass the normal map as a uniform and sample it in the fragment shader.

In `makeBarkMaterial`, add uniform:
```typescript
      uNormalMap: { value: barkNormalMap },
      uNormalScale: { value: 0.3 },
```

Where `barkNormalMap` is created once and passed in. Add a module-level variable:

```typescript
let barkNormalMap: THREE.CanvasTexture | null = null
function getBarkNormalMap(): THREE.CanvasTexture {
  if (!barkNormalMap) barkNormalMap = createBarkNormalMap()
  return barkNormalMap
}
```

And in `makeBarkMaterial`:
```typescript
      uNormalMap: { value: getBarkNormalMap() },
      uNormalScale: { value: 0.3 },
```

- [ ] **Step 3: Update bark fragment shader to use normal map**

In `client/src/sakura/shaders/bark.frag.glsl`, add uniforms:

```glsl
uniform sampler2D uNormalMap;
uniform float uNormalScale;
```

In main(), after computing `norm`, perturb it with the normal map:

```glsl
  // Perturb normal with bark normal map
  vec3 mapNormal = texture2D(uNormalMap, vUv * vec2(2.0, 4.0)).rgb * 2.0 - 1.0;
  norm = normalize(norm + mapNormal * uNormalScale);
```

Replace the existing `vec3 viewDir` and `float fresnel` lines to use the perturbed normal:

```glsl
  float fresnel = pow(1.0 - max(dot(viewDir, norm), 0.0), 2.2);
```

- [ ] **Step 4: Typecheck + visual verify**

```bash
cd client && npx tsc --noEmit
```

Bark should have visible surface detail catching light at different micro-angles.

- [ ] **Step 5: Commit**

```bash
cd /Users/marisancans/src/claude-live
git add client/src/sakura/BranchRenderer.ts client/src/sakura/shaders/bark.frag.glsl
git commit -m "feat(sakura): bark normal map — surface detail catches light"
```

---

## Task 8: Soft Directional Shadows

**Files:**
- Modify: `client/src/sakura/SakuraApp.ts`

- [ ] **Step 1: Enable shadow mapping on renderer**

In the constructor, after `this.renderer.setClearColor('#0e0a08')`:

```typescript
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
```

- [ ] **Step 2: Configure the key DirectionalLight for shadow casting**

Find the key light:
```typescript
    const key = new THREE.DirectionalLight('#fff0e0', 0.8)
    key.position.set(-80, 160, 100)
    this.scene.add(key)
```

Replace with:
```typescript
    const key = new THREE.DirectionalLight('#fff0e0', 0.8)
    key.position.set(-80, 160, 100)
    key.castShadow = true
    key.shadow.mapSize.width = 1024
    key.shadow.mapSize.height = 1024
    key.shadow.camera.near = 10
    key.shadow.camera.far = 400
    key.shadow.camera.left = -120
    key.shadow.camera.right = 120
    key.shadow.camera.top = 120
    key.shadow.camera.bottom = -40
    key.shadow.bias = -0.002
    key.shadow.radius = 4
    this.scene.add(key)
```

- [ ] **Step 3: Enable shadow casting on branch meshes**

In `client/src/sakura/BranchRenderer.ts`, in `buildBranches()`, after creating each branch mesh:

Find `mesh.renderOrder = 2` and add after it:
```typescript
    mesh.castShadow = true
```

For junction meshes, find `mesh.renderOrder = 3` and add:
```typescript
    mesh.castShadow = true
```

- [ ] **Step 4: Enable shadow receiving on ground**

In `client/src/sakura/SakuraApp.ts`, find the ground mesh creation. The ground uses a custom ShaderMaterial which doesn't receive shadows by default. Replace the ground material to receive shadows:

After the ground mesh is created, add:
```typescript
    this.ground.receiveShadow = true
```

Note: custom ShaderMaterial won't show shadows. For shadows to appear, the ground needs `MeshStandardMaterial` or a shader that samples the shadow map. Simplest: change ground to MeshStandardMaterial:

Replace the ground creation block with:
```typescript
    this.ground = new THREE.Mesh(
      new THREE.CircleGeometry(800, 72),
      new THREE.MeshStandardMaterial({
        color: '#0f0a08',
        emissive: '#0a0705',
        emissiveIntensity: 0.3,
        roughness: 0.95,
        metalness: 0.0,
      }),
    )
    this.ground.rotation.x = -Math.PI / 2
    this.ground.position.y = -4
    this.ground.receiveShadow = true
```

- [ ] **Step 5: Typecheck + visual verify**

```bash
cd client && npx tsc --noEmit
```

The tree should cast soft shadows on the ground plane. Orbit to see shadow from different angles.

- [ ] **Step 6: Commit**

```bash
cd /Users/marisancans/src/claude-live
git add client/src/sakura/SakuraApp.ts client/src/sakura/BranchRenderer.ts
git commit -m "feat(sakura): soft directional shadows — PCFSoft, ground receives"
```

---

## Task 9: SSAO (Screen-Space Ambient Occlusion)

**Files:**
- Modify: `client/src/sakura/SakuraApp.ts`

- [ ] **Step 1: Add SSAOPass import**

```typescript
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass.js'
```

- [ ] **Step 2: Add SSAOPass to composer — BEFORE bloom**

The SSAO pass needs to go before bloom in the pipeline. Restructure the composer setup:

```typescript
    this.composer = new EffectComposer(this.renderer)
    this.composer.addPass(new RenderPass(this.scene, this.camera))

    const ssao = new SSAOPass(this.scene, this.camera, w, h)
    ssao.kernelRadius = 12
    ssao.minDistance = 0.001
    ssao.maxDistance = 0.15
    ssao.output = SSAOPass.OUTPUT.Default
    this.composer.addPass(ssao)

    this.composer.addPass(new UnrealBloomPass(new THREE.Vector2(w, h), 0.4, 0.3, 0.75))
    // ... then BokehPass, ColorGrading, FilmGrain
```

- [ ] **Step 3: Typecheck + visual verify**

```bash
cd client && npx tsc --noEmit
```

Soft dark contact shadows where branches meet and where petals cluster. Adds depth.

- [ ] **Step 4: Commit**

```bash
cd /Users/marisancans/src/claude-live
git add client/src/sakura/SakuraApp.ts
git commit -m "feat(sakura): SSAO — soft contact shadows at branch junctions"
```

---

## Task 10: God Rays (Volumetric Light)

**Files:**
- Create: `client/src/sakura/postprocessing/GodRaysPass.ts`
- Modify: `client/src/sakura/SakuraApp.ts`

- [ ] **Step 1: Create GodRaysPass.ts**

Create `client/src/sakura/postprocessing/GodRaysPass.ts`:

```typescript
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'

const GodRaysShader = {
  uniforms: {
    tDiffuse: { value: null },
    uLightPos: { value: [0.3, 0.8] },  // screen-space light position
    uExposure: { value: 0.18 },
    uDecay: { value: 0.96 },
    uDensity: { value: 0.8 },
    uWeight: { value: 0.12 },
    uSamples: { value: 60 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec2 uLightPos;
    uniform float uExposure;
    uniform float uDecay;
    uniform float uDensity;
    uniform float uWeight;
    uniform int uSamples;
    varying vec2 vUv;

    void main() {
      vec2 texCoord = vUv;
      vec2 deltaTexCoord = (texCoord - uLightPos) * (1.0 / float(uSamples)) * uDensity;
      vec3 color = texture2D(tDiffuse, texCoord).rgb;
      float illuminationDecay = 1.0;

      for (int i = 0; i < 60; i++) {
        texCoord -= deltaTexCoord;
        vec3 sample_ = texture2D(tDiffuse, texCoord).rgb;
        sample_ *= illuminationDecay * uWeight;
        color += sample_;
        illuminationDecay *= uDecay;
      }

      vec3 original = texture2D(tDiffuse, vUv).rgb;
      gl_FragColor = vec4(original + color * uExposure, 1.0);
    }
  `,
}

export function createGodRaysPass(): ShaderPass {
  return new ShaderPass(GodRaysShader)
}
```

- [ ] **Step 2: Wire into composer after bloom, before color grading**

In `client/src/sakura/SakuraApp.ts`:

```typescript
import { createGodRaysPass } from './postprocessing/GodRaysPass'
```

Add after bloom pass:
```typescript
    this.composer.addPass(createGodRaysPass())
```

- [ ] **Step 3: Typecheck + visual verify**

```bash
cd client && npx tsc --noEmit
```

Subtle light shafts radiating from the upper-left (key light direction). Should be very subtle — just enough to add atmosphere.

- [ ] **Step 4: Commit**

```bash
cd /Users/marisancans/src/claude-live
git add client/src/sakura/postprocessing/GodRaysPass.ts client/src/sakura/SakuraApp.ts
git commit -m "feat(sakura): god rays — subtle volumetric light shafts"
```

---

## Task 11: Chromatic Aberration

**Files:**
- Create: `client/src/sakura/postprocessing/ChromaticAberrationPass.ts`
- Modify: `client/src/sakura/SakuraApp.ts`

- [ ] **Step 1: Create ChromaticAberrationPass.ts**

Create `client/src/sakura/postprocessing/ChromaticAberrationPass.ts`:

```typescript
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'

const ChromaticAberrationShader = {
  uniforms: {
    tDiffuse: { value: null },
    uOffset: { value: 0.002 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float uOffset;
    varying vec2 vUv;

    void main() {
      vec2 dir = vUv - 0.5;
      float d = length(dir);
      float strength = d * d * uOffset;

      float r = texture2D(tDiffuse, vUv + dir * strength).r;
      float g = texture2D(tDiffuse, vUv).g;
      float b = texture2D(tDiffuse, vUv - dir * strength).b;

      gl_FragColor = vec4(r, g, b, 1.0);
    }
  `,
}

export function createChromaticAberrationPass(): ShaderPass {
  return new ShaderPass(ChromaticAberrationShader)
}
```

- [ ] **Step 2: Wire into composer — last pass before film grain**

```typescript
import { createChromaticAberrationPass } from './postprocessing/ChromaticAberrationPass'
```

Add before film grain pass:
```typescript
    this.composer.addPass(createChromaticAberrationPass())
```

- [ ] **Step 3: Typecheck + visual verify**

```bash
cd client && npx tsc --noEmit
```

Very subtle color fringing at screen edges. Should be barely noticeable — just adds photographic lens feel.

- [ ] **Step 4: Commit**

```bash
cd /Users/marisancans/src/claude-live
git add client/src/sakura/postprocessing/ChromaticAberrationPass.ts client/src/sakura/SakuraApp.ts
git commit -m "feat(sakura): chromatic aberration — subtle radial lens fringe"
```

---

## Task 12: Enhanced Atmosphere — Dust Motes + Fog Layers

**Files:**
- Modify: `client/src/sakura/SakuraApp.ts`

- [ ] **Step 1: Replace atmosphere particles with larger dust motes**

In `createAtmosphere()`, replace the current implementation:

```typescript
  private createAtmosphere() {
    // Large dust motes that catch the key light
    const count = 200
    const positions = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      const radius = 20 + Math.random() * 200
      const theta = Math.random() * Math.PI * 2
      const y = -5 + Math.random() * 140
      positions[i * 3] = Math.cos(theta) * radius
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = Math.sin(theta) * radius
      sizes[i] = 2.0 + Math.random() * 5.0
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    // Soft circle texture
    const c = document.createElement('canvas')
    c.width = 64; c.height = 64
    const ctx = c.getContext('2d')!
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 30)
    g.addColorStop(0, 'rgba(255,255,255,1)')
    g.addColorStop(0.3, 'rgba(255,255,255,0.5)')
    g.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 64, 64)
    const dustTex = new THREE.CanvasTexture(c)

    return new THREE.Points(geometry, new THREE.PointsMaterial({
      map: dustTex,
      color: '#ffe8d0',
      transparent: true,
      opacity: 0.25,
      size: 4,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }))
  }
```

- [ ] **Step 2: Add horizontal fog layers for depth**

After the atmosphere creation in the constructor, add fog layer planes:

```typescript
    // Horizontal fog layers at different heights for painterly depth
    for (let i = 0; i < 3; i++) {
      const y = -2 + i * 30
      const fogMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color('#1a1015'),
        transparent: true,
        opacity: 0.04 - i * 0.01,
        depthWrite: false,
        side: THREE.DoubleSide,
      })
      const fogPlane = new THREE.Mesh(new THREE.PlaneGeometry(600, 600), fogMat)
      fogPlane.rotation.x = -Math.PI / 2
      fogPlane.position.y = y
      this.scene.add(fogPlane)
    }
```

- [ ] **Step 3: Typecheck + visual verify**

```bash
cd client && npx tsc --noEmit
```

Larger, brighter dust motes floating in the air. Subtle horizontal fog bands add depth layering.

- [ ] **Step 4: Commit**

```bash
cd /Users/marisancans/src/claude-live
git add client/src/sakura/SakuraApp.ts
git commit -m "feat(sakura): dust motes + fog layers — enhanced atmosphere"
```

---

## Composer Pipeline Order (Final)

After all tasks, the EffectComposer pipeline should be:

1. `RenderPass` — base scene
2. `SSAOPass` — contact shadows
3. `UnrealBloomPass` — soft glow
4. `BokehPass` — depth of field
5. `GodRaysPass` — light shafts
6. `ChromaticAberrationPass` — lens effect
7. `ColorGradingPass` — tonemapping + toning + vignette
8. `FilmGrainPass` — animated noise

---

## Implementation Order

| Task | What | Depends On | Impact |
|------|------|------------|--------|
| 1 | Depth of Field | Nothing | Very High |
| 2 | Color Grading | Nothing | Very High |
| 3 | Film Grain | Nothing | Medium |
| 4 | Petal SSS | Nothing | Very High |
| 5 | Petal Veins | Task 4 | Low |
| 6 | Petal Variety | Task 5 | Low |
| 7 | Bark Normal Map | Nothing | Medium |
| 8 | Soft Shadows | Nothing | High |
| 9 | SSAO | Nothing | Medium |
| 10 | God Rays | Nothing | Medium |
| 11 | Chromatic Aberration | Nothing | Low |
| 12 | Dust Motes + Fog | Nothing | Medium |

Tasks 1-4, 7-12 are independent. Tasks 5-6 depend on Task 4's material changes. Most impactful: Tasks 1, 2, 4, 8 — these 4 alone transform the scene.
