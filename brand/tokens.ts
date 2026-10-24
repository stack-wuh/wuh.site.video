// 品牌令牌：所有分镜共用，改一处全局生效
export const colors = {
  bg: '#0f0e0c', // 暖黑底
  bgLift: '#171410', // 渐变高光层
  paper: '#f5f0e8', // 暖纸面（暗底主文字同色）
  accent: '#d4a373', // 琥珀点缀
  terminalBg: '#14120f', // 终端窗底
  terminalText: '#e8e0d0', // 终端文字
  muted: '#8a8272', // 暗底次级文字
  paperMuted: '#d8cfba', // 纸面条目块
  paperDeep: '#e5ddcc', // 纸面次级块
  ink: '#2b2620', // 纸面标题墨色
  hairline: 'rgba(245,240,232,0.08)', // 暗底描边/分隔线
} as const;

export const fontFamilies = {
  serif: '"Songti SC", "Noto Serif SC", serif',
  sans: '"PingFang SC", sans-serif',
  mono: 'Menlo, monospace',
} as const;
