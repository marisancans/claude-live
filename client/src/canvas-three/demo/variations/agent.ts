import * as THREE from 'three'

export interface AgentVariation {
  name: string
  description: string
  build: (group: THREE.Group) => AgentVisual
}

export interface AgentVisual {
  tick: (dt: number, elapsed: number) => void
  dispose: () => void
  pulse?: () => void
}

const HIGH_DENSITY_GEO = new THREE.IcosahedronGeometry(3.5, 128)
// Flat shading geometry needs non-indexed buffer to calculate normals correctly per face
const LOW_DENSITY_FLAT_GEO = new THREE.IcosahedronGeometry(3.5, 32).toNonIndexed()

// ════════════════════════════════════════════════════════════════════════════════
// 1. SMOOTH VOID (Rolling Liquid)
// ════════════════════════════════════════════════════════════════════════════════
function buildSmoothVoid(parent: THREE.Group): AgentVisual {
  const group = new THREE.Group()
  parent.add(group)
  
  const mat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uActivity: { value: 0 } },
    vertexShader: `
      uniform float uTime; uniform float uActivity;
      varying vec3 vWorldPos;
      
      float getWarp(vec3 p) {
        // Classic smooth, large rolling waves
        return sin(p.x*2.0 - uTime) * sin(p.y*3.0 - uTime*0.8) * cos(p.z*2.0 + uTime) * 1.5;
      }
      void main() {
        vec3 pos = position + normal * getWarp(position) * (0.6 + uActivity);
        vec4 wPos = modelMatrix * vec4(pos, 1.0);
        vWorldPos = wPos.xyz;
        gl_Position = projectionMatrix * viewMatrix * wPos;
      }
    `,
    fragmentShader: `
      uniform float uActivity;
      varying vec3 vWorldPos;
      void main() {
        vec3 n = normalize(cross(dFdx(vWorldPos), dFdy(vWorldPos)));
        vec3 v = normalize(cameraPosition - vWorldPos);
        float fresnel = 1.0 - max(dot(v, n), 0.0);
        
        vec3 base = mix(vec3(0.01, 0.02, 0.05), vec3(0.05, 0.01, 0.05), fract(vWorldPos.y * 0.15));
        vec3 col = base + pow(fresnel, 4.0) * vec3(0.1, 0.4, 0.8) * (1.0 + uActivity);
        
        gl_FragColor = vec4(col, min(1.0, 0.3 + pow(fresnel, 4.0) * 0.5));
      }
    `,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide
  })

  group.add(new THREE.Mesh(HIGH_DENSITY_GEO, mat))
  let activity = 0
  return {
    tick(dt, elapsed) { activity = Math.max(0, activity - dt * 2.0); mat.uniforms.uTime.value = elapsed; mat.uniforms.uActivity.value = activity },
    pulse() { activity = 1.0 },
    dispose() { parent.remove(group); mat.dispose() }
  }
}

// ════════════════════════════════════════════════════════════════════════════════
// 2. JAGGED CRYSTAL (Angular Spikes & Flat Shading)
// ════════════════════════════════════════════════════════════════════════════════
function buildJaggedCrystal(parent: THREE.Group): AgentVisual {
  const group = new THREE.Group()
  parent.add(group)
  
  const mat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uActivity: { value: 0 } },
    vertexShader: `
      uniform float uTime; uniform float uActivity;
      varying vec3 vWorldPos;
      
      float getWarp(vec3 p) {
        // Absolute sine waves create sharp folds and spikes instead of smooth curves
        float n1 = 1.0 - abs(sin(p.x * 3.0 + uTime));
        float n2 = 1.0 - abs(cos(p.y * 4.0 - uTime * 1.5));
        float n3 = 1.0 - abs(sin(p.z * 5.0 + uTime * 0.5));
        return pow(n1 * n2 * n3, 2.0) * 3.0; // Pushed out aggressively
      }
      void main() {
        vec3 pos = position + normal * getWarp(position) * (0.8 + uActivity);
        vec4 wPos = modelMatrix * vec4(pos, 1.0);
        vWorldPos = wPos.xyz;
        gl_Position = projectionMatrix * viewMatrix * wPos;
      }
    `,
    fragmentShader: `
      uniform float uActivity;
      varying vec3 vWorldPos;
      void main() {
        // Flat shading calculation (inherent to dFdx/dFdy on non-indexed geometry)
        vec3 n = normalize(cross(dFdx(vWorldPos), dFdy(vWorldPos)));
        vec3 v = normalize(cameraPosition - vWorldPos);
        float fresnel = 1.0 - max(dot(v, n), 0.0);
        
        vec3 col = vec3(0.01, 0.05, 0.05); // Deep green/cyan base
        col += pow(fresnel, 2.0) * vec3(0.1, 0.8, 0.4) * (1.0 + uActivity); // Harsher glow on flat edges
        
        gl_FragColor = vec4(col, min(1.0, 0.4 + pow(fresnel, 2.0) * 0.6));
      }
    `,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide
  })

  // We use the flat-shaded non-indexed geometry to get hard crystal facets!
  group.add(new THREE.Mesh(LOW_DENSITY_FLAT_GEO, mat))
  let activity = 0
  return {
    tick(dt, elapsed) { activity = Math.max(0, activity - dt * 2.0); mat.uniforms.uTime.value = elapsed; mat.uniforms.uActivity.value = activity },
    pulse() { activity = 1.0 },
    dispose() { parent.remove(group); mat.dispose() }
  }
}

