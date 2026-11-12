/* S31 · Act 6 入院 · 局部帧 [0,96) · 96f · 绝对 4634–4730
 *
 * V3 审计返工重写（2026-11-12 storyboard-audit s31 条 + §3 内容本体化）：「每一篇一幅山水」
 * 兑现镜——p-post-cover-165 截图证据窗整体删除（快照引用零残留），主角 =
 * 46 篇微缩山水编号阵列（数据源 = DATA.articles=46，§6.10 口径写死；纯排版+笔意描边，零图片）。
 * 逐拍事件链（局部帧，fps=30）：
 * 【承接】0–10 琥珀光标自 s30 尾帧交出的「02 前」落位（Rail 01 亮·光标滑至 02，窗口原样）。
 * 【触发】10–22 点击涟漪（窗口原样）→ 12 面板 02 点亮（lit 1→2，窗口原样）。
 * 【展开】① 14–44 阵列级联：staggerLand(46, 14, 30, 'accel') 前疏后密——每格 = 墨点 +
 *            山水笔意 pathDraw 短笔（8f 描完，4 种笔路按 random(seed) 分派）+ 编号 mono
 *            01–46（NO = 文章序号，数据源即 46 篇之数）；每格 springIn 上浮入场（位移）；
 *         ② 30–81 金句逐字 kinetic（§10：kineticChars step 3，16 字 30+45=75 落定，≤84 安全窗）；
 *         ③ 46/56/66 三连放大示范：random('s31-pick-*') 确定性抽 3 篇，逐篇原地放大
 *            （springIn scale 1→2.3 + 辉光衬卡 springIn 弹入，卡内笔意大字重描 + NO/墨点），
 *            前一篇随下一篇启动缩回阵列（他人 dim 让位，被抽格恒亮）。
 * 【交接】66 「wuh.site」落款如钤（拍235，落定即凝住，sealRed 手作签名——移至 bottom 170
 *         避让字幕安全区）；82–90 内容层淡出；82–96 光标移向 03（尾帧契约：面板 01–02 亮、
 *         光标停在 03 前）。
 * 意义一句话：46 篇文章每篇配一枚墨点一笔山水——写作对作者来说每一篇都是一幅独一份的风景。
 * 时间轴零改动：96f / 点击窗 10–22 / 02 亮 12 / 落款 66=拍235 / Caption
 * 「每一篇，都有一幅只属于它的山水。」appearAt 14 / 尾帧交接态语义原样。
 * 转场：入「切」，出「切」。字幕安全窗：start≥12、end≤84。
 * 镜内文字最低点 y≈910（<930，不进 bottom 150px）；零图片零快照引用（§3）；
 * random(seed) only；无 <Sequence>；springIn fps 取 useVideoConfig()；色板只用 FILM_COLORS2。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { DATA, FILM_COLORS2, glowText, kineticChars, pathDraw, springIn, staggerLand } from '../motion-tokens';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 96;
const CLICK_AT = 10;
const RAIL_PITCH = 74;

/* 46 篇微缩山水阵：23 列 × 2 行；数据源 = DATA.articles（文章数，画面不得自行推导） */
const COUNT = DATA.articles;
const COLS = 23;
const CELL_W = 56;
const CELL_PITCH = 74;
const ROW_TOP = [400, 556];
const CELL_X = (i: number): number => 150 + (i % COLS) * CELL_PITCH;
const CELL_Y = (i: number): number => ROW_TOP[Math.floor(i / COLS)];

/* 四种山水笔路（短笔，8f 描完）；random(seed) 确定性分派 */
const STROKES = [
  'M 2 26 L 16 10 L 26 20 L 38 6 L 54 24',
  'M 2 24 Q 16 6 30 18 T 54 14',
  'M 2 20 L 14 26 L 24 12 L 40 22 L 54 10',
  'M 2 26 Q 20 14 34 24 Q 44 28 54 18',
];
const strokeOf = (i: number): string => STROKES[Math.floor(random(`s31-stroke-${i}`) * STROKES.length) % STROKES.length];

/* 阵列级联表（14–44 accel，前疏后密） */
const LANDS = staggerLand(COUNT, 14, 30, 'accel');

/* 示范三连：random(seed) 确定性抽 3 篇（去重）；起放大帧 46/56/66 */
const PICKS: number[] = [];
for (let g = 0; g < 60 && PICKS.length < 3; g += 1) {
  const c = Math.floor(random(`s31-pick-${g}`) * COUNT);
  if (!PICKS.includes(c)) PICKS.push(c);
}
const PICK_ATS = [46, 56, 66];

/** V2 模块轨道（原控制台面板的 HUD 化替身）——交接态语义同 s30 */
const Rail: FC<{ lit: number; at: number; cursorP: number; frame: number; ripple: number }> = ({ lit, at, cursorP, frame, ripple }) => (
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
    {ripple > 0 && ripple < 1 ? (
      <div style={{ position: 'absolute', top: 9 - 22 * ripple, left: (at - 1) * RAIL_PITCH + 32 - (12 + 44 * ripple) / 2, width: 12 + 44 * ripple, height: 12 + 44 * ripple, borderRadius: 20, border: `1.5px solid ${FILM_COLORS2.gold}`, opacity: (1 - ripple) * 0.9 }} />
    ) : null}
  </div>
);

