import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Heatmap } from '../components/Heatmap';
import { Odometer } from '../components/Odometer';
import { ShotShell } from '../components/ShotShell';
import { DataLabel, Meta } from '../components/Type';
import { HEATMAP, SCALARS, SERIES } from '../data';
import { EASE, FILM_COLORS, FONTS, GRID, SP, clamp01, fmtInt, progress, slam, springP } from '../motion-tokens';

/** 峰值日与次高峰（data.ts SERIES.busy_activity_days：2026-10-29 · 1,068 / 2026-10-28 · 425） */
const PEAK = SERIES.busy_activity_days[0];
const NEXT = SERIES.busy_activity_days[1];
/** 365 天里 156 天有活动 / 209 天空白（= heatmap_levels L0；两者相加 = 365） */
const ACTIVE = SCALARS.activity_active_days;
const BLANK = 365 - ACTIVE;

/** 背景热力图（s37 的 365 格退成底纹）：cell 12 + gap 2，起点周几按 0 定，峰值格坐标与组件同式 */
const HM = { x: 1100, y: 100, cell: 12, gap: 2 } as const;
const COL_W = HM.cell + HM.gap;
const PEAK_IDX = HEATMAP.days.findIndex((d) => d.date === PEAK.date);
const PEAK_CELL = { x: HM.x + Math.floor(PEAK_IDX / 7) * COL_W, y: HM.y + (PEAK_IDX % 7) * COL_W } as const;

/** 抽出的峰值卡与对照柱几何 */
const CARD = { x: 120, y: 290, w: 620, h: 430 } as const;
const BASE_Y = 760;
const REF_H = 340;
const TALL = { x: 830, w: 132, h: REF_H };
const SHORT = { x: 1010, w: 132, h: (NEXT.value / PEAK.value) * REF_H };

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/**
 * s38 · 峰值格 1,068（110f，3970–4080）
 * CH-05 热力峰值格抽出放大为峰值卡 + 背景热力图右退成底纹（0–20f）
 * → NUM-02 1,068 里程表（34–86）+ NUM-03 末 4f SLAM（90 落定）+ TX-05 2026-10-29
 * → CH-01 次高峰对照短柱（10-28 · 425）+ 下方两段 hairline 长条（156 天有活动 / 209 天空白）。
 * 尾帧：1,068 与 10-29 定格、对照柱与两长条在场（交 s39 点阵）。
 */
