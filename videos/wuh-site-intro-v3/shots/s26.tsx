import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { ShotShell } from '../components/ShotShell';
import { FILM_COLORS, FONTS } from '../motion-tokens';

/**
 * s26 · 上线（40f，2790–2830）—— 全片唯一一次纯朱红满屏 / 全片最短镜
 * 0–3f：vermillion 满屏，无渐变、无纹理、无其他图形（FX-02）；
 * 3–40f：朱红自左横向擦拭退出（FX-03：纸面层 clipPath inset(0 X% 0 0)，X 100→0，线性 37f），
 * 露出纸面 + 「上线」二字（serif 700 墨色）+ 一枚朱红细框；镜尾朱红退净。
 * 「上线」置于左侧：擦拭边界在镜内 10f 约到 x=363，「上线」二字（118–526）在 10–13f 内被完全越过；
 * 线性 37f 与 §5.1「2800 = 上线露全」不可同时精确成立，此处保 FX-03 的匀速与 §7-9 线性例外，露全落在 12–13f（±3f）。
 * 全镜无字幕、无四角角标（storyboard：「全镜无其他图形」），故 ShotShell chrome=false。
 * 线性是 motion-spec §7-9 明列的仅有两处例外之一（FX-03 匀速滚刷），故此处用线性 interpolate。
 */

/* 纸面层被擦拭揭开的进度（线性；唯一合法线性场景之一） */
const wipe = (frame: number): number =>
  interpolate(frame, [3, 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

const S26: FC = () => {
  const frame = useCurrentFrame();
  const p = wipe(frame);
  /* 纸面层 clipPath inset(0 X% 0 0)：X 100 → 0（自左揭开） */
  const inset = (1 - p) * 100;

  return (
    <ShotShell act="ACT 03 · 重启" chrome={false}>
      {/* FX-02：底色层 = 纯朱红（0–3f 满屏，不叠矩形） */}
      <AbsoluteFill style={{ backgroundColor: FILM_COLORS.vermillion }} />

      {/* 纸面 + 「上线」+ 朱红细框：被擦拭逐步揭开 */}
      <AbsoluteFill style={{ clipPath: `inset(0 ${inset}% 0 0)` }}>
        <AbsoluteFill style={{ backgroundColor: FILM_COLORS.paper }} />

        {/* 朱红细框（s27 将由它扩成整页引语版心） */}
        <div
          style={{
            position: 'absolute',
            left: 96,
            top: 372,
            width: 492,
            height: 340,
            boxSizing: 'border-box',
            border: `1px solid ${FILM_COLORS.vermillion}`,
          }}
        />

        {/* 「上线」二字 */}
        <div
          style={{
            position: 'absolute',
            left: 118,
            top: 426,
            fontFamily: FONTS.serif,
            fontWeight: 700,
            fontSize: 200,
            lineHeight: 1,
            letterSpacing: '0.02em',
            color: FILM_COLORS.ink,
            whiteSpace: 'nowrap',
          }}
        >
          上线
        </div>
      </AbsoluteFill>
    </ShotShell>
  );
};

export default S26;