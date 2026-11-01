/* 镜 36 · 幕五 缰绳与经卷 · local [0,120) · 120f
   禅房案上：青驴的缰绳一圈圈放下，旁边摊着一卷经；案角一盏佛前灯；窗外是山。 */
import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ArtBase } from '../components/ArtBase';
import { FILM } from '../motion-tokens';

const S36: FC = () => {
  const f = useCurrentFrame();
  const lamp = 0.7 + 0.3 * Math.sin(f / 6) * Math.sin(f / 17);

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <ArtBase name="g14" zoom={[1.0, 1.05]}>
        <div
          style={{
            position: 'absolute',
            right: '22%',
            top: '46%',
            width: 190,
            height: 190,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${FILM.fireGold} 0%, transparent 62%)`,
            opacity: 0.22 * lamp,
            filter: 'blur(8px)',
            mixBlendMode: 'screen',
          }}
        />
      </ArtBase>
      <AbsoluteFill style={{ background: colors.ink, opacity: 0.1 }} />
    </AbsoluteFill>
  );
};

export default S36;
