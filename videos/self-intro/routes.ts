import type { VideoRoute } from '../../src/route';
import { totalFilmFrames } from '../../brand/ident/identity';
import { CONTENT_FRAMES, SelfIntro } from './SelfIntro';

export const selfIntroRoutes: VideoRoute[] = [
  { id: 'SelfIntro', component: SelfIntro, durationInFrames: totalFilmFrames(CONTENT_FRAMES) },
];
