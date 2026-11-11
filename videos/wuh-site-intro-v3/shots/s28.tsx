/* S28 · Act 5 灯亮 · 局部帧 [0,168) · 168f · 绝对 4086–4254
 *
 * V2 深空数据流重写（2026-11-11 品牌暖黑科技）：上线——全片唯一白闪（FN-47：0–3 涨满
 * CV-06 → 峰值 3=绝对 4089 纯白 3f → 释放 6–18）原样保留；WIN-05 整页点亮改为
 * 「线框数据骨架」显影（brightness 0→1，18–44 窗口原样）——首页骨架在线框面板内
 * 分区 write-fade 按站点真实 0/80/160/240ms（=0/2.4/4.8/7.2f）节奏
 * wordmark/标语条/按钮/图标次第亮起（zoneOpacity 函数原样）；缓推 Hero 区
 * （44–104，100→103%，CameraRig 窗口原样）；整页灯全亮 154=拍212 对音（暖金脉冲）。
 * 证据快闪：s01-home-hero 截图降级为辉光小窗（100 出现 → 156 退场，≤2s 口径），
 * 不再整屏铺底。转场：入「切」（亮度匹配：上镜白光线 30% → 白闪涨满），出「切」。
 * 尾帧：线框首屏灯全亮、暖光稳定（交接态：全亮新站首屏，交 s29 下沉）。
 */
import type { FC } from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from 'remotion';
import { staticFile } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES, writeFade } from '../../../brand/motion';
import { FILM_COLORS2, fullLight, glowText, whiteFlashOpacity } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 168;
const FLASH_RELEASE = 18;

