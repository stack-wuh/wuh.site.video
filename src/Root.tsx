import type { FC } from 'react';
import { Composition, Folder } from 'remotion';
import { SelfIntro } from '../videos/self-intro/SelfIntro';
import { siteFilmRoutes } from '../videos/site-film/routes';
import { preprodRoutes } from '../videos/preprod-site-film/routes';
import type { FilmRoute } from '../videos/site-film/routes';

/**
 * Composition 注册表（数据驱动路由）——本文件是遍历器，永不再改。
 * 新增视频：在 videos/<slug>/routes.ts 声明路由数组，在此加一行 import 并 spread 进对应分组。
 * Remotion <Folder> 按 preprod / films 分组，Studio 侧边栏分层显示。
 */
const filmRoutes: FilmRoute[] = [...siteFilmRoutes, ...preprodRoutes];

const toComposition = (r: FilmRoute) => (
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
      <Composition
        id="SelfIntro"
        component={SelfIntro}
        durationInFrames={330}
        fps={30}
        width={1920}
        height={1080}
      />
      <Folder name="films">{filmRoutes.map(toComposition)}</Folder>
    </>
  );
};
