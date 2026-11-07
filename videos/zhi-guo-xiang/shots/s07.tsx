/* S07 · 客栈里有人说起「神雕侠」；她抬眼，暗部里只有火光的一点落在瞳仁上（脸 1）210f
 *
 * v12 分镜：近·暗部侧影 + 火光点。底图 `p-eyefire`（她侧后仰脸，底图里瞳仁已经是暖琥珀色）。
 * 全片只给三次脸，这是第一次——**给脸的理由是「好奇」**，所以这一镜的戏全在眼睛上。
 *
 * 代码只做光，不碰五官：
 *   ① 暗部：整幅压一档 + 只留她眼周一圈亮（radial multiply 的外圈），其余（肩、发、背景）沉进暗里；
 *   ② 火光：画面左下（火塘方向，底图外）一团火金在呼吸，给她的轮廓一道暖边；
 *   ③ 瞳火：两个瞳位（实测 (731,440) / (919,419)）上一粒小火金 + 极淡的光晕；
 *      52–74f 抬眼那一下亮到峰，之后随火光轻轻抖——「她听了一夜」就是这一点光不灭；
 *   ④ 灰烬：暗部里慢慢升的几粒余烬（不是雪、不是尘，是火塘的灰）。
 * 转场：入「墨洇」，出「墨洇」。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ShotScene } from '../components/e-scene';
import { Caption } from '../components/Caption';
import { WarmBloom } from '../components/e-firelight';
import { EmberField } from '../components/e-emberfield';
import { CLAMP, FILM } from '../motion-tokens';

const TOTAL = 210;
/** 两瞳位（p-eyefire 实测） */
const PUPILS = [
  { x: 731, y: 440 },
  { x: 919, y: 419 },
] as const;

const TAU = Math.PI * 2;

const S07: FC = () => {
  const f = useCurrentFrame();
  /* 抬眼：52–74f 瞳光亮到峰；之后按火光频率抖 */
  const lift = interpolate(f, [52, 74], [0, 1], { ...CLAMP, easing: (t) => t * t * (3 - 2 * t) });
  const flick = 0.78 + 0.22 * Math.sin((f / 24) * TAU);

  return (
    <ShotScene name="p-eyefire" total={TOTAL} frame={f} zoom={[1.02, 1.09]} driftY={[4, -4]} dim={0.18}>
      {/* ① 暗部：外圈吃掉，只留眼周 */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse 36% 30% at 43% 40%, rgba(43,38,32,0) 0%, rgba(43,38,32,0.62) 58%, rgba(43,38,32,0.9) 100%)',
          mixBlendMode: 'multiply',
          pointerEvents: 'none',
        }}
      />
      {/* ①b 上缘再压一道：客栈屋顶在头顶，暗从上面来 */}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(180deg, rgba(43,38,32,0.68) 0%, rgba(43,38,32,0.18) 26%, transparent 44%)',
          mixBlendMode: 'multiply',
          pointerEvents: 'none',
        }}
      />

      {/* ② 火塘在画面左下的光（底图外），给她一道暖边 */}
      <WarmBloom at={{ x: 210, y: 1010 }} r={560} squash={0.72} opacity={0.14} period={24} breath={0.55} blur={80} />

      {/* ③ 瞳火：一粒火金 + 一圈极淡光晕，抬眼那一下最亮 */}
      {PUPILS.map((p, i) => {
        const env = (0.3 + 0.7 * lift) * flick * (1 - i * 0.08);
        const r = 32 + 8 * lift;
        return (
          <div key={`${p.x}-${p.y}`} style={{ position: 'absolute', left: p.x, top: p.y, pointerEvents: 'none' }}>
            <div
              style={{
                position: 'absolute',
                left: -r,
                top: -r * 0.7,
                width: r * 2,
                height: r * 1.4,
                borderRadius: '50%',
                background: `radial-gradient(ellipse, ${FILM.fireGold} 0%, transparent 62%)`,
                opacity: 0.4 * env,
                filter: 'blur(5px)',
                mixBlendMode: 'screen',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: -1.9,
                top: -1.9,
                width: 3.8,
                height: 3.8,
                borderRadius: 2,
                background: colors.paper,
                opacity: 0.45 + 0.5 * env,
                mixBlendMode: 'screen',
              }}
            />
            {/* 极短的十字闪：让 ≤4px 的瞳火在 1080p 里真的被看见（不是把点做大） */}
            <div
              style={{
                position: 'absolute',
                left: -7,
                top: -0.4,
                width: 14,
                height: 0.8,
                background: FILM.fireGold,
                opacity: 0.34 * env,
                mixBlendMode: 'screen',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: -0.4,
                top: -7,
                width: 0.8,
                height: 14,
                background: FILM.fireGold,
                opacity: 0.28 * env,
                mixBlendMode: 'screen',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: -1.3,
                top: -1.3,
                width: 2.6,
                height: 2.6,
                borderRadius: 2,
                background: FILM.fireGold,
                opacity: env,
                mixBlendMode: 'screen',
              }}
            />
          </div>
        );
      })}

      {/* ④ 灰烬：从下面慢慢升上来（只有几粒，暗部里才看得见） */}
      <EmberField seedBase="s07" at={{ x: 900, y: 1120 }} spread={720} rise={620} count={8} period={150} sizeBase={0.9} opacity={0.7} windX={-0.06} />

      {/* ①c 地面压暗：火光照不到的下半张吃掉，暗部才是「暗部」 */}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(0deg, rgba(43,38,32,0.55) 0%, rgba(43,38,32,0.14) 22%, transparent 40%)',
          mixBlendMode: 'multiply',
          pointerEvents: 'none',
        }}
      />

      {/* 角晕：把她从客栈的背景里拔出来 */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse 74% 70% at 46% 44%, transparent 40%, rgba(43,38,32,0.56) 100%)',
          mixBlendMode: 'multiply',
          pointerEvents: 'none',
        }}
      />
      <Caption cue="s07" tone="paper" />
    </ShotScene>
  );
};

export default S07;