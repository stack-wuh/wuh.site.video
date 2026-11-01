/* 镜 3 · 幕一 海不说话 · local [0,240) · 240f
   水纹横向铺开，墨蓝与银白，只见纹不见浪；极缓横移 3%，像视线沿海平线走；远端水色与纸色相融。
   字幕 20–200（诗第 2 行，difference 取字色）。 */
import type { FC } from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ArtBase } from '../components/ArtBase';
import { Caption } from '../components/Caption';

const LINES = Array.from({ length: 14 }, (_, i) => i);

const S03: FC = () => {
  const f = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: colors.paper }}>
      <ArtBase name="g03" zoom={[1.02, 1.03]} shiftX={[-22, 22]}>
        <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
          {LINES.map((i) => {
            const y = 560 + i * 30;
            const drift = Math.sin((f + i * 26) / 70) * 14;
            const wob = 0.5 + 0.5 * Math.sin((f + i * 33) / 34);
            return (
              <path
                key={i}
                d={`M${300 - i * 12 + drift} ${y} Q ${960 + drift} ${y - 6 + wob * 4} ${1620 + i * 10 + drift} ${y}`}
                fill="none"
                stroke={i % 3 === 0 ? colors.paper : colors.muted}
                strokeWidth={1 + random(`s03-l${i}`)}
                opacity={0.1 + 0.12 * wob * (1 - i / 18)}
              />
            );
          })}
        </svg>
      </ArtBase>
      <AbsoluteFill style={{ mixBlendMode: 'difference' }}>
        <Caption text="我路过海时，海不说话，" start={20} end={200} poem bottom={600} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export default S03;
