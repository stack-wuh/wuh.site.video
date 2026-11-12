/* S53 · Act 8 此刻 · 局部帧 [0,72) · 72f · 绝对 7192–7264
 *
 * 审计重定义（2026-11-12 批次 E 返工单）：SLAM 后不再静止——★DAT-03 slamPair「266 / 40」
 * 双数同滚同停（44–68 原窗口，落定 68=绝对 7260=拍363 对音）+ 归档/卡片微缩件错峰展开：
 * 归档微缩件（3×3 抽屉格，14 springIn）与知识卡微缩件两枚（30/38 springIn 错峰，扇形叠置）
 * ——266 与 40 各有数据本体落在画面上；落定瞬间 68 暖金双环 + 金粒（SLAM 级必配，FX-03/04）。
 *
 * 编排四问：
 * ① 承接——s52 尾帧交出「金句页+底纹」：0 起 60 格档案墙线框密度底纹 cascade 铺开（0–50 原窗口）。
 * ② 触发——归档微缩件 14 springIn 弹开抽屉墙，知识卡两枚 30/38 springIn 依次扇开
 *   （每枚入场带位移+旋转形变，禁原地淡入）。
 * ③ 展开——[44–68] 双数同滚同停（slamPair，200→266 / 20→40）；[68] 落定冲击（双环+金粒，
 *   末帧 scale 1.05→1）；档案墙 cascade 持续到 50 与滚数窗咬合，无静帧。
 * ④ 交接——尾帧：档案墙 + 知识卡微缩件悬停 + 双数定格局（manifest endFrameDesc 契约
 *   「交接态：知识墙」原样）。
 *
 * 逐拍帧表（局部帧，fps=30）：
 * [0–50]    档案墙 60 格线框底纹 cascade（2+i*0.8 原节奏，低亮度）；
 * [14]      归档微缩件 springIn（translateY -26→0 + scale 0.9→1）+ 标签「ARCHIVES · 归档墙」；
 * [30/38]   知识卡微缩件两枚 springIn 错峰扇开（rotate ±5°）+ 标签「KNOWLEDGE CARDS」；
 * [44–68]   slamPair 双数同滚同停（落定=拍363）；[68] 暖金双环 + sparkBurst('s53-burst',14 金粒)；
 * [68–72]   SLAM 辉光呼吸收束 = 交接态。
 * 时间轴零改动：72f / SLAM 44–68（拍363）/ Caption（文本+appearAt 14）原样；无 <Sequence>；
 * FILM_COLORS2 only；random(seed) only；springIn fps 取 useVideoConfig()。
 * 转场：入「切」，出「切」。字幕安全窗：start≥12、end≤60。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { FILM_COLORS2, fmtNum, glowText, shockwave, sparkBurst, slamPair, springIn } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 72;
const SLAM_AT = 44;
const SLAM_DUR = 24; // 落定 68 = 拍363
const GOLD = '233,217,174';

const S53: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cam = {
    scale: 1.05,
    x: interpolate(frame, [0, TOTAL], [40, -30], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    y: 0,
    rot: 0,
  };
  const slam = slamPair(frame, SLAM_AT, SLAM_DUR, { from: 200, to: 266 }, { from: 20, to: 40 });
  /* 微缩件入场（错峰 springIn：归档 14 / 卡片 30、38） */
  const archP = springIn(frame, 14, fps);
  const cardA = springIn(frame, 30, fps);
  const cardB = springIn(frame, 38, fps);
  /* 落定瞬间（68）：暖金双环 + 金粒，锚双数视觉中心（top 60+100=160） */
  const wave = shockwave(frame, SLAM_AT + SLAM_DUR, GOLD);
  const burst = sparkBurst('s53-burst', frame, SLAM_AT + SLAM_DUR, 14, true);
  const landGlow = interpolate(frame, [SLAM_AT + SLAM_DUR, SLAM_AT + SLAM_DUR + 3, TOTAL], [0.5, 0.85, 0.5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DeepSpace seed="s53v2" stars={54} grid horizon />

          {/* 档案墙：60 格线框密度底纹 cascade（由疏到密——低亮度，0–50） */}
          {Array.from({ length: 60 }).map((_, i) => {
            const col = i % 12;
            const row = Math.floor(i / 12);
            const land = 2 + (row * 12 + col) * 0.8;
            const on = frame >= land;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: 110 + col * 143,
                  top: 210 + row * 128 - (on ? 0 : 160),
                  width: 130,
                  height: 112,
                  borderRadius: 4,
                  background: FILM_COLORS2.panel,
                  border: `1px solid ${FILM_COLORS2.line}`,
                  opacity: on ? 0.1 + random(`s53-${i}`) * 0.22 : 0,
                  transform: on ? `rotate(${(random(`s53-r-${i}`) - 0.5) * 2}deg)` : 'none',
                }}
              />
            );
          })}

          {/* 归档微缩件（14 springIn）：3×3 抽屉格 = 266 次循环的收纳本体 */}
          <div style={{ position: 'absolute', left: 220, top: 390, opacity: Math.min(1, archP * 1.5), transform: `translateY(${(1 - archP) * -26}px) scale(${0.9 + archP * 0.1})` }}>
            <div style={{ width: 174, height: 150, borderRadius: 8, border: `1px solid ${FILM_COLORS2.dataDim}`, background: FILM_COLORS2.panel, boxShadow: `0 0 22px rgba(212,163,115,0.14), 0 14px 36px rgba(0,0,0,0.5)`, padding: 9, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 7 }}>
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} style={{ borderRadius: 3, border: `1px solid ${FILM_COLORS2.line}`, background: `rgba(212,163,115,${0.05 + (i % 3) * 0.03})`, position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '50%', top: '50%', width: 14, height: 3, marginLeft: -7, marginTop: -1.5, borderRadius: 1.5, background: FILM_COLORS2.dataDim, opacity: 0.8 }} />
                </div>
              ))}
            </div>
            <div style={{ marginTop: 10, textAlign: 'center', fontFamily: fontFamilies.mono, fontSize: 13, letterSpacing: '0.22em', color: FILM_COLORS2.textMuted, opacity: interpolate(frame, [18, 26], [0, 0.85], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>ARCHIVES · 归档墙</div>
          </div>

          {/* 知识卡微缩件（30/38 springIn 两枚错峰扇开）= 40 张卡的实体 */}
          <div style={{ position: 'absolute', left: 1400, top: 380, width: 300, height: 190 }}>
            <div style={{ position: 'absolute', left: 0, top: 24, opacity: Math.min(1, cardA * 1.5), transform: `translateY(${(1 - cardA) * -24}px) rotate(${-5 + (1 - cardA) * -6}deg)` }}>
              <MiniCard seed="a" />
            </div>
            <div style={{ position: 'absolute', left: 58, top: 58, opacity: Math.min(1, cardB * 1.5), transform: `translateY(${(1 - cardB) * -24}px) rotate(${4 + (1 - cardB) * 7}deg)` }}>
              <MiniCard seed="b" />
            </div>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 176, textAlign: 'center', fontFamily: fontFamilies.mono, fontSize: 13, letterSpacing: '0.22em', color: FILM_COLORS2.textMuted, opacity: interpolate(frame, [44, 52], [0, 0.85], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>KNOWLEDGE CARDS</div>
          </div>

          {/* ★DAT-03 双数同滚同停（全屏大字主角，落定 SLAM 辉光 + scale 1.05→1） */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 60, textAlign: 'center', zIndex: 30, transform: `scale(${slam.slam})`, ...glowText(FILM_COLORS2.data, frame >= SLAM_AT + SLAM_DUR ? landGlow : 0.3) }}>
            <span style={{ fontFamily: fontFamilies.mono, fontSize: 200, fontWeight: 700, color: FILM_COLORS2.data, fontVariantNumeric: 'tabular-nums' }}>{fmtNum(slam.va)}</span>
            <span style={{ fontFamily: fontFamilies.mono, fontSize: 90, color: FILM_COLORS2.textMuted }}> / </span>
            <span style={{ fontFamily: fontFamilies.mono, fontSize: 200, fontWeight: 700, color: FILM_COLORS2.data, fontVariantNumeric: 'tabular-nums' }}>{fmtNum(slam.vb)}</span>
          </div>

          {/* 落定瞬间（68）：暖金双环 + 金粒 */}
          {frame >= SLAM_AT + SLAM_DUR ? (
            <div style={{ position: 'absolute', left: '50%', top: 160, width: 0, height: 0, zIndex: 31, pointerEvents: 'none' }}>
              {wave ? <div style={wave.ring1} /> : null}
              {wave ? <div style={wave.ring2} /> : null}
              {burst.map((p, i) => (
                <div key={i} style={p.style} />
              ))}
            </div>
          ) : null}
        </AbsoluteFill>
      </CameraRig>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 300, backgroundImage: `linear-gradient(180deg, transparent, ${FILM_COLORS2.spaceDeep})`, opacity: 0.22 }} />
      <HudChrome label="wuh.site · KNOWLEDGE" readout={frame >= SLAM_AT + SLAM_DUR ? '266 LOOPS · 40 CARDS' : 'ROLLING…'} />
      <Grade2 id="GR2-08" />
      <Caption text="266 次完整循环，40 张知识卡片。" appearAt={14} />
    </AbsoluteFill>
  );
};

