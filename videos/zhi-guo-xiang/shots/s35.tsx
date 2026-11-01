import type { FC } from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { CV, FILM, FN, GRADES } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const GRADE = GRADES['GR-04'];
const FLAKES = Array.from({ length: 26 }, (_, i) => {
  const seed = `s35-snow-${i}`;
  return { seed, x0: random(seed) * 1920, y0: random(`${seed}-y`) * 1080, speed: 1.2 + random(`${seed}-v`) * 1.1, size: 1.2 + random(`${seed}-s`) * 1.1 };
});
const PUFF = Array.from({ length: 10 }, (_, i) => {
  const seed = `s35-puff-${i}`;
  return { seed, a: (i / 10) * Math.PI, r: 18 + random(`${seed}-r`) * 30, lift: random(`${seed}-l`) * 22 };
});

/**
 * S35（5-3 后段，4700–4860，160f）——一把剑插在雪里，鞘上三道火燎痕；一只手把它拔出、再收进鞘。
 * FN-14：拔 40f、停 20f、收 30f；剑出雪带一小片雪。只给手与剑（L0），30 岁的手：护腕、指节、袖口一线雪青。
 * 尾帧：剑已入鞘，雪重新落满剑插过的洞。CM-09 微距俯拍 → CM-06 摇到平视（scale 1.55→1.35）。
 */
