/* S47 · Act 7 坐忘 · 局部帧 [0,96) · 96f · 绝对 6428–6524
 *
 * 落款（r4 纪律：背景与镜 46 完全一致——同一 DeepSpace seed 同一四列右起 landed
 * 版式，无 LOWER_TOP）—— V2 深空数据流重构（2026-11-11）：暖纸白四列停驻带辉光；
 * 底部落款位「——司马承祯《坐忘歌》」笔锋 stroke 生长（20–72=绝对 6448–6500，
 * 小字衬线 + 琥珀下划线同窗生长）；极小「忘」字闲章 4f 落定 72=绝对 6500=拍325
 * （本镜唯一朱红·手作签名）；缓拉 100→102%（76–96 原窗口）露整页。
 * 转场：入「切」，出「切」。无字幕（画面落款）。
 * 尾帧：整页字与印静止。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES, sealStamp, sealTilt, writeFade } from '../../../brand/motion';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';
import { FILM_COLORS2, glowText } from '../motion-tokens';

const TOTAL = 96;
/** 与 s46 完全一致的列数据（r4：两镜背景版式逐字对齐） */
const COLS = ['不恼心地清凉。', '不怒百神和畅，', '少思慧烛内光。', '常默元气不伤，'];

const S47: FC = () => {
  const frame = useCurrentFrame();
  const cam = { scale: interpolate(frame, [76, TOTAL], [1.0, 1.02], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }), x: 0, y: 0, rot: 0 };

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${cam.scale})` }}>
        {/* 背景与 s46 完全一致：同 seed 深空底 + 四列 landed（全部已落定） */}
        <DeepSpace seed="s46v2" stars={44} grid />
        {/* 中央琥珀光晕（与 s46 终态同深浅） */}
        <div
          style={{
            position: 'absolute',
            left: 210,
            top: 90,
            width: 1500,
            height: 900,
            borderRadius: 750,
            background: `radial-gradient(circle, rgba(212,163,115,0.12), rgba(212,163,115,0) 62%)`,
            opacity: 0.5,
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
                    ...glowText(FILM_COLORS2.paperWhite, 0.28),
                    whiteSpace: 'pre',
                  }}
                >
                  {ch}
                </span>
              ))}
            </div>
          ))}
        </div>
        {/* 落款笔锋生长（20–72） */}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 190, textAlign: 'center', zIndex: 30, ...writeFade(frame, 20, true) }}>
          <span style={{ fontFamily: fontFamilies.serif, fontSize: 32, color: FILM_COLORS2.paperWhite, opacity: 0.85, letterSpacing: '0.1em' }}>——司马承祯《坐忘歌》</span>
          {/* 笔锋下划线 stroke 生长（20–72，琥珀） */}
          <div style={{ margin: '14px auto 0', width: 380, height: 2, background: FILM_COLORS2.data, opacity: 0.5, boxShadow: `0 0 8px rgba(212,163,115,0.35)`, transform: `scaleX(${interpolate(frame, [20, 72], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })})` }} />
        </div>
        {/* 极小「忘」字闲章（4f 落定 72=拍325·手作签名） */}
        <div style={{ position: 'absolute', right: 560, bottom: 150, zIndex: 30, ...sealStamp(frame, 72, 30, sealTilt('s47-wang')) }}>
          <div style={{ width: 74, height: 74, borderRadius: 6, background: FILM_COLORS2.sealRed, opacity: 0.9, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 22px rgba(122,31,22,0.4)` }}>
            <span style={{ fontFamily: fontFamilies.serif, fontSize: 42, color: FILM_COLORS2.paperWhite }}>忘</span>
          </div>
        </div>
      </div>
      <HudChrome label="wuh.site · ZUO WANG GE" readout="——司马承祯" />
      <Grade2 id="GR2-07" />
    </AbsoluteFill>
  );
};

export default S47;
