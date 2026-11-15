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
 * 每位一列：窗口高 = 1em（严格裁切），列内 0-9 ×2；每个数字格用 flex 居中，
 * 避免字体上升部/下降部越过 1em 行盒造成相邻数字残影（首版踩坑：整屏数字叠成乱码）。
 * 千分位逗号静态渲染。
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
  const chars = Array.from(fmtInt(value));
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

  const digitCell: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: size,
    lineHeight: `${size}px`,
  };

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
              <span key={`c-${i}`} style={{ display: 'inline-block', width: size * 0.3, ...digitCell }}>
                ,
              </span>
            );
          }
          const place = places[i];
          const cont = v / place;
          const digit = Math.floor(cont) % 10;
          /* 整位吸附：机械表在高位会长期停在小数偏移（64,985 → 十位 6.4985），
             连续 offset 会把静帧渲染成「半格字」；显示用途必须落整位。 */
          const offset = digit;
          return (
            <span
              key={`d-${i}`}
              style={{
                display: 'inline-block',
                position: 'relative',
                width: size * 0.64,
                height: size,
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
                  transform: `translateY(${-offset * size}px)`,
                }}
              >
                {STRIP.map((d, k) => (
                  <span key={k} style={digitCell}>
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