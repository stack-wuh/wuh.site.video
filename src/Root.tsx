import type { FC } from 'react';
import { Composition, Folder } from 'remotion';
import { selfIntroRoutes } from '../videos/self-intro/routes';
import { siteFilmRoutes } from '../videos/site-film/routes';
import { preprodRoutes } from '../videos/preprod-site-film/routes';
import { identRoutes } from '../brand/ident/routes';
import type { VideoRoute } from './route';

/**
 * Composition 注册表（数据驱动路由）——本文件是遍历器，永不再改。
 * 新增视频：在 videos/<slug>/routes.ts 声明路由数组，在此加一行 import 并 spread 进对应分组。
 * Remotion <Folder> 按 brand / films 分组，Studio 侧边栏分层显示。
 */
const filmRoutes: VideoRoute[] = [...selfIntroRoutes, ...siteFilmRoutes, ...preprodRoutes];

const toComposition = (r: VideoRoute) => (
  <Composition
    key={r.id}
    id={r.id}
    component={r.component}
    durationInFrames={r.durationInFrames}
    fps={30}
    width={1920}
    height={1080}
  />
);

export const RemotionRoot: FC = () => {
  return (
    <>
      <Folder name="brand">{identRoutes.map(toComposition)}</Folder>
      <Folder name="films">{filmRoutes.map(toComposition)}</Folder>
    </>
  );
};
