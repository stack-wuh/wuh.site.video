/* s36 · 有人问：一条四分半的片子，至于改十一版吗。（240f · 8.0s，Act 8 终·执念）
 *
 * 黑场计数镜（MO-COUNTER-FINAL，本片视觉签名的收束一击）：
 * colors.bg 满幅黑场，居中超大数字（serif，纸面色）——**MO-NUM-ROLL 逐版快滚（凡量必滚）**：
 *   0–119f  1→11 逐版跳数（每版一跳，越跳越快：20f 起步、间隔按幂曲线收缩至 116f 收官），
 *           每跳 MO_COUNTER.digitPop 弹跳（0.92→1，8f，MO-EASE-BACK）——计数母题在此收官；
 *   120–239f MO_COUNTER.finalFrames 起手后缓慢放大 1.0 → MO_COUNTER.finalTo（MO-EASE-INOUT）。
 * 其余留黑，不做任何收尾淡出（出「切」）。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { Caption } from '../components/Caption';
import { CLAMP, MO_COUNTER, MO_EASE } from '../motion-tokens';

const TOTAL = 240;
/** 逐版跳数落点：1 在 20f（墨洇退开后），11 收官于 116f——间隔按幂曲线收缩（越跳越快） */
const TICKS = Array.from({ length: 11 }, (_, i) => 20 + Math.round(96 * Math.pow(i / 10, 1.35)));

const S36: FC = () => {
  const f = useCurrentFrame();
  /* 当前版本数：最后一个 ≤ f 的落点 */
  const value = TICKS.reduce((acc, t, i) => (f >= t ? i + 1 : acc), 1);
  /* 每跳弹跳（digit-pop 同构） */
  const tickStart = TICKS[value - 1];
  const pop = interpolate(f, [tickStart, tickStart + MO_COUNTER.digitPopFrames], [MO_COUNTER.digitPopFrom, 1], {
    ...CLAMP,
    easing: MO_EASE.back,
  });
  /* 数完后的缓慢放大定场 */
  const zoom = interpolate(f, [MO_COUNTER.finalFrames, TOTAL - 1], [1, MO_COUNTER.finalTo], {
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
            fontVariantNumeric: 'tabular-nums',
            transform: `scale(${(zoom * pop).toFixed(3)})`,
          }}
        >
          {value}
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
