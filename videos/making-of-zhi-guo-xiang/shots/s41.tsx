/* s41 · 《风陵 · 致郭襄》。现在，是她该有的样子。（255f · 8.5s，Act 8 终·执念 · 落版卡）
 *
 * 纸底（colors.paper）落版，居中三行，气质对齐 zhi-guo-xiang 定场（BrandOutro 同构）：
 *   · 片名「风陵 · 致郭襄」——大墨字（serif 94，writeFade 24f 起，墨洇入遮罩退开后落笔）；
 *   · tagline「现在，是她该有的样子。」——中字（ink 0.72 派生淡墨，40f 起）；
 *   · 计数「11 versions」——小字墨字（mono，52f 起；口径 v2–v12 共 11 个编号版）。
 * 第 60f 一枚朱印（colors.seal 方章 mock「风陵」二字，毛笔楷）缩放砸落定场
 * （brand/motion sealStamp 弹簧 1.25 → 1.0 + sealTilt 微旋，与正片钤印同源）。
 * 末 30f 全卡元素不淡出——BGM 淡出在装配层，画面定住到底（出「切」）。
 */
import type { CSSProperties, FC } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { sealStamp, sealTilt, writeFade } from '../../../brand/motion';
import { Caption } from '../components/Caption';

const TOTAL = 255;
const SEAL_AT = 60;

/** token hex → rgba（禁内联 hex，明暗差从 brand/tokens 派生） */
const alpha = (hex: string, a: number): string => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

/** 方章 mock：colors.seal 底 + 纸面「风陵」二字竖排（毛笔楷） */
const SEAL_STYLE: CSSProperties = {
  position: 'absolute',
  left: 'calc(50% + 218px)',
  top: 548,
  width: 118,
  height: 118,
  borderRadius: 10,
  background: colors.seal,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
};

const S41: FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seal = sealStamp(f, SEAL_AT, fps, sealTilt('making-of-zhi-guo-xiang-s41'));

  return (
    <AbsoluteFill style={{ background: colors.paper }}>
      {/* 片名（大墨字） */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          width: '100%',
          top: 402,
          textAlign: 'center',
          fontFamily: fontFamilies.serif,
          fontSize: 94,
          fontWeight: 700,
          letterSpacing: 10,
          lineHeight: 1,
          color: colors.ink,
          ...writeFade(f, 24),
        }}
      >
        风陵 · 致郭襄
      </div>

      {/* tagline（中字） */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          width: '100%',
          top: 566,
          textAlign: 'center',
          fontFamily: fontFamilies.serif,
          fontSize: 34,
          letterSpacing: 6,
          color: alpha(colors.ink, 0.72),
          ...writeFade(f, 40),
        }}
      >
        现在，是她该有的样子。
      </div>

      {/* 计数（小字墨字）：v2–v12 共 11 个编号版 */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          width: '100%',
          top: 652,
          textAlign: 'center',
          fontFamily: fontFamilies.mono,
          fontSize: 20,
          letterSpacing: 5,
          color: alpha(colors.ink, 0.55),
          ...writeFade(f, 52),
        }}
      >
        11 versions
      </div>

      {/* 朱印砸落定场（第 60f，之后常驻不淡出） */}
      {f >= SEAL_AT ? (
        <div style={{ ...SEAL_STYLE, ...seal }}>
          <div style={{ fontFamily: fontFamilies.brush, fontSize: 44, lineHeight: 1.12, color: colors.paper }}>风</div>
          <div style={{ fontFamily: fontFamilies.brush, fontSize: 44, lineHeight: 1.12, color: colors.paper }}>陵</div>
        </div>
      ) : null}

      <Caption
        text="《风陵 · 致郭襄》。现在，是她该有的样子。"
        start={32}
        end={243}
        duration={TOTAL}
        inSide={20}
        outSide={0}
      />
    </AbsoluteFill>
  );
};

export default S41;
