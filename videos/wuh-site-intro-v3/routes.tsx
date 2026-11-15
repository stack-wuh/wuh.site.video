/* 由 scripts/shots.mjs sync 生成——勿手改；真源 shots-manifest.json（视频单元路由） */
import type { FC } from 'react';
import type { VideoRoute } from '../../src/route';
import { WuhSiteIntroV3 } from './WuhSiteIntroV3';
import { WuhSiteIntroV3Audio } from './WuhSiteIntroV3Audio';
import { ShotShell } from './components/ShotShell';
import { shotRegistry } from './shots/registry';
import { manifest } from './shots/manifest';

const shotRoute = (id: string): VideoRoute => {
  const entry = manifest.shots.find((s) => s.id === id);
  if (!entry) throw new Error(`manifest 缺镜 ${id}`);
  const next = manifest.shots[manifest.shots.indexOf(entry) + 1];
  const Shot = shotRegistry[id];
  const ShotComposition: FC = () => (
    <ShotShell in={entry.transition} out={next?.transition} duration={entry.durationFrames}>
      <Shot />
    </ShotShell>
  );
  return { id: `WuhSiteIntroV3-${id}`, component: ShotComposition, durationInFrames: entry.durationFrames };
};

export const wuhSiteIntroV3Routes: VideoRoute[] = [
  { id: 'WuhSiteIntroV3', component: WuhSiteIntroV3, durationInFrames: 6030 },
  { id: 'WuhSiteIntroV3Audio', component: WuhSiteIntroV3Audio, durationInFrames: 6030 },
  ...manifest.shots.map((s) => shotRoute(s.id)),
];
