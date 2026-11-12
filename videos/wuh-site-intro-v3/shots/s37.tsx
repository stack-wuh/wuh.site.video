/* S37 · Act 6 入院 · 局部帧 [0,78) · 78f · 绝对 5268–5346
 *
 * V3 审计返工重写（2026-11-12 storyboard-audit s37 条）：p-heatmap-crop 截图证据窗删除
 * （快照引用零残留）——本镜重定义为 13,603 余韵镜（热力盘 s36 尾帧的回声）：
 * 全年 top5 活动日数据条快速闪回（heatCells() 排序前 5，真数据直读）+ peak 2026-07-24 · 1,263
 * 复现（DATA 口径写死）+ 「此乐何极~」serif 落款 kinetic。
 * 逐拍事件链（局部帧，fps=30）：
 * 【承接】0–10 承 s36 尾帧（峰值格被圈住、热力全深）——琥珀余韵辉光自中心向外收散
 *         （热力盘的「回声」），13,603 幽灵大数字淡入驻底（opacity 0.14 呼吸）。
 * 【触发】4–18 top5 数据条快速闪回：heatCells() 全年排序前 5（全部落在 2026-07 峰值月；
 *         长度按口径峰值 DATA.peakActivity 封顶——七月抖动超 1,263 的格与口径峰同档，
 *         视觉自洽同 s36 纪律），staggerLand(5, 4, 14, 'accel') 逐条 scaleX 弹入 + 落定闪；
 *         TOP-1 = 口径峰格（activity===1263 精确命中）着金描边。
 * 【冲击】32（=绝对 5300=拍265 对音，锚帧不动）：peak 复现——金环 springIn 咬合 TOP-1
 *         条端 + 引线 pathDraw + 数据卡 PEAK · 2026-07-24 · 1,263 弹入（呼应 s36 峰值卡）。
 * 【落款】40–53 「此乐何极~」serif 落款 kinetic（kineticChars step 2.4 逐字弹入）；52
 *         （=绝对 5320=拍266 对音，锚帧不动）末字落定 = sparkBurst 金粒 + 落款辉光脉冲。
 * 【交接】62–70 数据层淡出让位（窗口原样）；落款持住为交接残像；62–78 光标微移向 07
 *         （尾帧契约：面板 01–06 亮、光标停在 07 前）。
 * 意义一句话：全年最热的五天全在七月、顶峰是 7 月 24 日那天——此乐何极。
 * 时间轴零改动：78f / 拍265=32、拍266=52 锚帧不动 / Caption「此乐何极~」appearAt 14 /
 * 尾帧交接态语义原样。
 * 转场：入「切」，出「切」。字幕安全窗：start≥12、end≤66（数据层）；落款为交接残像持住。
 * 镜内文字最低点 y≈700（<930，不进 bottom 150px）；零图片零快照引用（§3）；
 * random(seed) only；无 <Sequence>；springIn fps 取 useVideoConfig()；色板只用 FILM_COLORS2。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { DATA, FILM_COLORS2, fmtNum, glowText, heatCells, kineticChars, pathDraw, shockwave, sparkBurst, springIn, staggerLand, writeFade } from '../motion-tokens';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 78;
const PEAK_ECHO_AT = 32; // = 绝对 5300 = 拍265（锚帧不动）
const SIGN_PULSE_AT = 52; // = 绝对 5320 = 拍266（锚帧不动）
/* top5 数据条几何 */
const BAR_X0 = 560;
const BAR_LEN = 1000;
const ROW_Y0 = 316;
const ROW_PITCH = 56;
const BAR_H = 26;

/* 全年 top5（heatCells() 真数据直读）：先按口径峰值封顶（同 s36 heatDeepen 纪律），
 * 再排序取前 5；口径峰格（activity===DATA.peakActivity 精确命中）恒列 TOP-1。 */
const PEAKED = heatCells().map((c) => ({ ...c, v: Math.min(c.activity, DATA.peakActivity) }));
const PEAK_CELL = PEAKED.find((c) => c.activity === DATA.peakActivity);
const TOP5 = [...PEAKED]
  .sort((a, b) => b.v - a.v || (a === PEAK_CELL ? -1 : b === PEAK_CELL ? 1 : a.day - b.day))
  .slice(0, 5);
