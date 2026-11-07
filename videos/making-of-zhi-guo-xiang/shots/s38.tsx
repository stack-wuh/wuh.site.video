/* s38 · 她的执念，是等一个不会回头的人。（180f · 6.0s，Act 8 终·执念）
 *
 * 素材镜：M8 青驴等待蒙太奇（母带 196–202s，`seg-v12-donkey-v1`，6.0s = 180f）
 * 原速直放，镜长与段长严丝合缝，不调色不加推拉（素材镜纪律，保母带原貌）。
 * 转场：入「切」/ 出「切」。字幕窗 [12,168]。
 */
import type { CSSProperties, FC } from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile } from 'remotion';
import { colors } from '../../../brand/tokens';
import { Caption } from '../components/Caption';

const TOTAL = 180;
const VIDEO: CSSProperties = { width: '100%', height: '100%', objectFit: 'cover' };
const SEG_SRC = 'making-of-zhi-guo-xiang/segments/seg-v12-donkey-v1.mp4';

const S38: FC = () => (
  <AbsoluteFill style={{ background: colors.bg }}>
    <OffthreadVideo src={staticFile(SEG_SRC)} startFrom={0} endAt={TOTAL} style={VIDEO} />

    <Caption text="她的执念，是等一个不会回头的人。" start={12} end={168} duration={TOTAL} inSide={0} outSide={0} />
  </AbsoluteFill>
);

export default S38;
