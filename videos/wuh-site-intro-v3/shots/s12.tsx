/* S12 · Act 3 第一行 · 局部帧 [0,90) · 90f · 绝对 1872–1962
 *
 * V2 暖黑数据流重写（2026-11-11 品牌暖黑科技）：「灰调纸页翻入」改写为「档案数据页入画」——
 * 线框档案卡整版显影（0–14 与原 drop 窗一致），页眉角标 2022-02-08 + 「2022 年度总结」
 * + 琥珀数据条；正文灰度行块=数据行占位（不伪造原文）；落定后缓慢下摇 4%（cam 窗原样）。
 * GR2-03（幕 3）。转场：入「纸翻」出「切」→ ShotShell 光晕呼吸，镜文件零工作。
 * 无字幕（入页）。尾帧：档案页整版入画静住（交接态：深色档案页）。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { FILM_COLORS2 } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 90;

const S12: FC = () => {
  const frame = useCurrentFrame();
  const drop = interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const cam = {
    scale: 1.04,
    x: 0,
    y: interpolate(frame, [18, TOTAL], [0, 40], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    rot: 0,
  };

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s12v2" stars={54} grid />
      <CameraRig cam={cam}>
        <AbsoluteFill>
          {/* 档案数据页（线框卡整版，0–14 显影） */}
          <div
            style={{
              position: 'absolute',
              left: 170,
              top: 90,
              right: 170,
              bottom: 90,
              borderRadius: 8,
              background: FILM_COLORS2.panel,
              border: `1px solid ${FILM_COLORS2.grid}`,
              boxShadow: `0 24px 60px rgba(0,0,0,0.55), 0 0 44px rgba(212,163,115,0.08)`,
              opacity: drop,
              transform: `translateY(${(1 - drop) * 18}px)`,
            }}
          >
            {/* 页眉：角标日期（标识） + 数据条 */}
            <div style={{ position: 'absolute', left: 50, top: 40, display: 'flex', alignItems: 'center', gap: 20 }}>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 20, color: FILM_COLORS2.textMuted, fontVariantNumeric: 'tabular-nums' }}>2022-02-08</span>
              <span style={{ fontFamily: fontFamilies.serif, fontSize: 26, color: FILM_COLORS2.paperWhite, opacity: 0.9 }}>2022 年度总结</span>
              <div style={{ width: 60, height: 3, background: FILM_COLORS2.data, opacity: 0.8, boxShadow: `0 0 10px rgba(212,163,115,0.4)` }} />
            </div>
            <div style={{ position: 'absolute', left: 50, right: 50, top: 110, height: 1, background: FILM_COLORS2.line, opacity: 0.6 }} />
            {/* 数据行占位（不伪造原文） */}
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} style={{ position: 'absolute', left: 50, top: 150 + i * 74, width: i % 3 === 2 ? 900 : 1340 - (i % 2) * 180, height: 22, background: FILM_COLORS2.paperWhite, opacity: 0.1 }} />
            ))}
            {/* 行首刻度（档案编号感） */}
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <span key={`tick-${i}`} style={{ position: 'absolute', left: 14, top: 152 + i * 74, fontFamily: fontFamilies.mono, fontSize: 13, color: FILM_COLORS2.dataDim, opacity: 0.6, fontVariantNumeric: 'tabular-nums' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
            ))}
          </div>
        </AbsoluteFill>
      </CameraRig>
      <HudChrome label="wuh.site · ARCHIVE" readout="2022-02-08" />
      <Grade2 id="GR2-03" />
    </AbsoluteFill>
  );
};

export default S12;
