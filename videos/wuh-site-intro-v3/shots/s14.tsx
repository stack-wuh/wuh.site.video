import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { KineticLine } from '../components/KineticLine';
import { ShotShell } from '../components/ShotShell';
import { DataLabel, Meta } from '../components/Type';
import { QUOTES, SERIES } from '../data';
import { EASE, FILM_COLORS, FONTS, T, progress } from '../motion-tokens';

/**
 * s14 · 二幕起 · 2022 引语（110f，1500–1610）
 * 承接 s13 尾帧：右缘 1px 暖边 → FX-05 暖边向左展开成整幅纸面（20f）；右上 2022 刻度亮（TX-05）。
 * 主动作：引语句自左横排动能入画（TX-01，2f/字）；句末落 #37 标签 + 日期 2022-02-08（mono）。
 * 出场：CH-02 六柱 hairline 轮廓（柱高极低，待 s15 生长）。落定 1580 = 镜内 80f。
 * 数据：QUOTES[1]（#37 · 2022-02-08）／SERIES.yearly_writing_2019_2026（2019–2024 年度篇数，仅作轮廓高度）。
 */

const YEARS = SERIES.yearly_writing_2019_2026.slice(0, 6);
const MAX = Math.max(...YEARS.map((y) => y.all));

/** CAM-01：20–110f 内横移 −24px（ease-in-out，≤8% 画幅；无 rotate） */
const camTruck = (frame: number): number => -24 * progress(frame, 20, 90, EASE.inOut);

const S14: FC = () => {
  const frame = useCurrentFrame();
  const quote = QUOTES[1];

  /* FX-05 暖边向左展开：clipPath inset(0 0 0 100%) → inset(0 0 0 0) */
  const unfold = progress(frame, 0, 20, EASE.inOut);
  /* 2022 刻度亮（TX-05） */
  const tickIn = progress(frame, 8, 10);
  /* CH-02 六柱 hairline 轮廓：0 → 0.6（12f） */
  const skel = progress(frame, 66, 12) * 0.6;
  /* CAM-01 沿句行右移（≤8% 画幅；ease-in-out，避免起收突变） */
  const truck = camTruck(frame);

  return (
    <ShotShell act="ACT 02 · 沉默">
      <AbsoluteFill>
        {/* 暖边展开的「底色层」：纸深底上揭开整幅纸面（不叠白矩形，保证不透明底） */}
        <AbsoluteFill style={{ backgroundColor: FILM_COLORS.paperDeep }} />
        <AbsoluteFill
          style={{
            backgroundColor: FILM_COLORS.paper,
            clipPath: `inset(0 0 0 ${(1 - unfold) * 100}%)`,
          }}
        />

        <div style={{ position: 'absolute', inset: 0, transform: `translateX(${truck}px)` }}>
        {/* 右上 2022 刻度 */}
        <div
          style={{
            position: 'absolute',
            right: 120,
            top: 148,
            display: 'flex',
            alignItems: 'flex-end',
            gap: 16,
            opacity: tickIn,
            transform: `translateY(${(1 - tickIn) * 6}px)`,
          }}
        >
          <div style={{ width: 1, height: 46, backgroundColor: FILM_COLORS.vermillion }} />
          <div
            style={{
              fontFamily: FONTS.serif,
              fontWeight: 700,
              fontSize: 54,
              lineHeight: 1,
              letterSpacing: '-0.02em',
              color: FILM_COLORS.ink,
              fontVariantNumeric: 'tabular-nums lining-nums',
            }}
          >
            2022
          </div>
        </div>

        {/* 引语句：横排动能入画（2f/字） */}
        <div style={{ position: 'absolute', left: 128 + truck, top: 372, width: 1664 }}>
          <KineticLine text={quote.text} start={24} framesPerChar={2} size={T.quote} lineHeight={1.32} />
        </div>

        {/* 句末 #37 标签 + 日期（TX-05 标识不滚） */}
        <div
          style={{
            position: 'absolute',
            left: 128,
            top: 512,
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            opacity: progress(frame, 64, 10),
            transform: `translateY(${(1 - progress(frame, 64, 10)) * 6}px)`,
          }}
        >
          <div style={{ width: 56, height: 1, backgroundColor: FILM_COLORS.vermillion }} />
          <Meta size={16} color={FILM_COLORS.inkSoft}>
            {quote.source}
          </Meta>
          <Meta size={16}>{quote.date}</Meta>
        </div>

        {/* 年度柱阵轮廓：六柱 hairline 待长（柱高极低） */}
        <div style={{ position: 'absolute', left: 128, top: 700, width: 1200, height: 210 }}>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 44, height: 1, backgroundColor: FILM_COLORS.hairline }} />
          {YEARS.map((y, i) => {
            const h = 10 + (y.all / MAX) * 52;
            return (
              <div
                key={y.year}
                style={{
                  position: 'absolute',
                  left: i * 186,
                  bottom: 44,
                  width: 118,
                  height: h,
                  boxSizing: 'border-box',
                  border: `1px solid ${FILM_COLORS.hairline}`,
                  opacity: skel,
                }}
              >
                <Meta size={14} style={{ position: 'absolute', left: 0, top: h + 6, whiteSpace: 'nowrap' }}>
                  {y.year}
                </Meta>
              </div>
            );
          })}
          <div style={{ position: 'absolute', left: 0, bottom: 0, opacity: skel }}>
            <DataLabel size={13}>YEARLY WRITING</DataLabel>
          </div>
        </div>
        </div>
      </AbsoluteFill>
    </ShotShell>
  );
};

export default S14;