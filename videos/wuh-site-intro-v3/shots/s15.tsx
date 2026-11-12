/* S15 · Act 3 第一行 · 局部帧 [0,114) · 114f · 绝对 2352–2466
 *
 * V3 批次 A 重做（2026-11-12 六门验收 + 审计返工单 · 画面汇总镜：呼吸语义保留，落定必配冲击）：
 * 【承接】首帧承接 s14 尾帧交出的「纸山半成 + Σ 89 篇」——左下角线框卡山剪影驻留（交接
 *         语义），山顶的 89 被推上全屏。
 * 【触发】主动作 = ★DAT-03 NUM-SLAM：bigNum「89」全屏滚动落定（28–48，落定 48=绝对
 *         2400=ANCHORS.slam89=拍120 对音，絕不动）——落定瞬间 shockwave 双环 + sparkBurst
 *         金粒 + sheenSweep 金光横扫 + 辉光脉冲（SLAM 三连）；随后「2023 · 30｜2024 · 59」
 *         分解行微滚（52–68，落定 68=拍121 静默，窗口原样）。
 * 【展开】逐拍帧表（局部帧，fps=30）：
 *   [0–15]    卡山剪影驻留（承接 s14）+ cam y 60→0 缓降（原窗）+ handheld('s15-cam',1.0)
 *             + dataCurtain('s15-rain',6 列,110)；
 *   [16–26]   HUD 标题 TWO YEARS OF WRITING · 2023–2024 writeFade；
 *   [28–48]   「89」bigNum 0→89 滚动（20f），落定 48=拍120：
 *             shockwave('212,163,115') 双环 + sparkBurst('s15-burst',14 粒金) + sheenSweep(44–56)
 *             + scale 1.045→1 SLAM + 辉光脉冲（token 自带）；
 *   [44–52]   「篇 · 两年写下」注脚淡入（原窗）；
 *   [52–68]   分解行「2023 · 30｜2024 · 59」微滚（52/54→68/59 落定=拍121 静默）+ writeFade(64)；
 *   [68–114]  呼吸段：卡山微呼吸 + 年份辉光衰减驻留 + DeepSpace 星漂/数据流星——尾帧交接态。
 * 【交接】尾帧 = 大数 89 + 年度分解行静住、卡山余光（manifest endFrameDesc：纸山+汇总页
 *         静住，交接态：山顶汇总页）→ 交 s16「重音前摇」日期锁定。
 * 意义一句话：两年的写作被一个大数钉在墙上——89 篇，落定即回声。
 * 时间轴零改动：114f / bigNum 28–48（落定 48 对音）/ 分解 52–68（落定 68 对音）/ cam pull 原样；
 * 无 Caption（画面汇总）。转场：入「切」，出「切」。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES, writeFade } from '../../../brand/motion';
import {
  FILM_COLORS2,
  bigNum,
  dataCurtain,
  glowText,
  handheld,
  sheenSweep,
  shockwave,
  sparkBurst,
} from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 114;
const SLAM_AT = 48; // 「89」落定 = 绝对 2400 = 拍120（对音，絕不动）
/** 大数字视觉中心（top 270 + 字号一半≈157，水平居中 960） */
const NUM_CY = 427;

