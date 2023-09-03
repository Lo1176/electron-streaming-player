import { Album, Song } from "../renderer";
import createAlbum from "./createAlbum";
import createArtist from "./createArtist";
import createSong from "./createSong";

/********* Drag and Drop Zone  ************/
const jsmediatags = window.jsmediatags;


const dragAndDrop = () => {
  const dragAndDropContainer = document.getElementById(
    "drag-and-drop-container"
  ) as HTMLElement;

  const replaceSingleQuote = (stringName: string) => stringName.replace("'", " ")
  /* [ROMAIN]
    pourquoi "Don't stop me now" devrait s'appeler "Don t stop me now "?
    si tu passais par l'ORM dans ton preload tu n'aurais pas de souci. 

    aussi si le tag album ou title n'est pas défini tu va avoir une erreur 
    et l'utilisateur ne saura pas ce qu'il a mal fait !
  */

  dragAndDropContainer.addEventListener("drop", (event) => {
    event.preventDefault();
    event.stopPropagation();

    for (const file of event.dataTransfer.files) {
      // Using the path attribute to get absolute file path
      jsmediatags.read(file, {
        onSuccess: async function (tag: {
          tags: {
            artist: string;
            album: string;
            track: string;
            title: string;
            picture: {data: any};
            year: string;
            genre: string;
            volume: {disk: string};
          }}) {
            let album: Album = {};
            // console.log("file: tag.tags \n", tag.tags);
            const songTitleFromDragAndDrop = replaceSingleQuote(tag.tags.title);
            const albumTitleFromDragAndDrop = replaceSingleQuote(tag.tags.album);
            const releaseDate = tag.tags.year ? tag.tags.year : "";
            const genre = tag.tags.genre !== " " ? tag.tags.genre : " ";
            /* [ROMAIN]
            pourquoi ce " " plutôt que "" ?
            (en modifiant la syntaxe pour la copier sur year par exemple)
            */
            const disk = tag.tags.volume?.disk ? tag.tags.volume?.disk : "1";
            /* [ROMAIN]
             si tu es arrivé dans la deuxième partie de ton expression, volume existe 
             et tu peux donc enlever le ? 
             i.e :
             const disk = tag.tags.volume?.disk ? tag.tags.volume.disk : "1";
            */
            const coverFromMetaData = tag.tags.picture;
            const formattedAlbumName = versions.formattedName(
              albumTitleFromDragAndDrop
            );
     
            const songPath: string = `${formattedAlbumName}/${file.name}`;
            const coverPath: string = `${formattedAlbumName}/${formattedAlbumName}-cover.png`;
            // console.log("🚀 ~ file: dragAndDrop.ts:49 ~ dragAndDropContainer.addEventListener ~ songPath:", songPath)
            
            let base64String = "";
            for (let i = 0; i < coverFromMetaData.data.length; i++) {
              base64String += String.fromCharCode(coverFromMetaData.data[i]);
            }
            /**imageUri */
            const albumImageUri = window.btoa(base64String);
  
            /** save image into public/uploads */
            const createCoverImage = () => {
              const saveImageToPath = `./public/uploads/${coverPath}`;
              // let albumImagePath: string;
              return (albumImagePath = versions.saveImage(
                saveImageToPath,
                albumImageUri
              ));
            };
  
            const artistNameFromDragAndDrop = tag.tags.artist;
            const songPositionFromDragAndDrop = parseInt(
              tag.tags.track.split("/")[0]
            );

            const artistInfos: { id: string; name: string } = await versions.findArtistByName(artistNameFromDragAndDrop);
            // console.log("🚀 ~ file: dragAndDrop.ts:71 ~ dragAndDropContainer.addEventListener ~ artistInfos:", artistInfos)
                          
            /******
             * 
             * define functions to create and import songs#
             * 
             * *******/

            if (!!artistInfos) {
              // 1/a ARTIST is already in the DB. The next step is to retrieve its id (artistInfos.id)
              console.log(`The artist: ${artistInfos.name} already exist in db`);
              console.log("🚀 ~ file: dragAndDrop.ts:84 ~ dragAndDropContainer.addEventListener ~ artistInfos.id:", artistInfos.id)
              console.log("🚀 ~ file: dragAndDrop.ts:85 ~ dragAndDropContainer.addEventListener ~ albumTitleFromDragAndDrop:", albumTitleFromDragAndDrop)
              const currentAlbumFromDragAndDrop = versions.findAlbumByArtistIdAndAlbumName(parseInt(artistInfos.id), albumTitleFromDragAndDrop);
    
              console.log("🚀 ~ file: dragAndDrop.ts:74 ~ dragAndDropContainer.addEventListener ~ currentAlbumFromDragAndDrop:", currentAlbumFromDragAndDrop)
    
                /** find all albums for this artistInfos.id => array.includes */
                const allAlbumsFromArtistId = versions.findAllAlbumsByArtistId(
                  artistInfos.id
                );
    
                /** VERIFIER SI ALBUM EXIST AVEC ALBUM NAME ET ARTIST ID */
                const isAlbumAlreadyExist = allAlbumsFromArtistId.includes(
                  albumTitleFromDragAndDrop
                );
    
                /** create new album linked to artist id if it isn't exist */
                /** next step verifier si l'album est déjà dans la DB */
                if (isAlbumAlreadyExist) {
                  console.log("🚀 ~ file: dragAndDrop.ts:102 ~ dragAndDropContainer.addEventListener ~ isAlbumAlreadyExist:", isAlbumAlreadyExist)
                  /**
                   * 1/b
                   * if album already exist, we have to verify if the song is already in DB
                   *
                   */
                  console.log(
                    `we already have the album ${album.name} from ${artistInfos.name} in db`
                  );
    
    
                  console.log(
                    "🚀 ~ ################ ~ current Album From Drag And Drop:",
                    currentAlbumFromDragAndDrop,
                    "\nlet's find if the song is already in DB \n"
                  );
                  
                  // NEXT STEP create song linked to album id
                  // createSong if song doesn't exist
                  let song: Song = {};
    
                  song = versions.findSongByAlbumIdAndSongName(
                    currentAlbumFromDragAndDrop.id,
                    songTitleFromDragAndDrop
                  );
    
                  console.log(
                    "🚀 ~ file: renderer.ts:404 ~ dragAndDropContainer.addEventListener ~ song:",
                    song,
                    "!!!song: ", !!!song
                  );

                  if (!!!song) {
                    createCoverImage();
                    createSong(
                      songTitleFromDragAndDrop,
                      songPath,
                      currentAlbumFromDragAndDrop.id,
                      songPositionFromDragAndDrop
                    );

                  }
                  
                } else {
                  if (!!album?.name) {
                    /** album does't exist in DB so ADD NEW ALBUM
                     * 1/ verifier si l'album a un nom
                     * 2/ créer le folder avec le nom de l'album ?? => a t on besoin de cette étape
                     * ou le dossier est directement créé avec le addSong ?
                     */
                    // NEXT STEP => CREATE song linked to album id
    
                    const isThisSongExist = versions.findSongByName(songTitleFromDragAndDrop);
                    if (!!isThisSongExist) {
                      console.log(`we already have the song ${isThisSongExist.name} in db`);
                    } else {
                      // create song linked to album id
    
                      console.log(
                        "🚀 ~ file: renderer.ts:374 ~ dragAndDropContainer.addEventListener ~ create song linked to album id: \n",
                        "songTitle: ",
                        songTitleFromDragAndDrop,
                        "\nalbumInfo: ",
                        album
                      );
    
                      createSong(
                        songTitleFromDragAndDrop,
                        songPath,
                        album.id,
                        songPositionFromDragAndDrop
                      );
    
                      // const newSong: Song = ({} = versions.addSong(
                      //   songTitleFromDragAndDrop,
                      //   songPath,
                      //   album.id,
                      //   songPositionFromDragAndDrop
                      // ));
                      console.log(
                        `we just created a new song named ${songTitleFromDragAndDrop}`
                      );
                      console.log("new Song: ", songTitleFromDragAndDrop);
                    }
                  } else {    
                    /**  create new song linked to artist id if it isn't exist */
                    /**
                     *  WARNING
                     *  this case doesn't work
                     *  WARNING
                     *  currentAlbumFromDragAndDrop seems to be undefined
                     */
                    // alert("⚠ this case isn't working see into dragAndDrop.ts line 186")
                      // is album exist ?? &&
                      console.log("🚀 ~ file: dragAndDrop.ts:197 ~ dragAndDropContainer.addEventListener ~ songTitleFromDragAndDrop:", songTitleFromDragAndDrop)

                    createCoverImage();
                    createSong(
                      songTitleFromDragAndDrop,
                      songPath,
                      currentAlbumFromDragAndDrop.id,
                      songPositionFromDragAndDrop
                    );
                  }
                }
              } else {
                //
                /** 2/a
                 *  artist doesn't exist so we have to ADD THIS NEW ARTIST
                 *  next step 2/b
                 * */
                createArtist(artistNameFromDragAndDrop);
/* [ROMAIN]
  peut-être rajouter un await a createArtist, c'est normalement quasi instantané 
  mais il n'est pas impossible que ton findArtistByName ne trouve pas le NewArtist 
  si l'opération n'est pas terminée
*/
                const newArtist = versions.findArtistByName(
                  artistNameFromDragAndDrop
                );
                console.log("newArtist: ", newArtist);
    
                // create album ?
                // ADD NEW ALBUM AND SONG INTO DB
                /** CREATE COVER IMAGE */
                createAlbum(
                  albumTitleFromDragAndDrop,
                  parseInt(newArtist.id),
                  releaseDate,
                  disk,
                  genre,
                  coverPath
                );
                createCoverImage();
                const currentAlbumFromDragAndDrop =
                versions.findAlbumByArtistIdAndAlbumName(
                  parseInt(newArtist.id),
                  albumTitleFromDragAndDrop
                  );
                  
                console.log("🚀 ~ file: dragAndDrop.ts:238 ~ !!dragAndDropContainer.addEventListener ~ !!currentAlbumFromDragAndDrop:", !!currentAlbumFromDragAndDrop)
                createSong(
                    songTitleFromDragAndDrop,
                    songPath,
                    currentAlbumFromDragAndDrop.id,
                    songPositionFromDragAndDrop
                  );
              }
    
            // display tags information into drop Area
            document.getElementById("drag-and-drop-song-title").innerText =
              songTitleFromDragAndDrop;
            document.getElementById("drag-and-drop-song-album-title").innerText =
              albumTitleFromDragAndDrop;
            document.getElementById("drag-and-drop-song-artist").innerText =
              artistNameFromDragAndDrop;
            await versions.writeAudioFileIntoApp(
              file,
              albumTitleFromDragAndDrop,
              songTitleFromDragAndDrop
            );
          },
    
          onError: function (error: any) {
            console.log(":(", error.type, error.info);
          },
        });
      }
    
      for (const file of event.dataTransfer.items) {
        file.type;
        const isTypeAudio = file.type === "audio/mpeg" ? true : false;
        console.log(
          "🚀 ~ file: renderer.ts:526 ~ dragAndDropContainer.addEventListener ~ isTypeAudio:",
          isTypeAudio
        );
      }
    });

    dragAndDropContainer.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
  
    dragAndDropContainer.addEventListener("dragenter", (event) => {
      console.log("File is in the Drop Space");
    });
  
    dragAndDropContainer.addEventListener("dragleave", (event) => {
      console.log("File has left the Drop Space");
    });
      
}

dragAndDrop();

/* [ROMAIN]
 un peu de refacto ne ferait pas de mal. 
 de manière générale et complètement arbitrairement, il faut éviter les fichiers de plus de 100lignes.
*/