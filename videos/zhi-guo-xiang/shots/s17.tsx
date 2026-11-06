/* S17 · 渡口：她背着剑从栈桥走向船头 210f
 *
 * design-v11 §3.5（用户意见 8「渡口表现得不完美」）：v10 只有一条雾带 + 小船，缺渡口的实体。
 * 改法：底图换 p-ferry-mist（栈桥/石阶/渡船/桩/缆绳/水/对岸山影，无人），本镜只叠「动」的四层：
 *   ① 她（XiangFigure 20 岁背影 + 背上的剑）从栈桥走向船头：走路循环 60f（每 30f 一步、脚落时身最低），
 *      路径沿栈桥中线上桥、末段踏上船头；横移速度按栈板间距给，脚步落点踩在栈板上；
 *   ② 水面横向波纹（WaveField 低频、低幅，clipPath 只给水域，不画到栈桥/船身以上）；
 *   ③ 缆绳随水轻摆（贴着底图那根缆绳描一条细线，±2px 摆，读作「绳在动」而不是第二根绳）；
 *   ④ 对岸两点船灯暖点（火金，微闪）。
 * 镜头：横移跟拍 40px（自左向右）——底图与所有世界层一起得到 camX 位移，她自己的位移另算，
 *       所以她在栈桥上的相对位置不会被镜头漂移带歪。
 * 验收：静帧能数出「栈桥 + 渡船 + 缆绳 + 水」四件事。
 *
 * 底图 p-ferry-mist 由美术组生成；锚点按 1920×1080 实测写死（图若换，只改这几个常量）。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { Scene } from '../components/SceneKit';
import { WaveField } from '../components/WaveField';
import { Sword } from '../components/Objects';
import { XiangFigure } from '../components/Figure';
import { FILM, CLAMP, STROKE } from '../motion-tokens';

/** 本镜时长（manifest 固定 210f；不用 useVideoConfig——整片里拿到的是根 comp 时长） */
const TOTAL = 210;

/** 她这条路：栈桥近端 → 桥中 → 船头（二次曲线；三个点按底图实测） */
const WALK = { p0: { x: 215, y: 908 }, ctrl: { x: 420, y: 776 }, p1: { x: 680, y: 692 }, h0: 288, h1: 226 };
/** 栈板间距（底图上量；一步 30f ≈ 跨 2–3 块板，脚步落点因此落在板缝上） */
const PLANK_PITCH = 34;
/** 缆绳：贴着底图那根（岸桩水线 → 船头系船环），中段给自重下垂 */
const ROPE = { post: { x: 746, y: 688 }, bow: { x: 1010, y: 730 } };
/** 对岸两点船灯（隔着河，很小，不能抢人物） */
const LAMPS = [
  { x: 1448, y: 502, phase: 0 },
  { x: 1562, y: 516, phase: 1.9 },
];

const TAU = Math.PI * 2;

