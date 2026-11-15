import type { FC } from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { KineticLine } from '../components/KineticLine';
import { ShotShell } from '../components/ShotShell';
import { DataLabel, Meta } from '../components/Type';
import { SERIES } from '../data';
import { EASE, FILM_COLORS, FONTS, fmtInt, progress, rnd, roll } from '../motion-tokens';

/**
 * s22 · 2025-12 · 火重新点着（120f，2400–2520）
 * 三幕起：FX-05 暖边向左展开整幅纸面 → 21 个微点收成一根柱，从 baseline 生长到 21（CH-01，
 * 本地 barGrow 弹性 = motion-spec SPRINGS.barGrow；过冲 4%）→ 柱顶三颗 accent 火星落定即灭（FX-09）；
 * 柱下 2025-12 刻度（TX-05）；baseline 向右延出（尾帧交 s23）。落定 2480 = 镜内 80f。
 * 数据：SERIES.monthly_commits_2024_12_to_2026_11 — 2025-12 = 21。
 */

const MONTHS = SERIES.monthly_commits_2024_12_to_2026_11;
const COMMITS = MONTHS.find((m) => m.month === '2025-12')?.value ?? 0;
const DOTS = COMMITS;

const BAR_X = 360;
const BAR_W = 200;
const BASE_Y = 820;
const BAR_H = 420;
const BAR_GROW = { damping: 14, stiffness: 120, mass: 1.1 };

/** 微点从 s21 的细线位置汇入柱顶 */
const dotFrom = (i: number): { x: number; y: number } => ({
  x: 1141 + 44 + (i * (1860 - 1141 - 44)) / Math.max(1, DOTS - 1),
  y: 366,
});

const S22: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* FX-05 暖边展开成整幅纸面（0–20f） */
  const unfold = progress(frame, 0, 20, EASE.inOut);
  /* 21 点收柱（8–30f） */
  const conv = progress(frame, 8, 22, EASE.in);
  /* 柱生长（30f 起，barGrow 弹性） */
  const grow = Math.min(1.04, spring({ frame: frame - 30, fps, config: BAR_GROW }));
  /* 柱顶 21 滚动落定 80 */
  const numP = progress(frame, 56, 8);
  const v = roll(frame, 56, 24, 0, COMMITS);
  /* base 右延（60–84f） */
  const lineP = progress(frame, 60, 24, EASE.out);

  return (
    <ShotShell act="ACT 03 · 重启">
      <AbsoluteFill>
        <AbsoluteFill style={{ backgroundColor: FILM_COLORS.paperDeep }} />
        <AbsoluteFill style={{ backgroundColor: FILM_COLORS.paper, clipPath: `inset(0 0 0 ${(1 - unfold) * 100}%)` }} />

        {/* baseline：柱左端起，向右延出 */}
        <div
          style={{
            position: 'absolute',
            left: BAR_X - 120,
            top: BASE_Y,
            width: (1860 - (BAR_X - 120)) * lineP,
            height: 1,
            backgroundColor: FILM_COLORS.hairline,
          }}
        />

        {/* 21 个微点收成一根柱 */}
        {Array.from({ length: DOTS }, (_, i) => {
          const f = dotFrom(i);
          const tx = BAR_X + BAR_W / 2;
          const ty = BASE_Y - BAR_H * Math.min(1, grow);
          return (
            <div
              key={`dot-${i}`}
              style={{
                position: 'absolute',
                left: f.x + (tx - f.x) * conv - 3,
                top: f.y + (ty - f.y) * conv - 3,
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: FILM_COLORS.ink,
                opacity: 1 - conv,
              }}
            />
          );
        })}

        {/* 柱体（从 baseline 生长，origin bottom） */}
        <div
          style={{
            position: 'absolute',
            left: BAR_X,
            top: BASE_Y - BAR_H,
            width: BAR_W,
            height: BAR_H,
            backgroundColor: FILM_COLORS.ink,
            transform: `scaleY(${Math.max(0.001, grow)})`,
            transformOrigin: 'bottom center',
          }}
        />

        {/* 柱顶 21（NUM-01 滚动落定） */}
        <div
          style={{
            position: 'absolute',
            left: BAR_X,
            top: BASE_Y - BAR_H - 200,
            width: BAR_W,
            opacity: numP,
            textAlign: 'center',
            fontFamily: FONTS.serif,
            fontWeight: 700,
            fontSize: 120,
            lineHeight: 1,
            letterSpacing: '-0.02em',
            color: FILM_COLORS.ink,
            fontVariantNumeric: 'tabular-nums lining-nums',
          }}
        >
          {fmtInt(v)}
        </div>
        <div style={{ position: 'absolute', left: BAR_X, top: BASE_Y - BAR_H - 74, width: BAR_W, textAlign: 'center', opacity: numP }}>
          <DataLabel size={14}>COMMITS</DataLabel>
        </div>

        {/* 柱顶三颗 accent 火星（FX-09：向上一跳 12f + 2f 放射，落定即灭） */}
        {[0, 1, 2].map((i) => {
          const at = 74 + i * 4;
          const p = progress(frame, at, 12, EASE.out);
          const dir = rnd('s22-spark', i);
          const offX = (dir - 0.5) * 90;
          const size = 4 + (i % 2) * 2;
          return (
            <div
              key={`spark-${i}`}
              style={{
                position: 'absolute',
                left: BAR_X + BAR_W / 2 + offX - size / 2,
                top: BASE_Y - BAR_H - 8 - p * 26,
                width: size,
                height: size,
                borderRadius: '50%',
                backgroundColor: FILM_COLORS.accent,
                opacity: p > 0 && p < 1 ? 1 - p : 0,
              }}
            />
          );
        })}

        {/* 柱下 2025-12 刻度（TX-05） */}
        <div style={{ position: 'absolute', left: BAR_X, top: BASE_Y + 16, width: BAR_W, textAlign: 'center' }}>
          <Meta size={15} color={FILM_COLORS.inkSoft}>
            2025-12
          </Meta>
        </div>

        {/* 字幕 */}
        <div style={{ position: 'absolute', left: 120, top: 906, width: 1660 }}>
          <KineticLine text="2025 年 12 月，21 次提交——火重新点着。" start={44} framesPerChar={2} size={44} />
          <div style={{ marginTop: 14, width: 320, height: 1, backgroundColor: FILM_COLORS.hairline }} />
        </div>
      </AbsoluteFill>
    </ShotShell>
  );
};

export default S22;