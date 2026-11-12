/* S27 · Act 5 灯亮 · 局部帧 [0,96) · 96f · 绝对 3990–4086
 *
 * 白闪前真空镜：静是「真空」叙事本身（门 3 静止豁免，头注释裁定）——满屏文章行忽然
 * 失焦、压暗、骤停半拍，世界在切换前屏住呼吸；58–86 的静寂是本镜意义。
 * 白闪避让（絕不动）：本镜止于绝对 4086，全片唯一白闪 FN-47 涨满 4086–4089、峰值 4089
 * 纯白——镜内白光线只在 86–96（=绝对 4076–4086）升到 30% 做亮度交接，絕不在 84 前后
 * 加任何亮件。
 * 编排四问：
 *   承接 = s26 交出的满屏文章列表（首帧同构线框面板，随即失焦）；
 *   触发 = 拉焦+压暗执行「真空」（日期 2026-06-14 自缝隙浮出是唯一活口）；
 *   展开 = 帧级节奏：0–18 快速拉焦（blur 0→7）→ 18–58 压暗交叉（0→0.55）→ 40–60 日期浮出 → 58–86 骤停半拍（真空叙事静止；日期辉光呼吸微动不算静止）→ 86–96 白光线 scaleX 0→1 / 0→0.3；
 *   交接 = 尾帧：暗场中一线白光（交接态：黑场+白光线，亮度交 s28 白闪涨满）。
 * 逐拍帧表（fps=30）：
 *   [0–18]   文章数据行失焦（blur 0→7，cineEaseOut）；机位不动 scale 1.05（原样）；
 *   [18–58]  spaceDeep 压暗交叉 0→0.55；
 *   [40–60]  「2026-06-14」writeFade 自列表缝隙浮出（暖纸白+辉光，辉光强度随 sin 呼吸 ±0.08）；
 *   [58–86]  真空骤停（叙事静止豁免段；呼吸微动保留）；
 *   [86–96]  镜内白光线（中央 y539）scaleX 0→1 + opacity 0→0.3 = 绝对 4076–4086 亮度匹配交接白闪。
 * 时间轴零改动：96f / 各窗原样；转场：入「切」，出「切」。无字幕（白闪前真空）。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES, writeFade } from '../../../brand/motion';
import { FILM_COLORS2, glowText } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 96;

const S27: FC = () => {
  const frame = useCurrentFrame();
  const blur = interpolate(frame, [0, 18], [0, 7], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const darken = interpolate(frame, [18, 58], [0, 0.55], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const cam = { scale: 1.05, x: 0, y: 0, rot: 0 };
  const lightW = interpolate(frame, [86, TOTAL], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn });
  const lightOp = interpolate(frame, [86, TOTAL], [0, 0.3], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn });
  // 日期辉光呼吸（真空段的微动，不算静止）
  const dateGlow = 0.45 + Math.sin(frame / 8) * 0.08;

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s27v2" stars={26} grid />
      <CameraRig cam={cam}>
        <AbsoluteFill>
          {/* 满屏文章数据行（承接上镜，失焦压暗） */}
          <div style={{ position: 'absolute', left: 150, top: 70, right: 150, bottom: 70, filter: `blur(${blur}px)` }}>
            <div style={{ position: 'absolute', left: 60, top: 40, width: 420, height: 30, borderRadius: 3, background: `rgba(212,163,115,0.45)` }} />
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{ position: 'absolute', left: 70, top: 170 + i * 74, width: 1000, height: 60, borderRadius: 4, background: 'rgba(23,20,16,0.85)', border: `1px solid ${FILM_COLORS2.line}`, opacity: 0.9 }} />
            ))}
          </div>
          {/* 日期自缝隙浮出（40–60；辉光呼吸） */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 430, textAlign: 'center', ...writeFade(frame, 40, true), zIndex: 30 }}>
            <span style={{ fontFamily: fontFamilies.mono, fontSize: 64, color: FILM_COLORS2.paperWhite, fontVariantNumeric: 'tabular-nums', letterSpacing: '0.14em', ...glowText(FILM_COLORS2.paperWhite, dateGlow, '245,240,232') }}>2026-06-14</span>
          </div>
          {/* 压暗 */}
          <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep, opacity: darken, pointerEvents: 'none' }} />
        </AbsoluteFill>
      </CameraRig>
      {/* 镜内白光线（中央一线，将亮未亮 → 30% 交白闪；86–96 窗原样，白闪窗 4089 避让絕不动） */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 539,
          height: 2,
          background: FILM_COLORS2.paperWhite,
          transform: `scaleX(${lightW})`,
          opacity: lightOp,
          boxShadow: `0 0 24px 6px rgba(245,240,232,${lightOp})`,
        }}
      />
      <HudChrome label="wuh.site · CUTOVER" readout="D-DAY" />
      <Grade2 id="GR2-05" />
    </AbsoluteFill>
  );
};

export default S27;
