/* s06 · 原著里的每一枚金针、每一场雪，都得先查清楚从哪儿来。（255f · 8.5s，Act 2）
 *
 * 查证三连卡：剧本 v6 / 人物设定 / 金针出处 三张纸面卡左右横移依次叠换
 * （入向交替：左→右→左），每张落地走 MO-CARD-STACK 的落下+微弹（stackBounce 2f 回弹），
 * 后卡压上前卡时前卡横向退让、压暗一档（叠换）。对应 storyboard 音效点「翻纸×3」的三个落点。
 * 转场：入「切」/ 出「切」。字幕窗 [12,243]。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { Caption } from '../components/Caption';
import { CLAMP, MO_CARD, MO_EASE } from '../motion-tokens';

const TOTAL = 255;
const LANDS = [34, 106, 178]; // 三张卡的落地帧（翻纸×3）
const ENTER = 20; // 横移入场时长
const CARD_W = 540;
const CARD_H = 620;

type CardDef = {
  tag: string;
  title: string;
  lines: string[];
  /** 终位（被后卡退让前） */
  x: number;
  y: number;
  rot: number;
  /** 被后卡压上时退让到的终位 */
  toX: number;
  toDim: number;
};

const CARDS: CardDef[] = [
  {
    tag: 'script-v6.md',
    title: '剧本 · v6',
    lines: ['风陵渡口 · 开场夜话', '三枚金针 · 三段递进', '片尾 · 收在等待'],
    x: -70, y: 10, rot: -2.2, toX: -118, toDim: 0.55,
  },
  {
    tag: 'character-design.md',
    title: '人物设定',
    lines: ['郭襄 · 五段年龄', '杨过 · 不露真容', '全片 · 零红纪律'],
    x: 70, y: -6, rot: 1.8, toX: 118, toDim: 0.55,
  },
  {
    tag: '原著 · 金针出处查证',
    title: '金针 · 出处',
    lines: ['第一枚 · 揭下面具', '第二枚 · 生日之约', '第三枚 · 求他别死'],
    x: 0, y: 6, rot: -0.9, toX: 0, toDim: 1,
  },
];

const S06: FC = () => {
  const f = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        {CARDS.map((c, i) => {
          const L = LANDS[i];
          const next = LANDS[i + 1];
          /* 入向交替：左→右→左（dir=-1 从左进来） */
          const dir = i % 2 === 0 ? -1 : 1;
          /* 横移入场（左右交替）+ 落下微弹（stackBounce 2f 回弹）+ 角度落定 */
          const x = interpolate(
            f,
            next === undefined ? [L - ENTER, L] : [L - ENTER, L, next, next + 12],
            next === undefined ? [c.x + dir * 560, c.x] : [c.x + dir * 560, c.x, c.x, c.toX],
            { ...CLAMP, easing: MO_EASE.out },
          );
          const y = interpolate(f, [L - 8, L, L + MO_CARD.stackBounce, L + MO_CARD.stackBounce * 2], [c.y - 30, c.y, c.y - 8, c.y], {
            ...CLAMP,
            easing: MO_EASE.out,
          });
          const rot = interpolate(f, [L - ENTER, L], [c.rot + dir * 4, c.rot], { ...CLAMP, easing: MO_EASE.out });
          /* 入场淡入；被后卡压上时压暗一档 */
          const enterOp = interpolate(f, [L - 14, L - 8], [0, 1], { ...CLAMP, easing: MO_EASE.out });
          const dim = next === undefined ? 1 : interpolate(f, [next, next + 12], [1, c.toDim], { ...CLAMP, easing: MO_EASE.inout });
          const op = f < L ? enterOp : dim;

          return (
            <div
              key={c.title}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: CARD_W,
                height: CARD_H,
                marginLeft: -CARD_W / 2,
                marginTop: -CARD_H / 2,
                opacity: op,
                transform: `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) rotate(${rot.toFixed(2)}deg)`,
              }}
            >
              <div style={{ width: '100%', height: '100%', background: colors.paper, borderRadius: 6, padding: '44px 48px', color: colors.ink }}>
                <div style={{ fontFamily: fontFamilies.mono, fontSize: 15, letterSpacing: 1, opacity: 0.5 }}>{c.tag}</div>
                <div style={{ fontFamily: fontFamilies.serif, fontSize: 38, letterSpacing: 4, marginTop: 14, fontWeight: 700 }}>
                  {c.title}
                </div>
                <div style={{ height: 1, background: colors.ink, opacity: 0.16, margin: '20px 0 24px' }} />
                {c.lines.map((line, li) => (
                  <div
                    key={line}
                    style={{
                      fontFamily: fontFamilies.serif,
                      fontSize: 22,
                      letterSpacing: 2,
                      lineHeight: 1.5,
                      marginTop: li === 0 ? 0 : 16,
                      opacity: 0.8,
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
      <Caption
        text="原著里的每一枚金针、每一场雪，都得先查清楚从哪儿来。"
        start={12}
        end={243}
        duration={TOTAL}
        inSide={0}
        outSide={0}
      />
    </AbsoluteFill>
  );
};

export default S06;
