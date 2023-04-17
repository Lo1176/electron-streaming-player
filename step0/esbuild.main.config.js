import * as path from 'path'

module.exports = {
  platform: 'node',
  entryPoints: [
    path.resolve('src/main/main.ts'),
    path.resolve('src/main/preload.ts'),
  ],
  bundle: true,
  target: 'node16.15.0', // electron version target
  loader: {
    '.ts': 'ts',
  },
}
