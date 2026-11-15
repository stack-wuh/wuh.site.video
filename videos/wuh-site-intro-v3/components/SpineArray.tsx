import type { CSSProperties, FC } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { FILM_COLORS, GRID, SP, progress, rnd, shuffled, springP } from '../motion-tokens';

export type SpineArrayProps = {
  total: number;
  lit: number;
  seed?: string;
  start?: number;
  /** 立起错峰窗口 f（默认 20；delay = rnd(seed)·dur） */
  dur?: number;
  /** 阵列总宽（默认 GRID.content） */
  width?: number;
  style?: CSSProperties;
};

const BAR_GAP = 3.5;
const H_MIN = 40;
const H_RANGE = 160;

/**
 * GR-08 SPINE-RISE + GR-09 SPINE-LIT：书脊阵列（146 条竖条立起，19 条读过点亮）。
 * 等宽条 + 3.5px 间距；height = 40 + rnd·160；scaleY 0→1 origin bottom（spring，delay = rnd·dur）。
 * lit 子集由 seed 洗牌确定性选位：描顶 2px accent + 顶部 8% 提亮，点亮延迟递增 1.2f。
 */
export const SpineArray: FC<SpineArrayProps> = ({
  total,
  lit,
  seed = 'spine',
  start = 0,
  dur = 20,
  width = GRID.content,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const safeTotal = Math.max(0, Math.floor(total));
  const barW = safeTotal > 0 ? Math.max(3, (width - BAR_GAP * (safeTotal - 1)) / safeTotal) : 0;

  /* GR-09：19 条读过的书 = seed 洗牌后的确定性子集；lit 延迟按子集序号递增 */
  const litCount = Math.max(0, Math.min(Math.floor(lit), safeTotal));
  const litOrder = shuffled(safeTotal, `${seed}-lit`).slice(0, litCount);
  const litPos = new Map<number, number>();
  litOrder.forEach((idx, pos) => litPos.set(idx, pos));

  const bars = Array.from({ length: safeTotal }, (_, i) => ({
    h: H_MIN + rnd(`${seed}-h`, i) * H_RANGE,
    delay: rnd(`${seed}-d`, i) * dur,
    shade: 0.76 + 0.2 * rnd(`${seed}-o`, i),
    lit: litPos.get(i),
  }));
  const maxH = bars.reduce((m, b) => Math.max(m, b.h), 0);

  return (
    <div style={{ position: 'relative', width, height: maxH, ...style }}>
      {bars.map((b, i) => {
        const s = Math.max(0, springP(frame, fps, start + b.delay, SP.cardLand));
        const litAt = start + Math.max(dur, 20) + (b.lit ?? 0) * 1.2;
        const lp = b.lit === undefined ? 0 : progress(frame, litAt, 8);
        return (
          <div
            key={`spine-${i}`}
            style={{
              position: 'absolute',
              left: i * (barW + BAR_GAP),
              bottom: 0,
              width: barW,
              height: b.h,
              overflow: 'hidden',
              backgroundColor: FILM_COLORS.ink,
              opacity: b.shade,
              transform: `scaleY(${s})`,
              transformOrigin: 'bottom center',
            }}
          >
            {b.lit !== undefined ? (
              <>
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    backgroundColor: FILM_COLORS.accent,
                    opacity: lp,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '8%',
                    backgroundColor: FILM_COLORS.white,
                    opacity: 0.16 * lp,
                  }}
                />
              </>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};