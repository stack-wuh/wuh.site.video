/* 镜 41 · Act 6 影子工作流 · 全局帧 [6450,6550) · 100f */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, writeFade, inkRise, COLD, GRADES } from '../motion-tokens';
import { DustField } from '../components/DustField';

const serif = fontFamilies.serif;
const sans = fontFamilies.sans;

/* 坐标基准：镜局部帧（0 = 幕局 850 = 全局 6450）。原 Act6 以 <Board f={local − shot.from}> 供帧（本镜 localStart=850），
   镜内断点（writeFade 8、分隔线 26、inkRise 38、disperse 68–98、光尘浮粒 70–98）全部以镜局部帧求值
   且落在镜窗 [0,100) 内 —— const f = frame 逐字面量等价，无冻结/无跨镜相位。
   出镜交接层归属本镜：tr-dust-disperse（68–98）+ 14 颗字迹光尘（70 起 86–98 散逸）+ BLEED_BLACK 同底（承接镜 40 化入），原样保留。 */
const COLD_WHITE = COLD.coldWhite; // 冷白
const COLD_DIM = COLD.coldDim; // 冷灰蓝次级文字
const BLEED_BLACK = COLD.bleedBlack; // 承镜 40 tr-screen-bleed 的同底黑

const fade = (f: number, at: number) =>
  interpolate(f, [at, at + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/* 英文落款 —— write-fade + ink-rise；tr-dust-disperse（本镜 65–100，尾填 6540–6560 半拍） */
const ShotSignature: FC = () => {
  const frame = useCurrentFrame();
  const f = frame; // 镜局部帧 0–100
  const disperse = interpolate(f, [68, 98], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ filter: 'saturate(0.85)' }}>
        <AbsoluteFill style={{ background: BLEED_BLACK }}>
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: '44%',
              textAlign: 'center',
              opacity: 1 - disperse,
              transform: `translateY(${-disperse * 16}px)`,
              filter: `blur(${disperse * 5}px)`,
            }}
          >
            <p style={{ fontFamily: serif, fontSize: 42, letterSpacing: 1.5, color: COLD_WHITE, margin: 0, ...writeFade(f, 8) }}>
              This film is made with shadow-dev-workflow
            </p>
            <div style={{ width: 64, height: 1, background: colors.accent, opacity: 0.55 * fade(f, 26), margin: '26px auto' }} />
            <p style={{ fontFamily: sans, fontSize: 20, letterSpacing: 8, color: COLD_DIM, margin: 0, ...inkRise(f, 38) }}>
              以工作流之名
            </p>
          </div>
          {/* 字迹化作光尘飘散 */}
          {Array.from({ length: 14 }).map((_, i) => {
            const mx = 560 + random('mote-x' + i) * 800;
            const my = 430 + random('mote-y' + i) * 200;
            const mo = interpolate(f, [70, 82], [0, 0.9], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) * (1 - interpolate(f, [86, 98], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
            return <div key={i} style={{ position: 'absolute', left: mx, top: my - disperse * 46, width: 3, height: 3, borderRadius: 1.5, background: i % 4 === 3 ? colors.accent : COLD_WHITE, opacity: mo }} />;
          })}
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

export default ShotSignature;
