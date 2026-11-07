/* S11 · 她的肩后视角：他抬手到面具，面具离脸的一瞬，光从面具边缘漫出来吞掉他的脸 360f（12s）
 *
 * v12 分镜：中·过肩，双人同框，光驱动。观众**看不见他的脸**——这是全片的铁律（杨过永远不给脸），
 * 所以这一镜的戏是「光把脸吃掉」，不是「摘下了一张面具」。
 *
 * 本轮时长 240f → 360f（12s）。郭襄第一次真正看见他的脸，12 秒要撑得住，所以整条光的时间轴往后压：
 *   0–132f   静：他抬手到面具（在底图里），两人之间只有薄雾；光只有底图自己那一点点；
 *   132–178f 「面具离脸」的一瞬：先一下短闪（16f 峰值），稿子的心脏就在这一下；
 *   178–300f 光漫开、把五官洗平（光越大越软，他的脸就越读不出来）；
 *   300–330f 光与雾都收住，不再变；
 *   330–360f **静止一秒**：镜头停、光停、雾停，只剩空气里的尘慢慢落下来。
 * 镜内不做全屏黑/白，转场归 ShotShell（入「切」，出「墨洇」）。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ShotScene } from '../components/e-scene';
import { Caption } from '../components/Caption';
import { LocalMist } from '../components/c-fog';
import { DustField } from '../components/DustField';
import { CLAMP, CURVES } from '../motion-tokens';

const TOTAL = 360;
/** 面具 / 脸的位置（宽容取值：光是大圆，不追五官） */
const MASK = { x: 1245, y: 252 };
/** 两人之间的雾 */
const BETWEEN = { x: 900, y: 640 };
/** 结尾静止的起点：之后一帧都不再变（镜头也停） */
const HOLD = 330;

const S11: FC = () => {
  const f = useCurrentFrame();
  /* 推近：330f 走到位就停住，最后 1 秒镜头不动 */
  const cam = Math.min(1, f / HOLD);

  /* ① 光：132f 起短闪，178f 后漫开，300f 基本长成，330f 收住 */
  const flash = interpolate(f, [132, 148, 178], [0, 1, 0], CLAMP);
  const grow = interpolate(f, [132, 300, HOLD], [0, 0.88, 1], { ...CLAMP, easing: CURVES.cineEaseOut });
  const halo = 240 + 660 * grow;
  const core = 90 + 300 * grow;
  /* ② 雾：等光起来之后才从两人之间长起来（150–310f 走完） */
  const mist = interpolate(f, [150, 310], [0, 0.85], { ...CLAMP, easing: CURVES.cineEaseInOut });
  /* ③ 尘：结尾 1 秒收一点，让画面真的静下来 */
  const dust = interpolate(f, [310, 344], [1, 0.55], CLAMP);

  return (
    <ShotScene name="p-unmask-her" total={TOTAL} frame={f} progress={cam} zoom={[1.0, 1.045]} dim={0.03}>
      {/* ①a 大光晕：面具边缘漫出来的那一片（screen，宽而软） */}
      <div
        style={{
          position: 'absolute',
          left: MASK.x - halo,
          top: MASK.y - halo * 0.82,
          width: halo * 2,
          height: halo * 1.64,
          borderRadius: '50%',
          background: `radial-gradient(ellipse 50% 50% at 50% 50%, ${colors.paper} 0%, ${colors.gold} 34%, transparent 72%)`,
          opacity: 0.06 + 0.16 * grow,
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
          background: `radial-gradient(circle, ${colors.paper} 0%, ${colors.gold} 38%, transparent 70%)`,
          opacity: 0.1 + 0.22 * grow + 0.24 * flash,
          filter: 'blur(38px)',
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
      />
      {/* ①c 洗掉脸：一层纸色从面具位置泛开（不画五官，只让五官读不出来） */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 27% 22% at ${(MASK.x / 1920) * 100}% ${(MASK.y / 1080) * 100}%, rgba(245,240,232,0.9) 0%, rgba(245,240,232,0.38) 46%, transparent 76%)`,
          opacity: 0.08 + 0.22 * grow,
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
      />

      {/* ② 两人之间的雾（湿接） */}
      <LocalMist at={BETWEEN} progress={mist} seedBase="s11-between" spread={300} rise={260} count={4} strength={0.8} />

      {/* ③ 光里的尘：光一起来，尘才显影；结尾收一点 */}
      <AbsoluteFill style={{ opacity: dust, pointerEvents: 'none' }}>
        <DustField act={3} count={26} seedBase="s11-motes" wind={3} />
      </AbsoluteFill>

      {/* 她的肩背那一侧压一档（前景剪影），光从他那一侧来 */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(90deg, ${colors.ink} 0%, transparent 34%)`,
          opacity: 0.24,
          mixBlendMode: 'multiply',
          pointerEvents: 'none',
        }}
      />
      <Caption cue="s11" tone="ink" />
    </ShotScene>
  );
};

export default S11;