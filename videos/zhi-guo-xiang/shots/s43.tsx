import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { CV, FILM, GRADES } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const GRADE = GRADES['GR-06'];

/**
 * S43（5-6 中段，5700–5880，180f）——剑挂上横钉（鞘 ink、穗 paperMuted，不红），剑穗垂下、微微晃；
 * 鞘上三道火燎痕朝里，不给人看；墙上只这一件东西。
 * TR-05 入镜 20f（blur 8→0、opacity 0→1）；剑入画 20f（下滑 30px）；穗子 70f 内晃到静止（SP-02 阻尼）；
 * 末 30f 焦点由剑移到窗。字幕是白话第 14 条。
 */
const S43: FC = () => {
  const frame = useCurrentFrame();
  const enter = CV.out(clamp01(frame / 20));
  const focus = CV.inOut(clamp01((frame - 150) / 30));
  const sway = frame < 70 ? 6 * Math.sin(frame / 6) * Math.exp(-frame / 22) : 0;
  const hover = -30 * (1 - enter);
  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <CameraRig cam={{ scale: 1.18, x: 0, y: 0, rot: 0 }}>
        <AbsoluteFill style={{ background: `linear-gradient(180deg, ${colors.bgLift} 0%, ${colors.bg} 100%)`, filter: `blur(${8 * (1 - enter)}px)` }}>
          <AbsoluteFill style={{ background: `linear-gradient(90deg, ${colors.muted} 0%, transparent 64%)`, opacity: 0.24 }} />
          {/* 窗：天色在右，末 30f 焦点移到这里 */}
          <div style={{ position: 'absolute', left: 1480, top: 150, width: 366, height: 520, overflow: 'hidden', border: `10px solid ${colors.ink}`, boxSizing: 'border-box', filter: `blur(${3 * (1 - focus)}px)` }}>
            <AbsoluteFill style={{ background: `linear-gradient(180deg, ${colors.paper} 0%, ${FILM.snowCyan} 64%, ${colors.muted} 100%)`, opacity: 0.34 + 0.28 * focus }} />
            <div style={{ position: 'absolute', top: 320, left: 0, width: '100%', height: 1.4, background: colors.ink, opacity: 0.3 }} />
            <div style={{ position: 'absolute', left: '50%', top: 0, width: 6, height: '100%', background: colors.ink, opacity: 0.75 }} />
            <div style={{ position: 'absolute', top: '46%', left: 0, width: '100%', height: 6, background: colors.ink, opacity: 0.75 }} />
          </div>
          {/* 窗外天光落在墙上 */}
          {[0, 1].map((i) => (
            <div key={i} style={{ position: 'absolute', left: 260 + i * 420, top: 0, width: 300, height: 1080, background: `linear-gradient(90deg, transparent 0%, ${colors.paper} 50%, transparent 100%)`, opacity: 0.08, transform: 'skewX(-12deg)' }} />
          ))}
          {/* 墙面接缝与横钉 */}
          {[300, 620, 900].map((y, i) => (
            <div key={y} style={{ position: 'absolute', left: 0, top: y, width: 1920, height: 1, background: colors.muted, opacity: 0.09 - i * 0.02 }} />
          ))}
          <div style={{ position: 'absolute', left: 786, top: 420, width: 228, height: 4, background: colors.ink }} />
          <div style={{ position: 'absolute', left: 800, top: 429, width: 210, height: 2, background: colors.ink, opacity: 0.35 }} />
          <div style={{ position: 'absolute', left: 986, top: 412, width: 24, height: 18, borderRadius: 8, background: colors.ink }} />
          {/* 剑：整组下滑 30px 入画；穗子单独晃，鞘上三道痕朝里不画 */}
          <div style={{ position: 'absolute', inset: 0, transform: `translateY(${hover}px)`, filter: `blur(${2.2 * focus}px)` }}>
            <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
              <path d="M900 424 L838 566 M900 424 L962 566" fill="none" stroke={colors.ink} strokeWidth={5} strokeLinecap="round" />
              <rect x={862} y={452} width={76} height={18} fill={colors.paperMuted} />
              <rect x={874} y={470} width={52} height={96} fill={colors.ink} />
              {[492, 520, 548].map((y) => (
                <path key={y} d={`M876 ${y} L924 ${y + 8}`} stroke={colors.paperMuted} strokeWidth={1.2} opacity={0.45} />
              ))}
              <rect x={830} y={566} width={140} height={24} fill={colors.ink} />
              <path d="M830 566 L970 566" stroke={colors.paper} strokeWidth={3} opacity={0.32} />
              <rect x={872} y={590} width={56} height={420} fill={colors.ink} />
              <path d="M875 604 L875 992" stroke={colors.paper} strokeWidth={1.2} opacity={0.24} />
              <path d="M872 604 L928 604" stroke={colors.paper} strokeWidth={1.2} opacity={0.18} />
              <rect x={860} y={992} width={80} height={18} fill={colors.paperMuted} opacity={0.9} />
              <g transform={`rotate(${sway} 930 458)`}>
                <path d="M930 458 Q920 512 934 560" fill="none" stroke={colors.paperMuted} strokeWidth={1.4} strokeLinecap="round" />
                <path d="M930 458 Q942 514 938 566" fill="none" stroke={colors.paperMuted} strokeWidth={1.1} opacity={0.7} strokeLinecap="round" />
                <circle cx={930} cy={458} r={4} fill={colors.paperMuted} opacity={0.85} />
              </g>
            </svg>
          </div>
          <AbsoluteFill style={{ background: GRADE.base.color, mixBlendMode: GRADE.base.blend, opacity: GRADE.base.opacity }} />
        </AbsoluteFill>
      </CameraRig>
      {GRADE.veil ? <AbsoluteFill style={{ background: GRADE.veil.gradient, mixBlendMode: GRADE.veil.blend, opacity: GRADE.veil.opacity }} /> : null}
      <AbsoluteFill style={{ background: colors.bg, opacity: 1 - enter }} />
      <Caption text="剑挂在墙上，再没取下来。" start={0} end={180} />
    </AbsoluteFill>
  );
};

export default S43;
