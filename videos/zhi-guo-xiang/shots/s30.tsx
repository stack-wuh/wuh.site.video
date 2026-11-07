/* S30 · 城破（180f · 入「墨洇」）
 *
 * v12 分镜 Act 7 前的最后一击：城破，城门起火，浓烟压城，城墙缺口；一封急报落在她手里。
 * 底图 `p-city-fall`（美术：不画人、不画旗）。
 * 代码三层，全部是「火 / 火星 / 一张纸」：
 *   1) GateGlow + WarEmbers（components/f-cityfire.tsx）：城门那团火的呼吸 + 火星被风带向右；
 *      **不叠烟**——底图那根烟柱已经比任何代码烟都重，叠上去只会糊；
 *   2) 急报：一张折纸从画面右下递进前景（**不画手**），带折痕与一枚墨色火漆，
 *      前 86–134f 落定；前景那一档刻意做软（blur 2.4 → 1.2），读作「递到眼前」而不是贴纸；
 *   3) 镜头：大远 → 特·急报（1.0 → 1.05 缓推），推的是城，不是纸。
 * 无代码人物 → 无黑块风险。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ShotScene } from '../components/e-scene';
import { Caption } from '../components/Caption';
import { GateGlow, WarEmbers } from '../components/f-cityfire';
import { CLAMP, CURVES } from '../motion-tokens';

const EASE = { ...CLAMP, easing: CURVES.cineEaseOut };
/** 急报落定：86f 起递进、134f 停住。 */
const IN = [86, 134] as const;

/** 本镜时长（manifest durationFrames——ShotScene 用它算推拉进度，不读 useVideoConfig） */
const TOTAL = 180;

const S31: FC = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [IN[0], IN[1]], [0, 1], EASE);
  /* 递进来：从右下、略高、转过来；落定过一点再回正（纸被递到手里会晃一下） */
  const overshoot = Math.sin(p * Math.PI) * 0.04;
  const left = 1446 + 56 * (1 - p);
  const top = 806 - 44 * p;
  const rot = 27 - 11 * p + overshoot * 60;
  const focus = 2.6 - 1.4 * p;

  return (
    <ShotScene name="p-city-fall" total={TOTAL} frame={f} zoom={[1.0, 1.05]} warm={0.03}>
      <GateGlow intensity={1} />
      <WarEmbers seed="s31-ember" count={28} intensity={1} />

      {/* 急报：前景一张折纸（只见纸，不见手） */}
      {p > 0.01 ? (
        <AbsoluteFill style={{ pointerEvents: 'none' }}>
          <div
            style={{
              position: 'absolute',
              left,
              top,
              width: 306,
              height: 214,
              transform: `rotate(${rot}deg)`,
              transformOrigin: '30% 40%',
              opacity: 0.2 + 0.8 * p,
              filter: `blur(${focus}px)`,
            }}
          >
            {/* 纸投在自己下面的软影（不用 rgba，颜色只取令牌） */}
            <div
              style={{
                position: 'absolute',
                left: 14,
                right: -10,
                top: 18,
                bottom: -18,
                borderRadius: 6,
                background: colors.ink,
                opacity: 0.24,
                filter: 'blur(16px)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 2,
                background: `linear-gradient(152deg, ${colors.paper} 0%, ${colors.paperDeep} 58%, ${colors.paperMuted} 100%)`,
              }}
            />
            {/* 折痕：一道横折、一道竖折（很淡，只在光下看见） */}
            <div style={{ position: 'absolute', left: 6, right: 6, top: '48%', height: 1, background: colors.ink, opacity: 0.14 }} />
            <div style={{ position: 'absolute', top: 6, bottom: 6, left: '46%', width: 1, background: colors.ink, opacity: 0.1 }} />
            {/* 火漆：不用红（全片无红），一枚墨色小印 + 一点金边 */}
            <div
              style={{
                position: 'absolute',
                right: 26,
                bottom: 26,
                width: 30,
                height: 30,
                borderRadius: '50%',
                background: colors.ink,
                opacity: 0.78,
                boxShadow: `inset 0 0 0 2px ${colors.gold}33`,
              }}
            />
          </div>
        </AbsoluteFill>
      ) : null}

      <Caption cue="s30" tone="ink" />
    </ShotScene>
  );
};

export default S31;