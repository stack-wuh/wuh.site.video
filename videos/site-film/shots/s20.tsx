/* 镜 20 · Act 4 产品巡礼 · 全局帧 [3260,3380) · 120f */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, GRADES, glowPulse, paperBreathe, sealTilt } from '../motion-tokens';
import { DustField } from '../components/DustField';

const serif = fontFamilies.serif;
const sans = fontFamilies.sans;

const fade = (f: number, at: number) =>
  interpolate(f, [at, at + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/* 目录纸卷：TOC active 居中点亮（glow-pulse）+ 文首标签 seal-tilt 藏印微旋 + cam-crane 纵移，出场 tr-scroll-bleed 冲出下缘
   （原 Act4 镜 20，幕局部 460–580 → 镜局部 0–120；const f = frame - 460 换算为 const f = frame；
     paperBreathe 原直用幕局部帧 → paperBreathe(frame + 460) 保相位） */
const ShotToc: FC = () => {
  const frame = useCurrentFrame();
  const grade = GRADES[3];
  const f = frame; // 0–120
  const active = Math.min(5, Math.max(0, Math.floor((f - 6) / 16)));
  const crane = interpolate(f, [0, 100], [26, -26], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const bleed = interpolate(f, [105, 120], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn });
  return (
    <AbsoluteFill>
      <DustField act={4} />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', transform: `translateY(${crane + bleed * bleed * 900}px)` }}>
        <div style={{ display: 'flex', gap: 70, alignItems: 'center' }}>
          <div>
            {Array.from({ length: 6 }).map((_, i) => (
              <p key={i} style={{ fontFamily: sans, fontSize: i === active ? 28 : 21, color: i === active ? colors.accent : colors.muted, margin: '16px 0', transform: `translateX(${i === active ? 14 : 0}px)`, opacity: (i === active ? glowPulse(f, 1, 60).opacity ?? 1 : 0.8) * fade(f, 4) }}>
                {String(i + 1).padStart(2, '0')} · 章节标题
              </p>
            ))}
          </div>
          <div style={{ position: 'relative', width: 400, borderRadius: 12, background: colors.paperDeep, padding: '30px 34px', ...paperBreathe(frame + 460) }}>
            {/* 文首标签藏印（seal-tilt ±1.6°） */}
            <div style={{ position: 'absolute', left: -14, top: -14, width: 22, height: 22, background: colors.accent, transform: `rotate(${sealTilt('toc-tag')}deg)`, opacity: fade(f, 8) }} />
            <p style={{ fontFamily: serif, fontSize: 22, color: colors.ink, margin: 0 }}>第 12 / 46 篇 · 约 8 分钟读</p>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{ height: 9, width: `${92 - i * 14}%`, background: colors.ink, opacity: 0.16 + fade(f, 14 + i * 8) * 0.14, borderRadius: 4, marginTop: 14 }} />
            ))}
          </div>
        </div>
        <p style={{ position: 'absolute', bottom: 96, width: '100%', textAlign: 'center', fontFamily: serif, fontSize: 32, color: colors.paper, opacity: fade(f, 26) }}>目录如纸卷，随呼吸展开</p>
      </AbsoluteFill>
      {/* 幕级调色 overlay（原 Act4 全屏层分解入镜）：grade-warm-gold LUT + 雾光 */}
      <AbsoluteFill style={{ background: grade.lut.color, mixBlendMode: grade.lut.blend, opacity: grade.lut.opacity }} />
      <AbsoluteFill style={{ background: grade.veil.color, mixBlendMode: grade.veil.blend, opacity: grade.veil.opacity }} />
    </AbsoluteFill>
  );
};

export default ShotToc;
