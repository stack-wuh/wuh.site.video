/* S16 · 「后来，她背着剑，走了很多年。」—— 十六年 = 同一构图里的三拍季节叠化 150f
 *
 * design-v11 §3.4（用户意见 6+7 合并）：
 *   0–20f   承接 inbound 墨洇（墨层归 ShotShell）：露出土路，镜内只起雾，不做第二个全屏遮罩；
 *   20–104f 三拍季节叠化，机位**完全不动**（同一构图只换天气与光）：
 *            春 20–48f  冷青雾 + 橄榄灰（淡绿）+ 青苔地面 + 落花（Petals）
 *            冬 48–76f  雪色遮罩（screen，远景与路面先转白）+ 地面实白 + 飞雪（SnowFall）
 *            秋 76–104f 暖赭 + 右上斜金光 + 地面枯黄 + 前景芦苇（Reeds）
 *            切换各 6f 十字叠化（45–51 / 73–79），切换点一档曝光跳（过曝 0.2 / 压暗 0.25）；
 *   104–150f 落定秋：底图里的小毛驴与她的背影（人高 8–12%）随镜头缓后拉 zoom 1.08 → 1.0
 *            越走越远，雾朝镜头方向流动（MistFlow 加浓）。
 * 全段不出「十六年后」之类文字；字幕只留 storyboard 那一句（Caption cue）。
 *
 * v11 抽帧返工（lead 2026-11-07）：第一版三拍只有一层几乎看不见的色雾，读者读不出季节。
 * 本版：底图逐拍加 CSS 色温/饱和（春微亮、冬去饱和、秋 sepia 暖），叠加层至少两项同时变，
 * 并把「地面颜色」做成三拍最明显的差（青苔 / 雪 / 枯黄）。
 *
 * 底图 p-donkey-road 由美术组生成；人物/毛驴在底图里，本镜不再叠第二个人或第二头驴。
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

/** 底图：土路大远景，她牵驴走向景深（人物高 8–12%，居中偏左，路向景深延伸） */
const BASE = 'p-donkey-road';
const EASE = { ...CLAMP, easing: CURVES.cineEaseInOut };
/** 本镜时长（manifest 固定 150f；不用 useVideoConfig——整片里拿到的是根 comp 时长） */
const TOTAL = 150;

const S16: FC = () => {
  const f = useCurrentFrame();

  /* 季节权重：春先在墨里长起来（6–18f），三拍各 28f，边界 6f 十字叠化。权重和叠化时保持 ≈1。 */
  const ramp = (a: number, b: number) => interpolate(f, [a, b], [0, 1], EASE);
  const spring = ramp(6, 18) * (1 - ramp(45, 51));
  const winter = ramp(45, 51) * (1 - ramp(73, 79));
  const autumn = ramp(73, 79);

  /* 年份跳过的快门：第一切换过曝一档、第二切换压暗一档（各 4f，斜坡式，不做长渐变） */
  const flashUp = interpolate(f, [47, 48, 49], [0, 0.15, 0], CLAMP);
  const flashDown = interpolate(f, [75, 76, 77], [0, 0.15, 0], CLAMP);

  /* 104–150f 缓后拉；三拍期间定在 1.08 不动 = 同一构图 */
  const pull = interpolate(f, [104, TOTAL - 1], [0, 1], EASE);
  const scale = 1.08 - 0.08 * pull;

  /* 底图逐拍调色：冬去饱和、秋 sepia 暖、春略提亮；比只叠色雾更能一眼看出换了季节 */
  const saturate = 1 - 0.46 * winter - 0.06 * spring - 0.1 * autumn;
  const brightness = 1 + 0.05 * winter + 0.015 * spring - 0.015 * autumn;
  const sepia = 0.32 * autumn;
  const grade = `saturate(${saturate.toFixed(3)}) brightness(${brightness.toFixed(3)}) sepia(${sepia.toFixed(3)})`;

  /* 雾按季节给：春雾厚、冬霰薄、秋一开始薄、末拍朝镜头压上来 */
  const mistSpring = 0.55 * spring;
  const mistWinter = 0.2 * winter;
  const mistAutumn = 0.14 + 0.95 * pull;
  const mist = mistSpring + mistWinter + mistAutumn;

  const reedGrow = interpolate(f, [72, 98], [0.25, 1], EASE);

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
      {spring > 0.02 ? <Petals seed="s16-petals" count={44} opacity={0.95 * spring} wind={-6} /> : null}

      {/* 冬：飞雪（冷白、风向右，压过路与芦苇） */}
      {winter > 0.02 ? <SnowFall seed="s16-snow" count={150} opacity={0.95 * winter} wind={18} speed={1.1} /> : null}

      {/* 秋：空气里的薄金尘，压得很淡（不抢芦苇与斜光） */}
      {autumn > 0.02 ? (
        <AbsoluteFill style={{ opacity: autumn * 0.8 }}>
          <DustField act={6} count={24} seedBase="s16-autumn" wind={5} />
        </AbsoluteFill>
      ) : null}

      <MistFlow seed="s16-mist" intensity={mist} period={190} count={5} />

      {/* 秋拍前景芦苇：最后 30f 长起来，给「镜头前面有东西」的一层 */}
      {autumn > 0.02 ? <Reeds seed="s16-reeds" opacity={Math.min(1, autumn)} grow={reedGrow} /> : null}

      <Caption cue="s16" tone="ink" />
    </AbsoluteFill>
  );
};

export default S16;