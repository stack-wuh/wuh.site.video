/* S26 · Act 5 灯亮 · 局部帧 [0,132) · 132f · 绝对 3858–3990
 *
 * 迁入节拍：苔痕柱顶上方展开新站首页纸面骨架（Remotion 重绘非截图），
 * 历史文章卡成队从左侧飞入内容栏（2026-05-01 批量入库），半拍一卡（10f stagger）
 * 落位带极轻压实感；只给密度、不给计数；侧向跟移·焦点锁入位点。
 * 转场：入「切」，出「切」。无字幕（迁入节拍）。
 * 尾帧：文章列表铺满首屏。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { cardFly, type Pose } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const TOTAL = 132;
const CARDS = 9;

const S26: FC = () => {
  const frame = useCurrentFrame();
  const cam = {
    scale: 1.04,
    x: interpolate(frame, [0, TOTAL], [50, -40], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    y: 0,
    rot: 0,
  };

  return (
    <AbsoluteFill style={{ background: colors.paper }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DustField act={5} count={20} seedBase="s26" />

          {/* 新站首页纸面骨架（展开 0–22） */}
          <div style={{ position: 'absolute', left: 150, top: 70, right: 150, bottom: 70, borderRadius: 6, background: colors.paper, border: `1px solid ${colors.paperMuted}`, opacity: interpolate(frame, [0, 22], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut }) }}>
            <div style={{ position: 'absolute', left: 60, top: 40, width: 420, height: 30, background: colors.ink, opacity: 0.32 }} />
            <div style={{ position: 'absolute', left: 60, top: 90, width: 300, height: 12, background: colors.muted, opacity: 0.25 }} />
            <div style={{ position: 'absolute', left: 60, right: 60, top: 130, height: 1, background: colors.muted, opacity: 0.4 }} />
            {/* 内容栏：文章卡成队飞入（22 起，半拍一卡，压实感） */}
            <div style={{ position: 'absolute', left: 70, top: 170, width: 1100 }}>
              {Array.from({ length: CARDS }).map((_, i) => {
                const from: Pose = { x: -420, y: -20 + (i % 3) * 10, rot: -4, scale: 0.96 };
                const to: Pose = { x: 0, y: i * 74, rot: 0, scale: 1 };
                const style = cardFly(frame, 22 + i * 10, 22, from, to);
                return (
                  <div key={i} style={{ position: 'absolute', left: 0, top: 0, width: 1000, height: 60, ...style }}>
                    <div style={{ position: 'absolute', inset: 0, borderRadius: 4, background: colors.paperDeep, border: `1px solid ${colors.paperMuted}`, opacity: 0.95 }} />
                    <div style={{ position: 'absolute', left: 20, top: 14, width: 380 + (i % 3) * 90, height: 13, background: colors.ink, opacity: 0.36 }} />
                    <div style={{ position: 'absolute', left: 20, top: 38, width: 220, height: 9, background: colors.muted, opacity: 0.25 }} />
                    <span style={{ position: 'absolute', right: 18, top: 16, fontFamily: fontFamilies.mono, fontSize: 14, color: colors.muted, opacity: 0.7 }}>05-0{(i % 8) + 1}</span>
                  </div>
                );
              })}
            </div>
            {/* 侧栏（虚化背景柱：苔痕余韵） */}
            <div style={{ position: 'absolute', right: 60, top: 170, width: 380, height: 620, filter: 'blur(4px)', opacity: 0.35 }}>
              <div style={{ position: 'absolute', left: 60, top: 200, width: 200, height: 90, borderRadius: 45, background: colors.ink, opacity: 0.25 }} />
              <div style={{ position: 'absolute', left: 90, top: 340, width: 220, height: 100, borderRadius: 50, background: colors.ink, opacity: 0.4 }} />
            </div>
          </div>
        </AbsoluteFill>
      </CameraRig>
      <PaperGrain opacity={0.07} />
      <Grade id="GR-02" />
    </AbsoluteFill>
  );
};

export default S26;
