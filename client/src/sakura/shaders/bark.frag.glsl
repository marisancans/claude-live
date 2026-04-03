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
  float fresnel = pow(1.0 - max(dot(viewDir, normalize(vWorldNormal)), 0.0), 2.2);

  // Bark texturing
  float grain = 0.5 + 0.5 * sin(vUv.x * 22.0 + vUv.y * 38.0 - uTime * 0.2);
  float ridge = pow(0.5 + 0.5 * cos(vUv.y * 6.2831), 2.0);
  float barkNoise = fbm(vec2(vUv.x * 3.2 + uFlowOffset * 3.5, vUv.y * 4.8));
  float knots = smoothstep(0.62, 0.65, fbm(vec2(vUv.x * 1.8 + uFlowOffset * 7.0, vUv.y * 2.2 + uFlowOffset * 3.0)));

  // Depth-based bark palette
  vec3 trunkDark = vec3(0.23, 0.17, 0.12);    // gray-brown trunk
  vec3 trunkMid = vec3(0.32, 0.24, 0.18);
  vec3 limbMid = vec3(0.36, 0.23, 0.13);      // warm mid
  vec3 limbHighlight = vec3(0.55, 0.39, 0.26);
  vec3 twigColor = vec3(0.48, 0.29, 0.19);    // reddish twigs

  float depthBlend = clamp(uDepth / 5.0, 0.0, 1.0);
  vec3 barkDark = mix(trunkDark, vec3(0.20, 0.12, 0.08), depthBlend);
  vec3 barkMid = mix(trunkMid, limbMid, depthBlend);
  vec3 barkHighlight = mix(limbHighlight, twigColor, depthBlend);

  vec3 color = mix(barkDark, barkMid, clamp(grain * 0.4 + barkNoise * 0.45 + uHeat * 0.12, 0.0, 1.0));
  color = mix(color, barkHighlight, ridge * 0.14 + barkNoise * 0.1);
  color = mix(color, barkDark * 0.6, knots * 0.7);

  // Fresnel rim light
  color += vec3(0.18, 0.12, 0.08) * fresnel * 0.35;

  // Ridge highlights
  color += vec3(0.06, 0.04, 0.03) * ridge * (0.2 + uHeat * 0.2);

  // Pulse glow from events
  float flow = 0.5 + 0.5 * sin(vUv.x * 18.0 - uTime * 2.8 - uFlowOffset * 8.0);
  color += uPulseColor * (0.06 + flow * 0.18 + ridge * 0.1) * uPulse;

  // Signal glow — smooth band at signal position
  float signalDist = abs(vUv.x - uSignalPos);
  float signalGlow = smoothstep(0.1, 0.0, signalDist) * uSignalIntensity;
  color += uSignalColor * signalGlow * 0.6;

  // Contamination / blight overlay
  vec3 blightColor = vec3(0.85, 0.25, 0.35);
  color = mix(color, blightColor, uContam * 0.3);

  gl_FragColor = vec4(color, 1.0);
}