// ════════════════════════════════════════════════════════════════════════════════
// 3. CONCENTRIC DROPLET (Radial surface ripples)
// ════════════════════════════════════════════════════════════════════════════════
function buildConcentricDroplet(parent: THREE.Group): AgentVisual {
  const group = new THREE.Group()
  parent.add(group)
  
  const mat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uActivity: { value: 0 } },
    vertexShader: `
      uniform float uTime; uniform float uActivity;
      varying vec3 vWorldPos;
      
      float getWarp(vec3 p) {
        // Ripple strictly outward from the center poles based on Y
        float radius = length(p.xz);
        // Add a vertical sweeping element so it looks like a drop hitting water
        return sin(radius * 15.0 - uTime * 6.0) * cos(p.y * 3.0 + uTime) * 0.5;
      }
      void main() {
        // Displace the sphere entirely radially
        vec3 pos = position + normal * getWarp(position) * (1.0 + uActivity * 2.0);
        vec4 wPos = modelMatrix * vec4(pos, 1.0);
        vWorldPos = wPos.xyz;
        gl_Position = projectionMatrix * viewMatrix * wPos;
      }
    `,
    fragmentShader: `
      uniform float uActivity;
      varying vec3 vWorldPos;
      void main() {
        vec3 n = normalize(cross(dFdx(vWorldPos), dFdy(vWorldPos)));
        vec3 v = normalize(cameraPosition - vWorldPos);
        float fresnel = 1.0 - max(dot(v, n), 0.0);
        
        vec3 col = vec3(0.01, 0.01, 0.08); // Indigo
        col += pow(fresnel, 5.0) * vec3(0.5, 0.1, 1.0) * (1.0 + uActivity);
        
        gl_FragColor = vec4(col, min(1.0, 0.2 + pow(fresnel, 5.0) * 0.8));
      }
    `,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide
  })

  group.add(new THREE.Mesh(HIGH_DENSITY_GEO, mat))
  let activity = 0
  return {
    tick(dt, elapsed) { activity = Math.max(0, activity - dt * 2.0); mat.uniforms.uTime.value = elapsed; mat.uniforms.uActivity.value = activity },
    pulse() { activity = 1.0 },
    dispose() { parent.remove(group); mat.dispose() }
  }
}

