# Vite Plugin Log Label

A Vite plugin that replaces `logl()` with styled console.log outputs during compilation and provides type declarations.

## Install

```powershell
pnpm i -D @bolinjs/vite-plugin-log-label
```

```javascript
// vite.config.js
import VitePluginLogLabel from '@bolinjs/vite-plugin-log-label'

export default {
  plugins: [
    VitePluginLogLabel({
      /* options */
    }),
  ],
}
```

## Configuration

```javascript
VitePluginLogLabel({
  // Filepath to generate corresponding .d.ts file.
  // Defaults to './log-label.d.ts' when `typescript` is installed locally.
  // Set `false` to disable.
  dts: './log-label.d.ts',

  // log function name to be replaced
  identifier: 'logl',

  // themes
  // usage: logl.theme()
  theme: {
    // preset
    base: `background-image: linear-gradient(to right, #92fe9d 0%, #00c9ff 100%);color:#000;padding:2px 5px;border-radius:4px;`,
    info: ['#165DFF', '#fff'],
    success: ['#00B42A', '#fff'],
    warn: ['#FF7D00', '#fff'],
    error: ['#F53F3F', '#fff'],
    // custom
    custom: ['white', 'black'],
  },
})
```

## Usage

```javascript
logl(any)
logl.base(any)
logl.info(any)
logl.success(any)
logl.warn(any)
logl.error(any)
logl.custom(any)
logl['pink,#000'](any)
```
