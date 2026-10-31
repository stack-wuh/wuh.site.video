import type { VideoRoute } from '../../src/route';
import { totalFilmFrames } from '../../brand/ident/identity';
import { WuhSiteIntroV2Animatic } from './WuhSiteIntroV2Animatic';
import { TOTAL_FRAMES } from './shots-data';

/** Animatic 分镜板路由：FilmShell 包 7200f 正片，总 7500f = 120 + 7200 + 180 */
export const wuhSiteIntroV2PreprodRoutes: VideoRoute[] = [
  { id: 'WuhSiteIntroV2Animatic', component: WuhSiteIntroV2Animatic, durationInFrames: totalFilmFrames(TOTAL_FRAMES) },
];
