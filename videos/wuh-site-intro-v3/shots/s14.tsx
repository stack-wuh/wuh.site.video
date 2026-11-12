/* S14 · Act 3 第一行 · 局部帧 [0,210) · 210f · 绝对 2142–2352
 *
 * V3 批次 A 重做（2026-11-12 六门验收 + 审计返工单 · 审计重定义：按年文章数累积数据条，
 * 分年数以 Caption 文案事实为准——2023 年 30 篇、2024 年 59 篇）：
 * 【承接】首帧承接 s13 尾帧交出的「暖句停住 + 掀角纸页」——掀角翻页进入连年写作：五句
 *         金句卡连放，看过的卡越叠越高（纸山半成）。
 * 【触发】主动作 = 五张金句数据卡连放（句窗 38f 含交叠原样：局部 18–208，写入→停住→被
 *         带走，卡越叠越高）；页脚按年累积数据条 150–176 staggerLand springIn 落位生长
 *         （2019 首篇 1 → 2023 +30 → 2024 +59，numRoll 微滚），190『Σ 89 篇』金字落定
 *         直接把 s15 的大数预告出来。
 * 【展开】逐拍帧表（局部帧，fps=30）：
 *   [18/56/94/132/170] 五句金句卡逐张进出（每张写入 8f→停住→末 8f 被带走；出处小字
 *             #165《再读〈坐忘歌〉》· 2026-07-05 标注事实来源）；
 *   [44/82/120/158/196] 看过的卡错峰入栈（+8px/+22px 线框卡驻留，纸山逐层长高）；
 *   [150–176] 按年累积数据条 ×3 springIn+chartBar 生长：2019·首篇（1）→ 2023（30）→
 *             2024（59），数值 numRoll 微滚、2024 行金色辉光；
 *   [190]     『Σ 89 篇』金字 springIn 落位 + 辉光脉冲（=30+59，交接 s15 的 89 SLAM）；
 *   [190–210] 山顶卡辉光（原窗）+ cam 微移——尾帧交接态。
 * 【交接】尾帧 = 纸山半成 + 山顶辉光 + Σ89 篇驻留（manifest endFrameDesc：纸页叠成小山，
 *         交接态：纸山半成）→ 交 s15「89 篇」全屏大数 SLAM。
 * 意义一句话：金句一张张飞过、纸山一层层长高，页脚 1→30→59 的累积条把「还在写」算成了 89 篇。
 * 时间轴零改动：210f / 句窗 18+38i / 数据条 150–190 带内重排（原窗）/ 山顶辉光 190–210 / Caption（appearAt 30）原样。
 * 转场：入「纸翻」出「切」→ ShotShell 光晕呼吸。字幕安全窗：start≥30、end≤198。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES, writeFade } from '../../../brand/motion';
import {
  FILM_COLORS2,
  chartBar,
  dataCurtain,
  glowText,
  handheld,
  numRoll,
  springIn,
  staggerLand,
} from '../motion-tokens';
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
/** 按年累积数据条（审计重定义；分年数以 Caption 事实为准）：2019 首篇 1 → 2023 +30 → 2024 +59 */
const LADDER = [
  { label: '2019 · 首篇', v: 1, ratio: 1 / 59, top: false },
  { label: '2023', v: 30, ratio: 30 / 59, top: false },
  { label: '2024', v: 59, ratio: 1, top: true },
];
/** 数据条 springIn 落定表（accel，原窗 150–190 带内）：[150, 163, 176] */
const LADDER_LANDS = staggerLand(3, 150, 26, 'accel');
const SUM_AT = 190; // Σ 89 篇落定（交接 s15）

