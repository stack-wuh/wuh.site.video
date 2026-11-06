/* S19 · 一个人的雪山：她极小的背影独自朝画面深处走 210f
 *
 * design-v11 §3.6（用户意见 9「叶子意义是什么？她一人雪山慢慢走远，孤独感更好」）：
 *   v10 的雕羽与落羽动效**全部删掉**（不得出现任何羽毛状物体）；
 *   孤独感改由「留不住痕迹」给：
 *     · 底图 p-snow-walk：雪山脊大远景，她极小的背影（画面高 ~8%）走在雪脊上，朝景深走；
 *     · 镜头极缓后拉 zoom 1.06 → 1.0（她越走越小，观众留在原地看她走远）；
 *     · 雪片斜落（风向右 12px/s）——SnowFall 的 wind 与 DustField 同口径（px/秒）；
 *     · 她走过处一串脚印（FootprintTrail，近大远小），末 30f 新雪把最近两枚盖住（软斑淡入）。
 * 底图由美术组生成；人物在底图里，本镜不再叠第二个身影。
 */
import type { FC } from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { InkGrade } from '../components/SceneKit';
import { Caption } from '../components/Caption';
import { FootprintTrail, footprintTrail } from '../components/b-footprints';
import { MistFlow } from '../components/b-mistflow';
import { SnowFall } from '../components/b-snowfall';
import { CLAMP, CURVES } from '../motion-tokens';

/** 底图：雪山脊大远景（她极小背影在雪脊上，朝景深走） */
const BASE = 'p-snow-walk';
const EASE = { ...CLAMP, easing: CURVES.cineEaseInOut };
/** 本镜时长（manifest 固定 210f；不用 useVideoConfig——整片里拿到的是根 comp 时长） */
const TOTAL = 210;

/** 脚印这条路（底图到位后按雪脊走线校准）：前景下缘 → 她的脚下。
 *  from 最近（大），to 最远（小）；ctrl 让整串跟着雪脊的弯走。 */
const TRAIL = {
  from: { x: 250, y: 1062, s: 34 },
  ctrl: { x: 430, y: 952, s: 14 },
  to: { x: 606, y: 852, s: 6 },
  count: 16,
};

const S19: FC = () => {
  const f = useCurrentFrame();
  const total = TOTAL;

  /* 极缓后拉：1.06 → 1.0（前 34f 先定住，让墨洇退完之后再动） */
  const pull = interpolate(f, [34, total - 1], [0, 1], EASE);
  const scale = 1.06 - 0.06 * pull;

  /* 末 30f：新雪把最近两枚脚印盖住 */
  const cover = interpolate(f, [total - 30, total - 3], [0, 1], EASE);

  const points = footprintTrail(TRAIL.from, TRAIL.ctrl, TRAIL.to, TRAIL.count, 's19-prints');

  return (
    <AbsoluteFill style={{ background: colors.paper, overflow: 'hidden' }}>
      <Img
        src={staticFile(`zhi-guo-xiang/scene/${BASE}.jpg`)}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${scale})`,
        }}
      />
      <InkGrade />

      {/* 贴雪脊走的薄雾：只在雪面上浮，不遮人脸（她没有脸） */}
      <MistFlow seed="s19-mist" intensity={0.5} period={260} count={3} />

      {/* 一串脚印：近大远小、左右脚交错；末 30f 最近两枚被新雪盖掉 */}
      <FootprintTrail points={points} cover={cover} coverCount={2} opacity={0.95} />

      {/* 雪片斜落：风向右 12px/s */}
      <SnowFall seed="s19-snow" count={130} wind={12} opacity={0.85} />

      {/* 新雪起时，画面末段再飘一层极淡的白（只压雪脊，不压字幕） */}
      {cover > 0.01 ? <AbsoluteFill style={{ background: colors.paper, opacity: 0.08 * cover, pointerEvents: 'none' }} /> : null}

      <Caption cue="s19" tone="ink" />
    </AbsoluteFill>
  );
};

export default S19;