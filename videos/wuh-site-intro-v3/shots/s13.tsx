/* S13 · Act 3 第一行 · 局部帧 [0,180) · 180f · 绝对 1962–2142
 *
 * V3 批次 A 重做（2026-11-12 六门验收 + 审计返工单 · 审计重定义：按年文章数累积数据条）：
 * 【承接】首帧承接 s12 尾帧交出的「2022 档案页整版入画」——同页展开：深色档案卡上，
 *         年度总结金句逐字浮出，页脚亮出按年累积的文章数数据条。
 * 【触发】主动作 = 金句 44 字逐字浮出（write-fade 12+i*3.3 原节奏，『每一天…』起琥珀数据
 *         色+辉光，WARM_FROM=17 原位）；页脚「按年累积」数据条 springIn 落位（96/116，
 *         位移入场）：2019 首篇 → 2022-02 本篇 #37（累积 37 篇，numRoll 1→37）——分年数
 *         以本镜 #37 标识与 s02「第一篇」事实为据；「现 1,160 阅读」微滚 118–138
 *         （落定 138=绝对 2100=ANCHORS.warmSettle=拍105，对音絕不动）。
 * 【展开】逐拍帧表（局部帧，fps=30）：
 *   [0–11]    档案卡驻留（承接 s12）+ handheld('s13-cam',1.0) + dataCurtain('s13-rain',6 列,100)；
 *   [12–165]  金句逐字浮出（前 17 字 paperWhite，其后琥珀+辉光；cam scale 1.05 原样）；
 *   [92]      页脚数据条题标「POSTS · 按年累积」writeFade；
 *   [96–134]  两条累积数据条 staggerLand(2,96,20,'accel') springIn：2019·首篇（1 篇）→
 *             2022·02·本篇（chartBar 生长 18f + 累积值 numRoll 1→37，134 落定）；
 *   [118–138] 「现 1,160 阅读」numRoll 微滚（1100→1160），落定=拍105 静默 + 辉光脉冲；
 *   [138–150] 「热度榜 #6」gold 标识落位即现（原窗）；
 *   [150–180] 档案页右下角掀起（150 原窗：深色折面 + 琥珀折痕光）——尾帧交接态。
 * 【交接】尾帧 = 暖句整句停住、纸角掀起（manifest endFrameDesc：暖句整句停住，纸角掀起）
 *         → 交 s14「他还是继续写」连年写作。
 * 意义一句话：一句「不要停步不前」的年度承诺，配着「首篇→第 37 篇」的累积数据条——写作在复利。
 * 时间轴零改动：180f / 金句 12+i*3.3 / 数据条 96–134 / 阅读 118–138（落定 138 对音）/ 掀角 150–180 /
 * Caption（appearAt 14）原样；读数行自 bottom 44 上移出字幕安全区（门 4）。
 * 转场：入「切」，出「切」。字幕安全窗：start≥14、end≤150。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES, writeFade } from '../../../brand/motion';
import {
  FILM_COLORS2,
  chartBar,
  dataCurtain,
  glowText,
  handheld,
  numRoll,
  ROLL_DUR,
  springIn,
  staggerLand,
} from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 180;
const WARM_FROM = 17; // 「每一天…」半句起的字符位（琥珀数据色起点）
/** 按年累积数据条（审计重定义）：2019 首篇 1 篇 → 2022-02 本篇 #37（累积 37，事实=本镜页码标识） */
const LADDER = [
  { label: '2019 · 首篇', v: 1, ratio: 1 / 37, top: false },
  { label: '2022 · 02 · 本篇', v: 37, ratio: 1, top: true },
];
/** 数据条 springIn 落定表（accel）：[96, 116] */
const LADDER_LANDS = staggerLand(2, 96, 20, 'accel');
const QUOTE_TEXT = '2022 年 2 月，他写《2022 年度总结》：『不要停步不前，每一天都要做出一点改变。』';

