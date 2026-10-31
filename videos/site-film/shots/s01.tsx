/* 镜 01 · Act 1 序章 · 全局帧 [0,220) · 220f */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { CURVES } from '../motion-tokens';
import { CameraRig, ParallaxLayer } from '../components/CameraRig';
import { DustField } from '../components/DustField';

const fade = (f: number, at: number) =>
  interpolate(f, [at, at + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/* 光尘书桌 · 无字幕留白（原 ShotDustDesk；localStart 0，幕局部 [0,220) = 镜局部 [0,220)，断点 [0,120]/24/45/52 全在镜窗内无平移：
   镜头缓推 120f 后钳于 1.02、桌面三件套全亮静持，光尘漂浮与光标闪烁持续；镜尾帧交接态：尘光书桌静持 + 光尘漂浮（无字幕留白） */
const ShotDustDesk: FC = () => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 120], [1, 1.02], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const cam = { scale, x: 0, y: 0, rot: 0 };
  return (
    <AbsoluteFill>
      <CameraRig cam={cam}>
        <ParallaxLayer depth={0.4} cam={cam} blurBase={4}>
          <DustField act={1} count={40} />
        </ParallaxLayer>
        <ParallaxLayer depth={1} cam={cam}>
          <DustField act={1} count={30} />
          <div style={{ position: 'absolute', bottom: 0, left: 340, width: 720, height: 190, background: colors.bgLift, borderTop: `2px solid ${colors.muted}`, opacity: fade(frame, 24) }} />
          <div style={{ position: 'absolute', bottom: 190, left: 900, width: 10, height: 80, background: colors.muted, opacity: fade(frame, 45) }} />
          <div style={{ position: 'absolute', bottom: 268, left: 892, width: 26, height: 12, background: colors.terminalBg, opacity: fade(frame, 52) }} />
          <div style={{ position: 'absolute', right: 320, top: 300, width: 6, height: 6, borderRadius: 3, background: colors.paper, opacity: 0.5 + 0.3 * Math.sin(frame / 14) }} />
        </ParallaxLayer>
      </CameraRig>
    </AbsoluteFill>
  );
};

export default ShotDustDesk;
