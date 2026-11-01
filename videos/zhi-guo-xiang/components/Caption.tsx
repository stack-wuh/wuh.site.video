import type { FC } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';

/** 分幕小字幕（storyboard-v8 §三）：底部居中单行，14f 淡入 + 2px 上浮，停留后 14f 淡出。
 *  文案逐字照抄 script-v8.md §分幕小字幕；本组件不改写。
 *  tone：默认纸白字（暗底）；亮底场景用 ink。 */
export const Caption: FC<{ text: string; start: number; end: number; bottom?: number; tone?: 'paper' | 'ink' }> = ({
  text,
  start,
  end,
  bottom = 110,
  tone = 'paper',
}) => {
  const frame = useCurrentFrame();
  if (frame < start || frame > end) return null;
  const ink = tone === 'ink';
  const opacity = interpolate(frame, [start, start + 14, end - 14, end], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const lift = interpolate(frame, [start, start + 14], [2, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        position: 'absolute',
        left: 160,
        right: 160,
        bottom,
        textAlign: 'center',
        fontFamily: fontFamilies.serif,
        fontSize: 30,
        lineHeight: 1.6,
        letterSpacing: '0.08em',
        color: ink ? colors.ink : colors.paper,
        opacity: opacity * 0.9,
        whiteSpace: 'nowrap',
        textShadow: ink ? 'none' : `0 2px 24px ${colors.bg}`,
        transform: `translateY(${lift}px)`,
      }}
    >
      {text}
    </div>
  );
};
