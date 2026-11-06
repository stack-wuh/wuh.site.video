/* S20 · 茶馆·说书人（180f）—— v11 §3.7 / 用户意见 10：「想表达茶馆的话，出现说书人、周围都是过客更好」
 *
 * 底图 p-teahouse（cand-1）把这一镜的活都画好了：说书人立在中后景案后（侧后、不给正脸）、
 * 四周长凳坐满过客背影、窗棂光柱、案上醒木与茶碗，**郭襄就坐在最外圈左下、很小、背向镜头**。
 * 所以本镜**不往人群里塞任何人物**（v10 就是塞出「一坨黑色」的）——只做三件事：
 *
 *   1) 同一间屋子的光与烟（c-teahouse 的 ROOM：窗光 + 茶烟 + 暗角）——S24 源出一处；
 *   2) 她这一角的一只茶碗：在她桌上（底图那只碗的位置）叠一只代码碗 + 一点暖光 + 水汽，
 *      让视线在满屋背影里落到那个最小的背影上（「她在人群里听别人的故事」）；这只碗
 *      就是 S24 里一路喝到空的那只，两镜同形同色；
 *   3) 60f 醒木落下：画面轻震 2px（阻尼回摆 30f 内停）+ 案上接触点一记淡墨 + 一记暖光脉冲
 *      + **茶烟被震散一下**；混音按 60f 留空，这里给的是可对齐的那一帧。
 *
 * 转场：入「切」（承接 S19 雪垭那一击）、出「墨洇」。无人物代码层 → 无纯黑剪影风险。
 * 字幕行原样保留（Lead 统一改查表）。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { CLAMP } from '../motion-tokens';
import { Scene } from '../components/SceneKit';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { InkBloom } from '../components/InkBloom';
import { TeaBowl } from '../components/c-teabowl';
import { RoomVignette, SoundPulse, TeaRoomLight } from '../components/c-teahouse';

/** 醒木落点：说书人案上木块的位置（量自底图 ≈ (1205, 552)）。 */
const GAVEL = { x: 1205, y: 552, r: 200 };
/** 醒木落下帧：与混音组的空点同帧。 */
const HIT = 60;
/** 她桌上那只素茶碗（与 S24 同一只）：量自底图 ≈ (346, 904)，碗口直径 ≈62px。 */
const HER_BOWL = { x: 330, y: 918 };
const HER_BOWL_SCALE = (62 / 184) * 1.02;

const S20: FC = () => {
  const f = useCurrentFrame();
  const since = f - HIT;

  /* 落下前 1px 提气（12f）+ 落下后阻尼回摆（振幅 2px、每 2.3f 换向、30f 内停）。
   * 只震画面层；字幕不跟着抖（字幕是纸上的字，不是镜头里的事）。 */
  const preLift = interpolate(f, [HIT - 14, HIT - 2], [0, -1], CLAMP);
  const decay = since >= 0 ? Math.exp(-since / 6.5) : 0;
  const shake = since >= 0 && since < 30 ? 1.9 * decay : 0;
  const sx = Math.sin((since / 2.3) * Math.PI) * shake;
  const sy = Math.cos((since / 2.3) * Math.PI) * shake * 0.55 + preLift;

  /* 那一声的两层回执：暖光脉冲（快起慢收）+ 窗光整体亮一档 + 茶烟被震散 */
  const pulse = since >= 0 && since < 34 ? Math.exp(-since / 8) : 0;
  const scatter = since >= 0 && since < 26 ? interpolate(since, [0, 6, 26], [0, 1, 0], CLAMP) : 0;

  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', inset: -10, transform: `translate(${sx}px, ${sy}px)` }}>
        <Scene name="p-teahouse" zoom={[1.0, 1.038]} driftX={[0, -7]} dim={0.02} warm={0.05}>
          {/* 窗光（底图自带光柱，代码只补一层很淡的漂移）+ 茶烟 */}
          <TeaRoomLight intensity={0.55 + 0.1 * pulse} scatter={scatter} smokeDrift={-4} />
          {/* 她那一角：一只碗、一点暖光、一口水汽——把人从满屋背影里点出来 */}
          <InkBloom
            progress={0.9}
            at={{ x: HER_BOWL.x, y: HER_BOWL.y - 26, r: 96 }}
            color={colors.gold}
            opacity={0.1}
            blur={26}
            style={{ mixBlendMode: 'screen' }}
          />
          <TeaBowl
            at={HER_BOWL}
            scale={HER_BOWL_SCALE}
            level={1}
            fingers={0}
            steam={0.34 + 0.05 * Math.sin((f / 110) * Math.PI * 2) + 0.2 * scatter}
          />
          {/* 落下那一声：案上接触点暖光脉冲 + 一记淡墨 */}
          <SoundPulse pulse={pulse} at={GAVEL} />
          {since >= 0 ? (
            <InkBloom
              progress={interpolate(since, [0, 8], [0.3, 1], CLAMP)}
              at={GAVEL}
              color={colors.ink}
              opacity={0.4 * (1 - interpolate(since, [4, 24], [0, 1], CLAMP))}
              blur={2}
            />
          ) : null}
          {/* 光柱里的浮尘：证明这间屋子有空气 */}
          <DustField act={4} count={34} seedBase="s20-room" wind={4} />
          <RoomVignette />
        </Scene>
      </div>
      <Caption cue="s20" tone="ink" />
    </AbsoluteFill>
  );
};

export default S20;