const S38: FC = () => {
  const frame = useCurrentFrame();
  const retreat = progress(frame, 0, 20, EASE.inOut);
  const morph = progress(frame, 8, 25, EASE.inOut);
  const cardIn = progress(frame, 24, 12, EASE.out);
  const s = slam(frame, 86);
  // 对照柱：CH-01（次高峰短柱 58f 起生长，90 落定）；参考高柱 50f 起
  const refH = TALL.h * clamp01(springP(frame, 30, 50, SP.dotDrop));
  const shortH = SHORT.h * clamp01(springP(frame, 30, 58, SP.dotDrop));
  const colsIn = progress(frame, 70, 10, EASE.out);
  // 下方两段 hairline 长条（90 落定后 92–106 拉出；尾帧仍动）
  const bars = progress(frame, 92, 14, EASE.out);
  const peakRule = progress(frame, 74, 12, EASE.out);

  return (
    <ShotShell act="ACT 04 · 屋里">
      <AbsoluteFill>
        {/* 背景：365 格热力图 → 右退成底纹（点亮态直接在场，交给底纹层） */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: `translateX(${retreat * 96}px)`,
            opacity: lerp(0.5, 0.26, retreat),
            filter: `grayscale(${0.35 * retreat})`,
          }}
        >
          <Heatmap
            days={HEATMAP.days}
            startWeekday={0}
            cell={HM.cell}
            gap={HM.gap}
            x={HM.x}
            y={HM.y}
            start={-200}
            dur={1}
            peak={false}
          />
        </div>

        {/* CH-05：峰值格（12px，朱红描边）抽出放大成峰值卡 */}
        <div
          style={{
            position: 'absolute',
            left: lerp(PEAK_CELL.x, CARD.x, morph),
            top: lerp(PEAK_CELL.y, CARD.y, morph),
            width: lerp(HM.cell, CARD.w, morph),
            height: lerp(HM.cell, CARD.h, morph),
            backgroundColor: FILM_COLORS.card,
            border: `1.5px solid ${FILM_COLORS.vermillion}`,
            boxSizing: 'border-box',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 40,
              top: 28,
              width: CARD.w - 80,
              opacity: cardIn,
            }}
          >
            <Meta size={18}>{PEAK.date}</Meta>
            <div style={{ marginTop: 12, width: 180 * peakRule, height: 1, backgroundColor: FILM_COLORS.vermillion, opacity: 0.8 }} />
          </div>
          <div
            style={{
              position: 'absolute',
              left: 40,
              top: 120,
              opacity: cardIn * progress(frame, 32, 4, EASE.out),
              transform: `translate(${s.dx * 2}px, ${s.dy * 2}px) scale(${s.scale})`,
              transformOrigin: 'left center',
            }}
          >
            <Odometer value={PEAK.value} start={34} dur={52} size={150} label="ACTIVITY · PEAK DAY" />
          </div>
        </div>

        {/* 右侧对照：峰值高柱（hairline 轮廓）+ 次高峰短柱 10-28 · 425 */}
        <div style={{ position: 'absolute', left: 0, top: 0, width: GRID.W, height: GRID.H }}>
          <div style={{ position: 'absolute', left: GRID.margin, top: BASE_Y, width: 1640, height: 1, backgroundColor: FILM_COLORS.hairline }} />
          {/* 参考高柱（只立轮廓，数值由峰值卡承担） */}
          <div
            style={{
              position: 'absolute',
              left: TALL.x,
              top: BASE_Y - refH,
              width: TALL.w,
              height: refH,
              border: `1px solid ${FILM_COLORS.hairline}`,
              boxSizing: 'border-box',
            }}
          />
          {/* 次高峰短柱（实心墨） */}
          <div
            style={{
              position: 'absolute',
              left: SHORT.x,
              top: BASE_Y - shortH,
              width: SHORT.w,
              height: shortH,
              backgroundColor: FILM_COLORS.ink,
            }}
          />
          {/* 柱下日期与数值（TX-05 标识不滚） */}
          <div style={{ position: 'absolute', left: TALL.x - 24, top: BASE_Y + 14, width: TALL.w + 48, textAlign: 'center', opacity: colsIn }}>
            <Meta size={12}>{PEAK.date.slice(5)}</Meta>
            <div style={{ marginTop: 4, fontFamily: FONTS.mono, fontSize: 16, color: FILM_COLORS.ink, fontVariantNumeric: 'tabular-nums' }}>
              {fmtInt(PEAK.value)}
            </div>
          </div>
          <div style={{ position: 'absolute', left: SHORT.x - 24, top: BASE_Y + 14, width: SHORT.w + 48, textAlign: 'center', opacity: colsIn }}>
            <Meta size={12}>{`${NEXT.date.slice(5)} · 次高峰`}</Meta>
            <div style={{ marginTop: 4, fontFamily: FONTS.mono, fontSize: 16, color: FILM_COLORS.ink, fontVariantNumeric: 'tabular-nums' }}>
              {fmtInt(NEXT.value)}
            </div>
          </div>
        </div>

        {/* 下方两段 hairline 长条并置：156 天有活动 / 209 天空白 */}
        {[
          { label: `${ACTIVE} 天有活动`, value: ACTIVE, top: 880, fill: FILM_COLORS.ink, opacity: 0.7 },
          { label: `${BLANK} 天空白`, value: BLANK, top: 926, fill: FILM_COLORS.paperDeep, opacity: 1 },
        ].map((b) => {
          const w = (b.value / 365) * 1240 * bars;
          return (
            <div key={b.label}>
              <div style={{ position: 'absolute', left: GRID.margin, top: b.top - 6 }}>
                <DataLabel size={14}>{b.label}</DataLabel>
              </div>
              <div style={{ position: 'absolute', left: 380, top: b.top, width: w, height: 4, backgroundColor: b.fill, opacity: b.opacity }} />
              <div style={{ position: 'absolute', left: 380 + w + 14, top: b.top - 8, opacity: bars }}>
                <Meta size={12}>{fmtInt(b.value)}</Meta>
              </div>
              <div style={{ position: 'absolute', left: 380, top: b.top + 10, width: 1240, height: 1, backgroundColor: FILM_COLORS.hairline }} />
            </div>
          );
        })}
      </AbsoluteFill>
    </ShotShell>
  );
};

export default S38;