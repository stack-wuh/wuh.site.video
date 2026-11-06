/* S09 · 她的视点：她没看见他的脸 210f
 * v11 §3.1（用户意见 3）：v10 的 S09 是 S08 背影的同义反复，本镜改成**她的视点**，拆四层——
 *   ① 背景（压暗、虚焦）：p-sleeve 裁出「他 + 空袖」，缩到画面右 1/3 的中景，blur 让纸面化开；
 *   ② 前景（暗部、实焦）：p-her-up 水平镜像 + 放大 1.3 + 左移，把她的侧后仰视剪影压到画面左侧约 1/4，
 *      且放大后正好铺满画幅（右侧无接缝）。剪影不靠 filter 硬压暗（那会把整张纸一起压成灰雾）：
 *      **三层 multiply 叠同一张图**——纸接近白，三次相乘仍是亮纸；她的人（暗部）被平方三次 → 落成剪影；
 *      再叠一道左侧墨气渐变 + 脸位薄压。
 *   ③ 天空：大雕影子 8f 一次、共 2 次掠过（代码剪影 · ink multiply · 画在**她身后**，
 *      滑到她脸后就被她的轮廓吃掉——只在瞳仁里留一点反光）。
 *   ④ 瞳孔：雕影掠过瞳位的那一帧（78f / 152f），瞳内 ≤3px 火金反光（外圈小晕 + 十字闪帮它在 1080p 里被看见）
 *      + 一小段翅影——观众不靠旁白就看见「她看见了」。
 * 时间：0–20f 被墨洇吃掉（不入场）→ 18–44f 背景与她浮出 → 72–80f 第一次雕影（76f 过瞳）→
 *       146–154f 第二次（150f 过瞳）→ 180–210f 她的侧影淡出一半，只留瞳孔与雕影（接 S10 掌心）。
 * 本镜旁白为空、无字幕；转场遮罩归 ShotShell，镜内不做任何全屏黑/白。 */
import type { FC } from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { Slide } from '../components/SceneKit';
import { DustField } from '../components/DustField';
import { CropImg } from '../components/a-cropimg';
import { CLAMP, FILM } from '../motion-tokens';

/** 她的构图：镜像后整体左移 230px、下沉 60px，放大 1.3 倍刚好铺满画幅（无接缝），
 *  脸落在 x≈30–600（画面左侧 ~1/4 多一点），发髻贴住画框左边，肩背溢出左下角。 */
const HER = { scale: 1.3, tx: -230, ty: 60 };
/** 瞳位（上面的变换后在 1920×1080 画面上的像素坐标）：03:13 渲出后按抽帧实测校准（(430,162)）。 */
const EYE = { x: 430, y: 162 } as const;

/** 背景的他：源图他与空袖约在 x 560–1440 / y 400–1080；脚下对齐画面底，身高约 640px（中景）。 */
const HIM = {
  src: { x: 540, y: 392, w: 900, h: 700 },
  box: { x: 1064, y: 440, w: 823, h: 640 },
  feather: 'radial-gradient(ellipse 58% 62% at 50% 56%, #000 62%, transparent 94%)',
  filter: 'blur(5px) brightness(0.66) saturate(0.5) contrast(1.05)',
} as const;

/** 两次雕影掠过（8f 一次）：半程正落在瞳位附近，影子在她头后被她的轮廓挡住，只在瞳孔里留一点反光。 */
const SWEEPS = [
  { from: { x: 1520, y: 10 }, to: { x: 210, y: 150 }, start: 72, glint: 78 },
  { from: { x: 230, y: 190 }, to: { x: 1540, y: -10 }, start: 146, glint: 150 },
] as const;
const SWEEP_LEN = 8;

/** 大雕影子：两翼后掠 + 翎尖分叉的剪影（远看是一块滑翔的暗形，不是鹰的标本）。 */
const EAGLE_PATH =
  'M0 8 C-18 -2 -38 -8 -58 -10 L-214 -40 C-152 -10 -112 3 -70 12 C-118 15 -158 21 -196 31 ' +
  'C-128 36 -80 33 -30 24 C-10 30 10 30 30 24 C80 33 128 36 196 31 C158 21 118 15 70 12 ' +
  'C112 3 152 -10 214 -40 L58 -10 C38 -8 18 -2 0 8 Z';

/** 瞳内那一点：翅影（multiply）+ 火金反光（screen）两层，峰值只占 1f；尺寸按她这只眼≈40px 宽做。 */
const EyeGlint: FC = () => (
  <>
    <div
      style={{
        position: 'absolute',
        left: EYE.x - 7,
        top: EYE.y - 4,
        width: 14,
        height: 8,
        opacity: 0.5,
        mixBlendMode: 'multiply',
      }}
    >
      <svg viewBox="0 0 14 8" style={{ width: '100%', height: '100%' }}>
        <path d="M1 5 C3 2.6 4.6 2 7 3.4 C9.4 2 11 2.6 13 5 C10.6 4.4 8.8 5 7 6.2 C5.2 5 3.4 4.4 1 5 Z" fill={colors.ink} />
      </svg>
    </div>
    <div
      style={{
        position: 'absolute',
        left: EYE.x - 12,
        top: EYE.y - 8,
        width: 24,
        height: 16,
        mixBlendMode: 'screen',
        filter: 'blur(0.3px)',
      }}
    >
      <svg viewBox="0 0 24 16" style={{ width: '100%', height: '100%' }} preserveAspectRatio="none">
        {/* 晕：让 ≤3px 的点在 1080p 里有存在感（不是把点做大） */}
        <circle cx={12} cy={8} r={7.2} fill={FILM.fireGold} opacity={0.16} />
        <circle cx={12} cy={8} r={4} fill={FILM.fireGold} opacity={0.22} />
        {/* 极短十字闪：4 道 7px 的细光 */}
        <path d="M12 1.4 L12 5 M12 11 L12 14.6 M5.4 8 L8.6 8 M15.4 8 L18.6 8" stroke={FILM.fireGold} strokeWidth={0.7} opacity={0.5} />
        {/* ≤3px 的反光点：r=1.4 → 直径 2.8px */}
        <circle cx={12} cy={8} r={1.4} fill={colors.paper} opacity={0.95} />
        <circle cx={12} cy={8} r={1.4} fill={FILM.fireGold} />
      </svg>
    </div>
  </>
);

