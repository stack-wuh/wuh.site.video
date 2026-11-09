/* S37 · Act 6 入院 · 局部帧 [0,78) · 78f · 绝对 5268–5346
 *
 * 热力图与足迹同框（06 展开态下半）：06 展开内下移（0–20）；380px 足迹地图
 * （S09）浮入同框（WIN-01）；两点亮起——杨梅坑 32=绝对 5300=拍265、
 * 梧桐山 52=绝对 5320=拍266（与镜 23 同源回响，涟漪参数同族）；
 * rack 自热力图移到足迹图；收束（62–78）→07。转场：入「切」，出「切」。
 * 字幕安全窗：start≥12、end≤66。
 */
import type { FC } from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from 'remotion';
import { staticFile } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { ConsoleCursor, ConsolePanel } from '../components/ConsolePanel';
import { ExpandWindow } from '../components/ExpandWindow';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { frameIn } from '../motion-tokens';
import { PaperGrain } from '../components/PaperGrain';

const TOTAL = 78;
const PIN_A = { x: 940, y: 700, land: 32, label: '杨梅坑 · 2025-08' }; // = 拍265
const PIN_B = { x: 640, y: 560, land: 52, label: '梧桐山 · 2025-09' }; // = 拍266

/** 落点亮起（涟漪参数与镜 23 同族、更紧凑） */
const EchoPin: FC<{ p: { x: number; y: number; land: number; label: string }; frame: number }> = ({ p, frame }) => {
  const on = frame >= p.land;
  const r1 = interpolate(frame, [p.land, p.land + 30], [0, 90], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return on ? (
    <div>
      <div style={{ position: 'absolute', left: p.x - 7, top: p.y - 7, width: 14, height: 14, borderRadius: 7, background: colors.gold, boxShadow: `0 0 10px 3px rgba(245,233,200,0.45)` }} />
      {r1 > 0 ? <div style={{ position: 'absolute', left: p.x - r1, top: p.y - r1 / 2, width: r1 * 2, height: r1, borderRadius: r1, border: `1.2px solid ${colors.gold}`, opacity: interpolate(frame, [p.land, p.land + 10, p.land + 30], [0, 0.5, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }} /> : null}
      <span style={{ position: 'absolute', left: p.x + 14, top: p.y - 26, fontFamily: fontFamilies.mono, fontSize: 13, color: colors.paper, opacity: 0.85, whiteSpace: 'nowrap' }}>{p.label}</span>
    </div>
  ) : null;
};

const S37: FC = () => {
  const frame = useCurrentFrame();
  const expanded = frame >= 2 && frame < TOTAL - 16;
  const tailPanel = frame >= TOTAL - 16;
  const win = frameIn(frame, 4);
  const cam = { scale: 1.04, x: 0, y: interpolate(frame, [0, 20], [0, 30], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }), rot: 0 };

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      {!expanded ? (
        <>
          <ConsolePanel lit={6} active={6} panelIn={1} />
          <ConsoleCursor active={6} moveProgress={1} />
          {tailPanel ? <ConsolePanel lit={6} active={7} panelIn={1} /> : null}
          {tailPanel ? <ConsoleCursor active={7} moveProgress={interpolate(frame, [TOTAL - 16, TOTAL], [0, 0.6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} /> : null}
        </>
      ) : (
        <ExpandWindow startAt={0} total={TOTAL} block={6} asset={null} dim={0} chrome>
          {/* 06 展开态内下移：热力图残影在上，足迹地图浮入同框 */}
          <div style={{ position: 'absolute', left: 190, top: interpolate(frame, [0, 20], [120, -40]), width: 720, height: 420, opacity: interpolate(frame, [0, 20], [0.7, 0.25], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), overflow: 'hidden', borderRadius: 8, border: `1px solid ${colors.hairline}` }}>
            <Img src={staticFile('wuh-site-intro-v3/site/p-heatmap-crop-v1.png')} style={{ width: '100%', objectFit: 'cover' }} />
          </div>
          {/* 380px 足迹地图（S09 打底，WIN-01 浮入） */}
          <div style={{ position: 'absolute', left: 1020, top: 360, width: 380, height: 380, ...win }}>
            <Img src={staticFile('wuh-site-intro-v3/site/s09-footprint-v1.png')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: colors.bg, opacity: 0.22 }} />
            <EchoPin p={PIN_A} frame={frame} />
            <EchoPin p={PIN_B} frame={frame} />
            <div style={{ position: 'absolute', inset: 0, border: `1px solid ${colors.seal}`, opacity: 0.7 }} />
            <span style={{ position: 'absolute', left: 14, top: 10, fontFamily: fontFamilies.mono, fontSize: 13, color: colors.paper, opacity: 0.8, letterSpacing: '0.2em' }}>足 迹</span>
          </div>
          {/* rack 提示：rack 自热力图移到足迹图 */}
          <AbsoluteFill style={{ background: `radial-gradient(ellipse at 74% 58%, transparent 40%, rgba(0,0,0,0.28))`, opacity: interpolate(frame, [20, 40], [0, 0.8], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), pointerEvents: 'none' }} />
        </ExpandWindow>
      )}
      <DustField act={6} count={8} seedBase="s37" />
      <PaperGrain opacity={0.05} />
      <Grade id="GR-04" />
      <Caption text="此乐何极~" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S37;
