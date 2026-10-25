import type { FC } from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { colors, fontFamilies } from '../../brand/tokens';

type BeatFrame = { frame: number };

const fade = (frame: number, at: number) =>
  // 3 帧跳变：本机 Chrome 对部分透明度叠渲染有确定性崩溃（见 brief 结果段），样片用硬切规避
  interpolate(frame, [at, at + 3], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

const serif = fontFamilies.serif;
const sans = fontFamilies.sans;
const mono = fontFamilies.mono;

/* ─── 通用小件 ─── */

const InkDot: FC<{ x: number; y: number; at: number }> = ({ x, y, at }) => {
  const frame = useCurrentFrame();
  return <div style={{ position: 'absolute', left: x, top: y, width: 8, height: 8, borderRadius: 4, background: colors.accent, opacity: fade(frame, at) }} />;
};

const CodeLines: FC<{ count?: number; at?: number }> = ({ count = 4 }) => (
  <div style={{ width: '100%' }}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} style={{ height: 9, width: `${92 - i * 14}%`, background: colors.terminalText, opacity: 0.28, borderRadius: 4, marginTop: 14 }} />
    ))}
  </div>
);

/* ─── 各镜板面 ─── */

// 镜1 光尘书桌：下坠光点 + 桌剪影
const BoardDustDesk: FC<BeatFrame> = ({ frame }) => (
  <div style={{ position: 'relative', width: 1100, height: 520 }}>
    {Array.from({ length: 26 }).map((_, i) => (
      <div key={i} style={{ position: 'absolute', left: (i * 97) % 1080, top: ((frame * (0.5 + (i % 5) * 0.2)) + i * 40) % 520, width: 4, height: 4, borderRadius: 2, background: colors.accent, opacity: 0.25 + 0.2 * Math.sin(frame / 20 + i) }} />
    ))}
    <div style={{ position: 'absolute', bottom: 0, left: 250, width: 600, height: 130, background: colors.bgLift, borderTop: `2px solid ${colors.muted}`, opacity: fade(frame, 40) }} />
    <div style={{ position: 'absolute', bottom: 130, left: 720, width: 8, height: 60, background: colors.muted, opacity: fade(frame, 60) }} />
  </div>
);

// 镜2/45 打字机：逐字打出 + 光标 + 短划线
const BoardTypewriter: FC<BeatFrame> = ({ frame }) => {
  const text = '写作是抵抗遗忘的方式，代码是构建世界的语言。';
  const chars = Math.min(text.length, Math.floor(frame / 4));
  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontFamily: serif, fontSize: 46, color: colors.paper, margin: 0 }}>
        {text.slice(0, chars)}
        <span style={{ opacity: Math.floor(frame / 10) % 2 ? 1 : 0.15, color: colors.accent }}>▍</span>
      </p>
      <div style={{ width: interpolate(chars, [0, text.length], [0, 180], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), height: 3, background: colors.accent, margin: '30px auto 0' }} />
    </div>
  );
};

// 镜3/45 品牌落版
const BoardBrand: FC<BeatFrame> = ({ frame }) => (
  <div style={{ textAlign: 'center' }}>
    <p style={{ fontFamily: serif, fontSize: 96, color: colors.paper, margin: 0, opacity: fade(frame, 8) }}>wuh.site · 朝朝如念</p>
    <p style={{ fontFamily: sans, fontSize: 28, color: colors.muted, letterSpacing: '0.3em', marginTop: 30, opacity: fade(frame, 30) }}>雾失楼台，月迷津渡</p>
  </div>
);

// 镜4 第一行代码
const BoardFirstCode: FC<BeatFrame> = ({ frame }) => (
  <div style={{ width: 760, borderRadius: 14, background: colors.terminalBg, border: `1px solid ${colors.hairline}`, padding: '26px 32px' }}>
    <p style={{ fontFamily: mono, fontSize: 22, color: colors.terminalText, margin: 0 }}>
      {'npx create-next-app '.slice(0, Math.floor(frame / 3))}<span style={{ color: colors.accent }}>▍</span>
    </p>
    <p style={{ fontFamily: mono, fontSize: 17, color: colors.muted, marginTop: 20, opacity: fade(frame, 60) }}>2024.12 · 1168 commits 由此起笔</p>
  </div>
);

