/* S23 · Act 4 留白 · 局部帧 [0,258) · 258f · 绝对 3306–3564
 *
 * 「八月杨梅坑；九月梧桐山」审计重定义：删截图（全片禁网站截图 §3），两枚足迹坐标件
 * 纯排版——地名大字 serif + 日期 mono + 坐标 mono + 定位点脉冲（涟漪双圈），亲历事实即数据，
 * 数据源=2025-08 杨梅坑 / 2025-09 梧桐山（脚本/Caption 事实，无素材依赖）。
 * 258f 长镜两拍各占其半：前半 杨梅坑（落点 54=绝对 3360=拍168 对音，絕不动），后半 梧桐山（落点 154=绝对 3460=拍173 对音，絕不动）。
 * 编排四问：
 *   承接 = s22 交出的大字 0 虚焦（首帧「0」失焦残影 0–26 淡出）；
 *   触发 = 两枚定位点先后脉冲点亮（涟漪执行「到过」的动作）；
 *   展开 = 帧级节奏：0–26 残影让台 → 30 轴题显影 → 54 杨梅坑坐标件 springIn（地名/日期/坐标三层错 8f）+ 双圈涟漪 44f → 129 半场交接（cam 移向左点）→ 154 梧桐山坐标件（涟漪更缓 70f）→ 214–258 涟漪收尽；
 *   交接 = 尾帧：两落点并亮、涟漪收尽（交接态：双点亮，交 s24 十二月亮刻）。
 * 逐拍帧表（fps=30）：
 *   [0–26]   「0」失焦残影淡出（0.4→0，blur 8）；
 *   [30–44]  轴题「足 迹 · 2025」writeFade 显影（标识）；
 *   [54]     杨梅坑定位点亮：琥珀核 springIn scale 0.4→1 + 双圈涟漪（44f/58f）；地名大字 serif 64 + 辉光 58f 显影、日期 2025-08 +8f、坐标 114.585, 22.55 +10f；
 *   [20–210] cam rack：先看右点（杨梅坑）→ 160 起移向左点（梧桐山）（窗原样）；
 *   [154]    梧桐山定位点亮：同构（涟漪 70f/84f 更缓）；日期 2025-09、坐标 114.23, 22.62；
 *   [214–258] 涟漪收尽（双点余光 fade 1→0.35）。
 * 时间轴零改动：258f / 两落点 54 与 154 / Caption appearAt 14 原样；转场：入「切」，出「切」。
 * 字幕安全窗：start≥12、end≤246。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES, writeFade } from '../../../brand/motion';
import { FILM_COLORS2, glowText, springIn } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const XIANG = { x: 1020, y: 620, land: 54, coord: '114.585, 22.55', month: '2025-08', name: '杨梅坑' }; // 杨梅坑（海）
const WUTONG = { x: 620, y: 420, land: 154, coord: '114.23, 22.62', month: '2025-09', name: '梧桐山' }; // 梧桐山（雾）

/** 足迹坐标件（纯排版：地名大字 serif + 日期 mono + 坐标 mono + 定位点脉冲；涟漪窗原样） */
const Pin: FC<{ p: { x: number; y: number; land: number; coord: string; month: string; name: string }; frame: number; fps: number; slow?: boolean }> = ({ p, frame, fps, slow = false }) => {
  const on = frame >= p.land;
  const r1 = interpolate(frame, [p.land, p.land + (slow ? 70 : 44)], [0, 150], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const r2 = interpolate(frame, [p.land + 8, p.land + (slow ? 84 : 58)], [0, 220], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const fade = interpolate(frame, [214, 258], [1, 0.35], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const rippleOp = (r: number, t0: number) => (r <= 0 ? 0 : interpolate(frame, [t0, t0 + 10, t0 + (slow ? 80 : 54)], [0, 0.5, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })) * fade;
  const corePop = springIn(frame, p.land, fps, 15, 190, 0.8);
  return (
    <div>
      {on ? (
        <>
          {/* 落点亮核（琥珀数据核，springIn 位移入场） */}
          <div style={{ position: 'absolute', left: p.x - 9, top: p.y - 9, width: 18, height: 18, borderRadius: 9, background: FILM_COLORS2.data, opacity: fade * Math.min(1, corePop * 1.2), transform: `scale(${0.4 + corePop * 0.6})`, boxShadow: `0 0 18px 6px rgba(212,163,115,0.5)` }} />
          {/* 双圈涟漪 */}
          {r1 > 0 ? <div style={{ position: 'absolute', left: p.x - r1, top: p.y - r1 / 2, width: r1 * 2, height: r1, borderRadius: r1, border: `1.6px solid ${FILM_COLORS2.data}`, opacity: rippleOp(r1, p.land) }} /> : null}
          {r2 > 0 ? <div style={{ position: 'absolute', left: p.x - r2, top: p.y - r2 / 2, width: r2 * 2, height: r2, borderRadius: r2, border: `1px solid ${FILM_COLORS2.dataDim}`, opacity: rippleOp(r2, p.land + 8) }} /> : null}
          {/* 坐标件：地名大字 serif + 日期 mono（数据行，落点亮起即现，三层错 8f） */}
          <div style={{ position: 'absolute', left: p.x - 140, top: p.y - 170, width: 280, textAlign: 'center', opacity: fade }}>
            <div style={{ ...writeFade(frame, p.land + 4), fontFamily: fontFamilies.serif, fontSize: 64, color: FILM_COLORS2.paperWhite, ...glowText(FILM_COLORS2.paperWhite, 0.22) }}>{p.name}</div>
            <div style={{ fontFamily: fontFamilies.mono, fontSize: 18, color: FILM_COLORS2.textMuted, opacity: interpolate(frame, [p.land + 8, p.land + 18], [0, 0.9], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) * fade, fontVariantNumeric: 'tabular-nums', marginTop: 8 }}>{p.month}</div>
          </div>
          {/* 等宽坐标角标（+10f 显影） */}
          <span style={{ position: 'absolute', left: p.x + 18, top: p.y - 30, fontFamily: fontFamilies.mono, fontSize: 16, color: FILM_COLORS2.paperWhite, opacity: interpolate(frame, [p.land + 10, p.land + 20], [0, 0.85], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) * fade, fontVariantNumeric: 'tabular-nums' }}>
            {p.coord}
          </span>
        </>
      ) : null}
    </div>
  );
};

const S23: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
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
          {/* 「0」失焦残影（0–26 淡出，承接 s22 尾帧） */}
          {frame < 26 ? (
            <div style={{ position: 'absolute', left: 0, right: 0, top: 250, textAlign: 'center', fontFamily: fontFamilies.serif, fontSize: 420, color: FILM_COLORS2.paperWhite, opacity: interpolate(frame, [0, 26], [0.4, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), filter: 'blur(8px)' }}>
              0
            </div>
          ) : null}

          {/* 足迹轴题（标识） */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 210, textAlign: 'center', ...writeFade(frame, 30) }}>
            <span style={{ fontFamily: fontFamilies.mono, fontSize: 16, letterSpacing: '0.4em', color: FILM_COLORS2.textMuted }}>足 迹 · 2025</span>
          </div>

          {/* 两点间微光连线（纯构图，非地理） */}
          <div style={{ position: 'absolute', left: 620, top: 519, width: 400, height: 1, background: `linear-gradient(90deg, transparent, ${FILM_COLORS2.line}, transparent)`, opacity: 0.6 }} />

          {/* 落点（深空坐标件 ×2：前半杨梅坑 / 后半梧桐山） */}
          <Pin p={XIANG} frame={frame} fps={fps} />
          <Pin p={WUTONG} frame={frame} fps={fps} slow />
        </AbsoluteFill>
      </CameraRig>
      <HudChrome label="wuh.site · FOOTPRINTS" readout="2025 · 2 HIKES" />
      <Grade2 id="GR2-04" />
      <Caption text="可日子没有停：八月，杨梅坑；九月，梧桐山。" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S23;
