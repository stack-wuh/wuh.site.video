/* 镜 19 · 幕三 一朵接一朵 · local [0,90) · 90f
   第二朵、第三朵相继在夜空不同位置炸开，金屑开始下坠；城头剪影被反复照亮；画面中央偏左留一块夜空的黑。 */
import type { FC } from 'react';
import { AbsoluteFill } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ArtBase } from '../components/ArtBase';
import { Fireworks } from '../components/Fireworks';

const S19: FC = () => {
  return (
    <AbsoluteFill style={{ background: colors.ink }}>
      <ArtBase name="g07" zoom={[1.04, 1.08]} shiftX={[16, -14]}>
        <Fireworks
          seed="s19"
          bursts={[
            { x: 1520, y: 230, at: 2, scale: 1.0 },
            { x: 520, y: 190, at: 30, scale: 1.15 },
            { x: 1180, y: 300, at: 58, scale: 0.85 },
          ]}
        />
      </ArtBase>
      <AbsoluteFill style={{ background: colors.ink, opacity: 0.12 }} />
    </AbsoluteFill>
  );
};

export default S19;
