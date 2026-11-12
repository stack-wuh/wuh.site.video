/* S08 · Act 2 旧屋 · 局部帧 [0,168) · 168f · 绝对 972–1140
 *
 * V3 批次 A 重做（2026-11-12 六门验收 + 审计返工单 · 审计重定义：PM2→Docker = 两块技术栈块
 * 形变换装）：
 * 【承接】首帧承接 s07 尾帧交出的「闲章冻帧、朱色未干」——誓已立，本镜亮手艺：服务栏
 *         SERVICES · 2021，旧守夜人 PM2 正在岗。
 * 【触发】主动作 = 岗位换装形变：PM2 指示灯先亮（24–34 原窗=拍50）后熄（48–68 原窗），
 *         52–72 整块 rotateY 折面退场（形变换装·让位）；Docker 84–88 rotateY 74°→0 翻折
 *         接棒入位，88=绝对 1060=拍53（对音，絕不动）落定即 SLAM——冲击波+金粒+辉光脉冲；
 *         容器泊位 92–116 staggerLand 逐格点亮，100 起状态读数 ACTIVE（原窗）；Nginx 底座
 *         20 起入场后常亮不动。
 * 【展开】逐拍帧表（局部帧，fps=30）：
 *   [0–9]     handheld('s08-cam',1.1) + dataCurtain('s08-rain',8 列,110)；
 *   [10–18]   服务栏标题 SERVICES · 2021 writeFade；
 *   [12–26]   PM2 块 springIn 入位（translateX −40→0）；Nginx 20 起 springIn 入位；
 *   [24–34]   PM2 指示灯亮（拍50 原窗），读数 RUNNING；
 *   [48–68]   PM2 灯熄（原窗）→ 读数 EXITED；曝光 −8%（原窗，熄灯压暗）；
 *   [52–72]   PM2 块形变换装退场：rotateY 0→−78° + 左移下沉 + 压暗成幽灵牌（折面让位）；
 *   [84–88]   Docker 块 rotateY 74°→0 翻折入位（springIn 同窗），88 落定=拍53：
 *             shockwave('212,163,115') 双环 + sparkBurst('s08-burst',12 粒) + 灯亮辉光脉冲；
 *   [92–116]  容器泊位 5 格 staggerLand(5,92,24,'accel') 逐格点亮（92/100/106/111/116）；
 *   [100]     Docker 读数 → ACTIVE（原窗）；Nginx 常亮呼吸（lamp 微正弦）；
 *   [148–168] rack focus 下移：2021-04 设计稿线框掠入即收（原窗）——尾帧交接态。
 * 【交接】尾帧 = Docker 与 Nginx 两牌并亮、PM2 幽灵牌收回阴影、设计稿沉底（manifest
 *         endFrameDesc：Docker 与 Nginx 两牌并亮，设计稿收回阴影）→ 交 s09《搬山计划》。
 * 意义一句话：旧守夜人 PM2 折身退位，Docker 翻身上岗——旧站长的手艺升级，泊位一格格点亮。
 * 时间轴零改动：168f / PM2 亮 24–34 熄 48–68 / Docker 84–100（88 对音）/ 泊位 92–116 / rack 148–168 / Caption（appearAt 14）原样。
 * 转场：入「切」出「切」。字幕安全窗：start≥14、end≤156。
 */
import type { CSSProperties, FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES, writeFade } from '../../../brand/motion';
import {
  FILM_COLORS2,
  dataCurtain,
  handheld,
  shockwave,
  sparkBurst,
  springIn,
  staggerLand,
} from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 168;
const DOCKER_LAND = 88; // Docker 落定 = 绝对 1060 = 拍53（对音，絕不动）
/** 容器泊位点亮表（accel）：[92, 100, 106, 111, 116] */
const SLOT_LANDS = staggerLand(5, 92, 24, 'accel');
/** Docker 块中心（x 760 + 200 / top 300 + 100） */
const DOCKER_CX = 960;
const DOCKER_CY = 400;

/** 泊位格点亮判定（slots=已点亮比例） */
const slotLit = (slots: number, i: number): boolean => i < Math.round(slots * 5);

