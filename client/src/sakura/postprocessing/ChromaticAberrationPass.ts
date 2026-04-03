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
