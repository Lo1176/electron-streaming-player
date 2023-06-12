import { contextBridge, ipcRenderer } from 'electron';
const db = require('better-sqlite3')('./resources/jukebox.db');
const fs = require('fs');
const path = require('path')

// simple example to record Text file at root
// fs.writeFileSync('./public/uploads/titi/myfile3.txt', 'the text to write in the file', 'utf-8');

export let versions: any = contextBridge.exposeInMainWorld("versions", {
  findAllSongs: () => {
    const allSongsFromCatalog = db.prepare("select * from songs").all();
    return allSongsFromCatalog;
  },

  findAlbumsByArtist: () => {
    const rows = db.prepare("SELECT * FROM  albums ORDER BY artist_id;").all();
    return rows;
  },

  findAlbumByName: (album_name: string) => {
    // beware: use simple quote and not double quote
    const album = db
    .prepare(`SELECT * FROM  albums WHERE name = '${album_name}'`)
    .all()
    return album[0]
  },
  
  findAlbumByArtistId: (id: string) => {
    // beware: use simple quote and not double quote
    const album = db
    .prepare(`SELECT * FROM  albums WHERE artist_id = '${id}'`)
    .all()
    return album[0]
  },

  addAlbum: (album_name: string, artist_id: number, cover: string) => {
    const newAlbum = db
    .prepare('INSERT INTO albums (name, artist_id, cover) VALUES (?, ?, ?)')
    .run(album_name, artist_id, cover);
    return newAlbum
  },
  
  findAllSongsByAlbumID: (id: string) => {
    // beware: use simple quote and not double quote
    const songs = db
      .prepare(`SELECT * FROM  songs WHERE album_id = ${id};`)
      .all();
    return songs;
  },

  findSongByName: (name: string) => {
    /** PROBLEMS HERE when having a ' inside the name  */
    const song = db
      .prepare(`SELECT * FROM songs WHERE name = '${name}'`)
      .all()
    return (!!song) ? song[0] : false;
  },

  findSong: (album_id: string, song_position: 1) => {
    const song = db
      .prepare(
        `SELECT * FROM  "songs" WHERE album_id = ${album_id} AND position = ${song_position}; `
      )
      .all();
    return song[0];
  },

  addSong: (name: string, path: string, album_id: number, position: number) => {
    const newSong = db
      .prepare(`INSERT INTO songs ('name', 'path', 'album_id', 'position') VALUES (?, ?, ?, ?)`)
      .run(name, path, album_id, position)
    return newSong
  },

  findArtistById: (artist_id: string) => {
    const artistInfo = db
      .prepare(`SELECT * FROM "artists" WHERE id = ${artist_id}`)
      .all();
    return artistInfo[0];
  },

  findArtistByName: (artist_name: string) => {
    const artistInfo = db
      .prepare(`SELECT * FROM "artists" WHERE name = '${artist_name}'`)
      .all();
    return artistInfo[0];
  },

  addArtist: (name: string) => {
    const newArtist = db
      .prepare(`INSERT INTO artists (name) VALUES (?);`)
    newArtist.run(name)
      return newArtist;
  },

  ensureDirectoryExistence(filePath: string) {
    // var dirname = path.dirname(filePath);
    return fs.existsSync(filePath) ? true : fs.mkdirSync(filePath);
  },

  writeAudioFileIntoApp(file: { key: string; value: any }) {
    console.log("🚀 ~ **********file: preload.ts:102 ~ file:", file)
    console.log(
      "full path from writeAudioFileIntoApp: ",
      `./public/uploads/toto/${albumName}`
    );
    // versions.ensureDirectoryExistence(`./public/uploads/toto/${albumName}`);
    // fs.writeFile( file, data, options, callback )
    // fs.writeFileSync(
    //   `./public/uploads/${albumName}/${songName}`,
    //   file,
    //   "utf-8"
    // );

    // fs.writeFile("books.txt", file, (err: string) => {
    //   if (err) console.log(err);
    //   else {
    //     console.log("File written successfully\n");
    //     console.log("The written has the following contents:");
    //     console.log(fs.readFileSync("books.txt", "utf8"));
    //   }
    // });
  },
});
