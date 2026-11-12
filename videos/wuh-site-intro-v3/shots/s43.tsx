/* S43 · Act 6 入院 · 局部帧 [0,112) · 112f · 绝对 5674–5786
 *
 * V3 内容本体化重做（2026-11-12 审计返工单：漫游末卡 → 全片收束）：
 * 网站截图全删（页面快照零引用，§3）。「代码写诗，工具作画」家族句保留（与 s07 首尾呼应），
 * 画面 = 全片数据件快闪回响——1,208 提交 / 46 文 / 146 册 / 13,603 动 各 12f 连击
 * （mono 大字 + 微缩件，数据源 = DATA 真实口径），随后家族句 serif 落款 + 联系钤印（拍287）。
 * 巡礼快切连拍共享轨道：Rail 光标 0.8→1，第 8 块 10f 点亮 = 八块全亮收官（s40=0.2/s41=0.5/s42=0.8）。
 * 编排四问：
 *  承接：首帧 = s42 交出的「漫游中·卡 4 过」——漫游末站（/topics 语义）落场，巡礼轨道光标行至 08 位；
 *  触发：数据针逐枚扫过全片家底（快闪连击即「巡视完毕」的主动作），随后钤印落下盖印 = 收官之章；
 *  展开：帧级节奏表（见下）——四枚数据件 12f 连击（springIn 位移入场+出场）→ 家族句两行 writeFade
 *        → 66=拍287 联系钤印 sealStamp + sparkBurst + paperShake → 98–104 扫描线加速 → 100–112 收束；
 *  交接：尾帧 = 朱红晕光 + 纸页边缘（面板收束成纸页，交 s44 推窗）——endFrameDesc 契约原样。
 * 逐拍帧表（fps=30）：
 *  [0–10]  Rail 第 8 块点亮（lit 7→8，光标 cursorP 0.8→1）——八块全亮；
 *  [0–48]  全片数据件快闪回响 4 连击（各 12f，mono 大字 + 微缩件）：0–12 提交 1,208（提交点串）/ 12–24
 *          文 46（墨点行）/ 24–36 册 146（书脊列）/ 36–48 动 13,603（迷你热力格）；
 *  [50/58] 家族句 serif 落款：「代码写诗」(writeFade 50) / 「工具作画。」(writeFade 58)；
 *  [66]    联系钤印 sealStamp 落定（= 绝对 5740 = 拍287 对音，本镜唯一朱红·手作签名）+ sparkBurst + paperShake；
 *  [70–96] 句与印辉光呼吸（微动不断）；
 *  [96–104] 扫描线加速一次（98–104 原窗口）；预收束内容淡出（94–100）；
 *  [100–112] 收束 fold：纸页边缘自右缘滑至左缘立起（原窗口原几何）+ 朱红晕光漾开——交 s44 推窗。
 * 时间轴零改动：112f / Caption「代码写诗，工具作画。」appearAt 14 原样 / SEAL 66=拍287 / FOLD 100–112 /
 * endFrameDesc「朱红晕光+纸页边缘」语义原样；无 <Sequence>；random(seed) only；fps 取 useVideoConfig。
 * 转场：入「切」，出「切」。字幕安全窗：start≥12；镜内文字（家族句）在上半屏，与字幕不同位不叠印。
 */
import type { FC } from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from 'remotion';
import { fontFamilies } from '../../../brand/tokens';
import { CURVES, sealStamp, sealTilt, writeFade } from '../../../brand/motion';
import { Caption } from '../components/Caption';
import { DeepSpace } from '../components/DeepSpace';
import { Grade2 } from '../components/Grade2';
import { HudChrome } from '../components/HudChrome';
import { DATA, FILM_COLORS2, fmtNum, glowText, paperShake, sparkBurst, springIn } from '../motion-tokens';

const TOTAL = 112;
const SEAL_AT = 66; // = 绝对 5740 = 拍287（对音锚点，不动）
const FOLD_AT = 100; // 路线全亮 + 纸页边缘收束（原窗口）
const CLAMP = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
const RAIL_PITCH = 74;

