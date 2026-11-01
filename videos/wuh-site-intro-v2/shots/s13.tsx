/* 镜 13 · Act 2 旧屋 · 局部帧 [0,144) · 144f
   推入屏幕（TR-08）：笔电屏幕亮成深色编辑器，旧 JS 四行级替换为 TypeScript（FN-15 低强度闪白），
   类型标注浮出，角落日历翻到 2021-10；尾帧编译通过徽标亮起；字幕「十月，他用 TypeScript 重写博客前端；」。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, inkRise, lightOn, lineReplace } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { PaperGrain } from '../components/PaperGrain';
import { Grade } from '../components/Grade';

type Tok = { t: string; a?: boolean };
type CodeLine = { at: number; js: Tok[]; ts?: Tok[] };

const LINES: CodeLine[] = [
  {
    at: 44,
    js: [{ t: 'function renderPost(post) {' }],
    ts: [{ t: 'function renderPost(' }, { t: 'post: Post', a: true }, { t: '): ' }, { t: 'HTMLElement', a: true }, { t: ' {' }],
  },
  { at: 68, js: [{ t: "  var el = document.createElement('div')" }], ts: [{ t: "  const el = document.createElement('div')" }] },
  { at: -1, js: [{ t: '  el.innerHTML = post.html' }] },
  { at: 92, js: [{ t: '  posts.forEach(function (item) {' }], ts: [{ t: '  posts.forEach((item' }, { t: ': Post', a: true }, { t: ') => {' }] },
  { at: -1, js: [{ t: '    el.appendChild(renderItem(item))' }] },
  { at: -1, js: [{ t: '  })' }] },
  { at: -1, js: [{ t: '  return el' }] },
  { at: -1, js: [{ t: '}' }] },
  { at: -1, js: [{ t: '' }] },
  { at: -1, js: [{ t: 'export function renderList(posts) {' }] },
  { at: -1, js: [{ t: '  return posts.map(renderPost)' }] },
  { at: -1, js: [{ t: '}' }] },
  { at: 114, js: [{ t: 'module.exports = renderPost' }], ts: [{ t: 'export default renderPost' }] },
];

const ShotRewriteTs: FC = () => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 24], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const cam = {
    scale: interpolate(frame, [0, 144], [1.02, 1.07], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    x: 0,
    y: interpolate(frame, [0, 44, 68, 92, 114, 144], [0, -6, -20, -34, -48, -48], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    rot: 0,
  };
  const calIn = interpolate(frame, [34, 48], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const badge = lightOn(frame, 116, 30);

  return (
    <AbsoluteFill>
      <CameraRig cam={cam}>
        <AbsoluteFill
          style={{
            background: colors.terminalBg,
            clipPath: `inset(${(1 - enter) * 88}px ${(1 - enter) * 130}px ${(1 - enter) * 88}px ${(1 - enter) * 130}px)`,
            transform: `scale(${0.94 + enter * 0.06})`,
          }}
        >
          <div style={{ position: 'absolute', inset: 0, border: `10px solid ${colors.bgLift}`, borderRadius: 18, opacity: 1 - enter }} />
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              height: 64,
              background: colors.bg,
              borderBottom: `1px solid ${colors.hairline}`,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '0 28px',
            }}
          >
            {[0, 1, 2].map((i) => (
              <span key={i} style={{ width: 12, height: 12, borderRadius: 6, background: colors.muted, opacity: 0.35 + i * 0.1 }} />
            ))}
            <span style={{ marginLeft: 18, fontFamily: fontFamilies.mono, fontSize: 17, letterSpacing: '0.1em', color: colors.terminalText, opacity: 0.75 }}>
              src/PostList.{frame < 44 ? 'js' : 'ts'}
            </span>
            <span style={{ marginLeft: 'auto', fontFamily: fontFamilies.mono, fontSize: 15, letterSpacing: '0.14em', color: colors.muted, fontVariantNumeric: 'tabular-nums' }}>UTF-8 · 2021-10</span>
          </div>

          <div style={{ position: 'absolute', left: 240, right: 380, top: 118 }}>
            {LINES.map((line, i) => {
              const replaced = line.at >= 0;
              const t = frame - line.at;
              const oldOpacity = replaced
                ? interpolate(t, [0, 10], [0.9, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut })
                : 0.9;
              const newOpacity = replaced
                ? interpolate(t, [2, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut })
                : 0;
              const flash = replaced ? lineReplace(frame, line.at).flash : 0;
              return (
                <div key={i} style={{ position: 'relative', display: 'flex', height: 50 }}>
                  <span style={{ width: 66, textAlign: 'right', paddingRight: 24, fontFamily: fontFamilies.mono, fontSize: 19, lineHeight: '50px', color: colors.muted, opacity: 0.5, fontVariantNumeric: 'tabular-nums' }}>
                    {i + 1}
                  </span>
                  <div style={{ position: 'relative', flex: 1, height: 50 }}>
                    {flash > 0 ? (
                      <div style={{ position: 'absolute', left: -10, right: 0, top: 4, height: 42, background: colors.paperMist, opacity: flash * 0.9, mixBlendMode: 'screen' }} />
                    ) : null}
                    <span style={{ position: 'absolute', left: 0, top: 0, lineHeight: '50px', whiteSpace: 'pre', fontFamily: fontFamilies.mono, fontSize: 25, color: colors.terminalText, opacity: oldOpacity }}>
                      {line.js.map((tok, j) => (
                        <span key={j}>{tok.t}</span>
                      ))}
                    </span>
                    {line.ts ? (
                      <span style={{ position: 'absolute', left: 0, top: 0, lineHeight: '50px', whiteSpace: 'pre', fontFamily: fontFamilies.mono, fontSize: 25, opacity: newOpacity }}>
                        {line.ts.map((tok, j) => (
                          <span key={j} style={{ color: tok.a ? colors.accent : colors.terminalText, ...(tok.a ? inkRise(frame, line.at + 6) : {}) }}>
                            {tok.t}
                          </span>
                        ))}
                      </span>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ position: 'absolute', left: 1580, top: 118, width: 240, height: 206, transform: `perspective(900px) rotateY(${(1 - calIn) * -88}deg)`, transformOrigin: 'right center', opacity: calIn }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 4, background: colors.paper, boxShadow: `0 14px 30px ${colors.bg}` }} />
            <div style={{ position: 'absolute', left: 18, top: 14, fontFamily: fontFamilies.mono, fontSize: 19, letterSpacing: '0.14em', color: colors.ink, fontVariantNumeric: 'tabular-nums' }}>2021 / 10</div>
            <div style={{ position: 'absolute', left: 18, right: 18, top: 50, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
              {Array.from({ length: 28 }).map((_, k) => (
                <div
                  key={k}
                  style={{
                    height: 14,
                    borderRadius: 2,
                    background: k >= 11 && k <= 16 ? colors.seal : colors.paperDeep,
                    opacity: k >= 11 && k <= 16 ? 0.75 : 0.9,
                  }}
                />
              ))}
            </div>
            <div style={{ position: 'absolute', left: 18, bottom: 14, fontFamily: fontFamilies.sans, fontSize: 13, letterSpacing: '0.3em', color: colors.seal, opacity: 0.8 }}>假期</div>
          </div>

          <div style={{ position: 'absolute', right: 90, bottom: 92, ...badge }}>
            <div style={{ padding: '16px 24px', border: `1px solid ${colors.accent}`, borderRadius: 6, background: colors.terminalBg }}>
              <div style={{ fontFamily: fontFamilies.mono, fontSize: 17, letterSpacing: '0.12em', color: colors.terminalText, opacity: 0.7 }}>tsc --noEmit</div>
              <div style={{ marginTop: 8, fontFamily: fontFamilies.mono, fontSize: 21, letterSpacing: '0.1em', color: colors.accent, fontVariantNumeric: 'tabular-nums' }}>✓ 0 ERRORS · 编译通过</div>
            </div>
          </div>

          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: 42,
              background: colors.bg,
              borderTop: `1px solid ${colors.hairline}`,
              display: 'flex',
              alignItems: 'center',
              padding: '0 26px',
              fontFamily: fontFamilies.mono,
              fontSize: 15,
              letterSpacing: '0.1em',
              color: colors.muted,
            }}
          >
            <span>src/PostList.ts</span>
            <span style={{ marginLeft: 'auto', fontVariantNumeric: 'tabular-nums' }}>Ln 1, Col 1 · TypeScript</span>
          </div>
        </AbsoluteFill>
        <DustField act={2} seedBase="s13" />
      </CameraRig>
      <PaperGrain opacity={0.06} />
      <Grade id="GR-01" />
      <Grade id="GR-04" />
      <Caption text="十月，他用 TypeScript 重写博客前端；" appearAt={26} />
    </AbsoluteFill>
  );
};

export default ShotRewriteTs;
