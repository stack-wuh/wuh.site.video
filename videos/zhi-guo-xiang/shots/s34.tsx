/* S34 · 一颗墨珠落在第五行行末，洇开把那个字吃掉 180f
 *
 * v11 §3.11（与 S33 同一要求：去掉毛笔、整张重做）。本镜接 S33 的机位与光位：
 *   · 同一张案头纸 `p-paper-lamp`、同一组 InkPaper 参数（DESK_TEXT）、推镜从 S33 的落点 1.04 继续到 1.06；
 *   · 「先凝后落」：墨珠在第五行行末的湿墨上凝 30f（8px → 14px），脱手落 6f（二次曲线加速），
 *     落在字心；落定后 InkBloom 12f 洇开（r 8 → 90），RaggedBloom 补渗纸毛刺；
 *   · 底图没有砚入画，所以墨珠凝在行末的湿墨上（墨在笔锋上积够了才落）——不另画笔、不画砚，
 *     免得又出一个「素材贴错」的观感；判据「先凝后落」由时间轴承担；
 *   · 灯焰继续跳（与 S33 同一条灯），墨落纸那一下灯焰被压一档（jolt）。 */
import type { FC } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { Slide } from '../components/SceneKit';
import { InkPaper, POEM_COLS } from '../components/InkPaper';
import { InkBloom } from '../components/InkBloom';
import { LampFlame } from '../components/d-lamp';
import { DESK_LAST_CHAR, DESK_TEXT, InkDrop, RaggedBloom } from '../components/d-desk';
import { CLAMP } from '../motion-tokens';

/** 墨珠落点 = 第五行末字「和」的字心（与 S33 同一个常量）。 */
const CHAR = DESK_LAST_CHAR;
/** InkBloom 的可视中心比 at.y 低 0.35·r·progress，所以 at.y 上提 0.35·r 让墨心落在字心。 */
const BLOOM_R = 90;
const BLOOM_AT = { x: CHAR.x, y: CHAR.y - BLOOM_R * 0.35, r: BLOOM_R };

const GATHER = [22, 52] as const;
const FALL = [52, 58] as const;
const BLOOM_START = 58;
const BLOOM_END = 70;

const S34: FC = () => {
  const f = useCurrentFrame();
  /* InkBloom 的 progress 是半径比例：8/90 → 1，正好是「半径 8 → 90，12f」 */
  const bloom = interpolate(f, [BLOOM_START, BLOOM_END], [8 / BLOOM_R, 1], CLAMP);
  const rag = interpolate(f, [BLOOM_START, BLOOM_END], [0, 1], CLAMP);
  /* 墨落进纸里那一下：灯焰被压一档（3f 冲击，12f 回稳） */
  const jolt = interpolate(f, [FALL[1], FALL[1] + 3, FALL[1] + 12], [0, 1, 0], CLAMP);
  return (
    <Slide zoom={[1.04, 1.06]} warm={0.02}>
      <InkPaper
        base="p-paper-lamp"
        lines={[POEM_COLS[6], POEM_COLS[7]]}
        progress={DESK_TEXT.progress}
        size={DESK_TEXT.size}
        right={DESK_TEXT.right}
        top={DESK_TEXT.top}
      >
        <LampFlame frame={f} at={{ x: 112, y: 220 }} size={32} jolt={jolt} />
        <InkDrop frame={f} at={CHAR} gather={GATHER} fall={FALL} />
        <InkBloom progress={bloom} at={BLOOM_AT} r={BLOOM_R} opacity={0.92} blur={1} />
        <RaggedBloom progress={rag} at={CHAR} r={92} opacity={0.88} />
      </InkPaper>
    </Slide>
  );
};

export default S34;