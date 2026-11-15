import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { SealStamp } from '../components/SealStamp';
import { ShotShell } from '../components/ShotShell';
import { DataLabel, Meta } from '../components/Type';
import { SERIES } from '../data';
import { EASE, FILM_COLORS, cascadeDelay, draw, progress } from '../motion-tokens';

/**
 * s21 · 2025-12 第一颗星 → 21 微点（110f，2290–2400）
 * 承接 s20 两枚地名：标签向两侧退开（0–18f）→ 2025-12 格位亮起第一颗星（EN-04，2f 短放射）→
 * 星向 2026 方向拉出细线（CH-06，20f），线上 21 个微点级联点亮（EN-05，末点对拍 2380 = 镜内 90f）；
 * 右缘 1px accent 暖边亮起（FX-04，常亮不呼吸）。
 * 数据：SERIES.monthly_commits_2024_12_to_2026_11 — 2025-12 = 21（21 次提交）；
 * 星位取 2025-12-27（HEATMAP 中该年 12 月首个有活动的日子）。全镜无字幕。
 */

const CELL = 14;
const GAP = 5;
const STEP = CELL + GAP;
const ROWS = 12;
const COLS = 31;
const BX = 620;
const BY = 150;

const STAR_ROW = 11;
const STAR_COL = 26;
const STAR_X = BX + STAR_COL * STEP + CELL / 2;
const STAR_Y = BY + STAR_ROW * STEP + CELL / 2;
const LINE_END = 1860;

const COMMITS = SERIES.monthly_commits_2024_12_to_2026_11.find((m) => m.month === '2025-12')?.value ?? 0;
const N_DOTS = COMMITS;

/** 先前方（s19/s20）已亮的 4 格：6 月 3 格 + 7 月 1 格 */
const LIT: ReadonlyArray<readonly [number, number]> = [
  [5, 8],
  [5, 17],
  [5, 25],
  [6, 11],
];

const dotX = (i: number): number => STAR_X + 44 + (i * (LINE_END - STAR_X - 44)) / Math.max(1, N_DOTS - 1);

const S21: FC = () => {
  const frame = useCurrentFrame();

  /* 两枚地名标签向两侧退开 */
  const retract = progress(frame, 0, 18, EASE.in);
  /* 第一颗星：落定 12，2f 短放射后即收 */
  const star = progress(frame, 8, 6);
  const burst = progress(frame, 10, 8);
  /* 细线描画 16–36 */
  const lineP = progress(frame, 16, 20, EASE.out);
  /* 右缘暖边 62–74 */
  const edge = progress(frame, 62, 12, EASE.out);
  /* 末点对拍后的 2f 收尾脉冲 */
  const ping = progress(frame, 96, 6);

  return (
    <ShotShell act="ACT 02 · 沉默">
      <AbsoluteFill>
        <AbsoluteFill style={{ backgroundColor: FILM_COLORS.paper }} />

        <div style={{ position: 'absolute', left: 120, top: 128 }}>
          <DataLabel size={15}>FIRST STAR · 2025-12</DataLabel>
        </div>

        {/* 承 s20：两枚地名藏印向两侧退开 */}
        <div style={{ position: 'absolute', left: 372 - retract * 300, top: 236, opacity: 1 - retract }}>
          <SealStamp text="杨梅坑" size={96} start={0} />
        </div>
        <div style={{ position: 'absolute', left: 1336 + retract * 240, top: 300, opacity: 1 - retract }}>
          <SealStamp text="梧桐山" size={96} start={0} />
        </div>

        {/* 2025 空白格带（承 s19/s20） */}
        {Array.from({ length: ROWS * COLS }, (_, k) => {
          const row = Math.floor(k / COLS);
          const col = k % COLS;
          const lit = LIT.some(([r, c]) => r === row && c === col) || (row === STAR_ROW && col === STAR_COL);
          return (
            <div
              key={`c-${row}-${col}`}
              style={{
                position: 'absolute',
                left: BX + col * STEP,
                top: BY + row * STEP,
                width: CELL,
                height: CELL,
                boxSizing: 'border-box',
                backgroundColor: lit ? FILM_COLORS.ink : 'transparent',
                border: `1px solid ${lit ? FILM_COLORS.ink : FILM_COLORS.hairline}`,
                opacity: lit ? 1 : 0.5,
              }}
            />
          );
        })}

        {/* 细线：星 → 2026 方向（CH-06 点先落、线后连） */}
        <svg style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080 }} viewBox="0 0 1920 1080" fill="none">
          <line
            x1={STAR_X + 10}
            y1={STAR_Y}
            x2={LINE_END}
            y2={STAR_Y}
            stroke={FILM_COLORS.hairline}
            strokeWidth={1.5}
            strokeLinecap="round"
            {...draw(lineP)}
          />
        </svg>

        {/* 第一颗星 + 2f 短放射 */}
        <div
          style={{
            position: 'absolute',
            left: STAR_X - 9,
            top: STAR_Y - 9,
            width: 18,
            height: 18,
            opacity: star,
            transform: `scale(${0.7 + 0.3 * star})`,
          }}
        >
          <div style={{ width: 18, height: 18, borderRadius: '50%', backgroundColor: FILM_COLORS.ink }} />
          {[0, 1].map((k) => (
            <div
              key={`ray-${k}`}
              style={{
                position: 'absolute',
                left: 9,
                top: 9,
                width: 22,
                height: 1,
                backgroundColor: FILM_COLORS.vermillion,
                transform: `rotate(${k === 0 ? 0 : 90}deg) scaleX(${burst <= 0 ? 1 : 1 - burst * 0.6})`,
                transformOrigin: 'left center',
                opacity: burst > 0 && burst < 1 ? 1 - burst : 0,
              }}
            />
          ))}
        </div>

        {/* 21 个微点（EN-05 级联，越后越快、末点对拍 90） */}
        {Array.from({ length: N_DOTS }, (_, i) => {
          const at = cascadeDelay(i, N_DOTS, 22, 98, 0.35);
          const p = progress(frame, at, 4);
          const isLast = i === N_DOTS - 1;
          return (
            <div
              key={`d-${i}`}
              style={{
                position: 'absolute',
                left: dotX(i) - 3,
                top: STAR_Y - 3,
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: isLast ? FILM_COLORS.vermillion : FILM_COLORS.ink,
                opacity: p,
                transform: `scale(${0.4 + 0.6 * p}${isLast && ping > 0 && ping < 1 ? 1 + ping * 0.6 : 1})`,
              }}
            />
          );
        })}

        {/* 右缘 1px accent 暖边（2026 的边，常亮） */}
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            width: 1,
            height: 1080,
            backgroundColor: FILM_COLORS.accent,
            opacity: edge,
            transform: `scaleY(${edge})`,
            transformOrigin: 'top center',
          }}
        />

        <Meta size={13} style={{ position: 'absolute', left: STAR_X, top: STAR_Y + 26 }}>
          2025-12 → 2026
        </Meta>

        {/* 21 次提交的标签（画面数据标签，非字幕） */}
        <div
          style={{
            position: 'absolute',
            right: 120,
            top: 128,
            textAlign: 'right',
            opacity: interpolate(frame, [80, 94], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}
        >
          <Meta size={13}>COMMITS · 2025-12</Meta>
          <DataLabel size={20} color={FILM_COLORS.ink} style={{ marginTop: 6 }}>
            {N_DOTS}
          </DataLabel>
        </div>
      </AbsoluteFill>
    </ShotShell>
  );
};

export default S21;