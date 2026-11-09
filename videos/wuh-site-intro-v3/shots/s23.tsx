/* S23 · Act 4 留白 · 局部帧 [0,258) · 258f · 绝对 3306–3564
 *
 * 生活证据：从「0」的失焦里浮出一扇 380px 地图小窗（WIN-01，0–20，S09 足迹地图
 * 真实截图打底）；杨梅坑先亮（54=绝对 3360=拍168，双圈涟漪 + 等宽角标
 * 「114.585, 22.55」）→ 梧桐山后亮（154=绝对 3460=拍173，涟漪更缓、
 * 角标「114.23, 22.62」）；rack 随涟漪移；涟漪收尽（214–258）。
 * 素材像素不变形：地图只整体等比微缩放。转场：入「切」，出「切」。
 * 字幕安全窗：start≥12、end≤246。
 * 尾帧：两落点并亮、涟漪收尽。
 */
import type { FC } from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from 'remotion';
import { staticFile } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { FILM_COLORS, frameIn, panePan } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const TOTAL = 258;
const XIANG = { x: 1020, y: 620, land: 54, coord: '114.585, 22.55' }; // 杨梅坑（海）
const WUTONG = { x: 620, y: 420, land: 154, coord: '114.23, 22.62' }; // 梧桐山（雾）

/** 落点亮起 + 双圈涟漪 */
const Pin: FC<{ p: { x: number; y: number; land: number; coord: string }; frame: number; slow?: boolean }> = ({ p, frame, slow = false }) => {
  const on = frame >= p.land;
  const r1 = interpolate(frame, [p.land, p.land + (slow ? 70 : 44)], [0, 150], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const r2 = interpolate(frame, [p.land + 8, p.land + (slow ? 84 : 58)], [0, 220], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fade = interpolate(frame, [214, 258], [1, 0.35], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const rippleOp = (r: number, t0: number) => (r <= 0 ? 0 : interpolate(frame, [t0, t0 + 10, t0 + (slow ? 80 : 54)], [0, 0.5, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })) * fade;
  return (
    <div>
      {on ? (
        <>
          {/* 落点亮核 */}
          <div style={{ position: 'absolute', left: p.x - 9, top: p.y - 9, width: 18, height: 18, borderRadius: 9, background: FILM_COLORS.lampAmber, opacity: fade, boxShadow: `0 0 14px 4px rgba(217,160,91,0.5)` }} />
          {/* 双圈涟漪 */}
          {r1 > 0 ? <div style={{ position: 'absolute', left: p.x - r1, top: p.y - r1 / 2, width: r1 * 2, height: r1, borderRadius: r1, border: `1.6px solid ${FILM_COLORS.lampAmber}`, opacity: rippleOp(r1, p.land) }} /> : null}
          {r2 > 0 ? <div style={{ position: 'absolute', left: p.x - r2, top: p.y - r2 / 2, width: r2 * 2, height: r2, borderRadius: r2, border: `1px solid ${FILM_COLORS.lampAmber}`, opacity: rippleOp(r2, p.land + 8) }} /> : null}
          {/* 等宽角标 */}
          <span style={{ position: 'absolute', left: p.x + 18, top: p.y - 30, fontFamily: fontFamilies.mono, fontSize: 15, color: colors.paper, opacity: interpolate(frame, [p.land + 10, p.land + 20], [0, 0.85], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) * fade }}>
            {p.coord}
          </span>
        </>
      ) : null}
    </div>
  );
};

const S23: FC = () => {
  const frame = useCurrentFrame();
  const win = frameIn(frame, 0);
  // rack 随涟漪移：先看杨梅坑（右），后移向梧桐山（左）
  const cam = {
    scale: 1.05,
    x: interpolate(frame, [20, 60, 160, 210], [30, -10, -10, -60], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    y: 0,
    rot: 0,
  };

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DustField act={4} count={8} seedBase="s23" />

          {/* 「0」失焦残影（0–26 淡出） */}
          {frame < 26 ? (
            <div style={{ position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center', fontFamily: fontFamilies.serif, fontSize: 460, color: colors.ink, opacity: interpolate(frame, [0, 26], [0.5, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), filter: 'blur(8px)' }}>
              0
            </div>
          ) : null}

          {/* 380px 地图小窗（S09 打底；素材像素只整体等比微缩放） */}
          <div style={{ position: 'absolute', left: 770, top: 330, width: 380, height: 380, ...win }}>
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: colors.bg }}>
              <Img
                src={staticFile('wuh-site-intro-v3/site/s09-footprint-v1.png')}
                style={{
                  width: '110%',
                  height: '110%',
                  objectFit: 'cover',
                  ...panePan(frame, 20, 210, { x: -20, y: 0 }, 1.04),
                }}
              />
              <div style={{ position: 'absolute', inset: 0, background: colors.bg, opacity: 0.22 }} />
              {/* 颗粒 ≤6%（PT-07 照片即证据的质感） */}
              <div style={{ position: 'absolute', inset: 0, background: `repeating-conic-gradient(rgba(255,255,255,0.02) 0deg 1deg, transparent 1deg 2deg)`, opacity: 0.5 }} />
            </div>
            {/* 落点（窗内坐标） */}
            <Pin p={XIANG} frame={frame} />
            <Pin p={WUTONG} frame={frame} slow />
            <div style={{ position: 'absolute', inset: 0, border: `1px solid ${colors.seal}`, opacity: 0.7 }} />
            {/* 窗题 */}
            <span style={{ position: 'absolute', left: 14, top: 10, fontFamily: fontFamilies.mono, fontSize: 13, color: colors.paper, opacity: 0.8, letterSpacing: '0.2em' }}>足 迹 · 2025</span>
          </div>
        </AbsoluteFill>
      </CameraRig>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 300, backgroundImage: `linear-gradient(180deg, transparent, ${colors.bg})`, opacity: 0.24 }} />
      <PaperGrain opacity={0.07} />
      <Grade id="GR-01" />
      <Caption text="可日子没有停：八月，杨梅坑；九月，梧桐山。" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S23;
