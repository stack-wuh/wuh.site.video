import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';

const CODE_LINES = [
  'const whoami = () => {',
  "  return '吴尒红';",
  '};',
  '',
  'const stack = [',
  "  'TypeScript',",
  "  'Next.js',",
  "  'NestJS',",
  '];',
  '',
  'whoami();',
];

const POST_WIDTHS = [72, 55, 80, 48, 66, 60];

export const SplitScreen: FC = () => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fadeOut = interpolate(frame, [135, 150], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const visible = CODE_LINES.map((line, i) => {
    const t = frame - i * 8;
    if (t <= 0) return null;
    return line.slice(0, Math.min(t, line.length + 1));
  });
  const activeLine = visible.reduce((acc, v, i) => (v !== null ? i : acc), -1);
  const cursorOn = Math.floor(frame / 15) % 2 === 0;

  const rightIn = interpolate(frame, [20, 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const scrollY = interpolate(frame, [50, 135], [0, 260], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        opacity: fadeIn * fadeOut,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 56,
        padding: '0 96px',
      }}
    >
      {/* 左：终端打字机 */}
      <div
        style={{
          flex: 1.15,
          height: 640,
          background: colors.terminalBg,
          border: `1px solid ${colors.hairline}`,
          borderRadius: 20,
          boxShadow: '0 24px 80px rgba(0,0,0,0.45)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '18px 24px',
            borderBottom: '1px solid rgba(245,240,232,0.06)',
          }}
        >
          {['#e06c60', '#e0b050', '#7db27a'].map((color) => (
            <div
              key={color}
              style={{ width: 14, height: 14, borderRadius: 7, background: color }}
            />
          ))}
          <span
            style={{
              marginLeft: 12,
              fontFamily: fontFamilies.mono,
              fontSize: 20,
              color: colors.muted,
            }}
          >
            whoami — zsh
          </span>
        </div>
        <div style={{ padding: '32px 40px' }}>
          {visible.map((text, i) =>
            text === null ? null : (
              <div
                key={i}
                style={{
                  fontFamily: fontFamilies.mono,
                  fontSize: 26,
                  lineHeight: 1.7,
                  color: colors.terminalText,
                  whiteSpace: 'pre',
                }}
              >
                {text}
                {i === activeLine && cursorOn && (
                  <span
                    style={{
                      display: 'inline-block',
                      width: 14,
                      height: 28,
                      marginLeft: 2,
                      background: colors.accent,
                      verticalAlign: '-4px',
                    }}
                  />
                )}
              </div>
            ),
          )}
        </div>
      </div>

      {/* 右：博客页面 mock */}
      <div
        style={{
          flex: 1,
          height: 640,
          transform: `translateY(${(1 - rightIn) * 40}px)`,
          opacity: rightIn,
          background: colors.paper,
          borderRadius: 20,
          boxShadow: '0 24px 80px rgba(0,0,0,0.45)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '18px 24px',
            borderBottom: '1px solid rgba(43,38,32,0.08)',
          }}
        >
          {[colors.paperMuted, colors.paperMuted, colors.paperMuted].map((color, i) => (
            <div
              key={i}
              style={{ width: 14, height: 14, borderRadius: 7, background: color }}
            />
          ))}
          <div
            style={{
              marginLeft: 12,
              padding: '4px 20px',
              borderRadius: 12,
              background: colors.paperDeep,
              fontFamily: fontFamilies.mono,
              fontSize: 20,
              color: colors.muted,
            }}
          >
            x.wuh.site
          </div>
        </div>
        <div style={{ height: 560, overflow: 'hidden', padding: '40px 48px' }}>
          <div style={{ transform: `translateY(${-scrollY}px)` }}>
            <h2
              style={{
                fontFamily: fontFamilies.serif,
                fontSize: 56,
                color: colors.ink,
                margin: 0,
              }}
            >
              x.wuh.site
            </h2>
            <p
              style={{
                fontFamily: fontFamilies.sans,
                fontSize: 24,
                color: colors.muted,
                letterSpacing: '0.2em',
                margin: '12px 0 40px',
              }}
            >
              写代码，也写字
            </p>
            {POST_WIDTHS.map((width, i) => (
              <div key={i} style={{ marginBottom: 36 }}>
                <div
                  style={{
                    width: `${width}%`,
                    height: 20,
                    borderRadius: 10,
                    background: colors.paperMuted,
                  }}
                />
                <div
                  style={{
                    width: `${width * 0.45}%`,
                    height: 12,
                    borderRadius: 6,
                    background: colors.paperDeep,
                    marginTop: 14,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};