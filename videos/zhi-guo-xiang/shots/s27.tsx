/* 镜 27 · 幕四 铁罗汉 · local [0,160) · 160f
   山门外，她半身裁到胸，右手递出一个小铁罗汉；一个少年低头看它。两人的脸都不入画。
   字幕 0–120。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ArtBase, Plate } from '../components/ArtBase';
import { Caption } from '../components/Caption';

const S27: FC = () => {
  const f = useCurrentFrame();
  const push = interpolate(f, [0, 160], [1.0, 1.06], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <ArtBase name="g11" zoom={[1.04, 1.08]}>
        <div style={{ position: 'absolute', inset: 0, transform: `scale(${push})`, transformOrigin: '52% 60%' }}>
          <div style={{ position: 'absolute', left: '6%', right: '6%', top: '4%', bottom: '0%' }}>
            <Plate name="j1" height="100%" opacity={0.97} />
          </div>
        </div>
      </ArtBase>
      <AbsoluteFill style={{ background: colors.ink, opacity: 0.1 }} />
      <Caption text="她一路问过去，没有人见过他。" start={0} end={120} />
    </AbsoluteFill>
  );
};

export default S27;
