/*
 * C 组笔触层：底图是高调淡彩水彩（纸近白、暗部是淡墨），所以**任何动作层都必须是笔触**，
 * 不是实心墨块——v10 的「两坨黑色」就是直接填 colors.ink 的全身份剪影。
 *
 * 这里只提供两件东西：
 *   1) taperPath：沿二次贝塞尔的「两头收笔」锥形笔触路径（一头宽一头收），
 *      再叠纸白刮擦做飞白——一笔扫过，边缘是毛的，不是几何条带；
 *   2) SleeveRaise：S21 杨过「抬手到面具」的那条袖子（只有袖 + 手，躯干仍在底图里）。
 *      形制是两段臂 + 一段垂下来的钟形袖布（宽袖抬起时下摆仍垂），不是一根管子；
 *      颜色按底图长袍的墨浓度取（tone），贴在底图上像同一支笔画出来的。
 *
 * 坐标基准 1920×1080（与底图同坐标系）。
 */
import type { FC } from 'react';
import { colors } from '../../../brand/tokens';
import { FILM } from '../motion-tokens';

export type Pt = { x: number; y: number };

const lerp = (a: Pt, b: Pt, t: number): Pt => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });

/** 二次贝塞尔上的点与单位法线 */
const quadAt = (p0: Pt, c: Pt, p1: Pt, t: number) => {
  const mt = 1 - t;
  const x = mt * mt * p0.x + 2 * mt * t * c.x + t * t * p1.x;
  const y = mt * mt * p0.y + 2 * mt * t * c.y + t * t * p1.y;
  const dx = 2 * mt * (c.x - p0.x) + 2 * t * (p1.x - c.x);
  const dy = 2 * mt * (c.y - p0.y) + 2 * t * (p1.y - c.y);
  const len = Math.hypot(dx, dy) || 1;
  return { x, y, nx: -dy / len, ny: dx / len };
};

/** 两头收笔的锥形笔触：起点宽 w0、终点收成 w1，两端都收尖（一笔的起笔与收笔）。 */
export const taperPath = (p0: Pt, c: Pt, p1: Pt, w0: number, w1: number): string => {
  const a = quadAt(p0, c, p1, 0);
  const m = quadAt(p0, c, p1, 0.5);
  const b = quadAt(p0, c, p1, 1);
  const half = 0.5;
  const e = 0.45; // 起笔/收笔的尖
  return [
    `M${a.x} ${a.y}`,
    `Q${a.x + a.nx * (w0 * half * e)} ${a.y + a.ny * (w0 * half * e)} ${a.x + a.nx * (w0 * half)} ${a.y + a.ny * (w0 * half)}`,
    `Q${m.x + m.nx * (w0 * 0.55 * half + w1 * 0.45 * half)} ${m.y + m.ny * (w0 * 0.55 * half + w1 * 0.45 * half)} ${b.x + b.nx * (w1 * half)} ${b.y + b.ny * (w1 * half)}`,
    `Q${b.x} ${b.y} ${b.x - b.nx * (w1 * half)} ${b.y - b.ny * (w1 * half)}`,
    `Q${m.x - m.nx * (w0 * 0.55 * half + w1 * 0.45 * half)} ${m.y - m.ny * (w0 * 0.55 * half + w1 * 0.45 * half)} ${a.x - a.nx * (w0 * half)} ${a.y - a.ny * (w0 * half)}`,
    `Q${a.x - a.nx * (w0 * half * e)} ${a.y - a.ny * (w0 * half * e)} ${a.x} ${a.y}`,
    'Z',
  ].join(' ');
};

/** 沿笔触的一小段纸白刮擦（飞白：干笔擦过纸面留下的空档）。 */
const scratch = (p0: Pt, c: Pt, p1: Pt, t0: number, t1: number, off: number) => {
  const a = quadAt(p0, c, p1, t0);
  const b = quadAt(p0, c, p1, t1);
  return `M${a.x + a.nx * off} ${a.y + a.ny * off} Q${(a.x + b.x) / 2 + a.nx * (off * 1.3)} ${(a.y + b.y) / 2 + a.ny * (off * 1.3)} ${b.x + b.nx * off} ${b.y + b.ny * off}`;
};

/** 受光边 opacity：与底图的飞白同族，不要更亮 */
const RIM = 0.26;

/**
 * S21 杨过抬手：垂袖（t=0）→ 面具前（t=1）。**只画袖子，不画躯干**（身体在底图里）。
 *
 * 形制上不是一根「管子」——那会读成一把刀。宽袖抬起时是两段臂 + 一段垂下的袖布：
 *   上臂（肩→肘）→ 前臂（肘→腕）→ 肘前垂下的钟形袖布（被抬臂带高，下摆仍是垂的）→ 腕口 → 手。
 * 画法全是笔触：锥形笔触 + 纸白飞白刮擦 + 一线受光边；墨浓度按底图长袍取（tone）。
 * 手：一小团淡墨 + 三指指向他的面具（face 是头中心，手指朝它）。
 */