/** 对岸船灯：一个暖点 + 一圈柔光，像隔着河的灯 */
const BoatLamps: FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {LAMPS.map((l, i) => {
        const flick = 0.62 + 0.16 * Math.sin((f / 26) * TAU + l.phase) + 0.06 * Math.sin((f / 9) * TAU + l.phase * 2);
        return (
          <div key={i} style={{ position: 'absolute', left: l.x, top: l.y }}>
            <div
              style={{
                position: 'absolute',
                left: -26,
                top: -26,
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${FILM.fireGold} 0%, transparent 66%)`,
                opacity: 0.36 * flick,
                filter: 'blur(3px)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: -1.9,
                top: -1.9,
                width: 3.8,
                height: 3.8,
                borderRadius: '50%',
                background: colors.gold,
                opacity: flick,
              }}
            />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const S17: FC = () => {
  const f = useCurrentFrame();

  /* 镜头横移：与 <Scene driftX> 同一条线性插值，世界层（她/缆绳/船灯）跟着一起走 */
  const camX = interpolate(f, [0, TOTAL - 1], [20, -20], CLAMP);

  /* 她：0–22f 墨还没退完（不动），22f 起走。走速由「一块栈板 = 一步的三分之一」给：
     每 30f 一步、一步跨 3 块板（PLANK_PITCH），所以脚落点总在板缝上；路径长度按二次曲线数值积分。 */
  const stepFrames = 30;
  const speed = (3 * PLANK_PITCH) / stepFrames;
  const pathLen = (() => {
    let len = 0;
    let px = WALK.p0.x;
    let py = WALK.p0.y;
    for (let i = 1; i <= 24; i++) {
      const t = i / 24;
      const mt = 1 - t;
      const x = mt * mt * WALK.p0.x + 2 * mt * t * WALK.ctrl.x + t * t * WALK.p1.x;
      const y = mt * mt * WALK.p0.y + 2 * mt * t * WALK.ctrl.y + t * t * WALK.p1.y;
      len += Math.hypot(x - px, y - py);
      px = x;
      py = y;
    }
    return len;
  })();
  const walkT = Math.min(1, (Math.max(0, f - 22) * speed) / pathLen);
  /* 二次曲线：栈桥中线上桥，末段踏上船头 */
  const mt = 1 - walkT;
  const walkX = mt * mt * WALK.p0.x + 2 * mt * walkT * WALK.ctrl.x + walkT * walkT * WALK.p1.x;
  const footY = mt * mt * WALK.p0.y + 2 * mt * walkT * WALK.ctrl.y + walkT * walkT * WALK.p1.y;
  const h = WALK.h0 + (WALK.h1 - WALK.h0) * walkT;
  const w = h * (120 / 320);
  /* 走路循环 60f：每 30f 落一步；落地时身体最低（bob 的极小值） */
  const cycle = ((f + 8) % 60) / 60;
  const bob = Math.abs(Math.sin(cycle * Math.PI * 2)) * 3.4;
  /* 左右脚：按步频换桩（two-frame leg cycle 由图形差给出，不加第二个人） */
  const stride = Math.floor(((f + 8) % 60) / stepFrames) % 2;
  const hem = Math.sin((f / 60) * TAU) * 2.6;
  const tail = Math.sin((f / 60) * TAU - 0.6) * 3.2;
  /* 脚步接触的暗点：落地那一拍最实 */
  const contact = Math.max(0, Math.cos(cycle * Math.PI * 2));

  /* 缆绳：贴着底图那根描，两个不同周期的正弦叠加，摆幅 ≤2.4px（水在动，绳只是随一下） */
  const ropeSway = Math.sin((f / 84) * TAU) * 1.7 + Math.sin((f / 47) * TAU + 1.1) * 0.8;

  /* 剑：斜背在背后，剑柄过右肩；人转步时剑穗有一点滞后 */
  const swordH = h * 0.94;
  const swordW = swordH * (60 / 260);
  const swordRot = 19 + 1.2 * Math.sin((f / 60) * TAU);

  return (
    <Scene name="p-ferry-mist" zoom={[1.048, 1.048]} driftX={[20, -20]} warm={0.14}>
      {/* 晨雾抬一层纸白，让这张比全片更蓝的底图回到绢本调子 */}
      <AbsoluteFill style={{ background: colors.paper, opacity: 0.1, pointerEvents: 'none' }} />

      {/* ③ 水面：只在水域（下三分之一靠下）走横向波纹，幅很小、很慢，读「河在动」 */}
      <WaveField
        seed="s17-water"
        band={[0.52, 0.995]}
        amp={6}
        speed={0.085}
        opacity={0.32}
        rows={9}
        style={{ clipPath: 'polygon(0px 1080px, 1920px 1080px, 1920px 545px, 1150px 555px, 900px 600px, 700px 650px, 500px 730px, 300px 840px, 150px 950px, 0px 1080px)' }}
      />

      {/* ② 缆绳：贴底图那根走，随水轻摆（描在原有绳上，不画第二根） */}
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <path
          d={`M${ROPE.post.x + camX} ${ROPE.post.y} Q${(ROPE.post.x + ROPE.bow.x) / 2 + camX} ${(ROPE.post.y + ROPE.bow.y) / 2 + 24 + ropeSway} ${ROPE.bow.x + camX} ${ROPE.bow.y}`}
          fill="none"
          stroke={colors.ink}
          strokeWidth={STROKE.S1}
          strokeLinecap="round"
          opacity={0.5}
        />
        <path
          d={`M${ROPE.post.x + camX} ${ROPE.post.y - 1.1} Q${(ROPE.post.x + ROPE.bow.x) / 2 + camX} ${(ROPE.post.y + ROPE.bow.y) / 2 + 22 + ropeSway} ${ROPE.bow.x + camX} ${ROPE.bow.y - 1.1}`}
          fill="none"
          stroke={colors.paperMuted}
          strokeWidth={0.8}
          strokeLinecap="round"
          opacity={0.34}
        />
      </svg>

      {/* ④ 对岸两点船灯（世界层，跟镜头一起平移） */}
      <div style={{ position: 'absolute', inset: 0, transform: `translateX(${camX}px)`, pointerEvents: 'none' }}>
        <BoatLamps />
      </div>

      {/* ① 她：背剑，从栈桥走向船头。剑在身后画，剑柄过右肩 */}
      <div style={{ position: 'absolute', inset: 0, transform: `translateX(${camX}px)`, pointerEvents: 'none' }}>
        <div
          style={{
            position: 'absolute',
            left: walkX - w * 0.16,
            top: footY - h - 8,
            width: swordW,
            height: swordH,
            transform: `rotate(${swordRot}deg)`,
            transformOrigin: '50% 42%',
            opacity: 0.92,
          }}
        >
          <Sword state="back" style={{ width: '100%', height: '100%' }} />
        </div>

        {/* 脚下的接触暗点（栈板上的影子）：落地一拍最实 */}
        <div
          style={{
            position: 'absolute',
            left: walkX - w * 0.42,
            top: footY - 7,
            width: w * 0.84,
            height: 14,
            borderRadius: '50%',
            background: colors.ink,
            opacity: 0.13 + contact * 0.12,
            filter: 'blur(3px)',
          }}
        />

        <div style={{ position: 'absolute', left: walkX - w / 2, top: footY - h - bob, width: w, height: h }}>
          <XiangFigure
            age="20"
            pose={stride === 0 ? 'walk' : 'stand'}
            flow={{ hem, tail }}
            opacity={0.9}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </div>
    </Scene>
  );
};

export default S17;