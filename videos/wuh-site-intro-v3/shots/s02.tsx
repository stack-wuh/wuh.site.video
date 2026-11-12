/* S02 · Act 1 墨点 · 局部帧 [0,138) · 138f · 绝对 150–288
 *
 * V3 批次 A 重做（2026-11-12 六门验收 + 审计返工单 · 特效解禁 FX 层）：
 * 【承接】首帧 = s01 尾帧交出的「纸面+窗框+题记」经 ShotShell 光晕呼吸收进近黑——本镜自
 *         spaceDeep 深空显影接住，DeepSpace 星漂/数据流星不断（背景节拍），数字雨帘垫底。
 * 【触发】主动作者 = 琥珀数据光点（第一篇文章的节点）：自上方 HUD 坠落（20–50 ease-in），
 *         50 触轴落定激起冲击——时间轴被点亮，文章数据卡随余波展开。
 * 【展开】逐拍帧表（局部帧，fps=30）：
 *   [0–19]    CameraRig 1.02 微持 + handheld('s02-cam',1.2)；dataCurtain('s02-rain',8 列,110)；
 *   [20–50]   数据光点自 (931,29) 坠至落轴点 (940,300)（ease-in 位移入场）；
 *   [50]      触轴落定：shockwave('212,163,115') 双环 + sparkBurst('s02-burst',12 粒) + 节点辉光涨成；
 *   [52–96]   两圈雷达涟漪扩散（52–78 / 58–96 原窗，触轴余波）；
 *   [56–90]   第一篇文章线框数据卡 springIn 展开（y 24→0 + scale 0.96→1，origin top）；
 *   [90]      「发布 2019-07-26」朱红闲章 sealStamp 落下（手作签名点 · 每镜一处）+ sealRed 双环冲击；
 *   [110–126] 「正文落款 2018-08-05」writeFade(110) + POST #001 writeFade(118)；HUD readout 90 处翻转；
 *   [120–138] 极缓后拉（1.02→1.0）+ 落轴点余晖呼吸——尾帧交接态。
 * 【交接】尾帧 = 文章卡 + 双日期读数冻帧、落轴点余晖未散（manifest endFrameDesc：双日期纸卡冻帧，
 *         墨斑未干）→ 交 s03「2020·04 建站倒计时」。
 * 意义一句话：博客的第一篇文章作为一枚数据光点落上时间轴——这条轴从此开始有内容。
 * 时间轴零改动：138f / 光点 20–50 / 卡 56–90 / 闲章 90 / 落款 110、118 / Caption（2019 年，博客有了第一篇。appearAt 32）原样。
 * 转场：入「墨洇」出「纸翻」→ ShotShell 光晕呼吸，镜文件零工作。字幕安全窗：start≥32、end≤108。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES, sealStamp, sealTilt, writeFade } from '../../../brand/motion';
import {
  FILM_COLORS2,
  dataCurtain,
  glowText,
  handheld,
  shockwave,
  sparkBurst,
  springIn,
} from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 138;
const NODE_LAND = 50; // 触轴落定
const SEAL_LAND = 90; // 闲章落下（原窗）
/** 数据卡内闲章中心的绝对坐标（卡 left 450/top 350 + 章 (120,190) + 半径 90） */
const SEAL_CX = 660;
const SEAL_CY = 630;

