/* S04 · 墨从太阳边缘洇开，吃掉整幅落日，落进黄河渡口 180f
 *
 * v12 分镜（用户 2026-11-07 改）：微距·推 + 墨洇。序与「风陵渡」的接缝镜——落日在这里化成黄河。
 *
 * 走法（按镜头语言排，不做「几何圆」那种假洇）：
 *   0–0.35t   墨从树后那轮太阳（画幅 44.5% / 86.1%）往外洇开：七团墨各自从太阳方向长，
 *             落日的边先被吃掉（墨在纸上是「吃」出来的，不是被剪掉的）；
 *   0.35–0.5t 墨连成一片，整幅压成墨（落日在这层墨底下退场，观众看不见它怎么没的）；
 *   0.5–0.72t 墨退开，露出底下已经画好的黄河渡口（雾先漫上来，岸才出现）；
 *   0.72–1t   渡口的水纹与雾接管，镜头继续向前走一点（落进渡口）。
 *
 * 底下的渡口用 ShotScene（自己的推拉/调色），墨层是独立一层——两件事互不依赖，
 * 所以墨退完之后画面已经是「活」的，不是一张刚贴上来的图。
 *
 * 转场：入「切」，出「墨洇」（s05 的 inbound，20f ×2 归 ShotShell）。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ShotScene } from '../components/e-scene';
import { Caption } from '../components/Caption';
import { INK_SUN, PhotoPlate } from '../components/e-photo';
import { InkBloom } from '../components/InkBloom';
import { WaveField } from '../components/WaveField';
import { MistFlow } from '../components/b-mistflow';
import { CLAMP, CURVES } from '../motion-tokens';

const TOTAL = 210;
/** 落日推近：1.58（接 s03 终点）→ 1.74，一路不停 */
const ZOOM: [number, number] = [1.58, 1.74];

/** 墨团：从太阳（1080, 930）往外铺满整幅的七个位置 */
const SUN_PX = { x: INK_SUN.x * 1920, y: INK_SUN.y * 1080 };
const BLOBS = [
  { x: SUN_PX.x, y: SUN_PX.y, r: 330 },
  { x: 900, y: 742, r: 320 },
  { x: 1276, y: 690, r: 310 },
  { x: 742, y: 500, r: 330 },
  { x: 1420, y: 430, r: 320 },
  { x: 1060, y: 260, r: 330 },
  { x: 470, y: 720, r: 300 },
] as const;

const EASE = { ...CLAMP, easing: CURVES.cineEaseInOut };

const S04: FC = () => {
  const f = useCurrentFrame();
  const t = f / (TOTAL - 1);

  /* ① 墨的涨与退：先吃掉落日，再退开露出渡口 */
  const spread = interpolate(t, [0.06, 0.42], [0, 1], EASE);
  const veil = interpolate(t, [0.2, 0.44, 0.62, 0.78], [0, 0.94, 0.56, 0], EASE);
  /* ② 落日退场：藏在墨底下（不给观众看见它「怎么」没的） */
  const photo = interpolate(t, [0.3, 0.52], [1, 0], EASE);
  /* ③ 渡口的雾：墨一退就漫上来 */
  const mist = interpolate(t, [0.46, 0.86], [0.25, 1], CLAMP);

  return (
    <AbsoluteFill>
      {/* 底下：黄河渡口（镜头继续向前） */}
      <ShotScene name="p-ferry" total={TOTAL} frame={f} zoom={[1.0, 1.1]} warm={0.1}>
        <WaveField seed="s04-river" band={[0.55, 0.8]} amp={4} speed={0.1} opacity={0.24} rows={8} />
        <MistFlow seed="s04-mist" intensity={mist} period={220} count={4} />
      </ShotScene>

      {/* 落日：被墨从下往上吃掉 */}
      <AbsoluteFill style={{ opacity: photo }}>
        <PhotoPlate t={t} zoom={ZOOM} />
      </AbsoluteFill>

      {/* 墨：七团从太阳往外长 + 一层整幅的墨把中间连起来 */}
      {spread > 0.001
        ? BLOBS.map((b, i) => (
            <InkBloom
              key={`${b.x}-${b.y}`}
              progress={0.18 + 0.95 * spread}
              at={{ x: b.x, y: b.y, r: b.r }}
              color={colors.ink}
              opacity={(0.5 - i * 0.03) * spread}
              blur={14}
            />
          ))
        : null}
      {veil > 0.002 ? <AbsoluteFill style={{ background: colors.ink, mixBlendMode: 'multiply', opacity: veil }} /> : null}
      <Caption cue="s04" tone="ink" />
    </AbsoluteFill>
  );
};

export default S04;