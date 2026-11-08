/* s14 · 后来发现，错的不是画面，是故事。（180f · 6.0s，Act 4 · v3.1 帧数再分配 165→180）
 *
 * 文档快照卡：script-v10 原著校对表 mock——纸底墨字表格，行 = 原著事实逐行（风陵渡初闻 /
 * 三枚金针三用 / 揭面在十六岁 / 万兽山庄），行末「初稿对读：十处不符」收尾，指向 s18 留痕卡。
 * 入场 MO-CARD-RISE（等墨洇入遮罩走完 12f 起浮）；表格逐行显影：writeFade 每行错位 7f 淡入；
 * 持续 = 整卡 MO-EASE-INOUT 缓推近（1→1.045）。
 * 转场：入「墨洇」20f / 出「切」。字幕窗 [32,168]。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { Caption } from '../components/Caption';
import { CLAMP, MO_CARD, MO_EASE, writeFade } from '../motion-tokens';

const TOTAL = 180;
const WIDTH = 1150;

/** token hex → rgba（禁内联 hex，明暗差从 brand/tokens 派生） */
const alpha = (hex: string, a: number): string => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

/** 校对行：原著事实 × 出处（mock，行文按材料口径） */
const ROWS: ReadonlyArray<{ fact: string; source: string }> = [
  { fact: '风陵渡口，初闻神雕大侠之名', source: '原著 · 风陵渡一节' },
  { fact: '第一枚金针，求见真人面目', source: '原著 · 三针之约' },
  { fact: '第二枚金针，约在十六岁生日', source: '原著 · 襄阳贺寿' },
  { fact: '第三枚金针，求他不要死', source: '原著 · 绝情谷一节' },
  { fact: '揭去人皮面具，正在十六岁之年', source: '原著 · 初遇一节' },
  { fact: '万兽山庄，群兽踏雪夜行', source: '原著 · 万兽山庄' },
];
const ROW_DELAY0 = 20; // 墨洇入遮罩走完后首行起显
const ROW_STAGGER = 7; // 每行错位 7f
const FOOTER_DELAY = ROW_DELAY0 + ROWS.length * ROW_STAGGER + 4;

const S14: FC = () => {
  const f = useCurrentFrame();

  /* 整卡缓推近（MO-EASE-INOUT，全程缓进） */
  const push = interpolate(f, [0, TOTAL - 1], [1, 1.045], { ...CLAMP, easing: MO_EASE.inout });
  /* MO-CARD-RISE：卡片自下淡入上浮（等 ink 遮罩将退时起） */
  const rise = interpolate(f, [14, 14 + MO_CARD.riseFrames], [0, 1], { ...CLAMP, easing: MO_EASE.out });

  return (
    <AbsoluteFill style={{ background: colors.paper }}>
      <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ transform: `scale(${push})` }}>
          <div
            style={{
              width: WIDTH,
              opacity: rise,
              transform: `translateY(${(1 - rise) * MO_CARD.riseShiftPx}px)`,
            }}
          >
            {/* 头行 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontFamily: fontFamilies.serif, fontSize: 36, fontWeight: 700, letterSpacing: 4, color: colors.ink }}>
                原著校对表
              </span>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 17, letterSpacing: 1, color: alpha(colors.ink, 0.55) }}>
                script.md — v10
              </span>
            </div>
            <div style={{ height: 1, background: alpha(colors.ink, 0.2), margin: '20px 0 6px' }} />

            {/* 逐行显影 */}
            {ROWS.map((row, i) => {
              const style = writeFade(f, ROW_DELAY0 + i * ROW_STAGGER);
              return (
                <div
                  key={row.fact}
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 22,
                    padding: '15px 4px',
                    borderBottom: `1px solid ${alpha(colors.ink, 0.12)}`,
                    ...style,
                  }}
                >
                  <span style={{ fontFamily: fontFamilies.mono, fontSize: 18, color: alpha(colors.ink, 0.5), width: 34 }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span style={{ fontFamily: fontFamilies.serif, fontSize: 27, letterSpacing: 2, color: colors.ink, flex: 1 }}>
                    {row.fact}
                  </span>
                  <span style={{ fontFamily: fontFamilies.mono, fontSize: 16, letterSpacing: 1, color: alpha(colors.ink, 0.5) }}>
                    {row.source}
                  </span>
                </div>
              );
            })}

            {/* 对读结论：指向 design-v10 留痕（s18） */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                paddingTop: 18,
                fontFamily: fontFamilies.mono,
                fontSize: 17,
                letterSpacing: 1.5,
                color: alpha(colors.ink, 0.6),
                ...writeFade(f, FOOTER_DELAY),
              }}
            >
              初稿对读：十处不符 · 留痕见 design-v10
            </div>
          </div>
        </div>
      </AbsoluteFill>

      <Caption text="后来发现，错的不是画面，是故事。" start={32} end={168} duration={TOTAL} inSide={20} outSide={0} />
    </AbsoluteFill>
  );
};

export default S14;
