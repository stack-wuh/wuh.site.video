/* S11 · Act 2 旧屋 · 局部帧 [0,288) · 288f · 绝对 1584–1872
 * V2 暖黑数据流（2026-11-11 风格重构）：「纸页走廊+墨点」改写为「TIMELINE-FLOW 时间线走廊」——
 * ★时间跨度→timelineFlow：发光数据主轴画入（0–216，与光点同窗同速），
 * 12 个月份节点沿轴点亮（光点掠过即闪+驻留），数据点沿轴走完 2021、停在年末
 * （216=绝对 1800=拍90 plateau 对音不变）；6 张月份档案卡悬于轴上（线框数据卡）；
 * 长后拉+横移组合守恒（288f，全片第一次真正的慢，constant-slow），horizon 舞台地平；
 * 末 20f 右缘数据流光亮起带出下幕（268–288 原窗）。
 * 转场：入「切」出「切」。无字幕（幕间呼吸）。
 * 尾帧：数据点停在 2021 年末，右缘流光微起——交接态语义保持。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { FILM_COLORS2, timelineFlow } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 288;
const STOP_AT = 216; // 数据点停 2021 年末（拍90）

/** 月份档案卡：线框数据卡悬于轴上（2021 全年走廊） */
const CorridorCard: FC<{ month: number; x: number }> = ({ month, x }) => (
  <div style={{ position: 'absolute', left: x, top: 0, width: 190, height: 260, borderRadius: 8, background: FILM_COLORS2.panel, border: `1px solid ${FILM_COLORS2.grid}`, boxShadow: `0 14px 34px rgba(0,0,0,0.4)`, opacity: 0.9 }}>
    <div style={{ position: 'absolute', left: 16, top: 14, fontFamily: fontFamilies.mono, fontSize: 15, color: FILM_COLORS2.dataDim, fontVariantNumeric: 'tabular-nums' }}>2021·{String(month).padStart(2, '0')}</div>
    <div style={{ position: 'absolute', left: 16, right: 16, top: 48, height: 1, background: FILM_COLORS2.line, opacity: 0.7 }} />
    {[0, 1, 2].map((i) => (
      <div key={i} style={{ position: 'absolute', left: 16, top: 72 + i * 34, width: 150 - i * 30, height: 9, background: FILM_COLORS2.paperWhite, opacity: 0.14 }} />
    ))}
  </div>
);

const S11: FC = () => {
  const frame = useCurrentFrame();
  // 长后拉 + 横移（constant-slow）：全片第一次真正的慢
  const cam = {
    scale: interpolate(frame, [0, TOTAL], [1.1, 0.88], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    x: interpolate(frame, [0, TOTAL], [-60, 160], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    y: 0,
    rot: 0,
  };
  // 数据点沿轴走（0–216 plateau：先匀速走，末 60f 渐停）
  const dotX = interpolate(frame, [0, STOP_AT], [180, 2180], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  // ★TIMELINE-FLOW：发光主轴画入（0–216 与光点同窗）
  const tl = timelineFlow(frame, 0, STOP_AT, 12, STOP_AT / 12);
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
                <div key={i}>
                  <div
                    style={{
                      position: 'absolute',
                      left: x - (5 + flash * 3),
                      top: -4 - (5 + flash * 3) + 5,
                      width: 10 + flash * 6,
                      height: 10 + flash * 6,
                      borderRadius: 8,
                      background: lit ? FILM_COLORS2.data : FILM_COLORS2.textMuted,
                      boxShadow: lit ? `0 0 ${10 + flash * 16}px ${2 + flash * 3}px rgba(212,163,115,${0.2 + flash * 0.4})` : 'none',
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
            {/* 月份档案卡悬于轴上（上半年 6 张） */}
            <div style={{ position: 'absolute', left: 60, top: -420 }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <CorridorCard key={i} month={i + 1} x={i * 360} />
              ))}
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
                boxShadow: `0 0 20px 6px rgba(212,163,115,0.5)`,
                transform: 'translateX(-11px)',
              }}
            />
            {/* 走过的驻留光迹（足迹感） */}
            {Array.from({ length: Math.floor((dotX - 180) / 180) }).map((_, i) => (
              <div key={i} style={{ position: 'absolute', left: 180 + i * 180, top: -5, width: 10, height: 10, borderRadius: 5, background: FILM_COLORS2.data, opacity: 0.25 }} />
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
