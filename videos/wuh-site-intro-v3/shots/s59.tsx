/* S59 · Act 8 此刻 · 局部帧 [0,114) · 114f · 绝对 7850–7964
 *
 * 影像枝：wuh.site.video（2026-10-24 · 234 commits，标签落位即现）；
 * 枝上三枚小签《朝朝如念》4:00 / intro v2 4:46 /《风陵·致郭襄》4:52 先后落位
 * （画面文字，24/44/64）；枝尖一格胶片框亮起（74–96）——本片的制作现场
 * 反向照进画面。转场：入「切」，出「切」。字幕安全窗：start≥12、end≤102。
 * 尾帧：五枝全树成形、枝 5 胶片光最亮。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, writeFade } from '../../../brand/motion';
import { treeGrow } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const TOTAL = 114;
const FILMS = [
  { name: '朝朝如念', dur: '4:00' },
  { name: 'intro v2', dur: '4:46' },
  { name: '风陵·致郭襄', dur: '4:52' },
];

const S59: FC = () => {
  const frame = useCurrentFrame();
  const b5 = treeGrow(frame, 6, 32, 700);
  const cam = { scale: 1.04, x: interpolate(frame, [0, TOTAL], [10, -60], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }), y: 0, rot: 0 };
  const filmGlow = interpolate(frame, [74, 96], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DustField act={8} count={12} seedBase="s59" />
          {/* 全树常驻 + 枝 5（最右） */}
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <path d="M 910 520 C 900 640 880 760 850 880" fill="none" stroke={colors.ink} strokeWidth={10} opacity={0.9} />
            <path d="M 880 660 C 700 620 520 600 300 620" fill="none" stroke={colors.ink} strokeWidth={5} opacity={0.85} />
            <path d="M 880 700 C 1060 700 1240 720 1420 700" fill="none" stroke={colors.ink} strokeWidth={5} opacity={0.85} />
            <path d="M 890 620 C 980 520 1090 460 1230 430" fill="none" stroke={colors.ink} strokeWidth={4.5} opacity={0.85} />
            <path d="M 895 600 C 830 520 760 470 640 445" fill="none" stroke={colors.ink} strokeWidth={4.5} opacity={0.85} />
            <path d="M 905 560 C 1010 470 1130 420 1300 400" fill="none" stroke={colors.ink} strokeWidth={4.5} strokeDasharray={700} strokeDashoffset={b5.dashoffset} opacity={0.85} />
          </svg>

          {/* 枝 5 标签卡 */}
          <div style={{ position: 'absolute', left: 890, top: 300, ...writeFade(frame, 12) }}>
            <div style={{ background: colors.paper, border: `1px solid ${colors.gold}`, borderRadius: 8, padding: '18px 26px', boxShadow: '0 16px 44px rgba(0,0,0,0.35)' }}>
              <div style={{ fontFamily: fontFamilies.mono, fontSize: 22, color: colors.ink }}>wuh.site.video</div>
              <div style={{ fontFamily: fontFamilies.mono, fontSize: 15, color: colors.muted, marginTop: 8 }}>2026-10-24 · 234 commits</div>
            </div>
          </div>

          {/* 三枚小签先后落位（画面文字） */}
          {FILMS.map((f, i) => {
            const t0 = 24 + i * 20;
            return (
              <div key={f.name} style={{ position: 'absolute', left: 1120 + i * 24, top: 470 + i * 54, ...writeFade(frame, t0) }}>
                <span style={{ fontFamily: fontFamilies.serif, fontSize: 21, color: colors.paper, opacity: 0.9, border: `1px solid ${colors.hairline}`, padding: '6px 16px', borderRadius: 4, background: colors.terminalBg }}>
                  《{f.name}》 {f.dur}
                </span>
              </div>
            );
          })}

          {/* 枝尖胶片框亮起（74–96，即停） */}
          <div style={{ position: 'absolute', left: 1420, top: 300, width: 190, height: 130, opacity: filmGlow }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 6, border: `2px solid ${colors.gold}`, boxShadow: `0 0 ${24 * filmGlow}px ${8 * filmGlow}px rgba(245,233,200,${0.25 * filmGlow})` }} />
            <div style={{ position: 'absolute', left: 14, right: 14, top: 14, bottom: 14, background: `repeating-linear-gradient(0deg, rgba(245,233,200,0.28) 0 6px, transparent 6px 16px)` }} />
          </div>
        </AbsoluteFill>
      </CameraRig>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 300, backgroundImage: `linear-gradient(180deg, transparent, ${colors.bg})`, opacity: 0.2 }} />
      <PaperGrain opacity={0.06} />
      <Grade id="GR-08" />
      <Caption text="最后是一间视频工作室——三部长片之后，这部片子也是它做的。" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S59;
