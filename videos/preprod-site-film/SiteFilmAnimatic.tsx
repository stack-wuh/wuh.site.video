import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { colors, fontFamilies } from '../../brand/tokens';
import { BOARDS } from './boards';

type Shot = { n: number; start: number; dur: number; act: number; label: string; cam: string; caption: string; punch?: boolean };

// 数据源：assets/storyboard.md v1.1（45 镜七幕，合计 7200 帧 = 4:00）
const SHOTS: Shot[] = [
  { n: 1, start: 0, dur: 220, act: 1, label: '光尘书桌剪影', cam: '超慢前推·双层景深', caption: '' },
  { n: 2, start: 220, dur: 280, act: 1, label: '打字机宣言', cam: '微距锁定笔尖', caption: '写作是抵抗遗忘的方式，代码是构建世界的语言。' },
  { n: 3, start: 500, dur: 200, act: 1, label: 'wuh.site · 朝朝如念', cam: '后拉+微降', caption: '雾失楼台，月迷津渡' },
  { n: 4, start: 700, dur: 180, act: 2, label: '第一行代码', cam: '过肩特写前推', caption: '2024.12 · 第一行代码' },
  { n: 5, start: 880, dur: 160, act: 2, label: '热力图生长', cam: '横移跟随生长', caption: '1,168 commits · 685 天' },
  { n: 6, start: 1040, dur: 120, act: 2, label: '版本星轨', cam: '低角度横摇', caption: '107 个版本 · v1.0.1 → v2.0.0' },
  { n: 7, start: 1160, dur: 220, act: 2, label: '骤暗·热力图熄灭', cam: '固定长镜·光线衰减', caption: '然后，安静了。' },
  { n: 8, start: 1380, dur: 140, act: 2, label: '2025 · 0', cam: '缓推逼近', caption: '2025 · 0' },
  { n: 9, start: 1520, dur: 150, act: 2, label: '金句·三万多天', cam: '固定·字间漂移', caption: '人生一世不过 3 万多天，实在是太短了。' },
  { n: 10, start: 1670, dur: 130, act: 2, label: '墨点时间轴失色', cam: '俯角缓降', caption: '欲望，是最恐怖的东西。' },
  { n: 11, start: 1800, dur: 180, act: 3, label: '重读旧文·生成式封面', cam: '跟拍指尖·浅景深', caption: '深夜，他重读了自己写过的每一个字。' },
  { n: 12, start: 1980, dur: 220, act: 3, label: '宣言上半·落墨', cam: '俯拍信纸下摇', caption: '才发现我已经很久没有继续写博客了。……这样不好。' },
  { n: 13, start: 2200, dur: 220, act: 3, label: '钤印落章·重启计划', cam: '急推（全片第一重音）', caption: '开始重启计划~~ —— 2026.06.21', punch: true },
  { n: 14, start: 2420, dur: 190, act: 3, label: '复燃·10,330 光毯', cam: '升降上摇+拉远', caption: '10,330 次活动 · 365 天逐日真实' },
  { n: 15, start: 2610, dur: 190, act: 3, label: '上线白闪', cam: '一镜到底前飞', caption: '2026.06.14 · 流量切换，正式上线' },
  { n: 16, start: 2800, dur: 120, act: 4, label: '首页全景', cam: '纵向下移巡阅', caption: '一座用代码写成的小院' },
  { n: 17, start: 2920, dur: 110, act: 4, label: '墨点时间轴 hover', cam: '特写横移跟光标', caption: '46 篇文章，一枚枚墨点' },
  { n: 18, start: 3030, dur: 90, act: 4, label: '书架 shimmer', cam: '横移扫过', caption: '读过的书，都站在这里' },
  { n: 19, start: 3120, dur: 140, act: 4, label: '生成式封面特写', cam: '缓推入画中画', caption: '每一篇，都有一幅只属于它的山水' },
  { n: 20, start: 3260, dur: 120, act: 4, label: '目录纸卷', cam: '跟随滚动纵移', caption: '目录如纸卷，随呼吸展开' },
  { n: 21, start: 3380, dur: 100, act: 4, label: '点赞急推', cam: '固定+局部急推', caption: '点赞吧~', punch: true },
  { n: 22, start: 3480, dur: 150, act: 4, label: '音乐年轮', cam: '环绕弧线运动', caption: '时间的年轮，刻着每一年的歌' },
  { n: 23, start: 3630, dur: 150, act: 4, label: '黑胶碟心换面', cam: '俯拍同轴缓旋', caption: '黑胶还在转，时光没走远' },
  { n: 24, start: 3780, dur: 110, act: 4, label: 'EQ 冻结卡点', cam: '同框分位特写', caption: '本卷最热 ·《按语》' },
  { n: 25, start: 3890, dur: 120, act: 4, label: '信笺留言板', cam: '纵向缓降沿纵线', caption: '驿寄梅花，鱼传尺素' },
  { n: 26, start: 4010, dur: 110, act: 4, label: '弹幕聊天室', cam: '推入弹窗·微摇', caption: '两种人格，一间屋子' },
  { n: 27, start: 4120, dur: 120, act: 4, label: 'About 全家桶', cam: '广角横摇', caption: '10,330 次活动 · 365 天 · 逐格真实' },
  { n: 28, start: 4240, dur: 120, act: 4, label: '足迹俯冲', cam: '俯瞰急降变焦', caption: '此乐何极~' },
  { n: 29, start: 4360, dur: 110, act: 4, label: '设计系统换装', cam: '分屏对比·微甩', caption: '换一种墨色，换一种心情' },
  { n: 30, start: 4470, dur: 110, act: 4, label: '全站漫游连拍', cam: '一镜到底高速穿梭', caption: '每一页，都在呼吸' },
  { n: 31, start: 4580, dur: 120, act: 4, label: '联系钤印', cam: '俯拍落章·微急推', caption: '代码写诗，工具作画' },
  { n: 32, start: 4700, dur: 300, act: 5, label: '坐忘歌诗影（全片最慢）', cam: '固定长镜·极缓微推', caption: '不怒百神和畅，不恼心地清凉。—— 1,673 次阅读' },
  { n: 33, start: 5000, dur: 250, act: 5, label: '书墙书摘', cam: '横移后缓推抽出', caption: '读过的每一行，都长进了骨头里' },
  { n: 34, start: 5250, dur: 250, act: 5, label: '足迹拍立得', cam: '俯拍落定·缓微推', caption: '2025，网站沉默的那一年——他仍在认真地生活' },
  { n: 35, start: 5500, dur: 100, act: 5, label: '光标承转', cam: '缓慢后拉入暗', caption: '然后，他把这些热爱，写成了方法。' },
  { n: 36, start: 5600, dur: 150, act: 6, label: '终端 initial release', cam: '屏幕微距缓推', caption: '他把开发方法本身，也写成了代码' },
  { n: 37, start: 5750, dur: 180, act: 6, label: '五段纸舟', cam: '侧向跟拍编队', caption: 'propose → apply → review → release → publish' },
  { n: 38, start: 5930, dur: 190, act: 6, label: '归档墙 254 briefs', cam: '升格横移+升降拉起', caption: '254 次完整循环 · 40 张知识卡片' },
  { n: 39, start: 6120, dur: 120, act: 6, label: '双时间轴交汇', cam: '拉远同框', caption: '方法与作品，一起长大' },
  { n: 40, start: 6240, dur: 210, act: 6, label: 'Meta 穿屏拉出', cam: '终极拉镜·画中画递归', caption: '这部片子，也是工作流的一次心跳' },
  { n: 41, start: 6450, dur: 100, act: 6, label: '工作流落款', cam: '固定·书写显现', caption: 'This film is made with shadow-dev-workflow' },
  { n: 42, start: 6550, dur: 180, act: 7, label: '年度柱状图冲顶', cam: '横向跟移+急推冲顶', caption: '2025 · 0 → 2026 · 4,387 · 历史最高', punch: true },
  { n: 43, start: 6730, dur: 170, act: 7, label: '书房全景', cam: '缓慢环绕·柔景深', caption: '日不过三餐，夜不过一宿……此乐何极' },
  { n: 44, start: 6900, dur: 130, act: 7, label: '墨点凝成', cam: '急速拉远骤停', caption: '' },
  { n: 45, start: 7030, dur: 170, act: 7, label: '落版·钤印', cam: '微距固定·光圈收缩', caption: 'wuh.site · 朝朝如念', punch: true },
];

