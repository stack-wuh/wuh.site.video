/**
 * 配音预览专用入口（不属于正式 composition 注册表，src/index.ts 与 routes.tsx 均不改）
 *
 * 用途：本片 BGM 走本地 mux（INV-6），合成内无 <Audio>，所以 Studio/render 出来是无声的。
 * 要"边看画面边听配音"，用这个入口渲染 —— 它把 ZhiGuoXiang 与已拼好人声轨叠在一起。
 *
 * 渲染：
 *   npx remotion render scripts/video-preview/entry.tsx ZhiGuoXiangVoice out/zgx-voice-preview.mp4 --crf=20 --scale=0.5
 *
 * 注意：只有人声轨（男叙述 9 段 + 女独白 10 段 + 诗六行），没有 BGM。BGM 需要拿到授权音频后
 * 用 scripts/mux-bgm.mjs 做终版混音。
 */
import type { FC } from 'react';
import { AbsoluteFill, Audio, Composition, registerRoot, staticFile } from 'remotion';
import '../../brand/fonts';
import { ZhiGuoXiang } from '../../videos/zhi-guo-xiang/ZhiGuoXiang';

const VOICE_TRACK = 'zhi-guo-xiang/tts/voice-track-v5.wav';

const ZhiGuoXiangVoicePreview: FC = () => (
  <AbsoluteFill>
    <ZhiGuoXiang />
    <Audio src={staticFile(VOICE_TRACK)} />
  </AbsoluteFill>
);

const PreviewRoot: FC = () => (
  <Composition
    id="ZhiGuoXiangVoice"
    component={ZhiGuoXiangVoicePreview}
    durationInFrames={7350}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(PreviewRoot);