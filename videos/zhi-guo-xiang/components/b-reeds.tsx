/* b-reeds —— 秋拍前景芦苇（design-v11 §3.4 第三拍：枯黄芦苇 + 斜暖光）。
 *
 *  底图里画的是中景芦苇；本组件只补**前景**下缘两簇（近大、虚焦、随风压向一侧），
 *  用来给秋拍一个「镜头前面有东西」的层次，也把三拍中唯一暖色的一拍钉死。
 *  长茎按帧摆动，根部不动、梢头动；颜色只取 brand/tokens + FILM。
 */
import type { FC } from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { FILM } from '../motion-tokens';

const TAU = Math.PI * 2;

type Stalk = { x: number; h: number; lean: number; phase: number; sway: number; w: number };

const cluster = (seed: string, count: number, x0: number, x1: number): Stalk[] =>
  Array.from({ length: count }).map((_, i) => {
    const s = `${seed}-${i}`;
    return {
      x: x0 + random(`${s}-x`) * (x1 - x0),
      h: 170 + random(`${s}-h`) * 300,
      lean: (random(`${s}-l`) - 0.5) * 0.24,
      phase: random(`${s}-p`) * TAU,
      sway: 8 + random(`${s}-s`) * 16,
      w: 2.2 + random(`${s}-w`) * 1.8,
    };
  });

export const Reeds: FC<{
  seed?: string;
  /** 整层不透明度（由秋拍权重驱动） */
  opacity?: number;
  /** 从画面下缘往上长的比例（0 无 → 1 全高），用于入场 */
  grow?: number;
}> = ({ seed = 's16-reeds', opacity = 1, grow = 1 }) => {
  const f = useCurrentFrame();
  const left = cluster(`${seed}-L`, 7, 20, 330);
  const right = cluster(`${seed}-R`, 6, 1600, 1905);
  const g = Math.max(0, Math.min(1, grow));
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', opacity }}>
      <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }}>
        {[left, right].map((group, gi) =>
          group.map((st, i) => {
            const baseY = 1120;
            const tipX = st.x + st.lean * st.h + Math.sin((f / 54) * TAU + st.phase) * st.sway * g;
            const tipY = baseY - st.h * (0.35 + 0.65 * g);
            const ctrlX = st.x + st.lean * st.h * 0.3;
            const ctrlY = baseY - st.h * 0.62 * (0.35 + 0.65 * g);
            const head = 10 + st.h * 0.055;
            return (
              <g key={`${gi}-${i}`} opacity={0.42 + (gi === 0 ? 0.12 : 0.06)}>
                <path
                  d={`M${st.x} ${baseY} Q${ctrlX} ${ctrlY} ${tipX} ${tipY}`}
                  fill="none"
                  stroke={colors.ink}
                  strokeWidth={st.w}
                  strokeLinecap="round"
                />
                {/* 芦花：梢头三笔，风大时压向左侧 */}
                <path
                  d={`M${tipX} ${tipY} L${tipX - head * 0.8} ${tipY - head * 0.5} M${tipX} ${tipY} L${tipX - head * 0.2} ${tipY - head} M${tipX} ${tipY} L${tipX + head * 0.5} ${tipY - head * 0.8}`}
                  fill="none"
                  stroke={colors.muted}
                  strokeWidth={st.w * 0.7}
                  strokeLinecap="round"
                />
                {i % 3 === 0 ? (
                  <path
                    d={`M${st.x + 1.5} ${baseY - 12} Q${ctrlX + 1.5} ${ctrlY} ${tipX + 1.2} ${tipY + 6}`}
                    fill="none"
                    stroke={FILM.snowCyan}
                    strokeWidth={0.8}
                    opacity={0.4}
                  />
                ) : null}
              </g>
            );
          }),
        )}
      </svg>
    </AbsoluteFill>
  );
};