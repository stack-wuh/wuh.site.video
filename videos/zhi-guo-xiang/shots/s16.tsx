/* S16 · 满城烟花错峰炸开；她仰头，脸被照亮（脸 2）180f
 *
 * v12 分镜：近·长焦，暗部 + 金点。全片第二次给脸——**给脸的理由是「最幸福，也最不自知」**。
 *
 * 底图 `p-her-up`（旧图：她侧后仰脸，纸面很淡）。这一镜要夜、要烟花，所以先自己造夜：
 *   ① 夜色：上缘压深的墨蓝（multiply）渐到她的肩背为止，另用一层椭圆把画幅边缘收暗——
 *      天暗下来，金点才有地方亮；
 *   ② 烟花：A_Fireworks 六朵错峰（20 / 44 / 70 / 96 / 124 / 150f），远小近大、火金与赭红交替；
 *   ③ 她的脸：每一朵近处的烟花在她脸上打一次暖光（脸 2 的光是**被烟花照亮的**，不是打光）；
 *   ④ 云光：城上空的云被由下往上照亮。
 * 长焦缓推 1.02 → 1.08，把注意力收到她仰起的脸上。
 * 转场：入「切」，出「墨洇」（s18 绝情谷）。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ShotScene } from '../components/e-scene';
import { Caption } from '../components/Caption';
import { A_Fireworks, CloudGlow, type FireworkBurst } from '../components/a-fireworks';
import { WarmBloom } from '../components/e-firelight';
import { DustField } from '../components/DustField';
import { CLAMP, FILM } from '../motion-tokens';

const TOTAL = 180;
/** 她的脸（p-her-up 实测：侧脸在 x 1125–1350 / y 175–350） */
const FACE = { x: 1200, y: 258 };

/** 六朵错峰：天上是「满城」，所以远近、大小、色温都要错开 */
const BURSTS: FireworkBurst[] = [
  { x: 300, y: 196, at: 20, scale: 1.0, hue: 'gold', rise: true },
  { x: 700, y: 132, at: 44, scale: 0.7, hue: 'ochre' },
  { x: 1560, y: 178, at: 70, scale: 1.15, hue: 'gold', rise: true },
  { x: 470, y: 304, at: 96, scale: 0.8, hue: 'gold' },
  { x: 1000, y: 108, at: 124, scale: 0.9, hue: 'ochre' },
  { x: 1640, y: 372, at: 150, scale: 0.66, hue: 'gold' },
];

/** 一朵烟花照亮她脸的包络：爆开即亮、40f 后只剩余晖 */
const pulse = (f: number, at: number) => interpolate(f, [at, at + 14, at + 62], [0, 1, 0.12], CLAMP);

const S17: FC = () => {
  const f = useCurrentFrame();
  /* 她脸上的光：取最近几朵里最亮的那一朵（不是相加，相加会过曝） */
  const faceLight = Math.max(pulse(f, 20) * 0.55, pulse(f, 70) * 0.9, pulse(f, 96) * 0.6, pulse(f, 150) * 0.7);
  const cloud = Math.max(pulse(f, 70), pulse(f, 20) * 0.6);

  return (
    <ShotScene name="p-her-up" total={TOTAL} frame={f} zoom={[1.02, 1.08]} dim={0.02}>
      {/* ① 夜色：上缘压深（天暗下来），到她肩背那带收住 */}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(180deg, rgba(20,26,34,0.8) 0%, rgba(20,26,34,0.62) 30%, rgba(20,26,34,0.34) 56%, rgba(20,26,34,0.2) 78%, rgba(20,26,34,0.14) 100%)',
          mixBlendMode: 'multiply',
          pointerEvents: 'none',
        }}
      />
      {/* ①b 边缘收暗（长焦的暗角），她那一侧留亮 */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse 92% 86% at 62% 44%, transparent 34%, rgba(16,21,28,0.6) 100%)',
          mixBlendMode: 'multiply',
          pointerEvents: 'none',
        }}
      />

      {/* ④ 云被由下往上照亮 */}
      <CloudGlow at={70} x={900} y={470} intensity={cloud} width={1500} height={520} />
      <CloudGlow at={20} x={380} y={430} intensity={pulse(f, 20) * 0.8} width={1100} height={420} />

      {/* ② 六朵错峰 */}
      <A_Fireworks seed="s17" bursts={BURSTS} />

      {/* ③ 她的脸被烟花照亮：一次一朵，暖金、宽、软 */}
      <WarmBloom at={FACE} r={300} squash={0.86} opacity={0.42 * faceLight} period={40} breath={0} blur={48} />
      {/* 脸上的光往下带一点到衣领（不给她整个人泛白） */}
      <WarmBloom at={{ x: FACE.x - 40, y: FACE.y + 210 }} r={420} squash={0.5} opacity={0.18 * faceLight} period={40} breath={0} blur={80} />

      {/* 烟火灰与光尘：落在她肩上那层（故事里的「烟灰落在她肩上」就是这一层） */}
      <DustField act={4} count={24} seedBase="s17-ash" wind={6} />

      {/* 极轻的暖调：整帧往火金方向带一档，别让夜变成蓝夜 */}
      <AbsoluteFill style={{ background: FILM.fireGold, opacity: 0.05 + 0.06 * faceLight, mixBlendMode: 'soft-light', pointerEvents: 'none' }} />
      {/* 纸面回温：夜压过之后补一层纸色，保持绢本调子 */}
      <AbsoluteFill style={{ background: colors.paper, opacity: 0.03, mixBlendMode: 'soft-light', pointerEvents: 'none' }} />
      <Caption cue="s16" tone="paper" />
    </ShotScene>
  );
};

export default S17;