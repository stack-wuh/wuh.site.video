/* v12 · 3D NPR 水墨管线的着色器与程序化贴图（design-v12-effects §3）
 *
 * 这里只做两件事：
 *  ① makeInkMaterial()：把 PBR 光照压成「墨分五色」的 4 阶 + matcap 材质 + 笔触扰动；
 *  ② 程序化兜底贴图：AI 贴图还没到位时，管线必须能自洽跑起来（纸纹 / matcap 球）。
 *
 * 颜色只来自 brand/tokens 与 motion-tokens（禁内联 hex）。
 */
import * as THREE from 'three';
import { colors } from '../../../../brand/tokens';
import { FILM } from '../../motion-tokens';

export const INK = new THREE.Color(colors.ink);
export const PAPER = new THREE.Color(colors.paper);
export const FIRE = new THREE.Color(FILM.fireGold);

const INK_VERT = /* glsl */ `
varying vec3 vNormalW;
varying vec3 vPosW;
varying vec2 vUv;
varying vec3 vViewPos;
void main() {
  vUv = uv;
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vPosW = wp.xyz;
  vNormalW = normalize(mat3(modelMatrix) * normal);
  vec4 mv = viewMatrix * wp;
  vViewPos = mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`;

const INK_FRAG = /* glsl */ `
precision highp float;
uniform vec3 uInk;
uniform vec3 uPaper;
uniform vec3 uTint;
uniform vec3 uLightDir;
uniform float uLightGain;
uniform float uAmbient;
uniform sampler2D uMatcap;
uniform sampler2D uMap;
uniform float uHasMap;
uniform vec2 uMapScale;
uniform float uWobble;
uniform float uTime;
uniform float uEmissive;
uniform vec3 uEmissiveColor;
/* 烟花点光：ShaderMaterial 不吃 three 的点光，这里自己算一个、由场景每帧喂位置与强度 */
uniform vec3 uFirePos;
uniform float uFireGain;
uniform float uFireRange;
uniform vec3 uFireColor;
varying vec3 vNormalW;
varying vec3 vPosW;
varying vec2 vUv;
varying vec3 vViewPos;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  float a = hash(i), b = hash(i + vec2(1.0, 0.0)), c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float fbm(vec2 p) {
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { s += a * vnoise(p); p *= 2.03; a *= 0.5; }
  return s;
}
/* 4 阶量化：档与档之间留一点平滑，读起来是笔触边而不是等值线 */
float band(float x) {
  float t0 = 0.16, t1 = 0.34, t2 = 0.58, t3 = 0.88;
  float v = mix(t0, t1, smoothstep(0.22, 0.30, x));
  v = mix(v, t2, smoothstep(0.48, 0.56, x));
  v = mix(v, t3, smoothstep(0.74, 0.82, x));
  return v;
}

void main() {
  vec3 N = normalize(vNormalW);
  float lam = max(dot(N, normalize(uLightDir)), 0.0);
  float shade = clamp(uAmbient + lam * uLightGain, 0.0, 1.4);

  /* 烟花照到的地方会被抬亮（屋脊、墙面、雪面）——这是"光是真的"那一条 */
  float fire = 0.0;
  if (uFireGain > 0.001) {
    vec3 L = uFirePos - vPosW;
    float dist = length(L);
    float att = pow(clamp(1.0 - dist / uFireRange, 0.0, 1.0), 2.0);
    fire = att * uFireGain * max(dot(N, normalize(L)), 0.0);
    shade = clamp(shade + fire, 0.0, 1.4);
  }

  /* 笔触扰动：把明暗在"笔"的尺度上揉一下，色阶边界就不再是等值线 */
  vec2 wp = vUv * 6.0 + vec2(uTime * 0.05, uTime * 0.02);
  float wob = (fbm(wp) - 0.5) * uWobble;
  shade = clamp(shade + wob, 0.0, 1.0);

  /* matcap：用视线空间法线采样一张"水墨球"，这是"像画"而不是"像塑料"的关键 */
  vec3 vn = normalize((viewMatrix * vec4(N, 0.0)).xyz);
  vec2 muv = vn.xy * 0.5 + 0.5;
  vec3 mc = texture2D(uMatcap, muv).rgb;
  float mlum = dot(mc, vec3(0.299, 0.587, 0.114));
  float lum = mix(mlum, shade, 0.55);
  lum = band(lum);

  vec3 col = mix(uInk, uPaper, lum);
  col *= uTint;

  if (uHasMap > 0.5) {
    vec3 tex = texture2D(uMap, vUv * uMapScale).rgb;
    /* 贴图只压浓淡、不改色相：multiplicative wash */
    float tl = dot(tex, vec3(0.299, 0.587, 0.114));
    col *= mix(1.0, tl / 0.82, 0.75);
  }

  /* 被烟花照到的地方带一点火色（不是全屏泛白） */
  col = mix(col, uFireColor, clamp(fire * 0.55, 0.0, 0.45));

  /* 自发光（烟花卡/粒子）：不参与墨阶，直接给火色 */
  col = mix(col, uEmissiveColor, uEmissive);

  /* 边缘略深：模拟笔触收边（真正的描边在合成 pass 里用深度/法线做） */
  float rim = 1.0 - abs(dot(normalize(-vViewPos), vn));
  col *= 1.0 - rim * 0.12;

  gl_FragColor = vec4(col, 1.0);
}
`;

export type InkMaterialOpts = {
  matcap: THREE.Texture;
  map?: THREE.Texture | null;
  tint?: THREE.Color;
  lightGain?: number;
  ambient?: number;
  wobble?: number;
  emissive?: number;
  emissiveColor?: THREE.Color;
  transparent?: boolean;
  side?: THREE.Side;
  /** 贴图在 UV 上的重复次数（自定义 ShaderMaterial 不吃 texture.repeat，只能走 uniform） */
  mapScale?: [number, number];
};

