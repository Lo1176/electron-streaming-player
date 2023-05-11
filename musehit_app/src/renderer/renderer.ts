// find all albums
const albums = versions.findAlbumsByArtist();
const songsList = document.getElementById("songs-list");
if (!!document.getElementById("audioPlayer")) {
  var audioPlayer = <HTMLVideoElement>document.getElementById("audioPlayer");
}
/************ PLAYER INFOS ***************/
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
/**************** END ******************/

const isAudioPlaying = !!(
  audioPlayer.currentTime > 0 &&
  !audioPlayer.paused &&
  !audioPlayer.ended 
  // &&   audioPlayer.readyState > audioPlayer.HAVE_CURRENT_DATA
);

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
    const artistInfo = await versions.findArtist(albums[i].artist_id);
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
  // console.log('currentAlbum', currentAlbum)

  if (!!songsList) songsList.innerHTML = "";
  const divAllSongs = document.createElement("div");
  // divAllSongs.setAttribute("id", "theSongList"); // maybe add a class but not an id


  // list all allSongsFromCurrentAlbum
  for (let i = 0; i < allSongsFromCurrentAlbum.length; i++) {
    const divSong = document.createElement("div");
    divSong.setAttribute('class', 'song-info')
    divSong.innerHTML = `
      <div class="content-overlay"></div>
      <img class="album-cover album-cover-thumb" src="./../public/uploads/${currentAlbum.cover}" alt="album cover">
      <p class="song-name">${allSongsFromCurrentAlbum[i].name}</p>
    `;
    divSong.addEventListener('click', () => {
      currentSong = allSongsFromCurrentAlbum[i];
      // maybe find a better name than playThisSong => it's confused with playSong
      playThisSong();
    });
    divAllSongs.appendChild(divSong);
  }

  songsList.appendChild(divAllSongs); // add ul to the container.
  return totalTracks;
};

playBtn.addEventListener("click", () => {
  // is the song already playing ?
  const isPlaying = footerPlayer.classList.contains("play");

  isPlaying ? pauseSong() : playSong();
  // playPauseFctn(); // old function
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
// I have to split the playPauseFctn because a song finished it'll pause the next one
// async function playPauseFctn () {
//   if (audioPlayer.classList.contains("play")) {
//     audioPlayer.classList.remove("play"),
//     audioPlayer.classList.add("pause"),
//     playBtn.src = playIcon,
//     audioPlayer.pause();
//     PLAYER;
//   } else {
//     audioPlayer.classList.remove("pause"),
//     audioPlayer.classList.add("play"),
//     playBtn.src = pauseIcon,
//     await audioPlayer.play();
//     PLAYER;
//   }
// }



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
  console.log("🚀 ~ file: renderer.ts:168 ~ playThisSong ~ currentSong.position:", currentSong.position)
  console.log("🚀 ~ file: renderer.ts:168 ~ playThisSong ~ totalTracks:", totalTracks)
  console.log("🚀 ~ file: renderer.ts:168 ~ playThisSong ~ currentSong.position !== totalTracks:", currentSong.position !== totalTracks)
  if (currentSong.position === totalTracks) {
    nextBtn.classList.add('disabled')

  }

  // display album information
  songName.innerText = currentSong.name;
  infoContentSeparator.innerText = "•";
  artistName.innerText = currentArtist.name;
  // PLAYER
};

nextBtn.addEventListener("click", () => {
  nextSong();
});
prevBtn.addEventListener("click", () => {
  prevSong();
});

// Countdown
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

// Count up
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
    console.log("🚀 ~ file: renderer.ts:236 ~ nextSong ~ NEXTcurrentSong:", currentSong)
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
function displayProgressionBar({ currentTime, songDuration }) {
  // const { currentTime, songDuration } = e.target;
  const progressPercent = (currentTime * 100) / songDuration;
  console.log(
    "🚀 ~ file: renderer.ts:228 ~ displayProgressionBar ~ progressPercent:",
    progressPercent
  );
  progressBar.style.width = `${progressPercent}%`;
}

progressContainer.addEventListener("click", playHere);
// if we click on the progress bar we can it must change the currentTime
function playHere(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audioPlayer.duration;

  audioPlayer.currentTime = (clickX / width) * duration;
}

audioPlayer.addEventListener('ended', nextSong);
