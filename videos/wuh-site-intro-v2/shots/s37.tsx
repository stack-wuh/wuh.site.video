/* 镜 37 · Act 6 入院 · 局部帧 [0,114) · 114f
   16+82+16：面板 01–02 亮，光标自块 2 移到块 3、悬停、点击 → 窗口最大化；
   持续：骨架屏 shimmerSweep 横扫 + 书封 cascade 落架（逻辑 36×54 书目网格，仅铺 240 枚可见封面）
   + 抽出一本「阅读中」；出场：反向收束回块 3（点亮），光标移向块 4。字幕「读过的书，都站在这里。」。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { bookCascade, CURVES, FILM_COLORS, inkRise, shimmerSweep } from '../motion-tokens';
import { Caption } from '../components/Caption';
import { ConsoleCursor, ConsolePanel, ConsoleWindow, TILE_RECTS } from '../components/Console';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const DUR = 114;
const IN = 16;
const OUT = DUR - IN; // 98
const CLICK = 9;
const TILE = 2;
const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

const mono = fontFamilies.mono;
const serif = fontFamilies.serif;

const tileCenter = (i: number) => ({ x: TILE_RECTS[i].x + TILE_RECTS[i].w / 2, y: TILE_RECTS[i].y + TILE_RECTS[i].h / 2 });

const COLS = 40;
const ROWS = 6;
const FEATURED = { row: 3, col: 18 };
const SHELF_X = 140;
const SHELF_Y = 168;
const PITCH_X = 41;
const PITCH_Y = 118;
const SPINE_W = 36;
const SPINE_H = 96;
const PALETTE = [colors.ink, colors.muted, colors.accent, colors.seal, colors.paperDeep];

const BOOKS = Array.from({ length: COLS * ROWS }).map((_, i) => {
  const row = Math.floor(i / COLS);
  const col = i % COLS;
  const tone = PALETTE[Math.floor(random(`s37-book-${i}`) * PALETTE.length)];
  const h = 82 + random(`s37-book-${i}-h`) * 14;
  return { i, row, col, tone, h, featured: row === FEATURED.row && col === FEATURED.col };
});

const FEAT_X = SHELF_X + FEATURED.col * PITCH_X;
const FEAT_Y = SHELF_Y + FEATURED.row * PITCH_Y;
const FEAT_DX = 960 - (FEAT_X + SPINE_W / 2);
const FEAT_DY = 520 - (FEAT_Y + SPINE_H / 2);

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

const ShotBookshelf: FC = () => {
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

  const lit = frame >= CLICK ? [0, 1, 2] : [0, 1];
  const active = frame >= 6 && frame < OUT ? TILE : -1;

  const camX = interpolate(frame, [IN, 78], [36, -36], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const camScale = interpolate(frame, [78, OUT], [1, 1.05], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const skeleton = interpolate(frame, [26, 50], [1, 0], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const lift = interpolate(frame, [78, 94], [0, 1], { ...CLAMP, easing: CURVES.cineEaseInOut });

  return (
    <AbsoluteFill>
      <ConsolePanel lit={lit} active={active} />
      <Grade id="GR-01" />
      <DustField act={6} count={24} seedBase="s37" />
      <ConsoleCursor x={cx} y={cy} hover={frame >= 6 && frame < OUT} ripple={ripple} />

      <ConsoleWindow tile={TILE} progress={progress}>
        <AbsoluteFill style={{ transform: `scale(${camScale}) translateX(${camX}px)`, transformOrigin: '50% 54%' }}>
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
            <span>03 / 书架 · BOOKSHELF</span>
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>WEREAD · 240 SHOWN / 36 × 54</span>
          </div>

          <div style={{ position: 'absolute', left: SHELF_X, top: SHELF_Y, width: COLS * PITCH_X, height: ROWS * PITCH_Y, overflow: 'hidden' }}>
            {Array.from({ length: ROWS }).map((_, row) => (
              <div
                key={`skeleton-${row}`}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: row * PITCH_Y,
                  width: COLS * PITCH_X,
                  height: SPINE_H,
                  background: colors.paperDeep,
                  borderRadius: 3,
                  opacity: 0.8 * skeleton,
                }}
              />
            ))}
            <div style={{ position: 'absolute', left: 0, top: 0, width: COLS * PITCH_X, height: ROWS * PITCH_Y, ...shimmerSweep(frame, 20, 45) }}>
              <AbsoluteFill style={{ background: `linear-gradient(90deg, transparent 32%, ${FILM_COLORS.paperMist} 50%, transparent 68%)` }} />
            </div>
          </div>

          {Array.from({ length: ROWS }).map((_, row) => (
            <div
              key={`shelf-${row}`}
              style={{
                position: 'absolute',
                left: SHELF_X,
                top: SHELF_Y + row * PITCH_Y + SPINE_H,
                width: COLS * PITCH_X,
                height: 1,
                background: colors.paperDeep,
              }}
            />
          ))}

          {BOOKS.filter((b) => !b.featured).map((b) => (
            <div
              key={`book-${b.i}`}
              style={{
                position: 'absolute',
                left: SHELF_X + b.col * PITCH_X,
                top: SHELF_Y + b.row * PITCH_Y + SPINE_H - b.h,
                width: SPINE_W,
                height: b.h,
                background: b.tone,
                borderRadius: '2px 2px 0 0',
                opacity: 0.85,
                ...bookCascade(frame - (24 + b.i * 0.16), 0),
              }}
            />
          ))}

          <div
            style={{
              position: 'absolute',
              left: FEAT_X,
              top: FEAT_Y,
              width: SPINE_W,
              height: SPINE_H,
              background: colors.seal,
              borderRadius: '2px 2px 0 0',
              transform: `translate(${FEAT_DX * lift}px, ${FEAT_DY * lift}px) scale(${1 + lift * 1.8}) rotate(${-2 * lift}deg)`,
              transformOrigin: 'center',
              opacity: 0.92,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ writingMode: 'vertical-rl', fontFamily: serif, fontSize: 22, color: colors.paper, letterSpacing: '0.2em' }}>坐忘</span>
          </div>

          <div style={{ position: 'absolute', left: 1034, top: 478, ...inkRise(frame, 88) }}>
            <div style={{ fontFamily: mono, fontSize: 15, color: colors.seal, letterSpacing: '0.24em' }}>阅读中</div>
            <div style={{ fontFamily: mono, fontSize: 11, color: colors.muted, letterSpacing: '0.2em', marginTop: 4 }}>READING</div>
          </div>
        </AbsoluteFill>
        <PaperGrain opacity={0.05} />
        <Grade id="GR-02" />
      </ConsoleWindow>

      <CaptionPlate appearAt={26} />
      <Caption text="读过的书，都站在这里。" appearAt={26} />
    </AbsoluteFill>
  );
};

export default ShotBookshelf;
