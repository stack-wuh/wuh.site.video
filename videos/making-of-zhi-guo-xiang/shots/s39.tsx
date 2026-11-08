/* s39 · 我的执念，是让她被讲对。（165f · 5.5s，Act 8 终·执念）
 *
 * 素材镜：M8 诗行段（母带 244–249.5s，`seg-v12-poem-v1`，5.5s = 165f）
 * 原速直放，镜长与段长严丝合缝，不调色不加推拉（素材镜纪律，保母带原貌）。
 * 转场：入「切」/ 出「切」。字幕窗 [12,153]。
 */
import type { CSSProperties, FC } from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile } from 'remotion';
import { colors } from '../../../brand/tokens';
import { Caption } from '../components/Caption';

const TOTAL = 165;
const VIDEO: CSSProperties = { width: '100%', height: '100%', objectFit: 'cover' };
const SEG_SRC = 'making-of-zhi-guo-xiang/segments/seg-v12-poem-v1.mp4';

const S39: FC = () => (
  <AbsoluteFill style={{ background: colors.bg }}>
    <OffthreadVideo src={staticFile(SEG_SRC)} startFrom={0} endAt={TOTAL} style={VIDEO} />

    <Caption text="我的执念，是让她被讲对。" start={12} end={153} duration={TOTAL} inSide={0} outSide={0} />
  </AbsoluteFill>
);

export default S39;
