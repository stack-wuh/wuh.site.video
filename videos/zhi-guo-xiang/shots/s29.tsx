/* 镜 29 · 幕四 传闻 · local [0,160) · 160f
   纸页一张张铺开，像摊开的账；一只手在抄，笔尖游走；纸边有折痕与指印。
   微距横移扫过纸面（全片唯一一次「赶」）。字幕 0–120（tone ink）。 */
import type { FC } from 'react';
import { AbsoluteFill } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ArtBase } from '../components/ArtBase';
import { Caption } from '../components/Caption';

const S29: FC = () => {
  return (
    <AbsoluteFill style={{ background: colors.paper }}>
      <ArtBase name="g10" zoom={[1.30, 1.22]} shiftX={[-40, 46]} shiftY={[20, -10]}>
        <AbsoluteFill style={{ background: colors.paper, opacity: 0.18 }} />
      </ArtBase>
      <Caption text="后来，江湖上开始讲她的故事。" start={0} end={120} tone="ink" />
    </AbsoluteFill>
  );
};

export default S29;