const S09: FC = () => {
  const f = useCurrentFrame();

  /* 墨洇在 0–20f 吃掉画面：背景与她在 18–44f 才浮出，入场高潮（第一次雕影）在 72f 之后。 */
  const wake = interpolate(f, [18, 44], [0, 1], CLAMP);
  /* 收尾 30f：她的侧影淡出一半（纸色从她身上吃掉一半暗部），只留瞳孔与雕影。 */
  const herFade = interpolate(f, [178, 208], [1, 0.46], CLAMP);
  /* 火塘余光的呼吸（S08 的光源还在画面左下）：既给她的轮廓一道暖边，也解释暗部从哪来。 */
  const breath = 0.5 + 0.5 * Math.sin((f / 96) * Math.PI * 2);

  return (
    <Slide zoom={[1.0, 1.04]}>
      {/* 纸面：本镜不用整图铺底，人、雕、光按四层重排 */}
      <AbsoluteFill style={{ background: colors.paper }} />

      {/* ① 背景：他（虚焦、压暗、缩到右中景） */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.92 * wake }}>
        <CropImg
          name="p-sleeve"
          src={HIM.src}
          box={HIM.box}
          filter={HIM.filter}
          extraMask={HIM.feather}
        />
      </div>

      {/* ①+ 雕影：两次掠过，8f 一次；影子画在她**身后**，滑到她脸后就被轮廓吃掉——只在瞳仁里留一点反光 */}
      <AbsoluteFill style={{ opacity: wake, mixBlendMode: 'multiply' }}>
        <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
          <defs>
            <filter id="s09-blur" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation={6} />
            </filter>
          </defs>
          {SWEEPS.map((s, i) => {
            const t = (f - s.start) / SWEEP_LEN;
            if (t < 0 || t > 1) return null;
            const x = s.from.x + (s.to.x - s.from.x) * t;
            const y = s.from.y + (s.to.y - s.from.y) * t;
            const o = Math.sin(Math.PI * t) * 0.72;
            return (
              <g key={i} transform={`translate(${x} ${y})`} opacity={o}>
                <path d={EAGLE_PATH} fill={colors.ink} opacity={0.82} filter="url(#s09-blur)" />
                <path d={EAGLE_PATH} fill="none" stroke={colors.ink} strokeWidth={0.9} opacity={0.32} />
              </g>
            );
          })}
        </svg>
      </AbsoluteFill>

      {/* ② 前景：她。三层 multiply 把暗部平方三次 → 剪影；纸接近白，三次相乘仍是亮纸 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          opacity: herFade * (0.5 + 0.5 * wake),
        }}
      >
        {[0, 1, 2].map((k) => (
          <div
            key={k}
            style={{
              position: 'absolute',
              inset: 0,
              mixBlendMode: 'multiply',
              filter: 'brightness(1.05) saturate(0.55)',
            }}
          >
            <Img
              src={staticFile('zhi-guo-xiang/scene/p-her-up.jpg')}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: `translate(${HER.tx}px, ${HER.ty}px) scale(${HER.scale}) scaleX(-1)`,
                transformOrigin: '50% 50%',
              }}
            />
          </div>
        ))}
        {/* 暗部再压一档：左起一道柔和的墨气（她背光的那一侧），脸位再加一层薄压 */}
        <AbsoluteFill
          style={{
            background: `linear-gradient(90deg, ${colors.ink} 0%, ${colors.ink} 30%, transparent 54%)`,
            opacity: 0.34,
            mixBlendMode: 'multiply',
          }}
        />
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse 13% 17% at 23% 22%, ${colors.ink} 0%, transparent 76%)`,
            opacity: 0.3,
            mixBlendMode: 'multiply',
          }}
        />
      </div>

      {/* 火焰余光：从左下打上来，给她一道暖边（也把纸面往暖里带一点） */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 52% 44% at 4% 100%, ${FILM.fireGold} 0%, transparent 70%)`,
          opacity: 0.06 + 0.03 * breath,
          mixBlendMode: 'soft-light',
        }}
      />
      {/* 夜色：右上压深一档（左下的火光是唯一光源），并收一个轻角晕 */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(206deg, ${colors.ink} 0%, transparent 44%)`,
          opacity: 0.2,
          mixBlendMode: 'multiply',
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 74% 70% at 44% 40%, transparent 44%, ${colors.ink} 100%)`,
          opacity: 0.34,
          mixBlendMode: 'multiply',
        }}
      />

      {/* ④ 瞳孔：雕影过瞳那一帧（78f / 152f）的 ≤3px 火金反光 + 翅影 */}
      <AbsoluteFill style={{ opacity: wake }}>
        {SWEEPS.map((s, i) => {
          const peak = s.glint;
          const g = interpolate(f, [peak - 2, peak, peak + 2], [0, 1, 0], CLAMP);
          return g > 0.01 ? (
            <div key={i} style={{ opacity: g }}>
              <EyeGlint />
            </div>
          ) : null;
        })}
      </AbsoluteFill>

      <DustField act={2} count={22} seedBase="s09-sky" wind={12} />
    </Slide>
  );
};

export default S09;