const ACTS = [
  { n: 1, title: '序章', end: 700, tint: colors.bg },
  { n: 2, title: '起步与沉默', end: 1800, tint: colors.bgLift },
  { n: 3, title: '重启与复燃', end: 2800, tint: colors.terminalBg },
  { n: 4, title: '产品巡礼', end: 4700, tint: colors.bgLift },
  { n: 5, title: '创作人文', end: 5600, tint: colors.paperDeep },
  { n: 6, title: '影子工作流', end: 6550, tint: colors.terminalBg },
  { n: 7, title: '向好与落版', end: 7200, tint: colors.bg },
];

const ANCHORS = [
  { frame: 2420, label: '★ 钤印重鼓·全片第一重音' },
  { frame: 2800, label: '★ 白闪 · Act 4 起' },
  { frame: 3780, label: '★ EQ 冻结·骤停半拍' },
  { frame: 4700, label: '★ 鼓点全停 · Act 5 起' },
  { frame: 5600, label: '★ 电子节拍接管 · Act 6 起' },
  { frame: 6550, label: '◆ 反拍 · Act 7 起' },
  { frame: 7200, label: '★ 终击' },
];

const actOf = (frame: number) => ACTS.find((a) => frame < a.end) ?? ACTS[ACTS.length - 1];

