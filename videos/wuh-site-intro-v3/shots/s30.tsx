/* S30 · Act 6 入院 · 局部帧 [0,128) · 128f · 绝对 4506–4634
 *
 * V2 深空数据流重写（2026-11-11 品牌暖黑科技）：入院·第一扇门——原「控制台面板→点击
 * →展开窗」改写为 HUD 模块轨道读数变化（Rail：8 段位 01–08，光标滑至 01（20–34）→
 * 点击涟漪（38，窗口原样）→ 01 点亮（40）→ 尾段光标移向 02（114–128））；
 * 主角数据化：全屏大数字 0→46（★DAT-01 bigNum 54–94 滚动，落定 94=绝对 4600=拍228
 * 对音=第 46 枚点亮，SLAM 辉光）；46 枚墨点数据矩阵逐枚点亮（★DAT-08 dotCascade
 * density 54–94 窗口原样，2 拍扫过，标识点亮不滚数）；「再读《坐忘歌》」染色示范
 * （94–104，sealRed 手作签名）；s29 朱红晕光承前（0–20 淡出，晕心窗口原样）。
 * 转场：入「墨洇」→ ShotShell 光晕呼吸，出「切」。字幕安全窗：start≥32、end≤116。
 * 尾帧：模块轨道 01 亮、光标停在 02 前（交接态：面板+01 亮）。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES, writeFade } from '../../../brand/motion';
import { bigNum, dotCascade, FILM_COLORS2, glowText } from '../motion-tokens';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 128;
const CLICK_AT = 38;
const LIT_FIRST = 54;
const LIT_LAST = 94; // 第 46 枚 = 拍228

/** V2 模块轨道（原控制台面板的 HUD 化替身）：lit=已点亮段数，at=光标所停段位（未点亮），
 *  cursorP=光标滑入微进度，ripple=点击涟漪。尾帧交接态语义：光标停在 0N 前。 */
const Rail: FC<{ lit: number; at: number; cursorP: number; frame: number; ripple: number }> = ({ lit, at, cursorP, frame, ripple }) => {
  const pitch = 74;
  return (
    <div style={{ position: 'absolute', left: '50%', top: 92, width: 582, marginLeft: -291, zIndex: 26 }}>
      <div style={{ display: 'flex', gap: 10 }}>
        {Array.from({ length: 8 }).map((_, i) => {
          const n = i + 1;
          const on = n <= lit;
          const active = n === at && on;
          return (
            <div key={n} style={{ width: 64 }}>
              <div
                style={{
                  textAlign: 'center',
                  fontFamily: fontFamilies.mono,
                  fontSize: 13,
                  letterSpacing: '0.18em',
                  color: on ? FILM_COLORS2.data : n === at ? FILM_COLORS2.gold : FILM_COLORS2.textMuted,
                  opacity: on ? 0.95 : n === at ? 0.9 : 0.5,
                  ...(active ? glowText(FILM_COLORS2.data, 0.4 + 0.15 * Math.sin(frame / 6)) : {}),
                }}
              >
                {String(n).padStart(2, '0')}
              </div>
              <div
                style={{
                  marginTop: 6,
                  height: 3,
                  borderRadius: 2,
                  background: on ? FILM_COLORS2.data : FILM_COLORS2.line,
                  boxShadow: on ? `0 0 8px rgba(212,163,115,${active ? 0.4 + 0.2 * Math.sin(frame / 6) : 0.45})` : 'none',
                  opacity: on ? 1 : 0.5,
                }}
              />
            </div>
          );
        })}
      </div>
      {/* 光标：停在 at 段位之前 */}
      {at > lit ? (
        <div
          style={{
            position: 'absolute',
            top: 14,
            left: (at - 1) * pitch - 14 + cursorP * 8,
            width: 0,
            height: 0,
            borderTop: '5px solid transparent',
            borderBottom: '5px solid transparent',
            borderLeft: `7px solid ${FILM_COLORS2.gold}`,
            opacity: 0.9,
            filter: 'drop-shadow(0 0 6px rgba(212,163,115,0.6))',
          }}
        />
      ) : null}
      {/* 点击涟漪（at 段位中心） */}
      {ripple > 0 && ripple < 1 ? (
        <div
          style={{
            position: 'absolute',
            top: 9 - 22 * ripple,
            left: (at - 1) * pitch + 32 - (12 + 44 * ripple) / 2,
            width: 12 + 44 * ripple,
            height: 12 + 44 * ripple,
            borderRadius: 20,
            border: `1.5px solid ${FILM_COLORS2.gold}`,
            opacity: (1 - ripple) * 0.9,
          }}
        />
      ) : null}
    </div>
  );
};

