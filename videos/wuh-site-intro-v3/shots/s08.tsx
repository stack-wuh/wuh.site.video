import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { ShotShell } from '../components/ShotShell';
import { DataLabel, Meta } from '../components/Type';
import { ARTICLES } from '../data';
import { CURVES, FILM_COLORS, FONTS, SP, draw, progress, springP } from '../motion-tokens';

/** 承接 s07 的日期（同一数据源） */
const FIRST_SITE = ARTICLES.find((a) => a.number === 17) ?? ARTICLES[ARTICLES.length - 1];

/** 第一代站四块技术基石（英文数据标签，逐字照 storyboard 画面列） */
const STACK = ['NODE', 'EXPRESS', 'MONGODB', 'NGINX'] as const;

const CARD_W = 400;
const CARD_H = 210;
const GAP = 64;
const GRID_X = (1920 - (CARD_W * 2 + GAP)) / 2;
const GRID_Y = 300;
const cardX = (i: number) => GRID_X + (i % 2) * (CARD_W + GAP);
const cardY = (i: number) => GRID_Y + Math.floor(i / 2) * (CARD_H + GAP);

/** 三条层级连线（NODE–EXPRESS / NODE–MONGODB / MONGODB–NGINX） */
const LINES = [
  `M ${GRID_X + CARD_W} ${GRID_Y + CARD_H / 2} L ${GRID_X + CARD_W + GAP} ${GRID_Y + CARD_H / 2}`,
  `M ${GRID_X + CARD_W / 2} ${GRID_Y + CARD_H} L ${GRID_X + CARD_W / 2} ${GRID_Y + CARD_H + GAP}`,
  `M ${GRID_X + CARD_W} ${GRID_Y + CARD_H + GAP + CARD_H / 2} L ${GRID_X + CARD_W + GAP} ${GRID_Y + CARD_H + GAP + CARD_H / 2}`,
] as const;

/** 承接态：s07 尾帧的「0」与空日历（0–12 退场） */
const RESIDUAL = { numX: 300, numY: 234, numW: 620, calX: 1060, calY: 380, cell: 56, gap: 14 } as const;

/**
 * s08 · 第一代站（100f，820–920）
 * 承接 s07「0」+ 空日历退场 → EN-02 四块技术基石卡自底边依次升起（错 8f，无回弹压实）落成 2×2
 * → INK-01 三条层级连线描出 → FX-06 四卡整体提亮一次。
 * 主落定 60（四卡落齐，全片 880 · 拍 44），后 20f 连线成形。
 * 尾帧：2×2 四卡全亮、三线成形、画面顶端留空 → 交 s09 压成横带。
 */
const S08: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const residualOut = progress(frame, 0, 12, CURVES.cineEaseIn);
  const bright = 1 + 0.06 * progress(frame, 58, 34, CURVES.cineEaseOut);

  return (
    <ShotShell act="ACT 01 · 起点">
      <AbsoluteFill>
        {/* 承接态退场：s07 的「0」+ 空日历 */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 1 - residualOut,
            transform: `translateY(${-40 * residualOut}px)`,
            filter: 'brightness(1.06)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 300,
              top: 200,
              width: 620,
              height: 400,
              boxSizing: 'border-box',
              backgroundColor: FILM_COLORS.card,
              border: `1px solid ${FILM_COLORS.hairline}`,
            }}
          />
          <div style={{ position: 'absolute', left: 460, top: 526, width: 300, height: 1, backgroundColor: FILM_COLORS.hairline }} />
          <div style={{ position: 'absolute', left: 300, top: 544, width: 620 }}>
            <Meta size={22} style={{ textAlign: 'center' }}>
              {FIRST_SITE.date}
            </Meta>
          </div>
          <div
            style={{
              position: 'absolute',
              left: RESIDUAL.numX,
              top: RESIDUAL.numY,
              width: RESIDUAL.numW,
              textAlign: 'center',
              fontFamily: FONTS.serif,
              fontWeight: 700,
              fontSize: 280,
              lineHeight: 0.95,
              letterSpacing: '-0.02em',
              color: FILM_COLORS.ink,
              fontVariantNumeric: 'tabular-nums lining-nums',
            }}
          >
            0
          </div>
          {Array.from({ length: 30 }, (_, i) => (
            <div
              key={`cal-${i}`}
              style={{
                position: 'absolute',
                left: RESIDUAL.calX + (i % 5) * (RESIDUAL.cell + RESIDUAL.gap),
                top: RESIDUAL.calY + Math.floor(i / 5) * (RESIDUAL.cell + RESIDUAL.gap),
                width: RESIDUAL.cell,
                height: RESIDUAL.cell,
                boxSizing: 'border-box',
                border: `1px solid ${FILM_COLORS.hairline}`,
              }}
            />
          ))}
        </div>

        {/* EN-02 四卡依次升起（落定 60） */}
        <div style={{ position: 'absolute', inset: 0, filter: `brightness(${bright})` }}>
          {STACK.map((label, i) => {
            const at = 4 + i * 8;
            const s = springP(frame, fps, at, SP.cardLand);
            const op = progress(frame, at, 8, CURVES.cineEaseOut);
            return (
              <div
                key={label}
                style={{
                  position: 'absolute',
                  left: cardX(i),
                  top: cardY(i),
                  width: CARD_W,
                  height: CARD_H,
                  boxSizing: 'border-box',
                  backgroundColor: FILM_COLORS.card,
                  border: `1px solid ${FILM_COLORS.hairline}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: op,
                  transform: `translateY(${(1 - s) * 140}px) scale(${1.03 - 0.03 * s})`,
                  transformOrigin: 'center bottom',
                }}
              >
                <DataLabel size={34} color={FILM_COLORS.inkSoft}>
                  {label}
                </DataLabel>
              </div>
            );
          })}

          {/* INK-01 三条连线（60–80 依次描出） */}
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
            {LINES.map((d, k) => (
              <path
                key={d}
                d={d}
                fill="none"
                stroke={FILM_COLORS.ink}
                strokeWidth={1.5}
                strokeLinecap="round"
                opacity={0.8}
                {...draw(progress(frame, 60 + k * 5, 12, CURVES.cineEaseOut))}
              />
            ))}
          </svg>
        </div>
      </AbsoluteFill>
    </ShotShell>
  );
};

export default S08;