/* S47 · Act 7 坐忘 · 局部帧 [0,96) · 96f · 绝对 6428–6524
 *
 * 落款镜（r4 纪律：背景与镜 46 完全一致——同一 DeepSpace seed 同一四列右起 landed 版式）——
 * V3 返工（2026-11-12 审计返工单：印章/落款 springIn + 微动，留白语义保留）：
 * 四句停驻带呼吸辉光（承接 s46 尾帧「四句完整停在纸面」）；底部落款「——司马承祯《坐忘歌》」
 * 20f springIn 弹入（位移入场，替换原纯淡入）+ 笔锋下划线 stroke 同窗生长（20–72=绝对 6448–6500，
 * 琥珀）；极小「忘」字闲章 sealStamp 4f 落定 72=绝对 6500=拍325（本镜唯一朱红·手作签名）+
 * sparkBurst 金粒（印章 SLAM 级落定必配冲击）+ paperShake 极轻一震；缓拉 100→102%（76–96 原窗口）
 * 露整页 + handheld 手持微动（全镜不断，留白不等于死帧）。无字幕（画面落款）。
 * 编排四问：
 *  承接：首帧 = s46 交出的「四句纸面」整页态（同 seed 同版式逐字对齐，零跳变）；
 *  触发：落款 springIn 弹入 + 笔锋生长 = 本镜主动作（作者签名入场），72 印章盖印收束；
 *  展开：帧级节奏表（见下）；落定后辉光呼吸 + 手持微动不断；
 *  交接：尾帧整页字与印驻留（endFrameDesc 契约原样，交 s48 读书日）。
 * 逐拍帧表（fps=30）：
 *  [0–18]  整页四句停驻（呼吸辉光 + 手持微动，承接态）；
 *  [20–72] 落款 springIn(20) 弹入 + 笔锋下划线 scaleX 生长（20–72 原窗口）；
 *  [72]    「忘」闲章 sealStamp 落定（=拍325 对音）+ sparkBurst('s47-seal') 金粒 + paperShake(1.1)；
 *  [76–96] 缓拉 1.0→1.02（76–96 原窗口）露整页，字与印辉光呼吸驻留。
 * 时间轴零改动：96f / 印落 72=拍325 / 下划线 20–72 / 缓拉 76–96 原样 / 无字幕；
 * 无 <Sequence>；random(seed) only（sparkBurst 内建确定性）；fps 取 useVideoConfig；
 * 色板只用 FILM_COLORS2 族。转场：入「切」，出「切」。
 * 镜内文字最低点 y≈930（闲章底缘恰在安全线，落款行 y≈860 上方；bottom 150px 内无镜内文字排入）。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES, sealStamp, sealTilt } from '../../../brand/motion';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';
import { FILM_COLORS2, glowText, handheld, paperShake, sparkBurst, springIn } from '../motion-tokens';

const TOTAL = 96;
const SEAL_AT = 72; // = 绝对 6500 = 拍325（对音锚点，不动）
const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
/** 与 s46 完全一致的列数据（r4：两镜背景版式逐字对齐） */
const COLS = ['不恼心地清凉。', '不怒百神和畅，', '少思慧烛内光。', '常默元气不伤，'];

