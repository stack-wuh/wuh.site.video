/* 镜 32 · 幕五 越点 · local [0,180) · 180f
   承接同一帧：门不再暗下去，继续开；光从门里扩出来，落在石阶上，一级一级亮；她走进光里。
   字幕 0–180（诗第 5 行，「其」字与断点 4320 同帧）。 */
import type { FC } from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { Caption } from '../components/Caption';
import { CV, FN } from '../motion-tokens';

const S32: FC = () => {
  const f = useCurrentFrame();
  const open = interpolate(f, [0, 90], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const walk = CV.sineOut(Math.min(1, f / 150));
  const footY = 670 - 90 * walk;
  const figH = 360 - 40 * walk;
  const figW = figH * 0.55;
  const cloudX = FN.cloudSlow(f, 180) * 1920;

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <AbsoluteFill style={{ transform: `scale(${1.02 + 0.04 * open})`, transformOrigin: '50% 34%' }}>
        <Img
          src={staticFile('zhi-guo-xiang/base-g12.jpg')}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AbsoluteFill>

      {/* 门与光：门扇向外开，暖白从门内铺到石阶 */}
      <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
        <path d="M812 300 L1108 300 L1128 226 L792 226 Z" fill={colors.ink} opacity={0.86} />
        <rect x={812} y={300} width={130} height={190} fill={colors.ink} opacity={0.9} />
        <rect x={978} y={300} width={130} height={190} fill={colors.ink} opacity={0.9} />
        <rect x={942 - open * 12} y={300} width={4 + open * 70} height={190} fill={colors.paper} opacity={0.55 + 0.45 * open} />
        <rect x={960 - 40 * open} y={490} width={80 * open} height={330} fill={colors.paper} opacity={0.22 * open} />
        <g transform={`translate(${-cloudX * 0.4}, 0)`}>
          <ellipse cx={960} cy={640} rx={520} ry={26} fill={colors.paper} opacity={0.06} />
        </g>
      </svg>

      {/* 她走进光里 */}
      <div
        style={{
          position: 'absolute',
          left: 884 - figW / 2,
          top: footY - figH,
          width: figW,
          height: figH,
          opacity: 1 - open * 0.55,
        }}
      >
        <Img src={staticFile('zhi-guo-xiang/fig-white40.png')} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
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

      <AbsoluteFill style={{ background: colors.paper, opacity: 0.1 + 0.35 * open, mixBlendMode: 'soft-light' }} />
      <Caption text="其实我只是爱上了峨嵋山上的云和霞，" start={0} end={180} poem tone="ink" />
    </AbsoluteFill>
  );
};

export default S32;
