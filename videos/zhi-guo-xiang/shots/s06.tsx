/* 镜 6 · 幕二 风陵渡 · local [0,180) · 180f
   水墨底图 + 人物贴片 + 代码动效（art-direction v2.1 §六样片）。
   底图 base-s06（g04 渡口黄昏）· 贴片 fig-xiang16（郭襄牵驴，multiply 融底）·
   代码层：雾横移、水面碎光、末 20f 船影靠近、光尘。字幕 0–180。 */
import type { FC } from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { CM, CV, FILM, FN, GRADES, PT, STROKE } from '../motion-tokens';

const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const BASE = staticFile('zhi-guo-xiang/base-s06.jpg');
const FIG = staticFile('zhi-guo-xiang/fig-xiang16.png');
const WATER = Array.from({ length: 9 }, (_, i) => i);

const S06: FC = () => {
  const frame = useCurrentFrame();
  const cam = CM.drift(frame, 1.8);
  const bob = FN.bodyIdle(frame, 1.1);
  const sway = FN.clothSway(frame, 1.4);
  const boatIn = CV.out(Math.min(1, Math.max(0, (frame - 158) / 18)));
  const grade = GRADES['GR-03'];

  return (
    <AbsoluteFill style={{ background: colors.bg, overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: `scale(${cam.scale}) translate(${cam.x * 1.4}px, ${cam.y}px)` }}>
        {/* 底图：渡口黄昏 */}
        <Img src={BASE} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />

        {/* 人物贴片：multiply 融进底图；微起伏与衣摆摆 */}
        <div
          style={{
            position: 'absolute',
            right: 40,
            top: 0,
            height: '100%',
            transform: `translateY(${bob}px) translateX(${sway * 0.6}px)`,
          }}
        >
          <Img
            src={FIG}
            style={{
              height: '100%',
              width: 'auto',
              mixBlendMode: 'multiply',
            }}
          />
        </div>

        {/* 雾：两条横带极缓横移 */}
        <AbsoluteFill style={{ pointerEvents: 'none' }}>
          {[0, 1].map((i) => {
            const drift = ((frame / (i ? 300 : 240)) * 260 + i * 420) % 1920;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: drift - 480,
                  top: i ? 372 : 300,
                  width: 1400,
                  height: i ? 150 : 200,
                  background: `linear-gradient(180deg, transparent, ${colors.paperMuted}), linear-gradient(0deg, transparent, ${colors.paperMuted})`,
                  opacity: i ? 0.1 : 0.16,
                  filter: 'blur(18px)',
                }}
              />
            );
          })}
        </AbsoluteFill>

        {/* 水面碎光 */}
        <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
          {WATER.map((i) => {
            const shimmer = 0.5 + 0.5 * Math.sin(((frame + i * PT.water.stagger) / 15) * Math.PI * 2);
            const y = 700 + i * 38;
            return (
              <rect
                key={i}
                x={240 + (i % 4) * 120}
                y={y}
                width={1200 - i * 90}
                height={PT.water.line}
                fill={i % 2 ? colors.paper : FILM.fireGold}
                opacity={0.05 + 0.12 * shimmer * (1 - i / 12)}
              />
            );
          })}
        </svg>

        {/* 末 20f：对岸船影靠近 */}
        <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
          <g transform={`translate(${-90 * boatIn} ${40 * boatIn}) scale(${1 + 0.5 * boatIn})`} opacity={0.25 + 0.4 * boatIn}>
            <path d={`M1330 690 Q1400 706 1470 690 L1452 716 Q1400 726 1348 716 Z`} fill={colors.ink} opacity={0.85} />
            <path d="M1392 668 L1392 690" stroke={colors.ink} strokeWidth={STROKE.S1} />
            <path d={`M1330 692 Q1400 ${684 - 2 * boatIn} 1470 692`} fill="none" stroke={colors.paper} strokeWidth={STROKE.S0} opacity={0.5} />
          </g>
        </svg>

        <DustField act={2} count={20} seedBase="s06" />
      </AbsoluteFill>

      <AbsoluteFill style={{ background: grade.base.color, mixBlendMode: grade.base.blend, opacity: grade.base.opacity * 0.7 }} />
      {grade.veil ? <AbsoluteFill style={{ background: grade.veil.gradient, mixBlendMode: grade.veil.blend, opacity: grade.veil.opacity }} /> : null}

      <Caption text="那一年她十六岁，在风陵渡听人说神雕侠。" start={0} end={180} />
    </AbsoluteFill>
  );
};

export default S06;
