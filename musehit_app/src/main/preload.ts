const { contextBridge } = require('electron')
const db = require('better-sqlite3')('./resources/jukebox.db');

contextBridge.exposeInMainWorld('versions', {
  findAllSongs: () => {
    const rows = db.prepare("select * from songs").all()

    console.log("I searched all songs")

    return rows
  },
  findAlbumsByArtist: () => {
    const rows = db.prepare("SELECT * FROM  albums ORDER BY artist_id;").all()
    // console.log("albums by artist", rows)

    return rows
  }

})