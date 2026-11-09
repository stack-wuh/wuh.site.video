import type { FC } from 'react';
import { AbsoluteFill } from 'remotion';
import { GRADES, type GradeId } from '../motion-tokens';

/* 八幕调色层（§3.7 GRADES）：底色层 + 雾光层 + 全局滤镜，随每镜自渲染 */
export const Grade: FC<{ id: GradeId }> = ({ id }) => {
  const g = GRADES[id];
  return (
    <>
      <AbsoluteFill style={{ background: g.base.color, mixBlendMode: g.base.blend, opacity: g.base.opacity, pointerEvents: 'none' }} />
      {g.veil ? <AbsoluteFill style={{ backgroundImage: g.veil.gradient, mixBlendMode: g.veil.blend, opacity: g.veil.opacity, pointerEvents: 'none' }} /> : null}
      <AbsoluteFill style={{ filter: `saturate(${g.saturate}) brightness(${g.brightness ?? 1})`, pointerEvents: 'none' }} />
    </>
  );
};
