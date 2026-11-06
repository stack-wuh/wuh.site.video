/* S28 · 解剑 → 平放入匣 210f
 *
 * v11 §3.10（用户意见 15「什么动效，难看死了」）：v10 用 `dry` 干笔擦（横向几何条带）演「剑滑入匣」，
 * 那是一排与画面无关的横条。本节整段换成「光与遮挡」，**不出现任何干笔条带/几何蒙版**：
 *   20–70f  解剑：剑影（d-sword-case.tsx SwordShadow）沿一条弧线落向匣口 —— 影层按开着的匣盖四边
 *           裁住、投在盖的内面上（灯在左、剑在灯与盖之间，影子落在那儿是物理上对的），
 *           所以它是「会动的影子」，不是第二把剑；
 *   70–120f 平放入匣：剑影继续朝匣口沉下去，被匣沿一点一点吃掉 —— 先六成，最后 8f 剩下的也没入；
 *           落定那一下灯焰被压一档（LampFlame jolt）、匣口前沿起一点尘（CaseDust）；
 *   150–196f 静，灯火在匣面亮一下（LampFlame boost）。
 * 「合盖」这一段 v11 试过「压平开着的盖 + 平移底图补墙 + 再画一块盖板」，渲出来是直边假墙 + 窄木带，
 * 比不闭盖更出戏，**已按 lead 决定撤掉**（见 components/d-sword-case.tsx 头注释）：
 * 本镜把底图那只开着的盖原样留着，「剑收进木匣」由剑已入匣 + 旁白承担。
 * 已知取舍：底图里她的双手已经把剑按在匣口、剑是烤死的像素动不了，所以「解剑/入匣」由剑影承担。
 * 底图、时长、字幕文案都不动；镜内转场归 ShotShell（首尾墨洇）。 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
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

const S28: FC = () => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const tt = durationInFrames > 1 ? f / (durationInFrames - 1) : 0;
  /* 与 Scene 的 Img 同一套 zoom 换算，叠层才咬得住底图 */
  const s = interpolate(tt, [0, 1], [1.0, 1.04], CLAMP);

  /* ── 解剑：20–70f，影沿弧线落到匣口，缓出 ── */
  const lay = interpolate(f, [20, 70], [0, 1], { ...CLAMP, easing: CURVES.cineEaseOut });
  const bx = (1 - lay) * (1 - lay) * P0.x + 2 * (1 - lay) * lay * PC.x + lay * lay * P2.x;
  const by = (1 - lay) * (1 - lay) * P0.y + 2 * (1 - lay) * lay * PC.y + lay * lay * P2.y;
  const rot = SHADOW.rotStart + (SHADOW.rotFlat - SHADOW.rotStart) * lay;

  /* ── 平放入匣：70–120f，影朝匣口沉下去，被匣沿吃掉；112f 后没入 ── */
  const push = interpolate(f, [70, 120], [0, 1], { ...CLAMP, easing: CURVES.cineEaseInOut });
  const dx = -74 * push;
  const dy = 78 * push;
  const appear = interpolate(f, [20, 46], [0, 1], CLAMP);
  const gone = interpolate(f, [112, 120], [0, 1], CLAMP);
  const shadowOpacity = appear * (1 - gone) * 0.58;
  /* 入匣落定那一拍：灯焰被压一档再晃回来（4f 冲击、10f 回稳） */
  const jolt = interpolate(f, [114, 117, 130], [0, 1, 0], CLAMP);
  /* 150–196f 灯火在匣面亮一下 */
  const boost = interpolate(f, [150, 168, 196], [0, 0.5, 0.05], CLAMP);

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
          <LampFlame frame={f} at={{ x: 492, y: 722 }} size={20} jolt={jolt} boost={boost} />
          <CaseDust frame={f} from={112} />
        </div>
      </AbsoluteFill>
      <Caption text="剑收进木匣，再也没有取出来。" start={56} end={194} />
    </Scene>
  );
};

export default S28;