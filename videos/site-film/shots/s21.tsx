/* 镜 21 · Act 4 产品巡礼 · 全局帧 [3380,3480) · 100f */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { ANCHORS, CURVES, GRADES, SPRINGS, inkRise, numRoll } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DustField } from '../components/DustField';

const serif = fontFamilies.serif;
const mono = fontFamilies.mono;

const fade = (f: number, at: number) =>
  interpolate(f, [at, at + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/* 点赞急推：6 圆钮 cascade（原幕局部 580–620 → 镜局部 0–40），cam-rush 3440→3460 ×1.9（ANCHORS.rush21，cine-ease-in），
   3460 气泡 spring-pop + num-roll「已赞 N」，红心起光；出场 tr-heart-zoom 短变体（镜局部 80–100）
   （原 Act4 镜 21，幕局部 580–680 → 镜局部 0–100；const f = frame - 580 换算为 const f = frame） */
const ShotLike: FC = () => {
  const frame = useCurrentFrame();
  const grade = GRADES[3];
  const f = frame; // 0–100
  const rushFrom = ANCHORS.rush21.from - ANCHORS.act4 - 580; // 3440 − 2800 − 580 = 镜局部 60
  const rushTo = ANCHORS.rush21.to - ANCHORS.act4 - 580; // 3460 − 2800 − 580 = 镜局部 80
  const rush = interpolate(f, [rushFrom, rushTo], [1, ANCHORS.rush21.scale], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn });
  const pop = spring({ frame: f - 80, fps: 30, config: SPRINGS.springPop });
  const likes = Math.round(numRoll(f, 80, 25, 120, 128));
  const heartZoom = interpolate(f, [80, 100], [1, 4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineAccent });
  const heartBlur = interpolate(f, [84, 100], [0, 6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill>
      <DustField act={4} />
      <CameraRig cam={{ scale: rush, x: 0, y: 0, rot: 0, origin: '72% 64%' }}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ width: 760, marginTop: -60 }}>
            <p style={{ fontFamily: mono, fontSize: 16, color: colors.muted, letterSpacing: '0.1em', opacity: fade(f, 2) }}>LICENSE · 分享</p>
            <div style={{ display: 'flex', gap: 18, marginTop: 22 }}>
              {['微', 'Q', '豆', '云', '邮', 'R'].map((s, i) => (
                <div key={s} style={{ ...inkRise(f, 2 + i * 7), width: 52, height: 52, borderRadius: 26, background: colors.bgLift, border: `1px solid ${colors.hairline}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: serif, fontSize: 22, color: colors.paper }}>{s}</div>
              ))}
            </div>
            {/* 分享图悬浮落位（heavy-glide） */}
            <div style={{ width: 150, height: 96, borderRadius: 8, background: colors.paperDeep, marginTop: 34, transform: `rotate(-2deg) translateY(${(1 - spring({ frame: f - 40, fps: 30, config: SPRINGS.heavyGlide })) * -12}px)`, opacity: fade(f, 40) }} />
          </div>
          {/* 点赞浮钮 + 已赞气泡 */}
          <div style={{ position: 'absolute', left: '68%', top: '58%' }}>
            <div style={{ width: 88, height: 88, borderRadius: 44, background: colors.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${heartZoom})`, filter: `blur(${heartBlur}px)`, boxShadow: `0 0 ${46 * Math.max(0, pop)}px ${colors.accent}` }}>
              <span style={{ fontSize: 38, color: colors.bg }}>♥</span>
            </div>
            <div style={{ position: 'absolute', left: 104, top: -6, background: colors.paperDeep, borderRadius: 10, padding: '8px 16px', transformOrigin: 'left center', transform: `scale(${interpolate(pop, [0, 1], [0.6, 1])})`, opacity: Math.min(1, Math.max(0, pop)) }}>
              <span style={{ fontFamily: mono, fontSize: 18, color: colors.ink }}>已赞 {likes}</span>
            </div>
          </div>
        </AbsoluteFill>
        <p style={{ position: 'absolute', bottom: 100, width: '100%', textAlign: 'center', fontFamily: serif, fontSize: 36, color: colors.paper, opacity: fade(f, 18) * (1 - interpolate(f, [80, 96], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })) }}>点赞吧~</p>
      </CameraRig>
      {/* 幕级调色 overlay（原 Act4 全屏层分解入镜）：grade-warm-gold LUT + 雾光 */}
      <AbsoluteFill style={{ background: grade.lut.color, mixBlendMode: grade.lut.blend, opacity: grade.lut.opacity }} />
      <AbsoluteFill style={{ background: grade.veil.color, mixBlendMode: grade.veil.blend, opacity: grade.veil.opacity }} />
    </AbsoluteFill>
  );
};

export default ShotLike;
