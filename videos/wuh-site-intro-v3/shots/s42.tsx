/* S42 · Act 6 入院 · 局部帧 [0,60) · 60f · 绝对 5614–5674
 *
 * V3 内容本体化重做（2026-11-12 审计返工单：漫游连击 4/5 —— /footprint 页数据件主场）：
 * 网站截图全删（页面快照零引用，§3），主角 = DATA.visits 10,760 访问数据件——
 * 「走过的足迹」= 访问的脚步：折线路径 pathDraw 生长 + 16 枚足步点 dotCascade accel 沿线落下
 * （每步落定闪一次），两枚真实足迹坐标微缩件（杨梅坑 · 2025-08 / 梧桐山 · 2025-09，
 * 与 s23/s37 同源回响）挂上路径节点。
 * 巡礼快切连拍共享轨道：Rail 01–07 亮 / 光标 08 位推进至 0.8（s40=0.2 → s41=0.5 → s43 收官点亮）。
 * 编排四问：
 *  承接：首帧 = s41 交出的「漫游中·卡 3 过」——光标演员自上缘沉入，延续漫游纵移动势；
 *  触发：光标第 8f 点击画面中心 → 访问大数字开滚、足迹路径受命生长；
 *  展开：帧级节奏表（见下）——bigNum 滚动 + 路径描画 + 足步点前疏后密落位 → 落定瞬间
 *        shockwave + sparkBurst + sheenSweep → 两枚坐标微缩件 springIn 挂点；
 *  交接：尾帧整组下沉余速（卡 4 过、s43 末卡回正在即），足步点呼吸微动不断。
 * 逐拍帧表（fps=30）：
 *  [0–8]   光标自上缘 (960,-80) 沉至 (960,300)；Rail 光标 0.8 位；
 *  [8]     点击 ripple；
 *  [8–46]  bigNum 0→10,760（DATA.visits）滚动 38f，落定 46；
 *  [10–52] 足迹折线 pathDraw(10,42) 生长 + 16 枚足步点 dotCascade(16,accel,10→52) 落位闪；
 *  [46]    落定瞬间：shockwave 双环 + sparkBurst('s42-burst') 金粒 + sheenSweep(46,12)；
 *  [46/52] 两枚坐标微缩件 springIn 弹入（杨梅坑 46 / 梧桐山 52）；HUD → 10,760 VISITS；
 *  [52–60] 尾帧交接：整组 translateY 余速 +26px，足步点呼吸不停。
 * 时间轴零改动：60f / 无字幕 / endFrameDesc「/footprint 卡过（漫游中·卡 4 过）」语义原样；
 * 无 <Sequence>；random(seed) only；springIn fps 取 useVideoConfig；色板只用 FILM_COLORS2 族。
 * 转场：入「切」，出「切」。镜内文字最低点 y≈790 < 930 安全线。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import {
  bigNum,
  DATA,
  dotCascade,
  FILM_COLORS2,
  fmtNum,
  glowText,
  handheld,
  inkCursor,
  pathDraw,
  sheenSweep,
  shockwave,
  sparkBurst,
  springIn,
} from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 60;
const ROLL_START = 8;
const ROLL_DUR = 38;
const LAND_AT = ROLL_START + ROLL_DUR; // 46
const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const RAIL_PITCH = 74;
const CURSOR_FROM = { x: 960, y: -80 };
const CURSOR_TO = { x: 960, y: 300 };

/* 足迹折线：16 枚足步点（确定性布点，y 沿正弦起伏 + random(seed) 微漂移） */
const STEPS = Array.from({ length: 16 }, (_, i) => ({
  x: 240 + i * 96,
  y: 700 + Math.sin(i * 0.9) * 64 + (random(`s42-step-${i}`) - 0.5) * 24,
}));
const TRAIL_D = `M ${STEPS.map((p) => `${p.x} ${p.y}`).join(' L ')}`;
/* 两枚真实足迹坐标（与 s23/s37 同源：杨梅坑 2025-08 / 梧桐山 2025-09） */
const PIN_A = { at: 4, land: 46, label: '杨梅坑 · 2025-08' };
const PIN_B = { at: 11, land: 52, label: '梧桐山 · 2025-09' };

