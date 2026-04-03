uniform float uTime;
uniform float uHeat;
uniform float uPulse;
uniform float uFlowOffset;
uniform float uWindStrength;
uniform float uWindPhase;
uniform float uSignalPos;
uniform float uSignalIntensity;

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
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = m * p;
    a *= 0.52;
  }
  return v;
}

void main() {
  vUv = uv;

  // Breathing — subtle radial pulse
  float breathe = sin(uTime * 0.18 + uFlowOffset * 3.0) * (0.005 + uHeat * 0.008);

  // Wind sway — twigs bend, trunk barely moves
  float windSway = sin(uTime * 1.4 + uWindPhase + position.y * 0.06) * uWindStrength * 0.12;
  float windCross = cos(uTime * 0.9 + uWindPhase * 1.3 + position.y * 0.04) * uWindStrength * 0.06;

  // Signal bulge — geometry swells where signal passes
  float signalDist = abs(uv.x - uSignalPos);
  float signalBulge = smoothstep(0.12, 0.0, signalDist) * uSignalIntensity * 0.08;

  // Surface noise — organic irregularity
  float surfaceNoise = (fbm(vec2(uv.x * 2.5 + uFlowOffset * 4.0, uv.y * 5.0 - uTime * 0.04)) - 0.5) * 0.015;

  vec3 displaced = position + normal * (breathe + surfaceNoise + signalBulge);
  displaced.x += windSway;
  displaced.z += windCross;

  vec4 world = modelMatrix * vec4(displaced, 1.0);
  vWorldPos = world.xyz;
  vWorldNormal = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * world;
}
