/* S30 · Act 6 入院 · 局部帧 [0,128) · 128f · 绝对 4506–4634
 *
 * 入院·第一扇门：钤印朱红晕光中控制台面板显影（litSet=∅，0–16）；
 * 墨点光标浮现→移 01→悬停→点击涟漪（20–38）；窗口最大化 14f（38–52）——
 * S02 首页墨点时间轴打底 + WIN-02 点亮 sweep；46 枚墨点逐枚点亮
 * （54–94，2 拍扫过，第 46 枚 94=拍228；标识点亮不滚数）+ 条目染色左移；
 * 反向收束回面板（108–124），lit={01}、光标移向 02。
 * 转场：入「墨洇」（20f，晕心=朱红晕光），出「切」。
 * 字幕安全窗：start≥32、end≤116。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, writeFade } from '../../../brand/motion';
import { ConsoleCursor, ConsolePanel } from '../components/ConsolePanel';
import { ExpandWindow } from '../components/ExpandWindow';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { lightSweep } from '../motion-tokens';
import { PaperGrain } from '../components/PaperGrain';

const TOTAL = 128;
const CLICK_AT = 38;
const LIT_FIRST = 54;
const LIT_LAST = 94; // 第 46 枚 = 拍228

const S30: FC = () => {
  const frame = useCurrentFrame();
  const panelIn = interpolate(frame, [0, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const cursorMove = interpolate(frame, [20, 34], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const ripple = interpolate(frame, [CLICK_AT, CLICK_AT + 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const expanded = frame >= CLICK_AT + 2 && frame < TOTAL - 14;
  const sweep = lightSweep(frame, LIT_FIRST, 24);
  // 尾段面板态
  const tailPanel = frame >= TOTAL - 14;

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      {/* 钤印朱红晕光承前（墨洇晕心余韵，0–20 淡出） */}
      {frame < 20 ? <AbsoluteFill style={{ background: `radial-gradient(circle at 70% 60%, rgba(201,111,74,0.16), transparent 60%)`, opacity: 1 - frame / 20 }} /> : null}

      {!expanded ? (
        <>
          <ConsolePanel lit={0} active={1} panelIn={panelIn} />
          <ConsoleCursor active={1} moveProgress={cursorMove} clickRipple={ripple > 0 && ripple < 1 ? ripple : 0} />
          {tailPanel ? <ConsolePanel lit={1} active={2} panelIn={1} /> : null}
          {tailPanel ? <ConsoleCursor active={2} moveProgress={interpolate(frame, [TOTAL - 14, TOTAL], [0, 0.6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} /> : null}
        </>
      ) : (
        <ExpandWindow startAt={CLICK_AT} total={TOTAL} block={1} asset="wuh-site-intro-v3/site/s02-home-timeline-v1.png" dim={0.24} objectPos="center top">
          {/* WIN-02 点亮 sweep */}
          <div style={{ position: 'absolute', top: 0, bottom: 0, width: 240, left: sweep.sweepX, background: `linear-gradient(90deg, transparent, ${FILM_GOLD}, transparent)`, mixBlendMode: 'screen', opacity: sweep.sweepOpacity }} />
          {/* 46 枚墨点逐枚点亮（标识点亮不滚数；随拍扫过） */}
          {Array.from({ length: 46 }).map((_, i) => {
            const col = i % 3;
            const row = Math.floor(i / 3);
            const litAt = LIT_FIRST + (i / 46) * (LIT_LAST - LIT_FIRST);
            const on = frame >= litAt;
            const litOp = on ? interpolate(frame, [litAt, litAt + 6], [0.25, 0.95], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0.25;
            return (
              <div key={i} style={{ position: 'absolute', left: 200 + col * 520, top: 150 + row * 62, display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 12, height: 12, borderRadius: 6, background: colors.accent, opacity: litOp, boxShadow: on ? `0 0 8px 2px rgba(201,111,74,0.35)` : 'none' }} />
                <div style={{ width: 340 - (i % 3) * 60, height: 14, background: on ? colors.paper : colors.muted, opacity: on ? 0.5 : 0.22, transform: on ? `translateX(-6px)` : 'none', transition: 'none' }} />
              </div>
            );
          })}
          {/* 条目染色左移提示（94–104 一条示范） */}
          <div style={{ position: 'absolute', left: 200, top: 150 + 15 * 62, opacity: interpolate(frame, [94, 104], [0, 0.85], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
            <span style={{ fontFamily: fontFamilies.serif, fontSize: 22, color: colors.seal }}>再读《坐忘歌》</span>
          </div>
        </ExpandWindow>
      )}

      <DustField act={6} count={12} seedBase="s30" />
      <PaperGrain opacity={0.05} />
      <Grade id="GR-01" />
      <Caption text="四十六篇文章，一枚枚墨点。" appearAt={34} />
    </AbsoluteFill>
  );
};

const FILM_GOLD = '#F5E9C8';
void writeFade;

export default S30;
