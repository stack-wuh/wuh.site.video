/* S48 · Act 7 坐忘 · 局部帧 [0,162) · 162f · 绝对 6524–6686
 *
 * 读书日：晨光自纸页边缘渗入（0–20）；纸页淡出为书桌俯拍（20–76 交叉）；
 * 俯拍缓降 + 晨光角度 5s 偏移 20°；划改微距特写插入（76–116）：
 * 划掉「游戏日」→ 改写「读书日」；晨光铺满桌面（116–162）。
 * 转场：入「墨洇」（20f，晕心=纸页边缘晨光），出「墨洇」（下一镜 inbound）。
 * 字幕安全窗：start≥32。
 * 尾帧：晨光铺满桌面、日历格改写完成。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, writeFade } from '../../../brand/motion';
import { FILM_COLORS } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const TOTAL = 162;

const S48: FC = () => {
  const frame = useCurrentFrame();
  // 纸页淡出 → 书桌浮现（20–76 交叉）
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
    <AbsoluteFill style={{ background: colors.bg }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DustField act={7} count={12} seedBase="s48" />

          {/* 书桌俯拍（摊开的书 + 日历） */}
          <div style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, opacity: deskIn }}>
            {/* 摊开的书（左） */}
            <div style={{ position: 'absolute', left: 260, top: 300, width: 700, height: 420, transform: 'rotate(-2.4deg)' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, width: 344, height: 420, borderRadius: '8px 2px 2px 8px', background: colors.paper, border: `1px solid ${colors.paperMuted}` }} />
              <div style={{ position: 'absolute', right: 0, top: 0, width: 344, height: 420, borderRadius: '2px 8px 8px 2px', background: colors.paperDeep, border: `1px solid ${colors.paperMuted}` }} />
              <div style={{ position: 'absolute', left: 344, top: 0, width: 12, height: 420, background: colors.muted, opacity: 0.3 }} />
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} style={{ position: 'absolute', left: 30, top: 50 + i * 58, width: 280 - (i % 2) * 40, height: 10, background: colors.ink, opacity: 0.24 }} />
              ))}
            </div>
            {/* 日历（右）：「游戏日」被划掉 → 改写「读书日」（76–116 微距特写节奏） */}
            <div style={{ position: 'absolute', right: 300, top: 260, width: 420, height: 500, transform: 'rotate(1.4deg)' }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: 8, background: colors.paper, border: `1px solid ${colors.paperMuted}`, boxShadow: '0 18px 50px rgba(0,0,0,0.22)' }} />
              <div style={{ position: 'absolute', left: 40, top: 40, fontFamily: fontFamilies.serif, fontSize: 30, color: colors.ink, opacity: 0.8 }}>七月某日 · 周六</div>
              <div style={{ position: 'absolute', left: 40, top: 110 }}>
                <span style={{ fontFamily: fontFamilies.serif, fontSize: 52, color: colors.muted, opacity: 0.6, position: 'relative' }}>
                  游戏日
                  {/* 划掉一笔（76–96） */}
                  <span style={{ position: 'absolute', left: -6, top: '52%', width: interpolate(frame, [76, 96], [0, 195]), height: 5, background: colors.seal, transform: 'rotate(-4deg)', borderRadius: 2 }} />
                </span>
              </div>
              {/* 改写「读书日」（96–116） */}
              <div style={{ position: 'absolute', left: 40, top: 200, ...writeFade(frame, 96, true) }}>
                <span style={{ fontFamily: fontFamilies.serif, fontSize: 52, color: colors.ink }}>读书日</span>
              </div>
              {/* 一页纸 + 茶渍点 */}
              <div style={{ position: 'absolute', left: 40, top: 330, width: 240, height: 4, background: colors.muted, opacity: 0.3 }} />
              <div style={{ position: 'absolute', right: 60, bottom: 60, width: 40, height: 40, borderRadius: 20, background: colors.gold, opacity: 0.14 }} />
            </div>
          </div>

          {/* 晨光（角度随时间偏移 20°，116 后铺满桌面） */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(${115 + sunAngle}deg, ${FILM_COLORS.dawnLight} 0%, transparent 55%)`,
              opacity: interpolate(frame, [0, 60, 116, TOTAL], [0.25, 0.4, 0.55, 0.65], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
              pointerEvents: 'none',
            }}
          />
        </AbsoluteFill>
      </CameraRig>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 300, backgroundImage: `linear-gradient(180deg, transparent, ${colors.bg})`, opacity: 0.2 }} />
      <PaperGrain opacity={0.06} />
      <Grade id="GR-06" />
      <Caption text="清晨，他随口念起两句，临时把游戏日改成了读书日。" appearAt={32} />
    </AbsoluteFill>
  );
};

export default S48;
