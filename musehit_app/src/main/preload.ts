const { contextBridge } = require('electron')
const db = require('better-sqlite3')('./resources/jukebox.db');

contextBridge.exposeInMainWorld("versions", {
  findAllSongs: () => {
    const allSongsFromCatalog = db
      .prepare("select * from songs")
      .all();
    return allSongsFromCatalog;
  },

  findAlbumsByArtist: () => {
    const rows = db
      .prepare("SELECT * FROM  albums ORDER BY artist_id;")
      .all();
    return rows;
  },

  findAllSongsByAlbumID: (id: any) => {
    const rows = db
      .prepare(`SELECT * FROM  songs WHERE album_id = ${id};`)
      .all();
    return rows;
  },

  findSong: (album_id: any, song_position: 1) => {
    const song = db
      .prepare(`SELECT * FROM  "songs" WHERE album_id = ${album_id} AND position = ${song_position}; `)
      .all();
    return song[0];
  },

});
