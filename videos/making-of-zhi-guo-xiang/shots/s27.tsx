/* s27 · 前几版的旁白，是 AI 念的。（150f · 5.0s，Act 6 · 声音的进化）
 *
 * 素材镜直放：`seg-v12-third-needle-v1`（M8 母带 168–172s，4s = 120f），本镜 135f
 * ——末 15f 用 Freeze 把段末帧（index 119）定格补满（shot-spec：段短于镜长末帧定格）。
 * 右下角「TTS · 合成声」小卡角标（MO-CMP-LABEL 淡入 6f）+ 角标下 4 根波形条
 * sin 律动（相位确定性，无随机源）。位置避开底部字幕安全区（角标底沿 y≈870 < 字幕窗）。
 * 入 dry（单侧 10f，ShotShell 承接），出 cut。
 * 素材镜纪律：不加滤镜不加推拉，保母带原貌。
 */
import type { FC } from 'react';
import { AbsoluteFill, Freeze, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CLAMP, MO_CHART, MO_CMP, MO_EASE } from '../motion-tokens';
import { Caption } from '../components/Caption';

const DURATION = 150;
const SEG_FRAMES = 120; // seg-v12-third-needle-v1：4s @ 30fps
const BAR_COUNT = 4;

/** 明暗差一律由 tokens 派生（rgba），不引入新色值 */
const rgba = (hex: string, alpha: number): string => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};

const S27: FC = () => {
  const f = useCurrentFrame();
  // 角标淡入（MO-CMP-LABEL：6f）
  const labelIn = interpolate(f, [6, 6 + MO_CMP.labelFade], [0, 1], { ...CLAMP, easing: MO_EASE.out });
  // 末 15f 定格：段长 120f，定格在段末帧 index 119
  const frozenAt = Math.min(f, SEG_FRAMES - 1);

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <Freeze frame={frozenAt}>
        <OffthreadVideo
          src={staticFile('making-of-zhi-guo-xiang/segments/seg-v12-third-needle-v1.mp4')}
          startFrom={0}
          endAt={SEG_FRAMES}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Freeze>

      {/* 「TTS · 合成声」角标 + 波形条（挂在右下偏上，不压字幕区） */}
      <div
        style={{
          position: 'absolute',
          right: 56,
          bottom: 152,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 10,
          opacity: labelIn,
        }}
      >
        <div
          style={{
            fontFamily: fontFamilies.mono,
            fontSize: 20,
            letterSpacing: 3,
            color: colors.paper,
            background: rgba(colors.ink, 0.72),
            border: `1px solid ${colors.hairline}`,
            borderRadius: 6,
            padding: '8px 14px',
          }}
        >
          TTS · 合成声
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 32, marginRight: 8 }}>
          {Array.from({ length: BAR_COUNT }).map((_, i) => {
            const pulse = 0.5 + 0.5 * Math.sin(f * 0.21 + i * 1.7);
            /* MO-CHART-GROW：入场从基线错峰立起（凡量必动） */
            const grow = interpolate(
              f,
              [18 + i * MO_CHART.growStagger, 18 + i * MO_CHART.growStagger + MO_CHART.growFrames],
              [0, 1],
              { ...CLAMP, easing: MO_EASE.out },
            );
            return (
              <div
                key={i}
                style={{
                  width: 7,
                  height: Math.max(2, (10 + 22 * pulse) * grow),
                  borderRadius: 3.5,
                  background: rgba(colors.accent, 0.45 + 0.55 * pulse),
                }}
              />
            );
          })}
        </div>
      </div>

      <Caption
        text="前几版的旁白，是 AI 念的。"
        start={22}
        end={138}
        duration={DURATION}
        inSide={10}
        outSide={0}
      />
    </AbsoluteFill>
  );
};

export default S27;
