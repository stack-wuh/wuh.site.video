/* S48 · Act 7 坐忘 · 局部帧 [0,162) · 162f · 绝对 6524–6686
 *
 * 读书日 —— V2 深空数据流重构（2026-11-11）：原书桌俯拍实体场景退役，改
 * DeepSpace 暖黑数据流底上的线框书房（0–20 晨光先渗 → 20–76 线框书页与
 * 日历数据卡浮现，原窗口）；日历卡 = 辉光小窗（panel 底 + 琥珀边 + 深投影），
 * 「游戏日」朱红划线（76–96 原窗口·本镜唯一朱红=手作签名）→「读书日」
 * 暖纸白辉光落定（96–116 原节奏）；晨光改琥珀金光、角度 5s 偏移 20°（0–150
 * 原窗口），116 后铺满；内容主角化：改写二字即全镜焦点。
 * 转场：入「墨洇」（20f，晕心=纸页边缘晨光），出「墨洇」（下一镜 inbound）。
 * 字幕安全窗：start≥32。
 * 尾帧：晨光铺满、日历格改写完成（交接态：光满+改写完成）。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES, writeFade } from '../../../brand/motion';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';
import { FILM_COLORS2, glowText } from '../motion-tokens';

const TOTAL = 162;

const S48: FC = () => {
  const frame = useCurrentFrame();
  // 线框书房浮现（20–76 交叉）
  const deskIn = interpolate(frame, [20, 76], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  // 晨光角度偏移（5s=150f 内偏移 20°）
  const sunAngle = interpolate(frame, [0, 150], [-18, 2], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const cam = {
    scale: interpolate(frame, [0, TOTAL], [1.1, 1.04], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    x: 0,
    y: interpolate(frame, [0, TOTAL], [30, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
    rot: 0,
  };

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DeepSpace seed="s48v2" stars={50} grid horizon />

          {/* 线框书房（20–76 浮现）：摊开的书（左）+ 日历数据卡（右） */}
          <div style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, opacity: deskIn }}>
            {/* 摊开的书（线框双页 + 行线） */}
            <div style={{ position: 'absolute', left: 260, top: 300, width: 700, height: 420, transform: 'rotate(-2.4deg)' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, width: 344, height: 420, borderRadius: '8px 2px 2px 8px', background: FILM_COLORS2.panel, border: `1px solid ${FILM_COLORS2.line}` }} />
              <div style={{ position: 'absolute', right: 0, top: 0, width: 344, height: 420, borderRadius: '2px 8px 8px 2px', background: 'rgba(23,20,16,0.5)', border: `1px solid ${FILM_COLORS2.line}` }} />
              <div style={{ position: 'absolute', left: 344, top: 0, width: 12, height: 420, background: FILM_COLORS2.dataDim, opacity: 0.35 }} />
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} style={{ position: 'absolute', left: 30, top: 50 + i * 58, width: 280 - (i % 2) * 40, height: 10, background: FILM_COLORS2.dataDim, opacity: 0.28 }} />
              ))}
            </div>
            {/* 日历数据卡（辉光小窗）：「游戏日」被划掉 → 改写「读书日」（76–116 微距节奏） */}
            <div style={{ position: 'absolute', right: 300, top: 260, width: 420, height: 500, transform: 'rotate(1.4deg)', zIndex: 28 }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: 8, background: FILM_COLORS2.panel, border: `1px solid ${FILM_COLORS2.dataDim}`, boxShadow: `0 0 34px rgba(212,163,115,0.18), 0 18px 50px rgba(0,0,0,0.6)` }} />
              <div style={{ position: 'absolute', left: 40, top: 40, fontFamily: fontFamilies.mono, fontSize: 30, color: FILM_COLORS2.textMuted, letterSpacing: '0.08em' }}>七月某日 · 周六</div>
              <div style={{ position: 'absolute', left: 40, top: 110 }}>
                <span style={{ fontFamily: fontFamilies.serif, fontSize: 52, color: FILM_COLORS2.textMuted, opacity: 0.6, position: 'relative' }}>
                  游戏日
                  {/* 朱红划掉一笔（76–96）·本镜唯一朱红 */}
                  <span style={{ position: 'absolute', left: -6, top: '52%', width: interpolate(frame, [76, 96], [0, 195]), height: 5, background: FILM_COLORS2.sealRed, transform: 'rotate(-4deg)', borderRadius: 2, boxShadow: `0 0 10px rgba(122,31,22,0.4)` }} />
                </span>
              </div>
              {/* 改写「读书日」（96–116，暖纸白辉光落定） */}
              <div style={{ position: 'absolute', left: 40, top: 200, ...writeFade(frame, 96, true) }}>
                <span style={{ fontFamily: fontFamilies.serif, fontSize: 52, color: FILM_COLORS2.paperWhite, ...glowText(FILM_COLORS2.data, 0.38) }}>读书日</span>
              </div>
              {/* 脚注行 + 茶渍环 */}
              <div style={{ position: 'absolute', left: 40, top: 330, width: 240, height: 4, background: FILM_COLORS2.dataDim, opacity: 0.3 }} />
              <div style={{ position: 'absolute', right: 60, bottom: 60, width: 40, height: 40, borderRadius: 20, border: `1px solid ${FILM_COLORS2.dataDim}`, opacity: 0.35 }} />
            </div>
          </div>

          {/* 晨光（琥珀金光，角度随时间偏移 20°，116 后铺满） */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(${115 + sunAngle}deg, rgba(233,217,174,0.5) 0%, rgba(212,163,115,0.14) 34%, transparent 55%)`,
              opacity: interpolate(frame, [0, 60, 116, TOTAL], [0.25, 0.4, 0.55, 0.65], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
              pointerEvents: 'none',
            }}
          />
        </AbsoluteFill>
      </CameraRig>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 300, backgroundImage: `linear-gradient(180deg, transparent, ${FILM_COLORS2.spaceDeep})`, opacity: 0.2 }} />
      <HudChrome label="wuh.site · DIARY" readout="游戏日 → 读书日" />
      <Grade2 id="GR2-07" />
      <Caption text="清晨，他随口念起两句，临时把游戏日改成了读书日。" appearAt={32} />
    </AbsoluteFill>
  );
};

export default S48;
