/* 由 scripts/shots.mjs sync 生成——勿手改；真源 shots-manifest.json（视频单元路由） */
import type { FC } from 'react';
import type { VideoRoute } from '../../src/route';
import { WuhSiteIntroV2 } from './WuhSiteIntroV2';
import { WuhSiteIntroV2Audio } from './WuhSiteIntroV2Audio';
import { ShotShell } from './components/ShotShell';
import { shotRegistry } from './shots/registry';
import { manifest } from './shots/manifest';

const shotRoute = (id: string): VideoRoute => {
  const entry = manifest.shots.find((s) => s.id === id);
  if (!entry) throw new Error(`manifest 缺镜 ${id}`);
  const Shot = shotRegistry[id];
  const ShotComposition: FC = () => (
    <ShotShell>
      <Shot />
    </ShotShell>
  );
  return { id: `WuhSiteIntroV2-${id}`, component: ShotComposition, durationInFrames: entry.durationFrames };
};

export const wuhSiteIntroV2Routes: VideoRoute[] = [
  { id: 'WuhSiteIntroV2', component: WuhSiteIntroV2, durationInFrames: 7958 },
  { id: 'WuhSiteIntroV2Audio', component: WuhSiteIntroV2Audio, durationInFrames: 7958 },
  ...manifest.shots.map((s) => shotRoute(s.id)),
];
