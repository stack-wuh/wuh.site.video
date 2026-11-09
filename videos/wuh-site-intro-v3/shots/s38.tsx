/* S38 · Act 6 入院 · 局部帧 [0,88) · 88f · 绝对 5346–5434
 *
 * 设计系统换装：光标移 07→点击→最大化（0–18）；S10 设计系统页打底 + WIN-01
 * 分屏左右对照；酒红/素雅两套主题即时插值换装（18–58，两级各卡一拍）；
 * 100–900 全阶色卡带铺开（stagger）；换装瞬间微甩横移一次；「试墨」色块被
 * 墨点光标拖拽游走（58–72）；收束（74–88）→08。转场：入「切」，出「切」。
 * 字幕安全窗：start≥12、end≤76。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { ConsoleCursor, ConsolePanel } from '../components/ConsolePanel';
import { ExpandWindow } from '../components/ExpandWindow';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { FILM_COLORS } from '../motion-tokens';
import { PaperGrain } from '../components/PaperGrain';

const TOTAL = 88;
/** 100–900 全阶色卡（酒红系 → 素雅系插值取样） */
const WINE = ['#f7e8e8', '#eec7c7', '#dd9e9e', '#c47070', '#a44e4e', '#833b3b', '#5e2c2c', '#3e1e1e', '#261313'];
const CALM = ['#f2efe8', '#dcd6c8', '#c2bbab', '#a49d8d', '#877f6e', '#6a6353', '#4e493d', '#332f28', '#211f1a'];

const S38: FC = () => {
  const frame = useCurrentFrame();
  const expanded = frame >= 2 && frame < TOTAL - 14;
  const tailPanel = frame >= TOTAL - 14;
  // 换装插值（18–58：两级各卡一拍 20f）
  const swap = interpolate(frame, [18, 38, 58], [0, 0.5, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  // 微甩横移（换装瞬间一次）
  const whip = interpolate(frame, [18, 24, 32], [0, 18, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cam = { scale: 1.04, x: whip, y: 0, rot: 0 };
  // 试墨色块拖拽游走（58–72）
  const dragX = interpolate(frame, [58, 72], [420, 900], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      {!expanded ? (
        <>
          <ConsolePanel lit={7} active={7} panelIn={1} />
          <ConsoleCursor active={7} moveProgress={interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} />
          {tailPanel ? <ConsolePanel lit={8} active={8} panelIn={1} /> : null}
          {tailPanel ? <ConsoleCursor active={8} moveProgress={0.5} /> : null}
        </>
      ) : (
        <ExpandWindow startAt={2} total={TOTAL} block={7} asset={null} dim={0} chrome>
          <AbsoluteFill style={{ background: FILM_COLORS.nearBlack }} />
          {/* 分屏左右对照：左酒红 / 右素雅（换装前）→ 换装后整体素雅 */}
          <div style={{ position: 'absolute', left: 0, top: 140, bottom: 320, width: 960, background: `linear-gradient(180deg, ${WINE[4]}, ${WINE[6]})`, opacity: 1 - swap * 0.75 }} />
          <div style={{ position: 'absolute', right: 0, top: 140, bottom: 320, width: 960, background: `linear-gradient(180deg, ${CALM[3]}, ${CALM[5]})`, opacity: 0.35 + swap * 0.65 }} />
          {/* 换装标题 */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 190, textAlign: 'center' }}>
            <span style={{ fontFamily: fontFamilies.serif, fontSize: 46, color: colors.paper, opacity: 0.92 }}>酒红 ⟷ 素雅</span>
          </div>
          {/* 100–900 全阶色卡带铺开（stagger） */}
          <div style={{ position: 'absolute', left: 240, right: 240, top: 420, display: 'flex', gap: 18 }}>
            {WINE.map((c, i) => {
              const rise = interpolate(frame, [22 + i * 3, 34 + i * 3], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
              const target = CALM[i];
              return (
                <div key={i} style={{ flex: 1 }}>
                  <div style={{ height: 160 - Math.abs(i - 4) * 8, borderRadius: 4, background: c, opacity: rise * (1 - swap) + target && rise ? rise : rise, transform: `scaleY(${rise})`, transformOrigin: 'bottom', backgroundColor: swap > 0.5 ? target : c, transition: 'none' }} />
                  <div style={{ textAlign: 'center', fontFamily: fontFamilies.mono, fontSize: 14, color: colors.muted, marginTop: 8, opacity: rise * 0.8 }}>{(i + 1) * 100}</div>
                </div>
              );
            })}
          </div>
          {/* 「试墨」色块被墨点光标拖拽游走（58–72） */}
          <div style={{ position: 'absolute', left: dragX, top: 640, width: 110, height: 44, borderRadius: 22, background: colors.seal, opacity: 0.9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: fontFamilies.mono, fontSize: 16, color: colors.paper, letterSpacing: '0.2em' }}>试墨</span>
          </div>
        </ExpandWindow>
      )}
      <DustField act={6} count={8} seedBase="s38" />
      <PaperGrain opacity={0.05} />
      <Grade id="GR-01" />
      <Caption text="换一种墨色，换一种心情。" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S38;
