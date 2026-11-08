/* s30 · 改成按镜铺，中位误差一点五秒。（180f · 6.0s，Act 6 · 声音的进化）
 *
 * 对齐示意卡：同一对 cue 波形（上 = 画面轨，下 = 人声轨）分 9 段，每段初始错位
 * （random(seed) 交替正负），按 MO-WAVE-SNAP（4f，MO-EASE.back 弹回）依次吸附归位，
 * 间隔均匀 12f；全部归位后中位标注「中位 1.51s」定场。入 cut / 出 cut。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CLAMP, MO_CHART, MO_EASE, MO_WAVE } from '../motion-tokens';
import { Caption } from '../components/Caption';

const DURATION = 180;
const SEG_COUNT = 9;
const BARS_PER_SEG = 8;
const GRID_X = 380; // 段网格起始 x（卡内坐标）
const SEG_PITCH = 126;
const SNAP_START = 26;
const SNAP_GAP = 12;

/** 每段初始错位（交替正负，确定性）+ 段内波形基高（模块级一次算定） */
const SEGS = Array.from({ length: SEG_COUNT }, (_, i) => {
  const sign = i % 2 === 0 ? -1 : 1;
  const offset = sign * (34 + random(`s30-off-${i}`) * 72);
  return {
    offset,
    bars: Array.from({ length: BARS_PER_SEG }, (_, j) => 16 + random(`s30-bar-${i}-${j}`) * 48),
  };
});

const S30: FC = () => {
  const f = useCurrentFrame();
  // 中位标注：全部吸附完成后定场
  const stampIn = interpolate(f, [142, 142 + 12], [0, 1], { ...CLAMP, easing: MO_EASE.out });
  // MO-NUM-ROLL：中位误差随标注显影滚动到位（凡量必滚）
  const shown = 1.51 * stampIn;
  // MO-CHART-GROW：条形入场错峰生长（段内逐根 +1f，吸附开始前立好）
  const grow = (i: number, j: number) =>
    interpolate(f, [4 + i * 2 + j, 4 + i * 2 + j + MO_CHART.growFrames], [0, 1], { ...CLAMP, easing: MO_EASE.out });

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <div
        style={{
          position: 'absolute',
          left: 140,
          top: 180,
          width: 1640,
          height: 720,
          background: colors.bgLift,
          border: `1px solid ${colors.hairline}`,
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        {/* 卡头小注 */}
        <div
          style={{
            position: 'absolute',
            left: 48,
            top: 40,
            fontFamily: fontFamilies.mono,
            fontSize: 19,
            letterSpacing: 4,
            color: colors.muted,
          }}
        >
          cue snap · 改成按镜铺
        </div>

        {/* 双轨标签 */}
        {[
          { label: '画面轨', y: 250 },
          { label: '人声轨', y: 490 },
        ].map((l) => (
          <div
            key={l.label}
            style={{
              position: 'absolute',
              left: 90,
              top: l.y - 14,
              width: 240,
              fontFamily: fontFamilies.mono,
              fontSize: 22,
              letterSpacing: 6,
              color: colors.muted,
            }}
          >
            {l.label}
          </div>
        ))}

        {/* 上轨：画面轨（逐段归位的基准网格） */}
        {SEGS.map((seg, i) => (
          <div
            key={`top-${i}`}
            style={{
              position: 'absolute',
              left: GRID_X + i * SEG_PITCH,
              top: 250,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            {seg.bars.map((h, j) => (
              <div key={j} style={{ width: 6, height: Math.max(2, h * grow(i, j)), borderRadius: 3, background: colors.paper, opacity: 0.5 }} />
            ))}
          </div>
        ))}

        {/* 下轨：人声轨（逐段弹回对齐） */}
        {SEGS.map((seg, i) => {
          const t = SNAP_START + i * SNAP_GAP;
          const snap = interpolate(f, [t, t + MO_WAVE.snapFrames], [0, 1], {
            ...CLAMP,
            easing: MO_EASE.back, // 弹回：过冲一点点再停稳
          });
          return (
            <div
              key={`btm-${i}`}
              style={{
                position: 'absolute',
                left: GRID_X + i * SEG_PITCH,
                top: 490,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transform: `translateX(${seg.offset * (1 - snap)}px)`,
              }}
            >
              {seg.bars.map((h, j) => (
                <div key={j} style={{ width: 6, height: Math.max(2, h * grow(i, j)), borderRadius: 3, background: colors.accent, opacity: 0.38 }} />
              ))}
            </div>
          );
        })}

        {/* 中位标注（全部归位后定场） */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 330,
            transform: `translateX(-50%) translateY(${(1 - stampIn) * 12}px)`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            opacity: stampIn,
          }}
        >
          <div
            style={{
              fontFamily: fontFamilies.mono,
              fontSize: 84,
              letterSpacing: 2,
              color: colors.gold,
              lineHeight: 1,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            中位 {shown.toFixed(2)}s
          </div>
          <div style={{ fontFamily: fontFamilies.mono, fontSize: 19, letterSpacing: 3, color: colors.muted }}>
            按镜铺 · 落点中位误差
          </div>
        </div>
      </div>

      <Caption
        text="改成按镜铺，中位误差一点五秒。"
        start={12}
        end={168}
        duration={DURATION}
        inSide={0}
        outSide={0}
      />
    </AbsoluteFill>
  );
};

export default S30;
