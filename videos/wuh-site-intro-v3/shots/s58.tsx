/* S58 · Act 8 此刻 · 局部帧 [0,118) · 118f · 绝对 7732–7850
 *
 * 审计重定义（2026-11-12 批次 E 返工单）：plan→execute 改流程节点事件链（pipelineNode 语义）——
 * plan 牌（36）与 execute 牌（66）逐个弹亮（scale pop + 点亮进度，落章原地淡入退役），
 * 节点间连线 pathDraw 逐段画通（48–62 plan→execute / 72–82 execute→落盘 chip），
 * 落盘 chip 84 弹亮（planHash ✓ 朱红 = 本镜唯一手作签名）+ paperShake 落盘轻震（84 原锚）。
 * 枝 4 treeGrow（6–34）与标签卡（14 springIn：2026-09-16 · 158 commits · v1.9.0 = DATA 口径）保留。
 *
 * 编排四问：
 * ① 承接——s57 尾帧交出「树+枝 1–3 书房窗亮」：树骨架+枝 1–3 常驻，枝 4 下垂工具枝生长。
 * ② 触发——plan 节点 36 弹亮发起事件链；链路被 pathDraw 逐段画通才点亮下一节点。
 * ③ 展开——[6–34] 枝 4 生长 / [14] 标签卡 springIn / [36] plan 弹亮 / [48–62] 连线画通 /
 *   [66] execute 弹亮 / [72–82] 连线画通至落盘 / [84] 落盘 chip 弹亮 + ✓ 朱红 + paperShake。
 * ④ 交接——尾帧：枝 4 双牌（plan/execute）落定 + 落盘 chip 定格（manifest endFrameDesc 契约
 *   「交接态：树+枝 1–4」原样，「双牌落定」语义由双节点定格兑现）。
 *
 * 逐拍帧表（局部帧，fps=30）：
 * [6–34]    枝 4 treeGrow 生长（下垂工具枝，辉光双层描边）；[14] 标签卡 springIn；
 * [36]      plan 牌 pipelineNode 弹亮（scale 0.88→1 + 点亮）；[48–62] 连线1 pathDraw 画通；
 * [66]      execute 牌 pipelineNode 弹亮（副行「等待确认…」）；[72–82] 连线2 pathDraw 画通；
 * [84]      落盘 chip pipelineNode 弹亮 + 「planHash bb964de… ✓ 落盘」（✓ 朱红）+ paperShake(84,1.6,9)
 *           + execute 副行切「已落盘」；[84–118] 链路辉光呼吸 = 交接态。
 * 时间轴零改动：118f / 枝 4 6–34 / 落章拍 36/66/84（shake 锚）原样 / Caption（文本+appearAt 14）原样；
 * 无 <Sequence>；FILM_COLORS2 only；random(seed) only；springIn/pipelineNode fps 取 useVideoConfig()。
 * 转场：入「切」，出「切」。字幕安全窗：start≥12、end≤106。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { FILM_COLORS2, glowText, paperShake, pathDraw, pipelineNode, springIn, treeGrow } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 118;
/** 枝 4（真长度由 evolvePath 计算） */
const B4_D = 'M 895 600 C 830 520 760 470 640 445';
/** 事件链连线（plan→execute / execute→落盘 chip，微弧真长度驱动） */
const SEG1_D = 'M 664 585 C 682 566 700 604 716 585';
const SEG2_D = 'M 850 655 C 800 700 760 702 706 708';

