import type { FC } from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { KineticLine } from '../components/KineticLine';
import { ShotShell } from '../components/ShotShell';
import { DataLabel, Meta } from '../components/Type';
import { SERIES } from '../data';
import { EASE, FILM_COLORS, FONTS, fmtInt, progress, roll } from '../motion-tokens';

/**
 * s15 · 年度柱阵生长（110f，1610–1720）
 * 承接 s14 低柱轮廓：六柱依次 spring 生长（CH-01，错 4f，2024 最后），柱顶数字滚动（NUM-01）、柱下轴标年份。
 * 峰值强调唯一：2024 的 59 柱最高并加朱红 2px 描边（CH-04，2f 闪）；CAM-03 后拉随柱长高露出全阵。
 * 落定 1680 = 镜内 70f。数据：SERIES.yearly_writing_2019_2026（2019 11 / 2020 14 / 2021 10 / 2022 3 / 2023 30 / 2024 59）。
 */

const BARS = SERIES.yearly_writing_2019_2026.slice(0, 6);
const MAX = Math.max(...BARS.map((b) => b.all));
const BAR_W = 150;
const GAP = 66;
const BASE_Y = 836;
const MAX_H = 452;
/** CH-01 CHART-GROW：motion-spec §2 的 SPRINGS.barGrow（token 文件未导出该枚，镜内本地声明同参数） */
const BAR_GROW = { damping: 14, stiffness: 120, mass: 1.1 };

const S15: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* CAM-03 后拉：1.06 → 1.00（20–52f，露出全阵） */
  const pull = interpolate(frame, [14, 52], [1.06, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE.inOut,
  });

  const peakFlash = frame >= 64 && frame < 66 ? 1 : 0;
  const accentAt = progress(frame, 62, 2) > 0;

  return (
    <ShotShell act="ACT 02 · 沉默">
      <AbsoluteFill>
        <div style={{ position: 'absolute', left: 128, top: 262 }}>
          <DataLabel size={15}>ARTICLES / YEAR</DataLabel>
          <Meta size={13} style={{ marginTop: 10 }}>
            2019 — 2024
          </Meta>
        </div>

        <div
          style={{
            position: 'absolute',
            left: 140,
            top: 190,
            width: 1260,
            height: 700,
            transform: `scale(${pull})`,
            transformOrigin: '50% 78%',
          }}
        >
          {/* 轴（CH-02 轴先稳） */}
          <div style={{ position: 'absolute', left: 0, top: BASE_Y - 190, width: BAR_W * 6 + GAP * 5, height: 1, backgroundColor: FILM_COLORS.hairline }} />

          {BARS.map((b, i) => {
            const at = 12 + i * 4;
            const s = Math.min(1.04, spring({ frame: frame - at, fps, config: BAR_GROW }));
            const full = Math.max(2, (b.all / MAX) * MAX_H);
            const isPeak = i === BARS.length - 1;
            const numP = progress(frame, at + 10, 8);
            const v = roll(frame, at + 10, 18, 0, b.all);
            return (
              <div key={b.year} style={{ position: 'absolute', left: i * (BAR_W + GAP), top: BASE_Y - 190 - MAX_H, width: BAR_W, height: MAX_H }}>
                {/* 柱顶数字（NUM-01 滚动落定） */}
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    bottom: full + 16,
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
                {/* 柱体：从基线生长（origin bottom） */}
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    bottom: 0,
                    width: BAR_W,
                    height: full,
                    boxSizing: 'border-box',
                    backgroundColor: FILM_COLORS.ink,
                    border: isPeak && accentAt ? `2px solid ${FILM_COLORS.vermillion}` : '2px solid transparent',
                    transform: `scaleY(${s})`,
                    transformOrigin: 'bottom center',
                    opacity: peakFlash ? 0.86 : 1,
                  }}
                />
                {/* 柱下轴标年份（TX-05） */}
                <div style={{ position: 'absolute', left: 0, bottom: -34, width: BAR_W, textAlign: 'center' }}>
                  <Meta size={15}>{b.year}</Meta>
                </div>
              </div>
            );
          })}
        </div>

        {/* 字幕：2022 到 2024，写作越来越密：2024 年 59 篇。 */}
        <div style={{ position: 'absolute', left: 120, top: 906, width: 1660 }}>
          <KineticLine text="2022 到 2024，写作越来越密：2024 年 59 篇。" start={30} framesPerChar={2} size={44} />
          <div style={{ marginTop: 14, width: 320, height: 1, backgroundColor: FILM_COLORS.hairline }} />
        </div>
      </AbsoluteFill>
    </ShotShell>
  );
};

export default S15;