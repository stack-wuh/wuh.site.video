/* S60 · Act 8 此刻 · 局部帧 [0,118) · 118f · 绝对 7964–8082
 *
 * V3 破家族豁免重构（2026-11-11 §0 修订令：家族金句文本原样保留为内容，视觉按新宪法重做；
 * 修复 f273 实证叠糊 bug：旧镜内脚注行 bottom:90 与底部 Caption 完全同位成糊）。
 * 逐拍事件链（局部帧，fps=30）：
 * [0–14]     承接（s59 全树收纸）：暖纸白纸面 springIn 自下方落定（scale 0.96→1 + translateY 30→0，
 *            全片唯一亮纸镜·家族「纸页」语义）；页面几何 1400×750 @ (260,80)，底边画面 y=830。
 * [14–48]    落定微尘：sparkBurst ×2（8 金 + 6 琥珀，色板纪律内以暖金/琥珀近似「金/纸白」）锚纸面下缘中心。
 * [16–92]    母题底纹：六枚浅浮雕墨痕散点（FN-46 motifOverlay ≤12%，12f 错峰 ×6——尾帧契约件「母题底纹」）。
 * [10–40]    六母题真实微缩数据件 lightOn 逐个点亮 staggerLand(6,10,30)→[10,12,17,23,31,40]，点亮即其下
 *            mono 10px 标签淡入：①博客 3 行墨点条（46 篇）②书架 3 根文字书脊（books.ts 真实 title）
 *            ③音乐黑胶环+唱针（vinylSpin 匀速转点）④热力 8×3 迷你格阵（heatCells 真数据 amber 深浅）
 *            ⑤知识树两笔 pathDraw 枝干 ⑥影像胶片框+两侧齿孔。全部纯排版/SVG，零图片。
 * [30–96]    金句 kinetic 逐字弹入（画面上半区，serif 58，纸面墨色 #1a1712——纸面镜文字用墨色不用 paperWhite；
 *            step 2.2f：第一行 30 起、第二行顺延 52 起；落定字以极轻 rgba(26,23,18,…) 墨影替代辉光）。
 * [54–106]   脚注数据回响（金句下方、Caption 安全区之上）：六枚 staggerLand(6,54,36)→[54,57,62,70,79,90]
 *            numRoll 微滚（滚长压到 FOOT_SETTLE_DEADLINE=118-20，全落定距镜尾 ≥20f），数字 serif 32 墨色 +
 *            标签 mono 12，落定各闪一次轻琥珀辉光。
 *            【叠糊 bug 修复证明】脚注块底边 = 页底 830 − bottom 96 = 画面 y≈734；Caption 顶 ≈ y864
 *            （44px×1.5 行高 + bottom 150）；含 CameraRig 1.02 与 handheld(0.8) 最坏偏移后脚注底边 ≤743、
 *            页底 ≤845，均高于 Caption 顶 ≥120/19px——镜内文字绝不进 bottom 150px 区。
 * [96–118]   全部就位呼吸：纸页 brightness 1→1.015（96 起）；HUD readout 96 切
 *            '1208 COMMITS · 46 ARTICLES · 365 DAYS'；工单痕迹 92 起显影。
 * 尾帧：母题底纹+脚注就位（manifest endFrameDesc 契约：交接态=总结纸页，整页完整交 s61 题记）。
 * 时间轴零改动：118f / Caption（文本+appearAt 14+bottom 150 默认）原样；零 <Sequence>；
 * 色板 FILM_COLORS2 + 纸面墨色 #1a1712 常量（仅此镜家族纸页豁免）；random(seed) only；禁蓝青。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import {
  DATA,
  FILM_COLORS2,
  ROLL_DUR,
  fmtNum,
  handheld,
  heatCells,
  kineticChars,
  lightOn,
  motifOverlay,
  numRoll,
  pathDraw,
  sparkBurst,
  springIn,
  staggerLand,
  vinylSpin,
} from '../motion-tokens';
import { BOOKS } from '../books';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 118;

/* 纸面墨色（家族纸页语义，全片仅此镜允许的内联常量） */
const INK = '#1a1712';
const INK_SHADOW = '0 1px 0 rgba(26,23,18,0.20), 0 4px 18px rgba(26,23,18,0.12)';
const AMBER = '212,163,115';

/* 纸页几何（字幕安全区避让基准数）：底边画面 y = 80+750 = 830；Caption 顶 ≈ 864 */
const PAGE = { left: 260, top: 80, width: 1400, height: 750 };

