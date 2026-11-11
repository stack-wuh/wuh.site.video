/* S33 · Act 6 入院 · 局部帧 [0,186) · 186f · 绝对 4826–5012
 *
 * V3 特效解禁重写（2026-11-11 八年翻牌科技化复刻——样片门主打镜；§3 二次修正令：全片禁网站截图，
 * 原 114–170 p-music-player 证据快闪窗整体删除（Img/staticFile 全移除），时段让渡「八年年谱条」纯数据件）。
 * 逐拍事件链（局部帧）：
 *  0–12    光标入场：琥珀光点自模块轨道 04 位（承接 s32 尾帧交出的「光标停在 04 前」）飞至数据盘心 (1380,410)；
 *  12      点击：shockwave 双环涟漪 + sparkBurst 粒子（random(seed) 确定性）；面板 04 点亮（Rail lit 3→4）；
 *  12–30   黑胶数据盘显影：springIn scale 0.9→1 + 外环四圈同心细线（FILM_COLORS2.line）；
 *          盘面 conic 反光 vinylSpin(frame, 150) 起转（screen 混合 · 低透明）；
 *  6–40    timelineFlow 外环线画入（装饰化：整体 opacity×0.4，不抢翻牌主角）；
 *  28–44   唱针臂入画（右侧悬停高位）；
 *  62–74   唱针落下（落定帧 74=绝对 4900=拍245 对音——以当前文件为准保留；needleSettle 阻尼正弦收稳）；
 *  62–158  八年翻牌表演（本镜主角）：i 年起翻 62+12i（62/74/86/98/110/122/134/146）——
 *          ① 年份刻度环（盘周 R260）该年节点点亮（+3px · FILM_COLORS2.data · 辉光；未到 dataDim 低透明）；
 *          ② 中央大字年份翻牌：容器 key={`y${i}`} 强制 remount，内部 springIn scale 0.92→1，
 *             serif 150px 低透明底字（paperWhite opacity 0.30）+ glowText 金闪翻牌首 6f；
 *          ③ 歌名主读 46px serif paperWhite + 演唱者 18px mono textMuted + 「当年最爱」题签
 *             （sealRed 底 paperWhite 13px · 字距 0.24em）——同容器 remount 带入场（opacity+translateY 8px→0 · 10f）；
 *          ④ HUD readout 联动：YEAR-FAV · 年份 · i/8；
 *  62–186  走带进度条匀速常走（62 起走 · 186 走满）；74–84 EQ 三柱起势后相位差常驻（eqBars）；
 *  114     八年年谱条入场（writeFade 慢档 · 底部避让字幕安全区）：8 节点等距=年份 mono 13px + 歌名 serif 15px，
 *          翻牌进行到该年 springIn 点亮（年 data+辉光 / 歌 paperWhite；已过保持 dim lit（dataDim）；
 *          未到只留极淡刻度线（line 色））；
 *  146     最末年（2025）翻牌落定 → 152 起年谱条整条微光呼吸；
 *  158–186 唱针微抬（+4° · 10f）；光标自盘心飞向模块轨道 05 位、停在 05 前（172–180 淡出并入轨道箭头）；
 *          面板 01–04 保持亮（尾帧契约：面板 01–04 亮、光标停在 05 前 → s34 五块亮·05 展开）。
 *  全程    CameraRig 缓推 scale 1.03→1.06（62–158 间完成）+ handheld('s33-cam', frame, 1.3)；
 *          背景 DeepSpace 保留 + dataCurtain('s33-rain', frame, 12, 130)（盘之后 · HUD 之前）。
 * 转场：入「切」，出「切」。两句字幕 ／ 分序原样：句 1 appearAt 20、句 2 appearAt 112。
 * 八年歌单自 v2 s38 原样搬运（materials §2.8 真实数据，标识不滚数）。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import {
  CURVES,
  FILM_COLORS2,
  dataCurtain,
  eqBars,
  glowText,
  handheld,
  needleSettle,
  shockwave,
  sparkBurst,
  springIn,
  timelineFlow,
  vinylSpin,
  writeFade,
} from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

/* 年度最爱（八年歌单播放之最；materials §2.8——自 v2 s38 原样搬运） */
const YEAR_FAVS: Array<{ year: string; song: string; artist: string }> = [
  { year: '2018', song: '诱惑的街 (Live)', artist: '林志炫' },
  { year: '2019', song: '腻味', artist: '金玟岐' },
  { year: '2020', song: '少年不凡', artist: '刘美麟' },
  { year: '2021', song: '风月缠绵（金风玉露变奏）', artist: '陈致逸' },
  { year: '2022', song: '归期', artist: '钱润玉' },
  { year: '2023', song: '爱意（金风玉露变奏）', artist: '陈致逸' },
  { year: '2024', song: '爱意（金风玉露变奏）', artist: '陈致逸' },
  { year: '2025', song: '爱意（金风玉露变奏）', artist: '陈致逸' },
];

