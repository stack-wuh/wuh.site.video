/* S34 · 案头 · 笔尖落下（210f · 入「硬切」）
 *
 * v12 分镜 Act 7：笔尖落下，写诗；纸角被风掀一下。底图 `p-copy`（旧：一摞抄本 + 摊开的旧页 +
 * 案上墨锭）。
 *
 * 本镜不画笔（v10 那支怼在镜头前的大毛笔被用户点名过），也不在纸上叠整首诗（写诗留给 S36/S37 的
 * 纸面微距）；这一镜只做「笔尖刚碰到纸」的那一下：
 *   · 纸角被风掀 —— 抄本最上面那页的左前角被穿堂风掀起来：角上多吃一线暖光（screen），
 *     抬起的那一角往案面上投一片软影（multiply）；不裁三角、不贴色块；
 *   · 第一滴墨 —— 96f 落笔：纸面上一粒极小的湿墨洇开（InkBloom，基准半径 26），像笔尖点下去的第一下；
 *   · 案头的暖光呼吸 + 光尘。
 * 镜头：特·笔尖与纸，1.0 → 1.08 缓推。**纸上的东西（纸角、墨点）跟底图一起缩放**——不然推镜时
 * 墨点会从纸面上滑走；光尘不缩放（尘在空气里，不在纸上）。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ShotScene } from '../components/e-scene';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { InkBloom } from '../components/InkBloom';
import { CLAMP, CURVES } from '../motion-tokens';

/** 抄本最上面那页的左前角（1920×1080，量自 p-copy：那处纸边本来就翘着）：风掀的就是这一角。 */
const CURL = { x: 318, y: 236 };
/** 笔尖落点：那页抄本左下的空白纸面（避开已经抄好的旧字，是这页接下来要写的第一笔）。 */
const TOUCH = { x: 398, y: 268 };
const EASE = { ...CLAMP, easing: CURVES.cineEaseInOut };

/** 本镜时长（manifest durationFrames——ShotScene 用它算推拉进度，不读 useVideoConfig） */
const TOTAL = 210;

const S35: FC = () => {
  const f = useCurrentFrame();
  const tt = TOTAL > 1 ? f / (TOTAL - 1) : 0;
  /* 与 ShotScene 的 Img 同一套 zoom 换算（zoom 1.0 → 1.06，transform-origin 默认中心；total 显式传入） */
  const s = interpolate(tt, [0, 1], [1.0, 1.06], CLAMP);

  /* 节奏跟本镜时长走（180f 的旧排期 ×1.167 = 210f）：风掀纸角约在 47–126f */
  const k = TOTAL / 180;
  const lift = interpolate(f, [47 * k, 63 * k, 110 * k, 126 * k], [0, 1, 1, 0], EASE);
  /* 落笔：112f × k 起，墨在纸上洇 28f × k */
  const touch = interpolate(f, [112 * k, 140 * k], [0, 1], CLAMP);
  /* 案头暖光呼吸（灯不在画里，只有光） */
  const warm = 0.035 + 0.012 * Math.sin((f / 96) * Math.PI * 2);

  return (
    <ShotScene name="p-copy" total={TOTAL} frame={f} zoom={[1.0, 1.06]} warm={warm} dim={0.02}>
      {/* 纸面层：跟底图一起缩放（纸角、墨点都在这层里） */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${s})`,
          transformOrigin: '50% 50%',
          pointerEvents: 'none',
        }}
      >
        {/* 风掀纸角：角上反光 + 抬起来那一角投在案面上的软影（没有一块三角形） */}
        {lift > 0.01 ? (
          <>
            <div
              style={{
                position: 'absolute',
                left: CURL.x - 190 - lift * 12,
                top: CURL.y - 150 - lift * 8,
                width: 420,
                height: 330,
                borderRadius: '50%',
                background: `radial-gradient(ellipse at 54% 50%, ${colors.paper} 0%, transparent 66%)`,
                mixBlendMode: 'screen',
                opacity: 0.15 * lift,
                filter: 'blur(6px)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: CURL.x - 250 - lift * 16,
                top: CURL.y - 90 + lift * 10,
                width: 300,
                height: 380,
                borderRadius: '50%',
                background: `radial-gradient(ellipse at 62% 52%, ${colors.ink} 0%, transparent 68%)`,
                mixBlendMode: 'multiply',
                opacity: 0.26 * lift,
                filter: 'blur(10px)',
              }}
            />
          </>
        ) : null}

        {/* 第一滴墨：笔尖点下去的那一下，很小、很湿（没落笔之前不出现） */}
        {touch > 0.01 ? (
          <InkBloom
            progress={0.55 * touch}
            at={{ x: TOUCH.x, y: TOUCH.y, r: 26 }}
            color={colors.ink}
            opacity={0.5 * touch}
            blur={0.8}
          />
        ) : null}
      </div>

      <DustField act={6} count={18} seedBase="s35-desk" wind={3} />
      <Caption cue="s34" tone="ink" />
    </ShotScene>
  );
};

export default S35;