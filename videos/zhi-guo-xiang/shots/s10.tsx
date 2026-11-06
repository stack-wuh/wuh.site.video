/* S10 · 三枚金针：他递，她接 180f
 * v11 §3.2（用户意见 4「做成给的动作与过渡动画」）：v10 只是「她的掌摊开 + 三枚针在那里」，
 * 没有「给」的动作、也没交代谁给的。本镜改成一段有先后顺序的动作戏（底图 p-palm2 = 她的摊掌）：
 *
 *   0–45f   她的手掌在前景摊开（底图轻微推近 + 呼吸）——观众先认出「这是她的掌」；
 *   45–72f  他的宽袖手从画面上方进入（深墨宽袖 + 素色手 + 垂下的袖口），掌心向下，悬在掌上；
 *   72–104f 三枚金针**逐枚**落下：间隔 12f、每枚落 8f，边落边转（96°→落定角），落定那一帧一点反光；
 *           同时她的手指一分分收拢（掌形微收 + 指根渐深的压影）；
 *   108–136f 他的手加速退出画面上方（最后 6f 明显加速），三枚针留在她掌里；
 *   150–180f 掌再微收一档 + 火金高光打一次（灯光/火点经过掌面），字幕起。
 *
 * 为什么手与针是代码画的：底图里只有她的手（art 口径），静态图演不出「进入—逐枚—退出」的动作顺序。
 * 他的手只画**宽袖 + 袖口内里 + 三根捏针指尖**，不画整只手（白描的手画坏就是「两坨黑」）。
 * 她「手指一分分收拢」静态图演不了，用四个弱线索叠出来（lead 已批准）：整掌缩放 3.2%+内旋 2°、
 * 指根处 multiply 压影、指侧影盖住针身一截、末段掌中火金高光。
 * 三枚针落定后的姿态复用 Needles 组件（与 S25 同一套针槽真值口径），落针过程用轻量线段画（8f 一瞬）。
 * 颜色/时长只取 brand/tokens + motion-tokens；无 Math.random；转场遮罩归 ShotShell，镜内不做全屏黑/白。 */
