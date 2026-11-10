/* S01 · Act 1 墨点 · 局部帧 [0,150) · 150f · 绝对 0–150
 *
 * 题记先落：暖黑纸底上一扇朱红细窗框点亮（WIN-01 入框 0–12），窗内 S01 首页 Hero
 * 真实截图显影（scale 1.04→1，12–36）——暗色暖棕「屋内之眼」第一次入画；
 * p-hero-wordmark 字层自窗内浮至前景（36–90），落笔微光沿笔画游走；
 * 题记即字幕（同文同层，不设 Caption）。
 * 转场：入「切」，出「墨洇」（装配层 ShotShell 处理遮罩，镜首从交接态起步）。
 * 尾帧：题记冻帧，窗内 Hero 暗亮稳定，笔尖余光一点未干。
 */
import type { FC } from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from 'remotion';
import { staticFile } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, glowPulse, writeFade } from '../../../brand/motion';
import { FILM_COLORS, frameIn, lightSweep } from '../motion-tokens';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const TOTAL = 150;

/** FN-20 落笔微光：一粒暖金光点沿题记基线游走（36–90 走完一遍，之后停在尾端呼吸） */
const penGlowAt = (frame: number): { x: number; opacity: number } => {
  const t = interpolate(frame, [36, 90], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const x = interpolate(t, [0, 1], [300, 1180]);
  const tail = frame >= 90;
  const opacity = tail ? interpolate(frame, [90, 100], [0.9, 0.55], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0.9;
  return { x, opacity };
};

const S01: FC = () => {
  const frame = useCurrentFrame();
  const win = frameIn(frame, 0);
  const sweep = lightSweep(frame, 36, 20);
  const wordmark = writeFade(frame, 36, true);
  const glow = penGlowAt(frame);
  const heroSteady = interpolate(frame, [90, 110], [0.62, 0.78], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: FILM_COLORS.nearBlack }}>
      {/* 暖黑纸底（GR-01 基座由 Grade 叠加） */}
      <AbsoluteFill style={{ background: colors.bg }} />
      <DustField act={1} count={30} seedBase="s01" />

      {/* 朱红细窗框 + 窗内 S01 Hero（WIN-01 入框；素材像素只做等比 cover + 入框 scale） */}
      <div style={{ position: 'absolute', left: 280, top: 120, right: 280, bottom: 150, ...win }}>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: colors.bg }}>
          <Img
            src={staticFile('wuh-site-intro-v3/site/s01-home-hero-v1.png')}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%', opacity: heroSteady, filter: 'saturate(0.94)' }}
          />
          {/* WIN-02 点亮 sweep：亮带掠过一次 */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: 240,
              left: sweep.sweepX,
              background: `linear-gradient(90deg, transparent, ${FILM_COLORS.goldMist}, transparent)`,
              mixBlendMode: 'screen',
              opacity: sweep.sweepOpacity,
            }}
          />
        </div>
        {/* 朱红细框（窗框本体，压在图上） */}
        <div style={{ position: 'absolute', inset: 0, border: `1px solid ${colors.seal}`, opacity: 0.8 }} />
      </div>

      {/* p-hero-wordmark 字层浮至前景（题记即字幕，同文同层 zIndex 30） */}
      <div
        style={{
          position: 'absolute',
          left: 300,
          right: 300,
          top: 560,
          zIndex: 30,
          ...wordmark,
        }}
      >
        <Img
          src={staticFile('wuh-site-intro-v3/site/p-hero-wordmark-v1.png')}
          style={{ width: '100%', objectFit: 'contain', mixBlendMode: 'screen' }}
        />
        {/* 笔尖余光：FN-20 游走光点 + 冻帧呼吸 */}
        <div
          style={{
            position: 'absolute',
            left: glow.x - 900,
            top: 60,
            width: 14,
            height: 14,
            borderRadius: 7,
            background: FILM_COLORS.goldMist,
            boxShadow: `0 0 18px 6px rgba(245,233,200,0.55)`,
            opacity: glow.opacity * (frame >= 90 ? glowPulse(frame, 0.5, 60).opacity : 1),
          }}
        />
      </div>

      <PaperGrain opacity={0.06} />
      <Grade id="GR-01" />
    </AbsoluteFill>
  );
};

export default S01;
