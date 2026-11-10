/* S31 · Act 6 入院 · 局部帧 [0,96) · 96f · 绝对 4634–4730
 *
 * 生成式封面：光标移 02→点击→最大化（10–24）；S03 文章页打底 + WIN-01；
 * ★DAT-05 CHART-DRAW 山峦/涟漪双曲线逐段描边（24–64，每段 2 拍×2）；
 * p-post-cover-165 封面样本前景浮出（36–56）；大标题 write-fade；
 * 「wuh.site」落款如钤 66=拍235 落定即凝住；收束（82–96），lit={01,02}→03。
 * 转场：入「切」，出「切」。字幕安全窗：start≥12、end≤84。
 */
import type { FC } from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from 'remotion';
import { staticFile } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, inkDraw, writeFade } from '../../../brand/motion';
import { ConsoleCursor, ConsolePanel } from '../components/ConsolePanel';
import { ExpandWindow } from '../components/ExpandWindow';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const TOTAL = 96;
const CLICK_AT = 10;

const S31: FC = () => {
  const frame = useCurrentFrame();
  const expanded = frame >= CLICK_AT + 2 && frame < TOTAL - 14;
  const tailPanel = frame >= TOTAL - 14;
  // 双曲线逐段描边（24–64：山峦 24–44，涟漪 44–64；真长度驱动，不再猜 1800/1600）
  const mountain = interpolate(frame, [24, 44], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const ripple = interpolate(frame, [44, 64], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const RIDGE_D = 'M 240 700 Q 560 420 880 640 T 1680 560';
  const RIPPLE_D = 'M 240 760 Q 620 830 980 760 T 1680 780';
  const coverIn = writeFade(frame, 36, true);
  const cam = { scale: 1.04, x: 0, y: 0, rot: 0 };

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <CameraRigMount cam={cam} />
      {!expanded ? (
        <>
          <ConsolePanel lit={1} active={2} panelIn={1} />
          <ConsoleCursor active={2} moveProgress={interpolate(frame, [0, CLICK_AT], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} clickRipple={frame >= CLICK_AT && frame < CLICK_AT + 12 ? (frame - CLICK_AT) / 12 : 0} />
          {tailPanel ? <ConsolePanel lit={2} active={3} panelIn={1} /> : null}
          {tailPanel ? <ConsoleCursor active={3} moveProgress={interpolate(frame, [TOTAL - 14, TOTAL], [0, 0.6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} /> : null}
        </>
      ) : (
        <ExpandWindow startAt={CLICK_AT} total={TOTAL} block={2} asset="wuh-site-intro-v3/site/s03-post-165-v1.png" dim={0.3} objectPos="center 20%">
          {/* 山峦曲线（SVG 描边生长） */}
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <path d={RIDGE_D} fill="none" stroke={colors.ink} strokeWidth={3} {...inkDraw(mountain, RIDGE_D)} opacity={0.85} />
            <path d={RIPPLE_D} fill="none" stroke={colors.ink} strokeWidth={2} {...inkDraw(ripple, RIPPLE_D)} opacity={0.55} />
          </svg>
          {/* p-post-cover-165 封面样本前景浮出 */}
          <div style={{ position: 'absolute', right: 190, top: 300, width: 560, ...coverIn }}>
            <Img src={staticFile('wuh-site-intro-v3/site/p-post-cover-165-v1.png')} style={{ width: '100%', borderRadius: 8, border: `1px solid ${colors.hairline}`, boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }} />
          </div>
          {/* 大标题 write-fade */}
          <div style={{ position: 'absolute', left: 190, top: 170, ...writeFade(frame, 30) }}>
            <span style={{ fontFamily: fontFamilies.serif, fontSize: 62, color: colors.paper, opacity: 0.9 }}>每一篇，都有一幅只属于它的山水。</span>
          </div>
          {/* 「wuh.site」落款如钤（66=拍235，落定即凝住） */}
          <div style={{ position: 'absolute', right: 220, bottom: 130, ...sealIn(frame) }}>
            <span style={{ fontFamily: fontFamilies.serif, fontSize: 34, color: colors.seal, letterSpacing: '0.2em', border: `2px solid ${colors.seal}`, padding: '8px 22px', opacity: 0.9 }}>wuh.site</span>
          </div>
        </ExpandWindow>
      )}
      <DustField act={6} count={10} seedBase="s31" />
      <PaperGrain opacity={0.05} />
      <Grade id="GR-01" />
      <Caption text="每一篇，都有一幅只属于它的山水。" appearAt={14} />
    </AbsoluteFill>
  );
};

const sealIn = (frame: number) => writeFade(frame, 66);
function CameraRigMount({ cam }: { cam: { scale: number; x: number; y: number; rot: number } }) {
  // 占位：本镜展开态机位驻定，无需 rig；保留 cam 语义（CM-01 驻定）
  void cam;
  return null;
}

export default S31;
