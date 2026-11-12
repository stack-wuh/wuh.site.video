/* S38 · Act 6 入院 · 局部帧 [0,88) · 88f · 绝对 5346–5434
 *
 * V3 审计返工重写（2026-11-12 storyboard-audit s38 条）：「换一种墨色」兑现镜——
 * 站点墨色系统镜：space / amber / gold / seal 四色墨阶依次浸染同一句话
 * （「wuh.site」词标），色值 = FILM_COLORS2 真实 token（space #0F0E0C / data #D4A373 /
 * gold #E9D9AE / sealRed #7A1F16——与站点 brand tokens 同源，是站点的真实设计资产，
 * 零内联色值：色块与 hex 标签均直接读 token）。逐拍事件链（局部帧，fps=30）：
 * 【承接】0–4 承 s37 尾帧（面板 01–06 亮·光标停 07 前）→ 4 面板 07 点亮（lit 6→7，
 *         光标滑入窗 0–8 原样）。
 * 【触发】8–18 纸卡浮入（springIn 位移入场）：paperWhite 纸面 = 站点纸底（真实设计资产），
 *         空白待墨。
 * 【展开】18–58 四浸节拍（swap 总窗 18–58 原样，每浸 10f）：
 *         ① 18–28 space 墨浸染词标（clip 扫描自左向右，浸染前沿带亮边）；微甩横移一次
 *            （18–32 whip 窗口原样，CameraRig 施动）；
 *         ② 28–38 amber（data token）复浸全句；
 *         ③ 38–48 gold 复浸（落定金高光档）；
 *         ④ 48–58 seal 朱墨终浸（手作签名色收笔）——后浸覆盖前浸，终态朱红词标如钤。
 *         每浸完成即一记冲击：shockwave 双环 + 纸卡边框辉光脉冲（28/38/48/58 四拍对齐）；
 *         22–31 四枚墨阶色卡 chip 依浸染序升起（22+i*3 stagger 窗口原样），浸到即亮边，
 *         chip 标签 = token 名 + hex 真值（站点真实设计资产亮牌）。
 * 【收笔】58–72 「试墨」印章块拖拽钤于纸卡下缘（窗口原样，sealRed 手作签名）。
 * 【交接】70–78 内容层淡出（窗口原样）；74–88 光标移向 08（尾帧契约：面板 01–07 亮、
 *         光标停在 08 前 → s39 漫游起手）。
 * 意义一句话：站点的四瓶墨——底黑、数据琥珀、落定金、钤印朱——挨个浸过同一句话，
 * 观众看见的是站点真实的设计资产。
 * 时间轴零改动：88f / swap 总窗 18–58 / whip 18–32 / 色卡 22+i*3 / 试墨 58–72 /
 * Caption「换一种墨色，换一种心情。」appearAt 14 / 尾帧交接态语义原样。
 * 转场：入「切」，出「切」。字幕安全窗：start≥12、end≤76。镜内文字最低点 y≈880
 * （<930，不进 bottom 150px）；零图片零快照引用；random(seed) only；
 * 无 <Sequence>；springIn fps 取 useVideoConfig()；色板只用 FILM_COLORS2。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { FILM_COLORS2, glowText, shockwave, springIn } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 88;
const RAIL_PITCH = 74;
const SOAK_START = 18;
const SOAK_BEAT = 10; // 18/28/38/48 四浸，58 收（swap 总窗原样）
/* 四色墨阶（色值直接读 FILM_COLORS2 token——站点真实设计资产，零内联色值） */
const INKS: Array<{ key: string; token: string; hex: string; frontRgb: string }> = [
  { key: 'space', token: FILM_COLORS2.space, hex: FILM_COLORS2.space.toUpperCase(), frontRgb: '245,240,232' },
  { key: 'amber', token: FILM_COLORS2.data, hex: FILM_COLORS2.data.toUpperCase(), frontRgb: '212,163,115' },
  { key: 'gold', token: FILM_COLORS2.gold, hex: FILM_COLORS2.gold.toUpperCase(), frontRgb: '233,217,174' },
  { key: 'seal', token: FILM_COLORS2.sealRed, hex: FILM_COLORS2.sealRed.toUpperCase(), frontRgb: '122,31,22' },
];
const SOAK_LANDS = INKS.map((_k, i) => SOAK_START + i * SOAK_BEAT); // 18/28/38/48
/* 纸卡（站点纸底）与词标 */
const PANEL = { x: 410, y: 268, w: 1100, h: 400 };
const STAMP_TOP = 640;

