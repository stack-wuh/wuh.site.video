import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { KineticLine } from '../components/KineticLine';
import { ShotShell } from '../components/ShotShell';
import { Meta } from '../components/Type';
import { ARTICLES } from '../data';
import { CURVES, FILM_COLORS, FONTS, clamp01, progress, roll } from '../motion-tokens';

/** 第一代站那篇：#17「我用了30天完成了我的个人网站--Express」· 2020-04-03 —— 天数与日期都从这里取 */
const FIRST_SITE = ARTICLES.find((a) => a.number === 17) ?? ARTICLES[ARTICLES.length - 1];
const DAYS = Number(/(\d+)/.exec(FIRST_SITE.title)?.[1] ?? '30');

const NUM_SIZE = 280;
const CELL_W = Math.round(NUM_SIZE * 0.62);
const CARD = { x: 300, y: 200, w: 620, h: 400 } as const;
const CAL = { x: 1060, y: 380, cell: 56, gap: 14, cols: 5, rows: 6 } as const;

/**
 * s07 · 30 天（110f，710–820）
 * NUM-02 巨型「30」连续倒滚到 0（70–80f，**不是**每减 1 对一拍——motion-spec §10.2-1 降级口径：
 * 个位约 2.3–2.7f/翻，归零点对拍 800）+ GR-04 30 格日历与计数器同相位逐格熄灭（5×6 hairline 格）。
 * 主落定 90（30→0 归零、30 格全灭，全片 800 · 拍 40）。
 * 尾帧：「0」落定居中、30 格全灭、日期在数下 → 交 s08 四卡升起。
 */
const S07: FC = () => {
  const frame = useCurrentFrame();

  /* NUM-02 连续倒滚 30 → 0（10–90，落定帧 90 = 全片 800）。
   * 曲线取 cineEaseInOut：计数需要「起步慢—中段快—落定慢」，numRollOut 会把 30→2 压进首 20% 帧。 */
  const v = roll(frame, 10, 80, DAYS, 0, CURVES.cineEaseInOut);
  const shown = Math.max(0, Math.ceil(v));
  const tens = Math.floor(shown / 10);
  const ones = shown % 10;
  const tensOn = shown >= 10 ? 1 : 0;
  /* 个位只剩一位时整块左移半格，让末端「0」居中对齐两数位时的心位 */
  const shift = -CELL_W * 0.5 * clamp01((10 - v) / 2.5);

  /* GR-04 逐格熄灭：k = 已数掉的天数，第 i 格在 k 越过 i 时熄灭 —— 与 NUM-02 同一时钟（§10.2-1） */
  const k = DAYS - v;
  /* FX-06 卡片局部提亮 +6%（12f） */
  const bright = 1 + 0.06 * progress(frame, 4, 12, CURVES.cineEaseOut);

  return (
    <ShotShell act="ACT 01 · 起点">
      <AbsoluteFill>
        {/* 数字落 card 底上（卡片提亮） */}
        <div
          style={{
            position: 'absolute',
            left: CARD.x,
            top: CARD.y,
            width: CARD.w,
            height: CARD.h,
            boxSizing: 'border-box',
            backgroundColor: FILM_COLORS.card,
            border: `1px solid ${FILM_COLORS.hairline}`,
            filter: `brightness(${bright})`,
          }}
        />

        {/* 巨型倒滚数字（两数位定宽，个位归零时整块回归中位） */}
        <div
          style={{
            position: 'absolute',
            left: CARD.x,
            top: CARD.y + 34,
            width: CARD.w,
            display: 'flex',
            justifyContent: 'center',
            transform: `translateX(${shift}px)`,
            fontFamily: FONTS.serif,
            fontWeight: 700,
            fontSize: NUM_SIZE,
            lineHeight: 0.95,
            letterSpacing: '-0.02em',
            color: FILM_COLORS.ink,
            fontVariantNumeric: 'tabular-nums lining-nums',
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ display: 'inline-block', width: CELL_W, textAlign: 'center', opacity: tensOn }}>{tens}</span>
          <span style={{ display: 'inline-block', width: CELL_W, textAlign: 'center' }}>{ones}</span>
        </div>

        <div
          style={{
            position: 'absolute',
            left: CARD.x + 160,
            top: CARD.y + 326,
            width: 300,
            height: 1,
            backgroundColor: FILM_COLORS.hairline,
          }}
        />
        <div style={{ position: 'absolute', left: CARD.x, top: CARD.y + 344, width: CARD.w }}>
          <Meta size={22} style={{ textAlign: 'center' }}>
            {FIRST_SITE.date}
          </Meta>
        </div>

        {/* GR-04 30 格日历（5×6 hairline 小格）：与计数器同相位逐格熄灭 */}
        {Array.from({ length: CAL.cols * CAL.rows }, (_, i) => {
          const p = clamp01(k - i);
          return (
            <div
              key={`cell-${i}`}
              style={{
                position: 'absolute',
                left: CAL.x + (i % CAL.cols) * (CAL.cell + CAL.gap),
                top: CAL.y + Math.floor(i / CAL.cols) * (CAL.cell + CAL.gap),
                width: CAL.cell,
                height: CAL.cell,
                boxSizing: 'border-box',
                border: `1px solid ${FILM_COLORS.hairline}`,
                transform: `scale(${1 - 0.08 * p})`,
                transformOrigin: 'center center',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: FILM_COLORS.inkSoft,
                  opacity: 0.55 * (1 - p),
                }}
              />
            </div>
          );
        })}

        {/* 动能字幕 */}
        <div style={{ position: 'absolute', left: 200, top: 862, width: 1500 }}>
          <KineticLine
            text="2020 年 4 月，他用 30 天搭起第一代站。"
            start={30}
            framesPerChar={2}
            size={46}
          />
        </div>
      </AbsoluteFill>
    </ShotShell>
  );
};

export default S07;