import type { CSSProperties, FC } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { SealStamp } from '../components/SealStamp';
import { ShotShell } from '../components/ShotShell';
import { Meta } from '../components/Type';
import { SERIES } from '../data';
import { CURVES, FILM_COLORS, FONTS, T, progress, springIn } from '../motion-tokens';

/** 八个年份刻度（引自 data.ts：2019 → 2026） */
const YEARS = SERIES.yearly_writing_2019_2026.map((y) => y.year);
const LAST_YEAR = YEARS[YEARS.length - 1];
const RAIL_L = 180;
const RAIL_R = 1800;
const RAIL_Y = 470;
/** 六幕节点（与 s04 同一组年份，交接态逐像素可续） */
const ACT_TICKS = [0, 1, 2, 3, 5, 7] as const;
const tickX = (i: number) => RAIL_L + (i * (1740 - RAIL_L)) / (YEARS.length - 1);

/** 片名两行（serif 700 240px） */
const TITLE = ['七年，', '一座站'] as const;

const titleText: CSSProperties = {
  fontFamily: FONTS.serif,
  fontWeight: 700,
  fontSize: 240,
  lineHeight: 1.06,
  letterSpacing: '-0.02em',
  whiteSpace: 'nowrap',
};

/**
 * s05 · 片名落版（180f，420–600）
 * 承接 s04 时间轴 → LAY-12 整轴下移退出画幅下沿 → TX-07 片名「七年，／一座站」从 hairline 描边填实
 * （描边层 clip 揭示 40f → 填充层 22–40 叠加）→ EN-01 副题入位 → INK-04 朱红小印 24px 落定。
 * 主落定 40（片名填实完成，全片 460 · 拍 23）／副落定 140（小印，全片 560 · 拍 28）。
 * 尾帧：片名两行 + 副题 + 小印静止于画面中央偏左 → 交 s06 白闪。
 */
const S05: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* LAY-12 时间轴整轴下移退出（0–26，cineEaseIn） */
  const exit = progress(frame, 0, 26, CURVES.cineEaseIn);
  /* TX-07 描边层：自左揭示 40f（2–40） */
  const stroke = progress(frame, 2, 38, CURVES.cineEaseInOut);
  /* TX-07 填充层：0 → 1（22–40，落定 40） */
  const fill = progress(frame, 22, 18, CURVES.cineEaseOut);
  /* EN-01 副题入位 */
  const sub = springIn(frame, fps, 46);

  return (
    <ShotShell act="ACT 00 · 冷开场">
      <AbsoluteFill>
        {/* ── 承接态：s04 尾帧的 2019→2026 时间轴（整轴下移出画） ── */}
        <div style={{ position: 'absolute', inset: 0, transform: `translateY(${exit * 1180}px)` }}>
          <div style={{ position: 'absolute', left: RAIL_L, top: RAIL_Y - 0.75, width: RAIL_R - RAIL_L, height: 1.5, backgroundColor: FILM_COLORS.ink }} />
          {YEARS.map((label, i) => (
            <div key={label}>
              <div
                style={{
                  position: 'absolute',
                  left: tickX(i) - 0.5,
                  top: RAIL_Y - 5,
                  width: 1,
                  height: 10,
                  backgroundColor: FILM_COLORS.ink,
                  opacity: 0.5,
                }}
              />
              <div style={{ position: 'absolute', left: tickX(i) - 40, top: RAIL_Y + 18, width: 80 }}>
                <Meta size={16} style={{ textAlign: 'center' }}>
                  {label}
                </Meta>
              </div>
            </div>
          ))}
          {ACT_TICKS.map((t) => (
            <div
              key={`node-${t}`}
              style={{
                position: 'absolute',
                left: tickX(t) - 3,
                top: RAIL_Y - 3,
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: FILM_COLORS.accent,
              }}
            />
          ))}
          <div
            style={{
              position: 'absolute',
              left: RAIL_R - 6,
              top: RAIL_Y - 6,
              width: 12,
              height: 12,
              borderRadius: '50%',
              border: `1px solid ${FILM_COLORS.vermillion}`,
              opacity: 0.55,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 180,
              top: 846,
              fontFamily: FONTS.serif,
              fontSize: 46,
              lineHeight: 1.5,
              color: FILM_COLORS.ink,
            }}
          >
            {`${YEARS[0]} → ${LAST_YEAR}`}
          </div>
          <div style={{ position: 'absolute', left: 180, top: 906, width: 300, height: 1, backgroundColor: FILM_COLORS.hairline }} />
        </div>

        {/* ── 片名：描边层（自左揭示）+ 填充层（叠加，落定 40） ── */}
        <div style={{ position: 'absolute', left: 200, top: 168, width: 1400, height: 520 }}>
          <div
            style={{
              ...titleText,
              position: 'absolute',
              left: 0,
              top: 0,
              color: 'transparent',
              WebkitTextStroke: `1px ${FILM_COLORS.ink}`,
              WebkitTextFillColor: 'transparent',
              clipPath: `inset(0 ${(1 - stroke) * 100}% 0 0)`,
              opacity: 0.9,
            }}
          >
            {TITLE.map((line) => (
              <div key={line}>{line}</div>
            ))}
          </div>
          <div
            style={{
              ...titleText,
              position: 'absolute',
              left: 0,
              top: 0,
              color: FILM_COLORS.ink,
              opacity: fill,
            }}
          >
            {TITLE.map((line) => (
              <div key={line}>{line}</div>
            ))}
          </div>
        </div>

        {/* ── EN-01 副题：mono `wuh.site · 2019 → 2026` ── */}
        <div style={{ position: 'absolute', left: 204, top: 742, ...sub }}>
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: T.body,
              letterSpacing: '0.16em',
              color: FILM_COLORS.muted,
            }}
          >
            {`wuh.site · ${YEARS[0]} → ${LAST_YEAR}`}
          </div>
          <div style={{ marginTop: 18, width: 420, height: 1, backgroundColor: FILM_COLORS.hairline }} />
        </div>

        {/* ── INK-04 朱红小印 24px（片名落版签名点，落定 140） ── */}
        <div style={{ position: 'absolute', right: 120, bottom: 140 }}>
          <SealStamp text="站" size={24} variant="seal" start={136} />
        </div>
      </AbsoluteFill>
    </ShotShell>
  );
};

export default S05;