// 镜5 热力图生长 + 镜14 复燃 + 镜27 全家桶热力
const BoardHeatmap: FC<BeatFrame & { highlight?: string }> = ({ frame, highlight }) => {
  const weeks = 30;
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ display: 'flex', gap: 5, justifyContent: 'center' }}>
        {Array.from({ length: weeks }).map((_, w) => (
          <div key={w} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {Array.from({ length: 7 }).map((_, d) => {
              const grow = spring({ frame: frame - (10 + w * 5 + d * 2), fps: 30, config: { damping: 200 } });
              const level = (w * 7 + d) % 5;
              return <div key={d} style={{ width: 24, height: 24, borderRadius: 5, background: level > 2 ? colors.accent : colors.paperMuted, opacity: level > 2 ? 0.9 : 0.35, transform: `scale(${grow})` }} />;
            })}
          </div>
        ))}
      </div>
      <p style={{ fontFamily: serif, fontSize: 40, color: colors.paper, marginTop: 34, opacity: fade(frame, 120) }}>
        {highlight ?? '1,168 commits · 685 天'}
      </p>
    </div>
  );
};

// 镜6 版本星轨
const BoardTagArc: FC<BeatFrame> = ({ frame }) => (
  <div style={{ position: 'relative', width: 900, height: 300 }}>
    {Array.from({ length: 22 }).map((_, i) => {
      const lit = fade(frame, 10 + i * 8);
      return <div key={i} style={{ position: 'absolute', left: 60 + i * 36, top: 200 - Math.sin((i / 21) * Math.PI) * 160, width: 18, height: 18, borderRadius: 4, background: colors.accent, opacity: 0.25 + lit * 0.75 }} />;
    })}
    <p style={{ position: 'absolute', bottom: 0, width: '100%', textAlign: 'center', fontFamily: mono, fontSize: 22, color: colors.muted }}>v1.0.1 → v2.0.0 · 107 tags</p>
  </div>
);

// 镜7/8 沉默（熄灭 + 零柱）
const BoardSilence: FC<BeatFrame> = ({ frame }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ display: 'flex', gap: 5, justifyContent: 'center', opacity: interpolate(frame, [0, 40], [0.6, 0.06], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} style={{ width: 26, height: 26, borderRadius: 5, background: colors.muted }} />
      ))}
    </div>
    <p style={{ fontFamily: serif, fontSize: 60, color: colors.paper, marginTop: 60, opacity: fade(frame, 46) }}>然后，安静了。</p>
  </div>
);

const BoardZero: FC<BeatFrame> = ({ frame }) => (
  <div style={{ display: 'flex', gap: 34, alignItems: 'flex-end', height: 320 }}>
    {[
      ['2019', 3117], ['2020', 3563], ['2021', 3935], ['2022', 2139], ['2023', 2183], ['2024', 2319], ['2025', 0],
    ].map(([y, v], i) => (
      <div key={String(y)} style={{ textAlign: 'center' }}>
        <div style={{ width: 56, height: Math.max((Number(v) / 3935) * 260, 4), background: colors.muted, opacity: 0.4, borderRadius: 4 }} />
        <p style={{ fontFamily: mono, fontSize: 15, color: colors.muted, marginTop: 10 }}>{y}</p>
        {y === '2025' ? <p style={{ fontFamily: serif, fontSize: 40, color: colors.paper, margin: 0, opacity: fade(frame, 40) }}>0</p> : null}
      </div>
    ))}
  </div>
);

// 镜9/32 金句诗影
const BoardQuote: FC<BeatFrame & { lines: string[] }> = ({ frame, lines }) => (
  <div style={{ textAlign: 'center' }}>
    {lines.map((l, i) => (
      <p key={i} style={{ fontFamily: serif, fontSize: i === 0 ? 44 : 38, color: i === 0 ? colors.paper : colors.muted, margin: '18px 0', opacity: fade(frame, 16 + i * 42) }}>
        {l}
      </p>
    ))}
  </div>
);

