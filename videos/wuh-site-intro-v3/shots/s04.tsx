/* S04 · Act 1 墨点 · 局部帧 [0,84) · 84f · 绝对 498–582
 *
 * V3 批次 A 重做（2026-11-12 六门验收 + 审计返工单）：「证据快闪截图窗」退役（§3 内容本体化，
 * 全片禁页面快照），Issue 改为**纯数据件**——主角 = 线框 Issue 面板 + DATA.issues=144 真实
 * 碎片计数（呼应 s55「碎片的知识，先写在 Issue 里」）。
 * 【承接】首帧承接 s03 尾帧交出的「旧站首屏全亮暖光」——光缝收进近黑后，本镜以暗一档的
 *         DeepSpace 星场接住：站已立起，暗处开始攒碎片。
 * 【触发】主动作 = 五枚碎片 Issue 数据行沿弧线飞入面板落位（CM-07 侧向跟移），计数芯片
 *         0→144 微滚点亮——「碎片在积累」被数字说出来。
 * 【展开】逐拍帧表（局部帧，fps=30，呼吸镜·节拍密而不闹）：
 *   [0–10]    面板 springIn 浮起（y 18→0 + scale 0.97→1）+ CM-07 机位自左向右缓移；
 *   [22–72]   五行碎片数据行弧线飞入落位（cardFly，半拍 10f 一行，位移入场），
 *             每行落定后右缘状态点亮 + 行内呼吸微动；
 *   [30–50]   计数芯片 bigNum 0→144 微滚（DATA.issues 真数据），50 落定辉光脉冲 + 单环冲击；
 *   [50–72]   面板对焦呼吸（blur 2→0，rack focus 数据版）；
 *   [72–84]   末 12f 辉光呼吸（RH-02 原窗）+ HUD readout SYNC 144/144 · DONE——尾帧交接态。
 * 【交接】尾帧 = 数据行队列落定成整齐列表、计数 144 驻留（manifest endFrameDesc：卡片队列
 *         落定成整齐列表）→ 交 s05 About 资料面板。
 * 意义一句话：站子在暗处攒下最早的一把碎片知识——写作的种子先于文章落进仓库。
 * 时间轴零改动：84f / 面板 0–10 / 行飞入 22–72（半拍 10f）/ 芯片 30–50 / 末段呼吸 72–84 原样；
 * 无 Caption（呼吸镜）。零图片引用（§3）。转场：入「切」出「切」。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { DATA, FILM_COLORS2, bigNum, cardFly, glowText, shockwave, springIn } from '../motion-tokens';
import type { Pose } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 84;
const CHIP_LAND = 50; // 计数芯片落定（30+20 micro）
/** 飞入面板的碎片 Issue 数据行（5 行，半拍 10f 一行，弧线 Pose 插值） */
const FLY_ROWS = [0, 1, 2, 3, 4];

