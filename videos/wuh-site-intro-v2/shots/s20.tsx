/* 镜 20 · Act 3 第一行 · 局部帧 [0,132) · 132f
   编辑器全屏亮起；FN-14 光标两闪（0–20f）；FN-03 键入 2.4f/字（10–92f）；
   FN-17 回车轻震 @96f + CM-03 100→103%；CM-07 轻跟行尾；尾段界面元素退场；GR-01。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, cursorBlink, paperShake, typeCharsAt } from '../motion-tokens';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { PaperGrain } from '../components/PaperGrain';
import { Grade } from '../components/Grade';

const CODE = 'feat(init): 基于nextjs构建的monorepos项目';
const FONT = 44;
const LINE_X = 320;
const LINE_TOP = 500;
const TYPE_START = 10;
const FPC = 2.4;
const ENTER_AT = 96;

const charWidth = (ch: string): number => (ch.charCodeAt(0) > 0x2e80 ? FONT : FONT * 0.6);
const CUM = (() => {
  const out = [0];
  for (const ch of CODE) out.push(out[out.length - 1] + charWidth(ch));
  return out;
})();

const ShotFirstLine: FC = () => {
  const frame = useCurrentFrame();
  const n = typeCharsAt(frame, CODE.length, TYPE_START, FPC);
  const frac = Math.min(CODE.length, Math.max(0, (frame - TYPE_START) / FPC));
  const i0 = Math.floor(frac);
  const typedW = CUM[i0] + (CUM[Math.min(i0 + 1, CODE.length)] - CUM[i0]) * (frac - i0);
  const caretOn = frame < 20 ? cursorBlink(frame, 0, 5, 2) : 1;
  const push = interpolate(frame, [ENTER_AT, 132], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const scale = 1.16 * (1 + 0.03 * push);
  const follow = -Math.min(200, typedW * 0.2);
  const chrome = 1 - interpolate(frame, [112, 128], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const power = interpolate(frame, [0, 10], [0.72, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const accentPart = CODE.slice(0, Math.min(n, 12));
  const restPart = n > 12 ? CODE.slice(12, n) : '';
  const mono = fontFamilies.mono;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.terminalBg, overflow: 'hidden' }}>
      <AbsoluteFill style={{ ...paperShake(frame, ENTER_AT, 2, 12), filter: `brightness(${power})` }}>
        {/* 编辑区相机：微距对准首行，随键入轻跟行尾 */}
        <div style={{ position: 'absolute', inset: 0, transform: `translate(${follow}px, 0) scale(${scale})`, transformOrigin: '42% 46%' }}>
          <div style={{ position: 'absolute', left: 250, top: LINE_TOP - 8, width: 1400, height: 66, background: colors.bgLift, opacity: 0.7 * chrome }} />
          <div style={{ position: 'absolute', left: 260, top: LINE_TOP - 6, width: 40 }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} style={{ height: 34, lineHeight: '34px', fontFamily: mono, fontSize: 16, color: i === 0 ? colors.terminalText : colors.muted, opacity: (i === 0 ? 0.8 : 0.3) * chrome, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{i + 1}</div>
            ))}
          </div>
          <div style={{ position: 'absolute', left: LINE_X, top: LINE_TOP, fontFamily: mono, fontSize: FONT, lineHeight: `${FONT * 1.5}px`, color: colors.terminalText, whiteSpace: 'pre' }}>
            <span style={{ color: colors.accent }}>{accentPart}</span>
            <span>{restPart}</span>
            <span style={{ display: 'inline-block', width: 3, height: FONT + 6, marginLeft: 3, verticalAlign: 'text-bottom', background: colors.accent, opacity: caretOn }} />
          </div>
        </div>
        {/* 界面元素：尾段退场，只留代码行 */}
        <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 64, background: colors.bgLift, borderBottom: `1px solid ${colors.hairline}`, opacity: chrome }}>
          <div style={{ position: 'absolute', left: 26, top: 27, display: 'flex' }}>
            {[colors.seal, colors.lampAmber, colors.statusGreen].map((c) => (
              <span key={c} style={{ display: 'inline-block', width: 11, height: 11, borderRadius: 6, background: c, opacity: 0.75, marginRight: 9 }} />
            ))}
          </div>
          <div style={{ position: 'absolute', left: 96, top: 22, fontFamily: mono, fontSize: 15, color: colors.muted }}>wuh.site — apps/site/app/page.tsx</div>
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 40, background: colors.bgLift, borderTop: `1px solid ${colors.hairline}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 26px', opacity: chrome }}>
          <span style={{ fontFamily: mono, fontSize: 14, color: colors.muted }}>main*</span>
          <span style={{ fontFamily: mono, fontSize: 14, color: colors.muted, fontVariantNumeric: 'tabular-nums' }}>2024-12-08 · UTF-8 · TypeScript</span>
        </div>
      </AbsoluteFill>
      <DustField act={3} seedBase="s20" />
      <PaperGrain opacity={0.045} />
      <Grade id="GR-01" />
      <Caption text="2024 年 12 月 8 日，新站落下第一行代码。" appearAt={26} />
    </AbsoluteFill>
  );
};

export default ShotFirstLine;
