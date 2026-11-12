/* S18 · Act 3 第一行 · 局部帧 [0,108) · 108f · 绝对 2694–2802
 *
 * 逐拍事件链（局部帧，fps30）：琥珀光标入场 (1500,900)→(960,420)（0–12，FN-41 dot 语义）；
 * 金边 pathDraw 描出 BORDER_D（0–22）；印章落下 scale 1.18→1 + 落纸（22–30，SEEL_LAND=30=
 * 绝对 2724=ANCHORS.commitSeal 对音，絕不移动）；落定瞬间 30：shockwave 朱红双环（'122,31,22'）
 * + sparkBurst×16 粒子（容器同印章中心，zIndex 高于印章低于 HUD）+ paperShake 印面轻震；
 * 印面辉光脉冲 0.4→1→0.45（30–38）；七点事件链 staggerLand(7,36,50,'accel')（36–86，
 * y≈720 主线 dataDim 1px 36f 起，每点 springIn 弹入 + 6f 细环扩散，前 4 标签落定 +10f 淡入）；
 * 提交日志块（右下，纯文字数据件，无窗框无浏览器 chrome——全片禁网站截图）：头行
 * 2024-12-08 · SAME DAY（40f 淡入），+components/+husky/+changelog/+版本号 与七点落点联动
 * 逐行 springIn，尾行 ×7 COMMITS 86f 弹入 + glowText 闪一次；七点折线金色 pathDraw 画回
 * （86–104，串七点再延伸 +220px），终点 6px 金方块 104 springIn 点亮；dataCurtain 数字雨帘
 * 垫底（zIndex 内容/HUD 之下）；CameraRig 1.06→1.02 缓推 + handheld 全镜。
 * 转场：入「切」，出「切」。无字幕（画面文字=提交原文）。
 * 尾帧 107：朱印+七点+金线+提交日志块同屏（交接态：朱印+提交日志）。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import {
  FILM_COLORS2,
  dataCurtain,
  glowText,
  handheld,
  paperShake,
  pathDraw,
  shockwave,
  sparkBurst,
  springIn,
  staggerLand,
} from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const CODE_LINE = 'feat(init): 基于nextjs构建的monorepos项目';
const SEEL_LAND = 30; // 绝对 2724 对音（絕不移动）
/** 金边（rect 等价 path，rx=8 圆角；真长度由 evolvePath 计算，不再猜 2330） */
const BORDER_D = 'M 12 4 H 948 Q 956 4 956 12 V 208 Q 956 216 948 216 H 12 Q 4 216 4 208 V 12 Q 4 4 12 4 Z';
/** 印章中心（容器 left 480 + 480 / top 330 + 110） */
const SEAL_CX = 960;
const SEAL_CY = 440;
/** 七点时间轴：y≈720 主线，x 从 560 均布到 1360，金线再延伸 +220px 至终点 */
const DOT_Y = 720;
const DOT_X = Array.from({ length: 7 }, (_, i) => 560 + (i * 800) / 6);
const LINE_END = 1360 + 220;
const LINE_D = `M ${DOT_X.map((x) => `${x} ${DOT_Y}`).join(' L ')} L ${LINE_END} ${DOT_Y}`;
const GOLD_SQUARE_AT = 104; // 86 + 18：金线画完，终点金方块点亮
const LABELS = ['components', 'husky', 'changelog', '版本号'] as const;

