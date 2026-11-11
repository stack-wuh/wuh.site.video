/* S59 · Act 8 此刻 · 局部帧 [0,114) · 114f · 绝对 7850–7964
 *
 * V2 深空数据流重构（2026-11-11）：影像枝 wuh.site.video 琥珀墨线生长
 * （6–32 原窗口）；标签改线框数据卡（12 落位即现，标识不滚）：
 * 2026-10-24 · 234 commits；枝上三枚小签《朝朝如念》4:00 / intro v2 4:46 /
 * 《风陵·致郭襄》4:52 改线框数据芯片先后落位（画面文字，24/44/64 原节奏）；
 * 枝尖一格胶片框亮起（74–96 原窗口，琥珀辉光）——本片的制作现场反向照进画面；
 * 末段全树辉光渐起（交接态：全树+胶片光最亮）。转场：入「切」，出「切」。
 * 字幕安全窗：start≥12、end≤102。
 * 尾帧：五枝全树成形、枝 5 胶片光最亮。
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

const TOTAL = 114;
const FILMS = [
  { name: '朝朝如念', dur: '4:00' },
  { name: 'intro v2', dur: '4:46' },
  { name: '风陵·致郭襄', dur: '4:52' },
];
/** 枝 5（真长度由 evolvePath 计算，不再猜 700） */
const B5_D = 'M 905 560 C 1010 470 1130 420 1300 400';

const S59: FC = () => {
  const frame = useCurrentFrame();
  const b5 = treeGrow(frame, 6, 32, B5_D);
  const cam = { scale: 1.04, x: interpolate(frame, [0, TOTAL], [10, -60], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }), y: 0, rot: 0 };
  const filmGlow = interpolate(frame, [74, 96], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  /* 末段全树辉光渐起（交接态：全树+胶片光） */
  const treeGlow = interpolate(frame, [96, TOTAL], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DeepSpace seed="s59v2" stars={52} grid horizon />
          {/* 全树常驻（琥珀墨）+ 枝 5（最右，生长） */}
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <path d="M 910 520 C 900 640 880 760 850 880" fill="none" stroke="rgba(212,163,115,0.16)" strokeWidth={18} />
            <path d="M 910 520 C 900 640 880 760 850 880" fill="none" stroke={FILM_COLORS2.data} strokeWidth={9} opacity={0.92} />
            <path d="M 880 660 C 700 620 520 600 300 620" fill="none" stroke="rgba(212,163,115,0.14)" strokeWidth={12} />
            <path d="M 880 660 C 700 620 520 600 300 620" fill="none" stroke={FILM_COLORS2.data} strokeWidth={4.5} opacity={0.88} />
            <path d="M 880 700 C 1060 700 1240 720 1420 700" fill="none" stroke="rgba(212,163,115,0.14)" strokeWidth={12} />
            <path d="M 880 700 C 1060 700 1240 720 1420 700" fill="none" stroke={FILM_COLORS2.data} strokeWidth={4.5} opacity={0.88} />
            <path d="M 890 620 C 980 520 1090 460 1230 430" fill="none" stroke="rgba(212,163,115,0.14)" strokeWidth={11} />
            <path d="M 890 620 C 980 520 1090 460 1230 430" fill="none" stroke={FILM_COLORS2.data} strokeWidth={4} opacity={0.88} />
            <path d="M 895 600 C 830 520 760 470 640 445" fill="none" stroke="rgba(212,163,115,0.14)" strokeWidth={11} />
            <path d="M 895 600 C 830 520 760 470 640 445" fill="none" stroke={FILM_COLORS2.data} strokeWidth={4} opacity={0.88} />
            <path d={B5_D} fill="none" stroke="rgba(212,163,115,0.14)" strokeWidth={11} {...b5.stroke} />
            <path d={B5_D} fill="none" stroke={FILM_COLORS2.data} strokeWidth={4} {...b5.stroke} opacity={0.88} />
          </svg>

          {/* 枝 5 标签卡（线框数据卡） */}
          <div style={{ position: 'absolute', left: 890, top: 300, ...writeFade(frame, 12) }}>
            <div
              style={{
                background: FILM_COLORS2.panel,
                border: `1px solid ${FILM_COLORS2.dataDim}`,
                borderRadius: 8,
                padding: '18px 26px',
                boxShadow: `0 0 26px rgba(212,163,115,0.16), 0 16px 44px rgba(0,0,0,0.55)`,
              }}
            >
              <div style={{ fontFamily: fontFamilies.mono, fontSize: 22, color: FILM_COLORS2.paperWhite, ...glowText(FILM_COLORS2.data, 0.2) }}>wuh.site.video</div>
              <div style={{ fontFamily: fontFamilies.mono, fontSize: 15, color: FILM_COLORS2.textMuted, marginTop: 8 }}>2026-10-24 · 234 commits</div>
            </div>
          </div>

          {/* 三枚小签先后落位（画面文字，线框数据芯片） */}
          {FILMS.map((f, i) => {
            const t0 = 24 + i * 20;
            return (
              <div key={f.name} style={{ position: 'absolute', left: 1120 + i * 24, top: 470 + i * 54, ...writeFade(frame, t0) }}>
                <span
                  style={{
                    fontFamily: fontFamilies.serif,
                    fontSize: 21,
                    color: FILM_COLORS2.paperWhite,
                    opacity: 0.9,
                    border: `1px solid ${FILM_COLORS2.line}`,
                    padding: '6px 16px',
                    borderRadius: 4,
                    background: FILM_COLORS2.panel,
                    boxShadow: `0 0 14px rgba(212,163,115,0.12)`,
                  }}
                >
                  《{f.name}》 {f.dur}
                </span>
              </div>
            );
          })}

          {/* 枝尖胶片框亮起（74–96，即停；琥珀辉光） */}
          <div style={{ position: 'absolute', left: 1420, top: 300, width: 190, height: 130, opacity: filmGlow }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 6, border: `2px solid ${FILM_COLORS2.gold}`, boxShadow: `0 0 ${24 * filmGlow}px ${8 * filmGlow}px rgba(212,163,115,${0.3 * filmGlow})` }} />
            <div style={{ position: 'absolute', left: 14, right: 14, top: 14, bottom: 14, background: `repeating-linear-gradient(0deg, rgba(233,217,174,0.28) 0 6px, transparent 6px 16px)` }} />
          </div>

          {/* 末段全树辉光渐起（交接态：全树+胶片光最亮） */}
          <AbsoluteFill style={{ background: `radial-gradient(ellipse 62% 52% at 50% 52%, rgba(212,163,115,0.1), transparent 70%)`, opacity: treeGlow, pointerEvents: 'none' }} />
        </AbsoluteFill>
      </CameraRig>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 300, backgroundImage: `linear-gradient(180deg, transparent, ${FILM_COLORS2.spaceDeep})`, opacity: 0.2 }} />
      <HudChrome label="wuh.site · GRAPH" readout="BRANCH 5 · VIDEO" />
      <Grade2 id="GR2-08" />
      <Caption text="最后是一间视频工作室——三部长片之后，这部片子也是它做的。" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S59;
