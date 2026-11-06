/* S28 · 她把剑从背上取下，放进木匣，合上 210f
 * v10 §二.5 / §五（P0）。底图 p-sword-case 已画到「剑已横在匣口、匣盖开着、灯在左」的那一下，
 * 所以本镜不再重演「从背上取下」的前半段，只接两件已写好的东西：
 *   ① Objects.Sword 的位移/旋转：干笔剑影（multiply、半透）从匣口上方沿剑轴「横置落匣」，
 *      落位后化回底图（不新画第二柄实物剑）；
 *   ② 匣口收光：剑落定后匣口暗下去（合匣），顶边一线纸白反光收住。
 * 底图名、时长、字幕文案都不动；转场入墨洇（12f）/ 出硬切。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { Scene } from '../components/SceneKit';
import { Caption } from '../components/Caption';
import { Sword } from '../components/Objects';
import { colors } from '../../../brand/tokens';
import { CLAMP, CURVES } from '../motion-tokens';

/** 底图实测（1920×1080）：剑尖 (650,770) → 剑柄 (990,645)，剑轴约 −20°，静置中心 (820,708)，
 *  剑长约 365px；剑匣口暗部是 (625,755)-(1105,700)-(1122,772)-(640,827) 那块。 */
const SWORD = { cx: 820, cy: 708, w: 83, h: 365 };
const CASE_MOUTH = '625,755 1105,700 1122,772 640,827';
/** 竖直剑形的「剑尖朝下」转到与剑轴 −20° 对齐时，逆时针转 70°；起始再立一点（38°）。 */
const ROT_OPEN = 38;
const ROT_FLAT = 70;

const S28: FC = () => {
  const f = useCurrentFrame();
  const ease = { ...CLAMP, easing: CURVES.cineEaseInOut };
  /* 横置落匣：20–128f。剑影从 38° 放平到 70°（70° 时与底图剑轴完全对齐：
   * 竖直剑形旋转 70° 后剑尖指向左下 (650,770)、剑柄指向右上 (990,645)），
   * 同时沿剑轴沉下十几像素；150–200f 化回底图。剑穗在旋转后不随重力下坠，用 inset 裁掉。 */
  const lay = interpolate(f, [20, 128], [0, 1], ease);
  const echo = interpolate(f, [20, 70, 128, 200], [0, 0.42, 0.42, 0], CLAMP);
  const rot = ROT_OPEN + (ROT_FLAT - ROT_OPEN) * lay;
  const echoX = (1 - lay) * 16;
  const echoY = (1 - lay) * -10;
  /* 合匣：140–200f 匣口收光，末帧整镜再压一点（剑收进木匣，灯被盖住） */
  const close = interpolate(f, [140, 200], [0, 1], ease);
  return (
    <Scene name="p-sword-case" zoom={[1.0, 1.04]} dim={0.06 + close * 0.05} warm={0.04}>
      <div
        style={{
          position: 'absolute',
          left: SWORD.cx - SWORD.w / 2 + echoX,
          top: SWORD.cy - SWORD.h / 2 + echoY,
          width: SWORD.w,
          height: SWORD.h,
          transform: `rotate(${rot}deg)`,
          opacity: echo,
          mixBlendMode: 'multiply',
          filter: 'blur(0.6px)',
          clipPath: 'inset(0 0 11% 0)',
        }}
      >
        <Sword state="back" style={{ width: '100%', height: '100%' }} />
      </div>
      <AbsoluteFill style={{ pointerEvents: 'none' }}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }}>
          {/* 合匣：匣口的暗收上去（盖合，灯照不进去） */}
          <polygon points={CASE_MOUTH} fill={colors.ink} opacity={0.44 * close} style={{ mixBlendMode: 'multiply' }} />
          {/* 盖沿一线纸白反光，收在顶边上 */}
          <path
            d="M625 755 L1105 700"
            stroke={colors.paperMuted}
            strokeWidth={1.4}
            opacity={0.3 * close}
            style={{ mixBlendMode: 'screen' }}
          />
        </svg>
      </AbsoluteFill>
      <Caption text="剑收进木匣，再也没有取出来。" start={56} end={194} />
    </Scene>
  );
};

export default S28;