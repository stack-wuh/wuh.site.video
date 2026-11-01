import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { CV, FILM, FN, GRADES, PT, RH, STROKE } from '../motion-tokens';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { XiangFigure } from '../components/Figure';
import { Sword } from '../components/Objects';

/**
 * 镜 25 · 驴与剑（local 0–239）· 诗第 3 行。
 * CM-07/CM-08 侧向跟移（背景 CV.plateau，三层视差）；FN-07 驴蹄 12f/蹄（RH-06），
 * 前四蹄落在 20/32/44/56；PT-08 芦苇前后景掠过；GR-03 暮色；FG-11 剑只给形。
 * 无人脸：郭襄约二十岁只给侧后背影（L0），单髻 + 布巾 + 褪色雪青 + 绑腿。
 */
const GROUND = 906;
const HOOF = RH.charCell; // 12f/蹄（FN-07 donkey 档）

/** 青驴走姿（FG-10 的四蹄版）：肩高 260、身长 340、长耳两只、驮架两条横木、四蹄 12f 交替。 */
const WalkingDonkey: FC<{ frame: number; settle: number }> = ({ frame, settle }) => {
  const hips: Array<[number, number, number, number]> = [[110, 232, 0, 0.55], [172, 236, 6, 0.55], [286, 232, 3, 1], [346, 236, 9, 1]];
  return (
    <svg viewBox="0 0 480 360" style={{ width: 480, height: 360, overflow: 'visible' }}>
      <ellipse cx={220} cy={150} rx={158} ry={88} fill={colors.ink} />
      <path d="M330 122 Q366 66 404 48" stroke={colors.ink} strokeWidth={82} strokeLinecap="round" fill="none" />
      <path d="M396 26 Q448 24 460 60 Q462 86 432 84 Q400 80 390 50 Z" fill={colors.ink} />
      <path d="M392 34 Q376 -6 388 -12 Q402 -4 406 30 Z M414 28 Q410 -14 424 -16 Q436 -4 428 30 Z" fill={colors.ink} />
      <path d="M452 58 Q462 66 452 78" fill="none" stroke={colors.paperMuted} strokeWidth={STROKE.S1} />
      <path d="M72 140 Q30 180 26 240" fill="none" stroke={colors.ink} strokeWidth={STROKE.S3} strokeLinecap="round" />
      <rect x={168} y={62} width={112} height={46} rx={6} fill={colors.paperMuted} opacity={0.88} />
      <path d="M150 92 L302 92 M142 122 L310 122" stroke={colors.paperMuted} strokeWidth={STROKE.S1} />
      {hips.map(([x, y, off, o], i) => {
        const swing = Math.sin(((frame - 20 + off) / HOOF) * Math.PI * 2) * 17 * settle;
        return <path key={i} d={`M${x} ${y} Q ${x + swing * 0.4} ${y + 74} ${x + swing} 334`} fill="none" stroke={colors.ink} strokeWidth={17} strokeLinecap="round" opacity={o} />;
      })}
      <path d="M78 152 Q150 96 262 100" fill="none" stroke={FILM.snowCyan} strokeWidth={STROKE.S1} opacity={0.5} />
    </svg>
  );
};

/** PT-08 芦苇：按索引错相的正弦摆动，7–9 根高差，带穗头。 */
const Reeds: FC<{ frame: number; x: number; y: number; tint: string; blur?: number; opacity?: number; scale?: number }> = ({ frame, x, y, tint, blur = 0, opacity = 0.6, scale = 1 }) => (
  <svg viewBox="0 0 140 220" style={{ position: 'absolute', left: x, top: y, width: 140, height: 220, opacity, transform: `scale(${scale})`, transformOrigin: 'bottom left', filter: blur ? `blur(${blur}px)` : undefined }}>
    {Array.from({ length: PT.reed.count }).map((_, i) => {
      const sway = Math.sin((frame / PT.reed.period) * Math.PI * 2 + i) * PT.reed.amp;
      const top = 34 + (i % 3) * 22;
      return (
        <g key={i}>
          <path d={`M${18 + i * 14} 220 Q ${30 + i * 14} ${130 - (i % 3) * 24} ${20 + i * 14 + sway} ${top}`} fill="none" stroke={tint} strokeWidth={STROKE.S1} />
          <ellipse cx={20 + i * 14 + sway} cy={top} rx={3.2} ry={8} fill={tint} opacity={0.9} />
        </g>
      );
    })}
  </svg>
);

/* 逐字落点（storyboard §四）：小毛驴 0/7/14；滴滴答答 20/32/44/56 与四蹄同帧；
   其余 10 字各 10f 自 68 起，158 落定；168–208 收束。 */
const CHAR_STARTS = [0, 7, 14, 20, 32, 44, 56, 68, 78, 88, 98, 108, 118, 128, 138, 148, 158];

