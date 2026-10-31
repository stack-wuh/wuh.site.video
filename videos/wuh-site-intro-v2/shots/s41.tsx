/* 镜 41 · Act 6 入院 · 局部帧 [0,150) · 150f
   16+118+16：面板 01–06 亮，光标自块 6 移到块 7、悬停、点击 → 窗口最大化；
   持续：100–900 色卡带 stagger 落定 + 酒红/素雅换装（两层色块 opacity 插值，不改布局）
   + 试墨色块被墨点光标拖动游走；出场：反向收束回块 7（点亮），光标移向块 8。
   字幕「换一种墨色，换一种心情。」。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { colorMorph, CURVES, inkRise } from '../motion-tokens';
import { Caption } from '../components/Caption';
import { ConsoleCursor, ConsolePanel, ConsoleWindow, TILE_RECTS } from '../components/Console';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const DUR = 150;
const IN = 16;
const OUT = DUR - IN; // 98
const CLICK = 9;
const TILE = 6;
const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

const mono = fontFamilies.mono;
const serif = fontFamilies.serif;

const tileCenter = (i: number) => ({ x: TILE_RECTS[i].x + TILE_RECTS[i].w / 2, y: TILE_RECTS[i].y + TILE_RECTS[i].h / 2 });

const STEPS = ['100', '200', '300', '400', '500', '600', '700', '800', '900'];
const WINE = STEPS.map((_, i) => 0.18 + i * 0.09);
const PLAIN = STEPS.map((_, i) => 0.12 + i * 0.08);

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

const ShotDesignTokens: FC = () => {
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

  const lit = frame >= CLICK ? [0, 1, 2, 3, 4, 5, 6] : [0, 1, 2, 3, 4, 5];
  const active = frame >= 6 && frame < OUT ? TILE : -1;

  const morph = colorMorph(frame, 52, 26, 'wine', 'plain').progress;
  const camX = interpolate(frame, [IN, 64], [30, -16], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const camScale = interpolate(frame, [64, OUT], [1, 1.03], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const drag = interpolate(frame, [64, 88], [0, 1], { ...CLAMP, easing: CURVES.cineEaseInOut });

  return (
    <AbsoluteFill>
      <ConsolePanel lit={lit} active={active} />
      <Grade id="GR-01" />
      <DustField act={6} count={24} seedBase="s41" />
      <ConsoleCursor x={cx} y={cy} hover={frame >= 6 && frame < OUT} ripple={ripple} />

      <ConsoleWindow tile={TILE} progress={progress}>
        <AbsoluteFill style={{ transform: `scale(${camScale}) translateX(${camX}px)`, transformOrigin: '50% 55%' }}>
          <div style={{ position: 'absolute', left: 140, top: 58, right: 140, display: 'flex', justifyContent: 'space-between', fontFamily: mono, fontSize: 15, letterSpacing: '0.24em', color: colors.muted, ...inkRise(frame, 18) }}>
            <span>07 / 设计系统 · DESIGN TOKENS</span>
            <span>100 — 900 · WINE / PLAIN</span>
          </div>

          <div style={{ position: 'absolute', left: 140, top: 146, width: 360, height: 60, ...inkRise(frame, 22) }}>
            <div style={{ position: 'absolute', left: 0, top: 0, fontFamily: serif, fontSize: 46, letterSpacing: '0.16em', color: colors.ink, opacity: 1 - morph }}>酒红</div>
            <div style={{ position: 'absolute', left: 0, top: 0, fontFamily: serif, fontSize: 46, letterSpacing: '0.16em', color: colors.ink, opacity: morph }}>素雅</div>
            <div style={{ position: 'absolute', left: 0, top: 62, fontFamily: mono, fontSize: 12, color: colors.muted, letterSpacing: '0.24em' }}>THEME · 换装插值</div>
          </div>

          <div style={{ position: 'absolute', left: 1440, top: 140, width: 110, height: 54 }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 10, background: colors.seal, opacity: 0.9 }} />
            <div style={{ position: 'absolute', inset: -5, borderRadius: 13, border: `2px solid ${colors.ink}`, opacity: 1 - morph }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: mono, fontSize: 12, color: colors.paper, letterSpacing: '0.2em' }}>酒红</div>
          </div>
          <div style={{ position: 'absolute', left: 1568, top: 140, width: 110, height: 54 }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 10, background: colors.muted, opacity: 0.9 }} />
            <div style={{ position: 'absolute', inset: -5, borderRadius: 13, border: `2px solid ${colors.ink}`, opacity: morph }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: mono, fontSize: 12, color: colors.paper, letterSpacing: '0.2em' }}>素雅</div>
          </div>

          {STEPS.map((step, i) => (
            <div key={step} style={{ position: 'absolute', left: 184 + i * 174, top: 240, width: 160, height: 330, ...inkRise(frame, 22 + i * 4) }}>
              <div style={{ position: 'absolute', left: 0, top: 0, width: 160, height: 280, borderRadius: 10, background: colors.seal, opacity: WINE[i] * (1 - morph) }} />
              <div style={{ position: 'absolute', left: 0, top: 0, width: 160, height: 280, borderRadius: 10, background: colors.muted, opacity: PLAIN[i] * morph }} />
              <div style={{ position: 'absolute', left: 0, top: 294, width: 160, textAlign: 'center', fontFamily: mono, fontSize: 12, color: colors.muted, fontVariantNumeric: 'tabular-nums', letterSpacing: '0.12em' }}>{step}</div>
            </div>
          ))}

          <div style={{ position: 'absolute', left: 380, top: 706, width: 900, height: 1, background: colors.paperMuted }} />
          <div style={{ position: 'absolute', left: 380, top: 720, fontFamily: mono, fontSize: 12, color: colors.muted, letterSpacing: '0.24em' }}>试墨 · DRAG</div>
          <div
            style={{
              position: 'absolute',
              left: 400,
              top: 560,
              width: 120,
              height: 120,
              borderRadius: 16,
              background: colors.seal,
              transform: `translate(${drag * 720}px, ${-Math.sin(drag * Math.PI) * 10}px)`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.92,
            }}
          >
            <span style={{ fontFamily: serif, fontSize: 28, color: colors.paper, letterSpacing: '0.16em' }}>试墨</span>
            <span style={{ fontFamily: mono, fontSize: 10, color: colors.paper, opacity: 0.75, letterSpacing: '0.2em', marginTop: 6 }}>拖拽</span>
            <div style={{ position: 'absolute', left: 100, top: 100, width: 16, height: 16, borderRadius: 8, background: colors.ink, border: `2px solid ${colors.accent}` }} />
          </div>
        </AbsoluteFill>
        <PaperGrain opacity={0.05} />
        <Grade id="GR-02" />
      </ConsoleWindow>

      <CaptionPlate appearAt={26} />
      <Caption text="换一种墨色，换一种心情。" appearAt={26} />
    </AbsoluteFill>
  );
};

export default ShotDesignTokens;