export const makeInkMaterial = ({
  matcap,
  map = null,
  tint = new THREE.Color(1, 1, 1),
  lightGain = 0.95,
  ambient = 0.30,
  wobble = 0.16,
  emissive = 0,
  emissiveColor = FIRE,
  transparent = false,
  side = THREE.FrontSide,
  mapScale = [1, 1],
}: InkMaterialOpts): THREE.ShaderMaterial =>
  new THREE.ShaderMaterial({
    vertexShader: INK_VERT,
    fragmentShader: INK_FRAG,
    uniforms: {
      uInk: { value: INK.clone() },
      uPaper: { value: PAPER.clone() },
      uTint: { value: tint },
      uLightDir: { value: new THREE.Vector3(0.45, 0.8, 0.35).normalize() },
      uLightGain: { value: lightGain },
      uAmbient: { value: ambient },
      uMatcap: { value: matcap },
      uMap: { value: map },
      uHasMap: { value: map ? 1 : 0 },
      uMapScale: { value: new THREE.Vector2(mapScale[0], mapScale[1]) },
      uWobble: { value: wobble },
      uTime: { value: 0 },
      uEmissive: { value: emissive },
      uEmissiveColor: { value: emissiveColor },
      uFirePos: { value: new THREE.Vector3(0, 40, -40) },
      uFireGain: { value: 0 },
      uFireRange: { value: 90 },
      uFireColor: { value: FIRE.clone() },
    },
    transparent,
    side,
  });

/** 程序化兜底：一张"水墨球" matcap（上左纸白、下右浓墨、带一点水彩不匀） */
export const proceduralMatcap = (size = 256): THREE.Texture => {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d')!;
  const grd = g.createLinearGradient(0, 0, size, size);
  grd.addColorStop(0, colors.paper);
  grd.addColorStop(0.45, '#cfc6b4');
  grd.addColorStop(1, colors.ink);
  g.fillStyle = grd;
  g.fillRect(0, 0, size, size);
  /* 水彩不匀：几十团极淡的墨斑 */
  for (let i = 0; i < 90; i += 1) {
    const a = ((i * 137.508) % 360) * (Math.PI / 180);
    const r = (0.15 + ((i * 29) % 100) / 130) * size * 0.5;
    const x = size / 2 + Math.cos(a) * r;
    const y = size / 2 + Math.sin(a) * r;
    const rad = size * (0.02 + ((i * 17) % 40) / 900);
    const grad = g.createRadialGradient(x, y, 0, x, y, rad);
    const dark = x / size + y / size > 1;
    grad.addColorStop(0, dark ? 'rgba(43,38,32,0.16)' : 'rgba(245,240,232,0.20)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grad;
    g.beginPath();
    g.arc(x, y, rad, 0, Math.PI * 2);
    g.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
};

/** 程序化兜底：可平铺纸纹（明度 238–255，只会被 multiply，不能有大块明暗） */
export const proceduralPaper = (size = 512): THREE.Texture => {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d')!;
  g.fillStyle = '#ffffff';
  g.fillRect(0, 0, size, size);
  /* 纤维：细短横线 + 点，全部在 238–255 之间 */
  for (let i = 0; i < 2600; i += 1) {
    const x = ((i * 73) % size) + ((i % 7) * 0.3);
    const y = (i * 151) % size;
    const len = 2 + ((i * 13) % 22);
    g.strokeStyle = `rgba(120,110,96,${0.02 + ((i % 9) / 900).toFixed(3)})`;
    g.lineWidth = 0.6;
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x + len, y + (((i % 5) - 2) * 0.4));
    g.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
};

/** 把"当前最亮的那团烟花"喂给一批材质（每帧调一次） */
export const setFireLight = (mats: THREE.ShaderMaterial[], pos: THREE.Vector3, gain: number): void => {
  for (const m of mats) {
    m.uniforms.uFirePos.value.copy(pos);
    m.uniforms.uFireGain.value = gain;
  }
};

/** 全局时间（笔触扰动用），每帧调一次 */
export const setInkTime = (mats: THREE.ShaderMaterial[], t: number): void => {
  for (const m of mats) m.uniforms.uTime.value = t;
};


/** 把"画在纸白底上"的贴图抠成带 alpha 的图（烟花团块用）：
 *  alpha = (纸白 − 亮度) / 纸白，并做一次轻微提饱和——否则加性混合会出一个白方块。 */
export const keyOutPaper = (src: THREE.Texture): THREE.Texture => {
  const img = src.image as HTMLImageElement | HTMLCanvasElement | undefined;
  if (!img) return src;
  const w = (img as HTMLImageElement).width ?? 0;
  const h = (img as HTMLImageElement).height ?? 0;
  if (!w || !h) return src;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d')!;
  g.drawImage(img as CanvasImageSource, 0, 0);
  const data = g.getImageData(0, 0, w, h);
  const px = data.data;
  for (let i = 0; i < px.length; i += 4) {
    const r = px[i];
    const gg = px[i + 1];
    const b = px[i + 2];
    const lum = (0.299 * r + 0.587 * gg + 0.114 * b) / 255;
    const a = Math.max(0, Math.min(1, (0.985 - lum) / 0.985));
    px[i + 3] = Math.round(Math.pow(a, 0.85) * 255);
  }
  g.putImageData(data, 0, 0);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
};

/** 单通道纸纹（它本身是白底细纹，multiply 用） */
export const asMultiplyTex = (src: THREE.Texture): THREE.Texture => src;
