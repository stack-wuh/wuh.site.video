/* 镜 21 · Act 3 第一行 · 局部帧 [0,96) · 96f
   TR-12 代码行压印为印面（0–22f）；FN-09 章落 8f（44f 触纸）+ FN-10 微旋；
   RH-06 静止 2 拍（44–84f）；CM-03 2%（84–96f）；FN-06 朱红晕；GR-03；无字幕。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, FILM_COLORS, glowPulse, sealStamp, sealTilt } from '../motion-tokens';
import { DustField } from '../components/DustField';
import { PaperGrain } from '../components/PaperGrain';
import { Grade } from '../components/Grade';

const CODE = 'feat(init): 基于nextjs构建的monorepos项目';
const CONTACT = 44;
const TILT = sealTilt('s21-commit');

const ShotCommitSeal: FC = () => {
  const frame = useCurrentFrame();
  const morph = interpolate(frame, [2, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const drop = interpolate(frame, [16, CONTACT], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn });
  const stamp = sealStamp(frame, 36, 30, TILT);
  const halo = interpolate(frame, [CONTACT, 58], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const pulse = glowPulse(frame, 0.6).opacity;
  const push = interpolate(frame, [84, 96], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const scale = 1 + push * 0.02;
  const mono = fontFamilies.mono;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${scale})`, transformOrigin: '50% 52%' }}>
        <AbsoluteFill style={{ backgroundColor: FILM_COLORS.blankPaper }} />
        {/* TR-12 承接：s20 尾帧的单行代码与暗底先冻结，再压印为章面 */}
        <div style={{ position: 'absolute', inset: 0, background: colors.terminalBg, opacity: 1 - morph }} />
        <div style={{ position: 'absolute', left: 0, top: 0, transform: 'translate(-200px, 0) scale(1.195)', transformOrigin: '42% 46%', opacity: 1 - morph }}>
          <div style={{ position: 'absolute', left: 320, top: 500, fontFamily: mono, fontSize: 44, lineHeight: '66px', color: colors.terminalText, whiteSpace: 'pre' }}>
            <span style={{ color: colors.accent }}>feat(init): </span>
            <span>基于nextjs构建的monorepos项目</span>
            <span style={{ display: 'inline-block', width: 3, height: 50, marginLeft: 3, verticalAlign: 'text-bottom', background: colors.accent }} />
          </div>
        </div>
        {/* 朱红晕（印面下方，先于章体） */}
        <div style={{ position: 'absolute', left: 620, top: 460, width: 680, height: 260, borderRadius: '50%', background: colors.seal, filter: 'blur(70px)', opacity: 0.13 * halo * pulse }} />
        {/* 印面：章落 + 8f 压印 + 静止 */}
        <div style={{ position: 'absolute', inset: 0, transform: `translateY(${(1 - drop) * -150}px)` }}>
          <div style={{ position: 'absolute', inset: 0, ...stamp, opacity: morph }}>
            <div style={{ position: 'absolute', left: 400, top: 440, width: 1120, height: 240 }}>
              <div style={{ position: 'absolute', inset: 0, transform: `scale(${1.04 - morph * 0.04})` }}>
                <div style={{ position: 'absolute', inset: 0, background: colors.seal, opacity: 0.05 }} />
                <div style={{ position: 'absolute', inset: 0, border: `5px solid ${colors.seal}`, borderRadius: 6 }} />
                <div style={{ position: 'absolute', inset: 12, border: `2px solid ${colors.seal}`, opacity: 0.55 }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: 22, fontFamily: mono, fontSize: 36, letterSpacing: '0.02em', color: colors.seal, whiteSpace: 'pre' }}>{CODE}</div>
                <div style={{ position: 'absolute', right: 30, bottom: 13, fontFamily: mono, fontSize: 15, color: colors.seal, opacity: 0.7, fontVariantNumeric: 'tabular-nums' }}>2024-12-08</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DustField act={3} seedBase="s21" />
      <PaperGrain opacity={0.06} />
      <Grade id="GR-03" />
    </AbsoluteFill>
  );
};

export default ShotCommitSeal;
