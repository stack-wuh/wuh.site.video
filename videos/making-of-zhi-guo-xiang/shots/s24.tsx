/* s24 · 留白（225f · 7.5s，Act 5 · BGM 提幅 · v3.1 帧数再分配 255→225，让位句 18 旁白窗）
 *
 * 素材镜直放：`seg-v12-wanbeast-long-v1`（M8 母带 78–86.5s 万兽山庄扩段）直放前 7.5s（225f），
 * 段尾 1s 不用。纯放镜：无字幕（MO-CAP-MAX：纯留白镜无字幕），不加滤镜不加推拉，保母带原貌。
 * 交接态：入 cut（承接 s23 黑场定格），出 cut 交 s25 翻车卡。
 */
import type { FC } from 'react';
import { AbsoluteFill, OffthreadVideo, staticFile } from 'remotion';
import { colors } from '../../../brand/tokens';

const DURATION = 225;

const S24: FC = () => (
  <AbsoluteFill style={{ background: colors.bg }}>
    <OffthreadVideo
      src={staticFile('making-of-zhi-guo-xiang/segments/seg-v12-wanbeast-long-v1.mp4')}
      startFrom={0}
      endAt={DURATION}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
  </AbsoluteFill>
);

export default S24;