/** 全片数据件快闪回响（各 12f；数据源 = DATA §6.10 真实口径） */
const FLASHES: Array<{ from: number; n: number; label: string; widget: 'commits' | 'articles' | 'books' | 'heat'; gold: boolean }> = [
  { from: 0, n: DATA.commits, label: 'COMMITS · 提交', widget: 'commits', gold: false },
  { from: 12, n: DATA.articles, label: 'ARTICLES · 文', widget: 'articles', gold: false },
  { from: 24, n: DATA.books, label: 'BOOKS · 册', widget: 'books', gold: false },
  { from: 36, n: DATA.activity, label: 'ACTIVITY · 动', widget: 'heat', gold: true },
];

/** V2 模块轨道（巡礼共享语言，与 s37/s38 同款式） */
const Rail: FC<{ lit: number; at: number; cursorP: number; frame: number }> = ({ lit, at, cursorP, frame }) => (
  <div style={{ position: 'absolute', left: '50%', top: 92, width: 582, marginLeft: -291, zIndex: 26 }}>
    <div style={{ display: 'flex', gap: 10 }}>
      {Array.from({ length: 8 }).map((_v, i) => {
        const n = i + 1;
        const on = n <= lit;
        const active = n === at && on;
        return (
          <div key={n} style={{ width: 64 }}>
            <div
              style={{
                textAlign: 'center',
                fontFamily: fontFamilies.mono,
                fontSize: 13,
                letterSpacing: '0.18em',
                color: on ? FILM_COLORS2.data : n === at ? FILM_COLORS2.gold : FILM_COLORS2.textMuted,
                opacity: on ? 0.95 : n === at ? 0.9 : 0.5,
                ...(active ? glowText(FILM_COLORS2.data, 0.4 + 0.15 * Math.sin(frame / 6)) : {}),
              }}
            >
              {String(n).padStart(2, '0')}
            </div>
            <div style={{ marginTop: 6, height: 3, borderRadius: 2, background: on ? FILM_COLORS2.data : FILM_COLORS2.line, boxShadow: on ? `0 0 8px rgba(212,163,115,${active ? 0.4 + 0.2 * Math.sin(frame / 6) : 0.45})` : 'none', opacity: on ? 1 : 0.5 }} />
          </div>
        );
      })}
    </div>
    {at > lit ? (
      <div style={{ position: 'absolute', top: 14, left: (at - 1) * RAIL_PITCH - 14 + cursorP * 8, width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: `7px solid ${FILM_COLORS2.gold}`, opacity: 0.9, filter: 'drop-shadow(0 0 6px rgba(212,163,115,0.6))' }} />
    ) : null}
  </div>
);

