# Vite Plugin Logs

A Vite plugin that replaces `logs()` with styled console.log outputs during compilation and provides type declarations.

## Install

```powershell
pnpm i -D @bolinjs/vite-plugin-logs
```

```javascript
// vite.config.js
import VitePluginLogs from '@bolinjs/vite-plugin-logs'

export default {
  plugins: [
    VitePluginLogs({
      /* options */
    }),
  ],
}
```

## Configuration

```javascript
VitePluginLogs({
  // Filepath to generate corresponding .d.ts file.
  // Defaults to './logs.d.ts' when `typescript` is installed locally.
  // Set `false` to disable.
  dts: './logs.d.ts',

  //需要替换的log函数名
  identifier: 'logs',
})
```