const S04: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // 面板 springIn 浮起（0–10）
  const panelP = springIn(frame, 2, fps);
  // CM-07 侧向跟移：机位自左向右缓移，rack focus 用面板清晰度表达
  const cam = {
    scale: 1.04,
    x: interpolate(frame, [0, TOTAL], [40, -30], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    y: 0,
    rot: 0,
  };
  const rack = interpolate(frame, [10, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  // 计数芯片：0→144 微滚（DATA.issues 真数据，30–50 落定）
  const chip = bigNum(frame, 30, 20, 0, DATA.issues);
  const chipWave = shockwave(frame, CHIP_LAND, '212,163,115');

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s04v2" stars={46} grid />
      <CameraRig cam={cam}>
        <AbsoluteFill>
          {/* 主角：线框 Issue 面板（springIn 浮起 + rack focus 对焦） */}
          <div style={{ position: 'absolute', left: 170, top: 130, width: 900, height: 640, filter: `blur(${(1 - rack) * 2}px)`, opacity: Math.min(1, panelP * 1.4), transform: `translateY(${(1 - panelP) * 18}px) scale(${0.97 + panelP * 0.03})` }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 10, background: FILM_COLORS2.panel, border: `1px solid ${FILM_COLORS2.line}`, boxShadow: `0 0 30px rgba(212,163,115,0.1), 0 22px 50px rgba(0,0,0,0.5)` }} />
            {/* 面板头 + 计数芯片（DATA.issues=144 真数据，凡量必滚） */}
            <div style={{ position: 'absolute', left: 40, top: 28, display: 'flex', alignItems: 'baseline', gap: 16 }}>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 17, letterSpacing: '0.3em', color: FILM_COLORS2.paperWhite, opacity: 0.9 }}>ISSUES · blog</span>
              <span
                style={{
                  fontFamily: fontFamilies.mono,
                  fontSize: 20,
                  color: FILM_COLORS2.data,
                  fontVariantNumeric: 'tabular-nums',
                  ...glowText(FILM_COLORS2.data, chip.glow),
                }}
              >
                {chip.text}
              </span>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 13, letterSpacing: '0.24em', color: FILM_COLORS2.textMuted }}>碎片 · 累积</span>
            </div>
            {/* 芯片落定单环冲击（50） */}
            {chipWave ? (
              <div style={{ position: 'absolute', left: 178, top: 44, width: 0, height: 0, zIndex: 29, pointerEvents: 'none' }}>
                <div style={chipWave.ring2} />
              </div>
            ) : null}
            <div style={{ position: 'absolute', left: 40, right: 40, top: 66, height: 1, background: FILM_COLORS2.line, opacity: 0.7 }} />
            {/* 碎片 Issue 数据行弧线飞入落位 */}
            <div style={{ position: 'absolute', left: 40, top: 96, width: 700 }}>
              {FLY_ROWS.map((i) => {
                const from: Pose = { x: -340, y: -60 + i * 14, rot: -7, scale: 0.9 };
                const to: Pose = { x: 0, y: i * 92, rot: 0, scale: 1 };
                const fly = cardFly(frame, 22 + i * 10, 26, from, to);
                const landed = frame >= 22 + i * 10 + 26;
                return (
                  <div key={`row-${i}`} style={{ position: 'absolute', left: 0, top: 0, width: 700, height: 72, ...fly }}>
                    <div style={{ position: 'absolute', inset: 0, borderRadius: 6, background: 'rgba(212,163,115,0.06)', border: `1px solid ${FILM_COLORS2.grid}` }} />
                    <div style={{ position: 'absolute', left: 20, top: 22, width: 380 - i * 30, height: 11, background: FILM_COLORS2.paperWhite, opacity: 0.32 }} />
                    <div style={{ position: 'absolute', left: 20, top: 44, width: 240, height: 7, background: FILM_COLORS2.dataDim, opacity: 0.3 }} />
                    <div
                      style={{
                        position: 'absolute',
                        right: 22,
                        top: '50%',
                        transform: `translateY(-50%) scale(${landed ? 1 + 0.12 * Math.sin(frame / 12 + i) : 0.6})`,
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        background: FILM_COLORS2.data,
                        opacity: landed ? 0.55 : 0.2,
                        boxShadow: `0 0 8px rgba(212,163,115,0.5)`,
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* 末 12f 辉光呼吸（RH-02 原窗 72–84） */}
          <AbsoluteFill style={{ background: `radial-gradient(ellipse 90% 80% at 50% 46%, rgba(212,163,115,0.5), rgba(212,163,115,0) 70%)`, mixBlendMode: 'screen', opacity: interpolate(frame, [72, TOTAL], [0, 0.06], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), pointerEvents: 'none' }} />
        </AbsoluteFill>
      </CameraRig>
      <HudChrome label="wuh.site · ISSUES" readout={frame >= 72 ? `SYNC ${DATA.issues}/${DATA.issues} · DONE` : 'SYNCING…'} />
      <Grade2 id="GR2-02" />
    </AbsoluteFill>
  );
};

export default S04;
