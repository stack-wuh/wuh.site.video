/* 镜 17 · 幕三 满城抬头 · local [0,120) · 120f
   从城头拉到街巷与屋顶：满城的人都仰头，剪影一片；窗一扇扇推开，灯笼的光被烟花盖过。 */
import type { FC } from 'react';
import { AbsoluteFill } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ArtBase, Plate } from '../components/ArtBase';
import { Fireworks } from '../components/Fireworks';

const S17: FC = () => {
  return (
    <AbsoluteFill style={{ background: colors.ink }}>
      <ArtBase name="g07" zoom={[1.06, 1.10]} shiftX={[-26, 22]} shiftY={[10, 30]}>
        <Fireworks
          seed="s17"
          bursts={[
            { x: 420, y: 250, at: 6, scale: 0.9 },
            { x: 1180, y: 200, at: 46, scale: 1.0 },
            { x: 760, y: 320, at: 86, scale: 0.8 },
          ]}
        />
        <Plate name="crowd" height="30%" left={-180} bottom={-60} opacity={0.95} blend="normal" />
      </ArtBase>
      <AbsoluteFill style={{ background: colors.ink, opacity: 0.16 }} />
    </AbsoluteFill>
  );
};

export default S17;
