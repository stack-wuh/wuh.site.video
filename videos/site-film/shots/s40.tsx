/* 镜 40 · Act 6 影子工作流 · 全局帧 [6240,6450) · 210f */
import type { FC, ReactNode } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES, COLD, GRADES } from '../motion-tokens';
import { CameraRig, type CamState } from '../components/CameraRig';
import { DustField } from '../components/DustField';

const serif = fontFamilies.serif;
const sans = fontFamilies.sans;
const mono = fontFamilies.mono;

/* 坐标基准：镜局部帧（0 = 幕局 640 = 全局 6240）。原 Act6 以 <Board f={local − shot.from}> 供帧（本镜 localStart=640），
   镜内断点（camScale 0/165/210、camY 0–165、opB 26–58、opC 88–128、bleed 185–208、bezGlow 160–185、
   时间线 0–165、外框显隐 160–180、字幕 74 与 185–198）全部以镜局部帧求值且落在镜窗 [0,210) 内
   —— const f = frame 逐字面量等价，无冻结/无跨镜相位；双光标 caret1 = floor(f/12)%2 相位随局部帧原样保留。 */
const ELECTRIC = COLD.electric; // 电蓝主色
const ELECTRIC_SOFT = COLD.electricSoft; // 电蓝浅
const COLD_WHITE = COLD.coldWhite; // 冷白
const COLD_DIM = COLD.coldDim; // 冷灰蓝次级文字
const ELECTRIC_LINE = 'rgba(77,163,255,0.28)'; // 电蓝描边（含透明度衍生）
const BLEED_BLACK = COLD.bleedBlack; // tr-screen-bleed 化入的黑底（镜 41 同底）

