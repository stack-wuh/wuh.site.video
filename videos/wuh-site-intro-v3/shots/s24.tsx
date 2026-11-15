import type { FC } from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ShotShell } from '../components/ShotShell';
import { DataLabel, Meta } from '../components/Type';
import { SERIES } from '../data';
import { EASE, FILM_COLORS, FONTS, fmtInt, progress, roll } from '../motion-tokens';

/**
 * s24 · 单日 68（80f，2620–2700）
 * 特写 06 月柱区：柱顶左侧弹出「2026-06-07 · 68」单日徽标（EN-03 badgePop，落定 2660 = 镜内 40f）；
 * 68 微滚（NUM-01）；徽标外圈朱红脉冲一次（FX-08）；其余柱退灰（FX-07）；CAM-02 推 2%。无字幕。
 * 数据：SERIES.busy_commit_days[0] — { date: 2026-06-07, value: 68 }（materials §二 单日提交峰值）。
 */

const MONTHS = SERIES.monthly_commits_2024_12_to_2026_11;
const val = (m: string): number => MONTHS.find((x) => x.month === m)?.value ?? 0;

const BUSY = SERIES.busy_commit_days[0];
const BAR_W = 190;
const GAP = 50;
const BASE_Y = 828;
const MAX_H = 430;
const MAX = Math.max(val('2026-01'), val('2026-02'), val('2026-03'), val('2026-04'), val('2026-05'), val('2026-06'));
const LEFT = (1920 - (BAR_W * 6 + GAP * 5)) / 2;
const BAR_GROW = { damping: 14, stiffness: 120, mass: 1.1 };

const BARS = ['01', '02', '03', '04', '05', '06'].map((label, i) => ({
  label,
  x: LEFT + i * (BAR_W + GAP),
  value: val(`2026-${label}`),
}));

/** 06 月柱（本镜主体） */
const SIX = BARS[5];
const SIX_H = (SIX.value / MAX) * MAX_H;

const S24: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* CAM-02 推进 +2%（徽标弹出时） */
  const push = interpolate(frame, [24, 60], [1, 1.02], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE.inOut,
  });
  /* EN-03 徽标弹出：0.6 → 1.06 → 1（badgePop），落定 40 */
  const pop = spring({ frame: frame - 28, fps, config: { damping: 9, stiffness: 260, mass: 0.7 } });
  const badgeP = progress(frame, 28, 8);
  const v = roll(frame, 24, 16, 0, BUSY.value);
  /* FX-08 外圈朱红脉冲一次（40–48） */
  const pulse = progress(frame, 40, 8);
  /* FX-07 余柱退灰 */
  const drain = interpolate(frame, [34, 74], [0, 0.85], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <ShotShell act="ACT 03 · 重启">
      <AbsoluteFill>
        <div style={{ position: 'absolute', left: 128, top: 226 }}>
          <DataLabel size={15}>PEAK DAY · SINGLE COMMITS</DataLabel>
        </div>

        <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${push})`, transformOrigin: '50% 70%' }}>
          <div style={{ position: 'absolute', left: LEFT - 24, top: BASE_Y, width: BAR_W * 6 + GAP * 5 + 48, height: 1, backgroundColor: FILM_COLORS.hairline }} />

          {BARS.map((b) => {
            const isSix = b.label === '06';
            const zero = b.value === 0;
            const s = Math.min(1.04, spring({ frame: frame - 4, fps, config: BAR_GROW }));
            const full = zero ? 1 : (b.value / MAX) * MAX_H;
            const gray = isSix ? 0 : drain;
            return (
              <div key={b.label} style={{ filter: `grayscale(${gray}) brightness(${1 - gray * 0.1})`, opacity: isSix ? 1 : 1 - gray * 0.65 }}>
                <div
                  style={{
                    position: 'absolute',
                    left: b.x,
                    top: BASE_Y - full,
                    width: BAR_W,
                    height: full,
                    boxSizing: 'border-box',
                    backgroundColor: zero ? FILM_COLORS.hairline : FILM_COLORS.ink,
                    transform: `scaleY(${zero ? 1 : s})`,
                    transformOrigin: 'bottom center',
                  }}
                />
                <div style={{ position: 'absolute', left: b.x, top: BASE_Y + 16, width: BAR_W, textAlign: 'center' }}>
                  <Meta size={15}>{b.label}</Meta>
                </div>
              </div>
            );
          })}

          {/* 06 柱顶：徽标 + 脉冲 */}
          <div
            style={{
              position: 'absolute',
              left: SIX.x - 250,
              top: BASE_Y - SIX_H - 116,
              width: 400,
              opacity: badgeP,
              transform: `scale(${0.6 + 0.4 * pop})`,
              transformOrigin: '100% 100%',
            }}
          >
            <div
              style={{
                boxSizing: 'border-box',
                backgroundColor: FILM_COLORS.card,
                border: `1px solid ${FILM_COLORS.vermillion}`,
                padding: '18px 22px',
                display: 'flex',
                alignItems: 'baseline',
                gap: 16,
                boxShadow: `0 0 0 1px ${FILM_COLORS.card}`,
              }}
            >
              <Meta size={15} color={FILM_COLORS.inkSoft}>
                {BUSY.date}
              </Meta>
              <div
                style={{
                  fontFamily: FONTS.serif,
                  fontWeight: 700,
                  fontSize: 54,
                  lineHeight: 1,
                  color: FILM_COLORS.vermillion,
                  fontVariantNumeric: 'tabular-nums lining-nums',
                }}
              >
                {fmtInt(v)}
              </div>
            </div>
            {/* FX-08 外圈朱红脉冲（2f 扩 1px 后收） */}
            <div
              style={{
                position: 'absolute',
                inset: -1 - pulse * 6,
                border: `1px solid ${FILM_COLORS.vermillion}`,
                opacity: pulse > 0 && pulse < 1 ? 1 - pulse * 0.4 : 0,
              }}
            />
          </div>

          {/* 徽标引线：指回 06 柱顶 */}
          <div
            style={{
              position: 'absolute',
              left: SIX.x - 30,
              top: BASE_Y - SIX_H - 6,
              width: 30,
              height: 1,
              backgroundColor: FILM_COLORS.vermillion,
              opacity: badgeP * 0.9,
            }}
          />
        </div>
      </AbsoluteFill>
    </ShotShell>
  );
};

export default S24;