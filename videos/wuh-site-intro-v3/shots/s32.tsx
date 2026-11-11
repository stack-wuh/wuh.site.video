/* S32 · Act 6 入院 · 局部帧 [0,96) · 96f · 绝对 4730–4826
 *
 * V3 全量重实装（2026-11-11 风格锚点 V2 + §10 FX 解禁层）：书架镜——146 本真实藏书
 * 文字书脊墙（books.ts 直读 title/author；§3 禁截图/禁封面图：cover 字段零引用、
 * 零 Img/staticFile，书墙纯排版渲染）。逐拍事件链：
 * 【承接】s31 尾帧交接：面板 01–02 亮、光标停 03 前 → 本镜帧 0 琥珀光标自 03 位起飞；
 * 【触发】0–8 光标（辉光 + 双残影拖尾）飞向书墙（屏幕坐标经 CameraRig 逆映射锁定墙面），
 *         8 点击涟漪 → 面板 03 点亮（8）+ 列级落架启动；
 * 【展开】8–56 列级落架 staggerLand(30, 8, 44, 'accel')（前疏后密），列内 5 本各 +3f
 *         微错峰（末本 ≤64f）；每根书脊 springIn（scale 0.92→1 + translateY 14→0）；
 *         书脊 = panel 底 + 1px line 边 + 左侧 3px 色带 i%5 轮换（data/gold/dataDim/
 *         sealRed 低透/paperWhite 低透，全在色板内），书名竖排 serif 16px paperWhite
 *         （>13 字截断加 '…'，模块级一次性预算），作者 mono 9.5px textMuted（截 6 字，
 *         空 → '佚'）；CameraRig translateX 缓扫 ±84（共 ~168px）+ 缓拉远 0.88→0.72
 *         + handheld('s32-cam', 1.1)；dataCurtain 数据雨帘垫底（峰值 ≤0.22）。
 *         ★门6 红单修复（字幕安全）：camY 由 camScale 推导（cam.y = 260/s − 1060），
 *         墙底缘全程恒钉 y≈800——收尾态含 handheld 抖动（dy ±2.6 + rot ±2.6）≤805
 *         < 820，Caption 区（y≥864）全程零叠压；终态 scale 0.50→0.31（顶缘 143
 *         避让 Rail 底 ~117 的约束上限 s ≤ 658/2120，纯上移会让第 1 行整行出画）。
 * 56–82 抽书放大：random('s32-pick') 从书名 6–14 字的真实条目选 1 本（当前命中
 *         《银河英雄传说》田中芳树，槽位 04-08 行 3 列 7——确定性，books.ts 变则随之变），
 *         中央放大卡 springIn（scale 0.86→1 + y 18→0；★门6 修复：卡底改 spaceDeep
 *         实底，杜绝透底书脊文字干扰卡面），落定 60 shockwave 双环 +
 *         62 sheenSweep 金光扫卡 + sparkBurst 金粒；书名 serif 34px writeFade+glowText、
 *         作者 mono 15px textMuted、题签「阅读中」sealRed 底 kineticChars 逐字弹入
 *         （62 起 step 3）；书墙压暗 opacity 0.35（56–64）。
 * 【交接】82–96 汇总落点：放大卡缩回槽位（82–92 位移回 slot + scale 缩并 87–92 溶解，
 *         92 槽位 sparkBurst——书脊已在，卡溶回架上；layerToScreen 逐帧取实时 cam，
 *         相机 78–94 拉远中槽位坐标仍精确锁定）+ 全墙回亮（82–92）+ 相机拉远
 *         0.72→0.31（78–94，底缘恒钉）全墙亮相；左下 bigNum 0→146（84–94 SLAM+辉光，94
 *         sparkBurst）+ 'SHELVES · 30 × 5'（86–92）；Rail 光标移向 04（82–96，
 *         cursorP→0.6 停 04 前 = 尾帧契约：面板 01–03 亮、光标停在 04 前）；
 *         HUD readout 82f 切 'WEREAD · LOADING' → '146 SHELVES'。
 * 时间轴零改动：96f、Caption 文本/appearAt 14/bottom 默认 原样；转场：入「切」，出「切」。
 * 字幕安全窗：start≥12、end≤84。镜内不用 <Sequence>；零图片；random(seed) only。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES, writeFade } from '../../../brand/motion';
import {
  FILM_COLORS2,
  bigNum,
  dataCurtain,
  glowText,
  handheld,
  kineticChars,
  sheenSweep,
  shockwave,
  sparkBurst,
  springIn,
  staggerLand,
} from '../motion-tokens';
import { BOOKS } from '../books';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 96;
const RAIL_PITCH = 74;

/* ─── 书墙几何：146 本 = 30 列 × 5 行（150 槽，末 4 槽空）；层坐标整体居中 ─── */
const COLS = 30;
const ROWS = 5;
const SPINE_W = 56;
const SPINE_H = 416;
const COL_GAP = 6;
const ROW_GAP = 10;
const WALL_W = COLS * SPINE_W + (COLS - 1) * COL_GAP; // 1854
const WALL_H = ROWS * SPINE_H + (ROWS - 1) * ROW_GAP; // 2120
const CARD_W = 580;
const CARD_H = 300;
const PICK_LAND = 60; // 放大卡落定（shockwave/sheen/spark 对齐帧）
const CARD_OUT = 82; // 缩回墙中起点（= 尾段交接起点）

