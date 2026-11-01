import type { FC } from 'react';
import { AbsoluteFill } from 'remotion';
import { GRADES, type GradeId } from '../motion-tokens';

/** GR-01–GR-08 调色叠加层：底色层 + 雾光层（叠在内容之上、字幕之下） */
export const Grade: FC<{ id: GradeId }> = ({ id }) => {
  const g = GRADES[id];
  return (
    <>
      <AbsoluteFill style={{ background: g.base.color, mixBlendMode: g.base.blend, opacity: g.base.opacity }} />
      {g.veil ? <AbsoluteFill style={{ backgroundImage: g.veil.gradient, mixBlendMode: g.veil.blend, opacity: g.veil.opacity }} /> : null}
    </>
  );
};
