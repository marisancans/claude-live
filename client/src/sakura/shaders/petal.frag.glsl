uniform float uTime;

varying vec3 vColor;
varying float vWilt;
varying vec3 vWorldNormal;
varying vec3 vWorldPos;

void main() {
  vec3 viewDir = normalize(cameraPosition - vWorldPos);
  vec3 norm = normalize(vWorldNormal);

  // Soft diffuse lighting
  vec3 lightDir = normalize(vec3(0.3, 1.0, 0.2));
  float diffuse = max(dot(norm, lightDir), 0.0) * 0.5 + 0.5;

  // Translucency — light passing through petal
  float backlight = max(dot(-norm, lightDir), 0.0) * 0.3;

  // Fresnel for soft rim
  float fresnel = pow(1.0 - max(dot(viewDir, norm), 0.0), 2.0) * 0.2;

  vec3 color = vColor * (diffuse + backlight) + vec3(1.0, 0.9, 0.95) * fresnel;

  // Wilt darkening
  color = mix(color, color * 0.6, vWilt * 0.5);

  // Slight time-based shimmer
  float shimmer = 0.98 + 0.02 * sin(uTime * 2.0 + vWorldPos.x * 3.0 + vWorldPos.z * 2.0);
  color *= shimmer;

  gl_FragColor = vec4(color, 1.0);
}
