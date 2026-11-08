/* s31 · 留白（150f · 5.0s，Act 6 · 声音的进化）
 *
 * 素材镜直放：`seg-v12-real-voice-open-v1`（M8 母带 4–9s，真声开场段，5s = 150f 恰满镜）。
 * 无字幕（MO-CAP-MAX：纯留白镜不挂）。Freeze 兜底：若段短于镜长则末帧定格补满。
 * 入 cut / 出 cut。素材镜纪律：不加滤镜不加推拉，保母带原貌。
 */
import type { FC } from 'react';
import { AbsoluteFill, Freeze, OffthreadVideo, staticFile, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';

const SEG_FRAMES = 150; // seg-v12-real-voice-open-v1：5s @ 30fps

const S31: FC = () => {
  const f = useCurrentFrame();
  const frozenAt = Math.min(f, SEG_FRAMES - 1); // 满镜直放；此护栏只在段缺帧时生效

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <Freeze frame={frozenAt}>
        <OffthreadVideo
          src={staticFile('making-of-zhi-guo-xiang/segments/seg-v12-real-voice-open-v1.mp4')}
          startFrom={0}
          endAt={SEG_FRAMES}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Freeze>
    </AbsoluteFill>
  );
};

export default S31;
