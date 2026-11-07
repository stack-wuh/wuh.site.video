/* v12 · 3D NPR 水墨管线的合成 pass（design-v12-effects §3.3–3.4）
 *
 * 输入：beauty（颜色）+ depth（深度贴图）+ normal（法线 pass）
 * 做四件事（顺序即代码顺序）：
 *   ① 体积雾 raymarch（屏幕空间，密度用 3D fbm + 高度衰减）——雪脊/河谷/茶烟的"吃掉下半身"靠它；
 *   ② 描边：深度 + 法线 Sobel，粗细随景深（远细近粗）；
 *   ③ 墨晕：浓墨区附近做一次廉价扩散，让黑边"化"开而不是硬线；
 *   ④ 纸纹 multiply + 暗角 + 轻微色偏。
 *
 * 颜色只来自 brand/tokens 与 motion-tokens。
 */
import * as THREE from 'three';
import { colors } from '../../../../brand/tokens';

const VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const FRAG = /* glsl */ `
precision highp float;
uniform sampler2D uBeauty;
uniform sampler2D uDepth;
uniform sampler2D uNormal;
uniform sampler2D uPaper;
uniform vec2 uResolution;
uniform float uNear;
uniform float uFar;
uniform float uTime;
uniform vec3 uInk;
uniform vec3 uPaperColor;
uniform vec3 uFogColor;
uniform float uFogDensity;
uniform float uFogHeight;
uniform float uEdgeStrength;
uniform float uBleed;
uniform float uVignette;
uniform vec3 uCameraPos;
uniform vec2 uPaperScale;
varying vec2 vUv;

float hash(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
float vnoise(vec3 p) {
  vec3 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float n000 = hash(i), n100 = hash(i + vec3(1,0,0)), n010 = hash(i + vec3(0,1,0)), n110 = hash(i + vec3(1,1,0));
  float n001 = hash(i + vec3(0,0,1)), n101 = hash(i + vec3(1,0,1)), n011 = hash(i + vec3(0,1,1)), n111 = hash(i + vec3(1,1,1));
  return mix(mix(mix(n000, n100, f.x), mix(n010, n110, f.x), f.y),
             mix(mix(n001, n101, f.x), mix(n011, n111, f.x), f.y), f.z);
}
float fbm3(vec3 p) {
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { s += a * vnoise(p); p *= 2.02; a *= 0.5; }
  return s;
}
float linearDepth(float d) {
  float z = d * 2.0 - 1.0;
  return (2.0 * uNear * uFar) / (uFar + uNear - z * (uFar - uNear));
}
vec3 reconstructWorld(vec2 uv, float depth) {
  /* 用屏幕 uv + 线性深度还原世界坐标（相机固定朝向场景原点，足够雾用） */
  vec2 ndc = uv * 2.0 - 1.0;
  vec3 dir = normalize(vec3(ndc.x * uResolution.x / uResolution.y * 0.85, ndc.y * 0.85, -1.0));
  return uCameraPos + dir * depth;
}

/* 深度 Sobel：轮廓线的最强来源 */
float depthEdge(vec2 uv, float px) {
  float d = linearDepth(texture2D(uDepth, uv).r);
  float dl = linearDepth(texture2D(uDepth, uv - vec2(px, 0.0)).r);
  float dr = linearDepth(texture2D(uDepth, uv + vec2(px, 0.0)).r);
  float du = linearDepth(texture2D(uDepth, uv - vec2(0.0, px)).r);
  float dd = linearDepth(texture2D(uDepth, uv + vec2(0.0, px)).r);
  float gx = abs(dr - dl), gy = abs(dd - du);
  float g = length(vec2(gx, gy)) / max(d, 1.0);
  return smoothstep(0.012, 0.05, g);
}
/* 法线 Sobel：物体内部转折的"笔断意连" */
float normalEdge(vec2 uv, float px) {
  vec3 n = texture2D(uNormal, uv).xyz * 2.0 - 1.0;
  vec3 nl = texture2D(uNormal, uv - vec2(px, 0.0)).xyz * 2.0 - 1.0;
  vec3 nr = texture2D(uNormal, uv + vec2(px, 0.0)).xyz * 2.0 - 1.0;
  vec3 nu = texture2D(uNormal, uv - vec2(0.0, px)).xyz * 2.0 - 1.0;
  vec3 nd = texture2D(uNormal, uv + vec2(0.0, px)).xyz * 2.0 - 1.0;
  float g = length(1.0 - vec3(dot(n, nl), dot(n, nr), dot(n, min(nu, nd))));
  return smoothstep(0.28, 0.62, g);
}

void main() {
  vec2 uv = vUv;
  float px = 1.0 / uResolution.y;
  vec3 col = texture2D(uBeauty, uv).rgb;
  float depth = linearDepth(texture2D(uDepth, uv).r);

  /* ① 体积雾：从相机往该像素方向走 20 步，密度 = fbm + 高度衰减 */
  vec3 world = reconstructWorld(uv, depth);
  vec3 rayDir = normalize(world - uCameraPos);
  float stepLen = min(depth, 120.0) / 20.0;
  float fog = 0.0;
  for (int i = 0; i < 20; i++) {
    vec3 p = uCameraPos + rayDir * (float(i) + 0.5) * stepLen;
    float h = clamp((p.y + 6.0) / 26.0, 0.0, 1.0);
    float dens = fbm3(vec3(p.x * 0.05, p.y * 0.09 - uTime * 0.012, p.z * 0.05 + uTime * 0.006));
    dens = smoothstep(0.35, 0.85, dens) * pow(1.0 - h, uFogHeight);
    fog += dens * stepLen * uFogDensity;
  }
  fog = 1.0 - exp(-fog);
  fog = clamp(fog, 0.0, 0.92);
  col = mix(col, uFogColor, fog);

  /* ② 描边：近处粗、远处细（水墨的远近） */
  float near = clamp(1.0 - depth / 60.0, 0.0, 1.0);
  float e = mix(depthEdge(uv, px * 1.0), normalEdge(uv, px * 1.4), 0.35);
  float w = mix(0.55, 1.0, near);
  e *= w * uEdgeStrength;
  col = mix(col, uInk, clamp(e, 0.0, 0.85));

  /* ③ 墨晕：把已经发黑的区域往周围"洇"一点（廉价 = 四向模糊后再压暗） */
  float dark = 1.0 - dot(col, vec3(0.299, 0.587, 0.114));
  float bleed = 0.0;
  for (int k = 0; k < 4; k++) {
    vec2 o = vec2(cos(float(k) * 1.5708), sin(float(k) * 1.5708)) * px * 3.2;
    bleed += (1.0 - dot(texture2D(uBeauty, uv + o).rgb, vec3(0.299, 0.587, 0.114)));
  }
  bleed *= 0.25;
  col = mix(col, uInk, clamp((bleed - 0.55) * uBleed, 0.0, 0.30) * (1.0 - dark * 0.5));

  /* ④ 纸纹 multiply + 暗角 */
  vec3 paper = texture2D(uPaper, uv * uPaperScale).rgb;
  col *= mix(vec3(1.0), paper, 0.85);
  vec2 v = uv - 0.5;
  float vig = 1.0 - dot(v, v) * uVignette;
  col *= vig;
  /* 极轻的暖偏，模拟纸的底色 */
  col = mix(col, col * vec3(1.02, 1.0, 0.965), 0.8);

  gl_FragColor = vec4(col, 1.0);
}
`;

export type InkPostUniforms = {
  beauty: THREE.Texture;
  depth: THREE.Texture;
  normal: THREE.Texture;
  paper: THREE.Texture;
};

export const makeInkPost = (u: InkPostUniforms): THREE.ShaderMaterial =>
  new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms: {
      uBeauty: { value: u.beauty },
      uDepth: { value: u.depth },
      uNormal: { value: u.normal },
      uPaper: { value: u.paper },
      uResolution: { value: new THREE.Vector2(1920, 1080) },
      uNear: { value: 0.5 },
      uFar: { value: 400 },
      uTime: { value: 0 },
      uInk: { value: new THREE.Color(colors.ink) },
      uPaperColor: { value: new THREE.Color(colors.paper) },
      uFogColor: { value: new THREE.Color(colors.paper) },
      uFogDensity: { value: 0.035 },
      uFogHeight: { value: 2.2 },
      uEdgeStrength: { value: 0.9 },
      uBleed: { value: 0.7 },
      uVignette: { value: 0.85 },
      uCameraPos: { value: new THREE.Vector3() },
      uPaperScale: { value: new THREE.Vector2(2.4, 1.35) },
    },
    depthTest: false,
    depthWrite: false,
  });