/* S46 · Act 7 坐忘 · 局部帧 [0,300) · 300f · 绝对 6128–6428
 *
 * 坐忘歌（全片最慢的一段字·r4 纪律）—— V2 深空数据流重构（2026-11-11）：
 * 原纸面+S03 虚化底退役，改 DeepSpace 暖黑数据流底（seed 与 s47 同源，两镜
 * 背景逐像素对齐）；★FN-49 四列右起逐字落版不变——列序右→左 常默/少思/不怒/不恼，
 * 起笔 32（=绝对 6160），每列 62f、每字 9f，每字落下极轻压痕；
 * 末字落定 272=绝对 6400=拍320 对音，272–300 静置；
 * 字色改暖纸白 + 落定辉光（glowText）；中央琥珀光晕极缓加深（原金光 ramp 原窗口）；
 * CM-01 严格零运镜（全片唯一连续零运镜段）；坐忘歌即字幕（同文同层，不设 Caption）。
 * 版式纪律：同一行四列、右起，不得回退两行两列或上下两排。
 * 转场：入「纸翻」（18f），出「纸翻」（下一镜 inbound）。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';
import { columnWrite, FILM_COLORS2, glowText } from '../motion-tokens';

const START = 32; // 起笔 = 绝对 6160
const CHAR_STEP = 9;
/** 四句（每列一句，右起：col0=最左=不恼 …… col3=最右=常默） */
const COLS = ['不恼心地清凉。', '不怒百神和畅，', '少思慧烛内光。', '常默元气不伤，'];

const S46: FC = () => {
  const frame = useCurrentFrame();
  // 严格零运镜：唯一动效是字与光
  const writer = columnWrite(frame, START, 4, 7, CHAR_STEP);
  const glow = interpolate(frame, [START, 272], [0.35, 0.5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      {/* 暖黑数据流底（与 s47 同 seed：两镜背景版式逐像素对齐） */}
      <DeepSpace seed="s46v2" stars={44} grid />

      {/* 中央琥珀光晕极缓加深（原金光 ramp [START,272] 原窗口） */}
      <div
        style={{
          position: 'absolute',
          left: 210,
          top: 90,
          width: 1500,
          height: 900,
          borderRadius: 750,
          background: `radial-gradient(circle, rgba(212,163,115,0.12), rgba(212,163,115,0) 62%)`,
          opacity: glow,
          pointerEvents: 'none',
        }}
      />

      {/* 四句同一行四列、右起（FN-49 columnWrite 原节奏） */}
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
                    color: FILM_COLORS2.paperWhite,
                    opacity,
                    display: 'inline-block',
                    transform: `scale(${press})`,
                    textShadow: opacity >= 1 ? glowText(FILM_COLORS2.paperWhite, 0.28).textShadow : 'none',
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

      {/* 下半留白 + 落款预留位标记（s47 落款位，不可见） */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 170, textAlign: 'center' }} />

      <HudChrome label="wuh.site · ZUO WANG GE" readout="四列 · 28 字" />
      <Grade2 id="GR2-07" />
    </AbsoluteFill>
  );
};

export default S46;
