/* S36 · 纸上墨字（180f · 入「墨洇」）
 *
 * v12 分镜 Act 7：纸上墨字一行行写下去，灯焰呼吸；诗 L3–L4。
 *
 * 纸面用 v11 已验收的 `p-paper-lamp`（纸/案/灯；v11 的墨滴镜与搁笔镜都在这个世界里跑过）。
 * 诗是**纸上的字**不是字幕：InkPaper 竖排右起，S36 写的是第一至第四行（六列）——
 *   · 入场时第一、二行已经写完（L1–L2 的 22 字／六列 63 字 = 0.349，接上 S35 那一下落笔），
 *   · 本镜内从第三列写到第六列（诗 L3–L4），收在 160f；
 *   · 灯焰由 d-lamp 的 LampFlame 补「会动的那一层」（焰心微颤 + 光晕呼吸），
 *     底图那支灯焰是烤死的静态像，这里只叠动态，不重画灯。
 * 镜头：微距·固定，1.0 → 1.035（只让纸在呼吸里浮一点）。 */
import type { FC } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { Slide } from '../components/SceneKit';
import { InkPaper, POEM_COLS } from '../components/InkPaper';
import { Caption } from '../components/Caption';
import { LampFlame } from '../components/d-lamp';
import { CLAMP, CURVES } from '../motion-tokens';

/** 六列（诗 L1–L4）：11 + 11 + 8 + 9 + 14 + 10 = 63 字 */
const LINES = POEM_COLS.slice(0, 6);
const TOTAL_CHARS = LINES.reduce((s, l) => s + l.length, 0);
/** 入场时 L1–L2 已写完 */
const START = (POEM_COLS[0].length + POEM_COLS[1].length) / TOTAL_CHARS;

const S36: FC = () => {
  const f = useCurrentFrame();
  const progress = interpolate(f, [12, 160], [START, 1], { ...CLAMP, easing: CURVES.cineEaseInOut });

  return (
    <Slide zoom={[1.0, 1.035]} warm={0.02}>
      <InkPaper base="p-paper-lamp" lines={LINES} progress={progress} size={52} right="13%" top="12%">
        <LampFlame frame={f} at={{ x: 112, y: 220 }} size={32} />
      </InkPaper>
      <Caption cue="s36" tone="ink" />
    </Slide>
  );
};

export default S36;