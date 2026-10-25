import type { FC } from 'react';
import { Composition } from 'remotion';
import { SelfIntro } from '../videos/self-intro/SelfIntro';
import { SiteFilm } from '../videos/site-film/SiteFilm';

// 新视频：node scripts/new-video.mjs <slug> 生成骨架后，在此注册 Composition
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
      <Composition
        id="SiteFilm"
        component={SiteFilm}
        durationInFrames={7200}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
