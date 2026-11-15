import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { Odometer } from '../components/Odometer';
import { ShotShell } from '../components/ShotShell';
import { Tape } from '../components/Tape';
import { ARTICLES, SCALARS } from '../data';
import { EASE, FILM_COLORS, GRID, fmtInt, progress, slam } from '../motion-tokens';

/** 文章墙（承 s32）：5 行 46 条标题，同一分片与流速（退窄带前的内容） */
const SLICES = [9, 10, 9, 9, 9] as const;
const SPEEDS = [2.75, 2.9, 3.05, 3.2, 3.35] as const;
const FONT = 34;
const ROW_H = FONT * 1.35;
const ROW_GAP = 40;
const WALL_H = 5 * ROW_H + 4 * ROW_GAP;
const WALL = { x: GRID.margin, y: 240, w: GRID.content, h: WALL_H } as const;
/** GR-07 退去的窄带（右上） */
const BAND = { x: 1180, y: 86, w: 620, h: 64 } as const;

const rotate = (arr: readonly string[], k: number): string[] => [...arr.slice(k), ...arr.slice(0, k)];
const TITLES = ARTICLES.map((a) => a.title);
const ROW_ITEMS: string[][] = (() => {
  const out: string[][] = [];
  let at = 0;
  SLICES.forEach((n, r) => {
    out.push(rotate(TITLES.slice(at, at + n), r * 2));
    at += n;
  });
  return out;
})();

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/** 巨型数字定位：5 位 + 千分位逗号（0.62em / 0.28em 位宽）→ 右缘贴 1800 */
const NUM_SIZE = 280;
const NUM_LEFT = 1800 - (5 * 0.62 * NUM_SIZE + 0.28 * NUM_SIZE);
const NUM_TOP = 372;

/**
 * s33 · 64,985 落定（100f，3420–3520）
 * GR-07 标题墙向右上退成窄带（20f）→ NUM-02 里程表逐位滚 56f（20–76）→ NUM-03 末 4f SLAM（80 落定）
 * + INK-03 朱红 hairline 2f 闪 + TX-05 `WORDS · 64,985`；CAM-02 推进 4%。
 * 降级口径按 motion-spec §10.2-2：退带 20 + 滚 56 + SLAM 4（落定 3500、尾余 20f）。
 * 尾帧：64,985 落定于画面右侧（交 s34 缩角）。
 */
const S33: FC = () => {
  const frame = useCurrentFrame();
  const retreat = progress(frame, 0, 20, EASE.inOut);
  const cam = 1 + 0.04 * progress(frame, 40, 55, EASE.inOut);
  const s = slam(frame, 76);
  // INK-03：落定瞬间 1px 朱红 hairline 闪 2f
  const flash = interpolate(frame, [76, 78, 82, 88], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  // 尾帧微动：数字下 hairline 在 84–96 拉出一截（禁静止超 12f）
  const tailRule = progress(frame, 84, 12, EASE.out);

  const bx = lerp(WALL.x, BAND.x, retreat);
  const by = lerp(WALL.y, BAND.y, retreat);
  const bw = lerp(WALL.w, BAND.w, retreat);
  const bh = lerp(WALL.h, BAND.h, retreat);

  return (
    <ShotShell act="ACT 04 · 屋里">
      <AbsoluteFill>
        {/* GR-07：文章墙 → 右上窄带（内容按容器等比压缩，opacity 0.35 到底纹） */}
        <div
          style={{
            position: 'absolute',
            left: bx,
            top: by,
            width: bw,
            height: bh,
            overflow: 'hidden',
            backgroundColor: FILM_COLORS.card,
            border: `1px solid ${FILM_COLORS.hairline}`,
            boxSizing: 'border-box',
            opacity: lerp(1, 0.35, retreat),
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: WALL.w,
              height: WALL.h,
              transform: `scale(${bw / WALL.w}, ${bh / WALL.h})`,
              transformOrigin: 'top left',
            }}
          >
            <div style={{ position: 'absolute', left: 24, top: 0, width: GRID.content, height: WALL_H }}>
              {ROW_ITEMS.map((items, r) => (
                <div key={`row-${r}`} style={{ position: 'absolute', left: 0, top: r * (ROW_H + ROW_GAP) }}>
                  <Tape items={items} rows={1} speed={SPEEDS[r]} fontSize={FONT} rowGap={0} width={GRID.content} />
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* 巨型 64,985：NUM-02 逐位滚 56f + NUM-03 SLAM */}
        <div
          style={{
            position: 'absolute',
            left: NUM_LEFT,
            top: NUM_TOP,
            transform: `translate(${s.dx * 2}px, ${s.dy * 2}px) scale(${s.scale * cam})`,
            transformOrigin: 'right center',
            opacity: progress(frame, 18, 4),
          }}
        >
          <Odometer
            value={SCALARS.total_words}
            start={20}
            dur={56}
            size={NUM_SIZE}
            label={`WORDS · ${fmtInt(SCALARS.total_words)}`}
          />
        </div>

        {/* INK-03 朱红 hairline（数字上沿，落定 2f 闪） */}
        <div
          style={{
            position: 'absolute',
            left: NUM_LEFT,
            top: NUM_TOP - 26,
            width: 946,
            height: 1,
            backgroundColor: FILM_COLORS.vermillion,
            opacity: flash,
          }}
        />
        {/* 尾帧微动：数字下沿 hairline 拉出 */}
        <div
          style={{
            position: 'absolute',
            left: NUM_LEFT,
            top: NUM_TOP + NUM_SIZE * 1.02 + 120,
            width: 420 * tailRule,
            height: 1,
            backgroundColor: FILM_COLORS.hairline,
          }}
        />
      </AbsoluteFill>
    </ShotShell>
  );
};

export default S33;