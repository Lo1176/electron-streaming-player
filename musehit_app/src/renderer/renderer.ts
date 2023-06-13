
const jsmediatags = window.jsmediatags;

//test 
// versions.writeAudioFileIntoApp(
//   "myfile3.txt",
//   "titi",
//   "the text to write in the file",
//   "utf-8"
// );

// find all albums
const albums = versions.findAlbumsByArtist();
const songsList = document.getElementById("songs-list");
if (!!document.getElementById("audioPlayer")) {
  var audioPlayer = <HTMLVideoElement>document.getElementById("audioPlayer");
}
/******* PLAYER INFOS *********/
if (!!audioPlayer) {
  var PLAYER = console.log(
    "🚀 ~ PLAYER_INFO ~ ",
    "audioPlayer.paused:",
    audioPlayer.paused,
    "audioPlayer.currentTime:",
    audioPlayer.currentTime,
    "audioPlayer.ended:",
    audioPlayer.ended,
    "audioPlayer.readyState:",
    audioPlayer.readyState
  );
}
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

// meme avec un async await j'ai deux fois mes <a></a> dans le browser. Pourquoi ?
async function showAllAlbums() {
  for ( let i = 0; i < albums.length; i++) {
    const artistInfo = await versions.findArtistById(albums[i].artist_id);
    const div = document.createElement('div');
    const cover = (albums[i].cover !== 'NULL') ? albums[i].cover : defaultCover;
    // link to page is not working :
    // <a id='album_${albums[i]}' href="./album.html">
    div.innerHTML = `
    <a id='album_${albums[i]}' href="#songs-list">
      <div class="album-card">
        <img class="album-cover" src="./../public/uploads/${cover}" alt="album cover">
      <div class="album-content">
        <h4 class="album-name">${albums[i].name}</h4>
        <p class="album-artiste-name">${artistInfo.name}</p>
      </div>
    </a>
    `;
    div.addEventListener("click", () => { 
      currentAlbum = albums[i],
      currentArtist = artistInfo,
      displayAlbumSongsNames();
      // localStorage.setItem('album', currentAlbum);
      localStorage.album = currentAlbum;
    });
    albumContainer?.appendChild(div);
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
    divSong.setAttribute('class', 'song-info')
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
    divSong.addEventListener('click', () => {
      currentSong = allSongsFromCurrentAlbum[i];
      // maybe find a better name than playThisSong => it's confused with playSong
      playThisSong();
    });
    divSong.addEventListener('mouseover', () => {
      // const name = currentSong.name;
      // console.log(`mouse over ${allSongsFromCurrentAlbum[i].name}`);
      btnOver.style.opacity = '1';

    })
    divAllSongs.appendChild(divSong);
  }

  songsList.appendChild(divAllSongs); // add ul to the container.
  return totalTracks;
};

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

  var path: string;

  for (const file of event.dataTransfer.files) {
    // Using the path attribute to get absolute file path
    // console.log("File Path of dragged FILES: ", file.path);
    path = file.path;

    jsmediatags.read(file, {
      onSuccess: async function (tag: {
        tags: {
          artist: string;
          album: string;
          track: string;
          title: string;
          picture: object;
        };
      }) {
        const songTitleFromDragAndDrop = tag.tags.title;
        const albumTitleFromDragAndDrop = tag.tags.album;
        // have to type cover
        type coverProps = { data: any; format: any };
        const cover = tag.tags.picture;
        let base64String = "";
        for (let i = 0; i < cover.data.length; i++) {
          base64String += String.fromCharCode(cover.data[i]);
        }
        const albumImageUri =
          "data:" + cover.format + ";base64," + window.btoa(base64String);
        /**imageUri */
        console.log("l'image ???", albumImageUri);

        const artistNameFromDragAndDrop = tag.tags.artist;
        const songPositionFromDragAndDrop = parseInt(
          tag.tags.track.split("/")[0]
        );
        const artistInfos = versions.findArtistByName(
          artistNameFromDragAndDrop
        );
        let album: Album = {};
        let song: Song = {};

        console.log("*******findArtistByName: ", artistInfos);
        if (artistInfos !== undefined) {
          /**  if artistNameFromDragAndDrop already exists in DB we fetch its id, */
          let artistId = artistInfos.id;
          const albumExist =
            versions.findAlbumByArtistId(artistId) === undefined ? false : true;
          // console.log("🚀 ~ file: renderer.ts:330 ~ dragAndDropContainer.addEventListener ~ albumExist:", albumExist)

          /** create new album linked to artist id if it isn't exist */
          console.log(`The artist: ${artistInfos.name} already exist in db`);

          /** next step verifier si l'album est déjà dans la DB */
          if (albumExist) {
            const album: Album = ({} = versions.findAlbumByName(
              albumTitleFromDragAndDrop
              ));
              console.log(
                `L'album ${album.name} existe dans la DB vérifions si nous avons déjà cette chanson ...`
              );

          } else {
            if (album.name !== undefined) {
              console.log(`we already have the album ${album.name} in db`);
              // create song linked to album id
              console.log(
                "🚀 ~ file: renderer.ts:337 ~ dragAndDropContainer.addEventListener ~ songTitleFromDragAndDrop:",
                songTitleFromDragAndDrop
              );
              const song = versions.findSongByName(songTitleFromDragAndDrop);
              // console.log("🚀 ~ file: renderer.ts:341 ~ dragAndDropContainer.addEventListener ~ song:", song)
              if (song !== undefined) {
                // console.log("🚀 ~ file: renderer.ts:339 ~ dragAndDropContainer.addEventListener ~ song:", song)
                console.log(`we already have the song ${song.name} in db`);
              } else {
                // create song linked to album id
                const newSong: Song = ({} = versions.addSong(
                  songTitleFromDragAndDrop,
                  path,
                  album.id,
                  songPositionFromDragAndDrop
                ));
                console.log(
                  `we just created a new song named ${songTitleFromDragAndDrop}`
                );
                console.log("newSong: ", newSong);
              }
            } else {
              /**  create new album linked to artist id if it isn't exist */
              // console.log("🚀 ~ file: renderer.ts:367 ~ dragAndDropContainer.addEventListener ~ artist.id:", artist.id)

              const newAlbum = versions.addAlbum(
                albumTitleFromDragAndDrop,
                artistInfos.id,
                "public/uploads/default-cover.png"
              );

              console.log(
                `we've just created a new album named ${albumTitleFromDragAndDrop}`
              );
              console.log("newAlbum: ", newAlbum);
            }
          }
        } else {
          // if artist is undefined => add a new artist
          const newArtist = versions.addArtist(artistNameFromDragAndDrop);
          console.log(
            `we just created a new artist named ${artistNameFromDragAndDrop}`
          );
          console.log("newArtist: ", newArtist);
          // create album ?
          //***** artist.id is undefined */
          const newAlbum = versions.addAlbum(
            albumTitleFromDragAndDrop,
            newArtist.id,
            "public/uploads/default-cover.png"
          );
          alert(
            `we just created a new album named ${albumTitleFromDragAndDrop}`
          );
          console.log("newAlbum: ", newAlbum, ",id ", newAlbum.id);
          // create song ?
          /************ CREATE SONG IF IT DOES'NT EXIST **********/
          const newSong = versions.addSong(
            songTitleFromDragAndDrop,
            path,
            newAlbum.id,
            songPositionFromDragAndDrop
          );
          alert(`we just created a new song named ${songTitleFromDragAndDrop}`);
          console.log("newSong: ", newSong);
        }

        // display tags information into drop Area
        document.getElementById("drag-and-drop-song-title").innerText =
          songTitleFromDragAndDrop;
        document.getElementById("drag-and-drop-song-album-title").innerText =
          albumTitleFromDragAndDrop;
        document.getElementById("drag-and-drop-song-artist").innerText =
          artistNameFromDragAndDrop;
        // console.log("tag: ", tag);
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
    // saveAudioFile(event);
  }
  // ipcRenderer.send('ondragstart', path)

  for (const file of event.dataTransfer.items) {
    console.log("File ITEMS: ", file);
  }

  // dropEffect: https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/dropEffect
  // for (const file of event.dataTransfer.dropEffect) {
  //   console.log("File dropEffect: ", file);
  // }
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
