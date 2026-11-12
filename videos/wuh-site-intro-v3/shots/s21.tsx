/* S21 · Act 4 留白 · 局部帧 [0,150) · 150f · 绝对 3036–3186
 *
 * 「四步然后安静」审计重定义：四枚步骤节点逐个 springIn 亮（建站→迁移→配置→发布，
 * 以站点真实上线过程为据，标签词从简）→然后长静。★长静（34–150）是叙事本身：
 * 「然后长久地安静」——此段静止是本镜意义（门 3 静止豁免，头注释裁定），空白段刻度/
 * 数据细丝/微尘/刻度盘均作极低强度呼吸级节拍，不作动作。
 * 编排四问：
 *   承接 = s20 交出的四点悬停暗场（首帧暗场，数据轴自暗显出）；
 *   触发 = 四枚步骤节点逐个 springIn 点亮（2025-06 三步 + 2025-07 一步 = 真实上线四动作）；
 *   展开 = 帧级节奏 LANDS=[4,12,20,30]（6–10f 步进，每点 6f 细环），34 起长静；微尘 84–104 落定（104=拍157）、刻度盘 124–150 显出为静中余拍；
 *   交接 = 尾帧：空白段尽头一枚微尘落定、刻度盘微光显出（交接态：微尘+刻度盘，交 s22 大字 0）。
 * 逐拍帧表（fps=30）：
 *   [0–4]    数据轴显出（opacity 0.55 恒态承接暗场）；
 *   [4/12/20/30] 四步节点 springIn 弹入（scale 0.4→1 + 辉光）+ 6f 细环扩散；步骤标签（建站/迁移/配置/发布）+8f springIn 落位；
 *   [24–34]  月份标注落位即现（2025-06 ×3 / 2025-07 ×1，标识不滚）；
 *   [34–84]  长静（叙事静止；空白段刻度 08……11 恒态）；
 *   [64–124] 数据细丝极缓上浮（9 根，低透明度 0.16，呼吸级）；
 *   [84–104] 一枚数据微尘坠落落定（104=拍157 对音，絕不动）；
 *   [124–150] 线框刻度盘微光显出（dataDim 环 + 内辉光 0.4/0.1）；
 *   [0–150]  cam 微距横移 slow-pause-slow（44–104 速度≈0，窗原样）——长静内唯一的呼吸位移动。
 * 时间轴零改动：150f / LANDS 表 / 微尘 104 / Caption appearAt 12 原样；转场：入「切」，出「切」。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { FILM_COLORS2, springIn } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 150;
/** 四步 = 站点真实上线过程（2025-06 ×3 + 2025-07 ×1）：建站→迁移→配置→发布，标签词从简 */
const STEPS = [
  { x: 260, land: 4, label: '建站' },
  { x: 330, land: 12, label: '迁移' },
  { x: 410, land: 20, label: '配置' },
  { x: 500, land: 30, label: '发布' },
];

