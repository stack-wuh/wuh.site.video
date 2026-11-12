/* S39 · Act 6 入院 · 局部帧 [0,60) · 60f · 绝对 5434–5494
 *
 * V3 审计返工重写（2026-11-12 storyboard-audit s39 条 + §3 禁截图）：「每一页，都在呼吸」
 * 兑现镜——s01-home-hero 截图删除（快照引用零残留），主角 = 站点真实 write-fade
 * 节奏驱动文字块分层显影：WIN.heroZonesF = [0, 2.4, 4.8, 7.2]f（30fps ↔ 0/80/160/240ms，
 * 站点首页 hero 四区真实入场参数）驱动四区文字块逐层显影，且整拍循环重演（呼吸 = 节奏
 * 一直在跑）+ 真实参数标签（mono 小字 0/80/160/240ms 贴区标注）。
 * 逐拍事件链（局部帧，fps=30）：
 * 【承接】0–8 承 s38 尾帧（面板 01–07 亮·光标停 08 前）→ 漫游起手：首页卡自景深迎面
 *         推近（dolly scale 0.5→1.18 窗口原样，位移入场）。
 * 【触发】8 循环 A 起拍：四区文字块按 0/2.4/4.8/7.2f 错峰显影（write-fade：opacity +
 *         translateY 6px→0 + blur 2px→0，位移+形变入场）。
 * 【展开】① 8–16 循环 A 四区全显（词标「wuh.site」/ 栏目行「文章 · 书架 · 音乐 · 足迹」
 *            / 数据行「46 POSTS · 146 BOOKS · 1,208 COMMITS」（DATA 真家底）/ 循环读数行）；
 *         ② 16–33 呼吸驻留：辉光 box-shadow 一息一呼（sin 常驻）+ write-fade 走带在
 *            参数轨上循环行进（4 枚刻度 0/80/160/240ms 依次点亮）；
 *         ③ 34–38 循环 B 无缝重演（A 淡出 B 淡入，四区再显影一遍 = 「都在呼吸」的节拍
 *            证明）；参数轨走带重头再跑。
 * 【交接】50–60 首页卡让位：整卡左移缩小退场（exit 窗口原样）+ HUD 读数切
 *         「01/05 · / → 02 /music」（尾帧契约：首页卡让位、/music 卡入场在即，
 *         交接态：漫游中·卡 1 过）。
 * 意义一句话：网站每一页的进场节奏是写死的 0/80/160/240ms——页面像呼吸一样一拍拍显影。
 * 时间轴零改动：60f / dolly 8–60 / exit 50–60 / Caption「每一页，都在呼吸。」appearAt 14 /
 * 尾帧交接态语义原样。
 * 转场：入「切」，出「切」（漫游连击）。字幕安全窗：start≥12。镜内文字最低点 y≈660
 * （<930，不进 bottom 150px）；零图片零快照引用（§3）；random(seed) only；
 * 无 <Sequence>；springIn fps 取 useVideoConfig()；色板只用 FILM_COLORS2。
 */
import type { FC, ReactNode } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { DATA, FILM_COLORS2, fmtNum, glowText, WIN } from '../motion-tokens';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 60;
const CYCLE_A = 8; // 循环 A 起拍（dolly 起点同步）
const CYCLE_B = 34; // 循环 B 重演（呼吸节拍证明）
const ZONES_MS = [0, 80, 160, 240]; // 站点真实参数（WIN.heroZonesF 的毫秒口径，30fps）
const PANEL = { left: 580, top: 190, w: 760, h: 480 };
const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

