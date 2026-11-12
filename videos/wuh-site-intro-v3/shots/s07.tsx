/* S07 · Act 2 旧屋 · 局部帧 [0,120) · 120f · 绝对 852–972
 *
 * V3 批次 A 重做（2026-11-12 六门验收 + 审计返工单 · §10 特效解禁）：
 * 【承接】首帧承接 s06 尾帧交出的「年份牌 + 档案面板铺开」——数据页一角线框驻留画面上部，
 *         幕已开，该亮出这一年的题眼。
 * 【触发】主动作 = 题眼金句 kineticChars 逐字弹入（s29 同款，spring 每字过冲 + 落定辉光）：
 *         『代码写诗』24 起 3f/字、『工具作画。』34 起 2.6f/字——48=绝对 900=拍45（对音，
 *         絕不动）末字落定同帧，朱红闲章「闲」落下（手作签名点 · 每镜一处）。
 * 【展开】逐拍帧表（局部帧，fps=30）：
 *   [0–23]    数据页一角线框驻留（承接 s06）+ handheld('s07-cam',1.1) + dataCurtain('s07-rain',6 列,100)；
 *   [24–38]   L1『代码写诗』kineticChars 逐字弹入（serif 92 paperWhite，step 3f/字）；
 *   [34–48]   L2『工具作画。』kineticChars 逐字弹入（serif 92 gold，step 2.6f/字，末字 48 落定=拍45）；
 *   [48]      闲章 sealStamp 落下（48 原窗）+ shockwave sealRed 双环 + sparkBurst('s07-burst',10 粒)
 *             + paperShake(2.2,9) 印面轻震 + 印面辉光脉冲（48→52→64 收敛）；
 *   [48–68]   章旁数据线框避让微移 6px（原窗）；
 *   [68–120]  朱色未干余晕呼吸（48→90 渐淡原窗）+ 极缓后拉——尾帧交接态。
 * 【交接】尾帧 = 闲章冻帧、朱色未干余晕（manifest endFrameDesc：闲章冻帧，朱色未干）→
 *         交 s08「PM2 换 Docker」服务换装。
 * 意义一句话：旧屋的座右铭逐字钉上墙——代码写诗、工具作画，闲章一落，手艺人立誓。
 * 题眼同文同层：字幕即金句本体，不另设 Caption。时间轴零改动：120f / L1 24 / L2 34 / 闲章 48（对音）/ 避让 48–68 原样。
 * 转场：入「墨洇」出「墨洇」→ ShotShell 光晕呼吸，镜文件零工作。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES, sealStamp, sealTilt } from '../../../brand/motion';
import {
  FILM_COLORS2,
  dataCurtain,
  glowText,
  handheld,
  kineticChars,
  paperShake,
  shockwave,
  sparkBurst,
} from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 120;
const SEAL_LAND = 48; // 闲章落下 = 绝对 900 = 拍45（对音，絕不动）
const SEAL_RGB = '122,31,22'; // = FILM_COLORS2.sealRed (#7A1F16) 三元组（唯一色源仍是色板）
/** 金句逐字（§10 kineticChars；L1 24 起 3f/字，L2 34 起 2.6f/字 → 末字 48 落定=拍45） */
const LINES = [
  { text: '代码写诗', start: 24, step: 3, color: FILM_COLORS2.paperWhite, rgb: '245,240,232' },
  { text: '工具作画。', start: 34, step: 2.6, color: FILM_COLORS2.gold, rgb: '233,217,174' },
];