export const SleeveRaise: FC<{
  /** 肩（落在底图躯干轮廓上） */
  shoulder: Pt;
  /** t=0 时手所在处（底图里垂手的位置） */
  hang: Pt;
  /** t=1 时手停在面具前 */
  mask: Pt;
  /** 他的头中心：手指朝这里 */
  face: Pt;
  /** 0 = 手垂在身侧；1 = 手停在面具前 */
  t: number;
  /** 末端余摆：抬手将停未停时袖口多荡出去的那点（px） */
  settle?: number;
  weight?: number;
  opacity?: number;
  /** 袖身墨浓度（0–1）：按底图墨色取，别用固定值 */
  tone?: number;
}> = ({ shoulder, hang, mask, face, t, settle = 0, weight = 1, opacity = 1, tone = 0.22 }) => {
  const W = weight;
  const hand = lerp(hang, mask, t);
  /* 肘：垂着时在肩与手之间，抬起时向外、向下走（手臂是弯的，不是一根直杆） */
  const elbowHang = lerp(shoulder, hang, 0.52);
  const elbowRaise = { x: shoulder.x - 26 * W, y: shoulder.y + 42 * W };
  const elbow = lerp(elbowHang, elbowRaise, Math.min(1, t * 1.05));
  /* 钟形袖：挂在肘与前臂下方的那块布（抬手时被带起来，下摆仍垂） */
  const a = lerp(elbow, hand, 0.16);
  const b = lerp(elbow, hand, 0.94);
  const sag = (58 + 26 * (1 - t)) * W;
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const drape = [
    `M${a.x} ${a.y}`,
    `C${a.x - 22 * W + settle} ${a.y + sag * 0.55} ${a.x - 18 * W} ${my + sag * 0.9} ${mx - 14 * W} ${my + sag}`,
    `C${mx + 6 * W} ${my + sag * 1.06} ${b.x + 16 * W + settle} ${b.y + sag * 0.7} ${b.x} ${b.y}`,
    `C${mx + 8 * W} ${my + sag * 0.2} ${mx - 10 * W} ${my + sag * 0.1} ${a.x} ${a.y}`,
    'Z',
  ].join(' ');
  /* 腕口方向：沿前臂 */
  const cuffAngle = Math.atan2(hand.y - elbow.y, hand.x - elbow.x);
  const cuff = { x: hand.x - Math.cos(cuffAngle) * 10 * W, y: hand.y - Math.sin(cuffAngle) * 10 * W };
  /* 手指朝他的面具（脸的一侧） */
  const toFace = { x: face.x - hand.x, y: face.y - hand.y };
  const fl = Math.hypot(toFace.x, toFace.y) || 1;
  const fx = toFace.x / fl;
  const fy = toFace.y / fl;
  const fingers = [-9, 0, 9].map((spread, i) => {
    const bx = hand.x - fy * spread * W;
    const by = hand.y + fx * spread * W;
    return { bx, by, ex: bx + fx * (24 + i * 2) * W - fy * spread * 0.4, ey: by + fy * (24 + i * 2) * W + fx * spread * 0.4 };
  });

  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, opacity, pointerEvents: 'none' }}>
      {/* 袖根：一团极淡的墨，把袖子和底图里的肩接上（不产生直角边） */}
      <circle cx={shoulder.x} cy={shoulder.y} r={38 * W} fill={colors.ink} opacity={tone * 0.35} />
      {/* 钟形袖布：先铺这块，臂再压在它上面 */}
      <path d={drape} fill={colors.ink} opacity={tone * 0.88} />
      <path d={drape} fill="none" stroke={colors.paper} strokeWidth={1.6} opacity={0.16} />
      <path
        d={`M${a.x - 4 * W} ${a.y + 8 * W} C${a.x - 14 * W} ${a.y + sag * 0.5} ${mx - 16 * W} ${my + sag * 0.75} ${mx - 20 * W} ${my + sag * 0.92}`}
        fill="none"
        stroke={colors.ink}
        strokeWidth={7 * W}
        strokeLinecap="round"
        opacity={tone * 0.5}
      />
      <path
        d={`M${mx + 4 * W} ${my + 6 * W} C${mx + 10 * W} ${my + sag * 0.45} ${mx + 14 * W} ${my + sag * 0.6} ${mx + 8 * W} ${my + sag * 0.82}`}
        fill="none"
        stroke={colors.ink}
        strokeWidth={5 * W}
        strokeLinecap="round"
        opacity={tone * 0.42}
      />
      <path
        d={`M${mx - 26 * W} ${my + sag * 0.32} C${mx - 8 * W} ${my + sag * 0.5} ${mx + 8 * W} ${my + sag * 0.52} ${mx + 22 * W} ${my + sag * 0.4}`}
        fill="none"
        stroke={colors.paper}
        strokeWidth={3.4 * W}
        strokeLinecap="round"
        opacity={0.18}
      />
      {/* 上臂 */}
      <path
        d={taperPath(shoulder, { x: (shoulder.x + elbow.x) / 2 - 8 * W, y: (shoulder.y + elbow.y) / 2 }, elbow, 66 * W, 56 * W)}
        fill={colors.ink}
        opacity={tone}
      />
      {/* 前臂 */}
      <path
        d={taperPath(elbow, { x: (elbow.x + hand.x) / 2, y: (elbow.y + hand.y) / 2 + 8 * W }, cuff, 56 * W, 38 * W)}
        fill={colors.ink}
        opacity={tone}
      />
      {/* 暗侧：臂的下缘再压一层（体积在笔触里） */}
      <path
        d={taperPath({ x: shoulder.x - 6 * W, y: shoulder.y + 12 * W }, { x: elbow.x - 6 * W, y: elbow.y + 14 * W }, { x: cuff.x - 4 * W, y: cuff.y + 10 * W }, 26 * W, 18 * W)}
        fill={colors.ink}
        opacity={tone * 0.5}
      />
      {/* 受光边：臂背一线纸白 */}
      <path
        d={scratch(shoulder, elbow, hand, 0.08, 0.92, 20 * W)}
        fill="none"
        stroke={colors.paper}
        strokeWidth={2.2}
        strokeLinecap="round"
        opacity={RIM}
      />
      {/* 飞白：三道纸白刮擦，把墨打散成笔触 */}
      <path d={scratch(shoulder, elbow, hand, 0.1, 0.4, -12 * W)} fill="none" stroke={colors.paper} strokeWidth={5} strokeLinecap="round" opacity={0.3} />
      <path d={scratch(shoulder, elbow, hand, 0.36, 0.66, 4 * W)} fill="none" stroke={colors.paper} strokeWidth={4.4} strokeLinecap="round" opacity={0.26} />
      <path d={scratch(shoulder, elbow, hand, 0.62, 0.94, -6 * W)} fill="none" stroke={colors.paper} strokeWidth={3.6} strokeLinecap="round" opacity={0.22} />
      {/* 袖口：一道横向的短笔，收在此处 */}
      <path
        d={taperPath(
          { x: cuff.x - Math.sin(cuffAngle) * 17 * W, y: cuff.y + Math.cos(cuffAngle) * 17 * W },
          { x: cuff.x, y: cuff.y },
          { x: cuff.x + Math.sin(cuffAngle) * 17 * W, y: cuff.y - Math.cos(cuffAngle) * 17 * W },
          34 * W,
          30 * W,
        )}
        fill={colors.ink}
        opacity={tone * 0.92}
      />
      {/* 手：掌一团 + 三指（指尖朝面具） */}
      <ellipse
        cx={hand.x}
        cy={hand.y}
        rx={11 * W}
        ry={9 * W}
        transform={`rotate(${(cuffAngle * 180) / Math.PI} ${hand.x} ${hand.y})`}
        fill={colors.ink}
        opacity={tone}
      />
      {fingers.map((fg, i) => (
        <path
          key={`f-${i}`}
          d={taperPath({ x: fg.bx, y: fg.by }, { x: (fg.bx + fg.ex) / 2, y: (fg.by + fg.ey) / 2 }, { x: fg.ex, y: fg.ey }, 6 * W, 2.2 * W)}
          fill={colors.ink}
          opacity={tone * (0.95 - i * 0.04)}
        />
      ))}
      {/* 指背一点冷光：抬手到面具时，面具的镜边反到指上（≤2px） */}
      <circle cx={fingers[1].ex} cy={fingers[1].ey} r={1.8 * W} fill={FILM.snowCyan} opacity={0.5 * t} />
    </svg>
  );
};

/** 一条独立的淡墨笔触（给别处补细节用：袖口余摆、布纹）。 */
export const InkStroke: FC<{ p0: Pt; c: Pt; p1: Pt; w0?: number; w1?: number; opacity?: number; color?: string }> = ({
  p0,
  c,
  p1,
  w0 = 18,
  w1 = 6,
  opacity = 0.22,
  color = colors.ink,
}) => <path d={taperPath(p0, c, p1, w0, w1)} fill={color} opacity={opacity} />;