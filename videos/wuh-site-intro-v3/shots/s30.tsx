/* S30 · Act 6 入院 · 局部帧 [0,128) · 128f · 绝对 4506–4634
 *
 * V3 审计返工重写（2026-11-12 storyboard-audit s30 条 + 风格锚点 §9/§10）：巡礼第一镜——
 * 「四十六篇文章，一枚枚墨点」按审计重定义升级为 46 枚墨点事件链（staggerLand accel 加速落位，
 * 前疏后密、末点对音 94=拍228）+ 46 大数字落点冲击。逐拍事件链（局部帧，fps=30）：
 * 【承接】0–20 s29 尾帧交出的朱红晕光原地淡出（晕心窗口原样）；深空底 + Rail 00 态在画。
 * 【触发】20–34 琥珀光标（轨道箭头 + cursorP 微进度）滑至 01 段位 → 38 点击涟漪（窗口原样）
 *         → 40 面板 01 点亮（lit 0→1，窗口原样）。
 * 【展开】① 44–58 「MODULE 01 · POST TIMELINE」标签 + 大数字容器 writeFade 浮入；
 *         ② 54–94 墨点事件链主角表演：staggerLand(46, 54, 40, 'accel') 逐枚落位（末枚恰 94），
 *            每枚 springIn 下落入场（translateY −18→0 + scale 0.6→1，位移入场）+ 落定闪 6f；
 *            一枚辉光「墨针」扫在点亮前沿（54–96 serpentine 扫过 23×2 阵），针至墨点开、
 *            针过留亮链——事件链的「链」由针与点共同演；
 *         ③ 54–94 bigNum 0→46 同窗滚动（54+40=94=绝对 4600=拍228 对音，窗口原样不动）。
 * 【冲击】94 落定瞬间三连：大数字 SLAM 辉光脉冲 + sheenSweep 金光横扫（94–108）+
 *         shockwave 双环（锚第 46 枚墨点位 + 大数字视觉中心各一组）+ sparkBurst 金粒（random(seed)）。
 * 【收笔】94–104 「再读《坐忘歌》」sealRed 染色示范（窗口原样）+ 96–108 朱红笔意下划线 pathDraw。
 * 【交接】114–122 内容层淡出让位交接态；114–128 光标移向 02（尾帧契约：面板 01 亮、光标停 02 前）。
 * 意义一句话：观众第一次看清站点的文字家底——46 篇文章不是数字，是一枚枚落进纸里的墨点。
 * 时间轴零改动：128f / bigNum 54–94（落定 94=拍228）/ 墨点窗 54–94 / Caption
 * 「四十六篇文章，一枚枚墨点。」appearAt 34 / 尾帧交接态语义原样。
 * 转场：入「墨洇」（BloomMask 单侧 20f）→ 出「切」。字幕安全窗：start≥32、end≤116。
 * 镜内文字最低点 y≈830（<930，不进 bottom 150px）；零图片零快照引用；random(seed) only；
 * 无 <Sequence>；springIn fps 取 useVideoConfig()；色板只用 FILM_COLORS2。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES, writeFade } from '../../../brand/motion';
import { bigNum, FILM_COLORS2, glowText, pathDraw, sheenSweep, shockwave, sparkBurst, springIn, staggerLand } from '../motion-tokens';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 128;
const CLICK_AT = 38;
const LIT_FIRST = 54;
const LIT_LAST = 94; // 第 46 枚 = 拍228 对音（窗口原样）
const SLAM_AT = LIT_LAST;

/* 46 枚墨点落位表：accel 前疏后密，末枚恰落 94（staggerLand 保证 start+span） */
const DOT_LANDS = staggerLand(46, LIT_FIRST, LIT_LAST - LIT_FIRST, 'accel');
/* 墨点阵几何：23 列 × 2 行 */
const DOT_X = (i: number): number => 190 + (i % 23) * 70;
const DOT_Y = (i: number): number => 620 + Math.floor(i / 23) * 86;
/* 第 46 枚落点（冲击环锚点） */
const LAST_DOT = { x: DOT_X(45), y: DOT_Y(45) };

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
  const { fps } = useVideoConfig();
  /* 主角大数字（54–94 滚动，落定=拍228） */
  const hero = bigNum(frame, LIT_FIRST, LIT_LAST - LIT_FIRST, 0, 46);
  /* 已点亮枚数（HUD 读数逐帧走，镜内无静止段读数感） */
  const litCount = DOT_LANDS.filter((l) => frame >= l).length;
  /* 墨针：扫在点亮前沿（54–96），serpentine 23×2 阵；94 后驻在第 46 枚渐隐 */
  const needleK = interpolate(frame, [LIT_FIRST, LIT_LAST], [0, 45], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const i0 = Math.min(45, Math.floor(needleK));
  const i1 = Math.min(45, i0 + 1);
  const frac = needleK - i0;
  const needleX = DOT_X(i0) + (DOT_X(i1) - DOT_X(i0)) * frac;
  const needleY = DOT_Y(i0) + (DOT_Y(i1) - DOT_Y(i0)) * frac;
  const needleIn = interpolate(frame, [LIT_FIRST, LIT_FIRST + 4], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const needleOut = interpolate(frame, [SLAM_AT + 4, SLAM_AT + 14], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  /* 轨道态：光标滑至 01（20–34）→ 点击（38）→ 01 亮（40）→ 尾段移向 02（114–128） */
  const cursorMove = interpolate(frame, [20, 34], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const ripple = interpolate(frame, [CLICK_AT, CLICK_AT + 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const tail = frame >= TOTAL - 14;
  const lit = frame >= CLICK_AT + 2 ? 1 : 0;
  const at = tail ? 2 : 1;
  const cursorP = tail ? interpolate(frame, [TOTAL - 14, TOTAL], [0, 0.6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : cursorMove;
  /* 内容尾段淡出（114–122），让位交接态 */
  const contentOut = interpolate(frame, [114, 122], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  /* 94 落定冲击 */
  const waveNum = shockwave(frame, SLAM_AT, '212,163,115');
  const waveDot = shockwave(frame, SLAM_AT, '233,217,174');
  const burstNum = sparkBurst('s30-slam-num', frame, SLAM_AT, 14, true);
  const burstDot = sparkBurst('s30-slam-dot', frame, SLAM_AT, 10, true);
  /* 染色示范下划线（96–108 笔意画出） */
  const underD = 'M 190 838 L 434 838';
  const underline = pathDraw(frame, 96, 12, underD);

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s30v2" stars={56} grid />
      {/* s29 朱红晕光承前（晕心余韵，0–20 淡出） */}
      {frame < 20 ? <AbsoluteFill style={{ background: `radial-gradient(circle at 70% 60%, rgba(122,31,22,0.16), transparent 60%)`, opacity: 1 - frame / 20 }} /> : null}

      {/* 主角：全屏大数字 0→46（落定 SLAM 辉光 + 金光横扫） */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 148, textAlign: 'center', zIndex: 29, opacity: contentOut * interpolate(frame, [44, 50], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
        <span style={{ fontFamily: fontFamilies.mono, fontSize: 17, letterSpacing: '0.4em', color: FILM_COLORS2.textMuted, ...writeFade(frame, 44) }}>{`MODULE 01 · POST TIMELINE · INK ${litCount}/46`}</span>
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
        <div style={sheenSweep(frame, SLAM_AT, 14)} />
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 470, textAlign: 'center', zIndex: 29, opacity: contentOut }}>
        <span style={{ fontFamily: fontFamilies.mono, fontSize: 18, letterSpacing: '0.5em', color: FILM_COLORS2.textMuted, opacity: interpolate(frame, [54, 66], [0, 0.9], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>篇 文章 · 枚枚墨点</span>
      </div>

      {/* 46 枚墨点事件链（逐枚下落入场 + 落定闪；54–94 accel 扫过） */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 28, opacity: contentOut }}>
        {DOT_LANDS.map((land, i) => {
          const p = springIn(frame, land, fps, 17, 210, 0.85);
          if (p <= 0) return null;
          const flash = interpolate(frame, [land, land + 2, land + 9], [0, 0.9, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const isLast = i === 45;
          const litGlow = isLast ? 0.55 + 0.2 * Math.sin(frame / 5) : 0.34;
          return (
            <div key={i} style={{ position: 'absolute', left: DOT_X(i), top: DOT_Y(i), display: 'flex', alignItems: 'center', gap: 10, opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * -18}px) scale(${0.6 + p * 0.4})`, transformOrigin: 'left center' }}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  background: FILM_COLORS2.data,
                  opacity: 0.9,
                  boxShadow: `0 0 ${8 + flash * 16 + (isLast ? 6 : 0)}px ${2 + flash * 3}px rgba(212,163,115,${litGlow + flash * 0.45})`,
                }}
              />
              <div style={{ width: 44, height: 10, borderRadius: 3, background: `rgba(245,240,232,${0.4 + flash * 0.25})`, transform: `translateX(${-5 * Math.min(1, p * 1.4)}px)` }} />
            </div>
          );
        })}
        {/* 墨针（辉光扫在点亮前沿，54–96；含短拖尾） */}
        {needleOut > 0.01 ? (
          <>
            <div style={{ position: 'absolute', left: needleX - 7, top: needleY - 7, width: 14, height: 14, borderRadius: 7, background: FILM_COLORS2.gold, boxShadow: '0 0 18px rgba(233,217,174,0.85), 0 0 44px rgba(212,163,115,0.4)', opacity: needleIn * needleOut, zIndex: 29 }} />
            <div style={{ position: 'absolute', left: needleX - 26 - frac * 40, top: needleY - 3, width: 22 + frac * 36, height: 6, borderRadius: 3, background: `linear-gradient(90deg, rgba(212,163,115,0), rgba(212,163,115,0.5))`, opacity: 0.55 * needleIn * needleOut, zIndex: 28 }} />
          </>
        ) : null}
        {/* 条目染色示范（94–104，sealRed 手作签名）+ 笔意下划线（96–108） */}
        <div style={{ position: 'absolute', left: 190, top: 800, opacity: interpolate(frame, [94, 104], [0, 0.9], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) * contentOut }}>
          <span style={{ fontFamily: fontFamilies.serif, fontSize: 22, color: FILM_COLORS2.sealRed, ...glowText(FILM_COLORS2.sealRed, 0.4, '122,31,22') }}>再读《坐忘歌》</span>
        </div>
        {frame >= 96 && frame <= 118 ? (
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 28, opacity: contentOut }}>
            <path d={underD} fill="none" stroke={FILM_COLORS2.sealRed} strokeWidth={2} strokeLinecap="round" opacity={0.85} strokeDasharray={underline.strokeDasharray} strokeDashoffset={underline.strokeDashoffset} />
          </svg>
        ) : null}
      </div>

      {/* 94 落定冲击：双环 ×2 锚（第 46 枚墨点 + 大数字中心）+ 金粒 ×2 */}
      {frame >= SLAM_AT && frame <= SLAM_AT + 26 ? (
        <div style={{ position: 'absolute', left: LAST_DOT.x, top: LAST_DOT.y, zIndex: 30, pointerEvents: 'none' }}>
          <div style={waveDot?.ring1} />
          <div style={waveDot?.ring2} />
        </div>
      ) : null}
      {frame >= SLAM_AT && frame <= SLAM_AT + 26 ? (
        <div style={{ position: 'absolute', left: '50%', top: 300, width: 0, height: 0, zIndex: 30, pointerEvents: 'none' }}>
          <div style={waveNum?.ring1} />
          <div style={waveNum?.ring2} />
        </div>
      ) : null}
      {frame >= SLAM_AT && frame <= SLAM_AT + 34 ? (
        <div style={{ position: 'absolute', left: '50%', top: 300, width: 0, height: 0, zIndex: 31, pointerEvents: 'none' }}>
          {burstNum.map((s, i) => (
            <div key={`n${i}`} style={s.style} />
          ))}
        </div>
      ) : null}
      {frame >= SLAM_AT && frame <= SLAM_AT + 34 ? (
        <div style={{ position: 'absolute', left: LAST_DOT.x, top: LAST_DOT.y, zIndex: 31, pointerEvents: 'none' }}>
          {burstDot.map((s, i) => (
            <div key={`d${i}`} style={s.style} />
          ))}
        </div>
      ) : null}

      <Rail lit={lit} at={at} cursorP={cursorP} frame={frame} ripple={ripple > 0 && ripple < 1 ? ripple : 0} />
      <HudChrome label="wuh.site · POSTS" readout={frame >= LIT_FIRST ? `INK ${litCount}/46` : 'MODULE 01 · STANDBY'} />
      <Grade2 id="GR2-06" />
      <Caption text="四十六篇文章，一枚枚墨点。" appearAt={34} />
    </AbsoluteFill>
  );
};

export default S30;
