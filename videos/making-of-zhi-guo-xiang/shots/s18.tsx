/* s18 · 评审留了底稿：初稿十条事实错误，一条一条列着。（225f · 7.5s，Act 4 · v3.2 195→225）
 *
 * 文档快照卡：design-v10 十条错误留痕——纸底墨字，逐条打字浮现（MO-TYPE-WRITER：
 * MO_CARD.typePerChar 2f/字，光标 8f 周期闪烁；单光标沿行序连续推进）。条目按正片
 * RELEASE-v12 原著校正口径自拟（伪托诗 / 揭面十六岁 / 三针全用 / 万兽山庄初见 /
 * 烟花十个字 / 骑青驴……），末条「按原著，全部重写」加粗定稿，光标留在行尾闪到镜尾（定格）。
 * 转场：入「切」/ 出「切」。字幕窗 [12,183]。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { Caption } from '../components/Caption';
import { CLAMP, MO_CARD, writeFade } from '../motion-tokens';

const TOTAL = 225;
const START = 8; // 打字起始帧
const NUMERALS = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩'] as const;

/** 十条错误留痕（自拟，行文按正片 RELEASE-v12 原著校正口径；末条为评审结论） */
const ITEMS = [
  '诗六行系伪托',
  '揭面在十六岁非二十四年后',
  '三枚金针她全用了',
  '第三针：求他别死',
  '万兽山庄是初见',
  '烟花十个字她知道',
  '小龙女是中心',
  '绝情谷跳崖保留',
  '骑青驴，不御剑',
  '按原著，全部重写',
] as const;

/** token hex → rgba（禁内联 hex，明暗差从 brand/tokens 派生） */
const alpha = (hex: string, a: number): string => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

/** 每行打字起始帧（行序连续推进，2f/字） */
const STARTS: readonly number[] = (() => {
  const out: number[] = [];
  let acc = START;
  for (const t of ITEMS) {
    out.push(acc);
    acc += t.length * MO_CARD.typePerChar;
  }
  return out;
})();

const S18: FC = () => {
  const f = useCurrentFrame();
  const blink = Math.floor((f % MO_CARD.cursorCycle) / (MO_CARD.cursorCycle / 2)) === 0;

  return (
    <AbsoluteFill style={{ background: colors.paper }}>
      <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 980 }}>
          {/* 头行 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', ...writeFade(f, 0) }}>
            <span style={{ fontFamily: fontFamilies.serif, fontSize: 32, fontWeight: 700, letterSpacing: 4, color: colors.ink }}>
              初稿 · 十条错误留痕
            </span>
            <span style={{ fontFamily: fontFamilies.mono, fontSize: 17, letterSpacing: 1, color: alpha(colors.ink, 0.55) }}>
              design.md — v10
            </span>
          </div>
          <div style={{ height: 1, background: alpha(colors.ink, 0.2), margin: '18px 0 10px', ...writeFade(f, 2) }} />

          {/* 逐条打字 */}
          {ITEMS.map((item, i) => {
            const start = STARTS[i];
            const visible = Math.min(item.length, Math.max(0, Math.floor((f - start) / MO_CARD.typePerChar)));
            const numIn = interpolate(f, [start, start + 2], [0, 1], CLAMP);
            const typing = visible > 0 && visible < item.length;
            /* 光标：正在打的行尾；全部打完后留在末条行尾闪到镜尾（定格） */
            const caret = (typing || (i === ITEMS.length - 1 && f >= start)) && blink;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 16, padding: '9px 4px', minHeight: 44 }}>
                <span
                  style={{
                    fontFamily: fontFamilies.sans,
                    fontSize: 22,
                    color: alpha(colors.ink, 0.5),
                    opacity: numIn,
                    width: 30,
                  }}
                >
                  {NUMERALS[i]}
                </span>
                <span
                  style={{
                    fontFamily: fontFamilies.serif,
                    fontSize: 28,
                    letterSpacing: 2,
                    color: colors.ink,
                    fontWeight: i === ITEMS.length - 1 ? 700 : 400,
                  }}
                >
                  {item.slice(0, visible)}
                  {caret ? (
                    <span
                      style={{
                        display: 'inline-block',
                        width: 3,
                        height: 24,
                        marginLeft: 3,
                        background: colors.ink,
                        verticalAlign: '-3px',
                      }}
                    />
                  ) : null}
                </span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      <Caption text="评审留了底稿：初稿十条事实错误，一条一条列着。" start={12} end={213} duration={TOTAL} inSide={0} outSide={0} />
    </AbsoluteFill>
  );
};

export default S18;
