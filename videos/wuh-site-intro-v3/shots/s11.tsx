/* S11 · Act 2 旧屋 · 局部帧 [0,288) · 288f · 绝对 1584–1872
 *
 * V3 批次 A 重做（2026-11-12 六门验收 + 审计返工单 · 幕间呼吸镜：呼吸语义保留，微动不断）：
 * 【承接】首帧承接 s10 尾帧交出的「暗场中一点状态灯高亮」——灯熄成星，本镜把 2021 一整年
 *         摊成一条发光数据主轴：TIMELINE-FLOW 走廊。
 * 【触发】主动作 = 琥珀数据光点沿主轴走完 2021（0–216，与轴同窗同速），掠过 12 个月份节点
 *         即闪+驻留点亮，216=绝对 1800=拍90 plateau（对音，絕不动）停在年末；6 张月份
 *         档案卡 decel 错峰 springIn 悬上轴（前密后疏，喘息节奏）。
 * 【展开】逐拍帧表（局部帧，fps=30，幕间呼吸镜·全片第一次真正的慢）：
 *   [0–216]   发光主轴画入 + 数据点匀速走轴（先匀速后渐停，cineEaseInOut）；
 *   [8–63]    6 张月份档案卡 staggerLand(6,8,56,'decel') 逐张 springIn 悬上轴（位移入场）；
 *   [逐月]    12 月份节点：光点掠过即闪（0.95→14f 衰减）+ 驻留点亮 + 月份读数转亮；
 *   [216]     数据点停 2021 年末（拍90）：节点辉光脉冲 + HUD readout REPLAY→EOY · 2021；
 *   [216–288] 长后拉+横移组合守恒（constant-slow）+ horizon 舞台地平 + DeepSpace 星漂/数据
 *             流星不断（呼吸不算静止）；
 *   [268–288] 右缘数据流光亮起带出下幕（原窗）——尾帧交接态。
 * 【交接】尾帧 = 数据点停在 2021 年末、右缘流光微起（manifest endFrameDesc：墨点停在
 *         2021 年末，纸缘微光）→ 交 s12 幕 3 入页（2022 档案页）。
 * 意义一句话：一年被走成一条发光的走廊——十二个月逐一点亮，日子在轴上留下了脚印。
 * 时间轴零改动：288f / 走轴 0–216（停 216 对音）/ 节点掠过闪 / 流光 268–288 原样；无 Caption（幕间呼吸）。
 * 转场：入「切」出「切」。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { FILM_COLORS2, handheld, springIn, staggerLand, timelineFlow } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 288;
const STOP_AT = 216; // 数据点停 2021 年末（拍90，对音，絕不动）
/** 月份档案卡 springIn 落定表（decel 前密后疏 · 喘息）：[8, 19, 30, 41, 52, 63] */
const CARD_LANDS = staggerLand(6, 8, 56, 'decel');

/** 月份档案卡：线框数据卡悬于轴上（2021 全年走廊） */
const CorridorCard: FC<{ month: number; x: number }> = ({ month, x }) => (
  <div style={{ position: 'absolute', left: x, top: 0, width: 190, height: 260, borderRadius: 8, background: FILM_COLORS2.panel, border: `1px solid ${FILM_COLORS2.grid}`, boxShadow: `0 14px 34px rgba(0,0,0,0.4)`, opacity: 0.9 }}>
    <div style={{ position: 'absolute', left: 16, top: 14, fontFamily: fontFamilies.mono, fontSize: 15, color: FILM_COLORS2.dataDim, fontVariantNumeric: 'tabular-nums' }}>2021·{String(month).padStart(2, '0')}</div>
    <div style={{ position: 'absolute', left: 16, right: 16, top: 48, height: 1, background: FILM_COLORS2.line, opacity: 0.7 }} />
    {[0, 1, 2].map((i) => (
      <div key={`bar-${i}`} style={{ position: 'absolute', left: 16, top: 72 + i * 34, width: 150 - i * 30, height: 9, background: FILM_COLORS2.paperWhite, opacity: 0.14 }} />
    ))}
  </div>
);

