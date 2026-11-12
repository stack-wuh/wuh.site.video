/* S36 · Act 6 入院 · 局部帧 [0,96) · 96f · 绝对 5172–5268
 *
 * V3 内容本体化重写（2026-11-11 §3 追加令「直接读数据」；用户判词：流量/访问数据此前没表现
 * 出来——本镜即全片流量主场，数据直读）：p-heatmap-crop 截图一切引用删除，主角 =
 * heatCells() 真实数据渲染的 365 格全屏数据盘 + bigNum 0→13,603。逐拍事件链（局部帧，fps=30）：
 * [0–8]     光标演员自右下 8f 疾扫至数据盘原点并点击（inkCursor ripple@8，点燃全盘）；
 *           365 格极暗线框态（1px line·半透明 → 12%）按列 staggerLand(73,0,8,accel) 波次 springIn 显影；
 * [8–58]    热力波次点亮：heatWave(frame,8,col,row,0.5) 对角波次 + heatDeepen(frame,activity,8,88)
 *           暖琥珀语义渐深（零活动格极淡 textMuted 灰）；bigNum(frame,8,50,0,13603) 中上滚动
 *           （8+50=58=绝对 5230=ANCHORS.heatRoll=拍262 对音，落定帧绝不移动）；
 * [58]      落定瞬间：shockwave('212,163,115') 双环 + sparkBurst 金粒锚在大数字视觉中心 (960,284)
 *           + sheenSweep 金光扫过数字（58–72）；HUD readout COUNTING… → 13,603 / 365 DAYS · 167 ACTIVE；
 * [58–88]   峰值格圈住：activity==1263（兜底=2026-07 最大者）格上金色圆环 springIn(60) 咬合 +
 *           scale 1→1.5→1 呼吸（border gold 2.5px + 辉光）；引线折线 pathDraw(66,14) 画出；
 *           数据卡 PEAK · 2026-07-24 · 1,263（mono 15 + serif 22 paperWhite）springIn(76) 弹入；
 * [88–96]   热力全深收尾：heatDeepen 窗口推满 p→1 全盘最深，峰值环保持呼吸——尾帧契约
 *           （manifest endFrameDesc：峰值格被圈住、热力图全深，交 s37 足迹同框）。
 * 365 格口径：heatCells() 实返 284 格（月窗 2025-12→2026-11，materials v3 §2.2）；记录窗
 * 2025-11-09→2026-11-08 恰 365 日——未记录月确定性补零（2025-11 22 日 / 2026-01 31 日 /
 * 2026-02 28 日，activity=0）成 365 格，73×5 排满全屏（pitch 26=格 22+间隙 4，1898×130 @ (11,560)）。
 * heatDeepen 深度权重以 DATA.peakActivity 封顶：七月随机抖动超 1,263 的格与口径峰同深，视觉自洽。
 * 时间轴零改动：96f / bigNum 落定局部 58（=对音）/ Caption（三百六十五天，逐格真实。appearAt 14）/
 * 尾帧语义原样；零图片（无 Img/staticFile，§3）；色板只用 FILM_COLORS2；random(seed) only；
 * springIn fps 取 useVideoConfig；镜内无 <Sequence>。转场：入「切」，出「切」。字幕安全窗：start≥12、end≤84。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import {
  bigNum,
  DATA,
  FILM_COLORS2,
  fmtNum,
  glowText,
  handheld,
  heatCells,
  heatDeepen,
  heatWave,
  inkCursor,
  pathDraw,
  sheenSweep,
  shockwave,
  sparkBurst,
  springIn,
  staggerLand,
  writeFade,
} from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 96;
/* 对音锚点：bigNum 8+50=58 = 绝对 5230 = ANCHORS.heatRoll（拍262）——窗口不动 */
const ROLL_START = 8;
const ROLL_DUR = 50;
const LAND_AT = ROLL_START + ROLL_DUR; // 58
/* 数据盘几何：365 格 = 73×5，pitch 26（格 22 + 间隙 4），排满 1920 安全区 */
const COLS = 73;
const CELL = 22;
const PITCH = 26;
const GRID_LEFT = (1920 - COLS * PITCH) / 2; // 11
const GRID_TOP = 560;
const DEEP_START = 8;
const DEEP_FULL = 88;

