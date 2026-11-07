/* v12 试点路由（不进正片 manifest）：P1 = S11/S12 烟花 3D 版，P2 = S21 揭面（待做） */
import type { VideoRoute } from '../../../src/route';
import { P1Fireworks } from './P1Fireworks';

export const zhiGuoXiangPilotRoutes: VideoRoute[] = [
  { id: 'ZhiGuoXiang-P1', component: P1Fireworks, durationInFrames: 240 },
];
