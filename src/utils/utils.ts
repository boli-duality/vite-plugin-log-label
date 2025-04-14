export function getDefaultExportFromCjs<T>(x: T): T {
  return x && (x as any).__esModule && Object.prototype.hasOwnProperty.call(x, 'default')
    ? (x as any)['default']
    : x
}
