/* S48 · Act 7 坐忘 · 局部帧 [0,162) · 162f · 绝对 6524–6686
 *
 * V3 返工（2026-11-12 审计返工单：「游戏日改读书日」= 日历格翻转事件链）：
 * 原书桌俯拍实体场景退役，改 DeepSpace 暖黑数据流底上的线框书房 + 真实月历数据卡——
 * 日历格 = 2026 年 7 月真实月历（31 天、7/1 周三 → 18 日恰为周六，与卡头「七月某日 · 周六」相符），
 * 一格「游戏」在 76–96 翻转成「读书」（rotateY 180° 双面翻牌，日期数据 2026-07-18 随格亮出），
 * 朱红划线同步扫过旧「游戏日」大字（76–96 原窗口·本镜唯一朱红=手作签名），「读书日」
 * 暖纸白辉光 springIn 落定（96–116 原窗口）；晨光改琥珀金光、角度 5s 偏移 20°（0–150 原窗口），
 * 116 后铺满。内容主角化：被翻转的那一格即全镜焦点。
 * 编排四问：
 *  承接：首帧 = s47 交出的坐忘歌整页余韵（晨光先渗 0–20，线框书房承「读书」语境）；
 *  触发：光标演员入画点击日历上标红的那一格（62–76 移动 + 76 ripple）→ 该格受命翻转（主动作）；
 *  展开：帧级节奏表（见下）——月历格 staggerLand accel 翻入（28–64）→ 光标点击 → 单格双面翻转
 *        （76–96，与朱红划线同窗）→ 「读书日」辉光落定（96–116）→ 晨光铺满（116+）；
 *  交接：尾帧晨光铺满、日历格改写完成（endFrameDesc 契约原样，交 s49 书页合拢）。
 * 逐拍帧表（fps=30）：
 *  [0–20]   晨光先渗（0–150 角度偏移窗口起点）；
 *  [20–76]  线框书房浮现（deskIn 原窗口）：摊开的书（左）+ 日历数据卡（右，springIn 位移）；
 *  [28–64]  35 格月历 staggerLand(35,28,36,accel) 翻入（rotateY 翻牌入场，日期 1–31）；
 *  [62–76]  光标演员自 (1700,960) 移至 18 日格（1536,612），76 点击 ripple；
 *  [76–96]  18 日格 rotateY 180° 翻转：游戏 → 读书（日期 2026-07-18 · 周六亮出）；
 *           同窗朱红划线扫过旧「游戏日」大字（本镜唯一朱红）；
 *  [96–116] 「读书日」大字 springIn 辉光落定（原窗口）；光标退场（84–96）；
 *  [116–162] 晨光铺满 + 18 日格金边呼吸 + handheld 微动不断。
 * 时间轴零改动：162f / Caption「清晨，他随口念起两句，临时把游戏日改成了读书日。」appearAt 32 原样 /
 * 划线 76–96 / 改写 96–116 / 铺满 116+ 原窗口；无 <Sequence>；random(seed) only；fps 取 useVideoConfig。
 * 转场：入「墨洇」（20f，晕心=纸页边缘晨光），出「墨洇」（下一镜 inbound）。
 * 字幕安全窗：start≥32；镜内文字最低点 y≈760 < 930 安全线。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';
import { FILM_COLORS2, glowText, handheld, inkCursor, springIn, staggerLand } from '../motion-tokens';

const TOTAL = 162;
const FLIP_START = 76; // 与朱红划线同窗（76–96 原窗口）
const FLIP_END = 96;
const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
/* 2026 年 7 月真实月历：1 日周三（周一首列 → 首格偏移 3），31 天；18 日周六 = 被翻转格 */
const DAYS = 31;
const LEAD_BLANK = 3;
const GRID_COLS = 7;
const GRID_ROWS = 5;
const MARKED_FLAT = LEAD_BLANK + (18 - 1); // 20 → col 6 / row 2
const MARKED_DAY = 18;
const CELL_LANDS = staggerLand(GRID_COLS * GRID_ROWS, 28, 36, 'accel');
/* 日历卡几何（卡 right 300 / top 260 / 420×500；格 left 40 / top 240 / pitch 46 / cell 40） */
const CARD_LEFT = 1920 - 300 - 420; // 1200
const GRID_LEFT_IN = 40;
const GRID_TOP_IN = 240;
const PITCH = 46;
const CELL = 40;
const MARKED_CX = CARD_LEFT + GRID_LEFT_IN + (MARKED_FLAT % GRID_COLS) * PITCH + CELL / 2; // 1536
const MARKED_CY = 260 + GRID_TOP_IN + Math.floor(MARKED_FLAT / GRID_COLS) * PITCH + CELL / 2; // 612

