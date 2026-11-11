/* S15 · Act 3 第一行 · 局部帧 [0,114) · 114f · 绝对 2352–2466
 *
 * V2 暖黑数据流重写（2026-11-11 品牌暖黑科技）：「纸山汇总页」改写为「全屏大数字主角」——
 * ★DAT-03 NUM-SLAM single「89 篇」bigNum 全屏滚动落定（28–48，落定 48=绝对 2400=拍120
 * 对音，落定 SLAM 辉光脉冲 + scale 1.045→1）；★DAT-01 小字「2023 · 30｜2024 · 59」
 * 微滚（52–68，落定 68=拍121 静默，窗口原样）；左下角线框卡山剪影承接上镜（交接语义）；
 * 末 15f 极缓拉（cam pull 窗原样：scale 1.1→1.02→1.005 / y 60→0）。
 * 转场：入「切」，出「切」。无字幕（画面汇总）。
 * 尾帧：大数 89 + 年度分解行静住（交接态：汇总数据静置）。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES, writeFade } from '../../../brand/motion';
import { bigNum, FILM_COLORS2, glowText } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 114;

const S15: FC = () => {
  const frame = useCurrentFrame();
  const cam = {
    scale: interpolate(frame, [0, 99, TOTAL], [1.1, 1.02, 1.005], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    x: 0,
    y: interpolate(frame, [0, 60], [60, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    rot: 0,
  };
  // ★DAT-03 大数「89 篇」全屏滚动 + slam（28–48 落定=拍120）
  const slam = bigNum(frame, 28, 20, 0, 89);
  // ★DAT-01 小字微滚（52–68，窗口原样）
  const y30 = Math.round(interpolate(frame, [52, 68], [25, 30], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.numRollOut }));
  const y59 = Math.round(interpolate(frame, [52, 68], [54, 59], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.numRollOut }));
  // 左下角卡山剪影（承接 s14 卡山，5 张线框卡）
  const stack = [0, 1, 2, 3, 4];

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s15v2" stars={56} grid horizon />
      <CameraRig cam={cam}>
        <AbsoluteFill>
          {/* 卡山剪影（左下，承接上镜；静置） */}
          <div style={{ position: 'absolute', left: 210, bottom: 110 }}>
            {stack.map((i) => (
              <div key={i} style={{ position: 'absolute', left: i * 10, bottom: i * 12, width: 380 - i * 34, height: 34, borderRadius: 4, background: FILM_COLORS2.panel, border: `1px solid ${FILM_COLORS2.grid}`, transform: `rotate(${(i % 2 === 0 ? -0.8 : 0.6) + i * 0.1}deg)`, opacity: 0.8 }} />
            ))}
          </div>

          {/* HUD 标题 */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 170, textAlign: 'center', zIndex: 30, ...writeFade(frame, 16) }}>
            <span style={{ fontFamily: fontFamilies.mono, fontSize: 17, letterSpacing: '0.4em', color: FILM_COLORS2.textMuted }}>TWO YEARS OF WRITING · 2023–2024</span>
          </div>

          {/* 主角：全屏大数字 0→89（落定 SLAM 辉光） */}
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
          </div>
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
