/* 镜 40 · Act 6 入院 · 局部帧 [0,120) · 120f
   18+84+18：面板 01–05 亮，光标自块 5 移到块 6、悬停、点击 → 窗口最大化；
   持续：365 格暖色缓慢加深（heatDeepen 全局 ramp，159 天沉得更深，无波浪扫描），峰值格
   2026-07-24 · 1,263 被墨点圈（PT-03），380px 足迹图浮入、杨梅坑/梧桐山两点亮；
   出场：反向收束回块 6（点亮），光标移向块 7。字幕两行「三百六十五天，逐格真实。」／「此乐何极~」。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, DATA, heatCells, heatDeepen, inkRise, lightOn } from '../motion-tokens';
import { Caption } from '../components/Caption';
import { ConsoleCursor, ConsolePanel, ConsoleWindow, TILE_RECTS } from '../components/Console';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const DUR = 120;
const IN = 18;
const OUT = DUR - IN; // 102
const CLICK = 11;
const TILE = 5;
const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

const mono = fontFamilies.mono;
const serif = fontFamilies.serif;

const tileCenter = (i: number) => ({ x: TILE_RECTS[i].x + TILE_RECTS[i].w / 2, y: TILE_RECTS[i].y + TILE_RECTS[i].h / 2 });

const CELLS = heatCells();
const PEAK_INDEX = Math.max(0, CELLS.findIndex((c) => c.activity >= DATA.peakActivity));
const GRID = { x: 200, y: 260, pitch: 24 };
const cellPos = (i: number) => ({ x: GRID.x + Math.floor(i / 7) * GRID.pitch, y: GRID.y + (i % 7) * GRID.pitch });
const PEAK = cellPos(PEAK_INDEX);

const MONTH_STARTS = (() => {
  const seen = new Map<string, number>();
  CELLS.forEach((c, i) => {
    if (!seen.has(c.month)) seen.set(c.month, i);
  });
  return Array.from(seen.entries());
})();

const FOOTPRINT = [
  { name: '杨梅坑', coord: '114.585, 22.55', x: 128, y: 244, at: 62 },
  { name: '梧桐山', coord: '114.23, 22.62', x: 212, y: 142, at: 74 },
];

const CaptionPlate: FC<{ appearAt: number }> = ({ appearAt }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [appearAt, appearAt + 16], [0, 1], CLAMP);
  return (
    <div
      style={{
        position: 'absolute',
        left: 470,
        right: 470,
        bottom: 70,
        height: 340,
        background: `linear-gradient(180deg, transparent, ${colors.bg} 20%, ${colors.bg} 80%, transparent)`,
        opacity: p * 0.5,
        pointerEvents: 'none',
      }}
    />
  );
};

const ShotHeatFootprint: FC = () => {
  const frame = useCurrentFrame();
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

  const lit = frame >= CLICK ? [0, 1, 2, 3, 4, 5] : [0, 1, 2, 3, 4];
  const active = frame >= 6 && frame < OUT ? TILE : -1;

  const camScale =
    frame < 58
      ? interpolate(frame, [22, 58], [1, 1.02], { ...CLAMP, easing: CURVES.cineEaseInOut })
      : interpolate(frame, [58, 96], [1.02, 1.06], { ...CLAMP, easing: CURVES.cineEaseInOut });

  const ring = (offset: number) => interpolate(frame, [62 + offset, 84 + offset], [0, 1], CLAMP);
  const keepRing = interpolate(frame, [78, 86], [0, 0.7], { ...CLAMP, easing: CURVES.cineEaseOut });

  return (
    <AbsoluteFill>
      <ConsolePanel lit={lit} active={active} />
      <Grade id="GR-01" />
      <DustField act={6} count={24} seedBase="s40" />
      <ConsoleCursor x={cx} y={cy} hover={frame >= 6 && frame < OUT} ripple={ripple} />

      <ConsoleWindow tile={TILE} progress={progress}>
        <AbsoluteFill style={{ transform: `scale(${camScale})`, transformOrigin: `${PEAK.x + 10}px ${PEAK.y + 10}px` }}>
          <div style={{ position: 'absolute', left: 140, top: 58, right: 140, display: 'flex', justifyContent: 'space-between', fontFamily: mono, fontSize: 15, letterSpacing: '0.24em', color: colors.muted, ...inkRise(frame, 18) }}>
            <span>06 / 热力图与足迹 · CONTRIBUTIONS</span>
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>{`365 DAYS · ${DATA.activeDays} ACTIVE · ${DATA.activity.toLocaleString('en-US')}`}</span>
          </div>

          {MONTH_STARTS.map(([month, index]) => (
            <div
              key={month}
              style={{
                position: 'absolute',
                left: GRID.x + Math.floor(index / 7) * GRID.pitch,
                top: 236,
                fontFamily: mono,
                fontSize: 11,
                color: colors.muted,
                fontVariantNumeric: 'tabular-nums',
                ...inkRise(frame, 20),
              }}
            >
              {`${month.slice(5)}月`}
            </div>
          ))}

          {CELLS.map((c, i) => {
            const pos = cellPos(i);
            const deep = heatDeepen(frame, c.activity, 22, 88);
            return (
              <div
                key={`cell-${i}`}
                style={{
                  position: 'absolute',
                  left: pos.x,
                  top: pos.y,
                  width: 20,
                  height: 20,
                  borderRadius: 3,
                  background: deep.background,
                  opacity: deep.opacity,
                }}
              />
            );
          })}

          {[0, 8].map((offset) => {
            const p = ring(offset);
            if (p <= 0 || p >= 1) return null;
            return (
              <div
                key={`ripple-${offset}`}
                style={{
                  position: 'absolute',
                  left: PEAK.x + 10 - 15,
                  top: PEAK.y + 10 - 15,
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  border: `1.5px solid ${colors.ink}`,
                  opacity: 0.55 * (1 - p),
                  transform: `scale(${1 + p * 1.6})`,
                }}
              />
            );
          })}
          <div
            style={{
              position: 'absolute',
              left: PEAK.x - 7,
              top: PEAK.y - 7,
              width: 34,
              height: 34,
              borderRadius: 17,
              border: `1.5px solid ${colors.ink}`,
              opacity: keepRing,
            }}
          />
          <div style={{ position: 'absolute', left: PEAK.x + 32, top: PEAK.y - 14, ...inkRise(frame, 76) }}>
            <div style={{ fontFamily: mono, fontSize: 13, color: colors.ink, fontVariantNumeric: 'tabular-nums', letterSpacing: '0.08em' }}>
              {`${DATA.peakDay} · ${DATA.peakActivity.toLocaleString('en-US')}`}
            </div>
            <div style={{ position: 'absolute', left: -30, top: 24, width: 26, height: 1, background: colors.ink, opacity: 0.5 }} />
          </div>

          <div
            style={{
              position: 'absolute',
              left: 1400,
              top: 590,
              width: 380,
              height: 380,
              background: colors.paperDeep,
              border: `1px solid ${colors.paperMuted}`,
              borderRadius: 20,
              ...inkRise(frame, 56),
            }}
          >
            <div style={{ position: 'absolute', left: 22, top: 18, fontFamily: mono, fontSize: 12, color: colors.muted, letterSpacing: '0.24em' }}>足迹 · FOOTPRINT</div>
            <svg width={380} height={380} style={{ position: 'absolute', left: 0, top: 0 }} viewBox="0 0 380 380">
              <path d="M 30 300 C 90 220, 140 250, 190 200 S 300 120, 352 168" fill="none" stroke={colors.muted} strokeWidth={1} opacity={0.35} />
              <path d="M 60 330 C 120 260, 170 290, 230 240 S 330 180, 356 220" fill="none" stroke={colors.muted} strokeWidth={1} opacity={0.25} />
            </svg>
            {FOOTPRINT.map((f) => (
              <div key={f.name} style={{ position: 'absolute', left: f.x - 6, top: f.y - 6, width: 12, height: 12 }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: 6, background: colors.seal, ...lightOn(frame, f.at, 30) }} />
                <div style={{ position: 'absolute', left: -4, top: -4, width: 20, height: 20, borderRadius: 10, border: `1px solid ${colors.seal}`, opacity: 0.45 * Math.min(1, Math.max(0, (frame - f.at) / 8)) }} />
                <div style={{ position: 'absolute', left: 16, top: -8, whiteSpace: 'nowrap' }}>
                  <span style={{ fontFamily: serif, fontSize: 18, color: colors.ink }}>{f.name}</span>
                  <span style={{ fontFamily: mono, fontSize: 10, color: colors.muted, marginLeft: 8, fontVariantNumeric: 'tabular-nums' }}>{f.coord}</span>
                </div>
              </div>
            ))}
          </div>
        </AbsoluteFill>
        <PaperGrain opacity={0.05} />
        <Grade id="GR-02" />
      </ConsoleWindow>

      <CaptionPlate appearAt={26} />
      <Caption text="三百六十五天，逐格真实。" appearAt={26} bottom={214} />
      <Caption text="此乐何极~" appearAt={34} bottom={142} />
    </AbsoluteFill>
  );
};

export default ShotHeatFootprint;
