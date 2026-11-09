import type { FC } from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { colors } from '../../brand/tokens';
import { FilmShell } from '../../brand/ident/FilmShell';
import type { FilmMeta } from '../../brand/ident/identity';
import { WuhSiteIntroV3Audio } from './WuhSiteIntroV3Audio';
import { ShotShell } from './components/ShotShell';
import { manifest } from './shots/manifest';
import { shotRegistry } from './shots/registry';

const META: FilmMeta = {
  title: '雾失楼台，月迷津渡',
  subtitle: '2019 → 2026 · wuh.site 实现历程 · 站点真实素材版',
  episode: 'WUH.SITE INTRO V3 · 2026-11',
  credits: [],
};

/* 纯装配层（shot-spec §4）：FilmShell（片头 150 + 正片 8260 + 片尾 180 = 8590）+ manifest 遍历
   + ShotShell + 内联音轨。时间轴真源 shots-manifest.json；字幕随各镜自渲染（INV-S4：单镜像素完整）。
   真实截图镜的素材像素由各镜经 staticFile 自带（INV-S4 / 资产版本纪律见 asset-registry）。 */
export const WuhSiteIntroV3: FC = () => {
  return (
    <AbsoluteFill style={{ background: colors.bg }}>
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
