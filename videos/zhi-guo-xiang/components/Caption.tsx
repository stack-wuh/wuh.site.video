import type { FC } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CAPTION_CUES } from '../shots/caption-cues';

/** 分幕小字幕（design-v11 §一）：底部居中单行，10f 淡入 + 2px 上浮，12f 淡出。
 *
 *  v11 起**落点由旁白反推**，不再手写：
 *    <Caption cue="s10" />  →  查 `shots/caption-cues.ts`（由 `node scripts/captions.mjs` 生成，
 *    真源是 storyboard.md 字幕列 × out/voice/cues-v7.json 的旁白实测落点）。
 *  老写法 `<Caption text start end>` 保留兼容（其它 video unit 在用）。
 *
 *  tone：默认纸白字（暗底）；亮底场景用 ink。
 *  字幕与画面同层、会被转场墨层一起吞掉——所以生成表已把 start 卡在 inSide+12 之后，
 *  字幕永远不会与墨洇抢同一帧。 */
export const Caption: FC<{
  cue?: string;
  text?: string;
  start?: number;
  end?: number;
  bottom?: number;
  tone?: 'paper' | 'ink';
}> = ({ cue, text, start, end, bottom = 110, tone = 'paper' }) => {
  const frame = useCurrentFrame();
  const row = cue ? CAPTION_CUES[cue] : undefined;
  const body = row?.text ?? text;
  const from = row?.start ?? start ?? 0;
  const to = row?.end ?? end ?? 0;
  if (!body || frame < from || frame > to) return null;
  const ink = tone === 'ink';
  const opacity = interpolate(frame, [from, from + 10, to - 12, to], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const lift = interpolate(frame, [from, from + 10], [2, 0], {
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
        /* 浅底用深字：底图多是淡墨，给一层纸色的柔光晕，压在中间调上也不糊 */
        textShadow: ink ? '0 1px 10px rgba(245, 240, 232, 0.85)' : `0 2px 24px ${colors.bg}`,
        transform: `translateY(${lift}px)`,
      }}
    >
      {body}
    </div>
  );
};