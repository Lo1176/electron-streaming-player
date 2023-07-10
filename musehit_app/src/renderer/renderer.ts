import { isDataView } from "util/types";
import createAlbum from "./utils/createAlbum";
import createArtist from "./utils/createArtist";
import createSong from "./utils/createSong";
// import searchBarFunction from "./utils/searchBarFunction"

const jsmediatags = window.jsmediatags;

// find all albums (first 9)
const albums = versions.findAlbumsByArtist();
const songsList = document.getElementById("songs-list");
if (!!document.getElementById("audioPlayer")) {
  var audioPlayer = <HTMLVideoElement>document.getElementById("audioPlayer");
}
/******* PLAYER INFOS *********/
// if (!!audioPlayer) {
//   var PLAYER = console.log(
//     "🚀 ~ PLAYER_INFO ~ ",
//     "audioPlayer.paused:",
//     audioPlayer.paused,
//     "audioPlayer.currentTime:",
//     audioPlayer.currentTime,
//     "audioPlayer.ended:",
//     audioPlayer.ended,
//     "audioPlayer.readyState:",
//     audioPlayer.readyState
//   );
// }
/** end */

/******* tables from DB *********/
type Artist = {
  id?: number;
  name?: string;
}
type Album = {
  name?: string;
  artist_id?: number;
  cover?: string;
  release_date?: string;
  genre?: string;
  disk?: string
  id?: number;
}
type Song = {
  id?: number;
  name?: string;
  path?: string;
  position?: number;
  album_id?: number;
};
/** end */

const footerPlayer = document.getElementById("footer-player");
const playBtn = document.getElementById("play") as HTMLImageElement;
const playIcon = "./../src/images/play-btn.svg";
const pauseIcon = "./../src/images/pause-btn.svg";
// playBtn.innerHTML = `<i>${playIcon}</i>`;
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const progressContainer = document.getElementById("progress-container");
const progressBar = document.getElementById("progress-bar");

/** display albums name on Homepage */
const albumContainer = document.getElementById("albums-container");
const albumName = document.getElementById('album-name');
const artistName = document.getElementById('artist-name');
const songName = document.getElementById('song-name');
const infoContentSeparator = document.getElementById("player-info-content-separator"); 
// const allAlbums = document.createElement('ul');
// allAlbums.setAttribute('id', 'allAlbums');

var allSongsFromCurrentAlbum = undefined
var totalTracks = undefined
var currentSong = undefined
var currentAlbum = undefined
var currentArtist = undefined
var defaultCover = "default-cover.png"

/** 
 * function to display all albums
 */
async function showAllAlbums() {
  for ( let i = 0; i < albums.length; i++) {
    const artistInfo = await versions.findArtistById(albums[i].artist_id);
    // console.log("🚀 ~ file: renderer.ts:83 ~ showAllAlbums ~ artistInfo:", artistInfo)
    const albumCard = document.createElement("div");
    const cover = albums[i].cover !== "NULL" ? albums[i].cover : defaultCover;
    // <a id='album_${albums[i]}' href="./../src/renderer/album.html">
    albumCard.innerHTML = `
    <a id='album_${albums[i]}' href="#songs-list">
      <div class="album-card">
        <img class="album-cover" src="./../public/uploads/${cover}" alt="album cover">
      <div class="album-content">
        <h4 class="album-name">${albums[i].name}</h4>
        <p class="album-artiste-name">${artistInfo.name}</p>
      </div>
    </a>
    `;
    albumCard.addEventListener("click", () => {
      (currentAlbum = albums[i]),
        (currentArtist = artistInfo),
        displayAlbumSongsNames();
      // localStorage.setItem('album', currentAlbum);
      localStorage.album = currentAlbum;
    });
    albumContainer?.appendChild(albumCard);
  }
}
showAllAlbums();

