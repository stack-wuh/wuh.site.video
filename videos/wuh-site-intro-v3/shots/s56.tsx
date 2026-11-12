/* S56 · Act 8 此刻 · 局部帧 [0,154) · 154f · 绝对 7458–7612
 *
 * 审计重定义（2026-11-12 批次 E 返工单）：流程节点事件链——五阶段 propose→apply→review→
 * release→归档 改 pipelineNode 语义：节点逐个弹亮（scale pop + 绿→琥珀点亮进度，24+i*19 原节奏）
 * + 节点间连线 pathDraw 逐段画通（svg 真长度，画通才有「事件链」的因果感）；
 * 末节点归档弹亮（100）配轻冲击（双环+金粒）；尾拍闭环弧线 pathDraw 回指 propose（112–136）
 * =「一套方法」的闭环本体。枝 2 treeGrow（10–54）与标签卡（24 springIn：2026-06-27 ·
 * 290 commits · v7.4.0 · 13 技能，DATA 口径）原窗口保留。
 *
 * 编排四问：
 * ① 承接——s55 尾帧交出「树+枝 1 卡」：树骨架常驻（s55 已生长态琥珀墨），枝 2 自分叉痕生长。
 * ② 触发——propose 节点 24 弹亮发起事件链，链上每个节点被前一段连线「画通」才亮。
 * ③ 展开——[10–54] 枝 2 生长 / [24] 标签卡 springIn / [24–100] 五节点 pipelineNode 逐个弹亮 /
 *   [34–124] 四段连线 pathDraw 依次画通 / [100] 归档弹亮轻冲击 / [112–136] 闭环弧线画通回指。
 * ④ 交接——尾帧：枝 2 五阶段全亮 + 闭环成形（manifest endFrameDesc 契约「交接态：树+枝 1–2」原样）。
 *
 * 逐拍帧表（局部帧，fps=30）：
 * [10–54]   枝 2 treeGrow 生长（辉光双层描边）；[24] 标签卡 springIn（translateY 22→0）；
 * [24/43/62/81/100] 五节点 pipelineNode 依次弹亮（scale 0.88→1 pop + 点亮进度）；
 * [34/53/72/91/110+] 连线 pathDraw 逐段画通（34+i*19 起，12f）；
 * [100]     归档节点弹亮 + 轻冲击（shockwave 双环 + sparkBurst('s56-burst',8 金粒)）；
 * [112–136] 闭环弧线 pathDraw 回指 propose；[128] 「LOOP · 闭环」小标显影；
 * [136–154] 链路辉光呼吸 = 交接态。
 * 时间轴零改动：154f / 枝 2 10–54 / 五阶段 24–120 原节奏 / Caption（文本+appearAt 14）原样；
 * 无 <Sequence>；FILM_COLORS2 only；random(seed) only；springIn/pipelineNode fps 取 useVideoConfig()。
 * 转场：入「切」，出「切」。字幕安全窗：start≥12、end≤142。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { FILM_COLORS2, glowText, pathDraw, pipelineNode, shockwave, sparkBurst, springIn, treeGrow } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 154;
const STAGES = ['propose', 'apply', 'review', 'release', '归档'];
const NODE_W = 130;
const NODE_H = 56;
const NODE_TOP = 720;
const NODE_X0 = 430;
const NODE_PITCH = 212;
/** 枝 2（真长度由 evolvePath 计算） */
const B2_D = 'M 880 700 C 1060 700 1240 720 1420 700';
/** 闭环弧线：归档 → propose（回指，画通=闭环本体） */
const LOOP_D = 'M 1343 712 C 1180 636 640 636 505 708';

/** 节点 i 的连线段 d（自节点 i 右缘到节点 i+1 左缘，微弧） */
const segD = (i: number): string => {
  const x = NODE_X0 + i * NODE_PITCH;
  return `M ${x + NODE_W + 8} 748 C ${x + NODE_W + 30} 740 ${x + NODE_PITCH - 30} 756 ${x + NODE_PITCH - 8} 748`;
};

/** 树骨架（承接 s55；已生长态常驻，琥珀墨） */
const TreeTrunk: FC = () => (
  <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
    <path d="M 910 520 C 900 640 880 760 850 880" fill="none" stroke="rgba(212,163,115,0.16)" strokeWidth={18} />
    <path d="M 910 520 C 900 640 880 760 850 880" fill="none" stroke={FILM_COLORS2.data} strokeWidth={9} opacity={0.92} />
    <path d="M 880 660 C 700 620 520 600 300 620" fill="none" stroke="rgba(212,163,115,0.14)" strokeWidth={12} />
    <path d="M 880 660 C 700 620 520 600 300 620" fill="none" stroke={FILM_COLORS2.data} strokeWidth={4.5} opacity={0.88} />
  </svg>
);

