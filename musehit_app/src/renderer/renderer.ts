// find all albums
const albums = versions.findAlbumsByArtist();
// console.log("🚀 ~ file: renderer.ts:3 ~ albums:", albums)

const containerSongsList = document.getElementById("songs-list");
const audioPlayer = document.getElementById("audioPlayer");

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
    // console.log("🚀 ~ file: renderer.ts:68 ~ albums[i]:", albums[i])

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

/** function to pay a song */
const playThisSong = (song: any) => {
  // console.log("🚀 ~ file: renderer.ts:8 ~ playThisSong ~ song:", song);
  // song position for song path
  audioPlayer.src = `./../public/uploads/${song.path}`;
  // console.log("id?: ",song.id)

  audioPlayer.addEventListener("ended", () => {
    console.log(`this song ${song.name} is finished`);
    nextSong(song);
  });
};

// Next song
function nextSong(song) {
  console.log("🚀 ~ file: renderer.ts:32 ~ position_BEFORE: ", song.position)
  song['position'] += 1;
  console.log("🚀 ~ file: renderer.ts:71 ~ position_AFTER: ", song.position);

  console.log("🚀 ~ file: renderer.ts:78 ~ nextSong ~ totalTracks:", totalTracks)
  if (song.position > totalTracks - 1) {
    audioPlayer.pause;
  } else {
    const songs = versions.findAllSongsByAlbumID(song.album_id);
    const megaToto = songs.filter((toto) => toto["position"] === song["position"])
    playThisSong(megaToto[0])

  }

};

