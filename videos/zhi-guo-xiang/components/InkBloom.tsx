import type { CSSProperties, FC } from 'react';
import { colors } from '../../../brand/tokens';

/** 墨洇（v10 §五：从 InkPaper 的 blot 层抽出，全片只保留这一套实现）。
 *  参数化：progress 0→1 由一点洇成一片；at 是画面坐标（1920×1080 基准）。
 *  S34 的「一滴墨把字吃掉」与转场墨洇共用它；尺寸 = 基准半径 r × progress。
 *  只用 radial-gradient + blur（InkPaper.tsx 已在生产里跑通，见 playbook §3.5 superseded）。 */
const INK_CORE = 'rgba(24,21,18,';

export const InkBloom: FC<{
  /** 0 无墨，1 最大 */
  progress: number;
  /** 墨点中心（px，1920×1080 基准） */
  at: { x: number; y: number; r?: number };
  /** 基准半径（px）；缺省取 at.r，再缺省 320 */
  r?: number;
  /** 墨心色（外圈固定按墨色逐级透明） */
  color?: string;
  opacity?: number;
  /** 基础模糊（px）；随 progress 再叠 2.5× */
  blur?: number;
  style?: CSSProperties;
}> = ({ progress, at, r, color = colors.ink, opacity = 0.95, blur = 1, style }) => {
  if (progress <= 0) return null;
  const radius = r ?? at.r ?? 320;
  return (
    <div
      style={{
        position: 'absolute',
        left: at.x - radius * progress,
        top: at.y - radius * progress * 0.55,
        width: radius * 2 * progress,
        height: radius * 1.8 * progress,
        borderRadius: '50%',
        background: `radial-gradient(ellipse, ${color} 0%, ${INK_CORE}0.85) 34%, ${INK_CORE}0.22) 62%, transparent 76%)`,
        filter: `blur(${blur + progress * 2.5}px)`,
        mixBlendMode: 'multiply',
        opacity,
        ...style,
      }}
    />
  );
};