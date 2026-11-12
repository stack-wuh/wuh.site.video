/* S28 · Act 5 灯亮 · 局部帧 [0,168) · 168f · 绝对 4086–4254
 *
 * 「流量切换，灯次第亮」审计重定义：删截图（全片禁网站截图 §3），改月度活动增长柱主场——
 * MONTH_ACTIVITY 十根真数据柱（31→117→97→248→269→5,744→809→1,533→3,846→909，2025-12→2026-11
 * 十个月，源=motion-tokens MONTH_ACTIVITY）次第点亮生长 =「灯，次第亮起」字面兑现；
 * 峰值七月柱 gold 高亮+辉光，落定配冲击环+金粒。线框首屏骨架降为调暗背景（交接态仍可读
 * 「新站首屏」，zones 显影节奏原样），全片唯一白闪原样保留。
 * 编排四问：
 *   承接 = s27 交出的一线白光 → 白闪涨满（亮度匹配，FN-47 全片唯一纯白 4089 峰值）；
 *   触发 = 十根灯柱次第点亮（每根 barGrow 生长+顶珠 lightOn 弹亮=一盏灯），七月峰值柱压轴 gold；
 *   展开 = 帧级节奏：0–18 白闪涨满释放 → 18–44 骨架分区显影（站点真实 0/80/160/240ms 节奏，窗原样）→ 44–140 十柱 staggerLand(10,44,96,'accel') 次第生长（前疏后密）→ 81 七月柱 gold 落定（冲击环+金粒）→ 154 整页灯全亮暖光脉冲（=拍212 对音，絕不动）；
 *   交接 = 尾帧：十柱全亮、暖光稳定、骨架首屏可读（交接态：全亮新站首屏，交 s29 下沉）。
 * 逐拍帧表（fps=30）：
 *   [0–3/6–18] 白闪 FN-47：0–3 涨满（绝对 4089 纯白 3f）→ 6–18 释放（whiteFlashOpacity 绝对帧口径原样）；
 *   [18–44]   brightness 0.4→1 + 线框骨架分区 write-fade（zoneOpacity：wordmark/标语/按钮/图标）；
 *   [44/47/53/61/70/81/94/108/123/140] 十柱 barGrow 依次生长（22f），柱顶数值 numRoll 微滚（凡量必滚）、灯珠顶亮、月标落位即现；
 *   [81]      七月柱（5,744）gold 高亮落定：shockwave 双环 rgb(233,217,174) + sparkBurst('s28-peak',18,金) @ (1000,470) + 辉光持续；
 *   [44–56]   角标键击「MONTHLY ACTIVITY · LIGHTS ON」（mono 15，2f/字）；
 *   [44–104]  cam 缓推 1.0→1.03（窗原样）；[154] 整页暖光脉冲收束（拍212 对音）；HUD readout 随峰值/全亮切换。
 * 时间轴零改动：168f / 白闪窗 / zones 显影窗 / 154 对音 / Caption appearAt 24 原样；转场：入「切」，出「切」。
 * 字幕安全窗：月标最低 y≈861。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { FILM_COLORS2, fmtNum, fullLight, glowText, MONTH_ACTIVITY, numRoll, shockwave, sparkBurst, springIn, staggerLand, typeCharsAt, whiteFlashOpacity } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 168;
const FLASH_RELEASE = 18;
const PEAK_IDX = 5; // 2026-07 峰值柱
const TOTAL_ACTIVITY = MONTH_ACTIVITY.reduce((a, b) => a + b.total, 0); // 13,603
/** 灯柱几何：基线 y830 / 10 槽 center 400+i*120 / 柱宽 64 / 峰高 360（5,744） */
const BASE_Y = 830;
const CX0 = 400;
const SLOT = 120;
const BAR_W = 64;
const MAX_H = 360;
const LANDS = staggerLand(10, 44, 96, 'accel'); // 十柱次第（前疏后密，末柱 140）
const KICKER = 'MONTHLY ACTIVITY · LIGHTS ON';

