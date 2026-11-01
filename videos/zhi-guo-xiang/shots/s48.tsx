/* 镜 48 · 幕六 弟子 · local [0,120) · 120f
   峨眉山门，石阶上立着一个年轻的女弟子（风陵师太）：与十六岁郭襄同源、同一个双鬟、同一处雪青；
   只给背影，风把衣袖吹起；山门在她身后，雾在阶下。 */
import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ArtBase, Plate } from '../components/ArtBase';

const S48: FC = () => {
  const f = useCurrentFrame();
  const gust = Math.sin(f / 34) * 4;

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <ArtBase name="g12" zoom={[1.10, 1.14]} shiftY={[10, -6]}>
        <Plate name="fengling" height="52%" left={760} bottom={80} opacity={0.95} sway={gust} />
        <AbsoluteFill style={{ background: colors.paper, opacity: 0.06 }} />
      </ArtBase>
      <AbsoluteFill style={{ background: colors.paper, opacity: 0.05 }} />
    </AbsoluteFill>
  );
};

export default S48;
