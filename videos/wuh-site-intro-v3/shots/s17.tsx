import type { FC } from 'react';
import { AbsoluteFill, interpolate, interpolateColors, useCurrentFrame, useVideoConfig } from 'remotion';
import { KineticLine } from '../components/KineticLine';
import { Panel } from '../components/Panel';
import { ShotShell } from '../components/ShotShell';
import { DataLabel, Meta } from '../components/Type';
import { EASE, FILM_COLORS, FONTS, blink, progress, springP, SP } from '../motion-tokens';

/**
 * s17 · 2024-12-08 第一行代码（130f，1800–1930）
 * 首 3f 纸白满屏（FX-01，第一记重音前的呼吸）→ 白底终端窗自中央弹出（EN-02 cardLand 92%→100%，落定 1820 = 镜内 20f）
 * → 5 行逐行打出（TX-02，15f/行），末行以朱红光标停住（TX-03）；窗下 2024-12-08 + v2.0.0（TX-05）。
 * 纸面其余压暗（ShotShell tone=dim，motion-spec FX-06 的合法改纸色口）。
 * 数据：materials v4 §二 — 2024-12-08 首行 `feat(init): 基于nextjs构建的monorepos项目`、同日打 v2.0.0、
 * 当晚 17:25→20:57 连打 7 个提交（init / components / husky / changelog / 版本号）。
 * 前 4 行命令按该晚同名步骤还原（init / husky / 版本号 v2.0.0），末行逐字取自 materials。
 */

const LINES: ReadonlyArray<{ text: string; cmd: boolean }> = [
  { text: 'git init', cmd: true },
  { text: 'pnpm init -w', cmd: true },
  { text: 'husky init', cmd: true },
  { text: 'git tag v2.0.0', cmd: true },
  { text: 'feat(init): 基于nextjs构建的monorepos项目', cmd: false },
];

const WIN_W = 1180;
const WIN_H = 430;

const S17: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* FX-01：0–3f 纸白满屏 → 3–15f 释放到纸面（底色层切换，不叠白矩形） */
  const bg = interpolateColors(frame, [0, 3, 15], [FILM_COLORS.white, FILM_COLORS.white, FILM_COLORS.paper], {
    easing: EASE.out,
  });

  /* EN-02 终端窗：92% → 100%（cardLand），落定 20 */
  const land = springP(frame, fps, 10, SP.cardLand);
  const winIn = progress(frame, 10, 8);
  /* CAM-02 推进 +1.5%（落定后单向前推，窗内提亮感） */
  const push = interpolate(frame, [96, 130], [1, 1.015], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE.inOut,
  });

  return (
    <ShotShell act="ACT 02 · 沉默" tone="dim">
      <AbsoluteFill>
        <AbsoluteFill style={{ backgroundColor: bg }} />

        {/* 终端窗 */}
        <div
          style={{
            position: 'absolute',
            left: (1920 - WIN_W) / 2,
            top: 292,
            width: WIN_W,
            opacity: winIn,
            transform: `scale(${(0.92 + 0.08 * land) * push})`,
            transformOrigin: '50% 50%',
          }}
        >
          <Panel width={WIN_W} height={WIN_H} title="~/x.wuh.site · zsh">
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {LINES.map((l, i) => {
                const at = 20 + i * 15;
                const p = progress(frame, at, 6);
                const isLast = i === LINES.length - 1;
                return (
                  <div
                    key={l.text}
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      height: 54,
                      opacity: p,
                      transform: `translateY(${(1 - p) * 4}px)`,
                    }}
                  >
                    <div
                      style={{
                        width: 34,
                        flexShrink: 0,
                        textAlign: 'right',
                        fontFamily: FONTS.mono,
                        fontSize: 14,
                        color: FILM_COLORS.muted,
                        opacity: 0.7,
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {i + 1}
                    </div>
                    <div
                      style={{
                        marginLeft: 22,
                        fontFamily: FONTS.mono,
                        fontSize: 24,
                        whiteSpace: 'pre',
                        color: l.cmd ? FILM_COLORS.inkSoft : FILM_COLORS.ink,
                      }}
                    >
                      {l.cmd ? <span style={{ color: FILM_COLORS.vermillion, marginRight: 12 }}>$</span> : null}
                      {l.text}
                      {isLast ? (
                        <span
                          style={{
                            display: 'inline-block',
                            width: 12,
                            height: 24,
                            marginLeft: 6,
                            verticalAlign: 'text-bottom',
                            backgroundColor: FILM_COLORS.vermillion,
                            opacity: frame >= at + 4 && blink(frame, 6) ? 1 : 0,
                          }}
                        />
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>
        </div>

        {/* 窗下：2024-12-08 + v2.0.0（TX-05 标识不滚） */}
        <div
          style={{
            position: 'absolute',
            left: (1920 - WIN_W) / 2,
            top: 744,
            display: 'flex',
            alignItems: 'center',
            gap: 22,
            opacity: progress(frame, 84, 10),
            transform: `translateY(${(1 - progress(frame, 84, 10)) * 6}px)`,
          }}
        >
          <Meta size={16} color={FILM_COLORS.inkSoft}>
            2024-12-08
          </Meta>
          <div style={{ width: 44, height: 1, backgroundColor: FILM_COLORS.hairline }} />
          <DataLabel size={16}>v2.0.0</DataLabel>
          <Meta size={13}>FIRST COMMIT · 17:25</Meta>
        </div>

        {/* 字幕 */}
        <div style={{ position: 'absolute', left: 120, top: 940, width: 1660 }}>
          <KineticLine text="2024 年 12 月 8 日，他敲下新站第一行代码。" start={30} framesPerChar={2} size={44} />
          <div style={{ marginTop: 14, width: 320, height: 1, backgroundColor: FILM_COLORS.hairline }} />
        </div>
      </AbsoluteFill>
    </ShotShell>
  );
};

export default S17;