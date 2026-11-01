import type { FC } from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { CV, FILM, FN } from '../motion-tokens';

/**
 * 4-4（S30）与 5-1（S31）共用的标准上山背影（art-direction v2.1）。
 * 底图 base-g12（峨眉山道）+ 白袍贴片 fig-white40（alpha）+ 代码画山门与门缝光。
 * 同一组件、同一 local 帧：S30 从 3840 起、S31 从 4080 起；判词字幕在 S30 外部叠加。
 * 空手、无伞、无剑、无包袱；40f/步五步，200–239 立定；门缝 1→6px，缝光 ≤6px 不扩散。
 */
export const AscendScene: FC = () => {
  const frame = useCurrentFrame();
  const walked = CV.sineOut(Math.min(1, frame / 200));
  const footY = 929 - 259 * walked;
  const scale = 0.9375 - 0.075 * walked;
  const gap = FN.doorGap(frame, frame);
  const cloudX = FN.cloudSlow(frame, 240) * 1920;
  const hem = FN.clothSway(frame, 2);

  const figH = 470 * scale;
  const figW = figH * 0.55;

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <AbsoluteFill style={{ transform: 'scale(1.02)', transformOrigin: '50% 62%' }}>
        <Img
          src={staticFile('zhi-guo-xiang/base-g12.jpg')}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AbsoluteFill>

      {/* 山门：只留一线门缝光（整幅构图到位前不画门体，避免黑块压在山上） */}
      <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
        <rect x={960 - gap / 2} y={300} width={gap} height={190} fill={colors.paper} opacity={0.35} />
        <rect x={960 - gap / 2} y={490} width={gap} height={300} fill={colors.paper} opacity={0.12} />
        <g transform={`translate(${-cloudX * 0.4}, 0)`}>
          <ellipse cx={960} cy={640} rx={520} ry={26} fill={colors.paper} opacity={0.07} />
          <ellipse cx={960} cy={720} rx={620} ry={20} fill={colors.paper} opacity={0.05} />
        </g>
      </svg>

      {/* 白袍背影：脚底 y 929→670，随步微摆 */}
      <div
        style={{
          position: 'absolute',
          left: 884 - figW / 2,
          top: footY - figH,
          width: figW,
          height: figH,
          transform: `translateX(${hem}px)`,
        }}
      >
        <Img
          src={staticFile('zhi-guo-xiang/fig-white40.png')}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
        {/* 单髻（贴片头部为光头剪影，代码补髻） */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '1.2%',
            width: figW * 0.16,
            height: figW * 0.13,
            marginLeft: -figW * 0.08,
            borderRadius: '50%',
            background: colors.ink,
            opacity: 0.9,
          }}
        />
      </div>

      <AbsoluteFill style={{ background: FILM.nightBlue, opacity: 0.06, mixBlendMode: 'multiply' }} />
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${colors.ink} 0%, transparent 26%)`,
          opacity: interpolate(frame, [200, 239], [0.1, 0.2], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}
      />
    </AbsoluteFill>
  );
};