const S25: FC = () => {
  const frame = useCurrentFrame();
  const scroll = 1560 * CV.plateau(Math.min(1, frame / 240));
  const settle = Math.max(0, Math.min(1, (239 - frame) / 24));
  const bob = -2 * Math.abs(Math.cos((Math.PI * (frame - 20)) / HOOF)) * settle;
  const tassel = FN.ribbonLag(frame, 6, 3) * settle;
  const grade = GRADES['GR-03'];
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, transform: `translateY(${bob}px)` }}>
        <AbsoluteFill style={{ background: `linear-gradient(180deg, ${colors.bg} 0%, ${colors.bgLift} 40%, ${colors.accent} 100%)` }} />
        <svg viewBox="0 0 2400 1080" style={{ position: 'absolute', left: 0, top: 0, width: 2400, height: 1080, transform: `translateX(${-scroll * 0.25}px)` }}>
          <path d="M0 540 Q 180 448 360 512 Q 520 570 700 470 Q 880 372 1060 508 Q 1240 610 1420 486 Q 1600 380 1800 520 Q 2020 640 2200 498 L 2400 520" fill="none" stroke={colors.muted} strokeWidth={STROKE.S0} opacity={0.5} />
          <path d="M0 590 Q 240 520 460 566 Q 700 616 900 528 Q 1140 430 1340 570 Q 1580 700 1780 560 Q 2000 470 2200 580 L 2400 552" fill="none" stroke={colors.muted} strokeWidth={STROKE.S0} opacity={0.25} />
        </svg>
        <div style={{ position: 'absolute', left: 0, top: 640, width: 1920, height: 266, background: colors.bg, opacity: 0.14 }} />
        <svg viewBox="0 0 3200 1080" style={{ position: 'absolute', left: 0, top: 0, width: 3200, height: 1080, transform: `translateX(${-scroll * 0.55}px)` }}>
          {[664, 700, 740, 784, 832].map((y, i) => (
            <path key={y} d={`M0 ${y} Q 800 ${y - 12} 1600 ${y} T 3200 ${y}`} fill="none" stroke={colors.muted} strokeWidth={STROKE.S0} opacity={0.42 - i * 0.05} />
          ))}
        </svg>
        <div style={{ position: 'absolute', left: 0, top: 480, width: 1920, height: 300, background: `linear-gradient(180deg, transparent, ${colors.paperMuted}, transparent)`, opacity: 0.08 }} />
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const x = (((i * 380 - scroll) % 2280) + 2280) % 2280 - 160;
          return <Reeds key={i} frame={frame} x={x} y={846} tint={i % 2 ? FILM.snowCyan : colors.muted} opacity={0.5} />;
        })}
        <div style={{ position: 'absolute', left: 0, top: GROUND, width: 1920, height: 174, background: colors.ink, opacity: 0.62 }} />
        <div style={{ position: 'absolute', left: 0, top: GROUND, width: 1920, height: 1, background: colors.paperMuted, opacity: 0.25 }} />
        <div style={{ position: 'absolute', left: 1000, top: 572 }}><WalkingDonkey frame={frame} settle={settle} /></div>
        {/* 剑挂在驮架上：横放背侧，穗 paperMuted 垂着晃（不红） */}
        <div style={{ position: 'absolute', left: 1146, top: 500, width: 69, height: 300, transformOrigin: 'center', transform: `rotate(${90 + tassel * 0.4}deg)` }}>
          <Sword state="back" style={{ width: '100%', height: '100%' }} />
        </div>
        <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }}>
          <path d={`M1016 662 Q ${1006 + tassel} 712 1014 768`} fill="none" stroke={colors.paperMuted} strokeWidth={STROKE.S1} />
          <path d="M772 790 Q1140 774 1440 664" fill="none" stroke={colors.paperMuted} strokeWidth={STROKE.S1} opacity={0.7} />
        </svg>
        <div style={{ position: 'absolute', left: 690, top: GROUND - 292, width: 110, height: 292 }}>
          <XiangFigure age="20" pose="walk" style={{ width: '100%', height: '100%', opacity: 0.85 }} />
          <svg viewBox="0 0 120 320" style={{ position: 'absolute', inset: 0 }}>
            <path d="M42 42 Q60 18 78 42" fill="none" stroke={colors.paperMuted} strokeWidth={STROKE.S2} />
            <circle cx={80} cy={46} r={5} fill={colors.paperMuted} />
            <path d="M80 50 Q92 74 84 100" fill="none" stroke={colors.paperMuted} strokeWidth={STROKE.S1} />
            <g transform={`translate(${FN.clothSway(frame, 2)} 0)`}>
              <path d="M32 250 Q60 264 90 250" fill="none" stroke={colors.accent} strokeWidth={STROKE.S2} opacity={0.4} />
            </g>
          </svg>
        </div>
        {[0, 1, 2, 3, 4].map((i) => {
          const x = (((i * 520 - scroll * 2.1) % 2600) + 2600) % 2600 - 220;
          return <Reeds key={i} frame={frame + i * 11} x={x} y={700} tint={colors.ink} blur={4} opacity={0.95} scale={1.5} />;
        })}
      </div>
      <DustField act={4} count={18} seedBase="s25" />
      <AbsoluteFill style={{ background: grade.base.color, mixBlendMode: grade.base.blend, opacity: grade.base.opacity }} />
      {grade.veil ? <AbsoluteFill style={{ background: grade.veil.gradient, mixBlendMode: grade.veil.blend, opacity: grade.veil.opacity }} /> : null}
      <Caption text="小毛驴滴滴答答，倚天剑伴我走天涯。" start={0} end={208} poem charStarts={CHAR_STARTS} />
    </AbsoluteFill>
  );
};

export default S25;
