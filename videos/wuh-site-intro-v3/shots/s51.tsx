/* S51 · Act 8 此刻 · 局部帧 [0,94) · 94f · 绝对 6954–7048
 *
 * 审计重定义（2026-11-12 批次 E 返工单）：旧「证据小窗」退役（§3 内容本体化：全片禁页面快照），
 * 改 console 数据件完整讲「播放器能用了——自己接的网易云 API」：
 * 请求行 typeCharsAt 键击（GET /api/netease 真实语义）→ 200 OK 状态点亮（暖金辉光）
 * → 真曲名跑马灯跑起来（曲名 = s33 YEAR_FAVS 八年年度最爱真歌单；本片无常量共享源，
 * 曲名自 s33/shots/s33.tsx 原样抄录于本镜底部常量，零编造）。
 * 不可播降级→切歌→可用的真实叙事保留为 console 行（40–52 fallback → 52 retry 200 OK），
 * HUD 读数三段（CONNECTING/FALLBACK/PLAYING）原样。
 *
 * 编排四问：
 * ① 承接——s50 尾帧交出「光点密轴」：0–10 线框 console 窗 springIn 落位（位移入场），
 *   服务节点「自建网易云 API」（14 springIn）与连接线 pathDraw（20–40 原窗口）把两端接通。
 * ② 触发——光标键击发出请求行（12–26 typeCharsAt），console 自己「跑」起一次真实调用。
 * ③ 展开——[26–30] 等待脉动 → [30] 200 OK 点亮（gold 闪 + 辉光）→ [38–54] 真曲名 payload 键击
 *   → [40] fallback 行 → [52] retry 200 OK → [60] 播放键朱红亮起（本镜唯一朱红=手作签名）
 *   → [60–70] EQ 三柱升起并持续跳动 → [62–94] 真曲名跑马灯（FN-37 物理匀速例外，周期=曲单宽无缝循环）。
 * ④ 交接——尾帧：波形扩散（manifest endFrameDesc 契约「交接态：波形扩散成页」原样，80–94 原窗口）。
 *
 * 逐拍帧表（局部帧，fps=30）：
 * [0–10]    console 窗 springIn 落位（translateY -22→0 + scale 0.96→1）；
 * [14]      服务节点 springIn 弹出（右上线框）；[20–40] 连接线 pathDraw 画通 console→播放器；
 * [12–26]   L1 `$ GET /api/netease/song/stream` typeCharsAt（1.4 字/f）+ 键击光标；
 * [26–30]   等待三点脉动；[30] L2 `← 200 OK · 1.24s` gold 点亮（闪 9f + 辉光）；
 * [38–54]   L3 真曲名 payload typeCharsAt；[40] L4 fallback 行（textMuted）；
 * [52]      L5 retry 200 OK gold；[60] 播放键 sealRed springIn 亮起 + EQ 柱升起（60–70 后持续跳动）；
 * [62–94]   跑马灯真曲名滚动（YEAR_FAVS）；[80–94] 波形扩散三环 = 交接态。
 * 时间轴零改动：94f / Caption（文本+appearAt 14）原样；无 <Sequence>；零 Img/静态资源引用；
 * FILM_COLORS2 only；random(seed) only；springIn fps 取 useVideoConfig()。
 * 转场：入「切」，出「切」。字幕安全窗：start≥12、end≤82。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES, eqBars, inkDraw } from '../../../brand/motion';
import { FILM_COLORS2, glowText, springIn, typeCharsAt } from '../motion-tokens';
import { CameraRig } from '../components/CameraRig';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';

const TOTAL = 94;
/* 连接线 console→播放器（真长度驱动） */
const LINK_D = 'M 810 430 C 980 424 1084 496 1216 560';

/* 请求/响应行（真实语义；状态点亮节奏见逐拍帧表） */
const REQ = '$ GET /api/netease/song/stream';
const PAYLOAD = 'track: 爱意（金风玉露变奏） · artist: 陈致逸';
const GOLD = '233,217,174';

