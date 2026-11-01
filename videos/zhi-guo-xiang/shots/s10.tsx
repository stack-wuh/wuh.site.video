/* 镜 10 · 幕二 风陵渡 · local [0,120) · 120f
   她的左掌摊开，三枚金针各有一点微光：针长 46、身 0.8、三枚并排间距 10、针尖一点 gold ≤2px；
   掌纹清楚；背景全暗，只有掌与针被一束低光照亮；没有第二个人，也没有第二道影。
   CM-09 微距正俯固定；前 20f 焦点由掌纹移到针尖（只作用于针，不动人物 path）。 */
import type { FC } from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { colors } from '../../../brand/tokens';
import { CM, CV, FILM, FN, GRADES, SP, STROKE, TR } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DustField } from '../components/DustField';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const NEEDLES = [0, 1, 2];
const FINGERS = [
  { m: 'M838 606 L846 526', d: 'M846 526 L858 462' },
  { m: 'M916 600 L922 518', d: 'M922 518 L934 452' },
  { m: 'M994 600 L990 520', d: 'M990 520 L1004 470' },
  { m: 'M1072 612 L1066 546', d: 'M1066 546 L1084 506' },
];

const S10: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cam = CM.macro(frame, 120, 1, 1.03);
  const focus = CV.out(clamp01(frame / 20));
  const needleBlur = 1.8 * (1 - focus);
  const lit = 0.08 + 0.03 * (FN.flameStep(frame) - 0.7) / 0.3;
  const grade = GRADES['GR-02'];

  return (
    <AbsoluteFill style={{ background: colors.bg, overflow: 'hidden' }}>
      <AbsoluteFill style={{ filter: `saturate(${grade.saturate})` }}>
        <CameraRig cam={cam}>
          <AbsoluteFill style={{ background: `linear-gradient(180deg, ${colors.bg} 0%, ${colors.bgLift} 74%, ${colors.bg} 100%)` }} />

          {/* 左掌：与 S11 首帧同构 */}
          <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
            <path d="M850 906 L866 1080 L1054 1080 L1070 906 Z" fill={colors.paper} stroke={colors.ink} strokeWidth={STROKE.S1} />
            <path d="M760 620 Q742 764 802 850 Q872 912 960 914 Q1058 912 1118 842 Q1158 762 1140 620 Q1050 562 960 562 Q870 562 760 620 Z" fill={colors.paper} stroke={colors.ink} strokeWidth={STROKE.S1} />
            <path d="M826 744 Q900 730 988 764 Q1046 786 1096 764" fill="none" stroke={colors.ink} strokeWidth={STROKE.S1} opacity={0.26} />
            <path d="M812 812 Q900 790 986 822 Q1034 840 1082 822" fill="none" stroke={colors.ink} strokeWidth={STROKE.S1} opacity={0.24} />
            <path d="M880 660 Q902 742 890 828" fill="none" stroke={colors.ink} strokeWidth={STROKE.S0} opacity={0.18} />
            {/* 指形=填充厚度 61.2，ink 外沿 63.6 即两侧各 S1 轮廓；不是新增线宽 */}
            {FINGERS.map((f, i) => (
              <g key={i}>
                <path d={f.d} fill="none" stroke={colors.ink} strokeWidth={63.6} strokeLinecap="round" />
                <path d={f.m} fill="none" stroke={colors.ink} strokeWidth={63.6} strokeLinecap="round" />
                <path d={f.d} fill="none" stroke={colors.paper} strokeWidth={61.2} strokeLinecap="round" />
                <path d={f.m} fill="none" stroke={colors.paper} strokeWidth={61.2} strokeLinecap="round" />
              </g>
            ))}
            <g>
              <path d="M794 806 Q748 782 716 740" fill="none" stroke={colors.ink} strokeWidth={71.6} strokeLinecap="round" />
              <path d="M794 806 Q748 782 716 740" fill="none" stroke={colors.paper} strokeWidth={69.2} strokeLinecap="round" />
            </g>
          </svg>

          {/* 三枚金针：长 46、身 0.8、间距 10、针尖一点 gold ≤2px（PT-12 局部 radial ≤4px） */}
          <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, filter: `blur(${needleBlur}px)` }} preserveAspectRatio="none">
            <defs>
              <radialGradient id="s10-needle">
                <stop offset="0%" stopColor={colors.gold} stopOpacity={0.95} />
                <stop offset="100%" stopColor={colors.gold} stopOpacity={0} />
              </radialGradient>
            </defs>
            {NEEDLES.map((i) => {
              const y = 706 + i * 10;
              const pop = 1 + 0.04 * spring({ frame: Math.max(0, frame - i * 4), fps, config: SP.springPop });
              return (
                <g key={i}>
                  <path d={`M926 ${y + 1.4} L972 ${y + 1.4}`} stroke={colors.bg} strokeWidth={STROKE.S0} opacity={0.25} />
                  <path d={`M926 ${y} L972 ${y}`} stroke={colors.paperMuted} strokeWidth={STROKE.S0} />
                  <circle cx={972} cy={y} r={1.9 * pop} fill="url(#s10-needle)" />
                </g>
              );
            })}
          </svg>

          {/* 一束低光：linear-gradient，不用全屏 radial */}
          <AbsoluteFill style={{ background: `linear-gradient(118deg, ${colors.paper} 0%, transparent 56%)`, mixBlendMode: 'screen', opacity: lit }} />
          <DustField act={2} count={10} seedBase="s10" />
        </CameraRig>
      </AbsoluteFill>

      <AbsoluteFill style={{ background: grade.base.color, mixBlendMode: grade.base.blend, opacity: grade.base.opacity }} />
      {grade.veil ? <AbsoluteFill style={{ background: grade.veil.gradient, mixBlendMode: grade.veil.blend, opacity: grade.veil.opacity }} /> : null}
      {/* S9 余烬 → 掌心：TR-02 8f 溶解，从暗里浮出 */}
      <AbsoluteFill style={{ background: colors.bg, opacity: 1 - CV.inOut(clamp01(frame / TR.dissolve)) }} />
    </AbsoluteFill>
  );
};

export default S10;
