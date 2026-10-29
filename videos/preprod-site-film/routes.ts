import type { VideoRoute } from '../../src/route';
import { SiteFilmAnimatic } from './SiteFilmAnimatic';

/** Animatic 分镜板路由声明 */
export const preprodRoutes: VideoRoute[] = [
  { id: 'SiteFilmAnimatic', component: SiteFilmAnimatic, durationInFrames: 7200 },
];
