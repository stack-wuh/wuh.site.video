/* 镜 35 · Act 6 入院 · 局部帧 [0,150) · 150f
   16+118+16：S34 钤印红光余晖里面板显影（litSet=∅）→ 墨点光标自面板中央移到块 1、悬停、点击涟漪
   → 窗口最大化；持续：首页 Hero write-fade + 46 枚墨点 2 拍扫过 + hover 条目染色左移；
   出场：反向收束回块 1（点亮），光标移向块 2。字幕「四十六篇文章，一枚枚墨点。」。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, DATA, inkRise, inkTimeline, hoverShift, writeFade } from '../motion-tokens';
import { Caption } from '../components/Caption';
import { ConsoleCursor, ConsolePanel, ConsoleWindow, TILE_RECTS } from '../components/Console';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const DUR = 150;
const IN = 16;
const OUT = DUR - IN; // 98
const CLICK = 9;
const TILE = 0;
const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

const mono = fontFamilies.mono;
const serif = fontFamilies.serif;

const tileCenter = (i: number) => ({ x: TILE_RECTS[i].x + TILE_RECTS[i].w / 2, y: TILE_RECTS[i].y + TILE_RECTS[i].h / 2 });

const ENTRIES = [
  { date: '2026-07-05', title: '再读《坐忘歌》' },
  { date: '2026-06-21', title: '重启计划' },
  { date: '2022-02-08', title: '2022 年度总结' },
  { date: '2021-05-07', title: '搬山计划' },
];

const CaptionPlate: FC<{ appearAt: number }> = ({ appearAt }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [appearAt, appearAt + 16], [0, 1], CLAMP);
  return (
    <div
      style={{
        position: 'absolute',
        left: 380,
        right: 380,
        bottom: 96,
        height: 200,
        background: `linear-gradient(180deg, transparent, ${colors.bg} 20%, ${colors.bg} 80%, transparent)`,
        opacity: p * 0.5,
        pointerEvents: 'none',
      }}
    />
  );
};

const ShotHomeTimeline: FC = () => {
  const frame = useCurrentFrame();
  const to = tileCenter(TILE);
  const next = tileCenter(TILE + 1);
  const panelCenter = { x: 960, y: 540 };

  const cursorIn = interpolate(frame, [0, 7], [0, 1], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const cursorOut = interpolate(frame, [OUT + 6, DUR], [0, 1], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const cx = frame < OUT + 6 ? panelCenter.x + (to.x - panelCenter.x) * cursorIn : to.x + (next.x - to.x) * 0.34 * cursorOut;
  const cy = frame < OUT + 6 ? panelCenter.y + (to.y - panelCenter.y) * cursorIn : to.y + (next.y - to.y) * 0.34 * cursorOut;

  const ripple = interpolate(frame, [CLICK, CLICK + 18], [0, 1], CLAMP);
  const progress =
    frame < OUT
      ? interpolate(frame, [CLICK, IN], [0, 1], { ...CLAMP, easing: CURVES.cineEaseInOut })
      : interpolate(frame, [OUT, OUT + 12], [1, 0], { ...CLAMP, easing: CURVES.cineEaseInOut });

  const panelOpacity = interpolate(frame, [0, 10], [0, 1], CLAMP);
  const halo = interpolate(frame, [0, 16], [0.55, 0], CLAMP);
  const cursorOpacity = interpolate(frame, [0, 4], [0, 1], CLAMP);
  const lit = frame >= CLICK ? [0] : [];
  const active = frame >= 6 && frame < OUT ? TILE : -1;
  const camScale = interpolate(frame, [IN, OUT], [1, 1.03], { ...CLAMP, easing: CURVES.cineEaseInOut });

  const dots = inkTimeline(frame, 24, DATA.articles, 40);
  const activeEntry = frame < 56 ? 0 : frame < 70 ? 1 : frame < 84 ? 2 : 3;

  return (
    <AbsoluteFill>
      <ConsolePanel lit={lit} active={active} style={{ opacity: panelOpacity }} />
      <Grade id="GR-01" />
      {/* S34 钤印红光余晖（局部径向，≤40% 画幅） */}
      <div
        style={{
          position: 'absolute',
          left: 580,
          top: 160,
          width: 760,
          height: 760,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colors.seal}, transparent 68%)`,
          opacity: halo * 0.5,
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
      />
      <DustField act={6} count={24} seedBase="s35" />
      <ConsoleCursor x={cx} y={cy} hover={frame >= 6 && frame < OUT} ripple={ripple} opacity={cursorOpacity} />

      <ConsoleWindow tile={TILE} progress={progress}>
        <AbsoluteFill style={{ transform: `scale(${camScale})`, transformOrigin: '42% 46%' }}>
          <div
            style={{
              position: 'absolute',
              left: 140,
              top: 58,
              right: 140,
              display: 'flex',
              justifyContent: 'space-between',
              fontFamily: mono,
              fontSize: 15,
              letterSpacing: '0.24em',
              color: colors.muted,
              ...inkRise(frame, 18),
            }}
          >
            <span>01 / 首页 · HOME</span>
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>WUH.SITE · 46 ARTICLES · 2019—2026</span>
          </div>

          <div style={{ position: 'absolute', left: 140, top: 176 }}>
            <div style={{ fontFamily: mono, fontSize: 16, letterSpacing: '0.34em', color: colors.muted, ...writeFade(frame, 20) }}>
              WUH.SITE · PERSONAL BLOG
            </div>
            <div
              style={{
                fontFamily: serif,
                fontSize: 96,
                lineHeight: 1.16,
                letterSpacing: '0.1em',
                color: colors.ink,
                marginTop: 6,
                ...writeFade(frame, 24, true),
              }}
            >
              朝朝如念
            </div>
            <div
              style={{
                fontFamily: mono,
                fontSize: 15,
                color: colors.muted,
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '0.12em',
                marginTop: 10,
                ...writeFade(frame, 40),
              }}
            >
              2019 — 2026 · 四十六篇文章
            </div>
          </div>

          {ENTRIES.map((e, i) => (
            <div key={e.date} style={{ position: 'absolute', left: 1146, right: 140, top: 178 + i * 94, ...inkRise(frame, 28 + i * 5) }}>
              <div style={{ ...hoverShift(frame, 42, i, activeEntry), padding: '10px 14px', borderRadius: 8 }}>
                <div style={{ fontFamily: mono, fontSize: 14, color: colors.muted, fontVariantNumeric: 'tabular-nums', letterSpacing: '0.12em' }}>{e.date}</div>
                <div style={{ fontFamily: serif, fontSize: 30, color: colors.ink, marginTop: 4 }}>{e.title}</div>
              </div>
            </div>
          ))}

          <div style={{ position: 'absolute', left: 140, top: 620, width: 1628, height: 1, background: colors.paperDeep, opacity: 0.9 }} />
          {dots.map((d, i) => {
            const size = 12;
            return (
              <div
                key={`dot-${i}`}
                style={{
                  position: 'absolute',
                  left: d.x - size / 2,
                  top: d.y - size / 2,
                  width: size,
                  height: size,
                  borderRadius: size / 2,
                  background: colors.ink,
                  opacity: 0.14 + d.lit * 0.8,
                  transform: `scale(${0.55 + d.lit * 0.45})`,
                }}
              />
            );
          })}
          <div style={{ position: 'absolute', left: 140, top: 664, fontFamily: mono, fontSize: 13, color: colors.muted, fontVariantNumeric: 'tabular-nums' }}>2019</div>
          <div style={{ position: 'absolute', left: 690, top: 664, fontFamily: mono, fontSize: 12, color: colors.muted, letterSpacing: '0.22em' }}>墨点时间轴 · 46</div>
          <div style={{ position: 'absolute', right: 140, top: 664, fontFamily: mono, fontSize: 13, color: colors.muted, fontVariantNumeric: 'tabular-nums' }}>2026</div>
        </AbsoluteFill>
        <PaperGrain opacity={0.05} />
        <Grade id="GR-02" />
      </ConsoleWindow>

      <CaptionPlate appearAt={26} />
      <Caption text="四十六篇文章，一枚枚墨点。" appearAt={26} />
    </AbsoluteFill>
  );
};

export default ShotHomeTimeline;