// 镜10 时间轴失色
const BoardTimelineGrey: FC<BeatFrame> = ({ frame }) => (
  <div style={{ position: 'relative', width: 900, height: 200 }}>
    <div style={{ position: 'absolute', top: 96, left: 0, right: 0, height: 1, background: colors.hairline }} />
    {Array.from({ length: 9 }).map((_, i) => (
      <InkDot x={60 + i * 96} y={92} at={10 + i * 12} key={i} />
    ))}
    <p style={{ position: 'absolute', bottom: 0, width: '100%', textAlign: 'center', fontFamily: serif, fontSize: 38, color: colors.paper, opacity: fade(frame, 60) }}>
      欲望，是最恐怖的东西。
    </p>
  </div>
);

// 镜11 生成式封面（山峦曲线描边）
const BoardCover: FC<BeatFrame> = ({ frame }) => (
  <svg width="900" height="380" viewBox="0 0 900 380">
    {[
      'M0,300 C150,220 260,340 420,260 C580,180 700,320 900,240',
      'M0,340 C180,280 320,380 500,310 C660,250 780,360 900,320',
    ].map((d, i) => (
      <path key={i} d={d} fill="none" stroke={colors.accent} strokeWidth={2} opacity={fade(frame, 10 + i * 40) * 0.7} strokeDasharray={1400} strokeDashoffset={interpolate(frame, [10 + i * 40, 90 + i * 40], [1400, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} />
    ))}
    <text x="450" y="120" textAnchor="middle" fill={colors.paper} fontFamily={serif} fontSize={40} opacity={fade(frame, 80)}>深夜，他重读了自己写过的每一个字。</text>
    <text x="860" y="360" textAnchor="end" fill={colors.muted} fontFamily={mono} fontSize={16} opacity={fade(frame, 100)}>wuh.site</text>
  </svg>
);

// 镜12/13 宣言信纸 + 钤印
const BoardManifesto: FC<BeatFrame> = ({ frame }) => (
  <div style={{ position: 'relative', width: 860, background: colors.paperDeep, borderRadius: 10, padding: '44px 56px' }}>
    {['两天重新读了一下过去写过的博客，', '才发现我已经很久没有继续写博客了。……这样不好。', '每周发布一篇博客，无限进步，', '开始重启计划~~'].map((l, i) => (
      <p key={i} style={{ fontFamily: serif, fontSize: 28, color: colors.ink, margin: '16px 0', opacity: fade(frame, 10 + i * 40) }}>
        {l}
      </p>
    ))}
    <div style={{ position: 'absolute', right: 44, bottom: 34, width: 46, height: 46, background: colors.accent, transform: `rotate(${interpolate(frame, [170, 186], [8, 1.6], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}deg) scale(${interpolate(frame, [170, 182], [2.2, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })})`, opacity: fade(frame, 170) }} />
  </div>
);

// 镜15 白闪上线（页面灯笼）
const BoardLanterns: FC<BeatFrame> = ({ frame }) => (
  <div style={{ display: 'flex', gap: 22, alignItems: 'center' }}>
    {[0, 1, 2, 3, 4].map((i) => (
      <div key={i} style={{ width: 150, height: 210, borderRadius: 10, background: colors.bgLift, border: `1px solid ${colors.hairline}`, opacity: fade(frame, 8 + i * 22), transform: `translateY(${(1 - spring({ frame: frame - (8 + i * 22), fps: 30, config: { damping: 200 } })) * 30}px)` }} />
    ))}
    <p style={{ fontFamily: mono, fontSize: 26, color: colors.accent, marginLeft: 30, opacity: fade(frame, 120) }}>2026.06.14 · 上线</p>
  </div>
);

// 镜16-21 首页/时间轴/书架/封面/目录/点赞（首页族复用简板）
const BoardHomePan: FC<BeatFrame> = ({ frame }) => (
  <div style={{ width: 980 }}>
    <div style={{ height: 18, width: '40%', background: colors.paper, opacity: 0.75, borderRadius: 8 }} />
    <div style={{ height: 1, background: colors.hairline, margin: '26px 0' }} />
    {[46, 58, 40].map((w, i) => (
      <div key={i} style={{ display: 'flex', gap: 18, alignItems: 'center', marginTop: 22, opacity: fade(frame, 14 + i * 22) }}>
        <div style={{ width: 10, height: 10, borderRadius: 5, background: colors.accent }} />
        <div style={{ height: 10, width: `${w}%`, background: colors.paperMuted, borderRadius: 5 }} />
        <span style={{ fontFamily: mono, fontSize: 15, color: colors.muted, marginLeft: 'auto' }}>N 浏览</span>
      </div>
    ))}
    <p style={{ fontFamily: sans, fontSize: 22, color: colors.muted, marginTop: 34, opacity: fade(frame, 80) }}>一座用代码写成的小院 · 开源是一种信仰</p>
  </div>
);

const BoardToc: FC<BeatFrame> = ({ frame }) => (
  <div style={{ display: 'flex', gap: 60 }}>
    <div style={{ width: 420 }}>
      {Array.from({ length: 6 }).map((_, i) => {
        const active = Math.floor(frame / 22) % 6;
        return (
          <p key={i} style={{ fontFamily: sans, fontSize: i === active ? 26 : 20, color: i === active ? colors.accent : colors.muted, margin: '14px 0', transform: `translateX(${i === active ? 14 : 0}px)` }}>
            {String(i + 1).padStart(2, '0')} · 章节标题
          </p>
        );
      })}
    </div>
    <div style={{ width: 380, borderRadius: 12, background: colors.paperDeep, padding: 30 }}>
      <CodeLines count={5} />
    </div>
  </div>
);

const BoardLike: FC<BeatFrame> = ({ frame }) => {
  const pop = spring({ frame: frame - 30, fps: 30, config: { damping: 12 } });
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ width: 96, height: 96, borderRadius: 48, background: colors.accent, margin: '0 auto', transform: `scale(${interpolate(pop, [0, 1], [0.6, 1])})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 40, color: colors.bg }}>♥</span>
      </div>
      <p style={{ fontFamily: sans, fontSize: 26, color: colors.paper, marginTop: 26, opacity: fade(frame, 40) }}>已赞 128 · 点赞吧~</p>
    </div>
  );
};

// 镜22/23 年轮 + 碟心
const BoardDisc: FC<BeatFrame> = ({ frame }) => (
  <div style={{ display: 'flex', gap: 90, alignItems: 'center' }}>
    <div style={{ textAlign: 'right' }}>
      {['2022', '2023', '2024', '2025', '2026'].map((y, i) => {
        const active = Math.floor(frame / 30) % 5;
        return (
          <p key={y} style={{ fontFamily: serif, fontSize: i === active ? 54 : 30, color: i === active ? colors.accent : colors.muted, margin: '12px 0', opacity: i === active ? 1 : 0.5 }}>
            {y}
          </p>
        );
      })}
    </div>
    <div style={{ position: 'relative', width: 320, height: 320, borderRadius: 160, border: `1px solid ${colors.hairline}`, transform: `rotate(${frame * 1.2}deg)` }}>
      {[132, 104, 76, 48].map((r) => (
        <div key={r} style={{ position: 'absolute', inset: (320 - r * 2) / 2, borderRadius: r, border: `1px solid ${colors.hairline}` }} />
      ))}
      <div style={{ position: 'absolute', left: 136, top: 136, width: 48, height: 48, borderRadius: 24, background: colors.accent }} />
    </div>
  </div>
);

// 镜24 EQ 冻结
const BoardEQ: FC<BeatFrame> = ({ frame }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ display: 'flex', gap: 22, alignItems: 'flex-end', height: 160, justifyContent: 'center' }}>
      {[0, 1, 2].map((i) => {
        const frozen = frame > 60;
        const h = frozen ? 56 : 30 + Math.abs(Math.sin(frame / (6 + i * 2))) * 120;
        return <div key={i} style={{ width: 26, height: h, background: colors.accent, borderRadius: 5, opacity: 0.9 }} />;
      })}
    </div>
    <p style={{ fontFamily: sans, fontSize: 22, color: colors.muted, marginTop: 30, opacity: fade(frame, 66) }}>{frame > 60 ? '骤停半拍 · 冻结' : '本卷最热 ·《按语》'}</p>
  </div>
);

// 镜25 信笺纵线
const BoardLetter: FC<BeatFrame> = ({ frame }) => (
  <div style={{ position: 'relative', width: 560, height: 360 }}>
    <div style={{ position: 'absolute', left: 120, top: 0, bottom: 0, width: 1, background: colors.accent, opacity: 0.5 }} />
    {[0, 1, 2, 3].map((i) => (
      <div key={i} style={{ position: 'absolute', top: 20 + i * 88, left: 0, width: '100%', opacity: fade(frame, 14 + i * 30) }}>
        <div style={{ position: 'absolute', left: 115, top: 6, width: 11, height: 11, borderRadius: 6, background: i === 0 ? colors.accent : colors.muted }} />
        <p style={{ fontFamily: serif, fontSize: 22, color: colors.paper, margin: '0 0 0 150px' }}>{['今天', '昨天', '前天', '3 天前'][i]} · 一封来信</p>
      </div>
    ))}
  </div>
);

// 镜26 弹幕
const BoardBarrage: FC<BeatFrame> = ({ frame }) => (
  <div style={{ width: 1000 }}>
    <div style={{ position: 'relative', height: 260, borderRadius: 14, background: colors.bgLift, border: `1px solid ${colors.hairline}`, overflow: 'hidden' }}>
      {['路过，留个脚印。', '朝朝如念。', '字字用心。', '天才向左，疯子向右。', '再来一卷歌单。'].map((l, i) => {
        const x = 1060 - ((frame * (2.2 + i * 0.5) + i * 400) % 1700);
        return <span key={i} style={{ position: 'absolute', left: x, top: 24 + i * 46, fontFamily: sans, fontSize: 23, color: i % 2 ? colors.paper : colors.accent, whiteSpace: 'nowrap' }}>{l}</span>;
      })}
    </div>
  </div>
);

// 镜27 About 全家桶
const BoardAboutPan: FC<BeatFrame> = ({ frame }) => (
  <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 22px)', gap: 4 }}>
      {Array.from({ length: 40 }).map((_, i) => (
        <div key={i} style={{ width: 22, height: 22, borderRadius: 4, background: colors.accent, opacity: fade(frame, 6 + (i % 13) * 6) * (0.25 + ((i * 7) % 10) / 14) }} />
      ))}
    </div>
    <div style={{ position: 'relative', width: 300, height: 260 }}>
      {[[80, 60], [180, 130], [120, 190]].map(([x, y], i) => (
        <div key={i} style={{ position: 'absolute', left: x, top: y, width: 14, height: 14, borderRadius: 7, background: colors.accent, opacity: fade(frame, 40 + i * 20) }} />
      ))}
    </div>
    <p style={{ fontFamily: mono, fontSize: 20, color: colors.muted }}>10,330 · 365 天</p>
  </div>
);

// 镜28 足迹俯冲
const BoardFootprint: FC<BeatFrame> = ({ frame }) => (
  <div style={{ display: 'flex', gap: 46 }}>
    {[['杨梅坑', '2025-08-15'], ['梧桐山', '2025-09-20']].map(([name, date], i) => (
      <div key={name} style={{ width: 300, background: colors.paperDeep, borderRadius: 10, padding: '22px 26px', transform: `rotate(${i ? 1.5 : -2}deg)`, opacity: fade(frame, 12 + i * 40) }}>
        <div style={{ height: 140, borderRadius: 8, background: colors.muted, opacity: 0.35 }} />
        <p style={{ fontFamily: serif, fontSize: 26, color: colors.ink, margin: '16px 0 0' }}>{name}</p>
        <p style={{ fontFamily: mono, fontSize: 16, color: colors.ink, opacity: 0.6, marginTop: 6 }}>{date}</p>
      </div>
    ))}
  </div>
);

// 镜29 主题换装
const BoardTheme: FC<BeatFrame> = ({ frame }) => {
  const dark = Math.floor(frame / 50) % 2 === 0;
  return (
    <div style={{ width: 960, height: 340, borderRadius: 16, background: dark ? colors.bgLift : colors.paper, border: `1px solid ${colors.hairline}`, padding: '52px 64px' }}>
      <p style={{ fontFamily: serif, fontSize: 48, color: dark ? colors.paper : colors.ink, margin: 0 }}>酒红 · 素雅</p>
      <p style={{ fontFamily: sans, fontSize: 22, color: dark ? colors.muted : colors.ink, marginTop: 20, letterSpacing: '0.2em' }}>明 / 暗 · 跟随系统</p>
    </div>
  );
};

// 镜30 页面漫游
const BoardRoam: FC<BeatFrame> = ({ frame }) => (
  <div style={{ display: 'flex', gap: 20 }}>
    {['/', '/music', '/guestbook', '/footprint', '/topics'].map((p, i) => (
      <div key={p} style={{ width: 170, height: 240, borderRadius: 10, background: colors.bgLift, border: `1px solid ${colors.hairline}`, opacity: fade(frame, 6 + i * 20), transform: `translateY(${interpolate(spring({ frame: frame - (6 + i * 20), fps: 30, config: { damping: 200 } }), [0, 1], [26, 0])}px)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: mono, fontSize: 17, color: colors.muted }}>{p}</span>
      </div>
    ))}
  </div>
);

