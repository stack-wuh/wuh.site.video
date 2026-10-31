import type { FC } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';

/**
 * 字幕（唯一黑体）：逐镜自渲染，保证单镜独立出片像素完整。
 * 文案逐字照抄分镜「文案·字幕」列（最外层「」已剥离）；出现时下沉 4px 去模糊。
 */
export const Caption: FC<{ text?: string; appearAt?: number; bottom?: number }> = ({ text, appearAt = 22, bottom = 150 }) => {
  const frame = useCurrentFrame();
  if (!text) return null;
  const p = interpolate(frame, [appearAt, appearAt + 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fontSize = text.length > 40 ? 30 : text.length > 32 ? 34 : 44;
  return (
    <div
      style={{
        position: 'absolute',
        left: 140,
        right: 140,
        bottom,
        textAlign: 'center',
        fontFamily: fontFamilies.sans,
        fontSize,
        lineHeight: 1.5,
        color: colors.paper,
        opacity: p,
        transform: `translateY(${(1 - p) * 4}px)`,
        filter: `blur(${(1 - p) * 2}px)`,
        textShadow: `0 2px 24px ${colors.bg}`,
      }}
    >
      {text}
    </div>
  );
};
