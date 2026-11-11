/* S39 · Act 6 入院 · 局部帧 [0,60) · 60f · 绝对 5434–5494
 * V2 深空数据流重构（2026-11-11）：漫游起手——网站截图降级为证据快闪辉光小窗
 * （s01 首页卡，8–60 dolly 等比迎面掠过，50–60 退场让位下一卡）；页中字一行行
 * 自己写出来保留为窗内数据行 reveal（FN-50 cardReveal，20+10i 原节奏）；
 * 窗后琥珀辉光随「每一页，都在呼吸」60f 一息缓呼吸（原 click→最大化叙事
 * 改由 HUD 读数 01/05 驱动）。转场：入「切」，出「切」（漫游连击）。
 * 字幕安全窗：start≥12。
 * 尾帧：首页卡让位、/music 卡入场在即（交接态：漫游中·卡 1 过）。
 */
import type { FC } from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from 'remotion';
import { staticFile } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { cardReveal, FILM_COLORS2 } from '../motion-tokens';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 60;

const S39: FC = () => {
  const frame = useCurrentFrame();
  // dolly-in：首页证据窗迎面推近（等比 scale 0.5→1.18，镜头运动守恒）
  const dolly = interpolate(frame, [8, TOTAL], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const scale = interpolate(dolly, [0, 1], [0.5, 1.18]);
  // 证据快闪退场（≤2s 口径：尾 10f 让位 /music 卡）
  const exit = interpolate(frame, [50, TOTAL], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  // 「每一页，都在呼吸」：窗后辉光 60f 一息
  const breathe = 0.45 + 0.3 * Math.sin((frame / 60) * Math.PI * 2);
  const rows = [0, 1, 2];

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s39v2" stars={56} grid horizon />

      {/* 呼吸辉光晕（窗后一息） */}
      <div
        style={{
          position: 'absolute',
          left: 400,
          top: -130,
          width: 1120,
          height: 1120,
          borderRadius: 560,
          background: `radial-gradient(circle, rgba(212,163,115,0.14), rgba(212,163,115,0) 65%)`,
          opacity: breathe,
          pointerEvents: 'none',
        }}
      />

      {/* 证据快闪：首页卡（S01 卡面）迎面推近 */}
      <div
        style={{
          position: 'absolute',
          left: 560,
          top: 170,
          width: 800,
          height: 520,
          borderRadius: 10,
          overflow: 'hidden',
          border: `1px solid ${FILM_COLORS2.dataDim}`,
          boxShadow: `0 0 44px rgba(212,163,115,0.22), 0 24px 60px rgba(0,0,0,0.65)`,
          transform: `scale(${scale})`,
          opacity: interpolate(dolly, [0, 0.2], [0.3, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) * exit,
          zIndex: 28,
        }}
      >
        <Img src={staticFile('wuh-site-intro-v3/site/s01-home-hero-v1.png')} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 25%' }} />
        <AbsoluteFill style={{ background: FILM_COLORS2.space, opacity: 0.18 }} />
        {/* FN-50 页中字 reveal（0→35% mask 扫过，20+10i 原节奏）→ 窗内数据行 */}
        {rows.map((r) => {
          const { mask, ink } = cardReveal(frame, 20 + r * 10, r);
          return (
            <div key={r} style={{ position: 'absolute', left: 60, top: 340 + r * 50, width: 640, height: 30, overflow: 'hidden' }}>
              <div style={{ width: `${mask}%`, height: 14, background: FILM_COLORS2.data, opacity: ink * 0.55, boxShadow: `0 0 8px rgba(212,163,115,0.3)` }} />
            </div>
          );
        })}
        <span style={{ position: 'absolute', left: 60, bottom: 30, fontFamily: fontFamilies.mono, fontSize: 15, color: FILM_COLORS2.paperWhite, opacity: 0.7, letterSpacing: '0.2em' }}>首页 · HOME</span>
      </div>

      <HudChrome label="wuh.site · ROAM" readout="01/05 · /" />
      <Grade2 id="GR2-06" />
      <Caption text="每一页，都在呼吸。" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S39;
