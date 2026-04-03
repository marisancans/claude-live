uniform float uTime;
uniform float uHeat;
uniform float uPulse;
uniform float uContam;
uniform vec3 uPulseColor;
uniform float uFlowOffset;
uniform float uSignalPos;
uniform float uSignalIntensity;
uniform vec3 uSignalColor;
uniform float uDepth;

varying vec2 vUv;
varying vec3 vWorldPos;
varying vec3 vWorldNormal;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = m * p;
    a *= 0.52;
  }
  return v;
}

void main() {
  vec3 viewDir = normalize(cameraPosition - vWorldPos);
  vec3 norm = normalize(vWorldNormal);
  float fresnel = pow(1.0 - max(dot(viewDir, norm), 0.0), 2.2);

  // --- Cherry bark texture layers ---

  // Vertical grain — dominant on trunk, finer on twigs
  float grainScale = mix(18.0, 40.0, clamp(uDepth / 4.0, 0.0, 1.0));
  float grain = 0.5 + 0.5 * sin(vUv.x * grainScale + vUv.y * grainScale * 1.7 - uTime * 0.15);

  // Horizontal lenticels — characteristic cherry bark feature (stronger on trunk)
  float lenticelFreq = mix(8.0, 20.0, clamp(uDepth / 5.0, 0.0, 1.0));
  float lenticels = smoothstep(0.55, 0.6, sin(vUv.x * lenticelFreq + noise(vUv * 6.0) * 1.5));
  lenticels *= (1.0 - clamp(uDepth / 3.0, 0.0, 0.8)); // fade on twigs

  // Ridge pattern
  float ridge = pow(0.5 + 0.5 * cos(vUv.y * 6.2831), 2.0);

  // FBM bark noise — coarser on trunk, finer on twigs
  float noiseScale = mix(2.8, 5.5, clamp(uDepth / 4.0, 0.0, 1.0));
  float barkNoise = fbm(vec2(vUv.x * noiseScale + uFlowOffset * 3.5, vUv.y * noiseScale * 1.5));

  // Knots — only on trunk/limbs
  float knots = smoothstep(0.62, 0.66, fbm(vec2(vUv.x * 1.5 + uFlowOffset * 7.0, vUv.y * 2.0 + uFlowOffset * 3.0)));
  knots *= (1.0 - clamp(uDepth / 2.5, 0.0, 1.0));

  // Ambient occlusion from crevices
  float ao = 1.0 - barkNoise * 0.2 - knots * 0.3;

  // --- Depth-based cherry bark palette ---
  // Cherry bark: silvery gray-brown on trunk, warmer reddish-brown on branches
  float depthBlend = clamp(uDepth / 5.0, 0.0, 1.0);

  vec3 barkDark = mix(vec3(0.18, 0.14, 0.11), vec3(0.16, 0.10, 0.07), depthBlend);
  vec3 barkMid = mix(vec3(0.30, 0.24, 0.20), vec3(0.38, 0.24, 0.16), depthBlend);
  vec3 barkLight = mix(vec3(0.42, 0.35, 0.30), vec3(0.52, 0.34, 0.22), depthBlend);

  // Base color mix
  vec3 color = mix(barkDark, barkMid, clamp(grain * 0.35 + barkNoise * 0.5 + uHeat * 0.1, 0.0, 1.0));
  color = mix(color, barkLight, ridge * 0.15 + barkNoise * 0.12);

  // Knot darkening
  color = mix(color, barkDark * 0.5, knots * 0.7);

  // Lenticels — lighter horizontal streaks (cherry bark signature)
  color = mix(color, barkLight * 1.2, lenticels * 0.35);

  // Green-gray moss/lichen hint on sheltered parts (lower UV, deeper branches)
  float mossMask = smoothstep(0.3, 0.0, vUv.y) * smoothstep(1.0, 3.0, uDepth) * barkNoise;
  vec3 mossColor = vec3(0.15, 0.18, 0.12);
  color = mix(color, mossColor, mossMask * 0.2);

  // Apply AO
  color *= ao;

  // --- Lighting ---

  // Diffuse from a key light direction
  vec3 lightDir = normalize(vec3(-0.3, 0.8, 0.4));
  float diffuse = max(dot(norm, lightDir), 0.0) * 0.4 + 0.6; // half-lambert
  color *= diffuse;

  // Fresnel rim highlight — warm edge light
  color += vec3(0.22, 0.15, 0.10) * fresnel * 0.4;

  // Ridge specular hint
  color += vec3(0.08, 0.06, 0.04) * ridge * (0.15 + uHeat * 0.15);

  // --- Event effects ---

  // Pulse glow
  float flow = 0.5 + 0.5 * sin(vUv.x * 18.0 - uTime * 2.8 - uFlowOffset * 8.0);
  color += uPulseColor * (0.06 + flow * 0.18 + ridge * 0.1) * uPulse;

  // Signal glow
  float signalDist = abs(vUv.x - uSignalPos);
  float signalGlow = smoothstep(0.1, 0.0, signalDist) * uSignalIntensity;
  color += uSignalColor * signalGlow * 0.6;

  // Contamination blight
  vec3 blightColor = vec3(0.85, 0.25, 0.35);
  color = mix(color, blightColor, uContam * 0.3);

  gl_FragColor = vec4(color, 1.0);
}
