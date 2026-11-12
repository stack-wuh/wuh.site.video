/* S19 · Act 3 第一行 · 局部帧 [0,126) · 126f · 绝对 2802–2928
 *
 * 幕间收束镜：呼吸/节拍语义保留，微动不断（handheld 全镜），锚点絕不动——
 * 第 7 点落定 78 = 绝对 2880 = ANCHORS.spark7 = 拍144 对音。
 * 编排四问：
 *   承接 = s18 交出的七点提交事件（同日七次初始化提交），首帧即时间轴延展；
 *   触发 = 七枚数据点 accel 依次落位（第 7 点踩 spark7 对音），随后弧线描画执行「连回主轴」动作；
 *   展开 = 帧级节奏 LANDS=[24,36,48,60,69,75,78]（前 4 点 12f 间隔→后 3 点 9/6/3f 加速），弧线 78–102 描画，102–126 拉开露主轴；
 *   交接 = 尾帧：7 点连线微亮、主轴延向黑暗（交接态：亮点连线+前方暗场，交 s20 曲线断电）。
 * 逐拍帧表（fps=30）：
 *   [24/36/48/60/69/75/78] 七点 springIn 弹入（位移入场：scale 0.4→1 + 辉光落定闪 8f + 6f 细环扩散），前 4 点旁隐约小字 +4f 显影；
 *   [78]      第 7 点落定 = spark7 对音（絕不动）；
 *   [78–102]  七点弧线 pathDraw 描画（inkDraw 真长度，琥珀辉光）串七点 Q 曲线接主轴；
 *   [102–126] cam 拉开 1.02→0.96 + 右移 120，右缘收进 spaceDeep，主轴走向黑暗；
 *   [0–126]   handheld('s19-cam', 1.0) 呼吸微动（幕间收束不算静止）。
 * 时间轴零改动：126f / LANDS 表 / 弧线窗 78–102 原样；转场：入「墨洇」出「墨洇」→ ShotShell 光晕呼吸。无字幕。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { FILM_COLORS2, handheld, inkDraw, springIn } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 126;
const LABELS = ['components', 'husky', 'changelog', '版本号'];

const S19: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hh = handheld('s19-cam', frame, 1.0);
  const cam = {
    scale: interpolate(frame, [0, 102, TOTAL], [1.04, 1.02, 0.96], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    x: interpolate(frame, [102, TOTAL], [0, 120], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }) + hh.dx,
    y: hh.dy,
    rot: hh.rot,
  };
  // 七点落位：前 4 点 12f 间隔，后 3 点 9/6/3f 加速（第 7 点 78=spark7 对音，絕不动）
  const LANDS = [24, 36, 48, 60, 69, 75, 78];
  // 七点弧线（CHART-DRAW 78–102）：真长度由 evolvePath 计算
  const drawP = interpolate(frame, [78, 102], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });

  // 七点坐标（左低右高的弧线段，接向右方主轴）
  const pts = LANDS.map((_, i) => ({
    x: 330 + i * 175,
    y: 640 - Math.pow(i / 6, 1.4) * 210,
  }));
  const ARC_D = `M ${pts.map((p) => `${p.x} ${p.y}`).join(' L ')} Q 1450 380, 1700 470`;

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s19v2" stars={52} grid horizon />
      <CameraRig cam={cam}>
        <AbsoluteFill>
          {/* 主轴（右侧延向黑暗） */}
          <div style={{ position: 'absolute', left: 300, right: 60, top: 470, height: 2, background: FILM_COLORS2.line, opacity: 0.45 }} />

          {/* 七点弧线（CHART-DRAW 描画，琥珀辉光） */}
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <path
              d={ARC_D}
              fill="none"
              stroke={FILM_COLORS2.data}
              strokeWidth={1.6}
              {...inkDraw(drawP, ARC_D)}
              opacity={0.75}
              style={{ filter: 'drop-shadow(0 0 6px rgba(212,163,115,0.35))' }}
            />
          </svg>

          {/* 七枚数据点（accel 落定：springIn 位移弹入 + 落定闪 8f + 6f 细环扩散；琥珀辉光核） */}
          {pts.map((p, i) => {
            const land = LANDS[i];
            const pop = springIn(frame, land, fps, 15, 190, 0.8);
            const flash = interpolate(frame, [land, land + 2, land + 8], [0, 0.8, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            const ringP = interpolate(frame - land, [0, 6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            const on = frame >= land;
            return (
              <div key={i}>
                <div
                  style={{
                    position: 'absolute',
                    left: p.x - 14,
                    top: p.y - 14,
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    background: FILM_COLORS2.data,
                    opacity: on ? 0.9 : 0,
                    transform: `scale(${0.4 + pop * 0.6})`,
                    boxShadow: flash > 0 ? `0 0 22px 8px rgba(212,163,115,${flash * 0.5})` : `0 0 10px rgba(212,163,115,0.3)`,
                  }}
                />
                {on && ringP < 1 ? (
                  <div
                    style={{
                      position: 'absolute',
                      left: p.x - 14 - ringP * 10,
                      top: p.y - 14 - ringP * 10,
                      width: 28 + ringP * 20,
                      height: 28 + ringP * 20,
                      borderRadius: '50%',
                      border: `1px solid ${FILM_COLORS2.data}`,
                      opacity: 0.55 * (1 - ringP),
                    }}
                  />
                ) : null}
                {/* 前 4 点旁隐约小字（标识） */}
                {i < 4 ? (
                  <span
                    style={{
                      position: 'absolute',
                      left: p.x + 24,
                      top: p.y - 10,
                      fontFamily: fontFamilies.mono,
                      fontSize: 15,
                      color: FILM_COLORS2.textMuted,
                      opacity: interpolate(frame, [land + 4, land + 14], [0, 0.6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
                    }}
                  >
                    {LABELS[i]}
                  </span>
                ) : null}
              </div>
            );
          })}

          {/* 主轴走向黑暗（末段）：右缘收进深黑 */}
          <AbsoluteFill style={{ background: `linear-gradient(90deg, transparent 55%, ${FILM_COLORS2.spaceDeep} 92%)`, opacity: interpolate(frame, [102, TOTAL], [0.3, 0.85], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), pointerEvents: 'none' }} />
        </AbsoluteFill>
      </CameraRig>
      <HudChrome label="wuh.site · DAY ONE" readout="7 COMMITS / 1 DAY" />
      <Grade2 id="GR2-03" />
    </AbsoluteFill>
  );
};

export default S19;
