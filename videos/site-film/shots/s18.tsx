/* 镜 18 · Act 4 产品巡礼 · 全局帧 [3030,3120) · 90f */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, GRADES, SPRINGS } from '../motion-tokens';
import { DustField } from '../components/DustField';

const serif = fontFamilies.serif;
const mono = fontFamilies.mono;

const fade = (f: number, at: number) =>
  interpolate(f, [at, at + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/* 微信读书书架：骨架 shimmer-sweep 横扫（36f）→ 书封 flip-reveal 落架（cascade step 3f），出场 tr-flip-swap 翻转换景
   （原 Act4 镜 18，幕局部 230–320 → 镜局部 0–90；const f = frame - 230 换算为 const f = frame） */
const ShotShelf: FC = () => {
  const frame = useCurrentFrame();
  const grade = GRADES[3];
  const f = frame; // 0–90
  const shimmerX = interpolate(f, [0, 36], [-400, 1000], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const truck = interpolate(f, [0, 90], [-36, 36], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const swapP = interpolate(f, [70, 90], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  return (
    <AbsoluteFill>
      <DustField act={4} />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', transform: `translateX(${truck}px)` }}>
        <div style={{ position: 'relative', width: 900 }}>
          {/* 骨架屏 + shimmer 扫光 */}
          <div style={{ position: 'absolute', left: 0, top: 10, width: '100%', height: 54, display: 'flex', gap: 12, opacity: Math.max(0, 1 - f / 30) }}>
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} style={{ width: 36, height: 54, borderRadius: 4, background: colors.paperMuted, opacity: 0.18 }} />
            ))}
          </div>
          <div style={{ position: 'absolute', left: shimmerX - 120, top: 0, width: 240, height: 74, background: `linear-gradient(90deg, transparent, ${colors.paper}, transparent)`, opacity: 0.16, mixBlendMode: 'screen' }} />
          {/* 书封落架（flip-reveal，step 3f）+ 阅读状态 */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', perspective: 1200, position: 'relative' }}>
            {Array.from({ length: 20 }).map((_, i) => {
              const flip = spring({ frame: f - (26 + i * 3), fps: 30, config: SPRINGS.heavyGlide });
              const status = i % 4 === 1 ? '阅读中' : i % 4 === 3 ? '已读完' : null;
              const swapping = i === 12 ? swapP : 0;
              return (
                <div key={i} style={{ position: 'relative' }}>
                  <div style={{ width: 36, height: 54, borderRadius: 4, background: i % 3 === 0 ? colors.accent : i % 3 === 1 ? colors.paperDeep : colors.paperMuted, opacity: flip * 0.9, transform: `rotateY(${(1 - flip) * 90 + swapping * 90}deg) translateY(${(1 - flip) * -14}px)`, transformOrigin: 'left center', boxShadow: `0 6px 14px ${colors.bg}` }} />
                  {status ? (
                    <span style={{ position: 'absolute', left: '50%', bottom: -22, transform: 'translateX(-50%)', fontFamily: mono, fontSize: 11, whiteSpace: 'nowrap', color: status === '阅读中' ? colors.accent : colors.muted, opacity: flip }}>{status}</span>
                  ) : null}
                </div>
              );
            })}
          </div>
          <div style={{ height: 2, background: colors.hairline, marginTop: 2 }} />
          <p style={{ fontFamily: serif, fontSize: 32, color: colors.paper, marginTop: 48, opacity: fade(f, 40) * (1 - swapP) }}>读过的书，都站在这里</p>
        </div>
      </AbsoluteFill>
      {/* 幕级调色 overlay（原 Act4 全屏层分解入镜）：grade-warm-gold LUT + 雾光 */}
      <AbsoluteFill style={{ background: grade.lut.color, mixBlendMode: grade.lut.blend, opacity: grade.lut.opacity }} />
      <AbsoluteFill style={{ background: grade.veil.color, mixBlendMode: grade.veil.blend, opacity: grade.veil.opacity }} />
    </AbsoluteFill>
  );
};

export default ShotShelf;
