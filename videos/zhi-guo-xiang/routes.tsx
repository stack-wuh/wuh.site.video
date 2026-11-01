/* 由 scripts/shots.mjs sync 生成——勿手改；真源 shots-manifest.json（视频单元路由） */
import type { FC } from 'react';
import type { VideoRoute } from '../../src/route';
import { ZhiGuoXiang } from './ZhiGuoXiang';
import { ZhiGuoXiangAudio } from './ZhiGuoXiangAudio';
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
  return { id: `ZhiGuoXiang-${id}`, component: ShotComposition, durationInFrames: entry.durationFrames };
};

export const zhiGuoXiangRoutes: VideoRoute[] = [
  { id: 'ZhiGuoXiang', component: ZhiGuoXiang, durationInFrames: 7500 },
  { id: 'ZhiGuoXiangAudio', component: ZhiGuoXiangAudio, durationInFrames: 7500 },
  ...manifest.shots.map((s) => shotRoute(s.id)),
];
