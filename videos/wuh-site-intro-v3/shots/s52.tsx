/* S52 · Act 8 此刻 · 局部帧 [0,144) · 144f · 绝对 7048–7192
 *
 * V2 深空数据流重构（2026-11-11）：纸面退役，金句主角化——两段式 kinetic 大字
 * （前半 36、后半 86，writeFade 慢档 + 辉光，落定即凝住）；#172 成文信息改为
 * HUD 顶部 mono 读数行（6 起）；proposal → discuss → apply → review → archive
 * → commit 六阶段线框芯片横向排开缓慢左移（10–120 原窗口），60–110 沉为底纹
 * （spaceDeep 幕布压暗，金句之下不受影响）。
 * 转场：入「切」，出「切」。字幕安全窗：start≥12、end≤132。
 * 尾帧：金句占满主位、六阶段沉为底纹。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES, writeFade } from '../../../brand/motion';
import { FILM_COLORS2, glowText } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const STAGES = ['proposal', 'discuss', 'apply', 'review', 'archive', 'commit'];

const S52: FC = () => {
  const frame = useCurrentFrame();
  const beltX = interpolate(frame, [10, 120], [0, -260], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const dim = interpolate(frame, [60, 110], [0, 0.6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const cam = { scale: 1.03, x: 0, y: 0, rot: 0 };
  const half1 = writeFade(frame, 36, true);
  const half2 = writeFade(frame, 86, true);

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DeepSpace seed="s52v2" stars={54} grid />

          {/* #172 成文信息（HUD 读数行） */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center', zIndex: 30, ...writeFade(frame, 6) }}>
            <span style={{ fontFamily: fontFamilies.mono, fontSize: 17, letterSpacing: '0.34em', color: FILM_COLORS2.textMuted }}>#172 · VIBE CODING WORKFLOW · 2026-10-07</span>
            <div style={{ position: 'absolute', left: '50%', top: 40, width: 520, marginLeft: -260, height: 1, background: FILM_COLORS2.line, opacity: 0.6 }} />
          </div>

          {/* 六阶段线框芯片传送带 */}
          <div style={{ position: 'absolute', left: 380, top: 250, transform: `translateX(${beltX}px)`, display: 'flex', gap: 40 }}>
            {STAGES.map((s, i) => (
              <div key={s} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: 150,
                    height: 62,
                    borderRadius: 6,
                    border: `1px solid ${FILM_COLORS2.line}`,
                    background: FILM_COLORS2.panel,
                    boxShadow: `0 0 16px rgba(212,163,115,${0.08 + i * 0.014})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ fontFamily: fontFamilies.mono, fontSize: 20, color: FILM_COLORS2.paperWhite, opacity: 0.85 }}>{s}</span>
                </div>
                {i < 5 ? <span style={{ position: 'absolute', right: -33, top: 20, fontFamily: fontFamilies.mono, fontSize: 18, color: FILM_COLORS2.dataDim }}>→</span> : null}
              </div>
            ))}
          </div>

          {/* 六阶段沉为底纹（spaceDeep 幕布，金句之下） */}
          <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep, opacity: dim, pointerEvents: 'none', zIndex: 5 }} />

          {/* 金句两段式 kinetic 落定（主角，辉光大字） */}
          <div style={{ position: 'absolute', left: 120, right: 120, top: 430, textAlign: 'center', zIndex: 30 }}>
            <div style={{ ...half1, marginBottom: 24 }}>
              <span style={{ fontFamily: fontFamilies.serif, fontSize: 62, color: FILM_COLORS2.paperWhite, ...glowText(FILM_COLORS2.data, 0.4) }}>『工作流存在的意义不是当加速器，</span>
            </div>
            <div style={half2}>
              <span style={{ fontFamily: fontFamilies.serif, fontSize: 62, color: FILM_COLORS2.paperWhite, ...glowText(FILM_COLORS2.data, 0.4) }}>而是给 AI 装上边界和刹车。』</span>
            </div>
          </div>
        </AbsoluteFill>
      </CameraRig>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 300, backgroundImage: `linear-gradient(180deg, transparent, ${FILM_COLORS2.spaceDeep})`, opacity: 0.18 }} />
      <HudChrome label="wuh.site · WORKFLOW" readout="propose → commit" />
      <Grade2 id="GR2-08" />
      <Caption text="十月，他写道：『工作流存在的意义不是当加速器，而是给 AI 装上边界和刹车。』" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S52;
