/* S56 · Act 8 此刻 · 局部帧 [0,154) · 154f · 绝对 7458–7612
 *
 * V2 深空数据流重构（2026-11-11）：方法枝 shadow-dev-workflow 琥珀墨线生长
 * （10–54 原窗口，辉光双层描边）；标签改线框数据卡（24 落位即现，标识不滚）：
 * 2026-06-27 · 290 commits · v7.4.0 · 13 技能；五阶段闭环 propose→apply→
 * review→release→归档 线框芯片依次点亮（24–120 原窗口，琥珀边+微辉光）；
 * 镜头驻定树侧（locked）。转场：入「切」，出「切」。
 * 字幕安全窗：start≥12、end≤142。
 * 尾帧：枝 2 五阶段全亮。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES, writeFade } from '../../../brand/motion';
import { FILM_COLORS2, glowText, treeGrow } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 154;
const STAGES = ['propose', 'apply', 'review', 'release', '归档'];
/** 枝 2（真长度由 evolvePath 计算，不再猜 1100） */
const B2_D = 'M 880 700 C 1060 700 1240 720 1420 700';

/** 树骨架（承接 s55；已生长态常驻，琥珀墨） */
const TreeTrunk: FC = () => (
  <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
    <path d="M 910 520 C 900 640 880 760 850 880" fill="none" stroke="rgba(212,163,115,0.16)" strokeWidth={18} />
    <path d="M 910 520 C 900 640 880 760 850 880" fill="none" stroke={FILM_COLORS2.data} strokeWidth={9} opacity={0.92} />
    <path d="M 880 660 C 700 620 520 600 300 620" fill="none" stroke="rgba(212,163,115,0.14)" strokeWidth={12} />
    <path d="M 880 660 C 700 620 520 600 300 620" fill="none" stroke={FILM_COLORS2.data} strokeWidth={4.5} opacity={0.88} />
  </svg>
);

const S56: FC = () => {
  const frame = useCurrentFrame();
  // 枝 2 生长（向右横出，10–54）
  const b2 = treeGrow(frame, 10, 44, B2_D);
  const cam = { scale: 1.03, x: interpolate(frame, [0, TOTAL], [40, -10], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }), y: 0, rot: 0 };

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DeepSpace seed="s56v2" stars={52} grid horizon />
          <TreeTrunk />
          {/* 枝 2 生长（琥珀墨线） */}
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <path d={B2_D} fill="none" stroke="rgba(212,163,115,0.14)" strokeWidth={12} {...b2.stroke} />
            <path d={B2_D} fill="none" stroke={FILM_COLORS2.data} strokeWidth={4.5} {...b2.stroke} opacity={0.88} />
          </svg>

          {/* 枝 2 标签卡（落位即现，线框数据卡） */}
          <div style={{ position: 'absolute', left: 640, top: 560, ...writeFade(frame, 24) }}>
            <div
              style={{
                background: FILM_COLORS2.panel,
                border: `1px solid ${FILM_COLORS2.dataDim}`,
                borderRadius: 8,
                padding: '20px 28px',
                boxShadow: `0 0 26px rgba(212,163,115,0.16), 0 16px 44px rgba(0,0,0,0.55)`,
              }}
            >
              <div style={{ fontFamily: fontFamilies.mono, fontSize: 23, color: FILM_COLORS2.paperWhite, ...glowText(FILM_COLORS2.data, 0.2) }}>shadow-dev-workflow</div>
              <div style={{ fontFamily: fontFamilies.mono, fontSize: 16, color: FILM_COLORS2.textMuted, marginTop: 8 }}>2026-06-27 · 290 commits · v7.4.0 · 13 技能</div>
            </div>
          </div>

          {/* 五阶段闭环依次点亮（24–120，线框芯片） */}
          <div style={{ position: 'absolute', left: 480, top: 720, display: 'flex', gap: 34, zIndex: 30 }}>
            {STAGES.map((s, i) => {
              const lit = interpolate(frame, [24 + i * 19, 34 + i * 19], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
              return (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 34 }}>
                  <div style={{ textAlign: 'center', opacity: 0.3 + lit * 0.7 }}>
                    <div
                      style={{
                        width: 130,
                        height: 56,
                        borderRadius: 6,
                        border: `1px solid ${lit > 0.5 ? FILM_COLORS2.dataDim : FILM_COLORS2.line}`,
                        background: `rgba(212,163,115,${lit * 0.12})`,
                        boxShadow: lit > 0.5 ? `0 0 ${8 + lit * 12}px rgba(212,163,115,${0.14 * lit})` : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <span style={{ fontFamily: fontFamilies.mono, fontSize: 20, color: FILM_COLORS2.paperWhite, opacity: 0.9 }}>{s}</span>
                    </div>
                  </div>
                  {i < 4 ? <span style={{ fontFamily: fontFamilies.mono, fontSize: 20, color: FILM_COLORS2.dataDim, opacity: lit * 0.8 }}>→</span> : null}
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      </CameraRig>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 300, backgroundImage: `linear-gradient(180deg, transparent, ${FILM_COLORS2.spaceDeep})`, opacity: 0.2 }} />
      <HudChrome label="wuh.site · GRAPH" readout="BRANCH 2 · WORKFLOW" />
      <Grade2 id="GR2-08" />
      <Caption text="它长出一套方法：propose → apply → review → release → 归档。" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S56;
