import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { CV, FILM, FN, GRADES } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Scripture } from '../components/Objects';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const GRADE = GRADES['GR-06'];
const COIL = [120, 104, 88];

/**
 * S36（5-4 前段，4860–4980，120f）——禅房案上：青驴的缰绳一圈圈放下，旁边摊着一卷经，案角一盏佛前灯。
 * TR-02 8f 溶解入场；缰绳最后半圈 20f 落定（CM-09 微距俯拍，固定）；PA-11 灯焰三档 2f 硬切、每 6f 1px 抖动。
 * 尾帧：缰绳与经卷并置、灯亮着。顺序：先剑（来历），后缰绳（选择）。
 */
const S36: FC = () => {
  const frame = useCurrentFrame();
  const entry = CV.out(clamp01(frame / 8));
  const lay = CV.out(clamp01(frame / 20));
  const flicker = FN.flameStep(frame);
  const jitter = Math.round(Math.sin(frame / 6) * 2) / 2;
  return (
    <AbsoluteFill style={{ background: colors.bg, opacity: entry }}>
      <CameraRig cam={{ scale: 1.1, x: 0, y: 0, rot: 0 }}>
        <AbsoluteFill style={{ filter: `saturate(${GRADE.saturate})` }}>
          <AbsoluteFill style={{ background: `linear-gradient(180deg, ${colors.bg} 0%, ${colors.bgLift} 54%, ${colors.bg} 100%)` }} />
          {/* 窗外是山 */}
          <div style={{ position: 'absolute', left: 1270, top: 116, width: 500, height: 360, overflow: 'hidden', border: `10px solid ${colors.ink}`, boxSizing: 'border-box' }}>
            <AbsoluteFill style={{ background: `linear-gradient(180deg, ${colors.paper} 0%, ${FILM.snowCyan} 68%, ${colors.muted} 100%)`, opacity: 0.5 }} />
            <svg viewBox="0 0 500 360" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
              <path d="M0 268 L90 210 L160 250 L250 196 L340 246 L420 214 L500 252" fill="none" stroke={colors.ink} strokeWidth={1.2} opacity={0.3} />
              <path d="M250 0 L250 360 M0 180 L500 180" stroke={colors.ink} strokeWidth={8} opacity={0.85} />
            </svg>
          </div>
          {/* 案面 */}
          <div style={{ position: 'absolute', left: 0, top: 600, width: 1920, height: 480, background: `linear-gradient(180deg, ${colors.ink} 0%, ${colors.bgLift} 100%)` }} />
          <div style={{ position: 'absolute', left: 0, top: 598, width: 1920, height: 2, background: colors.paperMuted, opacity: 0.22 }} />
          <AbsoluteFill style={{ background: `linear-gradient(255deg, ${colors.paper} 0%, transparent 42%)`, opacity: 0.06 }} />
          {/* 佛前灯（PT-11 局部 radial ≤80px，三档硬切） */}
          <div style={{ position: 'absolute', left: 330, top: 508, width: 150, height: 150, borderRadius: '50%', background: `radial-gradient(circle, ${FILM.fireGold} 0%, transparent 70%)`, opacity: 0.26 + 0.2 * flicker }} />
          <AbsoluteFill style={{ background: `linear-gradient(115deg, ${FILM.fireGold} 0%, transparent 46%)`, opacity: 0.08 }} />
          <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
            <ellipse cx={405} cy={640} rx={66} ry={19} fill={colors.ink} />
            <path d="M339 636 Q405 618 471 636" fill="none" stroke={colors.paperMuted} strokeWidth={1.4} opacity={0.5} />
            <path d="M355 632 Q405 650 455 632" fill="none" stroke={colors.ink} strokeWidth={2} opacity={0.55} />
            <ellipse cx={405 + jitter} cy={592} rx={9} ry={23} fill={FILM.fireGold} opacity={0.55 + 0.4 * flicker} />
            {/* 缰绳：一圈圈放下；最后一圈半 20f 落定 */}
            <ellipse cx={700} cy={852} rx={128} ry={38} fill={colors.ink} opacity={0.3} />
            {COIL.map((r, i) => (
              <ellipse key={r} cx={690} cy={820} rx={r} ry={r * 0.36} fill="none" stroke={colors.paperMuted} strokeWidth={1.4} opacity={0.9 - i * 0.12} />
            ))}
            <g transform={`translate(0 ${-26 * (1 - lay)}) rotate(${-16 * (1 - lay)} 690 820)`}>
              <path d="M610 852 A 96 36 0 0 1 776 792" fill="none" stroke={colors.paperMuted} strokeWidth={1.4} opacity={0.95} strokeLinecap="round" />
            </g>
            <path d="M782 812 Q860 802 900 862 Q930 906 886 936" fill="none" stroke={colors.paperMuted} strokeWidth={1.4} opacity={0.8} strokeLinecap="round" />
          </svg>
          {/* 经卷：经折装摊开，竖行以短横替代（展开 240×90） */}
          <div style={{ position: 'absolute', left: 1000, top: 646, width: 240, height: 111, transform: 'rotate(-4deg)' }}>
            <Scripture style={{ width: '100%', height: '100%' }} />
          </div>
          <AbsoluteFill style={{ background: GRADE.base.color, mixBlendMode: GRADE.base.blend, opacity: GRADE.base.opacity }} />
        </AbsoluteFill>
      </CameraRig>
      {GRADE.veil ? <AbsoluteFill style={{ background: GRADE.veil.gradient, mixBlendMode: GRADE.veil.blend, opacity: GRADE.veil.opacity }} /> : null}
    </AbsoluteFill>
  );
};

export default S36;
