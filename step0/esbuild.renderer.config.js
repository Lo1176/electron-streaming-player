import * as path from 'path'

module.exports = {
  platform: 'browser',
  entryPoints: [path.resolve('src/renderer/renderer.ts')],
  bundle: true,
  target: 'chrome89', // electron version target
  loader: {
    '.ts': 'ts',
    '.tsx': 'tsx',
    '.css': 'css',
  },
}
