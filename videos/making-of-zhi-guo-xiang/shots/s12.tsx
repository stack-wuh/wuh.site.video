/* s12 · 那天我以为，最难的部分已经过去了。（180f · 6.0s，Act 3 · v3.2 210→180）
 *
 * 素材镜：`seg-v8-open-cont-v1`（M1 续放，母带 10–17s = 210 源帧）原速直放，
 * 7s 正好铺满镜长（素材镜纪律：不调色不推拉，保母带原貌）。
 * 转场：入「切」/ 出「切」。字幕窗 [12,198]。
 */
import type { CSSProperties, FC } from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile } from 'remotion';
import { colors } from '../../../brand/tokens';
import { Caption } from '../components/Caption';

const TOTAL = 180;
const VIDEO: CSSProperties = { width: '100%', height: '100%', objectFit: 'cover' };

const S12: FC = () => (
  <AbsoluteFill style={{ background: colors.bg }}>
    <OffthreadVideo
      src={staticFile('making-of-zhi-guo-xiang/segments/seg-v8-open-cont-v1.mp4')}
      startFrom={0}
      endAt={180}
      style={VIDEO}
    />
    <Caption text="那天我以为，最难的部分已经过去了。" start={12} end={168} duration={TOTAL} inSide={0} outSide={0} />
  </AbsoluteFill>
);

export default S12;
