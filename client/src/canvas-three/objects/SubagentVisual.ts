import * as THREE from 'three'

// Flat shading geometry needs non-indexed buffer to calculate normals correctly per face
const LOW_DENSITY_FLAT_GEO = new THREE.IcosahedronGeometry(3.5, 32).toNonIndexed()

export class SubagentVisual {
  group: THREE.Group
  meshref: THREE.Mesh
  mat: THREE.ShaderMaterial
  private activity = 0
  
  // Orbit logic
  private orbitRadius: number
  private orbitSpeed: number
  private orbitAngle: number

  constructor() {
    this.group = new THREE.Group()
    
    // Randomize initial orbit distance and speed
    this.orbitRadius = 18 + Math.random() * 12
    this.orbitSpeed = 0.4 + Math.random() * 0.4
    this.orbitAngle = Math.random() * Math.PI * 2

    this.mat = new THREE.ShaderMaterial({
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

    this.meshref = new THREE.Mesh(LOW_DENSITY_FLAT_GEO, this.mat)
    // Scale down to be smaller than the main SessionCore
    this.meshref.scale.setScalar(0.7)
    this.group.add(this.meshref)
  }

  triggerActivity() {
    this.activity = 1.0
  }

  tick(dt: number, elapsed: number) {
    this.activity = Math.max(0, this.activity - dt * 2.0)
    this.mat.uniforms.uTime.value = elapsed
    this.mat.uniforms.uActivity.value = this.activity

    // Orbit around Y axis
    this.orbitAngle += dt * this.orbitSpeed * (1.0 + this.activity)
    
    this.meshref.position.set(
      Math.cos(this.orbitAngle) * this.orbitRadius,
      Math.sin(elapsed * 1.5 + this.orbitAngle) * 3.0, // Bob up and down
      Math.sin(this.orbitAngle) * this.orbitRadius
    )
    
    // Intrinsic rotation
    this.meshref.rotation.x = elapsed * 0.4
    this.meshref.rotation.y = elapsed * 0.6
  }

  dispose() {
    this.mat.dispose()
  }
}
