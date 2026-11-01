import type { FC } from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { colors } from '../../brand/tokens';
import { FilmShell } from '../../brand/ident/FilmShell';
import type { FilmMeta } from '../../brand/ident/identity';
import { ZhiGuoXiangAudio } from './ZhiGuoXiangAudio';
import { ShotShell } from './components/ShotShell';
import { manifest } from './shots/manifest';
import { shotRegistry } from './shots/registry';

const META: FilmMeta = {
  title: '风陵 · 致郭襄',
  subtitle: '四分钟武侠诗电影',
  episode: '网络流传 · 托名程灵素',
  credits: [],
};

/** 纯装配层（shot-spec §4）：FilmShell（片头 120 + 正片 7200 + 片尾 180 = 7500）
 *  + manifest 遍历 + ShotShell + 静默音轨。时间轴真源 shots-manifest.json。 */
export const ZhiGuoXiang: FC = () => (
  <AbsoluteFill style={{ background: colors.bg }}>
    <FilmShell meta={META} contentFrames={manifest.totalFrames}>
      {manifest.shots.map((s) => {
        const Shot = shotRegistry[s.id];
        return (
          <Sequence key={s.id} from={s.startFrame} durationInFrames={s.durationFrames}>
            <ShotShell>
              <Shot />
            </ShotShell>
          </Sequence>
        );
      })}
    </FilmShell>
    <ZhiGuoXiangAudio />
  </AbsoluteFill>
);
