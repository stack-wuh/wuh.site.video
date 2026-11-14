import type { FC } from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { FilmShell } from '../../brand/ident/FilmShell';
import type { FilmMeta } from '../../brand/ident/identity';
import { WuhSiteIntroV3Audio } from './WuhSiteIntroV3Audio';
import { ShotShell } from './components/ShotShell';
import { FILM_COLORS } from './motion-tokens';
import { manifest } from './shots/manifest';
import { shotRegistry } from './shots/registry';

const META: FilmMeta = {
  title: '七年，一座站',
  subtitle: 'wuh.site · 2019 → 2026',
  episode: 'WUH.SITE INTRO V3 · REBUILD 2026-11',
  credits: [],
};

/**
 * 纯装配层（shot-spec §4）：FilmShell（片头 150 + 正片 5700 + 片尾 180 = 6030）+ manifest 遍历 + ShotShell。
 * 时间轴真源 = shots-manifest.json；镜内容一律在 shots/ 内，装配层不写镜头内容（INV-S4）。
 */
export const WuhSiteIntroV3: FC = () => {
  return (
    <AbsoluteFill style={{ background: FILM_COLORS.paper }}>
      <FilmShell meta={META} contentFrames={manifest.totalFrames} intro={150}>
        {manifest.shots.map((s, i) => {
          const Shot = shotRegistry[s.id];
          const next = manifest.shots[i + 1];
          return (
            <Sequence key={s.id} from={s.startFrame} durationInFrames={s.durationFrames}>
              <ShotShell in={s.transition} out={next ? next.transition : 'cut'} duration={s.durationFrames}>
                <Shot />
              </ShotShell>
            </Sequence>
          );
        })}
      </FilmShell>
      <WuhSiteIntroV3Audio />
    </AbsoluteFill>
  );
};
