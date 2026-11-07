/* s37 · 风陵渡口初相遇。（105f · 3.5s，Act 8 终·执念）
 *
 * 素材镜：M8 风陵渡（母带 32–34.5s，`seg-v12-fengling-v1`，2.5s = 75f）原速直放——
 *   0–74f   直放；
 *   75–104f 末 30f <Freeze> 定格在段末帧（帧 74），不让底色露出。
 * 不调色不加推拉（素材镜纪律，保母带原貌）。转场：入「切」/ 出「切」。字幕窗 [12,93]。
 */
import type { CSSProperties, FC } from 'react';
import { AbsoluteFill, Freeze, OffthreadVideo, Sequence, staticFile } from 'remotion';
import { colors } from '../../../brand/tokens';
import { Caption } from '../components/Caption';

const TOTAL = 105;
const SEG = 75; // 段长 2.5s = 75f
const TAIL = 30; // 末 30f 定格
const VIDEO: CSSProperties = { width: '100%', height: '100%', objectFit: 'cover' };
const SEG_SRC = 'making-of-zhi-guo-xiang/segments/seg-v12-fengling-v1.mp4';

const S37: FC = () => (
  <AbsoluteFill style={{ background: colors.bg }}>
    {/* 直放 75f */}
    <Sequence from={0} durationInFrames={SEG}>
      <OffthreadVideo src={staticFile(SEG_SRC)} startFrom={0} endAt={SEG} style={VIDEO} />
    </Sequence>
    {/* 末 30f：段末帧定格 */}
    <Sequence from={SEG} durationInFrames={TAIL}>
      <Freeze frame={SEG - 1}>
        <OffthreadVideo src={staticFile(SEG_SRC)} startFrom={0} endAt={SEG} style={VIDEO} />
      </Freeze>
    </Sequence>

    <Caption text="风陵渡口初相遇。" start={12} end={93} duration={TOTAL} inSide={0} outSide={0} />
  </AbsoluteFill>
);

export default S37;
