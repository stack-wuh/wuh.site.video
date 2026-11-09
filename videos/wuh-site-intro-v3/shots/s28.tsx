/* S28 · Act 5 灯亮 · 局部帧 [0,168) · 168f · 绝对 4086–4254
 *
 * 上线：全片唯一白闪（FN-47：0–3 涨满 CV-06 → 峰值 3=绝对 4089 纯白 3f →
 * 释放 6–18）→ WIN-05 fullLight S01 首页整页自白里显影（brightness 0→1，18–44），
 * 本片唯一一次截图整页点亮（白闪特例，无窗框）；分区 write-fade 按站点真实
 * 0/80/160/240ms（=0/2.4/4.8/7.2f）节奏标题/标语/按钮/图标次第亮起；
 * 缓推 Hero 区（44–104，100→103%，全片 push-in 之一）；整页灯全亮 154=拍212 对音。
 * 转场：入「切」（亮度匹配：上镜白光线 30% → 白闪涨满），出「切」。
 */
import type { FC } from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from 'remotion';
import { staticFile } from 'remotion';
import { colors } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { FILM_COLORS, fullLight, whiteFlashOpacity } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DustField } from '../components/DustField';
import { Grade } from '../components/Grade';
import { PaperGrain } from '../components/PaperGrain';

const TOTAL = 168;
const FLASH_RELEASE = 18;

/** 分区点亮（站点真实节奏 0/2.4/4.8/7.2f，各区内再 stagger） */
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

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      {/* 白闪层（全屏，先于画面） */}
      <AbsoluteFill style={{ background: FILM_COLORS.flashWhite, opacity: flash, zIndex: 60 }} />
      <CameraRig cam={cam}>
        <AbsoluteFill style={{ filter: `brightness(${0.4 + light.bright * 0.6})`, opacity: interpolate(frame, [FLASH_RELEASE, FLASH_RELEASE + 20], [0.4, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
          <DustField act={5} count={20} seedBase="s28" />
          {/* S01 整页（唯一裸贴全屏：白闪特例 WIN-05） */}
          <Img
            src={staticFile('wuh-site-intro-v3/site/s01-home-hero-v1.png')}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {/* 分区点亮遮罩：四区自暗到亮（灯次第亮起） */}
          {[
            { label: 'title', clip: 'inset(0 0 62% 0)' },
            { label: 'slogan', clip: 'inset(38% 0 34% 0)' },
            { label: 'buttons', clip: 'inset(66% 0 18% 0)' },
            { label: 'icons', clip: 'inset(82% 0 0 0)' },
          ].map((z, zi) => (
            <div
              key={z.label}
              style={{
                position: 'absolute',
                inset: 0,
                clipPath: z.clip,
                background: colors.bg,
                opacity: (1 - zoneOpacity(frame, FLASH_RELEASE, zi, 0)) * 0.72,
                pointerEvents: 'none',
              }}
            />
          ))}
          {/* 每盏灯亮时该区域微微浮起（SP-02：整页极轻亮度脉冲） */}
          <AbsoluteFill style={{ background: FILM_COLORS.dawnLight, mixBlendMode: 'soft-light', opacity: interpolate(frame, [FLASH_RELEASE, 60, 154, TOTAL], [0, 0.14, 0.08, 0.06], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), pointerEvents: 'none' }} />
        </AbsoluteFill>
      </CameraRig>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 300, backgroundImage: `linear-gradient(180deg, transparent, ${colors.bg})`, opacity: 0.2 }} />
      <PaperGrain opacity={0.05} />
      <Grade id="GR-07" />
      <Caption text="六月十四日，流量切到新站。灯，次第亮起。" appearAt={24} />
    </AbsoluteFill>
  );
};

export default S28;
