/* s04 · 第一次想拍郭襄，是十一月初。（150f · 5.0s，Act 2）
 *
 * 文档快照卡：script-v2 首页单色纸面 mock（colors.paper 纸底 + colors.ink 墨字，无彩色），
 * 整卡缓推近 scale 1→1.05（MO-EASE-INOUT 全镜），卡片 MO-CARD-RISE 入场（12f 上浮），
 * 正文逐字浮现（2f/字错峰起打 + 光标 8f 周期闪烁，MO-TYPE-WRITER）。
 * 转场：入「墨洇」20f / 出「切」。字幕窗 [32,138]。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { Caption } from '../components/Caption';
import { CLAMP, MO_CARD, MO_EASE } from '../motion-tokens';

const TOTAL = 150;
const TITLE = '剧本 · v2';
const DOC_TAG = 'script-v2.md';
const LINES = [
  '第一幕 · 风陵渡口',
  '雪夜渡口，郭襄听闻神雕大侠。',
  '三枚金针，三个愿望。',
  '她想看看面具后面的那个人。',
  '——十一月初三 · 二稿',
];
const TYPE_START = 22; // 首行起打（墨洇退净前后）
const LINE_GAP = 14; // 行间起打间隔（各行动态重叠，逐字浮现不排队）
const CHAR_FADE = 4; // 单字浮现时长

const S04: FC = () => {
  const f = useCurrentFrame();
  /* 卡片入场：MO-CARD-RISE（12f 上浮 24px） */
  const rise = interpolate(f, [0, MO_CARD.riseFrames], [MO_CARD.riseShiftPx, 0], { ...CLAMP, easing: MO_EASE.out });
  const cardIn = interpolate(f, [0, MO_CARD.riseFrames], [0, 1], { ...CLAMP, easing: MO_EASE.out });
  /* 整卡缓推近：全镜 1→1.05 */
  const zoom = interpolate(f, [0, TOTAL], [1, 1.05], { ...CLAMP, easing: MO_EASE.inout });

  /* 光标落在最新起打且未打完的行上；8f 周期闪烁（亮 4f / 灭 4f） */
  let cursorLine = -1;
  for (let li = 0; li < LINES.length; li++) {
    const t0 = TYPE_START + li * LINE_GAP;
    if (f >= t0 && f < t0 + LINES[li].length * MO_CARD.typePerChar) cursorLine = li;
  }
  const cursorOn = Math.floor(f / (MO_CARD.cursorCycle / 2)) % 2 === 0;

  return (
    <AbsoluteFill style={{ background: colors.bg, justifyContent: 'center', alignItems: 'center' }}>
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          opacity: cardIn,
          transform: `translateY(${rise.toFixed(2)}px) scale(${zoom.toFixed(4)})`,
        }}
      >
        <div
          style={{
            width: 680,
            background: colors.paper,
            borderRadius: 6,
            padding: '50px 60px 54px',
            color: colors.ink,
          }}
        >
          <div style={{ fontFamily: fontFamilies.mono, fontSize: 15, letterSpacing: 1, opacity: 0.5 }}>{DOC_TAG}</div>
          <div style={{ fontFamily: fontFamilies.serif, fontSize: 44, letterSpacing: 6, marginTop: 14, fontWeight: 700 }}>
            {TITLE}
          </div>
          <div style={{ height: 1, background: colors.ink, opacity: 0.16, margin: '22px 0 28px' }} />
          {LINES.map((line, li) => {
            const t0 = TYPE_START + li * LINE_GAP;
            const isHead = li === 0;
            const isTail = li === LINES.length - 1;
            return (
              <div
                key={li}
                style={{
                  fontFamily: fontFamilies.serif,
                  fontSize: isHead ? 29 : 25,
                  lineHeight: 1.5,
                  letterSpacing: 2,
                  marginTop: isHead ? 0 : 18,
                  opacity: isTail ? 0.55 : isHead ? 1 : 0.82,
                }}
              >
                {line.split('').map((ch, ci) => {
                  const t = t0 + ci * MO_CARD.typePerChar;
                  const a = interpolate(f, [t, t + CHAR_FADE], [0, 1], { ...CLAMP, easing: MO_EASE.out });
                  return (
                    <span
                      key={ci}
                      style={{
                        display: 'inline-block',
                        whiteSpace: 'pre',
                        opacity: a,
                        transform: `translateY(${((1 - a) * 3).toFixed(2)}px)`,
                      }}
                    >
                      {ch}
                    </span>
                  );
                })}
                {cursorLine === li ? (
                  <span
                    style={{
                      display: 'inline-block',
                      width: '0.55em',
                      height: '0.95em',
                      marginLeft: 3,
                      verticalAlign: '-0.12em',
                      background: colors.ink,
                      opacity: cursorOn ? 0.85 : 0,
                    }}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <Caption text="第一次想拍郭襄，是十一月初。" start={32} end={138} duration={TOTAL} inSide={20} outSide={0} />
    </AbsoluteFill>
  );
};

export default S04;