const S18: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // CameraRig：全镜 1.06→1.02 cineEaseInOut 缓推 + handheld 手持呼吸
  const hh = handheld('s18-cam', frame, 1.2);
  const cam = {
    scale: interpolate(frame, [0, 108], [1.06, 1.02], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    x: hh.dx,
    y: hh.dy,
    rot: hh.rot,
  };
  // 光标入场（0–12，cineEaseInOut；FN-41 dot 语义：12px 圆 + 辉光；30 触发后淡出 + 点击涟漪）
  const curP = interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const curX = 1500 + (SEAL_CX - 1500) * curP;
  const curY = 900 + (420 - 900) * curP;
  const curFade = interpolate(frame, [SEEL_LAND, SEEL_LAND + 10], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const ripP = interpolate(frame - SEEL_LAND, [0, 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  // 金边描出（0–22，pathDraw）
  const border = pathDraw(frame, 0, 22, BORDER_D);
  // 印章落下（22–30，8f：scale 1.18→1 + 位移落纸）
  const drop = interpolate(frame, [22, SEEL_LAND], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn });
  const sealScale = interpolate(drop, [0, 1], [1.18, 1]);
  const sealY = interpolate(drop, [0, 1], [-46, 0]);
  // 落定瞬间（30）：paperShake 印面轻震 + 印面辉光脉冲 0.4→1→0.45（30–38）
  const shake = paperShake(frame, SEEL_LAND, 2.5, 10);
  const sealGlow = interpolate(frame, [SEEL_LAND, SEEL_LAND + 4, SEEL_LAND + 8], [0.4, 1, 0.45], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  // 落定瞬间（30）：朱红双环 + 粒子（容器锚定印章中心）
  const sw = shockwave(frame, SEEL_LAND, '122,31,22');
  const sparks = sparkBurst('s18-burst', frame, SEEL_LAND, 16);
  // 七点事件链（36–86）：accel 前疏后密，末点 86 对齐金线起笔
  const LAND = staggerLand(7, 36, 50, 'accel');
  // 时间轴主线（36f 起，dataDim 1px o0.28）
  const railO = interpolate(frame, [36, 44], [0, 0.28], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  // 七点折线画回（86–104，金色 2.4px）
  const lineDraw = pathDraw(frame, 86, 18, LINE_D);
  // 终点金方块（104 springIn 点亮）
  const endP = springIn(frame, GOLD_SQUARE_AT, fps);
  // 提交日志块：头行 40f 淡入；4 行随点逐行 springIn；尾行 86f 弹入 + glowText 闪一次
  const logHeadO = interpolate(frame, [40, 52], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const tailGlow = interpolate(frame, [86, 90, 108], [0, 1, 0.45], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  // HUD 计数联动：n = 已落定点数（最少 01）
  const commitN = Math.max(1, LAND.filter((l) => frame >= l).length);
  // 数字雨帘（背景氛围层，opacity 直接用返回的 o）
  const rain = dataCurtain('s18-rain', frame, 10, 120);

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s18v2" stars={52} grid />
      <CameraRig cam={cam}>
        <AbsoluteFill>
          {/* 数字雨帘（背景氛围，zIndex 内容/HUD 之下） */}
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 5, pointerEvents: 'none' }}>
            {rain.map((c, i) => (
              <span
                key={`rain-${i}`}
                style={{ position: 'absolute', left: `${c.x}%`, top: c.y, fontFamily: fontFamilies.mono, fontSize: 12 + random(`s18-rain-fs${i}`) * 3, color: FILM_COLORS2.data, opacity: c.o }}
              >
                {c.text}
              </span>
            ))}
          </div>

          {/* 时间轴主线（36f 起，dataDim 1px） */}
          <div style={{ position: 'absolute', left: 560, top: DOT_Y - 0.5, width: LINE_END - 560, height: 1, background: FILM_COLORS2.dataDim, opacity: railO, zIndex: 26 }} />

          {/* 七点折线画回（86–104，金色 2.4px，串七点延伸 +220px） */}
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 26 }}>
            <path d={LINE_D} fill="none" stroke={FILM_COLORS2.gold} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" opacity={0.9} style={{ ...lineDraw, filter: 'drop-shadow(0 0 6px rgba(233,217,174,0.35))' }} />
          </svg>
          {/* 终点 6px 金方块（104 springIn 点亮） */}
          <div
            style={{
              position: 'absolute',
              left: LINE_END - 3,
              top: DOT_Y - 3,
              width: 6,
              height: 6,
              background: FILM_COLORS2.gold,
              boxShadow: '0 0 10px rgba(233,217,174,0.7)',
              transform: `scale(${0.5 + endP * 0.5})`,
              opacity: Math.min(1, endP * 1.5),
              zIndex: 26,
            }}
          />

          {/* 七枚提交点（accel 落定：springIn 弹入 + 6f 细环扩散；前 4 点标签 +10f 淡入） */}
          {DOT_X.map((x, i) => {
            const land = LAND[i];
            const p = springIn(frame, land, fps);
            const t = frame - land;
            const ringP = interpolate(t, [0, 6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            return (
              <div key={`dot-${i}`}>
                <div
                  style={{
                    position: 'absolute',
                    left: x - 5,
                    top: DOT_Y - 5,
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    background: FILM_COLORS2.data,
                    boxShadow: '0 0 10px rgba(212,163,115,0.55)',
                    transform: `scale(${0.5 + p * 0.5})`,
                    opacity: Math.min(1, p * 1.5),
                    zIndex: 26,
                  }}
                />
                {t >= 0 && t < 6 ? (
                  <div
                    style={{
                      position: 'absolute',
                      left: x - 5 - ringP * 7,
                      top: DOT_Y - 5 - ringP * 7,
                      width: 10 + ringP * 14,
                      height: 10 + ringP * 14,
                      borderRadius: '50%',
                      border: `1px solid ${FILM_COLORS2.data}`,
                      opacity: 0.6 * (1 - ringP),
                      zIndex: 26,
                    }}
                  />
                ) : null}
                {i < LABELS.length ? (
                  <div
                    style={{
                      position: 'absolute',
                      left: x + 14,
                      top: DOT_Y + 12,
                      fontFamily: fontFamilies.mono,
                      fontSize: 13,
                      letterSpacing: '0.06em',
                      color: FILM_COLORS2.textMuted,
                      opacity: interpolate(frame, [land + 10, land + 18], [0, 0.85], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
                      zIndex: 26,
                    }}
                  >
                    {LABELS[i]}
                  </div>
                ) : null}
              </div>
            );
          })}

          {/* 提交日志块（右下，纯文字数据件；与七点落点联动） */}
          <div style={{ position: 'absolute', right: 140, bottom: 104, zIndex: 27, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10, fontFamily: fontFamilies.mono, pointerEvents: 'none' }}>
            <div style={{ fontSize: 12, letterSpacing: '0.18em', color: FILM_COLORS2.textMuted, opacity: logHeadO, fontVariantNumeric: 'tabular-nums' }}>2024-12-08 · SAME DAY</div>
            {LABELS.map((label, i) => {
              const p = springIn(frame, LAND[i], fps);
              return (
                <div key={`log-${label}`} style={{ fontSize: 16, transform: `translateY(${(1 - p) * 12}px)`, opacity: Math.min(1, p * 1.4) }}>
                  <span style={{ color: FILM_COLORS2.data }}>+ </span>
                  <span style={{ color: FILM_COLORS2.paperWhite }}>{label}</span>
                </div>
              );
            })}
            <div style={{ fontSize: 16, letterSpacing: '0.14em', color: FILM_COLORS2.gold, transform: `translateY(${(1 - springIn(frame, 86, fps)) * 12}px)`, opacity: Math.min(1, springIn(frame, 86, fps) * 1.4), ...(frame >= 86 ? glowText(FILM_COLORS2.gold, tailGlow, '233,217,174') : {}) }}>
              ×7 COMMITS
            </div>
          </div>

          {/* 矩形钤印（手作签名；印面=提交原文；全程清晰，无 rack focus） */}
          <div style={{ position: 'absolute', left: 480, top: 330, width: 960, height: 220, zIndex: 30, transform: `scale(${sealScale}) translateY(${sealY}px) ${shake.transform}` }}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: FILM_COLORS2.sealRed,
                opacity: 0.94,
                borderRadius: 8,
                boxShadow: `0 18px 40px rgba(0,0,0,0.45), 0 0 ${Math.round(34 + sealGlow * 26)}px rgba(122,31,22,${sealGlow})`,
              }}
            />
            {/* 金边描出（SVG path stroke，真长度驱动；CSSProperties 走 style） */}
            <svg width={960} height={220} style={{ position: 'absolute', inset: 0 }}>
              <path d={BORDER_D} fill="none" stroke={FILM_COLORS2.gold} strokeWidth={2.4} style={border} opacity={0.85} />
            </svg>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 56, textAlign: 'center', fontFamily: fontFamilies.mono, fontSize: 40, color: FILM_COLORS2.paperWhite, fontVariantNumeric: 'tabular-nums', letterSpacing: '0.02em' }}>
              {CODE_LINE}
            </div>
            <div style={{ position: 'absolute', right: 40, bottom: 28, fontFamily: fontFamilies.mono, fontSize: 20, color: FILM_COLORS2.paperWhite, opacity: 0.8, fontVariantNumeric: 'tabular-nums' }}>
              2024-12-08
            </div>
          </div>

          {/* 落定瞬间（30）：shockwave 朱红双环（锚定印章中心，zIndex 高于印章、低于 HUD） */}
          {sw ? (
            <div style={{ position: 'absolute', left: SEAL_CX, top: SEAL_CY, width: 0, height: 0, zIndex: 32 }}>
              <div style={sw.ring1} />
              <div style={sw.ring2} />
            </div>
          ) : null}
          {/* 落定瞬间（30）：sparkBurst ×16 粒子（同锚点） */}
          <div style={{ position: 'absolute', left: SEAL_CX, top: SEAL_CY, width: 0, height: 0, zIndex: 33 }}>
            {sparks.map((s, i) => (
              <div key={`spark-${i}`} style={s.style} />
            ))}
          </div>

          {/* 光标演员（0–12 入场，30 触发涟漪后淡出；FN-41 dot 语义） */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 34, pointerEvents: 'none', opacity: curFade }}>
            <div style={{ position: 'absolute', left: curX - 6, top: curY - 6, width: 12, height: 12, borderRadius: 6, background: FILM_COLORS2.data, boxShadow: '0 0 14px rgba(212,163,115,0.8)' }} />
            {ripP > 0 && ripP < 1 ? (
              <div
                style={{
                  position: 'absolute',
                  left: curX - 6 - ripP * 32,
                  top: curY - 6 - ripP * 32,
                  width: 12 + ripP * 64,
                  height: 12 + ripP * 64,
                  borderRadius: '50%',
                  border: `1.5px solid rgba(212,163,115,${0.7 * (1 - ripP)})`,
                }}
              />
            ) : null}
          </div>
        </AbsoluteFill>
      </CameraRig>
      <HudChrome label="wuh.site · PROOF" readout={`COMMIT ${String(commitN).padStart(2, '0')} / 07`} />
      <Grade2 id="GR2-03" />
    </AbsoluteFill>
  );
};

export default S18;
