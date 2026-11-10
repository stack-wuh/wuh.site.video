/* S55 · Act 8 此刻 · 局部帧 [0,88) · 88f · 绝对 7370–7458
 *
 * 衍生之树·生根：自日志页与档案墙一同拉起（0–24），墙面与页面收束成墨点、
 * 落地生根、长成纸质树（FN-45 treeGrow 墨线+纸纤维生长 20–70）；
 * 最左老枝「blog」生长挂卡（44–78）：更早的博客时代 · ★6，一条细线连回远处
 * Issue 窗（枝上标签落位即现，标识不滚）。转场：入「切」，出「切」。
 * 字幕安全窗：start≥12、end≤76。
 * 尾帧：树干与枝 1 立。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, writeFade } from '../../../brand/motion';
import { treeGrow } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const TOTAL = 88;
/** 树干/枝 1（真长度由 evolvePath 计算，不再猜 1500/700） */
const TRUNK_D = 'M 910 520 C 900 640 880 760 850 880';
const B1_D = 'M 880 660 C 700 620 520 600 300 620';

const S55: FC = () => {
  const frame = useCurrentFrame();
  const pull = interpolate(frame, [0, 24], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  // 树干生长（20–70）
  const trunk = treeGrow(frame, 20, 50, TRUNK_D);
  // 枝 1（44–78）
  const b1 = treeGrow(frame, 44, 34, B1_D);
  const cam = {
    scale: interpolate(frame, [0, TOTAL], [1.18, 1.02], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    x: 0,
    y: interpolate(frame, [0, 24], [120, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    rot: 0,
  };

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DustField act={8} count={14} seedBase="s55" />

          {/* 收束残影：墙面/页面化墨点（0–24） */}
          {frame < 24 ? (
            <div style={{ position: 'absolute', left: interpolate(frame, [0, 24], [300, 890]), top: interpolate(frame, [0, 24], [200, 470]), width: interpolate(frame, [0, 24], [1320, 40]), height: interpolate(frame, [0, 24], [680, 40]), borderRadius: 20, background: colors.paperDeep, opacity: 1 - pull, border: `1px solid ${colors.hairline}` }} />
          ) : null}
          {/* 种子墨点（落地生根） */}
          <div style={{ position: 'absolute', left: 885, top: 470, width: 50, height: 50, borderRadius: 25, background: colors.ink, opacity: interpolate(frame, [18, 30], [0, 0.95], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }} />

          {/* 纸质的树：树干（墨线+纸纤维 path 描边生长） */}
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <path d={TRUNK_D} fill="none" stroke={colors.ink} strokeWidth={10} {...trunk.stroke} opacity={0.9} />
            {/* 枝 1：向左横出 */}
            <path d={B1_D} fill="none" stroke={colors.ink} strokeWidth={5} {...b1.stroke} opacity={0.85} />
            {/* 枝 1 预留分叉痕（后镜用，微亮） */}
            <path d="M 880 700 C 1060 700 1240 720 1420 700" fill="none" stroke={colors.muted} strokeWidth={1.2} strokeDasharray={6} opacity={0.35} />
          </svg>

          {/* 枝 1 挂卡：blog（44–78，标签落位即现） */}
          <div style={{ position: 'absolute', left: 150, top: 470, ...writeFade(frame, 58) }}>
            <div style={{ background: colors.paper, border: `1px solid ${colors.paperMuted}`, borderRadius: 8, padding: '22px 30px', boxShadow: '0 16px 44px rgba(0,0,0,0.35)' }}>
              <div style={{ fontFamily: fontFamilies.mono, fontSize: 24, color: colors.ink }}>blog</div>
              <div style={{ fontFamily: fontFamilies.serif, fontSize: 17, color: colors.muted, marginTop: 8 }}>更早的博客时代 · ★6</div>
              <div style={{ fontFamily: fontFamilies.serif, fontSize: 17, color: colors.muted, marginTop: 4 }}>VitePress 碎片知识库</div>
            </div>
            {/* 细线连回远处 Issue 窗 */}
            <div style={{ position: 'absolute', left: -90, top: 40, width: 90, height: 1.5, background: colors.muted, opacity: 0.6 }} />
            <div style={{ position: 'absolute', left: -190, top: 16, width: 100, height: 48, borderRadius: 4, border: `1px dashed ${colors.muted}`, opacity: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 12, color: colors.muted }}>Issues</span>
            </div>
          </div>
        </AbsoluteFill>
      </CameraRig>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 300, backgroundImage: `linear-gradient(180deg, transparent, ${colors.bg})`, opacity: 0.2 }} />
      <PaperGrain opacity={0.06} />
      <Grade id="GR-08" />
      <Caption text="博客是根——碎片的知识，先写在 Issue 里。" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S55;
