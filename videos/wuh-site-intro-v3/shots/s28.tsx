import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { ShotShell } from '../components/ShotShell';
import { DataLabel } from '../components/Type';
import {
  EASE,
  FILM_COLORS,
  GRID,
  SP,
  progress,
  roll,
  sealTilt,
  springP,
} from '../motion-tokens';

/** 7 枚周一格：150px 方框，7×150 + 6×105 = 1680（内容区） */
const CELL = 150;
const GAP = (GRID.content - 7 * CELL) / 6;
const TOP = 400;
/** GR-03 逐格点亮：step 6f（7 格档），首格 6f 起 */
const litAt = (i: number): number => 6 + i * 6;

const WeekCell: FC<{ i: number }> = ({ i }) => {
  const frame = useCurrentFrame();
  const at = litAt(i);
  const lit = progress(frame, at, 6);
  // 亮 = fill 0→1 + 6px 描边闪 2f（GR-03）
  const flash = interpolate(frame, [at + 2, at + 4, at + 8], [0, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  // INK-04 每格 6px 朱红小印（落章 4f + 确定性微旋）
  const sealAt = at + 4;
  const sealS = springP(frame, 30, sealAt, SP.badgePop);
  const sealO = progress(frame, sealAt, 4);

  return (
    <div
      style={{
        position: 'absolute',
        left: GRID.margin + i * (CELL + GAP),
        top: TOP,
        width: CELL,
        height: CELL,
        border: `1px solid ${FILM_COLORS.hairline}`,
        boxSizing: 'border-box',
        backgroundColor: FILM_COLORS.paper,
      }}
    >
      {/* 亮起：card 底填充 */}
      <div style={{ position: 'absolute', inset: 0, backgroundColor: FILM_COLORS.card, opacity: lit }} />
      {/* 描边闪 2f */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          border: `1.5px solid ${FILM_COLORS.vermillion}`,
          opacity: flash,
          boxSizing: 'border-box',
        }}
      />
      {/* 周次小标（mono，不抢主体） */}
      <div style={{ position: 'absolute', left: 14, top: 12, opacity: 0.55 }}>
        <DataLabel size={13}>W{i + 1 < 10 ? `0${i + 1}` : `${i + 1}`}</DataLabel>
      </div>
      {/* 6px 朱红小印：格内右下 */}
      <div
        style={{
          position: 'absolute',
          right: 16,
          bottom: 16,
          width: 6,
          height: 6,
          backgroundColor: FILM_COLORS.vermillion,
          opacity: sealO,
          transform: `rotate(${sealTilt(`s28-week-${i}`)}deg) scale(${sealS})`,
        }}
      />
    </div>
  );
};

/**
 * s28 · 四周更节拍（90f，2940–3030）
 * LAY-12 引语页上移退出（0–14 行组随页上移入位）→ GR-03 7 格逐格亮 + INK-04 每格 6px 小印
 * → NUM-01 「7/7」微滚（40–60）→ CAM-01 沿格子右移。
 * 尾帧：7 格全亮、WEEKLY · 7/7 在场（交 s29 收卡）。
 */
const S28: FC = () => {
  const frame = useCurrentFrame();
  const enter = progress(frame, 0, 14, EASE.inOut);
  const drift = progress(frame, 0, 90, EASE.inOut);
  const weeks = roll(frame, 40, 20, 0, 7);
  // 格线基座 52→78 拉出；尾帧不静止（静止上限 12f）
  const base = progress(frame, 52, 26, EASE.out);
  // 末格小印 66–70 一次 2f 脉冲（FX-08 单次）
  const pulse = interpolate(frame, [66, 68, 70], [1, 0.55, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <ShotShell act="ACT 03 · 重启">
      <AbsoluteFill>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: `translate(${(1 - enter) * -28 - drift * 26}px, ${(1 - enter) * 46}px) scale(${1 + 0.012 * drift})`,
            transformOrigin: 'center center',
          }}
        >
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <WeekCell key={i} i={i} />
          ))}

          {/* 格子下基座 hairline（1680，逐格拉出） */}
          <div
            style={{
              position: 'absolute',
              left: GRID.margin,
              top: TOP + CELL + 34,
              width: GRID.content * base,
              height: 1,
              backgroundColor: FILM_COLORS.hairline,
            }}
          />

          {/* 末格下 mono WEEKLY · 7/7（NUM-01 20f 微滚，60 落定） */}
          <div
            style={{
              position: 'absolute',
              left: GRID.margin + 6 * (CELL + GAP),
              top: TOP + CELL + 74,
              width: CELL,
              textAlign: 'right',
              opacity: progress(frame, 38, 4),
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 54 * base, height: 1, backgroundColor: FILM_COLORS.vermillion, opacity: 0.7 * pulse }} />
              <DataLabel size={22} style={{ whiteSpace: 'nowrap' }}>
                {`WEEKLY · ${Math.round(weeks)}/7`}
              </DataLabel>
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </ShotShell>
  );
};

export default S28;