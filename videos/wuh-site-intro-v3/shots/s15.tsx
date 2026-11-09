/* S15 · Act 3 第一行 · 局部帧 [0,114) · 114f · 绝对 2352–2466
 *
 * 汇总：纸山堆成小山静住，升至山顶俯看汇总页；山顶一页微微发光，
 * ★DAT-03 NUM-SLAM single「89 篇」快滚+末帧 slam（28–48，落定 48=绝对 2400=拍120 对音）；
 * ★DAT-01 小字「2023 · 30｜2024 · 59」微滚（52–68，落定 68=拍121 静默）；
 * 末 15f 极缓拉（pull）。转场：入「切」，出「切」。无字幕（画面汇总）。
 * 尾帧：纸山+汇总页静住。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, writeFade } from '../../../brand/motion';
import { fmtNum, slamSingle } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const TOTAL = 114;

const S15: FC = () => {
  const frame = useCurrentFrame();
  const cam = {
    scale: interpolate(frame, [0, 99, TOTAL], [1.1, 1.02, 1.005], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    x: 0,
    y: interpolate(frame, [0, 60], [60, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    rot: 0,
  };
  // 纸山（承接上镜叠页，静住）
  const stack = [0, 1, 2, 3, 4];
  // ★DAT-03 single「89 篇」快滚 + slam
  const slam = slamSingle(frame, 28, 20, 0, 89);
  // ★DAT-01 小字微滚（52–68）
  const y30 = Math.round(interpolate(frame, [52, 68], [25, 30], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.numRollOut }));
  const y59 = Math.round(interpolate(frame, [52, 68], [54, 59], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.numRollOut }));

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DustField act={3} count={16} seedBase="s15" />

          {/* 纸山（叠成小山） */}
          <div style={{ position: 'absolute', left: 330, top: 300 }}>
            {stack.map((i) => (
              <div key={i} style={{ position: 'absolute', left: i * 14, top: 220 - i * 26, width: 1000 - i * 60, height: 210 - i * 16, borderRadius: 6, background: i % 2 ? colors.paperDeep : colors.paper, border: `1px solid ${colors.paperMuted}`, transform: `rotate(${(i % 2 === 0 ? -0.8 : 0.6) + i * 0.1}deg)` }} />
            ))}
            {/* 山顶汇总页（微微发光） */}
            <div style={{ position: 'absolute', left: 90, top: 10, width: 840, height: 220, borderRadius: 6, background: colors.paper, border: `1px solid ${colors.paperMuted}`, boxShadow: `0 0 60px rgba(245,233,200,${interpolate(frame, [20, 44], [0.12, 0.3], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })})` }}>
              {/* ★DAT-03 大数「89 篇」 */}
              <div style={{ position: 'absolute', left: 0, right: 0, top: 40, textAlign: 'center', transform: `scale(${slam.slam})` }}>
                <span style={{ fontFamily: fontFamilies.serif, fontSize: 110, color: colors.ink, fontVariantNumeric: 'tabular-nums' }}>{fmtNum(slam.v)}</span>
                <span style={{ fontFamily: fontFamilies.serif, fontSize: 44, color: colors.ink, opacity: interpolate(frame, [44, 52], [0, 0.9], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}> 篇</span>
              </div>
              {/* ★DAT-01 小字「2023 · 30｜2024 · 59」微滚（落定 68=拍121 静默） */}
              <div style={{ position: 'absolute', left: 0, right: 0, top: 168, textAlign: 'center', ...writeFade(frame, 64) }}>
                <span style={{ fontFamily: fontFamilies.mono, fontSize: 24, color: colors.muted, fontVariantNumeric: 'tabular-nums' }}>
                  2023 · {y30}｜2024 · {y59}
                </span>
              </div>
            </div>
          </div>
        </AbsoluteFill>
      </CameraRig>
      <PaperGrain opacity={0.07} />
      <Grade id="GR-02" />
    </AbsoluteFill>
  );
};

export default S15;
