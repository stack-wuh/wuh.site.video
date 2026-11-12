/* S05 · Act 1 墨点 · 局部帧 [0,138) · 138f · 绝对 582–720
 *
 * V3 批次 A 重做（2026-11-12 六门验收 + 审计返工单 · 留白镜：呼吸语义保留，节拍不断）：
 * 【承接】首帧承接 s04 尾帧交出的「碎片队列整齐列表」——列表残影收拢（0–22 原窗，数据行
 *         反向淡出），画面让位给站主本人：About HUD 资料面板。
 * 【触发】主动作 = About 线框面板 springIn 浮起（38–58），GitHub 真头像（人物照片非页面
 *         快照，保留）+ @stack-wuh 档案落位；「68」public repos bigNum 微滚（58–78，
 *         落定 78=绝对 660=拍33 静默，对音絕不动）——落定瞬间单环冲击 + 辉光脉冲。
 * 【展开】逐拍帧表（局部帧，fps=30，留白呼吸镜）：
 *   [0–22]    上镜列表残影收拢（原窗，琥珀数据行淡出 + 上移 8px）；
 *   [38–58]   About 面板 springIn 浮起（y 20→0，位移入场）；handheld('s05-cam',1.0) 微颤；
 *   [58–78]   「68」public repos bigNum 微滚（ROLL_DUR.micro），78 落定=拍33 静默：
 *             shockwave 单环 + sparkBurst('s05-burst',8 粒金) + bigNum 自带辉光 SLAM；
 *   [62/78/88] stack-wuh / 深圳 bio「a boy just ~」/ GITHUB · @STACK-WUH writeFade 落位即现；
 *   [118–138] 右缘数据流光微启（原窗，「2021 →」透出下一幕入口）——尾帧交接态。
 * 【交接】尾帧 = 资料卡静置、右缘纸缝透光带出 2021（manifest endFrameDesc：资料卡静置，
 *         右缘纸缝透光）→ 交 s06 幕首年份牌。
 * 意义一句话：镜头第一次对准站主本人——GitHub 档案上 68 个仓库，是这部年度报告的署名栏。
 * 时间轴零改动：138f / 残影 0–22 / 面板 38–58 / 微滚 58–78（落定 78 对音）/ 流光 118–138 原样；
 * 无 Caption（留白）。avatar.png 为人物照片（非页面快照），按返工单保留。
 * 转场：入「切」出「切」。
 */
import type { FC } from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { staticFile } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES, writeFade } from '../../../brand/motion';
import {
  FILM_COLORS2,
  ROLL_DUR,
  bigNum,
  glowText,
  handheld,
  shockwave,
  sparkBurst,
  springIn,
} from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 138;
const REPOS_LAND = 78; // 「68」落定 = 绝对 660 = 拍33 静默（对音，絕不动）
/** 「68」数字视觉中心（面板 left 610/top 210 + 行 (50,238) + 字宽一半≈40/字高一半≈31） */
const NUM_CX = 700;
const NUM_CY = 479;

