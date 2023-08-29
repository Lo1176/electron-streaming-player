/** CREATE SONG */
const createSong = (
  name: string,
  path: string,
  album_id: number,
  position: number
    ) => {
      if (!!versions.findSongByAlbumIdAndSongName(album_id, name)) {
        console.log(`la chanson ${name} existe déjà dans la db`)
      } else {
        versions.addSong(name, path, album_id, position)
        console.log(`nous avons ajouté la chanson ${name} dans la db`)
      }
};

export default createSong