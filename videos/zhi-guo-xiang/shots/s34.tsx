import type { FC } from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { CM, CV, FILM, FN, GRADES } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const GRADE = GRADES['GR-04'];
const FLAKES = Array.from({ length: 50 }, (_, i) => {
  const seed = `s34-snow-${i}`;
  return {
    seed,
    x0: random(seed) * 1920,
    y0: random(`${seed}-y`) * 1080,
    speed: 1.2 + random(`${seed}-v`) * 1.2,
    size: 1.2 + random(`${seed}-s`) * 1.2,
    alpha: 0.45 + random(`${seed}-a`) * 0.45,
  };
});

/**
 * S34（5-3 前段，4560–4700，140f）——全片唯一一次倒叙插入：大雪落在断墙上，远处有火光。
 * 无血、无人、无屠杀；雪与火同框，谁也不让谁。PT-05 40–60 颗纸白点、28° 斜落；尾帧雪盖过断墙一半。
 * 火只用 linear-gradient / 斜切火舌，不用径向；风把火吹斜 13°。
 */
const S34: FC = () => {
  const frame = useCurrentFrame();
  const flicker = FN.flameStep(frame);
  const cap = CV.out(clamp01(frame / 132));
  const enterWhite = 1 - CV.out(clamp01(frame / 12));
  const cam = CM.drift(frame, 2);
  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <CameraRig cam={cam}>
        <AbsoluteFill style={{ filter: `saturate(${GRADE.saturate})` }}>
          <AbsoluteFill style={{ background: `linear-gradient(180deg, ${colors.bg} 0%, ${FILM.nightBlue} 46%, ${colors.muted} 96%)` }} />
          <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
            <defs>
              <linearGradient id="s34-glow" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor={FILM.fireGold} stopOpacity={0.42} />
                <stop offset="60%" stopColor={FILM.fireGold} stopOpacity={0.12} />
                <stop offset="100%" stopColor={FILM.fireGold} stopOpacity={0} />
              </linearGradient>
            </defs>
            {/* 远处的火：光从墙后升起，火舌被风斜吹 */}
            <path d="M1060 1080 L1500 1080 L1700 500 L1240 500 Z" fill="url(#s34-glow)" opacity={0.55 + 0.35 * flicker} />
            <g transform="translate(0 108) skewX(-13)" opacity={0.5 + 0.25 * flicker}>
              <path d="M1306 640 L1336 522 L1358 604 L1382 496 L1400 606 L1424 540 L1444 650 Z" fill={FILM.fireGold} opacity={0.55} />
              <path d="M1264 660 L1284 588 L1300 646 L1316 574 L1330 666 Z" fill={FILM.fireGold} opacity={0.35} />
            </g>
            <path d="M0 720 L120 676 L210 724 L330 648 L470 712 L590 664 L700 726 L820 690 L940 736 L1010 780 L1010 1080 L0 1080 Z" fill={colors.ink} />
            <path d="M1200 760 L1290 700 L1400 742 L1500 690 L1600 730 L1700 680 L1810 722 L1920 700 L1920 1080 L1200 1080 Z" fill={colors.ink} />
            {/* 火光在墙头勾一条暖边 */}
            <path d="M1200 760 L1290 700 L1400 742 L1500 690 L1600 730 L1700 680 L1810 722 L1920 700" fill="none" stroke={FILM.fireGold} strokeWidth={1.4} opacity={0.18 * flicker} />
            {[800, 868, 936, 1004].map((y, i) => (
              <path key={y} d={`M0 ${y} L1010 ${y}`} stroke={colors.muted} strokeWidth={0.8} opacity={0.14 - i * 0.02} />
            ))}
            {[1200, 1330, 1460, 1590, 1720, 1850].map((x, i) => (
              <path key={x} d={`M${x} ${760 + (i % 2) * 22} L${x} 1080`} stroke={colors.muted} strokeWidth={0.8} opacity={0.1} />
            ))}
          </svg>
          {/* 雪盖：沿墙头的圆角积雪带，从 12% 长到盖过断墙一半 */}
          <div style={{ position: 'absolute', inset: 0, transform: `scaleY(${0.12 + 0.88 * cap})`, transformOrigin: 'center 648px' }}>
            <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
              <path
                d="M0 722 L120 678 L210 726 L330 650 L470 714 L590 666 L700 728 L820 692 L940 738 L1010 782 L1010 900 L940 850 L820 800 L700 836 L590 774 L470 822 L330 758 L210 834 L120 786 L0 830 Z"
                fill={colors.paperMuted}
                stroke={colors.paperMuted}
                strokeWidth={16}
                strokeLinejoin="round"
                opacity={0.88}
              />
              <path
                d="M1200 762 L1290 702 L1400 744 L1500 692 L1600 732 L1700 682 L1810 724 L1920 702 L1920 830 L1810 846 L1700 800 L1600 850 L1500 810 L1400 862 L1290 820 L1200 880 Z"
                fill={colors.paperMuted}
                stroke={colors.paperMuted}
                strokeWidth={16}
                strokeLinejoin="round"
                opacity={0.88}
              />
            </svg>
          </div>
          <AbsoluteFill style={{ background: `linear-gradient(0deg, ${colors.paper} 0%, transparent 18%)`, opacity: 0.1 }} />
          {FLAKES.map((f) => {
            const x = (((f.x0 + frame * f.speed * 0.469) % 1960) + 1960) % 1960 - 20;
            const y = ((f.y0 + frame * f.speed * 0.883) % 1140) - 30;
            return (
              <div
                key={f.seed}
                style={{
                  position: 'absolute',
                  left: x,
                  top: y,
                  width: f.size,
                  height: f.size,
                  borderRadius: f.size / 2,
                  background: colors.paper,
                  opacity: f.alpha,
                }}
              />
            );
          })}
        </AbsoluteFill>
      </CameraRig>
      <AbsoluteFill style={{ background: GRADE.base.color, mixBlendMode: GRADE.base.blend, opacity: GRADE.base.opacity }} />
      {GRADE.veil ? <AbsoluteFill style={{ background: GRADE.veil.gradient, mixBlendMode: GRADE.veil.blend, opacity: GRADE.veil.opacity }} /> : null}
      {/* TR-07：入镜雪从 S33 暖白的同一明度起步，10f 内收出雪夜 */}
      <AbsoluteFill style={{ background: colors.paper, opacity: 0.88 * enterWhite }} />
    </AbsoluteFill>
  );
};

export default S34;