/** 数据件微缩件（每枚 ~120px 宽，random(seed) 确定性纹理） */
const Widget: FC<{ kind: 'commits' | 'articles' | 'books' | 'heat'; frame: number }> = ({ kind, frame }) => {
  if (kind === 'commits') {
    return (
      <div style={{ position: 'relative', width: 150, height: 26 }}>
        {Array.from({ length: 14 }).map((_v, i) => (
          <div key={i} style={{ position: 'absolute', left: i * 11, top: 10 + Math.sin(i * 1.3) * 4, width: 6, height: 6, borderRadius: 3, background: FILM_COLORS2.data, opacity: 0.35 + random(`s43-c${i}`) * 0.6 }} />
        ))}
      </div>
    );
  }
  if (kind === 'articles') {
    return (
      <div style={{ position: 'relative', width: 150, height: 26 }}>
        {Array.from({ length: 10 }).map((_v, i) => (
          <div key={i} style={{ position: 'absolute', left: i * 15, top: 13 - (3 + random(`s43-a${i}`) * 5), width: 6 + random(`s43-as${i}`) * 3, height: 6 + random(`s43-as${i}`) * 3, borderRadius: '50%', background: FILM_COLORS2.dataDim, opacity: 0.5 + 0.2 * Math.sin(frame / 9 + i) }} />
        ))}
      </div>
    );
  }
  if (kind === 'books') {
    return (
      <div style={{ position: 'relative', width: 150, height: 84, display: 'flex', alignItems: 'flex-end', gap: 6 }}>
        {Array.from({ length: 8 }).map((_v, i) => (
          <div key={i} style={{ width: 12, height: 34 + random(`s43-b${i}`) * 50, borderRadius: 2, background: FILM_COLORS2.dataDim, opacity: 0.55 + random(`s43-bo${i}`) * 0.3, boxShadow: `0 0 6px rgba(212,163,115,0.25)` }} />
        ))}
      </div>
    );
  }
  return (
    <div style={{ position: 'relative', width: 150, height: 66, display: 'flex', flexWrap: 'wrap', gap: 3 }}>
      {Array.from({ length: 45 }).map((_v, i) => {
        const w = random(`s43-h${i}`);
        return <div key={i} style={{ width: 13, height: 10, borderRadius: 2, background: `rgba(212,163,115,${0.08 + Math.pow(w, 1.6) * 0.5})` }} />;
      })}
    </div>
  );
};

