/* S35 · Act 6 入院 · 局部帧 [0,88) · 88f · 绝对 5084–5172
 *
 * V3 审计返工重写（2026-11-12 storyboard-audit s35 条）：「两种人格，一间屋子」兑现镜——
 * 写作 vs 代码双数据柱对峙生长（文章 46 vs 提交 1,208，数据源 = DATA.articles / DATA.commits，
 * §6.10 口径写死；凡量必滚 bigNum），柱顶碰撞辉光 + 冲击环（§10 SLAM 级必配）。
 * 逐拍事件链（局部帧，fps=30）：
 * 【承接】0–8 承 s34 尾帧（面板五块亮·05 展开中，Rail 驻留）——同一间屋子的另一面。
 * 【触发】8–20 「屋子」地面线 pathDraw 画入（line 色，两柱共立的地板 = 一间屋子的「屋」）。
 * 【展开】① 18–38 左柱「写作」自地面向上生长（barGrow scaleY springIn，柱高 ∝ 46）+
 *            bigNum 0→46（18 起 20f，38 SLAM 落定 + 辉光脉冲）；
 *         ② 18–62 右柱「代码」同窗起势、滚得更久（bigNum 0→1,208，18 起 44f，62 落定
 *            SLAM；柱高 ∝ 1,208——量级差就是对峙本身）；
 *         ③ 柱顶读数 chip（mono 大数 + serif 人格签「写作/代码」）随柱顶走，辉光呼吸。
 * 【冲击】66–74 对峙碰撞（converge 窗口原样）：两枚柱顶 chip 沿对角飞向屋心 (960,470)、
 *         柱身向心微倾 ±2.5°；72 相撞瞬间 = 白金辉光耀斑 + shockwave 双环（环层独立于
 *         内容淡出，74–86 自行收散）+ sparkBurst 金粒（random(seed)）——两种人格在同一
 *         屋顶下相撞而共存。
 * 【交接】74–82 柱体与 chip 淡出让位交接态（窗口原样）；74–88 光标移向 06（尾帧契约：
 *         面板 01–05 亮、光标停在 06 前）。
 * 意义一句话：46 篇文章和 1,208 次提交在同一地面线上对峙生长——写字的和写码的是同一个人。
 * 时间轴零改动：88f / converge 窗 66–74 / 收束窗 74–82 / Caption「两种人格，一间屋子。」
 * appearAt 20 / 尾帧交接态语义原样。
 * 转场：入「切」，出「切」。字幕安全窗：start≥12、end≤76。镜内文字最低点 y≈880
 * （<930，不进 bottom 150px）；零图片零快照引用；random(seed) only；
 * 无 <Sequence>；springIn fps 取 useVideoConfig()；色板只用 FILM_COLORS2。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { bigNum, DATA, FILM_COLORS2, fmtNum, glowText, pathDraw, shockwave, sparkBurst, springIn } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 88;
const RAIL_PITCH = 74;
const FLOOR_Y = 860;
/* 双柱几何：写作（左，46）矮柱 / 代码（右，1,208）高柱；高差 ∝ 量级（46:1208 非线性取视觉档） */
const L = { x: 620, w: 190, h: 336, growDur: 20, slamAt: 38, rollDur: 20, value: DATA.articles, tag: '写作', sub: 'POSTS · 46' };
const R = { x: 1300, w: 190, h: 560, growDur: 44, slamAt: 62, rollDur: 44, value: DATA.commits, tag: '代码', sub: 'COMMITS · 1,208' };
const COLLIDE_AT = 72;
const HUB = { x: 960, y: 470 }; /* 屋心碰撞点 */

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

/** 单柱：生长（scaleY springIn）+ 柱顶读数 chip（bigNum 滚数 + 人格签），返回 chip 屏幕位 */
const Pillar: FC<{
  spec: { x: number; w: number; h: number; growDur: number; slamAt: number; rollDur: number; value: number; tag: string; sub: string };
  frame: number;
  fps: number;
  lean: number;
  contentOut: number;
  seed: string;
}> = ({ spec, frame, fps, lean, contentOut, seed }) => {
  const grow = springIn(frame, 18, fps, 18, spec.growDur < 30 ? 170 : 120, 0.9);
  const hero = bigNum(frame, 18, spec.rollDur, 0, spec.value);
  const glowBreathe = 0.45 + 0.15 * Math.sin(frame / 7);
  const topY = FLOOR_Y - spec.h * grow;
  /* chip 碰撞位移：66–74 沿对角飞向屋心 */
  const chipFly = interpolate(frame, [66, 74], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const chipX = spec.x + (HUB.x - spec.x) * chipFly;
  const chipY = topY - 46 + (HUB.y - (topY - 46)) * chipFly;
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: contentOut }}>
      {/* 柱体（origin bottom 生长；66–74 向心微倾） */}
      <div
        style={{
          position: 'absolute',
          left: spec.x - spec.w / 2,
          top: FLOOR_Y - spec.h,
          width: spec.w,
          height: spec.h,
          transformOrigin: 'bottom center',
          transform: `scaleY(${grow}) rotate(${(seed === 'L' ? 1 : -1) * lean * 2.5}deg)`,
          background: `linear-gradient(180deg, rgba(212,163,115,0.34), rgba(212,163,115,0.1))`,
          border: `1px solid ${FILM_COLORS2.line}`,
          borderRadius: '6px 6px 0 0',
          boxShadow: `0 0 ${14 + grow * 10}px rgba(212,163,115,${0.16 + glowBreathe * 0.1})`,
          opacity: 0.92,
        }}
      />
      {/* 柱顶读数 chip（随柱顶走 → 碰撞时飞向屋心） */}
      <div style={{ position: 'absolute', left: chipX, top: chipY, transform: 'translate(-50%, 0)', textAlign: 'center', width: 320, opacity: Math.min(1, grow * 2) }}>
        <span style={{ fontFamily: fontFamilies.mono, fontSize: 58, fontWeight: 700, color: FILM_COLORS2.data, fontVariantNumeric: 'tabular-nums', lineHeight: 1, transform: `scale(${hero.slam})`, display: 'inline-block', ...glowText(FILM_COLORS2.data, Math.max(hero.glow, glowBreathe)) }}>{hero.text}</span>
        <div style={{ marginTop: 8, fontFamily: fontFamilies.serif, fontSize: 26, color: FILM_COLORS2.paperWhite, letterSpacing: '0.3em', ...glowText(FILM_COLORS2.paperWhite, 0.22, '245,240,232') }}>{spec.tag}</div>
        <div style={{ marginTop: 6, fontFamily: fontFamilies.mono, fontSize: 13, letterSpacing: '0.24em', color: FILM_COLORS2.textMuted }}>{spec.sub}</div>
      </div>
    </div>
  );
};