const S39: FC = () => {
  const frame = useCurrentFrame();
  /* dolly-in：首页卡迎面推近（等比 scale 0.5→1.18，窗口原样；入场位移） */
  const dolly = interpolate(frame, [8, TOTAL], [0, 1], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const scale = interpolate(dolly, [0, 1], [0.5, 1.18]);
  /* 首页卡让位（50–60 exit 窗口原样）：左移缩小退场，/music 入场在即 */
  const exit = interpolate(frame, [50, TOTAL], [1, 0], CLAMP);
  const exitDrift = interpolate(frame, [50, TOTAL], [0, -150], { ...CLAMP, easing: CURVES.cineEaseIn });
  /* 呼吸辉光（一息一呼，常驻） */
  const breathe = 0.45 + 0.3 * Math.sin((frame / 60) * Math.PI * 2);
  /* 循环 alpha：A 驻到 34 淡出（34–38）；B 34 淡入常驻 */
  const alphaA = interpolate(frame, [34, 38], [1, 0], CLAMP);
  const alphaB = interpolate(frame, [CYCLE_B, CYCLE_B + 4], [0, 1], CLAMP);
  /* write-fade 分层显影：区 z 在循环起点 + WIN.heroZonesF[z] 帧开始显影（0/2.4/4.8/7.2f） */
  const zoneO = (z: number): number => {
    const inA = interpolate(frame, [CYCLE_A + WIN.heroZonesF[z], CYCLE_A + WIN.heroZonesF[z] + 5], [0, 1], CLAMP) * alphaA;
    const inB = interpolate(frame, [CYCLE_B + WIN.heroZonesF[z], CYCLE_B + WIN.heroZonesF[z] + 5], [0, 1], CLAMP) * alphaB;
    return Math.max(inA, inB);
  };
  /* 参数轨走带（循环行进：26f 一轮，4 刻度依次点亮） */
  const trackT = (((frame - CYCLE_A) % 26) + 26) % 26;
  const head = trackT / 26;

  const zones: Array<{ label: string; node: ReactNode }> = [
    {
      label: 'ZONE 0 · 0ms',
      node: (
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 18 }}>
          <span style={{ fontFamily: fontFamilies.serif, fontSize: 58, fontWeight: 700, letterSpacing: '0.04em', color: FILM_COLORS2.paperWhite, ...glowText(FILM_COLORS2.paperWhite, 0.35 + breathe * 0.15, '245,240,232') }}>wuh.site</span>
          <span style={{ fontFamily: fontFamilies.mono, fontSize: 12, letterSpacing: '0.3em', color: FILM_COLORS2.textMuted }}>HOME · HERO</span>
        </div>
      ),
    },
    {
      label: 'ZONE 1 · 80ms',
      node: <span style={{ fontFamily: fontFamilies.serif, fontSize: 27, letterSpacing: '0.2em', color: FILM_COLORS2.paperWhite, opacity: 0.94 }}>文章 · 书架 · 音乐 · 足迹</span>,
    },
    {
      label: 'ZONE 2 · 160ms',
      node: (
        <span style={{ fontFamily: fontFamilies.mono, fontSize: 19, letterSpacing: '0.14em', color: FILM_COLORS2.data, fontVariantNumeric: 'tabular-nums', ...glowText(FILM_COLORS2.data, 0.32) }}>{`${DATA.articles} POSTS · ${DATA.books} BOOKS · ${fmtNum(DATA.commits)} COMMITS`}</span>
      ),
    },
    {
      label: 'ZONE 3 · 240ms',
      node: <span style={{ fontFamily: fontFamilies.mono, fontSize: 13, letterSpacing: '0.24em', color: FILM_COLORS2.textMuted }}>WRITE-FADE · LOOP ∞</span>,
    },
  ];

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s39v2" stars={56} grid horizon />

      {/* 呼吸辉光晕（卡后一息） */}
      <div
        style={{
          position: 'absolute',
          left: 400,
          top: -130,
          width: 1120,
          height: 1120,
          borderRadius: 560,
          background: `radial-gradient(circle, rgba(212,163,115,0.14), rgba(212,163,115,0) 65%)`,
          opacity: breathe * exit,
          pointerEvents: 'none',
        }}
      />

      {/* 首页卡（线框纸卡，零截图）：write-fade 四区文字块分层显影 */}
      <div
        style={{
          position: 'absolute',
          left: PANEL.left,
          top: PANEL.top,
          width: PANEL.w,
          height: PANEL.h,
          borderRadius: 12,
          overflow: 'hidden',
          border: `1px solid ${FILM_COLORS2.dataDim}`,
          boxShadow: `0 0 ${30 + breathe * 18}px rgba(212,163,115,0.2), 0 24px 60px rgba(0,0,0,0.65)`,
          background: FILM_COLORS2.panel,
          transform: `translateX(${exitDrift}px) scale(${scale})`,
          opacity: interpolate(dolly, [0, 0.2], [0.3, 1], CLAMP) * exit,
          zIndex: 28,
        }}
      >
        {/* 真实参数标签列（mono 小字 0/80/160/240ms，贴区左缘） */}
        <div style={{ position: 'absolute', left: 22, top: 64, bottom: 96, width: 84, borderRight: `1px solid ${FILM_COLORS2.line}` }}>
          {ZONES_MS.map((ms, z) => {
            const o = zoneO(z);
            return (
              <div key={ms} style={{ position: 'absolute', left: 0, top: 6 + z * 82, opacity: Math.max(0.35, o) }}>
                <div style={{ width: 8, height: 1.5, background: FILM_COLORS2.data, opacity: 0.5 + o * 0.5, marginBottom: 6 }} />
                <span style={{ fontFamily: fontFamilies.mono, fontSize: 11.5, letterSpacing: '0.1em', color: o > 0.5 ? FILM_COLORS2.data : FILM_COLORS2.textMuted, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{`${ms}ms`}</span>
              </div>
            );
          })}
        </div>
        {/* 四区文字块（write-fade：opacity + 位移 + blur 显影，节奏 = WIN.heroZonesF） */}
        <div style={{ position: 'absolute', left: 138, right: 40, top: 70 }}>
          {zones.map((z, zi) => {
            const o = zoneO(zi);
            return (
              <div key={z.label} style={{ marginBottom: zi === 0 ? 30 : 44, opacity: o, transform: `translateY(${(1 - o) * 6}px)`, filter: `blur(${(1 - o) * 2}px)` }}>
                {z.node}
              </div>
            );
          })}
        </div>
        {/* write-fade 参数轨（走带循环：0→80→160→240ms 刻度依次点亮） */}
        <div style={{ position: 'absolute', left: 138, right: 40, bottom: 34 }}>
          <div style={{ position: 'relative', height: 3, borderRadius: 1.5, background: FILM_COLORS2.line }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${head * 100}%`, borderRadius: 1.5, background: `linear-gradient(90deg, ${FILM_COLORS2.dataDim}, ${FILM_COLORS2.data})`, boxShadow: `0 0 8px rgba(212,163,115,0.4)` }} />
            <div style={{ position: 'absolute', left: `${head * 100}%`, top: -3, width: 7, height: 7, borderRadius: 3.5, marginLeft: -3, background: FILM_COLORS2.data, boxShadow: `0 0 8px 2px rgba(212,163,115,0.5)` }} />
            {ZONES_MS.map((ms, z) => {
              const lit = head >= WIN.heroZonesF[z] / 26 - 0.001;
              return (
                <div key={ms} style={{ position: 'absolute', left: `${(WIN.heroZonesF[z] / 26) * 100}%`, top: -10 }}>
                  <div style={{ width: 1.5, height: 6, background: lit ? FILM_COLORS2.data : FILM_COLORS2.line, opacity: lit ? 0.9 : 0.5, marginLeft: -0.75 }} />
                  <span style={{ position: 'absolute', left: -12, top: 10, fontFamily: fontFamilies.mono, fontSize: 10.5, letterSpacing: '0.08em', color: lit ? FILM_COLORS2.data : FILM_COLORS2.textMuted, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{`${ms}ms`}</span>
                </div>
              );
            })}
          </div>
        </div>
        <span style={{ position: 'absolute', right: 40, top: 24, fontFamily: fontFamilies.mono, fontSize: 12.5, letterSpacing: '0.3em', color: FILM_COLORS2.textMuted, opacity: 0.7 }}>01/05 · /</span>
      </div>

      <HudChrome label="wuh.site · ROAM" readout={frame >= 50 ? '01/05 · / → 02 /music' : '01/05 · /'} />
      <Grade2 id="GR2-06" />
      <Caption text="每一页，都在呼吸。" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S39;