const S13: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hh = handheld('s13-cam', frame, 1.0);
  const cam = { scale: 1.05, x: hh.dx, y: hh.dy, rot: hh.rot };
  // ★按年累积数据条：springIn 落位 + chartBar 生长 + 累积值 numRoll 1→37
  const ladder = LADDER.map((r, i) => ({
    ...r,
    enter: springIn(frame, LADDER_LANDS[i], fps),
    bar: chartBar(frame, LADDER_LANDS[i] + 4, 18, r.ratio),
    roll: Math.round(numRoll(frame, LADDER_LANDS[i] + 4, 18, 1, r.v)),
  }));
  // ★DAT-01 微滚（118–138 落定=拍105）
  const views = Math.round(numRoll(frame, 118, ROLL_DUR.micro, 1100, 1160));
  const viewsGlow = interpolate(frame, [138, 142, 160], [0.3, 0.7, 0.3], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cornerIn = writeFade(frame, 118);
  // 末 30f 档案页掀起一角（150–180）
  const corner = interpolate(frame, [150, TOTAL], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const rain = dataCurtain('s13-rain', frame, 6, 100);

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s13v2" stars={54} grid />
      {/* 数字雨帘（背景氛围层） */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 2, pointerEvents: 'none' }}>
        {rain.map((c, i) => (
          <span key={`rain-${i}`} style={{ position: 'absolute', left: `${c.x}%`, top: c.y, fontFamily: fontFamilies.mono, fontSize: 13, color: FILM_COLORS2.data, opacity: c.o, fontVariantNumeric: 'tabular-nums' }}>
            {c.text}
          </span>
        ))}
      </div>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          {/* 深色档案卡（承接上镜整版） */}
          <div style={{ position: 'absolute', left: 170, top: 90, right: 170, bottom: 90, borderRadius: 8, background: FILM_COLORS2.panel, border: `1px solid ${FILM_COLORS2.grid}`, boxShadow: `0 24px 60px rgba(0,0,0,0.55)`, overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: 50, top: 40, fontFamily: fontFamilies.mono, fontSize: 20, color: FILM_COLORS2.textMuted, fontVariantNumeric: 'tabular-nums' }}>2022-02-08</div>
            {/* 右上极小字出处（标识，自底部上移出字幕安全区） */}
            <div style={{ position: 'absolute', right: 60, top: 44, fontFamily: fontFamilies.mono, fontSize: 15, color: FILM_COLORS2.textMuted, opacity: 0.7 }}>#37 · 2022</div>
            <div style={{ position: 'absolute', left: 50, right: 50, top: 110, height: 1, background: FILM_COLORS2.line, opacity: 0.6 }} />
            {/* 金句逐字浮出（衬线大字；「每一天…」起琥珀数据色+辉光） */}
            <div style={{ position: 'absolute', left: 90, right: 90, top: 220 }}>
              {QUOTE_TEXT.split('').map((ch, i) => {
                const warm = i >= WARM_FROM;
                return (
                  <span
                    key={`q-${i}`}
                    style={{
                      ...writeFade(frame, 12 + i * 3.3),
                      display: 'inline-block',
                      fontFamily: fontFamilies.serif,
                      fontSize: 44,
                      lineHeight: 1.8,
                      color: warm ? FILM_COLORS2.data : FILM_COLORS2.paperWhite,
                      ...(warm ? glowText(FILM_COLORS2.data, 0.3) : {}),
                      whiteSpace: 'pre',
                    }}
                  >
                    {ch}
                  </span>
                );
              })}
            </div>
            {/* ★按年累积数据条（审计重定义）：题标 + 两条累积行 */}
            <div style={{ position: 'absolute', left: 60, right: 60, top: 420 }}>
              <div style={{ ...writeFade(frame, 92), marginBottom: 10 }}>
                <span style={{ fontFamily: fontFamilies.mono, fontSize: 13, letterSpacing: '0.3em', color: FILM_COLORS2.textMuted }}>POSTS · 按年累积</span>
              </div>
              {ladder.map((r, i) => {
                const covered = r.bar.widthPct > 30;
                return (
                  <div key={`lad-${i}`} style={{ position: 'relative', height: 24, marginBottom: 9, opacity: Math.min(1, r.enter * 1.4), transform: `translateX(${(1 - r.enter) * -26}px)` }}>
                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '100%', background: FILM_COLORS2.grid, borderRadius: 3 }} />
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: `${Math.max(1.2, r.bar.widthPct)}%`,
                        borderRadius: 3,
                        background: r.top ? FILM_COLORS2.data : FILM_COLORS2.dataDim,
                        boxShadow: r.top ? `0 0 ${8 + r.bar.glow * 14}px rgba(212,163,115,${r.bar.glow * 0.45})` : 'none',
                      }}
                    />
                    <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-52%)', fontFamily: fontFamilies.mono, fontSize: 14, color: covered ? FILM_COLORS2.spaceDeep : FILM_COLORS2.textMuted, whiteSpace: 'nowrap' }}>{r.label}</span>
                    <span style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-52%)', fontFamily: fontFamilies.mono, fontSize: 15, color: FILM_COLORS2.paperWhite, opacity: 0.88, fontVariantNumeric: 'tabular-nums' }}>{frame >= LADDER_LANDS[i] + 4 ? r.roll : '…'}</span>
                  </div>
                );
              })}
            </div>
            {/* 数据读数行：现 1,160 阅读 · 热度榜 #6（量滚 + 标识落位即现；已让出字幕安全区） */}
            <div style={{ position: 'absolute', left: 60, bottom: 176, ...cornerIn, display: 'flex', alignItems: 'baseline' }}>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 17, color: FILM_COLORS2.data, fontVariantNumeric: 'tabular-nums', ...(frame >= 138 ? glowText(FILM_COLORS2.data, viewsGlow) : {}) }}>现 {views.toLocaleString('en-US')} 阅读</span>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 17, color: FILM_COLORS2.gold, opacity: interpolate(frame, [138, 150], [0, 0.9], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}> · 热度榜 #6</span>
            </div>
            {/* 末 30f 掀角（右下角翻起：深色折面 + 琥珀折痕光） */}
            <div
              style={{
                position: 'absolute',
                right: 0,
                bottom: 0,
                width: 200,
                height: 160,
                background: FILM_COLORS2.spaceDeep,
                opacity: corner,
                clipPath: `polygon(100% 0, 100% 100%, 0 100%)`,
                transform: `rotate(${corner * 0.5}deg)`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                right: 0,
                bottom: 0,
                width: 200,
                height: 160,
                background: `linear-gradient(315deg, rgba(212,163,115,0.24), rgba(212,163,115,0.04))`,
                opacity: corner,
                clipPath: `polygon(100% 0, 0 100%, 100% 100%)`,
                boxShadow: `-6px -6px 18px rgba(0,0,0,0.35)`,
              }}
            />
          </div>
        </AbsoluteFill>
      </CameraRig>
      <HudChrome label="wuh.site · POST #37" readout={frame >= 138 ? 'READS 1,160' : '2022 · WARM-UP'} />
      <Grade2 id="GR2-03" />
      <Caption text="2022 年 2 月，他写《2022 年度总结》：『不要停步不前，每一天都要做出一点改变。』" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S13;
