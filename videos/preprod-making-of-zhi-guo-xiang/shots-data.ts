/* 生成物：与 videos/making-of-zhi-guo-xiang/shots-manifest.json 同源，改帧先改 storyboard.md 再同步两处 */
export type AnimaticShot = {
  id: string;
  n: number;
  act: number;
  startFrame: number;
  durationFrames: number;
  visual: string;
  cam: string;
  caption: string;
  transition: string;
};

export type AnimaticAct = { act: number; title: string; startFrame: number; endFrame: number };

export const TOTAL_FRAMES = 7680;

export const ACTS: AnimaticAct[] = [
  { act: 1, title: '钩子', startFrame: 0, endFrame: 360 },
  { act: 2, title: '一切从素材开始', startFrame: 360, endFrame: 1500 },
  { act: 3, title: '第一版成片', startFrame: 1500, endFrame: 2400 },
  { act: 4, title: '故事错了', startFrame: 2400, endFrame: 3450 },
  { act: 5, title: '镜头也错了', startFrame: 3450, endFrame: 4830 },
  { act: 6, title: '声音的进化', startFrame: 4830, endFrame: 5730 },
  { act: 7, title: '幕后', startFrame: 5730, endFrame: 6480 },
  { act: 8, title: '执念', startFrame: 6480, endFrame: 7680 },
];