const S35: FC = () => {
  const frame = useCurrentFrame();
  const { draw, sheathed } = FN.swordCycle(frame);
  const t = draw - sheathed;
  const lift = -170 * t;
  const sight = CV.out(clamp01(frame / 140));
  const cam = { scale: 1.55 - 0.2 * sight, x: 0, y: 50 - 50 * sight, rot: 0 };
  const holeFill = CV.out(clamp01((frame - 118) / 34));
  const puff = frame - 34;
  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <CameraRig cam={cam}>
        <AbsoluteFill style={{ filter: `saturate(${GRADE.saturate})` }}>
          <AbsoluteFill style={{ background: `linear-gradient(180deg, ${FILM.nightBlue} 0%, ${colors.bg} 58%)` }} />
          {/* 远景：S34 的断墙与火，虚焦垫后 */}
          <div style={{ position: 'absolute', inset: 0, filter: 'blur(2.5px)' }}>
            <div style={{ position: 'absolute', left: 1380, top: 470, width: 560, height: 300, background: `linear-gradient(0deg, ${FILM.fireGold} 0%, transparent 74%)`, opacity: 0.16 * FN.flameStep(frame) }} />
            <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
              <path d="M1408 640 L1490 588 L1560 628 L1650 580 L1750 624 L1830 596 L1920 620 L1920 1080 L1408 1080 Z" fill={colors.ink} opacity={0.9} />
            </svg>
          </div>
          <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
            <defs>
              <linearGradient id="s35-snow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.paperDeep} />
                <stop offset="100%" stopColor={colors.paper} />
              </linearGradient>
              <clipPath id="s35-blade-clip">
                <rect x={0} y={0} width={1920} height={520} />
              </clipPath>
            </defs>
            <rect x={0} y={622} width={1920} height={458} fill="url(#s35-snow)" opacity={0.92} />
            <path d="M0 622 L1920 622" stroke={colors.muted} strokeWidth={0.8} opacity={0.35} />
            <ellipse cx={960} cy={838} rx={72} ry={18} fill={colors.ink} opacity={0.4} />
            <path d="M872 838 Q960 806 1048 838 Q960 870 872 838 Z" fill={colors.paper} opacity={0.55} />
            {/* 拔出的刃：只画鞘口以上的一段，其余留在鞘里（clip 在未变换的外层，避免尺寸动画） */}
            <g clipPath="url(#s35-blade-clip)">
              <g transform={`translate(0 ${lift})`}>
                <rect x={948} y={492} width={24} height={300} fill={colors.paper} />
                <rect x={953} y={492} width={14} height={300} fill={colors.ink} opacity={0.8} />
              </g>
            </g>
            {/* 静止的鞘：插在雪里，三道火燎痕朝外可见 */}
            <rect x={938} y={520} width={44} height={330} fill={colors.ink} />
            <path d="M941 532 L941 830" stroke={colors.paper} strokeWidth={1.2} opacity={0.25} />
            {[596, 668, 740].map((y, i) => (
              <g key={y}>
                <path d={`M940 ${y} L980 ${y + 9}`} stroke={colors.paper} strokeWidth={1.6} opacity={0.5 - i * 0.08} />
                <path d={`M940 ${y + 9} L980 ${y}`} stroke={colors.paper} strokeWidth={1.1} opacity={0.3} />
              </g>
            ))}
            {/* 剑与手：整组随拔剑上移 */}
            <g transform={`translate(0 ${lift})`}>
              <rect x={900} y={492} width={120} height={24} fill={colors.ink} />
              <path d="M900 492 L1020 492" stroke={colors.paper} strokeWidth={1.6} opacity={0.4} />
              <rect x={936} y={396} width={48} height={96} fill={colors.ink} />
              {[418, 444, 470].map((y) => (
                <path key={y} d={`M938 ${y} L982 ${y + 7}`} stroke={colors.paperMuted} strokeWidth={1} opacity={0.4} />
              ))}
              <rect x={924} y={380} width={72} height={16} fill={colors.paperMuted} opacity={0.92} />
              {/* 30 岁的手：paper 填充 + ink 1.2 轮廓；护腕 + 袖口一线雪青 */}
              <path d="M1002 452 L1108 494 L1084 548 L982 500 Z" fill={colors.paperMuted} opacity={0.95} />
              <path d="M1002 452 L1084 548" stroke={FILM.snowCyan} strokeWidth={1.4} opacity={0.85} />
              <path d="M946 402 Q1004 392 1010 430 Q1016 462 976 472 L948 470 Z" fill={colors.paper} stroke={colors.ink} strokeWidth={1.2} />
              <path d="M946 420 Q930 428 936 448" fill="none" stroke={colors.ink} strokeWidth={1.2} opacity={0.8} />
              {[0, 1, 2].map((i) => (
                <path key={i} d={`M950 ${418 + i * 14} Q976 ${412 + i * 14} 1002 ${420 + i * 14}`} fill="none" stroke={colors.ink} strokeWidth={1.1} opacity={0.5} />
              ))}
              <rect x={944} y={452} width={64} height={16} fill={colors.ink} opacity={0.85} />
              <path d="M944 452 L1008 452" stroke={colors.paper} strokeWidth={1} opacity={0.35} />
            </g>
            {/* 剑出雪：一小片雪从鞘口带起 */}
            {puff >= 0 && puff <= 50
              ? PUFF.map((p) => (
                  <circle
                    key={p.seed}
                    cx={960 + Math.cos(p.a) * (p.r + puff * 1.5)}
                    cy={520 + Math.sin(p.a) * (p.r * 0.4 + puff * 0.8) - p.lift}
                    r={1.2 + (puff / 50) * 1.6}
                    fill={colors.paper}
                    opacity={0.8 * (1 - puff / 50)}
                  />
                ))
              : null}
            <ellipse cx={960} cy={838} rx={72 * holeFill} ry={18 * holeFill} fill={colors.paper} opacity={0.95} />
          </svg>
          {FLAKES.map((f) => {
            const x = (((f.x0 + frame * f.speed * 0.469) % 1960) + 1960) % 1960 - 20;
            const y = ((f.y0 + frame * f.speed * 0.883) % 1140) - 30;
            return (
              <div key={f.seed} style={{ position: 'absolute', left: x, top: y, width: f.size, height: f.size, borderRadius: f.size / 2, background: colors.paper, opacity: 0.55 }} />
            );
          })}
        </AbsoluteFill>
      </CameraRig>
      <AbsoluteFill style={{ background: GRADE.base.color, mixBlendMode: GRADE.base.blend, opacity: GRADE.base.opacity }} />
      {GRADE.veil ? <AbsoluteFill style={{ background: GRADE.veil.gradient, mixBlendMode: GRADE.veil.blend, opacity: GRADE.veil.opacity }} /> : null}
    </AbsoluteFill>
  );
};

export default S35;