// 镜31 联系钤印
const BoardContactSeal: FC<BeatFrame> = ({ frame }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ display: 'flex', gap: 18, justifyContent: 'center' }}>
      {['微', 'Q', 'T', 'G', '豆', '云', 'D'].map((s, i) => (
        <div key={s} style={{ width: 52, height: 52, borderRadius: 8, background: colors.paperDeep, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: serif, fontSize: 24, color: colors.ink, opacity: fade(frame, 8 + i * 12) }}>
          {s}
        </div>
      ))}
    </div>
    <p style={{ fontFamily: serif, fontSize: 40, color: colors.paper, marginTop: 46, opacity: fade(frame, 70) }}>代码写诗，工具作画</p>
  </div>
);

// 镜33 书墙
const BoardBookWall: FC<BeatFrame> = ({ frame }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
      {Array.from({ length: 14 }).map((_, i) => (
        <div key={i} style={{ width: 40, height: 120 + ((i * 23) % 60), borderRadius: 5, background: i === 6 ? colors.accent : colors.paperMuted, opacity: i === 6 ? 1 : 0.55, marginTop: i === 6 ? 30 : 0 }} />
      ))}
    </div>
    <p style={{ fontFamily: serif, fontSize: 36, color: colors.paper, marginTop: 40, opacity: fade(frame, 50) }}>读过的每一行，都长进了骨头里</p>
  </div>
);

