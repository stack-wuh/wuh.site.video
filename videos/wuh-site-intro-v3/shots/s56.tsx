/* S56 · Act 8 此刻 · 局部帧 [0,154) · 154f · 绝对 7458–7612
 *
 * 方法枝：shadow-dev-workflow 生长（2026-06-27 · 290 commits · v7.4.0 · 13 技能，
 * 枝上标签落位即现，标识不滚）；五阶段闭环 propose→apply→review→release→归档
 * 依次点亮（24–120）；镜头驻定树侧（locked）。转场：入「切」，出「切」。
 * 字幕安全窗：start≥12、end≤142。
 * 尾帧：枝 2 五阶段全亮。
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

const TOTAL = 154;
const STAGES = ['propose', 'apply', 'review', 'release', '归档'];

/** 树骨架（承接 s55；已生长态常驻） */
const TreeTrunk: FC = () => (
  <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
    <path d="M 910 520 C 900 640 880 760 850 880" fill="none" stroke={colors.ink} strokeWidth={10} opacity={0.9} />
    <path d="M 880 660 C 700 620 520 600 300 620" fill="none" stroke={colors.ink} strokeWidth={5} opacity={0.85} />
  </svg>
);

const S56: FC = () => {
  const frame = useCurrentFrame();
  // 枝 2 生长（向右横出，10–54）
  const b2 = treeGrow(frame, 10, 44, 1100);
  const cam = { scale: 1.03, x: interpolate(frame, [0, TOTAL], [40, -10], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }), y: 0, rot: 0 };

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DustField act={8} count={12} seedBase="s56" />
          <TreeTrunk />
          {/* 枝 2 生长 */}
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <path d="M 880 700 C 1060 700 1240 720 1420 700" fill="none" stroke={colors.ink} strokeWidth={5} strokeDasharray={1100} strokeDashoffset={b2.dashoffset} opacity={0.85} />
          </svg>

          {/* 枝 2 标签卡（落位即现） */}
          <div style={{ position: 'absolute', left: 640, top: 560, ...writeFade(frame, 24) }}>
            <div style={{ background: colors.paper, border: `1px solid ${colors.gold}`, borderRadius: 8, padding: '20px 28px', boxShadow: '0 16px 44px rgba(0,0,0,0.35)' }}>
              <div style={{ fontFamily: fontFamilies.mono, fontSize: 23, color: colors.ink }}>shadow-dev-workflow</div>
              <div style={{ fontFamily: fontFamilies.mono, fontSize: 16, color: colors.muted, marginTop: 8 }}>2026-06-27 · 290 commits · v7.4.0 · 13 技能</div>
            </div>
          </div>

          {/* 五阶段闭环依次点亮（24–120） */}
          <div style={{ position: 'absolute', left: 480, top: 720, display: 'flex', gap: 34, zIndex: 30 }}>
            {STAGES.map((s, i) => {
              const on = frame >= 24 + i * 19;
              const lit = interpolate(frame, [24 + i * 19, 34 + i * 19], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
              return (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 34 }}>
                  <div style={{ textAlign: 'center', opacity: 0.3 + lit * 0.7 }}>
                    <div style={{ width: 130, height: 56, borderRadius: 6, border: `1px solid ${lit > 0.5 ? colors.gold : colors.hairline}`, background: `rgba(201,111,74,${lit * 0.14})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontFamily: fontFamilies.mono, fontSize: 20, color: colors.paper, opacity: 0.9 }}>{s}</span>
                    </div>
                  </div>
                  {i < 4 ? <span style={{ fontFamily: fontFamilies.mono, fontSize: 20, color: colors.muted, opacity: lit * 0.8 }}>→</span> : null}
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      </CameraRig>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 300, backgroundImage: `linear-gradient(180deg, transparent, ${colors.bg})`, opacity: 0.2 }} />
      <PaperGrain opacity={0.06} />
      <Grade id="GR-08" />
      <Caption text="它长出一套方法：propose → apply → review → release → 归档。" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S56;