/* 闪回落位（4–18 accel，前疏后密） */
const BAR_LANDS = staggerLand(5, 4, 14, 'accel');

/** V2 模块轨道（原控制台面板的 HUD 化替身）——交接态语义同 s30 */
const RAIL_PITCH_X = 74;
const Rail: FC<{ lit: number; at: number; cursorP: number; frame: number }> = ({ lit, at, cursorP, frame }) => (
  <div style={{ position: 'absolute', left: '50%', top: 92, width: 582, marginLeft: -291, zIndex: 26 }}>
    <div style={{ display: 'flex', gap: 10 }}>
      {Array.from({ length: 8 }).map((_v, i) => {
        const n = i + 1;
        const on = n <= lit;
        const active = n === at && on;
        return (
          <div key={n} style={{ width: 64 }}>
            <div
              style={{
                textAlign: 'center',
                fontFamily: fontFamilies.mono,
                fontSize: 13,
                letterSpacing: '0.18em',
                color: on ? FILM_COLORS2.data : n === at ? FILM_COLORS2.gold : FILM_COLORS2.textMuted,
                opacity: on ? 0.95 : n === at ? 0.9 : 0.5,
                ...(active ? glowText(FILM_COLORS2.data, 0.4 + 0.15 * Math.sin(frame / 6)) : {}),
              }}
            >
              {String(n).padStart(2, '0')}
            </div>
            <div style={{ marginTop: 6, height: 3, borderRadius: 2, background: on ? FILM_COLORS2.data : FILM_COLORS2.line, boxShadow: on ? `0 0 8px rgba(212,163,115,${active ? 0.4 + 0.2 * Math.sin(frame / 6) : 0.45})` : 'none', opacity: on ? 1 : 0.5 }} />
          </div>
        );
      })}
    </div>
    {at > lit ? (
      <div style={{ position: 'absolute', top: 14, left: (at - 1) * RAIL_PITCH_X - 14 + cursorP * 8, width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: `7px solid ${FILM_COLORS2.gold}`, opacity: 0.9, filter: 'drop-shadow(0 0 6px rgba(212,163,115,0.6))' }} />
    ) : null}
  </div>
);

