import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { CLAMP, MO_CAP, MO_EASE } from '../motion-tokens';
import { INK_MASK_Z } from './ShotShell';

/**
 * 一镜一句字幕（MO-CAP-*，storyboard §三 的组件内自动对账兜底）：
 * 窗口 = [镜首入遮罩后 side, 镜尾出遮罩前 side]，start/end 违窗直接抛错（fail loud，不留静默漂移）。
 * 落点纪律（task-9 对位后回填）：start = 旁白 start − 2f、end = 旁白 end + 16f，再夹进安全窗。
 * 字幕层 zIndex 压在墨层之上（INK_MASK_Z + 1），不被转场吞。
 */
export const Caption: FC<{
  text: string;
  /** 字幕起止（局部帧；实装时由旁白落点反推） */
  start: number;
  end: number;
  /** 本镜时长（局部帧总数） */
  duration: number;
  /** 本镜 inbound / outbound 单侧帧数（TRANSITION_SIDE） */
  inSide?: number;
  outSide?: number;
}> = ({ text, start, end, duration, inSide = 0, outSide = 0 }) => {
  const f = useCurrentFrame();
  const lo = inSide + MO_CAP.side;
  const hi = duration - outSide - MO_CAP.side;
  if (start < lo || end > hi) {
    throw new Error(`字幕窗违规：[${start},${end}] 落不进安全窗 [${lo},${hi}]（镜长 ${duration}f，in ${inSide}/out ${outSide}）——缩句或调槽位`);
  }
  const appear = interpolate(f, [start, start + MO_CAP.inFrames], [0, 1], { ...CLAMP, easing: MO_EASE.out });
  const disappear = interpolate(f, [end - MO_CAP.outFrames, end], [1, 0], CLAMP);
  const opacity = Math.min(appear, disappear);
  const rise = (1 - appear) * MO_CAP.shiftPx;
  if (opacity <= 0) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', zIndex: INK_MASK_Z + 1, justifyContent: 'flex-end' }}>
      <div
        style={{
          margin: '0 auto',
          marginBottom: 72,
          maxWidth: '78%',
          padding: '10px 22px',
          borderRadius: 6,
          background: colors.ink,
          color: colors.paper,
          fontSize: 34,
          letterSpacing: 2,
          lineHeight: 1.4,
          textAlign: 'center',
          opacity,
          transform: `translateY(${rise}px)`,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
