import type { FC } from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { KineticLine } from '../components/KineticLine';
import { ShotShell } from '../components/ShotShell';
import { DataLabel, Meta } from '../components/Type';
import { SERIES } from '../data';
import { EASE, FILM_COLORS, FONTS, fmtInt, progress, roll } from '../motion-tokens';

/**
 * s23 · 2026 春柱阵（100f，2520–2620）
 * CAM-03 后拉成 2026 春柱阵：03 月 71 / 04 月 53 / 05 月 151 / 06 月 192 四柱依次生长（CH-01，
 * 错 6f 且越后越快），柱顶数字滚动落定（NUM-01）；01/02 两根零柱只留 1px hairline 基座（CH-02），
 * 06 月 192 柱顶朱红 2px 描边 2f（CH-04）。落定 2600 = 镜内 80f。
 * 数据：SERIES.monthly_commits_2024_12_to_2026_11（2026-01…06）。
 */

const MONTHS = SERIES.monthly_commits_2024_12_to_2026_11;
const val = (m: string): number => MONTHS.find((x) => x.month === m)?.value ?? 0;

const BARS = [
  { label: '01', value: val('2026-01') },
  { label: '02', value: val('2026-02') },
  { label: '03', value: val('2026-03') },
  { label: '04', value: val('2026-04') },
  { label: '05', value: val('2026-05') },
  { label: '06', value: val('2026-06') },
] as const;

const MAX = Math.max(...BARS.map((b) => b.value));
const BAR_W = 190;
const GAP = 50;
const BASE_Y = 828;
const MAX_H = 430;
const LEFT = (1920 - (BAR_W * BARS.length + GAP * (BARS.length - 1))) / 2;
const BAR_GROW = { damping: 14, stiffness: 120, mass: 1.1 };

/** 越后越快的生长错峰（非零柱）：03 / 04 / 05 / 06 */
const DELAYS: Record<string, number> = { '03': 10, '04': 17, '05': 23, '06': 28 };

const S23: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* CAM-03 后拉 1.055 → 1.00 */
  const pull = interpolate(frame, [16, 56], [1.055, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE.inOut,
  });
  const accentOn = progress(frame, 78, 2) > 0;
  const accentFlash = (frame >= 80 && frame < 82) || (frame >= 90 && frame < 92);
  const zeroBase = progress(frame, 6, 10);

  return (
    <ShotShell act="ACT 03 · 重启">
      <AbsoluteFill>
        <div style={{ position: 'absolute', left: 128, top: 250 }}>
          <DataLabel size={15}>2026 SPRING · COMMITS / MONTH</DataLabel>
        </div>

        <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${pull})`, transformOrigin: '50% 74%' }}>
          {/* 轴 */}
          <div style={{ position: 'absolute', left: LEFT - 24, top: BASE_Y, width: BAR_W * 6 + GAP * 5 + 48, height: 1, backgroundColor: FILM_COLORS.hairline }} />

          {BARS.map((b, i) => {
            const x = LEFT + i * (BAR_W + GAP);
            const zero = b.value === 0;
            if (zero) {
              return (
                <div key={b.label}>
                  {/* 零柱：只留 1px hairline 基座（CH-02） */}
                  <div
                    style={{
                      position: 'absolute',
                      left: x,
                      top: BASE_Y - 1,
                      width: BAR_W,
                      height: 1,
                      backgroundColor: FILM_COLORS.hairline,
                      opacity: zeroBase,
                    }}
                  />
                  <div style={{ position: 'absolute', left: x, top: BASE_Y + 16, width: BAR_W, textAlign: 'center', opacity: zeroBase }}>
                    <Meta size={15}>{b.label}</Meta>
                  </div>
                </div>
              );
            }
            const at = DELAYS[b.label] ?? 10 + i * 6;
            const s = Math.min(1.04, spring({ frame: frame - at, fps, config: BAR_GROW }));
            const full = (b.value / MAX) * MAX_H;
            const isPeak = b.value === MAX;
            const numP = progress(frame, at + 14, 8);
            const v = roll(frame, at + 14, 22, 0, b.value);
            return (
              <div key={b.label}>
                <div
                  style={{
                    position: 'absolute',
                    left: x,
                    top: BASE_Y - full - 52,
                    width: BAR_W,
                    textAlign: 'center',
                    fontFamily: FONTS.mono,
                    fontSize: 30,
                    color: isPeak ? FILM_COLORS.vermillion : FILM_COLORS.ink,
                    fontVariantNumeric: 'tabular-nums',
                    opacity: numP,
                  }}
                >
                  {fmtInt(v)}
                </div>
                <div
                  style={{
                    position: 'absolute',
                    left: x,
                    top: BASE_Y - full,
                    width: BAR_W,
                    height: full,
                    boxSizing: 'border-box',
                    backgroundColor: FILM_COLORS.ink,
                    border: isPeak && accentOn ? `2px solid ${FILM_COLORS.vermillion}` : '2px solid transparent',
                    transform: `scaleY(${s})`,
                    transformOrigin: 'bottom center',
                    opacity: accentFlash ? 0.86 : 1,
                  }}
                />
                <div style={{ position: 'absolute', left: x, top: BASE_Y + 16, width: BAR_W, textAlign: 'center' }}>
                  <Meta size={15}>{b.label}</Meta>
                </div>
              </div>
            );
          })}
        </div>

        {/* 字幕：2026 年春：71、53、151、192。 */}
        <div style={{ position: 'absolute', left: 120, top: 906, width: 1660 }}>
          <KineticLine text="2026 年春：71、53、151、192。" start={30} framesPerChar={2} size={44} />
          <div style={{ marginTop: 14, width: 320, height: 1, backgroundColor: FILM_COLORS.hairline }} />
        </div>
      </AbsoluteFill>
    </ShotShell>
  );
};

export default S23;