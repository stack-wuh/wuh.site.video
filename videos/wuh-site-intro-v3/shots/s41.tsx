/* S41 · Act 6 入院 · 局部帧 [0,60) · 60f · 绝对 5554–5614
 *
 * V3 内容本体化重做（2026-11-12 审计返工单：漫游连击 3/5 —— /guestbook 页数据件主场）：
 * 网站截图全删（页面快照零引用，§3），主角 = DATA.issues 144 张碎片知识数据件
 * （24×6 碎片芯片阵列，dashed 芯片语言与 s55 的 Issues 芯片同族——呼应「先写在 Issue 里」）。
 * 巡礼快切连拍共享轨道：Rail 01–07 亮 / 光标 08 位推进至 0.5（s40=0.2 → s42=0.8）。
 * 编排四问：
 *  承接：首帧 = s40 交出的「漫游中·卡 2 过」——光标演员自下缘升起扫入，延续漫游纵移动势；
 *  触发：光标第 8f 点击画面中心 → 144 张碎片芯片受命点亮、大数字开滚；
 *  展开：帧级节奏表（见下）——bigNum 滚动 + dotCascade(144, accel, 10→52) 碎片阵列前疏后密点亮
 *        （accel 末点对齐落定拍）→ 落定瞬间 shockwave + sparkBurst + sheenSweep → Issue 芯片 springIn；
 *  交接：尾帧整组上飘余速（卡 3 过、下一卡自上而入在即），阵列呼吸微动不断。
 * 逐拍帧表（fps=30）：
 *  [0–8]   光标自下缘 (960,1120) 升至 (960,300)；Rail 光标 0.5 位；
 *  [8]     点击 ripple；
 *  [8–36]  bigNum 0→144（DATA.issues）滚动 28f，落定 36；
 *  [10–52] 144 张碎片芯片 dotCascade accel 点亮（每枚落定 flash 闪一次）；
 *  [36]    落定瞬间：shockwave 双环 + sparkBurst('s41-burst') 金粒 + sheenSweep(36,12)；
 *  [40–56] ISSUE #144 芯片 springIn 弹入（呼应 s55「先写在 Issue 里」）；HUD → 144 ISSUES；
 *  [52–60] 尾帧交接：整组 translateY 余速 -24px，阵列呼吸不停。
 * 时间轴零改动：60f / 无字幕 / endFrameDesc「/guestbook 卡过（漫游中·卡 3 过）」语义原样；
 * 无 <Sequence>；random(seed) only（dotCascade/sparkBurst 内建确定性）；springIn fps 取 useVideoConfig；
 * 色板只用 FILM_COLORS2 族。转场：入「切」，出「切」。镜内文字最低点 y≈812 < 930 安全线。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import {
  bigNum,
  dotCascade,
  FILM_COLORS2,
  fmtNum,
  glowText,
  handheld,
  inkCursor,
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
const ROLL_DUR = 28;
const LAND_AT = ROLL_START + ROLL_DUR; // 36
const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const RAIL_PITCH = 74;
const CURSOR_FROM = { x: 960, y: 1120 };
const CURSOR_TO = { x: 960, y: 300 };
/* 144 张碎片芯片 = 24 列 × 6 行 */
const FRAG_COLS = 24;
const FRAG_ROWS = 6;
const CELL_W = 46;
const CELL_H = 34;
const PITCH_X = 58;
const PITCH_Y = 46;
const GRID_W = (FRAG_COLS - 1) * PITCH_X + CELL_W; // 1380
const GRID_LEFT = (1920 - GRID_W) / 2; // 270
const GRID_TOP = 490;
const DATA_ISSUES = 144;

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

