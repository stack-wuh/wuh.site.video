/* 镜 05 · Act 1 墨点 · 局部帧 [0,102) · 102f
   旧站线框自「0」余光淡入（0–12f）；Node/Express/MongoDB/Nginx 四块基石
   12/32/52/72f 依次坠落（SP-06，回弹 ≤6%），落一块点亮一块；四块齐后整页暖光
   （GR-04）并 100→102% 极缓升。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, blockDrop } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { PaperGrain } from '../components/PaperGrain';
import { Grade } from '../components/Grade';

const BLOCKS = [
  { label: 'Node', x: 480, delay: 12 },
  { label: 'Express', x: 730, delay: 32 },
  { label: 'MongoDB', x: 980, delay: 52 },
  { label: 'Nginx', x: 1230, delay: 72 },
];

const ZONES = [
  { left: 400, top: 210, width: 1120, height: 64 },
  { left: 400, top: 300, width: 1120, height: 180 },
  { left: 400, top: 510, width: 1120, height: 240 },
  { left: 400, top: 780, width: 1120, height: 90 },
];

const ShotFoundation: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ghost = interpolate(frame, [0, 10], [0.22, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const wire = interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const lift = interpolate(frame, [72, 102], [1, 1.02], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const warm = interpolate(frame, [86, 100], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });

  return (
    <AbsoluteFill style={{ background: colors.paper }}>
      <CameraRig cam={{ scale: lift, x: 0, y: 0, rot: 0 }}>
        <AbsoluteFill>
          <DustField act={1} count={40} seedBase="s05" />
          {/* 「0」余光：承接 S4 尾帧 */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 250,
              textAlign: 'center',
              fontFamily: fontFamilies.serif,
              fontSize: 300,
              lineHeight: 1,
              color: colors.ink,
              opacity: ghost,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            0
          </div>
          <AbsoluteFill style={{ transform: 'perspective(1400px) rotateX(1.5deg)', opacity: wire }}>
            {/* 旧站线框 */}
            <div style={{ position: 'absolute', left: 380, top: 190, width: 1160, height: 700, border: `1px solid ${colors.muted}`, opacity: 0.5 }} />
            <div style={{ position: 'absolute', left: 400, top: 210, width: 1120, height: 64, border: `1px solid ${colors.muted}`, opacity: 0.4 }} />
            <div style={{ position: 'absolute', left: 400, top: 300, width: 1120, height: 180, border: `1px solid ${colors.muted}`, opacity: 0.4 }} />
            <div style={{ position: 'absolute', left: 400, top: 510, width: 360, height: 240, border: `1px solid ${colors.muted}`, opacity: 0.35 }} />
            <div style={{ position: 'absolute', left: 780, top: 510, width: 360, height: 240, border: `1px solid ${colors.muted}`, opacity: 0.35 }} />
            <div style={{ position: 'absolute', left: 1160, top: 510, width: 360, height: 240, border: `1px solid ${colors.muted}`, opacity: 0.35 }} />
            <div style={{ position: 'absolute', left: 400, top: 780, width: 1120, height: 90, border: `1px solid ${colors.muted}`, opacity: 0.4 }} />
            {/* 落一块点亮一块 */}
            {ZONES.map((zone, i) => {
              const at = BLOCKS[i].delay + 14;
              const p = interpolate(frame, [at, at + 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    ...zone,
                    background: colors.gold,
                    mixBlendMode: 'screen',
                    opacity: p * 0.32,
                  }}
                />
              );
            })}
          </AbsoluteFill>
          {/* 四块基石 */}
          {BLOCKS.map((block) => (
            <div
              key={block.label}
              style={{
                position: 'absolute',
                left: block.x,
                top: 640,
                width: 210,
                height: 104,
                ...blockDrop(frame, block.delay, fps),
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 4,
                  background: colors.ink,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <span style={{ fontFamily: fontFamilies.mono, fontSize: 12, color: colors.paper, opacity: 0.5, fontVariantNumeric: 'tabular-nums' }}>
                  {String(BLOCKS.indexOf(block) + 1).padStart(2, '0')}
                </span>
                <span style={{ fontFamily: fontFamilies.mono, fontSize: 30, color: colors.paper }}>{block.label}</span>
              </div>
            </div>
          ))}
        </AbsoluteFill>
      </CameraRig>
      <AbsoluteFill style={{ background: colors.gold, mixBlendMode: 'screen', opacity: warm * 0.22 }} />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 320,
          backgroundImage: `linear-gradient(180deg, transparent, ${colors.bg})`,
          opacity: 0.2,
        }}
      />
      <PaperGrain opacity={0.07} />
      <Grade id="GR-04" />
      <Caption text="搭起第一代个人站。" />
    </AbsoluteFill>
  );
};

export default ShotFoundation;
