/* S12 · 她的肩后视角：他抬手到面具，面具离脸的一瞬，光从面具边缘漫出来吞掉他的脸 210f
 *
 * v12 分镜：中·过肩，双人同框，光驱动。观众**看不见他的脸**——这是全片的铁律（杨过永远不给脸），
 * 所以这一镜的戏是「光把脸吃掉」，不是「摘下了一张面具」。
 *
 * 底图 `p-unmask-her`（新，art-v12；她的侧后剪影在前景、他抬手到面具、两人间留雾）。
 * 代码只做光：
 *   ① 面具边缘亮起：64f 起，先一下短闪，再从面具位置漫开一大团暖白（screen）——
 *      光越大、越软，他的五官就越读不出来；末段用一层纸色洗过去，把「脸」彻底抹平；
 *   ② 两人之间的雾：LocalMist 从中间长起来（湿接，不是贴片）；
 *   ③ 光里的尘：光一起来，空气里的尘才看得见。
 * 光的位置按 art 口径（他抬手、面具在画面中偏右上方）给一个宽容的大圆，不追具体五官。
 * 转场：入「切」，出「墨洇」。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ShotScene } from '../components/e-scene';
import { LocalMist } from '../components/c-fog';
import { DustField } from '../components/DustField';
import { CLAMP, CURVES } from '../motion-tokens';

const TOTAL = 210;
/** 面具 / 脸的位置（宽容取值：光是大圆，不追五官） */
const MASK = { x: 1245, y: 252 };
/** 两人之间的雾 */
const BETWEEN = { x: 900, y: 640 };

const S12: FC = () => {
  const f = useCurrentFrame();
  /* ① 光的生长：64f 短闪，110f 撑满，之后缓慢再涨一点（不收回——脸不能再露出来） */
  const flash = interpolate(f, [64, 70, 88], [0, 1, 0], CLAMP);
  const grow = interpolate(f, [64, 130, TOTAL - 1], [0, 0.86, 1], { ...CLAMP, easing: CURVES.cineEaseOut });
  const halo = 240 + 660 * grow;
  const core = 90 + 300 * grow;
  /* ② 雾：80f 后从两人之间长起来 */
  const mist = interpolate(f, [80, 170], [0, 0.85], { ...CLAMP, easing: CURVES.cineEaseInOut });

  return (
    <ShotScene name="p-unmask-her" total={TOTAL} frame={f} zoom={[1.0, 1.05]} dim={0.03}>
      {/* ①a 大光晕：面具边缘漫出来的那一片（screen，宽而软） */}
      <div
        style={{
          position: 'absolute',
          left: MASK.x - halo,
          top: MASK.y - halo * 0.82,
          width: halo * 2,
          height: halo * 1.64,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse 50% 50% at 50% 50%, #f7edd2 0%, #e9d9ae 34%, transparent 72%)',
          opacity: 0.1 + 0.24 * grow,
          filter: 'blur(74px)',
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
      />
      {/* ①b 光心：面具那一圈金边被点亮（短闪叠在上面） */}
      <div
        style={{
          position: 'absolute',
          left: MASK.x - core,
          top: MASK.y - core,
          width: core * 2,
          height: core * 2,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #fdf6e2 0%, #f0dfb4 38%, transparent 70%)',
          opacity: 0.16 + 0.34 * grow + 0.26 * flash,
          filter: 'blur(38px)',
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
      />
      {/* ①c 洗掉脸：一层纸色从面具位置泛开（不画五官，只让五官读不出来） */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 34% 27% at ${(MASK.x / 1920) * 100}% ${(MASK.y / 1080) * 100}%, rgba(247,237,210,0.92) 0%, rgba(247,237,210,0.42) 46%, transparent 74%)`,
          opacity: 0.14 + 0.3 * grow,
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
      />

      {/* ② 两人之间的雾（湿接） */}
      <LocalMist at={BETWEEN} progress={mist} seedBase="s12-between" spread={300} rise={260} count={4} strength={0.8} />

      {/* ③ 光里的尘：光一起来，尘才显影 */}
      <DustField act={3} count={26} seedBase="s12-motes" wind={3} />

      {/* 她的肩背那一侧压一档（前景剪影），光从他那一侧来 */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(90deg, ${colors.ink} 0%, transparent 34%)`,
          opacity: 0.24,
          mixBlendMode: 'multiply',
          pointerEvents: 'none',
        }}
      />
    </ShotScene>
  );
};

export default S12;