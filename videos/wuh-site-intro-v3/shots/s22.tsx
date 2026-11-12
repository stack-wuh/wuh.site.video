/* S22 · Act 4 留白 · 局部帧 [0,120) · 120f · 绝对 3186–3306
 *
 * 「年度浏览量 0」= 全片戏剧支点：给足停顿。审计重定义——大字 0 ZERO-HOLD（zeroHold 令牌，
 * 禁假滚：指针 0→微偏→0 阻尼摆，数字从不滚动）+ 全年日历格全灰盘对比（365 格全灰 =
 * 零流量反盘；数据源=2025 年度浏览量 0 脚本事实，非 heatCells——那是 2026 窗真数据）+ 轻冲击环。
 * 编排四问：
 *   承接 = s21 交出的微尘+刻度盘微光（首帧刻度盘自深空显出）；
 *   触发 = 指针 zeroHold 微偏回 0（「量「的缺席」动作）→ 大字「0」letterpress 压落 + 轻冲击环；
 *   展开 = 帧级节奏：0–20 刻度盘显出 → 14–54 指针阻尼摆 → 24–70 灰盘 53×7 格左→右扫入 → 74 大字 0 落定（=绝对 3260=拍163 对音）+ 轻冲击环 → 74–104 长停顿（戏剧支点）→ 104–120 微微失焦；
 *   交接 = 尾帧：「0」占满画面微微失焦（交接态：大字 0 虚焦，交 s23 残影淡出）。
 * 逐拍帧表（fps=30）：
 *   [0–20]    线框刻度盘显出（dialIn 0→1，cineEaseOut）；cam 1.03±0.01 呼吸推拉周期 60f 全镜；
 *   [14–54]   ★DAT-07 zeroHold 指针 0→4.2°→0（阻尼，禁假滚）；
 *   [24–70]   全年日历盘扫入：53 列 × 7 行 = 365 格（列进 stagger 0.85f/列，格 scale 0.6→1），全灰 rgba(138,130,114,0.10–0.16)；
 *   [40–66]   盘下标键击「2025 · 365 DAYS · VIEWS 0」（mono 13，2f/字）；
 *   [64–74]   衬线大字「0」letterpress 落定（scale 1.08→1 压印）= 74 = 绝对 3260 = 拍163 对音（絕不动）；
 *   [74]      轻冲击环 shockwave 单层纸白环 rgb(245,240,232) @ (960,460)（轻：不盖过停顿）；
 *   [74–104]  长停顿（戏剧支点：0 压住整幅呼吸微光）；
 *   [104–120] 「0」blur 0→3.5 微微失焦（交棒 s23）。
 * 时间轴零改动：120f / 指针窗 14–54 / 大字落定 74 / Caption appearAt 12 原样；转场：入「切」，出「切」。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { FILM_COLORS2, glowText, shockwave, typeCharsAt, zeroHold } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 120;
const ZERO_LAND = 74; // 绝对 3260 = 拍163 对音（絕不动）
/** 全年日历盘（365 格全灰=零流量反盘；53 列 × 7 行，格 12px + 缝 5px） */
const CAL_COLS = 53;
const CAL_ROWS = 7;
const CAL_CELL = 12;
const CAL_GAP = 5;
const CAL_LEFT = Math.round((1920 - (CAL_COLS * (CAL_CELL + CAL_GAP) - CAL_GAP)) / 2);
const CAL_TOP = 700;
const CAL_LABEL = '2025 · 365 DAYS · VIEWS 0';

