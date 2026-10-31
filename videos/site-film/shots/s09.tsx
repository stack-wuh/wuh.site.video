/* 镜 09 · Act 2 起步与沉默 · 全局帧 [1520,1670) · 150f */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { GRADES, inkRise } from '../motion-tokens';

const serif = fontFamilies.serif;

/* 金句（原 ShotQuote；【坐标保真 + 冻结事实】原断点 scatter [110,150]、inkRise [8,28]/[40,60]
   以幕局部帧求值，而镜窗为幕局部 [820,970) → 原片本镜入画时全部断点早已越尽，150f 全程冻结于
   散场终态：金句残影 opacity 0.1、blur 4px、字样 inkRise 落定全显——此为已交付成片的真实渲染。
   本镜 frame = useCurrentFrame() + 820（幕局部基准）逐帧复现冻结交付态；显现/散场动画重放属内容变更，另立 change。 */
const ShotQuote: FC = () => {
  const frame = useCurrentFrame() + 820; // 幕局部帧保真（见头注释）
  const scatter = interpolate(frame, [110, 150], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ filter: 'saturate(0.55)' }}>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center', opacity: 1 - scatter * 0.9, filter: `blur(${scatter * 4}px)` }}>
          <p style={{ ...inkRise(frame, 8), fontFamily: serif, fontSize: 48, color: colors.paper, margin: '16px 0' }}>人生一世不过 3 万多天，</p>
          <p style={{ ...inkRise(frame, 40), fontFamily: serif, fontSize: 48, color: colors.paper, margin: '16px 0' }}>实在是太短了。</p>
        </div>
      </AbsoluteFill>
      {/* 幕级调色 veil（grade-ash-grey · multiply 0.45 + screen 0.08，Act2 全幕常量，跨镜拆分归入各镜，层级在内容之上） */}
      <AbsoluteFill style={{ background: GRADES[1].lut.color, mixBlendMode: 'multiply', opacity: 0.45 }} />
      <AbsoluteFill style={{ background: GRADES[1].veil.color, mixBlendMode: 'screen', opacity: 0.08 }} />
    </AbsoluteFill>
  );
};

export default ShotQuote;
