import type { CSSProperties, FC } from 'react';
import { useCurrentFrame } from 'remotion';
import { DataLabel } from './Type';
import { FILM_COLORS, FONTS, T, fmtInt, roll } from '../motion-tokens';

export type OdometerProps = {
  value: number;
  start?: number;
  dur?: number;
  size?: number;
  color?: string;
  label?: string;
  style?: CSSProperties;
};

const STRIP = Array.from({ length: 20 }, (_, i) => i % 10);

/**
 * NUM-02 NUM-ODOMETER：逐位滚动（机械计数器）。
 * 每位一列 overflow hidden，列内 0-9 重复两遍；按连续值 translateY(-(digit+frac)·1em)。
 * 千分位逗号静态渲染（不参与滚动）。
 */
export const Odometer: FC<OdometerProps> = ({
  value,
  start = 0,
  dur = 60,
  size = T.hero,
  color = FILM_COLORS.ink,
  label,
  style,
}) => {
  const frame = useCurrentFrame();
  const v = dur > 0 ? roll(frame, start, dur, 0, value) : value;
  const finalText = fmtInt(value);
  const chars = Array.from(finalText);
  // 每位对应的数量级
  const places: number[] = [];
  {
    let p = 1;
    for (let i = chars.length - 1; i >= 0; i--) {
      if (chars[i] === ',') {
        places[i] = 0;
      } else {
        places[i] = p;
        p *= 10;
      }
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', ...style }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          fontFamily: FONTS.serif,
          fontWeight: 700,
          fontSize: size,
          lineHeight: 1,
          letterSpacing: '-0.02em',
          color,
          fontVariantNumeric: 'tabular-nums lining-nums',
        }}
      >
        {chars.map((ch, i) => {
          if (ch === ',') {
            return (
              <span key={`c-${i}`} style={{ display: 'inline-block', width: size * 0.28, textAlign: 'center' }}>
                ,
              </span>
            );
          }
          const place = places[i];
          const cont = v / place;
          const digit = Math.floor(cont) % 10;
          const frac = cont - Math.floor(cont);
          const offset = (digit + frac) * 1;
          return (
            <span
              key={`d-${i}`}
              style={{
                display: 'inline-block',
                position: 'relative',
                width: size * 0.62,
                height: size * 1.02,
                overflow: 'hidden',
              }}
            >
              <span
                style={{
                  display: 'block',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: '100%',
                  transform: `translateY(${-offset}em)`,
                }}
              >
                {STRIP.map((d, k) => (
                  <span
                    key={k}
                    style={{ display: 'block', height: '1em', lineHeight: '1em', textAlign: 'center' }}
                  >
                    {d}
                  </span>
                ))}
              </span>
            </span>
          );
        })}
      </div>
      {label ? (
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 120, height: 1, backgroundColor: FILM_COLORS.hairline }} />
          <DataLabel>{label}</DataLabel>
        </div>
      ) : null}
    </div>
  );
};