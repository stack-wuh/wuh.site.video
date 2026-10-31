/* 镜 32 · Act 5 创作人文 · 全局帧 [4700,5000) · 300f */
import type { CSSProperties, FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, GRADES, inkRise, paperBreathe, writeFade } from '../motion-tokens';
import { CameraRig, ParallaxLayer } from '../components/CameraRig';
import { DustField } from '../components/DustField';

const serif = fontFamilies.serif;
const mono = fontFamilies.mono;

const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

/* 坐标基准判定：localStart = 0，镜局部帧与幕局部帧恒等，全部断点（dolly [0,300]、fold [260,300]、
   delay 40/160/230、开场溶解 [0,24]）逐帧等价 → 镜局部基准（useCurrentFrame 原样）。
   camDrift / paperBreathe / 光柱 Math.sin 为无钳制振荡器，localStart = 0 下相位天然一致，无需平移。
   本镜无冻结断点，动画照原样播放。 */
const grade = GRADES[4]; // grade-warm-paper：幕级根层 saturate(0.95) 作为镜根 filter 带入（背景由 ShotShell 提供）

/** cam-drift 减半档：固定机位的呼吸（±2px / ±0.075°，120f 周期） */
const camDrift = (frame: number): { x: number; y: number; rot: number } => ({
  x: Math.sin((frame / 120) * Math.PI * 2 + 1.3) * 2,
  y: Math.cos((frame / 120) * Math.PI * 2 + 1.1) * 2,
  rot: Math.sin((frame / 120) * Math.PI * 2 + 0.6) * 0.075,
});

/** ink-bloom 洇开慢档（90f）：三层 blur 墨团错峰洇开，墨入纸纤维 */
const inkBloom = (frame: number, delay: number, layer: 0 | 1 | 2): CSSProperties => {
  const p = interpolate(frame - delay, [0, 90], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut });
  const layers = [
    { blur: 12, op: 0.055, grow: 74 },
    { blur: 6, op: 0.042, grow: 46 },
    { blur: 2, op: 0.03, grow: 24 },
  ] as const;
  const c = layers[layer];
  return { filter: `blur(${c.blur}px)`, opacity: c.op * p, transform: `scale(${0.2 + p * (c.grow / 100)})` };
};

/* ─── 坐忘歌诗影 —— 全片最慢一镜（原 Act5 ShotVerse，幕局部 0–300 逐字平移） ───
   事件预算 4/5：句 1 显影 40（4740）、句 2 显影 160（4860，句级间隔 120f ≥ 90f）、
   角落小字 ink-rise 230（4930）、tr-verse-fold 起势 260（4960）；其余交给纸面呼吸 + 墨洇 + 光尘极缓漂浮 */
const VERSE = ['不怒百神和畅，', '不恼心地清凉。'] as const;

const ShotVerse: FC = () => {
  const frame = useCurrentFrame();
  const drift = camDrift(frame);
  const dolly = interpolate(frame, [0, 300], [0, 0.005], { ...CLAMP, easing: CURVES.cineEaseInOut }); // cam-dolly-in 超慢档 0.5%
  const fold = interpolate(frame, [260, 300], [0, 1], { ...CLAMP, easing: CURVES.cineEaseInOut }); // tr-verse-fold ★
  const cam = { scale: 1 + dolly, x: drift.x, y: drift.y, rot: drift.rot, origin: '50% 46%' };
  return (
    <AbsoluteFill style={{ filter: `saturate(${grade.filter.saturate})` }}>
      <CameraRig cam={cam}>
        {/* 前景一炷虚化光尘（gold-drift 极缓档，景深虚化层） */}
        <ParallaxLayer depth={0.45} cam={cam} blurBase={7}>
          <div
            style={{
              position: 'absolute',
              left: 1330 + Math.sin((frame / 240) * Math.PI * 2) * 18,
              top: -90,
              width: 320,
              height: 1260,
              background: `radial-gradient(ellipse at 50% 32%, ${colors.accent}, transparent 72%)`,
              opacity: 0.1,
              filter: 'blur(34px)',
            }}
          />
        </ParallaxLayer>
        <ParallaxLayer depth={1} cam={cam}>
          <div style={{ ...paperBreathe(frame, 0.5) }}>
            <div style={{ position: 'absolute', left: 460, top: 330, width: 1000, perspective: 1400 }}>
              <div style={{ transform: `rotateY(${-90 * fold}deg)`, transformOrigin: 'left center', position: 'relative' }}>
                {VERSE.map((line, i) => {
                  const delay = i === 0 ? 40 : 160;
                  return (
                    <div key={line} style={{ position: 'relative', margin: '36px 0', transform: `translateY(${-10 * fold}px)`, opacity: 1 - fold * 0.7 }}>
                      <div style={{ position: 'absolute', left: -36, top: -30, width: 620, height: 128, ...inkBloom(frame, delay, 0) }} />
                      <div style={{ position: 'absolute', left: -20, top: -16, width: 560, height: 104, ...inkBloom(frame, delay, 1) }} />
                      <div style={{ position: 'absolute', left: -6, top: -4, width: 500, height: 84, ...inkBloom(frame, delay, 2) }} />
                      <p style={{ ...writeFade(frame, delay, true), position: 'relative', fontFamily: serif, fontSize: 62, lineHeight: 1.4, color: colors.ink, letterSpacing: '0.16em', margin: 0 }}>
                        {line}
                      </p>
                    </div>
                  );
                })}
                {/* 纸缘阴影（翻动时右缘投影位移） */}
                <div style={{ position: 'absolute', right: 0, top: 0, width: 12, height: '100%', background: colors.ink, opacity: 0.08 * fold, filter: 'blur(6px)' }} />
              </div>
            </div>
          </div>
          {/* 角落小字（全局 4930 = 幕局部 230，ink-rise） */}
          <p style={{ ...inkRise(frame, 230), position: 'absolute', right: 150, bottom: 128, fontFamily: mono, fontSize: 17, color: colors.muted }}>
            《再读〈坐忘歌〉》 · 1,673 次阅读
          </p>
        </ParallaxLayer>
      </CameraRig>
      {/* 幕级常量 overlay（原 Act5 根层分解入镜，保持原渲染次序）：光尘 multiply 层 + grade LUT + veil */}
      <div style={{ position: 'absolute', inset: 0, mixBlendMode: 'multiply' }}>
        <DustField act={5} />
      </div>
      <AbsoluteFill style={{ background: grade.lut.color, mixBlendMode: grade.lut.blend, opacity: grade.lut.opacity }} />
      <AbsoluteFill style={{ background: grade.veil.color, mixBlendMode: grade.veil.blend, opacity: grade.veil.opacity }} />
      {/* 开场 24f 溶解（幕局部 [0,24) ⊂ 本镜窗，仅归入本镜）：由暗入暖纸（镜 31→32 晕开入暖纸的收尾呼吸） */}
      <AbsoluteFill style={{ background: colors.bg, opacity: interpolate(frame, [0, 24], [0.85, 0], { ...CLAMP, easing: CURVES.cineEaseOut }) }} />
    </AbsoluteFill>
  );
};

export default ShotVerse;
