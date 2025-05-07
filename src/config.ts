import { ThemeConfig } from './index.type'

// 默认root，兼容uniapp
export function getRoot() {
  return process.env.VITE_ROOT_DIR || process.cwd()
}

export const themePresets: { [key: string]: ThemeConfig } = {
  default: `background-image: linear-gradient(to right, #92fe9d 0%, #00c9ff 100%);color:#000;padding:2px 5px;border-radius:4px;`,
  info: ['#165DFF', '#fff'],
  success: ['#00B42A', '#fff'],
  warn: ['#FF7D00', '#fff'],
  error: ['#F53F3F', '#fff'],
}
