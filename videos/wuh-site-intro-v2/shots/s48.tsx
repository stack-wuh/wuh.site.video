/* 镜 48 · Act 7 坐忘 · 局部帧 [0,168) · 168f
   晨光从纸页边缘渗入，纸页淡出为书桌俯拍（TR-19：纸页 opacity 1→0，桌面 brightness 1.45→1）；
   书摊开，日历一格「游戏日」被划掉、改写「读书日」（20f 微距，FN-21 划线 + FN-29 改写）；
   CM-08 俯拍缓降，晨光角度 4s 内偏移 20°；GR-06。 */
import type { CSSProperties, FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, letterpress, pathDraw, sealTilt } from '../motion-tokens';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { PaperGrain } from '../components/PaperGrain';
import { Grade } from '../components/Grade';

const serif = fontFamilies.serif;
const mono = fontFamilies.mono;

const UPPER_TOP = 96;
const LOWER_TOP = 486;
const COLUMN_GAP = 130;

const COLUMN_STYLE: CSSProperties = {
  writingMode: 'vertical-rl',
  fontFamily: serif,
  fontSize: 34,
  lineHeight: 1,
  letterSpacing: '0.42em',
  color: colors.ink,
};

/* 承接 s47 尾帧的整页（淡出用） */
const PageColumn: FC<{ frame: number; text: string }> = ({ frame, text }) => (
  <div style={COLUMN_STYLE}>
    {Array.from(text).map((ch, i) => (
      <span key={`${ch}-${i}`} style={{ display: 'inline-block', ...letterpress(frame, -20, 1) }}>
        {ch}
      </span>
    ))}
  </div>
);

const PageEcho: FC<{ frame: number }> = ({ frame }) => (
  <>
    <AbsoluteFill style={{ background: colors.paper }} />
    <div style={{ position: 'absolute', left: 0, right: 0, top: UPPER_TOP, display: 'flex', justifyContent: 'center', gap: COLUMN_GAP }}>
      <PageColumn frame={frame} text="少思慧烛内光。" />
      <PageColumn frame={frame} text="常默元气不伤，" />
    </div>
    <div style={{ position: 'absolute', left: 0, right: 0, top: LOWER_TOP, display: 'flex', justifyContent: 'center', gap: COLUMN_GAP }}>
      <PageColumn frame={frame} text="不恼心地清凉。" />
      <PageColumn frame={frame} text="不怒百神和畅，" />
    </div>
    <div style={{ position: 'absolute', right: 232, bottom: 132 }}>
      <div style={{ fontFamily: serif, fontSize: 32, letterSpacing: '0.1em', color: colors.ink }}>——司马承祯《坐忘歌》</div>
      <div style={{ marginTop: 6, width: 460, height: 1, background: colors.ink, opacity: 0.55 }} />
    </div>
    <div
      style={{
        position: 'absolute',
        right: 168,
        bottom: 88,
        width: 34,
        height: 34,
        borderRadius: 3,
        background: colors.seal,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: serif,
        fontSize: 16,
        color: colors.paper,
        transform: `rotate(${sealTilt('s47')}deg)`,
      }}
    >
      忘
    </div>
  </>
);

/* 日历中格（宏观焦点）中心，与 3×3 格盘对齐 */
const CELL_CX = 1415;
const CELL_CY = 602;

const LINES = [0, 1, 2, 3, 4, 5, 6, 7, 8];

const PageLines: FC = () => (
  <>
    {LINES.map((i) => (
      <div
        key={i}
        style={{
          height: 8,
          width: `${58 + ((i * 17) % 34)}%`,
          marginBottom: 22,
          borderRadius: 3,
          background: colors.paperMuted,
          opacity: 0.6,
        }}
      />
    ))}
  </>
);

