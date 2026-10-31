/* 镜 44 · Act 7 向好与落版 · 全局帧 [6900,7030) · 130f */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { CURVES, GRADES, WARM_GOLD } from '../motion-tokens';
import { DustField } from '../components/DustField';

const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const fade = (f: number, at: number) => interpolate(f, [at, at + 14], [0, 1], CLAMP);
const GOLD = WARM_GOLD; // 暖金光尘（DUST 7）

/* 镜 44（6900–7030）：急拉骤停 → 光尘 converge 聚拢成墨点（6950–7030）+ surface-tension 微颤 + tr-ink-drop 坠落（7022–7030） */
const ShotInkDrop: FC = () => {
  const frame = useCurrentFrame(); // 镜局部帧（0 = 幕局 350 = 全局 6900）
  const local = frame; // 原 frame − 350，镜局化后即 frame
  const pull = interpolate(local, [0, 22], [1.14, 1], { ...CLAMP, easing: CURVES.cineEaseOut });
  const dotR = 4 + 14 * interpolate(local, [70, 118], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut });
  const dotO = interpolate(local, [80, 118], [0, 1], CLAMP);
  const tremble = local >= 112 ? 0.02 * Math.sin((local - 112) * 0.9) : 0;
  const dropY = interpolate(local, [122, 130], [0, 12], { ...CLAMP, easing: CURVES.cineEaseIn });
  /* ── 幕级 overlay（自 Act7 return 分解，断点帧平移 −350） ── */
  const sat = interpolate(local, [-350, -230], [1, 0.8], CLAMP);
  const bri = interpolate(local, [-350, -230, 230, 300], [1, 0.85, 0.85, 0], CLAMP);
  const dustO = interpolate(local, [-350, 0, 120, 210, 280], [0.85, 0.85, 0.15, 0.5, 0], CLAMP); // 光尘收拢至 0
  const blackMul = interpolate(local, [-350, 150], [0, 0.5], CLAMP);
  return (
    <AbsoluteFill style={{ filter: `saturate(${sat}) brightness(${bri})` }}>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', transform: `scale(${pull})` }}>
          <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 50%, transparent 32%, rgba(6,5,5,0.6) 100%)' }} />
          {Array.from({ length: 56 }).map((_, i) => {
            const ang = (i * 137.5 * Math.PI) / 180;
            const r = 320 + ((i * 53) % 380);
            const x0 = 960 + Math.cos(ang) * r;
            const y0 = 540 + Math.sin(ang) * r * 0.62;
            const p = interpolate(local, [50 + (i % 7) * 3, 128], [0, 1], { ...CLAMP, easing: CURVES.cineEaseIn });
            const size = 4.5 - 3 * p;
            return <div key={i} style={{ position: 'absolute', left: x0 + (960 - x0) * p, top: y0 + (540 - y0) * p, width: size, height: size, borderRadius: size / 2, background: GOLD, opacity: fade(local, 4) * 0.75 * (1 - p * 0.25) * (0.7 + 0.3 * Math.sin((local + i * 7) / 5)) }} />;
          })}
          {/* 墨点凝成：暖金光尘收拢，墨核 + 暖缘；表面张力微颤后坠落触纸 */}
          <div
            style={{
              position: 'absolute',
              left: 960,
              top: 540 + dropY,
              width: dotR * 2,
              height: dotR * 2,
              borderRadius: '50%',
              transform: `translate(-50%, -50%) scale(${1 + tremble}, ${1 - tremble})`,
              background: 'radial-gradient(circle, ${GRADES[6].lut.color} 52%, rgba(233,217,174,0.4) 76%, transparent 100%)',
              opacity: dotO,
              boxShadow: '0 0 26px rgba(233,217,174,0.28)',
            }}
          />
        </AbsoluteFill>
      </AbsoluteFill>
      <div style={{ opacity: dustO }}>
        <DustField act={7} />
      </div>
      {/* grade-fade-black 回收至墨黑（幕局 [0,500) 跨四镜，本镜段 [−350,150)） */}
      <AbsoluteFill style={{ background: GRADES[6].lut.color, mixBlendMode: 'multiply', opacity: blackMul }} />
    </AbsoluteFill>
  );
};

export default ShotInkDrop;
