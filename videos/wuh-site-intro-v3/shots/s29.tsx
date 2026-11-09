/* S29 · Act 5 灯亮 · 局部帧 [0,252) · 252f · 绝对 4254–4506
 *
 * 《重启计划》：机位自首屏下沉到纸笺（0–36）；《重启计划》标题落下（36–56）
 * + 纸笺角标 2026-06-21；引文逐行压进纸笺（66/106/146，末行「开始重启计划~~」）；
 * 重启钤印 206=绝对 4460=拍223 对音（6f 落下 + 印泥晕开 + 纸面轻震）；
 * 落幅后全镜按住不动（locked），停 2 拍。
 * 转场：入「切」，出「切」（尾帧朱红晕光交镜 30 墨洇）。
 * 字幕安全窗：start≥12、end≤240。
 * 尾帧：钤印朱色晕开成红光。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, sealStamp, sealTilt, writeFade } from '../../../brand/motion';
import { paperShake } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const TOTAL = 252;
const SEAL_AT = 206; // 绝对 4460 = 拍223
const QUOTE_LINES = [
  { text: '『……每周发布一篇博客，', delay: 66 },
  { text: '无限进步，', delay: 106 },
  { text: '开始重启计划~~』', delay: 146 },
];

const S29: FC = () => {
  const frame = useCurrentFrame();
  // 机位自首屏下沉到纸笺（0–36）：背景首屏缩小上移淡出
  const sink = interpolate(frame, [0, 36], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const cam = {
    scale: interpolate(frame, [0, 36], [1.02, 1.08], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    x: 0,
    y: interpolate(frame, [0, 36], [40, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    rot: 0,
  };
  const shake = paperShake(frame, SEAL_AT, 2, 10);
  const titleIn = writeFade(frame, 36, true);

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DustField act={5} count={16} seedBase="s29" />

          {/* 首屏残影（下沉退场） */}
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, rgba(30,24,18,0.9), ${colors.bg})`, opacity: 1 - sink * 0.6 }} />

          {/* 手写感纸笺（机位落幅后 locked） */}
          <div style={{ position: 'absolute', left: 460, top: 190, width: 1000, height: 720, opacity: sink }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 8, background: colors.paper, border: `1px solid ${colors.paperMuted}`, boxShadow: '0 22px 60px rgba(0,0,0,0.3)', transform: 'rotate(-0.8deg)' }} />
            {/* 标题落下 + 角标 */}
            <div style={{ position: 'absolute', left: 90, top: 60, ...titleIn }}>
              <span style={{ fontFamily: fontFamilies.serif, fontSize: 68, color: colors.ink, letterSpacing: '0.06em' }}>《重启计划》</span>
            </div>
            <div style={{ position: 'absolute', right: 80, top: 74, fontFamily: fontFamilies.mono, fontSize: 20, color: colors.muted, opacity: interpolate(frame, [44, 56], [0, 0.75], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), fontVariantNumeric: 'tabular-nums' }}>
              2026-06-21
            </div>
            <div style={{ position: 'absolute', left: 90, right: 90, top: 172, height: 1, background: colors.muted, opacity: 0.4 }} />
            {/* 引文逐行压进纸笺（每行像铅字排入） */}
            {QUOTE_LINES.map((line, i) => (
              <div key={i} style={{ position: 'absolute', left: 90, top: 220 + i * 90, ...writeFade(frame, line.delay, true) }}>
                <span style={{ fontFamily: fontFamilies.serif, fontSize: 40, color: colors.ink, opacity: 0.92, backgroundColor: i === 2 ? 'transparent' : 'transparent' }}>{line.text}</span>
                {/* 铅字排入的基线 */}
                <div style={{ position: 'absolute', left: 0, right: 0, bottom: -10, height: 2, background: colors.muted, opacity: writeFade(frame, line.delay).opacity * 0.2 }} />
              </div>
            ))}
            {/* 重启钤印（206=拍223 对音，6f 落下 + 印泥晕开） */}
            <div style={{ position: 'absolute', right: 120, top: 470, zIndex: 30, ...sealStamp(frame, SEAL_AT, 30, sealTilt('s29-restart')) }}>
              <div style={{ position: 'relative', width: 210, height: 210, borderRadius: 10, background: colors.seal, opacity: 0.93 }}>
                <div style={{ position: 'absolute', inset: 12, border: `2px solid ${colors.paper}`, opacity: 0.4, borderRadius: 6 }} />
                <div style={{ position: 'absolute', left: 0, right: 0, top: 62, textAlign: 'center', fontFamily: fontFamilies.serif, fontSize: 40, color: colors.paper, letterSpacing: '0.1em' }}>
                  重启
                </div>
                <div style={{ position: 'absolute', left: 0, right: 0, top: 118, textAlign: 'center', fontFamily: fontFamilies.serif, fontSize: 40, color: colors.paper, letterSpacing: '0.1em' }}>
                  计划
                </div>
              </div>
              {/* 印泥晕开一圈 */}
              {frame >= SEAL_AT ? (
                <div style={{ position: 'absolute', left: -30, top: -30, width: 270, height: 270, borderRadius: 135, border: `2px solid ${colors.seal}`, opacity: interpolate(frame, [SEAL_AT, SEAL_AT + 26], [0.5, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }} />
              ) : null}
            </div>
            {/* 尾帧：朱红晕光（延续到镜尾交墨洇） */}
            {frame >= SEAL_AT ? (
              <AbsoluteFill style={{ background: `radial-gradient(circle at 78% 62%, rgba(201,111,74,0.2), transparent 55%)`, opacity: interpolate(frame, [SEAL_AT, TOTAL], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), pointerEvents: 'none' }} />
            ) : null}
          </div>
          {shake.transform ? <AbsoluteFill style={shake} /> : null}
        </AbsoluteFill>
      </CameraRig>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 300, backgroundImage: `linear-gradient(180deg, transparent, ${colors.bg})`, opacity: 0.22 }} />
      <PaperGrain opacity={0.07} />
      <Grade id="GR-03" />
      <Caption text="一周后，他写下《重启计划》：『……每周发布一篇博客，无限进步，开始重启计划~~』" appearAt={64} bottom={110} />
    </AbsoluteFill>
  );
};

export default S29;
