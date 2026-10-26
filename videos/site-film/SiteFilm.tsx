import type { FC } from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { interpolate } from 'remotion';
import { colors } from '../../brand/tokens';
import { Act1 } from './scenes/Act1';
import { Act2 } from './scenes/Act2';
import { Act3 } from './scenes/Act3';
import { Act4 } from './scenes/Act4';
import { Act5 } from './scenes/Act5';
import { Act6 } from './scenes/Act6';
import { Act7 } from './scenes/Act7';
// 时间轴（帧，总 7200 = 4:00 @30fps）：storyboard v1.1 七幕
// Act 1 序章 0-700 / Act 2 起步与沉默 700-1800 / Act 3 重启与复燃 1800-2800
// Act 4 产品巡礼 2800-4700 / Act 5 创作人文 4700-5600 / Act 6 影子工作流 5600-6550 / Act 7 向好与落版 6550-7200
// 配乐五段编排（bgm-selection.md 定稿）：静 → 扬 → 缓（回捞）→ 机械 → 归于主题，交叉淡化 45f

export const SiteFilm: FC = () => {
  return (
    <AbsoluteFill style={{ background: colors.bg }}>
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

      <Sequence durationInFrames={700}>
        <Act1 />
      </Sequence>
      <Sequence from={700} durationInFrames={1100}>
        <Act2 />
      </Sequence>
      <Sequence from={1800} durationInFrames={1000}>
        <Act3 />
      </Sequence>
      <Sequence from={2800} durationInFrames={1900}>
        <Act4 />
      </Sequence>
      <Sequence from={4700} durationInFrames={900}>
        <Act5 />
      </Sequence>
      <Sequence from={5600} durationInFrames={950}>
        <Act6 />
      </Sequence>
      <Sequence from={6550} durationInFrames={650}>
        <Act7 />
      </Sequence>
      {/* 全局暖纸肌理垫底（paper-grain 等效：低透明暖色叠加） */}
      <AbsoluteFill style={{ background: colors.bgLift, opacity: 0.05, pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};
