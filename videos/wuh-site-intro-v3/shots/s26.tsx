/* S26 · Act 5 灯亮 · 局部帧 [0,132) · 132f · 绝对 3858–3990
 *
 * 迁入节拍镜：呼吸/节拍语义保留，微动不断（handheld 全镜）；新站首页=线框数据面板
 * （border + 辉光，非仿真浏览器 chrome），历史文章卡成队从左侧飞入（cardFly 窗口原样），
 * 只给密度、不给计数。侧栏保留 s25 双苔痕余韵（两枚琥珀辉光斑）。
 * 编排四问：
 *   承接 = s25 交出的湿纸+双苔痕（侧栏双辉光斑余韵即交接物入画）；
 *   触发 = 线框面板展开后，文章数据卡逐张飞入（半拍一卡，迁入的机械节拍）；
 *   展开 = 帧级节奏：0–22 面板展开（springIn scale 0.97→1）→ 22+i*10 起 9 卡 cardFly（各 22f，末卡 102–124 落定）→ cam 侧向跟移全镜；
 *   交接 = 尾帧：文章数据行铺满线框首屏（交接态：满屏文章列表，交 s27 失焦压暗）。
 * 逐拍帧表（fps=30）：
 *   [0–22]   线框面板 springIn 展开（位移入场 scale 0.97→1 + 辉光渐起）；题行/副行/分隔线随面板显影；
 *   [22/32/42/52/62/72/82/92/102] 9 张文章卡 cardFly 自左飞入（x -420→0，各 22f，半拍一卡压实感）；行内墨点+日期 05-0X 等宽随卡落位；
 *   [0–132]  cam 侧向跟移 x 50→-40（窗原样）+ handheld('s26-cam', 1.0) 呼吸微动不断；
 *   [全镜]   侧栏双苔痕余韵（blur 4 / opacity 0.35，静置呼应 s25 尾帧）。
 * 时间轴零改动：132f / cardFly 窗 22+i*10 / 面板几何 原样；转场：入「切」，出「切」。无字幕（迁入节拍）。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { cardFly, FILM_COLORS2, handheld, springIn, type Pose } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 132;
const CARDS = 9;

const S26: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hh = handheld('s26-cam', frame, 1.0);
  const cam = {
    scale: 1.04,
    x: interpolate(frame, [0, TOTAL], [50, -40], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }) + hh.dx,
    y: hh.dy,
    rot: hh.rot,
  };
  // 面板展开（0–22，springIn 位移入场）
  const panelP = springIn(frame, 0, fps, 16, 150, 0.9);

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s26v2" stars={48} grid />
      <CameraRig cam={cam}>
        <AbsoluteFill>
          {/* 新站首页线框数据面板（展开 0–22，springIn scale 0.97→1） */}
          <div
            style={{
              position: 'absolute',
              left: 150,
              top: 70,
              right: 150,
              bottom: 70,
              borderRadius: 6,
              background: FILM_COLORS2.panel,
              border: `1px solid ${FILM_COLORS2.line}`,
              boxShadow: `0 0 44px rgba(212,163,115,0.12), 0 24px 60px rgba(0,0,0,0.5)`,
              opacity: Math.min(1, panelP * 1.3),
              transform: `scale(${0.97 + panelP * 0.03})`,
            }}
          >
            {/* 面板头：题行 + 副行 + 分隔线 */}
            <div style={{ position: 'absolute', left: 60, top: 40, width: 420, height: 30, borderRadius: 3, background: `rgba(212,163,115,0.5)` }} />
            <div style={{ position: 'absolute', left: 60, top: 90, width: 300, height: 12, borderRadius: 3, background: `rgba(245,240,232,0.18)` }} />
            <div style={{ position: 'absolute', left: 60, right: 60, top: 130, height: 1, background: FILM_COLORS2.line }} />
            {/* 内容栏：文章数据行成队飞入（22 起，半拍一卡，压实感） */}
            <div style={{ position: 'absolute', left: 70, top: 170, width: 1100 }}>
              {Array.from({ length: CARDS }).map((_, i) => {
                const from: Pose = { x: -420, y: -20 + (i % 3) * 10, rot: -4, scale: 0.96 };
                const to: Pose = { x: 0, y: i * 74, rot: 0, scale: 1 };
                const style = cardFly(frame, 22 + i * 10, 22, from, to);
                return (
                  <div key={i} style={{ position: 'absolute', left: 0, top: 0, width: 1000, height: 60, ...style }}>
                    <div style={{ position: 'absolute', inset: 0, borderRadius: 4, background: 'rgba(23,20,16,0.85)', border: `1px solid ${FILM_COLORS2.line}` }} />
                    <div style={{ position: 'absolute', left: 20, top: 26, width: 8, height: 8, borderRadius: 4, background: FILM_COLORS2.data, boxShadow: `0 0 7px rgba(212,163,115,0.5)` }} />
                    <div style={{ position: 'absolute', left: 44, top: 14, width: 380 + (i % 3) * 90, height: 13, borderRadius: 3, background: `rgba(245,240,232,0.3)` }} />
                    <div style={{ position: 'absolute', left: 44, top: 38, width: 220, height: 9, borderRadius: 3, background: `rgba(245,240,232,0.12)` }} />
                    <span style={{ position: 'absolute', right: 18, top: 16, fontFamily: fontFamilies.mono, fontSize: 14, color: FILM_COLORS2.textMuted, opacity: 0.8, fontVariantNumeric: 'tabular-nums' }}>05-0{(i % 8) + 1}</span>
                  </div>
                );
              })}
            </div>
            {/* 侧栏（虚化苔痕余韵：s25 双数据苔痕） */}
            <div style={{ position: 'absolute', right: 60, top: 170, width: 380, height: 620, filter: 'blur(4px)', opacity: 0.35 }}>
              <div style={{ position: 'absolute', left: 60, top: 200, width: 200, height: 90, borderRadius: 45, background: `radial-gradient(ellipse, rgba(212,163,115,0.5), rgba(212,163,115,0) 75%)` }} />
              <div style={{ position: 'absolute', left: 90, top: 340, width: 220, height: 100, borderRadius: 50, background: `radial-gradient(ellipse, rgba(212,163,115,0.75), rgba(212,163,115,0) 75%)` }} />
            </div>
          </div>
        </AbsoluteFill>
      </CameraRig>
      <HudChrome label="wuh.site · MIGRATE" readout="BATCH 2026-05" />
      <Grade2 id="GR2-05" />
    </AbsoluteFill>
  );
};

export default S26;
