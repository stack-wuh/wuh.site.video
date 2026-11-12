/* S45 · Act 7 坐忘 · 局部帧 [0,174) · 174f · 绝对 5954–6128
 * V3 内容本体化重构（2026-11-11 §3 二次修正令：全片禁用网站截图，数据件当主角）· 逐拍事件链（局部帧，fps=30）：
 * [0–174]   CameraRig scale 1.05→1.01 缓拉 + handheld('s45-cam', 1.2) 手持颤动；
 * [0–174]   背景数字雨帘 dataCurtain('s45-rain', 16 列, 170v)（DeepSpace 之上、信息层之下，峰值 opacity 按 token ≤0.22）；
 * [0–28]    榜单铺陈：第 2–5 名榜行自下方 8f 均错峰滑入（springIn），dim 态（dataDim 徽标+题名+数值，整体 opacity≈0.5，呼吸微动）；
 *           第 1 名行位留空——只放一条金色刻线呼吸，为 46f 的 bigNum 让台；
 * [30–44]   小标「READS RANK · 2026-07 · TOP 5」typeCharsAt 键击逐字（2 字/f，mono 15 textMuted）+ 键击光标；
 * [46–106]  主角 bigNum 0→1,842 全屏滚动落定（46+60=106=绝对 6060 ≈ ANCHOR roll1842 6058=拍303 对音，slam/辉光 token 自带）；
 * [96–108]  sheenSweep(frame, 96, 12) 金光亮带扫过大数字容器；
 * [106]     落定瞬间：shockwave 暖金双环 rgb'233,217,174' + sparkBurst('s45-burst', 18 粒, 金) 定位于大数字视觉中心（数字层之后、HUD 之前）；
 *           同帧：第一名榜行 springIn 就位（题名+数值+金条+辉光，辉光与 bigNum 落定脉冲同拍），HUD readout ROLLING… → VIEWS #1 · 1,842；
 * [106–150] 榜行生长：第 1 名条 106 起与冲击同帧生长（18f），数值 numRoll(106,18) 微滚；
 *           第 2–5 名 dim 行条形值 staggerLand(5,108,30,'accel')[i] 错峰自 0 生长 + 数值 numRoll(delay,18) 微滚 + 全体转亮（dim→亮）；
 * [120–156] 题名《再读〈坐忘歌〉》kineticChars 逐字弹入（step 3f/字，serif 46 paperWhite，原文案原位置）；
 * [154–174] 尾帧交接态：榜单定格 + 第一名榜行 rotateY(-8deg)（origin left）渐起 = 纸页翻起一半；末 18f 主条扫光（156–174）。
 * 时间轴零改动：174f / bigNum 46–106 / Caption（appearAt 14 · bottom 150）原样；无任何 Img/staticFile（§3 口径）。
 * 转场：入「切」，出「切」。字幕安全窗：start≥12。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import {
  bigNum,
  chartBar,
  cursorBlink,
  dataCurtain,
  FILM_COLORS2,
  fmtNum,
  glowText,
  handheld,
  kineticChars,
  numRoll,
  shockwave,
  sheenSweep,
  sparkBurst,
  springIn,
  staggerLand,
  typeCharsAt,
} from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 174;
/* 对音锚点：滚动落定 46+60=106 = 绝对 6060 ≈ ANCHOR roll1842(6058) = 拍303 —— 窗口不动 */
const ROLL_START = 46;
const ROLL_DUR = 60;
const LAND_AT = ROLL_START + ROLL_DUR; // 106
const TITLE_START = 120; // kineticChars 题名起（120–156）
/* 2–5 名 dim 行生长落定表（accel 前疏后密，取 [1..4]）：[111, 118, 126, 138]；第 1 名条与 106 冲击同帧 */
const BAR_LANDS = staggerLand(5, 108, 30, 'accel');
const KICKER = 'READS RANK · 2026-07 · TOP 5';

const RANKS = [
  { title: '再读《坐忘歌》', views: 1842, top: true },
  { title: 'codex 的开发范式', views: 1513 },
  { title: '重启计划', views: 1375 },
  { title: 'docker 配置镜像源', views: 1298 },
  { title: '使用 vitepress 搭建 wiki', views: 1271 },
];

