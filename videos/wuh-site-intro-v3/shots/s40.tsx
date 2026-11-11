/* S40 · Act 6 入院 · 局部帧 [0,60) · 60f · 绝对 5494–5554
 * V2 深空数据流重构（2026-11-11）：漫游连击 2/5——/music 卡（S05 卡面）降级为
 * 证据快闪辉光小窗，侧向横移掠过（traveling，2–60 平移原窗口；rotateY 依 V2 WIN
 * 纪律退役，改为同窗轻 2D 摆动）；页字 reveal 保留为窗内数据行（10+10i 原节奏）；
 * 漫游进度改由 HUD 读数 02/05 驱动。无字幕；入出皆切。
 * 尾帧：/music 卡过（交接态：漫游中·卡 2 过）。
 */
import type { FC } from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from 'remotion';
import { staticFile } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { cardReveal, FILM_COLORS2 } from '../motion-tokens';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 60;

const S40: FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [2, TOTAL], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const fade = interpolate(p, [0, 0.15, 0.85, 1], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const transform = `translateX(${interpolate(p, [0, 1], [420, -560])}px) rotate(${interpolate(p, [0, 1], [1.6, -1.6])}deg)`;

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep, overflow: 'hidden' }}>
      <DeepSpace seed="s40v2" stars={52} grid horizon />

      {/* 证据快闪：/music 卡侧向掠过 */}
      <div
        style={{
          position: 'absolute',
          left: 520,
          top: 190,
          width: 880,
          height: 560,
          borderRadius: 10,
          overflow: 'hidden',
          border: `1px solid ${FILM_COLORS2.dataDim}`,
          boxShadow: `0 0 44px rgba(212,163,115,0.22), 0 24px 60px rgba(0,0,0,0.65)`,
          transform,
          opacity: fade,
          zIndex: 28,
        }}
      >
        <Img src={staticFile('wuh-site-intro-v3/site/s05-music-v1.png')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <AbsoluteFill style={{ background: FILM_COLORS2.space, opacity: 0.2 }} />
        {[0, 1, 2].map((r) => {
          const { mask, ink } = cardReveal(frame, 10 + r * 10, r);
          return (
            <div key={r} style={{ position: 'absolute', left: 60, top: 380 + r * 46, width: 640, height: 26, overflow: 'hidden' }}>
              <div style={{ width: `${mask}%`, height: 13, background: FILM_COLORS2.data, opacity: ink * 0.5, boxShadow: `0 0 8px rgba(212,163,115,0.3)` }} />
            </div>
          );
        })}
        <span style={{ position: 'absolute', left: 60, bottom: 26, fontFamily: fontFamilies.mono, fontSize: 15, color: FILM_COLORS2.paperWhite, opacity: 0.7, letterSpacing: '0.2em' }}>音乐 · /MUSIC</span>
      </div>

      <HudChrome label="wuh.site · ROAM" readout="02/05 · /MUSIC" />
      <Grade2 id="GR2-06" />
    </AbsoluteFill>
  );
};

export default S40;