type HeatCell = { day: number; activity: number; month: string };

/* 365 格数据盘：heatCells() 真实 284 格（2025-12→2026-11）+ 未记录月确定性补零
 * （2025-11 起窗 22 日 / 2026-01 31 日 / 2026-02 28 日），日历序排满 73×5。 */
const REAL_CELLS = heatCells();
const SPLIT_AT = REAL_CELLS.findIndex((c) => c.month === '2026-03'); // 2025-12 共 31 格
const zeroCells = (month: string, days: number, day0: number): HeatCell[] =>
  Array.from({ length: days }, (_, i) => ({ day: day0 + i, activity: 0, month }));
const DISC: HeatCell[] = [
  ...zeroCells('2025-11', 22, 0),
  ...REAL_CELLS.slice(0, SPLIT_AT).map((c, i) => ({ ...c, day: 22 + i })),
  ...zeroCells('2026-01', 31, 22 + SPLIT_AT),
  ...zeroCells('2026-02', 28, 22 + SPLIT_AT + 31),
  ...REAL_CELLS.slice(SPLIT_AT).map((c, i) => ({ ...c, day: 22 + SPLIT_AT + 59 + i })),
]; // 22+31+31+28+253 = 365
/* 峰值格定位：口径格 activity==1263 优先，兜底 2026-07 最大者（§6.10 数据口径写死） */
const PEAK_IDX = (() => {
  const exact = DISC.findIndex((c) => c.activity === DATA.peakActivity);
  if (exact >= 0) return exact;
  let best = -1;
  DISC.forEach((c, i) => {
    if (c.month === '2026-07' && (best < 0 || c.activity > DISC[best].activity)) best = i;
  });
  return best;
})();
/* 线框显影列波次（accel 前疏后密，0–8f） */
const SKEL_LANDS = staggerLand(COLS, 0, 8, 'accel');
const CURSOR_TO = { x: GRID_LEFT + CELL / 2, y: GRID_TOP + CELL / 2 }; // 数据盘原点 (22,571)

