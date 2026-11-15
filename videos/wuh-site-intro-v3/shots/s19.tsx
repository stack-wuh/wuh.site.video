import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { KineticLine } from '../components/KineticLine';
import { ShotShell } from '../components/ShotShell';
import { DataLabel, Meta } from '../components/Type';
import { SERIES } from '../data';
import { FILM_COLORS, FONTS, draw, progress } from '../motion-tokens';

/**
 * s19 · 2025 沉默长镜（190f，2010–2200）—— 全片唯一长镜 / 唯一暗场
 * GR-01 七点弧延伸成 2025 全年空白格带（12 个月 × 31 格 hairline 点阵，行 1f / 列 0.15f 铺开）；
 * 仅 6 月 3 格 + 7 月 1 格亮（4 次提交，INK-06 纸晕）；中央偏左巨型「4」、右侧巨型「0」+ mono PUBLIC POSTS
 * （NUM-04 反衬数字：浮出 8f + 各一次 6f 呼吸，不滚——motion-spec §6.4 唯一豁免）。
 * ShotShell tone="dim"（FX-06 纸面压暗 12%）。落定 2100 = 镜内 90f，之后 100f 几乎不动。
 * 数据：SERIES.monthly_commits_2024_12_to_2026_11（2025-06 = 3、2025-07 = 1 → 4 次提交）；
 * SERIES.yearly_open_articles（2025 公开文章 = 0）。具体提交日未采，格位只承载「月级 3+1」事实。
 */

const CELL = 14;
const GAP = 5;
const STEP = CELL + GAP;
const ROWS = 12; /* 月 */
const COLS = 31; /* 日 */
const BX = 620;
const BY = 150;

const COMMITS_2025 =
  (SERIES.monthly_commits_2024_12_to_2026_11.find((m) => m.month === '2025-06')?.value ?? 0) +
  (SERIES.monthly_commits_2024_12_to_2026_11.find((m) => m.month === '2025-07')?.value ?? 0);
const OPEN_2025 = SERIES.yearly_open_articles.find((y) => y.label === '2025')?.value ?? 0;

/** 亮格（行 = 月 0–11，列 = 日 0–30）：6 月 3 格 + 7 月 1 格 */
const LIT: ReadonlyArray<readonly [number, number]> = [
  [5, 8],
  [5, 17],
  [5, 25],
  [6, 11],
];

const cellX = (col: number): number => BX + col * STEP;
const cellY = (row: number): number => BY + row * STEP;

