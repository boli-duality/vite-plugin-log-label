import { ThemeConfig } from './index.type'

export const baseTheme: { [key: string]: ThemeConfig } = {
  base: `background-image: linear-gradient(to right, #92fe9d 0%, #00c9ff 100%);color:#000;padding:2px 5px;border-radius:4px;`,
  info: ['#165DFF', '#fff'],
  success: ['#00B42A', '#fff'],
  warn: ['#FF7D00', '#fff'],
  error: ['#F53F3F', '#fff'],
}

export function getStyle(config: ThemeConfig) {
  if (Array.isArray(config)) {
    return `background:${config[0]};color:${config[1]};padding:2px 5px;border-radius:4px;`
  }
  return config
}
