/* S25 · Act 5 灯亮 · 局部帧 [0,150) · 150f · 绝对 3708–3858
 *
 * 「提交变密；旧文迁入」审计重定义：提交密度真实爬升（逐月柱+密度线，源=MONTH_ACTIVITY
 * 同源口径——2025-12→2026-05 春窗：31→0→0→117→97→248，缺失月=无活动补 0，密度线经零月
 * 落回基线再陡升=「变密」的字面兑现）+ 旧文迁入流（墨点流从左向右汇入右侧线框「新家」面板）。
 * 尾帧交接态保留：雨歇，双苔痕静置、暖湿光带（湿纸+双苔痕——苔痕降为基线下的湿痕余韵）。
 * 编排四问：
 *   承接 = s24 交出的火簇余光+顶部暖带（首帧暖光延续，数据轴自亮处展开）；
 *   触发 = 逐月柱 barGrow 依次生长执行「变密」，墨点流执行「迁入」；
 *   展开 = 帧级节奏：柱 LANDS=staggerLand(6,10,80,'accel')=[10,16,28,45,66,90]（前疏后密）→ 数值随柱微滚 → 密度线 90–116 描画 → 双苔痕 45/90 后洇开 → 迁入流 16–146 恒速 → 暖湿光带 122–150；
 *   交接 = 尾帧：密度柱+线立定、双苔痕静置（交接态：湿纸+双苔痕，交 s26 迁入节拍）。
 * 逐拍帧表（fps=30）：
 *   [0–10]   基线（y720）+ cam 低机位先仰后下移（窗原样：scale 1.14→1.03 / y -60→20）；
 *   [10/16/28/45/66/90] 六柱 barGrow 生长（22f），柱顶数值 numRoll 微滚（凡量必滚；零月不假滚，落位显「0」）；月标 mono 落位即现；
 *   [45–58]  三月苔痕洇开（低斑）；[90–104] 五月苔痕洇开（深斑）——双苔痕；
 *   [90–116] 密度线 pathDraw 描画（M341,688 L504,720 L667,720 L830,597 L993,618 L1156,460，经零月落基线）；
 *   [16–146] 旧文迁入流：16 枚墨点恒速左→右（匀速=物理匀速例外）汇入线框「新家」面板（24 显出）；
 *   [122–150] 雨歇暖湿光带（底部 0.07）。
 * 时间轴零改动：150f / Caption appearAt 22 原样；转场：入「飞白」→ ShotShell 光晕呼吸，出「切」。
 * 字幕安全窗：start≥22、end≤138（月标/数值最低 y≈754）。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES, numRoll } from '../../../brand/motion';
import { barGrow, FILM_COLORS2, fmtNum, glowText, MONTH_ACTIVITY, pathDraw } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 150;
/** 春窗逐月柱（MONTH_ACTIVITY 同源口径：缺失月 2026-01/02 = 无活动，补 0） */
const SPRING_MONTHS = ['2025-12', '2026-01', '2026-02', '2026-03', '2026-04', '2026-05'];
const MONTH_TOTALS = SPRING_MONTHS.map((m) => ({ month: m, total: MONTH_ACTIVITY.find((x) => x.month === m)?.total ?? 0 }));
const MAX_TOTAL = 248; // = 2026-05 峰值（MONTH_ACTIVITY 口径）
/** 柱几何：基线 y720 / 槽位 left 260 起 163/槽 / 柱宽 84 / 峰高 260 */
const BASE_Y = 720;
const SLOT_X = 260;
const SLOT_W = 163;
const BAR_W = 84;
const MAX_H = 260;
const LANDS = [10, 16, 28, 45, 66, 90]; // staggerLand(6, 10, 80, 'accel')
/** 密度线：经各柱顶（零月落回基线） */
const LINE_D = `M ${SLOT_X + SLOT_W / 2} ${BASE_Y - Math.round((MONTH_TOTALS[0].total / MAX_TOTAL) * MAX_H)} ${MONTH_TOTALS.slice(1).map((m, i) => `L ${SLOT_X + SLOT_W * (i + 1) + SLOT_W / 2} ${BASE_Y - Math.max(0, Math.round((m.total / MAX_TOTAL) * MAX_H))}`).join(' ')}`;
/** 线框「新家」面板（旧文迁入的目标；纯线框非浏览器 chrome） */
const HOME = { x: 1400, y: 340, w: 380, h: 380 };
/** 迁入流：16 枚墨点恒速（匀速=物理匀速例外） */
const FLOW_N = 16;
const FLOW = Array.from({ length: FLOW_N }, (_, i) => ({
  delay: 16 + i * 4,
  dur: 70,
  y: 330 + random(`s25-fy-${i}`) * 140,
  wob: random(`s25-fw-${i}`) * Math.PI * 2,
}));