const NEEDLE_LAND = 74; // = 绝对 4900 = 拍245（保留当前文件对音帧）
const FLIP_START = 62; // 八年翻牌起点
const FLIP_STEP = 12; // 62/74/86/98/110/122/134/146
const ARM_LAND = 48; // 唱针落定角（°，竖臂 top pivot，愈大愈落）
const RING_R = 260; // 年份刻度环半径（盘局部坐标）
const DISC_C = { x: 1380, y: 410 }; // 数据盘心（屏坐标）
const CUR_FROM = { x: 886, y: 104 }; // 光标起点=轨道 04 位（承接 s32 尾帧）
const CUR_TO = { x: 958, y: 106 }; // 光标终点=05 位之前（尾帧契约）
const TL_X0 = 150;
const TL_X1 = 1770;
const TL_Y = 700;
const NODE_GAP = (TL_X1 - TL_X0) / YEAR_FAVS.length;
const RAIL_PITCH = 74;

const flipAt = (i: number): number => FLIP_START + i * FLIP_STEP;

/** V2 模块轨道（原控制台面板的 HUD 化替身）——交接态语义同 s32/s34 */
const Rail: FC<{ lit: number; at: number; cursorP: number; frame: number }> = ({ lit, at, cursorP, frame }) => (
  <div style={{ position: 'absolute', left: '50%', top: 92, width: 582, marginLeft: -291, zIndex: 26 }}>
    <div style={{ display: 'flex', gap: 10 }}>
      {Array.from({ length: 8 }).map((_v, i) => {
        const n = i + 1;
        const on = n <= lit;
        const active = n === at && on;
        return (
          <div key={n} style={{ width: 64 }}>
            <div
              style={{
                textAlign: 'center',
                fontFamily: fontFamilies.mono,
                fontSize: 13,
                letterSpacing: '0.18em',
                color: on ? FILM_COLORS2.data : n === at ? FILM_COLORS2.gold : FILM_COLORS2.textMuted,
                opacity: on ? 0.95 : n === at ? 0.9 : 0.5,
                ...(active ? glowText(FILM_COLORS2.data, 0.4 + 0.15 * Math.sin(frame / 6)) : {}),
              }}
            >
              {String(n).padStart(2, '0')}
            </div>
            <div style={{ marginTop: 6, height: 3, borderRadius: 2, background: on ? FILM_COLORS2.data : FILM_COLORS2.line, boxShadow: on ? `0 0 8px rgba(212,163,115,${active ? 0.4 + 0.2 * Math.sin(frame / 6) : 0.45})` : 'none', opacity: on ? 1 : 0.5 }} />
          </div>
        );
      })}
    </div>
    {at > lit ? (
      <div style={{ position: 'absolute', top: 14, left: (at - 1) * RAIL_PITCH - 14 + cursorP * 8, width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: `7px solid ${FILM_COLORS2.gold}`, opacity: 0.9, filter: 'drop-shadow(0 0 6px rgba(212,163,115,0.6))' }} />
    ) : null}
  </div>
);

/** 顺序字幕（两句 ／ 同镜先后衔接，句窗不重叠——文本与 appearAt 原样保留） */
const SeqCaption: FC<{ text: string; from: number; to: number }> = ({ text, from, to }) => {
  const frame = useCurrentFrame();
  if (frame < from || frame >= to) return null;
  const local = frame - from;
  const out = interpolate(local, [to - from - 12, to - from], [1, 0], CLAMP);
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 150, textAlign: 'center', zIndex: 30, opacity: Math.min(1, interpolate(local, [0, 10], [0, 1], CLAMP)) * out }}>
      <span style={{ fontFamily: fontFamilies.serif, fontSize: 40, color: FILM_COLORS2.paperWhite, textShadow: `0 2px 18px rgba(2,3,8,0.9), 0 0 26px rgba(212,163,115,0.14)` }}>{text}</span>
    </div>
  );
};

