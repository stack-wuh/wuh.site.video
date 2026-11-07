/*
 * C 组茶馆共用层（S20 全景 / S24 过肩近景）—— v11 §3.7「两镜必须读作同一间屋子」的硬保证。
 *
 * 底图 p-teahouse 是暖赭高调水彩（纸近白、暗部为淡墨），代码这一层只加**光、烟、虚焦框**，
 * 不画人物：人物全在底图里。两个镜头共用 ROOM 这一份常量（光柱位、茶烟锚点、暖赭值、暗角），
 * 所以「同色调 / 同茶烟 / 同家具 / 同窗光」是同源的，不是各调各的。
 *
 * 坐标基准 1920×1080（与底图同坐标系）。禁纯黑填充：暗部一律 colors.ink 低不透明度乘色/柔光。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { CLAMP } from '../motion-tokens';

/** 同一间屋子的唯一真值：S20 / S24 都从这里取，改一处两镜同时变。 */
export const ROOM = {
  /** 暖赭压色（交给 Scene 的 warm 层，两镜同值） */
  warm: 0.08,
  /** 窗外光柱：从右上斜下来（screen 层，不抢主体） */
  shafts: [
    { x: 1140, w: 280, tilt: 15, o: 0.15 },
    { x: 1452, w: 180, tilt: 15, o: 0.1 },
  ],
  /** 茶烟锚点（壶口/碗口/邻桌）；S24 只取前两个 */
  /* 锚点量自底图：① 说书人案头（醒木边上那缕画上去的烟，代码补动）② 郭襄桌上那只碗 */
  smoke: [
    { x: 1190, y: 470, r: 56, o: 0.5 },
    { x: 352, y: 866, r: 28, o: 0.3 },
  ],
  /** 暗角强度：两镜同一档 */
  vignette: 0.42,
} as const;

type SmokeAnchor = { x: number; y: number; r: number; o: number };

/** 窗棂光柱：两束自右上斜入，随呼吸微亮；漂移是镜头呼吸的一半（另外半截在 Scene.zoom）。
 *  shift：S24 裁近后用同一组光源的横向补偿，保持「同一扇窗」。 */
export const WindowShafts: FC<{ shift?: number; intensity?: number }> = ({ shift = 0, intensity = 1 }) => {
  const f = useCurrentFrame();
  /* 60f 一次慢呼吸——和茶烟同一口气 */
  const breathe = 0.86 + 0.14 * Math.sin((f / 96) * Math.PI * 2);
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'screen' }}>
      {ROOM.shafts.map((s, i) => (
        <div
          key={s.x}
          style={{
            position: 'absolute',
            left: s.x + shift + Math.sin((f / 150 + i * 0.4) * Math.PI * 2) * 6,
            top: -160,
            width: s.w,
            height: 1500,
            transform: `rotate(${s.tilt}deg)`,
            transformOrigin: '50% 0%',
            background: `linear-gradient(90deg, transparent 0%, ${colors.paper} 40%, ${colors.paper} 60%, transparent 100%)`,
            opacity: s.o * breathe * intensity,
            filter: 'blur(26px)',
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

/** 茶烟：每个锚点 4 缕，各自相位（remotion random 确定性种子），升起—扩—散。
 *  scatter 0–1：醒木落下那一下把烟「震散」——横向弹开 + 一次整体提亮，随后 24f 收回。
 *  drift：整间屋子的横向气流（S24 过肩机位给一点，和 S20 同一风向）。 */
export const TeaSmoke: FC<{ anchors?: readonly SmokeAnchor[]; scatter?: number; drift?: number; scale?: number }> = ({
  anchors = ROOM.smoke,
  scatter = 0,
  drift = 0,
  scale = 1,
}) => {
  const f = useCurrentFrame();
  const wisps = 5;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'screen' }}>
      {anchors.flatMap((a, ai) =>
        Array.from({ length: wisps }).map((_, i) => {
          const seed = `c-tea-smoke-${ai}-${i}`;
          const ph = random(seed);
          const cycle = 200 + random(`${seed}-cycle`) * 130;
          const life = ((f + ph * cycle) % cycle) / cycle; // 0→1 一缕的一生
          const rise = life * (150 + a.r * 2.4) * scale;
          const sway = Math.sin((f + ph * 240) / 46) * (9 + 7 * random(`${seed}-sway`));
          const size = a.r * scale * (0.34 + life * 1.05);
          /* sin 包络：一缕烟两头都是淡的，中段才立起来 */
          const alpha = a.o * Math.sin(Math.PI * life) * 0.24;
          const push = scatter * (30 + 36 * random(`${seed}-push`)) * (i % 2 === 0 ? 1 : -1);
          return (
            <div
              key={seed}
              style={{
                position: 'absolute',
                left: a.x + sway + push + drift * (1 + i * 0.2) - size / 2,
                top: a.y - rise - size / 2,
                width: size,
                height: size * 1.9,
                borderRadius: '50%',
                background: colors.paper,
                filter: `blur(${6 + size * 0.07}px)`,
                opacity: alpha * (1 + scatter * 0.9),
              }}
            />
          );
        }),
      )}
    </AbsoluteFill>
  );
};

/** 房间暗角：乘色压四角，把视线收到桌面上。两镜同一档 ROOM.vignette。 */
export const RoomVignette: FC<{ strength?: number }> = ({ strength = 1 }) => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      mixBlendMode: 'multiply',
      opacity: ROOM.vignette * strength,
      background: `radial-gradient(ellipse 74% 66% at 50% 46%, transparent 38%, ${colors.ink} 132%)`,
    }}
  />
);

