// find all albums
const albums = versions.findAlbumsByArtist();
console.log("🚀 ~ file: renderer.ts:3 ~ albums:", albums)
const containerSongsList = document.getElementById("songs-list"); // display songs names
const audioPlayer = document.getElementById("audioPlayer");

/** function to pay a song */
const playThisSong = (song, totalTracks) => {
  console.log("🚀 ~ file: renderer.ts:8 ~ playThisSong ~ song:", song);
  audioPlayer.src = `./../public/uploads/${song.path}`;
  // console.log("id?: ",song.id)

  audioPlayer.addEventListener("ended", () => {
    console.log(`this song ${song.name} is finished`);
    nextSong(song, totalTracks);
  });
};

// Next song
function nextSong({id, totalTracks}) {
  console.log("🚀 ~ file: renderer.ts:32 ~ nextSong_id:", id)
  id++;

  if (id > totalTracks - 1) {
    id = 0;
  }

  // loadSong(songs[songIndex]);

  playThisSong(id, totalTracks);
}
/** function to display songs of an album */
const displayAlbumSongsNames = ({id}) => {
  // console.log(id)
  containerSongsList.innerHTML = ""; // reset div before feeding it
  const divAllSongs = document.createElement("div"); // create ul element and set its attributes.
  divAllSongs.setAttribute("id", "theSongList"); //   divAllSongs.setAttribute("style", "padding: 4px; margin: 0;");

  const songs = versions.findAllSongsByAlbumID(id);
  const totalTracks = songs.length;
  // console.log("🚀 ~ file: renderer.ts:52 ~ displayAlbumSongsNames ~ totalTracks:", totalTracks)
  // list all songs
  for (let i = 0; i < songs.length; i++) {
    const divSong = document.createElement("div");
    divSong.innerText += `${songs[i].name} `;
    divSong.addEventListener("click", () =>
      playThisSong(songs[i], totalTracks)
    );
    divAllSongs.appendChild(divSong);
  }

  containerSongsList.appendChild(divAllSongs); // add ul to the container.
};

/** display albums name on Homepage */
const albumContainer = document.getElementById('albumContainer');
// create ul element and set its attributes.
const allAlbums = document.createElement('div');
// allAlbums.setAttribute ('style', 'padding: 0; margin: 4px;');
allAlbums.setAttribute('id', 'allAlbums');

for ( let i = 0; i < albums.length; i++) {
    const li = document.createElement('li');	// create li element.

    li.innerHTML = `<a id="album" title="Click to open this album"
    href="#album">${albums[i].name}</a>`;	// assigning text to li using array value.
    li.setAttribute ('style', 'display: block;');	// remove the bullets.
    li.addEventListener("click", () => { displayAlbumSongsNames(albums[i]);});
    console.log("🚀 ~ file: renderer.ts:68 ~ albums[i]:", albums[i])

    allAlbums.appendChild(li);		// append li to allAlbums.
}
albumContainer.appendChild(allAlbums);		// add ul to the albumContainer.


/** function to play next song at the end of the previous one */
// const playNextSong = () => {
  audioPlayer.addEventListener('ended',function(){
      console.log("this song is finished")
  });
// }
// audioPlayer.onplay = function () {
//   alert("The video has started to play");
// };