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
