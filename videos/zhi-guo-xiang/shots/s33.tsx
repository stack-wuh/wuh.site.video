/* 镜 33 · 幕五 定格 · local [0,60) · 60f
   光里什么也看不见，只有门内的暖白；门框成剪影。完全静止 60f，只有极轻的呼吸。 */
import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { FILM } from '../motion-tokens';

const S33: FC = () => {
  const f = useCurrentFrame();
  const breathe = 0.97 + 0.03 * Math.sin((f / 60) * Math.PI);

  return (
    <AbsoluteFill style={{ background: colors.paper }}>
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${colors.paper} 0%, ${FILM.fireGold} 120%)`,
          opacity: breathe,
        }}
      />
      <AbsoluteFill style={{ background: colors.ink, opacity: 0.08 }} />
      {/* 门框剪影 */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 180, background: colors.ink, opacity: 0.55 }} />
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 180, background: colors.ink, opacity: 0.55 }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 120, background: colors.ink, opacity: 0.5 }} />
    </AbsoluteFill>
  );
};

export default S33;