const S25: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cam = {
    scale: interpolate(frame, [0, 110, TOTAL], [1.14, 1.06, 1.03], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    x: 0,
    y: interpolate(frame, [0, 100], [-60, 20], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    rot: 0,
  };
  // 密度线（90–116 描画，真长度驱动）
  const line = pathDraw(frame, 90, 26, LINE_D);
  // 「新家」面板显出（24–40）
  const homeIn = interpolate(frame, [24, 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s25v2" stars={52} grid />
      <CameraRig cam={cam}>
        <AbsoluteFill>
          {/* 基线（数据轴） */}
          <div style={{ position: 'absolute', left: 200, width: 1160, top: BASE_Y, height: 2, background: FILM_COLORS2.line, opacity: 0.55 }} />

          {/* 逐月柱（提交密度真实爬升；barGrow 生长 + 数值微滚） */}
          {MONTH_TOTALS.map((m, i) => {
            const land = LANDS[i];
            const h = Math.max(0, Math.round((m.total / MAX_TOTAL) * MAX_H));
            const grow = barGrow(frame, land, fps);
            const barFade = interpolate(frame, [land, land + 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            const cx = SLOT_X + i * SLOT_W + SLOT_W / 2;
            const zero = m.total === 0;
            return (
              <div key={m.month}>
                {!zero ? (
                  <div
                    style={{
                      position: 'absolute',
                      left: cx - BAR_W / 2,
                      top: BASE_Y - h,
                      width: BAR_W,
                      height: h,
                      background: FILM_COLORS2.data,
                      boxShadow: `0 0 14px rgba(212,163,115,0.28)`,
                      transformOrigin: 'bottom',
                      transform: grow.transform,
                      opacity: 0.75 * barFade,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      position: 'absolute',
                      left: cx - BAR_W / 2,
                      top: BASE_Y - 3,
                      width: BAR_W,
                      height: 3,
                      background: FILM_COLORS2.dataDim,
                      opacity: interpolate(frame, [land, land + 8], [0, 0.5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
                    }}
                  />
                )}
                {/* 柱顶数值（凡量必滚；零月不假滚——落位显 0） */}
                <span
                  style={{
                    position: 'absolute',
                    left: cx - 40,
                    top: (zero ? BASE_Y : BASE_Y - h) - 30,
                    width: 80,
                    textAlign: 'center',
                    fontFamily: fontFamilies.mono,
                    fontSize: 17,
                    color: zero ? FILM_COLORS2.textMuted : FILM_COLORS2.paperWhite,
                    fontVariantNumeric: 'tabular-nums',
                    opacity: interpolate(frame, [land + 4, land + 14], [0, 0.92], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
                  }}
                >
                  {zero ? '0' : fmtNum(numRoll(frame, land + 4, 20, 0, m.total))}
                </span>
                {/* 月标（落位即现，标识不滚） */}
                <span
                  style={{
                    position: 'absolute',
                    left: cx - 40,
                    top: BASE_Y + 18,
                    width: 80,
                    textAlign: 'center',
                    fontFamily: fontFamilies.mono,
                    fontSize: 14,
                    color: FILM_COLORS2.textMuted,
                    fontVariantNumeric: 'tabular-nums',
                    opacity: interpolate(frame, [land + 6, land + 16], [0, 0.6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
                  }}
                >
                  {m.month}
                </span>
              </div>
            );
          })}

          {/* 密度线（90–116，经零月落回基线再陡升） */}
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <path d={LINE_D} fill="none" stroke={FILM_COLORS2.gold} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" opacity={0.85} style={{ ...line, filter: 'drop-shadow(0 0 6px rgba(233,217,174,0.35))' }} />
          </svg>

          {/* 线框「新家」面板（旧文迁入目标，24–40 显出） */}
          <div style={{ position: 'absolute', left: HOME.x, top: HOME.y, width: HOME.w, height: HOME.h, opacity: homeIn * 0.85 }}>
            <div style={{ position: 'absolute', inset: 0, border: `1px solid ${FILM_COLORS2.line}`, borderRadius: 6, background: FILM_COLORS2.panel, boxShadow: `0 0 30px rgba(212,163,115,0.1)` }} />
            <div style={{ position: 'absolute', left: 28, top: 24, fontFamily: fontFamilies.mono, fontSize: 16, letterSpacing: '0.2em', color: FILM_COLORS2.data, ...glowText(FILM_COLORS2.data, 0.4) }}>
              wuh.site
            </div>
            <div style={{ position: 'absolute', left: 28, right: 28, top: 58, height: 1, background: FILM_COLORS2.line }} />
            {[0, 1, 2, 3].map((i) => (
              <div key={i} style={{ position: 'absolute', left: 28, top: 84 + i * 44, width: 240 - i * 36, height: 10, borderRadius: 3, background: `rgba(245,240,232,${0.16 - i * 0.03})`, opacity: interpolate(frame, [40 + i * 10, 52 + i * 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }} />
            ))}
          </div>

          {/* 旧文迁入流（16 枚墨点恒速左→右，汇入面板左缘后隐入；匀速=物理匀速例外） */}
          {FLOW.map((f, i) => {
            const t = frame - f.delay;
            if (t < 0) return null;
            const p = Math.min(1, t / f.dur);
            if (p >= 1) return null;
            const x = -40 + (HOME.x + 30 - (-40)) * p;
            const y = f.y + Math.sin(t / 9 + f.wob) * 8;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: x - 3,
                  top: y - 3,
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  background: FILM_COLORS2.data,
                  boxShadow: `0 0 8px rgba(212,163,115,0.45)`,
                  opacity: interpolate(p, [0, 0.1, 0.9, 1], [0, 0.8, 0.8, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
                }}
              />
            );
          })}

          {/* 双苔痕（雨歇余韵：三月低斑 / 五月深斑——尾帧交接态保留） */}
          <div
            style={{
              position: 'absolute',
              left: 620 - 190,
              top: 880 - 40,
              width: 380,
              height: 80,
              borderRadius: 40,
              background: `radial-gradient(ellipse, rgba(212,163,115,0.14), rgba(212,163,115,0) 72%)`,
              opacity: interpolate(frame, [45, 58], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 1300 - 230,
              top: 900 - 44,
              width: 460,
              height: 88,
              borderRadius: 44,
              background: `radial-gradient(ellipse, rgba(212,163,115,0.2), rgba(212,163,115,0) 72%)`,
              opacity: interpolate(frame, [90, 104], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            }}
          />

          {/* 雨歇暖湿光带（122–150） */}
          <AbsoluteFill
            style={{
              background: `linear-gradient(180deg, transparent 62%, rgba(212,163,115,0.07))`,
              opacity: interpolate(frame, [122, TOTAL], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
              pointerEvents: 'none',
            }}
          />
        </AbsoluteFill>
      </CameraRig>
      <HudChrome label="wuh.site · COMMITS" readout="SPRING 2026 · 248/MO" />
      <Grade2 id="GR2-05" />
      <Caption text="2026 年春天，提交变密；旧文一篇篇迁进新家。" appearAt={22} />
    </AbsoluteFill>
  );
};

export default S25;
