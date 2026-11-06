/* S21 · 求揭面（210f）—— v11 §3.8 / 用户意见 11「两坨黑色在这里干嘛」+ 13「第一根金针就是对着
 * 杨过许愿、想看他真脸，这段重新设计」。全片情感顶点；这一镜只演一件事：**她用第一枚金针许愿，
 * 他把手抬到面具前——面具没有摘。**
 *
 * 抽帧必须按序读作：她举针 → 针尖亮起（许愿）→ 针不见 → 他一动不动（面具不摘）→ 雾起。
 *   18–32f   针在她摊开的指间亮起（0–20f 是 inbound 墨洇，动作一律在 20f 后立住）
 *   22–52f   针从「摊在掌心」转到「指向他」（举针），针尖一点火金亮起（许愿）
 *   50–112f  他**不动**：只有面具一侧的一线冷光由 0 走到最亮（96–112f）——他听见了，没有转身
 *   108–146f 针淡出（针尖的光先散、再散针身），她的手停在原位（手在底图里，不动）
 *   110–176f 雾从雪脊漫上来，吃掉两人下半身
 *   150–210f 面具**没有摘**——只留雾、雪、他的背影
 *
 * 谁画：两人全在底图 p-unmask 里（她左侧中景侧后、掌心摊空；他右侧背影、双袖垂下）。
 * 代码只加三样：**金针**（Needles.tsx，形制必须对）、**许愿光与金屑**、**雾**（c-fog）。
 * 不画任何人物身体（c-brush 的笔触袖试过两版都像"肩上一块布"，已弃用；杨过只给背影）。
 *
 * 转场：入「墨洇」（0–20f 墨退）、出「墨洇」。无字幕。
 */
import type { FC } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { CLAMP, CURVES, FILM } from '../motion-tokens';
import { Scene } from '../components/SceneKit';
import { DustField } from '../components/DustField';
import { InkBloom } from '../components/InkBloom';
import { Needles } from '../components/Needles';
import { GroundMist, LocalMist, MaskColdLight, RisingFog } from '../components/c-fog';

const EASE = { ...CLAMP, easing: CURVES.cineEaseInOut };

/* ── 对位（量自 public/zhi-guo-xiang/scene/p-unmask.jpg，1920×1080）──
 *  她：掌心摊开的手在 (690, 665)，指尖朝右上；他：肩 (1020, 420)、垂手 (945, 565)、
 *  头 (1130, 365) —— 面具在他的脸上（背影只看得见系带一侧），手停在他头的左侧 (1082, 356)。 */
const NEEDLE = {
  /** 针柄落在她掌心 */
  at: { x: 700, y: 660 },
  len: 150,
  /** 摊在掌心时 -6°，举起来指向他时 -34° */
  tiltFrom: -6,
  tiltTo: -34,
};
const HIS = {
  shoulder: { x: 1030, y: 442 },
  hang: { x: 952, y: 552 },
  mask: { x: 1072, y: 402 },
  face: { x: 1130, y: 368 },
};
/** 底图里他垂袖占的那一小块（x 900–1030 / y 420–620）：抬走之后由一簇雾湿接掉。 */
const OLD_SLEEVE = { x: 944, y: 522 };
/** 雪脊：雾从这条线上长出来（他脚下在 y≈870）。 */
const RIDGE_Y = 878;