const S11: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // 长后拉 + 横移（constant-slow）：全片第一次真正的慢 + 手持微颤
  const hh = handheld('s11-cam', frame, 0.8);
  const cam = {
    scale: interpolate(frame, [0, TOTAL], [1.1, 0.88], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    x: interpolate(frame, [0, TOTAL], [-60, 160], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }) + hh.dx,
    y: hh.dy,
    rot: hh.rot,
  };
  // 数据点沿轴走（0–216 plateau：先匀速走，末 60f 渐停）
  const dotX = interpolate(frame, [0, STOP_AT], [180, 2180], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  // ★TIMELINE-FLOW：发光主轴画入（0–216 与光点同窗）
  const tl = timelineFlow(frame, 0, STOP_AT, 12, STOP_AT / 12);
  // 216 停点辉光脉冲
  const stopPulse = interpolate(frame, [STOP_AT, STOP_AT + 4, STOP_AT + 24], [0, 0.9, 0.35], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  // 末 20f 右缘数据流光亮起
  const edge = interpolate(frame, [268, TOTAL], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s11v2" stars={60} grid horizon />
      <CameraRig cam={cam}>
        <AbsoluteFill>
          {/* 时间轴走廊（横向发光主轴 + 12 月份节点） */}
          <div style={{ position: 'absolute', left: 140, right: 140, top: 560 }}>
            {/* 轴基线 */}
            <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 2, background: FILM_COLORS2.grid }} />
            {/* 发光主轴（随光点画入） */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                height: 2.5,
                width: '100%',
                background: `linear-gradient(90deg, ${FILM_COLORS2.dataDim}, ${FILM_COLORS2.data})`,
                boxShadow: `0 0 14px 3px rgba(212,163,115,0.35)`,
                opacity: 0.9,
                clipPath: `inset(0 ${Math.max(0, 1 - tl.progress) * 100}% 0 0)`,
              }}
            />
            {/* 12 个月份节点（光点掠过即闪 + 驻留点亮） */}
            {Array.from({ length: 12 }).map((_, i) => {
              const x = 130 + i * 180;
              const lit = dotX >= x;
              // 掠过即闪：抵达瞬间 0.95 → 14f 衰减为 0（未抵达不闪）
              const flash = lit ? interpolate(dotX, [x, x + 14], [0.95, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;
              return (
                <div key={`node-${i}`}>
                  <div
                    style={{
                      position: 'absolute',
                      left: x - (5 + flash * 3),
                      top: -4 - (5 + flash * 3) + 5,
                      width: 10 + flash * 6,
                      height: 10 + flash * 6,
                      borderRadius: 8,
                      background: lit ? FILM_COLORS2.data : FILM_COLORS2.textMuted,
                      boxShadow: lit ? `0 0 ${10 + flash * 16 + stopPulse * 14}px ${2 + flash * 3}px rgba(212,163,115,${0.2 + flash * 0.4})` : 'none',
                      opacity: lit ? 0.95 : 0.35,
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      left: x - 40,
                      top: 26,
                      width: 80,
                      textAlign: 'center',
                      fontFamily: fontFamilies.mono,
                      fontSize: 13,
                      letterSpacing: '0.12em',
                      color: lit ? FILM_COLORS2.dataDim : FILM_COLORS2.textMuted,
                      fontVariantNumeric: 'tabular-nums',
                      opacity: lit ? 0.9 : 0.3,
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
              );
            })}
            {/* 月份档案卡悬于轴上（上半年 6 张，decel springIn 落位） */}
            <div style={{ position: 'absolute', left: 60, top: -420 }}>
              {Array.from({ length: 6 }).map((_, i) => {
                const p = springIn(frame, CARD_LANDS[i], fps);
                return (
                  <div key={`card-${i}`} style={{ opacity: Math.min(1, p * 1.4), transform: `translateY(${(1 - p) * -26}px)` }}>
                    <CorridorCard month={i + 1} x={i * 360} />
                  </div>
                );
              })}
            </div>
            {/* 数据点（焦点本体，琥珀光点） */}
            <div
              style={{
                position: 'absolute',
                left: dotX,
                top: -12,
                width: 22,
                height: 22,
                borderRadius: 11,
                background: FILM_COLORS2.data,
                boxShadow: `0 0 ${20 + stopPulse * 18}px ${6 + stopPulse * 4}px rgba(212,163,115,${0.5 + stopPulse * 0.2})`,
                transform: 'translateX(-11px)',
              }}
            />
            {/* 走过的驻留光迹（足迹感） */}
            {Array.from({ length: Math.floor((dotX - 180) / 180) }).map((_, i) => (
              <div key={`trace-${i}`} style={{ position: 'absolute', left: 180 + i * 180, top: -5, width: 10, height: 10, borderRadius: 5, background: FILM_COLORS2.data, opacity: 0.25 }} />
            ))}
          </div>

          {/* 右缘数据流光（末 20f 亮起带出下幕） */}
          <div
            style={{
              position: 'absolute',
              right: 90,
              top: 160,
              bottom: 160,
              width: 160,
              backgroundImage: `linear-gradient(270deg, rgba(212,163,115,0.4), transparent)`,
              opacity: edge * 0.6,
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: 90,
              top: 160,
              bottom: 160,
              width: 2,
              background: FILM_COLORS2.data,
              opacity: edge * 0.5,
              boxShadow: `0 0 16px 4px rgba(212,163,115,0.4)`,
              pointerEvents: 'none',
            }}
          />
        </AbsoluteFill>
      </CameraRig>
      <HudChrome label="wuh.site · TIMELINE" readout={frame >= STOP_AT ? 'EOY · 2021' : 'REPLAY · 2021'} />
      <Grade2 id="GR2-01" />
    </AbsoluteFill>
  );
};

export default S11;