const S48: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // 线框书房浮现（20–76 原窗口）
  const deskIn = interpolate(frame, [20, 76], [0, 1], { ...CLAMP, easing: CURVES.cineEaseInOut });
  // 卡片 springIn（位移入场）
  const cardIn = springIn(frame, 22, fps, 16, 180, 0.9);
  // 晨光角度偏移（5s=150f 内偏移 20°，原窗口）
  const sunAngle = interpolate(frame, [0, 150], [-18, 2], { ...CLAMP, easing: CURVES.cineEaseInOut });
  // 被翻转格（76–96 rotateY 180°）
  const flipP = interpolate(frame, [FLIP_START, FLIP_END], [0, 1], { ...CLAMP, easing: CURVES.cineEaseInOut });
  // 「读书日」大字 springIn 落定（96–116 原窗口）
  const readIn = springIn(frame, 96, fps, 15, 180, 0.85);
  // 光标演员：62–76 移至 18 日格，76 点击，84–96 退场
  const cursor = inkCursor(frame, { x: 1700, y: 960 }, { x: MARKED_CX, y: MARKED_CY }, 62, 14, FLIP_START);
  const dotOpacity = typeof cursor.dot.opacity === 'number' ? cursor.dot.opacity : 1;
  const cursorFade = interpolate(frame, [84, 96], [1, 0], CLAMP);
  const shake = handheld('s48-cam', frame, 0.5);
  const cam = {
    scale: interpolate(frame, [0, TOTAL], [1.1, 1.04], { ...CLAMP, easing: CURVES.cineEaseInOut }),
    x: shake.dx,
    y: interpolate(frame, [0, TOTAL], [30, 0], CLAMP) + shake.dy,
    rot: shake.rot,
  };

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DeepSpace seed="s48v2" stars={50} grid horizon />

          {/* 线框书房（20–76 浮现）：摊开的书（左）+ 日历数据卡（右） */}
          <div style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, opacity: deskIn }}>
            {/* 摊开的书（线框双页 + 行线） */}
            <div style={{ position: 'absolute', left: 260, top: 300, width: 700, height: 420, transform: 'rotate(-2.4deg)' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, width: 344, height: 420, borderRadius: '8px 2px 2px 8px', background: FILM_COLORS2.panel, border: `1px solid ${FILM_COLORS2.line}` }} />
              <div style={{ position: 'absolute', right: 0, top: 0, width: 344, height: 420, borderRadius: '2px 8px 8px 2px', background: 'rgba(23,20,16,0.5)', border: `1px solid ${FILM_COLORS2.line}` }} />
              <div style={{ position: 'absolute', left: 344, top: 0, width: 12, height: 420, background: FILM_COLORS2.dataDim, opacity: 0.35 }} />
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} style={{ position: 'absolute', left: 30, top: 50 + i * 58, width: 280 - (i % 2) * 40, height: 10, background: FILM_COLORS2.dataDim, opacity: 0.28 }} />
              ))}
            </div>

            {/* 日历数据卡（辉光小窗）：35 格月历 → 18 日格翻转（游戏 → 读书） */}
            <div
              style={{
                position: 'absolute',
                right: 300,
                top: 260,
                width: 420,
                height: 500,
                transform: `rotate(1.4deg) translateY(${(1 - cardIn) * 30}px) scale(${0.94 + cardIn * 0.06})`,
                opacity: Math.min(1, cardIn * 1.4),
                zIndex: 28,
              }}
            >
              <div style={{ position: 'absolute', inset: 0, borderRadius: 8, background: FILM_COLORS2.panel, border: `1px solid ${FILM_COLORS2.dataDim}`, boxShadow: `0 0 34px rgba(212,163,115,0.18), 0 18px 50px rgba(0,0,0,0.6)` }} />
              <div style={{ position: 'absolute', left: 40, top: 36, fontFamily: fontFamilies.mono, fontSize: 26, color: FILM_COLORS2.textMuted, letterSpacing: '0.08em' }}>七月某日 · 周六</div>
              <div style={{ position: 'absolute', left: 40, top: 92 }}>
                <span style={{ fontFamily: fontFamilies.serif, fontSize: 46, color: FILM_COLORS2.textMuted, opacity: 0.6, position: 'relative' }}>
                  游戏日
                  {/* 朱红划掉一笔（76–96）·本镜唯一朱红 */}
                  <span style={{ position: 'absolute', left: -6, top: '52%', width: interpolate(frame, [76, 96], [0, 170], CLAMP), height: 5, background: FILM_COLORS2.sealRed, transform: 'rotate(-4deg)', borderRadius: 2, boxShadow: `0 0 10px rgba(122,31,22,0.4)` }} />
                </span>
              </div>
              {/* 改写「读书日」（96–116 springIn，暖纸白辉光落定，落位被划掉词的下一行） */}
              <div style={{ position: 'absolute', left: 40, top: 164, opacity: Math.min(1, readIn * 1.4), transform: `translateY(${(1 - readIn) * 16}px)` }}>
                <span style={{ fontFamily: fontFamilies.serif, fontSize: 46, color: FILM_COLORS2.paperWhite, ...glowText(FILM_COLORS2.data, 0.38) }}>读书日</span>
              </div>

              {/* 月历格（28–64 staggerLand accel 翻入；日期数据 = 2026-07 真实月历） */}
              <div style={{ position: 'absolute', left: GRID_LEFT_IN, top: GRID_TOP_IN, perspective: 800 }}>
                {Array.from({ length: GRID_COLS * GRID_ROWS }).map((_v, i) => {
                  const day = i >= LEAD_BLANK && i < LEAD_BLANK + DAYS ? i - LEAD_BLANK + 1 : null;
                  const marked = i === MARKED_FLAT;
                  const p = springIn(frame, CELL_LANDS[i], fps, 16, 210, 0.9);
                  if (marked) {
                    /* 被翻转格：双面翻牌（76–96 rotateY 180°，日期 2026-07-18 · 周六） */
                    return (
                      <div key={i} style={{ position: 'absolute', left: (i % GRID_COLS) * PITCH, top: Math.floor(i / GRID_COLS) * PITCH, width: CELL, height: CELL, opacity: Math.min(1, p * 1.4), transform: `rotateY(${(1 - p) * -70}deg)` }}>
                        <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `rotateY(${flipP * 180}deg)` }}>
                          {/* 正面：游戏 */}
                          <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', borderRadius: 5, background: 'rgba(212,163,115,0.08)', border: `1px solid ${FILM_COLORS2.line}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontFamily: fontFamilies.mono, fontSize: 13, color: FILM_COLORS2.textMuted, fontVariantNumeric: 'tabular-nums' }}>{MARKED_DAY}</span>
                            <span style={{ fontFamily: fontFamilies.serif, fontSize: 15, color: FILM_COLORS2.textMuted, opacity: 0.8 }}>游戏</span>
                          </div>
                          {/* 背面：读书（金边辉光 + 日期数据） */}
                          <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', borderRadius: 5, background: 'rgba(212,163,115,0.14)', border: `1px solid ${FILM_COLORS2.gold}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 ${12 + 6 * Math.sin(frame / 8)}px rgba(233,217,174,0.4)` }}>
                            <span style={{ fontFamily: fontFamilies.mono, fontSize: 13, color: FILM_COLORS2.gold, fontVariantNumeric: 'tabular-nums' }}>{MARKED_DAY}</span>
                            <span style={{ fontFamily: fontFamilies.serif, fontSize: 15, color: FILM_COLORS2.paperWhite, ...glowText(FILM_COLORS2.paperWhite, 0.3) }}>读书</span>
                          </div>
                        </div>
                        <div style={{ position: 'absolute', left: 0, right: 0, bottom: -18, textAlign: 'center', fontFamily: fontFamilies.mono, fontSize: 10, letterSpacing: '0.08em', color: FILM_COLORS2.textMuted, opacity: flipP * 0.85, fontVariantNumeric: 'tabular-nums' }}>2026-07-18</div>
                      </div>
                    );
                  }
                  return (
                    <div
                      key={i}
                      style={{
                        position: 'absolute',
                        left: (i % GRID_COLS) * PITCH,
                        top: Math.floor(i / GRID_COLS) * PITCH,
                        width: CELL,
                        height: CELL,
                        borderRadius: 5,
                        border: `1px solid ${FILM_COLORS2.grid}`,
                        background: 'rgba(23,20,16,0.35)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: Math.min(1, p * 1.4),
                        transform: `rotateY(${(1 - p) * -70}deg)`,
                      }}
                    >
                      {day !== null ? (
                        <span style={{ fontFamily: fontFamilies.mono, fontSize: 13, color: FILM_COLORS2.textMuted, opacity: 0.55, fontVariantNumeric: 'tabular-nums' }}>{day}</span>
                      ) : null}
                    </div>
                  );
                })}
              </div>
              {/* 脚注行 */}
              <div style={{ position: 'absolute', left: 40, top: 480, width: 240, height: 4, background: FILM_COLORS2.dataDim, opacity: 0.3 }} />
            </div>
          </div>

          {/* 晨光（琥珀金光，角度随时间偏移 20°，116 后铺满） */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(${115 + sunAngle}deg, rgba(233,217,174,0.5) 0%, rgba(212,163,115,0.14) 34%, transparent 55%)`,
              opacity: interpolate(frame, [0, 60, 116, TOTAL], [0.25, 0.4, 0.55, 0.65], CLAMP),
              pointerEvents: 'none',
            }}
          />

          {/* 光标演员（62–96）：点击 18 日格触发翻转 */}
          <div style={{ ...cursor.dot, opacity: dotOpacity * cursorFade, zIndex: 33 }} />
          {frame >= FLIP_START && cursor.ripple < 1 ? (
            <div
              style={{
                position: 'absolute',
                left: MARKED_CX - (10 + cursor.ripple * 46),
                top: MARKED_CY - (10 + cursor.ripple * 46),
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
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 300, backgroundImage: `linear-gradient(180deg, transparent, ${FILM_COLORS2.spaceDeep})`, opacity: 0.2 }} />
      <HudChrome label="wuh.site · DIARY" readout={frame >= FLIP_END ? '读书日 · 2026-07-18 · 周六' : '游戏日 → 读书日'} />
      <Grade2 id="GR2-07" />
      <Caption text="清晨，他随口念起两句，临时把游戏日改成了读书日。" appearAt={32} />
    </AbsoluteFill>
  );
};

export default S48;
