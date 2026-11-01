/* 镜 43 · Act 7 坐忘 · 局部帧 [0,132) · 132f
   承接 5364 朱红余晖：《坐忘歌》纸页立起化作双开窗；页面漫游矩形收束成窗框；
   CM-04 自纸页特写缓退成窗框全景（f4–70），推窗 40f（f68–108），七月晨光涌入；
   末 20f CM-13 焦点由窗棂拉向窗台纸页；GR-06；无字幕。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { CURVES } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DustField } from '../components/DustField';
import { PaperGrain } from '../components/PaperGrain';
import { Grade } from '../components/Grade';

const OPEN = { x: 600, y: 96, w: 720, h: 812 };
const SILL_Y = OPEN.y + OPEN.h;
const SILL_PAPER = { x: 820, y: SILL_Y + 28, w: 280, h: 118 };
const PAGE_CENTER = { x: OPEN.x + OPEN.w / 2, y: SILL_Y };
const HALF = OPEN.w / 2;

/* 纸面上暗示书写列的细痕，随双开窗一起翻动 */
const PAGE_HINTS = [0.16, 0.38, 0.6, 0.82];

const Shutter: FC<{ side: 'left' | 'right'; open: number; glow: number }> = ({ side, open, glow }) => {
  const left = side === 'left';
  return (
    <div
      style={{
        position: 'absolute',
        left: left ? 0 : HALF,
        top: 0,
        width: HALF,
        height: OPEN.h,
        transformOrigin: left ? 'left center' : 'right center',
        transform: `rotateY(${(left ? -1 : 1) * open * 76}deg)`,
        filter: `brightness(${1 - open * 0.26})`,
        background: `linear-gradient(180deg, ${colors.paper} 0%, ${colors.paperDeep} 100%)`,
        overflow: 'hidden',
      }}
    >
      {PAGE_HINTS.map((hx, i) => (
        <div
          key={hx}
          style={{
            position: 'absolute',
            left: HALF * hx - 1.5,
            top: 120 + ((i * 53) % 140),
            width: 3,
            height: 300 + (i % 3) * 60,
            background: colors.ink,
            opacity: 0.09,
          }}
        />
      ))}
      <div style={{ position: 'absolute', inset: 0, background: colors.seal, opacity: glow * 0.16, mixBlendMode: 'soft-light' }} />
    </div>
  );
};

const Bar: FC<{ left: number; top: number; width: number; height: number }> = ({ left, top, width, height }) => (
  <div style={{ position: 'absolute', left, top, width, height, background: colors.bgLift, border: `1px solid ${colors.hairline}` }} />
);

