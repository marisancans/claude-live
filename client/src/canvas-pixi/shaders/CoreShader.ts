import { Filter, GlProgram, UniformGroup } from 'pixi.js'

const vertex = `
in vec2 aPosition;
out vec2 vTextureCoord;

uniform vec4 uInputSize;
uniform vec4 uOutputFrame;
uniform vec4 uOutputTexture;

vec4 filterVertexPosition(void)
{
    vec2 position = aPosition * uOutputFrame.zw + uOutputFrame.xy;
    position.x = position.x * (2.0 / uOutputTexture.x) - 1.0;
    position.y = position.y * (2.0 * uOutputTexture.z / uOutputTexture.y) - uOutputTexture.z;
    return vec4(position, 0.0, 1.0);
}

vec2 filterTextureCoord(void)
{
    return aPosition * (uOutputFrame.zw * uInputSize.zw);
}

void main(void)
{
    gl_Position = filterVertexPosition();
    vTextureCoord = filterTextureCoord();
}
`

/**
 * Sci-fi fusion reactor core.
 * No shadow, no planet — pure contained energy that reacts to events.
 * Features: plasma noise, containment ring pulses, energy tendrils,
 * event-driven flare bursts, and a superheated white-hot center.
 */
const fragment = `
in vec2 vTextureCoord;
out vec4 finalColor;

uniform sampler2D uTexture;
uniform float uTime;
uniform float uActivity;
uniform float uSeed;
uniform vec3 uColorBase;
uniform vec3 uColorBright;
uniform vec4 uInputSize;

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
        mix(hash(i), hash(i + vec2(1, 0)), f.x),
        mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x),
        f.y
    );
}

float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) {
        v += a * noise(p);
        p = p * 2.07 + vec2(0.1, -0.2);
        a *= 0.47;
    }
    return v;
}

void main() {
    vec4 texColor = texture(uTexture, vTextureCoord);
    if (texColor.a < 0.01) { finalColor = vec4(0.0); return; }

    vec2 uv = (vTextureCoord - 0.5) * 2.0;
    float dist = length(uv);
    float angle = atan(uv.y, uv.x);

    if (dist > 1.0) { finalColor = vec4(0.0); return; }

    float t = uTime;
    float s = uSeed * 17.3;
    float act = uActivity;

    // === PLASMA CORE ===
    // Swirling plasma noise in polar coordinates — no shadow, pure energy
    vec2 polarUV = vec2(angle / 6.2831 + 0.5, dist);
    float plasma1 = fbm(polarUV * vec2(3.0, 4.0) + vec2(t * 0.12 + s, t * 0.08));
    float plasma2 = fbm(polarUV * vec2(5.0, 3.0) - vec2(t * 0.15 - s * 0.7, t * 0.1));
    float plasma = plasma1 * 0.6 + plasma2 * 0.4;

    // Turbulent distortion — plasma swirls faster when active
    float turbSpeed = 0.1 + act * 0.3;
    float turb = fbm(uv * 3.0 + t * turbSpeed + s);

    // === ENERGY INTENSITY ===
    // Hot center that falls off radially — fusion core is brightest at center
    float coreFalloff = exp(-dist * dist * 5.0);
    float midEnergy = exp(-dist * dist * 2.0);
    float intensity = coreFalloff * 0.8 + midEnergy * plasma * 0.4 + turb * 0.15;

    // Activity flare: bursts of energy ripple outward
    float flareWave = sin(dist * 12.0 - t * 6.0 - act * 8.0) * 0.5 + 0.5;
    float flare = act * flareWave * exp(-dist * 2.0) * 0.5;
    intensity += flare;

    // === CONTAINMENT RINGS ===
    // Thin bright rings at specific radii — magnetic containment field
    float ring1 = smoothstep(0.02, 0.0, abs(dist - 0.55 - sin(t * 0.5) * 0.03));
    float ring2 = smoothstep(0.015, 0.0, abs(dist - 0.75 + cos(t * 0.7 + 1.0) * 0.02));
    float ring3 = smoothstep(0.012, 0.0, abs(dist - 0.9));
    float rings = ring1 * 0.25 + ring2 * 0.18 + ring3 * 0.12;
    // Rings brighten on activity
    rings *= 1.0 + act * 2.0;

    // === ENERGY TENDRILS ===
    // Radial streaks that rotate — plasma jets escaping containment
    float tendrilAngle = angle + t * 0.3 + s;
    float tendrils = 0.0;
    for (int i = 0; i < 4; i++) {
        float a = tendrilAngle + float(i) * 1.5708; // PI/2 spacing
        float streak = pow(max(0.0, cos(a * 3.0 + turb * 4.0)), 12.0);
        float radialFade = smoothstep(0.2, 0.5, dist) * smoothstep(1.0, 0.6, dist);
        tendrils += streak * radialFade * 0.15;
    }
    // Tendrils intensify with activity
    tendrils *= 1.0 + act * 3.0;

    // === COLOR COMPOSITION ===
    // White-hot center → base color → bright rim
    vec3 whiteHot = vec3(1.0, 0.98, 0.93);
    vec3 col = mix(uColorBase, whiteHot, coreFalloff * 0.7);
    col = mix(col, uColorBright, plasma * midEnergy * 0.5);
    col += uColorBright * rings;
    col += uColorBright * tendrils;
    col += whiteHot * flare * 0.5;

    // Activity: overall brightness boost + color shift toward white
    col += act * uColorBright * 0.2;
    col = mix(col, whiteHot, act * coreFalloff * 0.3);

    // === EDGE ===
    // Soft Fresnel-like rim glow — energy leaking at containment boundary
    float rim = pow(smoothstep(0.3, 0.95, dist), 2.0);
    col += uColorBright * rim * (0.15 + act * 0.2);

    // Soft edge alpha
    float alpha = smoothstep(1.0, 0.82, dist);

    // Dim outer halo beyond main body
    float halo = smoothstep(1.0, 0.5, dist) * 0.08;
    col += uColorBase * halo;

    finalColor = vec4(col * alpha, alpha);
}
`

/**
 * Sci-fi fusion reactor core shader.
 * No directional shadow — pure radiant energy with plasma noise,
 * containment rings, energy tendrils, and event-driven flares.
 */
export class CoreShader extends Filter {
  constructor() {
    const glProgram = GlProgram.from({
      vertex,
      fragment,
      name: 'core-fusion-reactor',
    })

    super({
      glProgram,
      resources: {
        coreUniforms: new UniformGroup({
          uTime: { value: 0, type: 'f32' },
          uActivity: { value: 0, type: 'f32' },
          uSeed: { value: 0, type: 'f32' },
          uColorBase: { value: new Float32Array([0.78, 0.84, 0.94]), type: 'vec3<f32>' },
          uColorBright: { value: new Float32Array([0.94, 0.96, 1.0]), type: 'vec3<f32>' },
        }),
      },
    })
  }

  update(
    time: number,
    activity: number,
    seed: number,
    baseColor: [number, number, number],
    brightColor: [number, number, number],
  ) {
    const u = this.resources.coreUniforms.uniforms
    u.uTime = time
    u.uActivity = activity
    u.uSeed = seed
    ;(u.uColorBase as Float32Array)[0] = baseColor[0]
    ;(u.uColorBase as Float32Array)[1] = baseColor[1]
    ;(u.uColorBase as Float32Array)[2] = baseColor[2]
    ;(u.uColorBright as Float32Array)[0] = brightColor[0]
    ;(u.uColorBright as Float32Array)[1] = brightColor[1]
    ;(u.uColorBright as Float32Array)[2] = brightColor[2]
  }
}