// 镜35 光标承转
const BoardCursor: FC<BeatFrame> = ({ frame }) => (
  <p style={{ fontFamily: serif, fontSize: 42, color: colors.paper, opacity: fade(frame, 12) }}>
    然后，他把这些热爱，写成了方法。<span style={{ color: colors.accent, opacity: Math.floor(frame / 10) % 2 ? 1 : 0.1 }}>▍</span>
  </p>
);

// 镜36 终端
const BoardTerminal: FC<BeatFrame> = ({ frame }) => (
  <div style={{ width: 820, borderRadius: 12, background: colors.terminalBg, border: `1px solid ${colors.hairline}`, padding: '26px 32px', textAlign: 'left' }}>
    {['$ shadow-dev propose — 提案', '$ shadow-dev apply — 双代理并行', '$ shadow-dev review — 质量门禁'].map((l, i) => (
      <p key={i} style={{ fontFamily: mono, fontSize: 21, color: colors.terminalText, margin: '12px 0', opacity: fade(frame, 10 + i * 34) }}>
        {l.slice(0, Math.max(0, Math.floor((frame - (10 + i * 34)) / 2))) || l.slice(0, 1)}
      </p>
    ))}
    <p style={{ fontFamily: mono, fontSize: 17, color: colors.muted, marginTop: 18, opacity: fade(frame, 110) }}>2026.06.27 · initial release</p>
  </div>
);

