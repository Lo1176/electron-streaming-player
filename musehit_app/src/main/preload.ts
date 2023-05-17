import { contextBridge, ipcRenderer } from 'electron';
const db = require('better-sqlite3')('./resources/jukebox.db');
const fs = require('fs');
const path = require('path')

// simple example to record Text file at root
// fs.writeFileSync('./public/uploads/titi/myfile3.txt', 'the text to write in the file', 'utf-8');



// testing to save audio file into good repo
// defaultPath: path.join(__dirname, "../public/uploads/");

export let versions: any = contextBridge.exposeInMainWorld("versions", {
  // ipcRendererOn: () => { return ipcRenderer},
  findAllSongs: () => {
    const allSongsFromCatalog = db.prepare("select * from songs").all();
    return allSongsFromCatalog;
  },

  findAlbumsByArtist: () => {
    const rows = db.prepare("SELECT * FROM  albums ORDER BY artist_id;").all();
    return rows;
  },

  findAllSongsByAlbumID: (id: string) => {
    const rows = db
      .prepare(`SELECT * FROM  songs WHERE album_id = ${id};`)
      .all();
    return rows;
  },

  findSong: (album_id: string, song_position: 1) => {
    const song = db
      .prepare(
        `SELECT * FROM  "songs" WHERE album_id = ${album_id} AND position = ${song_position}; `
      )
      .all();
    return song[0];
  },

  findArtist: (artist_id: string) => {
    const artistInfo = db
      .prepare(`SELECT * FROM "artists" WHERE id = ${artist_id}`)
      .all();
    return artistInfo[0];
  },

  ensureDirectoryExistence(filePath: string) {
    console.log("🚀 ~ file: preload.ts:50 ~ ensureDirectoryExistence ~ filePath:", filePath)
    // var dirname = path.dirname(filePath);
    return fs.existsSync(filePath) ? true : fs.mkdirSync(filePath);
  },

  writeAudioFileIntoApp: (songName: any, albumName: any, file: any) => {
    console.log(
      "ful path from writeAudioFileIntoApp: ",
      `./public/uploads/toto/${albumName}`
    );
    // versions.ensureDirectoryExistence(`./public/uploads/toto/${albumName}`);
    fs.writeFileSync(`./public/uploads/${albumName}/${songName}`, file, "utf-8");
  },

});

