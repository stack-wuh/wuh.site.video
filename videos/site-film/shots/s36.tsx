/* 镜 36 · Act 6 影子工作流 · 全局帧 [5600,5750) · 150f */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES, COLD, GRADES, inkRise } from '../motion-tokens';
import { CameraRig, ParallaxLayer, type CamState } from '../components/CameraRig';
import { DustField } from '../components/DustField';

const serif = fontFamilies.serif;
const mono = fontFamilies.mono;

/* 坐标基准：镜局部帧（0 = 幕局 0 = 全局 5600）。原 Act6 以 <Board f={local − shot.from}> 供帧（本镜 localStart=0），
   镜内断点（0/6/30/34/40/62/64/74/120/150）全部以镜局部帧求值且落在镜窗 [0,150) 内
   —— const f = frame 逐字面量等价，无冻结/无跨镜相位；代码雨 f*0.8、glitch floor(f/2) 相位随局部帧原样保留。 */
const ELECTRIC = COLD.electric; // 电蓝主色
const ELECTRIC_SOFT = COLD.electricSoft; // 电蓝浅
const COLD_WHITE = COLD.coldWhite; // 冷白
const COLD_DIM = COLD.coldDim; // 冷灰蓝次级文字
const ELECTRIC_LINE = 'rgba(77,163,255,0.28)'; // 电蓝描边（含透明度衍生）

