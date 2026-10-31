import type { FC } from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { interpolate } from 'remotion';

/* 配乐五段编排（bgm-selection.md 定稿）：静 → 扬 → 缓（回捞）→ 机械 → 归于主题，交叉淡化 45f。
   音轨唯一事实源：既内联进 SiteFilm（Studio 预览有声），也独立注册 Composition 供音轨单独渲染。 */
export const SiteFilmAudio: FC = () => {
  return (
    <>
      {/* Act 1-3 前半（0-80s）：Meditation Impromptu 01 静与抑 */}
      <Sequence from={0} durationInFrames={2400}>
        <Audio src={staticFile('site-film/meditation.m4a')} volume={(f) => interpolate(f, [0, 45, 2340 - 0, 2400 - 0], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} />
      </Sequence>
      {/* 钤印后（80-157s）：Take the Lead 扬与游 */}
      <Sequence from={2400} durationInFrames={2310}>
        <Audio src={staticFile('site-film/lead.m4a')} volume={(f) => interpolate(f, [0, 45, 2310 - 45, 2310], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} />
      </Sequence>
      {/* 创作人文（157-187s）：Meditation 回捞（曲内 120s 起），音量下潜 */}
      <Sequence from={4710} durationInFrames={900}>
        <Audio src={staticFile('site-film/meditation.m4a')} startFrom={3600} volume={(f) => interpolate(f, [0, 45, 855, 900], [0, 0.55, 0.55, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} />
      </Sequence>
      {/* 影子工作流（187-218s）：Clash Defiant 机械节拍 */}
      <Sequence from={5610} durationInFrames={940}>
        <Audio src={staticFile('site-film/clash.m4a')} volume={(f) => interpolate(f, [0, 30, 880, 940], [0, 0.9, 0.9, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} />
      </Sequence>
      {/* 向好落版（218-240s）：Take the Lead 回捞（曲内 270s 起）归于主题 */}
      <Sequence from={6550} durationInFrames={650}>
        <Audio src={staticFile('site-film/lead.m4a')} startFrom={8100} volume={(f) => interpolate(f, [0, 30, 590, 650], [0, 0.95, 0.95, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} />
      </Sequence>
    </>
  );
};
