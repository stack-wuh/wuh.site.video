/* S03 · Act 1 墨点 · 局部帧 [0,210) · 210f · 绝对 288–498
 *
 * 30 天倒计时 → 第一代个人站：
 *   ① 承接翻面成 2020-04 日历页（0–12 pageFlip 残影，镜首从上镜双日期冻帧交接）；
 *   ② ★DAT-02 NUM-ODOMETER flip「30→0」（局部 40–112：前 54f 走 24 页 30→6、
 *      后 18f 走 6 页 6→0，「0」定格 112=绝对 400=拍20 对音；衬线大字 rotateX 翻牌）；
 *   ③ 旧站线框淡入（112–128），Node / Express / MongoDB / Nginx 四块铅字基石
 *      坠入（128/142/156/170，ease-out 回弹 ≤6%，落定 +6f），区域点亮；
 *   ④ GR-04 整页暖光亮成首屏（190–210 曝光缓升）。
 * 转场：入「纸翻」（18f，镜首遮罩内起步），出「切」。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { blockDrop, counterFlip, FILM_COLORS } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const TOTAL = 210;
const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const CORNERSTONES = [
  { name: 'Node', delay: 128, x: 250 },
  { name: 'Express', delay: 142, x: 640 },
  { name: 'MongoDB', delay: 156, x: 1030 },
  { name: 'Nginx', delay: 170, x: 1420 },
];

const S03: FC = () => {
  const frame = useCurrentFrame();
  // ★DAT-02 翻牌：前 54f 30→6（24 页），后 18f 6→0（6 页），「0」定格 112
  const stageOne = counterFlip(frame, 40, 54, 30, 6);
  const stageTwo = counterFlip(frame, 94, 18, 6, 0);
  const value = frame >= 94 ? stageTwo.value : stageOne.value;
  const flip = frame >= 94 ? stageTwo.flip : (stageOne.flip + stageTwo.flip) / 2;
  const calendarP = interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const wire = interpolate(frame, [112, 128], [0.05, 0.16], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const warmLight = interpolate(frame, [190, TOTAL], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cam = {
    scale: interpolate(frame, [0, TOTAL], [1.03, 1.055], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    x: 0,
    y: 0,
    rot: 0,
  };

  return (
    <AbsoluteFill style={{ background: colors.paper }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DustField act={1} count={40} seedBase="s03" />
          <div style={{ position: 'absolute', left: 60, top: 60, right: 60, bottom: 60, opacity: calendarP }}>
            {/* 旧站线框：112 起淡入（FN-01） */}
            <div style={{ position: 'absolute', left: 60, top: 56, width: 1680, height: 30, border: `1px solid ${colors.muted}`, opacity: wire }} />
            <div style={{ position: 'absolute', right: 70, top: 620, width: 300, height: 200, border: `1px solid ${colors.muted}`, opacity: wire * 0.75 }} />
            {/* 年月 */}
            <div style={{ position: 'absolute', left: 80, top: 70, display: 'flex', alignItems: 'baseline', gap: 18 }}>
              <span style={{ fontFamily: fontFamilies.serif, fontSize: 92, color: colors.ink, fontVariantNumeric: 'tabular-nums' }}>2020</span>
              <span style={{ fontFamily: fontFamilies.serif, fontSize: 92, color: colors.muted }}>·</span>
              <span style={{ fontFamily: fontFamilies.serif, fontSize: 92, color: colors.ink, fontVariantNumeric: 'tabular-nums' }}>04</span>
            </div>
            {/* 日历网格 */}
            <div style={{ position: 'absolute', left: 445, top: 230, width: 910, height: 420 }}>
              {WEEKDAYS.map((w, i) => (
                <span
                  key={i}
                  style={{ position: 'absolute', left: i * 130, top: 0, width: 130, textAlign: 'center', fontFamily: fontFamilies.mono, fontSize: 18, color: colors.muted, opacity: 0.7 }}
                >
                  {w}
                </span>
              ))}
              {Array.from({ length: 35 }).map((_, i) => {
                const day = i - 2;
                return day >= 1 && day <= 30 ? (
                  <span
                    key={i}
                    style={{
                      position: 'absolute',
                      left: (i % 7) * 130,
                      top: 44 + Math.floor(i / 7) * 74,
                      width: 130,
                      height: 60,
                      textAlign: 'center',
                      lineHeight: '60px',
                      fontFamily: fontFamilies.mono,
                      fontSize: 22,
                      color: colors.ink,
                      opacity: 0.5,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {day}
                  </span>
                ) : null;
              })}
            </div>
            {/* ★DAT-02 翻牌大字（rotateX 机械翻页） */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 640,
                textAlign: 'center',
                fontFamily: fontFamilies.serif,
                fontSize: 200,
                lineHeight: 1,
                color: colors.ink,
                fontVariantNumeric: 'tabular-nums',
                transform: `perspective(900px) rotateX(${flip}deg)`,
              }}
            >
              {value}
            </div>
            {/* 四块铅字基石（FN-11 block-drop，落定后区域微亮） */}
            {CORNERSTONES.map((c) => {
              const style = blockDrop(frame, c.delay, 30);
              const landed = frame >= c.delay + 14;
              return (
                <div key={c.name} style={{ position: 'absolute', left: c.x, top: 300, ...style }}>
                  <div
                    style={{
                      width: 260,
                      height: 88,
                      borderRadius: 4,
                      background: colors.paperDeep,
                      border: `1px solid ${colors.paperMuted}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: landed ? `0 10px 22px rgba(0,0,0,0.14)` : 'none',
                    }}
                  >
                    <span style={{ fontFamily: fontFamilies.serif, fontSize: 30, color: colors.ink, letterSpacing: '0.06em' }}>{c.name}</span>
                  </div>
                  {landed ? <div style={{ position: 'absolute', left: 0, right: 0, top: 88, height: 3, background: colors.gold, opacity: 0.35 }} /> : null}
                </div>
              );
            })}
          </div>
          {/* GR-04 整页暖光：曝光缓升成首屏（尾帧交接态：旧站首屏全亮） */}
          <AbsoluteFill style={{ background: FILM_COLORS.dawnLight, mixBlendMode: 'screen', opacity: warmLight * 0.3, pointerEvents: 'none' }} />
        </AbsoluteFill>
      </CameraRig>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 320, backgroundImage: `linear-gradient(180deg, transparent, ${colors.bg})`, opacity: 0.2 }} />
      <PaperGrain opacity={0.07} />
      <Grade id="GR-05" />
      <Caption text="2020 年 4 月，他用 30 天搭起第一代个人站。" appearAt={30} />
    </AbsoluteFill>
  );
};

export default S03;
