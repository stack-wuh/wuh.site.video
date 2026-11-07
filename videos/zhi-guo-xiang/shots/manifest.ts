/* 由 scripts/shots.mjs sync 生成——勿手改；真源 shots-manifest.json（类型化视图） */
export type Transition = 'page' | 'dry' | 'ink' | 'cut';

/** 转场单侧帧数（总帧 = 2×；cut = 0）：墨洇 20 / 纸翻 18 / 飞白 10。in = 镜首 inbound，out = 下一镜 inbound */
export const TRANSITION_SIDE: Record<Transition, number> = {
  "page": 18,
  "dry": 10,
  "ink": 20,
  "cut": 0
};

export type Manifest = { film: string; fps: number; totalFrames: number; acts: Array<{ act: number; title: string; startFrame: number; endFrame: number }>; shots: Array<{ id: string; act: number; title: string; startFrame: number; durationFrames: number; transition: Transition; source: string }> };

export const manifest: Manifest = {
  "film": "zhi-guo-xiang",
  "fps": 30,
  "totalFrames": 8760,
  "acts": [
    {
      "act": 1,
      "title": "序·海边",
      "startFrame": 0,
      "endFrame": 840
    },
    {
      "act": 2,
      "title": "风陵渡",
      "startFrame": 840,
      "endFrame": 1860
    },
    {
      "act": 3,
      "title": "万兽山庄",
      "startFrame": 1860,
      "endFrame": 2820
    },
    {
      "act": 4,
      "title": "襄阳",
      "startFrame": 2820,
      "endFrame": 3780
    },
    {
      "act": 5,
      "title": "绝情谷",
      "startFrame": 3780,
      "endFrame": 5340
    },
    {
      "act": 6,
      "title": "华山·青驴·城破",
      "startFrame": 5340,
      "endFrame": 6780
    },
    {
      "act": 7,
      "title": "峨眉",
      "startFrame": 6780,
      "endFrame": 7980
    },
    {
      "act": 8,
      "title": "尾·海",
      "startFrame": 7980,
      "endFrame": 8760
    }
  ],
  "shots": [
    {
      "id": "s01",
      "act": 1,
      "title": "念念。",
      "startFrame": 0,
      "durationFrames": 210,
      "transition": "cut",
      "source": "shots/s01.tsx"
    },
    {
      "id": "s02",
      "act": 1,
      "title": "那天我们在海边看落日，我就想把这个故事做给你。",
      "startFrame": 210,
      "durationFrames": 210,
      "transition": "cut",
      "source": "shots/s02.tsx"
    },
    {
      "id": "s03",
      "act": 1,
      "title": "做到一半，你发我一张落日，说是你拍的。",
      "startFrame": 420,
      "durationFrames": 210,
      "transition": "cut",
      "source": "shots/s03.tsx"
    },
    {
      "id": "s04",
      "act": 1,
      "title": "我盯着看了很久，半天没回你。太巧了。巧得我差点以",
      "startFrame": 630,
      "durationFrames": 210,
      "transition": "cut",
      "source": "shots/s04.tsx"
    },
    {
      "id": "s05",
      "act": 2,
      "title": "故事从一座渡口开始。黄河边，风陵渡。",
      "startFrame": 840,
      "durationFrames": 270,
      "transition": "ink",
      "source": "shots/s05.tsx"
    },
    {
      "id": "s06",
      "act": 2,
      "title": "郭襄是郭靖和黄蓉的女儿，生在襄阳。",
      "startFrame": 1110,
      "durationFrames": 270,
      "transition": "ink",
      "source": "shots/s06.tsx"
    },
    {
      "id": "s07",
      "act": 2,
      "title": "客栈里有人在讲神雕侠。她听了一夜。",
      "startFrame": 1380,
      "durationFrames": 240,
      "transition": "ink",
      "source": "shots/s07.tsx"
    },
    {
      "id": "s08",
      "act": 2,
      "title": "（女）我姐姐不让。我还是去了。",
      "startFrame": 1620,
      "durationFrames": 240,
      "transition": "ink",
      "source": "shots/s08.tsx"
    },
    {
      "id": "s09",
      "act": 3,
      "title": "万兽山庄。",
      "startFrame": 1860,
      "durationFrames": 240,
      "transition": "ink",
      "source": "shots/s09.tsx"
    },
    {
      "id": "s10",
      "act": 3,
      "title": "他戴着面具，一只袖子是空的。",
      "startFrame": 2100,
      "durationFrames": 240,
      "transition": "ink",
      "source": "shots/s10.tsx"
    },
    {
      "id": "s11",
      "act": 3,
      "title": "他给了她三枚金针。见此金针，如见你面。三个心愿，",
      "startFrame": 2340,
      "durationFrames": 240,
      "transition": "ink",
      "source": "shots/s11.tsx"
    },
    {
      "id": "s12",
      "act": 3,
      "title": "（女）第一枚，我要看看你的脸。／他摘下面具。她看",
      "startFrame": 2580,
      "durationFrames": 240,
      "transition": "cut",
      "source": "shots/s12.tsx"
    },
    {
      "id": "s13",
      "act": 4,
      "title": "第二枚金针，她用在了生日。",
      "startFrame": 2820,
      "durationFrames": 210,
      "transition": "ink",
      "source": "shots/s13.tsx"
    },
    {
      "id": "s14",
      "act": 4,
      "title": "（女）生日那天，你来襄阳看我。",
      "startFrame": 3030,
      "durationFrames": 180,
      "transition": "ink",
      "source": "shots/s14.tsx"
    },
    {
      "id": "s15",
      "act": 4,
      "title": "他来了。他带来的礼，全是给襄阳的。",
      "startFrame": 3210,
      "durationFrames": 210,
      "transition": "ink",
      "source": "shots/s15.tsx"
    },
    {
      "id": "s16",
      "act": 4,
      "title": "只有满天的烟花，是给她的。",
      "startFrame": 3420,
      "durationFrames": 180,
      "transition": "cut",
      "source": "shots/s16.tsx"
    },
    {
      "id": "s17",
      "act": 4,
      "title": "烟花炸出十个字：恭祝郭二姑娘多福多寿。",
      "startFrame": 3600,
      "durationFrames": 180,
      "transition": "cut",
      "source": "shots/s17.tsx"
    },
    {
      "id": "s18",
      "act": 5,
      "title": "后来她才知道，他心里有一个人。",
      "startFrame": 3780,
      "durationFrames": 240,
      "transition": "ink",
      "source": "shots/s18.tsx"
    },
    {
      "id": "s19",
      "act": 5,
      "title": "小龙女。他等了她十六年。",
      "startFrame": 4020,
      "durationFrames": 240,
      "transition": "ink",
      "source": "shots/s19.tsx"
    },
    {
      "id": "s20",
      "act": 5,
      "title": "十六年到了，他去了绝情谷。",
      "startFrame": 4260,
      "durationFrames": 240,
      "transition": "ink",
      "source": "shots/s20.tsx"
    },
    {
      "id": "s21",
      "act": 5,
      "title": "她赶到的时候，他刚从断肠崖上跳下去。她想都没想，",
      "startFrame": 4500,
      "durationFrames": 210,
      "transition": "cut",
      "source": "shots/s21.tsx"
    },
    {
      "id": "s22",
      "act": 5,
      "title": "（女）就是不想让他一个人。",
      "startFrame": 4710,
      "durationFrames": 210,
      "transition": "ink",
      "source": "shots/s22.tsx"
    },
    {
      "id": "s23",
      "act": 5,
      "title": "（女）第三枚金针。你以后，不许再寻死。／她把最后",
      "startFrame": 4920,
      "durationFrames": 210,
      "transition": "ink",
      "source": "shots/s23.tsx"
    },
    {
      "id": "s24",
      "act": 5,
      "title": "那天，小龙女也回来了。／（女）我该走了。",
      "startFrame": 5130,
      "durationFrames": 210,
      "transition": "ink",
      "source": "shots/s24.tsx"
    },
    {
      "id": "s25",
      "act": 6,
      "title": "华山一别，他和小龙女再没出现过。",
      "startFrame": 5340,
      "durationFrames": 210,
      "transition": "ink",
      "source": "shots/s25.tsx"
    },
    {
      "id": "s26",
      "act": 6,
      "title": "无",
      "startFrame": 5550,
      "durationFrames": 210,
      "transition": "ink",
      "source": "shots/s26.tsx"
    },
    {
      "id": "s27",
      "act": 6,
      "title": "她骑着一头青驴，一个渡口一个渡口地找。找了二十年",
      "startFrame": 5760,
      "durationFrames": 210,
      "transition": "ink",
      "source": "shots/s27.tsx"
    },
    {
      "id": "s28",
      "act": 6,
      "title": "有人说，他三天前来过。／（女）每次都晚三天。",
      "startFrame": 5970,
      "durationFrames": 210,
      "transition": "ink",
      "source": "shots/s28.tsx"
    },
    {
      "id": "s29",
      "act": 6,
      "title": "江湖上，把这事编成了童谣。说书人说，她这一生，误",
      "startFrame": 6180,
      "durationFrames": 210,
      "transition": "cut",
      "source": "shots/s29.tsx"
    },
    {
      "id": "s30",
      "act": 6,
      "title": "峨眉有个郭女侠，等郎等到白了发。",
      "startFrame": 6390,
      "durationFrames": 210,
      "transition": "ink",
      "source": "shots/s30.tsx"
    },
    {
      "id": "s31",
      "act": 6,
      "title": "后来襄阳城破了。她的爹娘，她的弟弟，都死在城里。",
      "startFrame": 6600,
      "durationFrames": 180,
      "transition": "ink",
      "source": "shots/s31.tsx"
    },
    {
      "id": "s32",
      "act": 7,
      "title": "四十岁那年，她在峨眉山出家。",
      "startFrame": 6780,
      "durationFrames": 210,
      "transition": "ink",
      "source": "shots/s32.tsx"
    },
    {
      "id": "s33",
      "act": 7,
      "title": "三枚金针，一枚也没留下。",
      "startFrame": 6990,
      "durationFrames": 210,
      "transition": "ink",
      "source": "shots/s33.tsx"
    },
    {
      "id": "s34",
      "act": 7,
      "title": "有人说，她在峨眉山上留下一首诗。",
      "startFrame": 7200,
      "durationFrames": 210,
      "transition": "ink",
      "source": "shots/s34.tsx"
    },
    {
      "id": "s35",
      "act": 7,
      "title": "写的是十六岁那年的烟花。／诗 L1–L2",
      "startFrame": 7410,
      "durationFrames": 210,
      "transition": "cut",
      "source": "shots/s35.tsx"
    },
    {
      "id": "s36",
      "act": 7,
      "title": "诗 L3–L4",
      "startFrame": 7620,
      "durationFrames": 180,
      "transition": "ink",
      "source": "shots/s36.tsx"
    },
    {
      "id": "s37",
      "act": 7,
      "title": "诗 L5–L6",
      "startFrame": 7800,
      "durationFrames": 180,
      "transition": "ink",
      "source": "shots/s37.tsx"
    },
    {
      "id": "s38",
      "act": 8,
      "title": "念念。郭襄的三枚金针，都用完了。",
      "startFrame": 7980,
      "durationFrames": 210,
      "transition": "cut",
      "source": "shots/s38.tsx"
    },
    {
      "id": "s39",
      "act": 8,
      "title": "第一枚，她看了他的脸。第二枚，她看了一夜烟花。",
      "startFrame": 8190,
      "durationFrames": 210,
      "transition": "cut",
      "source": "shots/s39.tsx"
    },
    {
      "id": "s40",
      "act": 8,
      "title": "第三枚，她让他活了下来。我没有金针。",
      "startFrame": 8400,
      "durationFrames": 180,
      "transition": "cut",
      "source": "shots/s40.tsx"
    },
    {
      "id": "s41",
      "act": 8,
      "title": "我只有以后的每一个落日。你回头，我就在。现在，你",
      "startFrame": 8580,
      "durationFrames": 180,
      "transition": "ink",
      "source": "shots/s41.tsx"
    }
  ]
};
