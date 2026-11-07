import type { FC } from 'react';
import { AbsoluteFill } from 'remotion';

/** 静默音轨：本片 BGM 走本地 mux（版权床不入库不入 CI），旁白真声在装配层 mux（INV-5/INV-6）。
 *  CI/成片只出画面与静默轨；发布前按 materials.md §4 两遍铺床 + 人声整轨混音。 */
export const MakingOfZhiGuoXiangAudio: FC = () => <AbsoluteFill />;
