/* s29 · 但更大的坑在排队：旁白按幕铺，最重漂到负十六秒。（255f · 8.5s，Act 6 · 声音的进化）
 *
 * 漂移示意卡：两条 cue 波形（上 = 画面轨，下 = 人声轨）从对齐状态逐渐错位拉开
 * （人声轨向左 = 负漂移），MO-WAVE-DRIFT 全镜 MO-EASE.inout 缓动；
 * 位移峰值处标注「−16.17s」（MO_WAVE.driftPeakSec）——大数字 + 双虚线引线 + 游标测量线，
 * 末段定场。入 cut / 出 cut。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CLAMP, MO_EASE, MO_WAVE } from '../motion-tokens';
import { Caption } from '../components/Caption';

const DURATION = 255;
const DRIFT_PX = 260;
const BAR_COUNT = 16;
const LANE_X = 420; // 波形起始 x（卡内坐标）
const BAR_PITCH = 70;

/** 波形基高（确定性） */
const BAR_BASE = Array.from({ length: BAR_COUNT }, (_, i) => 30 + random(`s29-bar-${i}`) * 80);

/** 漂移标注文案由令牌派生：MO_WAVE.driftPeakSec = -16.17 → 「−16.17s」 */
const DRIFT_LABEL = `−${Math.abs(MO_WAVE.driftPeakSec).toFixed(2)}s`;

const S29: FC = () => {
  const f = useCurrentFrame();
  // 拉开过程：MO-WAVE-DRIFT 全镜 MO-EASE.inout 缓动
  const p = interpolate(f, [20, 220], [0, 1], { ...CLAMP, easing: MO_EASE.inout });
  // 测量线（错位一开始就跟着长）
  const measureIn = interpolate(p, [0.02, 0.1], [0, 1], CLAMP);
  // 峰值标注：位移接近峰值才显影，随后定场
  const stampIn = interpolate(p, [0.82, 0.95], [0, 1], CLAMP);

  const cursorX = LANE_X - DRIFT_PX * p; // 人声轨前缘（游标）
  const arrowCenter = LANE_X - (DRIFT_PX * p) / 2;

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <div
        style={{
          position: 'absolute',
          left: 140,
          top: 150,
          width: 1640,
          height: 780,
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
          cue drift · 旁白按幕铺
        </div>

        {/* 双轨标签 */}
        {[
          { label: '画面轨', y: 270 },
          { label: '人声轨', y: 520 },
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

        {/* 基准虚线（画面轨前缘，静止） */}
        <div
          style={{
            position: 'absolute',
            left: LANE_X,
            top: 200,
            height: 440,
            borderLeft: `1px dashed ${colors.hairline}`,
          }}
        />
        {/* 游标虚线（人声轨前缘，随漂移左移） */}
        <div
          style={{
            position: 'absolute',
            left: cursorX,
            top: 200,
            height: 440,
            borderLeft: `1px dashed ${colors.accent}`,
            opacity: 0.45,
          }}
        />

        {/* 上轨：画面轨（静止） */}
        <div style={{ position: 'absolute', left: LANE_X, top: 270, display: 'flex', alignItems: 'center', gap: BAR_PITCH - 30 }}>
          {BAR_BASE.map((h, i) => (
            <div key={i} style={{ width: 30, height: h, borderRadius: 6, background: colors.paper, opacity: 0.5 }} />
          ))}
        </div>
        {/* 下轨：人声轨（整体向左错位 = 负漂移） */}
        <div
          style={{
            position: 'absolute',
            left: LANE_X,
            top: 520,
            display: 'flex',
            alignItems: 'center',
            gap: BAR_PITCH - 30,
            transform: `translateX(${-DRIFT_PX * p}px)`,
          }}
        >
          {BAR_BASE.map((h, i) => (
            <div key={i} style={{ width: 30, height: h, borderRadius: 6, background: colors.accent, opacity: 0.34 }} />
          ))}
        </div>

        {/* 测量线：基准 ↔ 游标 之间的横向引线（双端小竖线） */}
        <div
          style={{
            position: 'absolute',
            left: cursorX,
            top: 620,
            width: DRIFT_PX * p,
            height: 2,
            background: colors.accent,
            opacity: 0.8 * measureIn,
          }}
        />
        {[0, 1].map((end) => (
          <div
            key={end}
            style={{
              position: 'absolute',
              left: end === 0 ? cursorX : LANE_X,
              top: 612,
              width: 2,
              height: 18,
              background: colors.accent,
              opacity: 0.8 * measureIn,
            }}
          />
        ))}

        {/* 峰值标注：−16.17s 大字 + 小注，跟在测量线中点上方，末段定场 */}
        <div
          style={{
            position: 'absolute',
            left: arrowCenter,
            top: 648,
            transform: `translateX(-50%) translateY(${(1 - stampIn) * 12}px)`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            opacity: stampIn,
          }}
        >
          <div style={{ fontFamily: fontFamilies.mono, fontSize: 84, letterSpacing: 2, color: colors.gold, lineHeight: 1 }}>
            {DRIFT_LABEL}
          </div>
          <div style={{ fontFamily: fontFamilies.mono, fontSize: 19, letterSpacing: 3, color: colors.muted }}>
            旁白相对画面 · 最重一句
          </div>
        </div>
      </div>

      <Caption
        text="但更大的坑在排队：旁白按幕铺，最重漂到负十六秒。"
        start={12}
        end={243}
        duration={DURATION}
        inSide={0}
        outSide={0}
      />
    </AbsoluteFill>
  );
};

export default S29;
