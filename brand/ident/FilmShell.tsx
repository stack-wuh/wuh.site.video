import type { FC, ReactNode } from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { colors } from '../tokens';
import { BrandIntro } from './BrandIntro';
import { BrandOutro } from './BrandOutro';
import { INTRO, OUTRO } from './identity';
import type { FilmMeta } from './identity';

type FilmShellProps = {
  meta: FilmMeta;
  contentFrames: number;
  children: ReactNode;
};

/**
 * 家族片头片尾包装器：片头 → 正片 → 片尾三段拼接，总长必须等于 totalFilmFrames(contentFrames)。
 * 正片挂在 Sequence 内，子组件拿到的是局部帧，既有幕/分镜无需改动。
 */
export const FilmShell: FC<FilmShellProps> = ({ meta, contentFrames, children }) => (
  <AbsoluteFill style={{ background: colors.bg }}>
    <Sequence durationInFrames={INTRO}>
      <BrandIntro meta={meta} />
    </Sequence>
    <Sequence from={INTRO} durationInFrames={contentFrames}>
      {children}
    </Sequence>
    <Sequence from={INTRO + contentFrames} durationInFrames={OUTRO}>
      <BrandOutro meta={meta} />
    </Sequence>
  </AbsoluteFill>
);
