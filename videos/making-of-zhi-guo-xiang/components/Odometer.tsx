import type { FC } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { CLAMP, MO_EASE, MO_NUM } from '../motion-tokens';

/**
 * MO-NUM-ODOMETER：逐位滚轮数字（凡量必滚，ai-director §7.5）。
 * 定长数字串，位变化时该位从上一档滚到当前档（右先左后，每位 8f、错峰 2f，MO-EASE-BACK）。
 * 适用 +1 递进计数（角标翻牌）；确定性：全部由 useCurrentFrame 驱动。
 * count=当前值；changedAt=本次变化发生的帧（调用方按节拍/落地帧给）；变化前一位由组件按 d-1 反推。
 */
export const Odometer: FC<{
  count: number;
  changedAt: number;
  pad?: number;
  size: number;
  color: string;
  fontFamily: string;
  fontWeight?: number | string;
}> = ({ count, changedAt, pad = 2, size, color, fontFamily, fontWeight = 700 }) => {
  const f = useCurrentFrame();
  const digits = String(count).padStart(pad, '0');
  return (
    <span style={{ display: 'inline-flex', overflow: 'hidden', height: size, lineHeight: 1 }}>
      {[...digits].map((ch, i) => {
        const d = Number(ch);
        const fromRight = pad - 1 - i; // 右先左后
        const ws = changedAt + fromRight * MO_NUM.odometerStagger;
        const prev = Math.max(0, d - 1); // +1 递进：上一位 = 当前-1；0 无上一档（不滚）
        const v = interpolate(f, [ws, ws + MO_NUM.odometerFrames], [prev, d], { ...CLAMP, easing: MO_EASE.back });
        return (
          <span key={i} style={{ display: 'inline-block', width: size * 0.62, height: size, position: 'relative' }}>
            <span
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                display: 'block',
                transform: `translateY(${(-v * size).toFixed(2)}px)`,
              }}
            >
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <span
                  key={n}
                  style={{
                    display: 'block',
                    height: size,
                    lineHeight: 1,
                    fontFamily,
                    fontWeight,
                    color,
                    fontVariantNumeric: 'tabular-nums',
                    textAlign: 'center',
                  }}
                >
                  {n}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
};
