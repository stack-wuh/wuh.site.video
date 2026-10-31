/* 镜 38 · Act 6 影子工作流 · 全局帧 [5930,6120) · 190f */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, random, spring, useCurrentFrame } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES, SPRINGS, COLD, GRADES } from '../motion-tokens';
import { CameraRig, type CamState } from '../components/CameraRig';
import { DustField } from '../components/DustField';

const serif = fontFamilies.serif;
const mono = fontFamilies.mono;
const FPS = 30; // 与全片一致（shots/manifest fps: 30）；镜文件不引视频配置 hook，fps 用常量

/* 坐标基准：镜局部帧（0 = 幕局 330 = 全局 5930）。原 Act6 以 <Board f={local − shot.from}> 供帧（本镜 localStart=330），
   镜内断点（truck 0–130、pull 110–185、collapse 165–190、星环 spring 90+j*1.2、字幕 120/132、
   入场余闪 0–12 / 收束闪 184–190）全部以镜局部帧求值且落在镜窗 [0,190) 内
   —— const f = frame 逐字面量等价，无冻结/无跨镜相位；星环轨道 (f·2π)/320 相位随局部帧原样保留。 */
const ELECTRIC = COLD.electric; // 电蓝主色
const ELECTRIC_SOFT = COLD.electricSoft; // 电蓝浅
const COLD_WHITE = COLD.coldWhite; // 冷白
const ELECTRIC_LINE = 'rgba(77,163,255,0.28)'; // 电蓝描边（含透明度衍生）

const fade = (f: number, at: number) =>
  interpolate(f, [at, at + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/* 归档墙 —— brief 卡瀑布落位（step 渐密，sqrt 落位曲线）+ 40 知识卡星环 orbit；tr-orbit-collapse 收束 */
const ShotArchive: FC = () => {
  const frame = useCurrentFrame();
  const f = frame; // 镜局部帧 0–190
  const truck = interpolate(f, [0, 130], [70, -70], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const pull = interpolate(f, [110, 185], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const collapse = interpolate(f, [165, 190], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn });
  const cam: CamState = { scale: 1 - pull * 0.2, x: truck, y: pull * 55, rot: 0 };
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ filter: 'saturate(0.85)' }}>
        <AbsoluteFill>
          <CameraRig cam={cam}>
            {/* brief 归档墙（254 格瀑布落位，heavy-glide 基底） */}
            {Array.from({ length: 254 }).map((_, i) => {
              const col = i % 23;
              const row = Math.floor(i / 23);
              const delay = 100 * Math.sqrt(i / 253);
              const p = interpolate(f - delay, [0, 16], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
              const tinted = random('brief-' + i) > 0.78;
              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: 247 + col * 62,
                    top: 360 + row * 46,
                    width: 54,
                    height: 38,
                    borderRadius: 5,
                    background: COLD.panelAlt,
                    border: `1px solid ${tinted ? ELECTRIC_LINE : 'rgba(126,147,180,0.18)'}`,
                    opacity: p * (tinted ? 1 : 0.8),
                    transform: `translateY(${(1 - p) * -34}px)`,
                    boxShadow: tinted ? '0 0 12px rgba(77,163,255,0.25)' : undefined,
                  }}
                />
              );
            })}
            {/* 知识卡星环（40 张 · orbit-drift + tr-orbit-collapse） */}
            <div style={{ position: 'absolute', left: 960, top: 320, transform: 'perspective(1200px) rotateX(55deg)' }}>
              {Array.from({ length: 40 }).map((_, j) => {
                const th = (j / 40) * Math.PI * 2 + (f * Math.PI * 2) / 320 + collapse * collapse * 9;
                const rho = 1 - collapse * 0.96;
                const rise = spring({ frame: f - (90 + j * 1.2), fps: FPS, config: SPRINGS.springPop });
                const depth = 0.5 + 0.5 * Math.sin(th);
                return (
                  <div
                    key={j}
                    style={{
                      position: 'absolute',
                      left: Math.cos(th) * 560 * rho - 22,
                      top: Math.sin(th) * 150 * rho - 29,
                      width: 44,
                      height: 58,
                      borderRadius: 6,
                      background: COLD.panelLine,
                      border: `1px solid ${ELECTRIC_LINE}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: rise * (0.35 + 0.65 * depth) * (1 - collapse * 0.3),
                      boxShadow: depth > 0.8 ? '0 0 14px rgba(77,163,255,0.35)' : undefined,
                    }}
                  >
                    <span style={{ fontFamily: mono, fontSize: 15, color: ELECTRIC_SOFT }}>✦</span>
                  </div>
                );
              })}
            </div>
            {/* 星环收束亮点 */}
            <div
              style={{
                position: 'absolute',
                left: 934,
                top: 294,
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${COLD_WHITE}, ${ELECTRIC} 45%, transparent 72%)`,
                opacity: collapse,
                transform: `scale(${0.4 + collapse * 2.4})`,
                mixBlendMode: 'screen',
              }}
            />
          </CameraRig>
          <p style={{ position: 'absolute', top: '84%', width: '100%', textAlign: 'center', fontFamily: mono, fontSize: 16, letterSpacing: 2, color: ELECTRIC_SOFT, margin: 0, opacity: fade(f, 120) }}>
            254 briefs · 40 knowledge cards
          </p>
          <p style={{ position: 'absolute', top: '88%', width: '100%', textAlign: 'center', fontFamily: serif, fontSize: 36, color: COLD_WHITE, margin: 0, opacity: fade(f, 132) }}>
            254 次完整循环 · 40 张知识卡片
          </p>
          {/* 入场余闪（承接 tr-stamp-zoom）+ 收束闪（入镜 39） */}
          <AbsoluteFill style={{ background: COLD_WHITE, opacity: interpolate(f, [0, 12], [0.85, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), mixBlendMode: 'screen' }} />
          <AbsoluteFill style={{ background: COLD_WHITE, opacity: interpolate(f, [184, 190], [0, 0.9], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), mixBlendMode: 'screen' }} />
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

export default ShotArchive;
