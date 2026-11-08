/* s13 · 留白（210f · 7.0s，Act 3）
 *
 * 素材镜：`seg-v8-mask-v1`（M1 高光纯放，母带 74–81s 面具段 = 210 源帧）原速直放，
 * 7s 正好铺满镜长。无字幕（纯留白镜，MO-CAP-MAX：留白镜不挂），BGM 提幅由装配层承担。
 * 转场：入「切」/ 出「墨洇」（出遮罩由装配层 ShotShell 挂）。
 */
import type { CSSProperties, FC } from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile } from 'remotion';
import { colors } from '../../../brand/tokens';

const VIDEO: CSSProperties = { width: '100%', height: '100%', objectFit: 'cover' };

const S13: FC = () => (
  <AbsoluteFill style={{ background: colors.bg }}>
    <OffthreadVideo
      src={staticFile('making-of-zhi-guo-xiang/segments/seg-v8-mask-v1.mp4')}
      startFrom={0}
      endAt={210}
      style={VIDEO}
    />
  </AbsoluteFill>
);

export default S13;
