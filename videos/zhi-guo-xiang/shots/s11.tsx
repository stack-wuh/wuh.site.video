/* S11 · 襄阳城头，第一团火金烟花 180f
 * v11 §3.3（用户意见 5「烟花跟襄阳城非常不搭」）：底图沿用现有 p-citynight（城墙城楼剪影横贯下方），
 * 变的是**烟花语言**——v10 那朵细白线星形全部弃用，换成 A 组私有 `a-fireworks.tsx` 的团块语言：
 * 一团团火金/赭红从城头上空炸开、烟尾下垂、余烬飘落；远层再补一朵小赭红（三层景深里的「远」）。
 * 同时给天空一条「云被由下往上照亮」的暖光带（只加光、不泛白）。
 * 时间：0–20f 是本镜的入场（不入场高潮）；起花 36f 上冲、46f 左右撑满，云光 36–64f 达峰后缓落。
 * 转场：入本镜是硬切（抬头），镜内不做全屏黑/白，遮罩归 ShotShell。 */
import type { FC } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { Scene } from '../components/SceneKit';
import { Caption } from '../components/Caption';
import { A_Fireworks, CloudGlow } from '../components/a-fireworks';
import { CLAMP, FILM } from '../motion-tokens';

/** 第一团火金：落点避开字幕（画面中上部靠右），起爆帧 36f（入场动效 20f 之后才见高潮）。 */
const MAIN = { x: 1090, y: 318, at: 36, scale: 1.55, hue: 'gold' } as const;

const S11: FC = () => {
  const f = useCurrentFrame();
  /* 云光：起花阶段 0，46f 后升到峰值，尾段留一点余晖（不做整屏泛白） */
  const glow = interpolate(f, [MAIN.at, MAIN.at + 18, MAIN.at + 40, MAIN.at + 120], [0, 1, 0.82, 0.34], CLAMP);

  return (
    <Scene name="p-citynight" zoom={[1.0, 1.045]} dim={0.06}>
      {/* 云被由下往上照亮：暖光从城墙上方升起，靠爆心一侧更亮 */}
      <CloudGlow at={MAIN.at} x={MAIN.x} y={700} intensity={glow} width={1320} height={560} />
      {/* 团块烟花：主爆一朵 + 远层一小朵（错峰 80f，读得出三层景深的最远那层） */}
      <A_Fireworks
        seed="s11"
        bursts={[
          { x: MAIN.x, y: MAIN.y, at: MAIN.at, scale: MAIN.scale, hue: 'gold', rise: true },
          { x: 462, y: 258, at: 118, scale: 0.58, hue: 'ochre' },
        ]}
      />
      {/* 城头被照亮的一线：贴着城墙天际线的暖色反光（只染光，不重画底图） */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 700,
          height: 130,
          background: FILM.fireGold,
          opacity: 0.13 * glow,
          mixBlendMode: 'screen',
          maskImage: 'linear-gradient(180deg, transparent 0%, #000 48%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, #000 48%, transparent 100%)',
        }}
      />
      <Caption cue="s11" />
    </Scene>
  );
};

export default S11;