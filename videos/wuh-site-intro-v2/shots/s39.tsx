/* 镜 39 · Act 6 入院 · 局部帧 [0,114) · 114f
   16+82+16：面板 01–04 亮，光标自块 4 移到块 5、悬停、点击 → 窗口最大化；
   持续：信笺纵线节点生长（今天/昨天/前天）→ 纵线裂成左右两列 → 弹幕气泡交替滑入（barrageBubbles）；
   出场：反向收束回块 5（点亮），光标移向块 6。字幕「两种人格，一间屋子。」。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { barrageBubbles, CURVES, inkRise } from '../motion-tokens';
import { Caption } from '../components/Caption';
import { ConsoleCursor, ConsolePanel, ConsoleWindow, TILE_RECTS } from '../components/Console';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const DUR = 114;
const IN = 16;
const OUT = DUR - IN; // 98
const CLICK = 9;
const TILE = 4;
const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

const mono = fontFamilies.mono;
const serif = fontFamilies.serif;
const sans = fontFamilies.sans;

const tileCenter = (i: number) => ({ x: TILE_RECTS[i].x + TILE_RECTS[i].w / 2, y: TILE_RECTS[i].y + TILE_RECTS[i].h / 2 });

const NODES = ['今天', '昨天', '前天'];
const SPLIT_X = 240;
const LINE_TOP = 200;
const LINE_H = 660;

const BUBBLES = [
  { side: 'left' as const, text: '今天也在。', time: '20:04' },
  { side: 'right' as const, text: '来了来了', time: '20:06' },
  { side: 'left' as const, text: '雨停了吗？', time: '20:11' },
  { side: 'right' as const, text: '写得真好', time: '20:15' },
  { side: 'left' as const, text: '这篇读了三遍。', time: '20:16' },
  { side: 'right' as const, text: '+1', time: '20:21' },
  { side: 'left' as const, text: '晚安，明天见。', time: '20:23' },
  { side: 'right' as const, text: '下次再聊~', time: '20:27' },
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

const ShotGuestbookBarrage: FC = () => {
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

  const lit = frame >= CLICK ? [0, 1, 2, 3, 4] : [0, 1, 2, 3];
  const active = frame >= 6 && frame < OUT ? TILE : -1;

  const split = interpolate(frame, [44, 58], [0, 1], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const camY = interpolate(frame, [IN, 46], [30, 0], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const camX = interpolate(frame, [46, OUT], [8, -8], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const camScale = interpolate(frame, [56, OUT], [1, 1.02], { ...CLAMP, easing: CURVES.cineEaseInOut });

  return (
    <AbsoluteFill>
      <ConsolePanel lit={lit} active={active} />
      <Grade id="GR-01" />
      <DustField act={6} count={24} seedBase="s39" />
      <ConsoleCursor x={cx} y={cy} hover={frame >= 6 && frame < OUT} ripple={ripple} />

      <ConsoleWindow tile={TILE} progress={progress}>
        <AbsoluteFill style={{ transform: `scale(${camScale}) translate(${camX}px, ${camY}px)`, transformOrigin: '50% 52%' }}>
          <div style={{ position: 'absolute', left: 140, top: 58, right: 140, display: 'flex', justifyContent: 'space-between', fontFamily: mono, fontSize: 15, letterSpacing: '0.24em', color: colors.muted, ...inkRise(frame, 18) }}>
            <span>05 / 留言板 · GUESTBOOK</span>
            <span>两种人格 · 一间屋子</span>
          </div>

          <div style={{ position: 'absolute', left: 959, top: LINE_TOP, width: 2, height: LINE_H, background: colors.paperMuted, transform: `translateX(${-SPLIT_X * split}px)`, opacity: 0.9 }} />
          <div style={{ position: 'absolute', left: 959, top: LINE_TOP, width: 2, height: LINE_H, background: colors.paperMuted, transform: `translateX(${SPLIT_X * split}px)`, opacity: 0.9 * split }} />

          <div style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, opacity: 1 - split }}>
            {NODES.map((label, i) => (
              <div key={label} style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, ...inkRise(frame, 24 + i * 10) }}>
                <div style={{ position: 'absolute', left: 953, top: 314 + i * 170, width: 14, height: 14, borderRadius: 7, background: colors.ink }} />
                <div style={{ position: 'absolute', left: 990, top: 300 + i * 170, fontFamily: serif, fontSize: 26, color: colors.ink, letterSpacing: '0.14em' }}>{label}</div>
                <div style={{ position: 'absolute', left: 990, top: 338 + i * 170, width: 150, height: 1, background: colors.paperDeep }} />
              </div>
            ))}
          </div>

          <div style={{ position: 'absolute', left: 380, width: 260, top: 232, textAlign: 'right', fontFamily: mono, fontSize: 13, color: colors.muted, letterSpacing: '0.28em', ...inkRise(frame, 58) }}>
            留言 · LETTER
          </div>
          <div style={{ position: 'absolute', left: 1280, width: 260, top: 232, textAlign: 'left', fontFamily: mono, fontSize: 13, color: colors.muted, letterSpacing: '0.28em', ...inkRise(frame, 58) }}>
            弹幕 · LIVE
          </div>

          {BUBBLES.map((b, i) => (
            <div
              key={`bubble-${i}`}
              style={{
                position: 'absolute',
                left: b.side === 'left' ? 380 : 1260,
                top: 292 + Math.floor(i / 2) * 140,
                maxWidth: 320,
                background: colors.paperDeep,
                border: `1px solid ${colors.paperMuted}`,
                borderRadius: b.side === 'left' ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                padding: '12px 16px',
                whiteSpace: 'nowrap',
                ...barrageBubbles(frame - 46, i, b.side, 5),
              }}
            >
              <span style={{ fontFamily: sans, fontSize: 20, color: colors.ink }}>{b.text}</span>
              <span style={{ fontFamily: mono, fontSize: 11, color: colors.muted, marginLeft: 12, fontVariantNumeric: 'tabular-nums' }}>{b.time}</span>
            </div>
          ))}
        </AbsoluteFill>
        <PaperGrain opacity={0.05} />
        <Grade id="GR-02" />
      </ConsoleWindow>

      <CaptionPlate appearAt={26} />
      <Caption text="两种人格，一间屋子。" appearAt={26} />
    </AbsoluteFill>
  );
};

export default ShotGuestbookBarrage;
