/* 镜 02 · Act 1 序章 · 全局帧 [220,500) · 280f */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { TYPE } from '../motion-tokens';

const serif = fontFamilies.serif;

const MOTTO = '写作是抵抗遗忘的方式，代码是构建世界的语言。';

/* 打字机宣言 · 字幕即画面（原 ShotTypewriter；localStart 120：原 `local = frame - 120` → `local = frame`，逐字核对仅两处帧字面量平移——
   墨点出生帧 born 126→6（幕局部 126 = 镜局部 120+6），其余断点均为 local 相对量不变（键击 3.3f/字，22 字镜局部 73 打完，金色短划线 [240,260] 画满；
   left: 120 + chars * 30 之 120 为像素坐标非帧，不动）；镜尾帧交接态：宣言全文 + 下划线画满，笔尖墨点呼吸待机 */
const ShotTypewriter: FC = () => {
  const frame = useCurrentFrame();
  const local = frame;
  const chars = Math.min(MOTTO.length, Math.max(0, Math.floor(local / TYPE.framesPerChar)));
  const done = chars >= MOTTO.length;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: 'center' }}>
        <div style={{ padding: '0 140px', position: 'relative' }}>
          <p style={{ fontFamily: serif, fontSize: 52, color: colors.paper, lineHeight: 1.6, minHeight: 170, textShadow: `0 0 30px ${colors.bgLift}` }}>
            {MOTTO.slice(0, chars)}
            <span
              style={{
                display: 'inline-block',
                width: 28,
                height: 28,
                borderRadius: 14,
                background: `radial-gradient(circle, ${colors.accent} 0%, transparent 70%)`,
                filter: 'blur(7px)',
                opacity: 0.5 + 0.4 * Math.sin(local / 4),
                marginLeft: 6,
              }}
            />
          </p>
          {Array.from({ length: Math.min(chars * 2, 30) }).map((_, i) => {
            const born = 6 + Math.floor(i / 2) * TYPE.framesPerChar;
            const life = frame - born;
            if (life < 0 || life > 18) return null;
            const angle = (i * 137) % 360;
            const dist = 6 + ((i * 29) % 22);
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: 140 + (i % 14) * 62 + Math.cos((angle * Math.PI) / 180) * dist * (life / 18),
                  top: 430 + Math.sin((angle * Math.PI) / 180) * dist * (life / 18) - life * 0.4,
                  width: 3,
                  height: 3,
                  borderRadius: 1.5,
                  background: colors.paperMuted,
                  opacity: 1 - life / 18,
                }}
              />
            );
          })}
          <div style={{ width: done ? interpolate(local, [240, 260], [0, 180], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0, height: 3, background: colors.accent, marginTop: 10 }} />
        </div>
        <div style={{ position: 'absolute', left: 120 + chars * 30, top: 400, width: 28, height: 28, borderRadius: 14, background: `radial-gradient(circle, ${colors.accent}, transparent 70%)`, filter: 'blur(7px)', opacity: 0.55 }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export default ShotTypewriter;
