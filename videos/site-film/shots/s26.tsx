/* 镜 26 · Act 4 产品巡礼 · 全局帧 [4010,4120) · 110f */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../../brand/tokens';
import { CURVES, GRADES, SPRINGS } from '../motion-tokens';
import { DustField } from '../components/DustField';

const serif = fontFamilies.serif;
const sans = fontFamilies.sans;
const mono = fontFamilies.mono;

const fade = (f: number, at: number) =>
  interpolate(f, [at, at + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/* 弹幕聊天室：触发卡 spring-pop 成 1120×720 大窗 + cam-dolly-in 推入 + cam-drift 微摇，
   气泡左右交替滑入 + 发送三态轮显（chat-bubble）；出场 tr-bubble-gather 聚拢成光点
   （原 Act4 镜 26，幕局部 1210–1320 → 镜局部 0–110；const f = frame - 1210 换算为 const f = frame） */
const ShotChat: FC = () => {
  const frame = useCurrentFrame();
  const grade = GRADES[3];
  const f = frame; // 0–110
  const open = spring({ frame: f, fps: 30, config: SPRINGS.springPop });
  const dolly = interpolate(f, [0, 110], [1, 1.08], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const gather = interpolate(f, [80, 110], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn });
  const msgs: Array<[string, boolean]> = [
    ['路过，留个脚印。', false],
    ['朝朝如念。', true],
    ['字字用心。', false],
    ['天才向左，疯子向右。', true],
    ['再来一卷歌单。', false],
  ];
  const states = ['发送中', '已发', '已读'];
  return (
    <AbsoluteFill>
      <DustField act={4} />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', transform: `scale(${dolly}) translateX(${Math.sin(f / 40) * 6}px)` }}>
        <div style={{ width: 1120, height: 660, borderRadius: 18, background: colors.bgLift, border: `1px solid ${colors.hairline}`, overflow: 'hidden', position: 'relative', transform: `scale(${interpolate(open, [0, 1], [0.6, 1])})` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '22px 32px', borderBottom: `1px solid ${colors.hairline}` }}>
            <div style={{ width: 30, height: 30, borderRadius: 15, background: colors.accent }} />
            <div style={{ width: 30, height: 30, borderRadius: 15, background: colors.paperMuted }} />
            <span style={{ fontFamily: sans, fontSize: 18, color: colors.muted, marginLeft: 8 }}>About · 弹幕聊天室</span>
          </div>
          <div style={{ position: 'relative', height: 540 }}>
            {msgs.map(([text, right], i) => {
              const born = 10 + i * 14;
              const pop = spring({ frame: f - born, fps: 30, config: SPRINGS.springPop });
              const status = states[Math.min(2, Math.max(0, Math.floor((f - born - 8) / 12)))];
              return (
                <div key={text} style={{ position: 'absolute', left: right ? undefined : 46, right: right ? 46 : undefined, top: 26 + i * 88, opacity: Math.min(1, Math.max(0, pop)), transform: `translate(${(right ? 1 : -1) * (1 - pop) * 40 + gather * (right ? 300 : -160)}px, ${gather * (280 - (26 + i * 88))}px) scale(${1 - gather * 0.8})` }}>
                  <div style={{ background: right ? colors.accent : colors.paperDeep, borderRadius: 12, padding: '12px 20px' }}>
                    <span style={{ fontFamily: sans, fontSize: 21, color: right ? colors.bg : colors.ink }}>{text}</span>
                  </div>
                  <p style={{ fontFamily: mono, fontSize: 12, color: colors.muted, textAlign: right ? 'right' : 'left', margin: '6px 4px 0' }}>{status}</p>
                </div>
              );
            })}
            {/* 聚拢合体光点（bloom-glow） */}
            <div style={{ position: 'absolute', left: 534, top: 300, width: 26, height: 26, borderRadius: 13, background: colors.accent, opacity: gather, boxShadow: `0 0 ${70 * gather}px ${colors.accent}`, transform: `scale(${gather})`, mixBlendMode: 'screen' }} />
          </div>
        </div>
        <p style={{ position: 'absolute', bottom: 92, width: '100%', textAlign: 'center', fontFamily: serif, fontSize: 32, color: colors.paper, opacity: fade(f, 30) * (1 - gather) }}>两种人格，一间屋子</p>
      </AbsoluteFill>
      {/* 幕级调色 overlay（原 Act4 全屏层分解入镜）：grade-warm-gold LUT + 雾光 */}
      <AbsoluteFill style={{ background: grade.lut.color, mixBlendMode: grade.lut.blend, opacity: grade.lut.opacity }} />
      <AbsoluteFill style={{ background: grade.veil.color, mixBlendMode: grade.veil.blend, opacity: grade.veil.opacity }} />
    </AbsoluteFill>
  );
};

export default ShotChat;
