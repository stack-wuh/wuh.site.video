import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { ShotShell } from '../components/ShotShell';
import { Meta } from '../components/Type';
import { SERIES } from '../data';
import { EASE, FILM_COLORS, FONTS, T, fmtInt, progress, roll } from '../motion-tokens';

/**
 * s16 · 2024 柱顶特写「59」（80f，1720–1800）
 * 承接 s15 最高柱：59 滚到定值（NUM-01，0–18f）→ 朱红 hairline 自柱顶拉出横贯画面（INK-03 pull 2f，
 * 落定 1740 = 镜内 20f）；右侧浮出「2024 · 59 篇」标签（TX-05）；其余五柱退 paperDeep 灰阶（FX-07，40f）。
 * 数据：SERIES.yearly_writing_2019_2026（2024 = 59；余五柱 11/14/10/3/30 仅作灰阶背景）。
 */

const YEARS = SERIES.yearly_writing_2019_2026.slice(0, 6);
const PEAK = YEARS[5].all;
const GHOST = YEARS.slice(0, 5);
const GHOST_MAX = Math.max(...GHOST.map((g) => g.all));

const S16: FC = () => {
  const frame = useCurrentFrame();

  const v = roll(frame, 0, 18, 0, PEAK);
  /* INK-03 pull：宽度 0 → 横贯（2f），落定 20 */
  const pull = progress(frame, 18, 2, EASE.out);
  /* FX-07 去色：其余五柱 grayscale 0 → 0.85（40f） */
  const drain = interpolate(frame, [20, 72], [0, 0.85], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const labelIn = progress(frame, 20, 12);

  return (
    <ShotShell act="ACT 02 · 沉默">
      <AbsoluteFill>
        {/* 其余五柱：退为 paperDeep 灰阶底纹（FX-07） */}
        <div
          style={{
            position: 'absolute',
            left: 140,
            top: 620,
            width: 520,
            height: 300,
            filter: `grayscale(${drain}) brightness(${1 - drain * 0.1})`,
            opacity: interpolate(drain, [0, 0.85], [1, 0.35], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}
        >
          <div style={{ position: 'absolute', left: 0, top: 300, width: 520, height: 1, backgroundColor: FILM_COLORS.hairline }} />
          {GHOST.map((g, i) => {
            const h = Math.max(6, (g.all / GHOST_MAX) * 168);
            return (
              <div
                key={g.year}
                style={{
                  position: 'absolute',
                  left: i * 104,
                  bottom: 0,
                  width: 62,
                  height: h,
                  backgroundColor: FILM_COLORS.paperDeep,
                  border: `1px solid ${FILM_COLORS.hairline}`,
                  boxSizing: 'border-box',
                }}
              />
            );
          })}
        </div>

        {/* 2024 柱体（特写：顶面 = hairline 高度） */}
        <div
          style={{
            position: 'absolute',
            left: 800,
            top: 300,
            width: 220,
            height: 620,
            backgroundColor: FILM_COLORS.ink,
            borderTop: `2px solid ${FILM_COLORS.vermillion}`,
          }}
        />

        {/* 59 特写（NUM-01） */}
        <div
          style={{
            position: 'absolute',
            left: 800,
            top: 8,
            width: 220,
            display: 'flex',
            justifyContent: 'center',
            fontFamily: FONTS.serif,
            fontWeight: 700,
            fontSize: 250,
            lineHeight: 1,
            letterSpacing: '-0.03em',
            color: FILM_COLORS.ink,
            fontVariantNumeric: 'tabular-nums lining-nums',
          }}
        >
          {fmtInt(v)}
        </div>

        {/* 朱红 hairline 自柱顶拉出横贯画面 */}
        <div
          style={{
            position: 'absolute',
            left: 910 - (1640 * pull) / 2,
            top: 300,
            width: 1640 * pull,
            height: 1,
            backgroundColor: FILM_COLORS.vermillion,
          }}
        />

        {/* 「2024 · 59 篇」标签浮出（TX-05） */}
        <div
          style={{
            position: 'absolute',
            right: 140,
            top: 336,
            display: 'flex',
            alignItems: 'baseline',
            gap: 18,
            opacity: labelIn,
            transform: `translateY(${(1 - labelIn) * 6}px)`,
          }}
        >
          <div
            style={{
              fontFamily: FONTS.serif,
              fontWeight: 700,
              fontSize: T.data,
              color: FILM_COLORS.ink,
              fontVariantNumeric: 'tabular-nums lining-nums',
            }}
          >
            2024 · 59 篇
          </div>
          <Meta size={14}>ARTICLES</Meta>
        </div>

        {/* 柱下年份刻度（承接 s15 轴标） */}
        <div style={{ position: 'absolute', left: 800, top: 936, width: 220, textAlign: 'center' }}>
          <Meta size={15}>2024</Meta>
        </div>
      </AbsoluteFill>
    </ShotShell>
  );
};

export default S16;