/* 镜 38 · Act 6 入院 · 局部帧 [0,120) · 120f
   18+84+18：面板 01–03 亮，光标自块 3 移到块 4、悬停、点击 → 窗口最大化；
   持续：黑胶 5s/圈（120f=288°，绝对时间不凑整圈）+ 唱针 12f 落定（局部 38f）+ 三墨柱 EQ 相位差
   + 440px 迷你播放器跑马灯 + 年份刻度环；出场：唱针抬起、反向收束回块 4（点亮），光标移向块 5。
   字幕两行「时间的年轮，刻着每一年的歌。」／「黑胶还在转，时光没走远。」。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, eqBars, inkRise, marqueeDrift, needleSettle, orbitDrift, vinylSpin } from '../motion-tokens';
import { Caption } from '../components/Caption';
import { ConsoleCursor, ConsolePanel, ConsoleWindow, TILE_RECTS } from '../components/Console';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const DUR = 120;
const IN = 18;
const OUT = DUR - IN; // 102
const CLICK = 11;
const TILE = 3;
const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

const mono = fontFamilies.mono;
const serif = fontFamilies.serif;

const tileCenter = (i: number) => ({ x: TILE_RECTS[i].x + TILE_RECTS[i].w / 2, y: TILE_RECTS[i].y + TILE_RECTS[i].h / 2 });

const DISC = { cx: 1230, cy: 520, r: 280 };
const YEARS = ['2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'];
const NEEDLE_LAND = 38; // 全局 4820f（第 242 拍）

const CaptionPlate: FC<{ appearAt: number }> = ({ appearAt }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [appearAt, appearAt + 16], [0, 1], CLAMP);
  return (
    <div
      style={{
        position: 'absolute',
        left: 300,
        right: 300,
        bottom: 70,
        height: 340,
        background: `linear-gradient(180deg, transparent, ${colors.bg} 20%, ${colors.bg} 80%, transparent)`,
        opacity: p * 0.5,
        pointerEvents: 'none',
      }}
    />
  );
};

const ShotVinylYears: FC = () => {
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

  const lit = frame >= CLICK ? [0, 1, 2, 3] : [0, 1, 2];
  const active = frame >= 6 && frame < OUT ? TILE : -1;

  const spin = vinylSpin(frame, 150);
  const drop = interpolate(frame, [NEEDLE_LAND - 12, NEEDLE_LAND], [0, 1], { ...CLAMP, easing: CURVES.cineEaseIn });
  const wobble = frame >= NEEDLE_LAND ? needleSettle(frame, NEEDLE_LAND, 2.4) : 0;
  const lift = interpolate(frame, [OUT, OUT + 10], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut });
  const armAngle = 142 + drop * 9 + wobble - lift * 9;
  const discDim = interpolate(frame, [OUT, OUT + 12], [0, 0.35], { ...CLAMP, easing: CURVES.cineEaseOut });

  const zoneScale = interpolate(frame, [NEEDLE_LAND, OUT], [1, 1.02], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const zoneRot = interpolate(frame, [IN, OUT], [-0.8, 0.8], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const bars = eqBars(frame);

  return (
    <AbsoluteFill>
      <ConsolePanel lit={lit} active={active} />
      <Grade id="GR-01" />
      <DustField act={6} count={26} seedBase="s38" />
      <ConsoleCursor x={cx} y={cy} hover={frame >= 6 && frame < OUT} ripple={ripple} />

      <ConsoleWindow tile={TILE} progress={progress}>
        <AbsoluteFill>
          <div style={{ position: 'absolute', left: 140, top: 58, right: 140, display: 'flex', justifyContent: 'space-between', fontFamily: mono, fontSize: 15, letterSpacing: '0.24em', color: colors.muted, ...inkRise(frame, 18) }}>
            <span>04 / 音乐 · VINYL & YEARS</span>
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>5s / 圈 · 33⅓</span>
          </div>

          <div style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, transform: `rotate(${zoneRot}deg) scale(${zoneScale})`, transformOrigin: `${DISC.cx}px ${DISC.cy}px` }}>
            <div
              style={{
                position: 'absolute',
                left: DISC.cx - DISC.r,
                top: DISC.cy - DISC.r,
                width: DISC.r * 2,
                height: DISC.r * 2,
                borderRadius: '50%',
                background: colors.ink,
                transform: `rotate(${spin}deg)`,
                opacity: 1 - discDim,
              }}
            >
              {[500, 420, 340, 260].map((s) => (
                <div key={s} style={{ position: 'absolute', left: (DISC.r * 2 - s) / 2, top: (DISC.r * 2 - s) / 2, width: s, height: s, borderRadius: '50%', border: `1px solid ${colors.paperMuted}`, opacity: 0.18 }} />
              ))}
              <div style={{ position: 'absolute', left: 205, top: 205, width: 150, height: 150, borderRadius: '50%', background: colors.seal }} />
              <div style={{ position: 'absolute', left: 271, top: 271, width: 18, height: 18, borderRadius: 9, background: colors.paper }} />
              <div style={{ position: 'absolute', left: 394, top: 276, width: 8, height: 8, borderRadius: 4, background: colors.gold }} />
              <div style={{ position: 'absolute', left: 262, top: 243, width: 36, height: 1, background: colors.paperMuted, opacity: 0.6 }} />
            </div>

            <div style={{ position: 'absolute', left: 1560, top: 240, transform: `rotate(${armAngle}deg)` }}>
              <div style={{ position: 'absolute', left: 0, top: -2, width: 320, height: 4, background: colors.ink, borderRadius: 2 }} />
              <div style={{ position: 'absolute', left: 306, top: -8, width: 16, height: 16, borderRadius: 8, background: colors.seal }} />
              <div style={{ position: 'absolute', left: -14, top: -14, width: 28, height: 28, borderRadius: 14, background: colors.paperDeep, border: `1px solid ${colors.paperMuted}` }} />
            </div>
          </div>

          {YEARS.map((y, i) => {
            const phase = (i / YEARS.length) * Math.PI * 2 - Math.PI / 2;
            const pt = orbitDrift(frame, DISC.cx, DISC.cy, 340, 315, 0, phase);
            return (
              <div
                key={y}
                style={{
                  position: 'absolute',
                  left: pt.x - 24,
                  top: pt.y - 9,
                  width: 48,
                  textAlign: 'center',
                  fontFamily: mono,
                  fontSize: 13,
                  color: colors.muted,
                  fontVariantNumeric: 'tabular-nums',
                  opacity: 0.75,
                  ...inkRise(frame, 24 + i * 3),
                }}
              >
                {y}
              </div>
            );
          })}

          {[0, 1, 2].map((i) => (
            <div
              key={`eq-${i}`}
              style={{
                position: 'absolute',
                left: 660 + i * 44,
                top: 680,
                width: 26,
                height: 180,
                borderRadius: 6,
                background: i === 1 ? colors.seal : colors.ink,
                opacity: 0.85,
                transform: `scaleY(${bars[i]})`,
                transformOrigin: 'bottom',
              }}
            />
          ))}

          <div style={{ position: 'absolute', left: 140, top: 690, width: 440, height: 136, background: colors.paperDeep, borderRadius: 18, border: `1px solid ${colors.paperMuted}`, ...inkRise(frame, 26) }}>
            <div style={{ position: 'absolute', left: 22, top: 24, width: 48, height: 48, borderRadius: 24, background: colors.ink }} />
            <div style={{ position: 'absolute', left: 40, top: 38, width: 0, height: 0, borderTop: '10px solid transparent', borderBottom: '10px solid transparent', borderLeft: `16px solid ${colors.paper}` }} />
            <div style={{ position: 'absolute', left: 86, top: 24, fontFamily: serif, fontSize: 26, color: colors.ink }}>黑胶还在转</div>
            <div style={{ position: 'absolute', left: 86, top: 62, fontFamily: mono, fontSize: 12, color: colors.muted, letterSpacing: '0.16em' }}>WUH.SITE · 33⅓</div>
            <div style={{ position: 'absolute', left: 22, right: 22, top: 98, height: 22, overflow: 'hidden' }}>
              <div style={{ whiteSpace: 'nowrap', fontFamily: mono, fontSize: 12, color: colors.muted, ...marqueeDrift(frame, 46) }}>
                正在播放 · 时间的年轮 · 每一年的歌 · 黑胶还在转 · 正在播放 · 时间的年轮 · 每一年的歌 · 黑胶还在转 ·
              </div>
            </div>
          </div>
        </AbsoluteFill>
        <PaperGrain opacity={0.05} />
        <Grade id="GR-02" />
      </ConsoleWindow>

      <CaptionPlate appearAt={26} />
      <Caption text="时间的年轮，刻着每一年的歌。" appearAt={26} bottom={214} />
      <Caption text="黑胶还在转，时光没走远。" appearAt={34} bottom={142} />
    </AbsoluteFill>
  );
};

export default ShotVinylYears;