const S37: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  /* 余韵辉光（0–10 收散）+ 幽灵 13,603 */
  const echo = interpolate(frame, [0, 4, 10], [0.5, 0.3, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const ghost = writeFade(frame, 4, true);
  /* 数据层淡出（62–70，窗口原样）；落款持住 */
  const contentOut = interpolate(frame, [62, 70], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  /* 轨道态：六块亮，光标停在 07 前（62–78 微移，窗口原样） */
  const tail = frame >= TOTAL - 16;
  const lit = 6;
  const at = 7;
  const cursorP = tail ? interpolate(frame, [TOTAL - 16, TOTAL], [0, 0.6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0.5;
  /* peak 复现（32）：金环咬合 + 引线 + 数据卡 */
  const ringIn = springIn(frame, PEAK_ECHO_AT, fps, 14, 210, 0.9);
  const ringBreath = 1 + 0.4 * Math.abs(Math.sin((frame - PEAK_ECHO_AT) / 9));
  const ringX = BAR_X0 + BAR_LEN;
  const ringY = ROW_Y0 + BAR_H / 2;
  const cardL = ringX + 44;
  const cardT = 232;
  const leaderD = `M ${ringX + 20} ${ringY - 12} L ${cardL} ${cardT + 74} L ${cardL} ${cardT + 44}`;
  const leader = pathDraw(frame, PEAK_ECHO_AT + 4, 10, leaderD);
  const cardIn = springIn(frame, PEAK_ECHO_AT + 8, fps, 15, 190, 0.8);
  /* 落款 kinetic（40–53）+ 拍266 脉冲（52） */
  const sign = kineticChars('此乐何极~', frame, 40, 2.4, fps, 0.5);
  const signPulse = interpolate(frame, [SIGN_PULSE_AT, SIGN_PULSE_AT + 3, SIGN_PULSE_AT + 18], [0, 1, 0.35], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const burst = sparkBurst('s37-sign', frame, SIGN_PULSE_AT, 12, true);
  const wave = shockwave(frame, SIGN_PULSE_AT, '233,217,174');

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s37v2" stars={40} grid />

      {/* 余韵辉光（承 s36 热力盘尾态，0–10 收散） */}
      {echo > 0.01 ? <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 52%, rgba(212,163,115,${echo * 0.3}), transparent 62%)`, mixBlendMode: 'screen', pointerEvents: 'none', zIndex: 24 }} /> : null}

      {/* 13,603 幽灵大数字（余韵驻底，呼吸微光） */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 132, textAlign: 'center', zIndex: 26, ...ghost, opacity: Number(ghost.opacity ?? 0) * contentOut * (0.85 + 0.15 * Math.sin(frame / 8)) }}>
        <span style={{ fontFamily: fontFamilies.mono, fontSize: 15, letterSpacing: '0.4em', color: FILM_COLORS2.textMuted }}>ACTIVITY ECHO · TOTAL</span>
        <div style={{ fontFamily: fontFamilies.mono, fontSize: 148, fontWeight: 700, lineHeight: 1.04, color: FILM_COLORS2.dataDim, fontVariantNumeric: 'tabular-nums', opacity: 0.16, ...glowText(FILM_COLORS2.dataDim, 0.3) }}>{fmtNum(DATA.activity)}</div>
      </div>

      {/* top5 数据条快速闪回（heatCells 真数据；长度按口径峰封顶） */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 28, opacity: contentOut }}>
        {TOP5.map((c, r) => {
          const land = BAR_LANDS[r];
          const p = springIn(frame, land, fps, 17, 220, 0.85);
          if (p <= 0) return null;
          const flash = interpolate(frame, [land, land + 2, land + 9], [0, 0.85, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const isPeak = c === PEAK_CELL;
          return (
            <div key={c.day} style={{ position: 'absolute', left: 440, top: ROW_Y0 + r * ROW_PITCH, height: BAR_H, display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 14, letterSpacing: '0.2em', color: isPeak ? FILM_COLORS2.gold : FILM_COLORS2.textMuted, width: 96, textAlign: 'right', fontVariantNumeric: 'tabular-nums', opacity: Math.min(1, p * 1.5) }}>{`TOP-${r + 1}`}</span>
              <div style={{ position: 'relative', width: BAR_LEN, height: BAR_H }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: 4, transformOrigin: 'left center', transform: `scaleX(${p})`, background: isPeak ? `linear-gradient(90deg, ${FILM_COLORS2.dataDim}, ${FILM_COLORS2.gold})` : `linear-gradient(90deg, ${FILM_COLORS2.dataDim}, ${FILM_COLORS2.data})`, opacity: isPeak ? 0.95 : 0.8, boxShadow: `0 0 ${6 + flash * 16}px rgba(212,163,115,${0.2 + flash * 0.35})` }} />
                {/* 峰值档右缘刻度（封顶口径峰 1,263） */}
                <div style={{ position: 'absolute', right: -2, top: -5, bottom: -5, width: 1.5, background: isPeak ? FILM_COLORS2.gold : FILM_COLORS2.line, opacity: p * (isPeak ? 0.95 : 0.4) }} />
              </div>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 13, letterSpacing: '0.14em', color: isPeak ? FILM_COLORS2.gold : FILM_COLORS2.textMuted, fontVariantNumeric: 'tabular-nums', opacity: p * 0.9, whiteSpace: 'nowrap' }}>{isPeak ? `${DATA.peakDay} · ${fmtNum(DATA.peakActivity)}` : `${c.month} · 峰值级`}</span>
            </div>
          );
        })}
        {/* 峰值档说明（口径写死，不自行推导） */}
        <div style={{ position: 'absolute', left: 440, top: ROW_Y0 + 5 * ROW_PITCH + 12, opacity: interpolate(frame, [20, 30], [0, 0.8], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
          <span style={{ fontFamily: fontFamilies.mono, fontSize: 12.5, letterSpacing: '0.18em', color: FILM_COLORS2.textMuted }}>{`BAR = PEAK CALIBER ${fmtNum(DATA.peakActivity)} · SOURCE heatCells()`}</span>
        </div>
      </div>

      {/* peak 复现（32=拍265）：金环咬合 TOP-1 条端 + 引线 + 数据卡 */}
      {frame >= PEAK_ECHO_AT && frame <= PEAK_ECHO_AT + 26 ? (
        <div style={{ position: 'absolute', left: ringX, top: ringY, width: 0, height: 0, zIndex: 30, opacity: contentOut, pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', left: -26 * ringBreath, top: -26 * ringBreath, width: 52 * ringBreath, height: 52 * ringBreath, borderRadius: 26 * ringBreath, border: `2.5px solid ${FILM_COLORS2.gold}`, opacity: Math.min(1, ringIn * 1.5), boxShadow: '0 0 18px rgba(233,217,174,0.45), inset 0 0 10px rgba(233,217,174,0.2)' }} />
        </div>
      ) : null}
      {frame >= PEAK_ECHO_AT + 4 ? (
        <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, zIndex: 30, pointerEvents: 'none', opacity: contentOut }}>
          <path d={leaderD} fill="none" stroke={FILM_COLORS2.gold} strokeWidth={1.5} strokeLinecap="round" opacity={0.9} strokeDasharray={leader.strokeDasharray} strokeDashoffset={leader.strokeDashoffset} />
        </svg>
      ) : null}
      {frame >= PEAK_ECHO_AT + 8 ? (
        <div style={{ position: 'absolute', left: cardL, top: cardT, zIndex: 31, padding: '10px 16px', borderRadius: 8, background: FILM_COLORS2.panel, border: `1px solid ${FILM_COLORS2.line}`, opacity: Math.min(1, cardIn * 1.5) * contentOut, transform: `translateY(${(1 - cardIn) * 16}px) scale(${0.92 + cardIn * 0.08})`, boxShadow: '0 0 24px rgba(212,163,115,0.18)' }}>
          <div style={{ fontFamily: fontFamilies.mono, fontSize: 15, letterSpacing: '0.18em', color: FILM_COLORS2.gold, whiteSpace: 'nowrap' }}>{`PEAK · ${DATA.peakDay}`}</div>
          <div style={{ marginTop: 4, fontFamily: fontFamilies.serif, fontSize: 22, lineHeight: 1.1, color: FILM_COLORS2.paperWhite, fontVariantNumeric: 'tabular-nums', ...glowText(FILM_COLORS2.paperWhite, 0.3) }}>{fmtNum(DATA.peakActivity)}</div>
        </div>
      ) : null}

      {/* 「此乐何极~」serif 落款 kinetic（40–53；52=拍266 末字落定脉冲，持住为交接残像） */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 620, textAlign: 'center', zIndex: 31, transform: `scale(${1 + signPulse * 0.02})` }}>
        {sign.map((k, ki) => (
          <span key={ki} style={{ ...k.style, fontFamily: fontFamilies.serif, fontSize: 74, color: FILM_COLORS2.paperWhite, letterSpacing: '0.08em' }}>
            {k.ch}
          </span>
        ))}
      </div>
      {frame >= SIGN_PULSE_AT && frame <= SIGN_PULSE_AT + 34 ? (
        <div style={{ position: 'absolute', left: 960, top: 660, width: 0, height: 0, zIndex: 32, pointerEvents: 'none' }}>
          <div style={wave?.ring1} />
          <div style={wave?.ring2} />
          {burst.map((s, i) => (
            <div key={i} style={s.style} />
          ))}
        </div>
      ) : null}

      <Rail lit={lit} at={at} cursorP={cursorP} frame={frame} />
      <HudChrome label="wuh.site · ACTIVITY ECHO" readout={frame >= PEAK_ECHO_AT ? `PEAK ${DATA.peakDay} · ${fmtNum(DATA.peakActivity)}` : `TOP 5 / ${fmtNum(DATA.activity)}`} />
      <Grade2 id="GR2-06" />
      <Caption text="此乐何极~" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S37;
