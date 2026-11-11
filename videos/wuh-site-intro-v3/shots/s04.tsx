/* S04 · Act 1 墨点 · 局部帧 [0,84) · 84f · 绝对 498–582
 * V2 暖黑数据流（2026-11-11 风格重构）：「仿真浏览器窗+真实截图当窗内容」改写为
 * 「证据快闪 + Issue 数据行级联」——
 * gh02-issues-blog 真实截图降级为证据快闪辉光小窗（0–16 显影放大 → 26–36 退场，≤2s 口径）；
 * 主角 = 线框 Issue 面板：文章卡（#17–#53）沿弧线飞入落位（22–72 半拍一卡原窗），
 * 行级 mono 编号 + 暗琥珀数据行；CM-07 侧向跟移守恒，rack focus 改为面板对焦呼吸。
 * 转场：入「切」出「切」。无字幕（呼吸镜）。
 * 尾帧：数据行队列落定成整齐列表；末 12f 辉光呼吸（RH-02 原窗）。
 */
import type { FC } from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from 'remotion';
import { staticFile } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES, writeFade } from '../../../brand/motion';
import { FILM_COLORS2, cardFly, type Pose } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 84;

/** 飞入面板的 Issue 数据行（5 行，半拍 10f 一行，弧线 Pose 插值） */
const FLY_ROWS = [0, 1, 2, 3, 4].map((i) => i);

const S04: FC = () => {
  const frame = useCurrentFrame();
  // 证据快闪：截图小窗（0–16 显影放大 → 26–36 退场）
  const proofIn = writeFade(frame, 0, true);
  const proofOut = interpolate(frame, [26, 36], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  // CM-07 侧向跟移：机位自左向右缓移（证据窗→数据面板），rack focus 用面板清晰度表达
  const cam = {
    scale: 1.04,
    x: interpolate(frame, [0, TOTAL], [40, -30], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    y: 0,
    rot: 0,
  };
  const rack = interpolate(frame, [10, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s04v2" stars={46} grid />
      <CameraRig cam={cam}>
        <AbsoluteFill>
          {/* 证据快闪：gh02-issues-blog 辉光小窗（真实感锚点，不抢戏，≤2s 退场） */}
          {frame < 38 ? (
            <div
              style={{
                position: 'absolute',
                right: 130,
                top: 190,
                width: interpolate(frame, [0, 16], [620, 460], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
                zIndex: 28,
                opacity: Number(proofIn.opacity ?? 0) * proofOut,
                transform: `scale(${interpolate(frame, [0, 16], [1.05, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })})`,
              }}
            >
              <Img
                src={staticFile('wuh-site-intro-v3/site/gh02-issues-blog-v1.png')}
                style={{ width: '100%', borderRadius: 8, border: `1px solid ${FILM_COLORS2.dataDim}`, boxShadow: `0 0 40px rgba(212,163,115,0.2), 0 22px 54px rgba(0,0,0,0.65)`, display: 'block' }}
              />
            </div>
          ) : null}

          {/* 主角：线框 Issue 面板（rack focus 对焦） */}
          <div style={{ position: 'absolute', left: 170, top: 130, width: 900, height: 640, filter: `blur(${(1 - rack) * 2}px)` }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 10, background: FILM_COLORS2.panel, border: `1px solid ${FILM_COLORS2.line}`, boxShadow: `0 0 30px rgba(212,163,115,0.1), 0 22px 50px rgba(0,0,0,0.5)` }} />
            {/* 面板头 */}
            <div style={{ position: 'absolute', left: 40, top: 28, display: 'flex', alignItems: 'baseline', gap: 16 }}>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 17, letterSpacing: '0.3em', color: FILM_COLORS2.paperWhite, opacity: 0.9 }}>ISSUES · blog</span>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 13, letterSpacing: '0.24em', color: FILM_COLORS2.data, opacity: 0.8 }}>OPEN 5</span>
            </div>
            <div style={{ position: 'absolute', left: 40, right: 40, top: 66, height: 1, background: FILM_COLORS2.line, opacity: 0.7 }} />
            {/* Issue 数据行弧线飞入落位 */}
            <div style={{ position: 'absolute', left: 40, top: 96, width: 700 }}>
              {FLY_ROWS.map((i) => {
                const from: Pose = { x: -340, y: -60 + i * 14, rot: -7, scale: 0.9 };
                const to: Pose = { x: 0, y: i * 92, rot: 0, scale: 1 };
                return (
                  <div key={i} style={{ position: 'absolute', left: 0, top: 0, width: 700, height: 72, ...cardFly(frame, 22 + i * 10, 26, from, to) }}>
                    <div style={{ position: 'absolute', inset: 0, borderRadius: 6, background: 'rgba(212,163,115,0.06)', border: `1px solid ${FILM_COLORS2.grid}` }} />
                    <span style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-52%)', fontFamily: fontFamilies.mono, fontSize: 17, color: FILM_COLORS2.data, fontVariantNumeric: 'tabular-nums' }}>#{17 + i * 9}</span>
                    <div style={{ position: 'absolute', left: 90, top: 22, width: 380 - i * 30, height: 11, background: FILM_COLORS2.paperWhite, opacity: 0.32 }} />
                    <div style={{ position: 'absolute', left: 90, top: 44, width: 240, height: 7, background: FILM_COLORS2.dataDim, opacity: 0.3 }} />
                    <div style={{ position: 'absolute', right: 22, top: '50%', transform: 'translateY(-50%)', width: 8, height: 8, borderRadius: 4, background: FILM_COLORS2.data, opacity: 0.55, boxShadow: `0 0 8px rgba(212,163,115,0.5)` }} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* 末 12f 辉光呼吸（RH-02 原窗 72–84） */}
          <AbsoluteFill style={{ background: `radial-gradient(ellipse 90% 80% at 50% 46%, rgba(212,163,115,0.5), rgba(212,163,115,0) 70%)`, mixBlendMode: 'screen', opacity: interpolate(frame, [72, TOTAL], [0, 0.06], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), pointerEvents: 'none' }} />
        </AbsoluteFill>
      </CameraRig>
      <HudChrome label="wuh.site · ISSUES" readout={frame >= 72 ? 'SYNC 5/5 · DONE' : 'SYNCING…'} />
      <Grade2 id="GR2-02" />
    </AbsoluteFill>
  );
};

export default S04;
