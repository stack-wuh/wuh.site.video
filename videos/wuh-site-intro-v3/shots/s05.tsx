/* S05 · Act 1 墨点 · 局部帧 [0,138) · 138f · 绝对 582–720
 *
 * 人物登场（无自我介绍，身份由资料自然流露）：
 *   ① 列表收拢成暖纸（0–22，上镜窗内列表反向淡出）；
 *   ② About 小资料卡浮起（38–58）：GitHub 真头像 @stack-wuh（圆形低饱和）、
 *      资料行「68 public repos」、bio「a boy just ~」、城市深圳；
 *   ③ ★DAT-01「68」微滚（58–78，落定 78=绝对 660=拍33 静默；量滚、bio/城市标识落位即现）；
 *   ④ 右缘纸缝微掀（118–138，透 2021 暖光——下一镜的入口）。
 * 转场：入「切」，出「切」。无字幕（留白）。
 */
import type { FC } from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from 'remotion';
import { staticFile } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, writeFade } from '../../../brand/motion';
import { numRoll, ROLL_DUR } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const TOTAL = 138;

const S05: FC = () => {
  const frame = useCurrentFrame();
  // 列表收拢成暖纸（0–22）：窗内列表淡出，纸面占满
  const listOut = interpolate(frame, [0, 22], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn });
  // 资料卡浮起（38–58）
  const cardRise = interpolate(frame, [38, 58], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  // ★DAT-01 微滚「68」（58–78 落定）
  const repos = Math.round(numRoll(frame, 58, ROLL_DUR.micro, 0, 68));
  const cam = {
    scale: interpolate(frame, [0, TOTAL], [1.02, 1.045], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    x: 0,
    y: 0,
    rot: 0,
  };
  // 右缘纸缝微掀（118–138）：一道缝光透出 2021 暖调
  const seam = interpolate(frame, [118, TOTAL], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });

  return (
    <AbsoluteFill style={{ background: colors.paper }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DustField act={1} count={20} seedBase="s05" />

          {/* 上镜列表残影收拢 */}
          {frame < 22 ? (
            <div style={{ position: 'absolute', left: 200, right: 200, top: 160, opacity: listOut }}>
              {[0, 1, 2, 3].map((i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 44, transform: `translateY(${(1 - listOut) * -8}px)` }}>
                  <div style={{ width: 10, height: 10, borderRadius: 5, background: colors.accent, opacity: 0.7 }} />
                  <div style={{ width: 700 - i * 80, height: 16, background: colors.ink, opacity: 0.32 }} />
                </div>
              ))}
            </div>
          ) : null}

          {/* About 资料卡（浮起 20f 后凝住） */}
          <div style={{ position: 'absolute', left: 610, top: 210, width: 700, height: 500, opacity: cardRise, transform: `translateY(${(1 - cardRise) * 20}px)` }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 8, background: colors.paperDeep, border: `1px solid ${colors.paperMuted}`, boxShadow: '0 18px 44px rgba(0,0,0,0.16)' }} />
            {/* GitHub 真头像（圆形低饱和） */}
            <div style={{ position: 'absolute', left: 50, top: 50, width: 130, height: 130, borderRadius: 65, overflow: 'hidden', border: `1px solid ${colors.paperMuted}`, filter: 'saturate(0.55)' }}>
              <Img src={staticFile('wuh-site-intro-v3/avatar.png')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ position: 'absolute', left: 210, top: 66, ...writeFade(frame, 62) }}>
              <div style={{ fontFamily: fontFamilies.serif, fontSize: 40, color: colors.ink }}>stack-wuh</div>
              <div style={{ fontFamily: fontFamilies.mono, fontSize: 17, color: colors.muted, marginTop: 8 }}>ShenZhen, GuangDong, China</div>
            </div>
            {/* ★DAT-01 资料行：68 public repos（微滚，落定 78 静默） */}
            <div style={{ position: 'absolute', left: 50, top: 240, ...writeFade(frame, 66) }}>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 34, color: colors.ink, fontVariantNumeric: 'tabular-nums' }}>{repos}</span>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 22, color: colors.muted }}> public repos</span>
            </div>
            {/* bio（标识，write-fade 落位即现） */}
            <div style={{ position: 'absolute', left: 50, top: 310, ...writeFade(frame, 78) }}>
              <span style={{ fontFamily: fontFamilies.serif, fontSize: 30, color: colors.ink, opacity: 0.85 }}>a boy just ~</span>
            </div>
            <div style={{ position: 'absolute', left: 50, right: 50, top: 380, height: 1, background: colors.muted, opacity: 0.35 }} />
            <div style={{ position: 'absolute', left: 50, top: 408, ...writeFade(frame, 88) }}>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 16, color: colors.muted, letterSpacing: '0.14em' }}>GITHUB · @STACK-WUH</span>
            </div>
          </div>

          {/* 右缘纸缝微掀（118–138，透 2021 暖光） */}
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: 120,
              backgroundImage: `linear-gradient(270deg, ${FILM_COLORS.dawnLight}, transparent)`,
              opacity: seam * 0.85,
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: 100,
              top: 0,
              bottom: 0,
              width: 3,
              background: colors.paperDeep,
              opacity: seam * 0.9,
              transform: `perspective(1200px) rotateY(${seam * -2.4}deg)`,
              transformOrigin: 'right center',
              pointerEvents: 'none',
            }}
          />
        </AbsoluteFill>
      </CameraRig>
      <PaperGrain opacity={0.06} />
      <Grade id="GR-02" />
    </AbsoluteFill>
  );
};

export default S05;
