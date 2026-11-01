import type { FC } from 'react';
import { AbsoluteFill } from 'remotion';

/** 静默音轨：本片 BGM 走本地 mux，合成内无 <Audio>（INV-6）。
 *  CI/成片只出画面与静默轨；发布前按 music.md 在 4320 断点做两遍混音。 */
export const ZhiGuoXiangAudio: FC = () => <AbsoluteFill />;
