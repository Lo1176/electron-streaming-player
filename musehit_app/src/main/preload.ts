import { contextBridge } from 'electron';
const db = require('better-sqlite3')('./resources/jukebox.db');
const fs = require('fs');

function formattedName(name: string) {
    return name.toLowerCase().split(" ").join("-");
  }

export let versions: any = contextBridge.exposeInMainWorld("versions", {
  findAllFeatures: () => {
    const allFeatures = db.prepare("SELECT * from FEATURES").all();
    const { artist_id, song_id }: { artist_id: string; song_id: string } =
      allFeatures[0];
    return { artist_id, song_id };
  },

  findAllSongs: () => {
    const allSongsFromCatalog = db
      .prepare("SELECT * FROM songs LIMIT 30")
      .all();
    return allSongsFromCatalog;
  },

  findAlbumsOrderedByArtist: () => {
    const rows = db
      .prepare("SELECT * FROM  albums ORDER BY artist_id LIMIT 9;")
      .all();
    return rows;
  },

  findAlbumByName: (album_name: string) => {
    // beware: use simple quote and not double quote
    const album = db
      .prepare(`SELECT * FROM  albums WHERE LOWER("name") = '${album_name}'`)
      .all();
    return album[0];
  },

  searchByAlbums(inputString: string) {
    const albums = db
      .prepare(
        `SELECT * FROM albums WHERE LOWER(albums.name) LIKE '%${inputString}%'`
      )
      .all();
    return albums;
  },
  
  searchByArtists(inputString: string) {
    const albums = db
    .prepare(
      `SELECT * FROM albums INNER JOIN artists WHERE LOWER(artists.name) LIKE '%${inputString}%' AND artists.id=albums.artist_id`
      )
      .all();
      return albums;
    },
    
    searchByReleaseDate(date: string) {
      const albums = db
        .prepare(
          `SELECT * FROM albums WHERE albums.release_date LIKE '%${date}%'`
        )
        .all();
      return albums;
    },

  findAllAlbumsByArtistId: (id: string) => {
    // beware: use simple quote and not double quote
    const album = db
      .prepare(`SELECT * FROM albums WHERE artist_id = '${id}'`)
      .all();
    return album;
  },

  findAlbumByArtistIdAndAlbumName: (artist_id: number, album_name: string) => {
    const album = db
      .prepare(
        `SELECT * FROM albums WHERE LOWER("name") = '${album_name}' AND artist_id = ${artist_id}`
      )
      .all();
    return album[0];
  },

  findAllSongsByAlbumID: (id: string) => {
    // beware: use simple quote and not double quote
    const songs = db
      .prepare(
        `SELECT * FROM songs WHERE album_id = ${id} ORDER BY position ASC;`
      )
      .all();
    console.log("songs", songs);
    return songs;
  },

  findSongByName: (name: string) => {
    /** PROBLEMS HERE when having a ' inside the name  */
    const song = db.prepare(`SELECT * FROM songs WHERE name = '${name}'`).all();
    return !!song && song[0];
  },

  findSongById: (id: string) => {
    const song = db.prepare(`SELECT * FROM songs WHERE id = ${id}`);
    return !!song && song[0];
  },

  findSongByAlbumIdAndSongName: (album_id: string, song_name: string) => {
    const song = db
      .prepare(
        `SELECT * FROM songs WHERE album_id = ${album_id} AND name = '${song_name}'; `
      )
      .all();
    console.log("🚀 ~ file: preload.ts:78 ~ song:", song);

    return song[0];
  },

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
    console.log(
      `we just created a new album named ${album_name}\n from ${artist_id}\n disk ${disk} and genre ${genre} `
    );
    return newAlbum;
  },

  addSong: (name: string, path: string, album_id: number, position: number) => {
    const newSong = db
      .prepare(
        `INSERT INTO songs ('name', 'path', 'album_id', 'position') VALUES (?, ?, ?, ?)`
      )
      .run(name, path, album_id, position);
    console.log(`we just created a new song named ${name}\n here ${path}`);
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
    function ensurePathExistence(filePath: string) {
      return fs.existsSync(filePath);
    }
    function createDirectory(filePath: string) {
      fs.mkdirSync(filePath, { recursive: true });
    }
    console.log("***$$***: ", file);
    function CopyNewSong() {
      ensurePathExistence(uploadPath)
        ? console.log(`this path ${uploadPath} already exist into your library`)
        : fs.copyFile(file.path, uploadPath, (err: string) => {
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
    const dirPath: string = `./public/uploads/${formattedName(albumName)}`;
    const uploadPath: string = `${dirPath}/${file.name}`;
    if (!ensurePathExistence(dirPath)) {
      console.log(
        `***** le repertoire n'existe pas je le fabrique avec me petits doigts boudinés:\ndirPath: ${dirPath}`
      );
      createDirectory(dirPath);
      CopyNewSong();
    } else {
      CopyNewSong();
    }
  },

  formattedName(name: string) {
    return formattedName(name);
  },

  saveImage(path: string, cover: string) {
    console.log("🚀 ~ file: preload.ts:179 ~ saveImage ~ path:", path);
    // const formattedAlbumName = formattedName(albumName);

    fs.writeFile(path, cover, "base64", function (err: string) {
      console.log(err);
    });
    console.log("l'image a été créé, path: ", path, "\ncover: ", cover);
  },
});
