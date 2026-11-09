/* S50 · Act 8 此刻 · 局部帧 [0,100) · 100f · 绝对 6854–6954
 *
 * 版本雨：星轨环收紧成时间轴刻度（0–16），2026-08-22 release 节点短线亮起（16–28）；
 * 119 枚版本光点成雨斜落——最早 v2.0.0（2024-12-08）先落定轴起点作锚（标识不滚），
 * 其余 118 枚逐枚快落、越落越快（★DAT-08 accel，末颗 86=绝对 6940=拍347 对音），
 * 每颗落定闪一次；雨幕止于 2026-11-08；末 16f 减速雨歇。
 * 转场：入「切」，出「切」。字幕安全窗：start≥12、end≤88。
 * 尾帧：雨歇、时间轴密布光点。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { random } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { FILM_COLORS } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const TOTAL = 100;
const V_TOTAL = 119;
const V_ANCHOR = 0; // v2.0.0 锚
const V_RAIN = 118; // 逐枚快落
const RAIN_END = 86; // 末颗 = 拍347

const S50: FC = () => {
  const frame = useCurrentFrame();
  const ringIn = interpolate(frame, [0, 16], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const nodeIn = interpolate(frame, [16, 28], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cam = {
    scale: 1.06,
    x: interpolate(frame, [0, TOTAL], [60, -60], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    y: interpolate(frame, [0, TOTAL], [-30, 10], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    rot: 0,
  };

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DustField act={8} count={20} seedBase="s50" />

          {/* 星轨环收紧（0–16 残影） */}
          {ringIn > 0 ? <div style={{ position: 'absolute', left: 700, top: 300, width: 520, height: 520, borderRadius: 260, border: `1px solid ${FILM_COLORS.goldMist}`, opacity: ringIn * 0.5, transform: `scale(${0.6 + ringIn * 0.4})` }} /> : null}

          {/* 时间轴 + release 节点 */}
          <div style={{ position: 'absolute', left: 140, right: 140, top: 640, height: 2, background: colors.muted, opacity: 0.5 }} />
          <div style={{ position: 'absolute', left: 1500, top: 612, width: 3, height: 32, background: colors.gold, opacity: nodeIn }}>
            <span style={{ position: 'absolute', left: -60, top: -34, fontFamily: fontFamilies.mono, fontSize: 15, color: colors.gold, opacity: 0.9, whiteSpace: 'nowrap' }}>2026-08-22 · release</span>
          </div>

          {/* 锚：v2.0.0 落轴起点（标识不滚） */}
          <div style={{ position: 'absolute', left: 180, top: 626, opacity: interpolate(frame, [12, 20], [0, 0.9], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
            <div style={{ width: 12, height: 12, borderRadius: 6, background: colors.paper }} />
            <span style={{ position: 'absolute', left: -40, top: 20, fontFamily: fontFamilies.mono, fontSize: 14, color: colors.muted, whiteSpace: 'nowrap' }}>v2.0.0 · 2024-12-08</span>
          </div>

          {/* 118 枚版本雨（accel 越落越快，每颗落定闪一次） */}
          {Array.from({ length: V_RAIN }).map((_, i) => {
            const k = Math.pow(i / (V_RAIN - 1), 1.65);
            const land = 20 + k * (RAIN_END - 20);
            if (frame < land) return null;
            const x = 220 + (i / V_RAIN) * 1280 + (random(`s50-x-${i}`) - 0.5) * 36;
            const y = 640 - 8 - random(`s50-y-${i}`) * 60;
            const flash = interpolate(frame, [land, land + 2, land + 7], [0, 0.9, 0.25], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            return (
              <div key={i} style={{ position: 'absolute', left: x, top: y, width: 7, height: 7, borderRadius: 3.5, background: FILM_COLORS.goldMist, opacity: 0.55 + flash * 0.45, boxShadow: flash > 0.2 ? `0 0 8px 2px rgba(245,233,200,${flash * 0.5})` : 'none' }} />
            );
          })}
          {/* 雨幕止点 2026-11-08 */}
          <span style={{ position: 'absolute', left: 1690, top: 668, fontFamily: fontFamilies.mono, fontSize: 15, color: colors.muted, opacity: interpolate(frame, [RAIN_END, TOTAL], [0, 0.75], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>2026-11-08</span>
          <span style={{ position: 'absolute', left: 180, top: 700, fontFamily: fontFamilies.mono, fontSize: 15, color: colors.muted, opacity: 0.5 }}>{V_TOTAL} tags</span>
        </AbsoluteFill>
      </CameraRig>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 300, backgroundImage: `linear-gradient(180deg, transparent, ${colors.bg})`, opacity: 0.24 }} />
      <PaperGrain opacity={0.06} />
      <Grade id="GR-08" />
      <Caption text="八月，发布脚本落地。两个半月，118 个版本。" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S50;
