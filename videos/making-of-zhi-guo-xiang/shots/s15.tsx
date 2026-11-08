/* s15 · 片头那首诗，金庸从来没写过。（150f · 5.0s，Act 4）
 *
 * 诗六行卡：六行诗横排居中（纸底墨字，衬线，逐字不改——与正片 InkPaper 同文），逐行浮现
 * （writeFade 每行错位 4f）。第 30f 起「伪托」朱印砸落定场（MO-X-STAMP 单发语义：
 * scaleFrom 1.6、hitFrames 6，cubic-in 加速下砸 + 4f 回弹落定；落定时诗身随之一颤）。
 * 印 = colors.seal 方章 mock：内圈细纸线 + 毛笔楷「伪托」，multiply 压进纸里。
 * 转场：入「切」/ 出「切」。字幕窗 [12,138]。
 */
import type { FC } from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { Caption } from '../components/Caption';
import { CLAMP, MO_EASE, MO_X_STAMP, writeFade } from '../motion-tokens';

const TOTAL = 150;
const STAMP_AT = 30;

/** 诗六行（逐字不改， videos/zhi-guo-xiang InkPaper POEM 同源；跨单元禁 import，故照抄） */
const POEM = [
  '我走过山时，山不说话，',
  '我路过海时，海不说话。',
  '小毛驴滴滴答答，倚天剑伴我走天涯。',
  '大家都说我因为爱着杨过大侠，才在峨嵋山上出了家，',
  '其实我只是爱上了峨眉山上的云和霞，',
  '像极了十六岁那年的烟花。',
] as const;

const S15: FC = () => {
  const f = useCurrentFrame();

  /* 朱印砸落：30–36 加速下砸（1.6→0.96），36–41 回弹落定（0.96→1） */
  const drop = interpolate(f, [STAMP_AT, STAMP_AT + MO_X_STAMP.hitFrames], [MO_X_STAMP.scaleFrom, 0.96], {
    ...CLAMP,
    easing: Easing.in(Easing.cubic),
  });
  const settle = interpolate(f, [STAMP_AT + MO_X_STAMP.hitFrames, STAMP_AT + MO_X_STAMP.hitFrames + 5], [0.96, 1], {
    ...CLAMP,
    easing: MO_EASE.out,
  });
  const scale = f < STAMP_AT + MO_X_STAMP.hitFrames ? drop : settle;
  const sealIn = interpolate(f, [STAMP_AT, STAMP_AT + 2], [0, 1], CLAMP);
  /* 砸定一颤：诗身随印章落地轻沉一下 */
  const thud = interpolate(
    f,
    [STAMP_AT + MO_X_STAMP.hitFrames, STAMP_AT + MO_X_STAMP.hitFrames + 4, STAMP_AT + MO_X_STAMP.hitFrames + 8],
    [0, 2.5, 0],
    CLAMP,
  );

  return (
    <AbsoluteFill style={{ background: colors.paper }}>
      <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'relative', transform: `translateY(${thud}px)` }}>
          {/* 诗六行：逐行浮现 */}
          {POEM.map((line, i) => (
            <div
              key={i}
              style={{
                fontFamily: fontFamilies.serif,
                fontSize: 38,
                letterSpacing: 3,
                lineHeight: 2.0,
                textAlign: 'center',
                color: colors.ink,
                ...writeFade(f, i * 4),
              }}
            >
              {line}
            </div>
          ))}

          {/* 「伪托」朱印：方章 mock，压在诗块右下角 */}
          <div
            style={{
              position: 'absolute',
              right: -34,
              bottom: -30,
              width: 148,
              height: 148,
              background: colors.seal,
              borderRadius: 10,
              boxShadow: `inset 0 0 0 3px ${colors.paper}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              opacity: 0.92 * sealIn,
              mixBlendMode: 'multiply',
              transform: `rotate(-5deg) scale(${scale})`,
            }}
          >
            {['伪', '托'].map((ch) => (
              <span
                key={ch}
                style={{
                  fontFamily: fontFamilies.brush,
                  fontSize: 56,
                  lineHeight: 1,
                  color: colors.paper,
                }}
              >
                {ch}
              </span>
            ))}
          </div>
        </div>
      </AbsoluteFill>

      <Caption text="片头那首诗，金庸从来没写过。" start={12} end={138} duration={TOTAL} inSide={0} outSide={0} />
    </AbsoluteFill>
  );
};

export default S15;
