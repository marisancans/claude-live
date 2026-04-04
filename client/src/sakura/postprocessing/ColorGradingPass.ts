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