const S21: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // 微距横移（slow-pause-slow：44–104 速度≈0）
  const cam = {
    scale: 1.06,
    x: interpolate(frame, [0, 44, 104, TOTAL], [0, 80, 84, 170], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    y: 0,
    rot: 0,
  };

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s21v2" stars={44} grid horizon />
      <CameraRig cam={cam}>
        <AbsoluteFill>
          {/* 数据轴（暗场中显出） */}
          <div style={{ position: 'absolute', left: 120, right: 120, top: 520, height: 2, background: FILM_COLORS2.line, opacity: 0.55 }} />

          {/* 四枚步骤节点（逐个 springIn 点亮：建站→迁移→配置→发布；每点 6f 细环扩散） */}
          {STEPS.map((s) => {
            const pop = springIn(frame, s.land, fps, 15, 190, 0.8);
            const ringP = interpolate(frame - s.land, [0, 6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            const labelP = springIn(frame, s.land + 8, fps, 15, 180, 0.8);
            return (
              <div key={s.label}>
                <div
                  style={{
                    position: 'absolute',
                    left: s.x - 13,
                    top: 508,
                    width: 26,
                    height: 26,
                    borderRadius: 13,
                    background: FILM_COLORS2.data,
                    opacity: Math.min(0.9, pop * 1.2),
                    transform: `scale(${0.4 + pop * 0.6})`,
                    boxShadow: `0 0 ${12 + pop * 8}px rgba(212,163,115,${0.35 + pop * 0.2})`,
                  }}
                />
                {frame >= s.land && ringP < 1 ? (
                  <div
                    style={{
                      position: 'absolute',
                      left: s.x - 13 - ringP * 9,
                      top: 508 - ringP * 9,
                      width: 26 + ringP * 18,
                      height: 26 + ringP * 18,
                      borderRadius: '50%',
                      border: `1px solid ${FILM_COLORS2.data}`,
                      opacity: 0.55 * (1 - ringP),
                    }}
                  />
                ) : null}
                {/* 步骤标签（+8f springIn 落位，词从简） */}
                <span
                  style={{
                    position: 'absolute',
                    left: s.x - 24,
                    top: 548,
                    width: 48,
                    textAlign: 'center',
                    fontFamily: fontFamilies.mono,
                    fontSize: 17,
                    color: FILM_COLORS2.textMuted,
                    opacity: Math.min(0.75, labelP),
                    transform: `translateY(${(1 - labelP) * 6}px)`,
                  }}
                >
                  {s.label}
                </span>
              </div>
            );
          })}

          {/* 月份标注（落位即现，标识不滚） */}
          <div style={{ position: 'absolute', left: 244, top: 440, fontFamily: fontFamilies.mono, fontSize: 17, color: FILM_COLORS2.textMuted, opacity: interpolate(frame, [24, 34], [0, 0.65], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>2025-06 ×3</div>
          <div style={{ position: 'absolute', left: 478, top: 440, fontFamily: fontFamilies.mono, fontSize: 17, color: FILM_COLORS2.textMuted, opacity: interpolate(frame, [26, 36], [0, 0.65], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>2025-07 ×1</div>

          {/* 空白段刻度（8–11 月，连续空白） */}
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ position: 'absolute', left: 640 + i * 200, top: 506, width: 2, height: 30, background: FILM_COLORS2.line, opacity: 0.35 }} />
          ))}
          <div style={{ position: 'absolute', left: 636, top: 440, fontFamily: fontFamilies.mono, fontSize: 17, color: FILM_COLORS2.textMuted, opacity: 0.4 }}>08 …… 11</div>

          {/* 数据细丝上浮（64–124，空白段里长出微弱数据线；长静中的呼吸级余拍） */}
          {Array.from({ length: 9 }).map((_, i) => {
            const grow = interpolate(frame, [64 + i * 6, 124 + i * 3], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
            const x = 660 + i * 130 + (random(`f21-${i}`) - 0.5) * 60;
            return (
              <div key={i} style={{ position: 'absolute', left: x, top: 522, width: 1.4, height: grow * 60, background: FILM_COLORS2.data, opacity: grow * 0.16, transform: `rotate(${(random(`f21r-${i}`) - 0.5) * 40}deg)`, transformOrigin: 'bottom center' }} />
            );
          })}

          {/* 一枚数据微尘落定（104=拍157 对音，絕不动） */}
          <div
            style={{
              position: 'absolute',
              left: 1090,
              top: interpolate(frame, [84, 104], [470, 516], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn }),
              width: 6,
              height: 6,
              borderRadius: 3,
              background: FILM_COLORS2.paperWhite,
              boxShadow: `0 0 8px rgba(212,163,115,0.5)`,
              opacity: interpolate(frame, [84, 104, 130], [0, 0.8, 0.5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            }}
          />

          {/* 末段：线框刻度盘微光显出（124–150，右下角） */}
          <div
            style={{
              position: 'absolute',
              right: 210,
              top: 240,
              width: 330,
              height: 330,
              borderRadius: 165,
              border: `2px solid ${FILM_COLORS2.dataDim}`,
              opacity: interpolate(frame, [124, TOTAL], [0, 0.4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
              boxShadow: `inset 0 0 40px rgba(212,163,115,${interpolate(frame, [124, TOTAL], [0, 0.1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })})`,
            }}
          />
        </AbsoluteFill>
      </CameraRig>
      <HudChrome label="wuh.site · TIMELINE" readout="SILENCE · 2025" />
      <Grade2 id="GR2-04" />
      <Caption text="2025 年，新站只走了四步，然后长久地安静。" appearAt={12} />
    </AbsoluteFill>
  );
};

export default S21;
