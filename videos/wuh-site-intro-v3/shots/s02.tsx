/* S02 · Act 1 墨点 · 局部帧 [0,138) · 138f · 绝对 150–288
 * V2 暖黑数据流（2026-11-11 风格重构）：「墨点落纸」改写为「数据节点落轴」——
 * 琥珀数据光点自 HUD 坠落（20–50 ease-in 同窗），触轴（50）激起两圈辉光涟漪（52–96 原窗），
 * 下方展开第一篇文章线框数据卡（56–90）：卡头 2018-08-05【开篇】+ 暗琥珀数据行；
 * 双日期拆成「发布 2019-07-26」朱红闲章（90 落下，手作签名点 · 每镜一处）+
 * 「正文落款 2018-08-05」HUD 数据行（110 write-fade）；极缓后拉（120–138）守恒。
 * 尾帧交接态语义保持：文章卡 + 双日期读数冻帧，落轴点余晖未散。
 * 转场：入「墨洇」出「纸翻」→ ShotShell 光晕呼吸，镜文件零工作。
 * 字幕安全窗：start≥32、end≤108。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES, sealStamp, sealTilt, writeFade } from '../../../brand/motion';
import { FILM_COLORS2, glowText } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 138;

const S02: FC = () => {
  const frame = useCurrentFrame();
  // 数据光点下坠（20–50 ease-in）：自上方 HUD 位置坠到时间轴落点
  const dropY = interpolate(frame, [20, 50], [-260, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn });
  const dropOpacity = interpolate(frame, [20, 26], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  // 触轴（50–62）：节点辉光涨成 + 两圈雷达涟漪（52–78 / 58–96）
  const nodeR = interpolate(frame, [50, 62], [7, 22], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const ripple1 = interpolate(frame, [52, 78], [0, 130], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const ripple2 = interpolate(frame, [58, 96], [0, 190], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const rippleOpacity = (t0: number, t1: number) =>
    interpolate(frame, [t0, t0 + 10, t1], [0, 0.35, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  // 文章数据卡展开（56–90）
  const cardP = interpolate(frame, [56, 90], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  // 极缓后拉（120–138）
  const cam = {
    scale: interpolate(frame, [0, 120, TOTAL], [1.02, 1.02, 1.0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    x: 0,
    y: 0,
    rot: 0,
  };

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s02v2" stars={54} grid horizon />
      <CameraRig cam={cam}>
        <AbsoluteFill>
          {/* 时间轴主线（落轴点所在的极淡数据轴） */}
          <div style={{ position: 'absolute', left: 300, width: 1340, top: 300, height: 1.5, background: FILM_COLORS2.line, opacity: 0.5 }} />

          {/* 数据光点（坠出 HUD 的那点余光） */}
          {frame >= 20 && frame < 52 ? (
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
            {frame >= 50 ? (
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

          {/* 第一篇文章线框数据卡（卡头 + 双日期读数；自落轴点向下展开） */}
          <div style={{ position: 'absolute', left: 450, top: 350, width: 980, height: 400, opacity: cardP, transform: `scale(${0.96 + cardP * 0.04})`, transformOrigin: '50% 0%' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 8, background: FILM_COLORS2.panel, border: `1px solid ${FILM_COLORS2.line}`, boxShadow: `0 0 34px rgba(212,163,115,0.12), 0 24px 60px rgba(0,0,0,0.55)` }} />
            <div style={{ position: 'absolute', left: 60, top: 44, display: 'flex', alignItems: 'baseline', gap: 18 }}>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 24, color: FILM_COLORS2.textMuted, fontVariantNumeric: 'tabular-nums' }}>2018-08-05</span>
              <span style={{ fontFamily: fontFamilies.serif, fontSize: 40, color: FILM_COLORS2.paperWhite, ...glowText(FILM_COLORS2.paperWhite, 0.25) }}>【开篇】</span>
            </div>
            <div style={{ position: 'absolute', left: 60, right: 60, top: 112, height: 1, background: FILM_COLORS2.line, opacity: 0.7 }} />
            {/* 数据行（暗琥珀占位） */}
            <div style={{ position: 'absolute', left: 60, top: 140, width: 560, height: 10, background: FILM_COLORS2.data, opacity: 0.22 }} />
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ position: 'absolute', left: 60, top: 174 + i * 26, width: 700 - i * 90, height: 6, background: FILM_COLORS2.dataDim, opacity: 0.24 }} />
            ))}
            {/* 「发布 2019-07-26」朱红闲章（手作签名点 · 落下 90） */}
            <div style={{ position: 'absolute', left: 120, top: 190, ...sealStamp(frame, 90, 30, sealTilt('s02-first-post')) }}>
              <div style={{ position: 'relative', width: 180, height: 180, borderRadius: 8, background: FILM_COLORS2.sealRed, opacity: 0.92, boxShadow: `0 0 22px rgba(122,31,22,0.4)` }}>
                <span style={{ position: 'absolute', left: 0, right: 0, top: 58, textAlign: 'center', fontFamily: fontFamilies.serif, fontSize: 25, color: FILM_COLORS2.paperWhite }}>发布</span>
                <span style={{ position: 'absolute', left: 0, right: 0, top: 104, textAlign: 'center', fontFamily: fontFamilies.mono, fontSize: 19, color: FILM_COLORS2.paperWhite, fontVariantNumeric: 'tabular-nums' }}>2019-07-26</span>
              </div>
            </div>
            {/* 「正文落款」HUD 数据行（110 write-fade） */}
            <div style={{ position: 'absolute', left: 380, top: 240, ...writeFade(frame, 110) }}>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 15, letterSpacing: '0.22em', color: FILM_COLORS2.textMuted }}>正文落款 · </span>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 19, color: FILM_COLORS2.data, fontVariantNumeric: 'tabular-nums' }}>2018-08-05</span>
            </div>
            <div style={{ position: 'absolute', left: 380, top: 286, ...writeFade(frame, 118) }}>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 13, letterSpacing: '0.3em', color: FILM_COLORS2.textMuted, opacity: 0.8 }}>POST #001 · wuh.site</span>
            </div>
            {/* 落轴点余晖（尾帧交接态：余晖未散） */}
            {frame >= 50 ? <div style={{ position: 'absolute', left: 478, top: -62, width: 24, height: 24, borderRadius: 12, background: FILM_COLORS2.data, opacity: 0.12, filter: 'blur(8px)' }} /> : null}
          </div>
        </AbsoluteFill>
      </CameraRig>
      <HudChrome label="wuh.site · CHRONICLE" readout={frame >= 90 ? 'POST #001 · PUBLISHED' : 'NEW NODE · DROPPING'} />
      <Grade2 id="GR2-01" />
      <Caption text="2019 年，博客有了第一篇。" appearAt={32} />
    </AbsoluteFill>
  );
};

export default S02;
