/* 镜 15 · Act 2 旧屋 · 局部帧 [0,216) · 216f
   自绿灯长后拉 + 横移（CM-04 + CM-07，全片最缓）：2021 全年页面在时间轴上排成走廊，
   墨点走完 2021、停在年末；走廊尽头 2022 纸缘透出灰亮，末 20f 轻推纸缘（交接时间轴末端 + 纸缘微光）；无字幕。 */
import { Fragment, type FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, FILM_COLORS } from '../motion-tokens';
import { CameraRig, ParallaxLayer } from '../components/CameraRig';
import { DustField } from '../components/DustField';
import { PaperGrain } from '../components/PaperGrain';
import { Grade } from '../components/Grade';

const DUR = 216;
const DOT_START = 34;
const DOT_STOP = 176;
const MONTH_GAP = 1520 / 11;

const ShotCorridor2021: FC = () => {
  const frame = useCurrentFrame();
  const pull = interpolate(frame, [0, DUR], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const push = interpolate(frame, [196, 216], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const travel = interpolate(frame, [DOT_START, DOT_STOP], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const green = interpolate(frame, [0, 64], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const dark = interpolate(frame, [0, 70], [0.78, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const cam = {
    scale: 1.55 - pull * 0.53 + push * 0.035,
    x: 96 - pull * 148 - push * 26,
    y: 34 - pull * 34,
    rot: 0,
    origin: '62% 56%',
  };
  const dotX = 210 + travel * 1520;

  return (
    <AbsoluteFill>
      <CameraRig cam={cam}>
        <div style={{ position: 'absolute', inset: -140, background: colors.paper }} />
        <ParallaxLayer depth={0.4} cam={cam}>
          <div style={{ position: 'absolute', left: 60, top: 160, fontFamily: fontFamilies.serif, fontSize: 420, color: colors.ink, opacity: 0.05, fontVariantNumeric: 'tabular-nums' }}>2021</div>
        </ParallaxLayer>
        <AbsoluteFill>
          <div style={{ position: 'absolute', left: 170, top: 240, fontFamily: fontFamilies.serif, fontSize: 140, color: colors.ink, opacity: 0.8, fontVariantNumeric: 'tabular-nums' }}>2021</div>

          {Array.from({ length: 12 }).map((_, i) => {
            const h = 116 + ((i * 37) % 68);
            const x = 210 + i * MONTH_GAP;
            return (
              <div
                key={`card-${i}`}
                style={{
                  position: 'absolute',
                  left: x - 46,
                  top: 634 - h,
                  width: 92,
                  height: h,
                  borderRadius: 3,
                  background: i % 3 === 0 ? colors.paper : i % 3 === 1 ? colors.paperDeep : colors.paperMuted,
                  transform: `rotate(${((i % 3) - 1) * 1.4}deg)`,
                  boxShadow: `0 10px 24px ${colors.bg}`,
                  padding: 10,
                }}
              >
                <div style={{ height: 7, width: 56, borderRadius: 2, background: colors.ink, opacity: 0.22, marginBottom: 8 }} />
                <div style={{ height: 7, width: 44, borderRadius: 2, background: colors.ink, opacity: 0.14 }} />
              </div>
            );
          })}

          <div style={{ position: 'absolute', left: 180, top: 660, width: 1560, height: 2, background: colors.ink, opacity: 0.16 }} />
          <div style={{ position: 'absolute', left: 180, top: 659, width: 1550, height: 2, background: colors.ink, opacity: 0.55, transform: `scaleX(${travel})`, transformOrigin: 'left' }} />

          {Array.from({ length: 12 }).map((_, i) => {
            const x = 210 + i * MONTH_GAP;
            return (
              <Fragment key={`tick-${i}`}>
                <div style={{ position: 'absolute', left: x - 1, top: 654, width: 2, height: 12, background: colors.ink, opacity: 0.4 }} />
                <span
                  style={{
                    position: 'absolute',
                    left: x - 24,
                    top: 680,
                    width: 48,
                    textAlign: 'center',
                    fontFamily: fontFamilies.mono,
                    fontSize: 17,
                    color: colors.ink,
                    opacity: 0.5,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
              </Fragment>
            );
          })}

          <div style={{ position: 'absolute', left: 1726, top: 646, width: 3, height: 28, background: colors.ink, opacity: 0.7 }} />
          <div style={{ position: 'absolute', left: dotX - 21, top: 639, width: 42, height: 42, borderRadius: 21, background: colors.ink, opacity: 0.12 }} />
          <div style={{ position: 'absolute', left: dotX - 8, top: 652, width: 16, height: 16, borderRadius: 8, background: colors.ink }} />

          <div style={{ position: 'absolute', left: 1748, top: 90, width: 520, height: 900, borderRadius: 4, background: colors.paper, transform: 'rotate(1.2deg)', boxShadow: `-30px 0 80px ${colors.bg}` }}>
            <div style={{ position: 'absolute', left: 34, top: 48, fontFamily: fontFamilies.mono, fontSize: 26, letterSpacing: '0.3em', color: colors.ink, opacity: 0.28, fontVariantNumeric: 'tabular-nums' }}>2022</div>
            <div style={{ position: 'absolute', left: 34, top: 118, width: 300, height: 8, borderRadius: 2, background: colors.ink, opacity: 0.1 }} />
            <div style={{ position: 'absolute', left: 34, top: 142, width: 260, height: 8, borderRadius: 2, background: colors.ink, opacity: 0.07 }} />
          </div>
          <div
            style={{
              position: 'absolute',
              left: 1736,
              top: 120,
              width: 26,
              height: 840,
              background: `linear-gradient(90deg, ${FILM_COLORS.paperMist}, transparent)`,
              opacity: 0.7,
              mixBlendMode: 'screen',
            }}
          />

          <div style={{ position: 'absolute', inset: 0, background: colors.bg, opacity: dark }} />
          <div
            style={{
              position: 'absolute',
              left: 878,
              top: 550,
              width: 32,
              height: 32,
              borderRadius: 16,
              background: FILM_COLORS.statusGreen,
              opacity: green,
              boxShadow: `0 0 30px ${FILM_COLORS.statusGreen}`,
              transform: `scale(${1 + (1 - green) * 0.2})`,
            }}
          />
        </AbsoluteFill>
        <DustField act={2} seedBase="s15" />
      </CameraRig>
      <PaperGrain opacity={0.06} />
      <Grade id="GR-01" />
      <Grade id="GR-04" />
    </AbsoluteFill>
  );
};

export default ShotCorridor2021;
