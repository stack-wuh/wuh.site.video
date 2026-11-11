/* S55 · Act 8 此刻 · 局部帧 [0,88) · 88f · 绝对 7370–7458
 *
 * V2 深空数据流重构（2026-11-11）：衍生之树 = 知识图谱隐喻（科技语言成立）——
 * 日志页与档案墙收束（0–24 原窗口）成根节点（琥珀辉光节点 18–30 落地生根）；
 * 树干/枝 1 以琥珀墨线描画生长（FN-45 treeGrow 20–70 / 44–78 原窗口，
 * 辉光双层描边）；最左枝「blog」挂线框数据卡（44–78，标签落位即现，标识不滚）：
 * 更早的博客时代 · ★6 · VitePress 碎片知识库，一条细线连回远处 Issue 芯片。
 * 转场：入「切」，出「切」。字幕安全窗：start≥12、end≤76。
 * 尾帧：树干与枝 1 立。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES, writeFade } from '../../../brand/motion';
import { FILM_COLORS2, glowText, treeGrow } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

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
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DeepSpace seed="s55v2" stars={54} grid horizon />

          {/* 收束残影：日志页/档案墙化节点（0–24） */}
          {frame < 24 ? (
            <div
              style={{
                position: 'absolute',
                left: interpolate(frame, [0, 24], [300, 890]),
                top: interpolate(frame, [0, 24], [200, 470]),
                width: interpolate(frame, [0, 24], [1320, 40]),
                height: interpolate(frame, [0, 24], [680, 40]),
                borderRadius: 20,
                background: FILM_COLORS2.panel,
                border: `1px solid ${FILM_COLORS2.line}`,
                opacity: (1 - pull) * 0.8,
              }}
            />
          ) : null}
          {/* 根节点（落地生根，知识图谱根） */}
          <div
            style={{
              position: 'absolute',
              left: 885,
              top: 470,
              width: 50,
              height: 50,
              borderRadius: 25,
              background: FILM_COLORS2.data,
              boxShadow: `0 0 34px 10px rgba(212,163,115,${0.3 + 0.08 * Math.sin(frame / 5)})`,
              opacity: interpolate(frame, [18, 30], [0, 0.95], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            }}
          />

          {/* 知识图谱之树：树干/枝 1（琥珀墨线，辉光双层描边生长） */}
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <path d={TRUNK_D} fill="none" stroke="rgba(212,163,115,0.16)" strokeWidth={18} {...trunk.stroke} />
            <path d={TRUNK_D} fill="none" stroke={FILM_COLORS2.data} strokeWidth={9} {...trunk.stroke} opacity={0.92} />
            {/* 枝 1：向左横出 */}
            <path d={B1_D} fill="none" stroke="rgba(212,163,115,0.14)" strokeWidth={12} {...b1.stroke} />
            <path d={B1_D} fill="none" stroke={FILM_COLORS2.data} strokeWidth={4.5} {...b1.stroke} opacity={0.88} />
            {/* 枝 2 预留分叉痕（后镜用，微亮） */}
            <path d="M 880 700 C 1060 700 1240 720 1420 700" fill="none" stroke={FILM_COLORS2.line} strokeWidth={1.2} strokeDasharray={6} opacity={0.4} />
          </svg>

          {/* 枝 1 挂卡：blog（44–78，标签落位即现，线框数据卡） */}
          <div style={{ position: 'absolute', left: 150, top: 470, ...writeFade(frame, 58) }}>
            <div
              style={{
                background: FILM_COLORS2.panel,
                border: `1px solid ${FILM_COLORS2.dataDim}`,
                borderRadius: 8,
                padding: '22px 30px',
                boxShadow: `0 0 26px rgba(212,163,115,0.16), 0 16px 44px rgba(0,0,0,0.55)`,
              }}
            >
              <div style={{ fontFamily: fontFamilies.mono, fontSize: 24, color: FILM_COLORS2.paperWhite, ...glowText(FILM_COLORS2.data, 0.2) }}>blog</div>
              <div style={{ fontFamily: fontFamilies.serif, fontSize: 17, color: FILM_COLORS2.textMuted, marginTop: 8 }}>
                更早的博客时代 · <span style={{ color: FILM_COLORS2.gold }}>★6</span>
              </div>
              <div style={{ fontFamily: fontFamilies.serif, fontSize: 17, color: FILM_COLORS2.textMuted, marginTop: 4 }}>VitePress 碎片知识库</div>
            </div>
            {/* 细线连回远处 Issue 芯片 */}
            <div style={{ position: 'absolute', left: -90, top: 40, width: 90, height: 1.5, background: FILM_COLORS2.dataDim, opacity: 0.6 }} />
            <div style={{ position: 'absolute', left: -190, top: 16, width: 100, height: 48, borderRadius: 4, border: `1px dashed ${FILM_COLORS2.dataDim}`, opacity: 0.55, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 12, color: FILM_COLORS2.textMuted }}>Issues</span>
            </div>
          </div>
        </AbsoluteFill>
      </CameraRig>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 300, backgroundImage: `linear-gradient(180deg, transparent, ${FILM_COLORS2.spaceDeep})`, opacity: 0.2 }} />
      <HudChrome label="wuh.site · GRAPH" readout="ROOT · BLOG" />
      <Grade2 id="GR2-08" />
      <Caption text="博客是根——碎片的知识，先写在 Issue 里。" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S55;
