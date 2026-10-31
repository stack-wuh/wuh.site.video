/* 镜 02 · Act 1 墨点 · 局部帧 [0,180) · 180f
   墨点同位起笔，笔锋线 0–44f 生长（FN-21），题记「wuh.site · 朝朝如念」字组
   78–118f 错峰 write-fade，120f（全局 240f）落定后 100→98% 极缓后拉；
   尾帧题记+余墨光点。GR-02；字幕同句（画面文字 + Caption 并置，与 s09 同语法）。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, paperBreathe, pathDraw, penGlow, writeFade } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DustField } from '../components/DustField';
import { PaperGrain } from '../components/PaperGrain';
import { Grade } from '../components/Grade';
import { Caption } from '../components/Caption';

const INK = { x: 760, y: 700 };
const END = { x: 1650, y: 470 };
const GROUPS = ['wuh.site ', '· ', '朝', '朝', '如', '念'];
const WRITE_START = 78;
const STAGGER = 2.4;

const ShotInscription: FC = () => {
  const frame = useCurrentFrame();
  const pull = interpolate(frame, [120, 180], [1, 0.98], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const glow = interpolate(frame, [40, 56], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const reveal = interpolate(frame, [0, 8], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });

  return (
    <AbsoluteFill style={{ background: colors.paper }}>
      <CameraRig cam={{ scale: pull, x: 0, y: 0, rot: 0 }}>
        <AbsoluteFill style={paperBreathe(frame, 0.6)}>
          <DustField act={1} count={50} seedBase="s02" />
          {/* 承接 S1：暖黑纸面 8f 内显影为暖白纸 */}
          <AbsoluteFill style={{ background: colors.bg, opacity: reveal }} />
          {/* 承接 S1 尾帧：墨点同位静置 */}
          <div
            style={{
              position: 'absolute',
              left: INK.x - 26,
              top: INK.y - 22,
              width: 52,
              height: 44,
              borderRadius: '50%',
              background: colors.ink,
              opacity: 0.88,
              filter: 'blur(3px)',
            }}
          />
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
            <path
              d={`M ${INK.x} ${INK.y - 12} C 900 660, 940 545, 1120 512 C 1320 478, 1500 490, ${END.x} ${END.y}`}
              fill="none"
              stroke={colors.ink}
              strokeWidth={3}
              strokeLinecap="round"
              style={pathDraw(frame, 0, 40, 1200)}
            />
          </svg>
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 300,
              display: 'flex',
              justifyContent: 'center',
              fontFamily: fontFamilies.serif,
              fontSize: 92,
              fontWeight: 400,
              letterSpacing: '0.3em',
              color: colors.ink,
              whiteSpace: 'pre',
            }}
          >
            {GROUPS.map((group, i) => (
              <span key={i} style={{ display: 'inline-block', ...writeFade(frame, WRITE_START + i * STAGGER, true) }}>
                {group}
              </span>
            ))}
          </div>
          <div style={{ ...penGlow(frame, END.x, END.y), opacity: 0.85 * glow }} />
        </AbsoluteFill>
      </CameraRig>
      <PaperGrain opacity={0.07} />
      <Grade id="GR-02" />
      <Caption text="wuh.site · 朝朝如念" appearAt={116} />
    </AbsoluteFill>
  );
};

export default ShotInscription;
