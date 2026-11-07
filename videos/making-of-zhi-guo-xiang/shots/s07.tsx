/* s07 · 第八版之前，先有前七版的纸面功夫。（165f · 5.5s，Act 2）
 *
 * v1→v7 文档卡堆叠成塔：7 张纸面卡自画面上方依次落下（MO-CARD-STACK：每张 stackStep 4f 间隔
 * 落下 + stackBounce 2f 微弹，落地位置带 random(seed) 撒纸抖动，向上垒成塔），
 * 末卡落稳后整塔定格；右下角计数角标 01→07 随落卡翻动（**MO-NUM-ODOMETER 逐位滚轮** + MO-COUNTER-DIGIT-POP 弹跳）。
 * 转场：入「切」/ 出「切」。字幕窗 [12,153]。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { Caption } from '../components/Caption';
import { Odometer } from '../components/Odometer';
import { CLAMP, MO_CARD, MO_COUNTER, MO_EASE } from '../motion-tokens';

const TOTAL = 165;
const N = 7;
const T0 = 26; // 首卡落地帧
const FALL = 9; // 每张卡的落下时长
const STEP = MO_CARD.stackStep; // 4f 间隔
const BOUNCE = MO_CARD.stackBounce; // 2f 微弹
const FALL_FROM = -900; // 起落点（卡体完整在画面外）
const CARD_W = 400;
const CARD_H = 520;

type Doc = { tag: string; title: string; lines: string[] };

const DOCS: Doc[] = [
  { tag: 'script-v1.md', title: '剧本 · v1', lines: ['风陵渡口 · 开场', '金针三枚 · 递进', '片尾 · 等待'] },
  { tag: 'script-v2.md', title: '剧本 · v2', lines: ['风陵渡口 · 开场', '金针三枚 · 递进', '片尾 · 等待'] },
  { tag: 'script-v3.md', title: '剧本 · v3', lines: ['风陵渡口 · 开场', '金针三枚 · 递进', '片尾 · 等待'] },
  { tag: 'script-v4.md', title: '剧本 · v4', lines: ['风陵渡口 · 开场', '金针三枚 · 递进', '片尾 · 等待'] },
  { tag: 'script-v5.md', title: '剧本 · v5', lines: ['风陵渡口 · 开场', '金针三枚 · 递进', '片尾 · 等待'] },
  { tag: 'script-v6.md', title: '剧本 · v6', lines: ['风陵渡口 · 开场', '金针三枚 · 递进', '片尾 · 等待'] },
  { tag: 'audit-v7.md', title: '审计 · v7', lines: ['画面缺陷 · 清单', '修复对照 · 五处', '52 镜 · 五件套'] },
];

const S07: FC = () => {
  const f = useCurrentFrame();
  /* 计数：已落地卡数；角标随首卡落地淡入，数字按落地帧弹跳 */
  const count = f < T0 ? 0 : Math.min(N, Math.floor((f - T0) / STEP) + 1);
  const badgeIn = interpolate(f, [T0, T0 + 6], [0, 1], CLAMP);
  const popAge = count > 0 ? Math.max(0, f - (T0 + (count - 1) * STEP)) : 0;
  const pop = interpolate(popAge, [0, MO_COUNTER.digitPopFrames], [MO_COUNTER.digitPopFrom, 1], {
    ...CLAMP,
    easing: MO_EASE.back,
  });

  return (
    <AbsoluteFill style={{ background: colors.bg, justifyContent: 'center', alignItems: 'center' }}>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        {DOCS.map((doc, i) => {
          const L = T0 + i * STEP;
          /* 落位：向上垒塔 + random(seed) 撒纸抖动（确定性） */
          const restY = 84 - i * 16;
          const restX = (random(`s07-x${i}`) - 0.5) * 28;
          const restRot = (random(`s07-r${i}`) - 0.5) * 5;
          const visible = f >= L - FALL;
          const y = interpolate(f, [L - FALL, L, L + BOUNCE, L + BOUNCE * 2], [FALL_FROM, restY, restY - 9, restY], {
            ...CLAMP,
            easing: MO_EASE.out,
          });
          const rot = interpolate(f, [L - FALL, L], [restRot + 4, restRot], { ...CLAMP, easing: MO_EASE.out });

          return (
            <div
              key={doc.tag}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: CARD_W,
                height: CARD_H,
                marginLeft: -CARD_W / 2,
                marginTop: -CARD_H / 2,
                opacity: visible ? 1 : 0,
                transform: `translate(${restX.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${rot.toFixed(2)}deg)`,
              }}
            >
              <div style={{ width: '100%', height: '100%', background: colors.paper, borderRadius: 6, padding: '36px 40px', color: colors.ink }}>
                <div style={{ fontFamily: fontFamilies.mono, fontSize: 14, letterSpacing: 1, opacity: 0.5 }}>{doc.tag}</div>
                <div style={{ fontFamily: fontFamilies.serif, fontSize: 40, letterSpacing: 4, marginTop: 12, fontWeight: 700 }}>
                  {doc.title}
                </div>
                <div style={{ height: 1, background: colors.ink, opacity: 0.16, margin: '18px 0 20px' }} />
                {doc.lines.map((line, li) => (
                  <div
                    key={line}
                    style={{
                      fontFamily: fontFamilies.serif,
                      fontSize: 19,
                      letterSpacing: 2,
                      lineHeight: 1.5,
                      marginTop: li === 0 ? 0 : 12,
                      opacity: 0.62,
                    }}
                  >
                    {line}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
      {/* 计数角标：纸面墨字，右下角（与 s02 同签名） */}
      <div style={{ position: 'absolute', right: 56, bottom: 52, opacity: count > 0 ? badgeIn : 0 }}>
        <div
          style={{
            transform: `scale(${pop.toFixed(4)})`,
            transformOrigin: '100% 100%',
            background: colors.paper,
            color: colors.ink,
            borderRadius: 4,
            padding: '10px 20px 12px',
            fontFamily: fontFamilies.serif,
            fontSize: 40,
            lineHeight: 1,
            letterSpacing: 4,
            fontWeight: 700,
          }}
        >
          <Odometer
            count={Math.max(1, count)}
            changedAt={T0 + (Math.max(1, count) - 1) * STEP}
            pad={2}
            size={40}
            color={colors.ink}
            fontFamily={fontFamilies.serif}
          />
        </div>
      </div>
      <Caption text="第八版之前，先有前七版的纸面功夫。" start={12} end={153} duration={TOTAL} inSide={0} outSide={0} />
    </AbsoluteFill>
  );
};

export default S07;