/** 双牌（pipelineNode 语义的流程节点；牌面=节点本体） */
const StepCard: FC<{ title: string; sub: string; node: { transform: string; opacity: number; green: number } }> = ({ title, sub, node }) => (
  <div style={{ opacity: node.opacity, transform: node.transform }}>
    <div
      style={{
        width: 330,
        height: 130,
        borderRadius: 8,
        background: FILM_COLORS2.panel,
        border: `1px solid ${node.green > 0.5 ? FILM_COLORS2.data : FILM_COLORS2.dataDim}`,
        boxShadow: node.green > 0.5 ? `0 0 ${14 + node.green * 18}px rgba(212,163,115,${0.14 * node.green + 0.06}), 0 16px 40px rgba(0,0,0,0.55)` : `0 0 12px rgba(212,163,115,0.06), 0 16px 40px rgba(0,0,0,0.55)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
      }}
    >
      <span style={{ fontFamily: fontFamilies.mono, fontSize: 30, color: FILM_COLORS2.paperWhite, opacity: 0.9 }}>{title}</span>
      <span style={{ fontFamily: fontFamilies.mono, fontSize: 13, color: FILM_COLORS2.textMuted, opacity: 0.85 }}>{sub}</span>
    </div>
  </div>
);

const S58: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b4 = treeGrow(frame, 6, 34, B4_D);
  /* 事件链：plan 36 / execute 66 / 落盘 chip 84（原落章拍不动） */
  const plan = pipelineNode(frame, 36, fps);
  const exec = pipelineNode(frame, 66, fps);
  const chip = pipelineNode(frame, 84, fps);
  const seg1 = pathDraw(frame, 48, 14, SEG1_D);
  const seg2 = pathDraw(frame, 72, 10, SEG2_D);
  const cardP = springIn(frame, 14, fps);
  const shake = paperShake(frame, 84, 1.6, 9);
  /* 落盘后链路辉光呼吸（84 起升至镜尾） */
  const chainGlow = frame >= 84 ? interpolate(frame, [84, TOTAL], [0.04, 0.12], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) + 0.05 * Math.sin(frame / 7) : 0;
  const cam = { scale: 1.05, x: 0, y: interpolate(frame, [0, 30], [0, 20], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), rot: 0 };

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DeepSpace seed="s58v2" stars={50} grid horizon />
          {/* 树骨架 + 枝 1–3（常驻，琥珀墨）+ 枝 4（下垂工具枝，生长） */}
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <path d="M 910 520 C 900 640 880 760 850 880" fill="none" stroke="rgba(212,163,115,0.16)" strokeWidth={18} />
            <path d="M 910 520 C 900 640 880 760 850 880" fill="none" stroke={FILM_COLORS2.data} strokeWidth={9} opacity={0.92} />
            <path d="M 880 660 C 700 620 520 600 300 620" fill="none" stroke="rgba(212,163,115,0.14)" strokeWidth={12} />
            <path d="M 880 660 C 700 620 520 600 300 620" fill="none" stroke={FILM_COLORS2.data} strokeWidth={4.5} opacity={0.88} />
            <path d="M 880 700 C 1060 700 1240 720 1420 700" fill="none" stroke="rgba(212,163,115,0.14)" strokeWidth={12} />
            <path d="M 880 700 C 1060 700 1240 720 1420 700" fill="none" stroke={FILM_COLORS2.data} strokeWidth={4.5} opacity={0.88} />
            <path d="M 890 620 C 980 520 1090 460 1230 430" fill="none" stroke="rgba(212,163,115,0.14)" strokeWidth={11} />
            <path d="M 890 620 C 980 520 1090 460 1230 430" fill="none" stroke={FILM_COLORS2.data} strokeWidth={4} opacity={0.88} />
            <path d={B4_D} fill="none" stroke="rgba(212,163,115,0.14)" strokeWidth={11} {...b4.stroke} />
            <path d={B4_D} fill="none" stroke={FILM_COLORS2.data} strokeWidth={4} {...b4.stroke} opacity={0.88} />
          </svg>

          {/* 事件链连线（pathDraw 画通：48–62 / 72–82） */}
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <path d={SEG1_D} fill="none" stroke={FILM_COLORS2.data} strokeWidth={1.8} strokeDasharray={seg1.strokeDasharray} strokeDashoffset={seg1.strokeDashoffset} opacity={0.75} />
            <path d={SEG2_D} fill="none" stroke={FILM_COLORS2.data} strokeWidth={1.8} strokeDasharray={seg2.strokeDasharray} strokeDashoffset={seg2.strokeDashoffset} opacity={0.75} />
          </svg>

          {/* 枝 4 标签卡（14 springIn，线框数据卡） */}
          <div style={{ position: 'absolute', left: 360, top: 330, opacity: Math.min(1, cardP * 1.5), transform: `translateY(${(1 - cardP) * 22}px) scale(${0.94 + cardP * 0.06})` }}>
            <div
              style={{
                background: FILM_COLORS2.panel,
                border: `1px solid ${FILM_COLORS2.dataDim}`,
                borderRadius: 8,
                padding: '18px 26px',
                boxShadow: `0 0 26px rgba(212,163,115,0.16), 0 16px 44px rgba(0,0,0,0.55)`,
                whiteSpace: 'nowrap',
              }}
            >
              <div style={{ fontFamily: fontFamilies.mono, fontSize: 22, color: FILM_COLORS2.paperWhite, ...glowText(FILM_COLORS2.data, 0.2) }}>shadow-dev-cli</div>
              <div style={{ fontFamily: fontFamilies.mono, fontSize: 15, color: FILM_COLORS2.textMuted, marginTop: 8 }}>2026-09-16 · 158 commits · v1.9.0</div>
            </div>
          </div>

          {/* plan 牌（36 pipelineNode 弹亮） */}
          <div style={{ position: 'absolute', left: 330, top: 520 }}>
            <StepCard title="plan" sub="planHash 确认后执行" node={plan} />
          </div>
          {/* execute 牌（66 pipelineNode 弹亮；84 后副行切「已落盘」） */}
          <div style={{ position: 'absolute', left: 720, top: 520 }}>
            <StepCard title="execute" sub={frame >= 84 ? 'planHash ✓ 已落盘' : '等待确认…'} node={exec} />
          </div>
          {/* 落盘 chip（84 pipelineNode 弹亮 + paperShake；✓ 朱红 = 本镜唯一手作签名） */}
          <div style={{ position: 'absolute', left: 560, top: 690, opacity: chip.opacity, transform: `${chip.transform} ${shake.transform}` }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 18px',
                borderRadius: 6,
                border: `1px solid ${FILM_COLORS2.data}`,
                background: `rgba(212,163,115,${0.08 + chainGlow})`,
                boxShadow: `0 0 ${12 + chainGlow * 60}px rgba(212,163,115,0.18)`,
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 15, color: FILM_COLORS2.gold, opacity: 0.92 }}>planHash bb96c4de…</span>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 17, color: FILM_COLORS2.sealRed, textShadow: `0 0 10px rgba(122,31,22,0.45)` }}>✓</span>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 15, color: FILM_COLORS2.paperWhite, opacity: 0.9 }}>落盘</span>
            </div>
          </div>
        </AbsoluteFill>
      </CameraRig>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 300, backgroundImage: `linear-gradient(180deg, transparent, ${FILM_COLORS2.spaceDeep})`, opacity: 0.2 }} />
      <HudChrome label="wuh.site · GRAPH" readout={frame >= 84 ? 'BRANCH 4 · HASH WRITTEN' : frame >= 66 ? 'BRANCH 4 · EXECUTE' : 'BRANCH 4 · CLI'} />
      <Grade2 id="GR2-08" />
      <Caption text="方法又长成一把工具：plan → execute，确定性地落盘。" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S58;
