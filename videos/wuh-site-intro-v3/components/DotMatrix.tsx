import type { CSSProperties, FC } from 'react';
import { useCurrentFrame } from 'remotion';
import { FILM_COLORS, cascadeDelay, progress, shuffled } from '../motion-tokens';

export type DotDay = { date: string; total: number; level: number };

export type DotMatrixProps = {
  /** 365 天（2025-11-15 → 2026-11-14） */
  days: readonly DotDay[];
  start?: number;
  /** 级联窗口 f（默认 90） */
  dur?: number;
  /** 点径（默认 10） */
  dot?: number;
  /** 点间距（默认 6） */
  gap?: number;
  /** 只亮 level>0（s39 用）：非活动日只留 1px 极淡点 */
  litOnly?: boolean;
  style?: CSSProperties;
};

/** 纯日期算星期（禁 Date：Howard Hinnant days_from_civil；1970-01-01 为周四=4） */
const weekdayOf = (iso: string): number => {
  const [y, m, d] = iso.split('-').map(Number);
  const yy = m <= 2 ? y - 1 : y;
  const era = Math.floor(yy / 400);
  const yoe = yy - era * 400;
  const mp = m + (m > 2 ? -3 : 9);
  const doy = Math.floor((153 * mp + 2) / 5) + d - 1;
  const doe = yoe * 365 + Math.floor(yoe / 4) - Math.floor(yoe / 100) + doy;
  const days = era * 146097 + doe - 719468;
  return (((days + 4) % 7) + 7) % 7;
};

/**
 * GR-01 DOT-MATRIX-SPREAD：点阵（53 列 × 7 行，列 = 周，行 = 周几）。
 * 坐标由行列数学生成（不 random）；级联顺序由 seed 洗牌确定性排列（shuffled + cascadeDelay）。
 * 活动日按 level 由纸深点亮到墨（同色相明度，不撒色）；litOnly 时非活动日只留 1px 极淡点。
 */
export const DotMatrix: FC<DotMatrixProps> = ({
  days,
  start = 0,
  dur = 90,
  dot = 10,
  gap = 6,
  litOnly = false,
  style,
}) => {
  const frame = useCurrentFrame();
  const n = days.length;
  const offset = weekdayOf(days[0]?.date ?? '2025-11-15');
  const cols = Math.ceil((n + offset) / 7);
  const cell = dot + gap;
  const w = Math.max(dot, cols * cell - gap);
  const h = Math.max(dot, 7 * cell - gap);

  /* 级联顺序：seed 洗牌（确定性），越后越快、末点对拍 */
  const order = shuffled(n, 'dot-matrix');
  const posOf = new Map<number, number>();
  order.forEach((idx, pos) => posOf.set(idx, pos));

  return (
    <div style={{ position: 'relative', width: w, height: h, ...style }}>
      {days.map((d, i) => {
        const col = Math.floor((i + offset) / 7);
        const row = (i + offset) % 7;
        const left = col * cell;
        const top = row * cell;
        const active = d.level > 0;

        /* litOnly 的静默日：1px 极淡点（结构在场，不抢活动日） */
        if (litOnly && !active) {
          return (
            <div
              key={d.date}
              style={{
                position: 'absolute',
                left: left + dot / 2 - 0.5,
                top: top + dot / 2 - 0.5,
                width: 1,
                height: 1,
                backgroundColor: FILM_COLORS.hairline,
              }}
            />
          );
        }

        const pos = posOf.get(i) ?? n;
        const p = progress(frame, start + cascadeDelay(pos, n, 0, Math.max(8, dur - 6), 0.25), 5);
        const inkOpacity = active ? 0.32 + d.level * 0.17 : 0;
        return (
          <div
            key={d.date}
            style={{
              position: 'absolute',
              left,
              top,
              width: dot,
              height: dot,
              borderRadius: '50%',
              backgroundColor: active ? FILM_COLORS.ink : FILM_COLORS.paperDeep,
              opacity: (active ? Math.min(1, inkOpacity) : 0.85) * p,
              transform: `scale(${0.25 + 0.75 * p})`,
            }}
          />
        );
      })}
    </div>
  );
};