/* S03 · Act 1 墨点 · 局部帧 [0,210) · 210f · 绝对 288–498
 * V2 暖黑数据流（2026-11-11 风格重构）：「纸面日历+铅字基石」改写为「年度报告倒计时数据镜」——
 * ① 承接镜首：2020·04 HUD 年月读数（0–14 显影）；
 * ② ★DAT-02 NUM-ODOMETER 翻牌主角化：「30→0」全屏大数字 rotateX 机械翻牌
 *    （局部 40–112：前 54f 走 24 页 30→6、后 18f 走 6 页 6→0，「0」定格 112=绝对 400=拍20
 *    对音不变；琥珀 mono 大字 + glowText），下方剩余天数进度条同步耗尽（数据同源不另设窗）；
 * ③ 旧站线框淡入（112–128 原窗），Node / Express / MongoDB / Nginx 四块线框基石瓦片
 *    坠入（128/142/156/170 原帧，ease-out 回弹 ≤6%，落定 +6f 暖金底线点亮）；
 * ④ 末段（190–210）琥珀辉光缓升成首屏亮度（尾帧交接态：四基石全亮 + 暖光涨满）。
 * 转场：入「纸翻」出「切」→ ShotShell 光晕呼吸，镜文件零工作。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES, writeFade } from '../../../brand/motion';
import { FILM_COLORS2, blockDrop, counterFlip, glowText } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 210;
const CORNERSTONES = [
  { name: 'Node', delay: 128, x: 250 },
  { name: 'Express', delay: 142, x: 640 },
  { name: 'MongoDB', delay: 156, x: 1030 },
  { name: 'Nginx', delay: 170, x: 1420 },
];

const S03: FC = () => {
  const frame = useCurrentFrame();
  // ★DAT-02 翻牌：前 54f 30→6（24 页），后 18f 6→0（6 页），「0」定格 112=拍20
  const stageOne = counterFlip(frame, 40, 54, 30, 6);
  const stageTwo = counterFlip(frame, 94, 18, 6, 0);
  const value = frame >= 94 ? stageTwo.value : stageOne.value;
  const flip = frame >= 94 ? stageTwo.flip : (stageOne.flip + stageTwo.flip) / 2;
  const readoutP = interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const wire = interpolate(frame, [112, 128], [0.05, 0.16], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const warmLight = interpolate(frame, [190, TOTAL], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cam = {
    scale: interpolate(frame, [0, TOTAL], [1.03, 1.055], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    x: 0,
    y: 0,
    rot: 0,
  };

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s03v2" stars={58} grid horizon />
      <CameraRig cam={cam}>
        <AbsoluteFill>
          {/* 旧站线框：112 起淡入（FN-01 原窗） */}
          <div style={{ position: 'absolute', left: 60, top: 56, width: 1680, height: 30, border: `1px solid ${FILM_COLORS2.line}`, opacity: wire }} />
          <div style={{ position: 'absolute', right: 70, top: 620, width: 300, height: 200, border: `1px solid ${FILM_COLORS2.line}`, opacity: wire * 0.75 }} />

          {/* 年月 HUD 读数（0–14 显影） */}
          <div style={{ position: 'absolute', left: 160, top: 84, opacity: readoutP }}>
            <span style={{ fontFamily: fontFamilies.mono, fontSize: 44, color: FILM_COLORS2.data, fontVariantNumeric: 'tabular-nums', ...glowText(FILM_COLORS2.data, 0.3) }}>2020 · 04</span>
            <div style={{ fontFamily: fontFamilies.mono, fontSize: 14, letterSpacing: '0.36em', color: FILM_COLORS2.textMuted, marginTop: 10 }}>FIRST PERSONAL SITE · BUILD LOG</div>
          </div>

          {/* 倒计时标签 */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 226, textAlign: 'center', ...writeFade(frame, 24) }}>
            <span style={{ fontFamily: fontFamilies.mono, fontSize: 16, letterSpacing: '0.42em', color: FILM_COLORS2.textMuted }}>30-DAY BUILD · DAYS REMAINING</span>
          </div>

          {/* ★DAT-02 翻牌大数字（rotateX 机械翻页；琥珀 mono 主角） */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 256,
              textAlign: 'center',
              fontFamily: fontFamilies.mono,
              fontSize: 330,
              fontWeight: 700,
              lineHeight: 1,
              color: FILM_COLORS2.data,
              fontVariantNumeric: 'tabular-nums',
              transform: `perspective(900px) rotateX(${flip}deg)`,
              ...glowText(FILM_COLORS2.data, 0.5),
            }}
          >
            {value}
          </div>

          {/* 剩余天数进度条（与翻牌同源耗尽） */}
          <div style={{ position: 'absolute', left: '50%', top: 636, width: 900, height: 6, marginLeft: -450, borderRadius: 3, background: 'rgba(212,163,115,0.12)' }}>
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: `${(value / 30) * 100}%`,
                borderRadius: 3,
                background: `linear-gradient(90deg, ${FILM_COLORS2.dataDim}, ${FILM_COLORS2.data})`,
                boxShadow: `0 0 12px rgba(212,163,115,0.45)`,
              }}
            />
          </div>
          <div style={{ position: 'absolute', left: '50%', top: 654, width: 900, marginLeft: -450, textAlign: 'right', ...writeFade(frame, 34) }}>
            <span style={{ fontFamily: fontFamilies.mono, fontSize: 14, letterSpacing: '0.3em', color: FILM_COLORS2.textMuted, fontVariantNumeric: 'tabular-nums' }}>{value} / 30</span>
          </div>

          {/* 四块线框基石瓦片（FN-11 block-drop 原帧；落定后暖金底线点亮） */}
          {CORNERSTONES.map((c) => {
            const style = blockDrop(frame, c.delay, 30);
            const landed = frame >= c.delay + 14;
            return (
              <div key={c.name} style={{ position: 'absolute', left: c.x, top: 700, ...style }}>
                <div
                  style={{
                    width: 260,
                    height: 88,
                    borderRadius: 6,
                    background: FILM_COLORS2.panel,
                    border: `1px solid ${landed ? FILM_COLORS2.line : FILM_COLORS2.grid}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: landed ? `0 0 20px rgba(212,163,115,0.14), 0 10px 22px rgba(0,0,0,0.4)` : 'none',
                  }}
                >
                  <span style={{ fontFamily: fontFamilies.mono, fontSize: 30, color: FILM_COLORS2.paperWhite, letterSpacing: '0.06em', opacity: landed ? 0.95 : 0.7 }}>{c.name}</span>
                </div>
                {landed ? <div style={{ position: 'absolute', left: 0, right: 0, top: 88, height: 3, background: FILM_COLORS2.gold, opacity: 0.5, boxShadow: `0 0 10px rgba(233,217,174,0.4)` }} /> : null}
              </div>
            );
          })}

          {/* 末段琥珀辉光缓升成首屏（尾帧交接态：全亮） */}
          <AbsoluteFill style={{ background: `radial-gradient(ellipse 120% 90% at 50% 42%, rgba(212,163,115,${warmLight * 0.16}), rgba(212,163,115,0) 70%)`, mixBlendMode: 'screen', opacity: warmLight, pointerEvents: 'none' }} />
        </AbsoluteFill>
      </CameraRig>
      <HudChrome label="wuh.site · BUILDER" readout={frame >= 112 ? 'SITE v1 · ONLINE' : 'BUILD · 30D'} />
      <Grade2 id="GR2-05" />
      <Caption text="2020 年 4 月，他用 30 天搭起第一代个人站。" appearAt={30} />
    </AbsoluteFill>
  );
};

export default S03;
