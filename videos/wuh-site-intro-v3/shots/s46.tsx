/* S46 · Act 7 坐忘 · 局部帧 [0,300) · 300f · 绝对 6128–6428
 *
 * 坐忘歌（全片最慢的一段字·r4 纪律）—— V3 节拍升级（2026-11-12 审计返工单）：
 * 保留四句文案与列序（同一行四列、右起：col3=最右=常默 → col0=最左=不恼，阅读序=书写序），
 * 节拍升级为「列落 → 逐字 → 落定辉光 → 收束」四拍结构（≥4 拍合门）：
 * ①列落：每列书写位 springIn 弹入落位（右→左 6f 错峰，位移入场）+ 列基线淡显；
 * ②逐字：FN-49 columnWrite 压痕语义不变，列窗 60f/字步 10f——常默 32–92 → 少思 92–152
 *   → 不怒 152–212 → 不恼 212–272，末字落定 272=绝对 6400=拍320 对音（锚点绝不动）；
 * ③落定辉光：每字落定辉光脉冲（0.5→稳态 0.22 呼吸），末字 272 落定 = 全句辉光涌起 + 金光横扫一遍；
 * ④收束：272–300 辉光收稳态呼吸、中央琥珀光晕定深（r4 严格零运镜全片唯一连续零运镜段保持）。
 * 坐忘歌即字幕（同文同层，不设 Caption——Caption 契约原样）。字色暖纸白 + 落定辉光（glowText）。
 * 版式纪律：同一行四列、右起，不得回退两行两列或上下两排。
 * 时间轴零改动：300f / 起笔 32 / 末字落定 272=拍320 / 272–300 静置窗口原样 / 无字幕；
 * 无 <Sequence>；random(seed) only；springIn fps 取 useVideoConfig；色板只用 FILM_COLORS2 族。
 * 转场：入「纸翻」（18f），出「纸翻」（下一镜 inbound）。
 * 镜内文字最低点 y≈470 < 930 安全线（下半留白语义保留）。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';
import { columnWrite, FILM_COLORS2, glowText, sheenSweep, springIn } from '../motion-tokens';

const START = 32; // 起笔 = 绝对 6160
const COL_GAP = 60; // 列窗（右→左依次起笔：常默 32 → 少思 92 → 不怒 152 → 不恼 212）
const CHAR_STEP = 10; // 每字 10f
const LAST_LAND = START + 3 * COL_GAP + 6 * CHAR_STEP; // 272 = 绝对 6400 = 拍320 对音（不动）
const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
/** 四句（每列一句，右起：col0=最左=不恼 …… col3=最右=常默）——文案与列序原样保留 */
const COLS = ['不恼心地清凉。', '不怒百神和畅，', '少思慧烛内光。', '常默元气不伤，'];

const S46: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // 严格零运镜：唯一动效是列、字与光
  // 中央琥珀光晕极缓加深（原金光 ramp [32,272] 原窗口）+ 末字落定辉光涌起
  const glow = interpolate(frame, [START, LAST_LAND], [0.35, 0.5], CLAMP) + interpolate(frame, [LAST_LAND, LAST_LAND + 4, LAST_LAND + 24], [0, 0.14, 0.04], CLAMP);

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      {/* 暖黑数据流底（与 s47 同 seed：两镜背景版式逐像素对齐） */}
      <DeepSpace seed="s46v2" stars={44} grid />

      {/* 中央琥珀光晕 */}
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

      {/* 四句同一行四列、右起（列落 → 逐字 → 落定辉光 → 收束） */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 380, display: 'flex', justifyContent: 'center', gap: 130, zIndex: 30 }}>
        {COLS.map((colText, col) => {
          const colStart = START + (3 - col) * COL_GAP; // 该列首字起笔帧（col3=常默=32 … col0=不恼=212）
          const colIn = springIn(frame, colStart - 8, fps, 17, 170, 0.9); // ①列落（右→左 6f 错峰起）
          const writer = columnWrite(frame, colStart, 1, 7, CHAR_STEP); // ②逐字（FN-49 压痕语义）
          return (
            <div key={col} style={{ position: 'relative', display: 'flex', gap: 12, opacity: Math.min(1, colIn * 1.4), transform: `translateY(${(1 - colIn) * 16}px)` }}>
              {/* 列基线淡显（列落的落点标记，落定后驻为极淡线） */}
              <div style={{ position: 'absolute', left: '50%', top: -18, width: 1, height: 130, background: FILM_COLORS2.line, opacity: colIn * (0.16 + 0.04 * Math.sin(frame / 13 + col)) }} />
              {colText.split('').map((ch, chIdx) => {
                const t0 = colStart + chIdx * CHAR_STEP;
                const { opacity, press } = writer(0, chIdx);
                // ③落定辉光：落定脉冲 → 稳态呼吸
                const pulse = frame >= t0 ? interpolate(frame, [t0 + 5, t0 + 8, t0 + 24], [0, 0.5, 0.22], CLAMP) : 0;
                const steady = 0.2 + 0.05 * Math.sin(frame / 11 + col * 0.8 + chIdx * 0.37);
                const intensity = frame >= t0 ? Math.max(pulse, steady) : 0;
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
                      textShadow: intensity > 0 ? glowText(FILM_COLORS2.paperWhite, intensity).textShadow : 'none',
                      whiteSpace: 'pre',
                    }}
                  >
                    {ch}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* ③末字落定（272=拍320）：金光横扫一遍（环/粒子/光扫至少其一——静场取光扫） */}
      {frame >= LAST_LAND ? (
        <div style={{ position: 'absolute', left: 330, right: 330, top: 360, height: 130, zIndex: 31, pointerEvents: 'none' }}>
          <div style={sheenSweep(frame, LAST_LAND, 16)} />
        </div>
      ) : null}

      {/* 下半留白 + 落款预留位标记（s47 落款位，不可见） */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 170, textAlign: 'center' }} />

      <HudChrome label="wuh.site · ZUO WANG GE" readout={frame >= LAST_LAND ? '28 字 · 落定' : '四列 · 28 字'} />
      <Grade2 id="GR2-07" />
    </AbsoluteFill>
  );
};

export default S46;
