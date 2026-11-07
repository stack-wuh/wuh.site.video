/* S36 · 墨滴成烟花（180f · 入「墨洇」）
 *
 * v12 分镜 Act 7：砚池边凝起一颗墨珠，落下；墨在纸上洇开，**洇成一朵烟花**；诗 L5–L6。
 *
 * 与 S36 同一张纸、同一支灯、同一组 InkPaper 参数（`p-paper-lamp`，诗继续写第五、六行），
 * 推镜从 S36 的 1.035 接着推到 1.06，纸与灯都不换。
 * 「砚池边」处理成：墨珠在**最后一行行末的湿墨上凝住**（底图没有实物砚入画，硬画一只砚会变成贴纸；
 * 判据「先凝、后落」由时间轴承担，与 v11 墨滴镜同口径）。
 *   8–104f   写完诗 L5–L6（29 字／全诗 92 字，入场时前 63 字已写完）；
 *   104–134f 墨珠在行末湿墨上凝住（8px → 14px）；
 *   134–140f 脱手落 6f（自由落体二次曲线），落在最后一个字「花」的字心；
 *   140–180f 墨洇开：InkBloom + RaggedBloom 补纸纤维毛刺，再由一圈**墨色的烟花针**向外抽出去——
 *             不是金烟花（纸上只有墨），墨针尖端留细小的墨点，抽出去就是一朵烟花。
 * 灯焰继续跳；墨落纸那一下灯焰被压一档（jolt）。 */
import type { FC } from 'react';
import { interpolate, random, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ShotSlide } from '../components/e-scene';
import { InkPaper, POEM_COLS } from '../components/InkPaper';
import { Caption } from '../components/Caption';
import { InkBloom } from '../components/InkBloom';
import { LampFlame } from '../components/d-lamp';
import { InkDrop, RaggedBloom } from '../components/d-desk';
import { CLAMP, CURVES } from '../motion-tokens';

/* ── 与 S36 同一组纸面排版（全诗九列）── */
const LINES = POEM_COLS;
const TOTAL_CHARS = LINES.reduce((s, l) => s + l.length, 0);
/** S36 写完前六列后的进度（63/92）：S37 从这里接着写 */
const START = (POEM_COLS.slice(0, 6).reduce((s, l) => s + l.length, 0) || 63) / TOTAL_CHARS;

const SIZE = 52;
const RIGHT_PX = 0.13 * 1920;
const TOP_PX = 0.12 * 1080;
/** 竖排字距：InkPaper = fontSize × (1 + letterSpacing 0.06)，即 1.06·size */
const ADVANCE = SIZE * 1.06;
/** 最后一列（「像极了十六岁那年的烟花。」）的最后一字「花」的字心 */
const CHAR = {
  x: 1920 - RIGHT_PX - (POEM_COLS.length - 1) * SIZE * 1.5 - SIZE / 2,
  y: TOP_PX + (POEM_COLS[POEM_COLS.length - 1].length - 0.5) * ADVANCE,
};
const BLOOM_R = 86;
/** InkBloom 的可视中心比 at.y 低 0.35·r·progress，所以 at.y 上提 0.35·r，让墨心落在字心 */
const BLOOM_AT = { x: CHAR.x, y: CHAR.y - BLOOM_R * 0.35 };

const WRITE = [8, 104] as const;
const GATHER = [104, 134] as const;
const FALL = [134, 140] as const;
const BLOOM_START = 140;
const BLOOM_END = 174;

/** 烟花针：14 根墨色细针（长度/角度/粗细各带一点 random(seed) 抖动，确定性） */
const TEND = Array.from({ length: 14 }).map((_, i) => {
  const a = (i / 14) * Math.PI * 2 + (random(`s37-tend-a-${i}`) - 0.5) * 0.26;
  const len = 46 + random(`s37-tend-l-${i}`) * 66;
  const w = 1.0 + random(`s37-tend-w-${i}`) * 1.5;
  return { a, len, w };
});

/** 本镜时长（manifest durationFrames——ShotScene 用它算推拉进度，不读 useVideoConfig） */
const TOTAL = 180;

const S37: FC = () => {
  const f = useCurrentFrame();
  const progress = interpolate(f, [WRITE[0], WRITE[1]], [START, 1], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const bloom = interpolate(f, [BLOOM_START, BLOOM_END], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut });
  const rag = interpolate(f, [BLOOM_START, BLOOM_END + 6], [0, 1], CLAMP);
  /* 墨落进纸里那一下：灯焰被压一档（3f 冲击、12f 回稳） */
  const jolt = interpolate(f, [FALL[1], FALL[1] + 3, FALL[1] + 12], [0, 1, 0], CLAMP);

  return (
    <ShotSlide total={TOTAL} frame={f} zoom={[1.035, 1.06]} warm={0.02}>
      <InkPaper base="p-paper-lamp" lines={LINES} progress={progress} size={SIZE} right="13%" top="12%">
        <LampFlame frame={f} at={{ x: 112, y: 220 }} size={32} jolt={jolt} />

        {/* 墨珠：先凝后落 */}
        <InkDrop frame={f} at={CHAR} gather={GATHER} fall={FALL} />

        {/* 墨洇成烟花：墨团 + 纸纤维毛刺 + 一圈向外抽的墨针 */}
        <InkBloom progress={bloom} at={BLOOM_AT} r={BLOOM_R} opacity={0.92} blur={1} />
        <RaggedBloom progress={rag} at={CHAR} r={88} opacity={0.88} />
        {bloom > 0.01 ? (
          <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {TEND.map((t, i) => {
              const reach = t.len * bloom;
              const bx = CHAR.x;
              const by = CHAR.y;
              const tipX = bx + Math.cos(t.a) * reach;
              const tipY = by + Math.sin(t.a) * reach * 0.92;
              /* 针：底部略宽、尖上收成一点——像墨从纸心被抽出去 */
              const nx = Math.cos(t.a + Math.PI / 2) * t.w;
              const ny = Math.sin(t.a + Math.PI / 2) * t.w * 0.92;
              return (
                <g key={i} opacity={0.66 * bloom}>
                  <polygon
                    points={`${bx + nx} ${by + ny} ${bx - nx} ${by - ny} ${tipX} ${tipY}`}
                    fill={colors.ink}
                    style={{ filter: 'blur(0.7px)' }}
                  />
                  <circle cx={tipX} cy={tipY} r={1.3} fill={colors.ink} opacity={0.7 * bloom} />
                </g>
              );
            })}
          </svg>
        ) : null}
      </InkPaper>
      <Caption cue="s36" tone="ink" />
    </ShotSlide>
  );
};

export default S37;