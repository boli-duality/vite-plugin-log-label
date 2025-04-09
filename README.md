# Vite Plugin Log Label

A Vite plugin that replaces `logs()` with styled console.log outputs during compilation and provides type declarations.

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
  // Defaults to './logs.d.ts' when `typescript` is installed locally.
  // Set `false` to disable.
  dts: './logs.d.ts',

  // log function name to be replaced
  identifier: 'logs',
})
```

## Usage

```javascript
logs(any)
logs.warn(any)
logs.error(any)
logs['pink,#000'](any)
```
