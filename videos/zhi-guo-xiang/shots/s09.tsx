/* 镜 9 · 幕二 风陵渡 · local [0,60) · 60f
   火塘将熄：灰里还剩一点火金的余烬（不红）；她的手拢在膝上，指尖有一点光；背景全暗。
   微距俯拍固定（CM-09）；灰落两次，火不灭；FN-06 尾帧余烬未灭。 */
import type { FC } from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { CM, CV, FILM, FN, GRADES, STROKE } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DustField } from '../components/DustField';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const EMBERS = Array.from({ length: 8 }, (_, i) => i);
const FALLS = [10, 32];

const S09: FC = () => {
  const frame = useCurrentFrame();
  const cam = CM.macro(frame, 60, 1.04, 1.1);
  const grade = GRADES['GR-02'];

  return (
    <AbsoluteFill style={{ background: colors.bg, overflow: 'hidden' }}>
      <AbsoluteFill style={{ filter: `saturate(${grade.saturate})` }}>
        <CameraRig cam={cam}>
          <AbsoluteFill style={{ background: `linear-gradient(180deg, ${colors.bg} 0%, ${colors.bgLift} 62%, ${colors.bg} 100%)`, opacity: 0.9 }} />

          <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
            {/* 灰床 */}
            <ellipse cx={960} cy={772} rx={330} ry={126} fill={colors.muted} opacity={0.14} />
            <ellipse cx={960} cy={782} rx={270} ry={96} fill={colors.ink} opacity={0.7} />
            {[0, 1, 2].map((i) => (
              <path key={i} d={`M${700 + i * 60} ${744 + i * 22} Q960 ${706 + i * 26} ${1240 - i * 60} ${744 + i * 22}`} fill="none" stroke={colors.muted} strokeWidth={STROKE.S0} opacity={0.22 - i * 0.05} />
            ))}
            {/* 余烬：火金，不红；最中一点始终不灭 */}
            <circle cx={962} cy={768} r={2.6} fill={FILM.fireGold} opacity={0.55 + 0.35 * FN.flameStep(frame)} />
            {EMBERS.map((i) => {
              const seed = `s09-ember-${i}`;
              const x = 740 + random(seed) * 440;
              const y = 728 + random(`${seed}-y`) * 84;
              return <circle key={seed} cx={x} cy={y} r={1.1 + random(`${seed}-r`)} fill={FILM.fireGold} opacity={0.18 + 0.4 * FN.flameStep(frame + i * 4)} />;
            })}
            {/* 灰落两次 */}
            {FALLS.map((at, i) => {
              const p = CV.out(clamp01((frame - at) / 16));
              const x = 700 + random(`s09-ash-${i}`) * 520;
              return (
                <g key={at} opacity={frame >= at ? 0.55 : 0} transform={`translate(${x} ${150 + 560 * p})`}>
                  <circle cx={0} cy={0} r={1.4} fill={colors.paperMuted} />
                  <circle cx={6} cy={-8} r={1} fill={colors.paperMuted} opacity={0.6} />
                </g>
              );
            })}
            {/* 膝与手：手拢在膝上 */}
            <path d="M220 1080 Q250 872 520 852 Q760 872 782 1080 Z" fill={colors.ink} />
            <path d="M1140 1080 Q1162 882 1400 862 Q1680 882 1706 1080 Z" fill={colors.ink} />
            <path d="M250 902 Q420 856 640 892" fill="none" stroke={colors.accent} strokeWidth={STROKE.S1} opacity={0.2} />
            <path d="M1170 910 Q1340 866 1560 900" fill="none" stroke={colors.accent} strokeWidth={STROKE.S1} opacity={0.2} />
            <path d="M806 944 Q812 890 878 882 Q952 876 966 918 Q972 952 916 962 Q846 972 806 944 Z" fill={colors.paper} stroke={colors.ink} strokeWidth={STROKE.S1} opacity={0.82} />
            <path d="M1114 952 Q1106 898 1040 890 Q966 884 952 926 Q946 960 1002 970 Q1072 980 1114 952 Z" fill={colors.paper} stroke={colors.ink} strokeWidth={STROKE.S1} opacity={0.82} />
            {[0, 1, 2, 3].map((i) => (
              <path key={`lf-${i}`} d={`M${930 + i * 3} ${912 + i * 4} Q${968 + i * 2} ${906 + i * 5} ${986 + i} ${916 + i * 4}`} fill="none" stroke={colors.ink} strokeWidth={STROKE.S1} opacity={0.32} />
            ))}
            {[0, 1, 2, 3].map((i) => (
              <path key={`rf-${i}`} d={`M${990 - i * 3} ${920 + i * 4} Q${952 - i * 2} ${914 + i * 5} ${934 - i} ${924 + i * 4}`} fill="none" stroke={colors.ink} strokeWidth={STROKE.S1} opacity={0.32} />
            ))}
            <path d="M806 944 Q812 890 878 882 Q952 876 966 918" fill="none" stroke={FILM.fireGold} strokeWidth={STROKE.S1} opacity={0.3} />
            <path d="M1114 952 Q1106 898 1040 890 Q966 884 952 926" fill="none" stroke={FILM.fireGold} strokeWidth={STROKE.S1} opacity={0.3} />
            {/* 指尖那点光：下一镜接金针 */}
            <circle cx={966} cy={922} r={2} fill={FILM.fireGold} opacity={0.5 + 0.4 * FN.flameStep(frame + 2)} />
          </svg>

          <DustField act={2} count={8} seedBase="s09" />
        </CameraRig>
      </AbsoluteFill>

      <AbsoluteFill style={{ background: grade.base.color, mixBlendMode: grade.base.blend, opacity: grade.base.opacity }} />
      {grade.veil ? <AbsoluteFill style={{ background: grade.veil.gradient, mixBlendMode: grade.veil.blend, opacity: grade.veil.opacity }} /> : null}
    </AbsoluteFill>
  );
};

export default S09;
