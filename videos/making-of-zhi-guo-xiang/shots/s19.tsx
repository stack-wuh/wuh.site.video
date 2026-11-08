/* s19 · 于是故事按原著，全部重写。（150f · 5.0s，Act 4 · v3.1 帧数再分配 120→150，句 18 旁白窗解围）
 *
 * 素材镜双段跳切（M8 风陵渡 → 万兽山庄，跳切只在镜内）：
 *   0–74   `seg-v12-fengling-wanbeast-a-v1`（母带 32–35.5s，取前 2.5s：startFrom 0 endAt 75）
 *   75–149 `seg-v12-fengling-wanbeast-b-v1`（母带 78–81.5s，取前 2.5s）—— 中点硬切。
 * 转场：入「切」/ 出「墨洇」（出遮罩由装配层 ShotShell 挂）。
 * 字幕窗 [12,118]（150f 镜、出侧墨洇 20f：上限 = 150−20−12 = 118）。
 */
import type { CSSProperties, FC } from 'react';
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile } from 'remotion';
import { colors } from '../../../brand/tokens';
import { Caption } from '../components/Caption';

const TOTAL = 150;
const HALF = 75; // 每段取前 2.5s = 75f
const VIDEO: CSSProperties = { width: '100%', height: '100%', objectFit: 'cover' };

const S19: FC = () => (
  <AbsoluteFill style={{ background: colors.bg }}>
    {/* a：风陵渡 */}
    <Sequence from={0} durationInFrames={HALF}>
      <OffthreadVideo
        src={staticFile('making-of-zhi-guo-xiang/segments/seg-v12-fengling-wanbeast-a-v1.mp4')}
        startFrom={0}
        endAt={HALF}
        style={VIDEO}
      />
    </Sequence>
    {/* b：万兽山庄（硬切） */}
    <Sequence from={HALF} durationInFrames={TOTAL - HALF}>
      <OffthreadVideo
        src={staticFile('making-of-zhi-guo-xiang/segments/seg-v12-fengling-wanbeast-b-v1.mp4')}
        startFrom={0}
        endAt={HALF}
        style={VIDEO}
      />
    </Sequence>

    <Caption text="于是故事按原著，全部重写。" start={12} end={118} duration={TOTAL} inSide={0} outSide={20} />
  </AbsoluteFill>
);

export default S19;