/** 过肩近景的前景虚焦框（只给 S24 用）：一片过客肩背 + 边上一截说书人。
 *  刻意压到「灰」而不是「黑」——底图是高调淡彩，纯黑会重新变成用户骂的那块黑；
 *  这里用 ink ×0.2 叠 40px 模糊，读作虚焦的暗部，不是一个人影。 */
export const BokehShoulders: FC<{ variant?: 'patron' | 'storyteller'; strength?: number }> = ({
  variant = 'patron',
  strength = 1,
}) => {
  const f = useCurrentFrame();
  /* 虚焦块也要呼吸：极缓 3px 起伏，避免像贴片 */
  const bob = Math.sin((f / 130) * Math.PI * 2) * 3;
  const o = 0.22 * strength;
  if (variant === 'patron') {
    return (
      <AbsoluteFill style={{ pointerEvents: 'none' }}>
        {/* 肩：一大团压左下角 */}
        <div
          style={{
            position: 'absolute',
            left: -140,
            top: 690 + bob,
            width: 640,
            height: 560,
            borderRadius: '48% 52% 40% 60%',
            background: colors.ink,
            opacity: o,
            filter: 'blur(42px)',
            transform: 'rotate(-11deg)',
          }}
        />
        {/* 颈与头：小一团偏上，虚得更狠 */}
        <div
          style={{
            position: 'absolute',
            left: 96,
            top: 560 - bob * 0.6,
            width: 300,
            height: 320,
            borderRadius: '52% 48% 46% 54%',
            background: colors.ink,
            opacity: o * 0.72,
            filter: 'blur(50px)',
          }}
        />
        {/* 受光边：一线纸白，虚焦也要有方向光 */}
        <div
          style={{
            position: 'absolute',
            left: 128,
            top: 742 + bob,
            width: 430,
            height: 26,
            borderRadius: 20,
            background: colors.paper,
            opacity: 0.2,
            filter: 'blur(22px)',
            transform: 'rotate(-9deg)',
          }}
        />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {/* 说书人在画面右缘虚焦：长衫一条竖影 + 一点案上反光 */}
      <div
        style={{
          position: 'absolute',
          left: 1720,
          top: 150 + bob,
          width: 380,
          height: 1000,
          borderRadius: '50% 50% 44% 56%',
          background: colors.ink,
          opacity: 0.17 * strength,
          filter: 'blur(46px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 1600,
          top: 690 - bob,
          width: 300,
          height: 18,
          borderRadius: 12,
          background: colors.paper,
          opacity: 0.22,
          filter: 'blur(16px)',
          transform: 'rotate(-4deg)',
        }}
      />
    </AbsoluteFill>
  );
};

/** 整间屋子的光与烟（不含暗角）：S20 / S24 共用同一口气，参数只在各自镜里给强度。 */
export const TeaRoomLight: FC<{
  shift?: number;
  smokeScale?: number;
  smokeDrift?: number;
  scatter?: number;
  intensity?: number;
  /** 茶烟锚点（S24 裁近后传换算过的屏幕坐标；不传用整幅的 ROOM.smoke） */
  anchors?: readonly SmokeAnchor[];
}> = ({ shift = 0, smokeScale = 1, smokeDrift = 0, scatter = 0, intensity = 1, anchors }) => (
  <>
    <WindowShafts shift={shift} intensity={intensity} />
    <TeaSmoke anchors={anchors} scale={smokeScale} drift={smokeDrift} scatter={scatter} />
  </>
);

/** 醒木/锣这类「一声」的画面回执：一次径向暖光 + 一记压暗脉冲（不给全屏黑场）。
 *  pulse 0–1 由镜头自己按帧算好传进来，这里只管形状。 */
export const SoundPulse: FC<{ pulse: number; at: { x: number; y: number; r: number }; cool?: boolean }> = ({
  pulse,
  at,
  cool = false,
}) => {
  if (pulse <= 0.001) return null;
  const r = interpolate(pulse, [0, 1], [at.r * 0.5, at.r * 1.9], CLAMP);
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'screen' }}>
      <div
        style={{
          position: 'absolute',
          left: at.x - r,
          top: at.y - r,
          width: r * 2,
          height: r * 2,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${cool ? colors.paper : colors.gold} 0%, transparent 62%)`,
          opacity: 0.24 * pulse,
          filter: 'blur(14px)',
        }}
      />
    </AbsoluteFill>
  );
};