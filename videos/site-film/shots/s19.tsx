/* 镜 19 · Act 4 产品巡礼 · 全局帧 [3120,3260) · 140f */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, GRADES, inkRise, sealTilt } from '../motion-tokens';
import { DustField } from '../components/DustField';

const serif = fontFamilies.serif;
const mono = fontFamilies.mono;

const fade = (f: number, at: number) =>
  interpolate(f, [at, at + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/* 生成式封面：画中画缓推 cam-dolly-in，双曲线 path-draw 生长 + 大标题 ink-rise + bloom-glow，出场 tr-page-curl 封面向左翻卷
   （原 Act4 镜 19，幕局部 320–460 → 镜局部 0–140；const f = frame - 320 换算为 const f = frame） */
const ShotCover: FC = () => {
  const frame = useCurrentFrame();
  const grade = GRADES[3];
  const f = frame; // 0–140
  const dolly = interpolate(f, [0, 140], [1, 1.14], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const draw = (delay: number) =>
    interpolate(f - delay, [0, 70], [1400, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const curl = interpolate(f, [110, 140], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const glow = 0.22 + 0.1 * Math.sin(f / 20);
  return (
    <AbsoluteFill>
      <DustField act={4} />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', transform: `scale(${dolly})` }}>
        <div style={{ position: 'relative', perspective: 1400 }}>
          {/* bloom-glow 底光 */}
          <div style={{ position: 'absolute', inset: -40, borderRadius: 24, background: colors.accent, filter: 'blur(46px)', opacity: glow, mixBlendMode: 'screen' }} />
          <div style={{ position: 'relative', width: 880, height: 420, borderRadius: 14, background: colors.bgLift, border: `1px solid ${colors.hairline}`, transformOrigin: 'left center', transform: `rotateY(${-curl * 90}deg)`, overflow: 'hidden' }}>
            <svg width="880" height="420" viewBox="0 0 880 420">
              <path d="M40,300 C200,230 340,340 480,262 C620,186 740,320 840,250" fill="none" stroke={colors.accent} strokeWidth={2.5} strokeDasharray={1400} strokeDashoffset={draw(4)} opacity={0.85} />
              <path d="M40,352 C220,290 380,392 540,330 C680,278 780,364 840,318" fill="none" stroke={colors.accent} strokeWidth={2} strokeDasharray={1400} strokeDashoffset={draw(40)} opacity={0.5} />
            </svg>
            <p style={{ position: 'absolute', top: 64, width: '100%', textAlign: 'center', fontFamily: serif, fontSize: 44, color: colors.paper, margin: 0, ...inkRise(f, 26) }}>重启计划</p>
            <p style={{ position: 'absolute', right: 28, bottom: 20, fontFamily: mono, fontSize: 16, color: colors.accent, margin: 0, opacity: fade(f, 60), transform: `rotate(${sealTilt('cover-seal')}deg)` }}>wuh.site</p>
            {/* 卷边阴影位移（page-curl 等效） */}
            <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: 260, background: `linear-gradient(90deg, transparent, ${colors.bg})`, opacity: curl, transform: `translateX(${curl * 40}px)` }} />
          </div>
        </div>
        <p style={{ position: 'absolute', bottom: 116, width: '100%', textAlign: 'center', fontFamily: serif, fontSize: 32, color: colors.paper, opacity: fade(f, 30) * (1 - curl) }}>每一篇，都有一幅只属于它的山水</p>
      </AbsoluteFill>
      {/* 幕级调色 overlay（原 Act4 全屏层分解入镜）：grade-warm-gold LUT + 雾光 */}
      <AbsoluteFill style={{ background: grade.lut.color, mixBlendMode: grade.lut.blend, opacity: grade.lut.opacity }} />
      <AbsoluteFill style={{ background: grade.veil.color, mixBlendMode: grade.veil.blend, opacity: grade.veil.opacity }} />
    </AbsoluteFill>
  );
};

export default ShotCover;
