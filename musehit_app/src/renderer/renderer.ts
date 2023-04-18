// find all ALBUMS
const ALBUMS = versions.findAlbumsByArtist();

/** function to display album' songs */
const displayAlbumSongsNames = (album_id) => {
  const containerSongsList = document.getElementById("songs-list"); // display songs names
  containerSongsList.innerHTML = ""; // reset div before feeding it
  const ulSongs = document.createElement("ul"); // create ul element and set its attributes.
  ulSongs.setAttribute("id", "theSongList"); //   ulSongs.setAttribute("style", "padding: 4px; margin: 0;");

  const li = document.createElement("li"); // create li element.
  const songs = versions.findAllSongsByAlbumID(album_id);
  for (let j = 0; j < songs.length; j++) {
    li.innerHTML +=
      `<a 
        id="songs_${j}" 
        href="./../public/uploads/${songs[j].path}">"${songs[j].name} ▶️ "</a>` + "<br>";
    li.setAttribute("style", "display: block;"); // remove the bullets.
  }

  ulSongs.appendChild(li); // append li to ul.

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

    li.innerHTML = `<a id="myLink" title="Click to do something"
    href="#album">${ALBUMS[i].name}</a>`;	// assigning text to li using array value.
    li.setAttribute ('style', 'display: block;');	// remove the bullets.
    li.addEventListener("click", () => { displayAlbumSongsNames(ALBUMS[i].id);});

    ulAlbums.appendChild(li);		// append li to ulAlbums.
}
albumContainer.appendChild(ulAlbums);		// add ul to the albumContainer.
