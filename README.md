# Vite Plugin Log Label

A Vite plugin that replaces `_log()` with styled console.log outputs during compilation and provides type declarations.

## Install

```powershell
pnpm i -D @bolinjs/vite-plugin-log-label
```

```javascript
// vite.config.js
import LogLabel from '@bolinjs/vite-plugin-log-label'

export default {
  plugins: [
    LogLabel({
      /* options */
    }),
  ],
}
```

如果要配合uniapp的日志回显，需要放在uni插件之前

```javascript
// vite.config.js
import LogLabel from '@bolinjs/vite-plugin-log-label'

export default {
  plugins: [
    LogLabel({
      /* options */
    }),
    uni(),
  ],
}
```

## Configuration

```javascript
LogLabel({
  // Filepath to generate corresponding .d.ts file.
  // Defaults to './log-label.d.ts' when `typescript` is installed locally.
  // Set `false` to disable.
  dts: './log-label.d.ts',

  // log function name to be replaced
  identifier: '_log',

  // themes
  // usage: _log.theme()
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
_log(any)
_log.base(any)
_log.info(any)
_log.success(any)
_log.warn(any)
_log.error(any)
_log.custom(any)
_log['pink,#000'](any)
```
