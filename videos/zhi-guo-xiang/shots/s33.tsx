/* S33 · 解剑 · 入匣 · 合盖（180f · 入「墨洇」）
 *
 * v12 分镜 Act 7：灯下，她把倚天剑从背上解下、平放进木匣、合上。底图 `p-sword-case`（旧，代码动效）。
 *
 * 沿用 v11 已验收的做法（用户意见 15「什么动效，难看死了」的返工结论）：
 *   · 剑影（SwordShadow）沿一条弧线落到匣口——它投在**开着的盖内面**上（灯在左、剑在灯与盖之间），
 *     按盖的四边裁住，所以是会动的影子，不是第二把剑；剑沉下去时是被匣沿吃掉，不是淡出；
 *   · 落定那一下灯焰被压一档（LampFlame jolt）、匣口前沿起一点尘（CaseDust）、末段灯火亮一下。
 *
 * 本镜新增「合上」：**不画盖**（v11 试过压平盖面 + 补墙，渲出来是一块直边假墙，已撤）。
 * 合盖改成纯光的事——92–132f，开着的盖内面转离灯，暗下去；匣口一起吃一层软影；
 * 画面整体再压 0.05 档。观众读到「盖合上了」，而不是「贴了一块板」。
 *
 * 底图坐标（量自 p-sword-case，1920×1080）：剑轴剑尖(700,780)→剑柄(1005,640)、
 * 静置中心 (852,710)、开盖四面 (534,596)-(976,536)-(986,676)-(618,744)、灯焰心 (492,722)。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { colors } from '../../../brand/tokens';
import { Scene } from '../components/SceneKit';
import { Caption } from '../components/Caption';
import { LampFlame } from '../components/d-lamp';
import { CaseDust, LID_OPEN_CSS, SwordShadow } from '../components/d-sword-case';
import { CLAMP, CURVES } from '../motion-tokens';

/** 剑影（投在盖面上）：底图实测剑轴 −24.6°，影形按 62° 落，长 292 / 宽 97。 */
const SHADOW = { w: 97, h: 292, rotFlat: 62, rotStart: 48 };
/** 解剑弧线：持剑位 → 匣口（二次贝塞尔），缓出 */
const P0 = { x: 826, y: 548 };
const PC = { x: 726, y: 570 };
const P2 = { x: 690, y: 636 };

const S33: FC = () => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const tt = durationInFrames > 1 ? f / (durationInFrames - 1) : 0;
  /* 与 Scene 的 Img 同一套 zoom 换算，叠层才咬得住底图 */
  const s = interpolate(tt, [0, 1], [1.0, 1.04], CLAMP);

  /* ── 解剑：18–58f，影沿弧线落到匣口，缓出 ── */
  const lay = interpolate(f, [18, 58], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut });
  const bx = (1 - lay) * (1 - lay) * P0.x + 2 * (1 - lay) * lay * PC.x + lay * lay * P2.x;
  const by = (1 - lay) * (1 - lay) * P0.y + 2 * (1 - lay) * lay * PC.y + lay * lay * P2.y;
  const rot = SHADOW.rotStart + (SHADOW.rotFlat - SHADOW.rotStart) * lay;

  /* ── 平放入匣：58–92f，影朝匣口沉下去，被匣沿吃掉；84f 后没入 ── */
  const push = interpolate(f, [58, 92], [0, 1], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const dx = -74 * push;
  const dy = 78 * push;
  const appear = interpolate(f, [18, 44], [0, 1], CLAMP);
  const gone = interpolate(f, [84, 92], [0, 1], CLAMP);
  const shadowOpacity = appear * (1 - gone) * 0.58;

  /* ── 落定那一拍：灯焰被压一档（4f 冲击、10f 回稳）── */
  const jolt = interpolate(f, [88, 91, 104], [0, 1, 0], CLAMP);

  /* ── 合上（92–132f）：盖内面转离灯、暗下去；匣口吃一层软影 ── */
  const close = interpolate(f, [92, 132], [0, 1], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const lidDark = 0.5 * close;
  const mouthShadow = 0.2 * close;

  /* ── 118–150f：灯火在匣面亮一下，像灯替她把这一晚记住了 ── */
  const boost = interpolate(f, [118, 136, 166], [0, 0.5, 0.05], CLAMP);

  return (
    <Scene name="p-sword-case" zoom={[1.0, 1.04]} warm={0.03}>
      <AbsoluteFill style={{ pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', inset: 0, transform: `scale(${s})`, transformOrigin: '50% 50%' }}>
          {/* 剑影投在开着的盖面上：按盖的四边裁住，沉下去就是被匣沿吃掉 */}
          <div style={{ position: 'absolute', inset: 0, clipPath: `polygon(${LID_OPEN_CSS})` }}>
            <div
              style={{
                position: 'absolute',
                left: bx - SHADOW.w / 2 + dx,
                top: by - SHADOW.h / 2 + dy,
                width: SHADOW.w,
                height: SHADOW.h,
                transform: `rotate(${rot}deg)`,
                opacity: shadowOpacity,
                mixBlendMode: 'multiply',
                filter: 'blur(2.2px)',
              }}
            >
              <SwordShadow style={{ width: '100%', height: '100%' }} />
            </div>
          </div>

          {/* 合盖：盖内面转离灯（只暗下去，不画盖板）。
              注意：这一层**不用 mixBlendMode**——抽帧实测「clipPath + 透明渐变 + multiply」在
              Chromium 里会在盖沿外吐出一块亮灰矩形；改成普通混合的墨色渐变就没有了。 */}
          <div style={{ position: 'absolute', inset: 0, clipPath: `polygon(${LID_OPEN_CSS})` }}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(196deg, ${colors.ink} 0%, transparent 74%)`,
                opacity: lidDark * 0.9,
              }}
            />
          </div>

          {/* 匣口一起吃一层软影：盖口合上，匣里先暗 */}
          <div
            style={{
              position: 'absolute',
              left: 620,
              top: 640,
              width: 420,
              height: 240,
              borderRadius: '50%',
              background: `radial-gradient(ellipse at 50% 50%, ${colors.ink} 0%, transparent 70%)`,
              mixBlendMode: 'multiply',
              opacity: mouthShadow,
              filter: 'blur(26px)',
            }}
          />

          <LampFlame frame={f} at={{ x: 492, y: 722 }} size={20} jolt={jolt} boost={boost} />
          <CaseDust frame={f} from={88} />
        </div>
      </AbsoluteFill>
      <Caption cue="s33" tone="ink" />
    </Scene>
  );
};

export default S33;