/** 分区点亮（站点真实节奏 0/2.4/4.8/7.2f，各区内再 stagger）——原样保留 */
const zoneOpacity = (frame: number, start: number, zone: number, item: number): number => {
  const z0 = start + zone * 2.4 + item * 2;
  return interpolate(frame, [z0, z0 + 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
};

const S28: FC = () => {
  const frame = useCurrentFrame();
  const flash = whiteFlashOpacity(frame + 4086); // whiteFlashOpacity 是绝对帧口径
  const light = fullLight(frame, FLASH_RELEASE);
  const push = interpolate(frame, [44, 104], [1.0, 1.03], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const cam = { scale: push, x: 0, y: 0, rot: 0 };
  /* 证据快闪：s01-home-hero（100 出现 → 156 退场，≤2s 口径） */
  const proofIn = writeFade(frame, 100, true);
  const proofOut = interpolate(frame, [148, 156], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s28v2" stars={44} grid horizon />
      {/* 白闪层（全屏，先于画面） */}
      <AbsoluteFill style={{ background: FILM_COLORS2.paperWhite, opacity: flash, zIndex: 60 }} />
      <CameraRig cam={cam}>
        <AbsoluteFill style={{ filter: `brightness(${0.4 + light.bright * 0.6})`, opacity: interpolate(frame, [FLASH_RELEASE, FLASH_RELEASE + 20], [0.4, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
          {/* 新站首屏线框数据骨架（WIN-05 显影：白里亮起，非截图整页） */}
          <div
            style={{
              position: 'absolute',
              left: 230,
              right: 230,
              top: 170,
              bottom: 230,
              borderRadius: 12,
              border: `1px solid ${FILM_COLORS2.line}`,
              background: FILM_COLORS2.panel,
              boxShadow: `0 0 ${30 + light.bright * 46}px rgba(212,163,115,${0.1 + light.bright * 0.18}), 0 30px 80px rgba(0,0,0,0.5)`,
            }}
          >
            {/* 区 0 · wordmark（站点真实节奏 0） */}
            <div style={{ position: 'absolute', left: 0, right: 0, top: 100, textAlign: 'center', opacity: zoneOpacity(frame, FLASH_RELEASE, 0, 0) }}>
              <span style={{ fontFamily: fontFamilies.serif, fontSize: 88, fontWeight: 700, color: FILM_COLORS2.paperWhite, letterSpacing: '0.06em', ...glowText(FILM_COLORS2.data, 0.5) }}>wuh.site</span>
            </div>
            <div style={{ position: 'absolute', left: 0, right: 0, top: 216, textAlign: 'center', opacity: zoneOpacity(frame, FLASH_RELEASE, 0, 1) }}>
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 22, letterSpacing: '0.5em', color: FILM_COLORS2.textMuted }}>朝 朝 如 念</span>
            </div>
            {/* 区 1 · 标语条（2.4f） */}
            <div style={{ position: 'absolute', left: '50%', top: 320, width: 760, marginLeft: -380, height: 16, borderRadius: 4, background: `rgba(245,240,232,0.4)`, opacity: zoneOpacity(frame, FLASH_RELEASE, 1, 0) }} />
            <div style={{ position: 'absolute', left: '50%', top: 350, width: 520, marginLeft: -260, height: 10, borderRadius: 3, background: `rgba(245,240,232,0.2)`, opacity: zoneOpacity(frame, FLASH_RELEASE, 1, 1) }} />
            {/* 区 2 · 按钮（4.8f） */}
            <div style={{ position: 'absolute', left: 0, right: 0, top: 420, display: 'flex', justifyContent: 'center', gap: 24, opacity: zoneOpacity(frame, FLASH_RELEASE, 2, 0) }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ width: 170, height: 54, borderRadius: 27, border: `1.5px solid ${FILM_COLORS2.line}`, background: `rgba(212,163,115,0.08)`, boxShadow: `0 0 14px rgba(212,163,115,0.14)` }} />
              ))}
            </div>
            {/* 区 3 · 图标（7.2f） */}
            <div style={{ position: 'absolute', left: 0, right: 0, top: 540, display: 'flex', justifyContent: 'center', gap: 30, opacity: zoneOpacity(frame, FLASH_RELEASE, 3, 0) }}>
              {[0, 1, 2, 3].map((i) => (
                <div key={i} style={{ width: 46, height: 46, borderRadius: 8, border: `1px solid ${FILM_COLORS2.line}`, background: `rgba(212,163,115,0.06)` }} />
              ))}
            </div>
          </div>
        </AbsoluteFill>
      </CameraRig>
      {/* 每盏灯亮时的整页极轻亮度脉冲（SP-02：154=拍212 全亮对音收束） */}
      <AbsoluteFill style={{ background: `rgba(233,217,174,0.5)`, mixBlendMode: 'soft-light', opacity: interpolate(frame, [FLASH_RELEASE, 60, 154, TOTAL], [0, 0.14, 0.08, 0.06], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), pointerEvents: 'none' }} />
      {/* 证据快闪：s01-home-hero 真实首屏（辉光小窗，100 出现 → 156 退场） */}
      <div
        style={{
          position: 'absolute',
          right: 140,
          bottom: 160,
          width: 340,
          zIndex: 28,
          opacity: Number(proofIn.opacity ?? 0) * proofOut,
          transform: `${proofIn.transform ?? ''} scale(${interpolate(frame, [100, 112], [1.07, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })})`,
        }}
      >
        <Img
          src={staticFile('wuh-site-intro-v3/site/s01-home-hero-v1.png')}
          style={{
            width: '100%',
            borderRadius: 8,
            border: `1px solid ${FILM_COLORS2.dataDim}`,
            boxShadow: `0 0 30px rgba(212,163,115,0.22), 0 18px 44px rgba(0,0,0,0.6)`,
            display: 'block',
          }}
        />
        <div style={{ position: 'absolute', left: -1, right: -1, top: -1, bottom: -1, borderRadius: 9, border: `1px solid rgba(212,163,115,0.4)`, opacity: 0.6, pointerEvents: 'none' }} />
      </div>
      <HudChrome label="wuh.site · ONLINE" readout="2026-06-14" />
      <Grade2 id="GR2-05" />
      <Caption text="六月十四日，流量切到新站。灯，次第亮起。" appearAt={24} />
    </AbsoluteFill>
  );
};

export default S28;
