/** CREATE SONG */
const createSong = (
  name: string,
  path: string,
  album_id: number,
  position: number
    ) => {
      console.log(!!versions.findSongByAlbumIdAndSongName(album_id, name) ? `la chanson ${name} existe déjà dans la db` : `nous allons ajouter la chanson ${name} dans la db`);
  !!!versions.findSongByAlbumIdAndSongName(album_id, name) && versions.addSong(name, path, album_id, position);
};

export default createSong