/** function to display songs of an album */
function displayAlbumSongsNames() {
  // currentAlbum = localStorage.album
  allSongsFromCurrentAlbum = versions.findAllSongsByAlbumID(currentAlbum.id);
  totalTracks = allSongsFromCurrentAlbum.length;

  if (!!songsList) songsList.innerHTML = "";
  const divAllSongs = document.createElement("div");
  // divAllSongs.setAttribute("id", "theSongList"); // maybe add a class but not an id

  // list all allSongsFromCurrentAlbum
  for (let i = 0; i < allSongsFromCurrentAlbum.length; i++) {
    const divSong = document.createElement("div");
    divSong.setAttribute("class", "song-info");
    divSong.innerHTML = `
      <div class="content-overlay"></div>
      <div>
        <img class="album-cover album-cover-thumb" src="./../public/uploads/${currentAlbum.cover}" alt="album cover">
      </div>
      <div>
      <div class="toto">
          <img id='btn-over' class='' src = "./../src/images/play-btn.svg" alt="play button"/>
      </div>
      </div>
      <p class="song-name">${allSongsFromCurrentAlbum[i].name}</p>
    `;
    const btnOver = document.getElementById("btn-over") as HTMLElement;
    divSong.addEventListener("click", () => {
      currentSong = allSongsFromCurrentAlbum[i];
      // maybe find a better name than playThisSong => it's confused with playSong
      playThisSong();
    });
    !!btnOver &&
      divSong.addEventListener("mouseover", () => {
        btnOver.style.opacity = "1";
      });

    divAllSongs.appendChild(divSong);
  }

  songsList.appendChild(divAllSongs); // add ul to the container.
  return totalTracks;
}

playBtn.addEventListener("click", () => {
  // is the song  playing ?
  const isPlaying = footerPlayer.classList.contains("play");

  isPlaying ? pauseSong() : playSong();
});

function playSong() {
  footerPlayer.classList.remove("pause"),
  footerPlayer.classList.add("play"),
  playBtn.src = pauseIcon,
  audioPlayer.play();
}

function pauseSong() {
  footerPlayer.classList.remove("play"),
  footerPlayer.classList.add("pause"),
  playBtn.src = playIcon,
  audioPlayer.pause();
}

/*********** functions for player **************/
// play a song
const playThisSong = () => {
  audioPlayer.src = `./../public/uploads/${currentSong.path}`;
  playSong();
  if (currentSong.position === 1) {
    prevBtn.classList.add('disabled')

  }
  if (currentSong.position > 1 && currentSong.position !== totalTracks) {
    prevBtn.classList.remove("disabled");
    nextBtn.classList.remove("disabled");
  }

  if (currentSong.position === totalTracks) {
    nextBtn.classList.add('disabled')
  }

  // display album information
  songName.innerText = currentSong.name;
  infoContentSeparator.innerText = "•";
  artistName.innerText = currentArtist.name;
};

nextBtn.addEventListener("click", () => {
  nextSong();
});
prevBtn.addEventListener("click", () => {
  prevSong();
});

// Count down => time left
audioPlayer.addEventListener("timeupdate", function() {
    var timeLeftElement = document.getElementById('time-left'),
        songDuration = audioPlayer.duration,
        currentTime = audioPlayer.currentTime,
        timeLeft = songDuration - currentTime,
        s: string | number,
        m: string | number;
        
        s = Math.floor(timeLeft) % 60;
        m = Math.floor( timeLeft / 60 ) % 60;
        
        s = s < 10 ? "0" + s : s;
        m = m < 10 ? "0" + m : m;
        
        timeLeftElement.innerHTML = m + ":" + s;  
}, false);

// Count up => duration
audioPlayer.addEventListener("timeupdate", function() {
    var timeLineElement = document.getElementById('duration');
    var s = Math.floor(audioPlayer.currentTime % 60);
    var m = Math.floor((audioPlayer.currentTime / 60) % 60);
    if (s < 10) {
        timeLineElement.innerHTML = m + ':0' + s;
    }
    else {
        timeLineElement.innerHTML = m + ':' + s;
    }
    updateProgressBar(audioPlayer.currentTime, audioPlayer.duration);
}, false);

// Next song
function nextSong() {
  let position = (currentSong.position += 1);

  if (position > totalTracks) {
    audioPlayer.pause();
  } else {
    allSongsFromCurrentAlbum = versions.findAllSongsByAlbumID(currentSong.album_id);
    currentSong = (allSongsFromCurrentAlbum.filter(
      (song: { [x: string]: any; }) => (song["position"] === position)))[0];
    playThisSong();
  }
};

// Prev song
function prevSong() {
  let position = currentSong.position
  if (position >= 2) position -= 1;  
  if (position > totalTracks - 1) {
    audioPlayer.pause();
  } else {
    const songs = versions.findAllSongsByAlbumID(currentSong.album_id);
    currentSong = (allSongsFromCurrentAlbum.filter(
    (song: { [x: string]: any; }) => (song["position"] === position)))[0];
    playThisSong();
  }
};

// progress bar
// 1- convert currentTime en % par rapport à songDuration
function updateProgressBar(currentTime: number, songDuration: number) {
  // const { currentTime, songDuration } = e.target;
  const progressPercent = Math.floor(currentTime * 100) / songDuration;
  progressBar.style.width = `${progressPercent}%`;
}