const S22: FC = () => {
  const frame = useCurrentFrame();
  const cam = {
    scale: 1.03 + Math.sin((frame / 60) * Math.PI * 2) * 0.01,
    x: 0,
    y: 0,
    rot: 0,
  };
  // ★DAT-07 指针 0→微偏→0（14–54，阻尼）
  const needle = zeroHold(frame, 14, 40);
  const dialIn = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  // 全年日历盘扫入（24 起，列 stagger 0.85f/列）
  const calCell = (col: number): number =>
    interpolate(frame, [24 + col * 0.85, 32 + col * 0.85], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  // 盘下标键击（40–66）
  const typed = typeCharsAt(frame, CAL_LABEL.length, 40, 2);
  // 大字「0」letterpress 落定（74=拍163 对音）
  const zeroIn = interpolate(frame, [64, ZERO_LAND], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const zeroPress = interpolate(frame, [ZERO_LAND, ZERO_LAND + 8], [1.08, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  // 轻冲击环（74，纸白单层轻环）
  const wave = shockwave(frame, ZERO_LAND, '245,240,232');
  // 末段微微失焦
  const blurOut = interpolate(frame, [104, TOTAL], [0, 3.5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s22v2" stars={44} grid horizon />
      <CameraRig cam={cam}>
        <AbsoluteFill>
          {/* 线框刻度盘（对称构图，自深空显出） */}
          <div style={{ position: 'absolute', left: 610, top: 190, width: 700, height: 700, opacity: dialIn }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 350, border: `3px solid ${FILM_COLORS2.dataDim}`, opacity: 0.55 }} />
            <div style={{ position: 'absolute', inset: 40, borderRadius: 310, border: `1px solid ${FILM_COLORS2.grid}`, opacity: 0.5 }} />
            {/* 刻度（每 30° 一格） */}
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: 0,
                  width: 2,
                  height: 22,
                  background: FILM_COLORS2.dataDim,
                  opacity: 0.5,
                  transformOrigin: '50% 328px',
                  transform: `rotate(${i * 30}deg)`,
                }}
              />
            ))}
            {/* 指针（0→微偏→0，阻尼摆动；ZERO-HOLD 禁假滚） */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: 350,
                width: 4,
                height: 270,
                background: FILM_COLORS2.paperWhite,
                opacity: 0.85,
                transformOrigin: '50% 0%',
                transform: `translateX(-2px) rotate(${needle - 90 + 90}deg) translateY(-270px) rotate(90deg)`,
                boxShadow: `0 0 10px rgba(212,163,115,0.35)`,
              }}
            />
            <div style={{ position: 'absolute', left: '50%', top: 350, width: 16, height: 16, borderRadius: 8, background: FILM_COLORS2.data, boxShadow: `0 0 14px rgba(212,163,115,0.5)`, transform: 'translate(-8px,-8px)', opacity: 0.85 }} />
          </div>

          {/* 全年日历格全灰盘（365 格对比：一整年的空格；数据源=2025 年度浏览量 0 脚本事实） */}
          <div style={{ position: 'absolute', left: CAL_LEFT, top: CAL_TOP, width: CAL_COLS * (CAL_CELL + CAL_GAP) - CAL_GAP, height: CAL_ROWS * (CAL_CELL + CAL_GAP) - CAL_GAP }}>
            {Array.from({ length: 365 }).map((_, i) => {
              const col = Math.floor(i / CAL_ROWS);
              const row = i % CAL_ROWS;
              const p = calCell(col);
              if (p <= 0) return null;
              const g = 0.1 + random(`s22-grey-${i}`) * 0.06;
              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: col * (CAL_CELL + CAL_GAP),
                    top: row * (CAL_CELL + CAL_GAP),
                    width: CAL_CELL,
                    height: CAL_CELL,
                    borderRadius: 2.5,
                    background: `rgba(138,130,114,${g})`,
                    transform: `scale(${0.6 + p * 0.4})`,
                  }}
                />
              );
            })}
          </div>
          {/* 盘下标键击（40–66，mono 13） */}
          {typed > 0 ? (
            <div style={{ position: 'absolute', left: 0, right: 0, top: 826, textAlign: 'center' }}>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 13, letterSpacing: '0.3em', color: FILM_COLORS2.textMuted, opacity: 0.7, fontVariantNumeric: 'tabular-nums', whiteSpace: 'pre' }}>{CAL_LABEL.slice(0, typed)}</span>
            </div>
          ) : null}

          {/* 轻冲击环（74 落定瞬间，纸白轻环，不抢停顿） */}
          {wave ? (
            <div style={{ position: 'absolute', left: 960, top: 460, width: 0, height: 0, zIndex: 32 }}>
              <div style={wave.ring1} />
              <div style={wave.ring2} />
            </div>
          ) : null}

          {/* 衬线大字「0」（letterpress 落定，压住整幅；ZERO-HOLD——无滚数） */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 250,
              textAlign: 'center',
              fontFamily: fontFamilies.serif,
              fontSize: 420,
              lineHeight: 1,
              color: FILM_COLORS2.paperWhite,
              opacity: zeroIn * 0.88,
              transform: `scale(${zeroPress})`,
              ...glowText(FILM_COLORS2.paperWhite, 0.14),
              filter: `blur(${blurOut}px)`,
              zIndex: 30,
            }}
          >
            0
          </div>
        </AbsoluteFill>
      </CameraRig>
      <HudChrome label="wuh.site · VIEWS" readout="2025 · 0" />
      <Grade2 id="GR2-04" />
      <Caption text="那一年，站点的年度浏览量是 0。" appearAt={12} />
    </AbsoluteFill>
  );
};

export default S22;
