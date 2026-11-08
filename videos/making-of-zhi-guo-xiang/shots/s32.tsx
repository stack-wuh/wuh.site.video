/* s32 · 深夜里，机器也会罢工。（135f · 4.5s，Act 7 · 幕后）
 *
 * CI 卡：暗底（colors.bgLift）终端窗 mock（run 42258912553），cancelled 日志行滚动
 * （等宽字体，行文取真实 CI 日志感），红色 = colors.seal 及其 rgba 派生；
 * 滚动走 MO-EASE.inout，末行红行（##[error] … has been cancelled）定格收尾，
 * 标题栏状态章「✗ cancelled」同步显影。入 dry（单侧 10f，ShotShell 承接）/ 出 cut。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CLAMP, MO_EASE } from '../motion-tokens';
import { Caption } from '../components/Caption';

const DURATION = 135;
const LINE_H = 40;
const BODY_H = 546; // 窗体 640 − 标题栏 46 − 内边距 48

type Tone = 'dim' | 'std' | 'warn' | 'err';

/** 真实感 CI 日志（静态字符串，确定性）；tone → 颜色见 LINE_TONE */
const LOG_LINES: Array<{ text: string; tone: Tone }> = [
  { text: '2026-11-06T18:41:02.114Z ##[group]Self-hosted runner · ubuntu-24.04', tone: 'dim' },
  { text: '2026-11-06T18:41:02.890Z ✓ Runner connected · 4 vCPU · 16 GB', tone: 'std' },
  { text: '2026-11-06T18:41:03.552Z Preparing render matrix: 41 jobs · film making-of-zhi-guo-xiang', tone: 'std' },
  { text: '2026-11-06T18:41:05.201Z [job 03/41] render-shot s03 — cache hit (0.4s)', tone: 'dim' },
  { text: '2026-11-06T18:41:07.664Z [job 08/41] render-shot s08 ok — 6.1s', tone: 'dim' },
  { text: '2026-11-06T18:41:09.778Z [job 17/41] render-shot s17 — cache miss', tone: 'std' },
  { text: '2026-11-06T18:41:10.004Z [job 17/41] frame 1/165 — cold chrome start', tone: 'dim' },
  { text: '2026-11-06T18:43:27.551Z [job 24/41] render-shot s24 ok — 212s', tone: 'std' },
  { text: '2026-11-06T18:45:02.093Z [job 31/41] render-shot s31 — cache miss', tone: 'std' },
  { text: '2026-11-06T18:45:02.310Z [job 31/41] frame 1/150 — cold chrome start', tone: 'dim' },
  { text: '2026-11-06T18:47:13.884Z ##[warning]Heartbeat stalled: no onProgress for 120s', tone: 'warn' },
  { text: '2026-11-06T18:47:13.885Z ##[warning]Retry 1/3 will follow', tone: 'warn' },
  { text: '2026-11-06T18:47:15.092Z watchdog → makeCancelSignal (render-shot s31)', tone: 'warn' },
  { text: '2026-11-06T18:47:15.310Z Killing chrome headless-shell · pid 8814', tone: 'std' },
  { text: '', tone: 'dim' },
  { text: '⨯ render-shot s31 — Job cancelled', tone: 'err' },
  { text: '##[error] The job running on runner "ip-10-0-7-82" has been cancelled', tone: 'err' },
  { text: '##[error] 1 job cancelled · rerun policy: retry-on-cancel', tone: 'err' },
];

const LINE_TONE: Record<Tone, { color: string; opacity: number }> = {
  dim: { color: colors.muted, opacity: 0.75 },
  std: { color: colors.terminalText, opacity: 0.78 },
  warn: { color: colors.accent, opacity: 0.88 },
  err: { color: colors.seal, opacity: 1 },
};

const S32: FC = () => {
  const f = useCurrentFrame();
  // 日志滚动：MO-EASE.inout，末行显影后定格
  const listH = LOG_LINES.length * LINE_H;
  const scrollPx = Math.max(0, listH - BODY_H);
  const p = interpolate(f, [14, 96], [0, 1], { ...CLAMP, easing: MO_EASE.inout });
  // 标题栏状态章
  const statusIn = interpolate(f, [100, 106], [0, 1], CLAMP);

  return (
    <AbsoluteFill style={{ background: colors.bgLift }}>
      <div
        style={{
          position: 'absolute',
          left: 220,
          top: 220,
          width: 1480,
          height: 640,
          background: colors.terminalBg,
          border: `1px solid ${colors.hairline}`,
          borderRadius: 10,
          overflow: 'hidden',
          boxShadow: `0 24px 70px ${colors.bg}`,
        }}
      >
        {/* 标题栏 */}
        <div
          style={{
            height: 46,
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            padding: '0 20px',
            borderBottom: `1px solid ${colors.hairline}`,
          }}
        >
          <div style={{ display: 'flex', gap: 8 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: 12, height: 12, borderRadius: 6, background: colors.paperMuted, opacity: 0.32 }} />
            ))}
          </div>
          <div style={{ fontFamily: fontFamilies.mono, fontSize: 16, letterSpacing: 2, color: colors.muted }}>
            run 42258912553 · render-film · ubuntu-24.04
          </div>
          <div
            style={{
              marginLeft: 'auto',
              fontFamily: fontFamilies.mono,
              fontSize: 16,
              letterSpacing: 2,
              color: colors.seal,
              opacity: statusIn,
            }}
          >
            ✗ cancelled
          </div>
        </div>

        {/* 日志体：滚动（末行红行定格在最下） */}
        <div style={{ height: BODY_H, margin: '24px 30px', overflow: 'hidden' }}>
          <div style={{ transform: `translateY(${-scrollPx * p}px)` }}>
            {LOG_LINES.map((line, i) => {
              const tone = LINE_TONE[line.tone];
              return (
                <div
                  key={i}
                  style={{
                    height: LINE_H,
                    fontFamily: fontFamilies.mono,
                    fontSize: 22,
                    lineHeight: `${LINE_H}px`,
                    whiteSpace: 'nowrap',
                    color: tone.color,
                    opacity: tone.opacity,
                  }}
                >
                  {line.text || '\u00A0'}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Caption
        text="深夜里，机器也会罢工。"
        start={22}
        end={123}
        duration={DURATION}
        inSide={10}
        outSide={0}
      />
    </AbsoluteFill>
  );
};

export default S32;
