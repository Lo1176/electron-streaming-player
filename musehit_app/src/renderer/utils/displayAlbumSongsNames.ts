import { currentAlbum } from "./showAlbums";

/** function to display songs of an album */
let allSongsFromCurrentAlbum = undefined;
let totalTracks = undefined;
// currentSong to LocalStorage ??? à voir
 let currentSong: {
   album_id: string;
   name: string;
   path: string;
   position: number;
 };
const songsList = document.getElementById("songs-list");


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
    `

    const btnOver = document.getElementById("btn-over") as HTMLElement;

    divSong.addEventListener("click", () => {
       currentSong = allSongsFromCurrentAlbum[i];
       console.log(
         "🚀 ~ file: displayAlbumSongsNames.ts:25 ~ displayAlbumSongsNames ~ allSongsFromCurrentAlbum[i]:",
         allSongsFromCurrentAlbum[i]
       );
      // maybe find a better name than playThisSong => it's confused with playSong
      playThisSong();
    });

    !!btnOver &&
      divSong.addEventListener("mouseover", () => {
        btnOver.style.opacity = "1";
      });

    divAllSongs.appendChild(divSong);
  }

  songsList?.appendChild(divAllSongs); // add ul to the container.
  return totalTracks;
}

import { currentArtist } from "./showAlbums";

const footerPlayer = document.getElementById(
  "footer-player"
) as HTMLImageElement;
const playBtn = document.getElementById("play") as HTMLImageElement;
const playIcon = "./../src/images/play-btn.svg";
const pauseIcon = "./../src/images/pause-btn.svg";
// playBtn.innerHTML = `<i>${playIcon}</i>`;
const prevBtn = document.getElementById("prev") as HTMLImageElement;
const nextBtn = document.getElementById("next") as HTMLImageElement;
const progressContainer = document.getElementById(
  "progress-container"
) as HTMLImageElement;
const progressBar = document.getElementById("progress-bar") as HTMLImageElement;
/** display albums name on Homepage */
const artistName = document.getElementById("artist-name") as HTMLImageElement;
const songName = document.getElementById("song-name") as HTMLImageElement;
const infoContentSeparator = document.getElementById(
  "player-info-content-separator"
) as HTMLImageElement;

// find all albums (first 9)
if (!!document.getElementById("audioPlayer")) {
  var audioPlayer = <HTMLVideoElement>document.getElementById("audioPlayer");
}

playBtn.addEventListener("click", () => {
  // is the song  playing ?
  const isPlaying = footerPlayer.classList.contains("play");

  isPlaying ? pauseSong() : playSong();
});

function playSong() {
  footerPlayer.classList.remove("pause"),
    footerPlayer.classList.add("play"),
    (playBtn.src = pauseIcon),
    audioPlayer.play();
}

function pauseSong() {
  footerPlayer.classList.remove("play"),
    footerPlayer.classList.add("pause"),
    (playBtn.src = playIcon),
    audioPlayer.pause();
}

/*********** functions for player **************/
// play a song
const playThisSong = () => {
  audioPlayer.src = `./../public/uploads/${currentSong.path}`;
  playSong();
  if (currentSong.position === 1) {
    prevBtn.classList.add("disabled");
  }
  if (currentSong.position > 1 && currentSong.position !== totalTracks) {
    prevBtn.classList.remove("disabled");
    nextBtn.classList.remove("disabled");
  }

  if (currentSong.position === totalTracks) {
    nextBtn.classList.add("disabled");
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
audioPlayer.addEventListener(
  "timeupdate",
  function () {
    var timeLeftElement = document.getElementById("time-left"),
      songDuration = audioPlayer.duration,
      currentTime = audioPlayer.currentTime,
      timeLeft = songDuration - currentTime,
      s: string | number,
      m: string | number;

    s = Math.floor(timeLeft) % 60;
    m = Math.floor(timeLeft / 60) % 60;

    s = s < 10 ? "0" + s : s;
    m = m < 10 ? "0" + m : m;

    timeLeftElement.innerHTML = m + ":" + s;
  },
  false
);

// Count up => duration
audioPlayer.addEventListener(
  "timeupdate",
  function () {
    var timeLineElement = document.getElementById("duration");
    var s = Math.floor(audioPlayer.currentTime % 60);
    var m = Math.floor((audioPlayer.currentTime / 60) % 60);
    if (s < 10) {
      timeLineElement.innerHTML = m + ":0" + s;
    } else {
      timeLineElement.innerHTML = m + ":" + s;
    }
    updateProgressBar(audioPlayer.currentTime, audioPlayer.duration);
  },
  false
);

// Next song
function nextSong() {
  let position = (currentSong.position += 1);

  if (position > totalTracks) {
    audioPlayer.pause();
  } else {
    allSongsFromCurrentAlbum = versions.findAllSongsByAlbumID(
      currentSong.album_id
    );
    currentSong = allSongsFromCurrentAlbum.filter(
      (song: { [x: string]: any }) => song["position"] === position
    )[0];
    playThisSong();
  }
}

// Prev song
function prevSong() {
  let position = currentSong.position;
  if (position >= 2) position -= 1;
  if (position > totalTracks - 1) {
    audioPlayer.pause();
  } else {
    const songs = versions.findAllSongsByAlbumID(currentSong.album_id);
    currentSong = allSongsFromCurrentAlbum.filter(
      (song: { [x: string]: any }) => song["position"] === position
    )[0];
    playThisSong();
  }
}

// progress bar
// 1- convert currentTime en % par rapport à songDuration
function updateProgressBar(currentTime: number, songDuration: number) {
  // const { currentTime, songDuration } = e.target;
  const progressPercent = Math.floor(currentTime * 100) / songDuration;
  progressBar.style.width = `${progressPercent}%`;
}

progressContainer.addEventListener("click", playHere);
// if we click on the progress bar we can it must change the currentTime
function playHere(e: { offsetX: any }) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audioPlayer.duration;

  audioPlayer.currentTime = (clickX / width) * duration;
}

audioPlayer.addEventListener("ended", nextSong);

export { playThisSong };

export {
  displayAlbumSongsNames,
  totalTracks,
  allSongsFromCurrentAlbum,
};