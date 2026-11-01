/* 镜 54 · Act 8 此刻 · 局部帧 [0,300) · 300f
   从工作流页面拉远（前 60f）：页面收束成一枚墨点落地生根（PT-01/PT-02），
   树干墨线生长（FN-21 pathDraw），五枝按出生顺序从左到右依次长出（line-grow），
   逐枝挂项目卡 cascade 落位（FN-12 card-land，每枝约 48f）：
   blog（根）→ shadow-dev-workflow → wuh.site.desktop → shadow-dev-cli → wuh.site.video；
   五条字幕按枝切分；末 15f 枝 5 的胶片光收束成总结纸页白边；GR-02。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, FILM_COLORS, cardFly, lightOn, pathDraw } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DustField } from '../components/DustField';
import { PaperGrain } from '../components/PaperGrain';
import { Grade } from '../components/Grade';
import { Caption } from '../components/Caption';

const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const ROOT = { x: 300, y: 900 };
const TRUNK = 'M 300 900 C 332 822 372 758 430 700 C 520 620 570 574 640 520';
const FIBER = 'M 306 896 C 338 818 378 754 436 696 C 526 616 576 570 646 516';
const S0 = 56;
const STEP = 46;
const branchStart = (i: number) => S0 + i * STEP;

const mono = fontFamilies.mono;
const serif = fontFamilies.serif;

const BRANCHES = [
  { d: 'M 318 860 C 360 840 412 812 470 780', len: 200, tip: { x: 470, y: 780 } },
  { d: 'M 356 790 C 500 758 640 722 750 690', len: 430, tip: { x: 750, y: 690 } },
  { d: 'M 430 702 C 600 678 820 650 1030 600', len: 640, tip: { x: 1030, y: 600 } },
  { d: 'M 520 626 C 730 596 1080 560 1310 510', len: 840, tip: { x: 1310, y: 510 } },
  { d: 'M 615 546 C 860 518 1330 470 1590 420', len: 1050, tip: { x: 1590, y: 420 } },
];

const PROJECTS = [
  { title: 'blog', lines: ['根 · 更早的博客时代', '★6'] },
  { title: 'shadow-dev-workflow', lines: ['2026-06-27 · 257 commits', 'v7.2.1 · 12 技能'] },
  { title: 'wuh.site.desktop', lines: ['2026-09-13 · 276 commits', 'v0.1.0'] },
  { title: 'shadow-dev-cli', lines: ['2026-09-16 · 149 commits', 'v1.8.0'] },
  { title: 'wuh.site.video', lines: ['2026-10-24 · 42 commits', '本片制作方'] },
];

const CAPTIONS = [
  { from: 60, to: 106, text: '博客是根——碎片的知识，先写在 Issue 里。' },
  { from: 106, to: 152, text: '它长出一套方法：propose → apply → review → release → 归档。' },
  { from: 152, to: 198, text: '再长出一间桌面书房：Markdown、GitHub、插件沙箱。' },
  { from: 198, to: 244, text: '方法又长成一把工具：plan → execute，确定性地落盘。' },
  { from: 244, to: 300, text: '最后是一间视频工作室——这部片子，就是它做的。' },
];

const ShotDerivationTree: FC = () => {
  const frame = useCurrentFrame();
  /* 前 60f：工作流页拉远 → 墨点落地生根 */
  const pageP = interpolate(frame, [0, 40], [0, 1], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const pageScale = 1 - 0.86 * pageP;
  const pageOpacity = interpolate(frame, [28, 42], [0.95, 0], CLAMP);
  const dropP = interpolate(frame, [22, 36], [0, 1], { ...CLAMP, easing: CURVES.cineEaseIn });
  const bloom = interpolate(frame, [36, 42], [0.2, 1], CLAMP);
  const ripple = (off: number) => interpolate(frame - 36 - off, [0, 24], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut });
  /* 镜头：拉远后沿树冠从左到右缓移（CM-05 + CM-04） */
  const camScale = interpolate(frame, [0, 40], [1.03, 1], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const camX = interpolate(frame, [44, 286], [26, -34], { ...CLAMP, easing: CURVES.cineEaseInOut });
  /* 末 15f：枝 5 胶片光收束成总结纸页白边 */
  const film = interpolate(frame, [284, 300], [0, 1], { ...CLAMP, easing: CURVES.cineEaseInOut });
  /* 入场：承接 s53 金句页（TR-03 镜头内显影） */
  const enter = interpolate(frame, [0, 8], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut });

  return (
    <AbsoluteFill style={{ background: colors.paper }}>
      <CameraRig cam={{ scale: camScale, x: camX, y: 0, rot: 0 }}>
        <AbsoluteFill>
          <DustField act={8} seedBase="s54" />
          {/* 入场：工作流页面收束成墨点 */}
          {pageOpacity > 0.01 ? (
            <div
              style={{
                position: 'absolute',
                left: 510,
                top: 200,
                width: 900,
                height: 520,
                transform: `translate(${-660 * pageP}px, ${440 * pageP}px) scale(${pageScale})`,
                transformOrigin: 'center',
                opacity: pageOpacity,
                filter: `blur(${(1 - enter) * 4}px)`,
                background: colors.paperDeep,
                border: `1px solid ${colors.paperMuted}`,
                borderRadius: 6,
              }}
            >
              <div style={{ position: 'absolute', left: 40, top: 34, fontFamily: mono, fontSize: 14, letterSpacing: '0.16em', color: colors.muted }}>wuh.site / workflow · #172</div>
              <div style={{ position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center', fontFamily: serif, fontSize: 38, color: colors.ink }}>Vibe Coding Workflow 概述</div>
              <div style={{ position: 'absolute', left: 0, right: 0, top: 230, textAlign: 'center', fontFamily: mono, fontSize: 17, letterSpacing: '0.06em', color: colors.muted }}>proposal → discuss → apply → review → archive → commit</div>
              <div style={{ position: 'absolute', left: 0, right: 0, top: 320, display: 'flex', justifyContent: 'center', gap: 12 }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} style={{ width: 110, height: 44, border: `1px solid ${colors.paperMuted}`, borderRadius: 3, background: colors.paper }} />
                ))}
              </div>
            </div>
          ) : null}
          {/* PT-01 墨点落地 → PT-02 洇开 + PT-03 涟漪 */}
          {frame < 38 ? (
            <div
              style={{
                position: 'absolute',
                left: ROOT.x - 7,
                top: ROOT.y - 90 + 90 * dropP - 10,
                width: 14,
                height: 20,
                borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                background: colors.ink,
              }}
            />
          ) : null}
          {frame >= 36 ? (
            <>
              {[2, 6, 12].map((blur, i) => (
                <div
                  key={blur}
                  style={{
                    position: 'absolute',
                    left: ROOT.x - 30,
                    top: ROOT.y - 26,
                    width: 60,
                    height: 52,
                    borderRadius: '50%',
                    background: colors.ink,
                    opacity: (i === 0 ? 0.9 : 0.32) * bloom,
                    filter: `blur(${blur}px)`,
                    transform: `scale(${0.6 + bloom * 0.4})`,
                  }}
                />
              ))}
              {[0, 8].map((off) => {
                const p = ripple(off);
                return p > 0 && p < 1 ? (
                  <div
                    key={off}
                    style={{
                      position: 'absolute',
                      left: ROOT.x - 26 - p * 34,
                      top: ROOT.y - 20 - p * 24,
                      width: 52 + p * 68,
                      height: 40 + p * 48,
                      borderRadius: '50%',
                      border: `1px solid ${colors.ink}`,
                      opacity: 0.4 * (1 - p),
                    }}
                  />
                ) : null;
              })}
            </>
          ) : null}
          {/* 树干 / 枝 / 挂线 */}
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
            <path d={TRUNK} fill="none" stroke={colors.ink} strokeWidth={5} strokeLinecap="round" opacity={0.9} style={pathDraw(frame, 38, 30, 560)} />
            <path d={FIBER} fill="none" stroke={colors.ink} strokeWidth={1} strokeLinecap="round" opacity={0.3} style={pathDraw(frame, 48, 24, 560)} />
            {BRANCHES.map((b, i) => (
              <g key={b.d}>
                <path d={b.d} fill="none" stroke={colors.ink} strokeWidth={2.5} strokeLinecap="round" opacity={0.85} style={pathDraw(frame, branchStart(i), 22, b.len)} />
                <path
                  d={`M ${b.tip.x - 6} ${b.tip.y + 2} q 16 -12 30 -4`}
                  fill="none"
                  stroke={colors.ink}
                  strokeWidth={1}
                  strokeLinecap="round"
                  opacity={0.35}
                  style={pathDraw(frame, branchStart(i) + 16, 10, 40)}
                />
                <line
                  x1={b.tip.x}
                  y1={b.tip.y}
                  x2={b.tip.x}
                  y2={b.tip.y + 24}
                  stroke={colors.ink}
                  strokeWidth={1}
                  opacity={0.6}
                  style={pathDraw(frame, branchStart(i) + 20, 8, 24)}
                />
              </g>
            ))}
          </svg>
          {/* 枝尖芽点 */}
          {BRANCHES.map((b, i) => (
            <div key={b.d} style={{ ...lightOn(frame, branchStart(i) + 16, 30), position: 'absolute', left: b.tip.x - 4, top: b.tip.y - 4, width: 8, height: 8, borderRadius: 4, background: colors.ink }} />
          ))}
          {/* 项目卡 cascade 落位 */}
          {PROJECTS.map((p, i) => {
            const tip = BRANCHES[i].tip;
            const settled = frame >= branchStart(i) + 42;
            return (
              <div
                key={p.title}
                style={{
                  ...cardFly(frame, branchStart(i) + 26, 16, { x: 0, y: -26, rot: 0, scale: 0.94 }, { x: 0, y: 0, rot: 0, scale: 1 }),
                  position: 'absolute',
                  left: tip.x - 20,
                  top: tip.y + 24,
                  width: 268,
                  height: 150,
                  boxSizing: 'border-box',
                  background: colors.paperDeep,
                  border: `1px solid ${i === 4 && settled ? colors.accent : colors.paperMuted}`,
                  borderRadius: 4,
                  padding: '10px 14px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: '0.2em', color: colors.muted, fontVariantNumeric: 'tabular-nums' }}>0{i + 1}</span>
                  {i === 4 ? <span style={{ fontFamily: mono, fontSize: 10, letterSpacing: '0.14em', color: colors.accent }}>本片</span> : null}
                </div>
                <div style={{ marginTop: 5, fontFamily: serif, fontSize: 21, lineHeight: 1.2, color: colors.ink }}>{p.title}</div>
                <div style={{ marginTop: 12 }}>
                  {p.lines.map((l, li) => (
                    <div
                      key={l}
                      style={{
                        fontFamily: mono,
                        fontSize: 13,
                        lineHeight: 1.5,
                        color: i === 4 && li === 1 ? colors.accent : colors.muted,
                        fontVariantNumeric: 'tabular-nums',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {l}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {/* 枝 5 胶片光（末 15f 收束） */}
          <div
            style={{
              position: 'absolute',
              left: 615,
              top: 541,
              width: 983,
              height: 3,
              backgroundImage: `linear-gradient(90deg, transparent, ${colors.gold})`,
              transform: 'rotate(-7.37deg)',
              transformOrigin: 'left center',
              opacity: film * 0.9,
            }}
          />
        </AbsoluteFill>
      </CameraRig>
      {/* 总结纸页白边（交接态） */}
      <AbsoluteFill style={{ pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: 14, background: FILM_COLORS.flashWhite, opacity: film * 0.9 }} />
        <div style={{ position: 'absolute', left: 0, bottom: 0, right: 0, height: 14, background: FILM_COLORS.flashWhite, opacity: film * 0.9 }} />
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 12, background: FILM_COLORS.flashWhite, opacity: film * 0.9 }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 12, background: FILM_COLORS.flashWhite, opacity: film * 0.9 }} />
        <AbsoluteFill style={{ background: colors.paper, opacity: film * 0.16 }} />
      </AbsoluteFill>
      <PaperGrain opacity={0.05} />
      <Grade id="GR-02" />
      {CAPTIONS.map((c) => (
        <div key={c.from} style={{ opacity: interpolate(frame, [c.to - 6, c.to], [1, 0], CLAMP) }}>
          <Caption text={c.text} appearAt={c.from} bottom={44} />
        </div>
      ))}
    </AbsoluteFill>
  );
};

export default ShotDerivationTree;
