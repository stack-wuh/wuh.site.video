/* S29 · Act 5 灯亮 · 局部帧 [0,252) · 252f · 绝对 4254–4506
 *
 * V2 深空数据流重写（2026-11-11 品牌暖黑科技）：《重启计划》金句主角化——机位自
 * 首屏骨架下沉（0–36 窗口原样，s28 线框首屏残影缩小上移淡出）；《重启计划》落在
 * 线框计划面板（panel 底 + line 边 + 辉光，serif 68 + glowText）+ 角标 2026-06-21；
 * 引文逐行压进面板（66/106/146，末行「开始重启计划~~」，write-fade 窗口原样）；
 * 重启钤印 206=绝对 4460=拍223 对音（sealStamp 6f 落下 + 印泥晕开 + paperShake
 * 参数原样）——本镜唯一手作签名点；落幅后全镜按住不动（locked），停 2 拍；
 * 尾帧钤印朱红晕开成 sealRed 辉光（交 s30 墨洇晕心）。
 * 转场：入「切」，出「切」。字幕安全窗：start≥12、end≤240。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES, sealStamp, sealTilt, writeFade } from '../../../brand/motion';
import { FILM_COLORS2, glowText, paperShake } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 252;
const SEAL_AT = 206; // 绝对 4460 = 拍223
const QUOTE_LINES = [
  { text: '『……每周发布一篇博客，', delay: 66 },
  { text: '无限进步，', delay: 106 },
  { text: '开始重启计划~~』', delay: 146 },
];

const S29: FC = () => {
  const frame = useCurrentFrame();
  // 机位自首屏骨架下沉（0–36）：残影缩小上移淡出
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
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s29v2" stars={40} grid />
      <CameraRig cam={cam}>
        <AbsoluteFill>
          {/* s28 线框首屏残影（下沉退场） */}
          <div
            style={{
              position: 'absolute',
              left: 380,
              right: 380,
              top: 60,
              height: 420,
              borderRadius: 12,
              border: `1px solid ${FILM_COLORS2.line}`,
              background: FILM_COLORS2.panel,
              opacity: (1 - sink) * 0.7,
              transform: `translateY(${-sink * 60}px) scale(${1 - sink * 0.06})`,
            }}
          >
            <div style={{ position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center' }}>
              <span style={{ fontFamily: fontFamilies.serif, fontSize: 56, fontWeight: 700, color: FILM_COLORS2.paperWhite, opacity: 0.5 }}>wuh.site</span>
            </div>
          </div>
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, rgba(10,9,8,0.8), ${FILM_COLORS2.spaceDeep})`, opacity: 1 - sink * 0.55 }} />

          {/* 线框计划面板（机位落幅后 locked） */}
          <div style={{ position: 'absolute', left: 460, top: 190, width: 1000, height: 720, opacity: sink }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 10, background: FILM_COLORS2.panel, border: `1px solid ${FILM_COLORS2.line}`, boxShadow: `0 0 44px rgba(212,163,115,0.12), 0 26px 70px rgba(0,0,0,0.55)` }} />
            {/* 标题落下 + 角标 */}
            <div style={{ position: 'absolute', left: 90, top: 60, ...titleIn }}>
              <span style={{ fontFamily: fontFamilies.serif, fontSize: 68, color: FILM_COLORS2.paperWhite, letterSpacing: '0.06em', ...glowText(FILM_COLORS2.paperWhite, 0.3, '245,240,232') }}>《重启计划》</span>
            </div>
            <div style={{ position: 'absolute', right: 80, top: 74, fontFamily: fontFamilies.mono, fontSize: 20, color: FILM_COLORS2.textMuted, opacity: interpolate(frame, [44, 56], [0, 0.75], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), fontVariantNumeric: 'tabular-nums' }}>
              2026-06-21
            </div>
            <div style={{ position: 'absolute', left: 90, right: 90, top: 172, height: 1, background: FILM_COLORS2.line }} />
            {/* 引文逐行压进面板（每行像数据行排入） */}
            {QUOTE_LINES.map((line, i) => (
              <div key={i} style={{ position: 'absolute', left: 90, top: 220 + i * 90, ...writeFade(frame, line.delay, true) }}>
                <span style={{ fontFamily: fontFamilies.serif, fontSize: 40, color: FILM_COLORS2.paperWhite, opacity: 0.94 }}>{line.text}</span>
                {/* 排入基线（数据行线） */}
                <div style={{ position: 'absolute', left: 0, right: 0, bottom: -10, height: 1.5, background: FILM_COLORS2.line, opacity: Number(writeFade(frame, line.delay).opacity ?? 0) * 0.55 }} />
              </div>
            ))}
            {/* 重启钤印（206=拍223 对音，6f 落下 + 印泥晕开）——手作签名点 */}
            <div style={{ position: 'absolute', right: 120, top: 470, zIndex: 30, ...sealStamp(frame, SEAL_AT, 30, sealTilt('s29-restart')) }}>
              <div style={{ position: 'relative', width: 210, height: 210, borderRadius: 10, background: FILM_COLORS2.sealRed, opacity: 0.93, boxShadow: `0 0 34px rgba(122,31,22,0.4)` }}>
                <div style={{ position: 'absolute', inset: 12, border: `2px solid ${FILM_COLORS2.paperWhite}`, opacity: 0.4, borderRadius: 6 }} />
                <div style={{ position: 'absolute', left: 0, right: 0, top: 62, textAlign: 'center', fontFamily: fontFamilies.serif, fontSize: 40, color: FILM_COLORS2.paperWhite, letterSpacing: '0.1em' }}>
                  重启
                </div>
                <div style={{ position: 'absolute', left: 0, right: 0, top: 118, textAlign: 'center', fontFamily: fontFamilies.serif, fontSize: 40, color: FILM_COLORS2.paperWhite, letterSpacing: '0.1em' }}>
                  计划
                </div>
              </div>
              {/* 印泥晕开一圈 */}
              {frame >= SEAL_AT ? (
                <div style={{ position: 'absolute', left: -30, top: -30, width: 270, height: 270, borderRadius: 135, border: `2px solid ${FILM_COLORS2.sealRed}`, opacity: interpolate(frame, [SEAL_AT, SEAL_AT + 26], [0.5, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }} />
              ) : null}
            </div>
            {/* 尾帧：朱红晕光（延续到镜尾交 s30 晕心） */}
            {frame >= SEAL_AT ? (
              <AbsoluteFill style={{ background: `radial-gradient(circle at 78% 62%, rgba(122,31,22,0.22), transparent 55%)`, opacity: interpolate(frame, [SEAL_AT, TOTAL], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), pointerEvents: 'none' }} />
            ) : null}
          </div>
          {shake.transform ? <AbsoluteFill style={shake} /> : null}
        </AbsoluteFill>
      </CameraRig>
      <HudChrome label="wuh.site · RESTART" readout="2026-06-21" />
      <Grade2 id="GR2-05" />
      <Caption text="一周后，他写下《重启计划》：『……每周发布一篇博客，无限进步，开始重启计划~~』" appearAt={64} bottom={110} />
    </AbsoluteFill>
  );
};

export default S29;
