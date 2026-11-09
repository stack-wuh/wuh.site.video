/* S12 · Act 3 第一行 · 局部帧 [0,90) · 90f · 绝对 1872–1962
 *
 * 入页：纸缘翻入一张灰调年度总结纸页（pageFlip 承接 0–14），页眉角标 2022-02-08，
 * 正文只留灰度行块（不伪造原文），整页蒙一层薄灰；落定后缓慢下摇 4%；
 * GR-05 灰调 90% + 页眉一点暖光。
 * 转场：入「纸翻」（18f），出「切」。无字幕（入页）。
 * 尾帧：灰调纸页整版入画静住。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { pageFlip } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const TOTAL = 90;

const S12: FC = () => {
  const frame = useCurrentFrame();
  const drop = interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const cam = {
    scale: 1.04,
    x: 0,
    y: interpolate(frame, [18, TOTAL], [0, 40], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    rot: 0,
  };

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DustField act={3} count={14} seedBase="s12" />
          {/* 灰调年度总结纸页（整版） */}
          <div style={{ position: 'absolute', left: 170, top: 90, right: 170, bottom: 90, borderRadius: 6, background: colors.paper, border: `1px solid ${colors.paperMuted}`, opacity: drop }}>
            {/* 页眉：角标日期（标识） + 一点暖光 */}
            <div style={{ position: 'absolute', left: 50, top: 40, display: 'flex', alignItems: 'center', gap: 20 }}>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 20, color: colors.muted, fontVariantNumeric: 'tabular-nums' }}>2022-02-08</span>
              <span style={{ fontFamily: fontFamilies.serif, fontSize: 26, color: colors.ink, opacity: 0.7 }}>2022 年度总结</span>
              <div style={{ width: 60, height: 3, background: colors.gold, opacity: 0.5 }} />
            </div>
            <div style={{ position: 'absolute', left: 50, right: 50, top: 110, height: 1, background: colors.muted, opacity: 0.4 }} />
            {/* 灰度行块（不伪造原文） */}
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} style={{ position: 'absolute', left: 50, top: 150 + i * 74, width: i % 3 === 2 ? 900 : 1340 - (i % 2) * 180, height: 22, background: colors.muted, opacity: 0.2 }} />
            ))}
          </div>
        </AbsoluteFill>
      </CameraRig>
      {/* 承接翻入（0–14 遮罩纸缘） */}
      {frame < 15 ? <AbsoluteFill style={{ pointerEvents: 'none', background: colors.paper, clipPath: `inset(0 0 ${(1 - drop) * 100}% 0)` }} /> : null}
      <PaperGrain opacity={0.07} />
      <Grade id="GR-05" />
    </AbsoluteFill>
  );
};

export default S12;
