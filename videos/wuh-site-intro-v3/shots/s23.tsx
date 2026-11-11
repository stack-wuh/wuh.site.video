/* S23 · Act 4 留白 · 局部帧 [0,258) · 258f · 绝对 3306–3564
 *
 * V2 暖黑数据流重写（2026-11-11 品牌暖黑科技）：生活证据数据化——S09 足迹地图截图
 * 降级为「证据快闪」辉光小窗（16 出现 → 74 退场，58f ≤2s 口径，琥珀边+外辉光+深投影）；
 * 主角 = 两枚足迹数据节点：杨梅坑先亮（54=绝对 3360=拍168，双圈涟漪 + 等宽角标
 * 「114.585, 22.55」+ 月份/地名数据行）→ 梧桐山后亮（154=绝对 3460=拍173，涟漪更缓、
 * 角标「114.23, 22.62」）；「0」失焦残影淡出（0–26）；rack 机位随涟漪移（cam 窗原样）；
 * 涟漪收尽（214–258）。落点=深空上的琥珀数据核，不做整屏截图主角。
 * 转场：入「切」，出「切」。字幕安全窗：start≥12、end≤246。
 * 尾帧：两落点并亮、涟漪收尽（交接态：双点亮）。
 */
import type { FC } from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from 'remotion';
import { staticFile } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES, writeFade } from '../../../brand/motion';
import { FILM_COLORS2, frameIn, glowText } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const XIANG = { x: 1020, y: 620, land: 54, coord: '114.585, 22.55', month: '2025-08', name: '杨梅坑' }; // 杨梅坑（海）
const WUTONG = { x: 620, y: 420, land: 154, coord: '114.23, 22.62', month: '2025-09', name: '梧桐山' }; // 梧桐山（雾）

