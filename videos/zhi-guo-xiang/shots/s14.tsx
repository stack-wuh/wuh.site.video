/* 镜 14 · 幕三 等她 · local [0,160) · 160f
   人群的背在画面前景挤成一堵墙；她站在墙外，手拢在袖里，肩线绷着；只给侧后、发与肩的轮廓。
   字幕 0–160。 */
import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ArtBase, Plate } from '../components/ArtBase';
import { Caption } from '../components/Caption';

const S14: FC = () => {
  const f = useCurrentFrame();
  const breathe = Math.sin(f / 46) * 6;

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <ArtBase name="g06" zoom={[1.05, 1.07]}>
        <div style={{ position: 'absolute', inset: 0, background: colors.ink, opacity: 0.12 }} />
        {/* 她：人群外，画左缘 */}
        <div style={{ transform: `translateX(${breathe * 0.3}px)` }}>
          <Plate name="xiang16" height="58%" left={-40} bottom={-30} opacity={0.95} sway={1.2} />
        </div>
        {/* 人群的呼吸式晃动 */}
        <div style={{ position: 'absolute', inset: 0, background: colors.ink, opacity: 0.06, transform: `translateY(${breathe}px)` }} />
      </ArtBase>
      <Caption text="九月廿四，她的生日。" start={0} end={160} />
    </AbsoluteFill>
  );
};

export default S14;
