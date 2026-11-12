import type { FC } from 'react';
import { AbsoluteFill } from 'remotion';
import { GRADES2, type GradeId2 } from '../motion-tokens';

/* V2 八幕调色层（深空数据流）：底色层 + 雾光层 + 全局滤镜，随每镜自渲染 */
export const Grade2: FC<{ id: GradeId2 }> = ({ id }) => {
  const g = GRADES2[id];
  return (
    <>
      <AbsoluteFill style={{ background: g.base.color, mixBlendMode: g.base.blend, opacity: g.base.opacity, pointerEvents: 'none' }} />
      {g.veil ? <AbsoluteFill style={{ backgroundImage: g.veil.gradient, mixBlendMode: g.veil.blend, opacity: g.veil.opacity, pointerEvents: 'none' }} /> : null}
      <AbsoluteFill style={{ filter: `saturate(${g.saturate}) brightness(${g.brightness ?? 1})`, pointerEvents: 'none' }} />
    </>
  );
};
