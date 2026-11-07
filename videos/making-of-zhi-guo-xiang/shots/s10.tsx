/* s10 · 十一月一号，五十二个镜头，第一次能从头放到尾。（300f · 10.0s，Act 3）
 *
 * 素材镜：`seg-evolution-v8-open-v1`（M1 0–8s = 240 源帧）变速 0.8× 直放，
 * 240 / 0.8 = 300f 正好铺满镜长（MO-SPEED-08，不调色不推拉，保母带原貌）。
 * 左下角 CI 角标「run 41270162934 ✓」：纸面墨字小卡，MO-CMP-LABEL 语义（labelFade 6f 淡入，
 * 等 ink 入遮罩走完 20f 再起，避免被墨吞）。✓ 用琥珀 accent（色板无绿，全绿语义走对比色）。
 *
 * 转场：入「墨洇」20f / 出「切」（ShotShell 由装配层挂）。字幕窗 [32,288]。
 */
import type { CSSProperties, FC } from 'react';
import { AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { Caption } from '../components/Caption';
import { CLAMP, MO_CMP, MO_EASE } from '../motion-tokens';

const TOTAL = 300;
const VIDEO: CSSProperties = { width: '100%', height: '100%', objectFit: 'cover' };

/** 明暗差派生：token hex → rgba（禁内联 hex，一切颜色自 brand/tokens 派生） */
const alpha = (hex: string, a: number): string => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

const S10: FC = () => {
  const f = useCurrentFrame();
  /* 角标：墨洇入遮罩 20f 走完后淡入 6f（MO-CMP.labelFade），此后常驻到硬切出 */
  const badge = interpolate(f, [20, 20 + MO_CMP.labelFade], [0, 1], { ...CLAMP, easing: MO_EASE.out });

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <OffthreadVideo
        src={staticFile('making-of-zhi-guo-xiang/segments/seg-evolution-v8-open-v1.mp4')}
        startFrom={0}
        endAt={240}
        playbackRate={MO_CMP.speed08}
        style={VIDEO}
      />

      {/* CI 角标：纸面墨字小卡，左下角 */}
      <div
        style={{
          position: 'absolute',
          left: 44,
          bottom: 44,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 16px',
          background: colors.paper,
          border: `1px solid ${alpha(colors.ink, 0.35)}`,
          borderRadius: 4,
          opacity: badge,
          transform: `translateY(${(1 - badge) * 6}px)`,
        }}
      >
        <span style={{ fontFamily: fontFamilies.mono, fontSize: 19, letterSpacing: 1, color: colors.ink }}>
          run 41270162934
        </span>
        <span style={{ fontFamily: fontFamilies.sans, fontSize: 21, color: colors.accent }}>✓</span>
      </div>

      <Caption
        text="十一月一号，五十二个镜头，第一次能从头放到尾。"
        start={32}
        end={288}
        duration={TOTAL}
        inSide={20}
        outSide={0}
      />
    </AbsoluteFill>
  );
};

export default S10;
