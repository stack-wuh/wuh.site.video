/* S08 · 夜里的渡口土路：一队奇装异服的人走远，她远远跟着 210f
 *
 * v12 分镜：大全·侧后跟，缓推。底图 `p-follow-guijus`（新，art-v12 出图；一队提灯的人 + 她的青灰背影都在画里）。
 *
 * 代码只做夜与灯：
 *   ① 夜色：整体压一档 + 上头一道冷墨（黄河边夜里的天比地亮）；
 *   ② 灯笼：FireLine 在土路中远景那一带点 7 盏暖灯（各自闪烁、整排极缓地远离），
 *      给「那一队人」一个活的证据；浓度压低，灯不能抢过底图里画的人；
 *   ③ 贴地雾：GroundMist 顺河风慢慢走，把土路下缘吃掉一点；
 *   ④ 光尘：极少量。
 * 缓推：1.0 → 1.06（跟着他们走）。
 * 转场：入「墨洇」，出「墨洇」。
 */
import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ShotScene } from '../components/e-scene';
import { FireLine, WarmBloom } from '../components/e-firelight';
import { GroundMist } from '../components/c-fog';
import { DustField } from '../components/DustField';

const TOTAL = 210;

const S08: FC = () => {
  const f = useCurrentFrame();
  return (
    <ShotScene name="p-follow-guijus" total={TOTAL} frame={f} zoom={[1.0, 1.06]} dim={0.06}>
      {/* ① 夜色：整幅压成墨蓝（底图是黄昏，这里要夜），土路仍被灯笼照暖 */}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(180deg, rgba(20,26,34,0.66) 0%, rgba(20,26,34,0.4) 34%, rgba(20,26,34,0.5) 100%)',
          mixBlendMode: 'multiply',
          pointerEvents: 'none',
        }}
      />
      {/* 灯笼照暖的那一段土路：夜压过之后把路找回来一点 */}
      <WarmBloom at={{ x: 980, y: 560 }} r={440} squash={0.34} opacity={0.07} period={30} breath={0.3} blur={80} />
      {/* 她（画面右下）脚下的暖边：走在最后，灯还在她前面 */}
      <WarmBloom at={{ x: 1150, y: 760 }} r={260} squash={0.5} opacity={0.05} period={30} phase={1.7} breath={0.25} blur={70} />

      {/* ② 那一队人的灯笼：暖点 + 柔光，极缓远离（越走越小、越淡） */}
      <FireLine
        seedBase="s08-lanterns"
        band={{ x0: 700, x1: 1270, y0: 400, y1: 615 }}
        count={7}
        halo={40}
        core={1.9}
        opacity={0.5}
        period={30}
        driftX={-0.12}
      />
      {/* 灯笼在土路上洇出的一团暖光（不画形状，只给光） */}

      {/* ③ 贴地雾 */}
      <GroundMist seedBase="s08" y={860} drift={-0.8} opacity={0.6} />
      <DustField act={2} count={14} seedBase="s08-night" wind={-8} />

      {/* 角晕 */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse 80% 76% at 54% 52%, transparent 48%, rgba(24,29,36,0.42) 100%)',
          mixBlendMode: 'multiply',
          pointerEvents: 'none',
        }}
      />
    </ShotScene>
  );
};

export default S08;