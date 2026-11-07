/* S26 · 青驴 · 三拍季节（210f · 入「墨洇」）
 *
 * v12 分镜 Act 6：土路远景，同一构图三拍季节：春雾落花 → 冬雪 → 秋枯苇；她牵着青灰小毛驴的
 * 背影越走越远。底图 `p-donkey-road`（人高约 21%，驴与人在路中景，路往景深延伸）。
 *
 * 机位**完全不动**（同一构图只换天气与光），三拍各约 60f，边界 6f 十字叠化；
 * 切换点各给一档快门曝光跳（过曝 / 压暗各 ±0.15，4f 内回落）。季节判据是三件事同时变：
 *   · 春：冷青压色 + 橄榄灰（读作淡绿）+ 地面青苔 + 落花；
 *   · 冬：冷灰青 multiply + 地面雪斑 + 远山被雪雾吃掉 + 飞雪；
 *   · 秋：暖赭 + 右上斜金光 + 地面枯黄 + 前景芦苇。
 * 末段 (150–210f) 极缓后拉 1.08 → 1.0：她与驴被留在原地，越走越远——不靠代码搬人，
 * 靠画框往外让。
 *
 * 底图人物/毛驴已在画里，本镜不叠第二个人、第二头驴。随机全部走 random(seed)（组件内部）。
 */
import type { FC } from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { InkGrade } from '../components/SceneKit';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { MistFlow } from '../components/b-mistflow';
import { Petals } from '../components/b-petals';
import { Reeds } from '../components/b-reeds';
import { SeasonVeil } from '../components/b-seasonveil';
import { SnowFall } from '../components/b-snowfall';
import { CLAMP, CURVES } from '../motion-tokens';

const BASE = 'p-donkey-road';
const EASE = { ...CLAMP, easing: CURVES.cineEaseInOut };
/** 本镜时长（manifest 固定 210f；与 Scene 同口径） */
const TOTAL = 210;

const S27: FC = () => {
  const f = useCurrentFrame();

  /* 季节权重：春先长起来，三拍各 ~60f，边界 6f 十字叠化，权重和恒 ≈1 */
  const ramp = (a: number, b: number) => interpolate(f, [a, b], [0, 1], EASE);
  const spring = ramp(8, 20) * (1 - ramp(74, 80));
  const winter = ramp(74, 80) * (1 - ramp(134, 140));
  const autumn = ramp(134, 140);

  /* 年份跳过的快门：第一切换过曝一档、第二切换压暗一档（1–2f，不做长渐变） */
  const flashUp = interpolate(f, [77, 78, 79], [0, 0.15, 0], CLAMP);
  const flashDown = interpolate(f, [137, 138, 139], [0, 0.15, 0], CLAMP);

  /* 150f 起极缓后拉；三拍期间定在 1.08 = 同一构图 */
  const pull = interpolate(f, [150, TOTAL - 1], [0, 1], EASE);
  const scale = 1.08 - 0.08 * pull;

  /* 底图逐拍调色：冬去饱和、秋 sepia 暖、春略提亮——比只叠一层色雾更容易一眼读出来 */
  const saturate = 1 - 0.46 * winter - 0.06 * spring - 0.1 * autumn;
  const brightness = 1 + 0.05 * winter + 0.015 * spring - 0.015 * autumn;
  const sepia = 0.32 * autumn;
  const grade = `saturate(${saturate.toFixed(3)}) brightness(${brightness.toFixed(3)}) sepia(${sepia.toFixed(3)})`;

  /* 雾按季节给：春雾厚、冬霰薄、秋一开始薄、末拍朝镜头压上来 */
  const mist = 0.55 * spring + 0.2 * winter + (0.14 + 0.95 * pull);
  const reedGrow = interpolate(f, [128, 160], [0.25, 1], EASE);

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
          filter: grade,
        }}
      />
      <InkGrade />

      <SeasonVeil spring={spring} winter={winter} autumn={autumn} exposure={flashUp - flashDown} />

      {/* 春：落花（很轻的左风，花瓣朝镜头偏左飘） */}
      {spring > 0.02 ? <Petals seed="s27-petals" count={44} opacity={0.95 * spring} wind={-6} /> : null}

      {/* 冬：飞雪（冷白短斜线，风向右，压过路与枯草） */}
      {winter > 0.02 ? <SnowFall seed="s27-snow" count={150} opacity={0.95 * winter} wind={18} speed={1.1} /> : null}

      {/* 秋：空气里的薄金尘（不抢芦苇与斜光） */}
      {autumn > 0.02 ? (
        <AbsoluteFill style={{ opacity: autumn * 0.8 }}>
          <DustField act={6} count={24} seedBase="s27-autumn" wind={5} />
        </AbsoluteFill>
      ) : null}

      <MistFlow seed="s27-mist" intensity={mist} period={190} count={5} />

      {/* 秋拍前景芦苇：最后 30f 长起来，给「镜头前面有东西」的一层 */}
      {autumn > 0.02 ? <Reeds seed="s27-reeds" opacity={Math.min(1, autumn)} grow={reedGrow} /> : null}

      <Caption cue="s26" tone="ink" />
    </AbsoluteFill>
  );
};

export default S27;