/* 左侧 3px 色带 i%5 轮换（token + opacity 实现「低透明」档，零内联色值） */
const BANDS: Array<{ token: string; alpha: number }> = [
  { token: FILM_COLORS2.data, alpha: 1 },
  { token: FILM_COLORS2.gold, alpha: 0.9 },
  { token: FILM_COLORS2.dataDim, alpha: 1 },
  { token: FILM_COLORS2.sealRed, alpha: 0.5 },
  { token: FILM_COLORS2.paperWhite, alpha: 0.32 },
];

/* 书脊文案一次性预算（146 根渲染期不再遍历截断） */
const SPINES = BOOKS.map((b, i) => ({
  slot: i,
  title: b.title.length > 13 ? `${b.title.slice(0, 12)}…` : b.title,
  author: b.author === '' ? '佚' : b.author.length > 6 ? `${b.author.slice(0, 5)}…` : b.author,
  band: i % 5,
}));

/* 列级落架表（8–52 accel）；列内第 r 本再 +3f 微错峰 → 末本 ≤64 */
const COLUMN_LAND = staggerLand(COLS, 8, 44, 'accel');
const spineLand = (slot: number): number => COLUMN_LAND[slot % COLS] + Math.floor(slot / COLS) * 3;

/* 抽书：random('s32-pick') 从书名 6–14 字的真实条目中选一本（确定性，模块级算一次；
 * 只取 title/author，cover 字段零解构零引用） */
const PICK_CANDIDATES = BOOKS.map((b, i) => ({ title: b.title, author: b.author, i })).filter((b) => b.title.length >= 6 && b.title.length <= 14);
const PICKED = PICK_CANDIDATES[Math.floor(random('s32-pick') * PICK_CANDIDATES.length)];
const PICK_SLOT = PICKED.i;
const PICK_ROW = Math.floor(PICK_SLOT / COLS);
const PICK_COL = PICK_SLOT % COLS;
const PICK_BAND = BANDS[PICK_SLOT % 5];
const PICK_AUTHOR = PICKED.author === '' ? '佚' : PICKED.author.length > 20 ? `${PICKED.author.slice(0, 19)}…` : PICKED.author;

/** V2 模块轨道（原控制台面板的 HUD 化替身）——交接态语义同 s30/s31：
 *  lit=已点亮段数，at=光标所停段位（未点亮），cursorP=光标滑入微进度。尾帧契约：光标停在 04 前。 */