const S31: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  /* 轨道态：光标滑至 02（0–10）→ 点击（10–22）→ 02 亮（12）→ 尾段移向 03（82–96） */
  const ripple = frame >= CLICK_AT && frame < CLICK_AT + 12 ? (frame - CLICK_AT) / 12 : 0;
  const tail = frame >= TOTAL - 14;
  const lit = frame >= CLICK_AT + 2 ? 2 : 1;
  const at = tail ? 3 : 2;
  const cursorP = tail ? interpolate(frame, [TOTAL - 14, TOTAL], [0, 0.6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : interpolate(frame, [0, CLICK_AT], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  /* 内容尾段淡出（82–90），让位交接态 */
  const contentOut = interpolate(frame, [82, 90], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  /* 三连放大示范：第 k 篇 boost 入（PICK_ATS[k] 起 8f spring）→ 下一篇启动时 6f 缩回 */
  const pickBoost = (k: number): number => {
    const up = springIn(frame, PICK_ATS[k], fps, 16, 200, 0.85);
    const downAt = k + 1 < PICK_ATS.length ? PICK_ATS[k + 1] : TOTAL;
    const down = interpolate(frame, [downAt, downAt + 6], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    return up * down;
  };
  const boosts = PICKS.map((_p, k) => pickBoost(k));
  /* 未被抽中的阵列随示范压暗让位（被抽格恒亮） */
  const othersDim = Math.max(...boosts) * 0.55;

  /* 金句逐字 kinetic（30 起 step 3，落定带辉光呼吸） */
  const quote = kineticChars('每一篇，都有一幅只属于它的山水。', frame, 30, 3, fps, 0.32);

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s31v2" stars={44} grid />

      {/* 金句大字号 kinetic（逐字弹入，top 区避让字幕） */}
      <div style={{ position: 'absolute', left: 190, top: 170, zIndex: 29, opacity: contentOut, whiteSpace: 'nowrap' }}>
        {quote.map((k, ki) => (
          <span key={ki} style={{ ...k.style, fontFamily: fontFamilies.serif, fontSize: 58, color: FILM_COLORS2.paperWhite }}>
            {k.ch}
          </span>
        ))}
      </div>

      {/* 46 篇微缩山水编号阵列（墨点 + 笔意 pathDraw 短笔 + 编号；零图片纯排版） */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 28, opacity: contentOut }}>
        {Array.from({ length: COUNT }, (_v, i) => {
          const land = LANDS[i];
          const p = springIn(frame, land, fps, 17, 210, 0.85);
          if (p <= 0) return null;
          const boost = PICKS.includes(i) ? boosts[PICKS.indexOf(i)] : 0;
          const dim = boost > 0 ? 0 : othersDim;
          const d = strokeOf(i);
          const stroke = pathDraw(frame, land + 2, 8, d);
          const flash = interpolate(frame, [land, land + 2, land + 9], [0, 0.85, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: CELL_X(i),
                top: CELL_Y(i),
                width: CELL_W,
                zIndex: 28 + Math.round(boost * 4),
                opacity: Math.min(1, p * 1.5) * (dim > 0 ? 1 - dim : 1),
                transform: `translateY(${(1 - p) * 14}px) scale(${1 + boost * 1.3})`,
                transformOrigin: '50% 50%',
              }}
            >
              {/* 放大示范辉光衬卡（跟格弹出） */}
              {boost > 0.02 ? (
                <div style={{ position: 'absolute', left: -72, top: -37, width: 200, height: 128, borderRadius: 8, background: FILM_COLORS2.panel, border: `1px solid ${FILM_COLORS2.line}`, boxShadow: `0 0 ${18 + boost * 16}px rgba(212,163,115,${0.16 + boost * 0.16})`, opacity: boost }} />
              ) : null}
              <svg width={CELL_W} height={34} style={{ position: 'relative', display: 'block', overflow: 'visible' }}>
                <path
                  d={d}
                  fill="none"
                  stroke={boost > 0.02 ? FILM_COLORS2.gold : FILM_COLORS2.data}
                  strokeWidth={boost > 0.02 ? 1.1 : 2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={stroke.strokeDasharray}
                  strokeDashoffset={stroke.strokeDashoffset}
                  opacity={0.92}
                />
              </svg>
              {/* 墨点 + 编号（NO = 文章序号，源 = DATA.articles） */}
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: 3, background: FILM_COLORS2.data, boxShadow: `0 0 ${4 + flash * 10}px ${1 + flash * 2}px rgba(212,163,115,${0.3 + flash * 0.4})` }} />
                <span style={{ fontFamily: fontFamilies.mono, fontSize: 11, letterSpacing: '0.14em', color: boost > 0.02 ? FILM_COLORS2.gold : FILM_COLORS2.textMuted, fontVariantNumeric: 'tabular-nums', opacity: boost > 0.02 ? 1 : 0.85 }}>{String(i + 1).padStart(2, '0')}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 「wuh.site」落款如钤（66=拍235，落定即凝住）——手作签名（避让字幕安全区 bottom 170） */}
      <div style={{ position: 'absolute', right: 220, bottom: 170, zIndex: 29, opacity: Number(interpolate(frame, [66, 76], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut })) * contentOut, transform: `translateY(${(1 - interpolate(frame, [66, 76], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut })) * 6}px)` }}>
        <span style={{ fontFamily: fontFamilies.serif, fontSize: 34, color: FILM_COLORS2.sealRed, letterSpacing: '0.2em', border: `2px solid ${FILM_COLORS2.sealRed}`, padding: '8px 22px', opacity: 0.92, ...glowText(FILM_COLORS2.sealRed, 0.3, '122,31,22') }}>wuh.site</span>
      </div>

      <Rail lit={lit} at={at} cursorP={cursorP} frame={frame} ripple={ripple} />
      <HudChrome label="wuh.site · COVERS" readout={boosts.some((b) => b > 0.5) ? `NO.${String(PICKS[boosts.findIndex((b) => b > 0.5)] + 1).padStart(2, '0')}/46 · SKETCH` : `ARRAY · ${COUNT} POSTS`} />
      <Grade2 id="GR2-06" />
      <Caption text="每一篇，都有一幅只属于它的山水。" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S31;
