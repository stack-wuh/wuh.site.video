import type { FC } from 'react';
import { AbsoluteFill, interpolate, interpolateColors, useCurrentFrame, useVideoConfig } from 'remotion';
import { BigNumber } from '../components/BigNumber';
import { KineticLine } from '../components/KineticLine';
import { ShotShell } from '../components/ShotShell';
import { Meta } from '../components/Type';
import { SCALARS, SERIES } from '../data';
import { CURVES, FILM_COLORS, SP, clamp01, progress, springP } from '../motion-tokens';

/** 八个年份刻度（引自 data.ts：2019 → 2026） */
const YEARS = SERIES.yearly_writing_2019_2026.map((y) => y.year);
const LAST_YEAR = YEARS[YEARS.length - 1];

/* 版式常量（1920×1080）：砖心 y = 367 → 时间轴 y = 470 */
const RAIL_L = 180;
const RAIL_R = 1800;
const RAIL_Y = 470;
const FLAT_Y = 367;
const BRICK_L = 680;
const BRICK_W = 560;
const N = 6;
const SEG_FULL = (RAIL_R - RAIL_L) / N;
const SEG_TIGHT = (BRICK_W - (N - 1) * 8) / N;
const SEG_TILE = BRICK_W / N;
/** 六幕节点落在这六个年份（各对应一次真实叙事起跳：建站 / 第一代站 / 工具换代 / 沉默段 / 新站 / 上线） */
const ACT_TICKS = [0, 1, 2, 3, 5, 7] as const;

const tickX = (i: number) => RAIL_L + (i * (1740 - RAIL_L)) / (YEARS.length - 1);

/**
 * s04 · 时间轴（120f，300–420）
 * 承接 s03 数据砖 → LAY-02 横向压成 1px 朱红 line（6f）→ LAY-03 断成六段（间距 8f）
 * → 六段拉开成 2019→2026 时间轴（八枚年份刻度 + 六枚泥金幕节点，rail 自左画出至右端）。
 * 主落定 100（rail 到右端、六节点全亮，全片 400 · 拍 20）。
 * 尾帧：rail 完整、六节点亮至 2026、右端一枚空心节点未亮 → 交 s05 下移退场。
 */
