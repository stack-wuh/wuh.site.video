/* S57 · Act 8 此刻 · 局部帧 [0,120) · 120f · 绝对 7612–7732
 *
 * 审计重定义（2026-11-12 批次 E 返工单）：桌面书房 = 书房物件微缩件错峰落桌——
 * Markdown / GitHub / 插件沙箱 / 四主题 四件微缩数据件（纯排版/SVG：迷你文档、迷你仓库、
 * 沙箱格、四色墨阶 swatch——色值即站点 brand 四主题真资产）在书桌上错峰 springIn 落下
 * （30/44/58/72），每件落桌自带标签显影（+12f）；桌面线 scaleX 画通（28–40）承接落桌基线；
 * 窗开启（8–26）与枝 3 treeGrow（6–36）、标签卡（16 springIn）原窗口保留。
 *
 * 编排四问：
 * ① 承接——s56 尾帧交出「树+枝 1–2（闭环链全亮）」：树骨架+枝 1–2 常驻，枝 3 自 890,620 上挑生长。
 * ② 触发——书房窗 8 springIn 打开（位移+scale），桌面画出后物件依次从上方落桌。
 * ③ 展开——[6–36] 枝 3 生长 / [16] 标签卡 springIn / [28–40] 桌面线画通 /
 *   [30/44/58/72] 四件微缩件 springIn 错峰落桌（translateY -34→0 + 微转落定，禁原地淡入）/
 *   每件标签落定即显影 / [96–112] 书房窗金光横扫（交接亮态）。
 * ④ 交接——尾帧：枝 3 书房小窗亮、四件齐陈（manifest endFrameDesc 契约「交接态：树+枝 1–3」原样）。
 *
 * 逐拍帧表（局部帧，fps=30）：
 * [6–36]    枝 3 treeGrow 生长（上挑，辉光双层描边）；[8–26] 书房窗 springIn 打开；
 * [16]      标签卡 springIn（2026-09-13 · 276 commits · v0.1.0）；
 * [28–40]   桌面线 scaleX 0→1 画通；[30/44/58/72] 四微缩件 springIn 落桌（每件 26f spring）；
 * [42/56/70/84] 各件标签显影（落桌 +12f）；[96–112] sheenSweep 金光扫过书房窗；
 * [112–120] 四件微辉光呼吸 = 交接态。
 * 时间轴零改动：120f / 枝 3 6–36 / Caption（文本+appearAt 14）原样；无 <Sequence>；
 * FILM_COLORS2 only；random(seed) only；springIn fps 取 useVideoConfig()。
 * 转场：入「切」，出「切」。字幕安全窗：start≥12、end≤108。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES } from '../../../brand/motion';
import { FILM_COLORS2, glowText, sheenSweep, springIn, treeGrow } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 120;
/** 枝 3（真长度由 evolvePath 计算） */
const B3_D = 'M 890 620 C 980 520 1090 460 1230 430';

/* 书房窗几何（桌面基线 = local 196） */
const WIN = { left: 1210, top: 470, width: 520, height: 330 };
const DESK_Y = 196;

/* 四件书房物件微缩件（纯排版/SVG，零图片；每件 springIn 落桌 + 标签） */
const ITEMS = [
  { name: 'Markdown', delay: 30 },
  { name: 'GitHub', delay: 44 },
  { name: '插件沙箱', delay: 58 },
  { name: '四主题', delay: 72 },
];
const CELL_W = 116;
const ROW_X0 = WIN.left + (WIN.width - (CELL_W * 4 + 48)) / 2; // 居中一行

