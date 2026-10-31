/* 镜 37 · Act 6 入院 · 局部帧 [0,150) · 150f
   16+118+16：面板（litSet={1,2}）→ 光标点开块 3「书架」→ 窗口最大化；
   持续：骨架屏 shimmer 横扫 + 146 本微信读书真封面列序 cascade 落架（30 列 × 5 行，
   ≤240 可见预算）+ 镜头沿书墙横移 → 抽出一本放大（真封面 / 书名 / 作者 /「阅读中」）；
   出场：反向收束回块 3（点亮），光标移向块 4。字幕「读过的书，都站在这里。」。 */
import type { FC } from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, FILM_COLORS, shimmerSweep, bookCascade, inkRise } from '../motion-tokens';
import { BOOKS } from '../books';
import { Caption } from '../components/Caption';
import { ConsoleCursor, ConsolePanel, ConsoleWindow, TILE_RECTS } from '../components/Console';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const DUR = 150;
const IN = 16;
const OUT = DUR - IN; // 134
const CLICK = 9;
const TILE = 2;
const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

const mono = fontFamilies.mono;
const serif = fontFamilies.serif;

const tileCenter = (i: number) => ({ x: TILE_RECTS[i].x + TILE_RECTS[i].w / 2, y: TILE_RECTS[i].y + TILE_RECTS[i].h / 2 });

/* 书墙几何：30 列 × 5 行（150 槽，146 本 + 4 空位），墙宽 3600px，镜头横移扫过 */
const COLS = 30;
const ROWS = 5;
const CELL = { w: 112, h: 160, gx: 8, gy: 8 };
const WALL_X = 40;
const WALL_W = COLS * (CELL.w + CELL.gx);

const PICK = BOOKS[0];

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
  const cursorOpacity = interpolate(frame, [0, 4], [0, 1], CLAMP);
  const lit = frame >= CLICK ? [0, 1, 2] : [0, 1];
  const active = frame >= 6 && frame < OUT ? TILE : -1;

  const pan = interpolate(frame, [22, 122], [0, -(WALL_W - 1800)], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const zoom = interpolate(frame, [IN, OUT], [1.02, 1.04], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const shimmer = shimmerSweep(frame, 8, 45);
  const pickIn = interpolate(frame, [86, 100], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut });
  const veil = interpolate(frame, [86, 100], [0, 0.55], CLAMP);

  return (
    <AbsoluteFill>
      <ConsolePanel lit={lit} active={active} style={{ opacity: panelOpacity }} />
      <Grade id="GR-01" />
      <DustField act={6} count={24} seedBase="s37" />
      <ConsoleCursor x={cx} y={cy} hover={frame >= 6 && frame < OUT} ripple={ripple} opacity={cursorOpacity} />

      <ConsoleWindow tile={TILE} progress={progress}>
        <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: '50% 45%' }}>
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
            <span>03 / 书架 · SHELF</span>
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>WEREAD · 146 BOOKS · 2026-11-01</span>
          </div>

          {/* 真实书墙：146 本微信读书封面，列序 cascade 落架 */}
          <div style={{ position: 'absolute', left: WALL_X + pan, top: 128, width: WALL_W, height: ROWS * (CELL.h + CELL.gy) }}>
            {BOOKS.map((b, i) => {
              const col = Math.floor(i / ROWS);
              const row = i % ROWS;
              const st = bookCascade(frame, col + row * 0.36, 2.2);
              return (
                <div
                  key={b.cover}
                  style={{
                    position: 'absolute',
                    left: col * (CELL.w + CELL.gx),
                    top: row * (CELL.h + CELL.gy),
                    width: CELL.w,
                    height: CELL.h,
                    borderRadius: 4,
                    overflow: 'hidden',
                    background: colors.paperDeep,
                    boxShadow: `0 6px 18px ${colors.bg}`,
                    ...st,
                  }}
                >
                  <Img src={staticFile(`wuh-site-intro-v2/${b.cover}`)} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.86) contrast(0.97)' }} />
                </div>
              );
            })}
            {/* 骨架屏微光横扫 */}
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 320, background: `linear-gradient(90deg, transparent, ${FILM_COLORS.paperMist}, transparent)`, ...shimmer }} />
          </div>

          {/* 压暗衬底 + 抽出一本：真封面 / 书名 / 作者 /「阅读中」 */}
          <div style={{ position: 'absolute', inset: 0, background: colors.bg, opacity: veil, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', left: 1170, top: 200, width: 600, display: 'flex', gap: 28, opacity: pickIn, transform: `translateY(${(1 - pickIn) * 18}px)` }}>
            <div style={{ width: 210, height: 302, borderRadius: 6, overflow: 'hidden', background: colors.paperDeep, boxShadow: `0 18px 48px ${colors.bg}` }}>
              <Img src={staticFile(`wuh-site-intro-v2/${PICK.cover}`)} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.9)' }} />
            </div>
            <div style={{ paddingTop: 26, maxWidth: 340 }}>
              <div style={{ fontFamily: mono, fontSize: 13, letterSpacing: '0.3em', color: colors.muted }}>READING · 阅读中</div>
              <div style={{ fontFamily: serif, fontSize: 34, lineHeight: 1.4, color: colors.ink, marginTop: 14 }}>{PICK.title}</div>
              <div style={{ fontFamily: mono, fontSize: 16, color: colors.muted, marginTop: 12 }}>{PICK.author}</div>
              <div style={{ display: 'inline-block', marginTop: 18, padding: '5px 12px', borderRadius: 3, background: colors.seal, fontFamily: serif, fontSize: 15, color: colors.paper, letterSpacing: '0.2em' }}>在读</div>
            </div>
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