const S35: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // 轻微横摇 ±2°（窗口原样）
  const camYaw = Math.sin(frame / 22) * 0.5;
  const cam = { scale: 1.05, x: camYaw * 12, y: 0, rot: camYaw };
  // 对峙倾角 + 内容收束（74–82，窗口原样）
  const lean = interpolate(frame, [66, 74], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const contentOut = interpolate(frame, [74, 82], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  // 轨道态：五块亮·05 展开中 → 尾段光标移向 06（74–88）
  const tail = frame >= TOTAL - 14;
  const lit = 5;
  const at = tail ? 6 : 5;
  const cursorP = tail ? interpolate(frame, [TOTAL - 14, TOTAL], [0, 0.6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0.5;
  /* 地面线（屋子）画入（8–20） */
  const floorD = 'M 300 860 L 1620 860';
  const floor = pathDraw(frame, 8, 12, floorD);
  /* 碰撞冲击（72）：耀斑 + 双环 + 金粒（环层独立于 contentOut，74–86 自行收散） */
  const flare = interpolate(frame, [COLLIDE_AT, COLLIDE_AT + 4, COLLIDE_AT + 14], [0, 0.95, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const wave = shockwave(frame, COLLIDE_AT, '233,217,174');
  const burst = sparkBurst('s35-clash', frame, COLLIDE_AT, 18, true);
  const ringOut = interpolate(frame, [82, 86], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s35v2" stars={36} grid />
      <CameraRig cam={cam}>
        {/* 「一间屋子」地面线（两柱共立的地板，8–20 画入） */}
        {frame >= 8 && frame <= 86 ? (
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 26, opacity: contentOut }}>
            <path d={floorD} fill="none" stroke={FILM_COLORS2.line} strokeWidth={2.5} strokeLinecap="round" opacity={0.9} strokeDasharray={floor.strokeDasharray} strokeDashoffset={floor.strokeDashoffset} style={{ filter: 'drop-shadow(0 0 6px rgba(212,163,115,0.35))' }} />
          </svg>
        ) : null}

        <Pillar spec={L} frame={frame} fps={fps} lean={lean} contentOut={contentOut} seed="L" />
        <Pillar spec={R} frame={frame} fps={fps} lean={lean} contentOut={contentOut} seed="R" />

        {/* 碰撞耀斑（72，屋心） */}
        {flare > 0.01 ? (
          <div style={{ position: 'absolute', left: HUB.x - 260, top: HUB.y - 260, width: 520, height: 520, borderRadius: 260, background: `radial-gradient(circle, rgba(233,217,174,${flare * 0.55}), rgba(212,163,115,${flare * 0.18}) 46%, transparent 70%)`, mixBlendMode: 'screen', zIndex: 30, pointerEvents: 'none' }} />
        ) : null}
      </CameraRig>

      {/* 冲击双环 + 金粒（独立层，74–86 收散；坐标取屏心近似——机位仅微摇，偏差 <8px） */}
      {frame >= COLLIDE_AT && frame <= COLLIDE_AT + 26 ? (
        <div style={{ position: 'absolute', left: HUB.x, top: HUB.y, width: 0, height: 0, zIndex: 31, pointerEvents: 'none', opacity: ringOut }}>
          <div style={wave?.ring1} />
          <div style={wave?.ring2} />
          {burst.map((s, i) => (
            <div key={i} style={s.style} />
          ))}
        </div>
      ) : null}

      <Rail lit={lit} at={at} cursorP={cursorP} frame={frame} />
      <HudChrome label="wuh.site · WRITING×CODE" readout={`${DATA.articles} POSTS × ${fmtNum(DATA.commits)} COMMITS`} />
      <Grade2 id="GR2-06" />
      <Caption text="两种人格，一间屋子。" appearAt={20} />
    </AbsoluteFill>
  );
};

export default S35;