/** 技术栈块：名字 + 指示灯 + 状态读数（+ Docker 泊位格） */
const Tile: FC<{
  name: string;
  x: number;
  lamp: number;
  status: string;
  wrap?: CSSProperties;
  slots?: number; // 已点亮泊位数 0–1
  hasSlots?: boolean;
}> = ({ name, x, lamp, status, wrap, slots = 0, hasSlots = false }) => (
  <div style={{ position: 'absolute', left: x, top: 300, ...wrap }}>
    <div
      style={{
        position: 'relative',
        width: 400,
        height: 200,
        borderRadius: 8,
        background: FILM_COLORS2.panel,
        border: `1px solid ${lamp > 0.4 ? FILM_COLORS2.line : FILM_COLORS2.grid}`,
        boxShadow: lamp > 0.4 ? `0 0 24px rgba(212,163,115,0.14), 0 14px 32px rgba(0,0,0,0.45)` : 'none',
      }}
    >
      {/* 指示灯（琥珀状态灯） */}
      <div
        style={{
          position: 'absolute',
          left: 28,
          top: 28,
          width: 14,
          height: 14,
          borderRadius: 7,
          background: lamp > 0.4 ? FILM_COLORS2.data : FILM_COLORS2.textMuted,
          boxShadow: lamp > 0.4 ? `0 0 14px 4px rgba(212,163,115,0.5)` : 'none',
          opacity: 0.3 + lamp * 0.7,
        }}
      />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center', fontFamily: fontFamilies.mono, fontSize: 40, color: FILM_COLORS2.paperWhite, opacity: 0.9 }}>
        {name}
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 128, textAlign: 'center', fontFamily: fontFamilies.mono, fontSize: 14, letterSpacing: '0.3em', color: lamp > 0.4 ? FILM_COLORS2.data : FILM_COLORS2.textMuted }}>
        {status}
      </div>
      {hasSlots ? (
        <div style={{ position: 'absolute', left: 28, right: 28, bottom: 24, height: 10 }}>
          {[0, 1, 2, 3, 4].map((i) => {
            const lit = slotLit(slots, i);
            return (
              <div key={`slot-${i}`} style={{ position: 'absolute', left: i * 68, width: 56, height: 10, borderRadius: 2, background: lit ? FILM_COLORS2.data : FILM_COLORS2.dataDim, opacity: lit ? 0.55 : 0.2, boxShadow: lit ? `0 0 8px rgba(212,163,115,0.4)` : 'none' }} />
            );
          })}
        </div>
      ) : null}
    </div>
  </div>
);

