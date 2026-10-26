import type { FC } from 'react';
import { SiteFilmAnimatic } from './SiteFilmAnimatic';

/** Animatic 分镜板路由声明 */
export type AnimaticRoute = {
  id: string;
  component: FC;
  durationInFrames: number;
};

export const preprodRoutes: AnimaticRoute[] = [
  { id: 'SiteFilmAnimatic', component: SiteFilmAnimatic, durationInFrames: 7200 },
];
