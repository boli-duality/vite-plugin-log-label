import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  externals: ['vite'],
  rollup: {
    emitCJS: true,
    inlineDependencies: true,
  },
})