const ShotWindowRise: FC = () => {
  const frame = useCurrentFrame();
  const rise = interpolate(frame, [0, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const glow = interpolate(frame, [4, 30], [0.5, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const rects = interpolate(frame, [2, 26], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const pull = interpolate(frame, [4, 70], [2.55, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const open = interpolate(frame, [68, 108], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const lean = interpolate(frame, [100, 132], [0, 0.03], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const rack = interpolate(frame, [112, 132], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <CameraRig cam={{ scale: pull, x: 0, y: 0, rot: 0 }}>
        <AbsoluteFill
          style={{
            transform: `scale(${1 + lean})`,
            transformOrigin: `${SILL_PAPER.x + SILL_PAPER.w / 2}px ${SILL_PAPER.y + SILL_PAPER.h / 2}px`,
          }}
        >
          {/* 室内暖墙 */}
          <AbsoluteFill style={{ background: `linear-gradient(180deg, ${colors.bgLift} 0%, ${colors.bg} 62%)` }} />
          <div style={{ position: 'absolute', left: 0, right: 0, top: 72, height: 1, background: colors.hairline }} />

          {/* 页面漫游的矩形纵深收束成窗框 */}
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: OPEN.x,
                top: OPEN.y,
                width: OPEN.w,
                height: OPEN.h,
                border: `1px solid ${colors.accent}`,
                opacity: (1 - rects) * (0.22 - i * 0.05),
                transform: `scale(${1 + (1 - rects) * (0.1 + i * 0.1)})`,
              }}
            />
          ))}

          {/* 朱红余晖 */}
          <div
            style={{
              position: 'absolute',
              left: PAGE_CENTER.x - 320,
              top: PAGE_CENTER.y - 430,
              width: 640,
              height: 760,
              background: `radial-gradient(circle, ${colors.seal} 0%, transparent 70%)`,
              opacity: glow,
              mixBlendMode: 'screen',
            }}
          />

          {/* 窗外七月晨光 */}
          <div
            style={{
              position: 'absolute',
              left: OPEN.x,
              top: OPEN.y,
              width: OPEN.w,
              height: OPEN.h,
              background: `linear-gradient(180deg, ${colors.paper} 0%, ${colors.gold} 58%, ${colors.paperDeep} 100%)`,
              filter: `brightness(${0.68 + open * 0.42})`,
              opacity: rise,
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: OPEN.w * 0.58,
                top: OPEN.h * 0.3,
                width: 240,
                height: 240,
                borderRadius: 120,
                background: `radial-gradient(circle, ${colors.paper} 0%, transparent 66%)`,
                opacity: 0.75,
              }}
            />
          </div>

          {/* 纸页立起成窗（双开） */}
          <div style={{ position: 'absolute', inset: 0, perspective: 1600 }}>
            <div
              style={{
                position: 'absolute',
                left: OPEN.x,
                top: OPEN.y,
                width: OPEN.w,
                height: OPEN.h,
                transformStyle: 'preserve-3d',
                transform: `rotateX(${(1 - rise) * 34}deg)`,
                transformOrigin: '50% 100%',
              }}
            >
              <Shutter side="left" open={open} glow={glow} />
              <Shutter side="right" open={open} glow={glow} />
            </div>
          </div>

          {/* 窗棂（末 20f 随拉焦失焦） */}
          <div style={{ position: 'absolute', inset: 0, filter: `blur(${rack * 2.2}px)` }}>
            <Bar left={OPEN.x - 16} top={OPEN.y - 16} width={OPEN.w + 32} height={16} />
            <Bar left={OPEN.x - 16} top={OPEN.y} width={16} height={OPEN.h} />
            <Bar left={OPEN.x + OPEN.w} top={OPEN.y} width={16} height={OPEN.h} />
            <Bar left={OPEN.x + OPEN.w / 2 - 4} top={OPEN.y} width={8} height={OPEN.h} />
            <Bar left={OPEN.x} top={OPEN.y + OPEN.h / 2 - 4} width={OPEN.w} height={8} />
          </div>

          {/* 光从画外入 */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              clipPath: 'polygon(520px 420px, 1400px 640px, 1720px 1080px, 300px 1080px)',
              background: `linear-gradient(180deg, ${colors.gold} 0%, transparent 72%)`,
              opacity: open * 0.24,
              mixBlendMode: 'screen',
            }}
          />

          {/* 窗台与窗台纸页 */}
          <div style={{ position: 'absolute', left: OPEN.x - 90, top: SILL_Y, width: OPEN.w + 180, height: 34, background: colors.bgLift, borderTop: `1px solid ${colors.hairline}` }} />
          <div style={{ position: 'absolute', left: OPEN.x - 90, top: SILL_Y + 34, width: OPEN.w + 180, height: 70, background: `linear-gradient(180deg, ${colors.bg} 0%, ${colors.bgLift} 100%)`, opacity: 0.8 }} />
          <div
            style={{
              position: 'absolute',
              left: SILL_PAPER.x,
              top: SILL_PAPER.y,
              width: SILL_PAPER.w,
              height: SILL_PAPER.h,
              perspective: 600,
              filter: `blur(${(1 - rack) * 2.6}px)`,
              opacity: 0.5 + rack * 0.5,
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                transform: 'rotateX(52deg) rotate(-3deg)',
                transformOrigin: '50% 0%',
                background: `linear-gradient(180deg, ${colors.paper} 0%, ${colors.paperDeep} 100%)`,
                border: `1px solid ${colors.hairline}`,
              }}
            >
              <div style={{ position: 'absolute', inset: 0, background: colors.gold, opacity: 0.18 + rack * 0.22, mixBlendMode: 'soft-light' }} />
            </div>
          </div>

          <DustField act={7} count={14} seedBase="s43" />
        </AbsoluteFill>
      </CameraRig>
      <PaperGrain opacity={0.06} />
      <Grade id="GR-06" />
    </AbsoluteFill>
  );
};

export default ShotWindowRise;