/** 落点亮起 + 双圈涟漪 + 数据行（月份/地名/角标；涟漪窗原样） */
const Pin: FC<{ p: { x: number; y: number; land: number; coord: string; month: string; name: string }; frame: number; slow?: boolean }> = ({ p, frame, slow = false }) => {
  const on = frame >= p.land;
  const r1 = interpolate(frame, [p.land, p.land + (slow ? 70 : 44)], [0, 150], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const r2 = interpolate(frame, [p.land + 8, p.land + (slow ? 84 : 58)], [0, 220], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fade = interpolate(frame, [214, 258], [1, 0.35], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const rippleOp = (r: number, t0: number) => (r <= 0 ? 0 : interpolate(frame, [t0, t0 + 10, t0 + (slow ? 80 : 54)], [0, 0.5, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })) * fade;
  return (
    <div>
      {on ? (
        <>
          {/* 落点亮核（琥珀数据核） */}
          <div style={{ position: 'absolute', left: p.x - 9, top: p.y - 9, width: 18, height: 18, borderRadius: 9, background: FILM_COLORS2.data, opacity: fade, boxShadow: `0 0 18px 6px rgba(212,163,115,0.5)` }} />
          {/* 双圈涟漪 */}
          {r1 > 0 ? <div style={{ position: 'absolute', left: p.x - r1, top: p.y - r1 / 2, width: r1 * 2, height: r1, borderRadius: r1, border: `1.6px solid ${FILM_COLORS2.data}`, opacity: rippleOp(r1, p.land) }} /> : null}
          {r2 > 0 ? <div style={{ position: 'absolute', left: p.x - r2, top: p.y - r2 / 2, width: r2 * 2, height: r2, borderRadius: r2, border: `1px solid ${FILM_COLORS2.dataDim}`, opacity: rippleOp(r2, p.land + 8) }} /> : null}
          {/* 月份 + 地名（数据行，落点亮起即现） */}
          <div style={{ position: 'absolute', left: p.x - 110, top: p.y - 150, width: 220, textAlign: 'center', opacity: fade }}>
            <div style={{ ...writeFade(frame, p.land), fontFamily: fontFamilies.serif, fontSize: 44, color: FILM_COLORS2.paperWhite, ...glowText(FILM_COLORS2.paperWhite, 0.2) }}>{p.name}</div>
            <div style={{ fontFamily: fontFamilies.mono, fontSize: 15, color: FILM_COLORS2.textMuted, opacity: 0.85, fontVariantNumeric: 'tabular-nums', marginTop: 6 }}>{p.month}</div>
          </div>
          {/* 等宽角标 */}
          <span style={{ position: 'absolute', left: p.x + 18, top: p.y - 30, fontFamily: fontFamilies.mono, fontSize: 15, color: FILM_COLORS2.paperWhite, opacity: interpolate(frame, [p.land + 10, p.land + 20], [0, 0.85], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) * fade }}>
            {p.coord}
          </span>
        </>
      ) : null}
    </div>
  );
};

const S23: FC = () => {
  const frame = useCurrentFrame();
  // 证据快闪：S09 足迹地图（16 出现 → 74 退场，58f ≤2s 口径）
  const proofIn = frameIn(frame, 16);
  const proofOut = interpolate(frame, [64, 74], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  // rack 随涟漪移：先看杨梅坑（右），后移向梧桐山（左）
  const cam = {
    scale: 1.05,
    x: interpolate(frame, [20, 60, 160, 210], [30, -10, -10, -60], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    y: 0,
    rot: 0,
  };

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s23v2" stars={48} grid />
      <CameraRig cam={cam}>
        <AbsoluteFill>
          {/* 「0」失焦残影（0–26 淡出） */}
          {frame < 26 ? (
            <div style={{ position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center', fontFamily: fontFamilies.serif, fontSize: 460, color: FILM_COLORS2.paperWhite, opacity: interpolate(frame, [0, 26], [0.4, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), filter: 'blur(8px)' }}>
              0
            </div>
          ) : null}

          {/* 足迹轴题（标识） */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 210, textAlign: 'center', ...writeFade(frame, 30) }}>
            <span style={{ fontFamily: fontFamilies.mono, fontSize: 16, letterSpacing: '0.4em', color: FILM_COLORS2.textMuted }}>足 迹 · 2025</span>
          </div>

          {/* 两点间微光连线（纯构图，非地理） */}
          <div style={{ position: 'absolute', left: 620, top: 519, width: 400, height: 1, background: `linear-gradient(90deg, transparent, ${FILM_COLORS2.line}, transparent)`, opacity: 0.6 }} />

          {/* 落点（深空坐标） */}
          <Pin p={XIANG} frame={frame} />
          <Pin p={WUTONG} frame={frame} slow />

          {/* 证据快闪：S09 足迹地图（辉光小窗，16 出现 → 74 退场） */}
          <div style={{ position: 'absolute', right: 140, top: 130, width: 340, height: 340, zIndex: 28, opacity: Number(proofIn.opacity ?? 0) * proofOut, transform: `${proofIn.transform ?? ''} scale(${interpolate(frame, [16, 28], [1.05, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })})` }}>
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 10, background: FILM_COLORS2.panel }}>
              <Img
                src={staticFile('wuh-site-intro-v3/site/s09-footprint-v1.png')}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: FILM_COLORS2.spaceDeep, opacity: 0.18 }} />
            </div>
            <div style={{ position: 'absolute', inset: -1, borderRadius: 11, border: `1px solid ${FILM_COLORS2.dataDim}`, boxShadow: `0 0 30px rgba(212,163,115,0.2), 0 18px 44px rgba(0,0,0,0.6)`, pointerEvents: 'none' }} />
            <span style={{ position: 'absolute', left: 14, top: 10, fontFamily: fontFamilies.mono, fontSize: 13, color: FILM_COLORS2.paperWhite, opacity: 0.8, letterSpacing: '0.2em' }}>FOOTPRINTS</span>
          </div>
        </AbsoluteFill>
      </CameraRig>
      <HudChrome label="wuh.site · FOOTPRINTS" readout="2025 · 2 HIKES" />
      <Grade2 id="GR2-04" />
      <Caption text="可日子没有停：八月，杨梅坑；九月，梧桐山。" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S23;