// 分镜板样片：每镜渲染真实内容单色简板 + 字幕卡 + 卡点脉冲（评审构图与节奏，非成片质感）
export const SiteFilmAnimatic: FC = () => {
  const frame = useCurrentFrame();
  const shot = SHOTS.find((s) => frame >= s.start && frame < s.start + s.dur) ?? SHOTS[0];
  const act = actOf(frame);
  const local = frame - shot.start;
  const actFirst = SHOTS.find((s) => s.act === act.n) === shot;
  const Board = BOARDS[shot.n];

  const slateIn = interpolate(local, [0, 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const captionIn = interpolate(local, [Math.min(20, shot.dur * 0.2), Math.min(40, shot.dur * 0.45)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const punchScale = shot.punch
    ? interpolate(local, [0, 10, 24], [1.06, 0.98, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 1;
  const anchor = ANCHORS.find((a) => Math.abs(frame - a.frame) <= 14);
  const progress = frame / 7200;

  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <AbsoluteFill style={{ background: act.tint, opacity: 0.45 }} />
      {/* 宣纸肌理垫底 */}
      <AbsoluteFill style={{ background: colors.bgLift, opacity: 0.06 }} />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', transform: `scale(${punchScale})` }}>
        {Board ? <Board frame={local} /> : null}
      </AbsoluteFill>
      {/* 镜头 slate */}
      <div style={{ position: 'absolute', left: 56, top: 48, opacity: slateIn, fontFamily: fontFamilies.mono, color: colors.muted, fontSize: 18, lineHeight: 1.7 }}>
        <div>
          镜 {String(shot.n).padStart(2, '0')} / 45 · {shot.dur}f · {shot.start}–{shot.start + shot.dur}
        </div>
        <div style={{ color: colors.accent }}>🎥 {shot.cam}</div>
      </div>
      {/* 幕标题（幕首镜） */}
      {actFirst ? (
        <div
          style={{
            position: 'absolute',
            right: 90,
            top: 70,
            textAlign: 'right',
            opacity: interpolate(local, [0, 30, 120, 150], [0, 1, 1, 0.25], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}
        >
          <p style={{ fontFamily: fontFamilies.mono, fontSize: 20, color: colors.accent, margin: 0, letterSpacing: '0.4em' }}>ACT {act.n} / 7</p>
          <p style={{ fontFamily: fontFamilies.serif, fontSize: 72, color: colors.paper, margin: '10px 0 0', opacity: 0.85 }}>{act.title}</p>
        </div>
      ) : null}
      {/* 字幕卡 */}
      {shot.caption ? (
        <div
          style={{
            position: 'absolute',
            left: 140,
            right: 140,
            bottom: 160,
            textAlign: 'center',
            fontFamily: fontFamilies.serif,
            fontSize: shot.caption.length > 32 ? 34 : 44,
            color: colors.paper,
            opacity: captionIn,
            textShadow: `0 2px 24px ${colors.bg}`,
          }}
        >
          {shot.caption}
        </div>
      ) : null}
      {/* 卡点脉冲 */}
      {anchor ? (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', pointerEvents: 'none' }}>
          <div
            style={{
              width: 340,
              height: 340,
              borderRadius: 170,
              border: `2px solid ${colors.accent}`,
              opacity: interpolate(Math.abs(frame - anchor.frame), [0, 14], [0.9, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            }}
          />
          <p style={{ position: 'absolute', top: 150, fontFamily: fontFamilies.mono, fontSize: 24, color: colors.accent, margin: 0 }}>{anchor.label} @ {anchor.frame}</p>
        </AbsoluteFill>
      ) : null}
      {/* 进度 + 幕刻度 */}
      <div style={{ position: 'absolute', bottom: 56, left: 150, right: 150 }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
          {ACTS.map((a, i) => (
            <div key={a.n} style={{ flex: a.end - (i === 0 ? 0 : ACTS[i - 1].end), height: 4, background: frame < a.end ? colors.accent : colors.hairline, opacity: frame < a.end ? 0.9 : 0.5, borderRadius: 2 }} />
          ))}
        </div>
        <div style={{ height: 3, background: colors.hairline }}>
          <div style={{ width: `${progress * 100}%`, height: 3, background: colors.paper }} />
        </div>
        <p style={{ fontFamily: fontFamilies.mono, fontSize: 16, color: colors.muted, marginTop: 10, display: 'flex', justifyContent: 'space-between' }}>
          <span>preprod board-film · SiteFilmAnimatic</span>
          <span>
            Act {act.n}/7 {act.title} · 帧 {frame} / 7200 · {(frame / 30).toFixed(1)}s / 240s
          </span>
        </p>
      </div>
    </AbsoluteFill>
  );
};
