/* s16 · 三枚金针，原著里她全用了——最后一枚，是求他别死。（240f · 8.0s，Act 4 · v3.1 帧数再分配 255→240）
 *
 * 素材镜三段跳切（M8 金针三连，跳切只在镜内，无跨镜图层）：
 *   0–9    纸底黑场垫（colors.bg，硬切前一口呼吸）；
 *   10–84  `seg-v12-needle-trilogy-a-v1`（揭面，2.5s = 75f）
 *   85–159 `seg-v12-needle-trilogy-b-v1`（生日，75f）    —— 硬切
 *   160–234 `seg-v12-needle-trilogy-c-v1`（第三针，75f） —— 硬切
 *   235–239 尾 5f <Freeze> 定格在 c 段末帧（帧 74），不让底色露出。
 * 转场：入「切」/ 出「切」。字幕窗 [12,228]。
 */
import type { CSSProperties, FC } from 'react';
import { AbsoluteFill, Freeze, OffthreadVideo, Sequence, staticFile } from 'remotion';
import { colors } from '../../../brand/tokens';
import { Caption } from '../components/Caption';

const TOTAL = 240;
const SEG = 75; // 每段 2.5s = 75f
const LEAD = 10; // 首 10f 黑场垫
const TAIL = 5; // 尾 5f 定格（v3.1：20→5，让位句 13 字幕窗）
const VIDEO: CSSProperties = { width: '100%', height: '100%', objectFit: 'cover' };

const SEG_A = 'making-of-zhi-guo-xiang/segments/seg-v12-needle-trilogy-a-v1.mp4';
const SEG_B = 'making-of-zhi-guo-xiang/segments/seg-v12-needle-trilogy-b-v1.mp4';
const SEG_C = 'making-of-zhi-guo-xiang/segments/seg-v12-needle-trilogy-c-v1.mp4';

const S16: FC = () => (
  <AbsoluteFill style={{ background: colors.bg }}>
    {/* 首段：黑场垫 10f 后硬切入 a（揭面） */}
    <Sequence from={LEAD} durationInFrames={SEG}>
      <OffthreadVideo src={staticFile(SEG_A)} startFrom={0} endAt={SEG} style={VIDEO} />
    </Sequence>
    {/* b（生日） */}
    <Sequence from={LEAD + SEG} durationInFrames={SEG}>
      <OffthreadVideo src={staticFile(SEG_B)} startFrom={0} endAt={SEG} style={VIDEO} />
    </Sequence>
    {/* c（第三针） */}
    <Sequence from={LEAD + SEG * 2} durationInFrames={SEG}>
      <OffthreadVideo src={staticFile(SEG_C)} startFrom={0} endAt={SEG} style={VIDEO} />
    </Sequence>
    {/* 尾 20f：c 段末帧定格 */}
    <Sequence from={LEAD + SEG * 3} durationInFrames={TAIL}>
      <Freeze frame={SEG - 1}>
        <OffthreadVideo src={staticFile(SEG_C)} startFrom={0} endAt={SEG} style={VIDEO} />
      </Freeze>
    </Sequence>

    <Caption text="三枚金针，原著里她全用了——最后一枚，是求他别死。" start={12} end={228} duration={TOTAL} inSide={0} outSide={0} />
  </AbsoluteFill>
);

export default S16;
