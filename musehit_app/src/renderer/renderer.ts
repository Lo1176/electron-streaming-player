// find all albums
const albums = versions.findAlbumsByArtist();
// console.log("🚀 ~ file: renderer.ts:3 ~ albums:", albums)

const containerSongsList = document.getElementById("songs-list");
const audioPlayer = <HTMLVideoElement> document.getElementById("audioPlayer");
/************ PLAYER INFOS ***************/
const PLAYER = console.log(
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
// const allAlbums = document.createElement('ul');
// allAlbums.setAttribute('id', 'allAlbums');

var allSongsFromCurrentAlbum = undefined
var totalTracks = undefined
var currentSong = undefined
var currentAlbum = undefined
var artistInfo = undefined
var defaultCover = "default-cover.png"

const showAllAlbums = () => {
  for ( let i = 0; i < albums.length; i++) {
    artistInfo = versions.findArtist(albums[i].artist_id);
    const div = document.createElement('div');
    const cover = (albums[i].cover !== 'NULL') ? albums[i].cover : defaultCover;
    div.innerHTML = `
     <a id="album" 
      title="Click to open this album" 
      href="#album"><div class="album-card">
        <img class="album-cover" src="./../public/uploads/${cover}" alt="album cover">
        <div class="album-content">
          <h4 class="album-name">${albums[i].name}</h4>
          <p class="album-artiste-name">${artistInfo.name}</p>
        </div>
    </a>`;
    div.addEventListener("click", () => { 
      currentAlbum = albums[i].name,
      displayAlbumSongsNames(albums[i]);
    });
    albumContainer.appendChild(div);
  }
}
showAllAlbums();

/** function to display songs of an album */
const displayAlbumSongsNames = ({id: album_id}) => {
  allSongsFromCurrentAlbum = versions.findAllSongsByAlbumID(album_id);
  totalTracks = allSongsFromCurrentAlbum.length;

  containerSongsList.innerHTML = "";
  const divAllSongs = document.createElement("div");
  divAllSongs.setAttribute("id", "theSongList");


  // list all allSongsFromCurrentAlbum from a specific album
  for (let i = 0; i < allSongsFromCurrentAlbum.length; i++) {
    const divSong = document.createElement("div");
    divSong.innerText = allSongsFromCurrentAlbum[i].name;
    divSong.addEventListener('click', () => {
      currentSong = allSongsFromCurrentAlbum[i];
      playThisSong();
    });
    divAllSongs.appendChild(divSong);
  }

  containerSongsList.appendChild(divAllSongs); // add ul to the container.
  return totalTracks;
};

playBtn.addEventListener("click", () => {
  playPauseFctn(); 
});

async function playPauseFctn () {
  // console.log("🚀 ~ file: renderer.ts:97 ~ playPauseFctn ~ isAudioPlaying:", isAudioPlaying)
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

  console.log("song ", currentSong.name),
  console.log("curentAlbum: ", currentAlbum)
};

// Countdown
audioPlayer.addEventListener("timeupdate", function() {
    var timeleft = document.getElementById('timeleft'),
        duration = parseInt( audioPlayer.duration ),
        currentTime = parseInt( audioPlayer.currentTime ),
        timeLeft = duration - currentTime,
        s, m;
        
        
        s = timeLeft % 60;
        m = Math.floor( timeLeft / 60 ) % 60;
        
        s = s < 10 ? "0"+s : s;
        m = m < 10 ? "0"+m : m;
        
        timeleft.innerHTML = m+":"+s;    
}, false);

// Countup
audioPlayer.addEventListener("timeupdate", function() {
    var timeline = document.getElementById('duration');
    var s = parseInt(audioPlayer.currentTime % 60);
    var m = parseInt((audioPlayer.currentTime / 60) % 60);
    if (s < 10) {
        timeline.innerHTML = m + ':0' + s;
    }
    else {
        timeline.innerHTML = m + ':' + s;
    }
}, false);

// Next song
async function nextSong() {
  let position = (currentSong.position += 1);

  if (position > totalTracks - 1) {
    await audioPlayer.pause();
  } else {
    allSongsFromCurrentAlbum = versions.findAllSongsByAlbumID(currentSong.album_id);
    currentSong = (allSongsFromCurrentAlbum.filter(
      (song) => (song["position"] === position)))[0];
    playThisSong();
  }
};

// Prev song
async function prevSong() {
  let position = (currentSong.position)
  if (position > 2) position -= 1;  
  if (position > totalTracks - 1) {
    await audioPlayer.pause();
  } else {
    const songs = versions.findAllSongsByAlbumID(currentSong.album_id);
    currentSong = (allSongsFromCurrentAlbum.filter(
    (song) => (song["position"] === position)))[0];
    playThisSong();
  }
};

