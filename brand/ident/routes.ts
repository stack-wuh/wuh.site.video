import type { VideoRoute } from '../../src/route';
import { BrandIdent } from './BrandIdent';
import { totalFilmFrames } from './identity';

/** 品牌套件路由：BrandIdent 为预览合成（片头 120 + 占位 120 + 片尾 180） */
export const identRoutes: VideoRoute[] = [
  { id: 'BrandIdent', component: BrandIdent, durationInFrames: totalFilmFrames(120) },
];