// 镜37 五段纸舟
const BoardWorkflow: FC<BeatFrame> = ({ frame }) => (
  <div style={{ display: 'flex', gap: 26 }}>
    {['propose', 'apply', 'review', 'release', 'publish'].map((s, i) => (
      <div key={s} style={{ width: 150, height: 96, borderRadius: 10, border: `1px solid ${colors.hairline}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: mono, fontSize: 19, color: i === 3 ? colors.bg : colors.accent, background: i === 3 ? colors.accent : colors.bgLift, opacity: fade(frame, 12 + i * 28) }}>
        {s}
      </div>
    ))}
  </div>
);

// 镜38 归档墙
const BoardArchive: FC<BeatFrame> = ({ frame }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(18, 30px)', gap: 6, justifyContent: 'center' }}>
      {Array.from({ length: 54 }).map((_, i) => (
        <div key={i} style={{ width: 30, height: 40, borderRadius: 4, background: colors.paperMuted, opacity: fade(frame, 6 + i * 3) * 0.6 }} />
      ))}
    </div>
    <p style={{ fontFamily: serif, fontSize: 44, color: colors.paper, marginTop: 40, opacity: fade(frame, 90) }}>
      {Math.min(254, Math.floor(frame * 2.2))} briefs · 40 knowledge cards
    </p>
  </div>
);

// 镜39 双轴
const BoardDualAxis: FC<BeatFrame> = ({ frame }) => (
  <div style={{ textAlign: 'center' }}>
    {[
      ['作品轴', '06-14 上线 → v2.0.0'],
      ['方法轴', '06-27 工作流诞生 → v6.3.1'],
    ].map(([a, b], i) => (
      <div key={a} style={{ margin: '22px 0', opacity: fade(frame, 10 + i * 40) }}>
        <p style={{ fontFamily: sans, fontSize: 20, color: colors.accent, letterSpacing: '0.2em', margin: 0 }}>{a}</p>
        <div style={{ height: 2, background: colors.hairline, margin: '14px 0' }} />
        <p style={{ fontFamily: mono, fontSize: 22, color: colors.paper, margin: 0 }}>{b}</p>
      </div>
    ))}
    <p style={{ fontFamily: serif, fontSize: 38, color: colors.paper, marginTop: 30, opacity: fade(frame, 80) }}>方法与作品，一起长大</p>
  </div>
);

// 镜40 Meta 穿屏
const BoardMeta: FC<BeatFrame> = ({ frame }) => {
  const scale = interpolate(frame, [0, 210], [1, 0.42], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{ width: 1000, height: 560, border: `2px solid ${colors.muted}`, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${scale})`, background: colors.bgLift }}>
      <div style={{ width: '78%', height: '72%', border: `1px dashed ${colors.muted}`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontFamily: serif, fontSize: 34, color: colors.paper, textAlign: 'center', opacity: fade(frame, 40) }}>
          这部片子，也是工作流的一次心跳
          <br />
          <span style={{ fontFamily: sans, fontSize: 19, color: colors.muted }}>（画中画 · 分镜师与 UE 大师仍在工作）</span>
        </p>
      </div>
    </div>
  );
};

// 镜41 英文落款
const BoardCredits: FC<BeatFrame> = ({ frame }) => (
  <div style={{ textAlign: 'center' }}>
    <p style={{ fontFamily: serif, fontSize: 44, color: colors.paper, margin: 0, opacity: fade(frame, 8) }}>
      This film is made with shadow-dev-workflow
    </p>
    <p style={{ fontFamily: sans, fontSize: 22, color: colors.muted, letterSpacing: '0.3em', marginTop: 24, opacity: fade(frame, 36) }}>
      以工作流之名
    </p>
  </div>
);

// 镜42 年度冲顶
const BoardRace: FC<BeatFrame> = ({ frame }) => (
  <div style={{ display: 'flex', gap: 30, alignItems: 'flex-end', height: 380 }}>
    {[
      ['2019', 3117], ['2020', 3563], ['2021', 3935], ['2022', 2139], ['2023', 2183], ['2024', 2319], ['2025', 0], ['2026', 4387],
    ].map(([y, v], i) => {
      const grow = spring({ frame: frame - (8 + i * 16), fps: 30, config: { damping: 200 } });
      const peak = y === '2026';
      return (
        <div key={String(y)} style={{ textAlign: 'center' }}>
          {peak ? <p style={{ fontFamily: mono, fontSize: 22, color: colors.accent, margin: '0 0 8px', opacity: fade(frame, 90) }}>4,387</p> : null}
          <div style={{ width: 58, height: Math.max((Number(v) / 4387) * 300 * grow, 3), background: peak ? colors.accent : colors.paperMuted, borderRadius: 4 }} />
          <p style={{ fontFamily: mono, fontSize: 14, color: colors.muted, marginTop: 8 }}>{y}</p>
        </div>
      );
    })}
  </div>
);

// 镜43 书房全景
const BoardStudy: FC<BeatFrame> = ({ frame }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ display: 'flex', gap: 34, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ width: 120, height: 90, borderRadius: 8, background: colors.terminalBg, border: `1px solid ${colors.hairline}`, opacity: fade(frame, 10) }} />
      <div style={{ display: 'flex', gap: 8 }}>
        {[130, 100, 115].map((h, i) => (
          <div key={i} style={{ width: 34, height: h, borderRadius: 4, background: colors.paperMuted, opacity: fade(frame, 20 + i * 12) }} />
        ))}
      </div>
      <div style={{ width: 110, height: 110, borderRadius: 55, border: `1px solid ${colors.hairline}`, opacity: fade(frame, 44) }} />
      {[[0, 0], [30, 20], [60, 8]].map(([x, y], i) => (
        <div key={i} style={{ width: 12, height: 12, borderRadius: 6, background: colors.accent, opacity: fade(frame, 60 + i * 14) }} />
      ))}
    </div>
    <p style={{ fontFamily: serif, fontSize: 34, color: colors.paper, marginTop: 50, opacity: fade(frame, 70) }}>
      日不过三餐，夜不过一宿……此乐何极
    </p>
  </div>
);

