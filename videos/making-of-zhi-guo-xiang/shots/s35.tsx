/* s35 · 留白（270f · 9.0s，Act 7 · 幕后）
 *
 * 深夜空镜（原生绘制，非屏录）：暗底上两扇代码窗——
 *   · 编辑器 mock：左列文件树细行 + 右侧代码行块（paper 低透明度错落，accent/gold 点缀）；
 *   · 日志流窗：tail -f 渲染日志行。
 * 两窗内容各自整窗 translateY 缓慢滚动——用周期函数（sin）避免循环跳变；
 * 整镜缓推近 scale 1→1.06（MO-EASE-INOUT）。无字幕（MO-CAP-MAX：留白镜不挂）。
 * 入 cut / 出 ink（下一镜 inbound，ShotShell 承接）。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CLAMP, MO_EASE } from '../motion-tokens';

const DURATION = 270;

/** 明暗差一律由 tokens 派生（rgba），不引入新色值 */
const rgba = (hex: string, alpha: number): string => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};

/* 文件树细行（左列）：宽度/透明度确定性错落 */
const TREE_ROWS = Array.from({ length: 12 }, (_, i) => ({
  w: 70 + random(`s35-tree-w-${i}`) * 130,
  o: 0.1 + random(`s35-tree-o-${i}`) * 0.12,
}));

/* 代码行块：缩进 + 块宽 + 色相（大部分 paper，少量 accent / gold） */
type CodeRow = { indent: number; w: number; o: number; color: string };
const CODE_ROWS: CodeRow[] = Array.from({ length: 20 }, (_, i) => {
  const kind = i % 5 === 2 ? 'accent' : i % 7 === 4 ? 'gold' : 'paper';
  return {
    indent: Math.floor(random(`s35-code-ind-${i}`) * 4) * 18,
    w: 40 + random(`s35-code-w-${i}`) * 200,
    o: 0.1 + random(`s35-code-o-${i}`) * 0.16,
    color: kind === 'accent' ? colors.accent : kind === 'gold' ? colors.gold : colors.paper,
  };
});

/* 日志流行（静态字符串，确定性） */
const LOG_ROWS = [
  { text: '00:41:07  render-shot s11 — cache hit', tone: 'dim' },
  { text: '00:41:11  render-shot s12 — frame 118/210', tone: 'std' },
  { text: '00:41:26  render-shot s12 ok — 188s', tone: 'ok' },
  { text: '00:41:26  assemble: 39/41 waiting', tone: 'dim' },
  { text: '00:41:58  render-shot s18 ok — 74s', tone: 'ok' },
  { text: '00:42:30  concat demuxer — trim frame-exact', tone: 'std' },
  { text: '00:43:02  ✓ assemble ok — 41/41', tone: 'ok' },
  { text: '00:43:02  ✓ mux audio — aac 256k', tone: 'ok' },
  { text: '00:43:03  ✓ ffprobe — 7980 frames', tone: 'ok' },
  { text: '00:43:03  ✓ checksum — all green', tone: 'ok' },
  { text: '00:43:10  render-status: done', tone: 'std' },
  { text: '00:43:10  notify: osascript sent', tone: 'dim' },
] as const;

const LOG_TONE: Record<string, { color: string; opacity: number }> = {
  std: { color: colors.terminalText, opacity: 0.55 },
  dim: { color: colors.muted, opacity: 0.5 },
  ok: { color: colors.accent, opacity: 0.72 },
};

/** 窗体标题栏（两窗共用） */
const TitleBar: FC<{ title: string; height?: number; fontSize?: number }> = ({ title, height = 46, fontSize = 15 }) => (
  <div
    style={{
      height,
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '0 18px',
      borderBottom: `1px solid ${colors.hairline}`,
    }}
  >
    <div style={{ display: 'flex', gap: 7 }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ width: 10, height: 10, borderRadius: 5, background: colors.paperMuted, opacity: 0.3 }} />
      ))}
    </div>
    <div style={{ fontFamily: fontFamilies.mono, fontSize, letterSpacing: 2, color: colors.muted }}>{title}</div>
  </div>
);

const S35: FC = () => {
  const f = useCurrentFrame();
  // 整镜缓推近（MO-EASE-INOUT）
  const push = interpolate(f, [0, DURATION], [1, 1.06], { ...CLAMP, easing: MO_EASE.inout });
  // 周期滚动（sin）：循环无跳变；编辑器内容缓降，日志流错相位
  const codeY = 22 * Math.sin((2 * Math.PI * f) / 380 - 0.6);
  const logY = 14 * Math.sin((2 * Math.PI * f) / 300 + 1.1);

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      {/* 顶部微光（线性，非 radial）：bgLift 派生的纵深 */}
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${rgba(colors.bgLift, 0.6)} 0%, ${rgba(colors.bgLift, 0)} 38%)` }} />

      {/* 推近包裹层 */}
      <div style={{ position: 'absolute', inset: 0, transform: `scale(${push})`, transformOrigin: '52% 50%' }}>
        {/* 窗一 · 编辑器 mock */}
        <div
          style={{
            position: 'absolute',
            left: 130,
            top: 140,
            width: 1000,
            height: 600,
            background: colors.bgLift,
            border: `1px solid ${colors.hairline}`,
            borderRadius: 12,
            overflow: 'hidden',
            boxShadow: `0 30px 80px ${rgba(colors.bg, 0.6)}`,
          }}
        >
          <TitleBar title="wuh.site.video · scripts/render-film.mjs" />
          <div style={{ display: 'flex', height: 554 }}>
            {/* 文件树 */}
            <div style={{ width: 230, padding: '20px 22px', borderRight: `1px solid ${colors.hairline}` }}>
              <div style={{ transform: `translateY(${codeY * 0.4}px)` }}>
                {TREE_ROWS.map((row, i) => (
                  <div
                    key={i}
                    style={{
                      width: row.w,
                      height: 9,
                      borderRadius: 4.5,
                      marginBottom: 22,
                      background: i === 3 ? colors.accent : colors.paperMuted,
                      opacity: i === 3 ? 0.42 : row.o,
                    }}
                  />
                ))}
              </div>
            </div>
            {/* 代码行块 */}
            <div style={{ flex: 1, padding: '26px 28px', overflow: 'hidden' }}>
              <div style={{ transform: `translateY(${codeY}px)` }}>
                {CODE_ROWS.map((row, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', height: 24, marginBottom: 4 }}>
                    <div style={{ width: row.indent, flexShrink: 0 }} />
                    <div style={{ width: row.w, height: 10, borderRadius: 5, background: row.color, opacity: row.o }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 窗二 · 渲染日志流 */}
        <div
          style={{
            position: 'absolute',
            left: 1170,
            top: 330,
            width: 620,
            height: 440,
            background: colors.terminalBg,
            border: `1px solid ${colors.hairline}`,
            borderRadius: 12,
            overflow: 'hidden',
            boxShadow: `0 30px 80px ${rgba(colors.bg, 0.6)}`,
          }}
        >
          <TitleBar title="render — tail -f render-status.log" height={40} fontSize={14} />
          <div style={{ padding: '18px 24px', overflow: 'hidden' }}>
            <div style={{ transform: `translateY(${logY}px)` }}>
              {LOG_ROWS.map((row, i) => {
                const tone = LOG_TONE[row.tone];
                return (
                  <div
                    key={i}
                    style={{
                      fontFamily: fontFamilies.mono,
                      fontSize: 16,
                      lineHeight: '27px',
                      whiteSpace: 'nowrap',
                      color: tone.color,
                      opacity: tone.opacity,
                    }}
                  >
                    {row.text}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export default S35;
