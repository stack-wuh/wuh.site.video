/* s08 · 然后，是一块单色的分镜板。（195f · 6.5s，Act 2）
 *
 * 素材镜：`seg-animatic-open-v1`（M7 前期 animatic 单色简板，0–8s 取 6.5s = 195 源帧）
 * 原速直放铺满镜长（素材镜纪律：不调色不推拉，保母带原貌）。
 * 转场：入「飞白」10f / 出「切」。字幕窗 [22,183]。
 */
import type { CSSProperties, FC } from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile } from 'remotion';
import { colors } from '../../../brand/tokens';
import { Caption } from '../components/Caption';

const TOTAL = 195;
const VIDEO: CSSProperties = { width: '100%', height: '100%', objectFit: 'cover' };

const S08: FC = () => (
  <AbsoluteFill style={{ background: colors.bg }}>
    <OffthreadVideo
      src={staticFile('making-of-zhi-guo-xiang/segments/seg-animatic-open-v1.mp4')}
      startFrom={0}
      endAt={TOTAL}
      style={VIDEO}
    />
    <Caption text="然后，是一块单色的分镜板。" start={22} end={183} duration={TOTAL} inSide={10} outSide={0} />
  </AbsoluteFill>
);

export default S08;
