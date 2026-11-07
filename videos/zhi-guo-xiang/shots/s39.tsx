/* S39 · 尾 · 海面 · 最后一层金收掉（180f · 入「硬切」）
 *
 * 用户改动（2026-11-07 11:0x）：这一镜改成「海面，最后一层金收掉」。底图 `p-sea`。
 * 只做两件事，让最后的金自己退场：
 *   · WaveField —— 海面横纹相位慢推（只铺地平线以下），画不动、海在动；
 *   · 最后一层金 —— 地平线上那一条暖金（screen），180f 里从 0.3 收到 0：
 *     云霞把金收走，天还没黑，只是不亮了。
 * 镜头：空镜·固定（1.0 → 1.025）。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { ShotScene } from '../components/e-scene';
import { Caption } from '../components/Caption';
import { WaveField } from '../components/WaveField';
import { FILM, CLAMP } from '../motion-tokens';

/** 本镜时长（manifest durationFrames——ShotScene 用它算推拉进度，不读 useVideoConfig） */
const TOTAL = 180;

const S40: FC = () => {
  const f = useCurrentFrame();
  /* 最后一层金：先停一会儿再收（0–50f 几乎不动，50–179f 慢慢退干净） */
  const gold = interpolate(f, [0, 50, 179], [0.3, 0.28, 0], CLAMP);

  return (
    <ShotScene name="p-sea" total={TOTAL} frame={f} zoom={[1.0, 1.025]} warm={0.02}>
      <WaveField seed="s40-sea" band={[0.62, 1.0]} amp={8} speed={0.1} opacity={0.3} rows={12} />
      {/* 云霞那层金：贴着地平线的一条，不是全屏暖色 */}
      <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'screen' }}>
        <div
          style={{
            position: 'absolute',
            left: -60,
            right: -60,
            top: '52%',
            height: '22%',
            background: `linear-gradient(180deg, transparent 0%, ${colors.accent} 34%, ${FILM.fireGold} 58%, transparent 100%)`,
            opacity: gold,
            filter: 'blur(18px)',
          }}
        />
      </AbsoluteFill>
      <Caption cue="s39" tone="ink" />
    </ShotScene>
  );
};

export default S40;