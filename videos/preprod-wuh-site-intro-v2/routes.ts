import type { VideoRoute } from '../../src/route';
import { WuhSiteIntroV2Animatic } from './WuhSiteIntroV2Animatic';
import { TOTAL_FRAMES } from './shots-data';

/** Animatic 分镜板路由：FilmShell 包 8260f 正片，总 8590f = 150 + 8260 + 180（v2 片头 150f） */
export const wuhSiteIntroV2PreprodRoutes: VideoRoute[] = [
  { id: 'WuhSiteIntroV2Animatic', component: WuhSiteIntroV2Animatic, durationInFrames: 150 + TOTAL_FRAMES + 180 },
];
