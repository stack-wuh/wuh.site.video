/* 镜 24 · 幕三 他没有回头 · local [0,120) · 120f
   她的背影站在岩边，风把衣角吹起，脚下云在翻；她没有追，也没有转身；末 40f 极缓后拉 2%，让云海更大。
   字幕 0–80（tone ink）。 */
import type { FC } from 'react';
import { AbsoluteFill } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ArtBase } from '../components/ArtBase';
import { Caption } from '../components/Caption';

const S24: FC = () => {
  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <ArtBase name="g09" zoom={[1.08, 1.0]} shiftY={[-8, 10]}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: -160,
              right: -160,
              bottom: `${2 + i * 12}%`,
              height: '16%',
              background: `linear-gradient(180deg, transparent, ${colors.paper} 60%, transparent)`,
              opacity: 0.35 - i * 0.08,
              filter: 'blur(16px)',
            }}
          />
        ))}
      </ArtBase>
      <Caption text="他没有回头。" start={0} end={80} tone="ink" />
    </AbsoluteFill>
  );
};

export default S24;
