import type { FC } from 'react';
import { AbsoluteFill, interpolateColors, useCurrentFrame } from 'remotion';
import { KineticLine } from '../components/KineticLine';
import { ShotShell } from '../components/ShotShell';
import { DataLabel, Meta } from '../components/Type';
import { EASE, FILM_COLORS, FONTS, progress } from '../motion-tokens';

/**
 * s25 · 2026-06-14 新站上线（90f，2700–2790）
 * 首 3f 纸白满屏（FX-01 上线白闪）→ 06 柱顶亮起日期牌 2026-06-14（TX-05）→ 时间轴 06-14 节点放大成门形框
 * （LAY-08，20f）→ 门内 12 盏小方块灯次第点亮（GR-03，2f 间隔，落定 2760 = 镜内 60f）；
 * 门内纸色最亮（FX-06 bright-local）。数据：materials v4 §二 — 2026-06-14 流量切换、正式上线。
 */

const GATE_X = 1160;
const GATE_Y = 300;
const GATE_W = 640;
const GATE_H = 520;
const NODE = 16;

/* 12 盏灯：4 列 × 3 行 */
const LIGHT = 56;
const LGAP = 26;
const LIGHTS = Array.from({ length: 12 }, (_, i) => ({
  col: i % 4,
  row: Math.floor(i / 4),
}));
const LIGHTS_W = 4 * LIGHT + 3 * LGAP;
const LIGHTS_H = 3 * LIGHT + 2 * LGAP;
const LIGHTS_X = GATE_X + (GATE_W - LIGHTS_W) / 2;
const LIGHTS_Y = GATE_Y + (GATE_H - LIGHTS_H) / 2;

const S25: FC = () => {
  const frame = useCurrentFrame();

  /* FX-01 白闪 0–3f → 3–15f 释放到纸面 */
  const bg = interpolateColors(frame, [0, 3, 15], [FILM_COLORS.white, FILM_COLORS.white, FILM_COLORS.paper], {
    easing: EASE.out,
  });
  /* LAY-08 节点 → 门形框（16–36f） */
  const gate = progress(frame, 16, 20, EASE.inOut);
  /* 日期牌 */
  const plate = progress(frame, 8, 10);
  /* 时间轴 rail */
  const rail = progress(frame, 6, 16, EASE.out);
  /* FX-06 门内提亮（48–60f） */
  const bright = progress(frame, 48, 38) * 0.055;

  /* 门框从 06-14 节点长出：左上角固定在节点处，宽高插值到全尺寸 */
  const boxW = NODE + (GATE_W - NODE) * gate;
  const boxH = NODE + (GATE_H - NODE) * gate;

  return (
    <ShotShell act="ACT 03 · 重启">
      <AbsoluteFill>
        <AbsoluteFill style={{ backgroundColor: bg }} />

        {/* 2026 时间轴 rail（月份刻度） */}
        <div
          style={{
            position: 'absolute',
            left: 360,
            top: GATE_Y + NODE / 2,
            width: (GATE_X - 360) * rail,
            height: 1,
            backgroundColor: FILM_COLORS.hairline,
          }}
        />
        {['01', '02', '03', '04', '05'].map((m, i) => (
          <div key={m} style={{ position: 'absolute', left: 420 + i * 150, top: GATE_Y + NODE / 2, opacity: rail }}>
            <div style={{ width: 1, height: 10, backgroundColor: FILM_COLORS.hairline }} />
            <Meta size={12} style={{ marginTop: 10 }}>{`2026-${m}`}</Meta>
          </div>
        ))}

        {/* 日期牌：2026-06-14（TX-05） */}
        <div
          style={{
            position: 'absolute',
            left: GATE_X,
            top: 196,
            opacity: plate,
            transform: `translateY(${(1 - plate) * 6}px)`,
          }}
        >
          <DataLabel size={14}>LAUNCH</DataLabel>
          <div
            style={{
              fontFamily: FONTS.serif,
              fontWeight: 700,
              fontSize: 56,
              lineHeight: 1.1,
              marginTop: 6,
              letterSpacing: '-0.02em',
              color: FILM_COLORS.ink,
              fontVariantNumeric: 'tabular-nums lining-nums',
            }}
          >
            2026-06-14
          </div>
        </div>
        <div style={{ position: 'absolute', left: GATE_X + 10, top: 286, width: 1, height: 10, backgroundColor: FILM_COLORS.vermillion, opacity: plate }} />

        {/* 门形框（从 06-14 节点长出来） */}
        <div
          style={{
            position: 'absolute',
            left: GATE_X,
            top: GATE_Y,
            width: boxW,
            height: boxH,
            boxSizing: 'border-box',
            border: `1.5px solid ${FILM_COLORS.ink}`,
            backgroundColor: FILM_COLORS.card,
            filter: `brightness(${1 + bright})`,
            overflow: 'hidden',
          }}
        >
          {/* 门内 12 盏小方块灯（GR-03：2f 间隔，由暗到满） */}
          {LIGHTS.map((l, i) => {
            const at = 34 + i * 2;
            const lit = progress(frame, at, 4);
            const flash = frame >= at && frame < at + 2;
            return (
              <div
                key={`light-${i}`}
                style={{
                  position: 'absolute',
                  left: LIGHTS_X - GATE_X + l.col * (LIGHT + LGAP),
                  top: LIGHTS_Y - GATE_Y + l.row * (LIGHT + LGAP),
                  width: LIGHT,
                  height: LIGHT,
                  boxSizing: 'border-box',
                  backgroundColor: FILM_COLORS.accent,
                  border: `1px solid ${flash ? FILM_COLORS.vermillion : FILM_COLORS.hairline}`,
                  opacity: 0.12 + 0.88 * lit,
                }}
              />
            );
          })}
        </div>

        {/* 节点残余（门长成后隐去） */}
        <div
          style={{
            position: 'absolute',
            left: GATE_X,
            top: GATE_Y,
            width: NODE,
            height: NODE,
            borderRadius: '50%',
            backgroundColor: FILM_COLORS.ink,
            opacity: 1 - gate,
          }}
        />

        {/* 字幕 */}
        <div style={{ position: 'absolute', left: 120, top: 906, width: 1660 }}>
          <KineticLine text="2026 年 6 月 14 日，新站上线。" start={20} framesPerChar={2} size={44} />
          <div style={{ marginTop: 14, width: 320, height: 1, backgroundColor: FILM_COLORS.hairline }} />
        </div>
      </AbsoluteFill>
    </ShotShell>
  );
};

export default S25;