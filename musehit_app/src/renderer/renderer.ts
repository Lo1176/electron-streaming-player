// find all albums
const albums = versions.findAlbumsByArtist();
// console.log("🚀 ~ file: renderer.ts:3 ~ albums:", albums)

const containerSongsList = document.getElementById("songs-list");
const audioPlayer = document.getElementById("audioPlayer");
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
  (
    // audioPlayer.currentTime > 0 &&
    !audioPlayer.paused &&
    !audioPlayer.ended 
    // audioPlayer.readyState > 2
  );
// console.log("🚀 ~ file: renderer.ts:72 ~ isAudioPlaying? ", isAudioPlaying);



const playBtn = document.getElementById("play");
const playIcon = "▶️";
const pauseIcon = "||"
playBtn.innerHTML = `<i>${playIcon}</i>`;
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

/** display albums name on Homepage */
const albumContainer = document.getElementById('albumContainer');
const allAlbums = document.createElement('div');
allAlbums.setAttribute('id', 'allAlbums');

var totalTracks = undefined

for ( let i = 0; i < albums.length; i++) {
    const li = document.createElement('li');

    li.innerHTML = `<a id="album" title="Click to open this album"
    href="#album">${albums[i].name}</a>`;
    li.setAttribute ('style', 'display: block;');
    li.addEventListener("click", () => { displayAlbumSongsNames(albums[i]);});

    allAlbums.appendChild(li);
}

albumContainer.appendChild(allAlbums);

/** function to display songs of an album */
const displayAlbumSongsNames = ({id: album_id}) => {
  const songs = versions.findAllSongsByAlbumID(album_id);
  totalTracks = songs.length;

  containerSongsList.innerHTML = "";
  const divAllSongs = document.createElement("div");
  divAllSongs.setAttribute("id", "theSongList");


  // list all songs from a specific album
  for (let i = 0; i < songs.length; i++) {
    const divSong = document.createElement("div");
    divSong.innerText += `${songs[i].name} `;
    divSong.addEventListener('click', () => {console.log("song ", songs[i]), playThisSong(songs.position = songs[i]);});
    // divSong.addEventListener("click", () => { playThisSong(versions.findSong(album_id, (songs.position = i)));
    
    
    
    // }      
      
    // );
    divAllSongs.appendChild(divSong);
  }

  containerSongsList.appendChild(divAllSongs); // add ul to the container.
  return totalTracks;
};

playBtn.addEventListener("click", () => {
  // if no song loaded => nothing appends
  // else
  // audioPlayer.onplaying = () => playPauseFctn();
  playPauseFctn();
  
});


// audioPlayer.onpause = () => {audioPlayer.onpause ? console.log('pause = true') : console.log("pause = false")}

const playPauseFctn = () => {
  if (audioPlayer.classList.contains("play")) {
    audioPlayer.classList.remove("play"),
    audioPlayer.classList.add("pause"),
    playBtn.innerHTML = `<i>${pauseIcon}</i>`,
    audioPlayer.play()
  } else {
    audioPlayer.classList.remove("pause"),
    audioPlayer.classList.add("play"),
    playBtn.innerHTML = `<i>${playIcon}</i>`,
    audioPlayer.pause()
  }
}



/** function to pay a song */
const playThisSong = (song: any) => {
  // song position for song path
  // console.log("🚀 ~ file: renderer.ts:72 ~ isAudioPlaying before playThisSong? ", isAudioPlaying);

  audioPlayer.src = `./../public/uploads/${song.path}`;
  audioPlayer.classList.add("play");
  playPauseFctn();
  // audioPlayer.classList.add('play')
  // audioPlayer.play()
  // console.log("🚀 ~ file: renderer.ts:72 ~ isAudioPlaying after playThisSong? ", isAudioPlaying);

  // if ended go to next song
  // audioPlayer.addEventListener("ended", () => {
  //   nextSong(song);
  // });
  PLAYER

};

// Next song
function nextSong(song) {
  console.log("🚀 ~ file: renderer.ts:32 ~ position_BEFORE: ", song.position)
  song['position'] += 1;
  console.log("🚀 ~ file: renderer.ts:71 ~ position_AFTER: ", song.position);

  console.log("🚀 ~ file: renderer.ts:78 ~ nextSong ~ totalTracks:", totalTracks)
  
  if (song.position > totalTracks - 1) {
    audioPlayer.pause();
  } else {
    const songs = versions.findAllSongsByAlbumID(song.album_id);
    const megaToto = songs.filter((toto) => toto["position"] === song["position"])
    playThisSong(megaToto[0])

  }

};

