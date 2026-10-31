import type { FC } from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { colors } from '../../brand/tokens';
import { FilmShell } from '../../brand/ident/FilmShell';
import type { FilmMeta } from '../../brand/ident/identity';
import { WuhSiteIntroV2Audio } from './WuhSiteIntroV2Audio';
import { ShotShell } from './components/ShotShell';
import { manifest } from './shots/manifest';
import { shotRegistry } from './shots/registry';

const META: FilmMeta = {
  title: '雾失楼台，月迷津渡',
  subtitle: '2019 → 2026 · wuh.site 实现历程',
  episode: 'WUH.SITE INTRO V2 · 2026-10',
  credits: [],
};

/* 纯装配层（shot-spec §4）：FilmShell（片头 120 + 正片 7658 + 片尾 180 = 7958）+ manifest 遍历
   + ShotShell + 内联音轨。时间轴真源 shots-manifest.json；字幕随各镜自渲染（INV-S4：单镜像素完整）。 */
export const WuhSiteIntroV2: FC = () => {
  return (
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
      <WuhSiteIntroV2Audio />
    </AbsoluteFill>
  );
};
