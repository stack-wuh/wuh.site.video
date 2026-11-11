/* S05 · Act 1 墨点 · 局部帧 [0,138) · 138f · 绝对 582–720
 * V2 暖黑数据流（2026-11-11 风格重构）：「暖纸资料卡」改写为「About HUD 资料面板」——
 * ① 上镜列表残影收拢（0–22 原窗，琥珀数据行反向淡出）；
 * ② About 线框面板浮起（38–58）：GitHub 真头像（圆形低饱和 + 琥珀描边环）、
 *    @stack-wuh / 深圳 / bio「a boy just ~」；
 * ③ ★DAT-01「68」微滚主角化（58–78 落定 78=绝对 660=拍33 静默；bigNum 辉光 SLAM；
 *    bio/城市标识落位即现，量滚标识不滚）；
 * ④ 右缘数据流光微启（118–138，透出 2021——下一幕入口）。
 * 转场：入「切」出「切」。无字幕（留白）。
 */
import type { FC } from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from 'remotion';
import { staticFile } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES, writeFade } from '../../../brand/motion';
import { FILM_COLORS2, ROLL_DUR, bigNum, glowText } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 138;

const S05: FC = () => {
  const frame = useCurrentFrame();
  // 上镜列表残影收拢（0–22）：数据行淡出
  const listOut = interpolate(frame, [0, 22], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn });
  // 资料面板浮起（38–58）
  const cardRise = interpolate(frame, [38, 58], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  // ★DAT-01 微滚「68」（58–78 落定=拍33 静默；bigNum 辉光 SLAM）
  const repos = bigNum(frame, 58, ROLL_DUR.micro, 0, 68);
  const cam = {
    scale: interpolate(frame, [0, TOTAL], [1.02, 1.045], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    x: 0,
    y: 0,
    rot: 0,
  };
  // 右缘数据流光微启（118–138）：透出 2021
  const seam = interpolate(frame, [118, TOTAL], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s05v2" stars={44} grid />
      <CameraRig cam={cam}>
        <AbsoluteFill>
          {/* 上镜列表残影收拢（0–22） */}
          {frame < 22 ? (
            <div style={{ position: 'absolute', left: 200, right: 200, top: 160, opacity: listOut }}>
              {[0, 1, 2, 3].map((i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 44, transform: `translateY(${(1 - listOut) * -8}px)` }}>
                  <div style={{ width: 10, height: 10, borderRadius: 5, background: FILM_COLORS2.data, opacity: 0.6, boxShadow: `0 0 8px rgba(212,163,115,0.4)` }} />
                  <div style={{ width: 700 - i * 80, height: 14, background: FILM_COLORS2.paperWhite, opacity: 0.22 }} />
                </div>
              ))}
            </div>
          ) : null}

          {/* About HUD 资料面板（浮起 20f 后凝住） */}
          <div style={{ position: 'absolute', left: 610, top: 210, width: 700, height: 500, opacity: cardRise, transform: `translateY(${(1 - cardRise) * 20}px)` }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 10, background: FILM_COLORS2.panel, border: `1px solid ${FILM_COLORS2.line}`, boxShadow: `0 0 34px rgba(212,163,115,0.12), 0 24px 54px rgba(0,0,0,0.55)` }} />
            {/* GitHub 真头像（圆形低饱和 + 琥珀描边环） */}
            <div style={{ position: 'absolute', left: 50, top: 50, width: 130, height: 130, borderRadius: 65, overflow: 'hidden', border: `1px solid ${FILM_COLORS2.dataDim}`, boxShadow: `0 0 18px rgba(212,163,115,0.28)`, filter: 'saturate(0.55)' }}>
              <Img src={staticFile('wuh-site-intro-v3/avatar.png')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ position: 'absolute', left: 210, top: 66, ...writeFade(frame, 62) }}>
              <div style={{ fontFamily: fontFamilies.serif, fontSize: 42, color: FILM_COLORS2.paperWhite, ...glowText(FILM_COLORS2.paperWhite, 0.28) }}>stack-wuh</div>
              <div style={{ fontFamily: fontFamilies.mono, fontSize: 16, color: FILM_COLORS2.textMuted, marginTop: 10, letterSpacing: '0.08em' }}>ShenZhen, GuangDong, China</div>
            </div>
            {/* ★DAT-01 资料行：68 public repos（微滚主角，落定 78 静默） */}
            <div style={{ position: 'absolute', left: 50, top: 238, display: 'flex', alignItems: 'baseline', gap: 16, ...writeFade(frame, 66) }}>
              <span
                style={{
                  fontFamily: fontFamilies.mono,
                  fontSize: 62,
                  fontWeight: 700,
                  color: FILM_COLORS2.data,
                  fontVariantNumeric: 'tabular-nums',
                  display: 'inline-block',
                  transform: `scale(${repos.slam})`,
                  ...glowText(FILM_COLORS2.data, repos.glow),
                }}
              >
                {repos.text}
              </span>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 20, color: FILM_COLORS2.textMuted, letterSpacing: '0.1em' }}>public repos</span>
            </div>
            {/* bio（标识，write-fade 落位即现） */}
            <div style={{ position: 'absolute', left: 50, top: 330, ...writeFade(frame, 78) }}>
              <span style={{ fontFamily: fontFamilies.serif, fontSize: 30, color: FILM_COLORS2.paperWhite, opacity: 0.85 }}>a boy just ~</span>
            </div>
            <div style={{ position: 'absolute', left: 50, right: 50, top: 392, height: 1, background: FILM_COLORS2.line, opacity: 0.7 }} />
            <div style={{ position: 'absolute', left: 50, top: 418, ...writeFade(frame, 88) }}>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 15, color: FILM_COLORS2.textMuted, letterSpacing: '0.2em' }}>GITHUB · @STACK-WUH</span>
            </div>
          </div>

          {/* 右缘数据流光微启（118–138，透出 2021——下一幕入口） */}
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: 130,
              backgroundImage: `linear-gradient(270deg, rgba(212,163,115,0.4), transparent)`,
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
              width: 2,
              background: FILM_COLORS2.data,
              opacity: seam * 0.5,
              boxShadow: `0 0 14px 3px rgba(212,163,115,0.4)`,
              pointerEvents: 'none',
            }}
          />
          <div style={{ position: 'absolute', right: 132, top: 548, ...writeFade(frame, 124) }}>
            <span style={{ fontFamily: fontFamilies.mono, fontSize: 17, letterSpacing: '0.3em', color: FILM_COLORS2.data, opacity: seam * 0.9, fontVariantNumeric: 'tabular-nums' }}>2021 →</span>
          </div>
        </AbsoluteFill>
      </CameraRig>
      <HudChrome label="wuh.site · PROFILE" readout="@stack-wuh · SZ" />
      <Grade2 id="GR2-02" />
    </AbsoluteFill>
  );
};

export default S05;