const S02: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // 数据光点下坠（20–50 ease-in）：自上方 HUD 位置坠到时间轴落点
  const dropY = interpolate(frame, [20, NODE_LAND], [-260, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn });
  const dropOpacity = interpolate(frame, [20, 26], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  // 触轴（50–62）：节点辉光涨成 + 两圈雷达涟漪（52–78 / 58–96 原窗）
  const nodeR = interpolate(frame, [NODE_LAND, 62], [7, 22], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const ripple1 = interpolate(frame, [52, 78], [0, 130], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const ripple2 = interpolate(frame, [58, 96], [0, 190], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const rippleOpacity = (t0: number, t1: number) =>
    interpolate(frame, [t0, t0 + 10, t1], [0, 0.35, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  // 触轴落定瞬间（50）：双环冲击 + 粒子喷洒
  const wave = shockwave(frame, NODE_LAND, '212,163,115');
  const burst = sparkBurst('s02-burst', frame, NODE_LAND, 12);
  // 闲章落定瞬间（90）：朱红双环
  const sealWave = shockwave(frame, SEAL_LAND, '122,31,22');
  // 文章数据卡 springIn 展开（56 起，位移+形变入场）
  const cardP = springIn(frame, 56, fps);
  // 极缓后拉（120–138）+ 手持呼吸
  const hh = handheld('s02-cam', frame, 1.2);
  const cam = {
    scale: interpolate(frame, [0, 120, TOTAL], [1.02, 1.02, 1.0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    x: hh.dx,
    y: hh.dy,
    rot: hh.rot,
  };
  // 背景数字雨帘（信息层之下，峰值 opacity 按 token ≤0.22）
  const rain = dataCurtain('s02-rain', frame, 8, 110);

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s02v2" stars={54} grid horizon />
      <CameraRig cam={cam}>
        <AbsoluteFill>
          {/* 数字雨帘（背景氛围层，信息层之下） */}
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 2, pointerEvents: 'none' }}>
            {rain.map((c, i) => (
              <span
                key={`rain-${i}`}
                style={{
                  position: 'absolute',
                  left: `${c.x}%`,
                  top: c.y,
                  fontFamily: fontFamilies.mono,
                  fontSize: 14,
                  color: FILM_COLORS2.data,
                  opacity: c.o,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {c.text}
              </span>
            ))}
          </div>

          {/* 时间轴主线（落轴点所在的极淡数据轴） */}
          <div style={{ position: 'absolute', left: 300, width: 1340, top: 300, height: 1.5, background: FILM_COLORS2.line, opacity: 0.5 }} />

          {/* 数据光点（坠出 HUD 的那点余光） */}
          {frame >= 20 && frame < NODE_LAND ? (
            <div
              style={{
                position: 'absolute',
                left: 931,
                top: 289 + dropY,
                width: 18,
                height: 22,
                borderRadius: 10,
                background: FILM_COLORS2.data,
                boxShadow: `0 0 18px 5px rgba(212,163,115,0.55)`,
                opacity: dropOpacity,
              }}
            />
          ) : null}

          {/* 落轴节点 + 辉光涟漪（构图居中三分线：轴上 x=940） */}
          <div style={{ position: 'absolute', left: 940, top: 300 }}>
            {frame >= NODE_LAND ? (
              <div
                style={{
                  position: 'absolute',
                  left: -nodeR / 2,
                  top: -nodeR / 2,
                  width: nodeR,
                  height: nodeR,
                  borderRadius: nodeR,
                  background: FILM_COLORS2.data,
                  boxShadow: `0 0 26px 8px rgba(212,163,115,0.5)`,
                }}
              />
            ) : null}
            {ripple1 > 0 ? <div style={{ position: 'absolute', left: -ripple1, top: -ripple1 / 2, width: ripple1 * 2, height: ripple1, borderRadius: ripple1, border: `1.4px solid ${FILM_COLORS2.data}`, opacity: rippleOpacity(52, 78) }} /> : null}
            {ripple2 > 0 ? <div style={{ position: 'absolute', left: -ripple2, top: -ripple2 / 2, width: ripple2 * 2, height: ripple2, borderRadius: ripple2, border: `1px solid ${FILM_COLORS2.dataDim}`, opacity: rippleOpacity(58, 96) }} /> : null}
          </div>

          {/* 触轴落定瞬间（50）：双环冲击 + 粒子，锚在落轴点 */}
          {frame >= NODE_LAND ? (
            <div style={{ position: 'absolute', left: 940, top: 300, width: 0, height: 0, zIndex: 28, pointerEvents: 'none' }}>
              {wave ? <div style={wave.ring1} /> : null}
              {wave ? <div style={wave.ring2} /> : null}
              {burst.map((p, i) => (
                <div key={`burst-${i}`} style={p.style} />
              ))}
            </div>
          ) : null}

          {/* 第一篇文章线框数据卡（卡头 + 双日期读数；自落轴点向下 springIn 展开） */}
          <div style={{ position: 'absolute', left: 450, top: 350, width: 980, height: 400, opacity: Math.min(1, cardP * 1.4), transform: `translateY(${(1 - cardP) * 24}px) scale(${0.96 + cardP * 0.04})`, transformOrigin: '50% 0%' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 8, background: FILM_COLORS2.panel, border: `1px solid ${FILM_COLORS2.line}`, boxShadow: `0 0 34px rgba(212,163,115,0.12), 0 24px 60px rgba(0,0,0,0.55)` }} />
            <div style={{ position: 'absolute', left: 60, top: 44, display: 'flex', alignItems: 'baseline', gap: 18 }}>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 24, color: FILM_COLORS2.textMuted, fontVariantNumeric: 'tabular-nums' }}>2018-08-05</span>
              <span style={{ fontFamily: fontFamilies.serif, fontSize: 40, color: FILM_COLORS2.paperWhite, ...glowText(FILM_COLORS2.paperWhite, 0.25) }}>【开篇】</span>
            </div>
            <div style={{ position: 'absolute', left: 60, right: 60, top: 112, height: 1, background: FILM_COLORS2.line, opacity: 0.7 }} />
            {/* 数据行（暗琥珀占位） */}
            <div style={{ position: 'absolute', left: 60, top: 140, width: 560, height: 10, background: FILM_COLORS2.data, opacity: 0.22 }} />
            {[0, 1, 2].map((i) => (
              <div key={`row-${i}`} style={{ position: 'absolute', left: 60, top: 174 + i * 26, width: 700 - i * 90, height: 6, background: FILM_COLORS2.dataDim, opacity: 0.24 }} />
            ))}
            {/* 「发布 2019-07-26」朱红闲章（手作签名点 · 落下 90） */}
            <div style={{ position: 'absolute', left: 120, top: 190, ...sealStamp(frame, SEAL_LAND, 30, sealTilt('s02-first-post')) }}>
              <div style={{ position: 'relative', width: 180, height: 180, borderRadius: 8, background: FILM_COLORS2.sealRed, opacity: 0.92, boxShadow: `0 0 22px rgba(122,31,22,0.4)` }}>
                <span style={{ position: 'absolute', left: 0, right: 0, top: 58, textAlign: 'center', fontFamily: fontFamilies.serif, fontSize: 25, color: FILM_COLORS2.paperWhite }}>发布</span>
                <span style={{ position: 'absolute', left: 0, right: 0, top: 104, textAlign: 'center', fontFamily: fontFamilies.mono, fontSize: 19, color: FILM_COLORS2.paperWhite, fontVariantNumeric: 'tabular-nums' }}>2019-07-26</span>
              </div>
            </div>
            {/* 闲章落定瞬间（90）：朱红双环（锚印章中心，zIndex 高于卡低于 HUD） */}
            {sealWave ? (
              <div style={{ position: 'absolute', left: SEAL_CX - 450, top: SEAL_CY - 350, width: 0, height: 0, zIndex: 31, pointerEvents: 'none' }}>
                <div style={sealWave.ring1} />
                <div style={sealWave.ring2} />
              </div>
            ) : null}
            {/* 「正文落款」HUD 数据行（110 write-fade） */}
            <div style={{ position: 'absolute', left: 380, top: 240, ...writeFade(frame, 110) }}>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 15, letterSpacing: '0.22em', color: FILM_COLORS2.textMuted }}>正文落款 · </span>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 19, color: FILM_COLORS2.data, fontVariantNumeric: 'tabular-nums' }}>2018-08-05</span>
            </div>
            <div style={{ position: 'absolute', left: 380, top: 286, ...writeFade(frame, 118) }}>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 13, letterSpacing: '0.3em', color: FILM_COLORS2.textMuted, opacity: 0.8 }}>POST #001 · wuh.site</span>
            </div>
            {/* 落轴点余晖（尾帧交接态：余晖未散，呼吸微动） */}
            {frame >= NODE_LAND ? <div style={{ position: 'absolute', left: 478, top: -62, width: 24, height: 24, borderRadius: 12, background: FILM_COLORS2.data, opacity: 0.1 + 0.04 * Math.sin(frame / 9), filter: 'blur(8px)' }} /> : null}
          </div>
        </AbsoluteFill>
      </CameraRig>
      <HudChrome label="wuh.site · CHRONICLE" readout={frame >= SEAL_LAND ? 'POST #001 · PUBLISHED' : 'NEW NODE · DROPPING'} />
      <Grade2 id="GR2-01" />
      <Caption text="2019 年，博客有了第一篇。" appearAt={32} />
    </AbsoluteFill>
  );
};

export default S02;
