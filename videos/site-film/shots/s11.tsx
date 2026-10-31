/* 镜 11 · Act 3 重启与复燃 · 全局帧 [1800,1980) · 180f */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, GRADES } from '../motion-tokens';

const serif = fontFamilies.serif;
const sans = fontFamilies.sans;
const mono = fontFamilies.mono;

const fade = (f: number, at: number) =>
  interpolate(f, [at, at + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/* 生成式封面 · 山峦双曲线描边（原 ShotCover；localStart 0，幕局部 [0,180) = 镜局部 [0,180)，断点无平移） */
const ShotCover: FC = () => {
  const frame = useCurrentFrame();
  const draw = (delay: number) =>
    interpolate(frame - delay, [0, 70], [1400, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const glow = interpolate(frame, [120, 180], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', filter: `blur(${glow * 8}px)`, transform: `scale(${1 + glow * 2.2})` }}>
        <svg width="1000" height="420" viewBox="0 0 1000 420">
          <path d="M0,320 C160,240 300,360 480,270 C660,180 800,340 1000,260" fill="none" stroke={colors.accent} strokeWidth={2.5} strokeDasharray={1400} strokeDashoffset={draw(6)} opacity={0.8} />
          <path d="M0,370 C200,300 360,410 560,340 C740,280 860,380 1000,330" fill="none" stroke={colors.accent} strokeWidth={2} strokeDasharray={1400} strokeDashoffset={draw(50)} opacity={0.5} />
          <text x="500" y="110" textAnchor="middle" fill={colors.paper} fontFamily={serif} fontSize={42} opacity={fade(frame, 40)}>再读《坐忘歌》</text>
          <text x="940" y="396" textAnchor="end" fill={colors.muted} fontFamily={mono} fontSize={17} opacity={fade(frame, 70)}>wuh.site</text>
        </svg>
        <p style={{ fontFamily: sans, fontSize: 22, color: colors.muted, marginTop: 20, opacity: fade(frame, 80) }}>深夜，他重读了自己写过的每一个字。</p>
      </AbsoluteFill>
      {/* 幕级调色 veil（grade-seal-red · screen 0.1，Act3 全幕常量，跨镜拆分归入各镜，层级在内容之上） */}
      <AbsoluteFill style={{ background: GRADES[2].lut.color, mixBlendMode: 'screen', opacity: 0.1 }} />
    </AbsoluteFill>
  );
};

export default ShotCover;
