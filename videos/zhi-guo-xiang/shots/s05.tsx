/* 镜 5 · 幕二 渡口 · local [0,80) · 80f
   黄河渡口大全景：河面横贯，左岸芦苇压低，浅水冰凌反光，土黄暮色压在天边，渡船在对岸很小；无人。
   前 20f 由上一镜纸白化入暮色，此后不动。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ArtBase } from '../components/ArtBase';
import { DustField } from '../components/DustField';

const S05: FC = () => {
  const f = useCurrentFrame();
  const fromPaper = interpolate(f, [0, 20], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: colors.paper }}>
      <ArtBase name="g04" zoom={[1.0, 1.02]}>
        <DustField act={2} count={14} seedBase="s05" />
      </ArtBase>
      <AbsoluteFill style={{ background: colors.paper, opacity: fromPaper }} />
    </AbsoluteFill>
  );
};

export default S05;