const Rail: FC<{ lit: number; at: number; cursorP: number; frame: number }> = ({ lit, at, cursorP, frame }) => (
  <div style={{ position: 'absolute', left: '50%', top: 92, width: 582, marginLeft: -291, zIndex: 26 }}>
    <div style={{ display: 'flex', gap: 10 }}>
      {Array.from({ length: 8 }).map((_, i) => {
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

const S32: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* CameraRig：translateX 缓扫 +84→−84（~168px）+ 缓拉远（0.88 落架近景→0.72→0.31 尾帧全墙）+ handheld。
   * 门6 修复：camY = 260/s − 1060（墙底缘层坐标 1600 → 屏幕 540 + s·(1060 + cam.y) = 800 恒钉），
   * 墙底缘全程 ≤805（含 handheld dy ±2.6 + rot ±2.6），Caption 区 y≥864 零叠压；
   * 终态 0.31 保证顶缘 143 ≥ 136（避让 Rail 底 ~117），146 根全画。 */
  const hh = handheld('s32-cam', frame, 1.1);
  const camScale = interpolate(frame, [0, 8, 56, 78, 94], [0.88, 0.88, 0.72, 0.72, 0.31], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: CURVES.cineEaseInOut,
  });
  const camX = interpolate(frame, [0, 8, 56, 78, 94], [84, 84, -84, -84, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: CURVES.cineEaseInOut,
  });
  const camY = 260 / camScale - 1060;
  const cam = { scale: camScale, x: camX + hh.dx, y: camY + hh.dy, rot: hh.rot };

  /* 层坐标 → 屏幕坐标（与 CameraRig scale→translate→rotate 链精确互逆；rot 项参与，
   * 抽书卡缩回槽位、光标锁定墙面都用它） */
  const layerToScreen = (px: number, py: number): { x: number; y: number } => {
    const rx = px - 960;
    const ry = py - 540;
    const th = (cam.rot * Math.PI) / 180;
    const vx = rx * Math.cos(th) - ry * Math.sin(th);
    const vy = rx * Math.sin(th) + ry * Math.cos(th);
    return { x: 960 + camScale * (vx + cam.x), y: 540 + camScale * (vy + cam.y) };
  };

  /* 抽书槽位中心（层坐标）→ 屏幕坐标 */
  const pickSlotCenter = {
    x: 960 - WALL_W / 2 + PICK_COL * (SPINE_W + COL_GAP) + SPINE_W / 2,
    y: 540 - WALL_H / 2 + PICK_ROW * (SPINE_H + ROW_GAP) + SPINE_H / 2,
  };
  const pickScreen = layerToScreen(pickSlotCenter.x, pickSlotCenter.y);

  /* 0–8 光标：自 s31 交接位（面板 03 前 ≈ 807,106）飞向书墙，8 点击涟漪触发落架。
   * 命中点取可视带内层坐标（camY 恒钉后 0–8f 可视带 ≈ 层 y 691–1600，取第 4 行书墙 1330） */
  const cursorP = interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const impact = layerToScreen(960, 1330);
  const cursorAt = (p: number): { x: number; y: number } => ({ x: 807 + (impact.x - 807) * p, y: 106 + (impact.y - 106) * p });
  const ripple = interpolate(frame, [8, 24], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const cursorFade = interpolate(frame, [10, 18], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  /* Rail 轨道态：8 点击确认 → 03 亮；82 起光标移向 04（尾帧契约：01–03 亮、光标停 04 前） */
  const tail = frame >= TOTAL - 14;
  const lit = frame >= 8 ? 3 : 2;
  const at = tail ? 4 : 3;
  const railP = tail
    ? interpolate(frame, [TOTAL - 14, TOTAL], [0, 0.6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  /* 抽书放大卡：56 springIn（scale 0.86→1 + y 18→0）；82–92 位移回槽位缩并溶解 */
  const cardIn = springIn(frame, 56, fps, 17, 200, 0.85);
  const cardBack = interpolate(frame, [CARD_OUT, 92], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const cardFade = interpolate(frame, [87, 92], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cardScale = (0.86 + 0.14 * cardIn) * (1 - 0.85 * cardBack);
  const cardVisible = frame >= 56 && cardFade > 0;

  /* 书墙明暗：56–64 压暗 0.35（让位放大卡）→ 82–92 回亮（卡溶回架上） */
  const wallOpacity = interpolate(frame, [56, 64, CARD_OUT, 92], [1, 0.35, 0.35, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: CURVES.cineEaseInOut,
  });

  /* 汇总落点：bigNum 0→146（84–94 SLAM） */
  const hero = bigNum(frame, 84, 10, 0, 146);

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s32v2" stars={44} grid />

      {/* 数据雨帘垫底（§10 背景氛围层，峰值 opacity ≤0.22，4–16 淡入保持帧 0 近黑承接） */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 24, pointerEvents: 'none', opacity: interpolate(frame, [4, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
        {dataCurtain('s32-rain', frame, 12, 120).map((c, i) => (
          <div key={i} style={{ position: 'absolute', left: `${c.x}%`, top: c.y, fontFamily: fontFamilies.mono, fontSize: 12, color: FILM_COLORS2.data, opacity: c.o }}>
            {c.text}
          </div>
        ))}
      </div>

      {/* 146 本文字书脊墙（CameraRig 内，零图片纯排版） */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 27 }}>
        <CameraRig cam={cam}>
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: WALL_W,
              height: WALL_H,
              marginLeft: -WALL_W / 2,
              marginTop: -WALL_H / 2,
              display: 'grid',
              gridTemplateColumns: `repeat(${COLS}, ${SPINE_W}px)`,
              gridTemplateRows: `repeat(${ROWS}, ${SPINE_H}px)`,
              gap: `${ROW_GAP}px ${COL_GAP}px`,
              opacity: wallOpacity,
            }}
          >
            {SPINES.map((sp) => {
              const p = springIn(frame, spineLand(sp.slot), fps);
              if (p <= 0) return null;
              const isPicked = sp.slot === PICK_SLOT;
              return (
                <div
                  key={sp.slot}
                  style={{
                    position: 'relative',
                    width: SPINE_W,
                    height: SPINE_H,
                    background: FILM_COLORS2.panel,
                    border: `1px solid ${FILM_COLORS2.line}`,
                    borderRadius: '3px 3px 1px 1px',
                    overflow: 'hidden',
                    opacity: Math.min(1, p * 1.5),
                    transform: `translateY(${(1 - p) * 14}px) scale(${0.92 + p * 0.08})`,
                    boxShadow: isPicked ? '0 0 14px rgba(212,163,115,0.35)' : 'none',
                  }}
                >
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: BANDS[sp.band].token, opacity: BANDS[sp.band].alpha }} />
                  <div style={{ position: 'absolute', left: 3, right: 0, top: 12, bottom: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    <span style={{ writingMode: 'vertical-rl', fontFamily: fontFamilies.serif, fontSize: 16, lineHeight: 1.15, letterSpacing: '0.12em', color: FILM_COLORS2.paperWhite, whiteSpace: 'nowrap', opacity: 0.92 }}>{sp.title}</span>
                  </div>
                  <div style={{ position: 'absolute', left: 3, right: 2, bottom: 8, textAlign: 'center', fontFamily: fontFamilies.mono, fontSize: 9.5, lineHeight: 1.2, color: FILM_COLORS2.textMuted, whiteSpace: 'nowrap', overflow: 'hidden' }}>{sp.author}</div>
                </div>
              );
            })}
          </div>
        </CameraRig>
      </div>

      {/* 抽书放大卡（屏幕空间居中；82–92 沿实时逆映射缩回槽位） */}
      {cardVisible ? (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: CARD_W,
            zIndex: 30,
            opacity: Math.min(1, cardIn * 1.4) * cardFade,
            transform: `translate(-50%, -50%) translate(${(pickScreen.x - 960) * cardBack}px, ${(pickScreen.y - 540) * cardBack + (1 - cardIn) * 18}px) scale(${cardScale})`,
          }}
        >
          <div
            style={{
              position: 'relative',
              height: CARD_H,
              borderRadius: 10,
              background: FILM_COLORS2.spaceDeep,
              border: `1px solid ${FILM_COLORS2.line}`,
              overflow: 'hidden',
              boxShadow: '0 0 46px rgba(212,163,115,0.22), 0 30px 70px rgba(0,0,0,0.6)',
            }}
          >
            {/* 书脊色带延续到卡（同一本的 i%5 色带） */}
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 5, background: PICK_BAND.token, opacity: PICK_BAND.alpha }} />
            {/* 金光扫过卡片（62 起 12f） */}
            <div style={sheenSweep(frame, 62, 12)} />
            <div style={{ position: 'absolute', left: 48, top: 58, right: 44 }}>
              <div style={{ fontFamily: fontFamilies.serif, fontSize: 34, letterSpacing: '0.06em', color: FILM_COLORS2.paperWhite, ...writeFade(frame, PICK_LAND), ...glowText(FILM_COLORS2.paperWhite, 0.5) }}>{PICKED.title}</div>
              <div style={{ marginTop: 16, fontFamily: fontFamilies.mono, fontSize: 15, letterSpacing: '0.1em', color: FILM_COLORS2.textMuted }}>{PICK_AUTHOR}</div>
            </div>
            {/* 题签「阅读中」（sealRed 底 paperWhite，逐字 kinetic 弹入） */}
            <div style={{ position: 'absolute', right: 26, top: 26, background: FILM_COLORS2.sealRed, color: FILM_COLORS2.paperWhite, fontFamily: fontFamilies.serif, fontSize: 13, letterSpacing: '0.22em', padding: '6px 12px 6px 16px', borderRadius: 2 }}>
              {kineticChars('阅读中', frame, 62, 3, fps, 0.5).map((k, ki) => (
                <span key={ki} style={k.style}>
                  {k.ch}
                </span>
              ))}
            </div>
            {/* 槽位读数（先于 146 大数字预告总量） */}
            <div style={{ position: 'absolute', left: 48, bottom: 22, fontFamily: fontFamilies.mono, fontSize: 11, letterSpacing: '0.3em', color: FILM_COLORS2.textMuted, opacity: interpolate(frame, [66, 76], [0, 0.85], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), fontVariantNumeric: 'tabular-nums' }}>
              {`NO.${String(PICK_SLOT + 1).padStart(3, '0')} / 146 · SLOT ${String(PICK_ROW + 1).padStart(2, '0')}-${String(PICK_COL + 1).padStart(2, '0')}`}
            </div>
          </div>
        </div>
      ) : null}

      {/* 落定冲击：60 双环（卡后）+ 卡金粒 + 92 溶架金粒 + 94 大数字金粒 */}
      {frame >= PICK_LAND && frame <= PICK_LAND + 26 ? (
        <div style={{ position: 'absolute', left: 960, top: 540, zIndex: 29 }}>
          <div style={shockwave(frame, PICK_LAND, '212,163,115')?.ring1} />
          <div style={shockwave(frame, PICK_LAND, '212,163,115')?.ring2} />
        </div>
      ) : null}
      {frame >= PICK_LAND && frame <= PICK_LAND + 34 ? (
        <div style={{ position: 'absolute', left: 960, top: 540, zIndex: 32 }}>
          {sparkBurst('s32-card', frame, PICK_LAND, 16, true).map((s, i) => (
            <div key={i} style={s.style} />
          ))}
        </div>
      ) : null}
      {frame >= 92 && frame <= 96 ? (
        <div style={{ position: 'absolute', left: pickScreen.x, top: pickScreen.y, zIndex: 32 }}>
          {sparkBurst('s32-back', frame, 92, 10, true).map((s, i) => (
            <div key={i} style={s.style} />
          ))}
        </div>
      ) : null}
      {frame >= 94 && frame <= 96 ? (
        <div style={{ position: 'absolute', left: 208, top: 906, zIndex: 32 }}>
          {sparkBurst('s32-num', frame, 94, 12, true).map((s, i) => (
            <div key={i} style={s.style} />
          ))}
        </div>
      ) : null}

      {/* 0–8 光标（琥珀光点 + 辉光 + 双残影）与 8 点击涟漪 */}
      {frame < 18 ? (
        [0, 0.16, 0.32].map((d, gi) => {
          const gp = Math.max(0, cursorP - d);
          const g = cursorAt(gp);
          const go = (gi === 0 ? 1 : 0.22 - gi * 0.08) * cursorFade;
          return (
            <div
              key={gi}
              style={{
                position: 'absolute',
                left: g.x - (gi === 0 ? 7 : 4),
                top: g.y - (gi === 0 ? 7 : 4),
                width: gi === 0 ? 14 : 8,
                height: gi === 0 ? 14 : 8,
                borderRadius: gi === 0 ? 7 : 4,
                background: gi === 0 ? FILM_COLORS2.data : FILM_COLORS2.gold,
                boxShadow: gi === 0 ? '0 0 18px rgba(212,163,115,0.85), 0 0 46px rgba(212,163,115,0.4)' : 'none',
                opacity: go,
                zIndex: 31,
              }}
            />
          );
        })
      ) : null}
      {ripple > 0 && ripple < 1 ? (
        <div style={{ position: 'absolute', left: impact.x - (10 + 60 * ripple) / 2, top: impact.y - (10 + 60 * ripple) / 2, width: 10 + 60 * ripple, height: 10 + 60 * ripple, borderRadius: 20, border: `1.5px solid ${FILM_COLORS2.gold}`, opacity: (1 - ripple) * 0.9, zIndex: 31 }} />
      ) : null}

      {/* 汇总落点（左下，避让字幕安全区）：146 大数字 + SHELVES · 30 × 5 */}
      <div style={{ position: 'absolute', left: 128, bottom: 96, zIndex: 24, opacity: interpolate(frame, [80, 84], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
        <div
          style={{
            fontFamily: fontFamilies.mono,
            fontSize: 76,
            fontWeight: 700,
            lineHeight: 1,
            color: FILM_COLORS2.data,
            fontVariantNumeric: 'tabular-nums',
            transform: `scale(${hero.slam})`,
            transformOrigin: 'left bottom',
            ...glowText(FILM_COLORS2.data, hero.glow),
          }}
        >
          {hero.text}
        </div>
        <div style={{ marginTop: 12, fontFamily: fontFamilies.mono, fontSize: 14, letterSpacing: '0.3em', color: FILM_COLORS2.textMuted, opacity: interpolate(frame, [86, 92], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>SHELVES · 30 × 5</div>
      </div>

      <Rail lit={lit} at={at} cursorP={railP} frame={frame} />
      <HudChrome label="wuh.site · BOOKS" readout={frame < 82 ? 'WEREAD · LOADING' : '146 SHELVES'} />
      <Grade2 id="GR2-06" />
      <Caption text="读过的书，都站在这里。" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S32;