import type { FC } from 'react';
import { Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { colors } from '../../../brand/tokens';
import { Slide } from '../components/SceneKit';
import { Needles } from '../components/Needles';
import { Caption } from '../components/Caption';
import { CLAMP, CURVES, FILM } from '../motion-tokens';

/** 三枚针的落点（针柄坐标 + 针身角度）：针柄靠腕侧（右下手），针尖朝指根（左上），散在掌心。 */
const SLOTS = [
  { origin: [1128, 604] as [number, number], tilt: -142, release: 72, land: 80, from: [962, 212] as [number, number] },
  { origin: [1170, 644] as [number, number], tilt: -148, release: 84, land: 92, from: [981, 212] as [number, number] },
  { origin: [1142, 684] as [number, number], tilt: -154, release: 96, land: 104, from: [1000, 212] as [number, number] },
];
const NEEDLE_LEN = 300;
const FALL = 8; // 每枚落下 8f
const EXIT_START = 108;
const EXIT_END = 136;

/** 他的宽袖手：从画面上方垂下来的深墨宽袖 + 袖口里探出的三根捏针手指。
 *  不画整只手（白描的手最难画，画坏就成「两坨黑色」）：只给**宽袖 + 袖口内里 + 三根指尖 + 针**，
 *  衬着素纸，读起来就是「一只宽袖的手递下来」。dy 由调用方给（-470 画外；0 悬在她掌上）。 */
const HIS_HAND: FC<{ dy: number; holding: boolean[] }> = ({ dy, holding }) => (
  <g transform={`translate(0 ${dy})`}>
    {/* 袖影先落：袖口在她掌上投一块淡影，人与掌的空间关系才成立 */}
    <ellipse cx={1014} cy={520} rx={236} ry={78} fill={colors.ink} opacity={0.09} filter="url(#s10-soft)" />
    {/* 宽袖：上端出画，袖口三道垂褶；左边一道受光把形体托出来 */}
    <path
      d="M 700 -320 C 700 -150 748 10 834 84 C 884 128 926 122 960 94
         C 996 130 1044 144 1086 120 C 1126 98 1164 112 1194 148
         C 1240 98 1272 8 1284 -150 L 1284 -320 Z"
      fill={colors.ink}
    />
    {/* 内褶：极克制的两道暖灰，避免深墨成一块死黑 */}
    <path d="M 764 -300 C 772 -120 808 22 874 86" fill="none" stroke={colors.muted} strokeWidth={2} opacity={0.16} />
    <path d="M 1230 -280 C 1222 -96 1194 12 1132 108" fill="none" stroke={colors.muted} strokeWidth={2} opacity={0.13} />
    {/* 受光边：袖左缘一线纸色 */}
    <path d="M 706 -300 C 706 -140 752 6 834 78" fill="none" stroke={colors.paper} strokeWidth={1.4} opacity={0.12} />
    {/* 袖口内里：比他袍子更暗一层，手指从这片暗里出来 */}
    <path
      d="M 852 88 C 900 136 962 130 998 92 C 1038 134 1104 136 1156 96
         C 1180 126 1170 168 1126 188 C 1048 220 948 216 884 184 C 840 162 838 118 852 88 Z"
      fill={colors.bg}
      opacity={0.72}
    />
    {/* 三根捏针的指尖：小、圆、带一道墨线（只给指尖，不给手背） */}
    {holding.map((h, i) =>
      h ? (
        <g key={i}>
          <path
            d={`M ${974 + i * 23} 150 Q ${966 + i * 21} 186 ${962 + i * 19} 212`}
            fill="none"
            stroke={colors.paperMuted}
            strokeWidth={17}
            strokeLinecap="round"
          />
          <path
            d={`M ${974 + i * 23} 150 Q ${966 + i * 21} 186 ${962 + i * 19} 212`}
            fill="none"
            stroke={colors.ink}
            strokeWidth={1}
            strokeLinecap="round"
            opacity={0.42}
          />
        </g>
      ) : null,
    )}
    {/* 拇指从外侧压住针束 */}
    <path d="M 1086 152 Q 1108 186 1092 216" fill="none" stroke={colors.paperMuted} strokeWidth={15} strokeLinecap="round" />
    <path d="M 1086 152 Q 1108 186 1092 216" fill="none" stroke={colors.ink} strokeWidth={1} opacity={0.4} />
    {/* 还捏在手里的针：成束垂着，随他的手一起进画/退画 */}
    {holding.map((h, i) =>
      h ? (
        <g key={`hang-${i}`} opacity={0.95}>
          <line x1={962 + i * 19} y1={210} x2={952 + i * 18} y2={210 + 116} stroke={FILM.fireGold} strokeWidth={1.5} strokeLinecap="round" />
          <line x1={962 + i * 19} y1={210} x2={954 + i * 18} y2={210 + 34} stroke={colors.gold} strokeWidth={5.5} strokeLinecap="round" />
          <circle cx={952 + i * 18} cy={210 + 116} r={1.6} fill={colors.gold} />
        </g>
      ) : null,
    )}
  </g>
);

const S10: FC = () => {
  const f = useCurrentFrame();

  /* 他的手的进/退（dy：-470 在画外 → 0 悬在掌上 → -560 退走） */
  const enter = interpolate(f, [45, 72], [-470, 0], { ...CLAMP, easing: CURVES.cineEaseOut });
  const leave = interpolate(f, [EXIT_START, EXIT_END], [0, -560], { ...CLAMP, easing: CURVES.cineEaseIn });
  const dy = enter + leave;

  /* 她收指：每落一枚收一分（0 → 1），150f 后再收一档微调 */
  const closed = interpolate(f, [80, 92, 104], [0, 1 / 3, 2 / 3], CLAMP) + interpolate(f, [104, 110], [0, 1 / 3], CLAMP);
  const curl = interpolate(f, [150, 178], [0, 0.22], CLAMP) + closed;

  /* 掌中高光：150–180f 打一次（淡入 8f、峰值 6f、余晖 14f） */
  const glint = interpolate(f, [150, 158, 166, 180], [0, 0.9, 1, 0.55], CLAMP);

  /* 落针反光：落定那一帧起 6f 的短闪 */
  const landGlint = (land: number) => interpolate(f, [land - 1, land, land + 2, land + 6], [0, 1, 0.7, 0], CLAMP);

  return (
    <Slide zoom={[1.02, 1.06]}>
      {/* 底图：她的手。收指时整掌微微内收（scale + 一点腕部内旋），不重画手指 */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <Img
          src={staticFile('zhi-guo-xiang/scene/p-palm2.jpg')}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${1 - 0.032 * curl}) rotate(${-2 * curl}deg)`,
            transformOrigin: '54% 56%',
          }}
        />
      </div>

      {/* 指根与指尖的收拢压影：手指一分分合，暗部就从指根往指尖吃掉 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 30% 24% at 34% 33%, ${colors.ink} 0%, transparent 72%)`,
          opacity: 0.34 * curl,
          mixBlendMode: 'multiply',
          filter: 'blur(10px)',
        }}
      />

      {/* 指尖一侧再压一道：手指真收起来时，掌面与指腹之间会暗一条 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse 26% 16% at 30% 46%, ${colors.ink} 0%, transparent 70%)`,
          opacity: 0.2 * curl,
          mixBlendMode: 'multiply',
          filter: 'blur(16px)',
        }}
      />

      {/* 他的宽袖手（整层只在 44–138f 存在；dy 由进/退两段相加） */}
      <svg
        viewBox="0 0 1920 1080"
        style={{ position: 'absolute', inset: 0 }}
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="s10-soft" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation={16} />
          </filter>
        </defs>
        <HIS_HAND dy={dy} holding={SLOTS.map((s) => f < s.release)} />
      </svg>

      {/* 正在落下的针：8f 一枚，落定后交给下面的 Needles 真值层 */}
      <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
        {SLOTS.map((s, i) => {
          const t = (f - s.release) / FALL;
          if (t < 0 || t >= 1) return null;
          const k = t * t; // 重力：越落越快
          const hx = s.from[0] + (s.origin[0] - s.from[0]) * k;
          const hy = s.from[1] + (s.origin[1] - s.from[1]) * k;
          const ang = ((96 + (s.tilt + 360 - 96) * t) * Math.PI) / 180;
          const tx = hx + Math.cos(ang) * NEEDLE_LEN;
          const ty = hy + Math.sin(ang) * NEEDLE_LEN;
          const wx = hx + Math.cos(ang) * NEEDLE_LEN * 0.3;
          const wy = hy + Math.sin(ang) * NEEDLE_LEN * 0.3;
          return (
            <g key={i} opacity={0.95}>
              <line x1={hx} y1={hy} x2={tx} y2={ty} stroke={FILM.fireGold} strokeWidth={1.6} strokeLinecap="round" />
              <line x1={hx} y1={hy} x2={wx} y2={wy} stroke={colors.gold} strokeWidth={6} strokeLinecap="round" />
              <circle cx={tx} cy={ty} r={1.7} fill={colors.gold} />
            </g>
          );
        })}
      </svg>

      {/* 落定的三枚针：复用 Needles（与 S25 同一套针槽真值），逐枚出现 */}
      <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
        <defs>
          <filter id="s10-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation={5} />
          </filter>
        </defs>
        {SLOTS.map((s, i) =>
          f >= s.land ? (
            <g key={i}>
              {/* 落点反光：落定一瞬金针边缘亮一下 */}
              <ellipse
                cx={s.origin[0] - NEEDLE_LEN * 0.28}
                cy={s.origin[1] - NEEDLE_LEN * 0.16}
                rx={70}
                ry={18}
                fill={FILM.fireGold}
                opacity={0.3 * landGlint(s.land)}
                filter="url(#s10-glow)"
              />
            </g>
          ) : null,
        )}
      </svg>
      {/* 逐枚叠加：每枚针用 Needles 的单枚模式（count=1 → 该针槽的唯一位置） */}
      {SLOTS.map((s, i) => (
        <Needles
          key={i}
          count={1}
          origin={s.origin}
          len={NEEDLE_LEN}
          tilt={s.tilt}
          opacity={f >= s.land ? 1 : 0}
          /* 微距特写：line-art 手掌的墨线约 2.5px，针身若还是 1px 宽就只剩一道金发丝，
             远看读不出"三枚金针"。2.1 是让针柄的缠丝、针身的收尖都还看得见的上限。 */
          width={2.1}
        />
      ))}

      {/* 手指合过来：针被指腹的影子从指侧盖住一截——「握住」比「摊着」多这一层 */}
      <div
        style={{
          position: 'absolute',
          left: 560,
          top: 250,
          width: 640,
          height: 520,
          background: `linear-gradient(72deg, ${colors.ink} 0%, ${colors.ink} 26%, transparent 56%)`,
          opacity: 0.16 * closed,
          mixBlendMode: 'multiply',
          filter: 'blur(26px)',
          pointerEvents: 'none',
        }}
      />

      {/* 掌中高光：150f 后灯/火点经过掌面，一次火金泛光 */}
      <div
        style={{
          position: 'absolute',
          left: 720,
          top: 380,
          width: 560,
          height: 340,
          borderRadius: '50%',
          background: `radial-gradient(ellipse, ${FILM.fireGold} 0%, transparent 68%)`,
          opacity: 0.16 * glint,
          mixBlendMode: 'screen',
          filter: 'blur(26px)',
          pointerEvents: 'none',
        }}
      />
      {/* 针面反光条：跟着三枚针的方向横划一道 */}
      <div
        style={{
          position: 'absolute',
          left: 830,
          top: 486,
          width: 340,
          height: 7,
          borderRadius: 4,
          background: colors.gold,
          opacity: 0.5 * glint,
          mixBlendMode: 'screen',
          filter: 'blur(1.2px)',
          transform: 'rotate(-34deg)',
          transformOrigin: 'left center',
          pointerEvents: 'none',
        }}
      />

      <Caption cue="s10" tone="ink" />
    </Slide>
  );
};

export default S10;