/** NUM-04 反衬数字：浮出 8f + 单次 6f 呼吸（scale 1→1.02→1），不滚 */
const absence = (frame: number, appear: number, breath: number): { opacity: number; y: number; scale: number } => {
  const op = progress(frame, appear, 8);
  const y = (1 - op) * 6;
  const scale = interpolate(frame, [breath, breath + 3, breath + 6], [1, 1.02, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return { opacity: op, y, scale };
};

const S19: FC = () => {
  const frame = useCurrentFrame();
  const n4 = absence(frame, 82, 96);
  const n0 = absence(frame, 82, 148);

  /* s18 尾帧的七点短弧：本镜首 12f 淡出（延伸的起点） */
  const arcFade = 1 - progress(frame, 0, 12);

  return (
    <ShotShell act="ACT 02 · 沉默" tone="dim">
      <AbsoluteFill>
        {/* 承接 s18：七点弧淡出 */}
        <svg
          style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, opacity: arcFade }}
          viewBox="0 0 1920 1080"
          fill="none"
        >
          <path
            d="M 470 507 Q 926 439 1382 507"
            stroke={FILM_COLORS.ink}
            strokeWidth={1.5}
            strokeLinecap="round"
            {...draw(1)}
          />
        </svg>

        {/* 年份水印 */}
        <Meta size={14} style={{ position: 'absolute', left: BX, top: 112 }}>
          2025
        </Meta>

        {/* 2025 全年空白格带：12 月 × 31 格 hairline 点阵 */}
        <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080 }}>
          {Array.from({ length: ROWS * COLS }, (_, k) => {
            const row = Math.floor(k / COLS);
            const col = k % COLS;
            /* GR-01：行 stagger 1f、列 0.15f（坐标数学生成，不 random） */
            const p = progress(frame, row * 1 + col * 0.15, 8);
            const litIdx = LIT.findIndex(([r, c]) => r === row && c === col);
            /* 4 格在格带铺开后再逐格点亮（INK-06） */
            const fill = litIdx >= 0 ? progress(frame, 32 + litIdx * 4, 8) : 0;
            return (
              <div
                key={`c-${row}-${col}`}
                style={{
                  position: 'absolute',
                  left: cellX(col),
                  top: cellY(row),
                  width: CELL,
                  height: CELL,
                  boxSizing: 'border-box',
                  border: `1px solid ${FILM_COLORS.hairline}`,
                  opacity: p * 0.5,
                }}
              >
                {litIdx >= 0 ? (
                  <div
                    style={{
                      position: 'absolute',
                      inset: -1,
                      backgroundColor: FILM_COLORS.ink,
                      border: `1px solid ${FILM_COLORS.ink}`,
                      opacity: fill,
                    }}
                  />
                ) : null}
              </div>
            );
          })}
          {/* 月份刻度（行标 01–12） */}
          {Array.from({ length: ROWS }, (_, row) => (
            <Meta
              key={`m-${row}`}
              size={11}
              style={{
                position: 'absolute',
                left: BX - 34,
                top: cellY(row) + 2,
                opacity: progress(frame, row * 1 + 4, 8) * 0.9,
              }}
            >
              {String(row + 1).padStart(2, '0')}
            </Meta>
          ))}
          {/* 4 格纸晕（INK-06） */}
          {LIT.map(([row, col], li) => {
            const b = progress(frame, 32 + li * 4, 10);
            return (
              <div
                key={`b-${row}-${col}`}
                style={{
                  position: 'absolute',
                  left: cellX(col) + CELL / 2 - 18,
                  top: cellY(row) + CELL / 2 - 18,
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  border: `1px solid ${FILM_COLORS.hairline}`,
                  opacity: (1 - b) * 0.35,
                  transform: `scale(${0.4 + b * 0.6})`,
                }}
              />
            );
          })}
        </div>

        {/* 巨型「4」 */}
        <div
          style={{
            position: 'absolute',
            left: 168,
            top: 396,
            fontFamily: FONTS.serif,
            fontWeight: 700,
            fontSize: 320,
            lineHeight: 1,
            letterSpacing: '-0.03em',
            color: FILM_COLORS.ink,
            fontVariantNumeric: 'tabular-nums lining-nums',
            opacity: n4.opacity,
            transform: `translateY(${n4.y}px) scale(${n4.scale})`,
            transformOrigin: 'center center',
          }}
        >
          {COMMITS_2025}
        </div>

        {/* 巨型「0」+ mono PUBLIC POSTS */}
        <div
          style={{
            position: 'absolute',
            left: 1418,
            top: 396,
            opacity: n0.opacity,
            transform: `translateY(${n0.y}px) scale(${n0.scale})`,
            transformOrigin: 'center center',
          }}
        >
          <div
            style={{
              fontFamily: FONTS.serif,
              fontWeight: 700,
              fontSize: 320,
              lineHeight: 1,
              letterSpacing: '-0.03em',
              color: FILM_COLORS.ink,
              fontVariantNumeric: 'tabular-nums lining-nums',
            }}
          >
            {OPEN_2025}
          </div>
          <div style={{ marginTop: 18, marginLeft: 8 }}>
            <DataLabel size={18}>PUBLIC POSTS</DataLabel>
          </div>
        </div>

        {/* 字幕两句（一镜两句，190f 内顺序出） */}
        <div style={{ position: 'absolute', left: 120, top: 838, width: 1680 }}>
          <KineticLine text="2025 年，只有 4 次提交。" start={48} framesPerChar={2} size={42} />
        </div>
        <div style={{ position: 'absolute', left: 120, top: 910, width: 1680 }}>
          <KineticLine text="全年 0 篇公开文章。" start={104} framesPerChar={2} size={42} />
        </div>
        <div style={{ position: 'absolute', left: 120, top: 992, width: 300, height: 1, backgroundColor: FILM_COLORS.hairline }} />
      </AbsoluteFill>
    </ShotShell>
  );
};

export default S19;