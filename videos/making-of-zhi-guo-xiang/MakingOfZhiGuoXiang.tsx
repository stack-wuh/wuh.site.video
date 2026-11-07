import type { FC } from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { colors } from '../../brand/tokens';
import { FilmShell } from '../../brand/ident/FilmShell';
import type { FilmMeta } from '../../brand/ident/identity';
import { MakingOfZhiGuoXiangAudio } from './MakingOfZhiGuoXiangAudio';
import { ShotShell } from './components/ShotShell';
import { manifest } from './shots/manifest';
import { shotRegistry } from './shots/registry';

const META: FilmMeta = {
  title: '风陵 · 致郭襄',
  subtitle: '创作历程片 · 十一个版本',
  episode: '2026-11-01 → 11-07',
  credits: [],
};

/** 纯装配层（shot-spec §4）：FilmShell（片头 120 + 正片 7680 + 片尾 180 = 7980）
 *  + manifest 遍历 + ShotShell + 静默音轨。时间轴真源 shots-manifest.json。 */
export const MakingOfZhiGuoXiang: FC = () => (
  <AbsoluteFill style={{ background: colors.bg }}>
    <FilmShell meta={META} contentFrames={manifest.totalFrames}>
      {manifest.shots.map((s, i) => {
        const Shot = shotRegistry[s.id];
        const next = manifest.shots[i + 1];
        return (
          <Sequence key={s.id} from={s.startFrame} durationInFrames={s.durationFrames}>
            <ShotShell in={s.transition} out={next?.transition} duration={s.durationFrames}>
              <Shot />
            </ShotShell>
          </Sequence>
        );
      })}
    </FilmShell>
    <MakingOfZhiGuoXiangAudio />
  </AbsoluteFill>
);