/** 分区点亮（站点真实节奏 0/2.4/4.8/7.2f，各区内再 stagger）——原样保留 */
const zoneOpacity = (frame: number, start: number, zone: number, item: number): number => {
  const z0 = start + zone * 2.4 + item * 2;
  return interpolate(frame, [z0, z0 + 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
};

const S28: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const flash = whiteFlashOpacity(frame + 4086); // whiteFlashOpacity 是绝对帧口径
  const light = fullLight(frame, FLASH_RELEASE);
  const push = interpolate(frame, [44, 104], [1.0, 1.03], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const cam = { scale: push, x: 0, y: 0, rot: 0 };
  // 七月峰值柱落定（LANDS[PEAK_IDX]）：gold 冲击环 + 金粒
  const peakLand = LANDS[PEAK_IDX];
  const wave = shockwave(frame, peakLand, '233,217,174');
  const burst = sparkBurst('s28-peak', frame, peakLand, 18, true);
  // 角标键击（44–56）
  const typed = typeCharsAt(frame, KICKER.length, 44, 2);
  // 灯柱几何数据
  const maxTotal = Math.max(...MONTH_ACTIVITY.map((m) => m.total)); // 5,744
  const bars = MONTH_ACTIVITY.map((m, i) => ({
    ...m,
    h: Math.max(6, Math.round((m.total / maxTotal) * MAX_H)),
    cx: CX0 + i * SLOT,
    land: LANDS[i],
    peak: i === PEAK_IDX,
  }));

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s28v2" stars={44} grid horizon />
      {/* 白闪层（全屏，先于画面） */}
      <AbsoluteFill style={{ background: FILM_COLORS2.paperWhite, opacity: flash, zIndex: 60 }} />
      <CameraRig cam={cam}>
        <AbsoluteFill style={{ filter: `brightness(${0.4 + light.bright * 0.6})`, opacity: interpolate(frame, [FLASH_RELEASE, FLASH_RELEASE + 20], [0.4, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
          {/* 新站首屏线框数据骨架（降为调暗背景；WIN-05 分区节奏原样，交接态仍可读） */}
          <div style={{ position: 'absolute', inset: 0, opacity: 0.62 }}>
            <div
              style={{
                position: 'absolute',
                left: 230,
                right: 230,
                top: 170,
                bottom: 230,
                borderRadius: 12,
                border: `1px solid ${FILM_COLORS2.line}`,
                background: FILM_COLORS2.panel,
                boxShadow: `0 0 ${30 + light.bright * 46}px rgba(212,163,115,${0.1 + light.bright * 0.18}), 0 30px 80px rgba(0,0,0,0.5)`,
              }}
            >
              {/* 区 0 · wordmark（站点真实节奏 0） */}
              <div style={{ position: 'absolute', left: 0, right: 0, top: 100, textAlign: 'center', opacity: zoneOpacity(frame, FLASH_RELEASE, 0, 0) }}>
                <span style={{ fontFamily: fontFamilies.serif, fontSize: 88, fontWeight: 700, color: FILM_COLORS2.paperWhite, letterSpacing: '0.06em', ...glowText(FILM_COLORS2.data, 0.5) }}>wuh.site</span>
              </div>
              <div style={{ position: 'absolute', left: 0, right: 0, top: 216, textAlign: 'center', opacity: zoneOpacity(frame, FLASH_RELEASE, 0, 1) }}>
                <span style={{ fontFamily: fontFamilies.mono, fontSize: 22, letterSpacing: '0.5em', color: FILM_COLORS2.textMuted }}>朝 朝 如 念</span>
              </div>
              {/* 区 1 · 标语条（2.4f） */}
              <div style={{ position: 'absolute', left: '50%', top: 320, width: 760, marginLeft: -380, height: 16, borderRadius: 4, background: `rgba(245,240,232,0.4)`, opacity: zoneOpacity(frame, FLASH_RELEASE, 1, 0) }} />
              <div style={{ position: 'absolute', left: '50%', top: 350, width: 520, marginLeft: -260, height: 10, borderRadius: 3, background: `rgba(245,240,232,0.2)`, opacity: zoneOpacity(frame, FLASH_RELEASE, 1, 1) }} />
              {/* 区 2 · 按钮（4.8f） */}
              <div style={{ position: 'absolute', left: 0, right: 0, top: 420, display: 'flex', justifyContent: 'center', gap: 24, opacity: zoneOpacity(frame, FLASH_RELEASE, 2, 0) }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} style={{ width: 170, height: 54, borderRadius: 27, border: `1.5px solid ${FILM_COLORS2.line}`, background: `rgba(212,163,115,0.08)`, boxShadow: `0 0 14px rgba(212,163,115,0.14)` }} />
                ))}
              </div>
              {/* 区 3 · 图标（7.2f） */}
              <div style={{ position: 'absolute', left: 0, right: 0, top: 540, display: 'flex', justifyContent: 'center', gap: 30, opacity: zoneOpacity(frame, FLASH_RELEASE, 3, 0) }}>
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} style={{ width: 46, height: 46, borderRadius: 8, border: `1px solid ${FILM_COLORS2.line}`, background: `rgba(212,163,115,0.06)` }} />
                ))}
              </div>
            </div>
          </div>

          {/* 月度活动增长柱主场（「灯，次第亮起」字面兑现） */}
          {/* 角标键击（44–56） */}
          {typed > 0 ? (
            <div style={{ position: 'absolute', left: 230, top: 120 }}>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 15, letterSpacing: '0.3em', color: FILM_COLORS2.textMuted, whiteSpace: 'pre' }}>{KICKER.slice(0, typed)}</span>
            </div>
          ) : null}
          {/* 基线 */}
          <div style={{ position: 'absolute', left: 340, width: 1200, top: BASE_Y, height: 2, background: FILM_COLORS2.line, opacity: interpolate(frame, [40, 52], [0, 0.55], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }} />
          {/* 十根灯柱（barGrow 生长 + 灯珠顶亮 + 数值微滚 + 月标落位即现） */}
          {bars.map((b) => {
            const grow = springIn(frame, b.land, fps, 16, 170, 0.9); // 柱生长（弹性过冲=灯亮瞬间）
            const lampP = springIn(frame, b.land + 16, fps, 14, 190, 0.8); // 顶珠 lightOn
            const flashGlow = interpolate(frame, [b.land, b.land + 2, b.land + 14], [0, 0.85, 0.22], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            const color = b.peak ? FILM_COLORS2.gold : FILM_COLORS2.data;
            const rgb = b.peak ? '233,217,174' : '212,163,115';
            return (
              <div key={b.month}>
                {/* 柱身 */}
                <div
                  style={{
                    position: 'absolute',
                    left: b.cx - BAR_W / 2,
                    top: BASE_Y - b.h,
                    width: BAR_W,
                    height: b.h,
                    background: color,
                    opacity: Math.min(1, grow * 1.2) * (b.peak ? 0.95 : 0.78),
                    transformOrigin: 'bottom',
                    transform: `scaleY(${Math.max(0.001, grow)})`,
                    boxShadow: `0 0 ${14 + flashGlow * 26}px rgba(${rgb},${0.2 + flashGlow * 0.4})`,
                  }}
                />
                {/* 顶珠灯（+16f lightOn 弹亮） */}
                <div
                  style={{
                    position: 'absolute',
                    left: b.cx - 4,
                    top: BASE_Y - b.h - 8,
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    background: color,
                    opacity: Math.min(1, lampP * 1.3),
                    transform: `scale(${0.4 + lampP * 0.6})`,
                    boxShadow: `0 0 ${8 + lampP * 14}px rgba(${rgb},${0.4 + lampP * 0.5})`,
                  }}
                />
                {/* 柱顶数值（numRoll 微滚；峰值柱放大 gold + 辉光） */}
                <span
                  style={{
                    position: 'absolute',
                    left: b.cx - 52,
                    top: BASE_Y - b.h - (b.peak ? 56 : 42),
                    width: 104,
                    textAlign: 'center',
                    fontFamily: fontFamilies.mono,
                    fontSize: b.peak ? 20 : 15,
                    fontWeight: b.peak ? 700 : 400,
                    color: b.peak ? FILM_COLORS2.gold : FILM_COLORS2.paperWhite,
                    fontVariantNumeric: 'tabular-nums',
                    opacity: interpolate(frame, [b.land + 2, b.land + 12], [0, 0.95], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
                    ...(b.peak ? glowText(FILM_COLORS2.gold, 0.55, '233,217,174') : {}),
                  }}
                >
                  {fmtNum(numRoll(frame, b.land + 2, 16, 0, b.total))}
                </span>
                {/* 月标（落位即现，标识不滚） */}
                <span
                  style={{
                    position: 'absolute',
                    left: b.cx - 44,
                    top: BASE_Y + 15,
                    width: 88,
                    textAlign: 'center',
                    fontFamily: fontFamilies.mono,
                    fontSize: 13,
                    color: FILM_COLORS2.textMuted,
                    fontVariantNumeric: 'tabular-nums',
                    opacity: interpolate(frame, [b.land + 6, b.land + 16], [0, 0.65], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
                  }}
                >
                  {b.month}
                </span>
              </div>
            );
          })}
          {/* 七月峰值落定：冲击双环 + 金粒（锚柱顶 (1000,470)） */}
          {wave ? (
            <div style={{ position: 'absolute', left: bars[PEAK_IDX].cx, top: BASE_Y - MAX_H, width: 0, height: 0, zIndex: 32 }}>
              <div style={wave.ring1} />
              <div style={wave.ring2} />
            </div>
          ) : null}
          <div style={{ position: 'absolute', left: bars[PEAK_IDX].cx, top: BASE_Y - MAX_H, width: 0, height: 0, zIndex: 32 }}>
            {burst.map((p, i) => (
              <div key={`burst-${i}`} style={p.style} />
            ))}
          </div>
        </AbsoluteFill>
      </CameraRig>
      {/* 每盏灯亮时的整页极轻亮度脉冲（SP-02：154=拍212 全亮对音收束，絕不动） */}
      <AbsoluteFill style={{ background: `rgba(233,217,174,0.5)`, mixBlendMode: 'soft-light', opacity: interpolate(frame, [FLASH_RELEASE, 60, 154, TOTAL], [0, 0.14, 0.08, 0.06], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), pointerEvents: 'none' }} />
      <HudChrome label="wuh.site · ONLINE" readout={frame >= 154 ? `ALL LIGHTS ON · ${fmtNum(TOTAL_ACTIVITY)}` : frame >= peakLand ? 'PEAK 2026-07 · 5,744' : 'CUTOVER · 2026-06-14'} />
      <Grade2 id="GR2-05" />
      <Caption text="六月十四日，流量切到新站。灯，次第亮起。" appearAt={24} />
    </AbsoluteFill>
  );
};

export default S28;
