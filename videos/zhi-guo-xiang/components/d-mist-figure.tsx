/* D 组 · v11 S27 专用：浅灰青背影（design-v11 §3.9，用户意见 14「一坨黑色是什么东西」）。
 *
 * 为什么另起一个组件：v10 的 S27 直接复用 `Figure.tsx` 的 `XiangFigure age="40b"`，
 * 而 `ROBE['40b'] = colors.ink`（#2b2620）—— 在 p-morning 的素衣弟子队列里就是一块纯黑污点，
 * 与底图水彩人物完全不是一族。本组件保持同一 120×320 骨架与 back 站姿，只换「族」：
 *   ① 衣身打底 FILM.snowCyan（#7E8E96，#7A8A92 同族），**不是 ink**；
 *   ② 半透明压暗：只在外轮廓内侧叠 ink 的低透明度（≤0.22）渐变 —— 是「压暗」不是「填黑」；
 *   ③ 受光边：colors.paper / colors.gold 的 ≤1.4px 描边，只给头顶、两肩、左袖（光自画面上方来）；
 *   ④ 整体 opacity 由调用方给（≈0.86），与底图弟子同族：看得出是个人，不是一块墨。
 * 不读 frame / useCurrentFrame —— 步态相位由调用方算好传入，保持纯函数、可任意帧复现。
 */
import type { CSSProperties, FC } from 'react';
import { colors } from '../../../brand/tokens';
import { FILM } from '../motion-tokens';

export const MistBackFigure: FC<{
  style?: CSSProperties;
  opacity?: number;
  /** hem：衣摆横移；tail：布巾/发尾滞后（viewBox 单位，svg 宽高会再缩放） */
  flow?: { hem?: number; tail?: number };
}> = ({ style, opacity = 0.86, flow }) => {
  const hem = flow?.hem ?? 0;
  const tail = flow?.tail ?? 0;
  return (
    <svg viewBox="0 0 120 320" style={style} opacity={opacity}>
      <defs>
        {/* 上身到衣摆：同一族色只走「透明度」，压暗交给下面单独一层 ink 低透明度 —— 
            * 不能在渐变里把 snowCyan 插值到 ink：RGB 一混就成脏灰，人又变回一块黑。 */}
        <linearGradient id="d-mist-robe" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={FILM.snowCyan} stopOpacity={0.94} />
          <stop offset="0.55" stopColor={FILM.snowCyan} stopOpacity={0.82} />
          <stop offset="1" stopColor={FILM.snowCyan} stopOpacity={0.62} />
        </linearGradient>
        {/* 衣摆压暗：ink 只在这一层露，且透明度 ≤0.14（「半透明压暗」不是填黑） */}
        <linearGradient id="d-mist-shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={colors.ink} stopOpacity={0} />
          <stop offset="0.62" stopColor={colors.ink} stopOpacity={0.04} />
          <stop offset="1" stopColor={colors.ink} stopOpacity={0.14} />
        </linearGradient>
        {/* 受光边：暖白 → 透明，只在左肩/头顶压一条 */}
        <linearGradient id="d-mist-rim" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={colors.paper} stopOpacity={0.85} />
          <stop offset="1" stopColor={colors.paper} stopOpacity={0.12} />
        </linearGradient>
      </defs>

      {/* 颈：补头与衣领之间的空隙 */}
      <path d="M54 58 L66 58 L66 82 L54 82 Z" fill={FILM.snowCyan} opacity={0.78} />

      {/* 衣身（背向）：肩 → 摆，随 hem 横移；轮廓用 ink 低透明度勾一线，跟底图淡墨线同量级 */}
      <g transform={`translate(${hem} 0)`}>
        <path d="M40 82 Q60 67 80 82 L92 250 Q60 265 28 250 Z" fill="url(#d-mist-robe)" />
        <path d="M40 82 Q60 67 80 82 L92 250 Q60 265 28 250 Z" fill="url(#d-mist-shade)" />
        <path
          d="M40 82 Q60 67 80 82 L92 250 Q60 265 28 250 Z"
          fill="none"
          stroke={colors.ink}
          strokeOpacity={0.26}
          strokeWidth={1.2}
        />
        {/* 衣褶：两笔就够，素衣没有腰带结 */}
        <path d="M60 96 Q56 170 60 246" fill="none" stroke={colors.ink} strokeOpacity={0.16} strokeWidth={1} />
        <path d="M50 104 Q47 164 51 224" fill="none" stroke={colors.ink} strokeOpacity={0.1} strokeWidth={0.9} />
        <path d="M72 106 Q75 166 70 226" fill="none" stroke={colors.ink} strokeOpacity={0.1} strokeWidth={0.9} />
        {/* 衣摆下缘：一线压暗，落地感 */}
        <path d="M28 250 Q60 265 92 250" fill="none" stroke={colors.ink} strokeOpacity={0.16} strokeWidth={1.2} />
        {/* 腿（缁衣下摆露出的裤脚） */}
        <path d="M48 250 L45 312 L57 312 L60 258 L63 312 L75 312 L72 250 Z" fill={FILM.snowCyan} opacity={0.62} />
      </g>

      {/* 两袖：与衣同族的实描边，袖口略垂 */}
      <path d="M36 92 Q30 140 31 194" fill="none" stroke={FILM.snowCyan} strokeOpacity={0.7} strokeWidth={9} strokeLinecap="round" />
      <path d="M84 92 Q90 140 89 194" fill="none" stroke={FILM.snowCyan} strokeOpacity={0.7} strokeWidth={9} strokeLinecap="round" />

      {/* 头（落发）：头皮比衣身再亮一点，左侧一线冷光 */}
      <circle cx={60} cy={42} r={18} fill={FILM.snowCyan} opacity={0.82} />
      <circle cx={60} cy={42} r={18} fill="none" stroke={colors.ink} strokeOpacity={0.24} strokeWidth={1.1} />
      {/* 布巾：脑后一条，随 tail 滞后 */}
      <path
        d={`M43 ${30 + tail * 0.2} Q60 ${22 + tail * 0.3} 77 ${30 + tail * 0.2}`}
        fill="none"
        stroke={colors.paperMuted}
        strokeOpacity={0.42}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      <path
        d={`M77 ${30 + tail * 0.2} Q${84 + tail} ${40 + tail} ${82 + tail} ${52 + tail}`}
        fill="none"
        stroke={colors.paperMuted}
        strokeOpacity={0.3}
        strokeWidth={1.2}
        strokeLinecap="round"
      />

      {/* 受光边：头顶弧 + 两肩弧 + 左袖外缘（光从画面上方打下来） */}
      <path d="M43 28 Q60 16 77 28" fill="none" stroke="url(#d-mist-rim)" strokeWidth={1.9} strokeLinecap="round" />
      <path d="M40 82 Q60 65 80 82" fill="none" stroke="url(#d-mist-rim)" strokeWidth={1.9} strokeLinecap="round" />
      <path d="M36 92 Q30 140 31 194" fill="none" stroke={colors.paper} strokeOpacity={0.46} strokeWidth={1.5} strokeLinecap="round" />
      {/* 一线暖光压在肩头，跟环境天光同温 */}
      <path d="M44 80 Q60 69 76 80" fill="none" stroke={colors.gold} strokeOpacity={0.34} strokeWidth={1.2} strokeLinecap="round" />
    </svg>
  );
};