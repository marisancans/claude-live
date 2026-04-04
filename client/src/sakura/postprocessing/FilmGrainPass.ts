import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'

const FilmGrainShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uIntensity: { value: 0.025 },
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
    uniform float uTime;
    uniform float uIntensity;
    varying vec2 vUv;

    float rand(vec2 co) {
      return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main() {
      vec3 color = texture2D(tDiffuse, vUv).rgb;
      float grain = rand(vUv * 800.0 + vec2(uTime * 100.0)) - 0.5;
      color += grain * uIntensity;
      gl_FragColor = vec4(color, 1.0);
    }
  `,
}

export function createFilmGrainPass(): ShaderPass {
  const pass = new ShaderPass(FilmGrainShader)
  return pass
}

/** Call this in the tick loop to animate the grain */
export function updateFilmGrain(pass: ShaderPass, elapsed: number) {
  pass.uniforms.uTime.value = elapsed
}
