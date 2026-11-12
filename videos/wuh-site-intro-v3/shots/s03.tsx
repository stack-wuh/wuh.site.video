/* S03 · Act 1 墨点 · 局部帧 [0,210) · 210f · 绝对 288–498
 *
 * V3 批次 A 重做（2026-11-12 六门验收 + 审计返工单 · 特效解禁 FX 层）：
 * 【承接】首帧承接 s02 尾帧交出的「双日期纸卡+落轴余晖」——深空底延续，本镜第一枚
 *         年月读数 2020·04 显影，故事从「第一篇」推进到「第一代站」。
 * 【触发】主动作 = 30 天建站倒计时翻牌：Odometer 大数字 30→0 两段机械翻页（40–112），
 *         「0」定格 112=绝对 400=ANCHORS.countdownZero=拍20（对音，絕不动）——归零瞬间
 *         冲击波+金粒+金光横扫宣告「站成了」；随后四块技术栈基石逐块坠入地基。
 * 【展开】逐拍帧表（局部帧，fps=30）：
 *   [0–14]    年月 HUD 读数 2020·04 显影 + handheld('s03-cam',1.0) + dataCurtain('s03-rain',8 列,120)；
 *   [24/34]   倒计时标签 / 剩余天数读数 writeFade；
 *   [40–94]   翻牌第一段 30→6（24 页，counterFlip）；
 *   [94–112]  翻牌第二段 6→0（6 页），进度条同步耗尽（数据同源）；
 *   [112]     「0」定格 SLAM：shockwave('212,163,115') 双环 + sparkBurst('s03-burst',14 粒金)
 *             + sheenSweep(108–122) 金光扫过大数字 + 辉光脉冲（112→116→136 收敛）；
 *   [128/142/156/170] 四块线框基石 blockDrop 坠入（Node/Express/MongoDB/Nginx，原帧不动），
 *             各自落定 +6f 暖金底线点亮（落定即冲击形变）；
 *   [190–210] 琥珀辉光缓升成首屏亮度——尾帧交接态（四基石全亮 + 暖光涨满）。
 * 【交接】尾帧 = 旧站首屏全亮的暖光态（manifest endFrameDesc：暖光旧站首屏全亮）→ 交 s04
 *         「暗处攒碎片」的呼吸镜。
 * 意义一句话：30 天倒计时翻到 0 的那一声落定——一个人用一个月把第一代个人站立了起来。
 * 时间轴零改动：210f / 翻牌 40–54、94–18 / 「0」定格 112（对音）/ 基石 128/142/156/170 / Caption（appearAt 30）原样。
 * 转场：入「纸翻」出「切」→ ShotShell 光晕呼吸，镜文件零工作。字幕安全窗：start≥30、end≤198。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES, writeFade } from '../../../brand/motion';
import {
  FILM_COLORS2,
  blockDrop,
  counterFlip,
  dataCurtain,
  glowText,
  handheld,
  sheenSweep,
  shockwave,
  sparkBurst,
} from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 210;
const ZERO_AT = 112; // 「0」定格 = 绝对 400 = 拍20（对音，絕不动）
const CORNERSTONES = [
  { name: 'Node', delay: 128, x: 250 },
  { name: 'Express', delay: 142, x: 640 },
  { name: 'MongoDB', delay: 156, x: 1030 },
  { name: 'Nginx', delay: 170, x: 1420 },
];

const S03: FC = () => {
  const frame = useCurrentFrame();
  // ★翻牌：前 54f 30→6（24 页），后 18f 6→0（6 页），「0」定格 112=拍20
  const stageOne = counterFlip(frame, 40, 54, 30, 6);
  const stageTwo = counterFlip(frame, 94, 18, 6, 0);
  const value = frame >= 94 ? stageTwo.value : stageOne.value;
  const flip = frame >= 94 ? stageTwo.flip : (stageOne.flip + stageTwo.flip) / 2;
  // 「0」落定瞬间（112）：双环 + 金粒 + 辉光脉冲
  const wave = shockwave(frame, ZERO_AT, '212,163,115');
  const burst = sparkBurst('s03-burst', frame, ZERO_AT, 14, true);
  const zeroGlow = interpolate(frame, [ZERO_AT, ZERO_AT + 4, ZERO_AT + 24], [0.5, 1, 0.45], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const readoutP = interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const wire = interpolate(frame, [112, 128], [0.05, 0.16], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const warmLight = interpolate(frame, [190, TOTAL], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const hh = handheld('s03-cam', frame, 1.0);
  const cam = {
    scale: interpolate(frame, [0, TOTAL], [1.03, 1.055], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    x: hh.dx,
    y: hh.dy,
    rot: hh.rot,
  };
  const rain = dataCurtain('s03-rain', frame, 8, 120);

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s03v2" stars={58} grid horizon />
      <CameraRig cam={cam}>
        <AbsoluteFill>
          {/* 数字雨帘（背景氛围层） */}
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 2, pointerEvents: 'none' }}>
            {rain.map((c, i) => (
              <span
                key={`rain-${i}`}
                style={{ position: 'absolute', left: `${c.x}%`, top: c.y, fontFamily: fontFamilies.mono, fontSize: 13, color: FILM_COLORS2.data, opacity: c.o, fontVariantNumeric: 'tabular-nums' }}
              >
                {c.text}
              </span>
            ))}
          </div>

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

          {/* 翻牌大数字（rotateX 机械翻页；琥珀 mono 主角；112 落定 SLAM） */}
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
              ...glowText(FILM_COLORS2.data, frame >= ZERO_AT ? zeroGlow : 0.5),
            }}
          >
            {value}
            {frame >= ZERO_AT - 4 && frame <= ZERO_AT + 10 ? <div style={sheenSweep(frame, ZERO_AT - 4, 14)} /> : null}
          </div>

          {/* 「0」落定瞬间（112）：双环冲击 + 金粒，锚在大数字视觉中心（960, 421） */}
          {frame >= ZERO_AT ? (
            <div style={{ position: 'absolute', left: 960, top: 421, width: 0, height: 0, zIndex: 30, pointerEvents: 'none' }}>
              {wave ? <div style={wave.ring1} /> : null}
              {wave ? <div style={wave.ring2} /> : null}
              {burst.map((p, i) => (
                <div key={`burst-${i}`} style={p.style} />
              ))}
            </div>
          ) : null}

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

          {/* 四块线框基石瓦片（blockDrop 原帧；落定后暖金底线点亮） */}
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
      <HudChrome label="wuh.site · BUILDER" readout={frame >= ZERO_AT ? 'SITE v1 · ONLINE' : 'BUILD · 30D'} />
      <Grade2 id="GR2-05" />
      <Caption text="2020 年 4 月，他用 30 天搭起第一代个人站。" appearAt={30} />
    </AbsoluteFill>
  );
};

export default S03;
