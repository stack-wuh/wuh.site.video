import type { VideoRoute } from '../../src/route';
import { totalFilmFrames } from '../../brand/ident/identity';
import { WuhSiteIntroV3Animatic } from './WuhSiteIntroV3Animatic';
import { TOTAL_FRAMES } from './shots-data';

/** Animatic 分镜板路由：FilmShell 包 8260f 正片，总 8560f = 120 + 8260 + 180 */
export const wuhSiteIntroV3PreprodRoutes: VideoRoute[] = [
  { id: 'WuhSiteIntroV3Animatic', component: WuhSiteIntroV3Animatic, durationInFrames: totalFilmFrames(TOTAL_FRAMES) },
];
