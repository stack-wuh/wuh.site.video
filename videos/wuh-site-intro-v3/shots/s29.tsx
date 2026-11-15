import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { SealStamp } from '../components/SealStamp';
import { ShotShell } from '../components/ShotShell';
import { DataLabel, Hairline, Meta, Serif } from '../components/Type';
import { ARTICLES } from '../data';
import { EASE, FILM_COLORS, GRID, SP, progress, sealTilt, springIn, springP } from '../motion-tokens';

/** 《重启计划》真值：#155 · 1447 阅读 · 建站发布日（storyboard s29 明写 2026-06-27 发布日） */
const POST = ARTICLES[2];
const PUBLISHED = '2026-06-27';

/** 7 格（承接 s28 的同位置）→ 标题卡矩形（LAY-06 版面对齐） */
const CELL = 150;
const GAP = (GRID.content - 7 * CELL) / 6;
const CARD = { x: 360, y: 290, w: 1200, h: 500 } as const;

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/**
 * s29 · 7 格收成《重启计划》标题卡（80f，3030–3110）
 * LAY-06 七格边界插值到同一卡矩形（25f）→ EN-01 标题行 → TX-05 发布日 / 编号 → INK-04 CHANGELOG 朱砂小签（50 落定）。
 * 尾帧：标题卡居中定格、小签与 #155 在场（交 s30 翻面）。
 */
const S29: FC = () => {
  const frame = useCurrentFrame();
  const conv = progress(frame, 0, 25, EASE.inOut);
  const cellOut = 1 - progress(frame, 14, 12, EASE.out);
  const cardIn = progress(frame, 12, 14, EASE.out);
  const settle = 0.02 * (1 - springP(frame, 30, 4, SP.cardLand));

  const title = springIn(frame, 30, 34);
  const rule = progress(frame, 30, 14, EASE.out);
  const date = springIn(frame, 30, 38);
  const no = springIn(frame, 30, 42);
  const noRule = progress(frame, 54, 16, EASE.out);
  // INK-04 / FX-08：小签 62–64 一次 2f 脉冲
  const sealPulse = interpolate(frame, [62, 64, 66], [1, 0.5, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <ShotShell act="ACT 03 · 重启">
      <AbsoluteFill>
        {/* LAY-06：七格（承接 s28 尾帧：card 底 + 6px 小印）→ 同一卡矩形，格内内容随之淡出 */}
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: lerp(GRID.margin + i * (CELL + GAP), CARD.x, conv),
              top: lerp(400, CARD.y, conv),
              width: lerp(CELL, CARD.w, conv),
              height: lerp(CELL, CARD.h, conv),
              border: `1px solid ${FILM_COLORS.hairline}`,
              backgroundColor: FILM_COLORS.card,
              boxSizing: 'border-box',
              opacity: cellOut,
            }}
          >
            <div
              style={{
                position: 'absolute',
                right: 16,
                bottom: 16,
                width: 6,
                height: 6,
                backgroundColor: FILM_COLORS.vermillion,
                transform: `rotate(${sealTilt(`s28-week-${i}`)}deg)`,
              }}
            />
          </div>
        ))}

        {/* 卡体（card 底 + hairline 边，cardLand 压实） */}
        <div
          style={{
            position: 'absolute',
            left: CARD.x,
            top: CARD.y,
            width: CARD.w,
            height: CARD.h,
            backgroundColor: FILM_COLORS.card,
            border: `1px solid ${FILM_COLORS.hairline}`,
            boxSizing: 'border-box',
            opacity: cardIn,
            transform: `scale(${1 + settle})`,
            transformOrigin: 'center center',
          }}
        />

        {/* 卡内内容 */}
        <div style={{ position: 'absolute', left: CARD.x + 64, top: CARD.y + 96, ...title }}>
          <Serif size={64} weight={700}>
            {`《${POST.title}》`}
          </Serif>
        </div>
        <div
          style={{
            position: 'absolute',
            left: CARD.x + 64,
            top: CARD.y + 196,
            width: 268 * rule,
            height: 1,
            backgroundColor: FILM_COLORS.hairline,
          }}
        />
        <div style={{ position: 'absolute', left: CARD.x + 64, top: CARD.y + 226, ...date }}>
          <Meta size={18}>{`${PUBLISHED} · PUBLISHED`}</Meta>
        </div>
        <div style={{ position: 'absolute', left: CARD.x + 64, top: CARD.y + 268 }}>
          <DataLabel size={16}>{`#${POST.number} · RESTART PLAN · WEEKLY`}</DataLabel>
        </div>

        {/* CHANGELOG 朱砂小签（INK-04，48px 档外框） */}
        <div style={{ position: 'absolute', left: CARD.x + CARD.w - 236, top: CARD.y + CARD.h - 108, opacity: sealPulse }}>
          <SealStamp text="CHANGELOG" size={44} start={42} />
        </div>

        {/* 卡片右侧 mono #155 */}
        <div style={{ position: 'absolute', left: CARD.x + CARD.w + 44, top: CARD.y + CARD.h / 2 - 34, ...no }}>
          <Meta size={26}>{`#${POST.number}`}</Meta>
          <div
            style={{
              marginTop: 8,
              width: 84 * noRule,
              height: 1,
              backgroundColor: FILM_COLORS.vermillion,
              opacity: 0.8,
            }}
          />
        </div>

        {/* 卡脚：一截 hairline 基座（与 s28 同语法） */}
        <div style={{ position: 'absolute', left: CARD.x, top: CARD.y + CARD.h + 40, width: CARD.w }}>
          <Hairline width={CARD.w * cardIn} />
        </div>
      </AbsoluteFill>
    </ShotShell>
  );
};

export default S29;