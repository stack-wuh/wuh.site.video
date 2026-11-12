/* S55 · Act 8 此刻 · 局部帧 [0,88) · 88f · 绝对 7370–7458
 *
 * 审计重定义（2026-11-12 批次 E 返工单）：衍生之树 = 知识图谱隐喻——treeGrow 树干/枝 1 琥珀墨线
 * 生长（20–70 / 44–78 原窗口，真长度驱动）+ Issue 144 数据标签（★凡量必滚：144 numRoll 微滚，
 * 66 springIn 弹出；「碎片的知识先写在 Issue 里」的字面数据本体）。blog 卡片入场由原地淡入
 * 改为 springIn 位移弹入（58）；旧「Issues 虚线芯片」出画（left=-40 半出屏）→ 重定位为
 * 可读数据标签（60,640），细连线 pathDraw 画通（62–74）。
 *
 * 编排四问：
 * ① 承接——s54 尾帧交出「日志页+余辉」：0–24 日志页/档案墙收束（原窗口）成根节点。
 * ② 触发——根节点 18–30 落地生根（辉光脉动），树干 20 起 pathDraw 自根向下生长。
 * ③ 展开——[20–70] 树干生长 / [44–78] 枝 1 向左横出 / [58] blog 卡 springIn 弹入挂枝 /
 *   [62–74] 细连线画通 / [66] Issue 标签 springIn + 144 numRoll 微滚（0→144，20f）。
 * ④ 交接——尾帧：树干与枝 1 立 + blog 卡 + Issue 144 标签（manifest endFrameDesc 契约
 *   「交接态：树+枝 1 卡」原样，数据标签强化「碎片→Issue」语义）。
 *
 * 逐拍帧表（局部帧，fps=30）：
 * [0–24]    日志页/档案墙收束残影（left/top/width/height 插值收敛，原窗口）；
 * [18–30]   根节点落地生根（辉光 0.3+0.08sin 脉动）；[20–70] 树干 treeGrow（双层辉光描边）；
 * [44–78]   枝 1 向左横出（treeGrow）；[58] blog 卡 springIn（translateY 26→0 + scale 0.94→1）；
 * [62–74]   卡→Issue 细连线 pathDraw 画通；[66–86] Issue 标签 springIn + 144 numRoll 微滚 + 落定闪；
 * [78–88]   根辉光呼吸 + 枝尖微亮 = 交接态。
 * 时间轴零改动：88f / treeGrow 20–70 / 44–78 / Caption（文本+appearAt 14）原样；无 <Sequence>；
 * FILM_COLORS2 only；random(seed) only；springIn fps 取 useVideoConfig()。
 * 转场：入「切」，出「切」。字幕安全窗：start≥12、end≤76。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES, } from '../../../brand/motion';
import { DATA, FILM_COLORS2, fmtNum, glowText, numRoll, pathDraw, springIn, treeGrow } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 88;
/** 树干/枝 1（真长度由 evolvePath 计算） */
const TRUNK_D = 'M 910 520 C 900 640 880 760 850 880';
const B1_D = 'M 880 660 C 700 620 520 600 300 620';
/** blog 卡 → Issue 标签细连线（自卡底左垂下） */
const LINK_D = 'M 96 610 C 96 622 92 632 92 644';

const S55: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pull = interpolate(frame, [0, 24], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  // 树干生长（20–70）
  const trunk = treeGrow(frame, 20, 50, TRUNK_D);
  // 枝 1（44–78）
  const b1 = treeGrow(frame, 44, 34, B1_D);
  /* blog 卡（58 springIn）/ Issue 标签（66 springIn + 144 微滚）/ 连线（62–74 画通） */
  const blogP = springIn(frame, 58, fps);
  const issueP = springIn(frame, 66, fps);
  const issuesRoll = numRoll(frame, 68, 20, 0, DATA.issues);
  const issueFlash = interpolate(frame, [86, 88, 94], [0, 0.8, 0.2], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const link = pathDraw(frame, 62, 12, LINK_D);
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
            {/* 卡→Issue 细连线（62–74 画通） */}
            <path d={LINK_D} fill="none" stroke={FILM_COLORS2.dataDim} strokeWidth={1.5} strokeDasharray={link.strokeDasharray} strokeDashoffset={link.strokeDashoffset} opacity={0.7} />
            {/* 枝 2 预留分叉痕（后镜用，微亮） */}
            <path d="M 880 700 C 1060 700 1240 720 1420 700" fill="none" stroke={FILM_COLORS2.line} strokeWidth={1.2} strokeDasharray={6} opacity={0.4} />
          </svg>

          {/* 枝 1 挂卡：blog（58 springIn 弹入，线框数据卡） */}
          <div style={{ position: 'absolute', left: 150, top: 470, opacity: Math.min(1, blogP * 1.5), transform: `translateY(${(1 - blogP) * 26}px) scale(${0.94 + blogP * 0.06})` }}>
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
          </div>

          {/* Issue 144 数据标签（66 springIn + numRoll 微滚；「碎片的知识先写在 Issue 里」数据本体） */}
          <div style={{ position: 'absolute', left: 40, top: 646, opacity: Math.min(1, issueP * 1.5), transform: `translateY(${(1 - issueP) * 20}px) scale(${0.92 + issueP * 0.08})` }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'baseline',
                gap: 10,
                padding: '12px 18px',
                borderRadius: 6,
                border: `1px dashed ${FILM_COLORS2.dataDim}`,
                background: FILM_COLORS2.panel,
                boxShadow: issueFlash > 0.15 ? `0 0 ${10 + issueFlash * 16}px rgba(212,163,115,${0.12 + issueFlash * 0.3})` : `0 0 12px rgba(212,163,115,0.1)`,
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 16, letterSpacing: '0.2em', color: FILM_COLORS2.data, opacity: 0.9 }}>ISSUES</span>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 30, fontWeight: 700, color: FILM_COLORS2.gold, fontVariantNumeric: 'tabular-nums', textShadow: `0 0 ${10 + issueFlash * 12}px rgba(233,217,174,${0.3 + issueFlash * 0.3})` }}>{fmtNum(issuesRoll)}</span>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 13, letterSpacing: '0.14em', color: FILM_COLORS2.textMuted }}>碎片知识 · 源头</span>
            </div>
          </div>
        </AbsoluteFill>
      </CameraRig>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 300, backgroundImage: `linear-gradient(180deg, transparent, ${FILM_COLORS2.spaceDeep})`, opacity: 0.2 }} />
      <HudChrome label="wuh.site · GRAPH" readout={frame >= 78 ? 'ROOT · BLOG · ISSUES 144' : 'ROOT · BLOG'} />
      <Grade2 id="GR2-08" />
      <Caption text="博客是根——碎片的知识，先写在 Issue 里。" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S55;