/* 六母题点亮表 / 脚注微滚落定表（FX-02 帧级节奏数组，accel 前疏后密） */
const MOTIF_LANDS = staggerLand(6, 10, 30); // [10,12,17,23,31,40]
const FOOT_LANDS = staggerLand(6, 54, 36); // [54,57,62,70,79,90]
const FOOT_SETTLE_DEADLINE = TOTAL - 20; // FN-48 纪律：全落定距镜尾 ≥20f → 98
const MOTIF_LABELS = ['博客', '书架', '音乐', '热力', '知识', '影像'];

/* 书架：books.ts 真实书脊（短题名三本，§3 内容本体化——不使用 cover 字段） */
const SPINES = [BOOKS[17], BOOKS[4], BOOKS[28]]; // 长安的荔枝 / 美国反对美国 / 山河故人

/* 热力：heatCells() 真数据采样 24 格（8×3）——活动日等距取深浅，间插休日格做底纹 */
const HEAT_CELLS = heatCells();
const HEAT_ACTIVE = HEAT_CELLS.filter((c) => c.activity > 0);
const HEAT_OFFSET = Math.floor(random('s60-heat-off') * 11);
const HEAT_SAMPLE = Array.from({ length: 24 }, (_, i) =>
  i % 5 === 4 ? HEAT_CELLS[(i * 37 + HEAT_OFFSET) % HEAT_CELLS.length] : HEAT_ACTIVE[(i * 7 + HEAT_OFFSET) % HEAT_ACTIVE.length],
);

/* 知识树两笔枝干（pathDraw 真长度由 evolvePath 计算） */
const TREE_TRUNK = 'M 75 104 C 74 82 74 60 76 34';
const TREE_BRANCH = 'M 76 62 C 96 50 112 40 128 20';

/* 脚注数据回响（DATA 2026-11-08 快照，from 沿用旧镜微滚起点） */
const FOOTNOTES = [
  { from: 1180, to: DATA.commits, label: '提交' },
  { from: 40, to: DATA.articles, label: '篇文章' },
  { from: 110, to: DATA.tags, label: '版本' },
  { from: 13000, to: DATA.activity, label: '格活动' },
  { from: 250, to: DATA.archives, label: '归档' },
  { from: 35, to: DATA.knowledge, label: '知识卡' },
];

/* 金句（家族原文逐字保留为内容） */
const LINE1 = '写作是根，代码是干；';
const LINE2 = '方法、工具、桌面与影像，是后来长出的枝。';
const Q_START = 30;
const Q_STEP = 2.2;
const LINE2_START = Q_START + Array.from(LINE1).length * Q_STEP; // 52（第二行顺延）

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

