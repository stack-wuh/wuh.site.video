import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { FILM, FN, GRADES } from '../motion-tokens';

const GRADE = GRADES['GR-05'];

/**
 * S33（5-2 定格呼吸，4500–4560，60f）——全片唯一一次真正的定格：
 * 光里什么也看不见，只有门内的暖白；门框成剪影。完全静止，只有 FN-05 的极轻呼吸（±0.4%）。
 * 尾帧必须冻成一张静止的暖白，交给 S34 的 TR-07（同亮度硬切）。
 */
const S33: FC = () => {
  const frame = useCurrentFrame();
  const breathe = FN.paperBreathe(frame, 0.4);
  return (
    <AbsoluteFill style={{ background: colors.paper }}>
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${breathe})`, transformOrigin: 'center' }}>
        <AbsoluteFill style={{ background: `linear-gradient(180deg, ${FILM.fireGold} 0%, transparent 58%)`, opacity: 0.16 }} />
        {/* 门框剪影：两侧门柱 + 上槛 + 下槛，其余全是光 */}
        <div style={{ position: 'absolute', left: 118, top: 0, width: 96, height: 1080, background: colors.ink, opacity: 0.9 }} />
        <div style={{ position: 'absolute', right: 118, top: 0, width: 96, height: 1080, background: colors.ink, opacity: 0.9 }} />
        <div style={{ position: 'absolute', left: 118, right: 118, top: 84, height: 84, background: colors.ink, opacity: 0.9 }} />
        <div style={{ position: 'absolute', left: 118, right: 118, bottom: 0, height: 64, background: colors.ink, opacity: 0.82 }} />
        <div style={{ position: 'absolute', left: 214, right: 214, bottom: 64, height: 2, background: colors.ink, opacity: 0.14 }} />
      </div>
      <AbsoluteFill style={{ background: GRADE.base.color, mixBlendMode: GRADE.base.blend, opacity: GRADE.base.opacity }} />
      {GRADE.veil ? <AbsoluteFill style={{ background: GRADE.veil.gradient, mixBlendMode: GRADE.veil.blend, opacity: GRADE.veil.opacity }} /> : null}
    </AbsoluteFill>
  );
};

export default S33;
