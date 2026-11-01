import type { FC } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CLAMP } from '../motion-tokens';

/** 字幕卡：本镜 local 帧；诗行用衬线大字，白话字幕略小；默认两端各 14f 淡入淡出。
 *  文字逐字照抄 preprod script.md；本组件不改写文案。
 *  charStarts 给逐字落点（S25 四字四拍）；fadeOut=false 让末镜收在完整一行。 */
export const Caption: FC<{
  text: string;
  start: number;
  end: number;
  poem?: boolean;
  bottom?: number;
  tone?: 'paper' | 'ink';
  fadeOut?: boolean;
  charStarts?: readonly number[];
}> = ({ text, start, end, poem = false, bottom = 150, tone = 'paper', fadeOut = true, charStarts }) => {
  const frame = useCurrentFrame();
  if (frame < start || frame > end) return null;
  const ink = tone === 'ink';
  const opacity = charStarts
    ? fadeOut
      ? interpolate(frame, [end - 14, end], [1, 0], CLAMP)
      : 1
    : fadeOut
      ? interpolate(frame, [start, start + 14, end - 14, end], [0, 1, 1, 0], CLAMP)
      : interpolate(frame, [start, start + 14], [0, 1], CLAMP);
  return (
    <div
      style={{
        position: 'absolute',
        left: 140,
        right: 140,
        bottom,
        textAlign: 'center',
        fontFamily: fontFamilies.serif,
        fontSize: poem ? 48 : 42,
        lineHeight: 1.5,
        letterSpacing: '0.04em',
        color: ink ? colors.ink : colors.paper,
        opacity,
        textShadow: ink ? 'none' : `0 2px 24px ${colors.bg}`,
      }}
    >
      {charStarts
        ? [...text].map((ch, i) => {
            const at = charStarts[i] ?? start;
            return (
              <span key={i} style={{ opacity: interpolate(frame, [at, at + 6], [0, 1], CLAMP) }}>
                {ch}
              </span>
            );
          })
        : text}
    </div>
  );
};
