/* 镜 06 · Act 1 墨点 · 局部帧 [0,60) · 60f
   侧向跟移 60f（CM-07）；8–28f 双层 blur 拉焦（CM-13：Issue 列表→内容栏）；
   文章卡 0/10/20/30f 沿弧线飞入（FN-12，半拍一卡），40–60f 留 1 拍空。无字幕。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, cardFly } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DustField } from '../components/DustField';
import { PaperGrain } from '../components/PaperGrain';
import { Grade } from '../components/Grade';

const CARDS = [0, 1, 2, 3];

const ShotIssueFlow: FC = () => {
  const frame = useCurrentFrame();
  const pan = interpolate(frame, [0, 60], [30, -30], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const listBlur = interpolate(frame, [8, 28], [0, 5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const contentBlur = interpolate(frame, [8, 28], [5, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });

  return (
    <AbsoluteFill style={{ background: colors.paper }}>
      <CameraRig cam={{ scale: 1, x: pan, y: 0, rot: 0 }}>
        <AbsoluteFill>
          <DustField act={1} count={40} seedBase="s06" />
          {/* GitHub Issue 列表（前景，拉焦后虚化） */}
          <div
            style={{
              position: 'absolute',
              left: 150,
              top: 200,
              width: 520,
              height: 650,
              filter: `blur(${listBlur}px)`,
            }}
          >
            <div style={{ position: 'absolute', inset: 0, borderRadius: 6, background: colors.paper, border: `1px solid ${colors.paperMuted}` }} />
            <span style={{ position: 'absolute', left: 28, top: 28, fontFamily: fontFamilies.mono, fontSize: 26, color: colors.ink, opacity: 0.8 }}>Issues</span>
            <span style={{ position: 'absolute', right: 28, top: 32, fontFamily: fontFamilies.mono, fontSize: 16, color: colors.muted, opacity: 0.7, fontVariantNumeric: 'tabular-nums' }}>5</span>
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} style={{ position: 'absolute', left: 28, right: 28, top: 92 + i * 104, height: 78, borderBottom: `1px solid ${colors.paperMuted}` }}>
                <div style={{ position: 'absolute', left: 0, top: 10, width: 300 - i * 26, height: 9, background: colors.ink, opacity: 0.5 }} />
                <div style={{ position: 'absolute', left: 0, top: 36, width: 170, height: 6, background: colors.muted, opacity: 0.4 }} />
                <div style={{ position: 'absolute', right: 0, top: 12, width: 54, height: 18, borderRadius: 9, background: colors.gold, opacity: 0.35 }} />
              </div>
            ))}
          </div>
          {/* 内容栏（接收文章卡） */}
          <div
            style={{
              position: 'absolute',
              left: 760,
              top: 200,
              width: 820,
              height: 650,
              filter: `blur(${contentBlur}px)`,
            }}
          >
            <div style={{ position: 'absolute', inset: 0, borderRadius: 6, background: colors.paper, border: `1px solid ${colors.paperMuted}` }} />
            <div style={{ position: 'absolute', left: 40, right: 40, top: 28, height: 1, background: colors.muted, opacity: 0.3 }} />
            {CARDS.map((i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: 40,
                  top: 40 + i * 140,
                  width: 700,
                  height: 112,
                  ...cardFly(
                    frame,
                    i * 10,
                    10,
                    { x: -640, y: i % 2 === 0 ? -24 : 24, rot: -3 + i, scale: 0.94 },
                    { x: 0, y: 0, rot: 0, scale: 1 },
                  ),
                }}
              >
                <div style={{ position: 'absolute', inset: 0, borderRadius: 4, background: colors.paperDeep, border: `1px solid ${colors.paperMuted}` }} />
                <div style={{ position: 'absolute', left: 28, top: 30, width: 430 - i * 22, height: 12, background: colors.ink, opacity: 0.55 }} />
                <div style={{ position: 'absolute', left: 28, top: 62, width: 220, height: 7, background: colors.muted, opacity: 0.35 }} />
                <div style={{ position: 'absolute', right: 28, top: 28, width: 64, height: 20, borderRadius: 10, background: colors.gold, opacity: 0.4 }} />
              </div>
            ))}
          </div>
        </AbsoluteFill>
      </CameraRig>
      <PaperGrain opacity={0.07} />
      <Grade id="GR-02" />
    </AbsoluteFill>
  );
};

export default ShotIssueFlow;
