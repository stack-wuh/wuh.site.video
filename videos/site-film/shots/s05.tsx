/* 镜 05 · Act 2 起步与沉默 · 全局帧 [880,1040) · 160f */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, GRADES, numRoll } from '../motion-tokens';

const serif = fontFamilies.serif;

const fade = (f: number, at: number) =>
  interpolate(f, [at, at + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/* 热力图生长 + 数字（原 ShotHeatmap；【坐标保真 + 冻结事实】原断点（numRoll [30,70]、tilt [40,100]、
   spring 偏移 ≤96、fade [60,74]）以幕局部帧求值，而镜窗为幕局部 [180,340) → 原片本镜入画时全部断点
   早已越尽，160f 全程冻结于终态：22×7 热力图全量长满（grow=1 · opacity 0.9 · scaleY 1）、
   倾角定格 18°、数字定格 1,168 commits · 685 天、文案全显——此为已交付成片的真实渲染。
   本镜 frame = useCurrentFrame() + 180（幕局部基准）逐帧复现冻结交付态；生长动画重放属内容变更，另立 change。 */
const ShotHeatmap: FC = () => {
  const frame = useCurrentFrame() + 180; // 幕局部帧保真（见头注释）
  const roll = numRoll(frame, 30, 40, 0, 1168);
  const tilt = interpolate(frame, [40, 100], [0, 18], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  return (
    <AbsoluteFill style={{ filter: 'saturate(0.55)' }}>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', perspective: 1200 }}>
          <div style={{ transform: `rotateX(${tilt}deg)`, display: 'flex', gap: 5 }}>
            {Array.from({ length: 22 }).map((_, w) => (
              <div key={w} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {Array.from({ length: 7 }).map((_, d) => {
                  const grow = spring({ frame: frame - (6 + w * 4 + d), fps: 30, config: { damping: 200 } });
                  return <div key={d} style={{ width: 24, height: 24, borderRadius: 5, background: (w + d) % 4 > 1 ? colors.accent : colors.paperMuted, opacity: 0.35 + 0.55 * grow, transform: `scaleY(${interpolate(grow, [0, 1], [0.2, 1])})` }} />;
                })}
              </div>
            ))}
          </div>
          <p style={{ fontFamily: serif, fontSize: 44, color: colors.paper, marginTop: 44, opacity: fade(frame, 60) }}>
            {Math.round(roll).toLocaleString()} commits · 685 天
          </p>
        </AbsoluteFill>
      </AbsoluteFill>
      {/* 幕级调色 veil（grade-ash-grey · multiply 0.45 + screen 0.08，Act2 全幕常量，跨镜拆分归入各镜，层级在内容之上） */}
      <AbsoluteFill style={{ background: GRADES[1].lut.color, mixBlendMode: 'multiply', opacity: 0.45 }} />
      <AbsoluteFill style={{ background: GRADES[1].veil.color, mixBlendMode: 'screen', opacity: 0.08 }} />
    </AbsoluteFill>
  );
};

export default ShotHeatmap;
