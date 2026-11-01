/* 镜 35 · 幕五 剑 · local [0,160) · 160f
   一把剑插在雪里，剑鞘上三道火燎痕；一只手握住剑柄，把剑拔出；只给手与剑，不给脸（L0）。
   蒙太奇：前 70f 雪中剑，硬切到手与剑，落雪连续不中断。 */
import type { FC } from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ArtBase, Plate } from '../components/ArtBase';

const FLAKES = Array.from({ length: 44 }, (_, i) => i);
const CUT = 70;

const S35: FC = () => {
  const f = useCurrentFrame();
  const second = f >= CUT;

  return (
    <AbsoluteFill style={{ background: colors.paper }}>
      <ArtBase name="g13" zoom={[1.10, 1.16]} shiftX={second ? [-20, -20] : [10, 10]}>
        <AbsoluteFill style={{ background: colors.paper, opacity: 0.16 }} />
        <div style={{ position: 'absolute', inset: 0, transform: second ? 'scale(1.14) translateX(-40px)' : 'scale(1.06)' }}>
          <Plate name="j2" height="100%" opacity={0.96} />
        </div>
        {FLAKES.map((i) => {
          const s = `s35-${i}`;
          const x = ((random(`${s}-x`) * 2000 + f * (1.4 + random(`${s}-v`))) % 2000) - 40;
          const y = ((random(`${s}-y`) * 1180 + f * (2 + random(`${s}-w`) * 2.4)) % 1180) - 40;
          return <div key={s} style={{ position: 'absolute', left: x, top: y, width: 3, height: 3, borderRadius: '50%', background: colors.paper, opacity: 0.5 }} />;
        })}
      </ArtBase>
    </AbsoluteFill>
  );
};

export default S35;
