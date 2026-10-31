/* 由 scripts/shots.mjs sync 生成——勿手改；真源 shots-manifest.json（视频单元路由） */
import type { FC } from 'react';
import type { VideoRoute } from '../../src/route';
import { SiteFilm } from './SiteFilm';
import { SiteFilmAudio } from './SiteFilmAudio';
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
  return { id: `SiteFilm-${id}`, component: ShotComposition, durationInFrames: entry.durationFrames };
};

export const siteFilmRoutes: VideoRoute[] = [
  { id: 'SiteFilm', component: SiteFilm, durationInFrames: manifest.totalFrames },
  { id: 'SiteFilmAudio', component: SiteFilmAudio, durationInFrames: manifest.totalFrames },
  ...manifest.shots.map((s) => shotRoute(s.id)),
];
