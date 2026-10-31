/* 镜 10 · Act 2 起步与沉默 · 全局帧 [1670,1800) · 130f */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { GRADES, dyeDrain } from '../motion-tokens';

const serif = fontFamilies.serif;

const fade = (f: number, at: number) =>
  interpolate(f, [at, at + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/* 时间轴失色 + 暗红伏笔（原 ShotTimelineGrey；【坐标保真】pulse 的内插段 [40,120] 与 dyeDrain 10、
   fade 40 以幕局部帧求值，镜窗为幕局部 [970,1100) → 这些部分入画即冻结终态（轴线全灰 grayscale 0.85、
   字幕全显）；但 pulse 中的 sin(frame / 8) 为无钳制振荡器，相位依赖绝对帧值——若改镜局部基准会整体
   改变脉动相位，故本镜 frame = useCurrentFrame() + 970（幕局部基准）逐帧复现原片：
   暗红点（grade-seal-red · GRADES[2]）全程以原相位活跃脉动 = 原片真实渲染行为，非冻结。
   暗红伏笔点位于本镜内容层内（原 ShotTimelineGrey 自带），非幕级 overlay，归属 s10。 */
const ShotTimelineGrey: FC = () => {
  const frame = useCurrentFrame() + 970; // 幕局部帧保真（见头注释）
  const pulse = 0.3 + 0.7 * Math.abs(Math.sin(frame / 8)) * interpolate(frame, [40, 120], [0.4, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ filter: 'saturate(0.55)' }}>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: 1000, height: 300, ...dyeDrain(frame, 10) }}>
          <div style={{ position: 'absolute', top: 140, left: 0, right: 0, height: 1, background: colors.hairline }} />
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} style={{ position: 'absolute', left: 60 + i * 94, top: 136, width: 9, height: 9, borderRadius: 5, background: colors.muted }} />
          ))}
          <div style={{ position: 'absolute', right: 120, top: 120, width: 22, height: 22, borderRadius: 11, background: GRADES[2].lut.color, opacity: pulse, boxShadow: `0 0 ${30 * pulse}px ${GRADES[2].lut.color}` }} />
          <p style={{ position: 'absolute', bottom: 0, width: '100%', textAlign: 'center', fontFamily: serif, fontSize: 40, color: colors.paper, opacity: fade(frame, 40) }}>
            欲望，是最恐怖的东西。
          </p>
        </div>
      </AbsoluteFill>
      {/* 幕级调色 veil（grade-ash-grey · multiply 0.45 + screen 0.08，Act2 全幕常量，跨镜拆分归入各镜，层级在内容之上） */}
      <AbsoluteFill style={{ background: GRADES[1].lut.color, mixBlendMode: 'multiply', opacity: 0.45 }} />
      <AbsoluteFill style={{ background: GRADES[1].veil.color, mixBlendMode: 'screen', opacity: 0.08 }} />
    </AbsoluteFill>
  );
};

export default ShotTimelineGrey;
