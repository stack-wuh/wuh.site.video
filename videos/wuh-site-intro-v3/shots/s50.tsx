/* S50 · Act 8 此刻 · 局部帧 [0,100) · 100f · 绝对 6854–6954
 *
 * 审计重定义（2026-11-12 批次 E 返工单）：技术升级主场 = 版本演进轴 + 118 版本雨，
 * 两段各占其半（100f 紧，节奏拉满）。里程碑 tag 全部真实依据：
 * v2.0.0 · 2024-12-08（本镜既有站点 release 锚）；v7.4.0 · workflow（DATA.workflowVersion）；
 * 2026-08-22 · release 脚本（Caption 事实「八月，发布脚本落地」，无版本号 → 以日期节点表达）；
 * v1.9.0 · CLI（DATA.cliVersion）；不编造任何中间版本号。
 *
 * 编排四问：
 * ① 承接——s49 尾帧交出「星轨环微光」：0–16 环收紧成时间轴基线，基线自左向右描画成演进轴。
 * ② 触发——数据针自轴起点依次点亮四枚里程碑 tag（springIn 弹出，前疏后密），轴自己会「走」。
 * ③ 展开——两段各半：前半 [0–48] 演进轴（kicker 键击 + 四 tag 错峰弹出）；
 *   后半 [46–86] bigNum 0→118 滚动（★DAT-01，落定 86=绝对 6940=ANCHORS.versionRainEnd=拍347 对音）
 *   + 118 枚版本雨 versionDotLand 逐枚斜落（FX-02 accel 越落越快），落定即闪；
 *   落定瞬间 86：暖金冲击波双环 + 金粒喷洒（FX-03/04）+ 数字 SLAM 辉光（token 自带）。
 * ④ 交接——尾帧：雨歇、时间轴密布光点（manifest endFrameDesc 契约「交接态：光点密轴」原样）。
 *
 * 逐拍帧表（局部帧，fps=30）：
 * [0–14]    星轨环残影收紧（scale 0.6→1 / opacity→0）+ 时间轴基线 scaleX 0→1 描画（2–16）；
 * [12–36]   kicker「VERSION TIMELINE · 2024-12-08 → 2026-11-08」typeCharsAt 键击（2 字/f）+ 键击光标；
 * [10/20/30/40] 四枚里程碑 tag springIn 依次弹出（轴上下交替，node dot 同帧点亮+闪）；
 * [46–86]   bigNum 0→118 滚动（46+40=86=拍347）；118 枚 versionDotLand 雨 staggerLand(118,50,36,accel)
 *           → 末颗 86 与数字同拍落定；[80–94] sheenSweep 金光扫过大数字；
 * [86]      暖金双环 + sparkBurst('s50-burst',16 金粒) + 2026-11-08 止点标签显影；
 * [88–100]  副标「个版本 · 两个半月」显影；雨歇，密轴 + 数字辉光呼吸 = 交接态。
 * 时间轴零改动：100f / 落定 86（拍347）/ Caption（文本+appearAt 14）原样；无 <Sequence>；
 * FILM_COLORS2 only；random(seed) only；springIn fps 取 useVideoConfig()。
 * 转场：入「切」，出「切」。字幕安全窗：start≥12、end≤88。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import {
  DATA,
  FILM_COLORS2,
  bigNum,
  cursorBlink,
  glowText,
  sheenSweep,
  shockwave,
  sparkBurst,
  springIn,
  staggerLand,
  typeCharsAt,
  versionDotLand,
} from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 100;
const V_TOTAL = DATA.tags; // 119
const V_RAIN = DATA.versions; // 118
const RAIN_END = 86; // 末颗 = 拍347 = ANCHORS.versionRainEnd(6940) = 大数字落定（对音，窗口不动）
const ROLL_START = 46;
const AXIS_Y = 640;
const KICKER = 'VERSION TIMELINE · 2024-12-08 → 2026-11-08';

/* 演进轴里程碑（真实依据见头注；y=0 挂轴上方 / y=1 挂轴下方交替） */
const MILESTONES: Array<{ tag: string; sub: string; x: number; below: boolean; delay: number; gold?: boolean }> = [
  { tag: 'v2.0.0', sub: '2024-12-08 · 站点 release', x: 180, below: true, delay: 10, gold: true },
  { tag: 'v7.4.0', sub: 'workflow · 方法', x: 620, below: false, delay: 20 },
  { tag: '2026-08-22', sub: 'release 脚本落地', x: 1040, below: true, delay: 30 },
  { tag: 'v1.9.0', sub: 'CLI · 工具', x: 1380, below: false, delay: 40 },
];

