import type { FC } from 'react';
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile } from 'remotion';
import { colors } from '../../brand/tokens';
import { FilmShell } from '../../brand/ident/FilmShell';
import { INTRO, OUTRO } from '../../brand/ident/identity';
import { BlackOpen } from './scenes/BlackOpen';
import { NameCard } from './scenes/NameCard';
import { SplitScreen } from './scenes/SplitScreen';

export const CONTENT_FRAMES = 330;

const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const AUDIO_START = INTRO;
const AUDIO_END = INTRO + CONTENT_FRAMES + OUTRO;
const FADE = 30;
const TRACK_FRAMES = 345; // 占位曲 11.5s @30fps；替换曲目后同步修改

// 正片 330f：黑场 0-90 / 名字 90-180 / 左右分屏 180-330；片头 120 + 片尾 180 由 FilmShell 合成（总 630f）
export const SelfIntro: FC = () => {
  const mainFrames = AUDIO_END - AUDIO_START - FADE;
  const pass1 = Math.min(TRACK_FRAMES, mainFrames);
  const pass2 = mainFrames - pass1;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(1200px 800px at 50% 40%, ${colors.bgLift} 0%, ${colors.bg} 70%)`,
      }}
    >
      {/* 主段一：片头后起播，正片首帧淡入，播满一遍曲目 */}
      <Sequence from={AUDIO_START} durationInFrames={pass1}>
        <Audio
          src={staticFile('self-intro/bgm.mp3')}
          volume={(f) => interpolate(f, [0, 30], [0, 1], CLAMP)}
        />
      </Sequence>
      {/* 主段二：接续第二遍满音量；不用 loop——loop 下音量为逐轮求值，每轮都会重新淡入 */}
      {pass2 > 0 ? (
        <Sequence from={AUDIO_START + pass1} durationInFrames={pass2}>
          <Audio src={staticFile('self-intro/bgm.mp3')} volume={1} />
        </Sequence>
      ) : null}
      {/* 尾段：接续轨道位置收尾淡出到零 */}
      <Sequence from={AUDIO_END - FADE} durationInFrames={FADE}>
        <Audio
          src={staticFile('self-intro/bgm.mp3')}
          startFrom={mainFrames % TRACK_FRAMES}
          volume={(f) => interpolate(f, [0, FADE - 1], [1, 0], CLAMP)}
        />
      </Sequence>
      <FilmShell
        meta={{
          title: '自我介绍',
          subtitle: '先认识一下，再继续写。',
          episode: 'SELF INTRO · 2026-10',
          credits: ['BGM · 占位音轨（同名覆盖 public/self-intro/bgm.mp3 即生效）'],
        }}
        contentFrames={CONTENT_FRAMES}
      >
        <Sequence durationInFrames={90}>
          <BlackOpen />
        </Sequence>
        <Sequence from={90} durationInFrames={90}>
          <NameCard />
        </Sequence>
        <Sequence from={180} durationInFrames={150}>
          <SplitScreen />
        </Sequence>
      </FilmShell>
    </AbsoluteFill>
  );
};
