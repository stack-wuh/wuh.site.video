/* 镜 08 · Act 2 起步与沉默 · 全局帧 [1380,1520) · 140f */
import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { GRADES, dyeDrain, inkRise } from '../motion-tokens';

const serif = fontFamilies.serif;
const mono = fontFamilies.mono;

/* 2025·0（原 ShotZero；【坐标保真 + 冻结事实】原断点 dyeDrain 延迟 10–70（+40 收完 ≤110）、
   inkRise [40,60] 以幕局部帧求值，而镜窗为幕局部 [680,820) → 原片本镜入画时全部断点早已越尽，
   140f 全程冻结于终态：七年柱全灰（grayscale 0.85 · brightness 0.915）、2025 柱高 4px、
   纸白「0」落定（opacity 1 · translateY 0）——此为已交付成片的真实渲染。
   本镜 frame = useCurrentFrame() + 680（幕局部基准）逐帧复现冻结交付态；失色动画重放属内容变更，另立 change。 */
const ShotZero: FC = () => {
  const frame = useCurrentFrame() + 680; // 幕局部帧保真（见头注释）
  return (
    <AbsoluteFill style={{ filter: 'saturate(0.55)' }}>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 34, alignItems: 'flex-end', height: 340 }}>
          {[
            ['2019', 3117], ['2020', 3563], ['2021', 3935], ['2022', 2139], ['2023', 2183], ['2024', 2319], ['2025', 0],
          ].map(([y, v], i) => (
            <div key={String(y)} style={{ textAlign: 'center', ...dyeDrain(frame, 10 + i * 10) }}>
              <div style={{ width: 58, height: Math.max((Number(v) / 3935) * 270, 4), background: colors.muted, borderRadius: 4 }} />
              <p style={{ fontFamily: mono, fontSize: 15, color: colors.muted, marginTop: 10 }}>{y}</p>
              {y === '2025' ? <p style={{ ...inkRise(frame, 40), fontFamily: serif, fontSize: 44, color: colors.paper, margin: 0 }}>0</p> : null}
            </div>
          ))}
        </div>
      </AbsoluteFill>
      {/* 幕级调色 veil（grade-ash-grey · multiply 0.45 + screen 0.08，Act2 全幕常量，跨镜拆分归入各镜，层级在内容之上） */}
      <AbsoluteFill style={{ background: GRADES[1].lut.color, mixBlendMode: 'multiply', opacity: 0.45 }} />
      <AbsoluteFill style={{ background: GRADES[1].veil.color, mixBlendMode: 'screen', opacity: 0.08 }} />
    </AbsoluteFill>
  );
};

export default ShotZero;