/** 单件微缩件造型（kind 0–3；桌面基线上方 92px 区内作画） */
const DeskItem: FC<{ kind: number }> = ({ kind }) => {
  if (kind === 0) {
    /* Markdown：迷你文档（题名 caret + 三行墨条） */
    return (
      <div style={{ width: 84, height: 92, margin: '0 auto', borderRadius: 6, border: `1px solid ${FILM_COLORS2.dataDim}`, background: FILM_COLORS2.panel, padding: '10px 12px' }}>
        <div style={{ width: 34, height: 8, borderRadius: 4, background: FILM_COLORS2.data, opacity: 0.75 }} />
        <div style={{ marginTop: 10, width: 58, height: 6, borderRadius: 3, background: FILM_COLORS2.line }} />
        <div style={{ marginTop: 8, width: 46, height: 6, borderRadius: 3, background: FILM_COLORS2.line, opacity: 0.75 }} />
        <div style={{ marginTop: 8, width: 54, height: 6, borderRadius: 3, background: FILM_COLORS2.line, opacity: 0.55 }} />
        <div style={{ marginTop: 10, fontFamily: fontFamilies.mono, fontSize: 11, color: FILM_COLORS2.dataDim }}>M↓</div>
      </div>
    );
  }
  if (kind === 1) {
    /* GitHub：迷你仓库（分支线 + 三枚提交点 + ★） */
    return (
      <div style={{ width: 84, height: 92, margin: '0 auto', borderRadius: 6, border: `1px solid ${FILM_COLORS2.dataDim}`, background: FILM_COLORS2.panel, padding: '10px 12px', position: 'relative' }}>
        <div style={{ width: 34, height: 8, borderRadius: 4, background: FILM_COLORS2.data, opacity: 0.75 }} />
        <svg width={60} height={44} style={{ display: 'block', marginTop: 8 }}>
          <path d="M 6 36 C 18 36 22 12 38 12" fill="none" stroke={FILM_COLORS2.dataDim} strokeWidth={1.6} />
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={8 + i * 16} cy={36 - i * 2} r={3.4} fill={FILM_COLORS2.data} opacity={0.85 - i * 0.15} />
          ))}
        </svg>
        <div style={{ fontFamily: fontFamilies.mono, fontSize: 11, color: FILM_COLORS2.dataDim, marginTop: 2 }}>★ 276</div>
      </div>
    );
  }
  if (kind === 2) {
    /* 插件沙箱：迷你窗（2×2 隔离格） */
    return (
      <div style={{ width: 84, height: 92, margin: '0 auto', borderRadius: 6, border: `1px solid ${FILM_COLORS2.dataDim}`, background: FILM_COLORS2.panel, padding: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ height: 28, borderRadius: 4, border: `1px solid ${FILM_COLORS2.line}`, background: `rgba(212,163,115,${0.06 + (i % 2) * 0.05})` }} />
          ))}
        </div>
        <div style={{ marginTop: 10, fontFamily: fontFamilies.mono, fontSize: 11, color: FILM_COLORS2.dataDim }}>▣ sandbox</div>
      </div>
    );
  }
  /* 四主题：2×2 墨阶 swatch（space/data/gold/seal = 站点四主题色板真资产） */
  const sw = [FILM_COLORS2.space, FILM_COLORS2.data, FILM_COLORS2.gold, FILM_COLORS2.sealRed];
  return (
    <div style={{ width: 84, height: 92, margin: '0 auto', borderRadius: 6, border: `1px solid ${FILM_COLORS2.dataDim}`, background: FILM_COLORS2.panel, padding: 10 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
        {sw.map((c, i) => (
          <div key={i} style={{ height: 28, borderRadius: 4, background: c, border: `1px solid ${FILM_COLORS2.line}` }} />
        ))}
      </div>
      <div style={{ marginTop: 10, fontFamily: fontFamilies.mono, fontSize: 11, color: FILM_COLORS2.dataDim }}>◐ themes</div>
    </div>
  );
};

const S57: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b3 = treeGrow(frame, 6, 36, B3_D);
  /* 书房窗（8 springIn 打开）/ 标签卡（16 springIn）/ 桌面线（28–40 画通）/ 落桌扫光（96–112） */
  const winP = springIn(frame, 8, fps);
  const cardP = springIn(frame, 16, fps);
  const deskP = interpolate(frame, [28, 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  const cam = { scale: 1.03, x: interpolate(frame, [0, TOTAL], [-30, 60], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }), y: 0, rot: 0 };

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DeepSpace seed="s57v2" stars={52} grid horizon />
          {/* 树骨架 + 枝 1–2（常驻，琥珀墨）+ 枝 3（上挑，生长） */}
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <path d="M 910 520 C 900 640 880 760 850 880" fill="none" stroke="rgba(212,163,115,0.16)" strokeWidth={18} />
            <path d="M 910 520 C 900 640 880 760 850 880" fill="none" stroke={FILM_COLORS2.data} strokeWidth={9} opacity={0.92} />
            <path d="M 880 660 C 700 620 520 600 300 620" fill="none" stroke="rgba(212,163,115,0.14)" strokeWidth={12} />
            <path d="M 880 660 C 700 620 520 600 300 620" fill="none" stroke={FILM_COLORS2.data} strokeWidth={4.5} opacity={0.88} />
            <path d="M 880 700 C 1060 700 1240 720 1420 700" fill="none" stroke="rgba(212,163,115,0.14)" strokeWidth={12} />
            <path d="M 880 700 C 1060 700 1240 720 1420 700" fill="none" stroke={FILM_COLORS2.data} strokeWidth={4.5} opacity={0.88} />
            <path d={B3_D} fill="none" stroke="rgba(212,163,115,0.14)" strokeWidth={11} {...b3.stroke} />
            <path d={B3_D} fill="none" stroke={FILM_COLORS2.data} strokeWidth={4} {...b3.stroke} opacity={0.88} />
          </svg>

          {/* 枝 3 标签卡（16 springIn，线框数据卡） */}
          <div style={{ position: 'absolute', left: 1210, top: 300, opacity: Math.min(1, cardP * 1.5), transform: `translateY(${(1 - cardP) * 22}px) scale(${0.94 + cardP * 0.06})` }}>
            <div
              style={{
                background: FILM_COLORS2.panel,
                border: `1px solid ${FILM_COLORS2.dataDim}`,
                borderRadius: 8,
                padding: '18px 26px',
                boxShadow: `0 0 26px rgba(212,163,115,0.16), 0 16px 44px rgba(0,0,0,0.55)`,
                whiteSpace: 'nowrap',
              }}
            >
              <div style={{ fontFamily: fontFamilies.mono, fontSize: 22, color: FILM_COLORS2.paperWhite, ...glowText(FILM_COLORS2.data, 0.2) }}>wuh.site.desktop</div>
              <div style={{ fontFamily: fontFamilies.mono, fontSize: 15, color: FILM_COLORS2.textMuted, marginTop: 8 }}>2026-09-13 · 276 commits · v0.1.0</div>
            </div>
          </div>

          {/* 书房窗（8 springIn 打开，线框数据窗） */}
          <div
            style={{
              position: 'absolute',
              left: WIN.left,
              top: WIN.top,
              width: WIN.width,
              height: WIN.height,
              borderRadius: 10,
              border: `1px solid ${FILM_COLORS2.dataDim}`,
              background: FILM_COLORS2.panel,
              boxShadow: `0 0 34px rgba(212,163,115,0.16), 0 20px 60px rgba(0,0,0,0.6)`,
              opacity: Math.min(1, winP * 2),
              transform: `translateY(${(1 - winP) * 24}px) scale(${0.88 + winP * 0.12})`,
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', left: 20, top: 14, display: 'flex', gap: 8, alignItems: 'center' }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ width: 11, height: 11, borderRadius: 6, border: `1px solid ${FILM_COLORS2.dataDim}`, opacity: 0.5 }} />
              ))}
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 13, color: FILM_COLORS2.textMuted, marginLeft: 10, letterSpacing: '0.18em', opacity: 0.8 }}>desktop · 书房</span>
            </div>
            <div style={{ position: 'absolute', left: 20, right: 20, top: 42, height: 1, background: FILM_COLORS2.line, opacity: 0.5 }} />

            {/* 桌面线（28–40 画通，落桌基线） */}
            <div style={{ position: 'absolute', left: 24, top: DESK_Y, height: 1.5, width: WIN.width - 48, transformOrigin: 'left center', transform: `scaleX(${deskP})`, background: FILM_COLORS2.dataDim, opacity: 0.55 }} />

            {/* 四件微缩件错峰落桌（30/44/58/72 springIn，每件落定 +12f 标签显影） */}
            {ITEMS.map((it, i) => {
              const p = springIn(frame, it.delay, fps);
              const landFlash = interpolate(frame, [it.delay + 12, it.delay + 16, it.delay + 26], [0.5, 0.15, 0.15], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
              return (
                <div key={it.name} style={{ position: 'absolute', left: ROW_X0 - WIN.left + i * (CELL_W + 16), top: DESK_Y - 100, width: CELL_W, opacity: Math.min(1, p * 1.6), transform: `translateY(${(1 - p) * -34}px) rotate(${(1 - p) * (i % 2 ? 4 : -4)}deg)` }}>
                  <div style={{ boxShadow: `0 ${8 + landFlash * 10}px ${14 + landFlash * 16}px rgba(0,0,0,${0.4 + landFlash * 0.2})`, borderRadius: 6 }}>
                    <DeskItem kind={i} />
                  </div>
                  <div style={{ marginTop: 8, textAlign: 'center', fontFamily: fontFamilies.mono, fontSize: 13, color: FILM_COLORS2.textMuted, letterSpacing: '0.1em', opacity: interpolate(frame, [it.delay + 12, it.delay + 22], [0, 0.9], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>{it.name}</div>
                </div>
              );
            })}

            {/* 书房窗扫光（96–112，交接亮态；overflow hidden 裁切出窗） */}
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
              <div style={sheenSweep(frame, 96, 16)} />
            </div>
          </div>
        </AbsoluteFill>
      </CameraRig>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 300, backgroundImage: `linear-gradient(180deg, transparent, ${FILM_COLORS2.spaceDeep})`, opacity: 0.2 }} />
      <HudChrome label="wuh.site · GRAPH" readout={frame >= 100 ? 'BRANCH 3 · DESK FULL' : 'BRANCH 3 · DESKTOP'} />
      <Grade2 id="GR2-08" />
      <Caption text="再长出一间桌面书房：Markdown、GitHub、插件沙箱。" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S57;
