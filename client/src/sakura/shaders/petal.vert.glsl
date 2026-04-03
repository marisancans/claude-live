uniform float uTime;
uniform float uWindStrength;
uniform float uWindDirX;
uniform float uWindDirZ;
uniform float uPulseGlobal;

attribute vec3 aAnchorPos;
attribute vec3 aAnchorDir;
attribute float aPhase;
attribute float aState;
attribute float aWilt;
attribute vec3 aColor;

varying vec3 vColor;
varying float vWilt;
varying vec3 vWorldNormal;
varying vec3 vWorldPos;

void main() {
  vColor = aColor;
  vWilt = aWilt;

  vec3 pos = position;

  if (aState < 0.5) {
    // Anchored — sway around anchor position
    float swayX = sin(uTime * 1.4 + aPhase * 6.28) * uWindStrength * 0.3;
    float swayZ = cos(uTime * 0.9 + aPhase * 4.71) * uWindStrength * 0.2;
    float swayY = sin(uTime * 2.1 + aPhase * 3.14) * uWindStrength * 0.08;

    // Pulse expansion from events
    float pulseScale = 1.0 + uPulseGlobal * 0.2;

    pos = pos * pulseScale;

    // Apply anchor transform
    vec3 worldPos = aAnchorPos + pos;
    worldPos.x += swayX;
    worldPos.y += swayY;
    worldPos.z += swayZ;

    // Wilt curl — bends petal inward
    worldPos.y -= aWilt * 0.3;

    vec4 mvPos = modelViewMatrix * vec4(worldPos, 1.0);
    vWorldPos = (modelMatrix * vec4(worldPos, 1.0)).xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * mvPos;
  } else {
    // Falling — position comes from instance matrix, shader just applies tumble
    vec4 mvPos = modelViewMatrix * instanceMatrix * vec4(pos, 1.0);
    vWorldPos = (modelMatrix * instanceMatrix * vec4(pos, 1.0)).xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * normal);
    gl_Position = projectionMatrix * mvPos;
  }
}