const S36: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  /* 主角大数字（8–58 滚动，落定=拍262 对音） */
  const hero = bigNum(frame, ROLL_START, ROLL_DUR, 0, DATA.activity);
  /* 落定瞬间（58）：琥珀双环 + 金粒 */
  const wave = shockwave(frame, LAND_AT, '212,163,115');
  const burst = sparkBurst('s36-slam', frame, LAND_AT, 16, true);
  /* 光标演员：0–8 疾扫至数据盘原点，8 点击 ripple，14–22 退场 */
  const cursor = inkCursor(frame, { x: 1700, y: 980 }, CURSOR_TO, 0, 8, 8);
  const dotOpacity = typeof cursor.dot.opacity === 'number' ? cursor.dot.opacity : 1;
  const cursorFade = interpolate(frame, [14, 22], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  /* CameraRig：scale 1.04→1.0 缓拉 + handheld('s36-cam') 手持颤动 */
  const shake = handheld('s36-cam', frame, 1.0);
  const cam = {
    scale: interpolate(frame, [0, TOTAL], [1.04, 1.0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    x: shake.dx,
    y: shake.dy,
    rot: shake.rot,
  };
  /* 峰值格几何（col 46 / row 3 → 中心 (1218,649)） */
  const peakCol = PEAK_IDX % COLS;
  const peakRow = Math.floor(PEAK_IDX / COLS);
  const peakX = GRID_LEFT + peakCol * PITCH + CELL / 2;
  const peakY = GRID_TOP + peakRow * PITCH + CELL / 2;
  /* 金环：60 咬合（1.9→1 spring）+ 1→1.5→1 呼吸 */
  const ringIn = springIn(frame, 60, fps, 14, 200, 0.9);
  const breath = 1 + 0.5 * Math.abs(Math.sin((frame - 60) / 9));
  const ringScale = (1.9 - 0.9 * ringIn) * breath;
  /* 引线折线（66–80 画出）：环缘 → 卡底左角下方竖入 */
  const cardL = peakX + 60;
  const cardT = 470;
  const cardH = 66;
  const leaderD = `M ${peakX + 16} ${peakY - 16} L ${cardL} ${cardT + cardH + 52} L ${cardL} ${cardT + cardH + 2}`;
  const leader = pathDraw(frame, 66, 14, leaderD);
  /* 数据卡弹入（76–82） */
  const cardIn = springIn(frame, 76, fps, 15, 190, 0.8);

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s36v2" stars={52} grid horizon />
      <CameraRig cam={cam}>
        <AbsoluteFill>
          {/* 365 格全屏数据盘：线框骨架（列波次 springIn）+ heatWave 点亮 + heatDeepen 渐深 */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 28 }}>
            {DISC.map((c, i) => {
              const col = i % COLS;
              const row = Math.floor(i / COLS);
              const skel = springIn(frame, SKEL_LANDS[col], fps, 17, 230, 0.9);
              const hw = heatWave(frame, ROLL_START, col, row, 0.5);
              const deep = heatDeepen(frame, c.activity, DEEP_START, DEEP_FULL);
              return (
                <div key={i} style={{ position: 'absolute', left: GRID_LEFT + col * PITCH, top: GRID_TOP + row * PITCH, width: CELL, height: CELL }}>
                  <div style={{ position: 'absolute', inset: 0, borderRadius: 3, border: `1px solid ${FILM_COLORS2.line}`, opacity: skel * 0.5 }} />
                  <div style={{ position: 'absolute', inset: 0, borderRadius: 3, background: deep.background, opacity: deep.opacity * Number(hw.opacity ?? 1), transform: hw.transform }} />
                </div>
              );
            })}
          </div>

          {/* 主角：全屏大数字 0→13,603（8–58 滚动；58 落定 SLAM 辉光 + 58–72 金光扫过） */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 148, textAlign: 'center', zIndex: 30, ...writeFade(frame, 2) }}>
            <span style={{ fontFamily: fontFamilies.mono, fontSize: 16, letterSpacing: '0.4em', color: FILM_COLORS2.textMuted }}>{`TOTAL ACTIVITY · ${DATA.heatDays} DAYS`}</span>
          </div>
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 190,
              textAlign: 'center',
              zIndex: 30,
              fontFamily: fontFamilies.mono,
              fontSize: 180,
              fontWeight: 700,
              lineHeight: 1.05,
              color: FILM_COLORS2.data,
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '0.02em',
              opacity: interpolate(frame, [ROLL_START, ROLL_START + 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
              transform: `scale(${hero.slam})`,
              ...glowText(FILM_COLORS2.data, hero.glow),
            }}
          >
            {hero.text}
            <div style={sheenSweep(frame, LAND_AT, 14)} />
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 404, textAlign: 'center', zIndex: 30, opacity: 0.9, ...writeFade(frame, 48) }}>
            <span style={{ fontFamily: fontFamilies.mono, fontSize: 15, letterSpacing: '0.14em', color: FILM_COLORS2.textMuted }}>{`累计活动 · ${DATA.heatDays} 天 · ${DATA.activeDays} 天有活动`}</span>
          </div>

          {/* 落定瞬间（58）：双环 + 金粒锚在大数字视觉中心（top 190+94≈284，水平居中） */}
          {frame >= LAND_AT ? (
            <div style={{ position: 'absolute', left: '50%', top: 284, width: 0, height: 0, zIndex: 31, pointerEvents: 'none' }}>
              {wave ? <div style={wave.ring1} /> : null}
              {wave ? <div style={wave.ring2} /> : null}
              {burst.map((p, i) => (
                <div key={i} style={p.style} />
              ))}
            </div>
          ) : null}

          {/* 峰值格圈住（58–88）：金环咬合 + 呼吸 + 引线折线 + 数据卡（尾帧契约保持到 96） */}
          {PEAK_IDX >= 0 ? (
            <div
              style={{
                position: 'absolute',
                left: peakX - 27,
                top: peakY - 27,
                width: 54,
                height: 54,
                borderRadius: 27,
                border: `2.5px solid ${FILM_COLORS2.gold}`,
                opacity: Math.min(1, ringIn * 1.6),
                transform: `scale(${ringScale})`,
                boxShadow: '0 0 18px rgba(233,217,174,0.45), inset 0 0 10px rgba(233,217,174,0.2)',
                zIndex: 31,
              }}
            />
          ) : null}
          {PEAK_IDX >= 0 && frame >= 66 ? (
            <svg style={{ position: 'absolute', inset: 0, zIndex: 31, pointerEvents: 'none' }} width={1920} height={1080} viewBox="0 0 1920 1080">
              <path d={leaderD} fill="none" stroke={FILM_COLORS2.gold} strokeWidth={1.5} strokeLinecap="round" opacity={0.9} strokeDasharray={leader.strokeDasharray} strokeDashoffset={leader.strokeDashoffset} />
              <circle cx={peakX + 16} cy={peakY - 16} r={2.5} fill={FILM_COLORS2.gold} opacity={interpolate(frame, [66, 72], [0, 0.9], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} />
            </svg>
          ) : null}
          {PEAK_IDX >= 0 ? (
            <div
              style={{
                position: 'absolute',
                left: cardL,
                top: cardT,
                zIndex: 31,
                padding: '10px 16px',
                borderRadius: 8,
                background: FILM_COLORS2.panel,
                border: `1px solid ${FILM_COLORS2.line}`,
                opacity: Math.min(1, cardIn * 1.5),
                transform: `translateY(${(1 - cardIn) * 18}px) scale(${0.92 + cardIn * 0.08})`,
                boxShadow: '0 0 24px rgba(212,163,115,0.18)',
              }}
            >
              <div style={{ fontFamily: fontFamilies.mono, fontSize: 15, letterSpacing: '0.18em', color: FILM_COLORS2.data, whiteSpace: 'nowrap' }}>{`PEAK · ${DATA.peakDay}`}</div>
              <div style={{ marginTop: 4, fontFamily: fontFamilies.serif, fontSize: 22, lineHeight: 1.1, color: FILM_COLORS2.paperWhite, fontVariantNumeric: 'tabular-nums', ...glowText(FILM_COLORS2.paperWhite, 0.3) }}>{fmtNum(DATA.peakActivity)}</div>
            </div>
          ) : null}

          {/* 光标演员（0–22）：疾扫 + 点击 ripple 点燃全盘 */}
          <div style={{ ...cursor.dot, opacity: dotOpacity * cursorFade, zIndex: 33 }} />
          {frame >= 8 && cursor.ripple < 1 ? (
            <div
              style={{
                position: 'absolute',
                left: CURSOR_TO.x - (10 + cursor.ripple * 46),
                top: CURSOR_TO.y - (10 + cursor.ripple * 46),
                width: 20 + cursor.ripple * 92,
                height: 20 + cursor.ripple * 92,
                borderRadius: '50%',
                border: `2px solid ${FILM_COLORS2.data}`,
                opacity: (1 - cursor.ripple) * 0.7,
                zIndex: 33,
              }}
            />
          ) : null}
        </AbsoluteFill>
      </CameraRig>

      <HudChrome label="wuh.site · ACTIVITY" readout={frame >= LAND_AT ? `${fmtNum(DATA.activity)} / ${DATA.heatDays} DAYS · ${DATA.activeDays} ACTIVE` : 'COUNTING…'} />
      <Grade2 id="GR2-06" />
      <Caption text="三百六十五天，逐格真实。" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S36;