const S45: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  /* 主角大数字（46–106 滚动，落定=拍303） */
  const hero = bigNum(frame, ROLL_START, ROLL_DUR, 0, 1842);
  /* 小标键击逐字（30–44，2 字/f）+ 键击光标 */
  const typed = typeCharsAt(frame, KICKER.length, 30, 0.5);
  /* 落定瞬间（106）：暖金双环 + 金粒 */
  const wave = shockwave(frame, LAND_AT, '233,217,174');
  const burst = sparkBurst('s45-burst', frame, LAND_AT, 18, true);
  /* 背景数字雨帘（46–174 信息层之下） */
  const rain = dataCurtain('s45-rain', frame, 16, 170);
  /* 题名逐字弹入（120–156，3f/字）+ 副标随后显影 */
  const titleChars = kineticChars('《再读〈坐忘歌〉》', frame, TITLE_START, 3, fps);
  const subIn = interpolate(frame, [134, 148], [0, 0.9], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  /* 尾态：末 18f 主条扫光（保留）+ 第一名榜行纸页翻起一半（154–174 rotateY -8°） */
  const sweepP = interpolate(frame, [156, TOTAL], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const flipP = interpolate(frame, [154, TOTAL], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  /* CameraRig：1.05→1.01 缓拉 + handheld 颤动 */
  const shake = handheld('s45-cam', frame, 1.2);
  const cam = {
    scale: interpolate(frame, [0, TOTAL], [1.05, 1.01], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    x: shake.dx,
    y: shake.dy,
    rot: shake.rot,
  };

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s45v2" stars={58} grid horizon />
      <CameraRig cam={cam}>
        <AbsoluteFill>
          {/* 背景数字雨帘（46–174；DeepSpace 之上、信息层之下，峰值 opacity 按 token ≤0.22） */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 2, overflow: 'hidden', pointerEvents: 'none' }}>
            {rain.map((c, i) => (
              <span
                key={i}
                style={{
                  position: 'absolute',
                  left: `${c.x}%`,
                  top: c.y,
                  fontFamily: fontFamilies.mono,
                  fontSize: 18,
                  color: FILM_COLORS2.data,
                  opacity: c.o,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {c.text}
              </span>
            ))}
          </div>

          {/* 小标键击逐字（30–44，mono 15 textMuted + 字距；键击光标随打随闪） */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center', zIndex: 30, whiteSpace: 'pre' }}>
            <span style={{ fontFamily: fontFamilies.mono, fontSize: 15, letterSpacing: '0.4em', color: FILM_COLORS2.textMuted }}>{KICKER.slice(0, typed)}</span>
            {frame >= 30 && typed < KICKER.length ? (
              <span
                style={{
                  display: 'inline-block',
                  width: 9,
                  height: 16,
                  marginLeft: 6,
                  verticalAlign: '-2px',
                  background: FILM_COLORS2.textMuted,
                  opacity: cursorBlink(frame, 30, 4, 4) ? 0.9 : 0.25,
                }}
              />
            ) : null}
          </div>

          {/* 主角：全屏大数字 0→1,842（落定 SLAM 辉光；96–108 金光亮带扫过容器） */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 250,
              textAlign: 'center',
              zIndex: 30,
              fontFamily: fontFamilies.mono,
              fontSize: 300,
              fontWeight: 700,
              lineHeight: 1.05,
              color: FILM_COLORS2.data,
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '0.02em',
              opacity: interpolate(frame, [46, 58], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
              transform: `scale(${hero.slam})`,
              ...glowText(FILM_COLORS2.data, hero.glow),
            }}
          >
            {hero.text}
            <div style={sheenSweep(frame, 96, 12)} />
          </div>

          {/* 落定瞬间（106）：暖金双环 + 金粒，锚在大数字视觉中心（top 250+157≈407，水平居中） */}
          {frame >= LAND_AT ? (
            <div style={{ position: 'absolute', left: '50%', top: 407, width: 0, height: 0, zIndex: 30, pointerEvents: 'none' }}>
              {wave ? <div style={wave.ring1} /> : null}
              {wave ? <div style={wave.ring2} /> : null}
              {burst.map((p, i) => (
                <div key={i} style={p.style} />
              ))}
            </div>
          ) : null}

          <div style={{ position: 'absolute', left: 0, right: 0, top: 596, textAlign: 'center', zIndex: 30 }}>
            <span style={{ fontFamily: fontFamilies.mono, fontSize: 18, letterSpacing: '0.5em', color: FILM_COLORS2.textMuted, opacity: interpolate(frame, [46, 60], [0, 0.9], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>次 阅读 · 全站之最</span>
          </div>

          {/* 题名（120–156 kineticChars 逐字弹入，原文案原位置）+ 副标随后显影 */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 636, textAlign: 'center', zIndex: 30 }}>
            <span style={{ fontFamily: fontFamilies.serif, fontSize: 46, color: FILM_COLORS2.paperWhite }}>
              {titleChars.map((c, i) => (
                <span key={i} style={c.style}>
                  {c.ch}
                </span>
              ))}
            </span>
            <span style={{ fontFamily: fontFamilies.mono, fontSize: 16, letterSpacing: '0.26em', color: FILM_COLORS2.gold, opacity: subIn, marginLeft: 26 }}>全站阅读最多 · 非技术文</span>
          </div>

          {/* 榜单数据阵列：0–28 dim 铺陈（2–5 名）→ 106 第 1 名随冲击就位 → 106–150 条形生长/微滚/转亮 */}
          <div style={{ position: 'absolute', left: 330, right: 330, bottom: 210, zIndex: 29, perspective: 900 }}>
            {/* 第 1 名行位留空：金色刻线呼吸（0–106，为 bigNum 让台） */}
            {frame < LAND_AT ? (
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: 11,
                  width: 220,
                  height: 2,
                  marginLeft: -110,
                  background: FILM_COLORS2.gold,
                  opacity: 0.22 + 0.18 * Math.sin(frame / 12),
                  boxShadow: `0 0 12px rgba(233,217,174,0.35)`,
                }}
              />
            ) : null}
            {RANKS.map((r, i) => {
              const isTop = r.top;
              /* dim 4 行 0/8/16/24 错峰 springIn 滑入；第 1 名行 106 冲击同帧就位 */
              const enterDelay = isTop ? LAND_AT : 8 * (i - 1);
              const enterP = springIn(frame, enterDelay, fps);
              /* 条形生长：第 1 名 106 同冲击，其余 staggerLand 错峰（111/118/126/138） */
              const barDelay = isTop ? LAND_AT : BAR_LANDS[i];
              const bar = chartBar(frame, barDelay, 18, r.views / 1842);
              const valRoll = numRoll(frame, barDelay, 18, 0, r.views);
              /* 全体转亮：dim 0.5 → 1 随各自条形落定；呼吸微动防静止 */
              const brightP = isTop ? 1 : interpolate(frame, [barDelay, barDelay + 10], [0.5, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
              const breathe = isTop ? 0 : 0.04 * Math.sin(frame / 14 + i * 1.7);
              const opacity = isTop ? Math.min(1, enterP * 1.4) : Math.min(1, enterP * (brightP + breathe));
              const covered = bar.widthPct > 26; // 条形已盖过徽标+题名区（换暗字）
              const valueOnGold = isTop && bar.widthPct > 96; // 第 1 名条盖到右端（数值换暗字）
              const enterT = isTop ? `translateY(${(1 - enterP) * 26}px) scale(${0.92 + enterP * 0.08})` : `translateY(${(1 - enterP) * 26}px)`;
              const sweepX = interpolate(sweepP, [0, 1], [-4, 104], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
              const badgeC = isTop ? FILM_COLORS2.gold : frame >= barDelay ? FILM_COLORS2.data : FILM_COLORS2.dataDim;
              return (
                <div
                  key={r.title}
                  style={{
                    position: 'relative',
                    height: 24,
                    marginBottom: 9,
                    opacity,
                    transform: isTop ? `${enterT} rotateY(${flipP * -8}deg)` : enterT,
                    transformOrigin: 'left center',
                  }}
                >
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '100%', background: FILM_COLORS2.grid, borderRadius: 3 }} />
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: `${bar.widthPct}%`,
                      borderRadius: 3,
                      background: isTop ? FILM_COLORS2.gold : FILM_COLORS2.data,
                      /* 第 1 名辉光与 bigNum 落定脉冲同拍（hero.glow 106 起 1→呼吸收敛） */
                      boxShadow: isTop ? `0 0 ${10 + hero.glow * 16}px rgba(233,217,174,${hero.glow * 0.5})` : 'none',
                    }}
                  />
                  {/* 末 18f 主条扫光（尾态保留；金光口径） */}
                  {isTop && sweepP > 0 && sweepP < 1 ? (
                    <div style={{ position: 'absolute', left: `${sweepX}%`, top: -2, bottom: -2, width: 90, background: `linear-gradient(90deg, transparent, ${FILM_COLORS2.gold}, transparent)`, opacity: 0.8, filter: 'blur(1px)' }} />
                  ) : null}
                  {/* rank 徽标 */}
                  <span
                    style={{
                      position: 'absolute',
                      left: 14,
                      top: '50%',
                      transform: 'translateY(-52%)',
                      fontFamily: fontFamilies.mono,
                      fontSize: 12,
                      letterSpacing: '0.08em',
                      padding: '1px 6px',
                      border: `1px solid ${badgeC}`,
                      borderRadius: 3,
                      color: badgeC,
                    }}
                  >
                    {`#${i + 1}`}
                  </span>
                  <span style={{ position: 'absolute', left: 58, top: '50%', transform: 'translateY(-52%)', fontFamily: fontFamilies.serif, fontSize: 16, color: covered ? FILM_COLORS2.spaceDeep : FILM_COLORS2.dataDim, whiteSpace: 'nowrap' }}>{r.title}</span>
                  <span style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-52%)', fontFamily: fontFamilies.mono, fontSize: 15, color: valueOnGold ? FILM_COLORS2.spaceDeep : frame >= barDelay ? FILM_COLORS2.paperWhite : FILM_COLORS2.dataDim, opacity: valueOnGold ? 0.95 : 0.85, fontVariantNumeric: 'tabular-nums' }}>{frame >= barDelay ? fmtNum(valRoll) : fmtNum(r.views)}</span>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      </CameraRig>

      <HudChrome label="wuh.site · READS" readout={frame >= LAND_AT ? 'VIEWS #1 · 1,842' : 'ROLLING…'} />
      <Grade2 id="GR2-07" />
      <Caption text="七月，全站阅读最多的一篇不是技术，是《再读〈坐忘歌〉》——1,842 次。" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S45;