const S07: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hh = handheld('s07-cam', frame, 1.1);
  const cam = {
    scale: interpolate(frame, [0, TOTAL], [1.14, 1.02], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    x: hh.dx,
    y: hh.dy,
    rot: hh.rot,
  };
  // 印面轻震 + 落定冲击（48）
  const shake = paperShake(frame, SEAL_LAND, 2.2, 9);
  const sw = shockwave(frame, SEAL_LAND, SEAL_RGB);
  const sparks = sparkBurst('s07-burst', frame, SEAL_LAND, 10);
  const sealGlow = interpolate(frame, [SEAL_LAND, SEAL_LAND + 4, SEAL_LAND + 16], [0.35, 0.9, 0.35], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  // 章旁元素避让（54–74：微移 6px 原窗）
  const dodge = interpolate(frame, [SEAL_LAND, 68], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const rain = dataCurtain('s07-rain', frame, 6, 100);

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s07v2" stars={40} grid />
      {/* 数字雨帘（背景氛围层） */}
      <AbsoluteFill>
        {rain.map((c, i) => (
          <span
            key={`rain-${i}`}
            style={{ position: 'absolute', left: `${c.x}%`, top: c.y, fontFamily: fontFamilies.mono, fontSize: 15, color: FILM_COLORS2.dataDim, opacity: c.o, fontVariantNumeric: 'tabular-nums' }}
          >
            {c.text}
          </span>
        ))}
      </AbsoluteFill>
      <CameraRig cam={cam}>
        <AbsoluteFill style={shake}>
          {/* 数据页一角线框（背景元素，承接镜 6 档案面板；随避让微移） */}
          <div style={{ position: 'absolute', left: 120, right: 120, top: 90 }}>
            <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: 1, background: FILM_COLORS2.line, opacity: 0.6 }} />
            <div style={{ position: 'absolute', left: 40, top: 60, width: 620, height: 16, background: FILM_COLORS2.paperWhite, opacity: 0.12, transform: `translateX(${dodge * -6}px)` }} />
            <div style={{ position: 'absolute', left: 40, top: 104, width: 520, height: 11, background: FILM_COLORS2.dataDim, opacity: 0.2, transform: `translateX(${dodge * -6}px)` }} />
            <div style={{ position: 'absolute', left: 900, top: 70, width: 300, height: 180, border: `1px solid ${FILM_COLORS2.line}`, opacity: 0.35, transform: `translateX(${dodge * 6}px)` }} />
          </div>

          {/* 金句 kineticChars 逐字弹入（s29 同款；末字 48=拍45 落定） */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 316, textAlign: 'center', zIndex: 30 }}>
            {LINES.map((line, li) => (
              <div key={`line-${li}`} style={{ marginTop: li === 0 ? 0 : 26 }}>
                {kineticChars(line.text, frame, line.start, line.step, fps, 0.55).map((k, ci) => (
                  <span
                    key={`ch-${ci}`}
                    style={{
                      ...k.style,
                      fontFamily: fontFamilies.serif,
                      fontSize: 92,
                      letterSpacing: '0.14em',
                      color: line.color,
                    }}
                  >
                    {k.ch}
                  </span>
                ))}
              </div>
            ))}
          </div>
          {/* 朱红闲章（签名小章，落下 48=拍45；每镜一处手作签名点） */}
          <div style={{ position: 'absolute', left: '50%', top: 590, marginLeft: -55, zIndex: 30, ...sealStamp(frame, SEAL_LAND, 30, sealTilt('s07-poem')) }}>
            <div
              style={{
                position: 'relative',
                width: 110,
                height: 110,
                borderRadius: 8,
                background: FILM_COLORS2.sealRed,
                opacity: 0.93,
                boxShadow: `0 12px 30px rgba(0,0,0,0.45), 0 0 ${Math.round(20 + sealGlow * 22)}px rgba(${SEAL_RGB},${sealGlow})`,
              }}
            >
              <div style={{ position: 'absolute', inset: 8, border: `1.5px solid ${FILM_COLORS2.paperWhite}`, opacity: 0.35, borderRadius: 5 }} />
              <div style={{ position: 'absolute', left: 0, right: 0, top: 30, textAlign: 'center' }}>
                <span style={{ fontFamily: fontFamilies.serif, fontSize: 46, color: FILM_COLORS2.paperWhite, ...glowText(FILM_COLORS2.sealRed, 0.3, SEAL_RGB) }}>闲</span>
              </div>
            </div>
            {/* 落定瞬间（48）：sealRed 双环 + 粒子（锚印章中心） */}
            {sw ? (
              <div style={{ position: 'absolute', left: '50%', top: '50%' }}>
                <div style={{ position: 'absolute', ...sw.ring1 }} />
                <div style={{ position: 'absolute', ...sw.ring2 }} />
              </div>
            ) : null}
            <div style={{ position: 'absolute', left: '50%', top: '50%' }}>
              {sparks.map((p, i) => (
                <div key={`spark-${i}`} style={p.style} />
              ))}
            </div>
            {/* 朱色未干余晕（尾帧交接态） */}
            {frame >= SEAL_LAND ? (
              <div style={{ position: 'absolute', left: 24, top: 44, width: 60, height: 60, borderRadius: 30, background: FILM_COLORS2.sealRed, opacity: interpolate(frame, [SEAL_LAND, 90], [0.22, 0.08], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), filter: 'blur(12px)' }} />
            ) : null}
          </div>
        </AbsoluteFill>
      </CameraRig>
      <HudChrome label="wuh.site · MOTTO" readout="CODE × CRAFT" />
      <Grade2 id="GR2-03" />
    </AbsoluteFill>
  );
};

export default S07;
