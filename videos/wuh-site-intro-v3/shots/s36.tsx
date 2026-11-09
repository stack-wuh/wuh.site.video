/* S36 · Act 6 入院 · 局部帧 [0,96) · 96f · 绝对 5172–5268
 *
 * 热力图：光标移 06→点击→最大化（0–18）；S08 About 热力图打底 +
 * p-heatmap-crop 干净裁切前景（WIN-01）；365 格全局 ramp 加深（18–78，
 * 无逐格扫描，167 活动日沉更深——整图 brightness/对比 ramp）；
 * ★DAT-01「13,603」等宽小字快滚（28–68，落定 68=绝对 5240=拍262 对音）；
 * 峰值格 2026-07-24 · 1,263 被墨点圈住（72–84，标识不滚）；俯拍全景→缓移峰值格；
 * 收束（82–96）→07。转场：入「切」，出「切」。字幕安全窗：start≥12、end≤84。
 */
import type { FC } from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from 'remotion';
import { staticFile } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, writeFade } from '../../../brand/motion';
import { ConsoleCursor, ConsolePanel } from '../components/ConsolePanel';
import { ExpandWindow } from '../components/ExpandWindow';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { numRoll, ROLL_DUR } from '../motion-tokens';
import { PaperGrain } from '../components/PaperGrain';

const TOTAL = 96;
const ROLL_END = 68; // = 绝对 5240 = 拍262

const S36: FC = () => {
  const frame = useCurrentFrame();
  const expanded = frame >= 2 && frame < TOTAL - 14;
  const tailPanel = frame >= TOTAL - 14;
  // 365 格全局加深（18–78）：无逐格扫描——整图饱和度/对比 ramp
  const deepen = interpolate(frame, [18, 78], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  // ★DAT-01 快滚（28–68）
  const total = Math.round(numRoll(frame, 28, ROLL_DUR.standard, 12800, 13603));
  const cam = { scale: 1.04, x: interpolate(frame, [18, 78], [0, -50], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }), y: 0, rot: 0 };

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <CameraRigProxy cam={cam} />
      {!expanded ? (
        <>
          <ConsolePanel lit={5} active={6} panelIn={1} />
          <ConsoleCursor active={6} moveProgress={interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} />
          {tailPanel ? <ConsolePanel lit={6} active={7} panelIn={1} /> : null}
          {tailPanel ? <ConsoleCursor active={7} moveProgress={interpolate(frame, [TOTAL - 14, TOTAL], [0, 0.6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} /> : null}
        </>
      ) : (
        <ExpandWindow startAt={2} total={TOTAL} block={6} asset="wuh-site-intro-v3/site/s08-about-heatmap-v1.png" dim={0.2} objectPos="center 40%">
          {/* 365 格加深（整图 filter ramp：活动格沉更深） */}
          <div style={{ position: 'absolute', inset: 0, background: colors.gold, mixBlendMode: 'multiply', opacity: deepen * 0.28, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 62% 34%, rgba(245,233,200,0.14), transparent 46%)`, opacity: deepen, pointerEvents: 'none' }} />
          {/* p-heatmap-crop 干净裁切前景（右下浮出） */}
          <div style={{ position: 'absolute', right: 170, bottom: 200, width: 620, ...writeFade(frame, 40, true) }}>
            <Img src={staticFile('wuh-site-intro-v3/site/p-heatmap-crop-v1.png')} style={{ width: '100%', borderRadius: 8, border: `1px solid ${colors.hairline}`, opacity: 0.92 }} />
          </div>
          {/* ★DAT-01 活动合计快滚 */}
          <div style={{ position: 'absolute', left: 190, top: 150, ...writeFade(frame, 30) }}>
            <span style={{ fontFamily: fontFamilies.mono, fontSize: 30, color: colors.gold, fontVariantNumeric: 'tabular-nums' }}>{total.toLocaleString('en-US')}</span>
            <span style={{ fontFamily: fontFamilies.mono, fontSize: 17, color: colors.muted }}> 次活动 / 365 天 · 167 天有活动</span>
          </div>
          {/* 峰值格被墨点圈住（标识不滚） */}
          <div style={{ position: 'absolute', left: 1130, top: 300, opacity: writeFade(frame, 72).opacity }}>
            <div style={{ width: 64, height: 64, borderRadius: 32, border: `2px solid ${colors.seal}`, opacity: 0.9 }} />
            <span style={{ position: 'absolute', left: 76, top: 12, fontFamily: fontFamilies.mono, fontSize: 15, color: colors.paper, opacity: 0.85, whiteSpace: 'nowrap' }}>2026-07-24 · 1,263</span>
          </div>
        </ExpandWindow>
      )}
      <DustField act={6} count={8} seedBase="s36" />
      <PaperGrain opacity={0.05} />
      <Grade id="GR-01" />
      <Caption text="三百六十五天，逐格真实。" appearAt={14} />
    </AbsoluteFill>
  );
};

/** 展开态机位缓移峰值格（CM-06 微移）——rig 占位保持 cam 语义 */
function CameraRigProxy({ cam }: { cam: { scale: number; x: number; y: number; rot: number } }) {
  void cam;
  return null;
}

export default S36;
