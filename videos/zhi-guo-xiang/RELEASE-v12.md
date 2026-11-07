# 《风陵 · 致郭襄》v12 交付记录（2026-11-07）

## 成片

| 项 | 值 |
|---|---|
| 时长 | **4:52（302.000s / 9060f @30fps）** = 片头 120f + 正片 8760f + 片尾 180f |
| 画幅 | 1920×1080 · H.264 · 30fps · CFR |
| 音轨 | AAC 48k stereo，峰值 −9.1 dBFS，无削顶 |
| 镜数 | **40 镜 / 八幕**，转场只有「墨洇（单侧 20f）」与「切（0f）」 |
| 终混 | 旁白（292.0s，正片 0 基，峰值 −6.0 dBFS）+ BGM 床（302.000s，已带避让包络），amix 后限幅 0.95 |
| 成片文件 | 本地 `out/final/fengling-zhi-guo-xiang-v12.mp4`（242 MB，**不入库**：超 GitHub 单文件上限，且含真人照片/录音衍生素材） |

## 这一版的关键决定

1. **原著校正**：三枚金针全部用到（①看脸 ②生日来襄阳 ③不许轻生）；万兽山庄初见而非渡口救她；揭面发生在 16 岁而非 24 年后；烟花十个字是「恭祝郭二姑娘多福多寿」且她**知道**；小龙女是中心；绝情谷跳崖保留；襄阳城破（郭靖/黄蓉/郭破虏死）；骑青驴不御剑。诗六行是网络伪作，按既定文本逐字用，不改标点。
2. **删掉金针手镜（原 S11）**：线描手掌与全片水墨不同族，整镜删除；240f 分给万兽山庄全景（8→12s）与揭面具（8→12s），总时长不变，镜号整体前移（现 40 镜）。
3. **收剑入匣去动画（S32）**：剑影入匣/合盖/火星整段代码动画删除，只留底图与极缓推近。
4. **旁白从「按幕铺」改为「按镜铺」**：旧版按幕排、漂移最重 −16.17s，且 s17/s30/s31/s37 静音、s26 多出 4 句；重铺后每句落进它所属镜头的窗口内，镜内偏移中位 1.51s。
5. **字幕升到行级**：`CAPTION_CUES[shotId] = Cue[]`，按当前帧挑活跃一条；一镜挤不下时丢后一句字幕而不是叠字；淡变窗按实际时长自适应（旧版固定 10f 进/12f 出，遇到 18f 的短字幕会让 `inputRange` 非单调，Remotion 直接抛错、整镜报废）。
6. **摄影机推拉修复**：`Scene`/`Slide` 原先读 `useVideoConfig().durationInFrames`（装配层拿到根时长），导致 s18+ 共 21 镜推拉近乎静止；全部换成显式 `total` 的 `ShotScene`/`ShotSlide`。

## 可复现产物（本目录）

| 文件 | 用途 |
|---|---|
| `assets/script-v10.md` | 剧本真源（原著校正版） |
| `../preprod-zhi-guo-xiang/assets/storyboard.md` | 分镜真源（40 镜 / 七列严格表） |
| `assets/vo-pack/vo-read-v8.md` · `vo-lines-v8-*.txt` | 录音用的片序文本 |
| `assets/vo-pack/cues-v8.json` | 62 条旁白实测落点（正片 0 基秒） |
| `assets/vo-pack/cues-v8-lines.json` | 真声段 m01–m07 / m54–m62 的行级切分 |
| `assets/vo-pack/lay-v8.md` | 76 句 → 镜 → 起止 → 镜内偏移 → 是否溢出 全表 |
| `assets/vo-pack/caption-audit-v8.md` | 字幕对账表（88 条） |
| `assets/music/bgm-plan-v8.md` | BGM v8.1：12 段剪辑、43 处避让、接缝与响度实测 |
| `assets/music/bgm-verify-v8.txt` | BGM 床的 11 项硬断言 |
| `scripts/captions.mjs` | 字幕生成器（行级，读 cues + cues-lines） |
| `scripts/lay-voice.py` | 旁白按镜重铺（读 clips + manifest，输出 cues + 音轨） |
| `scripts/mux-film.sh` | 终混：无声成片 + 旁白（+4.000s）+ BGM 床 |

## 不入库的素材（公开仓纪律）

- `public/zhi-guo-xiang/scene/photo-nianian-sunset.jpg` — 她拍的那张落日原图
- `videos/zhi-guo-xiang/assets/vo-pack/audio/` — 真人录音与克隆样本
- `videos/zhi-guo-xiang/assets/refs/` — 参考图
- `public/zhi-guo-xiang/bgm/ai-yi.flac` — 陈致逸《爱意（金风玉露变奏）》，版权；已 `git rm --cached`
  （历史提交里仍能取到，需要彻底清除时做 `git filter-repo`）

## 出片链路

```bash
# 渲染（只在 GitHub Actions，本机不渲）
gh workflow run render-film.yml --ref <branch> -f film=zhi-guo-xiang   # --ref 必带，否则跑默认分支
# 取回 + 终混
gh run download <run-id> -n <film-artifact> -D out/ci-final
./scripts/mux-film.sh out/ci-final/<film>.mp4 out/voice-v8/voice-track-v8.wav out/bgm-v12/bgm-bed-v8.wav out/final/final.mp4
```