const fade = (f: number, at: number) =>
  interpolate(f, [at, at + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/* 终端 initial release —— 命令快档打字 + 字卡 glitch；tr-char-morph 收束（§4.7） */
const TERMINAL_W = 920;
const CHAR_W = 13.2;
const L1 = '$ npx shadow-dev init';
const L2 = '✓ 5 skills · workflow ready';
const L3 = '$ shadow release';

const ShotTerminal: FC = () => {
  const frame = useCurrentFrame();
  const f = frame; // 镜局部帧 0–150
  const dolly = interpolate(f, [0, 120], [1, 1.12], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: CURVES.cineEaseInOut,
  });
  const cam: CamState = { scale: dolly, x: 0, y: 0, rot: 0 };
  const morph = interpolate(f, [120, 150], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: CURVES.cineEaseInOut,
  });
  const glitching = f >= 34 && f < 40;
  const gj = random('g36-' + Math.floor(f / 2)) - 0.5;
  const n1 = Math.max(0, Math.min(L1.length, Math.floor((f - 6) / 2.5)));
  const slot = (k: number) => ({
    gx: TERMINAL_W / 2 + ((k % 5) - 2) * 118,
    gy: 292 + Math.floor(k / 5) * 62,
  });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ filter: 'saturate(0.85)' }}>
        <AbsoluteFill>
          <CameraRig cam={cam}>
            {/* 远景层：代码雨字符列（dof-parallax depth 0.4） */}
            <ParallaxLayer cam={cam} depth={0.4} blurBase={4}>
              {[0, 1, 2, 3, 4, 5].map((c) => (
                <p
                  key={c}
                  style={{
                    position: 'absolute',
                    left: 140 + c * 330,
                    top: 0,
                    fontFamily: mono,
                    fontSize: 15,
                    letterSpacing: 4,
                    color: ELECTRIC,
                    opacity: 0.06 + (c % 3) * 0.02,
                    whiteSpace: 'pre',
                    margin: 0,
                    transform: `translateY(${((c * 97 + f * 0.8) % 1400) - 700}px)`,
                  }}
                >
                  {'propose\napply\nreview\nrelease\npublish\npropose\napply'}
                </p>
              ))}
            </ParallaxLayer>
            {/* 主体层：深蓝终端窗 */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '42%',
                transform: 'translate(-50%, -50%)',
                width: TERMINAL_W,
                height: 380,
                borderRadius: 12,
                background: COLD.panel,
                border: `1px solid ${ELECTRIC_LINE}`,
                boxShadow: '0 0 60px rgba(77,163,255,0.12)',
              }}
            >
              <div style={{ height: 44, borderBottom: '1px solid rgba(126,147,180,0.15)', display: 'flex', alignItems: 'center', paddingLeft: 20 }}>
                <span style={{ fontFamily: mono, fontSize: 13, color: COLD_DIM }}>shadow-dev-workflow — zsh</span>
                <span style={{ marginLeft: 'auto', paddingRight: 18, display: 'flex', gap: 6 }}>
                  {[0, 1, 2].map((d) => (
                    <span key={d} style={{ width: 9, height: 9, borderRadius: 4.5, background: 'rgba(126,147,180,0.3)' }} />
                  ))}
                </span>
              </div>
              <p style={{ position: 'absolute', left: 48, top: 76, fontFamily: mono, fontSize: 22, color: COLD_WHITE, margin: 0, whiteSpace: 'pre' }}>{L1.slice(0, n1)}</p>
              <p style={{ position: 'absolute', left: 48, top: 118, fontFamily: mono, fontSize: 17, color: ELECTRIC_SOFT, margin: 0, opacity: fade(f, 62) }}>{L2}</p>
              {/* L3 逐字符：tr-char-morph —— 前 10 字符重排至 5×2 舰位，其余由 data-stream 光点替补 */}
              {(() => {
                let k = -1;
                return L3.split('').map((c, i) => {
                  const x0 = 48 + i * CHAR_W;
                  const typed = f >= 74 + i * 2.5;
                  if (c === ' ') {
                    return <span key={i} style={{ position: 'absolute', left: x0, top: 160, opacity: 0, fontFamily: mono, fontSize: 22 }}>{c}</span>;
                  }
                  k += 1;
                  const going = k < 10;
                  const { gx, gy } = slot(k);
                  return (
                    <span
                      key={i}
                      style={{
                        position: 'absolute',
                        left: x0,
                        top: 160,
                        fontFamily: mono,
                        fontSize: 22,
                        color: going && morph > 0 ? ELECTRIC_SOFT : COLD_WHITE,
                        opacity: (typed ? 1 : 0) * (going ? 1 : 1 - morph),
                        transform: going
                          ? `translate(${(gx - x0) * morph}px, ${(gy - 160) * morph}px)`
                          : `translateX(${morph * 420}px)`,
                      }}
                    >
                      {c}
                    </span>
                  );
                });
              })()}
              {/* data-stream 光点替补（被舍弃字符化作光流） */}
              {[0, 1, 2, 3].map((d) => (
                <div
                  key={'ds' + d}
                  style={{
                    position: 'absolute',
                    left: 48 + 16.5 * CHAR_W + d * 10,
                    top: 166,
                    width: 22,
                    height: 4,
                    borderRadius: 2,
                    background: `linear-gradient(90deg, transparent, ${ELECTRIC})`,
                    opacity: morph * (1 - morph) * 4 * 0.9,
                    transform: `translateX(${morph * (260 + d * 70)}px)`,
                    mixBlendMode: 'screen',
                  }}
                />
              ))}
              <span style={{ position: 'absolute', left: 48 + L3.length * CHAR_W, top: 160, fontFamily: mono, fontSize: 22, color: ELECTRIC, opacity: f >= 74 && Math.floor(f / 8) % 2 ? 1 : 0.05 }}>▍</span>
            </div>
            {/* 前景层：微光扫痕（dof-parallax depth 1.6） */}
            <ParallaxLayer cam={cam} depth={1.6} blurBase={6}>
              <div style={{ position: 'absolute', left: '30%', top: '8%', width: 700, height: 160, background: 'linear-gradient(105deg, transparent, rgba(220,235,255,0.05), transparent)', transform: 'rotate(-8deg)' }} />
            </ParallaxLayer>
          </CameraRig>
          {/* 字卡 glitch 一闪 + 副字幕 */}
          <p
            style={{
              position: 'absolute',
              top: '73%',
              width: '100%',
              textAlign: 'center',
              fontFamily: mono,
              fontSize: 22,
              letterSpacing: 2,
              color: ELECTRIC_SOFT,
              margin: 0,
              opacity: fade(f, 30),
              transform: glitching ? `translateX(${gj * 6}px)` : undefined,
              textShadow: glitching ? `2px 0 ${ELECTRIC}, -2px 0 ${COLD_WHITE}` : undefined,
            }}
          >
            2026.06.27 · shadow-dev-workflow · initial release
          </p>
          <p style={{ position: 'absolute', top: '80%', width: '100%', textAlign: 'center', fontFamily: serif, fontSize: 34, color: COLD_WHITE, margin: 0, ...inkRise(f, 64) }}>
            他把开发方法本身，也写成了代码
          </p>
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

export default ShotTerminal;
