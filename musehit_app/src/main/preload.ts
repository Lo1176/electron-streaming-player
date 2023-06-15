import { contextBridge } from 'electron';
const db = require('better-sqlite3')('./resources/jukebox.db');
const fs = require('fs');

export let versions: any = contextBridge.exposeInMainWorld("versions", {
  findAllFeatures: () => {
    const allFeatures = db.prepare("SELECT * from FEATURES").all();
    const {artist_id, song_id}: {artist_id: string, song_id: string } = allFeatures[0]; 
    return { artist_id, song_id };
  },

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
      .all();
    return album[0];
  },

  findAlbumByArtistId: (id: string) => {
    // beware: use simple quote and not double quote
    const album = db
      .prepare(`SELECT * FROM  albums WHERE artist_id = '${id}'`)
      .all();
    return album[0];
  },

  findAlbumByArtistIdAndAlbumName: (album_name: string, artist_id: number) => {
    const album = db
      .prepare(
        `SELECT * FROM  albums WHERE name = '${album_name}' AND artist_id = ${artist_id}`
      )
      .all();
    return album[0];
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
    const song = db.prepare(`SELECT * FROM songs WHERE name = '${name}'`).all();
    return !!song && song[0];
  },

  findSongById: (id: string) => {
    const song = db.prepare(`SELECT * FROM songs WHERE id = ${id}`)
    return !!song && song[0];

  },

  // findSong: (album_id: string, song_position: 1) => {
  //   const song = db
  //     .prepare(
  //       `SELECT * FROM  "songs" WHERE album_id = ${album_id} AND position = ${song_position}; `
  //     )
  //     .all();
  //   return song[0];
  // },

  addAlbum: (
    album_name: string,
    artist_id: number,
    release_date: string,
    disk: string,
    genre: string,
    cover: string
  ) => {
    const newAlbum = db
      .prepare(
        "INSERT INTO albums ('name', 'artist_id', 'release_date', 'disk', 'genre', 'cover') VALUES (?, ?, ?, ?, ?, ?)"
      )
      .run(album_name, artist_id, release_date, disk, genre, cover);
  },

  addSong: (name: string, path: string, album_id: number, position: number) => {
    const newSong = db
      .prepare(
        `INSERT INTO songs ('name', 'path', 'album_id', 'position') VALUES (?, ?, ?, ?)`
      )
      .run(name, path, album_id, position);
    return newSong;
  },

  findArtistById: (artist_id: string | number) => {
    const id = artist_id.toString();    
    const artistInfo = db
      .prepare(`SELECT * FROM "artists" WHERE id = ${id}`)
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
    const newArtist = db.prepare(`INSERT INTO artists (name) VALUES (?);`);
    newArtist.run(name);
    return newArtist;
  },

  writeAudioFileIntoApp(
    file: { key: string; value: any },
    albumName: string,
    songName: string
  ) {
    function ensureDirectoryExistence(filePath: string) {
      return fs.existsSync(filePath);
    }
    function createDirectory(filePath: string) {
      fs.mkdirSync(filePath, { recursive: true });
    }

    function CopyNewSong() {
      fs.copyFile(file.path, uploadPath, (err: string) => {
        if (err) {
          console.log(
            "Error Found:",
            err,
            "file.path: ",
            file.path,
            "uploadPath: ",
            uploadPath
          );
        } else {
          console.log(
            "la chanson: ",
            file.name,
            "\n a été copiée dans le path: ",
            uploadPath
          );
        }
      });
    }
    const dirPath: string = `./public/uploads/${albumName}`;
    const uploadPath: string = `${dirPath}/${songName}.mp3`;
    if (!ensureDirectoryExistence(dirPath)) {
      console.log(
        "***** le repertoire n'existe pas je le fabrique avec me petits doigts boudinés: ",
        "\ndirPath: ",
        dirPath
      );
      createDirectory(dirPath);
      CopyNewSong();
    } else {
      CopyNewSong();
    }
  },

  formattedAlbumName(name: string) {
    name.toLowerCase().split(" ").join("-");
  },

  saveImage(cover: string, path: string) {
    const formattedName = versions.formattedAlbumName(albumName);
    console.log("🚀 ~ file: preload.ts:175 ~ saveImage ~ formattedAlbumName:", formattedName)
    fs.writeFile(
      path,
      cover,
      "base64",
      function (err: string) {
        console.log(err);
      }
    );
  },
});
