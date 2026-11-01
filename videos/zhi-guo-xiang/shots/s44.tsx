import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { CV, FILM, GRADES } from '../motion-tokens';
import { XiangFigure } from '../components/Figure';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const GRADE = GRADES['GR-06'];

/**
 * S44（5-6 后段，5880–6000，120f）——她退开一步，站在墙前看那把剑（落发、缁衣、内领一线雪青，L0），
 * 像看一件旧物；她只看，不碰；窗外天色压下来，室内暗一度。固定中景：背影在右、剑在左；
 * 末 30f 光从窗移到墙面。尾帧：室内暗到只剩窗光，交给 S45 的 TR-02 8f 溶解。
 */
const S44: FC = () => {
  const frame = useCurrentFrame();
  const step = CV.out(clamp01(frame / 20));
  const dim = CV.hardStep3(clamp01((frame - 60) / 40));
  const move = CV.hardStep3(clamp01((frame - 90) / 30));
  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${colors.bgLift} 0%, ${colors.bg} 100%)` }} />
      <AbsoluteFill style={{ background: `linear-gradient(90deg, ${colors.muted} 0%, transparent 60%)`, opacity: 0.22 }} />
      {/* 窗外天光落在墙上 */}
      {[0, 1].map((i) => (
        <div key={i} style={{ position: 'absolute', left: 140 + i * 520, top: 0, width: 420, height: 1080, background: `linear-gradient(90deg, transparent 0%, ${colors.paper} 50%, transparent 100%)`, opacity: 0.05, transform: 'skewX(-12deg)' }} />
      ))}
      {/* 窗：天色压下来，末段只剩它是亮的 */}
      <div style={{ position: 'absolute', left: 1580, top: 176, width: 300, height: 520, overflow: 'hidden', border: `10px solid ${colors.ink}`, boxSizing: 'border-box' }}>
        <AbsoluteFill style={{ background: `linear-gradient(180deg, ${colors.paper} 0%, ${FILM.snowCyan} 60%, ${colors.muted} 100%)`, opacity: 0.5 - 0.16 * move }} />
        <AbsoluteFill style={{ background: colors.bg, opacity: 0.1 + 0.3 * dim }} />
        <div style={{ position: 'absolute', left: '48%', top: 0, width: 6, height: '100%', background: colors.ink, opacity: 0.75 }} />
        <div style={{ position: 'absolute', top: '46%', left: 0, width: '100%', height: 6, background: colors.ink, opacity: 0.75 }} />
      </div>
      {/* 墙面接缝 */}
      {[300, 620, 900].map((y, i) => (
        <div key={y} style={{ position: 'absolute', left: 0, top: y, width: 1920, height: 1, background: colors.muted, opacity: 0.09 - i * 0.02 }} />
      ))}
      {/* 横钉与剑：剑穗静止（S43 已晃到静止），三道火燎痕朝里不画 */}
      <div style={{ position: 'absolute', left: 634, top: 345, width: 128, height: 3, background: colors.ink }} />
      <div style={{ position: 'absolute', left: 644, top: 351, width: 108, height: 2, background: colors.ink, opacity: 0.3 }} />
      <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
        <g transform="translate(-80 -20) scale(0.86)">
          <path d="M900 424 L838 566 M900 424 L962 566" fill="none" stroke={colors.ink} strokeWidth={5} strokeLinecap="round" />
          <rect x={862} y={452} width={76} height={18} fill={colors.paperMuted} />
          <rect x={874} y={470} width={52} height={96} fill={colors.ink} />
          {[492, 520, 548].map((y) => (
            <path key={y} d={`M876 ${y} L924 ${y + 8}`} stroke={colors.paperMuted} strokeWidth={1.2} opacity={0.4} />
          ))}
          <rect x={830} y={566} width={140} height={24} fill={colors.ink} />
          <path d="M830 566 L970 566" stroke={colors.paper} strokeWidth={3} opacity={0.3} />
          <rect x={872} y={590} width={56} height={420} fill={colors.ink} />
          <path d="M875 604 L875 992" stroke={colors.paper} strokeWidth={1.2} opacity={0.22} />
          <rect x={860} y={992} width={80} height={18} fill={colors.paperMuted} opacity={0.9} />
          <path d="M930 458 Q922 508 934 552" fill="none" stroke={colors.paperMuted} strokeWidth={1.4} strokeLinecap="round" />
          <path d="M930 458 Q940 510 938 556" fill="none" stroke={colors.paperMuted} strokeWidth={1.1} opacity={0.7} strokeLinecap="round" />
        </g>
      </svg>
      {/* 她：退开一步，背影在右，只看不碰 */}
      <div
        style={{
          position: 'absolute',
          left: 1200 + 110 * step,
          top: 490,
          width: 230,
          height: 460,
          transform: 'rotate(-3deg)',
          transformOrigin: 'bottom center',
        }}
      >
        <XiangFigure age="40b" pose="back" style={{ width: '100%', height: '100%' }} />
        <div style={{ position: 'absolute', left: '43%', top: '18%', width: '14%', height: '7%', background: colors.ink }} />
        <div style={{ position: 'absolute', left: '42%', top: '27%', width: '17%', height: 1.3, background: FILM.snowCyan, opacity: 0.6, transform: 'rotate(16deg)' }} />
        <div style={{ position: 'absolute', left: '42%', top: '27%', width: '17%', height: 1.3, background: FILM.snowCyan, opacity: 0.6, transform: 'rotate(-16deg)' }} />
        <div style={{ position: 'absolute', left: '73%', top: '10%', width: 1.3, height: '36%', background: FILM.snowCyan, opacity: 0.22 }} />
      </div>
      {/* 末 30f：光从窗移到墙面 */}
      <div style={{ position: 'absolute', left: -60, top: -40, width: 1400, height: 1160, background: `linear-gradient(108deg, ${colors.paper} 0%, transparent 58%)`, opacity: 0.1 * move }} />
      {/* 室内暗一度 */}
      <AbsoluteFill style={{ background: colors.bg, opacity: 0.08 + 0.16 * dim }} />
      <AbsoluteFill style={{ background: GRADE.base.color, mixBlendMode: GRADE.base.blend, opacity: GRADE.base.opacity }} />
      {GRADE.veil ? <AbsoluteFill style={{ background: GRADE.veil.gradient, mixBlendMode: GRADE.veil.blend, opacity: GRADE.veil.opacity }} /> : null}
    </AbsoluteFill>
  );
};

export default S44;