export const SHOTS: AnimaticShot[] = [
  { id: 's01', n: 1, act: 1, startFrame: 0, durationFrames: 102, visual: '黑场起，M8 风陵渡一闪（母带 32.0–32.8s）即收回黑场', cam: '急推急收，定格一帧', caption: '这条片子，你可能看过。', transition: 'cut' },
  { id: 's02', n: 2, act: 1, startFrame: 102, durationFrames: 198, visual: 'M1→M2→M3→M4→M5→M6→M7 七版同位快闪（各 28f），右下角计数角标 01→07 翻动', cam: '硬切连闪，角标数字弹跳', caption: '但它的十一个版本，你没见过。', transition: 'cut' },
  { id: 's03', n: 3, act: 1, startFrame: 300, durationFrames: 60, visual: 'M2/M3/M4 三连闪（各 20f）后停黑场呼吸', cam: '硬切连闪', caption: '无', transition: 'cut' },
  { id: 's04', n: 4, act: 2, startFrame: 360, durationFrames: 150, visual: '文档快照卡：script-v2 首页（单色纸面质感，逐字浮现）', cam: '缓推近', caption: '第一次想拍郭襄，是十一月初。', transition: 'ink' },
  { id: 's05', n: 5, act: 2, startFrame: 510, durationFrames: 195, visual: '素材库快照卡：materials 条目列表滚动定格', cam: '缓推近', caption: '那时候没有画面，没有配音，只有一份素材库。', transition: 'cut' },
  { id: 's06', n: 6, act: 2, startFrame: 705, durationFrames: 255, visual: '查证三连卡：script-v6 / character-design / 金针出处条目依次叠换', cam: '左右横移叠换', caption: '原著里的每一枚金针、每一场雪，都得先查清楚从哪儿来。', transition: 'cut' },
  { id: 's07', n: 7, act: 2, startFrame: 960, durationFrames: 165, visual: 'v1→v7 文档卡堆叠成塔，计数角标 01→07', cam: '每张卡落下微弹', caption: '第八版之前，先有前七版的纸面功夫。', transition: 'cut' },
  { id: 's08', n: 8, act: 2, startFrame: 1125, durationFrames: 195, visual: 'animatic 开场实拍段：seg-animatic-open-v1（单色简板 8s 取 6.5s）', cam: '原速直放', caption: '然后，是一块单色的分镜板。', transition: 'dry' },
  { id: 's09', n: 9, act: 2, startFrame: 1320, durationFrames: 180, visual: 'M7 与 M1 同帧位对切（0.5s 间隔两次对切，先简后精）', cam: '对切闪烁', caption: '先简后精——节奏对了，才配拥有颜色。', transition: 'cut' },
  { id: 's10', n: 10, act: 3, startFrame: 1500, durationFrames: 300, visual: 'v8 开场实拍段：seg-evolution-v8-open-v1（0.8× 变速），左下角 CI 角标 run 41270162934 ✓', cam: '原速直放，角标淡入', caption: '十一月一号，五十二个镜头，第一次能从头放到尾。', transition: 'ink' },
  { id: 's11', n: 11, act: 3, startFrame: 1800, durationFrames: 180, visual: 'CI 矩阵动画：52 个方块网格并发点亮逐个变绿，末格 assemble 汇拢', cam: '网格波次点亮', caption: '五十两个任务同时跑，一次全绿。', transition: 'cut' },
  { id: 's12', n: 12, act: 3, startFrame: 1980, durationFrames: 180, visual: 'M1 续放（母带 10–17s 段）', cam: '原速直放', caption: '那天我以为，最难的部分已经过去了。', transition: 'cut' },
  { id: 's13', n: 13, act: 3, startFrame: 2160, durationFrames: 210, visual: 'M1 高光纯放（母带 74–81s 面具段），无字幕', cam: '原速直放', caption: '无', transition: 'cut' },
  { id: 's14', n: 14, act: 4, startFrame: 2370, durationFrames: 180, visual: '文档快照卡：script-v10 校对表（表格逐行显影）', cam: '缓推近', caption: '后来发现，错的不是画面，是故事。', transition: 'ink' },
  { id: 's15', n: 15, act: 4, startFrame: 2550, durationFrames: 150, visual: '诗六行卡：六行诗居中，「伪托」朱印砸落', cam: '定场，印章缩放砸落', caption: '片头那首诗，金庸从来没写过。', transition: 'cut' },
  { id: 's16', n: 16, act: 4, startFrame: 2700, durationFrames: 240, visual: 'M8 金针三连：揭面（母带 86s）→ 生日（母带 98s）→ 第三针（母带 168s），每段 2.5s', cam: '三段跳切', caption: '三枚金针，原著里她全用了——最后一枚，是求他别死。', transition: 'cut' },
  { id: 's17', n: 17, act: 4, startFrame: 2940, durationFrames: 165, visual: 'M8 揭面段续（母带 86–90s）', cam: '原速直放', caption: '揭掉面具在十六岁，不是二十四年后。', transition: 'cut' },
  { id: 's18', n: 18, act: 4, startFrame: 3105, durationFrames: 225, visual: '文档快照卡：design-v10 十条错误留痕逐条打字浮现', cam: '打字机推进', caption: '评审留了底稿：初稿十条事实错误，一条一条列着。', transition: 'cut' },
  { id: 's19', n: 19, act: 4, startFrame: 3330, durationFrames: 150, visual: 'M8 风陵渡→万兽山庄（母带 32–35.5s / 78–81.5s 两跳）', cam: '双段跳切', caption: '于是故事按原著，全部重写。', transition: 'cut' },
  { id: 's20', n: 20, act: 5, startFrame: 3480, durationFrames: 210, visual: 'M6 金针手镜整镜（v11 原 S11，实测母带 82.0–90.0s）', cam: '缓推近', caption: '最后一版做了个狠决定：删掉一整个镜头。', transition: 'ink' },
  { id: 's21', n: 21, act: 5, startFrame: 3690, durationFrames: 150, visual: 'M6 手掌特写放大', cam: '急推特写', caption: '线描的手掌，和水墨不是一个族。', transition: 'cut' },
  { id: 's22', n: 22, act: 5, startFrame: 3840, durationFrames: 165, visual: 'M6 手镜段 → M8 同段位对切（删镜前后对切两次）', cam: '对切闪烁', caption: '删掉的八秒，分给了别人的戏。', transition: 'cut' },
  { id: 's23', n: 23, act: 5, startFrame: 4005, durationFrames: 120, visual: '帧数卡：9060f = 9060f 两行数字对置，中缝一道划痕', cam: '定场卡', caption: '删完，总长一秒没变。', transition: 'cut' },
  { id: 's24', n: 24, act: 5, startFrame: 4125, durationFrames: 225, visual: 'M8 万兽山庄扩段纯放（母带 78–86.5s，删镜后变长的戏），无字幕', cam: '原速直放', caption: '无', transition: 'cut' },
  { id: 's25', n: 25, act: 5, startFrame: 4350, durationFrames: 240, visual: '文档快照卡：四次正脸生图样缩略（马赛克 + 红叉砸落），「动漫先验 · 四轮实证」标签', cam: '打字机 + 红叉×4', caption: 'AI 画她的正脸，四轮全崩成动漫脸。', transition: 'cut' },
  { id: 's26', n: 26, act: 5, startFrame: 4590, durationFrames: 240, visual: '对照卡：左侧黑底侧影 + 两枚金色反光点（代码画点示意），右侧「剪影暗部主义」标签', cam: '左右分屏对置', caption: '后来不画脸了，画剪影，反而像了。', transition: 'cut' },
  { id: 's27', n: 27, act: 6, startFrame: 4830, durationFrames: 150, visual: '正片 TTS 段（M8 母带 168–172s）+ 屏幕角标「TTS」合成声波形条', cam: '原速直放+波形条', caption: '前几版的旁白，是 AI 念的。', transition: 'dry' },
  { id: 's28', n: 28, act: 6, startFrame: 4980, durationFrames: 165, visual: '录音花絮：A1/A2/A3 波形卡三连（配真声试听短促采样）', cam: '波形呼吸律动', caption: '倒数第二版，我自己的声音进来了。', transition: 'cut' },
  { id: 's29', n: 29, act: 6, startFrame: 5145, durationFrames: 255, visual: '漂移示意卡：两条 cue 波形错位拉开至 −16.17s 标注', cam: '波形错位动画', caption: '但更大的坑在排队：旁白按幕铺，最重漂到负十六秒。', transition: 'cut' },
  { id: 's30', n: 30, act: 6, startFrame: 5400, durationFrames: 180, visual: '对齐示意卡：波形逐句吸附归位，中位 1.51s 标注', cam: '逐句吸附', caption: '改成按镜铺，中位误差一点五秒。', transition: 'cut' },
  { id: 's31', n: 31, act: 6, startFrame: 5580, durationFrames: 150, visual: '真声段纯放：A2 开头.m4a 对应正片段（M8 母带 4–9s），无字幕', cam: '原速直放', caption: '无', transition: 'cut' },
  { id: 's32', n: 32, act: 7, startFrame: 5730, durationFrames: 135, visual: 'CI 卡：cancelled 红色日志滚动（run 42258912553）', cam: '日志滚动', caption: '深夜里，机器也会罢工。', transition: 'dry' },
  { id: 's33', n: 33, act: 7, startFrame: 5865, durationFrames: 180, visual: '三级兜底流程卡：重试 → 子集 → 拆段拼，三步箭头推进', cam: '步进动画', caption: '重试、子集、拆段拼，三级兜底救回来。', transition: 'cut' },
  { id: 's34', n: 34, act: 7, startFrame: 6045, durationFrames: 165, visual: 'CI 卡：样片子集「s06 s21」两格点亮（run 41285587793）', cam: '两格点亮', caption: '平时改一镜、看一帧，从不重渲整片。', transition: 'cut' },
  { id: 's35', n: 35, act: 7, startFrame: 6210, durationFrames: 270, visual: '深夜空镜：代码窗与日志流在暗色里滚动（原生绘制，非屏录）', cam: '缓推近', caption: '无', transition: 'cut' },
  { id: 's36', n: 36, act: 8, startFrame: 6480, durationFrames: 240, visual: '黑场，计数角标「11」定格放大', cam: '缓慢放大定格', caption: '有人问：一条四分半的片子，至于改十一版吗。', transition: 'ink' },
  { id: 's37', n: 37, act: 8, startFrame: 6720, durationFrames: 105, visual: 'M8 风陵渡（母带 32–34.5s）', cam: '原速直放', caption: '风陵渡口初相遇。', transition: 'cut' },
  { id: 's38', n: 38, act: 8, startFrame: 6825, durationFrames: 180, visual: 'M8 青驴等待蒙太奇（母带 196–202s）', cam: '原速直放', caption: '她的执念，是等一个不会回头的人。', transition: 'cut' },
  { id: 's39', n: 39, act: 8, startFrame: 7005, durationFrames: 165, visual: 'M8 诗行段（母带 244–249.5s）', cam: '原速直放', caption: '我的执念，是让她被讲对。', transition: 'cut' },
  { id: 's40', n: 40, act: 8, startFrame: 7170, durationFrames: 255, visual: 'M8 片尾念念段（母带 270–278.5s）', cam: '缓推近', caption: '最后一版，只比第一版多了一件事：她的事，是真的。', transition: 'cut' },
  { id: 's41', n: 41, act: 8, startFrame: 7425, durationFrames: 255, visual: '落版卡：片名《风陵 · 致郭襄》+「现在，是她该有的样子。」+ 计数「11 versions」', cam: '定场，印章+BGM 淡出', caption: '《风陵 · 致郭襄》。现在，是她该有的样子。', transition: 'ink' },
];
