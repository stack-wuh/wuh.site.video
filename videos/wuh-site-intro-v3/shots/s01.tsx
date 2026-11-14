import type { FC } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ShotShell } from '../components/ShotShell';
import { Typewriter } from '../components/Typewriter';
import { FILM_COLORS, FONTS } from '../motion-tokens';

/**
 * s01 · 冷开场（80f，0–80）
 * 暖纸底 + 中左终端行。光标两闪 → 逐字打出 `$ git init`（`$` 朱红）→ 光标转朱红闪烁。
 * 字行以下留 45% 空纸给 s02 数字墙汇入（尾帧交接）。
 * 布局纪律：勿在 AbsoluteFill 上依赖 alignItems 做垂直居中（默认 flexDirection: column，
 * 曾把内容顶上画幅外）——统一用 left/top + translateY(-50%)。
 */
const S01: FC = () => {
  const frame = useCurrentFrame();
  return (
    <ShotShell act="ACT 00 · 冷开场">
      <AbsoluteFill>
        <div style={{ position: 'absolute', left: 220, top: 468, display: 'flex', alignItems: 'flex-end' }}>
          <span
            style={{
              fontFamily: FONTS.mono,
              fontSize: 56,
              lineHeight: 1.5,
              color: FILM_COLORS.vermillion,
              marginRight: 10,
            }}
          >
            $
          </span>
          <Typewriter text=" git init" start={18} framesPerChar={5} cursor="end" fontSize={56} color={FILM_COLORS.ink} />
        </div>
        {frame < 18 ? (
          <div
            style={{
              position: 'absolute',
              left: 220,
              top: 552,
              fontFamily: FONTS.mono,
              fontSize: 13,
              letterSpacing: '0.16em',
              color: FILM_COLORS.muted,
            }}
          >
            INIT · 0 COMMITS
          </div>
        ) : null}
      </AbsoluteFill>
    </ShotShell>
  );
};

export default S01;