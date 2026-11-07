/* S39 · 尾 · 落日特写（210f · 入「硬切」）
 *
 * 用户改动（2026-11-07 11:0x）：这里不再是一张「照片道具」——是她那张落日的**水墨版**
 * （`photo-nianian-ink`，美术已出的那张），整幅铺满、缓推，和序·s02 是同一个画面，首尾呼应。
 * 代码只做两件：
 *   · 缓推 1.0 → 1.05（推到那轮太阳，和序里推的是同一段路）；
 *   · 落日的暖光呼吸（screen 极淡的一层，90f 一个来回）——光心压在那轮太阳上
 *     （量自 photo-nianian-ink：太阳 ≈ 画面 46% / 86%，树影在右）。
 * 不叠纸纹、不叠手持：这不是手里的物件，是天。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { Scene } from '../components/SceneKit';
import { Caption } from '../components/Caption';
import { FILM, CLAMP } from '../motion-tokens';

const S39: FC = () => {
  const f = useCurrentFrame();
  const breath = 0.5 + 0.5 * Math.sin((f / 90) * Math.PI * 2);
  const glow = interpolate(breath, [0, 1], [0.02, 0.055], CLAMP);
  return (
    <Scene name="photo-nianian-ink" zoom={[1.0, 1.05]} warm={0.03} dim={0.02}>
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          mixBlendMode: 'screen',
          background: `radial-gradient(ellipse 38% 26% at 46% 86%, ${FILM.fireGold} 0%, ${colors.gold} 34%, transparent 72%)`,
          opacity: glow,
        }}
      />
      <Caption cue="s39" tone="ink" />
    </Scene>
  );
};

export default S39;