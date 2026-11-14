import type { CSSProperties, FC } from 'react';
import { useCurrentFrame } from 'remotion';
import { FILM_COLORS, cascadeDelay, progress, rnd } from '../motion-tokens';

export type HeatDay = { date: string; total: number; level: number };

export type HeatmapProps = {
  days: readonly HeatDay[];
  /** 左上周几偏移（0=周日）与天序：由数据首日算出，确定性 */
  startWeekday?: number;
  cell?: number;
  gap?: number;
  x?: number;
  y?: number;
  /** 级联起点帧（默认 0） */
  start?: number;
  /** 级联时长（默认 110f） */
  dur?: number;
  /** 峰值格强调 */
  peak?: boolean;
  style?: CSSProperties;
};

const LEVEL_FILL = [
  FILM_COLORS.paperDeep,
  'rgba(227,181,103,0.30)',
  'rgba(227,181,103,0.55)',
  'rgba(227,181,103,0.75)',
  FILM_COLORS.accent,
] as const;

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
  return ((days + 4) % 7 + 7) % 7;
};

/**
 * GR-05 热力逐格点亮（53×7，365 天）。
 * 按 seed 洗牌序级联点亮（确定性）；峰值格最后亮、朱红描边 + 微放大。
 */
export const Heatmap: FC<HeatmapProps> = ({
  days,
  startWeekday,
  cell = 18,
  gap = 4,
  x = 0,
  y = 0,
  start = 0,
  dur = 110,
  peak = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const offset = startWeekday ?? weekdayOf(days[0]?.date ?? '2025-11-15');
  const n = days.length;
  const peakIdx = (() => {
    let idx = 0;
    let max = -1;
    days.forEach((d, i) => {
      if (d.total > max) {
        max = d.total;
        idx = i;
      }
    });
    return idx;
  })();

  /* seed 洗牌序：确定性点亮顺序（峰值格强制最后） */
  const order: number[] = (() => {
    const arr = Array.from({ length: n }, (_, i) => i).sort((a, b) => rnd(`heat-${a}`, 1) - rnd(`heat-${b}`, 1));
    return arr.filter((i) => i !== peakIdx);
  })();
  const posOf = new Map<number, number>();
  order.forEach((idx, pos) => posOf.set(idx, pos));

  return (
    <div style={{ position: 'absolute', left: x, top: y, width: 53 * (cell + gap), height: 7 * (cell + gap), ...style }}>
      {days.map((d, i) => {
        const col = Math.floor((i + offset) / 7);
        const row = (i + offset) % 7;
        const isPeak = i === peakIdx;
        const pos = posOf.get(i) ?? order.length;
        const delay = isPeak ? dur - 4 : cascadeDelay(pos, order.length, 0, dur - 6, 0.25);
        const p = progress(frame, start + delay, 6);
        const scale = isPeak ? 1 + 0.15 * progress(frame, start + dur - 4, 8) : 1;
        return (
          <div
            key={d.date}
            style={{
              position: 'absolute',
              left: col * (cell + gap),
              top: row * (cell + gap),
              width: cell,
              height: cell,
              borderRadius: 2,
              backgroundColor: d.level > 0 ? LEVEL_FILL[Math.min(4, d.level)] : FILM_COLORS.paperDeep,
              border: isPeak && peak ? `1.5px solid ${FILM_COLORS.vermillion}` : '1px solid rgba(42,30,22,0.06)',
              opacity: 0.25 + 0.75 * p,
              transform: `scale(${scale})`,
            }}
          />
        );
      })}
    </div>
  );
};