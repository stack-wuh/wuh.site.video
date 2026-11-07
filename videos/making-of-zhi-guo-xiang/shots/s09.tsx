/* s09 · 先简后精——节奏对了，才配拥有颜色。（180f · 6.0s，Act 2，v3.1 再分配）
 *
 * M7↔M1 同帧位对切：`seg-animatic-open-v1`（M7 简板）与 `seg-evolution-v8-open-v1`（M1 v8）
 * 两源同帧位（源帧 = 局部帧），MO-CUT-FLIP 硬切（1f 内完成）、MO-CMP-FLIP-GAP=15f 节拍：
 *   0–59    M7 animatic（简）
 *   60–74   M1 v8（精）——第一次对切
 *   75–89   M7（简）
 *   90–179  M1 v8（精）——第二次对切后停在「精」（节奏对了，才配拥有颜色）
 * 左上角 MO-CMP-LABEL 小字角标「animatic / v8」，labelFade 6f 淡入。
 * 转场：入「切」/ 出「墨洇」（s10 的 inbound，装配层遮罩）。字幕窗 [12,148]。
 */
import type { CSSProperties, FC } from 'react';
import { AbsoluteFill, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { Caption } from '../components/Caption';
import { CLAMP, MO_CMP } from '../motion-tokens';

const TOTAL = 180;
const GAP = MO_CMP.flipGap; // 15f 对切节拍
const A = 'making-of-zhi-guo-xiang/segments/seg-animatic-open-v1.mp4'; // M7 简板
const B = 'making-of-zhi-guo-xiang/segments/seg-evolution-v8-open-v1.mp4'; // M1 v8
const VIDEO: CSSProperties = { width: '100%', height: '100%', objectFit: 'cover' };

const S09: FC = () => {
  const f = useCurrentFrame();
  const labelIn = interpolate(f, [0, MO_CMP.labelFade], [0, 1], CLAMP);

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      {/* 同帧位四段：两源按 15f 节拍硬切，段内源帧与局部帧对齐 */}
      <Sequence from={0} durationInFrames={GAP * 4}>
        <OffthreadVideo src={staticFile(A)} startFrom={0} endAt={GAP * 4} style={VIDEO} />
      </Sequence>
      <Sequence from={GAP * 4} durationInFrames={GAP}>
        <OffthreadVideo src={staticFile(B)} startFrom={GAP * 4} endAt={GAP * 5} style={VIDEO} />
      </Sequence>
      <Sequence from={GAP * 5} durationInFrames={GAP}>
        <OffthreadVideo src={staticFile(A)} startFrom={GAP * 5} endAt={GAP * 6} style={VIDEO} />
      </Sequence>
      <Sequence from={GAP * 6} durationInFrames={TOTAL - GAP * 6}>
        <OffthreadVideo src={staticFile(B)} startFrom={GAP * 6} endAt={TOTAL} style={VIDEO} />
      </Sequence>
      {/* MO-CMP-LABEL：左上角小字角标 */}
      <div
        style={{
          position: 'absolute',
          left: 56,
          top: 48,
          opacity: labelIn,
          background: colors.paper,
          color: colors.ink,
          borderRadius: 4,
          padding: '6px 14px',
          fontFamily: fontFamilies.mono,
          fontSize: 17,
          letterSpacing: 2,
        }}
      >
        animatic / v8
      </div>
      <Caption text="先简后精——节奏对了，才配拥有颜色。" start={12} end={148} duration={TOTAL} inSide={0} outSide={20} />
    </AbsoluteFill>
  );
};

export default S09;
