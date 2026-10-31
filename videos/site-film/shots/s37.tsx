/* 镜 37 · Act 6 影子工作流 · 全局帧 [5750,5930) · 180f */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, SPRINGS, sealStamp, sealTilt, COLD, GRADES } from '../motion-tokens';
import { CameraRig, type CamState } from '../components/CameraRig';
import { DustField } from '../components/DustField';

const sans = fontFamilies.sans;
const mono = fontFamilies.mono;
const FPS = 30; // 与全片一致（shots/manifest fps: 30）；镜文件不引视频配置 hook，fps 用常量

/* 坐标基准：镜局部帧（0 = 幕局 150 = 全局 5750）。原 Act6 以 <Board f={local − shot.from}> 供帧（本镜 localStart=150），
   镜内断点（BEATS 0/40/80/120/160、camX 0–180、stampZoom 160–180、bloom 168–180、钤印 160）全部以镜局部帧求值
   且落在镜窗 [0,180) 内 —— const f = frame 逐字面量等价，无冻结/无跨镜相位；
   船体无钳制振荡器 Math.sin((f + i*40)/26) 原以镜局部帧取相位，局部基准下逐帧一致。 */
const COLD_WHITE = COLD.coldWhite; // 冷白
const ELECTRIC = COLD.electric; // 电蓝主色
const ELECTRIC_SOFT = COLD.electricSoft; // 电蓝浅
const COLD_DIM = COLD.coldDim; // 冷灰蓝次级文字

/* 五段纸舟 —— 五记节拍（本镜 0/40/80/120/160，第四记最重），publish 钤印 + tr-stamp-zoom（§4.4） */
const FLEET = [
  { name: 'propose', zh: '提案卡展开', note: '' },
  { name: 'apply', zh: '双工位并行', note: '分镜师 · UE 大师' },
  { name: 'review', zh: '质量门禁闸门', note: '' },
  { name: 'release', zh: 'PR 光桥', note: '' },
  { name: 'publish', zh: '钤印发版', note: '' },
] as const;
const BEATS = [0, 40, 80, 120, 160];
const BEAT_KICK = [0.014, 0.02, 0.02, 0.05, 0.034];

const Boat: FC<{ i: number; f: number }> = ({ i, f }) => {
  const seg = FLEET[i];
  const beat = BEATS[i];
  const pop = spring({ frame: f - beat, fps: FPS, config: SPRINGS.springPop });
  const lit = f < beat ? 0.22 : interpolate(pop, [0, 1], [0.35, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const flashT = f - beat;
  const flash = flashT >= 0 && flashT < 20 ? Math.pow(1 - flashT / 20, 2) * (i === 3 ? 0.9 : 0.55) : 0;
  return (
    <div
      style={{
        position: 'absolute',
        left: 540 + i * 560 - 110,
        top: 620 - i * 80 - 90 + Math.sin((f + i * 40) / 26) * 8,
        width: 220,
        transform: `scale(${interpolate(pop, [0, 1], [0.94, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })})`,
      }}
    >
      {/* 节拍闪光（第四记 release 最重） */}
      <div style={{ position: 'absolute', left: 45, top: -30, width: 130, height: 130, borderRadius: '50%', background: `radial-gradient(circle, ${COLD_WHITE} 0%, ${ELECTRIC} 40%, transparent 70%)`, opacity: flash, mixBlendMode: 'screen' }} />
      <svg width="220" height="120" viewBox="0 0 220 120" style={{ filter: f >= beat ? `drop-shadow(0 0 ${16 * lit}px ${ELECTRIC})` : undefined }}>
        <line x1="18" y1="78" x2="202" y2="78" stroke={COLD_WHITE} strokeWidth={2.5} opacity={lit} />
        <polygon points="18,78 202,78 162,106 58,106" fill="rgba(77,163,255,0.10)" stroke={ELECTRIC} strokeWidth={2} opacity={lit} />
        <polygon points="108,16 108,78 46,78" fill="rgba(156,200,255,0.08)" stroke={ELECTRIC_SOFT} strokeWidth={2} opacity={lit * 0.95} />
        <polygon points="120,26 120,78 176,78" fill="none" stroke={ELECTRIC} strokeWidth={1.5} opacity={lit * 0.6} />
      </svg>
      <div style={{ textAlign: 'center', marginTop: 6 }}>
        <p style={{ fontFamily: mono, fontSize: 26, letterSpacing: 3, color: COLD_WHITE, margin: 0, opacity: lit }}>{seg.name}</p>
        <p style={{ fontFamily: sans, fontSize: 17, color: COLD_DIM, margin: '4px 0 0', opacity: lit * 0.9 }}>{seg.zh}</p>
        {seg.note ? <p style={{ fontFamily: sans, fontSize: 13, color: ELECTRIC_SOFT, margin: '3px 0 0', opacity: lit * 0.85 }}>{seg.note}</p> : null}
      </div>
      {/* publish 钤印（seal-stamp，第 160 帧拍点） */}
      {i === 4 && f >= 160 ? (
        <div style={{ position: 'absolute', right: -6, top: -22, width: 34, height: 34, background: colors.accent, boxShadow: `0 0 24px ${colors.accent}`, ...sealStamp(f, 160, FPS, sealTilt('publish')) }} />
      ) : null}
    </div>
  );
};

const ShotFleet: FC = () => {
  const frame = useCurrentFrame();
  const f = frame; // 镜局部帧 0–180
  const camX = interpolate(f, [0, 40, 80, 120, 160, 180], [420, -140, -700, -1260, -1820, -1900], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: CURVES.cineEaseInOut,
  });
  const kick = BEATS.reduce((acc, b, i) => {
    const t = f - b;
    return t >= 0 && t < 14 ? acc + BEAT_KICK[i] * (1 - t / 14) : acc;
  }, 0);
  const stampZoom = interpolate(f, [160, 180], [1, 3], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn });
  const bloom = interpolate(f, [168, 180], [0, 0.85], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const cam: CamState = { scale: 1 + kick, x: camX, y: 0, rot: 0 };
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ filter: 'saturate(0.85)' }}>
        <AbsoluteFill>
          <CameraRig cam={cam}>
            <div style={{ transform: `scale(${stampZoom})`, transformOrigin: '50% 55%' }}>
              {FLEET.map((seg, i) => (
                <Boat key={seg.name} i={i} f={f} />
              ))}
            </div>
          </CameraRig>
          {/* tr-stamp-zoom：钤印辉光冲满切镜 38 */}
          <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 55%, ${COLD_WHITE}, transparent 70%)`, opacity: bloom, mixBlendMode: 'screen' }} />
        </AbsoluteFill>
        {/* Act6 幕级光尘（ColdDust 上收为 DustField，act=6：40 颗快档） */}
        <DustField act={6} />
      </AbsoluteFill>
      {/* 幕级 grade-electric-blue（原 Act6 return 全幕常量层，位于 saturate(0.85) 滤镜组之外，保持原渲染层级） */}
      <AbsoluteFill style={{ background: GRADES[5].lut.color, mixBlendMode: 'multiply', opacity: 0.5 }} />
      <AbsoluteFill style={{ background: COLD.coldWhite, mixBlendMode: 'screen', opacity: 0.1 }} />
    </AbsoluteFill>
  );
};

export default ShotFleet;
