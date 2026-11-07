/* s17 · 揭掉面具在十六岁，不是二十四年后。（165f · 5.5s，Act 4）
 *
 * 素材镜：`seg-v12-unmask-v1`（M8 揭面段续，母带 86–90s = 120 源帧）原速直放，
 * 末 45f <Freeze> 定格在末帧（帧 119）补满 165f，不让底色露出。
 * 转场：入「切」/ 出「切」。字幕窗 [12,153]。
 */
import type { CSSProperties, FC } from 'react';
import { AbsoluteFill, Freeze, OffthreadVideo, Sequence, staticFile } from 'remotion';
import { colors } from '../../../brand/tokens';
import { Caption } from '../components/Caption';

const TOTAL = 165;
const PLAY = 120; // 4s = 120f
const VIDEO: CSSProperties = { width: '100%', height: '100%', objectFit: 'cover' };

const S17: FC = () => (
  <AbsoluteFill style={{ background: colors.bg }}>
    {/* 直放 120f */}
    <Sequence from={0} durationInFrames={PLAY}>
      <OffthreadVideo
        src={staticFile('making-of-zhi-guo-xiang/segments/seg-v12-unmask-v1.mp4')}
        startFrom={0}
        endAt={PLAY}
        style={VIDEO}
      />
    </Sequence>
    {/* 末 45f：末帧定格 */}
    <Sequence from={PLAY} durationInFrames={TOTAL - PLAY}>
      <Freeze frame={PLAY - 1}>
        <OffthreadVideo
          src={staticFile('making-of-zhi-guo-xiang/segments/seg-v12-unmask-v1.mp4')}
          startFrom={0}
          endAt={PLAY}
          style={VIDEO}
        />
      </Freeze>
    </Sequence>

    <Caption text="揭掉面具在十六岁，不是二十四年后。" start={12} end={153} duration={TOTAL} inSide={0} outSide={0} />
  </AbsoluteFill>
);

export default S17;
