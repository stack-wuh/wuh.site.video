/* 镜 36 · Act 6 入院 · 局部帧 [0,114) · 114f
   16+82+16：面板 01 亮，光标自块 1 移到块 2、悬停、点击涟漪 → 窗口最大化；
   持续：生成式封面——山峦/涟漪双曲线 pathDraw 描边生长、大标题 write-fade、右下「wuh.site」落款如钤；
   出场：反向收束回块 2（点亮），光标移向块 3。字幕「每一篇，都有一幅只属于它的山水。」。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, inkRise, pathDraw, sealStamp, sealTilt, writeFade } from '../motion-tokens';
import { Caption } from '../components/Caption';
import { ConsoleCursor, ConsolePanel, ConsoleWindow, TILE_RECTS } from '../components/Console';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const DUR = 114;
const IN = 16;
const OUT = DUR - IN; // 98
const CLICK = 9;
const TILE = 1;
const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

const mono = fontFamilies.mono;
const serif = fontFamilies.serif;

const tileCenter = (i: number) => ({ x: TILE_RECTS[i].x + TILE_RECTS[i].w / 2, y: TILE_RECTS[i].y + TILE_RECTS[i].h / 2 });

const RIDGE = 'M 150 700 C 380 470, 560 640, 760 560 S 1120 420, 1340 530 S 1600 640, 1770 600';
const RIPPLE = 'M 150 820 C 420 780, 660 860, 940 810 S 1440 760, 1770 830';

const RIDGE_DOTS = [
  { x: 760, y: 560, at: 74 },
  { x: 1120, y: 458, at: 80 },
  { x: 1400, y: 542, at: 86 },
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

const ShotGenerativeCover: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const prev = tileCenter(TILE - 1);
  const to = tileCenter(TILE);
  const next = tileCenter(TILE + 1);

  const fIn = interpolate(frame, [0, 7], [0.34, 1], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const fOut = interpolate(frame, [OUT + 6, DUR], [1, 0.34], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const cx = frame < OUT + 6 ? prev.x + (to.x - prev.x) * fIn : to.x + (next.x - to.x) * fOut;
  const cy = frame < OUT + 6 ? prev.y + (to.y - prev.y) * fIn : to.y + (next.y - to.y) * fOut;

  const ripple = interpolate(frame, [CLICK, CLICK + 18], [0, 1], CLAMP);
  const progress =
    frame < OUT
      ? interpolate(frame, [CLICK, IN], [0, 1], { ...CLAMP, easing: CURVES.cineEaseInOut })
      : interpolate(frame, [OUT, OUT + 12], [1, 0], { ...CLAMP, easing: CURVES.cineEaseInOut });

  const lit = frame >= CLICK ? [0, 1] : [0];
  const active = frame >= 6 && frame < OUT ? TILE : -1;

  const camX = interpolate(frame, [IN, 64], [34, -26], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const camScale = interpolate(frame, [64, OUT], [1, 1.02], { ...CLAMP, easing: CURVES.cineEaseInOut });

  return (
    <AbsoluteFill>
      <ConsolePanel lit={lit} active={active} />
      <Grade id="GR-01" />
      <DustField act={6} count={24} seedBase="s36" />
      <ConsoleCursor x={cx} y={cy} hover={frame >= 6 && frame < OUT} ripple={ripple} />

      <ConsoleWindow tile={TILE} progress={progress}>
        <AbsoluteFill style={{ transform: `scale(${camScale}) translateX(${camX}px)`, transformOrigin: '78% 76%' }}>
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
            <span>02 / 生成式封面 · GENERATIVE COVER</span>
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>SEED · 2026-07-05 · WUH.SITE</span>
          </div>

          <div style={{ position: 'absolute', left: 240, right: 240, top: 168, textAlign: 'center' }}>
            <div style={{ fontFamily: mono, fontSize: 16, letterSpacing: '0.42em', color: colors.muted, ...writeFade(frame, 22) }}>
              GENERATIVE COVER · SEEDED BY WORDS
            </div>
            <div
              style={{
                fontFamily: serif,
                fontSize: 78,
                lineHeight: 1.2,
                letterSpacing: '0.06em',
                color: colors.ink,
                marginTop: 8,
                ...writeFade(frame, 36, true),
              }}
            >
              再读《坐忘歌》
            </div>
          </div>

          <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }} viewBox="0 0 1920 1080">
            <path d={RIDGE} fill="none" stroke={colors.ink} strokeWidth={2.5} strokeLinecap="round" style={pathDraw(frame, 26, 54, 2100)} />
            <path d={RIPPLE} fill="none" stroke={colors.muted} strokeWidth={1.5} strokeLinecap="round" style={pathDraw(frame, 58, 44, 1750)} />
          </svg>

          {RIDGE_DOTS.map((d, i) => (
            <div
              key={`ridge-${i}`}
              style={{
                position: 'absolute',
                left: d.x - 5,
                top: d.y - 5,
                width: 10,
                height: 10,
                borderRadius: 5,
                background: colors.ink,
                opacity: 0.8,
                ...inkRise(frame, d.at),
              }}
            />
          ))}

          <div style={{ position: 'absolute', left: 1548, top: 800 }}>
            <div
              style={{
                display: 'inline-block',
                padding: '10px 18px',
                border: `2px solid ${colors.seal}`,
                borderRadius: 4,
                color: colors.seal,
                fontFamily: serif,
                fontSize: 30,
                letterSpacing: '0.14em',
                ...sealStamp(frame, 64, fps, sealTilt('s36')),
              }}
            >
              wuh.site
            </div>
          </div>
        </AbsoluteFill>
        <PaperGrain opacity={0.05} />
        <Grade id="GR-02" />
      </ConsoleWindow>

      <CaptionPlate appearAt={26} />
      <Caption text="每一篇，都有一幅只属于它的山水。" appearAt={26} />
    </AbsoluteFill>
  );
};

export default ShotGenerativeCover;
