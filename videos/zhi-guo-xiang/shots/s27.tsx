/* S27 · 雪山独行 · 每次都晚三天（210f · 入「墨洇」）
 *
 * v12 分镜 Act 6：雪山脊大远景，她极小的背影朝深处走，一串脚印，新雪把最近两枚盖住。
 * 底图 `p-snow-walk`（人物约 10% 画高，雪脊对角线，枯木，留白多）。
 *
 * 孤独感不靠代码画人，靠三件「留不住」：
 *   · 镜头极缓后拉 1.06 → 1.0 —— 她越走越小，观众留在原地看她走远；
 *   · 雪片斜落（风向右 12px/s，与 DustField 同口径）；
 *   · 她走过处一串脚印（FootprintTrail，近大远小），末 30f 新雪把最近两枚盖住——
 *     连痕迹也留不住。
 * 人物在底图里，本镜不叠第二个身影；随机全部走 random(seed)。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ShotScene } from '../components/e-scene';
import { Caption } from '../components/Caption';
import { FootprintTrail, footprintTrail } from '../components/b-footprints';
import { MistFlow } from '../components/b-mistflow';
import { SnowFall } from '../components/b-snowfall';
import { CLAMP, CURVES } from '../motion-tokens';

/** 底图：雪山脊大远景（她极小背影在雪脊上，朝景深走） */
const BASE = 'p-snow-walk';
const EASE = { ...CLAMP, easing: CURVES.cineEaseInOut };
const TOTAL = 210;

/** 脚印这条路（量自 p-snow-walk 雪脊走线）：前景下缘 → 她的脚下。
 *  from 最近（大），to 最远（小）；ctrl 让整串跟着雪脊的弯走。 */
const TRAIL = {
  from: { x: 250, y: 1062, s: 34 },
  ctrl: { x: 430, y: 952, s: 14 },
  to: { x: 606, y: 852, s: 6 },
  count: 16,
};

const S28: FC = () => {
  const f = useCurrentFrame();

  /* 极缓后拉：1.06 → 1.0（前 34f 先定住，让墨洇退完之后再动） */
  const pull = interpolate(f, [34, TOTAL - 1], [0, 1], EASE);

  /* 末 30f：新雪把最近两枚脚印盖住 */
  const cover = interpolate(f, [TOTAL - 30, TOTAL - 3], [0, 1], EASE);

  const points = footprintTrail(TRAIL.from, TRAIL.ctrl, TRAIL.to, TRAIL.count, 's28-prints');

  return (
    <ShotScene name={BASE} total={TOTAL} frame={f} zoom={[1.06, 1.0]} progress={pull}>

      {/* 贴雪脊走的薄雾：只在雪面上浮，不遮人（她没有脸） */}
      <MistFlow seed="s28-mist" intensity={0.5} period={260} count={3} />

      {/* 一串脚印：近大远小、左右脚交错；末 30f 最近两枚被新雪盖掉 */}
      <FootprintTrail points={points} cover={cover} coverCount={2} opacity={0.95} />

      {/* 雪片斜落：风向右 12px/s */}
      <SnowFall seed="s28-snow" count={130} wind={12} opacity={0.85} />

      {/* 新雪起时，画面末段再飘一层极淡的白（只压雪脊，不压字幕） */}
      {cover > 0.01 ? (
        <AbsoluteFill style={{ background: colors.paper, opacity: 0.08 * cover, pointerEvents: 'none' }} />
      ) : null}

      <Caption cue="s27" tone="ink" />
    </ShotScene>
  );
};

export default S28;