/* P1 · 烟花试点（S11 + S12 的 3D 版，8 秒 240f）
 *
 * 这一段只证明四件事（design-v12-effects §五）：
 *   ① 3D 城墙/城楼/屋脊 经水墨着色后仍读作"水墨"；
 *   ② 体积雾在画面下半部真实存在（能把地面吃掉）；
 *   ③ 烟花是"炸开 + 照亮",不是贴上去的团块（自定义点光驱动屋脊受光）；
 *   ④ 运镜有真透视（推近 0–120f / 拉升后撤 120–240f）。
 *
 * 时间轴：0–120f = S11（第一朵，推近）；120–240f = S12（满城，拉升后撤退）。
 * 资产：`public/zhi-guo-xiang/three/` 下的 matcap / paper / 烟花团块；缺图自动走程序化兜底。
 */
import type { FC } from 'react';
import * as THREE from 'three';
import { random } from 'remotion';
import { colors } from '../../../brand/tokens';
import { FILM } from '../motion-tokens';
import { InkStage, type InkStageCtx } from '../components/three/InkStage';
import { keyOutPaper, makeInkMaterial, setFireLight, setInkTime } from '../components/three/inkShader';

const FIRE_BURSTS = [
  /* frame, x, y, z, 半径, 强度 */
  { f: 34, x: 10, y: 30, z: -36, r: 7.5, g: 1.35 },
  { f: 126, x: -26, y: 26, z: -30, r: 5.0, g: 0.85 },
  { f: 146, x: 4, y: 34, z: -44, r: 7.0, g: 1.15 },
  { f: 166, x: 34, y: 24, z: -26, r: 4.6, g: 0.8 },
  { f: 186, x: -8, y: 40, z: -58, r: 8.0, g: 1.3 },
  { f: 206, x: 24, y: 30, z: -40, r: 6.0, g: 1.0 },
  { f: 222, x: -36, y: 30, z: -48, r: 5.2, g: 0.9 },
] as const;

/** 一团烟花：核心 sprite + 放射粒子 + 下落余烬 */
type Burst = {
  group: THREE.Group;
  light: THREE.PointLight;
  core: THREE.Sprite;
  sparks: THREE.Sprite[];
  embers: THREE.Sprite[];
  cfg: (typeof FIRE_BURSTS)[number];
};

