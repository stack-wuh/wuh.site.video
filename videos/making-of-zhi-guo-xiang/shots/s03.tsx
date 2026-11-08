/* s03 · 留白（60f · 2.0s，Act 1）
 *
 * M2/M3/M4 三连闪：seg-flash-a/b/c 各 20f 硬切（storyboard v3 修正口径：60f 恰好三拍），
 * 第三拍正落在出镜「墨洇」的爬升段——墨色吞没到满幅即「末尾停黑场」的落点，
 * s04 从满墨里退开，观感是黑场里呼吸了一口。留白镜不挂字幕。
 * 转场：入「切」/ 出「墨洇」（装配层 ShotShell 遮罩，本镜不渲染遮罩）。
 */
import type { CSSProperties, FC } from 'react';
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile } from 'remotion';
import { colors } from '../../../brand/tokens';

const BEAT = 20; // 三连闪每拍 20f（v3 修正：各 20f）
const FLASHES = ['a', 'b', 'c'];
const VIDEO: CSSProperties = { width: '100%', height: '100%', objectFit: 'cover' };

const S03: FC = () => (
  <AbsoluteFill style={{ background: colors.bg }}>
    {FLASHES.map((k, i) => (
      <Sequence key={k} from={i * BEAT} durationInFrames={BEAT}>
        <OffthreadVideo
          src={staticFile(`making-of-zhi-guo-xiang/segments/seg-flash-${k}-v1.mp4`)}
          startFrom={0}
          endAt={BEAT}
          style={VIDEO}
        />
      </Sequence>
    ))}
  </AbsoluteFill>
);

export default S03;
