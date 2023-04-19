// find all ALBUMS
const ALBUMS = versions.findAlbumsByArtist();
const containerSongsList = document.getElementById("songs-list"); // display songs names
const audioPlayer = document.getElementById("audioPlayer");

/** function to pay a song */
const playThisSong = (songPath) => {
  audioPlayer.src = `./../public/uploads/${songPath}`;
}
/** function to display album' songs */
const displayAlbumSongsNames = (album_id) => {
  containerSongsList.innerHTML = ""; // reset div before feeding it
  const ulSongs = document.createElement("ul"); // create ul element and set its attributes.
  ulSongs.setAttribute("id", "theSongList"); //   ulSongs.setAttribute("style", "padding: 4px; margin: 0;");

  const divSong = document.createElement("div"); // create div element.
  const songs = versions.findAllSongsByAlbumID(album_id);
  // console.log(songs) // songs = array d'object [{}, {}, ..., {}]
  // list all songs
  for (let i = 0; i < songs.length; i++) {
    const figcaption = document.createElement("figcaption"); // create li element.
    figcaption.innerText += `${songs[i].name} `;
    figcaption.addEventListener("click", () => playThisSong(songs[i].path));
    ulSongs.appendChild(figcaption); // append li to ul.
  }

  containerSongsList.appendChild(ulSongs); // add ul to the container.
};

/** display ALBUMS name on Homepage */
const albumContainer = document.getElementById('albumContainer');
// create ul element and set its attributes.
const ulAlbums = document.createElement('ul');
ulAlbums.setAttribute ('style', 'padding: 0; margin: 4px;');
ulAlbums.setAttribute('id', 'theAlbumList');

for ( let i = 0; i < ALBUMS.length; i++) {
    const li = document.createElement('li');	// create li element.

    li.innerHTML = `<a id="album" title="Click to open this album"
    href="#album">${ALBUMS[i].name}</a>`;	// assigning text to li using array value.
    li.setAttribute ('style', 'display: block;');	// remove the bullets.
    li.addEventListener("click", () => { displayAlbumSongsNames(ALBUMS[i].id);});

    ulAlbums.appendChild(li);		// append li to ulAlbums.
}
albumContainer.appendChild(ulAlbums);		// add ul to the albumContainer.


/** function to play next song at the end of the previous one */
// const playNextSong = () => {
  audioPlayer.addEventListener('ended',function(){
      console.log("this song is finished")
  });
// }
// audioPlayer.onplay = function () {
//   alert("The video has started to play");
// };