const S05: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // 上镜列表残影收拢（0–22）：数据行淡出
  const listOut = interpolate(frame, [0, 22], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn });
  // About 面板 springIn 浮起（38–58）
  const cardP = springIn(frame, 38, fps);
  // 「68」微滚（58–78 落定=拍33 静默；bigNum 辉光 SLAM）
  const repos = bigNum(frame, 58, ROLL_DUR.micro, 0, 68);
  // 落定瞬间（78）：单环冲击 + 金粒
  const wave = shockwave(frame, REPOS_LAND, '212,163,115');
  const burst = sparkBurst('s05-burst', frame, REPOS_LAND, 8, true);
  const hh = handheld('s05-cam', frame, 1.0);
  const cam = {
    scale: interpolate(frame, [0, TOTAL], [1.02, 1.045], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    x: hh.dx,
    y: hh.dy,
    rot: hh.rot,
  };
  // 右缘数据流光微启（118–138）：透出 2021
  const seam = interpolate(frame, [118, TOTAL], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s05v2" stars={44} grid />
      <CameraRig cam={cam}>
        <AbsoluteFill>
          {/* 上镜列表残影收拢（0–22） */}
          {frame < 22 ? (
            <div style={{ position: 'absolute', left: 200, right: 200, top: 160, opacity: listOut }}>
              {[0, 1, 2, 3].map((i) => (
                <div key={`ghost-${i}`} style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 44, transform: `translateY(${(1 - listOut) * -8}px)` }}>
                  <div style={{ width: 10, height: 10, borderRadius: 5, background: FILM_COLORS2.data, opacity: 0.6, boxShadow: `0 0 8px rgba(212,163,115,0.4)` }} />
                  <div style={{ width: 700 - i * 80, height: 14, background: FILM_COLORS2.paperWhite, opacity: 0.22 }} />
                </div>
              ))}
            </div>
          ) : null}

          {/* About HUD 资料面板（springIn 浮起 20f 后凝住） */}
          <div style={{ position: 'absolute', left: 610, top: 210, width: 700, height: 500, opacity: Math.min(1, cardP * 1.4), transform: `translateY(${(1 - cardP) * 20}px) scale(${0.97 + cardP * 0.03})` }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 10, background: FILM_COLORS2.panel, border: `1px solid ${FILM_COLORS2.line}`, boxShadow: `0 0 34px rgba(212,163,115,0.12), 0 24px 54px rgba(0,0,0,0.55)` }} />
            {/* GitHub 真头像（人物照片非页面快照，保留；圆形低饱和 + 琥珀描边环） */}
            <div style={{ position: 'absolute', left: 50, top: 50, width: 130, height: 130, borderRadius: 65, overflow: 'hidden', border: `1px solid ${FILM_COLORS2.dataDim}`, boxShadow: `0 0 18px rgba(212,163,115,0.28)`, filter: 'saturate(0.55)' }}>
              <Img src={staticFile('wuh-site-intro-v3/avatar.png')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ position: 'absolute', left: 210, top: 66, ...writeFade(frame, 62) }}>
              <div style={{ fontFamily: fontFamilies.serif, fontSize: 42, color: FILM_COLORS2.paperWhite, ...glowText(FILM_COLORS2.paperWhite, 0.28) }}>stack-wuh</div>
              <div style={{ fontFamily: fontFamilies.mono, fontSize: 16, color: FILM_COLORS2.textMuted, marginTop: 10, letterSpacing: '0.08em' }}>ShenZhen, GuangDong, China</div>
            </div>
            {/* 「68」public repos（微滚主角，落定 78 静默） */}
            <div style={{ position: 'absolute', left: 50, top: 238, display: 'flex', alignItems: 'baseline', gap: 16, ...writeFade(frame, 66) }}>
              <span
                style={{
                  fontFamily: fontFamilies.mono,
                  fontSize: 62,
                  fontWeight: 700,
                  color: FILM_COLORS2.data,
                  fontVariantNumeric: 'tabular-nums',
                  display: 'inline-block',
                  transform: `scale(${repos.slam})`,
                  ...glowText(FILM_COLORS2.data, repos.glow),
                }}
              >
                {repos.text}
              </span>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 20, color: FILM_COLORS2.textMuted, letterSpacing: '0.1em' }}>public repos</span>
            </div>
            {/* 落定瞬间（78）：单环 + 金粒，锚在数字视觉中心 */}
            {frame >= REPOS_LAND ? (
              <div style={{ position: 'absolute', left: NUM_CX - 610, top: NUM_CY - 210, width: 0, height: 0, zIndex: 30, pointerEvents: 'none' }}>
                {wave ? <div style={wave.ring2} /> : null}
                {burst.map((p, i) => (
                  <div key={`burst-${i}`} style={p.style} />
                ))}
              </div>
            ) : null}
            {/* bio（标识，write-fade 落位即现） */}
            <div style={{ position: 'absolute', left: 50, top: 330, ...writeFade(frame, 78) }}>
              <span style={{ fontFamily: fontFamilies.serif, fontSize: 30, color: FILM_COLORS2.paperWhite, opacity: 0.85 }}>a boy just ~</span>
            </div>
            <div style={{ position: 'absolute', left: 50, right: 50, top: 392, height: 1, background: FILM_COLORS2.line, opacity: 0.7 }} />
            <div style={{ position: 'absolute', left: 50, top: 418, ...writeFade(frame, 88) }}>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 15, color: FILM_COLORS2.textMuted, letterSpacing: '0.2em' }}>GITHUB · @STACK-WUH</span>
            </div>
          </div>

          {/* 右缘数据流光微启（118–138，透出 2021——下一幕入口） */}
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: 130,
              backgroundImage: `linear-gradient(270deg, rgba(212,163,115,0.4), transparent)`,
              opacity: seam * 0.85,
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: 100,
              top: 0,
              bottom: 0,
              width: 2,
              background: FILM_COLORS2.data,
              opacity: seam * 0.5,
              boxShadow: `0 0 14px 3px rgba(212,163,115,0.4)`,
              pointerEvents: 'none',
            }}
          />
          <div style={{ position: 'absolute', right: 132, top: 548, ...writeFade(frame, 124) }}>
            <span style={{ fontFamily: fontFamilies.mono, fontSize: 17, letterSpacing: '0.3em', color: FILM_COLORS2.data, opacity: seam * 0.9, fontVariantNumeric: 'tabular-nums' }}>2021 →</span>
          </div>
        </AbsoluteFill>
      </CameraRig>
      <HudChrome label="wuh.site · PROFILE" readout="@stack-wuh · SZ" />
      <Grade2 id="GR2-02" />
    </AbsoluteFill>
  );
};

export default S05;