const mkGlowTexture = (): THREE.Texture => {
  const s = 128;
  const c = document.createElement('canvas');
  c.width = c.height = s;
  const g = c.getContext('2d')!;
  const grd = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  grd.addColorStop(0, 'rgba(255,246,224,1)');
  grd.addColorStop(0.22, 'rgba(240,198,120,0.95)');
  grd.addColorStop(0.55, 'rgba(168,84,47,0.45)');
  grd.addColorStop(1, 'rgba(168,84,47,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, s, s);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
};

const buildCity = (ctx: InkStageCtx): { mats: THREE.ShaderMaterial[]; update: (f: number) => void } => {
  const { scene, camera, matcap, tex } = ctx;
  const mats: THREE.ShaderMaterial[] = [];
  const mk = (opts: Parameters<typeof makeInkMaterial>[0]) => {
    const m = makeInkMaterial(opts);
    mats.push(m);
    return m;
  };

  const paper = tex.paper ?? ctx.paper;
  const brick = tex['city-brick'] ?? paper;
  const tile = tex['roof-tile'] ?? paper;
  const wallMat = mk({ matcap, map: brick, mapScale: [26, 2.2], tint: new THREE.Color('#efe8db'), lightGain: 1.35, ambient: 0.16 });
  const towerMat = mk({ matcap, map: brick, mapScale: [2.4, 3.4], tint: new THREE.Color('#e6ddcc'), lightGain: 1.30, ambient: 0.15 });
  const roofMat = mk({ matcap, map: tile, mapScale: [3.2, 2.2], tint: new THREE.Color('#c9bfab'), lightGain: 1.25, ambient: 0.14 });
  const groundMat = mk({ matcap, map: paper, mapScale: [26, 26], tint: new THREE.Color('#b8b0a2'), lightGain: 0.9, ambient: 0.22 });
  const houseMat = mk({ matcap, map: paper, mapScale: [2.2, 2.2], tint: new THREE.Color('#efe7d8'), lightGain: 1.2, ambient: 0.18 });

  /* 地面（护城河/河滩）：一大片深色，雾会把它吃掉 */
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(320, 130), groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(0, -0.4, 18);
  scene.add(ground);

  /* 城墙：长条 + 垛口 */
  const wall = new THREE.Mesh(new THREE.BoxGeometry(150, 8, 4), wallMat);
  wall.position.set(0, 4, -34);
  scene.add(wall);

  const crenGeo = new THREE.BoxGeometry(1.7, 1.5, 1.7);
  for (let i = 0; i < 62; i += 1) {
    const c = new THREE.Mesh(crenGeo, wallMat);
    c.position.set(-73 + i * 2.4, 8.7, -34);
    scene.add(c);
  }

  /* 三座城楼 + 歇山顶（四棱锥，转 45° 让它读作中国屋顶） */
  const towerGeo = new THREE.BoxGeometry(11, 20, 11);
  const roofGeo = new THREE.ConeGeometry(9.4, 6.2, 4);
  [-52, 0, 52].forEach((x) => {
    const t = new THREE.Mesh(towerGeo, towerMat);
    t.position.set(x, 10, -34);
    scene.add(t);
    const r = new THREE.Mesh(roofGeo, roofMat);
    r.position.set(x, 23, -34);
    r.rotation.y = Math.PI / 4;
    scene.add(r);
  });

  /* 城内屋脊：一排排小房子 + 坡顶，等烟花来照亮 */
  const houseGeo = new THREE.BoxGeometry(7, 5, 7);
  const hRoofGeo = new THREE.ConeGeometry(5.6, 3.4, 4);
  for (let i = 0; i < 46; i += 1) {
    const rx = random(`hx-${i}`) * 150 - 75;
    const rz = -42 - random(`hz-${i}`) * 46;
    const h = 7 + random(`hh-${i}`) * 9;
    const b = new THREE.Mesh(houseGeo, houseMat);
    b.scale.y = h / 5;
    b.position.set(rx, (5 * h) / 5 / 2, rz);
    scene.add(b);
    const rr = new THREE.Mesh(hRoofGeo, roofMat);
    rr.position.set(rx, h + 1.2, rz);
    rr.rotation.y = Math.PI / 4;
    scene.add(rr);
  }

  /* ── 远山：三片淡墨剪影（越远越淡），水墨的纵深靠它 ── */
  const mkRidge = (y: number, z: number, alpha: number, seed: string) => {
    const w = 512;
    const h = 256;
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const g = c.getContext('2d')!;
    g.clearRect(0, 0, w, h);
    g.fillStyle = `rgba(43,38,32,${alpha})`;
    g.beginPath();
    g.moveTo(0, h);
    let x = 0;
    let yy = h * 0.55;
    while (x < w) {
      const step = 18 + random(`${seed}-s-${x}`) * 26;
      const rise = (random(`${seed}-r-${x}`) - 0.42) * 90;
      yy = Math.max(h * 0.18, Math.min(h * 0.82, yy - rise * 0.35));
      g.lineTo(x, yy);
      x += step;
    }
    g.lineTo(w, h);
    g.closePath();
    g.fill();
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(420, 190),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, opacity: 1 }),
    );
    mesh.position.set(0, y, z);
    scene.add(mesh);
  };
  mkRidge(26, -190, 0.10, 'ridge-far');
  mkRidge(18, -150, 0.14, 'ridge-mid');
  mkRidge(10, -110, 0.18, 'ridge-near');

  /* ── 烟花 ── */
  const glow = mkGlowTexture();
  const bursts: Burst[] = FIRE_BURSTS.map((cfg, bi) => {
    const group = new THREE.Group();
    group.position.set(cfg.x, cfg.y, cfg.z);
    const light = new THREE.PointLight(new THREE.Color(FILM.fireGold), 0, 120, 2);
    group.add(light);

    const core = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: tex['fw-burst-1'] ? keyOutPaper(tex['fw-burst-1']) : glow,
        color: new THREE.Color(1, 1, 1),
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        opacity: 0,
      }),
    );
    core.scale.setScalar(cfg.r * 2.2);
    group.add(core);

    const sparks: THREE.Sprite[] = [];
    const embers: THREE.Sprite[] = [];
    for (let i = 0; i < 34; i += 1) {
      const s = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: glow,
          color: new THREE.Color(FILM.fireGold).lerp(new THREE.Color(colors.paper), random(`sc-${bi}-${i}`) * 0.5),
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          transparent: true,
          opacity: 0,
        }),
      );
      s.scale.setScalar(0.9 + random(`ss-${bi}-${i}`) * 1.6);
      sparks.push(s);
      group.add(s);
    }
    for (let i = 0; i < 12; i += 1) {
      const e = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: glow,
          color: new THREE.Color('#a8542f'),
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          transparent: true,
          opacity: 0,
        }),
      );
      e.scale.setScalar(0.6 + random(`es-${bi}-${i}`) * 0.8);
      embers.push(e);
      group.add(e);
    }
    scene.add(group);
    return { group, light, core, sparks, embers, cfg };
  });

  const camA = new THREE.Vector3();
  const camB = new THREE.Vector3();
  const lookA = new THREE.Vector3();
  const lookB = new THREE.Vector3();

  const update = (f: number) => {
    setInkTime(mats, f / 30);

    /* 运镜：0–120 推近（S11 一朵）；120–240 拉升后撤（S12 满城） */
    if (f <= 120) {
      const t = f / 120;
      camA.set(0, 13.5, 44).lerp(new THREE.Vector3(2.5, 15.5, 34), t);
      lookA.set(0, 20, -34);
      camera.position.copy(camA);
      camera.lookAt(lookA);
    } else {
      const t = (f - 120) / 120;
      camB.set(6, 17, 40).lerp(new THREE.Vector3(18, 25, 52), t);
      lookB.set(0, 22, -38);
      camera.position.copy(camB);
      camera.lookAt(lookB);
    }

    /* 烟花生命周期：起花 16f → 爆开 → 余烬 40f 淡出 */
    let bestGain = 0;
    let bestPos = new THREE.Vector3(0, 40, -40);
    bursts.forEach((b, bi) => {
      const age = f - b.cfg.f;
      const alive = age >= 0;
      const riseT = Math.min(1, Math.max(0, age / 16));
      const burstT = Math.min(1, Math.max(0, (age - 16) / 26));
      const fadeT = Math.max(0, Math.min(1, (age - 42) / 42));
      const live = alive ? 1 : 0;

      /* 起花：从城头升起一小团光 */
      const riseY = b.cfg.y - 26 + 26 * riseT;
      b.group.position.set(b.cfg.x, alive ? (age < 16 ? riseY : b.cfg.y) : b.cfg.y, b.cfg.z);

      const grow = burstT;
      b.core.visible = alive && burstT > 0 && fadeT < 1;
      b.core.material.opacity = live * (0.95 - fadeT) * Math.min(1, burstT * 3);
      b.core.scale.setScalar(b.cfg.r * 2.2 * (0.25 + grow * 1.05));

      b.sparks.forEach((s, i) => {
        const a = (i / b.sparks.length) * Math.PI * 2 + random(`sa-${bi}-${i}`) * 0.9;
        const el = (random(`se-${bi}-${i}`) - 0.5) * 1.1;
        const dist = (0.35 + random(`sd-${bi}-${i}`) * 0.65) * b.cfg.r * 2.6 * grow;
        s.position.set(Math.cos(a) * dist, Math.sin(el) * dist * 0.92, Math.sin(a) * dist * 0.5);
        s.material.opacity = live * (1 - fadeT) * Math.max(0, 0.85 - grow * 0.35);
        s.visible = alive && grow > 0 && fadeT < 1;
      });

      b.embers.forEach((e, i) => {
        const a = (i / b.embers.length) * Math.PI * 2 + 0.4;
        const drop = Math.max(0, age - 20) * 0.16;
        e.position.set(Math.cos(a) * b.cfg.r * 1.2, -drop + Math.sin(a) * 1.2, Math.sin(a) * b.cfg.r * 0.6);
        e.material.opacity = live * Math.max(0, 0.55 - fadeT * 0.55);
        e.visible = alive && age > 18;
      });

      /* 点光：爆开瞬间最强，之后指数衰减——这是"照亮城楼"的唯一来源 */
      const gain = alive ? b.cfg.g * Math.exp(-Math.max(0, age - 16) / 22) * (age < 16 ? age / 16 : 1) : 0;
      b.light.intensity = gain * 40;
      if (gain > bestGain) {
        bestGain = gain;
        bestPos = b.group.position.clone();
      }
    });
    setFireLight(mats, bestPos, bestGain * 1.15);
  };

  /* 首帧先算一次，避免截图拿到未初始化的画面 */
  update(0);
  return { mats, update };
};

export const P1Fireworks: FC = () => {
  return (
    <InkStage
      textures={[
        '/zhi-guo-xiang/three/ink-matcap.png',
        '/zhi-guo-xiang/three/paper-grain.png',
        '/zhi-guo-xiang/three/roof-tile.jpg',
        '/zhi-guo-xiang/three/fw-burst-1.jpg',
      ]}
      background={colors.paper}
      fogDensity={0.085}
      fogHeight={2.1}
      edgeStrength={1.0}
      bleed={0.65}
      vignette={0.9}
      build={(ctx) => {
        const { update } = buildCity(ctx);
        return (f) => update(f);
      }}
    />
  );
};

export default P1Fireworks;