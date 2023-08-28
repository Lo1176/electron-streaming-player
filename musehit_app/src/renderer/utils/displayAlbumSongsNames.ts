/**
 *  function to display songs of an album
 */

import { Album, Artist, Song } from "./../renderer";
import { defaultCover } from "./showAllAlbums";
// import { currentArtist, currentAlbum } from "./showAllAlbums";
const currentAlbum: Album = JSON.parse(localStorage.getItem('currentAlbum'));
const currentArtist: Artist = JSON.parse(localStorage.getItem('currentArtist'));

let allSongsFromCurrentAlbum: Song = undefined;
let totalTracks = undefined;
let currentSong: {
  album_id: string;
  name: string;
  path: string;
  position: number;
};

const songsList = document.getElementById("songs-list");
const displayAlbum = document.getElementById("selected-album-container")
// display selected album
const albumCard = document.createElement("div") ? document.createElement("div") : null;
const cover = currentAlbum.cover !== "NULL" ? currentAlbum.cover : defaultCover;
// <a id='album_${currentAlbum}' href="#songs-list">
if (!!albumCard) {
  albumCard.innerHTML = `
  <div class="album-page-card">
  <img class="album-cover" src="./../../public/uploads/${cover}" alt="album cover">
  <div class="album-page-content">
  <h2 class="album-name">${currentAlbum.name}</h2>
  <p class="album-artiste-name">${currentArtist.name}</p>
  <p>${versions.findAllSongsByAlbumID(currentAlbum.id).length} titres - durée total ..h..mn - </p>
  </div>
  </a>
  `;}
  displayAlbum?.appendChild(albumCard);
function displayTotalAlbumTime() {}
function displayAlbumSongsNames(album: Album) {
  // 1. show selected album title + ... ${album.cover} .release_date .name .artist_id ...
  allSongsFromCurrentAlbum = !!album ? versions.findAllSongsByAlbumID(album.id) : null;
  totalTracks = allSongsFromCurrentAlbum.length;
  
  // if (!!songsList) songsList.innerHTML = "";
  const divAllSongs = document.createElement("div");
  // divAllSongs.setAttribute("id", "theSongList"); // maybe add a class but not an id
  
  // list all allSongsFromCurrentAlbum
  for (let i = 0; i < allSongsFromCurrentAlbum.length; i++) {
    const divSong = document.createElement("div");
    divSong.setAttribute("class", "song-info");
    divSong.innerHTML = `
      <div class="content-overlay"></div>
      <div>
        <img class="album-cover album-cover-thumb" src='./../../public/uploads/${album.cover}' alt="album cover">
      </div>
      <div>
        <img id='btn-over' class='toto' src="../images/play-btn.svg" alt="play button"/>
      </div>
      <p class="song-name">${allSongsFromCurrentAlbum[i].name}</p>
      `
      
    const btnOver = document.getElementById("btn-over") as HTMLElement;
    
    divSong.addEventListener("click", () => {
      currentSong = allSongsFromCurrentAlbum[i];
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

if (!!songsList) displayAlbumSongsNames(currentAlbum);

/**
 * Footer player
 */
const footerPlayer = document.getElementById(
  "footer-player"
) as HTMLImageElement;
const playBtn = document.getElementById("play")? document.getElementById("play") as HTMLImageElement : null;
const playIcon = "./../../src/images/play-btn.svg";
const pauseIcon = "./../../src/images/pause-btn.svg";
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

if (!!playBtn) {
  playBtn.addEventListener("click", () => {
    // is the song  playing ?
    const isPlaying = footerPlayer.classList.contains("play");
    
    isPlaying ? pauseSong() : playSong();
  });
}

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
  audioPlayer.src = `./../../public/uploads/${currentSong.path}`;
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

if (!!nextBtn) {
  nextBtn.addEventListener("click", () => {
    nextSong();
  });
}

if (!!nextBtn) {
  prevBtn.addEventListener("click", () => {
    prevSong();
  });
}

// Count down => time left
if (!!audioPlayer) {

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
}

// Count up => duration
if (!!audioPlayer) {
  audioPlayer.addEventListener(
    "timeupdate",
    function () {
      const timeLineElement = document.getElementById("duration");
      const s = Math.floor(audioPlayer.currentTime % 60);
      const m = Math.floor((audioPlayer.currentTime / 60) % 60);
      if (s < 10) {
        timeLineElement.innerHTML = m + ":0" + s;
      } else {
        timeLineElement.innerHTML = m + ":" + s;
      }
      updateProgressBar(audioPlayer.currentTime, audioPlayer.duration);
    },
    false
    );
  }
    
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

if (!!progressContainer) {

  progressContainer.addEventListener("click", playHere);
  // if we click on the progress bar we can it must change the currentTime
  function playHere(e: { offsetX: any }) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audioPlayer.duration;
    
    audioPlayer.currentTime = (clickX / width) * duration;
  }
}
  
if (!!audioPlayer) audioPlayer.addEventListener("ended", nextSong);

export { playThisSong };

export {
  displayAlbumSongsNames,
  totalTracks,
  allSongsFromCurrentAlbum,
};