/* 真曲名跑马灯数据：曲名/歌手 = s33 YEAR_FAVS（八年年度最爱真歌单，materials §2.8）原样抄录 */
const YEAR_FAVS_SONGS: Array<{ song: string; artist: string }> = [
  { song: '诱惑的街 (Live)', artist: '林志炫' },
  { song: '腻味', artist: '金玟岐' },
  { song: '少年不凡', artist: '刘美麟' },
  { song: '风月缠绵（金风玉露变奏）', artist: '陈致逸' },
  { song: '归期', artist: '钱润玉' },
  { song: '爱意（金风玉露变奏）', artist: '陈致逸' },
];
const MARQUEE_CELL = 300; // 单曲 chip 单元宽（px）——整条曲单周期 = CELL × N，保证无缝循环
const MARQUEE_SPEED = 2.6; // px/frame（FN-37 物理匀速例外）

const S51: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const consoleP = springIn(frame, 0, fps);
  const nodeP = springIn(frame, 14, fps);
  const playP = springIn(frame, 60, fps);
  const lineP = interpolate(frame, [20, 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut });
  const reqTyped = typeCharsAt(frame, REQ.length, 12, 0.7);
  const payTyped = typeCharsAt(frame, PAYLOAD.length, 38, 0.8);
  const okFlash = interpolate(frame, [30, 32, 40], [0, 1, 0.25], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const retryFlash = interpolate(frame, [52, 54, 62], [0, 1, 0.3], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const playOn = frame >= 60;
  const bars = eqBars(frame);
  const eqUp = interpolate(frame, [60, 70], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseOut });
  /* 跑马灯：FN-37 物理匀速，周期 = 整条曲单宽（无缝） */
  const strip = [...YEAR_FAVS_SONGS, ...YEAR_FAVS_SONGS];
  const marqueeX = -((frame * MARQUEE_SPEED) % (MARQUEE_CELL * YEAR_FAVS_SONGS.length));
  const cam = { scale: 1.05, x: interpolate(frame, [0, TOTAL], [30, -30], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: CURVES.cineEaseInOut }), y: 0, rot: 0 };

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <CameraRig cam={cam}>
        <AbsoluteFill>
          <DeepSpace seed="s51v2" stars={52} grid horizon />

          {/* 「自建网易云 API」服务节点（右上，线框 + 辉光，14 springIn） */}
          <div style={{ position: 'absolute', right: 260, top: 180, opacity: Math.min(1, nodeP * 1.5), transform: `translateY(${(1 - nodeP) * 22}px) scale(${0.92 + nodeP * 0.08})`, textAlign: 'center' }}>
            <div
              style={{
                width: 220,
                height: 90,
                borderRadius: 8,
                border: `1px solid ${FILM_COLORS2.dataDim}`,
                background: FILM_COLORS2.panel,
                boxShadow: `0 0 26px rgba(212,163,115,0.16), 0 16px 40px rgba(0,0,0,0.55)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 19, color: FILM_COLORS2.paperWhite, ...glowText(FILM_COLORS2.data, 0.22) }}>自建网易云 API</span>
            </div>
          </div>
          {/* 连接线（20–40 原窗口，真长度；辉光双层描边） */}
          <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <path d={LINK_D} fill="none" stroke="rgba(212,163,115,0.28)" strokeWidth={7} {...inkDraw(lineP, LINK_D)} />
            <path d={LINK_D} fill="none" stroke={FILM_COLORS2.data} strokeWidth={2} {...inkDraw(lineP, LINK_D)} opacity={0.9} />
          </svg>

          {/* console 数据件（0–10 springIn 落位）：请求行键击 → 200 OK 点亮 → 真曲名 payload → fallback/retry */}
          <div
            style={{
              position: 'absolute',
              left: 130,
              top: 200,
              width: 680,
              height: 270,
              borderRadius: 10,
              border: `1px solid ${FILM_COLORS2.dataDim}`,
              background: FILM_COLORS2.panel,
              boxShadow: `0 0 34px rgba(212,163,115,0.14), 0 20px 60px rgba(0,0,0,0.6)`,
              opacity: Math.min(1, consoleP * 2),
              transform: `translateY(${(1 - consoleP) * -22}px) scale(${0.96 + consoleP * 0.04})`,
            }}
          >
            <div style={{ position: 'absolute', left: 22, top: 14, display: 'flex', gap: 8, alignItems: 'center' }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ width: 11, height: 11, borderRadius: 6, border: `1px solid ${FILM_COLORS2.dataDim}`, opacity: 0.5 }} />
              ))}
              <span style={{ fontFamily: fontFamilies.mono, fontSize: 13, color: FILM_COLORS2.textMuted, marginLeft: 10, letterSpacing: '0.18em', opacity: 0.8 }}>netease-api · console</span>
            </div>
            <div style={{ position: 'absolute', left: 22, right: 22, top: 44, height: 1, background: FILM_COLORS2.line, opacity: 0.6 }} />

            {/* L1 请求行（12–26 键击）+ 键击光标 */}
            <div style={{ position: 'absolute', left: 22, top: 60, fontFamily: fontFamilies.mono, fontSize: 17, color: FILM_COLORS2.paperWhite, whiteSpace: 'pre' }}>
              <span style={{ color: FILM_COLORS2.data }}>{REQ.slice(0, reqTyped)}</span>
              {frame >= 12 && reqTyped < REQ.length ? (
                <span style={{ display: 'inline-block', width: 9, height: 15, marginLeft: 5, verticalAlign: '-2px', background: FILM_COLORS2.data, opacity: frame % 8 < 4 ? 0.9 : 0.3 }} />
              ) : null}
            </div>
            {/* 等待三点脉动（26–30）→ L2 200 OK 点亮（30，gold 闪 + 辉光） */}
            {frame >= 26 && frame < 30 ? (
              <div style={{ position: 'absolute', left: 22, top: 96, fontFamily: fontFamilies.mono, fontSize: 16, color: FILM_COLORS2.textMuted, letterSpacing: 4 }}>
                {'···'.slice(0, 1 + Math.floor(frame / 2) % 3)}
              </div>
            ) : null}
            {frame >= 30 ? (
              <div style={{ position: 'absolute', left: 22, top: 96, fontFamily: fontFamilies.mono, fontSize: 16, color: FILM_COLORS2.gold, opacity: 0.6 + okFlash * 0.4, textShadow: `0 0 ${8 + okFlash * 16}px rgba(${GOLD},${0.25 + okFlash * 0.45})` }}>
                ← 200 OK · 1.24s
              </div>
            ) : null}
            {/* L3 真曲名 payload（38–54 键击） */}
            {frame >= 38 ? (
              <div style={{ position: 'absolute', left: 22, top: 132, fontFamily: fontFamilies.mono, fontSize: 15, color: FILM_COLORS2.paperWhite, opacity: 0.88, whiteSpace: 'pre' }}>
                {PAYLOAD.slice(0, payTyped)}
              </div>
            ) : null}
            {/* L4 fallback（40，真实降级叙事） */}
            {frame >= 40 ? (
              <div style={{ position: 'absolute', left: 22, top: 168, fontFamily: fontFamilies.mono, fontSize: 15, color: FILM_COLORS2.textMuted, opacity: interpolate(frame, [40, 48], [0, 0.85], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
                fallback: 直链不可播 → 自动切歌
              </div>
            ) : null}
            {/* L5 retry 200 OK（52，gold 点亮） */}
            {frame >= 52 ? (
              <div style={{ position: 'absolute', left: 22, top: 204, fontFamily: fontFamilies.mono, fontSize: 15, color: FILM_COLORS2.gold, opacity: 0.6 + retryFlash * 0.4, textShadow: `0 0 ${8 + retryFlash * 14}px rgba(${GOLD},${0.2 + retryFlash * 0.4})` }}>
                retry → 200 OK · 播放器可用
              </div>
            ) : null}
          </div>

          {/* 播放器线框数据卡：播放键朱红亮起（60，本镜唯一朱红=手作签名）+ 真曲名跑马灯（62–94） */}
          <div
            style={{
              position: 'absolute',
              left: 1216,
              top: 470,
              width: 460,
              height: 180,
              borderRadius: 10,
              border: `1px solid ${playOn ? FILM_COLORS2.data : FILM_COLORS2.dataDim}`,
              background: FILM_COLORS2.panel,
              boxShadow: playOn ? `0 0 30px rgba(212,163,115,0.22), 0 18px 44px rgba(0,0,0,0.6)` : `0 0 16px rgba(212,163,115,0.08), 0 18px 44px rgba(0,0,0,0.6)`,
              opacity: interpolate(frame, [26, 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            }}
          >
            {/* 播放键：60 朱红 springIn 亮起 */}
            <div
              style={{
                position: 'absolute',
                left: 26,
                top: 50,
                width: 48,
                height: 48,
                borderRadius: 24,
                background: playOn ? FILM_COLORS2.sealRed : FILM_COLORS2.textMuted,
                opacity: playOn ? Math.min(1, playP * 1.6) * 0.94 : 0.4,
                transform: playOn ? `scale(${0.8 + playP * 0.2})` : 'scale(1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: playOn ? `0 0 ${10 + playP * 14}px rgba(122,31,22,0.55)` : 'none',
              }}
            >
              <span style={{ color: FILM_COLORS2.paperWhite, fontSize: 18, marginLeft: playOn ? 2 : 0 }}>{playOn ? '▶' : '—'}</span>
            </div>
            {/* 真曲名跑马灯（62–94，YEAR_FAVS 真歌单；两侧渐隐遮罩） */}
            <div style={{ position: 'absolute', left: 96, right: 20, top: 56, height: 34, overflow: 'hidden', opacity: interpolate(frame, [62, 72], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
              <div style={{ position: 'absolute', left: 0, top: 0, height: 34, display: 'flex', whiteSpace: 'nowrap', transform: `translateX(${marqueeX}px)`, WebkitMaskImage: `linear-gradient(90deg, transparent, ${FILM_COLORS2.spaceDeep} 12%, ${FILM_COLORS2.spaceDeep} 88%, transparent)`, maskImage: `linear-gradient(90deg, transparent, ${FILM_COLORS2.spaceDeep} 12%, ${FILM_COLORS2.spaceDeep} 88%, transparent)` }}>
                {strip.map((s, i) => (
                  <span key={i} style={{ width: MARQUEE_CELL, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <span style={{ fontFamily: fontFamilies.serif, fontSize: 17, color: FILM_COLORS2.paperWhite, opacity: 0.92 }}>{s.song}</span>
                    <span style={{ fontFamily: fontFamilies.mono, fontSize: 12, color: FILM_COLORS2.textMuted }}>{s.artist}</span>
                  </span>
                ))}
              </div>
            </div>
            <div style={{ position: 'absolute', left: 96, top: 100, fontFamily: fontFamilies.mono, fontSize: 12, letterSpacing: '0.2em', color: FILM_COLORS2.textMuted, opacity: playOn ? 0.8 : 0.5 }}>
              {playOn ? 'NOW PLAYING · 八年年度最爱' : 'WAITING · API'}
            </div>
            <div style={{ position: 'absolute', left: 26, right: 26, bottom: 16, height: 1, background: FILM_COLORS2.line, opacity: 0.5 }} />
          </div>

          {/* EQ 三柱（60–70 升起，之后随 eqBars 持续跳动；琥珀辉光） */}
          {playOn ? (
            <div style={{ position: 'absolute', right: 330, top: 690, display: 'flex', gap: 22, alignItems: 'flex-end' }}>
              {bars.map((v, i) => (
                <div
                  key={i}
                  style={{
                    width: 28,
                    height: Math.max(6, (40 + v * 110) * eqUp),
                    background: `linear-gradient(180deg, ${FILM_COLORS2.data}, ${FILM_COLORS2.dataDim})`,
                    opacity: 0.9,
                    borderRadius: 4,
                    boxShadow: `0 0 ${10 + v * 14}px rgba(212,163,115,${0.25 + v * 0.2})`,
                  }}
                />
              ))}
            </div>
          ) : null}
          {/* 波形扩散（80–94，交接态契约：波形扩散成页） */}
          {playOn ? (
            <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: interpolate(frame, [80, TOTAL], [0, 0.5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
              {[0, 1, 2].map((i) => (
                <circle key={i} cx={960} cy={540} r={120 + i * 90 + (frame - 80) * 3} fill="none" stroke={FILM_COLORS2.data} strokeWidth={1} opacity={0.4 - i * 0.1} />
              ))}
            </svg>
          ) : null}
        </AbsoluteFill>
      </CameraRig>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 300, backgroundImage: `linear-gradient(180deg, transparent, ${FILM_COLORS2.spaceDeep})`, opacity: 0.22 }} />
      <HudChrome label="wuh.site · PLAYER" readout={frame < 40 ? 'CONNECTING · API' : frame < 60 ? 'FALLBACK · 切歌' : 'PLAYING · 可用'} />
      <Grade2 id="GR2-08" />
      <Caption text="九月，音乐播放器能用了——自己接的网易云 API。" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S51;