/* 知识卡微缩件：题名点 + 两行墨条（纯排版） */
const MiniCard: FC<{ seed: string }> = ({ seed }) => (
  <div style={{ width: 200, height: 108, borderRadius: 8, border: `1px solid ${FILM_COLORS2.dataDim}`, background: FILM_COLORS2.panel, boxShadow: `0 0 20px rgba(212,163,115,0.14), 0 12px 30px rgba(0,0,0,0.5)`, padding: '16px 18px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 10, height: 10, borderRadius: 5, background: FILM_COLORS2.data }} />
      <div style={{ width: 92, height: 7, borderRadius: 3.5, background: FILM_COLORS2.dataDim, opacity: 0.7 }} />
    </div>
    <div style={{ marginTop: 14, width: 150, height: 6, borderRadius: 3, background: FILM_COLORS2.line }} />
    <div style={{ marginTop: 9, width: 118, height: 6, borderRadius: 3, background: FILM_COLORS2.line, opacity: 0.7 }} />
    <div style={{ marginTop: 16, fontFamily: fontFamilies.mono, fontSize: 11, letterSpacing: '0.14em', color: FILM_COLORS2.textMuted, opacity: 0.8 }}>{`loop #${Math.floor(random(`s53-card-${seed}`) * 266) + 1}`}</div>
  </div>
);

export default S53;
