/* 镜 39 · Act 6 入院 · 局部帧 [0,150) · 150f
   16+118+16：面板（litSet={1,2,3,4}）→ 光标点开块 5「留言板」→ 窗口最大化；
   持续（v1 表达）：1120×720「About · 弹幕聊天室」对话框——左右分列的聊天气泡
   （左纸色 / 右朱红，带小尾巴与「发送中 / 已发 / 已读」三态小字）一句句弹入，结尾聚成一枚光点；
   出场：反向收束回块 5（点亮），光标移向块 6。字幕「两种人格，一间屋子。」。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, inkRise, SPRINGS } from '../motion-tokens';
import { Caption } from '../components/Caption';
import { ConsoleCursor, ConsolePanel, ConsoleWindow, TILE_RECTS } from '../components/Console';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const DUR = 150;
const IN = 16;
const OUT = DUR - IN; // 134
const CLICK = 9;
const TILE = 4;
const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

const mono = fontFamilies.mono;
const serif = fontFamilies.serif;
const sans = fontFamilies.sans;

const tileCenter = (i: number) => ({ x: TILE_RECTS[i].x + TILE_RECTS[i].w / 2, y: TILE_RECTS[i].y + TILE_RECTS[i].h / 2 });

const MSGS: Array<[string, boolean]> = [
  ['路过，留个脚印。', false],
  ['朝朝如念。', true],
  ['字字用心。', false],
  ['天才向左，疯子向右。', true],
  ['再来一卷歌单。', false],
];

const DIALOG = { x: 400, y: 150, w: 1120, h: 720 };

const CaptionPlate: FC<{ appearAt: number }> = ({ appearAt }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [appearAt, appearAt + 16], [0, 1], CLAMP);
  return (
    <div
      style={{
        position: 'absolute',
        left: 380,
        right: 380,
        bottom: 96,
        height: 200,
        background: `linear-gradient(180deg, transparent, ${colors.bg} 20%, ${colors.bg} 80%, transparent)`,
        opacity: p * 0.5,
        pointerEvents: 'none',
      }}
    />
  );
};

const ShotChatRoom: FC = () => {
  const frame = useCurrentFrame();
  const to = tileCenter(TILE);
  const next = tileCenter(TILE + 1);
  const panelCenter = { x: 960, y: 540 };

  const cursorIn = interpolate(frame, [0, 7], [0, 1], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const cursorOut = interpolate(frame, [OUT + 6, DUR], [0, 1], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const cx = frame < OUT + 6 ? panelCenter.x + (to.x - panelCenter.x) * cursorIn : to.x + (next.x - to.x) * 0.34 * cursorOut;
  const cy = frame < OUT + 6 ? panelCenter.y + (to.y - panelCenter.y) * cursorIn : to.y + (next.y - to.y) * 0.34 * cursorOut;

  const ripple = interpolate(frame, [CLICK, CLICK + 18], [0, 1], CLAMP);
  const progress =
    frame < OUT
      ? interpolate(frame, [CLICK, IN], [0, 1], { ...CLAMP, easing: CURVES.cineEaseInOut })
      : interpolate(frame, [OUT, OUT + 12], [1, 0], { ...CLAMP, easing: CURVES.cineEaseInOut });

  const panelOpacity = interpolate(frame, [0, 10], [0, 1], CLAMP);
  const cursorOpacity = interpolate(frame, [0, 4], [0, 1], CLAMP);
  const lit = frame >= CLICK ? [0, 1, 2, 3, 4] : [0, 1, 2, 3];
  const active = frame >= 6 && frame < OUT ? TILE : -1;

  const open = spring({ frame: frame - 16, fps: 30, config: SPRINGS.springPop });
  const dolly = interpolate(frame, [16, 120], [1, 1.06], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const gather = interpolate(frame, [104, 126], [0, 1], { ...CLAMP, easing: CURVES.cineEaseIn });
  const states = ['发送中', '已发', '已读'];

  return (
    <AbsoluteFill>
      <ConsolePanel lit={lit} active={active} style={{ opacity: panelOpacity }} />
      <Grade id="GR-01" />
      <DustField act={6} count={24} seedBase="s39" />
      <ConsoleCursor x={cx} y={cy} hover={frame >= 6 && frame < OUT} ripple={ripple} opacity={cursorOpacity} />

      <ConsoleWindow tile={TILE} progress={progress}>
        <AbsoluteFill>
          <div
            style={{
              position: 'absolute',
              left: 140,
              top: 58,
              right: 140,
              display: 'flex',
              justifyContent: 'space-between',
              fontFamily: mono,
              fontSize: 15,
              letterSpacing: '0.24em',
              color: colors.muted,
              ...inkRise(frame, 20),
            }}
          >
            <span>05 / 留言板 · GUESTBOOK</span>
            <span>ABOUT · 弹幕聊天室</span>
          </div>

          {/* v1 对话框：1120×720 大窗 + 左右分列气泡 */}
          <div
            style={{
              position: 'absolute',
              left: DIALOG.x,
              top: DIALOG.y,
              width: DIALOG.w,
              height: DIALOG.h,
              borderRadius: 18,
              background: colors.paperDeep,
              border: `1px solid ${colors.paperMuted}`,
              overflow: 'hidden',
              transform: `scale(${interpolate(open, [0, 1], [0.94, 1]) * dolly})`,
              transformOrigin: 'center',
              boxShadow: `0 26px 60px ${colors.bg}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '20px 30px', borderBottom: `1px solid ${colors.paperMuted}` }}>
              <div style={{ width: 26, height: 26, borderRadius: 13, background: colors.seal }} />
              <div style={{ width: 26, height: 26, borderRadius: 13, background: colors.paperMuted }} />
              <span style={{ fontFamily: sans, fontSize: 17, color: colors.muted, marginLeft: 6 }}>About · 弹幕聊天室</span>
            </div>
            <div style={{ position: 'relative', height: DIALOG.h - 68 }}>
              {MSGS.map(([text, right], i) => {
                const born = 22 + i * 12;
                const pop = spring({ frame: frame - born, fps: 30, config: SPRINGS.springPop });
                const t = frame - born;
                const status = states[Math.min(2, Math.max(0, Math.floor((t - 6) / 12)))];
                return (
                  <div
                    key={text}
                    style={{
                      position: 'absolute',
                      left: right ? undefined : 46,
                      right: right ? 46 : undefined,
                      top: 30 + i * 118,
                      opacity: Math.min(1, Math.max(0, pop)),
                      transform: `translate(${(right ? 1 : -1) * (1 - pop) * 40 + gather * (right ? 300 : -160)}px, ${gather * (300 - (30 + i * 118))}px) scale(${1 - gather * 0.8})`,
                    }}
                  >
                    <div style={{ position: 'relative', background: right ? colors.seal : colors.paperMuted, borderRadius: 12, padding: '14px 22px' }}>
                      <span style={{ fontFamily: sans, fontSize: 22, color: right ? colors.paper : colors.ink }}>{text}</span>
                      <span
                        style={{
                          position: 'absolute',
                          bottom: -5,
                          left: right ? undefined : 22,
                          right: right ? 22 : undefined,
                          width: 12,
                          height: 12,
                          background: right ? colors.seal : colors.paperMuted,
                          transform: 'rotate(45deg)',
                        }}
                      />
                    </div>
                    <p style={{ fontFamily: mono, fontSize: 12, color: colors.muted, textAlign: right ? 'right' : 'left', margin: '8px 4px 0' }}>{status}</p>
                  </div>
                );
              })}
              {/* 结尾：气泡聚成一枚光点 */}
              <div
                style={{
                  position: 'absolute',
                  left: DIALOG.w / 2 - 13,
                  top: 300,
                  width: 26,
                  height: 26,
                  borderRadius: 13,
                  background: colors.accent,
                  opacity: gather,
                  boxShadow: `0 0 ${70 * gather}px ${colors.accent}`,
                  transform: `scale(${gather})`,
                  mixBlendMode: 'screen',
                }}
              />
            </div>
          </div>
        </AbsoluteFill>
        <PaperGrain opacity={0.05} />
        <Grade id="GR-02" />
      </ConsoleWindow>

      <CaptionPlate appearAt={30} />
      <Caption text="两种人格，一间屋子。" appearAt={30} />
    </AbsoluteFill>
  );
};

export default ShotChatRoom;
