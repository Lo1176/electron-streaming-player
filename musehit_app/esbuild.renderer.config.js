import * as path from 'path'

module.exports = {
  platform: 'browser',
  entryPoints: [
    path.resolve('src/renderer/renderer.ts'),
    path.resolve('src/renderer/css/index.css'),
    path.resolve('src/renderer/utils/createAlbum.ts'),
    path.resolve('src/renderer/utils/createArtist.ts'),
    path.resolve('src/renderer/utils/createSong.ts'),
    path.resolve('src/renderer/utils/displayAlbumSongsNames.ts'),
    path.resolve('src/renderer/utils/dragAndDrop.ts'),
    path.resolve('src/renderer/utils/searchBarFunction.ts'),
    path.resolve('src/renderer/utils/showAllAlbums.ts'),
    path.resolve('src/renderer/utils/playerFunctions.ts'),
  ],
  bundle: true,
  target: 'chrome89', // electron version target
  loader: {
    '.ts': 'ts',
    '.tsx': 'tsx',
    '.css': 'css',
  },
}
