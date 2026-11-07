/* S33 · 经卷与灯焰 · 经卷里空着（210f · 入「墨洇」）
 *
 * v12 分镜 Act 7：经卷与灯焰；经卷里空着——没有金针。底图 `p-sutra`（旧）。
 *
 * 与前几版相反，本镜**什么也不放**：v11 的「两枚金针放进经卷夹层」在这版剧本里已经不存在
 * （三枚针都在前四幕用掉了），这一镜的戏就是「翻开、空的」。
 * 底图 p-sutra 是一摞抄本 + 摊开的经卷（画面里没有灯盏入画），所以代码只做两件事：
 *   · 灯焰：不在画里画灯，只让「灯的光」呼吸——一层极淡的暖金光（screen）按 90f 周期起伏，
 *     光从左上（抄本受光的那一侧）来；
 *   · 浮尘：光里的尘，证明这间屋子有人刚离开。
 * 镜头：微距·俯，1.0 → 1.045，慢到像呼吸。
 */
import type { FC } from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import { colors } from '../../../brand/tokens';
import { ShotScene } from '../components/e-scene';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { LightWash } from '../components/LightWash';
import { useBreath } from '../components/use-breath';
import { FILM, CLAMP } from '../motion-tokens';

/** 本镜时长（manifest durationFrames——ShotScene 用它算推拉进度，不读 useVideoConfig） */
const TOTAL = 210;

const S34: FC = () => {
  const f = useCurrentFrame();
  /* 灯焰呼吸（useBreath 150f）：本镜 210f，走约 1.3 个来回；亮度只在 0.07–0.11 里走，不抢底图的暖纸 */
  const breath = useBreath(150);
  const glow = interpolate(breath, [0, 1], [0.07, 0.11], CLAMP);

  return (
    <ShotScene name="p-sutra" total={TOTAL} frame={f} zoom={[1.0, 1.045]} warm={0.04} dim={0.02}>
      {/* 灯的光（灯不在画里）：从抄本受光的那一侧漫过来 —— 盒子形态的 LightWash */}
      <LightWash
        box={{ left: 180, top: 60, width: 1180, height: 900, radius: '50%' }}
        shape="ellipse at 38% 34%"
        stops={[[FILM.fireGold, 0], [colors.gold, 34], ['transparent', 70]]}
        strength={glow}
        blur={60}
        blend="screen"
      />
      <DustField act={6} count={22} seedBase="s34-sutra" wind={3} />
      <Caption cue="s33" tone="ink" />
    </ShotScene>
  );
};

export default S34;