const S47: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // 缓拉 1.0→1.02（76–96 原窗口）+ handheld 手持微动（全镜不断）
  const shake = handheld('s47-cam', frame, 0.7);
  const pageShake = paperShake(frame, SEAL_AT, 1.1, 9);
  // 落款 springIn（20 弹入，位移入场）
  const signIn = springIn(frame, 20, fps, 15, 180, 0.85);
  // 印落定粒子（72）
  const burst = sparkBurst('s47-seal', frame, SEAL_AT, 10, true);

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <div style={{ position: 'absolute', inset: 0, transform: `translate(${shake.dx}px, ${shake.dy}px) rotate(${shake.rot}deg) scale(${interpolate(frame, [76, TOTAL], [1.0, 1.02], { ...CLAMP, easing: CURVES.cineEaseInOut })}) ${pageShake.transform}` }}>
        {/* 背景与 s46 完全一致：同 seed 深空底 + 四列 landed（全部已落定，呼吸辉光驻留） */}
        <DeepSpace seed="s46v2" stars={44} grid />
        {/* 中央琥珀光晕（与 s46 终态同深浅，微呼吸） */}
        <div
          style={{
            position: 'absolute',
            left: 210,
            top: 90,
            width: 1500,
            height: 900,
            borderRadius: 750,
            background: `radial-gradient(circle, rgba(212,163,115,0.12), rgba(212,163,115,0) 62%)`,
            opacity: 0.5 + 0.03 * Math.sin(frame / 17),
            pointerEvents: 'none',
          }}
        />
        <div style={{ position: 'absolute', left: 0, right: 0, top: 380, display: 'flex', justifyContent: 'center', gap: 130, zIndex: 30 }}>
          {COLS.map((colText, col) => (
            <div key={col} style={{ display: 'flex', gap: 12 }}>
              {colText.split('').map((ch, chIdx) => (
                <span
                  key={chIdx}
                  style={{
                    fontFamily: fontFamilies.serif,
                    fontSize: 74,
                    color: FILM_COLORS2.paperWhite,
                    display: 'inline-block',
                    ...glowText(FILM_COLORS2.paperWhite, 0.22 + 0.05 * Math.sin(frame / 11 + col * 0.8 + chIdx * 0.37)),
                    whiteSpace: 'pre',
                  }}
                >
                  {ch}
                </span>
              ))}
            </div>
          ))}
        </div>
        {/* 落款 springIn 弹入（20 起，位移入场） */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 190,
            textAlign: 'center',
            zIndex: 30,
            opacity: Math.min(1, signIn * 1.4),
            transform: `translateY(${(1 - signIn) * 12}px)`,
          }}
        >
          <span style={{ fontFamily: fontFamilies.serif, fontSize: 32, color: FILM_COLORS2.paperWhite, opacity: 0.85, letterSpacing: '0.1em', ...glowText(FILM_COLORS2.paperWhite, 0.18) }}>——司马承祯《坐忘歌》</span>
          {/* 笔锋下划线 stroke 生长（20–72，琥珀） */}
          <div style={{ margin: '14px auto 0', width: 380, height: 2, background: FILM_COLORS2.data, opacity: 0.5, boxShadow: `0 0 8px rgba(212,163,115,0.35)`, transform: `scaleX(${interpolate(frame, [20, 72], [0, 1], CLAMP)})` }} />
        </div>
        {/* 极小「忘」字闲章（sealStamp 落定 72=拍325·手作签名）+ 落定金粒 */}
        <div style={{ position: 'absolute', right: 560, bottom: 150, zIndex: 30, ...sealStamp(frame, SEAL_AT, 30, sealTilt('s47-wang')) }}>
          <div style={{ width: 74, height: 74, borderRadius: 6, background: FILM_COLORS2.sealRed, opacity: 0.9, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 22px rgba(122,31,22,${0.4 + 0.06 * Math.sin(frame / 9)})` }}>
            <span style={{ fontFamily: fontFamilies.serif, fontSize: 42, color: FILM_COLORS2.paperWhite }}>忘</span>
          </div>
        </div>
        {frame >= SEAL_AT ? (
          <div style={{ position: 'absolute', left: 1323, top: 893, width: 0, height: 0, zIndex: 30, pointerEvents: 'none' }}>
            {burst.map((p, i) => (
              <div key={i} style={p.style} />
            ))}
          </div>
        ) : null}
      </div>
      <HudChrome label="wuh.site · ZUO WANG GE" readout="——司马承祯" />
      <Grade2 id="GR2-07" />
    </AbsoluteFill>
  );
};

export default S47;
