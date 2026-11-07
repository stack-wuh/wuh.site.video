/* 自动生成，勿手改：node scripts/captions.mjs
 *
 * v12：字幕跟**每一句旁白**走，一镜 0–4 条。
 * 真源：script-v10.md（台词逐字）× out/voice-v8/cues-v8.json（实测落点）
 *       × out/voice-v8/cues-v8-lines.json（opening / ending 两个整段真声的行级切分）
 * 落点：镜内帧 = round((旁白秒 − 本镜起点秒) × 30) − 2 … + 16；
 *       夹在 [本镜墨洇 inSide + 10, 镜长 − 下一镜 inSide − 10] 里，最短 30f，同镜两句间隔 ≥4f。
 * 组件按 useCurrentFrame() 挑当前活跃的一条，所以这里存数组。
 */
export type CaptionCue = { text: string; start: number; end: number };

export const CAPTION_CUES: Record<string, CaptionCue[]> = {
  s01: [
    { text: "念念。", start: 10, end: 40 },
    { text: "那天我们在海边看落日，我就想把这个故事做给你。", start: 44, end: 200 },
  ],
  s02: [
    { text: "后来我真的开始做了。", start: 10, end: 82 },
    { text: "做到一半，你发我一张落日，说是你拍的。", start: 99, end: 200 },
  ],
  s03: [
    { text: "做到一半，你发我一张落日，说是你拍的。", start: 10, end: 40 },
    { text: "我盯着看了很久，半天没回你。", start: 44, end: 192 },
  ],
  s04: [
    { text: "太巧了。", start: 10, end: 57 },
    { text: "巧得我差点以为，你知道了。", start: 61, end: 180 },
  ],
  s05: [
    { text: "故事从一座渡口开始。", start: 30, end: 73 },
    { text: "黄河边，风陵渡。", start: 77, end: 131 },
    { text: "郭襄是郭靖和黄蓉的女儿。生在襄阳。", start: 135, end: 240 },
  ],
  s06: [
    { text: "她十六岁。爹娘管得严，她偏要往外跑。", start: 30, end: 177 },
    { text: "那天她和姐姐弟弟出门，路过风陵渡。", start: 181, end: 240 },
  ],
  s07: [
    { text: "那天她和姐姐弟弟出门，路过风陵渡。", start: 30, end: 60 },
    { text: "客栈里有人在讲神雕侠。", start: 64, end: 110 },
    { text: "她听了一夜。", start: 114, end: 173 },
    { text: "第二天，她就跟着一队奇奇怪怪的人走了。", start: 177, end: 210 },
  ],
  s08: [
    { text: "第二天，她就跟着一队奇奇怪怪的人走了。", start: 30, end: 60 },
    { text: "我姐姐不让。我还是去了。", start: 64, end: 141 },
  ],
  s09: [
    { text: "万兽山庄。", start: 30, end: 60 },
    { text: "他戴着面具。一只袖子是空的。", start: 64, end: 176 },
    { text: "那条右臂，是她姐姐郭芙砍的。", start: 180, end: 210 },
  ],
  s10: [
    { text: "那条右臂，是她姐姐郭芙砍的。", start: 30, end: 73 },
    { text: "他待她像妹妹。", start: 77, end: 128 },
    { text: "临走，他给了她三枚金针。", start: 132, end: 176 },
    { text: "他说：见此金针，如见你面。三个心愿，我替你办。", start: 180, end: 210 },
  ],
  s11: [
    { text: "他说：见此金针，如见你面。三个心愿，我替你办。", start: 30, end: 119 },
    { text: "第一枚，我要看看你的脸。", start: 123, end: 196 },
    { text: "他摘下面具。", start: 200, end: 230 },
  ],
  s12: [
    { text: "她看见了。", start: 10, end: 40 },
    { text: "我看了他一眼，就低下头了。", start: 44, end: 112 },
  ],
  s13: [
    { text: "第二枚金针，她用在了生日。", start: 30, end: 97 },
    { text: "生日那天，你来襄阳看我。", start: 101, end: 146 },
    { text: "他来了。", start: 150, end: 180 },
  ],
  s14: [
    { text: "他带来的礼，全是给襄阳的。", start: 30, end: 108 },
    { text: "只有满天的烟花，是给她的。", start: 112, end: 150 },
  ],
  s15: [
    { text: "只有满天的烟花，是给她的。", start: 30, end: 60 },
    { text: "烟花炸出十个字：恭祝郭二姑娘多福多寿。", start: 64, end: 166 },
    { text: "她记得那一夜。记了一辈子。", start: 170, end: 200 },
  ],
  s16: [
    { text: "她记得那一夜。记了一辈子。", start: 10, end: 72 },
  ],
  s18: [
    { text: "后来她才知道，他心里有一个人。", start: 30, end: 99 },
    { text: "小龙女。他等了她十六年。", start: 103, end: 176 },
    { text: "十六年到了，他去了绝情谷。", start: 180, end: 210 },
  ],
  s19: [
    { text: "十六年到了，他去了绝情谷。", start: 30, end: 72 },
    { text: "她怕他做傻事，从襄阳赶过去。", start: 76, end: 176 },
    { text: "她赶到的时候，他刚从断肠崖上跳下去。", start: 180, end: 210 },
  ],
  s20: [
    { text: "她赶到的时候，他刚从断肠崖上跳下去。", start: 30, end: 75 },
    { text: "她想都没想，也跟着跳了。", start: 79, end: 159 },
    { text: "崖底是一潭水。两个人都没死。", start: 163, end: 230 },
  ],
  s21: [
    { text: "崖底是一潭水。两个人都没死。", start: 10, end: 46 },
    { text: "我不知道为什么。就是不想让他一个人。", start: 50, end: 146 },
    { text: "第三枚金针。我只有一个心愿——你以后，不许再寻死。", start: 150, end: 180 },
  ],
  s22: [
    { text: "第三枚金针。我只有一个心愿——你以后，不许再寻死。", start: 30, end: 133 },
    { text: "她把最后的机会，用来让他活着。", start: 137, end: 180 },
  ],
  s23: [
    { text: "她把最后的机会，用来让他活着。", start: 30, end: 60 },
    { text: "那天，小龙女也回来了。", start: 64, end: 103 },
    { text: "她站在旁边，看他们抱在一起。", start: 107, end: 180 },
  ],
  s24: [
    { text: "我该走了。", start: 30, end: 60 },
  ],
  s25: [
    { text: "华山一别，他和小龙女再没出现过。", start: 30, end: 115 },
    { text: "她骑着一头青驴，一个渡口一个渡口地找。", start: 119, end: 180 },
  ],
  s26: [
    { text: "她骑着一头青驴，一个渡口一个渡口地找。", start: 30, end: 60 },
    { text: "找了二十年。", start: 64, end: 94 },
    { text: "有人说，他三天前来过。", start: 98, end: 146 },
    { text: "每次都晚三天。", start: 150, end: 180 },
  ],
  s27: [
    { text: "每次都晚三天。", start: 30, end: 60 },
    { text: "江湖上，把这事编成了童谣。", start: 64, end: 137 },
    { text: "说书人说，她这一生，误在杨过身上。", start: 141, end: 180 },
  ],
  s28: [
    { text: "说书人说，她这一生，误在杨过身上。", start: 30, end: 66 },
    { text: "她听见了，没有回头。", start: 70, end: 139 },
    { text: "后来襄阳城破了。", start: 143, end: 200 },
  ],
  s29: [
    { text: "后来襄阳城破了。", start: 10, end: 40 },
    { text: "她的爹娘，她的弟弟，都死在城里。", start: 44, end: 142 },
    { text: "她在西川，赶不回去。", start: 146, end: 180 },
  ],
  s32: [
    { text: "四十岁那年，她在峨眉山出家。", start: 30, end: 114 },
    { text: "三枚金针，一枚也没留下。", start: 118, end: 148 },
    { text: "有人说，她在峨眉山上留下一首诗。", start: 152, end: 180 },
  ],
  s33: [
    { text: "有人说，她在峨眉山上留下一首诗。", start: 30, end: 100 },
    { text: "写的是十六岁那年的烟花。", start: 104, end: 180 },
  ],
  s34: [
    { text: "我走过山时，山不说话", start: 30, end: 98 },
    { text: "我路过海时，海不说话", start: 102, end: 166 },
    { text: "小毛驴滴滴答答", start: 170, end: 200 },
  ],
  s35: [
    { text: "小毛驴滴滴答答", start: 10, end: 40 },
    { text: "大家都说我因为爱着杨过大侠", start: 44, end: 127 },
    { text: "其实我只是爱上了峨眉山上的云和霞", start: 131, end: 180 },
  ],
  s36: [
    { text: "其实我只是爱上了峨眉山上的云和霞", start: 30, end: 64 },
    { text: "像极了十六岁那年的烟花", start: 68, end: 150 },
  ],
  s38: [
    { text: "念念。", start: 17, end: 61 },
    { text: "郭襄的三枚金针，都用完了。", start: 71, end: 154 },
    { text: "第一枚，她看了他的脸。", start: 158, end: 200 },
  ],
  s39: [
    { text: "第一枚，她看了他的脸。", start: 10, end: 42 },
    { text: "第二枚，她看了一夜烟花。", start: 46, end: 120 },
    { text: "第三枚，她让他活了下来。", start: 124, end: 200 },
  ],
  s40: [
    { text: "第三枚，她让他活了下来。", start: 10, end: 40 },
    { text: "我没有金针。", start: 50, end: 94 },
    { text: "我只有以后的每一个落日。", start: 102, end: 150 },
  ],
  s41: [
    { text: "你回头，我就在。", start: 30, end: 93 },
    { text: "现在，你知道了。", start: 97, end: 149 },
  ],
};