/* 六母题微缩数据件图标（纯排版/SVG，零图片；墨色绘制在纸面上） */
const MotifIcon: FC<{ kind: number; frame: number }> = ({ kind, frame }) => {
  if (kind === 0) {
    /* ①博客：3 行墨点条（46 篇文章的行化） */
    const bars = [
      { w: 96, o: 0.62 },
      { w: 70, o: 0.44 },
      { w: 50, o: 0.3 },
    ];
    return (
      <div style={{ position: 'relative', width: 150, height: 110, margin: '20px auto 0' }}>
        {bars.map((b, r) => (
          <div key={r} style={{ position: 'absolute', left: 0, top: 14 + r * 34, width: 150, height: 8 }}>
            {[0, 1, 2, 3].map((d) => (
              <div key={d} style={{ position: 'absolute', left: d * 11, top: 1, width: 5, height: 5, borderRadius: 3, background: INK, opacity: 0.75 - r * 0.15 }} />
            ))}
            <div style={{ position: 'absolute', left: 50, top: 0, width: b.w, height: 7, borderRadius: 3.5, background: INK, opacity: b.o }} />
          </div>
        ))}
      </div>
    );
  }
  if (kind === 1) {
    /* ②书架：3 根微缩文字书脊（真实 title） */
    return (
      <div style={{ position: 'relative', width: 150, height: 110, margin: '2px auto 0', display: 'flex', justifyContent: 'center', gap: 10 }}>
        {SPINES.map((b, i) => (
          <div key={b.title} style={{ width: 30, height: 104, border: `1.5px solid ${INK}`, borderRadius: 2, opacity: 0.85 - i * 0.12, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 6 }}>
            <span style={{ writingMode: 'vertical-rl', fontFamily: fontFamilies.serif, fontSize: 9, letterSpacing: 2, color: INK, whiteSpace: 'nowrap' }}>{b.title}</span>
          </div>
        ))}
      </div>
    );
  }
  if (kind === 2) {
    /* ③音乐：黑胶环 + 唱针（vinylSpin 匀速转点，物理匀速例外） */
    const va = (vinylSpin(frame, 150) * Math.PI) / 180;
    return (
      <div style={{ position: 'relative', width: 150, height: 110, margin: '0 auto' }}>
        <div style={{ position: 'absolute', left: 10, top: 12, width: 86, height: 86, borderRadius: 43, border: `2px solid ${INK}`, opacity: 0.85 }} />
        <div style={{ position: 'absolute', left: 26, top: 28, width: 54, height: 54, borderRadius: 27, border: `1px solid ${INK}`, opacity: 0.3 }} />
        <div style={{ position: 'absolute', left: 45, top: 47, width: 16, height: 16, borderRadius: 8, background: INK, opacity: 0.8 }} />
        <div style={{ position: 'absolute', left: 51, top: 53, width: 4, height: 4, borderRadius: 2, background: FILM_COLORS2.paperWhite }} />
        <div style={{ position: 'absolute', left: 53 + 43 * Math.cos(va) - 3, top: 55 + 43 * Math.sin(va) - 3, width: 6, height: 6, borderRadius: 3, background: INK, opacity: 0.7 }} />
        <div style={{ position: 'absolute', left: 118, top: 4, width: 9, height: 9, borderRadius: 5, background: INK, opacity: 0.8 }} />
        <div style={{ position: 'absolute', left: 122, top: 8, width: 2, height: 46, background: INK, opacity: 0.75, transform: 'rotate(37.5deg)', transformOrigin: 'top center' }} />
        <div style={{ position: 'absolute', left: 89, top: 41, width: 7, height: 7, borderRadius: 4, background: INK, opacity: 0.85 }} />
      </div>
    );
  }
  if (kind === 3) {
    /* ④热力：8×3 迷你格阵（heatCells 真数据，amber 深浅编码活强度） */
    return (
      <div style={{ position: 'relative', width: 132, height: 47, margin: '32px auto 0', display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {HEAT_SAMPLE.map((c, i) => (
          <div
            key={i}
            style={{
              width: 13,
              height: 13,
              borderRadius: 2,
              background: c.activity === 0 ? 'rgba(26,23,18,0.10)' : `rgba(${AMBER},${0.22 + Math.min(1, c.activity / DATA.peakActivity) * 0.66})`,
            }}
          />
        ))}
      </div>
    );
  }
  if (kind === 4) {
    /* ⑤知识树：两笔 pathDraw 枝干（treeGrow 语义简化，真长度驱动） */
    const trunk = pathDraw(frame, MOTIF_LANDS[4] + 2, 18, TREE_TRUNK);
    const branch = pathDraw(frame, MOTIF_LANDS[4] + 12, 16, TREE_BRANCH);
    return (
      <svg width={150} height={110} style={{ display: 'block', margin: '0 auto' }}>
        <path d={TREE_TRUNK} fill="none" stroke={INK} strokeWidth={2.4} strokeLinecap="round" opacity={0.85} strokeDasharray={trunk.strokeDasharray} strokeDashoffset={trunk.strokeDashoffset} />
        <path d={TREE_BRANCH} fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round" opacity={0.7} strokeDasharray={branch.strokeDasharray} strokeDashoffset={branch.strokeDashoffset} />
      </svg>
    );
  }
  /* ⑥影像：胶片框（矩形 + 两侧齿孔） */
  return (
    <div style={{ position: 'relative', width: 132, height: 86, margin: '12px auto 0', border: `2px solid ${INK}`, borderRadius: 3, opacity: 0.85 }}>
      <div style={{ position: 'absolute', left: 16, top: 12, right: 16, bottom: 12, border: `1px solid ${INK}`, opacity: 0.35, borderRadius: 2 }} />
      {[14, 38, 62].map((y) => (
        <div key={`l${y}`} style={{ position: 'absolute', left: 4, top: y, width: 6, height: 5, borderRadius: 1, background: INK, opacity: 0.5 }} />
      ))}
      {[14, 38, 62].map((y) => (
        <div key={`r${y}`} style={{ position: 'absolute', right: 4, top: y, width: 6, height: 5, borderRadius: 1, background: INK, opacity: 0.5 }} />
      ))}
    </div>
  );
};

const S60: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* [0–14] 纸页落定 + [96–118] 纸页呼吸 */
  const page = springIn(frame, 0, fps);
  const breathe = interpolate(frame, [96, TOTAL], [1, 1.015], clamp);
  /* [16–92] 母题底纹（FN-46 ≤12%，12f 错峰 ×6） */
  const overlayAt = motifOverlay(frame, 16, 12);
  /* [14–48] 落定微尘（少量：8 金 + 6 琥珀） */
  const burstGold = sparkBurst('s60-dust', frame, 14, 8, true);
  const burstAmber = sparkBurst('s60-dust2', frame, 14, 6, false);
  /* [30–96] 金句逐字（第二行顺延） */
  const line1Chars = kineticChars(LINE1, frame, Q_START, Q_STEP, fps);
  const line2Chars = kineticChars(LINE2, frame, LINE2_START, Q_STEP, fps);
  /* CameraRig：1.02→1.0 缓收 + handheld('s60-cam', 0.8)（纸面镜幅度最小） */
  const shake = handheld('s60-cam', frame, 0.8);
  const cam = {
    scale: interpolate(frame, [0, TOTAL], [1.02, 1.0], { ...clamp, easing: CURVES.cineEaseInOut }),
    x: shake.dx,
    y: shake.dy,
    rot: shake.rot,
  };

  /* 金句一行：逐字弹入 + 落定字极轻墨影（纸面禁辉光，rgba(26,23,18,…) 阴影替代 glowText） */
  const quoteLine = (chars: ReturnType<typeof kineticChars>, start: number, marginTop = 0) => (
    <div style={{ marginTop, whiteSpace: 'nowrap', lineHeight: 1.4 }}>
      {chars.map((c, i) => {
        const landed = frame >= start + i * Q_STEP + 7;
        return (
          <span key={i} style={{ ...c.style, color: INK, textShadow: landed ? INK_SHADOW : 'none' }}>
            {c.ch}
          </span>
        );
      })}
    </div>
  );

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DeepSpace seed="s60v2" stars={36} grid />

          {/* 总结纸页（全片唯一亮纸镜） */}
          <div
            style={{
              position: 'absolute',
              left: PAGE.left,
              top: PAGE.top,
              width: PAGE.width,
              height: PAGE.height,
              borderRadius: 8,
              background: FILM_COLORS2.paperWhite,
              border: '1px solid rgba(26,23,18,0.25)',
              opacity: Math.min(1, page * 2.2),
              transform: `translateY(${(1 - page) * 30}px) scale(${0.96 + page * 0.04})`,
              boxShadow: '0 36px 90px rgba(10,9,8,0.6), inset 0 0 120px rgba(26,23,18,0.07)',
              filter: `brightness(${breathe})`,
            }}
          >
            {/* [16–92] 母题底纹：六枚浅浮雕墨痕散点（≤12%，尾帧契约件） */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
              <div style={{ position: 'absolute', left: 36, bottom: 96, width: 84, height: 84, borderRadius: 42, background: INK, opacity: overlayAt(0) }} />
              <div style={{ position: 'absolute', right: 48, bottom: 132, width: 92, height: 118, borderRadius: 4, border: `2.5px solid ${INK}`, opacity: overlayAt(1) }} />
              <div style={{ position: 'absolute', left: 30, top: 372, fontFamily: fontFamilies.mono, fontSize: 38, color: INK, opacity: overlayAt(2) }}>{'</>'}</div>
              <div style={{ position: 'absolute', right: 36, top: 356, width: 116, height: 116, borderRadius: 58, border: `11px solid ${INK}`, opacity: overlayAt(3) }} />
              <div style={{ position: 'absolute', left: 150, bottom: 34, width: 0, height: 0, borderLeft: 52, borderRight: 52, borderTop: 86, borderStyle: 'solid', borderColor: `${INK} transparent transparent`, opacity: overlayAt(4) }} />
              <div style={{ position: 'absolute', right: 168, bottom: 30, width: 92, height: 92, borderRadius: 8, border: `5px solid ${FILM_COLORS2.sealRed}`, opacity: overlayAt(5) }} />
            </div>

            {/* [10–40] 六母题微缩数据件横排（金句上方区，每件 220px）+ 点亮即标签淡入 */}
            <div style={{ position: 'absolute', left: 40, top: 40, width: 1320, height: 175, zIndex: 3 }}>
              {MOTIF_LABELS.map((label, i) => (
                <div key={label} style={{ position: 'absolute', left: i * 220, top: 0, width: 220, height: 175 }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, width: 220, height: 148, ...lightOn(frame, MOTIF_LANDS[i], fps) }}>
                    <MotifIcon kind={i} frame={frame} />
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      top: 152,
                      textAlign: 'center',
                      fontFamily: fontFamilies.mono,
                      fontSize: 10,
                      letterSpacing: '0.3em',
                      color: INK,
                      opacity: interpolate(frame, [MOTIF_LANDS[i], MOTIF_LANDS[i] + 8], [0, 0.62], clamp),
                    }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>

            {/* [30–96] 金句（画面上半区：纸内 252–436 → 画面 332–516，serif 58 墨色） */}
            <div style={{ position: 'absolute', left: 0, right: 0, top: 252, textAlign: 'center', zIndex: 3, fontFamily: fontFamilies.serif, fontSize: 58, color: INK }}>
              {quoteLine(line1Chars, Q_START)}
              {quoteLine(line2Chars, LINE2_START, 22)}
            </div>

            {/* [54–106] 脚注数据回响：块底边 = 750−96 = 纸内 y654 → 画面 y734，高于 Caption 顶 864 ≥130px */}
            <div style={{ position: 'absolute', left: 70, right: 70, bottom: 96, display: 'flex', justifyContent: 'space-between', zIndex: 3 }}>
              {FOOTNOTES.map((f, i) => {
                const land = FOOT_LANDS[i];
                const rollDur = Math.max(6, Math.min(ROLL_DUR.micro, FOOT_SETTLE_DEADLINE - land));
                const v = Math.round(numRoll(frame, land, rollDur, f.from, f.to));
                const enter = interpolate(frame, [land, land + 10], [0, 1], { ...clamp, easing: CURVES.cineEaseOut });
                const flash = interpolate(frame, [land + rollDur, land + rollDur + 3, land + rollDur + 12], [0, 0.5, 0], clamp);
                return (
                  <div key={f.label} style={{ textAlign: 'center', opacity: enter, transform: `translateY(${(1 - enter) * 10}px)` }}>
                    <div
                      style={{
                        fontFamily: fontFamilies.serif,
                        fontSize: 32,
                        fontWeight: 600,
                        color: INK,
                        fontVariantNumeric: 'tabular-nums',
                        lineHeight: 1.15,
                        textShadow: flash > 0 ? `0 0 ${14 * flash}px rgba(${AMBER},${0.5 * flash})` : 'none',
                      }}
                    >
                      {fmtNum(v)}
                    </div>
                    <div style={{ fontFamily: fontFamilies.mono, fontSize: 12, letterSpacing: '0.18em', color: INK, opacity: 0.55, marginTop: 6 }}>{f.label}</div>
                  </div>
                );
              })}
            </div>

            {/* [92–118] 本片工单痕迹（手作签名点，纸内 bottom 40 → 画面 y≈777，字幕安全区之上） */}
            <div
              style={{
                position: 'absolute',
                right: 60,
                bottom: 40,
                zIndex: 3,
                fontFamily: fontFamilies.mono,
                fontSize: 11,
                letterSpacing: '0.06em',
                color: INK,
                opacity: interpolate(frame, [92, 104], [0, 0.45], clamp),
              }}
            >
              wuh.site.video · 20261109-feature-wuh-site-intro-v3-production
            </div>

            {/* [14–48] 落定微尘（纸面下缘中心锚点） */}
            <div style={{ position: 'absolute', left: '50%', top: 620, width: 0, height: 0, zIndex: 6, pointerEvents: 'none' }}>
              {burstGold.map((p, i) => (
                <div key={`g${i}`} style={p.style} />
              ))}
              {burstAmber.map((p, i) => (
                <div key={`a${i}`} style={p.style} />
              ))}
            </div>
          </div>
        </AbsoluteFill>
      </CameraRig>

      <HudChrome label="wuh.site · SUMMARY" readout={frame >= 96 ? '1208 COMMITS · 46 ARTICLES · 365 DAYS' : 'PAGE SETTLING…'} />
      <Grade2 id="GR2-08" />
      <Caption text="写作是根，代码是干；方法、工具、桌面与影像，是后来长出的枝。" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S60;
