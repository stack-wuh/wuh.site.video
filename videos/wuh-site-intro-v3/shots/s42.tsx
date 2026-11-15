import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ShotShell } from '../components/ShotShell';
import { SpineArray } from '../components/SpineArray';
import { DataLabel, Kicker, Meta } from '../components/Type';
import { CURVES, FILM_COLORS, FONTS, GRID, progress } from '../motion-tokens';
import { SCALARS } from '../data';

/**
 * s42 · 音乐年轮（60f，4360–4420 ｜ 主落定 40f）
 * MO-02：同心 8 环（内 2019 → 外 2026）半径 60→340 依次画出；环上一枚 accent 刻度
 * 8f 内转 12° 后停（不做整圈旋转，整圈旋转是装饰）。
 * 尾帧：年轮 + 刻度停在 12° → s43 弹幕与标签云。
 */

const CX = 760;
const CY = 560;
const R0 = 60;
const DR = 40;
const RINGS = 8;
const VB = 720; // SVG 边长（外环 340 + 余量）

const S42: FC = () => {
  const frame = useCurrentFrame();

  /* 刻度：20–28f 内转 12° 后停（cineEaseInOut，8f） */
  const turn = 12 * progress(frame, 20, 8, CURVES.cineEaseInOut);

  /* 承接 s41：书脊阵列横移出画（0–14f） */
  const shelfOut = progress(frame, 0, 14, CURVES.cineEaseIn);

  return (
    <ShotShell act="ACT 04 · 屋里">
      <AbsoluteFill>
        <div style={{ position: 'absolute', left: GRID.margin, top: 118 }}>
          <Kicker>第 04 节 · 音乐</Kicker>
        </div>
        <div style={{ position: 'absolute', right: GRID.margin, top: 118, textAlign: 'right' }}>
          <DataLabel size={18}>MUSIC · 8 YEARS</DataLabel>
          <Meta size={12} style={{ marginTop: 8 }}>
            2019 → 2026
          </Meta>
        </div>

        {/* 上镜书脊横移出画 */}
        <div
          style={{
            position: 'absolute',
            left: GRID.margin,
            bottom: 380,
            width: GRID.content,
            transform: `translateX(${-1680 * shelfOut}px)`,
            opacity: 1 - 0.4 * shelfOut,
          }}
        >
          <SpineArray
            total={SCALARS.bookshelf}
            lit={SCALARS.books_finished}
            seed="s41-spine"
            start={-60}
            dur={26}
            width={GRID.content}
          />
        </div>

        <svg width={VB} height={VB} style={{ position: 'absolute', left: CX - VB / 2, top: CY - VB / 2 }}>
          {Array.from({ length: RINGS }, (_, i) => {
            const r = R0 + i * DR;
            const p = progress(frame, 4 + i * 2, 20);
            return (
              <circle
                key={`ring-${i}`}
                cx={VB / 2}
                cy={VB / 2}
                r={r}
                fill="none"
                stroke={FILM_COLORS.ink}
                strokeWidth={i === RINGS - 1 ? 1.6 : 1}
                opacity={0.18 + 0.5 * (i / (RINGS - 1))}
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - p}
              />
            );
          })}

          {/* accent 刻度（外环上，随年轮微转 12° 后停） */}
          <g transform={`rotate(${turn} ${VB / 2} ${VB / 2})`}>
            <line
              x1={VB / 2 + (R0 + (RINGS - 1) * DR) - 26}
              y1={VB / 2}
              x2={VB / 2 + (R0 + (RINGS - 1) * DR)}
              y2={VB / 2}
              stroke={FILM_COLORS.accent}
              strokeWidth={3}
              opacity={progress(frame, 16, 6)}
            />
            <circle
              cx={VB / 2 + (R0 + (RINGS - 1) * DR) + 4}
              cy={VB / 2}
              r={3.2}
              fill={FILM_COLORS.accent}
              opacity={progress(frame, 18, 6)}
            />
          </g>

          {/* 中心墨点（年轮心） */}
          <circle cx={VB / 2} cy={VB / 2} r={5} fill={FILM_COLORS.amber} opacity={progress(frame, 24, 8)} />
        </svg>

        {/* 年份刻度梯：每环顶部一枚（内 2019 → 外 2026） */}
        {Array.from({ length: RINGS }, (_, i) => {
          const r = R0 + i * DR;
          const p = progress(frame, 10 + i * 2, 8);
          return (
            <div
              key={`yr-${i}`}
              style={{
                position: 'absolute',
                left: CX - 30,
                top: CY - r + 20,
                width: 60,
                textAlign: 'center',
                fontFamily: FONTS.mono,
                fontSize: 13,
                letterSpacing: '0.12em',
                color: i === RINGS - 1 ? FILM_COLORS.ink : FILM_COLORS.muted,
                opacity: p,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {2019 + i}
            </div>
          );
        })}

        {/* 右缘竖排说明（把右侧空白收成一条排版线） */}
        <div
          style={{
            position: 'absolute',
            left: 1240,
            top: 300,
            height: 420,
            width: 1,
            backgroundColor: FILM_COLORS.hairline,
            opacity: progress(frame, 8, 12),
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 1276,
            top: 300,
            height: 420,
            writingMode: 'vertical-rl',
            fontFamily: FONTS.mono,
            fontSize: 13,
            letterSpacing: '0.34em',
            textTransform: 'uppercase',
            color: FILM_COLORS.muted,
            opacity: progress(frame, 12, 14),
          }}
        >
          ONE RING = ONE YEAR · 2019–2026
        </div>
      </AbsoluteFill>
    </ShotShell>
  );
};

export default S42;