const S41: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  /* 主角大数字（8–36 滚动） */
  const hero = bigNum(frame, ROLL_START, ROLL_DUR, 0, DATA_ISSUES);
  /* 落定瞬间（36） */
  const wave = shockwave(frame, LAND_AT, '212,163,115');
  const burst = sparkBurst('s41-burst', frame, LAND_AT, 16, true);
  /* 碎片芯片点亮表（10–52 accel，随帧求 land/flash） */
  const frags = dotCascade(frame, DATA_ISSUES, 'accel', 10, 52);
  /* 光标演员：0–8 自下缘升起，8 点击，18–26 退场 */
  const cursor = inkCursor(frame, CURSOR_FROM, CURSOR_TO, 0, 8, 8);
  const dotOpacity = typeof cursor.dot.opacity === 'number' ? cursor.dot.opacity : 1;
  const cursorFade = interpolate(frame, [18, 26], [1, 0], CLAMP);
  /* Issue 芯片（40 弹入，呼应 s55） */
  const chipIn = springIn(frame, 40, fps, 15, 190, 0.8);
  /* 尾帧交接：整组上飘余速 */
  const drift = interpolate(frame, [52, TOTAL], [0, -24], CLAMP);
  const shake = handheld('s41-cam', frame, 0.8);
  const cam = {
    scale: interpolate(frame, [0, TOTAL], [1.04, 1.02], { ...CLAMP, easing: CURVES.cineEaseInOut }),
    x: shake.dx,
    y: shake.dy,
    rot: shake.rot,
  };

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s41v2" stars={52} grid horizon />
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <div style={{ position: 'absolute', inset: 0, transform: `translateY(${drift}px)`, zIndex: 28 }}>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center', zIndex: 30 }}>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 15, letterSpacing: '0.4em', color: FILM_COLORS2.textMuted }}>ROAM · /GUESTBOOK · ISSUES</span>
            </div>

            {/* 主角：全屏大数字 0→144（8–36 滚动；36 落定 SLAM 辉光 + 金光扫过） */}
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
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 18, letterSpacing: '0.5em', color: FILM_COLORS2.textMuted, opacity: interpolate(frame, [LAND_AT, LAND_AT + 10], [0, 0.9], CLAMP) }}>
                张碎片知识 · <span style={{ color: FILM_COLORS2.gold }}>先写在 Issue 里</span>
              </span>
            </div>

            {/* 落定瞬间（36）：双环 + 金粒锚在大数字视觉中心（top 195+110≈305） */}
            {frame >= LAND_AT ? (
              <div style={{ position: 'absolute', left: '50%', top: 305, width: 0, height: 0, zIndex: 30, pointerEvents: 'none' }}>
                {wave ? <div style={wave.ring1} /> : null}
                {wave ? <div style={wave.ring2} /> : null}
                {burst.map((p, i) => (
                  <div key={i} style={p.style} />
                ))}
              </div>
            ) : null}

            {/* 144 张碎片知识芯片阵列（10–52 dotCascade accel 点亮；dashed 芯片语言同 s55 Issues） */}
            <div style={{ position: 'absolute', left: GRID_LEFT, top: GRID_TOP, zIndex: 29 }}>
              {Array.from({ length: FRAG_ROWS }).map((_r, row) =>
                Array.from({ length: FRAG_COLS }).map((_c, col) => {
                  const i = row * FRAG_COLS + col;
                  const f = frags[i];
                  const on = frame >= f.land;
                  const breath = on ? 0.7 + 0.3 * Math.sin(frame / 13 + i * 0.6) : 0;
                  return (
                    <div
                      key={i}
                      style={{
                        position: 'absolute',
                        left: col * PITCH_X,
                        top: row * PITCH_Y,
                        width: CELL_W,
                        height: CELL_H,
                        borderRadius: 4,
                        border: `1px dashed ${on ? FILM_COLORS2.data : FILM_COLORS2.line}`,
                        background: on ? `rgba(212,163,115,${0.05 + f.flash * 0.14 + breath * 0.03})` : 'transparent',
                        boxShadow: f.flash > 0.4 ? `0 0 ${6 + f.flash * 8}px rgba(212,163,115,${f.flash * 0.4})` : 'none',
                        opacity: on ? 1 : 0.35,
                      }}
                    />
                  );
                }),
              )}
              {/* ISSUE #144 芯片（40 springIn，呼应 s55「先写在 Issue 里」） */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: FRAG_ROWS * PITCH_Y + 14,
                  padding: '4px 14px',
                  borderRadius: 4,
                  border: `1px dashed ${FILM_COLORS2.gold}`,
                  opacity: Math.min(1, chipIn * 1.4),
                  transform: `translateY(${(1 - chipIn) * 14}px)`,
                }}
              >
                <span style={{ fontFamily: fontFamilies.mono, fontSize: 13, letterSpacing: '0.24em', color: FILM_COLORS2.gold, ...glowText(FILM_COLORS2.gold, 0.25) }}>{`ISSUE #${fmtNum(DATA_ISSUES)} · 先写在 Issue 里`}</span>
              </div>
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

      <Rail lit={7} at={8} cursorP={0.5} frame={frame} />
      <HudChrome label="wuh.site · ROAM" readout={frame >= LAND_AT ? `03/05 · /GUESTBOOK · ${fmtNum(DATA_ISSUES)} ISSUES` : '03/05 · /GUESTBOOK · ROLLING…'} />
      <Grade2 id="GR2-06" />
    </AbsoluteFill>
  );
};

export default S41;