const S30: FC = () => {
  const frame = useCurrentFrame();
  /* 主角大数字（54–94 滚动，落定=拍228） */
  const hero = bigNum(frame, 54, 40, 0, 46);
  /* 46 枚墨点数据矩阵（density 54–94，窗口原样） */
  const dots = dotCascade(frame, 46, 'density', LIT_FIRST, LIT_LAST);
  /* 轨道态：光标滑至 01（20–34）→ 点击（38）→ 01 亮（40）→ 尾段移向 02（114–128） */
  const cursorMove = interpolate(frame, [20, 34], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const ripple = interpolate(frame, [CLICK_AT, CLICK_AT + 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const tail = frame >= TOTAL - 14;
  const lit = frame >= CLICK_AT + 2 ? 1 : 0;
  const at = tail ? 2 : 1;
  const cursorP = tail ? interpolate(frame, [TOTAL - 14, TOTAL], [0, 0.6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : cursorMove;
  /* 内容尾段淡出（114–122），让位交接态 */
  const contentOut = interpolate(frame, [114, 122], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s30v2" stars={56} grid />
      {/* s29 朱红晕光承前（晕心余韵，0–20 淡出） */}
      {frame < 20 ? <AbsoluteFill style={{ background: `radial-gradient(circle at 70% 60%, rgba(122,31,22,0.16), transparent 60%)`, opacity: 1 - frame / 20 }} /> : null}

      {/* 主角：全屏大数字 0→46（落定 SLAM 辉光） */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 148, textAlign: 'center', zIndex: 29, opacity: contentOut * interpolate(frame, [44, 50], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
        <span style={{ fontFamily: fontFamilies.mono, fontSize: 17, letterSpacing: '0.4em', color: FILM_COLORS2.textMuted, ...writeFade(frame, 44) }}>MODULE 01 · POST TIMELINE</span>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 190,
          textAlign: 'center',
          zIndex: 29,
          fontFamily: fontFamilies.mono,
          fontSize: 230,
          fontWeight: 700,
          lineHeight: 1.05,
          color: FILM_COLORS2.data,
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '0.02em',
          opacity: contentOut * interpolate(frame, [50, 58], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          transform: `scale(${hero.slam})`,
          ...glowText(FILM_COLORS2.data, hero.glow),
        }}
      >
        {hero.text}
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 470, textAlign: 'center', zIndex: 29, opacity: contentOut }}>
        <span style={{ fontFamily: fontFamilies.mono, fontSize: 18, letterSpacing: '0.5em', color: FILM_COLORS2.textMuted, opacity: interpolate(frame, [54, 66], [0, 0.9], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>篇 文章 · 枚枚墨点</span>
      </div>

      {/* 46 枚墨点数据矩阵（逐枚点亮；随拍扫过） */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 28, opacity: contentOut }}>
        {dots.map((d) => {
          const col = d.i % 23;
          const row = Math.floor(d.i / 23);
          const x = 190 + col * 70;
          const y = 620 + row * 86;
          const on = frame >= d.land;
          return (
            <div key={d.i} style={{ position: 'absolute', left: x, top: y, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  background: on ? FILM_COLORS2.data : FILM_COLORS2.dataDim,
                  opacity: on ? interpolate(frame, [d.land, d.land + 6], [0.3, 0.95], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0.22,
                  boxShadow: on ? `0 0 ${8 + d.flash * 14}px ${2 + d.flash * 3}px rgba(212,163,115,${0.2 + d.flash * 0.4})` : 'none',
                }}
              />
              <div style={{ width: 44, height: 10, borderRadius: 3, background: on ? `rgba(245,240,232,0.4)` : `rgba(245,240,232,0.12)`, transform: on ? 'translateX(-5px)' : 'none' }} />
            </div>
          );
        })}
        {/* 条目染色示范（94–104，sealRed 手作签名） */}
        <div style={{ position: 'absolute', left: 190, top: 800, opacity: interpolate(frame, [94, 104], [0, 0.9], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
          <span style={{ fontFamily: fontFamilies.serif, fontSize: 22, color: FILM_COLORS2.sealRed, ...glowText(FILM_COLORS2.sealRed, 0.4, '122,31,22') }}>再读《坐忘歌》</span>
        </div>
      </div>

      <Rail lit={lit} at={at} cursorP={cursorP} frame={frame} ripple={ripple > 0 && ripple < 1 ? ripple : 0} />
      <HudChrome label="wuh.site · POSTS" readout="MODULE 01" />
      <Grade2 id="GR2-06" />
      <Caption text="四十六篇文章，一枚枚墨点。" appearAt={34} />
    </AbsoluteFill>
  );
};

export default S30;
