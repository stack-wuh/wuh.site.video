/* S04 · Act 1 墨点 · 局部帧 [0,84) · 84f · 绝对 498–582
 *
 * 「写作即提 Issue」的起点被看见：首屏一侧开启一扇小窗（WIN-01 入框点亮 0–20），
 * 窗内 p-issues-cms（blog 仓库 Issue 列表真实截图）显影；文章卡一张张沿弧线
 * 飞入窗内内容栏落位（22–72，半拍一卡）；CM-07 侧向跟移 + rack focus（首屏→窗内）。
 * 转场：入「切」，出「切」。无字幕（呼吸镜）。
 * 尾帧：卡片队列落定成整齐列表；末 12f 呼吸。
 */
import type { FC } from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from 'remotion';
import { staticFile } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { cardFly, FILM_COLORS, frameIn, type Pose } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const TOTAL = 84;

/** 飞入内容栏的文章卡（5 张，半拍 10f 一卡，弧线 Pose 插值） */
const FLY_CARDS = [0, 1, 2, 3, 4].map((i) => i);

const S04: FC = () => {
  const frame = useCurrentFrame();
  const win = frameIn(frame, 0);
  // CM-07 侧向跟移：机位自左向右缓移（首屏→窗内），rack focus 用窗内亮度/清晰度表达
  const cam = {
    scale: 1.04,
    x: interpolate(frame, [0, TOTAL], [40, -30], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    y: 0,
    rot: 0,
  };
  const rack = interpolate(frame, [10, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });

  return (
    <AbsoluteFill style={{ background: colors.paper }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DustField act={1} count={18} seedBase="s04" />

          {/* 首屏残影（承接 s03 尾帧：旧站首屏全亮）——rack focus 后退为虚化背景 */}
          <div style={{ position: 'absolute', left: 60, top: 60, right: 60, bottom: 60, filter: `blur(${(1 - rack) * 0.5 + 3}px)`, opacity: 0.5 - rack * 0.2 }}>
            <div style={{ position: 'absolute', left: 60, top: 56, width: 1680, height: 30, border: `1px solid ${colors.muted}`, opacity: 0.16 }} />
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} style={{ position: 'absolute', left: 80, top: 130 + i * 90, width: 900 - (i % 3) * 120, height: 40, background: colors.muted, opacity: 0.1, borderRadius: 3 }} />
            ))}
          </div>

          {/* WIN-01 小窗：p-issues-cms 物证窗（右侧） */}
          <div style={{ position: 'absolute', right: 150, top: 140, width: 760, height: 620, ...win }}>
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: colors.bg, filter: `blur(${(1 - rack) * 2}px)` }}>
              <Img
                src={staticFile('wuh-site-intro-v3/site/gh02-issues-blog-v1.png')}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: colors.paper, opacity: 0.08 }} />
            </div>
            <div style={{ position: 'absolute', inset: 0, border: `1px solid ${colors.seal}`, opacity: 0.75 }} />
            {/* 窗内内容栏：文章卡弧线飞入落位 */}
            <div style={{ position: 'absolute', left: 30, top: 90, width: 400 }}>
              {FLY_CARDS.map((i) => {
                const from: Pose = { x: -340, y: -60 + i * 14, rot: -7, scale: 0.9 };
                const to: Pose = { x: 0, y: i * 78, rot: 0, scale: 1 };
                return (
                  <div key={i} style={{ position: 'absolute', left: 0, top: 0, width: 400, height: 64, ...cardFly(frame, 22 + i * 10, 26, from, to) }}>
                    <div style={{ position: 'absolute', inset: 0, borderRadius: 4, background: colors.paper, border: `1px solid ${colors.paperMuted}`, opacity: 0.94 }} />
                    <div style={{ position: 'absolute', left: 16, top: 14, width: 250, height: 12, background: colors.ink, opacity: 0.4 }} />
                    <div style={{ position: 'absolute', left: 16, top: 36, width: 170, height: 8, background: colors.muted, opacity: 0.3 }} />
                    <span style={{ position: 'absolute', right: 14, top: 14, fontFamily: fontFamilies.mono, fontSize: 13, color: colors.muted, opacity: 0.7 }}>#{17 + i * 9}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* rack focus 提示：焦点带自左向右（极淡） */}
          <div
            style={{
              position: 'absolute',
              left: interpolate(frame, [10, 30], [0, 900], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
              top: 0,
              bottom: 0,
              width: 900,
              background: `radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.1))`,
              opacity: 0.5,
              pointerEvents: 'none',
            }}
          />
          {/* 末 12f 呼吸（RH-02） */}
          <AbsoluteFill style={{ background: FILM_COLORS.goldMist, mixBlendMode: 'soft-light', opacity: interpolate(frame, [72, 84], [0, 0.05], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), pointerEvents: 'none' }} />
        </AbsoluteFill>
      </CameraRig>
      <PaperGrain opacity={0.06} />
      <Grade id="GR-02" />
    </AbsoluteFill>
  );
};

export default S04;
