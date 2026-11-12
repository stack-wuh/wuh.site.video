/* S49 · Act 7 坐忘 · 局部帧 [0,168) · 168f · 绝对 6686–6854
 *
 * V2 深空数据流重构（2026-11-12 呼吸镜返工：微动不断 + 意义一句话）：
 * 交接 八月——线框书页合拢（0–40，承接 s48 线框书房）；琥珀晨光移向右缘（0–60）；
 * 发光时间轴自 2026-07 继续前行（40–130，辉光点+尾迹）；前方 26 枚细密数据光点亮起
 * （60+3i → 100+3i 原窗口）；「八月，在前方」改 springIn 弹入落定（120–150 原窗口，位移入场）
 * + 辉光呼吸；末段光点聚成星轨环微光（130–168，环体呼吸）——交接态语义絕不动（s50 开场
 * 承接星轨环→光点密轴）。全片第二缓（rack+横移守恒）+ handheld 手持微动全程不断。
 * 意义一句话：八月还没来——观众跟着时间轴光点走过七月的最后一格，望见前方已经亮起
 * 的密匝光点；「休息了一整幕的呼吸」之后，下一段旅程在前方发光。
 * 编排四问：
 *  承接：首帧 = s48 交出的「晨光书桌·改写完成」——书页受风合拢（0–40 rotateY），晨光移向右缘；
 *  触发：时间轴光点自行前行（40–130）= 日子自己往前走的主动作，无外力触发（呼吸镜的「动」）；
 *  展开：帧级节奏表（见下）；26 枚光点 60+3i 次第亮起、130 起向环心聚拢；
 *  交接：尾帧 = 晨光收拢、远处光点聚成星轨环微光（endFrameDesc 契约，交 s50 版本雨——环→密轴）。
 * 逐拍帧表（fps=30）：
 *  [0–40]   线框书页被风合上（rotateY 78°，origin right）；
 *  [0–60]   琥珀晨光移向右缘（透明度 0.5→0.7）；
 *  [40–130] 时间轴主线生长 + 光点自 2026-07 前行（500→1250，辉光脉冲）；
 *  [60–150] 前方 26 枚数据光点次第亮起（60+3i → 100+3i 原窗口）；
 *  [120–150]「八月，在前方」springIn 弹入（120–150 原窗口）+ 辉光呼吸；
 *  [130–168] 光点聚成星轨环微光（130–168 原窗口，环呼吸）——交接 s50。
 * 时间轴零改动：168f / 无字幕 / 光点窗口 60+3i→100+3i / 星轨环 130–168 / 「八月，在前方」120–150 /
 * endFrameDesc「晨光收拢、远处光点聚成星轨环」语义絕不动；无 <Sequence>；random(seed) only；
 * springIn fps 取 useVideoConfig；色板只用 FILM_COLORS2 族。转场：入「切」，出「切」。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { FILM_COLORS2, glowText, handheld, springIn } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 168;
const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

const S49: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const close = interpolate(frame, [0, 40], [0, 1], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const dotX = interpolate(frame, [40, 130], [500, 1250], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const ringIn = interpolate(frame, [130, TOTAL], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut });
  const dotIn = interpolate(frame, [40, 60], [0, 0.9], CLAMP);
  /* 「八月，在前方」springIn 弹入（120–150 原窗口，位移入场替换原纯淡入） */
  const textIn = springIn(frame, 120, fps, 15, 180, 0.85);
  const shake = handheld('s49-cam', frame, 0.6);
  const cam = {
    scale: 1.05,
    x: interpolate(frame, [0, TOTAL], [0, -70], { ...CLAMP, easing: CURVES.cineEaseInOut }) + shake.dx,
    y: shake.dy,
    rot: shake.rot,
  };

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DeepSpace seed="s49v2" stars={54} grid horizon />

          {/* 线框书页被风合上（0–40：承接 s48 书房的纸页收拢立起） */}
          {frame < 44 ? (
            <div style={{ position: 'absolute', left: 300, top: 280, perspective: 1400, opacity: 1 - close * 0.4 }}>
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: 640,
                  height: 420,
                  borderRadius: 6,
                  background: FILM_COLORS2.panel,
                  border: `1px solid ${FILM_COLORS2.line}`,
                  boxShadow: `0 0 30px rgba(212,163,115,0.12), 0 20px 50px rgba(0,0,0,0.5)`,
                  transform: `rotateY(${close * 78}deg)`,
                  transformOrigin: 'right center',
                }}
              />
            </div>
          ) : null}

          {/* 琥珀晨光移向右缘 */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(${270 - 40}deg, rgba(233,217,174,0.5) 0%, rgba(212,163,115,0.16) 30%, transparent 46%)`,
              opacity: interpolate(frame, [0, 60], [0.5, 0.7], CLAMP) * (0.92 + 0.08 * Math.sin(frame / 16)),
              pointerEvents: 'none',
            }}
          />

          {/* 时间轴：发光主线 + 光点从 2026-07 前行（40–130） */}
          <div style={{ position: 'absolute', left: 120, right: 120, top: 600, height: 2, background: FILM_COLORS2.line, opacity: 0.5 }} />
          <div
            style={{
              position: 'absolute',
              left: 120,
              top: 600,
              height: 2.5,
              width: Math.max(0, dotX - 120),
              background: `linear-gradient(90deg, ${FILM_COLORS2.dataDim}, ${FILM_COLORS2.data})`,
              boxShadow: `0 0 14px 3px rgba(212,163,115,0.3)`,
              opacity: dotIn * 0.85,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: dotX - 12,
              top: 588,
              width: 24,
              height: 24,
              borderRadius: 12,
              background: FILM_COLORS2.data,
              boxShadow: `0 0 22px 6px rgba(212,163,115,${0.35 + 0.2 * Math.sin(frame / 5)})`,
              opacity: dotIn,
            }}
          />
          <span style={{ position: 'absolute', left: 380, top: 556, fontFamily: fontFamilies.mono, fontSize: 18, letterSpacing: '0.14em', color: FILM_COLORS2.textMuted, opacity: 0.65 }}>2026-07</span>

          {/* 前方细密数据光点 → 星轨环（130–168 聚成环微光；窗口原样，交接 s50 语义絕不动） */}
          {Array.from({ length: 26 }).map((_v, i) => {
            const ang = random(`s49-p-${i}`) * Math.PI * 2;
            const dist = interpolate(frame, [90, 168], [180 + random(`s49-d-${i}`) * 320, 60 + random(`s49-d-${i}`) * 90], { ...CLAMP, easing: CURVES.cineEaseInOut });
            const cx = 1520 + Math.cos(ang) * dist * 1.5;
            const cy = 460 + Math.sin(ang) * dist;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: cx,
                  top: cy,
                  width: 4,
                  height: 4,
                  borderRadius: 2,
                  background: FILM_COLORS2.data,
                  boxShadow: `0 0 8px 1px rgba(212,163,115,0.4)`,
                  opacity: interpolate(frame, [60 + i * 3, 100 + i * 3], [0, 0.85], CLAMP) * (0.75 + 0.25 * Math.sin(frame / 10 + i)),
                }}
              />
            );
          })}
          <div
            style={{
              position: 'absolute',
              left: 1400,
              top: 340,
              width: 240,
              height: 240,
              borderRadius: 120,
              border: `1.5px solid ${FILM_COLORS2.data}`,
              boxShadow: `0 0 ${30 + ringIn * 40 + 6 * Math.sin(frame / 12)}px rgba(212,163,115,${0.3 * ringIn}), inset 0 0 24px rgba(212,163,115,${0.14 * ringIn})`,
              opacity: ringIn * 0.6,
              transform: `scale(${1 + ringIn * 0.02 * Math.sin(frame / 14)})`,
            }}
          />
          {/* 「八月，在前方」（120–150 springIn 弹入 + 辉光呼吸） */}
          <span
            style={{
              position: 'absolute',
              left: 760,
              top: 556,
              fontFamily: fontFamilies.serif,
              fontSize: 24,
              color: FILM_COLORS2.paperWhite,
              display: 'inline-block',
              opacity: Math.min(1, textIn * 1.3) * 0.8,
              transform: `translateY(${(1 - textIn) * 14}px)`,
              ...glowText(FILM_COLORS2.data, 0.3 + 0.08 * Math.sin(frame / 9)),
            }}
          >
            八月，在前方
          </span>
        </AbsoluteFill>
      </CameraRig>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 300, backgroundImage: `linear-gradient(180deg, transparent, ${FILM_COLORS2.spaceDeep})`, opacity: 0.2 }} />
      <HudChrome label="wuh.site · TIMELINE" readout="07 → 08" />
      <Grade2 id="GR2-07" />
    </AbsoluteFill>
  );
};

export default S49;