const S21: FC = () => {
  const f = useCurrentFrame();

  /* ── 针：亮起 → 从掌心举起、指向他 → 针不见 ── */
  const needleOpacity = interpolate(f, [18, 32, 108, 146], [0, 1, 1, 0], CLAMP);
  const tilt = interpolate(f, [22, 52], [NEEDLE.tiltFrom, NEEDLE.tiltTo], EASE);
  /* 举起时针柄从掌心挪到指尖一点（举针，不是针自己长出来） */
  const lift = interpolate(f, [22, 52], [0, -14], EASE);
  const tip = {
    x: NEEDLE.at.x + NEEDLE.len * Math.cos((tilt * Math.PI) / 180),
    y: NEEDLE.at.y + lift + NEEDLE.len * Math.sin((tilt * Math.PI) / 180),
  };
  /* 许愿的那点光：24–58 起，58–104 稳，104 一次极小的亮，随后随针散 */
  const wishGlow =
    f < 24 ? 0 : f < 58 ? interpolate(f, [24, 58], [0, 1], CLAMP) : f < 104 ? 1 : interpolate(f, [104, 138], [1.15, 0], CLAMP);
  /* 针尖散成的三粒金屑：110–160 往上飘进雾里（「针不见」不是一下没有） */
  const motes = [0, 1, 2].map((i) => {
    const t = interpolate(f, [112 + i * 7, 152 + i * 5], [0, 1], CLAMP);
    return {
      x: tip.x + i * 9 - 9 + Math.sin((f + i * 40) / 22) * 5,
      y: tip.y - t * (26 + i * 16),
      o: (1 - t) * 0.5,
      r: 2.2 - i * 0.4,
    };
  });

  /* 他没有回头、没有抬手：这一镜唯一的"回应"是面具一侧那线冷光（见 maskLight） */
  /* 手到面具的那一下：系带一侧的一线冷光（不摘面具，只有光） */
  const maskLight = interpolate(f, [96, 112, 132, 168], [0, 1, 0.45, 0.16], CLAMP);
  /* 湿接：旧垂袖那一块从 48f 起被一簇雾接管，110f 洗满 */
  const eat = interpolate(f, [48, 110], [0, 1], EASE);

  /* ── 雾：20–90f 一层贴地薄雾先动；110f 起从雪脊漫上来，176f 吃满 ── */
  const fog = interpolate(f, [110, 176, 210], [0, 1, 1.08], EASE);
  const mist = interpolate(f, [20, 90], [0.35, 1], CLAMP);

  return (
    <Scene name="p-unmask" zoom={[1.0, 1.055]} driftY={[-2, 4]} dim={0.02}>
      {/* 贴地薄雾：这一镜最静，雾是唯一一直在动的东西 */}
      <GroundMist seedBase="s21-air" opacity={mist} y={900} drift={-2} />

      {/* 湿接：他垂袖抬走后，原位由这簇雾接管（雾吃墨，不吃形） */}
      <LocalMist at={OLD_SLEEVE} progress={eat} seedBase="s21-old-sleeve" spread={118} rise={74} count={3} strength={0.72} />

      {/* v11 定稿：**不画代码袖**。试过两版笔触袖（v11 §3.8），抽帧都读成「肩上一块折角布/旗」，
          比"没有手"更出戏；全片规矩是杨过只给背影。改为：他始终背对、面具不摘，戏交给三样——
          她举起的金针与许愿光、面具一侧的一线冷光（他"听见了"的唯一证据）、从雪脊漫上来的雾。 */}

      {/* 面具前的一线冷光：抬到那儿为止，光比手先到 */}
      <MaskColdLight at={HIS.mask} amount={maskLight} r={160} />

      {/* 她指间的金针：摊在掌心 → 举起指他 → 淡出 */}
      <Needles
        count={1}
        origin={[NEEDLE.at.x, NEEDLE.at.y + lift]}
        len={NEEDLE.len}
        spread={0}
        tilt={tilt}
        opacity={needleOpacity}
      />
      {/* 针尖的许愿光：很小的一团火金，落在雪上像一粒炭 */}
      <InkBloom
        progress={0.35 + 0.25 * wishGlow}
        at={{ x: tip.x, y: tip.y, r: 32 }}
        color={FILM.fireGold}
        opacity={0.15 * wishGlow}
        blur={14}
        style={{ mixBlendMode: 'screen' }}
      />
      {motes.map((m, i) => (
        <div
          key={`mote-${i}`}
          style={{
            position: 'absolute',
            left: m.x,
            top: m.y,
            width: m.r * 2,
            height: m.r * 2,
            borderRadius: m.r,
            background: colors.gold,
            opacity: m.o,
            filter: 'blur(0.6px)',
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* 雪片斜落（风向左，与她的斗篷同向） */}
      <DustField act={4} count={72} seedBase="s21-snow" wind={-14} />

      {/* 雾从雪脊漫上来，吃掉下半身 */}
      <RisingFog progress={fog} seedBase="s21" ridgeY={RIDGE_Y} rise={390} count={10} strength={1} />
    </Scene>
  );
};

export default S21;