/* 镜 50 · 幕六 天 · local [0,160) · 160f
   只有天空：晚霞铺满，暖金与胭脂，云边开始发亮；画面中央偏上留一块稍暗的蓝。云的流动继续放慢。 */
import type { FC } from 'react';
import { AbsoluteFill } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ArtBase } from '../components/ArtBase';

const S50: FC = () => (
  <AbsoluteFill style={{ background: colors.bg }}>
    <ArtBase name="g18" zoom={[1.08, 1.10]} shiftX={[-10, 14]}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 52% 26%, ${colors.muted} 0%, transparent 46%)`,
          opacity: 0.18,
          transform: 'translateY(-6%)',
        }}
      />
    </ArtBase>
  </AbsoluteFill>
);

export default S50;