const S08: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hh = handheld('s08-cam', frame, 1.1);
  // PM2：springIn 入位（12）→ 灯 24–34 亮（拍50）→ 48–68 熄 → 52–72 折面退场（形变换装）
  const pm2In = springIn(frame, 12, fps);
  const pm2Lamp = interpolate(frame, [24, 34], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) * (1 - interpolate(frame, [48, 68], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseIn }));
  const foldOut = interpolate(frame, [52, 72], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const pm2Wrap: CSSProperties = {
    transform: `translateX(${(1 - pm2In) * -40 - foldOut * 50}px) translateY(${foldOut * 20}px) perspective(900px) rotateY(${-78 * foldOut}deg) scale(${(0.94 + pm2In * 0.06) * (1 - 0.08 * foldOut)})`,
    opacity: Math.min(1, pm2In * 1.4) * (1 - 0.7 * foldOut),
  };
  // Docker：84–88 rotateY 74°→0 翻折入位 + springIn，88 落定 SLAM
  const dkIn = springIn(frame, 84, fps);
  const dkFlip = interpolate(frame, [84, DOCKER_LAND], [74, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const dkLamp = interpolate(frame, [84, 100], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineAccent });
  const dkGlow = interpolate(frame, [DOCKER_LAND, DOCKER_LAND + 4, DOCKER_LAND + 18], [0.45, 1, 0.5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const dkWrap: CSSProperties = {
    transform: `perspective(900px) rotateY(${dkFlip}deg) scale(${0.95 + dkIn * 0.05})`,
    opacity: Math.min(1, dkIn * 1.4),
  };
  // 泊位点亮比例
  const slots = SLOT_LANDS.filter((l) => frame >= l + 10).length / 5;
  // Docker 落定瞬间（88）：双环 + 金粒
  const wave = shockwave(frame, DOCKER_LAND, '212,163,115');
  const burst = sparkBurst('s08-burst', frame, DOCKER_LAND, 12);
  // Nginx：20 起 springIn 入位后常亮（微正弦呼吸）
  const nxIn = springIn(frame, 20, fps);
  const nxWrap: CSSProperties = { transform: `translateX(${(1 - nxIn) * 30}px)`, opacity: Math.min(1, nxIn * 1.4) };
  // 曝光 −8%（PM2 熄灭时，原窗）
  const exposure = 1 - interpolate(frame, [48, 68], [0, 0.08], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  // 末段 rack focus 下移：设计稿掠入即收（原窗；块高 280 避开字幕安全区）
  const rack = interpolate(frame, [148, TOTAL], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const cam = {
    scale: interpolate(frame, [0, TOTAL], [1.03, 1.06], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }),
    x: interpolate(frame, [0, 20], [50, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut }) + hh.dx,
    y: interpolate(frame, [148, TOTAL], [0, 60], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }) + hh.dy,
    rot: hh.rot,
  };
  const rain = dataCurtain('s08-rain', frame, 8, 110);

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s08v2" stars={50} grid />
      <CameraRig cam={cam}>
        <AbsoluteFill style={{ filter: `brightness(${exposure})` }}>
          {/* 数字雨帘（背景氛围层） */}
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 2, pointerEvents: 'none' }}>
            {rain.map((c, i) => (
              <span key={`rain-${i}`} style={{ position: 'absolute', left: `${c.x}%`, top: c.y, fontFamily: fontFamilies.mono, fontSize: 13, color: FILM_COLORS2.data, opacity: c.o, fontVariantNumeric: 'tabular-nums' }}>
                {c.text}
              </span>
            ))}
          </div>

          {/* 服务栏标题 */}
          <div style={{ position: 'absolute', left: 160, top: 130, ...writeFade(frame, 10) }}>
            <span style={{ fontFamily: fontFamilies.mono, fontSize: 17, color: FILM_COLORS2.textMuted, letterSpacing: '0.36em' }}>SERVICES · 2021</span>
          </div>

          {/* PM2：折面退场成幽灵牌（形变换装 · 让位） */}
          <Tile name="PM2" x={760} lamp={pm2Lamp} status={frame >= 68 ? 'EXITED' : 'RUNNING'} wrap={pm2Wrap} />
          {/* Docker：翻折接棒入位（88=拍53 落定 SLAM） */}
          <Tile name="Docker" x={760} lamp={dkLamp} status={frame >= 100 ? 'ACTIVE' : 'BOOTING'} wrap={dkWrap} slots={slots} hasSlots />
          {/* Nginx：底座常亮 */}
          <Tile name="Nginx" x={1340} lamp={0.35 + Math.sin(frame / 40) * 0.05} status="RUNNING" wrap={nxWrap} />

          {/* Docker 落定瞬间（88）：双环 + 金粒 + 灯位辉光脉冲，锚块中心（960,400） */}
          {frame >= DOCKER_LAND ? (
            <>
              <div style={{ position: 'absolute', left: DOCKER_CX, top: DOCKER_CY, width: 0, height: 0, zIndex: 30, pointerEvents: 'none' }}>
                {wave ? <div style={wave.ring1} /> : null}
                {wave ? <div style={wave.ring2} /> : null}
                {burst.map((p, i) => (
                  <div key={`burst-${i}`} style={p.style} />
                ))}
              </div>
              <div style={{ position: 'absolute', left: 760, top: 300, width: 400, height: 200, borderRadius: 8, zIndex: 26, pointerEvents: 'none', boxShadow: `0 0 ${Math.round(20 + dkGlow * 26)}px rgba(212,163,115,${dkGlow * 0.4})` }} />
            </>
          ) : null}

          {/* 阴影里的 2021-04 UI 设计稿线框（rack focus 下移时掠入） */}
          <div style={{ position: 'absolute', left: 480, top: 640, width: 960, height: 280, opacity: rack * 0.85, filter: `blur(${(1 - rack) * 3}px)` }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 8, background: FILM_COLORS2.panel, border: `1px solid ${FILM_COLORS2.grid}` }} />
            <div style={{ position: 'absolute', left: 30, top: 26, display: 'flex', gap: 10 }}>
              {[FILM_COLORS2.sealRed, FILM_COLORS2.gold, FILM_COLORS2.data, FILM_COLORS2.textMuted].map((c, i) => (
                <div key={`chip-${i}`} style={{ width: 40, height: 40, borderRadius: 5, background: c, opacity: 0.45 }} />
              ))}
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 15, color: FILM_COLORS2.textMuted, alignSelf: 'center', marginLeft: 12 }}>2021-04 · 第一张设计稿</span>
            </div>
            {[0, 1, 2].map((i) => (
              <div key={`draft-${i}`} style={{ position: 'absolute', left: 30, top: 100 + i * 46, width: 880 - i * 140, height: 12, background: FILM_COLORS2.paperWhite, opacity: 0.12 }} />
            ))}
          </div>
        </AbsoluteFill>
      </CameraRig>
      <HudChrome label="wuh.site · SERVICES" readout={frame >= 100 ? 'DOCKER · ACTIVE' : 'MIGRATING…'} />
      <Grade2 id="GR2-04" />
      <Caption text="2021 年，旧站长出手艺：PM2 换成 Docker，Nginx 一直没离开。" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S08;
