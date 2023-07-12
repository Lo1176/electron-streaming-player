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
  dragAndDropContainer.addEventListener("drop", (event) => {
    event.preventDefault();
    event.stopPropagation();

    for (const file of event.dataTransfer.files) {
      // Using the path attribute to get absolute file path
      // console.log("File Path of dragged FILES: ", file.path);

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
          };
        }) {
          let album: Album = {};
          // type coverProps = { data: any; format: any };
          console.log("file: tag.tags \n", tag.tags);
          const songTitleFromDragAndDrop = tag.tags.title;
          const albumTitleFromDragAndDrop = tag.tags.album;
          const releaseDate = tag.tags.year ? tag.tags.year : "";
          const genre = tag.tags.genre !== " " ? tag.tags.genre : " ";
          const disk = tag.tags.volume?.disk ? tag.tags.volume?.disk : 1;
          const coverFromMetaData = tag.tags.picture;
          const formattedAlbumName = versions.formattedName(
            albumTitleFromDragAndDrop
          );
          const formattedSongName = versions.formattedName(
            songTitleFromDragAndDrop
          );
          const songPath: string = `${formattedAlbumName}/${file.name}`;
          const coverPath: string = `${formattedAlbumName}/${formattedAlbumName}-cover.png`;
          console.log(
            "🚀 ~ file: renderer.ts:326 ~ dragAndDropContainer.addEventListener ~ songPath:",
            songPath
          );

          let base64String = "";
          for (let i = 0; i < coverFromMetaData.data.length; i++) {
            base64String += String.fromCharCode(coverFromMetaData.data[i]);
          }
          /**imageUri */
          const albumImageUri = window.btoa(base64String);

          /** save image into public/uploads */
          const createCoverImage = () => {
            const saveImageToPath = `./public/uploads/${coverPath}`;
            let albumImagePath: string;
            return (albumImagePath = versions.saveImage(
              saveImageToPath,
              albumImageUri
            ));
          };
          const artistNameFromDragAndDrop = tag.tags.artist;
          const songPositionFromDragAndDrop = parseInt(
            tag.tags.track.split("/")[0]
          );
          const artistInfos: { id: string; name: string } =
            versions.findArtistByName(artistNameFromDragAndDrop);

          /******#
           * #
           * # define functions #
           * #
           * #*******/

          /*** END -- define functions */

          // console.log("*******findArtistByName: ", !!artistInfos);
          /** les infos de l'artist existent-elles ou pas ? */
          if (!!artistInfos) {
            // 1/a ARTIST is already in the DB next so fetch its id (artistInfos.id) in STEP 1/b
            console.log(`The artist: ${artistInfos.name} already exist in db`);

            /** find all albums for this artistInfos.id => array.includes */
            const albumsInfos = versions.findAllAlbumsByArtistId(
              artistInfos.id
            );

            /** VERIFIER SI ALBUM EXIST AVEC ALBUM NAME ET ARTIST ID */
            const isAlbumAlreadyExist = albumsInfos.includes(
              albumTitleFromDragAndDrop
            );

            /** create new album linked to artist id if it isn't exist */
            /** next step verifier si l'album est déjà dans la DB */
            if (isAlbumAlreadyExist) {
              /**
               * 1/b
               * if album already exist add createSong()
               *
               */
              console.log(
                `we already have the album ${album.name} from ${artistInfos.name} in db`
              );
              const currentAlbumFromDragAndDrop =
                versions.findAlbumByArtistIdAndAlbumName(
                  parseInt(artistInfos.id),
                  albumTitleFromDragAndDrop
                );
              console.log(
                "🚀 ~ ################ ~ currentAlbumFromDragAndDrop:",
                currentAlbumFromDragAndDrop,
                "\nlet's create the song: \n"
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
                song
              );
              createCoverImage();
              createSong(
                songTitleFromDragAndDrop,
                songPath,
                currentAlbumFromDragAndDrop.id,
                songPositionFromDragAndDrop
              );
            } else {
              if (!!album?.name) {
                /** album does't exist in DB so ADD NEW ALBUM
                 * 1/ verifier si l'album a un nom
                 * 2/ créer le folder avec le nom de l'album ?? => a t on besoin de cette étape
                 * ou le dossier est directement créé avec le addSong ?
                 */
                // NEXT STEP => CREATE song linked to album id

                const song = versions.findSongByName(songTitleFromDragAndDrop);
                // console.log("🚀 ~ file: renderer.ts:341 ~ dragAndDropContainer.addEventListener ~ song:", song)
                if (!!song) {
                  console.log(`we already have the song ${song.name} in db`);
                } else {
                  // create song linked to album id
                  console.log(
                    "🚀 ~ file: renderer.ts:374 ~ dragAndDropContainer.addEventListener ~ create song linked to album id: \n",
                    "songTitle: ",
                    songTitleFromDragAndDrop,
                    "\nalbumInfo: ",
                    album
                  );
                  // const newSong: Song = ({} = versions.addSong(
                  //   songTitleFromDragAndDrop,
                  //   path,
                  //   album.id,
                  //   songPositionFromDragAndDrop
                  // ));
                  // console.log(
                  //   `we just created a new song named ${songTitleFromDragAndDrop}`
                  // );
                  // console.log("newSong: ", newSong);
                }
              } else {
                /**  create new album linked to artist id if it isn't exist */
                const currentAlbumFromDragAndDrop =
                  versions.findAlbumByArtistIdAndAlbumName(
                    parseInt(artistInfos.id),
                    albumTitleFromDragAndDrop
                  );
                // is album exist ?? &&
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

            const newArtist = versions.findArtistByName(
              artistNameFromDragAndDrop
            );
            console.log("newArtist: ", newArtist);

            // create album ?
            // ADD NEW ALBUM AND SONG INTO DB
            /** CREATE COVER IMAGE */
            console.log("ici");
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

            !!currentAlbumFromDragAndDrop &&
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