const S56: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // 枝 2 生长（向右横出，10–54）
  const b2 = treeGrow(frame, 10, 44, B2_D);
  /* 标签卡（24 springIn）/ 末节点轻冲击（100）/ 闭环弧线（112–136） */
  const cardP = springIn(frame, 24, fps);
  const wave = shockwave(frame, 100, '233,217,174');
  const burst = sparkBurst('s56-burst', frame, 100, 8, true);
  const loop = pathDraw(frame, 112, 24, LOOP_D);
  const loopLabel = interpolate(frame, [128, 138], [0, 0.7], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  /* 链路辉光呼吸（136–154） */
  const chainGlow = 0.12 + 0.06 * Math.sin(frame / 7);
  const cam = { scale: 1.03, x: interpolate(frame, [0, TOTAL], [40, -10], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }), y: 0, rot: 0 };

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DeepSpace seed="s56v2" stars={52} grid horizon />
          <TreeTrunk />
          {/* 枝 2 生长（琥珀墨线） */}
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <path d={B2_D} fill="none" stroke="rgba(212,163,115,0.14)" strokeWidth={12} {...b2.stroke} />
            <path d={B2_D} fill="none" stroke={FILM_COLORS2.data} strokeWidth={4.5} {...b2.stroke} opacity={0.88} />
          </svg>

          {/* 枝 2 标签卡（24 springIn，线框数据卡） */}
          <div style={{ position: 'absolute', left: 640, top: 560, opacity: Math.min(1, cardP * 1.5), transform: `translateY(${(1 - cardP) * 22}px) scale(${0.94 + cardP * 0.06})` }}>
            <div
              style={{
                background: FILM_COLORS2.panel,
                border: `1px solid ${FILM_COLORS2.dataDim}`,
                borderRadius: 8,
                padding: '20px 28px',
                boxShadow: `0 0 26px rgba(212,163,115,0.16), 0 16px 44px rgba(0,0,0,0.55)`,
                whiteSpace: 'nowrap',
              }}
            >
              <div style={{ fontFamily: fontFamilies.mono, fontSize: 23, color: FILM_COLORS2.paperWhite, ...glowText(FILM_COLORS2.data, 0.2) }}>shadow-dev-workflow</div>
              <div style={{ fontFamily: fontFamilies.mono, fontSize: 16, color: FILM_COLORS2.textMuted, marginTop: 8 }}>2026-06-27 · 290 commits · v7.4.0 · 13 技能</div>
            </div>
          </div>

          {/* 闭环弧线（112–136 画通回指 propose）+ 小标 */}
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <path d={LOOP_D} fill="none" stroke={FILM_COLORS2.dataDim} strokeWidth={1.6} strokeDasharray={loop.strokeDasharray} strokeDashoffset={loop.strokeDashoffset} opacity={loopLabel > 0 ? 0.55 : 0.4} />
          </svg>
          <div style={{ position: 'absolute', left: 880, top: 648, fontFamily: fontFamilies.mono, fontSize: 13, letterSpacing: '0.3em', color: FILM_COLORS2.textMuted, opacity: loopLabel }}>LOOP · 闭环</div>

          {/* 五节点事件链：pipelineNode 逐个弹亮 + 连线 pathDraw 逐段画通 */}
          {STAGES.map((s, i) => {
            const node = pipelineNode(frame, 24 + i * 19, fps);
            const seg = i < STAGES.length - 1 ? pathDraw(frame, 34 + i * 19, 12, segD(i)) : null;
            const x = NODE_X0 + i * NODE_PITCH;
            const isLast = i === STAGES.length - 1;
            return (
              <div key={s}>
                {seg ? (
                  <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                    <path d={segD(i)} fill="none" stroke={FILM_COLORS2.data} strokeWidth={1.8} strokeDasharray={seg.strokeDasharray} strokeDashoffset={seg.strokeDashoffset} opacity={0.75} />
                  </svg>
                ) : null}
                <div style={{ position: 'absolute', left: x, top: NODE_TOP, opacity: node.opacity, transform: node.transform }}>
                  <div
                    style={{
                      width: NODE_W,
                      height: NODE_H,
                      borderRadius: 6,
                      border: `1px solid ${node.green > 0.5 ? FILM_COLORS2.dataDim : FILM_COLORS2.line}`,
                      background: `rgba(212,163,115,${node.green * (isLast ? chainGlow + 0.1 : chainGlow)})`,
                      boxShadow: node.green > 0.5 ? `0 0 ${8 + node.green * 14}px rgba(212,163,115,${0.14 * node.green})` : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span style={{ fontFamily: fontFamilies.mono, fontSize: 20, color: FILM_COLORS2.paperWhite, opacity: 0.9 }}>{s}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* 末节点（归档）弹亮轻冲击（100）：双环 + 金粒，锚节点中心 (1343,748) */}
          {frame >= 100 ? (
            <div style={{ position: 'absolute', left: NODE_X0 + 4 * NODE_PITCH + NODE_W / 2, top: NODE_TOP + NODE_H / 2, width: 0, height: 0, zIndex: 30, pointerEvents: 'none' }}>
              {wave ? <div style={wave.ring1} /> : null}
              {wave ? <div style={wave.ring2} /> : null}
              {burst.map((p, i) => (
                <div key={i} style={p.style} />
              ))}
            </div>
          ) : null}
        </AbsoluteFill>
      </CameraRig>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 300, backgroundImage: `linear-gradient(180deg, transparent, ${FILM_COLORS2.spaceDeep})`, opacity: 0.2 }} />
      <HudChrome label="wuh.site · GRAPH" readout={frame >= 136 ? 'BRANCH 2 · LOOP CLOSED' : 'BRANCH 2 · WORKFLOW'} />
      <Grade2 id="GR2-08" />
      <Caption text="它长出一套方法：propose → apply → review → release → 归档。" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S56;
