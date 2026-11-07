/* s36 · 有人问：一条四分半的片子，至于改十一版吗。（240f · 8.0s，Act 8 终·执念）
 *
 * 黑场计数镜（MO-COUNTER-FINAL，本片视觉签名的收束一击）：
 * colors.bg 满幅黑场，居中超大「11」纸面色数字（serif 墨字骨架，全程同一套）——
 *   0–119f  定格 1.0（前 20f 由墨洇入遮罩从实墨里退开显影，镜内不再加动画）；
 *   120–239f MO_COUNTER.finalFrames 起手后缓慢放大 1.0 → MO_COUNTER.finalTo（MO-EASE-INOUT）。
 * 其余留黑，不做任何收尾淡出（出「切」）。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { Caption } from '../components/Caption';
import { CLAMP, MO_COUNTER, MO_EASE } from '../motion-tokens';

const TOTAL = 240;

const S36: FC = () => {
  const f = useCurrentFrame();
  /* 定格 MO_COUNTER.finalFrames 后缓慢放大到 finalTo（缓推定场） */
  const scale = interpolate(f, [MO_COUNTER.finalFrames, TOTAL - 1], [1, MO_COUNTER.finalTo], {
    ...CLAMP,
    easing: MO_EASE.inout,
  });

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            fontFamily: fontFamilies.serif,
            fontSize: 380,
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: 10,
            color: colors.paper,
            transform: `scale(${scale})`,
          }}
        >
          11
        </div>
      </AbsoluteFill>

      <Caption
        text="有人问：一条四分半的片子，至于改十一版吗。"
        start={32}
        end={228}
        duration={TOTAL}
        inSide={20}
        outSide={0}
      />
    </AbsoluteFill>
  );
};

export default S36;
