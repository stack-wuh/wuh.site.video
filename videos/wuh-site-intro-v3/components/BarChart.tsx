import type { CSSProperties, FC } from 'react';
import { useCurrentFrame } from 'remotion';
import { DataLabel, Meta } from './Type';
import { FILM_COLORS, FONTS, clamp01, fmtInt, progress, roll, springP } from '../motion-tokens';

export type BarDatum = { label: string; value: number; accent?: boolean; muted?: boolean; sub?: string };

export type BarChartProps = {
  data: readonly BarDatum[];
  mode: 'v' | 'h';
  start?: number;
  dur?: number;
  stagger?: number;
  width?: number;
  height?: number;
  maxValue?: number;
  showValues?: boolean;
  zeroBaseline?: boolean;
  valueSize?: number;
  style?: CSSProperties;
};

/**
 * CH-01 CHART-GROW：柱/横条阵列从基线生长（v = scaleY / h = scaleX），峰值柱最后。
 * CH-02 CHART-SKELETON：轴与零值基座先立；CH-04 峰值 accent 只给一个（数据里 accent 标记）。
 */
export const BarChart: FC<BarChartProps> = ({
  data,
  mode,
  start = 0,
  dur = 22,
  stagger = 5,
  width = 1200,
  height = 420,
  maxValue,
  showValues = true,
  zeroBaseline = true,
  valueSize = 20,
  style,
}) => {
  const frame = useCurrentFrame();
  const max = maxValue ?? Math.max(1, ...data.map((d) => d.value));
  const n = data.length;

  if (mode === 'v') {
    const gap = 24;
    const barW = (width - gap * (n - 1)) / n;
    return (
      <div style={{ position: 'relative', width, height, ...style }}>
        {data.map((d, i) => {
          const at = start + i * stagger;
          const s = springP(frame, 30, at, { damping: 26, stiffness: 160, mass: 1 });
          const h = zeroBaseline && d.value === 0 ? 1 : Math.max(1, (d.value / max) * (height - 46));
          const isAccent = !!d.accent;
          const fill = isAccent ? FILM_COLORS.vermillion : d.muted ? FILM_COLORS.paperDeep : FILM_COLORS.ink;
          const v = roll(frame, at + dur - 8, 20, 0, d.value);
          return (
            <div key={`${d.label}-${i}`} style={{ position: 'absolute', left: i * (barW + gap), bottom: 34, width: barW, height: height - 34 }}>
              {showValues ? (
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    width: barW,
                    bottom: h + 8,
                    textAlign: 'center',
                    fontFamily: FONTS.mono,
                    fontSize: valueSize,
                    color: isAccent ? FILM_COLORS.vermillion : FILM_COLORS.ink,
                    fontVariantNumeric: 'tabular-nums',
                    opacity: clamp01(progress(frame, at + dur - 8, 8)),
                  }}
                >
                  {fmtInt(v)}
                </div>
              ) : null}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  bottom: 0,
                  width: barW,
                  height: h,
                  backgroundColor: fill,
                  transform: `scaleY(${clamp01(s)})`,
                  transformOrigin: 'bottom center',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  bottom: -30,
                  width: barW,
                  textAlign: 'center',
                }}
              >
                <Meta size={14}>{d.label}</Meta>
              </div>
            </div>
          );
        })}
        <div style={{ position: 'absolute', left: 0, bottom: 34, width, height: 1, backgroundColor: FILM_COLORS.hairline }} />
      </div>
    );
  }

  const rowH = 44;
  const labelW = 160;
  const barArea = width - labelW - 120;
  return (
    <div style={{ position: 'relative', width, height: n * rowH, ...style }}>
      {data.map((d, i) => {
        const at = start + i * stagger;
        const s = springP(frame, 30, at, { damping: 26, stiffness: 160, mass: 1 });
        const w = zeroBaseline && d.value === 0 ? 1 : Math.max(1, (d.value / max) * barArea);
        const isAccent = !!d.accent;
        const v = roll(frame, at + dur - 8, 20, 0, d.value);
        return (
          <div key={`${d.label}-${i}`} style={{ position: 'absolute', left: 0, top: i * rowH + 8, width, height: rowH - 14 }}>
            <div style={{ position: 'absolute', left: 0, top: 0, width: labelW }}>
              <DataLabel size={18} color={isAccent ? FILM_COLORS.ink : FILM_COLORS.inkSoft}>
                {d.label}
              </DataLabel>
              {d.sub ? <Meta size={12} style={{ marginTop: 2 }}>{d.sub}</Meta> : null}
            </div>
            <div
              style={{
                position: 'absolute',
                left: labelW,
                top: 7,
                height: 18,
                width: w,
                backgroundColor: isAccent ? FILM_COLORS.vermillion : d.muted ? FILM_COLORS.paperDeep : FILM_COLORS.ink,
                transform: `scaleX(${clamp01(s)})`,
                transformOrigin: 'left center',
              }}
            />
            {showValues ? (
              <div
                style={{
                  position: 'absolute',
                  left: labelW + w + 14,
                  top: 3,
                  fontFamily: FONTS.mono,
                  fontSize: valueSize,
                  color: isAccent ? FILM_COLORS.vermillion : FILM_COLORS.ink,
                  fontVariantNumeric: 'tabular-nums',
                  opacity: clamp01(progress(frame, at + dur - 8, 8)),
                }}
              >
                {fmtInt(v)}
              </div>
            ) : null}
          </div>
        );
      })}
      <div style={{ position: 'absolute', left: labelW, top: 0, bottom: 0, width: 1, backgroundColor: FILM_COLORS.hairline }} />
    </div>
  );
};