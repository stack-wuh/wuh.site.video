import type { FC } from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { colors } from '../../brand/tokens';
import { SiteFilmAudio } from './SiteFilmAudio';
import { ShotShell } from './components/ShotShell';
import { manifest } from './shots/manifest';
import { shotRegistry } from './shots/registry';

/* 纯装配层（shot-spec §4）：manifest 遍历 + ShotShell + 内联音轨，零镜内容、零全片视觉 overlay（INV-S4）。
   时间轴真源 shots-manifest.json（startFrame 前缀和，Σ=7200=4:00 @30fps，storyboard v1.1 七幕）；
   配乐五段编排（bgm-selection.md 定稿）在 SiteFilmAudio——Studio 预览有声，单镜 comp 不含它。 */
export const SiteFilm: FC = () => {
  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <SiteFilmAudio />
      {manifest.shots.map((s) => {
        const Shot = shotRegistry[s.id];
        return (
          <Sequence key={s.id} from={s.startFrame} durationInFrames={s.durationFrames}>
            <ShotShell>
              <Shot />
            </ShotShell>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