/** V2 模块轨道（原控制台面板的 HUD 化替身）——交接态语义同 s30 */
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
      <div style={{ position: 'absolute', top: 14, left: (at - 1) * RAIL_PITCH - 14 + cursorP * 8, width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: `7px solid ${FILM_COLORS2.gold}`, opacity: 0.9, filter: 'drop-shadow(0 0 6px rgba(212,163,115,0.6))' }} />
    ) : null}
  </div>
);

const S38: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // 微甩横移（第一浸瞬间一次，窗口原样 18–32）
  const whip = interpolate(frame, [18, 24, 32], [0, 18, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cam = { scale: 1.04, x: whip, y: 0, rot: 0 };
  // 试墨印章块拖拽（58–72，窗口原样）
  const dragX = interpolate(frame, [58, 72], [420, 900], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  /* 轨道态：光标滑至 07（0–8）→ 07 亮（4）→ 尾段移向 08（74–88，V1 停 0.5） */
  const tail = frame >= TOTAL - 14;
  const lit = frame >= 4 ? 7 : 6;
  const at = tail ? 8 : 7;
  const cursorP = tail ? 0.5 : interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  /* 内容尾段淡出（70–78），让位交接态 */
  const contentOut = interpolate(frame, [70, 78], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  /* 纸卡浮入（8–18 springIn） */
  const panelIn = springIn(frame, 8, fps, 17, 170, 0.9);
  /* 四浸扫描进度（每浸 10f，clip 自左向右；浸定后保持覆盖） */
  const soakP = (k: number): number => interpolate(frame, [SOAK_LANDS[k], SOAK_LANDS[k] + SOAK_BEAT], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  /* 当前浸到第几瓶墨（HUD 读数） */
  const soakIdx = SOAK_LANDS.reduce((acc, l, k) => (frame >= l ? k : acc), -1);
  /* 每浸冲击波（浸定帧 28/38/48/58 双环） */
  const waves = SOAK_LANDS.map((l, k) => ({ k, at: l + SOAK_BEAT, w: shockwave(frame, l + SOAK_BEAT, INKS[k].frontRgb) }));
  /* 纸卡边框辉光脉冲（浸定即拍） */
  const edgePulse = Math.max(...SOAK_LANDS.map((l) => interpolate(frame, [l + SOAK_BEAT, l + SOAK_BEAT + 3, l + SOAK_BEAT + 14], [0, 0.5, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })));

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s38v2" stars={40} grid />
      <CameraRig cam={cam}>
        <div style={{ position: 'absolute', inset: 0, opacity: contentOut }}>
          {/* 环境墨晕（当前浸染色的极淡环境洗，峰 ≤0.08） */}
          {soakIdx >= 0 ? (
            <div style={{ position: 'absolute', left: 360, top: 130, width: 1200, height: 760, borderRadius: 400, background: `radial-gradient(circle, rgba(${INKS[soakIdx].frontRgb},0.09), transparent 66%)`, mixBlendMode: 'screen', pointerEvents: 'none', opacity: interpolate(frame, [SOAK_LANDS[soakIdx], SOAK_LANDS[soakIdx] + 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }} />
          ) : null}

          {/* 纸卡（paperWhite = 站点纸底，真实设计资产） */}
          <div
            style={{
              position: 'absolute',
              left: PANEL.x,
              top: PANEL.y,
              width: PANEL.w,
              height: PANEL.h,
              borderRadius: 12,
              background: FILM_COLORS2.paperWhite,
              border: `1px solid ${FILM_COLORS2.line}`,
              boxShadow: `0 0 ${28 + edgePulse * 30}px rgba(212,163,115,${0.14 + edgePulse * 0.2}), 0 26px 60px rgba(0,0,0,0.55)`,
              opacity: Math.min(1, panelIn * 1.5),
              transform: `translateY(${(1 - panelIn) * 22}px) scale(${0.94 + panelIn * 0.06})`,
            }}
          >
            <span style={{ position: 'absolute', left: 26, top: 16, fontFamily: fontFamilies.mono, fontSize: 12.5, letterSpacing: '0.3em', color: FILM_COLORS2.textMuted, opacity: interpolate(frame, [14, 22], [0, 0.9], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>BRAND INK · SAME SENTENCE × 4</span>
            {/* 词标四层墨（后浸覆盖前浸；clip 扫描 = 浸染前沿） */}
            {INKS.map((ink, k) => {
              const p = soakP(k);
              if (p <= 0) return null;
              return (
                <div key={ink.key} style={{ position: 'absolute', left: 0, right: 0, top: 128, textAlign: 'center', clipPath: `inset(0 ${(1 - p) * 100}% 0 0)` }}>
                  <span style={{ fontFamily: fontFamilies.serif, fontSize: 118, fontWeight: 700, letterSpacing: '0.04em', color: ink.token, lineHeight: 1.1, textShadow: '0 1px 0 rgba(15,14,12,0.14)' }}>wuh.site</span>
                </div>
              );
            })}
            {/* 浸染前沿亮边（当前浸的湿边） */}
            {INKS.map((ink, k) => {
              const p = soakP(k);
              const active = p > 0 && p < 1;
              if (!active) return null;
              return <div key={`f${ink.key}`} style={{ position: 'absolute', top: 118, bottom: 118, left: `${p * 100}%`, width: 3, borderRadius: 2, background: `linear-gradient(180deg, transparent, rgba(${ink.frontRgb},0.85), transparent)`, boxShadow: `0 0 12px rgba(${ink.frontRgb},0.7)`, mixBlendMode: 'multiply' }} />;
            })}
            <span style={{ position: 'absolute', left: 26, bottom: 16, fontFamily: fontFamilies.mono, fontSize: 12.5, letterSpacing: '0.24em', color: FILM_COLORS2.textMuted, opacity: interpolate(frame, [16, 24], [0, 0.85], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>INK ON PAPER · THE SITE'S OWN PALETTE</span>
          </div>

          {/* 四枚墨阶色卡（22+i*3 stagger 窗口原样升起；浸到即亮边 + hex 真值亮牌） */}
          <div style={{ position: 'absolute', left: 410, top: 716, display: 'flex', gap: 22 }}>
            {INKS.map((ink, i) => {
              const rise = interpolate(frame, [22 + i * 3, 34 + i * 3], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
              const soaked = frame >= SOAK_LANDS[i] + SOAK_BEAT;
              return (
                <div key={ink.key} style={{ width: 220, opacity: rise, transform: `translateY(${(1 - rise) * 12}px)` }}>
                  <div style={{ position: 'relative', width: 46, height: 46, borderRadius: 8, background: ink.token, border: `1px solid ${soaked ? ink.token : FILM_COLORS2.line}`, boxShadow: soaked ? `0 0 16px rgba(${ink.frontRgb},0.5)` : 'none' }} />
                  <div style={{ marginTop: 8, fontFamily: fontFamilies.mono, fontSize: 14, letterSpacing: '0.18em', color: soaked ? FILM_COLORS2.paperWhite : FILM_COLORS2.textMuted, opacity: soaked ? 0.95 : 0.8 }}>{ink.key.toUpperCase()}</div>
                  <div style={{ marginTop: 3, fontFamily: fontFamilies.mono, fontSize: 12, letterSpacing: '0.12em', color: FILM_COLORS2.textMuted, opacity: rise * 0.75 }}>{ink.hex}</div>
                </div>
              );
            })}
          </div>

          {/* 「试墨」印章块拖拽钤于纸卡下缘（58–72）——手作签名 */}
          {frame >= 58 ? (
            <div style={{ position: 'absolute', left: dragX, top: STAMP_TOP, width: 110, height: 44, borderRadius: 22, background: FILM_COLORS2.sealRed, opacity: 0.92, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 22px rgba(122,31,22,0.4)` }}>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 16, color: FILM_COLORS2.paperWhite, letterSpacing: '0.2em' }}>试墨</span>
            </div>
          ) : null}
        </div>
      </CameraRig>

      {/* 四浸冲击双环（浸定帧 28/38/48/58；屏空间近似锚纸卡心——机位仅微甩，偏差 <20px） */}
      {waves.map(({ k, at: landAt, w }) =>
        w && frame >= landAt && frame <= landAt + 26 ? (
          <div key={k} style={{ position: 'absolute', left: 960, top: 468, width: 0, height: 0, zIndex: 30, pointerEvents: 'none', opacity: contentOut }}>
            <div style={w.ring1} />
            <div style={w.ring2} />
          </div>
        ) : null,
      )}

      <Rail lit={lit} at={at} cursorP={cursorP} frame={frame} />
      <HudChrome label="wuh.site · THEMES" readout={soakIdx >= 0 ? (frame >= SOAK_LANDS[3] + SOAK_BEAT ? 'INK SEALED · 4 TOKENS' : `INK ${INKS[soakIdx].key.toUpperCase()} · ${soakIdx + 1}/4`) : 'PAPER · STANDBY'} />
      <Grade2 id="GR2-06" />
      <Caption text="换一种墨色，换一种心情。" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S38;