// 镜44 墨点
const BoardInkDot: FC<BeatFrame> = ({ frame }) => (
  <div style={{ width: 90, height: 90, borderRadius: 45, background: colors.paper, transform: `scale(${1 + Math.sin(frame / 8) * 0.03})` }} />
);

// 镜45 落版
const BoardEnd: FC<BeatFrame> = ({ frame }) => (
  <div style={{ textAlign: 'center' }}>
    <p style={{ fontFamily: serif, fontSize: 92, color: colors.paper, margin: 0, opacity: fade(frame, 8) }}>wuh.site · 朝朝如念</p>
    <p style={{ fontFamily: serif, fontSize: 30, color: colors.muted, marginTop: 36, opacity: fade(frame, 44) }}>
      写作是抵抗遗忘的方式，代码是构建世界的语言。
    </p>
    <div style={{ width: 40, height: 40, background: colors.accent, margin: '44px auto 0', transform: `rotate(1.6deg) scale(${interpolate(frame, [100, 116], [2, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })})`, opacity: fade(frame, 100) }} />
  </div>
);

/* ─── 镜 → 板面映射 ─── */
const BOARDS: Record<number, FC<BeatFrame>> = {
  1: BoardDustDesk,
  2: BoardTypewriter,
  3: BoardBrand,
  4: BoardFirstCode,
  5: (p) => <BoardHeatmap {...p} />,
  6: BoardTagArc,
  7: BoardSilence,
  8: BoardZero,
  9: (p) => <BoardQuote {...p} lines={['人生一世不过 3 万多天，', '实在是太短了。']} />,
  10: BoardTimelineGrey,
  11: BoardCover,
  12: BoardManifesto,
  13: BoardManifesto,
  14: (p) => <BoardHeatmap {...p} highlight="10,330 次活动 · 365 天逐日真实" />,
  15: BoardLanterns,
  16: BoardHomePan,
  17: BoardHomePan,
  18: BoardBookWall,
  19: BoardCover,
  20: BoardToc,
  21: BoardLike,
  22: BoardDisc,
  23: BoardDisc,
  24: BoardEQ,
  25: BoardLetter,
  26: BoardBarrage,
  27: BoardAboutPan,
  28: BoardFootprint,
  29: BoardTheme,
  30: BoardRoam,
  31: BoardContactSeal,
  32: (p) => <BoardQuote {...p} lines={['不怒百神和畅，', '不恼心地清凉。']} />,
  33: BoardBookWall,
  34: BoardFootprint,
  35: BoardCursor,
  36: BoardTerminal,
  37: BoardWorkflow,
  38: BoardArchive,
  39: BoardDualAxis,
  40: BoardMeta,
  41: BoardCredits,
  42: BoardRace,
  43: BoardStudy,
  44: BoardInkDot,
  45: BoardEnd,
};

export { BOARDS };
