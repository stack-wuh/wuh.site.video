/* S27 · 晨课，弟子两列背影，她走过，不出声 210f
 *
 * v11 §3.9（用户意见 14「一坨黑色是什么东西」）的**最终处置：不叠任何代码人物**。
 * 试过两版都不成立：
 *   v10  `XiangFigure age="40b"`（ROBE = colors.ink）→ 一块纯黑小身影，跟底图水彩弟子不同族；
 *   v11a `d-mist-figure` 浅灰青扁平人形（受光边 + 半透明压暗）→ 明度对了，但放大看仍是
 *        「贴在画上的矢量人」：圆头、无发丝/衣纹/笔触，跟底图那两列手绘弟子不是一种东西。
 * 结论：底图 `p-morning` 已经画好两列弟子与长阶，这一镜的信息量由**画面 + 旁白**
 * （「十六岁出门，四十岁出家」）承担，人物层不加比加好。
 *
 * 镜内只做两件事：极缓推镜（1.0 → 1.05）+ 晨光呼吸；转场归 ShotShell。无字幕。 */
import type { FC } from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { Scene } from '../components/SceneKit';
import { CLAMP } from '../motion-tokens';

const S27: FC = () => {
  const f = useCurrentFrame();
  /* 晨光呼吸：一个很慢的正弦，只在 0.03 的幅度里（推镜时观众不会注意，但画面不是死的） */
  const breathe = 0.5 + 0.5 * Math.sin((f / 210) * Math.PI * 2 * 0.6);
  const dim = interpolate(breathe, [0, 1], [0.02, 0.0], CLAMP);
  return <Scene name="p-morning" zoom={[1.0, 1.05]} dim={dim} />;
};

export default S27;