/** V2 模块轨道（巡礼共享语言，与 s37/s38 同款式） */
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

const S42: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  /* 主角大数字（8–46 滚动） */
  const hero = bigNum(frame, ROLL_START, ROLL_DUR, 0, DATA.visits);
  /* 落定瞬间（46） */
  const wave = shockwave(frame, LAND_AT, '212,163,115');
  const burst = sparkBurst('s42-burst', frame, LAND_AT, 16, true);
  /* 足迹路径描画（10–52）+ 足步点落位表 */
  const trail = pathDraw(frame, 10, 42, TRAIL_D);
  const lands = dotCascade(frame, 16, 'accel', 10, 52);
  /* 光标演员：0–8 自上缘沉入，8 点击，18–26 退场 */
  const cursor = inkCursor(frame, CURSOR_FROM, CURSOR_TO, 0, 8, 8);
  const dotOpacity = typeof cursor.dot.opacity === 'number' ? cursor.dot.opacity : 1;
  const cursorFade = interpolate(frame, [18, 26], [1, 0], CLAMP);
  /* 两枚坐标微缩件 springIn */
  const pinAIn = springIn(frame, PIN_A.land, fps, 15, 190, 0.8);
  const pinBIn = springIn(frame, PIN_B.land, fps, 15, 190, 0.8);
  /* 尾帧交接：整组下沉余速 */
  const drift = interpolate(frame, [52, TOTAL], [0, 26], CLAMP);
  const shake = handheld('s42-cam', frame, 0.8);
  const cam = {
    scale: interpolate(frame, [0, TOTAL], [1.04, 1.02], { ...CLAMP, easing: CURVES.cineEaseInOut }),
    x: shake.dx,
    y: shake.dy,
    rot: shake.rot,
  };

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s42v2" stars={52} grid horizon />
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <div style={{ position: 'absolute', inset: 0, transform: `translateY(${drift}px)`, zIndex: 28 }}>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center', zIndex: 30 }}>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 15, letterSpacing: '0.4em', color: FILM_COLORS2.textMuted }}>ROAM · /FOOTPRINT · VISITS</span>
            </div>

            {/* 主角：全屏大数字 0→10,760（8–46 滚动；46 落定 SLAM 辉光 + 金光扫过） */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 195,
                textAlign: 'center',
                zIndex: 30,
                fontFamily: fontFamilies.mono,
                fontSize: 210,
                fontWeight: 700,
                lineHeight: 1.05,
                color: FILM_COLORS2.data,
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '0.02em',
                opacity: interpolate(frame, [ROLL_START, ROLL_START + 12], [0, 1], CLAMP),
                transform: `translateY(${interpolate(frame, [ROLL_START, ROLL_START + 14], [-18, 0], CLAMP)}px) scale(${hero.slam})`,
                ...glowText(FILM_COLORS2.data, hero.glow),
              }}
            >
              {hero.text}
              <div style={sheenSweep(frame, LAND_AT, 12)} />
            </div>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 435, textAlign: 'center', zIndex: 30 }}>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 18, letterSpacing: '0.5em', color: FILM_COLORS2.textMuted, opacity: interpolate(frame, [LAND_AT, LAND_AT + 10], [0, 0.9], CLAMP) }}>次访问 · 走过的足迹</span>
            </div>

            {/* 落定瞬间（46）：双环 + 金粒锚在大数字视觉中心（top 195+110≈305） */}
            {frame >= LAND_AT ? (
              <div style={{ position: 'absolute', left: '50%', top: 305, width: 0, height: 0, zIndex: 30, pointerEvents: 'none' }}>
                {wave ? <div style={wave.ring1} /> : null}
                {wave ? <div style={wave.ring2} /> : null}
                {burst.map((p, i) => (
                  <div key={i} style={p.style} />
                ))}
              </div>
            ) : null}

            {/* 足迹折线（10–52 pathDraw 生长）+ 16 枚足步点（dotCascade accel 落位闪） */}
            <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, zIndex: 29, pointerEvents: 'none' }}>
              <path d={TRAIL_D} fill="none" stroke={FILM_COLORS2.data} strokeWidth={2.5} strokeLinecap="round" opacity={0.85} strokeDasharray={trail.strokeDasharray} strokeDashoffset={trail.strokeDashoffset} />
              <path d={TRAIL_D} fill="none" stroke="rgba(212,163,115,0.16)" strokeWidth={9} strokeLinecap="round" strokeDasharray={trail.strokeDasharray} strokeDashoffset={trail.strokeDashoffset} />
            </svg>
            <div style={{ position: 'absolute', inset: 0, zIndex: 30, pointerEvents: 'none' }}>
              {STEPS.map((p, i) => {
                const l = lands[i];
                const on = frame >= l.land;
                const breath = on ? 1 + 0.18 * Math.sin(frame / 12 + i * 0.7) : 1;
                return (
                  <div key={i} style={{ position: 'absolute', left: p.x - 7 * breath, top: p.y - 7 * breath, width: 14 * breath, height: 14 * breath, borderRadius: 7 * breath, background: on ? FILM_COLORS2.data : FILM_COLORS2.dataDim, opacity: on ? 0.9 : 0, boxShadow: `0 0 ${6 + l.flash * 12}px rgba(212,163,115,${0.3 + l.flash * 0.4})` }} />
                );
              })}
              {/* 两枚真实足迹坐标微缩件（springIn 挂点；与 s23/s37 同源回响） */}
              {[{ pin: PIN_A, inn: pinAIn }, { pin: PIN_B, inn: pinBIn }].map(({ pin, inn }, k) => {
                const p = STEPS[pin.at];
                return (
                  <div key={k} style={{ position: 'absolute', left: p.x, top: p.y, opacity: Math.min(1, inn * 1.5), transform: `translateY(${(1 - inn) * 16}px)` }}>
                    <div style={{ position: 'absolute', left: -13, top: -13, width: 26, height: 26, borderRadius: 13, border: `2px solid ${FILM_COLORS2.gold}`, boxShadow: `0 0 14px rgba(233,217,174,0.5), inset 0 0 8px rgba(233,217,174,0.2)` }} />
                    <span style={{ position: 'absolute', left: 16, top: -40, fontFamily: fontFamilies.mono, fontSize: 13, color: FILM_COLORS2.paperWhite, whiteSpace: 'nowrap', opacity: 0.9, ...glowText(FILM_COLORS2.paperWhite, 0.22, '245,240,232') }}>{pin.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 光标演员（0–26） */}
          <div style={{ ...cursor.dot, opacity: dotOpacity * cursorFade, zIndex: 33 }} />
          {frame >= 8 && cursor.ripple < 1 ? (
            <div
              style={{
                position: 'absolute',
                left: CURSOR_TO.x - (10 + cursor.ripple * 46),
                top: CURSOR_TO.y - (10 + cursor.ripple * 46),
                width: 20 + cursor.ripple * 92,
                height: 20 + cursor.ripple * 92,
                borderRadius: '50%',
                border: `2px solid ${FILM_COLORS2.data}`,
                opacity: (1 - cursor.ripple) * 0.7,
                zIndex: 33,
              }}
            />
          ) : null}
        </AbsoluteFill>
      </CameraRig>

      <Rail lit={7} at={8} cursorP={0.8} frame={frame} />
      <HudChrome label="wuh.site · ROAM" readout={frame >= LAND_AT ? `04/05 · /FOOTPRINT · ${fmtNum(DATA.visits)} VISITS` : '04/05 · /FOOTPRINT · ROLLING…'} />
      <Grade2 id="GR2-06" />
    </AbsoluteFill>
  );
};

export default S42;
