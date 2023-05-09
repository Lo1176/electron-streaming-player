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
const isAudioPlaying = 
!!(
  audioPlayer.currentTime > 0 &&
  !audioPlayer.paused &&
  !audioPlayer.ended 
  // &&   audioPlayer.readyState > audioPlayer.HAVE_CURRENT_DATA
);



const playBtn = document.getElementById("play");
const playIcon = "./../src/images/play-btn.svg";
const pauseIcon = "./../src/images/pause-btn.svg";
// playBtn.innerHTML = `<i>${playIcon}</i>`;
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

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
      playThisSong();
    });
    divAllSongs.appendChild(divSong);
  }

  songsList.appendChild(divAllSongs); // add ul to the container.
  return totalTracks;
};

playBtn.addEventListener("click", () => {
  playPauseFctn(); 
});

async function playPauseFctn () {
  if (audioPlayer.classList.contains("play")) {
    audioPlayer.classList.remove("play"),
    audioPlayer.classList.add("pause"),
    playBtn.src = pauseIcon,
    await audioPlayer.play()
  } else {
    audioPlayer.classList.remove("pause"),
    audioPlayer.classList.add("play"),
    playBtn.src = playIcon,
    await audioPlayer.pause()
  }
}

/** functions for players */
// function to pay a song
const playThisSong = () => {
  PLAYER
  audioPlayer.src = `./../public/uploads/${currentSong.path}`;
  audioPlayer.classList.add("play");
  playPauseFctn();
  
  nextBtn.addEventListener("click", () => {
    nextSong();
  });
  prevBtn.addEventListener("click", () => {
    prevSong();
  });
  
  // display album informations
  // albumName.innerHTML = // not displayed

  songName.innerText = currentSong.name;
  infoContentSeparator.innerText = "•";
  artistName.innerText = currentArtist.name;
  console.log("song ", currentSong.name),
    console.log(
      "🚀 ~ file: renderer.ts:149 ~ info-content currentAlbum:",
      currentAlbum,
      "currentSong:",
      currentSong,
      "currentArtist.name:",
      currentArtist.name
    );
};


// Countdown
audioPlayer.addEventListener("timeupdate", function() {
    var timeLeftElement = document.getElementById('timeleft'),
        songDuration = parseInt(audioPlayer.duration),
        currentTime = parseInt(audioPlayer.currentTime),
        timeLeft = songDuration - currentTime, s, m;
        
        s = timeLeft % 60;
        m = Math.floor( timeLeft / 60 ) % 60;
        
        s = s < 10 ? "0"+s : s;
        m = m < 10 ? "0"+m : m;
        
        timeLeftElement.innerHTML = m + ":" + s;    
}, false);

// Countup
audioPlayer.addEventListener("timeupdate", function() {
    var timeLineElement = document.getElementById('duration');
    var s = parseInt(audioPlayer.currentTime % 60);
    var m = parseInt((audioPlayer.currentTime / 60) % 60);
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

  if (position > totalTracks - 1) {
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
  let position = (currentSong.position)
  if (position > 2) position -= 1;  
  if (position > totalTracks - 1) {
    audioPlayer.pause();
  } else {
    const songs = versions.findAllSongsByAlbumID(currentSong.album_id);
    currentSong = (allSongsFromCurrentAlbum.filter(
    (song: { [x: string]: any; }) => (song["position"] === position)))[0];
    playThisSong();
  }
};

