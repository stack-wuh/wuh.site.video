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
  intro?: number;
  outro?: number;
  children: ReactNode;
};

/**
 * 家族片头片尾包装器：片头 → 正片 → 片尾三段拼接，总长等于 intro + contentFrames + outro。
 * 默认使用家族常量 INTRO/OUTRO；单支片可覆盖片头（如 v2 的 150f），BrandIntro 会按 duration 等比放慢。
 * 正片挂在 Sequence 内，子组件拿到的是局部帧，既有幕/分镜无需改动。
 */
export const FilmShell: FC<FilmShellProps> = ({ meta, contentFrames, intro = INTRO, outro = OUTRO, children }) => (
  <AbsoluteFill style={{ background: colors.bg }}>
    <Sequence durationInFrames={intro}>
      <BrandIntro meta={meta} duration={intro} />
    </Sequence>
    <Sequence from={intro} durationInFrames={contentFrames}>
      {children}
    </Sequence>
    <Sequence from={intro + contentFrames} durationInFrames={outro}>
      <BrandOutro meta={meta} />
    </Sequence>
  </AbsoluteFill>
);
