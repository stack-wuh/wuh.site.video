/* S50 · Act 8 此刻 · 局部帧 [0,100) · 100f · 绝对 6854–6954
 *
 * V2 深空数据流重构（2026-11-11）：星轨环收紧成时间轴刻度（0–16 残影）；
 * 2026-08-22 release 节点短线亮起（16–28）；数据主角化——全屏大数字 0→118
 * 滚动落定（★DAT-01 20–86，落定 86=绝对 6940=拍347 对音，SLAM 辉光+scale 1.045→1）；
 * 119 枚版本光点成雨斜落——最早 v2.0.0（2024-12-08）先落定轴起点作锚（标识不滚），
 * 其余 118 枚逐枚快落、越落越快（★DAT-08 accel，末颗与数字同拍 86 落定），每颗落定闪一次；
 * 雨幕止于 2026-11-08；末段减速雨歇。
 * 转场：入「切」，出「切」。字幕安全窗：start≥12、end≤88。
 * 尾帧：雨歇、时间轴密布光点。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { random } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { FILM_COLORS2, bigNum, glowText } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 100;
const V_TOTAL = 119;
const V_ANCHOR = 0; // v2.0.0 锚
const V_RAIN = 118; // 逐枚快落
const RAIN_END = 86; // 末颗 = 拍347 = 大数字落定（同拍）

const S50: FC = () => {
  const frame = useCurrentFrame();
  const ringIn = interpolate(frame, [0, 16], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const nodeIn = interpolate(frame, [16, 28], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  /* 主角：全屏大数字 0→118（20–86 滚动，落定=拍347，与末颗版本光点同拍） */
  const hero = bigNum(frame, 20, RAIN_END - 20, V_ANCHOR, V_RAIN);
  const cam = {
    scale: 1.06,
    x: interpolate(frame, [0, TOTAL], [60, -60], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    y: interpolate(frame, [0, TOTAL], [-30, 10], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    rot: 0,
  };

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DeepSpace seed="s50v2" stars={56} grid horizon />

          {/* 星轨环收紧（0–16 残影，承接 s49） */}
          {ringIn > 0 ? (
            <div
              style={{
                position: 'absolute',
                left: 700,
                top: 300,
                width: 520,
                height: 520,
                borderRadius: 260,
                border: `1.5px solid ${FILM_COLORS2.data}`,
                boxShadow: `0 0 40px rgba(212,163,115,${0.3 * ringIn})`,
                opacity: ringIn * 0.5,
                transform: `scale(${0.6 + ringIn * 0.4})`,
              }}
            />
          ) : null}

          {/* 主角：全屏大数字 0→118（落定 SLAM 辉光） */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 130,
              textAlign: 'center',
              zIndex: 30,
              fontFamily: fontFamilies.mono,
              fontSize: 250,
              fontWeight: 700,
              lineHeight: 1.05,
              color: FILM_COLORS2.data,
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '0.02em',
              opacity: interpolate(frame, [20, 32], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
              transform: `scale(${hero.slam})`,
              ...glowText(FILM_COLORS2.data, hero.glow),
            }}
          >
            {hero.text}
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 420, textAlign: 'center', zIndex: 30 }}>
            <span style={{ fontFamily: fontFamilies.mono, fontSize: 18, letterSpacing: '0.5em', color: FILM_COLORS2.textMuted, opacity: interpolate(frame, [26, 40], [0, 0.9], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>个版本 · 两个半月</span>
          </div>

          {/* 时间轴 + release 节点 */}
          <div style={{ position: 'absolute', left: 140, right: 140, top: 640, height: 2, background: FILM_COLORS2.line, opacity: 0.55 }} />
          <div style={{ position: 'absolute', left: 1500, top: 612, width: 3, height: 32, background: FILM_COLORS2.data, boxShadow: `0 0 12px 2px rgba(212,163,115,0.4)`, opacity: nodeIn }}>
            <span style={{ position: 'absolute', left: -60, top: -34, fontFamily: fontFamilies.mono, fontSize: 15, color: FILM_COLORS2.data, opacity: 0.9, whiteSpace: 'nowrap' }}>2026-08-22 · release</span>
          </div>

          {/* 锚：v2.0.0 落轴起点（标识不滚） */}
          <div style={{ position: 'absolute', left: 180, top: 626, opacity: interpolate(frame, [12, 20], [0, 0.9], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
            <div style={{ width: 12, height: 12, borderRadius: 6, background: FILM_COLORS2.gold, boxShadow: `0 0 10px rgba(233,217,174,0.5)` }} />
            <span style={{ position: 'absolute', left: -40, top: 20, fontFamily: fontFamilies.mono, fontSize: 14, color: FILM_COLORS2.textMuted, whiteSpace: 'nowrap' }}>v2.0.0 · 2024-12-08</span>
          </div>

          {/* 118 枚版本雨（accel 越落越快，每颗落定闪一次） */}
          {Array.from({ length: V_RAIN }).map((_, i) => {
            const k = Math.pow(i / (V_RAIN - 1), 1.65);
            const land = 20 + k * (RAIN_END - 20);
            if (frame < land) return null;
            const x = 220 + (i / V_RAIN) * 1280 + (random(`s50-x-${i}`) - 0.5) * 36;
            const y = 640 - 8 - random(`s50-y-${i}`) * 60;
            const flash = interpolate(frame, [land, land + 2, land + 7], [0, 0.9, 0.25], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: x,
                  top: y,
                  width: 7,
                  height: 7,
                  borderRadius: 3.5,
                  background: FILM_COLORS2.data,
                  opacity: 0.55 + flash * 0.45,
                  boxShadow: flash > 0.2 ? `0 0 10px 2px rgba(212,163,115,${flash * 0.55})` : `0 0 5px rgba(212,163,115,0.25)`,
                }}
              />
            );
          })}
          {/* 雨幕止点 2026-11-08 */}
          <span style={{ position: 'absolute', left: 1690, top: 668, fontFamily: fontFamilies.mono, fontSize: 15, color: FILM_COLORS2.data, opacity: interpolate(frame, [RAIN_END, TOTAL], [0, 0.75], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>2026-11-08</span>
          <span style={{ position: 'absolute', left: 180, top: 700, fontFamily: fontFamilies.mono, fontSize: 15, letterSpacing: '0.2em', color: FILM_COLORS2.textMuted, opacity: 0.55 }}>{V_TOTAL} TAGS</span>
        </AbsoluteFill>
      </CameraRig>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 300, backgroundImage: `linear-gradient(180deg, transparent, ${FILM_COLORS2.spaceDeep})`, opacity: 0.24 }} />
      <HudChrome label="wuh.site · RELEASES" readout="118 TAGS · 2.5 MONTHS" />
      <Grade2 id="GR2-08" />
      <Caption text="八月，发布脚本落地。两个半月，118 个版本。" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S50;