const S33: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* CameraRig：缓推 1.03→1.06（62–158 完成）+ 手持呼吸 */
  const hh = handheld('s33-cam', frame, 1.3);
  const cam = {
    scale: interpolate(frame, [62, 158], [1.03, 1.06], { ...CLAMP, easing: CURVES.cineEaseInOut }),
    x: hh.dx,
    y: hh.dy,
    rot: hh.rot,
  };
  /* 屏坐标 ← rig 局部坐标映射（光标是屏空间演员，要贴住被推近的盘心） */
  const mapX = (x: number): number => 960 + (x - 960) * cam.scale + cam.scale * cam.x;
  const mapY = (y: number): number => 540 + (y - 540) * cam.scale + cam.scale * cam.y;

  /* 当前翻牌年（62–158 逐格翻转；146 后停在最末年 2025） */
  const activeYear = frame < FLIP_START ? -1 : Math.min(YEAR_FAVS.length - 1, Math.floor((frame - FLIP_START) / FLIP_STEP));
  const fav = YEAR_FAVS[Math.max(0, activeYear)];
  const flip = flipAt(Math.max(0, activeYear));
  const springP = springIn(frame, flip, fps);
  const goldFlash = activeYear >= 0 ? interpolate(frame, [flip, flip + 6], [0.9, 0], CLAMP) : 0;
  const songP = activeYear >= 0 ? interpolate(frame, [flip + 2, flip + 12], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut }) : 0;

  /* 黑胶数据盘显影（12–30）+ conic 反光起转 */
  const discP = springIn(frame, 12, fps);
  const discOpacity = interpolate(frame, [12, 22], [0, 1], CLAMP);
  const spin = vinylSpin(frame, 150);
  /* timelineFlow 外环线（6–40 画入；装饰化 0.4） */
  const tl = timelineFlow(frame, 6, 34, YEAR_FAVS.length, NODE_GAP);

  /* 唱针：62–74 落下（needleSettle 阻尼正弦收稳）；168–178 微抬 +4° */
  const settle = needleSettle(frame, NEEDLE_LAND);
  const approach = interpolate(frame, [62, NEEDLE_LAND], [-5, 0], { ...CLAMP, easing: CURVES.cineEaseOut });
  const needleLift = interpolate(frame, [168, 178], [0, 4], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const needleAngle = ARM_LAND + settle + approach - needleLift;
  const needleOpacity = interpolate(frame, [28, 44], [0, 1], CLAMP);

  /* EQ 三柱（74–84 起势 → 相位差常驻）+ 走带进度条（62–186 匀速走满） */
  const eqGrow = interpolate(frame, [NEEDLE_LAND, 84], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut });
  const bars = eqBars(frame);
  const transport = interpolate(frame, [62, 186], [0, 1], CLAMP);

  /* 八年年谱条（114 入场；152 起整条微光呼吸） */
  const chrono = writeFade(frame, 114, true);
  const breathe = interpolate(frame, [152, 164], [0, 1], CLAMP) * (0.5 + 0.5 * Math.sin(frame / 9));

  /* 光标：0–12 入场点击 → 悬停盘心 → 158–172 飞向 05 位前停住 → 172–180 并入轨道箭头 */
  const curIn = interpolate(frame, [0, 12], [0, 1], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const curTail = interpolate(frame, [158, 172], [0, 1], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const curFade = interpolate(frame, [0, 4], [0, 1], CLAMP) * interpolate(frame, [172, 180], [1, 0], CLAMP);
  const hoverX = mapX(DISC_C.x);
  const hoverY = mapY(DISC_C.y);
  const curX = frame < 158 ? mapX(CUR_FROM.x + (DISC_C.x - CUR_FROM.x) * curIn) : hoverX + (CUR_TO.x - hoverX) * curTail;
  const curY = frame < 158 ? mapY(CUR_FROM.y + (DISC_C.y - CUR_FROM.y) * curIn) : hoverY + (CUR_TO.y - hoverY) * curTail;
  const curScale = frame >= 12 && frame < 158 ? 1 + 0.08 * Math.sin(frame / 7) : 1;
  /* 点击涟漪 + 粒子（12；屏空间常量位——62 前机位未推） */
  const ripple = shockwave(frame, 12);
  const sparks = sparkBurst('s33-click', frame, 12, 12);

  /* 模块轨道交接态：0 起手承接 s32 尾帧（01–03 亮·光标在 04 前）→ 12 点击亮 04 → 158 光标移向 05 */
  const lit = frame >= 12 ? 4 : 3;
  const at = frame >= 158 ? 5 : 4;
  const cursorP = frame < 12 ? 0.6 : frame >= 158 ? interpolate(frame, [158, 178], [0, 0.62], CLAMP) : 0;

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s33v2" stars={60} grid horizon />

      <CameraRig cam={cam}>
        {/* ── 主角区：中央大字年份翻牌（key remount · springIn · 金闪 6f） + 歌名主读 + 题签 ── */}
        {activeYear >= 0 ? (
          <div key={`y${activeYear}`} style={{ position: 'absolute', left: 160, top: 296, width: 880 }}>
            <div
              style={{
                fontFamily: fontFamilies.serif,
                fontSize: 150,
                lineHeight: 1.05,
                color: FILM_COLORS2.paperWhite,
                opacity: 0.3 * Math.min(1, springP * 2.2),
                fontVariantNumeric: 'tabular-nums',
                transform: `scale(${0.92 + springP * 0.08})`,
                transformOrigin: 'left bottom',
                ...(goldFlash > 0.02 ? glowText(FILM_COLORS2.gold, goldFlash) : {}),
              }}
            >
              {fav.year}
            </div>
            <div style={{ marginTop: 14, opacity: songP, transform: `translateY(${(1 - songP) * 8}px)` }}>
              <div style={{ fontFamily: fontFamilies.serif, fontSize: 46, lineHeight: 1.3, color: FILM_COLORS2.paperWhite }}>{fav.song}</div>
              <div style={{ fontFamily: fontFamilies.mono, fontSize: 18, color: FILM_COLORS2.textMuted, marginTop: 10, letterSpacing: '0.08em' }}>{fav.artist}</div>
              <div style={{ display: 'inline-block', marginTop: 16, padding: '4px 12px', borderRadius: 3, background: FILM_COLORS2.sealRed, fontFamily: fontFamilies.serif, fontSize: 13, color: FILM_COLORS2.paperWhite, letterSpacing: '0.24em' }}>当年最爱</div>
            </div>
          </div>
        ) : null}

        {/* ── 黑胶数据盘（右）：显影 12–30 · 外环四圈 · conic 反光起转 · 年份刻度环 · 唱针 ── */}
        <div style={{ position: 'absolute', left: 1140, top: 170, width: 480, height: 480, opacity: discOpacity, transform: `scale(${0.9 + discP * 0.1})` }}>
          {/* 外环四圈同心细线 */}
          {[30, 88, 146, 204].map((inset, ri) => (
            <div key={inset} style={{ position: 'absolute', inset, borderRadius: 240, border: `1px solid ${FILM_COLORS2.line}`, opacity: 0.7 - ri * 0.12 }} />
          ))}
          {/* 盘面 conic 反光（vinylSpin 150f/圈 · screen · 低透明） */}
          <div style={{ position: 'absolute', inset: 24, borderRadius: '50%', background: `conic-gradient(from ${spin}deg, transparent, ${FILM_COLORS2.paperWhite}, transparent 42%)`, opacity: 0.13, mixBlendMode: 'screen' }} />
          {/* 轴心 */}
          <div style={{ position: 'absolute', left: '50%', top: '50%', width: 12, height: 12, borderRadius: 6, transform: 'translate(-6px,-6px)', background: FILM_COLORS2.data, boxShadow: `0 0 18px 6px rgba(212,163,115,0.5)` }} />
          {/* 年份刻度环导引圆 + 八年节点（每到一年点亮 +3px · data · 辉光；未到 dataDim 低透明） */}
          <div style={{ position: 'absolute', left: 240 - RING_R, top: 240 - RING_R, width: RING_R * 2, height: RING_R * 2, borderRadius: '50%', border: `1px solid ${FILM_COLORS2.line}`, opacity: 0.3 }} />
          {YEAR_FAVS.map((y, i) => {
            const ang = -Math.PI / 2 + Math.PI / 8 + (i * Math.PI) / 4;
            const nx = 240 + Math.cos(ang) * RING_R;
            const ny = 240 + Math.sin(ang) * RING_R;
            const p = springIn(frame, flipAt(i), fps);
            const current = i === activeYear;
            const lx = 240 + Math.cos(ang) * (RING_R + 26);
            const ly = 240 + Math.sin(ang) * (RING_R + 26);
            return (
              <div key={y.year}>
                <div
                  style={{
                    position: 'absolute',
                    left: nx - (3 + p * 1.5),
                    top: ny - (3 + p * 1.5),
                    width: 6 + p * 3,
                    height: 6 + p * 3,
                    borderRadius: '50%',
                    background: p > 0.01 ? FILM_COLORS2.data : FILM_COLORS2.dataDim,
                    opacity: 0.35 + p * 0.6,
                    boxShadow: p > 0.01 ? `0 0 ${8 + p * 10}px rgba(212,163,115,${(current ? 0.5 + 0.15 * Math.sin(frame / 6) : 0.32) * p})` : 'none',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: lx - 30,
                    top: ly - 9,
                    width: 60,
                    textAlign: 'center',
                    fontFamily: fontFamilies.mono,
                    fontSize: 13,
                    letterSpacing: '0.08em',
                    fontVariantNumeric: 'tabular-nums',
                    color: p > 0.01 && current ? FILM_COLORS2.data : FILM_COLORS2.dataDim,
                    opacity: 0.35 + p * 0.6,
                    ...(p > 0.01 && current ? glowText(FILM_COLORS2.data, 0.35 + 0.15 * Math.sin(frame / 6)) : {}),
                  }}
                >
                  {y.year}
                </div>
              </div>
            );
          })}
          {/* 唱针（右侧竖臂 · top pivot）：62–74 落下对音 · needleSettle 收稳 · 168–178 微抬 +4° */}
          <div style={{ position: 'absolute', left: 452, top: 27, width: 20, height: 20, borderRadius: 10, border: `1.5px solid ${FILM_COLORS2.dataDim}`, opacity: 0.85 * needleOpacity }} />
          <div
            style={{
              position: 'absolute',
              left: 460,
              top: 36,
              width: 4,
              height: 240,
              borderRadius: 2,
              transformOrigin: 'top center',
              transform: `rotate(${needleAngle}deg)`,
              background: `linear-gradient(180deg, ${FILM_COLORS2.dataDim}, ${FILM_COLORS2.data})`,
              boxShadow: `0 0 10px rgba(212,163,115,0.4)`,
              opacity: needleOpacity,
            }}
          />
        </div>

        {/* ── timelineFlow 外环线（装饰化：整体 opacity×0.4） ── */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.4 }}>
          <div style={{ position: 'absolute', left: TL_X0, width: TL_X1 - TL_X0, top: TL_Y, height: 2, background: 'rgba(212,163,115,0.14)' }} />
          <div
            style={{
              position: 'absolute',
              left: TL_X0,
              top: TL_Y,
              height: 2.5,
              width: TL_X1 - TL_X0,
              background: `linear-gradient(90deg, ${FILM_COLORS2.dataDim}, ${FILM_COLORS2.data})`,
              boxShadow: `0 0 14px 3px rgba(212,163,115,0.35)`,
              opacity: 0.9,
              clipPath: `inset(0 ${Math.max(0, 1 - tl.progress) * 100}% 0 0)`,
            }}
          />
        </div>

        {/* ── 八年年谱条（114 入场 · 底部避让字幕安全区；翻到即 springIn 点亮；152 起整条微光呼吸） ── */}
        <div style={{ position: 'absolute', inset: 0, ...chrono }}>
          {YEAR_FAVS.map((y, i) => {
            const x = TL_X0 + i * NODE_GAP;
            const p = springIn(frame, flipAt(i), fps);
            const current = i === activeYear;
            return (
              <div key={y.year}>
                {/* 未到年份：只留极淡刻度线（line 色） */}
                <div style={{ position: 'absolute', left: x - 0.75, top: 775, width: 1.5, height: 14, background: FILM_COLORS2.line, opacity: (1 - p) * 0.55 }} />
                {/* 点亮节点（dot on baseline） */}
                <div
                  style={{
                    position: 'absolute',
                    left: x - 3.5,
                    top: 778.5,
                    width: 7,
                    height: 7,
                    borderRadius: 3.5,
                    background: p > 0.01 ? FILM_COLORS2.data : FILM_COLORS2.dataDim,
                    opacity: p,
                    transform: `scale(${0.4 + p * 0.6})`,
                    boxShadow: p > 0.01 ? `0 0 ${7 + breathe * 5}px rgba(212,163,115,${(current ? 0.45 + 0.12 * Math.sin(frame / 6) : 0.32 + breathe * 0.15) * p})` : 'none',
                  }}
                />
                {/* 年份 mono 13px（当前 data+辉光 / 已过 dataDim dim-lit / 未到隐藏） */}
                <div
                  style={{
                    position: 'absolute',
                    left: x - 60,
                    top: 750,
                    width: 120,
                    textAlign: 'center',
                    fontFamily: fontFamilies.mono,
                    fontSize: 13,
                    letterSpacing: '0.14em',
                    fontVariantNumeric: 'tabular-nums',
                    color: current ? FILM_COLORS2.data : FILM_COLORS2.dataDim,
                    opacity: p * (current ? 0.95 : 0.8),
                    ...(current && p > 0.01 ? glowText(FILM_COLORS2.data, 0.35 + breathe * 0.15) : {}),
                  }}
                >
                  {y.year}
                </div>
                {/* 歌名 serif 15px 小字 */}
                <div style={{ position: 'absolute', left: x - 98, top: 792, width: 196, textAlign: 'center', fontFamily: fontFamilies.serif, fontSize: 15, color: FILM_COLORS2.paperWhite, opacity: p * ((current ? 0.95 : 0.68) + breathe * 0.08), whiteSpace: 'nowrap' }}>
                  {y.song}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── EQ 三柱（74–84 起势 · 相位差常驻）+ 走带进度条（62–186 匀速走满） ── */}
        <div style={{ position: 'absolute', left: 1690, top: 380, display: 'flex', gap: 22, alignItems: 'flex-end' }}>
          {bars.map((v, i) => (
            <div
              key={i}
              style={{
                width: 30,
                height: eqGrow * (56 + v * 150),
                background: `linear-gradient(180deg, ${FILM_COLORS2.data}, ${FILM_COLORS2.dataDim})`,
                borderRadius: 3,
                boxShadow: `0 0 ${8 + v * 14}px rgba(212,163,115,${0.25 + v * 0.2})`,
                opacity: 0.9,
              }}
            />
          ))}
        </div>
        <div style={{ position: 'absolute', left: 1690, top: 620, width: 170, height: 3, borderRadius: 1.5, background: FILM_COLORS2.line, opacity: 0.6 }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${transport * 100}%`, borderRadius: 1.5, background: `linear-gradient(90deg, ${FILM_COLORS2.dataDim}, ${FILM_COLORS2.data})`, boxShadow: `0 0 8px rgba(212,163,115,0.4)` }} />
          <div style={{ position: 'absolute', left: transport * 170 - 3, top: -2.5, width: 6, height: 6, borderRadius: 3, background: FILM_COLORS2.data, boxShadow: `0 0 8px 2px rgba(212,163,115,0.5)`, opacity: transport > 0 ? 1 : 0 }} />
        </div>
      </CameraRig>

      {/* ── 数据雨帘（盘之后 · HUD 之前） ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 24, pointerEvents: 'none' }}>
        {dataCurtain('s33-rain', frame, 12, 130).map((c, i) => (
          <span key={i} style={{ position: 'absolute', left: `${c.x}%`, top: c.y, fontFamily: fontFamilies.mono, fontSize: 13, color: FILM_COLORS2.data, opacity: c.o }}>
            {c.text}
          </span>
        ))}
      </div>

      {/* ── 点击涟漪 + 粒子（12 · 盘心） ── */}
      <div style={{ position: 'absolute', left: hoverX, top: hoverY, zIndex: 26, pointerEvents: 'none' }}>
        {ripple ? <div style={ripple.ring1} /> : null}
        {ripple ? <div style={ripple.ring2} /> : null}
        {sparks.map((s, i) => (
          <div key={i} style={s.style} />
        ))}
      </div>

      {/* ── 光标（琥珀光点 · 屏空间演员） ── */}
      <div
        style={{
          position: 'absolute',
          left: curX - 6,
          top: curY - 6,
          width: 12,
          height: 12,
          borderRadius: 6,
          background: FILM_COLORS2.data,
          boxShadow: `0 0 14px rgba(212,163,115,0.8)`,
          opacity: curFade,
          transform: `scale(${curScale})`,
          zIndex: 27,
          pointerEvents: 'none',
        }}
      />

      <Rail lit={lit} at={at} cursorP={cursorP} frame={frame} />
      <HudChrome label="wuh.site · MUSIC" readout={activeYear >= 0 ? `YEAR-FAV · ${fav.year} · ${activeYear + 1}/8` : 'YEAR-FAV · STANDBY'} />
      <Grade2 id="GR2-06" />
      <SeqCaption text="时间的年轮，刻着每一年的歌。" from={20} to={106} />
      <SeqCaption text="黑胶还在转，时光没走远。" from={112} to={168} />
    </AbsoluteFill>
  );
};

export default S33;
