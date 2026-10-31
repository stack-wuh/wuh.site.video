/* 镜 17 · Act 4 产品巡礼 · 全局帧 [2920,3030) · 110f */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, GRADES } from '../motion-tokens';
import { DustField } from '../components/DustField';

const serif = fontFamilies.serif;
const mono = fontFamilies.mono;

const fade = (f: number, at: number) =>
  interpolate(f, [at, at + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/* 墨点时间轴 hover：hover-dye 染色左移 + cam-truck 跟光标，出场 tr-item-zoom 条目放大接镜
   （原 Act4 镜 17，幕局部 120–230 → 镜局部 0–110；const f = frame - 120 换算为 const f = frame） */
const POSTS: Array<[string, string, string]> = [
  ['重启计划', '随笔', '1,673 浏览'],
  ['再读〈坐忘歌〉', '诗', '1,204 浏览'],
  ['上班下班', '生活', '986 浏览'],
  ['欲望，是最恐怖的东西', '随想', '852 浏览'],
  ['人生一世', '随想', '733 浏览'],
];

const ShotTimeline: FC = () => {
  const frame = useCurrentFrame();
  const grade = GRADES[3];
  const f = frame; // 0–110
  const hover = Math.min(POSTS.length - 1, Math.max(0, Math.floor((f - 4) / 16)));
  // tr-item-zoom（f 85–110）：被选条目 scale 1→2.4（cine-ease-in），周边 blur 退散
  const zoomP = interpolate(f, [85, 110], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn });
  const truck = interpolate(f, [0, 85], [40, -30], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  return (
    <AbsoluteFill>
      <DustField act={4} />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', transform: `translateX(${truck}px)` }}>
        <div style={{ width: 860 }}>
          {POSTS.map(([title, tag, views], i) => {
            const visited = i <= hover;
            const isHover = i === hover;
            return (
              <div key={title} style={{
                display: 'flex', alignItems: 'center', gap: 20, margin: '18px 0',
                opacity: (isHover ? 1 : visited ? 0.75 : 0.45) * fade(f, 2 + i * 4) * (1 - zoomP * (isHover ? 0 : 0.9)),
                filter: !isHover && zoomP > 0 ? `blur(${zoomP * 3}px)` : undefined,
                transform: `translateX(${isHover ? -6 : 0}px) scale(${isHover ? 1 + zoomP * 1.4 : 1})`,
                transformOrigin: 'left center',
              }}>
                <div style={{ width: 9, height: 9, borderRadius: 5, background: isHover ? colors.accent : colors.muted, flexShrink: 0 }} />
                <span style={{ fontFamily: serif, fontSize: isHover ? 30 : 26, color: isHover ? colors.accent : visited ? colors.paper : colors.muted }}>{title}</span>
                <span style={{ fontFamily: mono, fontSize: 14, color: isHover ? colors.accent : colors.muted, border: `1px solid ${isHover ? colors.accent : colors.hairline}`, borderRadius: 10, padding: '2px 10px' }}>{tag}</span>
                <span style={{ fontFamily: mono, fontSize: 15, color: colors.muted, marginLeft: 'auto' }}>{views}</span>
              </div>
            );
          })}
          <p style={{ fontFamily: serif, fontSize: 32, color: colors.paper, marginTop: 34, opacity: fade(f, 20) * (1 - zoomP) }}>46 篇文章，一枚枚墨点</p>
        </div>
      </AbsoluteFill>
      {/* 幕级调色 overlay（原 Act4 全屏层分解入镜）：grade-warm-gold LUT + 雾光 */}
      <AbsoluteFill style={{ background: grade.lut.color, mixBlendMode: grade.lut.blend, opacity: grade.lut.opacity }} />
      <AbsoluteFill style={{ background: grade.veil.color, mixBlendMode: grade.veil.blend, opacity: grade.veil.opacity }} />
    </AbsoluteFill>
  );
};

export default ShotTimeline;
