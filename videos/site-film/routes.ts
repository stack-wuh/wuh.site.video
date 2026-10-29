import type { VideoRoute } from '../../src/route';
import { SiteFilm } from './SiteFilm';

/** 视频单元路由声明：每支视频一个文件，互不冲突；RemotionRoot 自动汇总注册 */
export const siteFilmRoutes: VideoRoute[] = [
  { id: 'SiteFilm', component: SiteFilm, durationInFrames: 7200 },
];