const S04: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* LAY-02 砖 → 1px 朱红线（0–6） */
  const flat = progress(frame, 0, 6, CURVES.cineEaseInOut);
  /* LAY-03 断成六段（6–14，共 8f） */
  const split = progress(frame, 6, 8, CURVES.cineEaseInOut);
  /* 六段拉开到位（14–26） */
  const spread = progress(frame, 14, 12, CURVES.cineEaseInOut);
  /* CAM-01 沿 rail 横移（20–60，30px ≤ 8% 画幅；收尾回到 0 以便尾帧与 s05 首帧逐像素续接） */
  const truck = interpolate(frame, [20, 60], [30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: CURVES.cineEaseInOut,
  });
  const segColor = interpolateColors(spread, [0, 1], [FILM_COLORS.vermillion, FILM_COLORS.ink]);
  const highlight = interpolateColors(flat, [0, 1], [FILM_COLORS.hairline, FILM_COLORS.vermillion]);

  return (
    <ShotShell act="ACT 00 · 冷开场">
      <AbsoluteFill>
        <div style={{ position: 'absolute', inset: 0, transform: `translateX(${truck}px)` }}>
          {/* 承接：s03 尾帧的数据砖（同一砖形 + 1,243 / COMMITS；0–6 压扁） */}
          <div
            style={{
              position: 'absolute',
              left: BRICK_L,
              top: 214,
              width: BRICK_W,
              height: 306,
              boxSizing: 'border-box',
              backgroundColor: FILM_COLORS.card,
              border: `1px solid ${highlight}`,
              opacity: 1 - split,
              transform: `scaleY(${1 - 0.997 * flat})`,
              transformOrigin: 'center center',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 1 - clamp01(flat * 3),
              }}
            >
              <BigNumber value={SCALARS.commits_total} label="COMMITS" size={128} ruleWidth={200} align="center" />
            </div>
          </div>

          {/* 压出来的 1px 朱红线（被六段接手后淡出） */}
          <div
            style={{
              position: 'absolute',
              left: BRICK_L,
              top: FLAT_Y - 0.75,
              width: BRICK_W,
              height: 1.5,
              backgroundColor: FILM_COLORS.vermillion,
              opacity: flat * (1 - split),
            }}
          />

          {/* LAY-03 断六段 → 拉开 → INK-01 rail 自左画出至右端 */}
          {Array.from({ length: N }, (_, i) => {
            const tightLeft = BRICK_L + i * SEG_TILE;
            const clusterLeft = BRICK_L + i * (SEG_TIGHT + 8);
            const tight = tightLeft + (clusterLeft - tightLeft) * split;
            const target = RAIL_L + i * SEG_FULL;
            const left = tight + (target - tight) * spread;
            const y = FLAT_Y + (RAIL_Y - FLAT_Y) * spread;
            const grow = progress(frame, 26 + i * 6.6, 12, CURVES.cineEaseInOut);
            const w = SEG_TIGHT + (SEG_FULL - SEG_TIGHT) * grow;
            return (
              <div
                key={`seg-${i}`}
                style={{
                  position: 'absolute',
                  left,
                  top: y - 0.75,
                  width: w,
                  height: 1.5,
                  backgroundColor: segColor,
                  opacity: split,
                }}
              />
            );
          })}

          {/* 八枚年份刻度（刻度 8 枚 stagger 2f，落在 rail 下方） */}
          {YEARS.map((label, i) => {
            const p = progress(frame, 66 + i * 2, 8, CURVES.cineEaseOut);
            return (
              <div key={label}>
                <div
                  style={{
                    position: 'absolute',
                    left: tickX(i) - 0.5,
                    top: RAIL_Y - 5,
                    width: 1,
                    height: 10,
                    backgroundColor: FILM_COLORS.ink,
                    opacity: p * 0.5,
                  }}
                />
                <div style={{ position: 'absolute', left: tickX(i) - 40, top: RAIL_Y + 18, width: 80, opacity: p }}>
                  <Meta size={16} style={{ textAlign: 'center' }}>
                    {label}
                  </Meta>
                </div>
              </div>
            );
          })}

          {/* 六幕节点：EN-04 墨点落定（错 4f）+ INK-06 纸晕 */}
          {ACT_TICKS.map((t, i) => {
            const dropAt = 68 + i * 4;
            const s = clamp01(springP(frame, fps, dropAt, SP.dotDrop));
            const ring = progress(frame, dropAt + 2, 10, CURVES.cineEaseOut);
            const x = tickX(t);
            return (
              <div key={`node-${t}`}>
                <div
                  style={{
                    position: 'absolute',
                    left: x - 12,
                    top: RAIL_Y - 12 + (1 - s) * -28,
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    border: `1px solid ${FILM_COLORS.accent}`,
                    opacity: (1 - ring) * 0.35,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: x - 3,
                    top: RAIL_Y - 3 + (1 - s) * -28,
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: FILM_COLORS.accent,
                    opacity: clamp01(s * 3),
                  }}
                />
              </div>
            );
          })}

          {/* 右端空心节点：留一枚「待亮」，rail 到 2027 之前的空位 */}
          <div
            style={{
              position: 'absolute',
              left: RAIL_R - 6,
              top: RAIL_Y - 6,
              width: 12,
              height: 12,
              borderRadius: '50%',
              border: `1px solid ${FILM_COLORS.vermillion}`,
              opacity: progress(frame, 76, 10, CURVES.cineEaseOut) * 0.55,
            }}
          />

          {/* 动能字幕：2019 → 2026 */}
          <div style={{ position: 'absolute', left: 180, top: 846, width: 1000 }}>
            <KineticLine
              text={`${YEARS[0]} → ${LAST_YEAR}`}
              start={66}
              framesPerChar={2}
              size={46}
              color={FILM_COLORS.ink}
            />
          </div>
          <div style={{ position: 'absolute', left: 180, top: 906, width: 300, height: 1, backgroundColor: FILM_COLORS.hairline }} />
        </div>
      </AbsoluteFill>
    </ShotShell>
  );
};

export default S04;