const RAIN_LANDS = staggerLand(V_RAIN, 50, RAIN_END - 50, 'accel');

const S50: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ringIn = interpolate(frame, [0, 16], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const axisP = interpolate(frame, [2, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const typed = typeCharsAt(frame, KICKER.length, 12, 0.5);
  /* 主角：全屏大数字 0→118（46–86 滚动，落定=拍347，与末颗版本光点同拍） */
  const hero = bigNum(frame, ROLL_START, RAIN_END - ROLL_START, 0, V_RAIN);
  /* 落定瞬间（86）：暖金双环 + 金粒，锚在大数字视觉中心 */
  const wave = shockwave(frame, RAIN_END, '233,217,174');
  const burst = sparkBurst('s50-burst', frame, RAIN_END, 16, true);
  const cam = {
    scale: 1.06,
    x: interpolate(frame, [0, TOTAL], [60, -60], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    y: interpolate(frame, [0, TOTAL], [-30, 10], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    rot: 0,
  };

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DeepSpace seed="s50v2" stars={56} grid horizon />

          {/* 星轨环收紧（0–16 残影，承接 s49） */}
          {ringIn > 0 ? (
            <div
              style={{
                position: 'absolute',
                left: 700,
                top: 300,
                width: 520,
                height: 520,
                borderRadius: 260,
                border: `1.5px solid ${FILM_COLORS2.data}`,
                boxShadow: `0 0 40px rgba(212,163,115,${0.3 * ringIn})`,
                opacity: ringIn * 0.5,
                transform: `scale(${0.6 + ringIn * 0.4})`,
              }}
            />
          ) : null}

          {/* kicker 键击逐字（12–36）+ 键击光标 */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 84, textAlign: 'center', zIndex: 30, whiteSpace: 'pre' }}>
            <span style={{ fontFamily: fontFamilies.mono, fontSize: 15, letterSpacing: '0.4em', color: FILM_COLORS2.textMuted }}>{KICKER.slice(0, typed)}</span>
            {frame >= 12 && typed < KICKER.length ? (
              <span
                style={{
                  display: 'inline-block',
                  width: 9,
                  height: 16,
                  marginLeft: 6,
                  verticalAlign: '-2px',
                  background: FILM_COLORS2.textMuted,
                  opacity: cursorBlink(frame, 12, 4, 4) ? 0.9 : 0.25,
                }}
              />
            ) : null}
          </div>

          {/* 主角：全屏大数字 0→118（46–86 滚动，落定 SLAM 辉光；80–94 金光横扫） */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 130,
              textAlign: 'center',
              zIndex: 30,
              fontFamily: fontFamilies.mono,
              fontSize: 250,
              fontWeight: 700,
              lineHeight: 1.05,
              color: FILM_COLORS2.data,
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '0.02em',
              opacity: interpolate(frame, [ROLL_START, 58], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
              transform: `scale(${hero.slam})`,
              ...glowText(FILM_COLORS2.data, hero.glow),
            }}
          >
            {hero.text}
            <div style={sheenSweep(frame, 80, 14)} />
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 420, textAlign: 'center', zIndex: 30 }}>
            <span style={{ fontFamily: fontFamilies.mono, fontSize: 18, letterSpacing: '0.5em', color: FILM_COLORS2.textMuted, opacity: interpolate(frame, [88, 98], [0, 0.9], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>个版本 · 两个半月</span>
          </div>

          {/* 演进轴基线（2–16 自左向右描画）+ 刻度 */}
          <div style={{ position: 'absolute', left: 140, top: AXIS_Y, height: 2, width: 1640, transformOrigin: 'left center', transform: `scaleX(${axisP})`, background: FILM_COLORS2.line, opacity: 0.55 }} />
          {Array.from({ length: 17 }).map((_, i) => (
            <div key={i} style={{ position: 'absolute', left: 200 + i * 94, top: AXIS_Y - 4, width: 1, height: 10, background: FILM_COLORS2.line, opacity: 0.4 * axisP }} />
          ))}

          {/* 四枚里程碑 tag：springIn 依次弹出（10/20/30/40），node dot 同帧点亮 + 闪一次 */}
          {MILESTONES.map((m) => {
            const p = springIn(frame, m.delay, fps);
            const flash = interpolate(frame, [m.delay, m.delay + 2, m.delay + 9], [0, 0.9, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            const c = m.gold ? FILM_COLORS2.gold : FILM_COLORS2.data;
            return (
              <div key={m.tag} style={{ position: 'absolute', left: m.x, top: AXIS_Y + (m.below ? 12 : -96), opacity: Math.min(1, p * 1.5), transform: `translateY(${(m.below ? 1 : -1) * (1 - p) * 20}px) scale(${0.9 + p * 0.1})` }}>
                <div
                  style={{
                    display: 'inline-flex',
                    flexDirection: 'column',
                    gap: 3,
                    padding: '8px 14px',
                    borderRadius: 6,
                    border: `1px solid ${m.gold ? FILM_COLORS2.gold : FILM_COLORS2.dataDim}`,
                    background: FILM_COLORS2.panel,
                    boxShadow: `0 0 ${10 + flash * 18}px rgba(${m.gold ? '233,217,174' : '212,163,115'},${0.14 + flash * 0.3})`,
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span style={{ fontFamily: fontFamilies.mono, fontSize: 21, color: FILM_COLORS2.paperWhite, opacity: 0.94 }}>{m.tag}</span>
                  <span style={{ fontFamily: fontFamilies.mono, fontSize: 12, letterSpacing: '0.14em', color: FILM_COLORS2.textMuted }}>{m.sub}</span>
                </div>
                <div
                  style={{
                    position: 'absolute',
                    left: 16,
                    top: m.below ? -18 : 90,
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    background: c,
                    boxShadow: flash > 0.15 ? `0 0 12px 3px rgba(${m.gold ? '233,217,174' : '212,163,115'},${flash * 0.6})` : `0 0 6px rgba(${m.gold ? '233,217,174' : '212,163,115'},0.4)`,
                  }}
                />
              </div>
            );
          })}

          {/* 落定瞬间（86）：暖金双环 + 金粒，锚在大数字视觉中心（top 130+132≈262，水平居中） */}
          {frame >= RAIN_END ? (
            <div style={{ position: 'absolute', left: '50%', top: 262, width: 0, height: 0, zIndex: 30, pointerEvents: 'none' }}>
              {wave ? <div style={wave.ring1} /> : null}
              {wave ? <div style={wave.ring2} /> : null}
              {burst.map((p, i) => (
                <div key={i} style={p.style} />
              ))}
            </div>
          ) : null}

          {/* 118 枚版本雨（versionDotLand 斜落 + accel 越落越快，每颗落定闪一次；末颗 86=拍347） */}
          {RAIN_LANDS.map((land, i) => {
            if (frame < land) return null;
            const dot = versionDotLand(frame, land, `s50-dot-${i}`);
            const x = 210 + (i / V_RAIN) * 1450 + dot.drift * 0.5;
            const y = AXIS_Y - 8 + dot.y;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: x,
                  top: y,
                  width: 7,
                  height: 7,
                  borderRadius: 3.5,
                  background: FILM_COLORS2.data,
                  opacity: 0.5 + dot.flash * 0.5,
                  boxShadow: dot.flash > 0.2 ? `0 0 10px 2px rgba(212,163,115,${dot.flash * 0.55})` : `0 0 5px rgba(212,163,115,0.22)`,
                }}
              />
            );
          })}
          {/* 雨幕止点 2026-11-08 */}
          <span style={{ position: 'absolute', left: 1668, top: AXIS_Y + 28, fontFamily: fontFamilies.mono, fontSize: 15, color: FILM_COLORS2.data, opacity: interpolate(frame, [RAIN_END, TOTAL], [0, 0.75], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>2026-11-08</span>
          <span style={{ position: 'absolute', left: 180, top: AXIS_Y + 60, fontFamily: fontFamilies.mono, fontSize: 15, letterSpacing: '0.2em', color: FILM_COLORS2.textMuted, opacity: 0.55 }}>{V_TOTAL} TAGS</span>
        </AbsoluteFill>
      </CameraRig>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 300, backgroundImage: `linear-gradient(180deg, transparent, ${FILM_COLORS2.spaceDeep})`, opacity: 0.24 }} />
      <HudChrome label="wuh.site · RELEASES" readout={frame < 46 ? 'TIMELINE · MILESTONES' : frame < RAIN_END ? 'ROLLING · VERSIONS' : '118 VERSIONS · 2.5 MONTHS'} />
      <Grade2 id="GR2-08" />
      <Caption text="八月，发布脚本落地。两个半月，118 个版本。" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S50;