const S43: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const shake = paperShake(frame, SEAL_AT, 1.6, 8);
  // 面板收束成纸页边缘（100–112 原窗口：自右缘滑至左缘立起，交接 s44）
  const fold = interpolate(frame, [FOLD_AT, TOTAL], [0, 1], { ...CLAMP, easing: CURVES.cineEaseInOut });
  // 预收束内容淡出（94–100 让位纸页）
  const contentOut = interpolate(frame, [94, FOLD_AT], [1, 0], CLAMP);
  // 巡礼轨道：第 8 块 10f 点亮收官（光标 0.8→1）
  const railLit = frame >= 10 ? 8 : 7;
  const railCursorP = interpolate(frame, [0, 12], [0.8, 1], CLAMP);
  // 印后辉光呼吸（70+）
  const breathe = 0.32 + 0.1 * Math.sin(frame / 9);
  // 落定粒子（66 印落）
  const burst = sparkBurst('s43-seal', frame, SEAL_AT, 10, false);
  // 快闪回响当前枚
  const flashIdx = frame < 48 ? Math.min(3, Math.floor(frame / 12)) : -1;

  return (
    <AbsoluteFill style={{ background: FILM_COLORS2.spaceDeep }}>
      <DeepSpace seed="s43v2" stars={56} grid horizon />

      {frame < FOLD_AT ? (
        <>
          <div style={{ position: 'absolute', inset: 0, opacity: contentOut, transform: shake.transform || undefined, zIndex: 28 }}>
            {/* 全片数据件快闪回响（0–48 四连击，各 12f：mono 大字 + 微缩件，springIn 位移入场） */}
            {flashIdx >= 0
              ? FLASHES.filter((f) => f.from === flashIdx * 12).map((f) => {
                  const p = springIn(frame, f.from, fps, 15, 200, 0.85);
                  const out = interpolate(frame, [f.from + 10, f.from + 12], [1, 0], CLAMP);
                  const col = f.gold ? FILM_COLORS2.gold : FILM_COLORS2.data;
                  return (
                    <div key={f.label} style={{ position: 'absolute', left: 0, right: 0, top: 250, textAlign: 'center', opacity: Math.min(1, p * 1.4) * out, transform: `translateY(${(1 - p) * -22}px) scale(${0.94 + p * 0.06})`, zIndex: 30 }}>
                      <div style={{ fontFamily: fontFamilies.mono, fontSize: 170, fontWeight: 700, lineHeight: 1.05, color: col, fontVariantNumeric: 'tabular-nums', letterSpacing: '0.02em', ...glowText(col, 0.5) }}>{fmtNum(f.n)}</div>
                      <div style={{ marginTop: 6, fontFamily: fontFamilies.mono, fontSize: 15, letterSpacing: '0.4em', color: FILM_COLORS2.textMuted }}>{f.label}</div>
                      <div style={{ marginTop: 18, display: 'flex', justifyContent: 'center' }}>
                        <Widget kind={f.widget} frame={frame} />
                      </div>
                    </div>
                  );
                })
              : null}

            {/* 家族句 serif 落款（50/58 writeFade；与 s07 首尾呼应，上半屏不叠字幕） */}
            <div style={{ position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center', zIndex: 30 }}>
              <div style={{ ...writeFade(frame, 50) }}>
                <span style={{ fontFamily: fontFamilies.serif, fontSize: 68, color: FILM_COLORS2.paperWhite, letterSpacing: '0.14em', ...glowText(FILM_COLORS2.paperWhite, frame >= 70 ? breathe : 0.32) }}>代码写诗</span>
              </div>
              <div style={{ ...writeFade(frame, 58), marginTop: 18 }}>
                <span style={{ fontFamily: fontFamilies.serif, fontSize: 68, color: FILM_COLORS2.gold, letterSpacing: '0.14em', ...glowText(FILM_COLORS2.gold, frame >= 70 ? breathe + 0.06 : 0.38, '233,217,174') }}>工具作画。</span>
              </div>
            </div>

            {/* 联系钤印（66=拍287 落定·本镜唯一朱红·手作签名）+ 落定粒子 */}
            <div style={{ position: 'absolute', left: 1180, top: 500, ...sealStamp(frame, SEAL_AT, 30, sealTilt('s43-contact')) }}>
              <div style={{ width: 150, height: 150, borderRadius: 8, background: FILM_COLORS2.sealRed, opacity: 0.92, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 26px rgba(122,31,22,0.45)` }}>
                <span style={{ fontFamily: fontFamilies.serif, fontSize: 40, color: FILM_COLORS2.paperWhite }}>联系</span>
              </div>
            </div>
            {frame >= SEAL_AT ? (
              <div style={{ position: 'absolute', left: 1255, top: 575, width: 0, height: 0, zIndex: 31, pointerEvents: 'none' }}>
                {burst.map((p, i) => (
                  <div key={i} style={p.style} />
                ))}
              </div>
            ) : null}
          </div>

          {/* 扫描线加速一次（98–104 原窗口） */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: '46%',
              height: 2,
              background: `linear-gradient(90deg, transparent, rgba(212,163,115,0.55), transparent)`,
              opacity: interpolate(frame, [98, 104, 110], [0, 1, 0.4], CLAMP),
              zIndex: 27,
            }}
          />
        </>
      ) : (
        <>
          {/* 面板整体收束成纸页边缘（100–112 原窗口：自右缘滑至左缘立起，交接 s44 推窗；轨道 8/8 由下方 Rail 驻留） */}
          <div
            style={{
              position: 'absolute',
              right: interpolate(fold, [0, 1], [0, 1650]),
              top: 120,
              bottom: 120,
              width: 270,
              background: FILM_COLORS2.paperWhite,
              borderLeft: `2px solid ${FILM_COLORS2.dataDim}`,
              boxShadow: '-24px 0 60px rgba(0,0,0,0.55)',
              opacity: 0.96,
              zIndex: 29,
            }}
          />
          {/* 朱红晕光（尾帧契约：交 s44 余红残影） */}
          <AbsoluteFill style={{ background: `radial-gradient(circle at 30% 55%, rgba(122,31,22,0.22), transparent 55%)`, opacity: fold, pointerEvents: 'none' }} />
        </>
      )}

      <Rail lit={railLit} at={8} cursorP={railCursorP} frame={frame} />
      <HudChrome label="wuh.site · ROAM" readout={frame >= FOLD_AT ? '05/05 · ROUTE 8/8' : '05/05 · /TOPICS'} />
      <Grade2 id="GR2-06" />
      <Caption text="代码写诗，工具作画。" appearAt={14} />
    </AbsoluteFill>
  );
};

export default S43;
