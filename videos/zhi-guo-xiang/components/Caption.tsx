import type { FC } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CAPTION_CUES } from '../shots/caption-cues';

/** 分幕小字幕（v12：跟每一句旁白走）：底部居中，10f 淡入 + 2px 上浮，12f 淡出。
 *
 *  落点由旁白反推，不再手写：
 *    <Caption cue="s21" />  →  查 `shots/caption-cues.ts`（由 `node scripts/captions.mjs` 生成；
 *    真源是 script-v10.md 的台词 × out/voice-v8/cues-v8.json 的实测落点，
 *    opening / ending 两段整段真声的行级时间在 out/voice-v8/cues-v8-lines.json 里）。
 *
 *  v12 起一镜可能有多句旁白，表里存的是**数组**：这里按 `useCurrentFrame()`（Sequence 里是镜内帧）
 *  挑当前活跃的那一条；一条都没赶上就返回 null。老写法 `<Caption text start end />` 仍兼容。
 *
 *  tone：默认纸白字（暗底）；亮底场景用 ink。
 *  字幕与画面同层、会被转场墨层一起吞掉——所以生成表已把 start 卡在 inSide+10 之后，
 *  字幕永远不会与墨洇抢同一帧。
 *  文案超过 18 汉字折两行（maxWidth 1560，居中），短句保持单行不换行。
 */
type CaptionCue = { text: string; start: number; end: number };

const hanzi = (s: string) => (s.match(/[\u4e00-\u9fff]/g) ?? []).length;

export const Caption: FC<{
  cue?: string;
  text?: string;
  start?: number;
  end?: number;
  bottom?: number;
  tone?: 'paper' | 'ink';
}> = ({ cue, text, start, end, bottom = 110, tone = 'paper' }) => {
  const frame = useCurrentFrame();
  const rows: CaptionCue[] | undefined = cue ? CAPTION_CUES[cue] : undefined;
  const active = rows?.find((r) => frame >= r.start && frame <= r.end);
  const body = active?.text ?? text;
  const from = active?.start ?? start ?? 0;
  const to = active?.end ?? end ?? 0;
  if (!body || frame < from || frame > to) return null;
  const ink = tone === 'ink';
  const twoLines = hanzi(body) > 18;
  /* 淡入/淡出窗自适应（2026-11-07）：
   * 原先是写死 10f 进 / 12f 出 —— 一旦某条字幕短于 22f（比如 s35 那条只剩 18f），
   * `to - 12` 就会小于 `from + 10`，inputRange 不再单调递增，Remotion 直接抛错、整镜报废。
   * 现在按实际时长收缩（各占 30%，上限仍是 10/12，下限 3f），任何长度的字幕都不会再炸。 */
  const span = to - from;
  if (span < 4) return null; // 太短，宁可不显示，也不做一闪而过的字
  let fadeIn = Math.max(2, Math.min(10, Math.round(span * 0.3)));
  let fadeOut = Math.max(2, Math.min(12, Math.round(span * 0.3)));
  /* 兜底：两段淡变加起来必须留出至少 1 帧的满亮度，否则区间仍会撞 */
  const budget = Math.max(2, span - 1);
  if (fadeIn + fadeOut > budget) {
    fadeIn = Math.max(1, Math.floor(budget / 2));
    fadeOut = Math.max(1, budget - fadeIn);
  }
  const opacity = interpolate(frame, [from, from + fadeIn, to - fadeOut, to], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const lift = interpolate(frame, [from, from + fadeIn], [2, 0], {
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
        /* 长句折两行：给一个 1560 的上限再居中，避免贴到画面两侧 */
        whiteSpace: twoLines ? 'normal' : 'nowrap',
        maxWidth: twoLines ? 1560 : undefined,
        margin: twoLines ? '0 auto' : undefined,
        /* 浅底用深字：底图多是淡墨，给一层纸色的柔光晕，压在中间调上也不糊 */
        textShadow: ink ? '0 1px 10px rgba(245, 240, 232, 0.85)' : `0 2px 24px ${colors.bg}`,
        transform: `translateY(${lift}px)`,
      }}
    >
      {body}
    </div>
  );
};