// ════════════════════════════════════════════════════════════════════════════════
// 4. VOXEL GLITCH GLASS (Stepped/Quantized Displacement)
// ════════════════════════════════════════════════════════════════════════════════
function buildVoxelGlitchGlass(parent: THREE.Group): AgentVisual {
  const group = new THREE.Group()
  parent.add(group)
  
  const mat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uActivity: { value: 0 } },
    vertexShader: `
      uniform float uTime; uniform float uActivity;
      varying vec3 vWorldPos;
      
      float getWarp(vec3 p) {
        // Floor the position to calculate the wave, tearing the geometry into blocks
        vec3 stepP = floor(p * 3.0) / 3.0; // Quantize the space
        float n = sin(stepP.x*5.0 - uTime) * cos(stepP.y*5.0) * sin(stepP.z*5.0 + uTime);
        return n * 1.5;
      }
      void main() {
        vec3 pos = position + normal * getWarp(position) * (0.8 + uActivity * 2.0);
        vec4 wPos = modelMatrix * vec4(pos, 1.0);
        vWorldPos = wPos.xyz;
        gl_Position = projectionMatrix * viewMatrix * wPos;
      }
    `,
    fragmentShader: `
      uniform float uActivity;
      varying vec3 vWorldPos;
      void main() {
        vec3 n = normalize(cross(dFdx(vWorldPos), dFdy(vWorldPos)));
        vec3 v = normalize(cameraPosition - vWorldPos);
        float fresnel = 1.0 - max(dot(v, n), 0.0);
        
        vec3 col = vec3(0.05, 0.01, 0.01); // Deep crimson base
        col += pow(fresnel, 2.0) * vec3(1.0, 0.2, 0.2) * (1.0 + uActivity);
        
        gl_FragColor = vec4(col, min(1.0, 0.5 + pow(fresnel, 2.0) * 0.5));
      }
    `,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide
  })

  const mesh = new THREE.Mesh(LOW_DENSITY_FLAT_GEO, mat)
  group.add(mesh)
  let activity = 0
  return {
    tick(dt, elapsed) { activity = Math.max(0, activity - dt * 2.0); mat.uniforms.uTime.value = elapsed; mat.uniforms.uActivity.value = activity },
    pulse() { activity = 1.0 },
    dispose() { parent.remove(group); mat.dispose() }
  }
}

// ════════════════════════════════════════════════════════════════════════════════
// 5. MICRO-FUZZ INTERFERENCE (High Frequency)
// ════════════════════════════════════════════════════════════════════════════════
function buildMicroFuzz(parent: THREE.Group): AgentVisual {
  const group = new THREE.Group()
  parent.add(group)
  
  const mat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uActivity: { value: 0 } },
    vertexShader: `
      uniform float uTime; uniform float uActivity;
      varying vec3 vWorldPos;
      
      float getWarp(vec3 p) {
        // Obscenely high frequency sine waves create mathematical noise, vibrating the mesh
        float n = sin(p.x * 40.0 + uTime * 10.0) * sin(p.y * 40.0 - uTime * 5.0) * sin(p.z * 40.0 + uTime * 8.0);
        return n * 0.25; // Keep amplitude low so it looks like fuzz, not explosions
      }
      void main() {
        vec3 pos = position + normal * getWarp(position) * (1.0 + uActivity * 3.0);
        vec4 wPos = modelMatrix * vec4(pos, 1.0);
        vWorldPos = wPos.xyz;
        gl_Position = projectionMatrix * viewMatrix * wPos;
      }
    `,
    fragmentShader: `
      uniform float uActivity;
      varying vec3 vWorldPos;
      void main() {
        vec3 n = normalize(cross(dFdx(vWorldPos), dFdy(vWorldPos)));
        vec3 v = normalize(cameraPosition - vWorldPos);
        float fresnel = 1.0 - max(dot(v, n), 0.0);
        
        vec3 col = vec3(0.01, 0.01, 0.01); // Basically black hole
        // The high frequency normals make the fresnel scatter like crazy!
        col += pow(fresnel, 3.0) * vec3(0.8, 0.8, 1.0) * (1.0 + uActivity);
        
        gl_FragColor = vec4(col, min(1.0, 0.6 + pow(fresnel, 3.0) * 0.4));
      }
    `,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide
  })

  group.add(new THREE.Mesh(HIGH_DENSITY_GEO, mat))
  let activity = 0
  return {
    tick(dt, elapsed) { activity = Math.max(0, activity - dt * 2.0); mat.uniforms.uTime.value = elapsed; mat.uniforms.uActivity.value = activity },
    pulse() { activity = 1.0 },
    dispose() { parent.remove(group); mat.dispose() }
  }
}

export const AGENT_VARIATIONS: AgentVariation[] = [
  { name: 'Smooth Void', description: 'Deep dark rolling liquid displacement (The tuned baseline model).', build: buildSmoothVoid },
  { name: 'Jagged Crystal', description: 'Changes displacement to absolute mathematics and uses flat-shading to create sharp, tearing crystal spikes.', build: buildJaggedCrystal },
  { name: 'Concentric Droplet', description: 'Symmetrical ripples flow outward radially from the center like a drop of liquid suspended in time.', build: buildConcentricDroplet },
  { name: 'Voxel Glitch Glass', description: 'Forces the displacement math to snap to blocks (quantization), tearing the glass into digital cubes.', build: buildVoxelGlitchGlass },
  { name: 'Micro-Fuzz', description: 'Uses an obscenely high frequency wave to vibrate the vertices microscopically, causing intense light scattering.', build: buildMicroFuzz }
]