const ShotMorningDesk: FC = () => {
  const frame = useCurrentFrame();
  const pageFade = interpolate(frame, [10, 40], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const edgeDawn = interpolate(frame, [0, 22], [0, 0.5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const deskBrightness = interpolate(frame, [0, 44], [1.45, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const descend = interpolate(frame, [0, 168], [1.02, 1.05], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const macroIn = interpolate(frame, [86, 104], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const macroOut = interpolate(frame, [126, 164], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const macro = 1 + macroIn * 0.34 - macroOut * 0.26;
  const dawnAngle = interpolate(frame, [0, 120], [-14, 6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const beam = interpolate(frame, [0, 120], [0.2, 0.36], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      {/* 书桌（俯拍） */}
      <div style={{ position: 'absolute', inset: 0, filter: `brightness(${deskBrightness})`, transform: `scale(${descend})` }}>
        <div style={{ position: 'absolute', inset: 0, transform: `scale(${macro})`, transformOrigin: `${CELL_CX}px ${CELL_CY}px` }}>
          <AbsoluteFill style={{ background: `linear-gradient(135deg, ${colors.paperMuted} 0%, ${colors.paperDeep} 52%, ${colors.paperMuted} 100%)` }} />

          {/* 晨光：角度 4s 内偏移 20° */}
          <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: beam, pointerEvents: 'none' }}>
            <div
              style={{
                position: 'absolute',
                left: -500,
                top: -700,
                width: 3200,
                height: 2000,
                background: `linear-gradient(180deg, ${colors.gold} 0%, transparent 42%)`,
                transform: `rotate(${dawnAngle}deg)`,
              }}
            />
          </AbsoluteFill>

          {/* 摊开的书 */}
          <div style={{ position: 'absolute', left: 170, top: 340, width: 860, height: 520, transform: 'rotate(-2deg)', display: 'flex' }}>
            <div
              style={{
                flex: 1,
                background: `linear-gradient(105deg, ${colors.paper} 0%, ${colors.paperDeep} 100%)`,
                borderRadius: '6px 0 0 6px',
                padding: '46px 40px',
                overflow: 'hidden',
              }}
            >
              <PageLines />
            </div>
            <div style={{ width: 4, background: colors.paperMuted, opacity: 0.8 }} />
            <div
              style={{
                flex: 1,
                background: `linear-gradient(255deg, ${colors.paper} 0%, ${colors.paperDeep} 100%)`,
                borderRadius: '0 6px 6px 0',
                padding: '46px 40px',
                overflow: 'hidden',
              }}
            >
              <PageLines />
            </div>
          </div>

          {/* 日历 */}
          <div
            style={{
              position: 'absolute',
              left: 1180,
              top: 330,
              width: 470,
              height: 500,
              transform: 'rotate(1.2deg)',
              background: colors.paper,
              borderRadius: 6,
              padding: 26,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontFamily: serif, fontSize: 24, color: colors.ink }}>七月</span>
              <span style={{ fontFamily: mono, fontSize: 14, color: colors.muted, fontVariantNumeric: 'tabular-nums' }}>2026</span>
            </div>
            <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(3, 1fr)', gap: 8, height: 388 }}>
              {LINES.map((i) => (
                <div key={i} style={{ position: 'relative', border: `1px solid ${colors.paperMuted}`, borderRadius: 4, overflow: 'hidden' }}>
                  {i === 4 ? (
                    <>
                      <span style={{ position: 'absolute', left: 0, right: 0, top: 26, textAlign: 'center', fontFamily: serif, fontSize: 22, color: colors.ink }}>游戏日</span>
                      <svg width={118} height={10} style={{ position: 'absolute', left: 10, top: 38 }}>
                        <path d="M2 6 C 34 3, 78 8, 116 4" fill="none" stroke={colors.ink} strokeWidth={2.4} strokeLinecap="round" style={pathDraw(frame, 100, 12, 118)} />
                      </svg>
                      {'读书日'.split('').map((ch, k) => (
                        <span
                          key={ch}
                          style={{
                            position: 'absolute',
                            left: 18 + k * 30,
                            top: 66,
                            fontFamily: serif,
                            fontSize: 24,
                            color: colors.ink,
                            ...letterpress(frame, 112 + k * 6, 1),
                          }}
                        >
                          {ch}
                        </span>
                      ))}
                    </>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <DustField act={7} count={14} seedBase="s48" />
        </div>
      </div>

      {/* 纸页淡出（承接 s47 整页） */}
      <div style={{ position: 'absolute', inset: 0, opacity: pageFade }}>
        <PageEcho frame={frame} />
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(270deg, ${colors.gold} 0%, transparent 42%)`, opacity: edgeDawn, mixBlendMode: 'screen' }} />
      </div>

      {/* 底部纸面暗带：给字幕留对比 */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 300, backgroundImage: `linear-gradient(180deg, transparent, ${colors.bg})`, opacity: 0.18 }} />
      <PaperGrain opacity={0.06} />
      <Grade id="GR-06" />
      <Caption text="清晨，他随口念起两句，临时把游戏日改成了读书日。" appearAt={34} />
    </AbsoluteFill>
  );
};

export default ShotMorningDesk;
