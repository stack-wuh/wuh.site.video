/* S46 · Act 7 坐忘 · 局部帧 [0,300) · 300f · 绝对 6128–6428
 *
 * 坐忘歌（全片最慢的一段字·r4 纪律）：承接纸页翻面、全屏只剩字（S03 打底、
 * 正文虚化为纸纹）；★FN-49 四列右起逐字落版——列序右→左 常默/少思/不怒/不恼，
 * 起笔 32（=绝对 6160），每列 62f、每字 9f，每字落下极轻压痕；
 * 末字落定 272=绝对 6400=拍320 对音，272–300 静置；
 * CM-01 严格零运镜（全片唯一连续零运镜段）；坐忘歌即字幕（同文同层，不设 Caption）。
 * 版式纪律：同一行四列、右起，不得回退两行两列或上下两排。
 * 转场：入「纸翻」（18f），出「纸翻」（下一镜 inbound）。
 */
import type { FC } from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from 'remotion';
import { staticFile } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { columnWrite } from '../motion-tokens';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const TOTAL = 300;
const START = 32; // 起笔 = 绝对 6160
const COL_STEP = 62;
const CHAR_STEP = 9;
/** 四句（每列一句，右起：col0=最左=不恼 …… col3=最右=常默） */
const COLS = ['不恼心地清凉。', '不怒百神和畅，', '少思慧烛内光。', '常默元气不伤，'];

const S46: FC = () => {
  const frame = useCurrentFrame();
  // 严格零运镜：唯一动效是字与光
  const writer = columnWrite(frame, START, 4, 7, CHAR_STEP);
  const glow = interpolate(frame, [START, 272], [0.35, 0.5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: colors.paper }}>
      {/* S03 纸面打底、正文虚化为纸纹 */}
      <Img src={staticFile('wuh-site-intro-v3/site/s03-post-165-v1.png')} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(14px) brightness(1.06) saturate(0.5)', opacity: 0.4 }} />
      <AbsoluteFill style={{ background: colors.paper, opacity: 0.62 }} />
      <DustField act={7} count={10} seedBase="s46" />

      {/* 四句同一行四列、右起（FN-49 columnWrite） */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 380, display: 'flex', justifyContent: 'center', gap: 130, zIndex: 30 }}>
        {COLS.map((colText, col) => (
          <div key={col} style={{ display: 'flex', gap: 12 }}>
            {colText.split('').map((ch, chIdx) => {
              const { opacity, press } = writer(col, chIdx);
              return (
                <span
                  key={chIdx}
                  style={{
                    fontFamily: fontFamilies.serif,
                    fontSize: 74,
                    color: colors.ink,
                    opacity,
                    display: 'inline-block',
                    transform: `scale(${press})`,
                    textShadow: opacity >= 1 ? `0 2px 0 rgba(0,0,0,0.08)` : 'none',
                    whiteSpace: 'pre',
                  }}
                >
                  {ch}
                </span>
              );
            })}
          </div>
        ))}
      </div>
      {/* 光极缓变化（FN-05 amp 0.5：全镜一层极缓明暗） */}
      <AbsoluteFill style={{ background: colors.gold, mixBlendMode: 'soft-light', opacity: glow * 0.2, pointerEvents: 'none' }} />
      {/* 下半留白 + 落款预留位标记（s47 落款位，不可见） */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 170, textAlign: 'center' }} />
      <PaperGrain opacity={0.06} />
      <Grade id="GR-02" />
    </AbsoluteFill>
  );
};

export default S46;