const S14: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hh = handheld('s14-cam', frame, 1.0);
  const cam = {
    scale: interpolate(frame, [0, TOTAL], [1.05, 1.02], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    x: interpolate(frame, [0, TOTAL], [20, -30], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }) + hh.dx,
    y: hh.dy,
    rot: hh.rot,
  };
  // 按年累积数据条：springIn + chartBar 生长 + numRoll 微滚
  const ladder = LADDER.map((r, i) => ({
    ...r,
    enter: springIn(frame, LADDER_LANDS[i], fps),
    bar: chartBar(frame, LADDER_LANDS[i] + 2, 16, r.ratio),
    roll: Math.round(numRoll(frame, LADDER_LANDS[i] + 2, 16, 0, r.v)),
  }));
  // Σ89 金字（190 落定 + 辉光脉冲）
  const sumP = springIn(frame, SUM_AT, fps);
  const sumGlow = interpolate(frame, [SUM_AT + 4, SUM_AT + 8, TOTAL], [0.35, 0.85, 0.45], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const rain = dataCurtain('s14-rain', frame, 6, 100);

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s14v2" stars={56} grid />
      {/* 数字雨帘（背景氛围层） */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 2, pointerEvents: 'none' }}>
        {rain.map((c, i) => (
          <span key={`rain-${i}`} style={{ position: 'absolute', left: `${c.x}%`, top: c.y, fontFamily: fontFamilies.mono, fontSize: 12, color: FILM_COLORS2.data, opacity: c.o, fontVariantNumeric: 'tabular-nums' }}>
            {c.text}
          </span>
        ))}
      </div>
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
              <div key={`quote-${i}`} style={{ position: 'absolute', left: 380, top: 190, width: 1160, height: 520, opacity: visible ? 1 : 0 }}>
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
                  <div style={{ position: 'absolute', right: 40, top: 380, fontFamily: fontFamilies.mono, fontSize: 15, color: FILM_COLORS2.textMuted, opacity: 0.65 * (1 - pageOut) }}>#165《再读〈坐忘歌〉》· 2026-07-05</div>
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
              <div key={`stack-${i}`} style={{ position: 'absolute', left: 380 + i * 10, top: 190 + i * 22, width: 1160 - i * 24, height: 520 - i * 30, borderRadius: 8, background: FILM_COLORS2.panel, border: `1px solid ${FILM_COLORS2.grid}`, opacity: 0.85, transform: `rotate(${(i % 2 === 0 ? -1 : 1) * 0.7}deg)` }} />
            );
          })}
          {/* 山顶卡辉光 */}
          <AbsoluteFill style={{ background: `rgba(212,163,115,0.12)`, mixBlendMode: 'screen', opacity: interpolate(frame, [190, TOTAL], [0, 0.5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), pointerEvents: 'none' }} />

          {/* ★按年累积数据条（150–176 springIn+生长，Σ89 交接 s15） */}
          <div style={{ position: 'absolute', left: 380, right: 380, bottom: 210, zIndex: 29 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 13, letterSpacing: '0.3em', color: FILM_COLORS2.textMuted }}>POSTS · 按年累积</span>
              <span
                style={{
                  fontFamily: fontFamilies.mono,
                  fontSize: 20,
                  color: FILM_COLORS2.gold,
                  fontVariantNumeric: 'tabular-nums',
                  opacity: Math.min(1, sumP * 1.4),
                  transform: `translateY(${(1 - sumP) * 12}px)`,
                  display: 'inline-block',
                  ...(frame >= SUM_AT + 4 ? glowText(FILM_COLORS2.gold, sumGlow, '233,217,174') : {}),
                }}
              >
                Σ 89 篇
              </span>
            </div>
            {ladder.map((r, i) => {
              const covered = r.bar.widthPct > 34;
              return (
                <div key={`lad-${i}`} style={{ position: 'relative', height: 24, marginBottom: 9, opacity: Math.min(1, r.enter * 1.4), transform: `translateY(${(1 - r.enter) * 14}px)` }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '100%', background: FILM_COLORS2.grid, borderRadius: 3 }} />
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: `${Math.max(1.2, r.bar.widthPct)}%`,
                      borderRadius: 3,
                      background: r.top ? `linear-gradient(90deg, ${FILM_COLORS2.dataDim}, ${FILM_COLORS2.data})` : 'rgba(212,163,115,0.3)',
                      boxShadow: r.top ? `0 0 ${10 + r.bar.glow * 16}px rgba(212,163,115,${r.bar.glow * 0.5})` : 'none',
                    }}
                  />
                  <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-52%)', fontFamily: fontFamilies.mono, fontSize: 15, color: covered ? FILM_COLORS2.spaceDeep : FILM_COLORS2.paperWhite, opacity: 0.85, whiteSpace: 'nowrap' }}>{r.label} · 篇</span>
                  <span style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-52%)', fontFamily: fontFamilies.mono, fontSize: 15, color: FILM_COLORS2.paperWhite, opacity: 0.85, fontVariantNumeric: 'tabular-nums' }}>{frame >= LADDER_LANDS[i] + 2 ? r.roll : '…'}</span>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      </CameraRig>
      <HudChrome label="wuh.site · WRITING" readout={frame >= SUM_AT ? '2023–2024 · 89 篇' : '2023–2024'} />
      <Grade2 id="GR2-03" />
      <Caption text="他还是继续写。2023 年 30 篇，2024 年 59 篇。" appearAt={30} />
    </AbsoluteFill>
  );
};

export default S14;