const S15: FC = () => {
  const frame = useCurrentFrame();
  // ★DAT-03 大数「89 篇」全屏滚动 + slam（28–48 落定=拍120）
  const slam = bigNum(frame, 28, 20, 0, 89);
  // 落定瞬间（48）：双环 + 金粒
  const wave = shockwave(frame, SLAM_AT, '212,163,115');
  const burst = sparkBurst('s15-burst', frame, SLAM_AT, 14, true);
  // ★DAT-01 小字微滚（52–68，窗口原样）
  const y30 = Math.round(interpolate(frame, [52, 68], [25, 30], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.numRollOut }));
  const y59 = Math.round(interpolate(frame, [52, 68], [54, 59], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.numRollOut }));
  // 左下角卡山剪影（承接 s14 卡山，5 张线框卡）+ 呼吸微动
  const stack = [0, 1, 2, 3, 4];
  const hh = handheld('s15-cam', frame, 1.0);
  const cam = {
    scale: interpolate(frame, [0, 99, TOTAL], [1.1, 1.02, 1.005], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    x: hh.dx,
    y: interpolate(frame, [0, 60], [60, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }) + hh.dy,
    rot: hh.rot,
  };
  const rain = dataCurtain('s15-rain', frame, 6, 110);

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s15v2" stars={56} grid horizon />
      {/* 数字雨帘（背景氛围层） */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 2, pointerEvents: 'none' }}>
        {rain.map((c, i) => (
          <span key={`rain-${i}`} style={{ position: 'absolute', left: `${c.x}%`, top: c.y, fontFamily: fontFamilies.mono, fontSize: 13, color: FILM_COLORS2.data, opacity: c.o, fontVariantNumeric: 'tabular-nums' }}>
            {c.text}
          </span>
        ))}
      </div>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          {/* 卡山剪影（左下，承接上镜；静置 + 呼吸微动） */}
          <div style={{ position: 'absolute', left: 210, bottom: 110 }}>
            {stack.map((i) => (
              <div
                key={`stack-${i}`}
                style={{
                  position: 'absolute',
                  left: i * 10,
                  bottom: i * 12,
                  width: 380 - i * 34,
                  height: 34,
                  borderRadius: 4,
                  background: FILM_COLORS2.panel,
                  border: `1px solid ${FILM_COLORS2.grid}`,
                  transform: `rotate(${(i % 2 === 0 ? -0.8 : 0.6) + i * 0.1}deg)`,
                  opacity: 0.72 + 0.08 * Math.sin(frame / 15 + i * 1.3),
                }}
              />
            ))}
          </div>

          {/* HUD 标题 */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 170, textAlign: 'center', zIndex: 30, ...writeFade(frame, 16) }}>
            <span style={{ fontFamily: fontFamilies.mono, fontSize: 17, letterSpacing: '0.4em', color: FILM_COLORS2.textMuted }}>TWO YEARS OF WRITING · 2023–2024</span>
          </div>

          {/* 主角：全屏大数字 0→89（落定 SLAM 辉光；44–56 金光横扫） */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 270,
              textAlign: 'center',
              zIndex: 30,
              fontFamily: fontFamilies.mono,
              fontSize: 300,
              fontWeight: 700,
              lineHeight: 1.05,
              color: FILM_COLORS2.data,
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '0.02em',
              opacity: interpolate(frame, [28, 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
              transform: `scale(${slam.slam})`,
              ...glowText(FILM_COLORS2.data, slam.glow),
            }}
          >
            {slam.text}
            {frame >= 44 && frame <= 56 ? <div style={sheenSweep(frame, 44, 12)} /> : null}
          </div>
          {/* 落定瞬间（48）：双环 + 金粒，锚大数字视觉中心（960, 427） */}
          {frame >= SLAM_AT ? (
            <div style={{ position: 'absolute', left: 960, top: NUM_CY, width: 0, height: 0, zIndex: 31, pointerEvents: 'none' }}>
              {wave ? <div style={wave.ring1} /> : null}
              {wave ? <div style={wave.ring2} /> : null}
              {burst.map((p, i) => (
                <div key={`burst-${i}`} style={p.style} />
              ))}
            </div>
          ) : null}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 610, textAlign: 'center', zIndex: 30 }}>
            <span style={{ fontFamily: fontFamilies.mono, fontSize: 18, letterSpacing: '0.5em', color: FILM_COLORS2.textMuted, opacity: interpolate(frame, [44, 52], [0, 0.9], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>篇 · 两年写下</span>
          </div>

          {/* ★DAT-01 小字「2023 · 30｜2024 · 59」微滚（落定 68=拍121 静默） */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 668, textAlign: 'center', zIndex: 30, ...writeFade(frame, 64) }}>
            <span style={{ fontFamily: fontFamilies.mono, fontSize: 24, color: FILM_COLORS2.dataDim, fontVariantNumeric: 'tabular-nums', letterSpacing: '0.14em' }}>
              2023 · {y30}｜2024 · {y59}
            </span>
          </div>
        </AbsoluteFill>
      </CameraRig>
      <HudChrome label="wuh.site · POSTS" readout="2023–2024" />
      <Grade2 id="GR2-03" />
    </AbsoluteFill>
  );
};

export default S15;