progressContainer.addEventListener("click", playHere);
// if we click on the progress bar we can it must change the currentTime
function playHere(e: { offsetX: any; }) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audioPlayer.duration;

  audioPlayer.currentTime = (clickX / width) * duration;
}

audioPlayer.addEventListener('ended', nextSong);

/******** TESTING AREA  ************/
//  const testAllArtists = [
//   {id: 4, name: 'Alabama Shakes'},
//   {id: 2, name: 'Michael Jackson'},
//   {id: 1, name: 'The Beatles'},
//   {id: 3, name: 'Wolfgang Amadeus Mozart'}
//  ]
 
/********* Drag and Drop Zone  ************/
const dragAndDropContainer = document.getElementById("drag-and-drop-container") as HTMLElement;
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
          picture: object;
          year: string;
          genre: string;
          volume: object;
        };
      }) {
        let album: Album = {};
        // type coverProps = { data: any; format: any };
        console.log("file: tag.tags \n",tag.tags)
        const songTitleFromDragAndDrop = tag.tags.title;
        const albumTitleFromDragAndDrop = tag.tags.album;
        const releaseDate = tag.tags.year ? tag.tags.year : "";
        const genre = tag.tags.genre !== " " ? tag.tags.genre : " ";
        const disk = tag.tags.volume?.disk ? tag.tags.volume?.disk : 1;
        const coverFromMetaData = tag.tags.picture;
        const formattedAlbumName = versions.formattedName(albumTitleFromDragAndDrop);
        const formattedSongName = versions.formattedName(songTitleFromDragAndDrop);
        const songPath: string = `${formattedAlbumName}/${file.name}`;
        const coverPath: string = `${formattedAlbumName}/${formattedAlbumName}-cover.png`;
        console.log("🚀 ~ file: renderer.ts:326 ~ dragAndDropContainer.addEventListener ~ songPath:", songPath)


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
          return albumImagePath = versions.saveImage(
            saveImageToPath,
            albumImageUri,
          );
        };
        const artistNameFromDragAndDrop = tag.tags.artist;
        const songPositionFromDragAndDrop = parseInt(
          tag.tags.track.split("/")[0]
        );
        const artistInfos: { id: string, name: string } =
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
          const albumsInfos = versions.findAllAlbumsByArtistId(artistInfos.id);
      

          /** VERIFIER SI ALBUM EXIST AVEC ALBUM NAME ET ARTIST ID */
          const isAlbumAlreadyExist = albumsInfos.includes(albumTitleFromDragAndDrop) ;

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
            const currentAlbumFromDragAndDrop = versions.findAlbumByArtistIdAndAlbumName(
              parseInt(artistInfos.id),
              albumTitleFromDragAndDrop,
            );
            console.log("🚀 ~ ################ ~ currentAlbumFromDragAndDrop:", currentAlbumFromDragAndDrop, "\nlet's create the song: \n");
            // NEXT STEP create song linked to album id
            // createSong if song doesn't exist
            let song: Song = {};

            song = versions.findSongByAlbumIdAndSongName(
              currentAlbumFromDragAndDrop.id,
              songTitleFromDragAndDrop
            );
            console.log("🚀 ~ file: renderer.ts:404 ~ dragAndDropContainer.addEventListener ~ song:", song)
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
          console.log('ici')
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

          !!currentAlbumFromDragAndDrop && createSong(
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
    file.type
    const isTypeAudio = file.type === "audio/mpeg" ? true : false
    console.log("🚀 ~ file: renderer.ts:526 ~ dragAndDropContainer.addEventListener ~ isTypeAudio:", isTypeAudio)
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

/** Search Bar Function */

// const searchBarFunction = () => {
  const searchInput = document.querySelector("[data-search]");
  // let fetchData = []


    searchInput.addEventListener("input", (e) => {
      // let searchData = []
      // How to type .data ?? (e.target as HTMLInputElement).value;
      const value = e.target.value.toLowerCase();
      // console.log("🚀 ~ file: renderer.ts:557 ~ searchInput.addEventListener ~ value:", value)
      if (value.length >= 2) {
        const searchData = versions.searchData(value);
        console.log(
          "🚀 ~ file: renderer.ts:560 ~ searchInput.addEventListener ~ searchData:",
          versions.searchData(value)
        );
      }
      // need to display data.map if searchData.length > 1

      // div.element.classList.toggle("hide", !isVisible)
    })

// };
// searchBarFunction();
