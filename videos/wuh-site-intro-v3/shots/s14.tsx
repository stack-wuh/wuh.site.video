/* S14 · Act 3 第一行 · 局部帧 [0,210) · 210f · 绝对 2142–2352
 *
 * V2 暖黑数据流重写（2026-11-11 品牌暖黑科技）：「纸页连翻」改写为「金句数据卡连放」——
 * 五句金句随线框数据卡进出（句窗 38f 含交叠原样：局部 18–208），衬线大字 kinetic
 * （write-fade 8f），每卡角落小字标出处「#165《再读〈坐忘歌〉》· 2026-07-05」
 * （画面文字：标注出处、不推进时间线）；看过的卡越叠越高（错峰 +8px，线框卡驻留），
 * 末段卡山山顶辉光；右下两条 CHART-FLOW 数据行（2023 · 30 / 2024 · 59）150–190 同窗生长
 * （呼应字幕量的数据版）。
 * 转场：入「纸翻」出「切」→ ShotShell 光晕呼吸。字幕安全窗：start≥30、end≤198。
 * 尾帧：卡山半成+山顶辉光（交接态：卡山）。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES, writeFade } from '../../../brand/motion';
import { chartBar, FILM_COLORS2, glowText } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 210;
const WINDOW = 38; // 句窗（含进出交叠）
const QUOTES = [
  '「人生一世不过 3 万多天，实在是太短了。」',
  '「欲望，是最恐怖的东西。」',
  '「日不过三餐，夜不过一宿，四季的衣服 8 套已经足够了。」',
  '「上班就好好上班……下班了就好好生活。」',
  '「玩累了就看看书、写写字。」',
];

const S14: FC = () => {
  const frame = useCurrentFrame();
  const cam = {
    scale: interpolate(frame, [0, TOTAL], [1.05, 1.02], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    x: interpolate(frame, [0, TOTAL], [20, -30], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    y: 0,
    rot: 0,
  };
  // CHART-FLOW：2023 · 30 / 2024 · 59（150–190 同窗生长，落定距镜尾 20f）
  const bar30 = chartBar(frame, 150, 40, 30 / 59);
  const bar59 = chartBar(frame, 150, 40, 1);

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s14v2" stars={56} grid />
      <CameraRig cam={cam}>
        <AbsoluteFill>
          {/* 五句金句卡：句窗 18 + i*38，写入（0–8）→ 停住 → 被带走（30–38） */}
          {QUOTES.map((q, i) => {
            const t0 = 18 + i * WINDOW;
            const local = frame - t0;
            if (local < -4 || local > WINDOW + 6) return null;
            const pageIn = interpolate(local, [0, 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
            const pageOut = interpolate(local, [WINDOW - 8, WINDOW], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn });
            const visible = pageIn > 0 && pageOut < 1;
            const qIn = writeFade(local, 8, true);
            return (
              <div key={i} style={{ position: 'absolute', left: 380, top: 190, width: 1160, height: 560, opacity: visible ? 1 : 0 }}>
                {/* 线框数据卡 */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 8,
                    background: FILM_COLORS2.panel,
                    border: `1px solid ${FILM_COLORS2.grid}`,
                    boxShadow: `0 16px 44px rgba(0,0,0,0.4), 0 0 30px rgba(212,163,115,0.06)`,
                    transform: `translateY(${(1 - pageIn) * -24}px) translateY(${pageOut * 40}px)`,
                    opacity: 1 - pageOut,
                  }}
                >
                  <div style={{ position: 'absolute', left: 40, top: 44, fontFamily: fontFamilies.mono, fontSize: 15, color: FILM_COLORS2.dataDim, opacity: 0.9, letterSpacing: '0.2em' }}>QUOTE · #{i + 1}</div>
                  <div style={{ position: 'absolute', left: 40, right: 40, top: 84, height: 1, background: FILM_COLORS2.line, opacity: 0.5 }} />
                  <div
                    style={{
                      position: 'absolute',
                      left: 90,
                      right: 90,
                      top: 150,
                      ...qIn,
                      fontFamily: fontFamilies.serif,
                      fontSize: 42,
                      lineHeight: 1.75,
                      color: FILM_COLORS2.paperWhite,
                      ...glowText(FILM_COLORS2.paperWhite, 0.12),
                      opacity: Number(qIn.opacity ?? 0) * (1 - pageOut),
                    }}
                  >
                    {q}
                  </div>
                  {/* 出处小字（画面文字：标注出处、不推进时间线） */}
                  <div style={{ position: 'absolute', right: 0, top: 380, fontFamily: fontFamilies.mono, fontSize: 15, color: FILM_COLORS2.textMuted, opacity: 0.65 * (1 - pageOut) }}>#165《再读〈坐忘歌〉》· 2026-07-05</div>
                </div>
              </div>
            );
          })}

          {/* 看过的卡越叠越高（错峰 +8px → 卡山半成） */}
          {QUOTES.map((_, i) => {
            const t0 = 18 + i * WINDOW + WINDOW - 8;
            const shown = frame >= t0;
            if (!shown) return null;
            return (
              <div key={`stack-${i}`} style={{ position: 'absolute', left: 380 + i * 10, top: 190 + i * 22, width: 1160 - i * 24, height: 560 - i * 30, borderRadius: 8, background: FILM_COLORS2.panel, border: `1px solid ${FILM_COLORS2.grid}`, opacity: 0.85, transform: `rotate(${(i % 2 === 0 ? -1 : 1) * 0.7}deg)` }} />
            );
          })}
          {/* 山顶卡辉光 */}
          <AbsoluteFill style={{ background: `rgba(212,163,115,0.12)`, mixBlendMode: 'screen', opacity: interpolate(frame, [190, TOTAL], [0, 0.5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), pointerEvents: 'none' }} />

          {/* CHART-FLOW：两条年度数据行（150–190 生长，置于字幕带之上） */}
          <div style={{ position: 'absolute', left: 380, right: 380, bottom: 210, zIndex: 29 }}>
            {[
              { label: '2023', v: 30, bar: bar30, top: false },
              { label: '2024', v: 59, bar: bar59, top: true },
            ].map((r) => (
              <div key={r.label} style={{ position: 'relative', height: 24, marginBottom: 9 }}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '100%', background: 'rgba(212,163,115,0.07)', borderRadius: 3 }} />
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: `${r.bar.widthPct}%`,
                    borderRadius: 3,
                    background: r.top ? `linear-gradient(90deg, ${FILM_COLORS2.dataDim}, ${FILM_COLORS2.data})` : 'rgba(212,163,115,0.3)',
                    boxShadow: r.top ? `0 0 ${10 + r.bar.glow * 16}px rgba(212,163,115,${r.bar.glow * 0.5})` : 'none',
                  }}
                />
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-52%)', fontFamily: fontFamilies.mono, fontSize: 15, color: FILM_COLORS2.paperWhite, opacity: 0.85, whiteSpace: 'nowrap' }}>{r.label} · 篇</span>
                <span style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-52%)', fontFamily: fontFamilies.mono, fontSize: 15, color: FILM_COLORS2.paperWhite, opacity: 0.85, fontVariantNumeric: 'tabular-nums' }}>{r.v}</span>
              </div>
            ))}
          </div>
        </AbsoluteFill>
      </CameraRig>
      <HudChrome label="wuh.site · WRITING" readout="2023–2024" />
      <Grade2 id="GR2-03" />
      <Caption text="他还是继续写。2023 年 30 篇，2024 年 59 篇。" appearAt={30} />
    </AbsoluteFill>
  );
};

export default S14;