const fade = (f: number, at: number) =>
  interpolate(f, [at, at + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/* ★ Meta 穿屏 —— recurse-zoom 递归拉出 + 代理铭牌双光标；tr-screen-bleed ★（§4.4） */
const Panel: FC<{ w: number; h: number; opacity?: number; children: ReactNode }> = ({ w, h, opacity = 1, children }) => (
  <div
    style={{
      position: 'absolute',
      left: '50%',
      top: '48%',
      transform: 'translate(-50%, -50%)',
      width: w,
      height: h,
      borderRadius: 14,
      background: COLD.gradient,
      border: `1.5px solid ${ELECTRIC_LINE}`,
      boxShadow: '0 0 40px rgba(77,163,255,0.10)',
      opacity,
      overflow: 'hidden',
    }}
  >
    {children}
  </div>
);

const ShotMeta: FC = () => {
  const frame = useCurrentFrame();
  const f = frame; // 镜局部帧 0–210
  const camScale = interpolate(f, [0, 165, 210], [1.18, 0.5, 0.42], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: CURVES.cineEaseInOut,
  });
  const camY = interpolate(f, [0, 165], [0, 44], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const opB = interpolate(f, [26, 58], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const opC = interpolate(f, [88, 128], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const bleed = interpolate(f, [185, 208], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const bezGlow = interpolate(f, [160, 185], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const cam: CamState = { scale: camScale, x: 0, y: camY, rot: 0 };
  const caret1 = Math.floor(f / 12) % 2 === 0;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ filter: 'saturate(0.85)' }}>
        <AbsoluteFill>
          <CameraRig cam={cam}>
            {/* C：工作台外屏 */}
            <Panel w={820} h={540} opacity={opC}>
              <div style={{ position: 'absolute', left: 170, bottom: 8, width: 480, height: 60, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(77,163,255,0.14), transparent 70%)' }} />
              {/* B：工作流屏（recurse-zoom 预缩层 0.94） */}
              <Panel w={720} h={470} opacity={opB}>
                {/* 代理铭牌 ×2 · caret-glow 双光标协作 */}
                <div style={{ position: 'absolute', left: 20, top: 14, display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 999, border: `1px solid ${ELECTRIC_LINE}`, background: COLD.pill }}>
                  <span style={{ fontFamily: sans, fontSize: 15, color: COLD_WHITE }}>分镜师</span>
                  <span style={{ fontFamily: mono, fontSize: 15, color: ELECTRIC, opacity: caret1 ? 1 : 0.08 }}>▍</span>
                </div>
                <div style={{ position: 'absolute', right: 20, top: 14, display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 999, border: `1px solid ${ELECTRIC_LINE}`, background: COLD.pill }}>
                  <span style={{ fontFamily: sans, fontSize: 15, color: COLD_WHITE }}>UE 动效大师</span>
                  <span style={{ fontFamily: mono, fontSize: 15, color: ELECTRIC_SOFT, opacity: caret1 ? 0.08 : 1 }}>▍</span>
                </div>
                {/* A：分镜脚本屏（0.94^2 递归层） */}
                <Panel w={620} h={390}>
                  <div style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, display: 'flex', flexWrap: 'wrap', gap: 10, padding: '34px 22px 30px', alignContent: 'center', justifyContent: 'center' }}>
                    {['镜36', '镜37', '镜38', '镜39', '镜40', '镜41'].map((s, i) => (
                      <div key={s} style={{ width: 172, height: 104, borderRadius: 6, background: COLD.panelDeep, border: `1px solid ${i === 4 ? ELECTRIC : ELECTRIC_LINE}`, position: 'relative' }}>
                        <span style={{ position: 'absolute', left: 8, top: 6, fontFamily: mono, fontSize: 12, color: i === 4 ? ELECTRIC : COLD_DIM }}>{s}</span>
                        <div style={{ position: 'absolute', left: 8, width: '55%', bottom: 18, height: 2, background: 'rgba(126,147,180,0.2)' }} />
                        <div style={{ position: 'absolute', left: 8, right: 8, bottom: 10, height: 2, background: ELECTRIC_LINE }} />
                      </div>
                    ))}
                  </div>
                  <p style={{ position: 'absolute', bottom: 8, width: '100%', textAlign: 'center', fontFamily: mono, fontSize: 11, letterSpacing: 3, color: COLD_DIM, margin: 0 }}>STORYBOARD · SHADOW-DEV-WORKFLOW</p>
                </Panel>
                {/* B 底部时间线 */}
                <div style={{ position: 'absolute', left: 30, right: 30, bottom: 12, height: 3, background: 'rgba(126,147,180,0.18)', borderRadius: 2 }}>
                  <div style={{ width: `${interpolate(f, [0, 165], [8, 92], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}%`, height: '100%', background: ELECTRIC, borderRadius: 2 }} />
                </div>
              </Panel>
            </Panel>
          </CameraRig>
          {/* tr-screen-bleed ★：外框辉光涨满 → 边框 scale 1.06 + blur 化入镜 41 黑底（边框即转场遮罩） */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '48%',
              width: 1560,
              height: 940,
              transform: `translate(-50%, -50%) scale(${1 + bleed * 0.06})`,
              borderRadius: 18,
              border: `2px solid ${ELECTRIC}`,
              boxShadow: `0 0 ${30 + bezGlow * 180}px ${bezGlow * 46}px rgba(77,163,255,0.5)`,
              opacity: interpolate(f, [160, 180], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) * (1 - bleed),
              filter: `blur(${bleed * 12}px)`,
            }}
          />
          <p
            style={{
              position: 'absolute',
              top: '87%',
              width: '100%',
              textAlign: 'center',
              fontFamily: serif,
              fontSize: 38,
              color: COLD_WHITE,
              margin: 0,
              opacity: fade(f, 74) * (1 - interpolate(f, [185, 198], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })),
            }}
          >
            这部片子，也是工作流的一次心跳
          </p>
          <AbsoluteFill style={{ background: BLEED_BLACK, opacity: bleed }} />
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

export default ShotMeta;
