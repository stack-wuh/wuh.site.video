/* 镜 07 · Act 2 起步与沉默 · 全局帧 [1160,1380) · 220f */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, GRADES, dyeDrain } from '../motion-tokens';

const serif = fontFamilies.serif;

const fade = (f: number, at: number) =>
  interpolate(f, [at, at + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/* 骤暗（原 ShotBlackout；【坐标保真 + 冻结事实】原断点 die [10,130]、dyeDrain 延迟 ≤110（+40 收完）、
   fade [90,104] 以幕局部帧求值，而镜窗为幕局部 [460,680) → 原片本镜入画时全部断点早已越尽，
   220f 全程冻结于终态：14 方块 die=0.04 近乎隐没且灰阶定格 0.85、「然后，安静了。」全显——
   此为已交付成片的真实渲染。本镜 frame = useCurrentFrame() + 460（幕局部基准）逐帧复现冻结交付态；
   骤暗动画重放属内容变更，另立 change。 */
const ShotBlackout: FC = () => {
  const frame = useCurrentFrame() + 460; // 幕局部帧保真（见头注释）
  const die = interpolate(frame, [10, 130], [0.6, 0.04], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  return (
    <AbsoluteFill style={{ filter: 'saturate(0.55)' }}>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 5, opacity: die }}>
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i} style={{ ...dyeDrain(frame, 6 + i * 8), width: 26, height: 26, borderRadius: 5, background: colors.accent }} />
            ))}
          </div>
          <p style={{ fontFamily: serif, fontSize: 56, color: colors.paper, marginTop: 70, opacity: fade(frame, 90) }}>然后，安静了。</p>
        </AbsoluteFill>
      </AbsoluteFill>
      {/* 幕级调色 veil（grade-ash-grey · multiply 0.45 + screen 0.08，Act2 全幕常量，跨镜拆分归入各镜，层级在内容之上） */}
      <AbsoluteFill style={{ background: GRADES[1].lut.color, mixBlendMode: 'multiply', opacity: 0.45 }} />
      <AbsoluteFill style={{ background: GRADES[1].veil.color, mixBlendMode: 'screen', opacity: 0.08 }} />
    </AbsoluteFill>
  );
};

export default ShotBlackout;
